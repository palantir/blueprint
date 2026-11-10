/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
 */

import { describe, expect, it } from "vitest";

// @ts-expect-error -- build-time validation scripts intentionally do not emit TypeScript declarations.
import { validateIconNameMap } from "../scripts/iconNameMapValidation.mjs";

describe("validateIconNameMap", () => {
    const legacyIconNames = new Set(["current"]);
    const nextIconNames = new Set(["next"]);

    it("allows historical legacy keys which no longer have SVGs", () => {
        const iconNameMap = { current: "next", historical: "next" };

        expect(validateIconNameMap(JSON.stringify(iconNameMap), iconNameMap, legacyIconNames, nextIconNames)).toEqual(
            [],
        );
    });

    it("still requires current legacy coverage", () => {
        expect(validateIconNameMap("{}", {}, legacyIconNames, nextIconNames)).toContain(
            'legacy icon "current" has no entry in icons-name-map.json',
        );
    });

    it("still requires historical keys to target a current next icon", () => {
        const iconNameMap = { current: "next", historical: "removed" };

        expect(validateIconNameMap(JSON.stringify(iconNameMap), iconNameMap, legacyIconNames, nextIconNames)).toContain(
            'icons-name-map.json maps "historical" to "removed", which is not a next icon (no resources/icons/next/outlined/removed.svg)',
        );
    });
});
