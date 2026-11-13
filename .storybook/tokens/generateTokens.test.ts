/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { assert, describe, expect, it } from "vitest";

import { GENERATED_TOKEN_NAMES, generateTokens, getFamilyTokenNames, TOKEN_FAMILIES } from "./generateTokens";

describe("generateTokens", () => {
    it("assigns only primary's nine source roles using the current palette in each mode", () => {
        const result = generateTokens({ primary: { color: "#2D72D2" } });
        // Approved role expectations, including the 10%/20% dark steps.
        expect(result).toEqual({
            dark: {
                "--bp-intent-primary-active": "#1f539b",
                "--bp-intent-primary-disabled": "#528adb",
                "--bp-intent-primary-foreground": "#ffffff",
                "--bp-intent-primary-hover": "#2662b6",
                "--bp-intent-primary-rest": "#2d72d2",
                "--bp-typography-color-primary-active": "#97baec",
                "--bp-typography-color-primary-disabled": "#528adb",
                "--bp-typography-color-primary-hover": "#75a2e4",
                "--bp-typography-color-primary-rest": "#75a2e4",
            },
            light: {
                "--bp-intent-primary-active": "#1f539b",
                "--bp-intent-primary-disabled": "#528adb",
                "--bp-intent-primary-foreground": "#ffffff",
                "--bp-intent-primary-hover": "#2662b6",
                "--bp-intent-primary-rest": "#2d72d2",
                "--bp-typography-color-primary-active": "#1f539b",
                "--bp-typography-color-primary-disabled": "#528adb",
                "--bp-typography-color-primary-hover": "#2662b6",
                "--bp-typography-color-primary-rest": "#2662b6",
            },
        });
    });

    it("leaves every family unchanged when no customization is supplied", () => {
        expect(generateTokens({})).toEqual({ dark: {}, light: {} });
    });

    it.each(["success", "warning", "danger"] as const)("applies the same role mapping to %s alone", family => {
        const result = generateTokens({ [family]: { color: "#2d72d2" } });
        assert(result != null);
        for (const mode of ["light", "dark"] as const) {
            expect(Object.keys(result[mode]).sort()).toEqual(getFamilyTokenNames(family).sort());
            expect(result[mode][`--bp-intent-${family}-rest`]).toBe("#2d72d2");
            expect(result[mode][`--bp-intent-${family}-hover`]).toBe("#2662b6");
            expect(result[mode][`--bp-intent-${family}-active`]).toBe("#1f539b");
            expect(result[mode][`--bp-intent-${family}-disabled`]).toBe("#528adb");
            expect(result[mode][`--bp-intent-${family}-foreground`]).toBe("#ffffff");
            expect(result[mode][`--bp-typography-color-${family}-rest`]).toBe(mode === "light" ? "#2662b6" : "#75a2e4");
            expect(result[mode][`--bp-typography-color-${family}-hover`]).toBe(
                mode === "light" ? "#2662b6" : "#75a2e4",
            );
            expect(result[mode][`--bp-typography-color-${family}-active`]).toBe(
                mode === "light" ? "#1f539b" : "#97baec",
            );
            expect(result[mode][`--bp-typography-color-${family}-disabled`]).toBe("#528adb");
        }
    });

    it("assigns default text separately, leaving its fixed and derived roles to CSS", () => {
        const result = generateTokens({ default: { color: "#2d72d2" } });
        assert(result != null);
        expect(result.light).toEqual({
            "--bp-intent-default-active": "#1f539b",
            "--bp-intent-default-disabled": "#528adb",
            "--bp-intent-default-foreground": "#ffffff",
            "--bp-intent-default-hover": "#2662b6",
            "--bp-intent-default-rest": "#2d72d2",
            "--bp-typography-color-default-active": "#2662b6",
            "--bp-typography-color-default-rest": "#1f539b",
        });
        expect(result.dark).toEqual({
            ...result.light,
            "--bp-typography-color-default-active": "#b9d1f3",
            "--bp-typography-color-default-rest": "#dce8f9",
        });
    });

    it("uses the exact warning seed for BP6's Button rest override in both modes", () => {
        const result = generateTokens({ warning: { color: "#AbC" } });
        assert(result != null);
        for (const mode of ["light", "dark"] as const) {
            expect(result[mode]["--bp6-button-warning-rest"]).toBe("#aabbcc");
            expect(result[mode]["--bp6-button-warning-rest"]).toBe(result[mode]["--bp-intent-warning-rest"]);
        }
        expect(getFamilyTokenNames("warning")).toContain("--bp6-button-warning-rest");
        expect(getFamilyTokenNames("primary")).not.toContain("--bp6-button-warning-rest");
    });

    it("composes all five families with only approved roles and the warning Button override", () => {
        const inputs = {
            danger: { color: "#ba3456" },
            default: { color: "#123456" },
            primary: { color: "#345678" },
            success: { color: "#56789a" },
            warning: { color: "#fedcba" },
        };
        const result = generateTokens(inputs);
        assert(result != null);
        expect(new Set(GENERATED_TOKEN_NAMES).size).toBe(44);
        for (const mode of ["light", "dark"] as const) {
            expect(Object.keys(result[mode]).sort()).toEqual([...GENERATED_TOKEN_NAMES].sort());
            for (const family of TOKEN_FAMILIES) {
                const alone = generateTokens({ [family]: inputs[family] });
                assert(alone != null);
                expect(result[mode]).toMatchObject(alone[mode]);
                expect(result[mode][`--bp-intent-${family}-rest`]).toBe(inputs[family].color);
            }
        }
    });

    it("rejects an invalid family without returning a partially generated theme", () => {
        expect(generateTokens({ primary: { color: "#123456" }, warning: { color: "invalid" } })).toBeUndefined();
    });

    it.each([
        ["#7f7f7f", "#ffffff"],
        ["#808080", "#111418"],
        ["#ffff00", "#111418"],
        ["#00f", "#ffffff"],
    ])("chooses the agreed automatic foreground for %s in both modes", (color, foreground) => {
        const result = generateTokens({ primary: { color } });
        assert(result != null);
        expect(result.light["--bp-intent-primary-foreground"]).toBe(foreground);
        expect(result.dark["--bp-intent-primary-foreground"]).toBe(foreground);
    });

    it("always chooses foreground from the seed, ignoring an obsolete foreground input", () => {
        const primary = { color: "#2d72d2", foreground: "#000000" };
        const result = generateTokens({ primary });
        assert(result != null);
        for (const mode of ["light", "dark"] as const) {
            expect(result[mode]["--bp-intent-primary-foreground"]).toBe("#ffffff");
        }
    });

    it.each(["", "red", "#abcd", "#12345678", "#xyz", "transparent"])("rejects unsupported base input %s", input => {
        expect(generateTokens({ primary: { color: input } })).toBeUndefined();
    });
});
