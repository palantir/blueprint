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

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../common";
import { BLUEPRINT_THEME_V1_SCHEMA_URL, parseBlueprintTheme } from "../theme/blueprintTheme";
import { BLUEPRINT_BP7_THEME, BLUEPRINT_BP7_THEME_TOKENS } from "../theme/bp7Theme";
import { compileBlueprintTheme } from "../theme/compileBlueprintTheme";
import { BLUEPRINT_BP7_THEME_TOKENS_DARK } from "../theme/generated/bp7ThemeTokensDark";
import { BLUEPRINT_BP7_THEME_TOKENS_LIGHT } from "../theme/generated/bp7ThemeTokensLight";

const NEXT_DARK_CSS = readFileSync(join(process.cwd(), "src/design-tokens/build/next-tokens-dark.css"), "utf8");

describe("Blueprint BP7 theme token manifest", () => {
    it("publishes generated light and dark public component tokens without private tokens", () => {
        const tokenNames = Object.keys(BLUEPRINT_BP7_THEME_TOKENS);
        const lightTokenNames = Object.keys(BLUEPRINT_BP7_THEME_TOKENS_LIGHT);
        const darkTokenNames = Object.keys(BLUEPRINT_BP7_THEME_TOKENS_DARK);

        expect(tokenNames).toEqual(
            expect.arrayContaining([
                "--bp-button-font-size",
                "--bp-input-background-rest",
                "--bp-menu-background-rest",
                "--bp-popover-background-rest",
            ]),
        );
        expect(tokenNames).toEqual(lightTokenNames);
        expect(tokenNames).toEqual(darkTokenNames);
        expect(tokenNames.some(tokenName => tokenName.startsWith("--bp-private-"))).toBe(false);
    });

    it("publishes a complete valid BP7 theme from the generated light and dark tokens", () => {
        const expectedTokens = Object.fromEntries(
            Object.entries(BLUEPRINT_BP7_THEME_TOKENS_LIGHT).map(([tokenName, light]) => [
                tokenName,
                {
                    // The generated manifests share one source, but Object.entries widens the known light key to string.
                    dark: BLUEPRINT_BP7_THEME_TOKENS_DARK[tokenName as keyof typeof BLUEPRINT_BP7_THEME_TOKENS_DARK],
                    light,
                },
            ]),
        );

        expect(BLUEPRINT_BP7_THEME_TOKENS).toEqual(expectedTokens);
        expect(BLUEPRINT_BP7_THEME.tokens).toBe(BLUEPRINT_BP7_THEME_TOKENS);
        expect(parseBlueprintTheme(BLUEPRINT_BP7_THEME)).toEqual({ isValid: true, theme: BLUEPRINT_BP7_THEME });

        const css = compileBlueprintTheme({ scopeId: "bp7-preset-test", theme: BLUEPRINT_BP7_THEME });
        expect(css).toContain('[data-bp-theme="bp7-preset-test"][data-bp-color-scheme="light"]');
        expect(css).toContain('[data-bp-theme="bp7-preset-test"][data-bp-color-scheme="dark"]');
        expect(css).toContain(
            `--bp-button-background-default-rest: ${BLUEPRINT_BP7_THEME_TOKENS_LIGHT["--bp-button-background-default-rest"]};`,
        );
        expect(css).toContain(
            `--bp-button-background-default-rest: ${BLUEPRINT_BP7_THEME_TOKENS_DARK["--bp-button-background-default-rest"]};`,
        );
    });

    it("lets an authored string override win over dark defaults", () => {
        const scopeId = "specificity-test";
        const styleElement = document.createElement("style");
        styleElement.textContent =
            NEXT_DARK_CSS +
            compileBlueprintTheme({
                scopeId,
                theme: {
                    $schema: BLUEPRINT_THEME_V1_SCHEMA_URL,
                    components: {},
                    tokens: { "--bp-button-background-default-rest": "#123456" },
                },
            });
        document.head.appendChild(styleElement);

        const scopeElement = document.createElement("div");
        scopeElement.className = `bp-next ${Classes.DARK}`;
        scopeElement.dataset.bpColorScheme = "dark";
        scopeElement.dataset.bpTheme = scopeId;
        document.body.appendChild(scopeElement);

        const defaultElement = scopeElement.cloneNode();
        if (!(defaultElement instanceof HTMLElement)) {
            throw new Error("Expected the cloned theme scope to remain an HTMLElement.");
        }
        defaultElement.dataset.bpTheme = "default-specificity-control";
        document.body.appendChild(defaultElement);

        expect(
            getComputedStyle(defaultElement).getPropertyValue("--bp-button-background-default-rest").trim(),
        ).not.toBe("");

        expect(getComputedStyle(scopeElement).getPropertyValue("--bp-button-background-default-rest").trim()).toBe(
            "#123456",
        );

        defaultElement.remove();
        scopeElement.remove();
        styleElement.remove();
    });
});
