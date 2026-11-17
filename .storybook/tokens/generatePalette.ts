/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

// eslint-disable-next-line import/no-extraneous-dependencies -- Storybook uses the root Culori devDependency.
import { formatHex, interpolate, parse } from "culori";

/** Ten hex colors ordered light to dark, with the exact normalized input at index 6. */
export type Palette = readonly [string, string, string, string, string, string, string, string, string, string];

/** Accepts opaque CSS seed colors; returns no palette for invalid or translucent colors. */
export function generatePalette(input: string): Palette | undefined {
    const seed = parse(input);
    if (seed == null || (seed.alpha ?? 1) !== 1) {
        return undefined;
    }

    const color = formatHex(seed);
    const mixWhite = interpolate([color, "white"], "oklab");
    const mixBlack = interpolate([color, "black"], "oklab");

    // Generate approximate colors with no contrast guarantee
    return [
        formatHex(mixWhite(0.92)),
        formatHex(mixWhite(0.81)),
        formatHex(mixWhite(0.6)),
        formatHex(mixWhite(0.37)),
        formatHex(mixWhite(0.18)),
        formatHex(mixWhite(0.06)),
        color,
        formatHex(mixBlack(0.14)),
        formatHex(mixBlack(0.24)),
        formatHex(mixBlack(0.34)),
    ];
}
