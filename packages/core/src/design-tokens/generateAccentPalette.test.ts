/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

import { rgb, wcagContrast, wcagLuminance } from "culori";

import { describe, expect, it } from "@blueprintjs/test-commons/vitest";

import { generateAccentPalette } from "./generateAccentPalette";

describe("generateAccentPalette", () => {
    it.each(["", " ", "#", "#12", "#1234", "#12345", "#1234567", "#12345678", "#gggggg", "red", "rgb(0,0,0)"])(
        "rejects invalid hex input %j without a palette",
        hex => {
            expect(generateAccentPalette(hex)).toBeUndefined();
        },
    );

    it.each([
        ["#3CDDDA", "#3cddda"],
        ["3CDDDA", "#3cddda"],
        ["  #abc  ", "#aabbcc"],
        [" ABC ", "#aabbcc"],
        ["#fff", "#ffffff"],
        ["000", "#000000"],
    ])("preserves the exact normalized accent as solid step 9 for %j", (input, normalized) => {
        const result = generateAccentPalette(input);
        expect(result).toBeDefined();
        expect(result?.light.steps).toHaveLength(13);
        expect(result?.dark.steps).toHaveLength(13);
        expect(result?.light.steps[8]).toBe(normalized);
        expect(result?.dark.steps[8]).toBe(normalized);
    });

    it.each([
        "3CDDDA",
        "ffffff",
        "fefefe",
        "000000",
        "010101",
        "020202",
        "777777",
        "7f7f7f",
        "ffffaa",
        "111111",
        "ff0000",
        "0000ff",
        "ffff00",
    ])("generates accessible solid states and foreground roles for %s", input => {
        const result = generateAccentPalette(input);
        expect(result).toBeDefined();
        for (const palette of [result!.light, result!.dark]) {
            expect(new Set(palette.steps.slice(8, 11)).size).toBe(3);
            for (const solid of palette.steps.slice(8, 11)) {
                expect(wcagContrast(palette.contrast, solid)).toBeGreaterThanOrEqual(4.5);
            }
            for (const foreground of palette.steps.slice(11, 13)) {
                for (const background of palette.steps.slice(0, 5)) {
                    expect(wcagContrast(foreground, background)).toBeGreaterThanOrEqual(4.5);
                }
            }
            for (const color of [...palette.steps, palette.contrast]) {
                expect(color).toMatch(/^#[\da-f]{6}$/);
                const channels = rgb(color);
                expect(channels).toBeDefined();
                for (const channel of [channels!.r, channels!.g, channels!.b]) {
                    expect(Number.isFinite(channel)).toBe(true);
                    expect(channel).toBeGreaterThanOrEqual(0);
                    expect(channel).toBeLessThanOrEqual(1);
                }
            }
        }
    });

    it("assigns progressively stronger surface and border roles in each theme", () => {
        const result = generateAccentPalette("3CDDDA")!;
        expect(new Set(result.light.steps).size).toBe(13);
        expect(new Set(result.dark.steps).size).toBe(13);
        const lightLuminance = result.light.steps.slice(0, 8).map(color => wcagLuminance(color));
        const darkLuminance = result.dark.steps.slice(0, 8).map(color => wcagLuminance(color));
        for (let index = 1; index < 8; index++) {
            expect(lightLuminance[index]).toBeLessThan(lightLuminance[index - 1]);
            expect(darkLuminance[index]).toBeGreaterThan(darkLuminance[index - 1]);
        }
        expect(wcagLuminance(result.light.steps[12])).toBeLessThan(wcagLuminance(result.light.steps[11]));
        expect(wcagLuminance(result.dark.steps[12])).toBeGreaterThan(wcagLuminance(result.dark.steps[11]));
    });

    it.each(["000000", "777777", "ffffff"])("keeps achromatic input %s achromatic", input => {
        const result = generateAccentPalette(input)!;
        for (const color of [...result.light.steps, ...result.dark.steps]) {
            const channels = rgb(color)!;
            expect(
                Math.max(channels.r, channels.g, channels.b) - Math.min(channels.r, channels.g, channels.b),
            ).toBeLessThan(1 / 255);
        }
    });

    it("is deterministic and does not share mutable palette arrays between calls", () => {
        const first = generateAccentPalette("3CDDDA")!;
        const second = generateAccentPalette("3CDDDA")!;
        expect(first).toEqual(second);
        expect(first.light.steps).not.toBe(second.light.steps);
        expect(first.dark.steps).not.toBe(second.dark.steps);
    });
});
