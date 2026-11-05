/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { render, screen } from "@testing-library/react";

import { describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";
import { Portal } from "../../components/portal/portal";
import type { ThemeAPI } from "../../theme";
import { BlueprintProvider } from "../blueprintProvider";

import { ThemeProvider, type ThemeRepresentations } from "./themeProvider";
import { useBlueprintTheme } from "./useBlueprintTheme";

describe("ThemeProvider", () => {
    it.each([
        undefined,
        null,
        [],
        "theme",
        {},
        { version: "1" },
        { version: 2 },
        { borderRadius: 8, version: 1 },
        { fontFamily: null, version: 1 },
        { fontFamily: ["Arial"], version: 1 },
    ])("clears overrides for an invalid representation: %j", representation => {
        function Consumer() {
            return <span>{JSON.stringify(useBlueprintTheme())}</span>;
        }
        render(
            <ThemeProvider themesByVersion={{ "1": representation }}>
                <Consumer />
            </ThemeProvider>,
        );
        expect(screen.getByText("{}")).toBeInTheDocument();
    });

    it("exposes v1 tokens without adding a DOM wrapper or inspecting future versions", () => {
        const themes = {
            "1": { borderRadius: "8px", fontFamily: "Arial", futureField: true, version: 1 },
            get "2"() {
                throw new Error("Future schemas must not be inspected");
            },
        };
        function Consumer() {
            const tokens = useBlueprintTheme();
            return <div data-testid="root" style={tokens} />;
        }
        const { container } = render(
            <ThemeProvider themesByVersion={themes}>
                <Consumer />
            </ThemeProvider>,
        );
        const root = screen.getByTestId("root");
        expect(container.firstElementChild).toBe(root);
        expect(root.style.getPropertyValue("--bp-surface-border-radius")).toBe("8px");
        expect(root.style.getPropertyValue("--bp-typography-family-default")).toBe("Arial");
    });

    it("updates and clears portal overrides without remounting children or styling the container", () => {
        const mounted = vi.fn();
        const view = (themes?: ThemeRepresentations) => (
            <BlueprintProvider themesByVersion={themes}>
                <Portal onChildrenMount={mounted}>
                    <input aria-label="Portal input" defaultValue="preserved" />
                </Portal>
            </BlueprintProvider>
        );
        const { rerender } = render(view({ "1": { borderRadius: "8px", fontFamily: "Arial", version: 1 } }));
        const input = screen.getByRole("textbox");
        const root = input.parentElement!;
        expect(root.style.getPropertyValue("--bp-surface-border-radius")).toBe("8px");
        expect(root).toHaveClass(Classes.THEME_ROOT);
        expect(root.style.getPropertyValue("--bp-typography-family-default")).toBe("Arial");
        expect(document.body.style.getPropertyValue("--bp-surface-border-radius")).toBe("");
        root.style.setProperty("--unrelated", "keep");

        rerender(view({ "1": { borderRadius: "0px", version: 1 } }));
        expect(screen.getByRole("textbox")).toBe(input);
        expect(root.style.getPropertyValue("--bp-surface-border-radius")).toBe("0px");
        expect(root.style.getPropertyValue("--bp-typography-family-default")).toBe("");

        for (const themes of [{ "1": { borderRadius: 8, version: 1 } }, { "2": { version: 2 } }, undefined]) {
            rerender(view(themes));
            expect(root.style.getPropertyValue("--bp-surface-border-radius")).toBe("");
            expect(root.style.getPropertyValue("--unrelated")).toBe("keep");
        }
        expect(mounted).toHaveBeenCalledOnce();
    });

    it("accepts and clears a directly authored theme through BlueprintProvider", () => {
        const theme: ThemeAPI = { borderRadius: "4px", version: 1 };
        const view = (value?: ThemeAPI) => (
            <BlueprintProvider theme={value}>
                <Portal>
                    <span>Direct theme</span>
                </Portal>
            </BlueprintProvider>
        );
        const { rerender } = render(view(theme));
        const root = screen.getByText("Direct theme").parentElement!;
        expect(root.style.getPropertyValue("--bp-surface-border-radius")).toBe("4px");
        rerender(view());
        expect(root.style.getPropertyValue("--bp-surface-border-radius")).toBe("");
    });
});
