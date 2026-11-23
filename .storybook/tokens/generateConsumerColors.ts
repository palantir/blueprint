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
type Mode = "light" | "dark";
type StateDirections = Record<"hover" | "selected", Direction>;

interface PaletteStop {
    color: string;
    isAnchor: boolean;
    stop: number;
}

interface StateSequence extends Record<State, string> {
    directions: StateDirections;
    score: number;
    foreground: string;
    stops: Record<State, number>;
}

interface PaletteSelection {
    ramp: PaletteStop[];
    solid: StateSequence;
    spacingBias: number;
    endpointRange: number;
    locality: number;
    template: PaletteStop[];
    templateDeviation: number;
    spacingError: number;
    score: number;
    directionException: boolean;
    usesAdjacentStates: boolean;
}

export interface ConsumerColors {
    status: "generated";
    surface: string;
    seed: Oklch;
    ramp: PaletteStop[];
    template: PaletteStop[];
    solid: Record<State, string> & { foreground: string; border: string | null; stops: Record<State, number> };
    text: string;
    subtle: { background: string; foreground: string };
    audit: {
        directions: StateDirections;
        directionException: boolean;
        mode: Mode;
        selectedReference: "rest" | "hover";
        usesAdjacentStates: boolean;
        textContrast: Record<State, number>;
        paletteSpacingBias: number;
        anchorLocality: number;
        templateDeviation: number;
        spacingError: number;
        rampDistances: number[];
        endpointRange: number;
        stateContrast: { restToHover: number; restToSelected: number; hoverToSelected: number };
        stateDistance: { restToHover: number; restToSelected: number; hoverToSelected: number };
        boundaryContrast: number | null;
        textOnSurfaceContrast: number;
        subtleTextContrast: number;
    };
}

type GenerationResult = ConsumerColors | { status: "invalid-input" | "infeasible"; reason: string };

// -- Policy -------------------------------------------------------------------

// Greg's preserved blue steps measure ~0.072–0.076 in OKLab; Ryan's final orange 500→600 measures ~0.091.
// These reference-informed bands are design choices, separate from foreground/background accessibility.
export const consumerColorPolicy = {
    anchorLocalities: [1, 2, 4],
    backgroundLightnessMinimums: [0.96, 0.91],
    boundaryContrast: 3,
    densityReach: 0.6,
    endpointLightnessRanges: [
        [0.98, 0.12],
        [0.985, 0.1],
        [0.99, 0.08],
        [0.995, 0.06],
    ],
    lightChromaLimits: [0.02, 0.04, 0.07, 0.12, 0.18],
    paletteSpacingBiases: [0.75, 0.875, 1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 6, 8, 12, 16, 24, 32],
    scoreWeights: { spacing: 1, states: 2, template: 1 },
    stateContrast: { max: 1.5, min: 1.08 },
    stateDistance: {
        darkAllowance: 0.12,
        darkFalloff: 0.12,
        darkTargetBoost: 0.2,
        max: 0.1,
        min: 0.055,
        target: 0.075,
    },
    templateChroma: [0.1, 0.18, 0.32, 0.55, 0.8, 1, 0.85, 0.65, 0.4, 0.25],
    templateLightness: [0.98, 0.94, 0.86, 0.76, 0.66, 0.56, 0.46, 0.35, 0.23, 0.12],
    textContrast: 4.5,
    veryDarkLightness: 0.3,
} as const;

// Roles share a template; the exact input is an explicit exception to its targets.
const paletteTargets = consumerColorPolicy.templateLightness.map((lightness, stop) => ({
    chromaLimit: consumerColorPolicy.lightChromaLimits[stop] ?? Infinity,
    lightness,
    minimumLightness: consumerColorPolicy.backgroundLightnessMinimums[stop] ?? 0,
    stop,
}));

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
    if (chroma < 1e-7) {
        // Avoid a one-channel rounding difference giving an achromatic input a tint.
        const gray = toRgb(color).r;
        return formatHex({ b: gray, g: gray, mode: "rgb", r: gray });
    }
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

