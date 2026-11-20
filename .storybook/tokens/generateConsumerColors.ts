/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

/**
 * @module generateConsumerColors
 * @layer Domain
 * Keeps a consumer's chosen fill intact while validating the colors around it.
 * @invariants
 * Rest preserves the normalized input; interaction states reference the completed palette.
 * Checks use final eight-bit sRGB colors.
 */

// eslint-disable-next-line import/no-extraneous-dependencies -- Storybook uses the root Culori devDependency.
import { converter, formatHex, type Oklch, parseHex, wcagContrast } from "culori";

// -- Types --------------------------------------------------------------------

type Direction = "darker" | "lighter";
type State = "rest" | "hover" | "selected";

interface PaletteStop {
    color: string;
    isAnchor: boolean;
    stop: number;
}

interface StateSequence extends Record<State, string> {
    direction: Direction;
    distance: number;
    foreground: string;
    stops: Record<State, number>;
}

export interface ConsumerColors {
    status: "generated";
    surface: string;
    seed: Oklch;
    ramp: PaletteStop[];
    solid: Record<State, string> & { foreground: string; border: string | null; stops: Record<State, number> };
    text: string;
    subtle: { background: string; foreground: string };
    audit: {
        direction: Direction;
        textContrast: Record<State, number>;
        paletteSpacingPower: number;
        endpointRange: number;
        stateContrast: { restToHover: number; hoverToSelected: number };
        stateDistance: { restToHover: number; hoverToSelected: number };
        boundaryContrast: number | null;
        textOnSurfaceContrast: number;
        subtleTextContrast: number;
    };
}

type GenerationResult = ConsumerColors | { status: "invalid-input" | "infeasible"; reason: string };

// -- Policy -------------------------------------------------------------------

// These state thresholds are review heuristics, not WCAG requirements or fitted Blueprint values.
export const consumerColorPolicy = {
    boundaryContrast: 3,
    chromaExponent: 0.8,
    darkerPreference: 0.015,
    endpointChromaRetention: 0.25,
    endpointLightnessRanges: [
        [0.98, 0.12],
        [0.985, 0.1],
        [0.99, 0.08],
        [0.995, 0.06],
    ],
    paletteSpacingPowers: [1, 1.25, 1.5, 2],
    stateContrast: 1.15,
    stateDistance: 0.04,
    textContrast: 4.5,
} as const;

// Normalized positions define spacing; the endpoints themselves inherit the seed's hue and chroma.
const paletteTargets = [
    { lightness: 1, stop: 50 },
    ...Array.from({ length: 9 }, (_, index) => ({ lightness: 0.95 - index * 0.1, stop: (index + 1) * 100 })),
    { lightness: 0, stop: 950 },
];

const toOklch = converter("oklch");
const toOklab = converter("oklab");
const toRgb = converter("rgb");

// -- Color Measurements -------------------------------------------------------

function normalizeHex(input: string): string | undefined {
    return /^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(input) ? formatHex(parseHex(input)) : undefined;
}

function readOklch(hex: string): Oklch {
    const color = parseHex(hex);
    if (color === undefined) {
        throw new Error("Internal color calculation requires a normalized HEX color.");
    }
    return toOklch(color);
}

function colorDistance(first: string, second: string): number {
    const a = toOklab(readOklch(first));
    const b = toOklab(readOklch(second));
    return Math.hypot(a.l - b.l, a.a - b.a, a.b - b.b);
}

function mapToSrgb(lightness: number, chroma: number, hue: number): string {
    const color: Oklch = { c: chroma, h: hue, l: lightness, mode: "oklch" };
    const isInGamut = (value: number) => {
        const rgb = toRgb({ ...color, c: value });
        return [rgb.r, rgb.g, rgb.b].every(channel => channel >= -1e-10 && channel <= 1 + 1e-10);
    };
    if (isInGamut(chroma)) {
        return formatHex(color);
    }
    let low = 0;
    let high = chroma;
    for (let iteration = 0; iteration < 24; iteration++) {
        const middle = (low + high) / 2;
        if (isInGamut(middle)) {
            low = middle;
        } else {
            high = middle;
        }
    }
    return formatHex({ ...color, c: low });
}

function colorAtLightness(seed: Oklch, lightness: number): string {
    const l = Math.max(0, Math.min(1, lightness));
    const available = l < seed.l ? seed.l : 1 - seed.l;
    const remaining = available > 1e-10 ? Math.max(0, 1 - Math.abs(l - seed.l) / available) : 0;
    // A near-neutral seed should not acquire a vivid hue during generation.
    const retention = consumerColorPolicy.endpointChromaRetention;
    const chroma =
        seed.c < 1e-7 ? 0 : seed.c * (retention + (1 - retention) * remaining ** consumerColorPolicy.chromaExponent);
    return mapToSrgb(l, chroma, seed.h ?? 0);
}

