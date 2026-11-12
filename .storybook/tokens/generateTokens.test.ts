/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { parse, wcagContrast } from "culori";
import { describe, expect, it } from "vitest";

import opaqueTokenSource from "../../packages/core/src/design-tokens/tokens/base/opaque.tokens.json";
import paletteTokenSource from "../../packages/core/src/design-tokens/tokens/base/palette.tokens.json";
import darkOpaqueTokenSource from "../../packages/core/src/design-tokens/tokens/themes/dark/opaque.tokens.json";

import { generateTokens } from "./generateTokens";
import { INTENTS, STORYBOOK_BACKGROUNDS, TOKEN_CONFIG } from "./tokens";

describe("generateTokens", () => {
    it.each(INTENTS)("returns a flat map of existing %s CSS custom properties", intent => {
        const tokens = generateTokens("#ffcc00", { intent });

        expect(tokens[`--bp-${intent}-base`]).toEqual({ dark: "#ffcc00", light: "#ffcc00" });
        expect(tokens[`--bp-${intent}-background-solid-rest`]).toEqual(tokens[`--bp-${intent}-base`]);
        for (const [name, values] of Object.entries(tokens)) {
            expect(name.startsWith(`--bp-${intent}-`)).toBe(true);
            expect(TOKEN_CONFIG).toHaveProperty(name);
            expect(Object.keys(values).sort()).toEqual(["dark", "light"]);
            for (const value of Object.values(values)) {
                expect(typeof value).toBe("string");
                expect(parse(value)).toBeDefined();
            }
        }
        for (const role of [
            "background-solid-disabled",
            "text-disabled",
            "border-alpha-rest",
            "layer-hover",
            "layer-active",
        ]) {
            expect(tokens).not.toHaveProperty(`--bp-${intent}-${role}`);
        }
    });

    it.each(["rebeccapurple", "#000", "#fff", "#888", "rgb(255 128 0)", "oklch(65% 0.2 250)"])(
        "preserves declared contrast targets for %s in both themes",
        color => {
            const tokens = generateTokens(color, { intent: "neutral" });
            for (const theme of ["light", "dark"] as const) {
                const surface = STORYBOOK_BACKGROUNDS[theme];
                expect(wcagContrast(tokens["--bp-neutral-border-strong-rest"][theme], surface)).toBeGreaterThanOrEqual(
                    3,
                );
                for (const [role, minimum] of [
                    ["muted", 4.5],
                    ["normal", 7],
                    ["strong", 11],
                ] as const) {
                    expect(wcagContrast(tokens[`--bp-neutral-text-${role}`][theme], surface)).toBeGreaterThanOrEqual(
                        minimum,
                    );
                }
                for (const state of ["rest", "hover", "active"]) {
                    expect(
                        wcagContrast(
                            tokens[`--bp-neutral-background-solid-${state}`][theme],
                            tokens["--bp-neutral-text-on-solid"][theme],
                        ),
                    ).toBeGreaterThanOrEqual(4.5);
                }
                expect(tokens).not.toHaveProperty("--bp-opacity-disabled");
            }
        },
    );

    it.each(["light", "dark"] as const)("generates exactly the palette-backed roles in %s mode", theme => {
        const tokens = Object.fromEntries(
            INTENTS.flatMap(intent => Object.entries(generateTokens("#336699", { intent }))),
        );
        const expectedNames = [
            ...new Set([
                ...collectPaletteBackedNames(opaqueTokenSource),
                ...collectPaletteBackedNames(darkOpaqueTokenSource),
            ]),
        ];

        expect(Object.keys(tokens).sort()).toEqual(expectedNames.sort());
        for (const values of Object.values(tokens)) {
            const value = values[theme];
            expect(value).not.toContain("var(");
        }
    });

    it("returns theme-specific values together without changing the seed", () => {
        const tokens = generateTokens("#336699", { intent: "primary" });

        expect(tokens["--bp-primary-base"].dark).toBe(tokens["--bp-primary-base"].light);
        expect(tokens["--bp-primary-text-normal"].dark).not.toBe(tokens["--bp-primary-text-normal"].light);
    });

    it("uses the fixed Storybook preview backgrounds", () => {
        expect(STORYBOOK_BACKGROUNDS).toEqual({
            dark: paletteTokenSource.palette.black.$value,
            light: paletteTokenSource.palette.white.$value,
        });
    });
});

function collectPaletteBackedNames(source: unknown, path: readonly string[] = []): string[] {
    if (typeof source !== "object" || source === null) {
        return [];
    }
    if ("$value" in source) {
        return typeof source.$value === "string" && source.$value.startsWith("{palette.")
            ? [`--bp-${path.join("-")}`]
            : [];
    }
    return Object.entries(source).flatMap(([name, value]) =>
        name.startsWith("$") ? [] : collectPaletteBackedNames(value, [...path, name]),
    );
}
