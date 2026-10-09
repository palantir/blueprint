/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

import { wcagContrast } from "culori";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "@blueprintjs/test-commons/vitest";

type ColorScale = Record<string, { $value: string; $description?: string }>;

const LIGHT = readColorScales("base/palette.tokens.json");
const DARK = readColorScales("themes/dark/palette.dark.tokens.json");
const FAMILIES = [
    "grey",
    "blue",
    "green",
    "orange",
    "red",
    "vermilion",
    "rose",
    "violet",
    "indigo",
    "cerulean",
    "turquoise",
    "forest",
    "lime",
    "gold",
    "sepia",
];

describe("Functional palette tokens", () => {
    it.each(FAMILIES)("defines all 13 named light and dark roles for %s", family => {
        for (const theme of [LIGHT, DARK]) {
            for (let step = 1; step <= 13; step++) {
                expect(theme[family]?.[step]?.$value).toBeTypeOf("string");
                expect(theme[family]?.[step]?.$description).toBeTruthy();
            }
            expect(theme[family]?.contrast?.$value).toBeTruthy();
        }
    });

    it.each(FAMILIES)("provides accessible rest, hover, and active solid foregrounds for %s", family => {
        const stateRoles = [
            { foreground: "contrast", step: 9 },
            { foreground: "contrast-hover", step: 10 },
            { foreground: "contrast-active", step: 11 },
        ];
        for (const theme of [LIGHT, DARK]) {
            for (const { foreground, step } of stateRoles) {
                const token = theme[family]?.[foreground];
                expect(token?.$value).toBeTypeOf("string");
                expect(wcagContrast(resolveColor(token.$value), theme[family][step].$value)).toBeGreaterThanOrEqual(
                    4.5,
                );
            }
        }
    });

    it("retains the original four intent rest contrast anchors in both themes", () => {
        for (const theme of [LIGHT, DARK]) {
            for (const family of ["blue", "green", "red"]) {
                expect(theme[family].contrast.$value).toBe("{color.white}");
            }
            expect(theme.orange.contrast.$value).toBe("{color.black}");
        }
    });

    it("retains established light and dark Button and foreground anchors", () => {
        expect(LIGHT.grey[3].$value).toBe("color(srgb 0.968627 0.97098 0.974314)");
        expect(LIGHT.grey[4].$value).toBe("color(srgb 0.932588 0.935412 0.939647)");
        expect(LIGHT.grey[5].$value).toBe("color(srgb 0.875137 0.878902 0.884549)");
        expect(LIGHT.grey[12].$value).toBe("#5f6b7c");
        expect(LIGHT.grey[13].$value).toBe("#1c2127");
        expect(DARK.grey[3].$value).toBe("color(srgb 0.18902 0.214902 0.25098)");
        expect(DARK.grey[4].$value).toBe("color(srgb 0.144078 0.164078 0.192941)");
        expect(DARK.grey[5].$value).toBe("color(srgb 0.112549 0.127843 0.149412)");
        expect(DARK.grey[13].$value).toBe("#ffffff");
        for (const theme of [LIGHT, DARK]) {
            expect([9, 10, 11].map(step => theme.blue[step].$value)).toEqual(["#2d72d2", "#215db0", "#184a90"]);
            expect([9, 10, 11].map(step => theme.green[step].$value)).toEqual(["#238551", "#1c6e42", "#165a36"]);
            expect([9, 10, 11].map(step => theme.red[step].$value)).toEqual(["#cd4246", "#ac2f33", "#8e292c"]);
            expect([9, 10, 11].map(step => theme.orange[step].$value)).toEqual([
                "#fbb360",
                "oklch(0.748641 0.125922 66.762)",
                "oklch(0.614901 0.111016 64.9146)",
            ]);
        }
        expect(DARK.blue[13].$value).toBe("oklch(0.77575 0.0833385 257.636)");
        expect(DARK.green[13].$value).toBe("oklch(0.75585 0.0650323 155.185)");
        expect(DARK.orange[13].$value).toBe("oklch(0.810316 0.0743826 61.8306)");
        expect(DARK.red[13].$value).toBe("oklch(0.776676 0.0929155 22.9394)");
    });
});