function isVisibleOrderedStep(first: string, second: string, direction: Direction): boolean {
    const sign = direction === "darker" ? -1 : 1;
    return (
        wcagContrast(first, second) >= consumerColorPolicy.stateContrast &&
        colorDistance(first, second) >= consumerColorPolicy.stateDistance &&
        sign * (readOklch(second).l - readOklch(first).l) > 0 &&
        sign * (wcagContrast(second, "#000000") - wcagContrast(first, "#000000")) > 0
    );
}

// -- Palette And State Search -------------------------------------------------

function makeRamp(rest: string, seed: Oklch, spacingPower: number, endpointRange: number): PaletteStop[] {
    const [lightEnd, darkEnd] = consumerColorPolicy.endpointLightnessRanges[endpointRange];
    const placementTargets = paletteTargets.map((target, index) => ({
        ...target,
        lightness: index === 0 ? lightEnd : index === paletteTargets.length - 1 ? darkEnd : target.lightness,
    }));
    const anchorIndex = placementTargets.reduce(
        (best, target, index) =>
            Math.abs(target.lightness - seed.l) < Math.abs(placementTargets[best].lightness - seed.l) ? index : best,
        0,
    );
    const anchorTarget = paletteTargets[anchorIndex].lightness;
    return paletteTargets.map(({ lightness: target, stop }, index) => {
        if (index === anchorIndex) {
            return { color: rest, isAnchor: true, stop };
        }
        const endpoint = index < anchorIndex ? lightEnd : darkEnd;
        const endpointTarget = paletteTargets[index < anchorIndex ? 0 : paletteTargets.length - 1].lightness;
        const progress = Math.abs(target - anchorTarget) / Math.abs(endpointTarget - anchorTarget);
        const lightness = seed.l + (endpoint - seed.l) * progress ** spacingPower;
        return {
            color: colorAtLightness(seed, lightness),
            isAnchor: false,
            stop,
        };
    });
}

function selectStateSequence(ramp: PaletteStop[], foreground: string, direction: Direction): StateSequence | undefined {
    const restIndex = ramp.findIndex(stop => stop.isAnchor);
    const rest = ramp[restIndex];
    const candidates = (direction === "darker" ? ramp.slice(restIndex + 1) : ramp.slice(0, restIndex).reverse()).filter(
        stop => wcagContrast(stop.color, foreground) >= consumerColorPolicy.textContrast,
    );
    let sequence: StateSequence | undefined;
    for (const [index, hover] of candidates.entries()) {
        if (!isVisibleOrderedStep(rest.color, hover.color, direction)) {
            continue;
        }
        for (const selected of candidates.slice(index + 1)) {
            if (!isVisibleOrderedStep(hover.color, selected.color, direction)) {
                continue;
            }
            const distance = colorDistance(rest.color, hover.color) + colorDistance(rest.color, selected.color);
            if (sequence === undefined || distance < sequence.distance) {
                sequence = {
                    direction,
                    distance,
                    foreground,
                    hover: hover.color,
                    rest: rest.color,
                    selected: selected.color,
                    stops: { hover: hover.stop, rest: rest.stop, selected: selected.stop },
                };
            }
        }
    }
    return sequence;
}

function selectPaletteColor(
    ramp: PaletteStop[],
    reference: string,
    background: string,
    minimum: number,
): string | undefined {
    return ramp
        .filter(stop => wcagContrast(stop.color, background) >= minimum)
        .sort((a, b) => colorDistance(a.color, reference) - colorDistance(b.color, reference))[0]?.color;
}

// -- Generator ----------------------------------------------------------------