function stateDistanceTarget(first: string, second: string): number {
    const lightness = Math.min(readOklch(first).l, readOklch(second).l);
    const cutoff = Math.exp(-consumerColorPolicy.veryDarkLightness / consumerColorPolicy.stateDistance.darkFalloff);
    const influence = Math.max(
        0,
        (Math.exp(-lightness / consumerColorPolicy.stateDistance.darkFalloff) - cutoff) / (1 - cutoff),
    );
    return consumerColorPolicy.stateDistance.target + consumerColorPolicy.stateDistance.darkTargetBoost * influence;
}

function isGentleOrderedStep(first: string, second: string, direction: Direction): boolean {
    const sign = direction === "darker" ? -1 : 1;
    const firstLightness = readOklch(first).l;
    const secondLightness = readOklch(second).l;
    const contrast = wcagContrast(first, second);
    const distance = colorDistance(first, second);
    // Near black, a small visible RGB change occupies more OKLab distance.
    const maximumDistance = Math.max(
        consumerColorPolicy.stateDistance.max +
            consumerColorPolicy.stateDistance.darkAllowance *
                Math.exp(-Math.min(firstLightness, secondLightness) / consumerColorPolicy.stateDistance.darkFalloff),
        stateDistanceTarget(first, second) +
            consumerColorPolicy.stateDistance.max -
            consumerColorPolicy.stateDistance.target,
    );
    return (
        contrast >= consumerColorPolicy.stateContrast.min &&
        contrast <= consumerColorPolicy.stateContrast.max &&
        distance >= consumerColorPolicy.stateDistance.min &&
        distance <= maximumDistance &&
        sign * (secondLightness - firstLightness) > 0 &&
        sign * (wcagContrast(second, "#000000") - wcagContrast(first, "#000000")) > 0
    );
}

// -- Palette And State Search -------------------------------------------------

function makeTemplate(seed: Oklch, endpointRange: number): Oklch[] {
    const [lightTarget, darkTarget] = consumerColorPolicy.endpointLightnessRanges[endpointRange];
    const [initialLightTarget, initialDarkTarget] = consumerColorPolicy.endpointLightnessRanges[0];
    const remaining = 0.5 - endpointRange * 0.15;
    const lightEnd = Math.max(lightTarget, 1 - (1 - seed.l) * (seed.l > initialLightTarget ? remaining : 0.5));
    const darkEnd = Math.min(darkTarget, seed.l * (seed.l < initialDarkTarget ? remaining : 0.5));
    return paletteTargets.map(({ lightness, chromaLimit }, index) => ({
        c: Math.min(chromaLimit, seed.c < 1e-7 ? 0 : seed.c * consumerColorPolicy.templateChroma[index]),
        h: seed.h ?? 0,
        l: index === 0 ? lightEnd : index === 9 ? darkEnd : lightness,
        mode: "oklch",
    }));
}

function findAnchorIndices(rest: string, seed: Oklch, template: Oklch[]): number[] {
    return paletteTargets
        .map((target, index) => ({
            ...target,
            distance: colorDistance(rest, mapToSrgb(template[index].l, template[index].c, seed.h ?? 0)),
            index,
        }))
        .filter(
            target =>
                seed.c <= target.chromaLimit &&
                seed.l >= target.minimumLightness &&
                (target.index !== 9 || seed.l <= 0.15),
        )
        .sort((a, b) => a.distance - b.distance)
        .map(target => target.index);
}

function sampleTemplateChroma(template: Oklch[], lightness: number): number {
    for (let index = 1; index < template.length; index++) {
        if (lightness >= template[index].l) {
            const upper = template[index - 1];
            const lower = template[index];
            const progress = (upper.l - lightness) / (upper.l - lower.l);
            return upper.c + (lower.c - upper.c) * progress;
        }
    }
    return template[template.length - 1].c;
}

