/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
 */

import { describe, expect, it } from "vitest";

import { LegacyToIconNextNameMap } from "./iconNameConversion";

describe("LegacyToIconNextNameMap", () => {
    it("is non-empty and exposes the raw mapping", () => {
        expect(Object.keys(LegacyToIconNextNameMap).length).toBeGreaterThan(0);
        expect(LegacyToIconNextNameMap.add).toBe("circle-plus");
    });
});
