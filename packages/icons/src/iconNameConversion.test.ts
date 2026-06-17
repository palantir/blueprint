/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
 */

import { describe, expect, it } from "vitest";

import { getNextIconName, LegacyToNextIconNameMap } from "./iconNameConversion";

describe("getNextIconName", () => {
    it("maps a legacy icon name to its next-generation equivalent", () => {
        expect(getNextIconName("add")).toBe("circle-plus");
    });

    it("maps icons whose name is unchanged across sets", () => {
        expect(getNextIconName("crystal-ball")).toBe("crystal-ball");
    });
});

describe("LegacyToNextIconNameMap", () => {
    it("is non-empty and exposes the raw mapping", () => {
        expect(Object.keys(LegacyToNextIconNameMap).length).toBeGreaterThan(0);
        expect(LegacyToNextIconNameMap.add).toBe("circle-plus");
    });
});
