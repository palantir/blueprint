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

/* eslint-disable sort-keys -- Theme fixtures follow the public document and component-target order. */

import { describe, expect, it } from "@blueprintjs/test-commons/vitest";

import { BLUEPRINT_THEME_V1_SCHEMA_URL, parseBlueprintTheme } from "./blueprintTheme";
import { compileBlueprintTheme } from "./compileBlueprintTheme";

describe("compileBlueprintTheme", () => {
    it("generates scoped common and light/dark token declarations without changing authored units", () => {
        const parseResult = parseBlueprintTheme({
            $schema: BLUEPRINT_THEME_V1_SCHEMA_URL,
            tokens: {
                "--bp-button-font-size": "0.875rem",
                "--bp-intent-primary-rest": {
                    light: "#005bbb",
                    dark: "#4da1ff",
                },
                "--bp-theme-focus-ring": "oklch(88% 0.2 95)",
            },
            components: {},
        });
        if (!parseResult.isValid) {
            throw new Error("Expected the test theme to be valid.");
        }

        expect(compileBlueprintTheme({ scopeId: "theme-1", theme: parseResult.theme })).toBe(
            `[data-bp-theme="theme-1"][data-bp-color-scheme="light"] {\n` +
                `  font-family: var(--bp-typography-family-body);\n` +
                `  --bp-button-font-size: 0.875rem;\n` +
                `  --bp-theme-focus-ring: oklch(88% 0.2 95);\n` +
                `  --bp-intent-primary-rest: #005bbb;\n` +
                `}\n` +
                `[data-bp-theme="theme-1"][data-bp-color-scheme="dark"] {\n` +
                `  font-family: var(--bp-typography-family-body);\n` +
                `  --bp-button-font-size: 0.875rem;\n` +
                `  --bp-theme-focus-ring: oklch(88% 0.2 95);\n` +
                `  --bp-intent-primary-rest: #4da1ff;\n` +
                `}\n`,
        );
    });

    it("maps Button targets, variants, states, and interactions to scoped Blueprint selectors", () => {
        const parseResult = parseBlueprintTheme({
            $schema: BLUEPRINT_THEME_V1_SCHEMA_URL,
            tokens: {},
            components: {
                button: {
                    active: { transform: "translateY(2px)" },
                    base: { borderRadius: "999px" },
                    "intent:primary": {
                        backgroundColor: "var(--bp-intent-primary-rest)",
                        ":focus": { boxShadow: "0 0 0 3px var(--bp-theme-focus-ring)" },
                        ":hover": { backgroundColor: "var(--bp-intent-primary-hover)" },
                    },
                    minimal: { boxShadow: "none" },
                    outlined: { borderWidth: "2px" },
                    disabled: { opacity: "1" },
                },
                "button-text": {
                    base: { lineHeight: "1.25rem" },
                },
            },
        });
        if (!parseResult.isValid) {
            throw new Error("Expected the test theme to be valid.");
        }

        const css = compileBlueprintTheme({ scopeId: "theme-2", theme: parseResult.theme });

        expect(css).toContain('[data-bp-theme="theme-2"] .bp6-button {\n  border-radius: 999px;\n}');
        expect(css).toContain('[data-bp-theme="theme-2"] .bp6-button.bp6-active {\n  transform: translateY(2px);\n}');
        expect(css).toContain(
            '[data-bp-theme="theme-2"] .bp6-button.bp6-intent-primary:focus {\n' +
                "  box-shadow: 0 0 0 3px var(--bp-theme-focus-ring);\n" +
                "}",
        );
        expect(css).toContain(
            '[data-bp-theme="theme-2"] .bp6-button.bp6-intent-primary:hover {\n' +
                "  background-color: var(--bp-intent-primary-hover);\n" +
                "}",
        );
        expect(css).toContain('[data-bp-theme="theme-2"] .bp6-button.bp6-minimal {\n  box-shadow: none;\n}');
        expect(css).toContain('[data-bp-theme="theme-2"] .bp6-button.bp6-outlined {\n  border-width: 2px;\n}');
        expect(css).toContain(
            '[data-bp-theme="theme-2"] .bp6-button.bp6-disabled,\n' +
                '[data-bp-theme="theme-2"] .bp6-button:disabled {\n' +
                "  opacity: 1;\n" +
                "}",
        );
        expect(css).toContain('[data-bp-theme="theme-2"] .bp6-button .bp6-button-text {\n  line-height: 1.25rem;\n}');
    });

    it("maps InputGroup targets and parent-owned intent and disabled states", () => {
        const parseResult = parseBlueprintTheme({
            $schema: BLUEPRINT_THEME_V1_SCHEMA_URL,
            tokens: {},
            components: {
                "input-group": {
                    "intent:danger": { color: "var(--bp-intent-danger-rest)" },
                },
                input: {
                    active: { boxShadow: "var(--bp-input-shadow-focus)" },
                    base: { borderRadius: "0.333rem" },
                    "intent:danger": {
                        borderColor: "var(--bp-intent-danger-rest)",
                        ":focus-visible": { boxShadow: "0 0 0 0.167rem var(--bp-theme-focus-ring)" },
                    },
                    disabled: { opacity: "1" },
                },
                "input-with-action": {
                    base: { paddingInlineEnd: "3.875rem" },
                },
                "input-with-left-element": {
                    base: { paddingInlineStart: "3.125rem" },
                    "intent:danger": {
                        ":focus": { color: "var(--bp-intent-danger-rest)" },
                    },
                },
                "input-left-container": {
                    base: { insetInlineStart: "1.25rem" },
                },
                "input-placeholder": {
                    base: { color: "var(--bp-input-foreground-placeholder)" },
                    disabled: { color: "var(--bp-typography-color-disabled)" },
                },
                "input-left-icon": {
                    base: { insetInlineStart: "1.25rem" },
                    disabled: { opacity: "0.5" },
                    "intent:danger": { color: "var(--bp-intent-danger-rest)" },
                },
                "input-action": {
                    base: { insetInlineEnd: "0.9375rem" },
                },
                "input-action-button": {
                    minimal: {
                        inlineSize: "2rem",
                        ":hover": { transform: "translateY(0.125rem)" },
                    },
                },
            },
        });
        if (!parseResult.isValid) {
            throw new Error("Expected the test theme to be valid.");
        }

        const css = compileBlueprintTheme({ scopeId: "theme-3", theme: parseResult.theme });

        expect(css).toContain(
            '[data-bp-theme="theme-3"] .bp6-input-group.bp6-intent-danger {\n' +
                "  color: var(--bp-intent-danger-rest);\n" +
                "}",
        );
        expect(css).toContain('[data-bp-theme="theme-3"] .bp6-input-group .bp6-input {\n  border-radius: 0.333rem;\n}');
        expect(css).toContain(
            '[data-bp-theme="theme-3"] .bp6-input.bp6-active {\n' +
                "  box-shadow: var(--bp-input-shadow-focus);\n" +
                "}",
        );
        expect(css).toContain(
            '[data-bp-theme="theme-3"] .bp6-input-group .bp6-input:not(:last-child) {\n' +
                "  padding-inline-end: 3.875rem;\n" +
                "}",
        );
        expect(css).toContain(
            '[data-bp-theme="theme-3"] .bp6-input-group .bp6-input:not(:first-child) {\n' +
                "  padding-inline-start: 3.125rem;\n" +
                "}",
        );
        expect(css).toContain(
            '[data-bp-theme="theme-3"] .bp6-input-group.bp6-intent-danger .bp6-input:not(:first-child):focus {\n' +
                "  color: var(--bp-intent-danger-rest);\n" +
                "}",
        );
        expect(css).toContain(
            '[data-bp-theme="theme-3"] .bp6-input-group.bp6-intent-danger .bp6-input:focus-visible {\n' +
                "  box-shadow: 0 0 0 0.167rem var(--bp-theme-focus-ring);\n" +
                "}",
        );
        expect(css).toContain(
            '[data-bp-theme="theme-3"] .bp6-input-group.bp6-disabled .bp6-input,\n' +
                '[data-bp-theme="theme-3"] .bp6-input:disabled {\n' +
                "  opacity: 1;\n" +
                "}",
        );
        expect(css).toContain(
            '[data-bp-theme="theme-3"] .bp6-input-group .bp6-input::placeholder {\n' +
                "  color: var(--bp-input-foreground-placeholder);\n" +
                "}",
        );
        expect(css).toContain(
            '[data-bp-theme="theme-3"] .bp6-input-group.bp6-disabled .bp6-input::placeholder,\n' +
                '[data-bp-theme="theme-3"] .bp6-input:disabled::placeholder {\n' +
                "  color: var(--bp-typography-color-disabled);\n" +
                "}",
        );
        expect(css).toContain(
            '[data-bp-theme="theme-3"] .bp6-input-left-container {\n  inset-inline-start: 1.25rem;\n}',
        );
        expect(css).toContain(
            '[data-bp-theme="theme-3"] .bp6-input-group > .bp6-icon {\n  inset-inline-start: 1.25rem;\n}',
        );
        expect(css).toContain(
            '[data-bp-theme="theme-3"] .bp6-input-group.bp6-disabled > .bp6-icon {\n  opacity: 0.5;\n}',
        );
        expect(css).toContain(
            '[data-bp-theme="theme-3"] .bp6-input-group.bp6-intent-danger > .bp6-icon {\n' +
                "  color: var(--bp-intent-danger-rest);\n" +
                "}",
        );
        expect(css).toContain('[data-bp-theme="theme-3"] .bp6-input-action {\n  inset-inline-end: 0.9375rem;\n}');
        expect(css).toContain(
            '[data-bp-theme="theme-3"] .bp6-input-action > .bp6-button.bp6-minimal:hover {\n' +
                "  transform: translateY(0.125rem);\n" +
                "}",
        );
    });

    it("maps Menu targets and parent-owned item states", () => {
        const parseResult = parseBlueprintTheme({
            $schema: BLUEPRINT_THEME_V1_SCHEMA_URL,
            tokens: {},
            components: {
                menu: {
                    base: { paddingBlock: "0.625rem" },
                },
                "menu-item": {
                    active: { outline: "none" },
                    "intent:primary": {
                        ":hover": { backgroundColor: "var(--bp-menu-item-background-primary-hover)" },
                    },
                    disabled: { opacity: "1" },
                    selected: { minBlockSize: "2.75rem" },
                },
                "menu-item-label": {
                    selected: { color: "inherit" },
                },
                "menu-item-icon": {
                    base: { color: "inherit" },
                    "intent:primary": {
                        ":hover": { color: "inherit" },
                    },
                },
                "menu-divider": {
                    base: { display: "none" },
                },
                "menu-item-separator": {
                    base: { borderBlockStart: "1px solid var(--bp-menu-divider-color)" },
                },
            },
        });
        if (!parseResult.isValid) {
            throw new Error("Expected the test theme to be valid.");
        }

        const css = compileBlueprintTheme({ scopeId: "theme-4", theme: parseResult.theme });

        expect(css).toContain('[data-bp-theme="theme-4"] .bp6-menu {\n  padding-block: 0.625rem;\n}');
        expect(css).toContain('[data-bp-theme="theme-4"] .bp6-menu-item.bp6-active {\n  outline: none;\n}');
        expect(css).toContain(
            '[data-bp-theme="theme-4"] .bp6-menu-item.bp6-intent-primary:hover {\n' +
                "  background-color: var(--bp-menu-item-background-primary-hover);\n" +
                "}",
        );
        expect(css).toContain('[data-bp-theme="theme-4"] .bp6-menu-item.bp6-disabled {\n  opacity: 1;\n}');
        expect(css).toContain('[data-bp-theme="theme-4"] .bp6-menu-item.bp6-selected {\n  min-block-size: 2.75rem;\n}');
        expect(css).toContain(
            '[data-bp-theme="theme-4"] .bp6-menu-item.bp6-selected .bp6-menu-item-label {\n  color: inherit;\n}',
        );
        expect(css).toContain(
            '[data-bp-theme="theme-4"] .bp6-menu-item .bp6-menu-item-icon,\n' +
                '[data-bp-theme="theme-4"] .bp6-menu-item .bp6-icon {\n' +
                "  color: inherit;\n" +
                "}",
        );
        expect(css).toContain(
            '[data-bp-theme="theme-4"] .bp6-menu-item.bp6-intent-primary:hover .bp6-menu-item-icon,\n' +
                '[data-bp-theme="theme-4"] .bp6-menu-item.bp6-intent-primary:hover .bp6-icon {\n' +
                "  color: inherit;\n" +
                "}",
        );
        expect(css).toContain('[data-bp-theme="theme-4"] .bp6-menu-divider {\n  display: none;\n}');
        expect(css).toContain(
            '[data-bp-theme="theme-4"] .bp6-menu > li:not(:first-child):not(.bp6-menu-divider) {\n' +
                "  border-block-start: 1px solid var(--bp-menu-divider-color);\n" +
                "}",
        );
    });

    it("maps Popover parts and its minimal variant inside the provider scope", () => {
        const parseResult = parseBlueprintTheme({
            $schema: BLUEPRINT_THEME_V1_SCHEMA_URL,
            tokens: {},
            components: {
                popover: {
                    base: { minInlineSize: "31.25rem" },
                    minimal: { borderRadius: "0.333rem" },
                },
                "popover-content": {
                    base: { overflow: "hidden" },
                    minimal: { borderWidth: "1px" },
                },
                "popover-arrow": {
                    base: { display: "none" },
                },
            },
        });
        if (!parseResult.isValid) {
            throw new Error("Expected the test theme to be valid.");
        }

        const css = compileBlueprintTheme({ scopeId: "theme-5", theme: parseResult.theme });

        expect(css).toContain('[data-bp-theme="theme-5"] .bp6-popover {\n  min-inline-size: 31.25rem;\n}');
        expect(css).toContain('[data-bp-theme="theme-5"] .bp6-popover.bp6-minimal {\n  border-radius: 0.333rem;\n}');
        expect(css).toContain('[data-bp-theme="theme-5"] .bp6-popover .bp6-popover-content {\n  overflow: hidden;\n}');
        expect(css).toContain(
            '[data-bp-theme="theme-5"] .bp6-popover.bp6-minimal .bp6-popover-content {\n  border-width: 1px;\n}',
        );
        expect(css).toContain('[data-bp-theme="theme-5"] .bp6-popover .bp6-popover-arrow {\n  display: none;\n}');
    });
});