function makeRamp(
    rest: string,
    seed: Oklch,
    template: Oklch[],
    anchorIndex: number,
    spacingBias: number,
    locality: number,
    densitySide: Direction | "both",
): PaletteStop[] {
    const anchor = template[anchorIndex];
    const lightnessCorrection = seed.l - anchor.l;
    const chromaCorrection = seed.c - anchor.c;
    return paletteTargets.map(({ chromaLimit, minimumLightness, stop }, index) => {
        if (index === anchorIndex) {
            return { color: rest, isAnchor: true, stop };
        }
        const endpoint = template[index < anchorIndex ? 0 : 9];
        const extent = endpoint.l - anchor.l;
        const position = (template[index].l - anchor.l) / extent;
        const bias = densitySide === "both" || index < anchorIndex === (densitySide === "lighter") ? spacingBias : 1;
        // Expanded dark-end steps recover immediately so the second state does not overshoot.
        const reach = bias < 1 ? 0 : consumerColorPolicy.densityReach;
        const recovery = Math.max(0, (position - reach) / (1 - reach));
        const progress = position / bias + (1 - 1 / bias) * recovery ** 2 * (3 - 2 * recovery);
        const referenceLightness = anchor.l + extent * progress;
        // Bound the correction slope so even a large anchor move cannot reverse the ramp.
        const maximumPower = extent * lightnessCorrection > 0 ? Math.abs(extent / lightnessCorrection) : Infinity;
        const power = Math.min(locality, maximumPower);
        const influence = (1 - progress) ** power;
        const lightness = Math.max(minimumLightness, referenceLightness + lightnessCorrection * influence);
        const chroma = Math.max(
            0,
            Math.min(chromaLimit, sampleTemplateChroma(template, referenceLightness) + chromaCorrection * influence),
        );
        return { color: mapToSrgb(lightness, chroma, seed.h ?? 0), isAnchor: false, stop };
    });
}

function canSupportDirections(rest: string, foreground: string, directions: StateDirections): boolean {
    const sameDirection = directions.hover === directions.selected;
    for (const direction of ["darker", "lighter"] as const) {
        const steps = Number(directions.hover === direction) + Number(directions.selected === direction);
        if (
            steps > 0 &&
            wcagContrast(rest, direction === "lighter" ? "#ffffff" : "#000000") <
                consumerColorPolicy.stateContrast.min ** steps
        ) {
            return false;
        }
    }
    const towardForeground = wcagContrast(foreground, "#000000") > wcagContrast(rest, "#000000") ? "lighter" : "darker";
    const stepsTowardForeground = sameDirection ? (directions.hover === towardForeground ? 2 : 0) : 1;
    return (
        wcagContrast(rest, foreground) >=
        consumerColorPolicy.textContrast * consumerColorPolicy.stateContrast.min ** stepsTowardForeground
    );
}

