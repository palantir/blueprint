/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
 */

import { describe, expect, it } from "vitest";

import { getIconNextName, LegacyToIconNextNameMap } from "./iconNameConversion";
import type { IconName } from "./iconNames";

describe("getIconNextName", () => {
    it("maps a legacy icon name to its next-generation equivalent", () => {
        expect(getIconNextName("add")).toBe("circle-plus");
    });

    it("maps icons whose name is unchanged across sets", () => {
        expect(getIconNextName("crystal-ball")).toBe("crystal-ball");
    });

    it("throws for a legacy name with no next-generation mapping", () => {
        expect(() => getIconNextName("not-a-real-icon" as IconName)).toThrow(/no next-generation icon mapping/i);
    });
});

describe("LegacyToIconNextNameMap", () => {
    it("is non-empty and exposes the raw mapping", () => {
        expect(Object.keys(LegacyToIconNextNameMap).length).toBeGreaterThan(0);
        expect(LegacyToIconNextNameMap.add).toBe("circle-plus");
    });
});
