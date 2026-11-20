/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

// eslint-disable-next-line import/no-extraneous-dependencies -- Storybook uses the root Culori devDependency.
import { type Color, formatHex, parse } from "culori";

/** Ten CSS colors ordered light to dark, with the exact normalized input at index 6. */
export type Palette = readonly [string, string, string, string, string, string, string, string, string, string];

/** Whether the input can seed a palette. */
export function isValidColor(input: string): boolean {
    return parseSeedColor(input) !== undefined;
}

/** Accepts opaque CSS seed colors; returns no palette for invalid or translucent colors. */
export function generatePalette(input: string): Palette | undefined {
    const seed = parseSeedColor(input);
    if (seed === undefined) {
        return undefined;
    }

    const color = formatHex(seed);

    // Provisional mix percentages generate approximate shades with no contrast guarantee.
    // The seed stays at index 6, so mixing very light seeds with white or very dark seeds
    // with black can produce nearly identical shades.
    return [
        `color-mix(in oklab, ${color}, white 92%)`,
        `color-mix(in oklab, ${color}, white 81%)`,
        `color-mix(in oklab, ${color}, white 60%)`,
        `color-mix(in oklab, ${color}, white 37%)`,
        `color-mix(in oklab, ${color}, white 18%)`,
        `color-mix(in oklab, ${color}, white 6%)`,
        color,
        `color-mix(in oklab, ${color}, black 14%)`,
        `color-mix(in oklab, ${color}, black 24%)`,
        `color-mix(in oklab, ${color}, black 34%)`,
    ];
}

function parseSeedColor(input: string): Color | undefined {
    const seed = parse(input);
    return seed != null && (seed.alpha ?? 1) === 1 ? seed : undefined;
}
