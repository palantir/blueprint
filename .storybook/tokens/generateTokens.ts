/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { formatHex, inGamut, oklch, type Oklch, toGamut, wcagContrast } from "culori";

import { STORYBOOK_BACKGROUNDS, type TokenIntent, type TokenName, type TokenValues } from "./tokens";

const BLACK = "#000";
const WHITE = "#fff";

// WCAG 2.2 AA requires 4.5:1 for normal-size text (1.4.3).
// Use this minimum for muted text and text on every enabled solid state.
const MINIMUM_TEXT_CONTRAST = 4.5;
// WCAG non-text contrast target for essential UI boundaries (1.4.11).
const MINIMUM_BORDER_CONTRAST = 3;
const TEXT_CONTRAST_TARGETS = {
    muted: MINIMUM_TEXT_CONTRAST,
    normal: 7, // WCAG AAA target for normal-size text.
    strong: 11, // Additional emphasis; a design choice, not a WCAG threshold.
};

// OKLCH lightness reductions, capped by the solid text contrast minimum.
const SOLID_LIGHTNESS_OFFSETS = { active: 0.12, hover: 0.06 };
const SUBTLE_REST_LIGHTNESS = { dark: 0.28, light: 0.96 };
const SUBTLE_LIGHTNESS_OFFSETS = { active: 0.08, hover: 0.04, rest: 0 };
// Keep neutral subtle backgrounds tinted rather than fully saturated.
const SUBTLE_MAX_CHROMA = 0.02;
// Approximately 1e-6 lightness precision, finer than the returned 8-bit sRGB colors.
const CONTRAST_SEARCH_ITERATIONS = 20;

const toRgb = toGamut("rgb", "oklch");
const inRgbGamut = inGamut("rgb");

export interface GenerateTokensOptions {
    intent: TokenIntent;
}

export type GeneratedTokenValues = Record<TokenName, { light: string; dark: string }>;

/**
 * Replaces palette-backed CSS colors with light/dark values from one opaque intent color.
 * Colors are gamut-mapped to sRGB; accent and solid.rest use the same normalized color.
 *
 * Text and border contrast targets apply only against the fixed Storybook backgrounds.
 * Solid states may coincide near their text contrast limit. JSON-derived roles, including
 * disabled colors, alpha borders, and overlays, remain owned by the token stylesheet.
 *
 * This demo assumes valid, opaque color inputs.
 */
export function generateTokens(color: string, { intent }: GenerateTokensOptions): GeneratedTokenValues {
    const light = generateThemeTokens(color, intent, "light");
    const dark: Record<string, string> = generateThemeTokens(color, intent, "dark");
    return Object.fromEntries(Object.entries(light).map(([name, value]) => [name, { dark: dark[name], light: value }]));
}

function generateThemeTokens(color: string, intent: TokenIntent, theme: "light" | "dark"): TokenValues {
    const background = STORYBOOK_BACKGROUNDS[theme];
    // The demo's color inputs are assumed valid.
    const seed = oklch(color) as Oklch;

    // Preserve in-gamut seed colors; valid demo inputs always produce a hex value.
    const base = formatHex(inRgbGamut(color) ? color : toRgb(seed)) as string;
    const lightness = Math.max(0, Math.min(1, seed.l));
    const shade = (l: number) => (l === lightness ? base : formatHex(toRgb({ ...seed, l })));

    // The fallback endpoint must meet the target. Keep the passing endpoint so
    // rounding to hex cannot return a color just below the contrast threshold.
    const atContrast = (wanted: number, fallback: number, against: string, minimum: number): string => {
        const candidate = shade(wanted);
        if (wcagContrast(candidate, against) >= minimum) {
            return candidate;
        }

        let failing = wanted;
        let passing = fallback;
        let result = shade(passing);
        for (let iteration = 0; iteration < CONTRAST_SEARCH_ITERATIONS; iteration++) {
            const midpoint = (failing + passing) / 2;
            const next = shade(midpoint);
            if (wcagContrast(next, against) >= minimum) {
                passing = midpoint;
                result = next;
            } else {
                failing = midpoint;
            }
        }
        return result;
    };

    const contrastingColor = (minimum: number) =>
        theme === "dark" ? atContrast(0, 1, background, minimum) : atContrast(1, 0, background, minimum);
    const subtleShade = (offset: number) =>
        formatHex(toRgb({ ...seed, c: Math.min(seed.c, SUBTLE_MAX_CHROMA), l: SUBTLE_REST_LIGHTNESS[theme] - offset }));

    const onSolid = wcagContrast(base, BLACK) >= wcagContrast(base, WHITE) ? BLACK : WHITE;

    return {
        [`--bp-${intent}-accent`]: base,
        [`--bp-${intent}-background-solid-rest`]: base,
        [`--bp-${intent}-background-solid-hover`]: atContrast(
            Math.max(0, lightness - SOLID_LIGHTNESS_OFFSETS.hover),
            lightness,
            onSolid,
            MINIMUM_TEXT_CONTRAST,
        ),
        [`--bp-${intent}-background-solid-active`]: atContrast(
            Math.max(0, lightness - SOLID_LIGHTNESS_OFFSETS.active),
            lightness,
            onSolid,
            MINIMUM_TEXT_CONTRAST,
        ),
        [`--bp-${intent}-text-normal`]: contrastingColor(TEXT_CONTRAST_TARGETS.normal),
        [`--bp-${intent}-text-strong`]: contrastingColor(TEXT_CONTRAST_TARGETS.strong),
        [`--bp-${intent}-text-on-solid`]: onSolid,
        [`--bp-${intent}-border-strong-rest`]: contrastingColor(MINIMUM_BORDER_CONTRAST),
        ...(intent === "neutral"
            ? {
                  "--bp-neutral-background-subtle-active": subtleShade(SUBTLE_LIGHTNESS_OFFSETS.active),
                  "--bp-neutral-background-subtle-hover": subtleShade(SUBTLE_LIGHTNESS_OFFSETS.hover),
                  "--bp-neutral-background-subtle-rest": subtleShade(SUBTLE_LIGHTNESS_OFFSETS.rest),
                  "--bp-neutral-text-muted": contrastingColor(TEXT_CONTRAST_TARGETS.muted),
              }
            : {}),
    };
}
