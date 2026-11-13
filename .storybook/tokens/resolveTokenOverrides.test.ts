/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { describe, expect, it } from "vitest";

import { type ManualTokenOverrides, resolveTokenOverrides } from "./resolveTokenOverrides";

describe("resolveTokenOverrides", () => {
    it("derives the current recipe from saved colors in each theme", () => {
        const inputs = { primary: { color: "#2d72d2" } };
        const light = resolveTokenOverrides(inputs, undefined, "light");
        const dark = resolveTokenOverrides(inputs, undefined, "dark");
        expect(light["--bp-intent-primary-hover"]).toBe("#2662b6");
        expect(light["--bp-intent-primary-active"]).toBe("#1f539b");
        expect(dark["--bp-intent-primary-hover"]).toBe(light["--bp-intent-primary-hover"]);
        expect(light["--bp-typography-color-primary-rest"]).toBe("#2662b6");
        expect(dark["--bp-typography-color-primary-rest"]).toBe("#75a2e4");
        expect(light).not.toHaveProperty("--bp-intent-warning-rest");
        expect(inputs).toEqual({ primary: { color: "#2d72d2" } });
    });

    it("keeps deliberate manual choices over generation and preserves unrelated values", () => {
        const manual: ManualTokenOverrides = {
            "--bp-intent-primary-rest": "#112233",
            "--bp-surface-border-radius": "12px",
        };
        const result = resolveTokenOverrides({ primary: { color: "#2d72d2" } }, manual, "light");
        expect(result["--bp-intent-primary-rest"]).toBe("#112233");
        expect(result["--bp-intent-primary-hover"]).toBe("#2662b6");
        expect(result["--bp-surface-border-radius"]).toBe("12px");
        expect(manual).toEqual({ "--bp-intent-primary-rest": "#112233", "--bp-surface-border-radius": "12px" });
    });

    it.each(["light", "dark"] as const)("restores the cascade for an explicit token reset in %s mode", theme => {
        const manual: ManualTokenOverrides = { "--bp-intent-primary-rest": null };
        const result = resolveTokenOverrides({ primary: { color: "#2d72d2" } }, manual, theme);
        expect(result).not.toHaveProperty("--bp-intent-primary-rest");
        expect(result["--bp-intent-primary-hover"]).toBe("#2662b6");
        expect(manual["--bp-intent-primary-rest"]).toBeNull();
    });

    it.each([null, "#112233"])("releases warning's generated Button override for a manual choice of %s", value => {
        const inputs = { warning: { color: "#a34fc2" } };
        expect(resolveTokenOverrides(inputs, undefined, "light")["--bp6-button-warning-rest"]).toBe("#a34fc2");
        for (const theme of ["light", "dark"] as const) {
            const result = resolveTokenOverrides(inputs, { "--bp-intent-warning-rest": value }, theme);
            expect(result).not.toHaveProperty("--bp6-button-warning-rest");
            expect(result["--bp-intent-warning-rest"]).toBe(value ?? undefined);
            expect(result["--bp-intent-warning-hover"]).toBe("#8d44a8");
        }
    });

    it("does not generate overrides for an untouched theme", () => {
        expect(resolveTokenOverrides(undefined, undefined, "light")).toEqual({});
    });
});
