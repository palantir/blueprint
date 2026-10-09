/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

/**
 * Generates an Intent's scale (Primary, Success, Warning, Danger) from one color: blend the two nearest
 * reference scales, take the seed's hue and chroma, ease the lightness toward the page background, place
 * the seed at the solid step, and back-solve the translucent steps over the background.
 *
 * The reference scales are Blueprint's own hue scales (`scale.tokens.json`, both themes). Each reference
 * holds 12 slots, Blueprint steps 1–10, 12 and 13 (ADR 0004); the solid active step (11) is computed.
 */

// Storybook-only dependencies live in the root devDependencies.
/* eslint-disable import/no-extraneous-dependencies */
import BezierEasing from "bezier-easing";
import Color from "colorjs.io";
/* eslint-enable import/no-extraneous-dependencies */

import lightScaleTokens from "../../packages/core/src/design-tokens/tokens/base/scale.tokens.json";
import darkScaleTokens from "../../packages/core/src/design-tokens/tokens/themes/dark/scale.tokens.json";

type Appearance = "light" | "dark";
type Scale12 = Color[];

/** Page backgrounds the translucent steps are solved against: Content (light) and Base (dark). */
const BACKGROUNDS: Record<Appearance, string> = { dark: "#1c2127", light: "#ffffff" };

/** Selectors that receive each theme's scale; doubled to win over the token stylesheets. */
const THEME_SELECTORS: Record<Appearance, string> = {
    dark: '.bp6-dark.bp6-dark, [data-bp-color-scheme="dark"][data-bp-color-scheme="dark"]',
    light: ":root:root",
};

const REFERENCE_HUES = ["gray", "blue", "green", "orange", "red"] as const;

/** Blueprint steps held by a reference scale's 12 slots. */
const REFERENCE_STEPS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13] as const;

const REFERENCE_SCALES: Record<Appearance, Record<string, Scale12>> = {
    dark: loadReferenceScales(darkScaleTokens.scale, BACKGROUNDS.dark),
    light: loadReferenceScales(lightScaleTokens.scale, BACKGROUNDS.light),
};

const DARK_MODE_EASING: [number, number, number, number] = [1, 0, 1, 0];
const LIGHT_MODE_EASING: [number, number, number, number] = [0, 2, 0, 2];

export const THEME_INTENTS = ["primary", "success", "warning", "danger"] as const;
export type ThemeIntent = (typeof THEME_INTENTS)[number];
export type ThemeColors = Partial<Record<ThemeIntent, string>>;

/**
 * Returns a stylesheet that sets every `--bp-scale-{intent}-*` value for both themes, for each Intent
 * that has a color. An Intent whose color cannot be parsed (e.g. while typing) keeps its default scale.
 */
export function generateThemeStylesheet(colors: ThemeColors): string {
    return (["light", "dark"] as const)
        .map(appearance => {
            const declarations = THEME_INTENTS.flatMap(intent => {
                const seed = colors[intent];
                if (!seed) {
                    return [];
                }
                try {
                    return Object.entries(generateIntentScale(intent, seed, appearance));
                } catch {
                    return [];
                }
            })
                .map(([name, value]) => `  ${name}: ${value};`)
                .join("\n");
            return `${THEME_SELECTORS[appearance]} {\n${declarations}\n}`;
        })
        .join("\n");
}

