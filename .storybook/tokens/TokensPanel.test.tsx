/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ensure, ThemeProvider, themes } from "storybook/theming";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { generateAccentPalette } from "../../packages/core/src/design-tokens/generateAccentPalette";
import darkPalette from "../../packages/core/src/design-tokens/tokens/themes/dark/palette.dark.tokens.json";

import { TokensPanel } from "./TokensPanel";

const MANAGER_THEME = ensure(themes.light);

function renderPanel(theme = MANAGER_THEME) {
    return render(
        <ThemeProvider theme={theme}>
            <TokensPanel />
        </ThemeProvider>,
    );
}

const manager = vi.hoisted(() => ({
    globals: { accentColor: "", theme: "light", tokenOverrides: { "--bp-surface-border-radius": "8px" } },
    updateGlobals: vi.fn(),
}));

vi.mock("storybook/manager-api", async () => {
    const React = await import("react");
    return {
        useGlobals: () => {
            const [globals, setGlobals] = React.useState(manager.globals);
            return [
                globals,
                (updates: Partial<typeof globals>) => {
                    manager.updateGlobals(updates);
                    setGlobals(previous => ({ ...previous, ...updates }));
                },
            ];
        },
        useStoryPrepared: () => true,
        useStorybookState: () => ({ storyId: "button" }),
    };
});

// The existing Storybook radius control is an external manager widget.
vi.mock("@storybook/addon-docs/blocks", () => ({
    PureArgsTable: ({ args }: { args: Record<string, number> }) => (
        <label>
            Border radius
            <input readOnly={true} type="range" value={args["--bp-surface-border-radius"]} />
        </label>
    ),
}));

beforeEach(() => {
    manager.globals = { accentColor: "", theme: "light", tokenOverrides: { "--bp-surface-border-radius": "8px" } };
    manager.updateGlobals.mockClear();
});
afterEach(cleanup);