/** Preserves opaque sRGB rest and rejects constraints that cannot be met on the supplied surface. */
export function generateConsumerColors(
    input: string,
    options: { surface?: string; foreground?: string } = {},
): GenerationResult {
    const rest = normalizeHex(input);
    const surface = normalizeHex(options.surface ?? "#ffffff");
    const lockedForeground = options.foreground === undefined ? undefined : normalizeHex(options.foreground);
    if (!rest || !surface || (options.foreground !== undefined && !lockedForeground)) {
        return { reason: "Use opaque #RGB or #RRGGBB colors.", status: "invalid-input" };
    }
    if (lockedForeground && wcagContrast(rest, lockedForeground) < consumerColorPolicy.textContrast) {
        return { reason: "The locked label color fails 4.5:1 against the unchanged rest color.", status: "infeasible" };
    }
    const seed = readOklch(rest);
    let selection:
        | { ramp: PaletteStop[]; solid: StateSequence; spacingPower: number; endpointRange: number }
        | undefined;
    for (
        let candidateEndpointRange = 0;
        candidateEndpointRange < consumerColorPolicy.endpointLightnessRanges.length;
        candidateEndpointRange++
    ) {
        for (const candidateSpacingPower of consumerColorPolicy.paletteSpacingPowers) {
            const candidateRamp = makeRamp(rest, seed, candidateSpacingPower, candidateEndpointRange);
            if (
                !candidateRamp.every(
                    (stop, index) =>
                        index === 0 || readOklch(candidateRamp[index - 1].color).l > readOklch(stop.color).l,
                ) ||
                !candidateRamp.some(stop => wcagContrast(stop.color, surface) >= consumerColorPolicy.textContrast)
            ) {
                continue;
            }
            const candidateForeground =
                lockedForeground ??
                [candidateRamp[0].color, candidateRamp[candidateRamp.length - 1].color].sort(
                    (a, b) => wcagContrast(rest, b) - wcagContrast(rest, a),
                )[0];
            if (wcagContrast(rest, candidateForeground) < consumerColorPolicy.textContrast) {
                continue;
            }
            const darker = selectStateSequence(candidateRamp, candidateForeground, "darker");
            const lighter = selectStateSequence(candidateRamp, candidateForeground, "lighter");
            const candidateStates =
                darker && (!lighter || darker.distance <= lighter.distance + consumerColorPolicy.darkerPreference)
                    ? darker
                    : lighter;
            if (candidateStates !== undefined) {
                selection = {
                    endpointRange: candidateEndpointRange,
                    ramp: candidateRamp,
                    solid: candidateStates,
                    spacingPower: candidateSpacingPower,
                };
                break;
            }
        }
        if (selection !== undefined) {
            break;
        }
    }
    if (selection === undefined) {
        return {
            reason: "No palette provides readable, distinct states with these constraints. Rest is unchanged.",
            status: "infeasible",
        };
    }
    const { ramp, solid, spacingPower, endpointRange } = selection;
    const { foreground } = solid;
    const needsBoundary = [solid.rest, solid.hover, solid.selected].some(
        color => wcagContrast(color, surface) < consumerColorPolicy.boundaryContrast,
    );
    const border = needsBoundary ? selectPaletteColor(ramp, rest, surface, consumerColorPolicy.boundaryContrast) : null;
    const text = selectPaletteColor(ramp, rest, surface, consumerColorPolicy.textContrast);
    const surfaceLightness = readOklch(surface).l;
    const subtleTarget = colorAtLightness(seed, surfaceLightness + (surfaceLightness > 0.5 ? -0.04 : 0.04));
    const readableBackgrounds = ramp.filter(background =>
        ramp.some(stop => wcagContrast(stop.color, background.color) >= consumerColorPolicy.textContrast),
    );
    const subtleBackground = selectPaletteColor(readableBackgrounds, subtleTarget, surface, 1);
    const subtleForeground =
        subtleBackground === undefined
            ? undefined
            : selectPaletteColor(ramp, rest, subtleBackground, consumerColorPolicy.textContrast);
    if (!text || !subtleBackground || !subtleForeground || border === undefined) {
        return { reason: "No accessible surface pairing was found. Rest is unchanged.", status: "infeasible" };
    }
    return {
        audit: {
            boundaryContrast: border ? wcagContrast(border, surface) : null,
            direction: solid.direction,
            endpointRange,
            paletteSpacingPower: spacingPower,
            stateContrast: {
                hoverToSelected: wcagContrast(solid.hover, solid.selected),
                restToHover: wcagContrast(rest, solid.hover),
            },
            stateDistance: {
                hoverToSelected: colorDistance(solid.hover, solid.selected),
                restToHover: colorDistance(rest, solid.hover),
            },
            subtleTextContrast: wcagContrast(subtleForeground, subtleBackground),
            textContrast: {
                hover: wcagContrast(solid.hover, foreground),
                rest: wcagContrast(rest, foreground),
                selected: wcagContrast(solid.selected, foreground),
            },
            textOnSurfaceContrast: wcagContrast(text, surface),
        },
        ramp,
        seed,
        solid: { border, foreground, hover: solid.hover, rest, selected: solid.selected, stops: solid.stops },
        status: "generated",
        subtle: { background: subtleBackground, foreground: subtleForeground },
        surface,
        text,
    };
}
