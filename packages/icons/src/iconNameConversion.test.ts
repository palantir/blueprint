/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
 */

import { describe, expect, expectTypeOf, it } from "vitest";

import {
    getLegacyIconVariant,
    iconNameToIconNextName,
    legacyIconNameToIconNextName,
    LegacyToIconNextNameMap,
} from "./iconNameConversion";
import type { IconName } from "./iconNames";
import { IconsNext, type NextIconVariant } from "./next/iconLoaderNext";
import type { IconNextName } from "./next/iconNextNames";

describe("LegacyToIconNextNameMap", () => {
    it("is non-empty and exposes the raw mapping", () => {
        expect(Object.keys(LegacyToIconNextNameMap).length).toBeGreaterThan(0);
        expect(LegacyToIconNextNameMap.add).toBe("circle-plus");
    });
});

describe("legacyIconNameToIconNextName", () => {
    it("converts renamed and unchanged legacy names", () => {
        expect(legacyIconNameToIconNextName("home")).toBe("house");
        expect(legacyIconNameToIconNextName("airplane")).toBe("airplane");
    });

    it("always interprets ambiguous names as legacy names", () => {
        expect(legacyIconNameToIconNextName("user")).toBe("user-circle");
    });

    it("returns undefined for next-only, unknown, and prototype-like names", () => {
        expect(legacyIconNameToIconNextName("house")).toBeUndefined();
        expect(legacyIconNameToIconNextName("not-an-icon")).toBeUndefined();
        expect(legacyIconNameToIconNextName("constructor")).toBeUndefined();
        expect(legacyIconNameToIconNextName("__proto__")).toBeUndefined();
    });

    it("has a guaranteed return type for known icon names", () => {
        const legacyIconName: IconName = "home";
        const untypedLegacyIconName: string = "home";

        expectTypeOf(legacyIconNameToIconNextName(legacyIconName)).toEqualTypeOf<IconNextName>();
        expectTypeOf(legacyIconNameToIconNextName(untypedLegacyIconName)).toEqualTypeOf<IconNextName | undefined>();
    });
});

describe("getLegacyIconVariant", () => {
    it("returns filled for legacy icons which previously had a filled appearance", () => {
        expect(getLegacyIconVariant("symbol-square")).toBe("filled");
        expect(getLegacyIconVariant("airplane")).toBe("filled");
        expect(getLegacyIconVariant("drawer-left-filled")).toBe("filled");
        expect(getLegacyIconVariant("paragraph")).toBe("filled");
        expect(getLegacyIconVariant("regex")).toBe("filled");
        expect(getLegacyIconVariant("rotate-ccw")).toBe("filled");
        expect(getLegacyIconVariant("rotate-cw")).toBe("filled");
    });

    it("returns outlined for legacy icons which should use the next outlined variant", () => {
        const outlinedLegacyNames = [
            "add",
            "app-header",
            "buggy",
            "chart",
            "diagnosis",
            "drawer-left",
            "group-item",
            "more",
            "pivot-table",
            "playbook",
            "star-empty",
        ] satisfies IconName[];

        outlinedLegacyNames.forEach(iconName => expect(getLegacyIconVariant(iconName)).toBe("outlined"));
    });

    it("preserves legacy variants which collapse to the same next icon name", () => {
        expect(legacyIconNameToIconNextName("star")).toBe("star");
        expect(legacyIconNameToIconNextName("star-empty")).toBe("star");
        expect(getLegacyIconVariant("star")).toBe("filled");
        expect(getLegacyIconVariant("star-empty")).toBe("outlined");
    });

    it("defaults unknown and next-only names to outlined", () => {
        expect(getLegacyIconVariant("house")).toBe("outlined");
        expect(getLegacyIconVariant("not-an-icon")).toBe("outlined");
        expect(getLegacyIconVariant("constructor")).toBe("outlined");
        expect(getLegacyIconVariant("__proto__")).toBe("outlined");
    });

    it("resolves every legacy ledger name and contains the expected filled set", () => {
        const legacyIconNames = Object.keys(LegacyToIconNextNameMap) as IconName[];
        const variants = legacyIconNames.map(getLegacyIconVariant);

        expect(variants).toHaveLength(legacyIconNames.length);
        expect(variants.every(variant => variant === "filled" || variant === "outlined")).toBe(true);
        expect(variants.filter(variant => variant === "filled")).toHaveLength(297);
    });

    it("only returns filled when the mapped next icon provides a filled variant", () => {
        (Object.keys(LegacyToIconNextNameMap) as IconName[])
            .filter(iconName => getLegacyIconVariant(iconName) === "filled")
            .forEach(iconName => {
                const nextIconName = legacyIconNameToIconNextName(iconName);

                expect(IconsNext.hasFilled(nextIconName), `${iconName} -> ${nextIconName}`).toBe(true);
            });
    });

    it("returns a NextIconVariant for arbitrary strings", () => {
        expectTypeOf(getLegacyIconVariant("symbol-square")).toEqualTypeOf<NextIconVariant>();
    });
});

describe("iconNameToIconNextName", () => {
    it("returns canonical next names unchanged", () => {
        expect(iconNameToIconNextName("house")).toBe("house");
        expect(iconNameToIconNextName("airplane")).toBe("airplane");
    });

    it("converts legacy-only names", () => {
        expect(iconNameToIconNextName("home")).toBe("house");
    });

    it("prefers the next icon when a name exists in both sets", () => {
        expect(iconNameToIconNextName("user")).toBe("user");
    });

    it("returns undefined for unknown and prototype-like names", () => {
        expect(iconNameToIconNextName("not-an-icon")).toBeUndefined();
        expect(iconNameToIconNextName("constructor")).toBeUndefined();
        expect(iconNameToIconNextName("__proto__")).toBeUndefined();
    });

    it("has a guaranteed return type for typed icon names", () => {
        const iconName = "home" as IconName | IconNextName;
        const untypedIconName: string = "home";

        expectTypeOf(iconNameToIconNextName(iconName)).toEqualTypeOf<IconNextName>();
        expectTypeOf(iconNameToIconNextName(untypedIconName)).toEqualTypeOf<IconNextName | undefined>();
    });
});
