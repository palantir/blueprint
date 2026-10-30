/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

/* eslint-disable sort-keys */

import { differenceEuclidean, displayable } from "culori";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "@blueprintjs/test-commons/vitest";

import {
    CHROMATIC_FAMILIES,
    createMonotoneInterpolator,
    generatePaletteRamps,
    GRAY_RAMP_FAMILY,
    legacyPaletteFromTokens,
    toRampTokens,
} from "./paletteRamp";

const TOKENS_DIR = join(dirname(fileURLToPath(import.meta.url)), "tokens", "base");

const readJson = (path: string): unknown => JSON.parse(readFileSync(path, "utf8"));

const legacyPalette = legacyPaletteFromTokens(readJson(join(TOKENS_DIR, "palette.tokens.json")));
const ramps = generatePaletteRamps(legacyPalette);

/** Smallest perceptible lightness difference between adjacent steps (about one JND in OKLab). */
const MIN_STEP_LIGHTNESS_DIFFERENCE = 0.02;

describe("generatePaletteRamps", () => {
    it("reuses every BP6 chromatic color verbatim, exactly once, in its own ramp", () => {
        for (const family of CHROMATIC_FAMILIES) {
            const ramp = ramps.find(r => r.family === family);
            const hexes = ramp?.swatches.map(swatch => swatch.hex) ?? [];
            for (const hex of Object.values(legacyPalette[family])) {
                expect(
                    hexes.filter(value => value === hex.toLowerCase()),
                    `${family} ${hex}`,
                ).toHaveLength(1);
            }
        }
    });

    it("reuses BP6 grays verbatim at the steps they were adopted for", () => {
        const gray = ramps.find(ramp => ramp.family === GRAY_RAMP_FAMILY);
        for (const swatch of gray?.swatches ?? []) {
            if (swatch.source !== undefined) {
                expect(swatch.hex).toBe(legacyPalette[swatch.source.family][swatch.source.shade].toLowerCase());
            }
        }
    });

    it("places BP6 colors on the steps closest to their lightness", () => {
        const placements = Object.fromEntries(
            ramps.map(ramp => [
                ramp.family,
                Object.fromEntries(
                    ramp.legacy
                        .filter(color => color.step !== undefined)
                        .map(color => [`${color.family}${color.shade}`, color.step]),
                ),
            ]),
        );
        const standard = (family: string) => ({
            [`${family}5`]: 300,
            [`${family}4`]: 400,
            [`${family}3`]: 500,
            [`${family}2`]: 600,
            [`${family}1`]: 700,
        });

        expect(placements).toEqual({
            blue: standard("blue"),
            green: standard("green"),
            orange: { orange5: 200, orange4: 300, orange3: 500, orange2: 600, orange1: 700 },
            red: standard("red"),
            vermilion: standard("vermilion"),
            rose: standard("rose"),
            violet: { violet5: 300, violet4: 400, violet3: 600, violet2: 700, violet1: 800 },
            indigo: standard("indigo"),
            cerulean: standard("cerulean"),
            turquoise: { turquoise5: 200, turquoise4: 300, turquoise3: 500, turquoise2: 600, turquoise1: 800 },
            forest: standard("forest"),
            lime: { lime5: 100, lime4: 200, lime3: 400, lime2: 600, lime1: 700 },
            gold: { gold5: 200, gold4: 300, gold3: 400, gold2: 600, gold1: 700 },
            sepia: standard("sepia"),
            gray: {
                "light-gray4": 100,
                "light-gray1": 200,
                gray4: 300,
                gray3: 400,
                gray2: 500,
                gray1: 600,
                "dark-gray3": 800,
                "dark-gray1": 900,
            },
        });
    });

    it("orders every ramp from lightest to darkest with perceptible steps", () => {
        for (const ramp of ramps) {
            ramp.swatches.slice(1).forEach((swatch, index) => {
                const lighter = ramp.swatches[index];
                expect(
                    lighter.oklch.l - swatch.oklch.l,
                    `${ramp.family}-${lighter.step} → ${ramp.family}-${swatch.step}`,
                ).toBeGreaterThanOrEqual(MIN_STEP_LIGHTNESS_DIFFERENCE);
            });
        }
    });

    it("generates in-gamut colors whose hex matches their recorded OKLCH value", () => {
        for (const ramp of ramps) {
            for (const swatch of ramp.swatches.filter(s => s.source === undefined)) {
                const color = { mode: "oklch" as const, ...swatch.oklch };
                expect(displayable(color), `${ramp.family}-${swatch.step}`).toBe(true);
                expect(differenceEuclidean("oklch")(color, swatch.hex)).toBeLessThan(0.005);
            }
        }
    });

    it("matches the committed ramp tokens (run `pnpm build:palette-ramp` to update)", () => {
        expect(readJson(join(TOKENS_DIR, "palette", "ramp.tokens.json"))).toEqual(toRampTokens(ramps));
    });
});

describe("createMonotoneInterpolator", () => {
    const interpolate = createMonotoneInterpolator([0, 1, 4], [0, 2, 3]);

    it("passes through every sample", () => {
        expect(interpolate(0)).toBe(0);
        expect(interpolate(1)).toBe(2);
        expect(interpolate(4)).toBe(3);
    });

    it("holds the end values outside the sampled range", () => {
        expect(interpolate(-1)).toBe(0);
        expect(interpolate(10)).toBe(3);
    });

    it("stays monotonic between unevenly spaced samples", () => {
        const values = Array.from({ length: 41 }, (_value, i) => interpolate(i / 10));
        values.slice(1).forEach((value, index) => expect(value).toBeGreaterThanOrEqual(values[index]));
        expect(Math.max(...values)).toBeLessThanOrEqual(3);
    });
});
