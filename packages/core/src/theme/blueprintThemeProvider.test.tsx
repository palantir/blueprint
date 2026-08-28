/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
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

import { afterEach, describe, expect, it } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../common";
import { Icon, InputGroup } from "../components";

import { BLUEPRINT_THEME_V1_SCHEMA_URL, type BlueprintThemeV1 } from "./blueprintTheme";
import { BlueprintThemeProvider } from "./blueprintThemeProvider";

const TEST_THEME: BlueprintThemeV1 = {
    $schema: BLUEPRINT_THEME_V1_SCHEMA_URL,
    components: {},
    tokens: {
        "--bp-button-font-size": "0.875rem",
    },
};
const ORIGINAL_ROOT_STYLE = document.documentElement.getAttribute("style");

afterEach(() => {
    if (ORIGINAL_ROOT_STYLE === null) {
        document.documentElement.removeAttribute("style");
    } else {
        document.documentElement.setAttribute("style", ORIGINAL_ROOT_STYLE);
    }
});

describe("BlueprintThemeProvider", () => {
    it("scopes left-icon overrides to the direct InputGroup icon", () => {
        render(
            <BlueprintThemeProvider
                theme={{
                    $schema: BLUEPRINT_THEME_V1_SCHEMA_URL,
                    components: {
                        "input-left-icon": {
                            base: { insetInlineStart: "1.25rem" },
                        },
                    },
                    tokens: {},
                }}
            >
                <InputGroup
                    aria-label="Themed input"
                    leftIcon="search"
                    rightElement={<Icon data-testid="right-action-icon" icon="cross" />}
                />
            </BlueprintThemeProvider>,
        );

        const scope = screen.getByRole("textbox", { name: "Themed input" }).closest("[data-bp-theme]");
        const scopeId = scope?.getAttribute("data-bp-theme");
        const inputGroup = scope?.querySelector(`.${Classes.INPUT_GROUP}`);
        const leftIcon = inputGroup?.querySelector(`:scope > .${Classes.ICON}`);
        const rightIcon = screen.getByTestId("right-action-icon");

        expect(leftIcon).not.toBeNull();
        expect(rightIcon.closest(`.${Classes.INPUT_ACTION}`)).not.toBeNull();
        expect(inputGroup?.querySelector(`:scope > .${Classes.ICON}`)).not.toBe(rightIcon);
        expect(scope?.querySelector("style")?.textContent).toContain(
            `[data-bp-theme="${scopeId}"] .${Classes.INPUT_GROUP} > .${Classes.ICON} {\n` +
                "  inset-inline-start: 1.25rem;\n" +
                "}",
        );
    });

    it("owns unique scoped styles and color scheme without changing the document root", () => {
        document.documentElement.style.fontSize = "19px";
        const originalRootClassName = document.documentElement.className;

        render(
            <>
                <div data-testid="sibling">Sibling</div>
                <BlueprintThemeProvider colorScheme="dark" theme={TEST_THEME}>
                    <button type="button">First themed child</button>
                </BlueprintThemeProvider>
                <BlueprintThemeProvider theme={TEST_THEME}>
                    <button type="button">Second themed child</button>
                </BlueprintThemeProvider>
            </>,
        );

        const firstScope = screen.getByRole("button", { name: "First themed child" }).closest("[data-bp-theme]");
        const secondScope = screen.getByRole("button", { name: "Second themed child" }).closest("[data-bp-theme]");
        const firstScopeId = firstScope?.getAttribute("data-bp-theme");
        const secondScopeId = secondScope?.getAttribute("data-bp-theme");

        expect(firstScope).not.toHaveClass("bp-next");
        expect(firstScope).toHaveClass(Classes.DARK);
        expect(firstScope).toHaveAttribute("data-bp-color-scheme", "dark");
        expect(firstScopeId).toMatch(/^[A-Za-z][A-Za-z0-9_-]*$/);
        expect(secondScopeId).toMatch(/^[A-Za-z][A-Za-z0-9_-]*$/);
        expect(firstScopeId).not.toBe(secondScopeId);
        expect(firstScope?.querySelector("style")?.textContent).toContain(`--bp-button-font-size: 0.875rem;`);
        expect(screen.getByTestId("sibling").closest("[data-bp-theme]")).toBeNull();
        expect(document.documentElement.style.fontSize).toBe("19px");
        expect(document.documentElement.className).toBe(originalRootClassName);
        expect(document.documentElement).not.toHaveAttribute("data-bp-theme");
        expect(document.documentElement).not.toHaveAttribute("data-bp-color-scheme");
    });

    it("keeps the last valid theme active across invalid updates", () => {
        document.documentElement.style.fontSize = "19px";
        const { rerender } = render(
            <BlueprintThemeProvider theme={TEST_THEME}>
                <button type="button">Themed child</button>
            </BlueprintThemeProvider>,
        );
        const scope = screen.getByRole("button", { name: "Themed child" }).closest("[data-bp-theme]");
        const getCss = () => scope?.querySelector("style")?.textContent;

        expect(getCss()).toContain("--bp-button-font-size: 0.875rem;");

        rerender(
            <BlueprintThemeProvider
                colorScheme="dark"
                theme={{
                    $schema: BLUEPRINT_THEME_V1_SCHEMA_URL,
                    components: {},
                    tokens: { "--bp-button-font-size": "1rem; } body { font-size: 100px" },
                }}
            >
                <button type="button">Themed child</button>
            </BlueprintThemeProvider>,
        );

        expect(getCss()).toContain("--bp-button-font-size: 0.875rem;");
        expect(getCss()).not.toContain("font-size: 100px");
        expect(scope).toHaveAttribute("data-bp-color-scheme", "dark");
        expect(document.documentElement.style.fontSize).toBe("19px");
    });
});