function selectStateSequence(
    ramp: PaletteStop[],
    foreground: string,
    directions: StateDirections,
    adjacentOnly: boolean,
): StateSequence | undefined {
    const restIndex = ramp.findIndex(stop => stop.isAnchor);
    const rest = ramp[restIndex];
    const sameDirection = directions.hover === directions.selected;
    const hoverSign = directions.hover === "darker" ? 1 : -1;
    const selectedSign = directions.selected === "darker" ? 1 : -1;
    const hoverCandidates = ramp.filter(
        stop =>
            hoverSign * (stop.stop - restIndex) > 0 &&
            (!adjacentOnly || stop.stop === restIndex + hoverSign) &&
            wcagContrast(stop.color, foreground) >= consumerColorPolicy.textContrast,
    );
    let sequence: StateSequence | undefined;
    for (const hover of hoverCandidates) {
        if (!isGentleOrderedStep(rest.color, hover.color, directions.hover)) {
            continue;
        }
        const reference = sameDirection ? hover : rest;
        for (const selected of ramp) {
            if (
                selectedSign * (selected.stop - reference.stop) <= 0 ||
                (adjacentOnly && selected.stop !== reference.stop + selectedSign) ||
                wcagContrast(selected.color, foreground) < consumerColorPolicy.textContrast ||
                !isGentleOrderedStep(reference.color, selected.color, directions.selected)
            ) {
                continue;
            }
            const score =
                Math.abs(colorDistance(rest.color, hover.color) - stateDistanceTarget(rest.color, hover.color)) +
                Math.abs(
                    colorDistance(reference.color, selected.color) -
                        stateDistanceTarget(reference.color, selected.color),
                );
            if (sequence === undefined || score < sequence.score) {
                sequence = {
                    directions,
                    foreground,
                    hover: hover.color,
                    rest: rest.color,
                    score,
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

function findPalette(
    rest: string,
    seed: Oklch,
    surface: string,
    mode: Mode,
    lockedForeground?: string,
): PaletteSelection | undefined {
    const reference = makeTemplate(seed, 0);
    const template = reference.map((color, stop) => ({
        color: mapToSrgb(color.l, color.c, seed.h ?? 0),
        isAnchor: false,
        stop,
    }));
    const templateDistances = template.slice(1).map((stop, index) => colorDistance(template[index].color, stop.color));
    const preferred = seed.l <= consumerColorPolicy.veryDarkLightness ? "lighter" : "darker";
    const opposite = preferred === "lighter" ? "darker" : "lighter";
    const patterns: StateDirections[] = [
        ...(mode === "dark" ? [{ hover: "lighter", selected: "darker" } as const] : []),
        { hover: preferred, selected: preferred },
        { hover: opposite, selected: opposite },
    ];
    for (const [patternIndex, directions] of patterns.entries()) {
        const possibleForegrounds = lockedForeground ? [lockedForeground] : ["#ffffff", "#000000"];
        if (!possibleForegrounds.some(foreground => canSupportDirections(rest, foreground, directions))) {
            continue;
        }
        let skippedSelection: PaletteSelection | undefined;
        for (const anchorIndex of findAnchorIndices(rest, seed, reference)) {
            for (
                let endpointRange = 0;
                endpointRange < consumerColorPolicy.endpointLightnessRanges.length;
                endpointRange++
            ) {
                const workingTemplate = makeTemplate(seed, endpointRange);
                const foregrounds = (
                    lockedForeground
                        ? [lockedForeground]
                        : [0, 9].map(index =>
                              index === anchorIndex
                                  ? rest
                                  : mapToSrgb(workingTemplate[index].l, workingTemplate[index].c, seed.h ?? 0),
                          )
                ).filter(foreground => canSupportDirections(rest, foreground, directions));
                if (foregrounds.length === 0) {
                    continue;
                }
                let selection: PaletteSelection | undefined;
                let groupSkippedSelection: PaletteSelection | undefined;
                for (const locality of consumerColorPolicy.anchorLocalities) {
                    for (const spacingBias of consumerColorPolicy.paletteSpacingBiases) {
                        if (spacingBias < 1 && seed.l > consumerColorPolicy.veryDarkLightness) {
                            continue;
                        }
                        for (const densitySide of directions.hover === directions.selected
                            ? [directions.hover]
                            : (["both", "lighter", "darker"] as const)) {
                            const ramp = makeRamp(
                                rest,
                                seed,
                                workingTemplate,
                                anchorIndex,
                                spacingBias,
                                locality,
                                densitySide,
                            );
                            if (
                                (ramp[0].color === "#ffffff" && rest !== "#ffffff") ||
                                (ramp[9].color === "#000000" && rest !== "#000000") ||
                                !ramp.every(
                                    (stop, index) =>
                                        index === 0 || readOklch(ramp[index - 1].color).l > readOklch(stop.color).l,
                                ) ||
                                !ramp.some(
                                    stop => wcagContrast(stop.color, surface) >= consumerColorPolicy.textContrast,
                                )
                            ) {
                                continue;
                            }
                            const adjacent = foregrounds
                                .map(foreground => selectStateSequence(ramp, foreground, directions, true))
                                .filter(sequence => sequence !== undefined)
                                .sort((x, y) => x.score - y.score)[0];
                            const solid =
                                adjacent ??
                                (skippedSelection === undefined
                                    ? foregrounds
                                          .map(foreground => selectStateSequence(ramp, foreground, directions, false))
                                          .filter(sequence => sequence !== undefined)
                                          .sort((x, y) => x.score - y.score)[0]
                                    : undefined);
                            if (solid === undefined) {
                                continue;
                            }
                            const templateDeviation = Math.sqrt(
                                ramp.reduce(
                                    (sum, stop, index) => sum + colorDistance(stop.color, template[index].color) ** 2,
                                    0,
                                ) / ramp.length,
                            );
                            const spacingError = Math.sqrt(
                                ramp
                                    .slice(1)
                                    .reduce(
                                        (sum, stop, index) =>
                                            sum +
                                            (colorDistance(ramp[index].color, stop.color) - templateDistances[index]) **
                                                2,
                                        0,
                                    ) /
                                    (ramp.length - 1),
                            );
                            const weights = consumerColorPolicy.scoreWeights;
                            const score =
                                weights.template * templateDeviation +
                                weights.spacing * spacingError +
                                weights.states * solid.score;
                            const previous = adjacent === undefined ? groupSkippedSelection : selection;
                            if (previous === undefined || score < previous.score) {
                                const candidate = {
                                    directionException: patternIndex > 0,
                                    endpointRange,
                                    locality,
                                    ramp,
                                    score,
                                    solid,
                                    spacingBias,
                                    spacingError,
                                    template,
                                    templateDeviation,
                                    usesAdjacentStates: adjacent !== undefined,
                                };
                                if (adjacent === undefined) {
                                    groupSkippedSelection = candidate;
                                } else {
                                    selection = candidate;
                                }
                            }
                        }
                    }
                }
                if (selection !== undefined) {
                    return selection;
                }
                skippedSelection ??= groupSkippedSelection;
            }
        }
        if (skippedSelection !== undefined) {
            return skippedSelection;
        }
    }
    return undefined;
}

// -- Generator ----------------------------------------------------------------

/** Preserves opaque sRGB rest and rejects constraints that cannot be met on the supplied surface. */
export function generateConsumerColors(
    input: string,
    options: { surface?: string; foreground?: string; mode?: Mode } = {},
): GenerationResult {
    const mode = options.mode ?? "light";
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
    const selection = findPalette(rest, seed, surface, mode, lockedForeground);
    if (selection === undefined) {
        return {
            reason: "No palette provides readable, distinct states with these constraints. Rest is unchanged.",
            status: "infeasible",
        };
    }
    const { ramp, solid, spacingBias, endpointRange, locality, template, templateDeviation, spacingError } = selection;
    const { foreground } = solid;
    const needsBoundary = [solid.rest, solid.hover, solid.selected].some(
        color => wcagContrast(color, surface) < consumerColorPolicy.boundaryContrast,
    );
    const border = needsBoundary ? selectPaletteColor(ramp, rest, surface, consumerColorPolicy.boundaryContrast) : null;
    const text = selectPaletteColor(ramp, rest, surface, consumerColorPolicy.textContrast);
    const surfaceLightness = readOklch(surface).l;
    const subtleTarget = mapToSrgb(
        surfaceLightness + (surfaceLightness > 0.5 ? -0.04 : 0.04),
        Math.min(seed.c, consumerColorPolicy.lightChromaLimits[0]),
        seed.h ?? 0,
    );
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
            anchorLocality: locality,
            boundaryContrast: border ? wcagContrast(border, surface) : null,
            directionException: selection.directionException,
            directions: solid.directions,
            endpointRange,
            mode,
            paletteSpacingBias: spacingBias,
            rampDistances: ramp.slice(1).map((stop, index) => colorDistance(ramp[index].color, stop.color)),
            selectedReference: solid.directions.hover === solid.directions.selected ? "hover" : "rest",
            spacingError,
            stateContrast: {
                hoverToSelected: wcagContrast(solid.hover, solid.selected),
                restToHover: wcagContrast(rest, solid.hover),
                restToSelected: wcagContrast(rest, solid.selected),
            },
            stateDistance: {
                hoverToSelected: colorDistance(solid.hover, solid.selected),
                restToHover: colorDistance(rest, solid.hover),
                restToSelected: colorDistance(rest, solid.selected),
            },
            subtleTextContrast: wcagContrast(subtleForeground, subtleBackground),
            templateDeviation,
            textContrast: {
                hover: wcagContrast(solid.hover, foreground),
                rest: wcagContrast(rest, foreground),
                selected: wcagContrast(solid.selected, foreground),
            },
            textOnSurfaceContrast: wcagContrast(text, surface),
            usesAdjacentStates: selection.usesAdjacentStates,
        },
        ramp,
        seed,
        solid: { border, foreground, hover: solid.hover, rest, selected: solid.selected, stops: solid.stops },
        status: "generated",
        subtle: { background: subtleBackground, foreground: subtleForeground },
        surface,
        template,
        text,
    };
}
