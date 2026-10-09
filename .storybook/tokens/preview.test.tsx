/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import * as Classes from "../../packages/core/src/common/classes";
import { generateAccentPalette } from "../../packages/core/src/design-tokens/generateAccentPalette";

import { withTokens } from "./preview";

vi.mock("storybook/preview-api", async () => ({ useEffect: (await import("react")).useEffect }));

interface PreviewProps {
    accentColor?: string;
    id?: string;
}

function Preview({ accentColor = "", id = "button" }: PreviewProps) {
    // This decorator only reads globals and id; the manager supplies the remaining context in Storybook.
    const context = {
        globals: { accentColor, tokenOverrides: { "--bp-surface-border-radius": "8px" } },
        id,
    } as unknown as Parameters<typeof withTokens>[1];
    return withTokens(() => <a href="#primary">Primary link</a>, context);
}

afterEach(() => {
    cleanup();
    document.body.removeAttribute("style");
    document.body.className = "";
    document.documentElement.className = "";
});

describe("Theme preview", () => {
    it("binds the primary primitives and semantics together without changing neutral or other intents", () => {
        document.body.style.setProperty("--bp-text-color-neutral-default", "#123456");
        document.body.style.setProperty("--bp-intent-success-rest", "#654321");
        render(<Preview accentColor="#3CDDDA" />);
        const style = getComputedStyle(document.body);
        expect(style.getPropertyValue("--bp-color-blue-9")).toBe("#3cddda");
        expect(style.getPropertyValue("--bp-intent-primary-solid-rest")).toBe("#3cddda");
        expect(style.getPropertyValue("--bp-text-color-neutral-default")).toBe("#123456");
        expect(style.getPropertyValue("--bp-intent-success-rest")).toBe("#654321");
    });

    it("updates primary interaction states, compatibility recipes, disabled colors, and links", () => {
        render(<Preview accentColor="#3CDDDA" />);
        const palette = generateAccentPalette("3CDDDA")!.light;
        const style = getComputedStyle(document.body);
        expect(style.getPropertyValue("--bp-intent-primary-solid-hover")).toBe(palette.steps[9]);
        expect(style.getPropertyValue("--bp-intent-primary-solid-active")).toBe(palette.steps[10]);
        expect(style.getPropertyValue("--bp-intent-primary-solid-foreground")).toBe(palette.contrast);
        expect(style.getPropertyValue("--bp-intent-primary-rest")).toBe(palette.steps[8]);
        expect(style.getPropertyValue("--bp-button-primary-minimal-background-hover")).toBe(palette.steps[3]);
        expect(style.getPropertyValue("--bp-button-primary-minimal-foreground-active")).toBe(palette.steps[12]);
        expect(style.getPropertyValue("--bp-button-primary-outlined-border-rest")).toBe(palette.steps[6]);
        expect(style.getPropertyValue("--bp-typography-color-primary-rest")).toBe(palette.steps[12]);
        expect(style.getPropertyValue("--bp-intent-primary-solid-disabled")).toContain(palette.steps[8]);
        expect(style.getPropertyValue("--bp-text-color-primary-disabled")).toContain(palette.steps[12]);
    });

    it("rebinds primitives and text aliases in a nested dark scope and when the body theme switches", () => {
        render(<Preview accentColor="#3CDDDA" />);
        const nested = document.createElement("section");
        nested.className = Classes.DARK;
        document.body.append(nested);
        const palette = generateAccentPalette("3CDDDA")!;
        expect(getComputedStyle(document.body).getPropertyValue("--bp-color-blue-13")).toBe(palette.light.steps[12]);
        expect(getComputedStyle(nested).getPropertyValue("--bp-color-blue-13")).toBe(palette.dark.steps[12]);
        expect(getComputedStyle(nested).getPropertyValue("--bp-text-color-primary-default")).toBe(
            palette.dark.steps[12],
        );
        document.body.classList.add(Classes.DARK);
        expect(getComputedStyle(document.body).getPropertyValue("--bp-color-blue-13")).toBe(palette.dark.steps[12]);
        nested.remove();
    });

    it("restores exact defaults on reset and removes accent styling on unmount", () => {
        const defaults = document.createElement("style");
        defaults.textContent = "body { --bp-color-blue-9: #2d72d2; --bp-intent-primary-solid-rest: #2d72d2; }";
        document.head.append(defaults);
        const view = render(<Preview accentColor="#3CDDDA" />);
        view.rerender(<Preview />);
        expect(getComputedStyle(document.body).getPropertyValue("--bp-color-blue-9")).toBe("#2d72d2");
        expect(getComputedStyle(document.body).getPropertyValue("--bp-intent-primary-solid-rest")).toBe("#2d72d2");
        expect(document.querySelector("style[data-blueprint-accent]")).toBeNull();
        expect(document.body.style.getPropertyValue("--bp-surface-border-radius")).toBe("8px");
        view.rerender(<Preview accentColor="#3CDDDA" />);
        view.unmount();
        expect(document.querySelector("style[data-blueprint-accent]")).toBeNull();
        expect(document.body.style.getPropertyValue("--bp-surface-border-radius")).toBe("");
        defaults.remove();
    });

    it("reapplies the current accent without leaking styles when navigating between stories", () => {
        const view = render(<Preview accentColor="#3CDDDA" />);
        view.rerender(<Preview accentColor="#3CDDDA" id="functional-colors" />);
        expect(document.querySelectorAll("style[data-blueprint-accent]")).toHaveLength(1);
        expect(getComputedStyle(document.body).getPropertyValue("--bp-intent-primary-solid-rest")).toBe("#3cddda");
    });

    it("leaves all accent defaults untouched when no valid accent is applied", () => {
        render(<Preview accentColor="invalid" />);
        expect(document.querySelector("style[data-blueprint-accent]")).toBeNull();
        expect(document.body.style.getPropertyValue("--bp-color-blue-9")).toBe("");
    });

    it("supports attribute-based dark scopes and rebinds legacy primary surface aliases", () => {
        render(<Preview accentColor="#3CDDDA" />);
        const nested = document.createElement("section");
        nested.dataset.bpColorScheme = "dark";
        document.body.append(nested);
        const dark = generateAccentPalette("3CDDDA")!.dark;
        const style = getComputedStyle(nested);
        expect(style.getPropertyValue("--bp-color-blue-13")).toBe(dark.steps[12]);
        expect(style.getPropertyValue("--bp-surface-background-color-primary-hover")).toBe(dark.steps[9]);
        expect(style.getPropertyValue("--bp-surface-layer-color-primary")).toContain(dark.steps[8]);
        nested.remove();
    });

    it("honors a dark class on the document root as well as the body", () => {
        document.documentElement.classList.add(Classes.DARK);
        render(<Preview accentColor="#3CDDDA" />);
        expect(getComputedStyle(document.body).getPropertyValue("--bp-color-blue-13")).toBe(
            generateAccentPalette("3CDDDA")!.dark.steps[12],
        );
    });

    it("overrides all three solid-state foreground primitives for custom accents in both themes", () => {
        render(<Preview accentColor="#3CDDDA" />);
        const palettes = generateAccentPalette("3CDDDA")!;
        for (const suffix of ["", "-hover", "-active"]) {
            expect(getComputedStyle(document.body).getPropertyValue(`--bp-color-blue-contrast${suffix}`)).toBe(
                palettes.light.contrast,
            );
        }
        document.body.classList.add(Classes.DARK);
        for (const suffix of ["", "-hover", "-active"]) {
            expect(getComputedStyle(document.body).getPropertyValue(`--bp-color-blue-contrast${suffix}`)).toBe(
                palettes.dark.contrast,
            );
        }
    });
});
