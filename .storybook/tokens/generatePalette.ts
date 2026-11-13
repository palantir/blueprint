/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

// eslint-disable-next-line import/no-extraneous-dependencies -- Storybook uses the root Culori devDependency.
import { clampChroma, formatHex, interpolate, oklab, type Oklab, parseHex } from "culori";

/** Eight shades ordered light to dark, with the exact normalized input at index 5. */
export type Palette = readonly [string, string, string, string, string, string, string, string];

/** Returns no palette for inputs other than opaque #RGB or #RRGGBB. */
export function generatePalette(input: string): Palette | undefined {
    if (!input.startsWith("#") || (input.length !== 4 && input.length !== 7)) {
        return undefined;
    }
    const seed = parseHex(input);
    if (seed === undefined) {
        return undefined;
    }

    const converted = oklab(seed);
    // Avoid conversion noise introducing a tint into an achromatic input.
    const anchor = seed.r === seed.g && seed.g === seed.b ? { ...converted, a: 0, b: 0 } : converted;
    const lighter = interpolate([{ a: 0, b: 0, l: 1, mode: "oklab" }, anchor], "oklab");
    const darker = interpolate([anchor, { a: 0, b: 0, l: 0, mode: "oklab" }], "oklab");

    // The white/black bounds guide interpolation but are not returned as entries.
    return [
        formatShade(lighter(1 / 6)),
        formatShade(lighter(2 / 6)),
        formatShade(lighter(3 / 6)),
        formatShade(lighter(4 / 6)),
        formatShade(lighter(5 / 6)),
        formatHex(seed),
        formatShade(darker(1 / 3)),
        formatShade(darker(2 / 3)),
    ];
}

function formatShade(color: Oklab): string {
    return formatHex(clampChroma(color, "oklch", "rgb"));
}
