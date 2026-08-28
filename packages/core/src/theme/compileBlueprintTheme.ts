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

import {
    BLUEPRINT_THEME_INTERACTIONS,
    BLUEPRINT_THEME_TARGET_MANIFEST,
    type BlueprintThemeDeclaration,
    type BlueprintThemeInteraction,
    type BlueprintThemeModifier,
    type BlueprintThemeTarget,
    type BlueprintThemeTokenValue,
    type BlueprintThemeV1,
    parseBlueprintTheme,
} from "./blueprintTheme";
import { getThemeTargetSelectorTemplates, INTERACTION_PLACEHOLDER } from "./themeTargetSelectors";

const SCOPE_ID_PATTERN = /^[A-Za-z][A-Za-z0-9_-]*$/;

export interface CompileBlueprintThemeOptions {
    readonly scopeId: string;
    readonly theme: BlueprintThemeV1;
}

/** Compiles a validated Blueprint theme to CSS scoped to one provider-owned identifier. */
export function compileBlueprintTheme({ scopeId, theme }: CompileBlueprintThemeOptions): string {
    if (!SCOPE_ID_PATTERN.test(scopeId)) {
        throw new Error("Blueprint theme scope IDs must contain only letters, numbers, underscores, or hyphens.");
    }

    // TypeScript cannot prove that a theme object did not originate in untyped JavaScript, so revalidate at this boundary.
    const validationResult = parseBlueprintTheme(theme);
    if (!validationResult.isValid) {
        const firstError = validationResult.errors[0];
        throw new Error(
            firstError === undefined
                ? "Cannot compile an invalid Blueprint theme."
                : `Cannot compile Blueprint theme at ${firstError.path}: expected ${firstError.expected}. ${firstError.action}`,
        );
    }

    const scopeSelector = `[data-bp-theme="${scopeId}"]`;
    const commonDeclarations = ["font-family: var(--bp-typography-family-body)"];
    const lightDeclarations: string[] = [];
    const darkDeclarations: string[] = [];

    for (const [tokenName, tokenValue] of Object.entries(validationResult.theme.tokens)) {
        if (typeof tokenValue === "string") {
            commonDeclarations.push(`${tokenName}: ${tokenValue}`);
        } else {
            addSchemeTokenDeclarations(tokenName, tokenValue, lightDeclarations, darkDeclarations);
        }
    }

    return (
        formatRule(`${scopeSelector}[data-bp-color-scheme="light"]`, [...commonDeclarations, ...lightDeclarations]) +
        formatRule(`${scopeSelector}[data-bp-color-scheme="dark"]`, [...commonDeclarations, ...darkDeclarations]) +
        compileComponentRules(scopeSelector, validationResult.theme)
    );
}

function addSchemeTokenDeclarations(
    tokenName: string,
    tokenValue: Exclude<BlueprintThemeTokenValue, string>,
    lightDeclarations: string[],
    darkDeclarations: string[],
): void {
    lightDeclarations.push(`${tokenName}: ${tokenValue.light}`);
    darkDeclarations.push(`${tokenName}: ${tokenValue.dark}`);
}

function formatRule(selector: string, declarations: readonly string[]): string {
    if (declarations.length === 0) {
        return "";
    }
    return `${selector} {\n${declarations.map(declaration => `  ${declaration};`).join("\n")}\n}\n`;
}

function compileComponentRules(scopeSelector: string, theme: BlueprintThemeV1): string {
    const rules: string[] = [];

    for (const [targetName, targetOverrides] of Object.entries(theme.components)) {
        if (!isThemeTarget(targetName) || targetOverrides === undefined) {
            continue;
        }
        for (const [modifierName, declaration] of Object.entries(targetOverrides)) {
            if (!isThemeModifier(targetName, modifierName) || declaration === undefined) {
                continue;
            }
            rules.push(...compileDeclarationRules(scopeSelector, targetName, modifierName, declaration));
        }
    }

    return rules.join("");
}

function compileDeclarationRules(
    scopeSelector: string,
    target: BlueprintThemeTarget,
    modifier: BlueprintThemeModifier,
    declaration: BlueprintThemeDeclaration,
): readonly string[] {
    const selectorTemplates = getThemeTargetSelectorTemplates(target, modifier);
    const baseDeclarations: string[] = [];
    const interactionDeclarations: Partial<Record<BlueprintThemeInteraction, readonly string[]>> = {};

    for (const [propertyName, propertyValue] of Object.entries(declaration)) {
        if (isThemeInteraction(propertyName) && typeof propertyValue === "object") {
            interactionDeclarations[propertyName] = formatDeclarations(propertyValue);
        } else if (typeof propertyValue === "string") {
            baseDeclarations.push(formatDeclaration(propertyName, propertyValue));
        }
    }

    const rules = [formatSelectorTemplateRule(scopeSelector, selectorTemplates, "", baseDeclarations)];
    for (const interaction of BLUEPRINT_THEME_INTERACTIONS) {
        rules.push(
            formatSelectorTemplateRule(
                scopeSelector,
                selectorTemplates,
                interaction,
                interactionDeclarations[interaction] ?? [],
            ),
        );
    }
    return rules.filter(rule => rule !== "");
}

function formatSelectorTemplateRule(
    scopeSelector: string,
    selectorTemplates: readonly string[],
    interaction: "" | BlueprintThemeInteraction,
    declarations: readonly string[],
): string {
    const selector = selectorTemplates
        .map(template => `${scopeSelector} ${template.replace(INTERACTION_PLACEHOLDER, interaction)}`)
        .join(",\n");
    return formatRule(selector, declarations);
}

function formatDeclarations(declaration: Readonly<Record<string, string>>): readonly string[] {
    return Object.entries(declaration).map(([propertyName, propertyValue]) =>
        formatDeclaration(propertyName, propertyValue),
    );
}

function formatDeclaration(propertyName: string, propertyValue: string): string {
    const cssPropertyName = propertyName.startsWith("--")
        ? propertyName
        : propertyName.replace(/[A-Z]/g, character => `-${character.toLowerCase()}`);
    return `${cssPropertyName}: ${propertyValue}`;
}

function isThemeTarget(value: string): value is BlueprintThemeTarget {
    return Object.prototype.hasOwnProperty.call(BLUEPRINT_THEME_TARGET_MANIFEST, value);
}

function isThemeModifier(target: BlueprintThemeTarget, value: string): value is BlueprintThemeModifier {
    const modifiers: readonly string[] = BLUEPRINT_THEME_TARGET_MANIFEST[target].modifiers;
    return modifiers.includes(value);
}

function isThemeInteraction(value: string): value is BlueprintThemeInteraction {
    return BLUEPRINT_THEME_INTERACTIONS.some(interaction => interaction === value);
}