/** Maps a seed color to an Intent's scale custom properties for one theme. */
export function generateIntentScale(
    intent: ThemeIntent,
    seedColor: string,
    appearance: Appearance,
): Record<string, string> {
    const background = new Color(BACKGROUNDS[appearance]).to("oklch");
    const seed = new Color(seedColor).to("oklch");
    // The seed's alpha is ignored: a translucent solid step would let the page show through.
    seed.alpha = 1;
    const seedHex = seed.to("srgb").toString({ collapse: false, format: "hex" });
    // Pure white or black has no hue to follow, so the gray scale is used instead.
    const scale =
        seedHex === "#000000" || seedHex === "#ffffff"
            ? REFERENCE_SCALES[appearance].gray.map(color => color.clone())
            : getScaleFromColor(seed, REFERENCE_SCALES[appearance], background);

    const [solid, apcaText] = getStep9Colors(scale, seed);
    scale[8] = solid;
    scale[9] = getButtonHoverColor(solid, [scale]);
    // Blueprint's solid active step: one more hover step from the hover color.
    const solidActive = getButtonHoverColor(scale[9], [scale]);
    const solidText = ensureSolidTextContrast(apcaText, [scale[8], scale[9], solidActive]);

    // Limit saturation of the text colors
    for (const index of [10, 11]) {
        scale[index].coords[1] = Math.min(Math.max(scale[8].coords[1]!, scale[7].coords[1]!), scale[index].coords[1]!);
    }

    const hex = (color: Color) => color.to("srgb").toString({ format: "hex" });
    const backgroundHex = hex(background);
    const alpha = (index: number) => getAlphaColorSrgb(hex(scale[index]), backgroundHex);

    return {
        [`--bp-scale-${intent}-8`]: hex(scale[7]),
        [`--bp-scale-${intent}-9`]: hex(scale[8]),
        [`--bp-scale-${intent}-10`]: hex(scale[9]),
        [`--bp-scale-${intent}-11`]: hex(solidActive),
        [`--bp-scale-${intent}-12`]: hex(scale[10]),
        [`--bp-scale-${intent}-13`]: hex(scale[11]),
        [`--bp-scale-${intent}-alpha-3`]: alpha(2),
        [`--bp-scale-${intent}-alpha-4`]: alpha(3),
        [`--bp-scale-${intent}-alpha-5`]: alpha(4),
        [`--bp-scale-${intent}-alpha-7`]: alpha(6),
        [`--bp-scale-${intent}-alpha-8`]: alpha(7),
        [`--bp-scale-${intent}-solid-text`]: hex(solidText),
        [`--bp-scale-${intent}-indicator`]: hex(scale[8]),
        // Focus is the low-contrast text step at 75%, as for Blueprint's blue scale.
        [`--bp-scale-${intent}-focus`]: withAlpha(hex(scale[10]), 0.75),
    };
}

/**
 * Builds each hue's opaque reference from its tokens: a step's opaque value, else its alpha value composited
 * over the background. Hues have no background steps (1, 2), so they take gray's; a missing step 6
 * (Intent subtle border, Known issue #33) is the OKLCH midpoint of steps 5 and 7 (H17).
 */
function loadReferenceScales(tokens: Record<string, unknown>, backgroundColor: string): Record<string, Scale12> {
    const background = new Color(backgroundColor);
    const stepColor = (hue: string, step: number): Color | undefined => {
        const opaque = getTokenValue(tokens[hue], step);
        if (opaque !== undefined) {
            return new Color(opaque).to("oklch");
        }
        const translucent = getTokenValue((tokens[hue] as Record<string, unknown> | undefined)?.alpha, step);
        if (translucent === undefined) {
            return undefined;
        }
        const color = new Color(translucent);
        const alpha = Number(color.alpha);
        color.alpha = 1;
        return new Color(Color.mix(background, color, alpha, { space: "srgb" })).to("oklch");
    };

    return Object.fromEntries(
        REFERENCE_HUES.map(hue => {
            const steps = new Map<number, Color | undefined>();
            for (const step of REFERENCE_STEPS) {
                steps.set(step, stepColor(hue, step) ?? (step <= 2 ? stepColor("gray", step) : undefined));
            }
            if (steps.get(6) === undefined) {
                steps.set(6, new Color(Color.mix(steps.get(5)!, steps.get(7)!, 0.5, { space: "oklch" })).to("oklch"));
            }
            return [hue, REFERENCE_STEPS.map(step => steps.get(step)!)];
        }),
    );
}

function getTokenValue(group: unknown, step: number): string | undefined {
    const value = (group as Record<string, { $value?: unknown } | undefined> | undefined)?.[step]?.$value;
    return typeof value === "string" ? value : undefined;
}

function getStep9Colors(scale: Scale12, seed: Color): [Color, Color] {
    // A seed close to the page background (white on white, black on black) falls back to the scale's own step 9.
    if (seed.deltaEOK(scale[0]) * 100 < 25) {
        return [scale[8], getTextColor(scale[8])];
    }
    return [seed, getTextColor(seed)];
}

