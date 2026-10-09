/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import meta, { Default } from "../../packages/core/src/design-tokens/FunctionalColors.stories";

afterEach(cleanup);

describe("Functional color story", () => {
    it("renders effective CSS tokens instead of static JSON values", () => {
        const FunctionalColors = meta.component;
        render(<FunctionalColors />);
        const solid = within(screen.getByRole("list", { name: "Blue color scale" })).getAllByRole("listitem")[8];
        expect(solid.querySelector("div")?.style.backgroundColor).toBe("var(--bp-color-blue-9)");
        expect(solid.textContent).toContain("var(--bp-color-blue-9)");
    });

    it("shows complete dark scales with all 13 usage roles", () => {
        const FunctionalColors = meta.component;
        render(<FunctionalColors theme="dark" />);
        expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(15);
        expect(screen.getAllByRole("listitem")).toHaveLength(195);
        expect(screen.queryByText(/not mapped yet/)).toBeNull();
        expect(within(screen.getByRole("list", { name: "Sepia color scale" })).getAllByRole("listitem")).toHaveLength(
            13,
        );
    });

    it("runs dark interaction checks against the intended color family when usage descriptions repeat", async () => {
        const FunctionalColors = meta.component;
        const view = render(<FunctionalColors theme="dark" />);
        // The play function reads canvasElement and globals; Storybook supplies the remaining context in the browser.
        await Default.play?.({
            canvasElement: view.container,
            globals: { theme: "dark" },
        } as unknown as Parameters<NonNullable<typeof Default.play>>[0]);
        expect(screen.getByText("Orange usage notes").closest("details")?.open).toBe(true);
    });

    it.each(["light", "dark"] as const)("uses the correct foreground token for every solid state in %s", theme => {
        const FunctionalColors = meta.component;
        render(<FunctionalColors theme={theme} />);
        const swatches = within(screen.getByRole("list", { name: "Turquoise color scale" })).getAllByRole("listitem");
        expect(swatches).toHaveLength(13);
        for (const [index, suffix] of ["", "-hover", "-active"].entries()) {
            expect(swatches[index + 8].querySelector("div")?.style.color).toBe(
                `var(--bp-color-turquoise-contrast${suffix})`,
            );
        }
    });
});