describe("Theme panel", () => {
    it("offers labeled accent controls without removing the radius control", () => {
        renderPanel();
        expect(screen.getByRole("textbox", { name: "Accent hex" })).toBeDefined();
        expect(screen.getByLabelText("Accent color picker").getAttribute("type")).toBe("color");
        expect(screen.getByRole("button", { name: "Generate" })).toBeDefined();
        expect(screen.getByRole("slider", { name: "Border radius" }).getAttribute("value")).toBe("8");
    });

    it("applies a normalized accent only when Generate is selected", async () => {
        const user = userEvent.setup();
        renderPanel();
        await user.type(screen.getByRole("textbox", { name: "Accent hex" }), "3CDDDA");
        expect(manager.updateGlobals).not.toHaveBeenCalled();
        await user.click(screen.getByRole("button", { name: "Generate" }));
        expect(manager.updateGlobals).toHaveBeenCalledWith({ accentColor: "#3cddda" });
    });

    it("reports an invalid edit without replacing the previously applied accent", async () => {
        manager.globals.accentColor = "#3cddda";
        const user = userEvent.setup();
        renderPanel();
        const input = screen.getByRole("textbox", { name: "Accent hex" });
        await user.clear(input);
        await user.type(input, "not-a-color");
        await user.click(screen.getByRole("button", { name: "Generate" }));
        expect(screen.getByRole("alert").textContent).toMatch(/3 or 6 hexadecimal/);
        expect(input.getAttribute("aria-invalid")).toBe("true");
        expect(manager.updateGlobals).not.toHaveBeenCalled();
    });

    it("lets the picker edit the draft without applying until Generate", async () => {
        const user = userEvent.setup();
        renderPanel();
        fireEvent.change(screen.getByLabelText("Accent color picker"), { target: { value: "#ff8800" } });
        expect(screen.getByRole("textbox", { name: "Accent hex" }).getAttribute("value")).toBe("#ff8800");
        expect(manager.updateGlobals).not.toHaveBeenCalled();
        await user.click(screen.getByRole("button", { name: "Generate" }));
        expect(manager.updateGlobals).toHaveBeenCalledWith({ accentColor: "#ff8800" });
    });

    it("resets only the accent and clears an invalid draft while retaining radius", async () => {
        manager.globals.accentColor = "#3cddda";
        const user = userEvent.setup();
        renderPanel();
        await user.clear(screen.getByRole("textbox", { name: "Accent hex" }));
        await user.type(screen.getByRole("textbox", { name: "Accent hex" }), "invalid");
        await user.click(screen.getByRole("button", { name: "Generate" }));
        await user.click(screen.getByRole("button", { name: "Reset to Blueprint defaults" }));
        expect(manager.updateGlobals).toHaveBeenCalledWith({ accentColor: "" });
        expect(screen.getByRole("textbox", { name: "Accent hex" }).getAttribute("value")).toBe("");
        expect(screen.queryByRole("alert")).toBeNull();
        expect(screen.getByRole("slider", { name: "Border radius" }).getAttribute("value")).toBe("8");
    });

    it("shows all 13 numbered usage roles for the current palette", () => {
        renderPanel();
        const swatches = within(screen.getByRole("list", { name: "Light accent scale" })).getAllByRole("listitem");
        expect(swatches).toHaveLength(13);
        expect(swatches[0].textContent).toContain("1. App background");
        expect(swatches[10].textContent).toContain("11. Solid active");
        expect(swatches[12].textContent).toContain("13. Text");
        expect(screen.getByText("Blueprint default accent")).toBeDefined();
    });

    it("shows the applied custom palette rather than an unapplied draft", async () => {
        const user = userEvent.setup();
        renderPanel();
        const input = screen.getByRole("textbox", { name: "Accent hex" });
        await user.type(input, "3CDDDA");
        await user.click(screen.getByRole("button", { name: "Generate" }));
        const swatches = within(screen.getByRole("list", { name: "Light accent scale" })).getAllByRole("listitem");
        expect(swatches[8].textContent).toContain("#3cddda");
        expect(screen.getByText("Custom accent · light theme")).toBeDefined();
        await user.clear(input);
        await user.type(input, "invalid");
        expect(swatches[8].textContent).toContain("#3cddda");
    });

    it("shows the dark generated scale when the current Storybook theme is dark", () => {
        manager.globals.theme = "dark";
        manager.globals.accentColor = "#3cddda";
        renderPanel();
        const swatches = within(screen.getByRole("list", { name: "Dark accent scale" })).getAllByRole("listitem");
        expect(swatches[12].textContent).toContain(generateAccentPalette("3CDDDA")!.dark.steps[12]);
        expect(screen.getByText("Custom accent · dark theme")).toBeDefined();
    });

    it("generates an accent with Enter from the hex input", async () => {
        const user = userEvent.setup();
        renderPanel();
        await user.type(screen.getByRole("textbox", { name: "Accent hex" }), "#abc{Enter}");
        expect(manager.updateGlobals).toHaveBeenCalledWith({ accentColor: "#aabbcc" });
    });

    it("composes translucent dark swatches on a dark underlay rather than the manager's light canvas", () => {
        manager.globals.theme = "dark";
        renderPanel();
        const item = within(screen.getByRole("list", { name: "Dark accent scale" })).getAllByRole("listitem")[1];
        const swatch = item.querySelector("div");
        const expected = document.createElement("div");
        expected.style.backgroundColor = darkPalette.color.blue["2"].$value;
        expect(swatch?.style.backgroundColor).toBe("rgb(17, 20, 24)");
        expect(swatch?.querySelector("div")?.style.backgroundColor).toBe(expected.style.backgroundColor);
    });

    it("announces palette application and reset with a nonurgent status", async () => {
        const user = userEvent.setup();
        renderPanel();
        expect(screen.getByRole("status").textContent).toBe("Blueprint default accent");
        await user.type(screen.getByRole("textbox", { name: "Accent hex" }), "3CDDDA");
        await user.click(screen.getByRole("button", { name: "Generate" }));
        expect(screen.getByRole("status").textContent).toBe("Custom accent · light theme");
        await user.click(screen.getByRole("button", { name: "Reset to Blueprint defaults" }));
        expect(screen.getByRole("status").textContent).toBe("Blueprint default accent");
    });

    it("uses the manager's typography and spacing tokens for the new panel controls", () => {
        const theme = {
            ...MANAGER_THEME,
            layoutMargin: 14,
            typography: { ...MANAGER_THEME.typography, size: { ...MANAGER_THEME.typography.size, s1: 15, s2: 18 } },
        };
        renderPanel(theme);
        expect(screen.getByRole("heading", { name: "Accent palette" }).style.fontSize).toBe("18px");
        expect(screen.getByRole("region", { name: "Accent palette" }).style.padding).toBe("28px");
        expect(screen.getByRole("status").style.fontSize).toBe("15px");
        expect(screen.getByRole("list", { name: "Light accent scale" }).style.gap).toBe("14px");
        expect(screen.getByLabelText("Accent color picker").style.paddingInline).toBe("7px");
    });
});
