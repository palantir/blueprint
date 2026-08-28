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

/* eslint-disable sort-keys -- Theme fixtures and expected errors follow the public document order. */

import { describe, expect, it } from "@blueprintjs/test-commons/vitest";

import {
    BLUEPRINT_THEME_TARGET_MANIFEST,
    BLUEPRINT_THEME_V1_SCHEMA_URL,
    type BlueprintThemeV1,
    parseBlueprintTheme,
} from "./blueprintTheme";
import { BLUEPRINT_THEME_V1_SCHEMA } from "./themeV1Schema";

describe("parseBlueprintTheme", () => {
    it("accepts V1 token values and preserves authored CSS units", () => {
        const result = parseBlueprintTheme({
            $schema: BLUEPRINT_THEME_V1_SCHEMA_URL,
            tokens: {
                "--bp-button-font-size": "0.875rem",
                "--bp-intent-primary-rest": {
                    light: "#005bbb",
                    dark: "#4da1ff",
                },
                "--bp-theme-focus-ring": "oklch(88% 0.2 95)",
            },
            components: {
                button: {
                    base: {
                        borderRadius: "999px",
                    },
                },
            },
        });

        expect(result).toEqual({
            isValid: true,
            theme: {
                $schema: BLUEPRINT_THEME_V1_SCHEMA_URL,
                tokens: {
                    "--bp-button-font-size": "0.875rem",
                    "--bp-intent-primary-rest": {
                        light: "#005bbb",
                        dark: "#4da1ff",
                    },
                    "--bp-theme-focus-ring": "oklch(88% 0.2 95)",
                },
                components: {
                    button: {
                        base: {
                            borderRadius: "999px",
                        },
                    },
                },
            },
        });
    });

    it("rejects invalid document structure with actionable errors", () => {
        const result = parseBlueprintTheme({
            $schema: "https://example.com/theme.json",
            components: [],
            unexpected: true,
        });

        expect(result).toEqual({
            isValid: false,
            errors: expect.arrayContaining([
                {
                    path: "$.$schema",
                    expected: BLUEPRINT_THEME_V1_SCHEMA_URL,
                    action: "Use the Blueprint V1 schema URL exactly as published.",
                },
                {
                    path: "$.tokens",
                    expected: "an object of Blueprint token values",
                    action: "Add a tokens object; use an empty object when there are no token overrides.",
                },
                {
                    path: "$.components",
                    expected: "an object of supported Blueprint component targets",
                    action: "Replace components with an object; use an empty object when there are no overrides.",
                },
                {
                    path: "$.unexpected",
                    expected: "only $schema, tokens, and components properties",
                    action: "Remove the unsupported root property.",
                },
            ]),
        });
    });

    it("rejects unsupported or unsafe token entries", () => {
        const result = parseBlueprintTheme({
            $schema: BLUEPRINT_THEME_V1_SCHEMA_URL,
            tokens: {
                "--other-color": "red",
                "--bp-private-button-color": "red",
                "--bp-button-font-size": "0.875rem; } body { color: red",
                "--bp-intent-primary-rest": {
                    light: "#005bbb",
                },
            },
            components: {},
        });

        expect(result).toEqual({
            isValid: false,
            errors: expect.arrayContaining([
                {
                    path: '$.tokens["--other-color"]',
                    expected: "a lowercase --bp-* custom property name",
                    action: "Rename the token to a Blueprint public token or a --bp-theme-* variable.",
                },
                {
                    path: '$.tokens["--bp-private-button-color"]',
                    expected: "a public --bp-* token name",
                    action: "Use a public semantic or component token; private tokens are not theme API.",
                },
                {
                    path: '$.tokens["--bp-button-font-size"]',
                    expected: "a safe, non-empty CSS value",
                    action: "Remove control characters, comments, semicolons, braces, or style-tag text.",
                },
                {
                    path: '$.tokens["--bp-intent-primary-rest"]',
                    expected: "a CSS string or an object with exactly light and dark CSS strings",
                    action: "Add both light and dark strings, or replace the object with one CSS string.",
                },
            ]),
        });
    });

    it("keeps runtime validation and the bundled schema aligned on safe CSS values", () => {
        const tokenValuePattern = new RegExp(
            BLUEPRINT_THEME_V1_SCHEMA.properties.tokens.additionalProperties.oneOf[0].pattern,
        );

        for (const value of ["0.875rem", "var(--bp-theme-color)", "oklch(88% 0.2 95)"]) {
            const result = parseBlueprintTheme({
                $schema: BLUEPRINT_THEME_V1_SCHEMA_URL,
                tokens: { "--bp-button-font-size": value },
                components: {},
            });
            expect(result.isValid).toBe(tokenValuePattern.test(value));
        }
        for (const value of ["<style", "</style>", "red; color: blue", "/* comment */"]) {
            const result = parseBlueprintTheme({
                $schema: BLUEPRINT_THEME_V1_SCHEMA_URL,
                tokens: { "--bp-button-font-size": value },
                components: {},
            });
            expect(result.isValid).toBe(tokenValuePattern.test(value));
        }
    });

    it("enforces the documented component target, modifier, interaction, and declaration boundary", () => {
        const validResult = parseBlueprintTheme({
            $schema: BLUEPRINT_THEME_V1_SCHEMA_URL,
            tokens: {},
            components: {
                button: {
                    active: { transform: "translateY(0.125rem)" },
                    "intent:primary": {
                        transform: "none",
                        ":focus": { boxShadow: "0 0 0 0.1875rem var(--bp-theme-focus-ring)" },
                        ":hover": { boxShadow: "0 0 0 0.1875rem var(--bp-theme-focus-ring)" },
                    },
                },
                input: {
                    active: { boxShadow: "var(--bp-input-shadow-focus)" },
                    disabled: { opacity: "1" },
                },
                "menu-item": {
                    active: { backgroundColor: "var(--bp-menu-item-background-active)" },
                    selected: { backgroundColor: "var(--bp-menu-item-background-selected)" },
                },
                "popover-arrow": {
                    minimal: { display: "none" },
                },
            },
        });
        const invalidResult = parseBlueprintTheme({
            $schema: BLUEPRINT_THEME_V1_SCHEMA_URL,
            tokens: {},
            components: {
                dialog: { base: { color: "red" } },
                button: {
                    large: { color: "red" },
                    base: {
                        "background-color": "red",
                        color: "red; } body { color: blue",
                        ":visited": { color: "red" },
                    },
                },
                popover: {
                    outlined: { color: "red" },
                },
                "input-placeholder": {
                    base: {
                        ":hover": { color: "red" },
                    },
                },
                "popover-arrow": {
                    base: {
                        ":focus": { color: "red" },
                    },
                },
            },
        });

        expect(validResult.isValid).toBe(true);
        expect(invalidResult).toEqual({
            isValid: false,
            errors: expect.arrayContaining([
                {
                    path: "$.components.dialog",
                    expected: `one of: ${Object.keys(BLUEPRINT_THEME_TARGET_MANIFEST).join(", ")}`,
                    action: "Replace or remove the unsupported component target.",
                },
                {
                    path: "$.components.button.large",
                    expected: `one of: ${BLUEPRINT_THEME_TARGET_MANIFEST.button.modifiers.join(", ")}`,
                    action: "Use a modifier documented for the button target.",
                },
                {
                    path: "$.components.popover.outlined",
                    expected: `one of: ${BLUEPRINT_THEME_TARGET_MANIFEST.popover.modifiers.join(", ")}`,
                    action: "Use a modifier documented for the popover target.",
                },
                {
                    path: '$.components.button.base["background-color"]',
                    expected: "a camelCase CSS property name or --bp-theme-* custom property",
                    action: "Use a camelCase property such as backgroundColor, or remove the declaration.",
                },
                {
                    path: "$.components.button.base.color",
                    expected: "a safe, non-empty CSS value",
                    action: "Remove control characters, comments, semicolons, braces, or style-tag text.",
                },
                {
                    path: '$.components.button.base[":visited"]',
                    expected: `one of: ${BLUEPRINT_THEME_TARGET_MANIFEST.button.interactions.join(", ")}`,
                    action: "Use an interaction documented for the button target, or remove the interaction.",
                },
                {
                    path: '$.components["input-placeholder"].base[":hover"]',
                    expected: "CSS declarations only; interactions are not supported",
                    action: "Remove the interaction from the input-placeholder target.",
                },
                {
                    path: '$.components["popover-arrow"].base[":focus"]',
                    expected: `one of: ${BLUEPRINT_THEME_TARGET_MANIFEST["popover-arrow"].interactions.join(", ")}`,
                    action: "Use an interaction documented for the popover-arrow target, or remove the interaction.",
                },
            ]),
        });
    });

    it("publishes a V1 JSON Schema generated from the component target manifest", () => {
        const buttonModifiers = Object.fromEntries(
            BLUEPRINT_THEME_TARGET_MANIFEST.button.modifiers.map(modifier => [modifier, expect.anything()]),
        );
        const buttonBaseSchema = BLUEPRINT_THEME_V1_SCHEMA.properties.components.properties.button.properties.base;
        const popoverArrowBaseSchema =
            BLUEPRINT_THEME_V1_SCHEMA.properties.components.properties["popover-arrow"].properties.base;
        const inputPlaceholderBaseSchema =
            BLUEPRINT_THEME_V1_SCHEMA.properties.components.properties["input-placeholder"].properties.base;

        expect(buttonBaseSchema.properties).toHaveProperty(":focus");
        expect(inputPlaceholderBaseSchema.properties).toEqual({});
        expect(popoverArrowBaseSchema.properties).not.toHaveProperty(":focus");

        expect(BLUEPRINT_THEME_V1_SCHEMA).toMatchObject({
            $id: BLUEPRINT_THEME_V1_SCHEMA_URL,
            additionalProperties: false,
            required: ["$schema", "tokens", "components"],
            properties: {
                components: {
                    additionalProperties: false,
                    properties: {
                        button: {
                            additionalProperties: false,
                            properties: buttonModifiers,
                        },
                        "input-left-icon": {
                            additionalProperties: false,
                            properties: {
                                base: expect.anything(),
                                disabled: expect.anything(),
                                "intent:danger": expect.anything(),
                                "intent:primary": expect.anything(),
                                "intent:success": expect.anything(),
                                "intent:warning": expect.anything(),
                            },
                        },
                        popover: {
                            additionalProperties: false,
                            properties: {
                                base: expect.anything(),
                                minimal: expect.anything(),
                            },
                        },
                    },
                },
            },
        });
    });

    it("types modifiers against their specific component target", () => {
        const typeCheckedTheme: BlueprintThemeV1 = {
            $schema: BLUEPRINT_THEME_V1_SCHEMA_URL,
            tokens: {},
            components: {
                button: {
                    // @ts-expect-error -- selected belongs to MenuItem and must not be accepted for Button.
                    selected: { color: "red" },
                },
            },
        };

        expect(typeCheckedTheme.components.button).toBeDefined();
    });
});
