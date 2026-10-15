/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { render, screen } from "@testing-library/react";
import { useContext } from "react";

import { describe, expect, it } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../common";
import { Dialog } from "../components/dialog/dialog";
import { Portal } from "../components/portal/portal";

import { BlueprintProvider } from "./blueprintProvider";
import { BlueprintThemeContext } from "./blueprintTheme";
import { PortalProvider } from "./portal/portalProvider";

const TOKEN = "--bp-surface-border-radius";

function Canvas() {
    return <div data-testid="canvas" style={useContext(BlueprintThemeContext)} />;
}

function getPortal(testId: string) {
    return screen.getByTestId(testId).closest(`.${Classes.PORTAL}`)!;
}

describe("Blueprint portal themes", () => {
    it("updates and clears a dialog without losing input state or changing the document theme", () => {
        const initialStylesheets = document.styleSheets.length;
        const content = (borderRadius: "SQUARE" | "ROUNDED" | undefined, enabled = true) => (
            <BlueprintProvider theme={borderRadius == null ? undefined : { borderRadius }} themeEnabled={enabled}>
                <Canvas />
                <Dialog isOpen={true} autoFocus={false} enforceFocus={false}>
                    <input data-testid="input" />
                </Dialog>
            </BlueprintProvider>
        );
        const { rerender, unmount } = render(content(undefined));
        const input = screen.getByTestId<HTMLInputElement>("input");
        const portal = getPortal("input");
        const className = portal.className;
        input.value = "unsaved";
        input.focus();
        expect(document.styleSheets.length).toBe(initialStylesheets);
        for (const [radius, enabled, expected] of [
            ["SQUARE", true, "0px"],
            ["ROUNDED", true, "8px"],
            ["ROUNDED", false, ""],
            [undefined, true, ""],
        ] as const) {
            rerender(content(radius, enabled));
            expect(screen.getByTestId("input")).toBe(input);
            expect(input.value).toBe("unsaved");
            expect(document.activeElement).toBe(input);
            expect(portal.className).toBe(className);
            expect(getComputedStyle(portal).getPropertyValue(TOKEN)).toBe(expected);
            expect(screen.getByTestId("canvas").style.getPropertyValue(TOKEN)).toBe(expected);
            expect(document.documentElement.style.getPropertyValue(TOKEN)).toBe("");
        }
        rerender(content("ROUNDED"));
        unmount();
        expect(document.styleSheets.length).toBe(initialStylesheets);
    });

    it("isolates nested themes and preserves unrelated portal options", () => {
        const container = document.createElement("div");
        document.body.appendChild(container);
        const { unmount } = render(
            <PortalProvider portalClassName="existing" portalContainer={container}>
                <BlueprintProvider theme={{ borderRadius: "SQUARE" }}>
                    <Portal>
                        <span data-testid="outer" />
                    </Portal>
                    <BlueprintProvider theme={{ borderRadius: "ROUNDED" }}>
                        <Portal container={document.body}>
                            <span data-testid="inner" />
                        </Portal>
                    </BlueprintProvider>
                </BlueprintProvider>
            </PortalProvider>,
        );
        expect(getPortal("outer").parentElement).toBe(container);
        expect(getPortal("inner").parentElement).toBe(document.body);
        expect(getPortal("outer")).toHaveClass("existing");
        expect(getPortal("inner")).toHaveClass("existing");
        expect(getComputedStyle(getPortal("outer")).getPropertyValue(TOKEN)).toBe("0px");
        expect(getComputedStyle(getPortal("inner")).getPropertyValue(TOKEN)).toBe("8px");
        unmount();
        container.remove();
    });

    it("accepts dynamic tokens through BlueprintProvider", () => {
        const content = (tokens: Record<`--bp-${string}`, string>) => (
            <BlueprintProvider portalTokens={tokens}>
                <Portal>
                    <span data-testid="custom" />
                </Portal>
            </BlueprintProvider>
        );
        const { rerender } = render(content({ [TOKEN]: "12px" }));
        const portal = getPortal("custom");
        expect(getComputedStyle(portal).getPropertyValue(TOKEN)).toBe("12px");
        rerender(content({}));
        expect(getPortal("custom")).toBe(portal);
        expect(getComputedStyle(portal).getPropertyValue(TOKEN)).toBe("");
    });

    it("retains existing PortalProvider behavior when no token map is supplied", () => {
        const initialStylesheets = document.styleSheets.length;
        render(
            <PortalProvider portalClassName="existing">
                <Portal>
                    <span data-testid="plain" />
                </Portal>
            </PortalProvider>,
        );
        expect(getPortal("plain").className).toBe(`${Classes.PORTAL} existing`);
        expect(document.styleSheets.length).toBe(initialStylesheets);
    });
});
