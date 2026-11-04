/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { render, screen } from "@testing-library/react";

import { describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Portal } from "../../components/portal/portal";
import { THEME_API_VERSION, type ThemeAPI } from "../../theme";
import { BlueprintProvider } from "../blueprintProvider";

import { BlueprintThemeProvider, type ThemeRepresentations, useBlueprintTheme } from "./themeProvider";

describe("BlueprintThemeProvider", () => {
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
            <BlueprintThemeProvider themesByVersion={themes}>
                <Consumer />
            </BlueprintThemeProvider>,
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
        const theme: ThemeAPI = { borderRadius: "4px", version: THEME_API_VERSION };
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