function getButtonHoverColor(source: Color, scales: Scale12[]): Color {
    const [L, C] = source.coords as [number, number, number];
    // colorjs.io uses null for a powerless hue (grays); keep it null so the color stays valid.
    const H = source.coords[2];
    const newL = L > 0.4 ? L - 0.03 / (L + 0.1) : L + 0.03 / (L + 0.1);
    const newC = L > 0.4 && H != null && !Number.isNaN(H) ? C * 0.93 : C;
    const hover = new Color("oklch", [newL, newC, H]);

    // The closest in-scale color donates chroma and hue.
    let closest = hover;
    let minDistance = Infinity;
    for (const scale of scales) {
        for (const color of scale) {
            const distance = hover.deltaEOK(color);
            if (distance < minDistance) {
                minDistance = distance;
                closest = color;
            }
        }
    }
    hover.coords[1] = closest.coords[1];
    hover.coords[2] = closest.coords[2];
    return hover;
}

function getScaleFromColor(source: Color, scales: Record<string, Scale12>, background: Color): Scale12 {
    const allColors = Object.entries(scales).flatMap(([scaleName, referenceScale]) =>
        referenceScale.map(color => ({ color, distance: source.deltaEOK(color), scale: scaleName })),
    );
    allColors.sort((left, right) => left.distance - right.distance);

    // One entry per scale, nearest first.
    const [colorA, colorB] = allColors.filter(
        (entry, i, arr) => i === arr.findIndex(value => value.scale === entry.scale),
    );

    // Mix A and B in proportion to where the source projects onto the A–B segment (an acute triangle);
    // when either angle is obtuse, B cannot bring the mix closer and the ratio is 0. A source that is a
    // reference color (e.g. a default seed) lies on A, so the ratio is 0 too.
    const a = colorB.distance;
    const b = colorA.distance;
    const c = colorA.color.deltaEOK(colorB.color);
    const cosA = (b ** 2 + c ** 2 - a ** 2) / (2 * b * c);
    const cosB = (a ** 2 + c ** 2 - b ** 2) / (2 * a * c);
    const tanC1 = cosA / Math.sin(Math.acos(cosA));
    const tanC2 = cosB / Math.sin(Math.acos(cosB));
    const ratio = b === 0 ? 0 : Math.max(0, tanC1 / tanC2) * 0.5;

    const scaleA = scales[colorA.scale];
    const scaleB = scales[colorB.scale];
    const scale = scaleA.map((color, i) => new Color(Color.mix(color, scaleB[i], ratio)).to("oklch"));

    const baseColor = scale.slice().sort((left, right) => source.deltaEOK(left) - source.deltaEOK(right))[0];
    // Both grays: 0 / 0 would make every chroma NaN.
    const ratioC = baseColor.coords[1]! > 0 ? source.coords[1]! / baseColor.coords[1]! : 0;

    // Take the source's hue and scale chroma toward it.
    for (const color of scale) {
        color.coords[1] = Math.min(source.coords[1]! * 1.5, color.coords[1]! * ratioC);
        color.coords[2] = source.coords[2];
    }

    const backgroundL = Math.max(0, Math.min(1, background.coords[0]!));

    // Light mode
    if (scale[0].coords[0]! > 0.5) {
        // White is added as the first "step" of the light scale, then removed.
        const lightLightness = transposeProgressionStart(
            backgroundL,
            [1, ...scale.map(color => color.coords[0]!)],
            LIGHT_MODE_EASING,
        );
        lightLightness.shift();
        lightLightness.forEach((value, i) => (scale[i].coords[0] = value));
        return scale;
    }

    // Dark mode: a background lighter than step 1 gradually moves the easing toward linear.
    const ease = [...DARK_MODE_EASING] as [number, number, number, number];
    const ratioL = backgroundL / scale[0].coords[0]!;
    if (ratioL > 1) {
        const maxRatio = 1.5;
        for (let i = 0; i < ease.length; i++) {
            const metaRatio = (ratioL - 1) * (maxRatio / (maxRatio - 1));
            ease[i] = ratioL > maxRatio ? 0 : Math.max(0, ease[i] * (1 - metaRatio));
        }
    }
    const lightness = transposeProgressionStart(
        background.coords[0]!,
        scale.map(color => color.coords[0]!),
        ease,
    );
    lightness.forEach((value, i) => (scale[i].coords[0] = value));
    return scale;
}

