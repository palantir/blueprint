/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { render, renderHook, screen } from "@testing-library/react";

import { describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";
import { Portal } from "../../components/portal/portal";
import type { ThemeAPI } from "../../theme";
import { BlueprintProvider } from "../blueprintProvider";

import { ThemeProvider, type ThemeRepresentations } from "./themeProvider";
import { useBlueprintThemeTokens, useBlueprintThemeValue } from "./useBlueprintTheme";

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
        { borderRadius: "SQUARE", version: 1 },
        { borderRadius: "4em", version: 1 },
        { fontFamily: null, version: 1 },
        { fontFamily: ["Arial"], version: 1 },
    ])("provides no overrides for an invalid representation: %j", representation => {
        const { result } = renderHook(() => ({ theme: useBlueprintThemeValue(), tokens: useBlueprintThemeTokens() }), {
            wrapper: ({ children }) => (
                <ThemeProvider themesByVersion={{ "1": representation }}>{children}</ThemeProvider>
            ),
        });
        expect(result.current).toEqual({ theme: undefined, tokens: undefined });
    });

    it("exposes the selected original theme without stripping future fields", () => {
        const theme = { borderRadius: "8px", futureField: true, version: 1 };
        const { result } = renderHook(() => useBlueprintThemeValue(), {
            wrapper: ({ children }) => <ThemeProvider themesByVersion={{ "1": theme }}>{children}</ThemeProvider>,
        });
        expect(result.current).toBe(theme);
    });

    it("uses a defined direct theme without reading the versioned representation", () => {
        const theme = { borderRadius: "6px", version: 1 } satisfies ThemeAPI;
        const themesByVersion = {
            get "1"() {
                throw new Error("The fallback must not be inspected");
            },
        };
        const { result } = renderHook(() => ({ theme: useBlueprintThemeValue(), tokens: useBlueprintThemeTokens() }), {
            wrapper: ({ children }) => (
                <BlueprintProvider theme={theme} themesByVersion={themesByVersion}>
                    {children}
                </BlueprintProvider>
            ),
        });
        expect(result.current.theme).toBe(theme);
        expect(result.current.tokens).toEqual({ "--bp-surface-border-radius": "6px" });
    });

    it("clears overrides for an invalid direct theme without reading the versioned representation", () => {
        const theme = { borderRadius: "SQUARE", version: 1 } satisfies ThemeAPI;
        const themesByVersion = {
            get "1"() {
                throw new Error("The versioned theme must not be inspected");
            },
        };
        const { result } = renderHook(() => ({ theme: useBlueprintThemeValue(), tokens: useBlueprintThemeTokens() }), {
            wrapper: ({ children }) => (
                <BlueprintProvider theme={theme} themesByVersion={themesByVersion}>
                    {children}
                </BlueprintProvider>
            ),
        });
        expect(result.current).toEqual({ theme: undefined, tokens: undefined });
    });

    it("uses the versioned representation when the direct theme is undefined", () => {
        const versionedTheme = { borderRadius: "8px", version: 1 };
        const { result } = renderHook(() => useBlueprintThemeValue(), {
            wrapper: ({ children }) => (
                <BlueprintProvider theme={undefined} themesByVersion={{ "1": versionedTheme }}>
                    {children}
                </BlueprintProvider>
            ),
        });
        expect(result.current).toBe(versionedTheme);
    });

    it.each([true, false])("accepts isDarkMode=%s without changing current tokens", isDarkMode => {
        const { result } = renderHook(() => useBlueprintThemeTokens(), {
            wrapper: ({ children }) => (
                <ThemeProvider isDarkMode={isDarkMode} theme={{ borderRadius: "8px", version: 1 }}>
                    {children}
                </ThemeProvider>
            ),
        });
        expect(result.current).toEqual({ "--bp-surface-border-radius": "8px" });
    });

    it("exposes v1 tokens without adding a DOM wrapper or inspecting future versions", () => {
        const themes = {
            "1": { borderRadius: "8px", fontFamily: "Arial", futureField: true, version: 1 },
            get "2"() {
                throw new Error("Future schemas must not be inspected");
            },
        };
        function Consumer() {
            const tokens = useBlueprintThemeTokens();
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

        for (const themes of [
            { "1": { borderRadius: "SQUARE", version: 1 } },
            { "1": { borderRadius: 8, version: 1 } },
            { "2": { version: 2 } },
            undefined,
        ]) {
            rerender(view(themes));
            expect(root.style.getPropertyValue("--bp-surface-border-radius")).toBe("");
            expect(root.style.getPropertyValue("--unrelated")).toBe("keep");
        }
        expect(mounted).toHaveBeenCalledOnce();
    });

    it("accepts and clears a directly authored theme through BlueprintProvider", () => {
        const theme: ThemeAPI = { borderRadius: "4.5px", version: 1 };
        const view = (value?: ThemeAPI) => (
            <BlueprintProvider theme={value}>
                <Portal>
                    <span>Direct theme</span>
                </Portal>
            </BlueprintProvider>
        );
        const { rerender } = render(view(theme));
        const root = screen.getByText("Direct theme").parentElement!;
        expect(root.style.getPropertyValue("--bp-surface-border-radius")).toBe("4.5px");
        rerender(view());
        expect(root.style.getPropertyValue("--bp-surface-border-radius")).toBe("");
    });
});
