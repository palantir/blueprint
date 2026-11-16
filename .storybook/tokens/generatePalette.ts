/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

// eslint-disable-next-line import/no-extraneous-dependencies -- Storybook uses the root Culori devDependency.
import { formatHex, parseHex } from "culori";

/** Ten CSS colors ordered light to dark, with the exact normalized input at index 6. */
export type Palette = readonly [string, string, string, string, string, string, string, string, string, string];

/** Returns no palette for inputs other than opaque #RGB or #RRGGBB. */
export function generatePalette(input: string): Palette | undefined {
    if (!isHexColor(input)) {
        return undefined;
    }
    const seed = parseHex(input);
    if (seed == null) {
        return undefined;
    }

    const color = formatHex(seed);

    // Generate approximate colors: subject to change: no contrast guarantee
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

function isHexColor(input: string) {
    return input.startsWith("#") && (input.length === 4 || input.length === 7);
}