function getTextColor(background: Color): Color {
    const white = new Color("oklch", [1, 0, 0]);
    if (Math.abs(white.contrastAPCA(background)) < 40) {
        const [, C] = background.coords as [number, number, number];
        const H = background.coords[2];
        // Without a hue, any chroma would read as red (hue 0), so a gray background gets a gray text color.
        return new Color("oklch", [0.25, H == null ? 0 : Math.max(0.08 * C, 0.04), H]);
    }
    return white;
}

/**
 * Blueprint requires WCAG 2.2 AA (4.5:1) for the Solid text color on all three solid steps. `getTextColor` picks
 * the text by APCA on step 9 only, so when that choice fails AA and the other candidate does better, switch.
 */
function ensureSolidTextContrast(apcaText: Color, solids: Color[]): Color {
    const minContrast = (text: Color) => Math.min(...solids.map(solid => text.contrastWCAG21(solid)));
    if (minContrast(apcaText) >= 4.5) {
        return apcaText;
    }
    const white = new Color("oklch", [1, 0, 0]);
    const isWhite = apcaText.deltaEOK(white) < 0.01;
    const H = solids[0].coords[2];
    const dark = new Color("oklch", [0.25, H == null ? 0 : Math.max(0.08 * solids[0].coords[1]!, 0.04), H]);
    const other = isWhite ? dark : white;
    return minContrast(other) > minContrast(apcaText) ? other : apcaText;
}

function transposeProgressionStart(to: number, arr: number[], curve: [number, number, number, number]): number[] {
    const ease = BezierEasing(...curve);
    const lastIndex = arr.length - 1;
    const diff = arr[0] - to;
    return arr.map((n, i) => n - diff * ease(1 - i / lastIndex));
}

/**
 * The most transparent color that, composited over the background, reproduces the target (sRGB at 8-bit
 * precision).
 */
function getAlphaColorSrgb(targetColor: string, backgroundColor: string): string {
    const precision = 255;
    const [tr, tg, tb] = new Color(targetColor).to("srgb").coords.map(c => Math.round(c! * precision));
    const [br, bg, bb] = new Color(backgroundColor).to("srgb").coords.map(c => Math.round(c! * precision));

    // Lighten the background when any channel of the target is lighter, otherwise darken it.
    const desired = tr > br || tg > bg || tb > bb ? precision : 0;
    const alphaR = (tr - br) / (desired - br);
    const alphaG = (tg - bg) / (desired - bg);
    const alphaB = (tb - bb) / (desired - bb);

    if (alphaR === alphaG && alphaG === alphaB) {
        const v = desired / precision;
        return new Color("srgb", [v, v, v], alphaR).toString({ format: "hex" });
    }

    const clamp = (n: number, max: number) => (Number.isNaN(n) ? 0 : Math.min(max, Math.max(0, n)));
    const A = clamp(Math.ceil(Math.max(alphaR, alphaG, alphaB) * precision), precision) / precision;
    const solve = (target: number, back: number) => Math.ceil(clamp(((back * (1 - A) - target) / A) * -1, precision));
    let [R, G, B] = [solve(tr, br), solve(tg, bg), solve(tb, bb)];

    // Correct rounding the way browsers blend each channel.
    const blend = (fg: number, back: number) => Math.round(back * (1 - A)) + Math.round(fg * A);
    const correct = (value: number, target: number, back: number) => {
        const blended = blend(value, back);
        const needsCorrection =
            desired === 0 ? target <= back && target !== blended : target >= back && target !== blended;
        return needsCorrection ? (target > blended ? value + 1 : value - 1) : value;
    };
    [R, G, B] = [correct(R, tr, br), correct(G, tg, bg), correct(B, tb, bb)];

    return new Color("srgb", [R / precision, G / precision, B / precision], A).toString({ format: "hex" });
}

function withAlpha(hex: string, alpha: number): string {
    const color = new Color(hex);
    color.alpha = alpha;
    return color.toString({ format: "hex" });
}
