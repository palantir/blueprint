/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

// eslint-disable-next-line import/no-extraneous-dependencies -- Storybook uses the root Culori devDependency.
import { formatHex, parse } from "culori";

/** Ten CSS colors ordered light to dark, with the exact normalized input at index 6. */
export type Palette = readonly [string, string, string, string, string, string, string, string, string, string];

/** Accepts opaque CSS seed colors; returns no palette for invalid or translucent colors. */
export function generatePalette(input: string): Palette | undefined {
    const seed = parse(input);
    if (seed == null || (seed.alpha ?? 1) !== 1) {
        return undefined;
    }

    const color = formatHex(seed);
    // Lightness moves toward white (l + (1 - l) * amount) or black (l * (1 - amount)), matching an
    // OKLab mix. Chroma is scaled separately: soft tints near white, the seed's full chroma at rest,
    // and muted darks.
    const lighter = (amount: number, chroma: number) =>
        `oklch(from ${color} calc(l + (1 - l) * ${amount}) calc(c * ${chroma}) h)`;
    const darker = (amount: number, chroma: number) =>
        `oklch(from ${color} calc(l * (1 - ${amount})) calc(c * ${chroma}) h)`;

    // Amounts are least-squares fits to the consumer color generator proposal's light-mode ramps,
    // aligned at the seed; index 0 has no proposal counterpart and stays just lighter than index 1.
    // No contrast guarantee. The seed stays at index 6, so very light or very dark seeds can
    // produce nearly identical shades.
    return [
        lighter(0.98, 0.04),
        lighter(0.96, 0.08),
        lighter(0.86, 0.17),
        lighter(0.66, 0.33),
        lighter(0.42, 0.57),
        lighter(0.21, 0.81),
        color,
        darker(0.13, 0.89),
        darker(0.27, 0.75),
        darker(0.49, 0.51),
    ];
}
