/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { oklab, parseHex } from "culori";
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
        "#010101",
        "#010002",
        "#fefefe",
        "#fffffe",
        "#ffffff",
    ])("returns eight deterministic, ordered opaque shades preserving %s at index 5", seed => {
        const palette = generatePalette(seed);
        assert(palette !== undefined);
        expect(palette).toHaveLength(8);
        expect(palette[5]).toBe(seed);
        expect(generatePalette(seed)).toEqual(palette);

        let previousLightness = 1;
        for (const color of palette) {
            expect(color).toMatch(/^#[\da-f]{6}$/);
            const lab = oklab(color);
            assert(lab !== undefined);
            expect(lab.l).toBeLessThanOrEqual(previousLightness + 0.005);
            previousLightness = lab.l;
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
        expect(palette[5]).toBe(normalized);
        expect(palette).toEqual(generatePalette(normalized));
    });

    it("keeps every grayscale byte value achromatic", () => {
        for (let byte = 0; byte <= 255; byte++) {
            const channel = byte.toString(16).padStart(2, "0");
            const palette = generatePalette(`#${channel.repeat(3)}`);
            assert(palette !== undefined);
            for (const color of palette) {
                const rgb = parseHex(color);
                assert(rgb !== undefined);
                expect(rgb.r).toBe(rgb.g);
                expect(rgb.g).toBe(rgb.b);
            }
        }
    });

    it("retains the tint of a neutral seed in lighter and darker shades", () => {
        const palette = generatePalette("#7c6a59");
        assert(palette !== undefined);
        for (const color of palette) {
            const rgb = parseHex(color);
            assert(rgb !== undefined);
            expect(rgb.r).toBeGreaterThan(rgb.g);
            expect(rgb.g).toBeGreaterThan(rgb.b);
        }
    });

    it("does not reserve entries for white or black", () => {
        const palette = generatePalette("#2d72d2");
        expect(palette).not.toContain("#ffffff");
        expect(palette).not.toContain("#000000");
    });

    it("permits repeated shades for extreme seeds without moving the seed", () => {
        expect(generatePalette("#000000")?.slice(5)).toEqual(["#000000", "#000000", "#000000"]);
        expect(generatePalette("#ffffff")?.slice(0, 6)).toEqual(Array(6).fill("#ffffff"));
    });

    it.each(["", "#12", "#12345g", "#1234567", "#0000", "#123456ff", "red", "rgb(0 0 0)", " #123", "#123\n", "123456"])(
        "returns no palette for unsupported input %j",
        input => {
            expect(generatePalette(input)).toBeUndefined();
        },
    );
});
