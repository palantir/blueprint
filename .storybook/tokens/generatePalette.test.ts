/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { assert, describe, expect, it } from "vitest";

import { generatePalette } from "./generatePalette";

describe("generatePalette", () => {
    it.each([
        "#5f6b7c", // BP6 family seeds
        "#2d72d2",
        "#238551",
        "#c87619",
        "#cd4246",
        "#ff0000", // Saturated sRGB boundaries
        "#00ff00",
        "#0000ff",
        "#ffff00",
        "#ff00ff",
        "#00ffff",
        "#808080", // Achromatic and tinted neutrals
        "#7c6a59",
        "#ffd700", // Bright
        "#000000", // Exact and near extremes, including tinted inputs
        "#050505",
        "#010101",
        "#010002",
        "#fefefe",
        "#fffffe",
        "#ffffff",
    ])("returns ten deterministic CSS colors preserving %s at index 6", seed => {
        const palette = generatePalette(seed);
        assert(palette !== undefined);
        expect(palette).toHaveLength(10);
        expect(palette[6]).toBe(seed);
        expect(generatePalette(seed)).toEqual(palette);

        for (const [index, color] of palette.entries()) {
            if (index !== 6) {
                expect(color).toMatch(new RegExp(`^color-mix\\(in oklab, ${seed}, (white|black) \\d+%\\)$`));
            }
        }
    });

    it.each([
        ["#AbC", "#aabbcc"],
        ["#F0a", "#ff00aa"],
        ["#2D72D2", "#2d72d2"],
        ["#000", "#000000"],
        ["#FFF", "#ffffff"],
    ])("normalizes %s to the same palette as %s", (input, normalized) => {
        const palette = generatePalette(input);
        assert(palette !== undefined);
        expect(palette[6]).toBe(normalized);
        expect(palette).toEqual(generatePalette(normalized));
    });

    it("expresses the shade spacing as Oklab mixes and leaves the seed as hex", () => {
        expect(generatePalette("#2d72d2")).toEqual([
            "color-mix(in oklab, #2d72d2, white 92%)",
            "color-mix(in oklab, #2d72d2, white 81%)",
            "color-mix(in oklab, #2d72d2, white 60%)",
            "color-mix(in oklab, #2d72d2, white 37%)",
            "color-mix(in oklab, #2d72d2, white 18%)",
            "color-mix(in oklab, #2d72d2, white 6%)",
            "#2d72d2",
            "color-mix(in oklab, #2d72d2, black 14%)",
            "color-mix(in oklab, #2d72d2, black 24%)",
            "color-mix(in oklab, #2d72d2, black 34%)",
        ]);
    });

    it("does not reserve entries for white or black", () => {
        const palette = generatePalette("#2d72d2");
        expect(palette).not.toContain("#ffffff");
        expect(palette).not.toContain("#000000");
    });

    it.each(["", "#12", "#12345g", "#1234567", "#0000", "#123456ff", "red", "rgb(0 0 0)", " #123", "#123\n", "123456"])(
        "returns no palette for unsupported input %j",
        input => {
            expect(generatePalette(input)).toBeUndefined();
        },
    );
});
