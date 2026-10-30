/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
 */

import { describe, expect, it } from "vitest";

// @ts-expect-error -- build-time validation scripts intentionally do not emit TypeScript declarations.
import { validateIconNameMap } from "../scripts/iconNameMapValidation.mjs";

describe("validateIconNameMap", () => {
    const legacyIconNames = new Set(["current"]);
    const nextIconNames = new Set(["next"]);

    it("rejects keys which are not current legacy icon names", () => {
        const iconNameMap = { current: "next", historical: "next" };

        expect(validateIconNameMap(JSON.stringify(iconNameMap), iconNameMap, legacyIconNames, nextIconNames)).toContain(
            'icons-name-map.json has entry for unknown legacy icon "historical"',
        );
    });

    it("still requires current legacy coverage", () => {
        expect(validateIconNameMap("{}", {}, legacyIconNames, nextIconNames)).toContain(
            'legacy icon "current" has no entry in icons-name-map.json',
        );
    });

    it("requires mappings to target a current next icon", () => {
        const iconNameMap = { current: "removed" };

        expect(validateIconNameMap(JSON.stringify(iconNameMap), iconNameMap, legacyIconNames, nextIconNames)).toContain(
            'icons-name-map.json maps "current" to "removed", which is not a next icon (no resources/icons/next/outlined/removed.svg)',
        );
    });
});
