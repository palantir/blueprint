/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

/* eslint-disable sort-keys */

/**
 * @module paletteRamp
 * @layer Infrastructure
 *
 * Generates the 100–900 palette ramp from the BP6 1–5 color scales.
 *
 * Every ramp shares one target lightness curve: OKLCH lightness evenly spaced from
 * `lightnessTop` (step 100) to `lightnessBottom` (step 900). Each BP6 chromatic color is
 * placed on the step whose target lightness it best matches, and is reused verbatim there.
 * The remaining steps follow the target curve, bent smoothly so the ramp passes through the
 * BP6 colors, with hue and chroma interpolated from those colors.
 *
 * The BP6 grays (dark-gray, gray, light-gray) fold into a single `gray` ramp. A legacy gray is
 * reused at a step only when it sits within `grayTolerance` of that step's target lightness;
 * all other gray steps are generated.
 *
 * This module is browser-safe so the Storybook playground can run it live.
 */

import { clampChroma, displayable, formatHex, oklch, wcagContrast } from "culori";

// -- Types --------------------------------------------------------------------

/** Steps of the expanded ramp, from lightest (100) to darkest (900). */
export const RAMP_STEPS = [100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

export type RampStep = (typeof RAMP_STEPS)[number];

/** Shades of a BP6 color scale, from darkest (1) to lightest (5). */
export const LEGACY_SHADES = [1, 2, 3, 4, 5] as const;

export type LegacyShade = (typeof LEGACY_SHADES)[number];

/** A BP6 color scale: hex values keyed by shade. */
export type LegacyScale = Readonly<Record<LegacyShade, string>>;

/** BP6 color scales keyed by token family name (e.g. `"blue"`, `"light-gray"`). */
export type LegacyPalette = Readonly<Record<string, LegacyScale>>;

/** OKLCH lightness, chroma, and hue (degrees). */
export interface OklchValue {
    readonly l: number;
    readonly c: number;
    readonly h: number;
}

/** A single BP6 color and its position in the ramp, if it has one. */
export interface LegacyColor {
    /** Token family name, e.g. `"blue"` or `"light-gray"`. */
    readonly family: string;
    readonly shade: LegacyShade;
    readonly hex: string;
    readonly oklch: OklchValue;
    /** The ramp step that reuses this color verbatim. Undefined for grays left out of the ramp. */
    readonly step: RampStep | undefined;
}

/** One step of a generated ramp. */
export interface RampSwatch {
    readonly step: RampStep;
    readonly hex: string;
    readonly oklch: OklchValue;
    /** The BP6 color reused verbatim at this step. Undefined for generated steps. */
    readonly source: LegacyColor | undefined;
}

/** The expanded ramp for one family, plus the BP6 colors it was built from. */
export interface PaletteRamp {
    /** Ramp family name, e.g. `"blue"` or `"gray"`. */
    readonly family: string;
    readonly swatches: readonly RampSwatch[];
    /** BP6 colors this ramp was built from, lightest first. */
    readonly legacy: readonly LegacyColor[];
}

/** Tuning parameters for ramp generation. */
export interface PaletteRampConfig {
    /** Target OKLCH lightness of step 100. */
    readonly lightnessTop: number;
    /** Target OKLCH lightness of step 900. */
    readonly lightnessBottom: number;
    /** Maximum lightness difference for reusing a BP6 gray verbatim at a step. */
    readonly grayTolerance: number;
    /**
     * Chroma at step 100, as a fraction of the lightest BP6 color's chroma, when step 100 is lighter
     * than every BP6 color in the family. Generated tints are also never more saturated, relative to
     * the sRGB gamut, than that BP6 color.
     */
    readonly tintTaper: number;
    /** The same as `tintTaper`, for step 900 and the darkest BP6 color. */
    readonly shadeTaper: number;
}

// -- Constants ----------------------------------------------------------------

export const DEFAULT_RAMP_CONFIG: PaletteRampConfig = {
    lightnessTop: 0.95,
    lightnessBottom: 0.25,
    grayTolerance: 0.02,
    tintTaper: 0.45,
    shadeTaper: 0.75,
};

/** BP6 chromatic families, in `palette.tokens.json` order. */
export const CHROMATIC_FAMILIES = [
    "blue",
    "green",
    "orange",
    "red",
    "vermilion",
    "rose",
    "violet",
    "indigo",
    "cerulean",
    "turquoise",
    "forest",
    "lime",
    "gold",
    "sepia",
] as const;

/** BP6 gray families, lightest first. These fold into the single `gray` ramp. */
export const GRAY_FAMILIES = ["light-gray", "gray", "dark-gray"] as const;

/** Family name of the combined gray ramp. */
export const GRAY_RAMP_FAMILY = "gray";

/** Decimal places kept for OKLCH channels before converting to hex, so output is stable. */
const OKLCH_PRECISION = 4;

/** A chroma far outside the sRGB gamut, clamped down to find the maximum chroma at a given L and H. */
const OUT_OF_GAMUT_CHROMA = 0.5;

// -- Color helpers ------------------------------------------------------------

/** Converts a hex color to OKLCH, treating a missing hue (achromatic colors) as 0. */
export const toOklch = (hex: string): OklchValue => {
    const color = oklch(hex);
    if (color === undefined) {
        throw new Error(`Invalid color: ${hex}`);
    }
    return { c: color.c, h: color.h ?? 0, l: color.l };
};

/** WCAG 2 contrast ratio between two colors. */
export const contrastRatio = (a: string, b: string): number => wcagContrast(a, b);

/** Formats an OKLCH value as a CSS `oklch()` string. */
export const formatOklch = ({ l, c, h }: OklchValue): string =>
    `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(1)})`;

/** The largest sRGB-displayable chroma at the given lightness and hue. */
const maxChroma = (l: number, h: number): number =>
    clampChroma({ c: OUT_OF_GAMUT_CHROMA, h, l, mode: "oklch" }, "oklch").c;

/** Chroma as a fraction of the sRGB maximum at the color's lightness and hue. */
const relativeChroma = ({ l, c, h }: OklchValue): number => {
    const max = maxChroma(l, h);
    return max > 0 ? c / max : 0;
};

const round = (value: number): number => Number(value.toFixed(OKLCH_PRECISION));

/** Rounds, gamut-clamps, and formats a generated color. */
const finalizeColor = (l: number, c: number, h: number): { hex: string; oklch: OklchValue } => {
    const normalizedHue = ((h % 360) + 360) % 360;
    const clamped = clampChroma({ c: round(c), h: round(normalizedHue), l: round(l), mode: "oklch" }, "oklch");
    if (!displayable(clamped)) {
        throw new Error(`Generated color is outside sRGB: ${formatOklch({ c, h, l })}`);
    }
    return { hex: formatHex(clamped), oklch: { c: clamped.c, h: clamped.h ?? normalizedHue, l: clamped.l } };
};

/**
 * Shifts each hue by a multiple of 360 so consecutive hues never jump by more than 180
 * degrees, making them safe to interpolate (e.g. 359° followed by 2° becomes 359°, 362°).
 */
const unwrapHues = (hues: readonly number[]): number[] =>
    hues.reduce<number[]>((unwrapped, hue, index) => {
        if (index === 0) {
            return [hue];
        }
        const previous = unwrapped[index - 1];
        const turns = Math.round((previous - hue) / 360);
        return [...unwrapped, hue + turns * 360];
    }, []);

// -- Interpolation ------------------------------------------------------------

/**
 * Monotone piecewise cubic Hermite interpolation (Fritsch–Carlson) over unevenly spaced,
 * strictly increasing `xs`. It never overshoots between samples, so a monotonic series
 * stays monotonic. Outside the sampled range it holds the nearest end value.
 */
export const createMonotoneInterpolator = (xs: readonly number[], ys: readonly number[]) => {
    const count = xs.length;
    if (count === 0) {
        throw new Error("Interpolation requires at least one sample");
    }
    if (count === 1) {
        return () => ys[0];
    }

    const widths = xs.slice(1).map((x, i) => x - xs[i]);
    const slopes = ys.slice(1).map((y, i) => (y - ys[i]) / widths[i]);
    const tangents = xs.map((_x, i) => {
        if (i === 0) {
            return slopes[0];
        }
        if (i === count - 1) {
            return slopes[count - 2];
        }
        const before = slopes[i - 1];
        const after = slopes[i];
        if (before * after <= 0) {
            return 0;
        }
        const w1 = 2 * widths[i] + widths[i - 1];
        const w2 = widths[i] + 2 * widths[i - 1];
        return (w1 + w2) / (w1 / before + w2 / after);
    });

    return (x: number): number => {
        if (x <= xs[0]) {
            return ys[0];
        }
        if (x >= xs[count - 1]) {
            return ys[count - 1];
        }
        let i = 0;
        while (x > xs[i + 1]) {
            i++;
        }
        const t = (x - xs[i]) / widths[i];
        const t2 = t * t;
        const t3 = t2 * t;
        return (
            (2 * t3 - 3 * t2 + 1) * ys[i] +
            (t3 - 2 * t2 + t) * widths[i] * tangents[i] +
            (-2 * t3 + 3 * t2) * ys[i + 1] +
            (t3 - t2) * widths[i] * tangents[i + 1]
        );
    };
};

// -- Placement ----------------------------------------------------------------

/** Target OKLCH lightness of a step on the shared, evenly spaced curve. */
export const targetLightness = (step: number, config: PaletteRampConfig = DEFAULT_RAMP_CONFIG): number => {
    const progress = (step - RAMP_STEPS[0]) / (RAMP_STEPS[RAMP_STEPS.length - 1] - RAMP_STEPS[0]);
    return config.lightnessTop - (config.lightnessTop - config.lightnessBottom) * progress;
};

/**
 * Assigns colors (sorted lightest first) to distinct ramp steps, preserving their order and
 * minimizing the summed squared distance from each step's target lightness.
 * Returns the chosen step for each color.
 */
const assignSteps = (lightnesses: readonly number[], config: PaletteRampConfig): RampStep[] => {
    const targets = RAMP_STEPS.map(step => targetLightness(step, config));
    let best: { cost: number; indices: number[] } = { cost: Infinity, indices: [] };

    const search = (colorIndex: number, firstStepIndex: number, indices: number[], cost: number) => {
        if (cost >= best.cost) {
            return;
        }
        if (colorIndex === lightnesses.length) {
            best = { cost, indices };
            return;
        }
        const lastStepIndex = RAMP_STEPS.length - (lightnesses.length - colorIndex);
        for (let stepIndex = firstStepIndex; stepIndex <= lastStepIndex; stepIndex++) {
            const error = (lightnesses[colorIndex] - targets[stepIndex]) ** 2;
            search(colorIndex + 1, stepIndex + 1, [...indices, stepIndex], cost + error);
        }
    };

    search(0, 0, [], 0);
    return best.indices.map(index => RAMP_STEPS[index]);
};

/**
 * Picks the grays (sorted lightest first) to reuse verbatim: for each step, the closest gray
 * within `grayTolerance` of its target lightness. A gray is used at most once, and picks never
 * cross (a lighter gray always lands on a lighter step).
 */
const adoptGrays = (lightnesses: readonly number[], config: PaletteRampConfig): Array<RampStep | undefined> => {
    const candidates = RAMP_STEPS.flatMap(step =>
        lightnesses.map((lightness, colorIndex) => ({
            colorIndex,
            distance: Math.abs(lightness - targetLightness(step, config)),
            step,
        })),
    )
        .filter(candidate => candidate.distance <= config.grayTolerance)
        .sort((a, b) => a.distance - b.distance);

    const steps: Array<RampStep | undefined> = lightnesses.map(() => undefined);
    for (const { colorIndex, step } of candidates) {
        const stepTaken = steps.includes(step);
        const crosses = steps.some(
            (other, otherIndex) => other !== undefined && (otherIndex < colorIndex ? other > step : other < step),
        );
        if (steps[colorIndex] === undefined && !stepTaken && !crosses) {
            steps[colorIndex] = step;
        }
    }
    return steps;
};

// -- Generation ---------------------------------------------------------------

const isAnchor = (color: LegacyColor): color is LegacyColor & { readonly step: RampStep } => color.step !== undefined;

/**
 * Builds one ramp. `legacy` holds every BP6 color of the family (lightest first); those with a
 * `step` are reused verbatim, and all of them inform the hue and chroma of generated steps.
 */
const buildRamp = (family: string, legacy: readonly LegacyColor[], config: PaletteRampConfig): PaletteRamp => {
    const anchors = legacy.filter(isAnchor);
    const firstStep = RAMP_STEPS[0];
    const lastStep = RAMP_STEPS[RAMP_STEPS.length - 1];

    // Lightness: the target curve plus each anchor's offset from it, blended smoothly between
    // anchors and easing back to the target curve at the ends of the ramp.
    const offsetSamples = [
        ...(anchors.some(color => color.step === firstStep) ? [] : [{ step: firstStep, offset: 0 }]),
        ...anchors.map(color => ({ step: color.step, offset: color.oklch.l - targetLightness(color.step, config) })),
        ...(anchors.some(color => color.step === lastStep) ? [] : [{ step: lastStep, offset: 0 }]),
    ];
    const offsetAt = createMonotoneInterpolator(
        offsetSamples.map(sample => sample.step),
        offsetSamples.map(sample => sample.offset),
    );

    // Hue and chroma are functions of lightness, sampled from every BP6 color in the family.
    const byLightness = [...legacy].reverse();
    const lightnesses = byLightness.map(color => color.oklch.l);
    const hueAt = createMonotoneInterpolator(lightnesses, unwrapHues(byLightness.map(color => color.oklch.h)));
    const relativeChromaAt = createMonotoneInterpolator(
        lightnesses,
        byLightness.map(color => relativeChroma(color.oklch)),
    );
    const lightest = legacy[0].oklch;
    const darkest = legacy[legacy.length - 1].oklch;

    /**
     * Upper bound on generated chroma. Between BP6 colors it is the more saturated neighbor; past the
     * lightest or darkest BP6 color it is that color's chroma, easing toward the tint or shade taper
     * at the end of the ramp.
     */
    const chromaCapAt = (l: number): number => {
        if (l > lightest.l) {
            const progress = Math.min(1, (l - lightest.l) / Math.max(1e-6, config.lightnessTop - lightest.l));
            return lightest.c * (1 + (config.tintTaper - 1) * progress);
        }
        if (l < darkest.l) {
            const progress = Math.min(1, (darkest.l - l) / Math.max(1e-6, darkest.l - config.lightnessBottom));
            return darkest.c * (1 + (config.shadeTaper - 1) * progress);
        }
        const lighter = legacy.filter(color => color.oklch.l >= l).at(-1);
        const darker = legacy.find(color => color.oklch.l <= l);
        return Math.max(lighter?.oklch.c ?? 0, darker?.oklch.c ?? 0);
    };

    const swatches = RAMP_STEPS.map((step): RampSwatch => {
        const source = anchors.find(color => color.step === step);
        if (source !== undefined) {
            return { hex: source.hex, oklch: source.oklch, source, step };
        }
        const l = targetLightness(step, config) + offsetAt(step);
        const h = hueAt(l);
        const c = Math.min(relativeChromaAt(l) * maxChroma(l, h), chromaCapAt(l));
        return { ...finalizeColor(l, c, h), source: undefined, step };
    });

    return { family, legacy, swatches };
};

/** Reads a family's BP6 colors, lightest first. */
const readLegacyFamily = (palette: LegacyPalette, family: string): LegacyColor[] => {
    const scale = palette[family];
    if (scale === undefined) {
        throw new Error(`Missing BP6 color family: ${family}`);
    }
    return [...LEGACY_SHADES].reverse().map(shade => {
        const hex = scale[shade].toLowerCase();
        return { family, hex, oklch: toOklch(hex), shade, step: undefined };
    });
};

/** Generates the 100–900 ramp for every BP6 chromatic family plus the combined gray ramp. */
export const generatePaletteRamps = (
    palette: LegacyPalette,
    config: PaletteRampConfig = DEFAULT_RAMP_CONFIG,
): PaletteRamp[] => {
    const chromatic = CHROMATIC_FAMILIES.map(family => {
        const legacy = readLegacyFamily(palette, family);
        const steps = assignSteps(
            legacy.map(color => color.oklch.l),
            config,
        );
        return buildRamp(
            family,
            legacy.map((color, index) => ({ ...color, step: steps[index] })),
            config,
        );
    });

    const grays = GRAY_FAMILIES.flatMap(family => readLegacyFamily(palette, family)).sort(
        (a, b) => b.oklch.l - a.oklch.l,
    );
    const graySteps = adoptGrays(
        grays.map(color => color.oklch.l),
        config,
    );
    const gray = buildRamp(
        GRAY_RAMP_FAMILY,
        grays.map((color, index) => ({ ...color, step: graySteps[index] })),
        config,
    );

    return [...chromatic, gray];
};

// -- Legacy palette sources ---------------------------------------------------

/** Token path of a BP6 color, e.g. `"palette.light-gray.4"`. */
export const legacyTokenPath = ({ family, shade }: Pick<LegacyColor, "family" | "shade">): string =>
    `palette.${family}.${shade}`;

/** BP6 Sass variable name of a color, e.g. `"$light-gray4"`. */
export const legacySassName = ({ family, shade }: Pick<LegacyColor, "family" | "shade">): string =>
    `$${family}${shade}`;

/** Reads the BP6 scales from the parsed contents of `tokens/base/palette.tokens.json`. */
export const legacyPaletteFromTokens = (tokens: unknown): LegacyPalette => {
    const palette = (tokens as { palette?: Record<string, unknown> }).palette;
    if (palette === undefined) {
        throw new Error("Expected a top-level `palette` group");
    }
    return Object.fromEntries(
        [...CHROMATIC_FAMILIES, ...GRAY_FAMILIES].map(family => {
            const group = palette[family] as Record<string, { $value?: unknown }> | undefined;
            const scale = Object.fromEntries(
                LEGACY_SHADES.map(shade => {
                    const value = group?.[shade]?.$value;
                    if (typeof value !== "string") {
                        throw new Error(`Missing BP6 color: palette.${family}.${shade}`);
                    }
                    return [shade, value];
                }),
            );
            return [family, scale as unknown as LegacyScale];
        }),
    );
};

/**
 * Reads the BP6 scales from the `Colors` constants of `@blueprintjs/colors`
 * (keys such as `BLUE5` and `LIGHT_GRAY4`).
 */
export const legacyPaletteFromConstants = (colors: Readonly<Record<string, string>>): LegacyPalette =>
    Object.fromEntries(
        [...CHROMATIC_FAMILIES, ...GRAY_FAMILIES].map(family => {
            const prefix = family.toUpperCase().replace(/-/g, "_");
            const scale = Object.fromEntries(
                LEGACY_SHADES.map(shade => {
                    const value = colors[`${prefix}${shade}`];
                    if (value === undefined) {
                        throw new Error(`Missing BP6 color: ${prefix}${shade}`);
                    }
                    return [shade, value];
                }),
            );
            return [family, scale as unknown as LegacyScale];
        }),
    );

// -- Token output -------------------------------------------------------------

/** A DTCG color token as written to the ramp token file. */
export interface RampToken {
    readonly $value: string;
    readonly $description: string;
}

/**
 * Converts ramps to the DTCG structure of `tokens/base/palette/ramp.tokens.json`. Steps that
 * reuse a BP6 color reference its token, so the BP6 file stays the single source for those values.
 */
export const toRampTokens = (ramps: readonly PaletteRamp[]) => ({
    palette: {
        $type: "color",
        ...Object.fromEntries(
            ramps.map(ramp => [
                ramp.family,
                Object.fromEntries(
                    ramp.swatches.map((swatch): [string, RampToken] => [String(swatch.step), toRampToken(swatch)]),
                ),
            ]),
        ),
    },
});

const toRampToken = ({ hex, oklch: value, source }: RampSwatch): RampToken =>
    source === undefined
        ? { $value: hex, $description: `Generated: ${formatOklch(value)}` }
        : {
              $value: `{${legacyTokenPath(source)}}`,
              $description: `Same as --bp-${legacyTokenPath(source).replace(/\./g, "-")}`,
          };
