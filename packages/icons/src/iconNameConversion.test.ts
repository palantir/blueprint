/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
 */

import { describe, expect, expectTypeOf, it } from "vitest";

import {
    iconNameToIconNextName,
    type LegacyIconName,
    legacyIconNameToIconNextName,
    LegacyToIconNextNameMap,
} from "./iconNameConversion";
import type { IconName } from "./iconNames";
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

    it("has a guaranteed return type for known ledger names", () => {
        const legacyName: LegacyIconName = "home";
        const currentLegacyName: IconName = "home";

        expectTypeOf(legacyIconNameToIconNextName(legacyName)).toEqualTypeOf<IconNextName>();
        expectTypeOf(legacyIconNameToIconNextName(currentLegacyName)).toEqualTypeOf<IconNextName>();
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
        const arbitraryName = "home" as string;

        expectTypeOf(iconNameToIconNextName(iconName)).toEqualTypeOf<IconNextName>();
        expectTypeOf(iconNameToIconNextName(arbitraryName)).toEqualTypeOf<IconNextName | undefined>();
    });
});