function resolveColor(value: string): string {
    const alias = /^\{color\.([^.}]+)\}$/.exec(value);
    if (alias == null) {
        return value;
    }
    const literal = valueAtPath(LIGHT, `${alias[1]}.$value`);
    if (typeof literal !== "string") {
        throw new Error(`Missing shared color literal: ${value}`);
    }
    return literal;
}

describe("Dark semantic token scope", () => {
    const intent = readTokenDocument("themes/dark/intent.tokens.json", "intent");
    const text = readTokenDocument("themes/dark/text.tokens.json", "text");
    const families = {
        danger: "red",
        neutral: "grey",
        primary: "blue",
        success: "green",
        warning: "orange",
    };

    it.each(Object.entries(families))("rebinds every functional %s role in dark scope", (name, family) => {
        const roles = {
            "background.active": "5",
            "background.hover": "4",
            "background.rest": "3",
            "background.subtle": "2",
            "border.hover": "8",
            "border.rest": "7",
            "border.subtle": "6",
            "solid.active": "11",
            "solid.hover": "10",
            "solid.rest": "9",
        };
        for (const [role, step] of Object.entries(roles)) {
            expect(valueAtPath(intent, `${name}.${role}.$value`)).toBe(`{color.${family}.${step}}`);
        }
        expect(valueAtPath(intent, `${name}.solid.foreground.$value`)).toBe(`{color.${family}.contrast}`);
        expect(valueAtPath(text, `color.${name}.default.$value`)).toBe(`{color.${family}.13}`);
        expect(valueAtPath(text, `color.${name}.muted.$value`)).toBe(`{color.${family}.12}`);
    });

    it("preserves the legacy disabled foreground expressions", () => {
        expect(valueAtPath(text, "color.neutral.disabled.$value")).toBe("{typography.color-default.disabled}");
        expect(valueAtPath(intent, "primary.solid.foreground-disabled.$value")).toBe(
            "color-mix(in oklch, {intent.default.foreground} 30%, transparent)",
        );
        expect(valueAtPath(text, "color.primary.disabled.$value")).toBe(
            "color-mix(in oklch, color-mix(in oklch, {intent.primary.rest} 51%, {palette.white}) 50%, transparent)",
        );
    });

    it("preserves BP6 warning disabled recipes instead of deriving from the orange solid anchor", () => {
        const lightIntent = readTokenDocument("base/intent.tokens.json", "intent");
        const lightText = readTokenDocument("base/text.tokens.json", "text");
        for (const document of [lightIntent, intent]) {
            expect(valueAtPath(document, "warning.solid.disabled.$value")).toBe(
                "color-mix(in oklch, {intent.warning.rest} 40%, transparent)",
            );
            expect(valueAtPath(document, "warning.solid.disabled.$extensions")).toBeUndefined();
        }
        expect(valueAtPath(intent, "warning.solid.foreground-disabled.$value")).toBe(
            "color-mix(in oklch, {intent.warning.foreground} 50%, transparent)",
        );
        expect(valueAtPath(lightText, "color.warning.disabled.$value")).toBe(
            "color-mix(in oklch, {intent.warning.hover} 40%, transparent)",
        );
        expect(valueAtPath(text, "color.warning.disabled.$value")).toBe(
            "color-mix(in oklch, color-mix(in oklch, {intent.warning.rest} 53%, {palette.white}) 50%, transparent)",
        );
    });
});

function readColorScales(path: string): Record<string, ColorScale> {
    // These are repository-owned DTCG fixtures; the tests validate their required role values below.
    return readTokenDocument(path, "color") as Record<string, ColorScale>;
}

function readTokenDocument(path: string, group: string): unknown {
    const tokens: unknown = JSON.parse(
        readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), "tokens", path), "utf8"),
    );
    return valueAtPath(tokens, group);
}

function valueAtPath(document: unknown, path: string): unknown {
    return path.split(".").reduce<unknown>((node, key) => {
        if (node != null && typeof node === "object" && key in node) {
            // The presence check above permits indexing this token object without assuming its child shape.
            return (node as Record<string, unknown>)[key];
        }
        return undefined;
    }, document);
}
