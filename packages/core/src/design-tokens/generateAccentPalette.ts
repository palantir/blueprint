/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

import { clampChroma, formatHex, oklch, type Oklch, wcagContrast } from "culori";

export type AccentPalette = {
    readonly steps: readonly string[];
    readonly contrast: string;
};

// Backgrounds stay near the theme's canvas; borders progressively separate from those surfaces.
const LIGHT_LIGHTNESS = [0.985, 0.97, 0.945, 0.915, 0.88, 0.82, 0.74, 0.66];
const DARK_LIGHTNESS = [0.17, 0.2, 0.24, 0.28, 0.32, 0.39, 0.46, 0.54];
const CHROMA_FACTORS = [0.03, 0.05, 0.08, 0.11, 0.15, 0.2, 0.3, 0.4];
const MIN_TEXT_CONTRAST = 4.5;

/**
 * Generates role-based preview scales, not Radix's palette algorithm or Blueprint's default colors.
 * The supplied accent remains exact at solid step 9; related solids share an accessible foreground.
 */
export function generateAccentPalette(hex: string): { light: AccentPalette; dark: AccentPalette } | undefined {
    const match = /^#?([\da-f]{3}|[\da-f]{6})$/i.exec(hex.trim());
    if (match == null) {
        return undefined;
    }
    const digits = match[1].toLowerCase();
    const normalizedHex = `#${digits.length === 3 ? [...digits].map(digit => digit.repeat(2)).join("") : digits}`;
    const color = oklch(normalizedHex);
    if (color == null) {
        return undefined;
    }
    // Conversion noise must not give achromatic input a spurious hue or tinted derived steps.
    const accent: Oklch = { ...color, c: color.c < 0.00001 ? 0 : color.c, h: color.h ?? 0 };
    return {
        dark: buildPalette({ accent, normalizedHex, theme: "dark" }),
        light: buildPalette({ accent, normalizedHex, theme: "light" }),
    };
}

function buildPalette({
    accent,
    normalizedHex,
    theme,
}: {
    accent: Oklch;
    normalizedHex: string;
    theme: "light" | "dark";
}): AccentPalette {
    const isDark = theme === "dark";
    const lightness = isDark ? DARK_LIGHTNESS : LIGHT_LIGHTNESS;
    const surfacesAndBorders = lightness.map((l, index) =>
        formatGamutColor({ ...accent, c: accent.c * CHROMA_FACTORS[index], l }),
    );
    const contrast =
        wcagContrast("#000000", normalizedHex) >= wcagContrast("#ffffff", normalizedHex) ? "#000000" : "#ffffff";
    const stateColor = (targetLightness: number, amount: number) =>
        formatGamutColor({
            ...accent,
            c: accent.c * (1 - amount),
            l: accent.l + (targetLightness - accent.l) * amount,
        });
    // Prefer darker solid states. At black or the foreground's contrast boundary, lighten instead.
    const darkerSolids = [normalizedHex, stateColor(0, 0.08), stateColor(0, 0.16)];
    const canDarken =
        new Set(darkerSolids).size === 3 &&
        darkerSolids.every(solid => wcagContrast(contrast, solid) >= MIN_TEXT_CONTRAST);
    const solidTarget = canDarken ? 0 : 1;
    const backgrounds = surfacesAndBorders.slice(0, 5);
    return {
        contrast,
        steps: [
            ...surfacesAndBorders,
            normalizedHex,
            stateColor(solidTarget, 0.08),
            stateColor(solidTarget, 0.16),
            accessibleForeground({ accent, backgrounds, lightness: isDark ? 0.76 : 0.42, theme }),
            accessibleForeground({ accent, backgrounds, lightness: isDark ? 0.9 : 0.3, theme }),
        ],
    };
}

function accessibleForeground({
    accent,
    backgrounds,
    lightness,
    theme,
}: {
    accent: Oklch;
    backgrounds: readonly string[];
    lightness: number;
    theme: "light" | "dark";
}): string {
    // Verify the formatted sRGB result, not the pre-gamut OKLCH value: rounding can change contrast.
    const direction = theme === "dark" ? 1 : -1;
    for (let adjustment = 0; adjustment <= 100; adjustment++) {
        const adjustedLightness = Math.max(0, Math.min(1, lightness + (direction * adjustment) / 100));
        // Soften the accent for readable text; the cap keeps highly saturated inputs within a restrained text gamut.
        const foreground = formatGamutColor({
            ...accent,
            c: Math.min(accent.c * 0.65, 0.15),
            l: adjustedLightness,
        });
        if (backgrounds.every(background => wcagContrast(foreground, background) >= MIN_TEXT_CONTRAST)) {
            return foreground;
        }
    }
    // The bounded theme surfaces always admit one of these extremes, even with achromatic input.
    return theme === "dark" ? "#ffffff" : "#000000";
}

function formatGamutColor(color: Oklch): string {
    // Reduce chroma rather than clipping RGB channels, retaining the accent hue inside the sRGB gamut.
    return formatHex(clampChroma(color, "oklch", "rgb"));
}
