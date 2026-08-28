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

/* eslint-disable sort-keys -- Theme documents and validation errors follow their documented semantic order. */

export const BLUEPRINT_THEME_V1_SCHEMA_URL = "https://blueprintjs.com/schemas/theme/v1.json";

const BLUEPRINT_THEME_NON_FOCUS_INTERACTIONS = [":hover", ":active", ":focus-visible"] as const;
export const BLUEPRINT_THEME_INTERACTIONS = [...BLUEPRINT_THEME_NON_FOCUS_INTERACTIONS, ":focus"] as const;

const INTENT_MODIFIERS = ["intent:primary", "intent:success", "intent:warning", "intent:danger"] as const;
const TOKEN_NAME_PATTERN = /^--bp-[a-z0-9]+(?:-[a-z0-9]+)*$/;
const CSS_PROPERTY_NAME_PATTERN = /^(?:[a-z][A-Za-z0-9]*|--bp-theme-[a-z0-9]+(?:-[a-z0-9]+)*)$/;
/** Shared with JSON Schema generation so static and runtime CSS-value safety checks cannot drift. */
export const BLUEPRINT_THEME_UNSAFE_CSS_VALUE_PATTERN_SOURCE = String.raw`[;{}]|/\*|\*/|</?[sS][tT][yY][lL][eE]|[\u0000-\u001f\u007f]`;
const UNSAFE_CSS_VALUE_PATTERN = new RegExp(BLUEPRINT_THEME_UNSAFE_CSS_VALUE_PATTERN_SOURCE);

export const BLUEPRINT_THEME_TARGET_MANIFEST = {
    button: {
        modifiers: ["base", ...INTENT_MODIFIERS, "minimal", "outlined", "active", "disabled"],
        interactions: BLUEPRINT_THEME_INTERACTIONS,
    },
    "button-text": {
        modifiers: ["base", ...INTENT_MODIFIERS, "minimal", "outlined", "disabled"],
        interactions: BLUEPRINT_THEME_NON_FOCUS_INTERACTIONS,
    },
    "input-group": {
        modifiers: ["base", ...INTENT_MODIFIERS, "disabled"],
        interactions: BLUEPRINT_THEME_NON_FOCUS_INTERACTIONS,
    },
    input: {
        modifiers: ["base", ...INTENT_MODIFIERS, "active", "disabled"],
        interactions: BLUEPRINT_THEME_INTERACTIONS,
    },
    "input-with-left-element": {
        modifiers: ["base", ...INTENT_MODIFIERS, "active", "disabled"],
        interactions: BLUEPRINT_THEME_INTERACTIONS,
    },
    "input-with-action": {
        modifiers: ["base", ...INTENT_MODIFIERS, "active", "disabled"],
        interactions: BLUEPRINT_THEME_INTERACTIONS,
    },
    "input-placeholder": {
        modifiers: ["base", ...INTENT_MODIFIERS, "active", "disabled"],
        interactions: [],
    },
    "input-left-container": {
        modifiers: ["base", ...INTENT_MODIFIERS, "disabled"],
        interactions: BLUEPRINT_THEME_NON_FOCUS_INTERACTIONS,
    },
    "input-left-icon": {
        modifiers: ["base", ...INTENT_MODIFIERS, "disabled"],
        interactions: BLUEPRINT_THEME_NON_FOCUS_INTERACTIONS,
    },
    "input-action": {
        modifiers: ["base", ...INTENT_MODIFIERS, "disabled"],
        interactions: BLUEPRINT_THEME_NON_FOCUS_INTERACTIONS,
    },
    "input-action-button": {
        modifiers: ["base", ...INTENT_MODIFIERS, "minimal", "outlined", "disabled"],
        interactions: BLUEPRINT_THEME_INTERACTIONS,
    },
    menu: {
        modifiers: ["base"],
        interactions: BLUEPRINT_THEME_NON_FOCUS_INTERACTIONS,
    },
    "menu-item": {
        modifiers: ["base", ...INTENT_MODIFIERS, "active", "disabled", "selected"],
        interactions: BLUEPRINT_THEME_INTERACTIONS,
    },
    "menu-item-label": {
        modifiers: ["base", ...INTENT_MODIFIERS, "active", "disabled", "selected"],
        interactions: BLUEPRINT_THEME_NON_FOCUS_INTERACTIONS,
    },
    "menu-item-icon": {
        modifiers: ["base", ...INTENT_MODIFIERS, "active", "disabled", "selected"],
        interactions: BLUEPRINT_THEME_INTERACTIONS,
    },
    "menu-divider": {
        modifiers: ["base"],
        interactions: BLUEPRINT_THEME_NON_FOCUS_INTERACTIONS,
    },
    "menu-item-separator": {
        modifiers: ["base"],
        interactions: BLUEPRINT_THEME_NON_FOCUS_INTERACTIONS,
    },
    popover: {
        modifiers: ["base", "minimal"],
        interactions: BLUEPRINT_THEME_NON_FOCUS_INTERACTIONS,
    },
    "popover-content": {
        modifiers: ["base", "minimal"],
        interactions: BLUEPRINT_THEME_NON_FOCUS_INTERACTIONS,
    },
    "popover-arrow": {
        modifiers: ["base", "minimal"],
        interactions: BLUEPRINT_THEME_NON_FOCUS_INTERACTIONS,
    },
} as const;

export type BlueprintThemeInteraction = (typeof BLUEPRINT_THEME_INTERACTIONS)[number];
export type BlueprintThemeTarget = keyof typeof BLUEPRINT_THEME_TARGET_MANIFEST;
export type BlueprintThemeModifier =
    (typeof BLUEPRINT_THEME_TARGET_MANIFEST)[BlueprintThemeTarget]["modifiers"][number];

export type BlueprintThemeTokenValue = string | Readonly<{ light: string; dark: string }>;
export type BlueprintThemeInteractionDeclaration = Readonly<Record<string, string>>;
export type BlueprintThemeDeclaration = Readonly<Record<string, string | BlueprintThemeInteractionDeclaration>>;
export type BlueprintThemeTargetOverrides<Target extends BlueprintThemeTarget> = Readonly<
    Partial<Record<(typeof BLUEPRINT_THEME_TARGET_MANIFEST)[Target]["modifiers"][number], BlueprintThemeDeclaration>>
>;
type BlueprintThemeComponents = Readonly<{
    [Target in BlueprintThemeTarget]?: BlueprintThemeTargetOverrides<Target>;
}>;
type ValidatedThemeTargetOverrides = Partial<Record<BlueprintThemeModifier, BlueprintThemeDeclaration>>;

export interface BlueprintThemeV1 {
    readonly $schema: typeof BLUEPRINT_THEME_V1_SCHEMA_URL;
    readonly tokens: Readonly<Record<string, BlueprintThemeTokenValue>>;
    readonly components: BlueprintThemeComponents;
}

export interface BlueprintThemeValidationError {
    readonly path: string;
    readonly expected: string;
    readonly action: string;
}

export type BlueprintThemeValidationResult =
    | Readonly<{ isValid: true; theme: BlueprintThemeV1 }>
    | Readonly<{ isValid: false; errors: readonly BlueprintThemeValidationError[] }>;

/** Parses JSON text or validates decoded input at one boundary so every consumer applies the same safety checks. */
export function parseBlueprintTheme(input: unknown): BlueprintThemeValidationResult {
    let decodedInput: unknown = input;

    if (typeof input === "string") {
        try {
            const parsedInput: unknown = JSON.parse(input);
            decodedInput = parsedInput;
        } catch (_error: unknown) {
            return {
                isValid: false,
                errors: [
                    {
                        path: "$",
                        expected: "valid JSON",
                        action: "Fix the JSON syntax and try again.",
                    },
                ],
            };
        }
    }

    if (!isPlainObject(decodedInput)) {
        return {
            isValid: false,
            errors: [
                {
                    path: "$",
                    expected: "a Blueprint V1 theme object",
                    action: "Provide an object with $schema, tokens, and components properties.",
                },
            ],
        };
    }

    const errors: BlueprintThemeValidationError[] = [];
    if (decodedInput.$schema !== BLUEPRINT_THEME_V1_SCHEMA_URL) {
        errors.push({
            path: "$.$schema",
            expected: BLUEPRINT_THEME_V1_SCHEMA_URL,
            action: "Use the Blueprint V1 schema URL exactly as published.",
        });
    }
    if (!isPlainObject(decodedInput.tokens)) {
        errors.push({
            path: "$.tokens",
            expected: "an object of Blueprint token values",
            action: "Add a tokens object; use an empty object when there are no token overrides.",
        });
    }
    if (!isPlainObject(decodedInput.components)) {
        errors.push({
            path: "$.components",
            expected: "an object of supported Blueprint component targets",
            action: "Replace components with an object; use an empty object when there are no overrides.",
        });
    }
    for (const propertyName of Object.keys(decodedInput)) {
        if (propertyName !== "$schema" && propertyName !== "tokens" && propertyName !== "components") {
            errors.push({
                path: appendPropertyPath("$", propertyName),
                expected: "only $schema, tokens, and components properties",
                action: "Remove the unsupported root property.",
            });
        }
    }
    const tokens = isPlainObject(decodedInput.tokens) ? validateTokens(decodedInput.tokens, errors) : {};
    const components = isPlainObject(decodedInput.components)
        ? validateComponents(decodedInput.components, errors)
        : {};
    if (errors.length > 0) {
        return { isValid: false, errors };
    }

    return {
        isValid: true,
        theme: {
            $schema: BLUEPRINT_THEME_V1_SCHEMA_URL,
            tokens,
            components,
        },
    };
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function appendPropertyPath(parentPath: string, propertyName: string): string {
    return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(propertyName)
        ? `${parentPath}.${propertyName}`
        : `${parentPath}[${JSON.stringify(propertyName)}]`;
}

function validateTokens(
    input: Record<string, unknown>,
    errors: BlueprintThemeValidationError[],
): Record<string, BlueprintThemeTokenValue> {
    const tokens: Record<string, BlueprintThemeTokenValue> = {};

    for (const [tokenName, tokenValue] of Object.entries(input)) {
        const tokenPath = appendPropertyPath("$.tokens", tokenName);
        if (!TOKEN_NAME_PATTERN.test(tokenName)) {
            errors.push({
                path: tokenPath,
                expected: "a lowercase --bp-* custom property name",
                action: "Rename the token to a Blueprint public token or a --bp-theme-* variable.",
            });
            continue;
        }
        if (tokenName === "--bp-private" || tokenName.startsWith("--bp-private-")) {
            errors.push({
                path: tokenPath,
                expected: "a public --bp-* token name",
                action: "Use a public semantic or component token; private tokens are not theme API.",
            });
            continue;
        }
        if (typeof tokenValue === "string") {
            if (isSafeCssValue(tokenValue)) {
                tokens[tokenName] = tokenValue;
            } else {
                addUnsafeCssValueError(errors, tokenPath);
            }
            continue;
        }
        if (!isLightDarkTokenValue(tokenValue)) {
            errors.push({
                path: tokenPath,
                expected: "a CSS string or an object with exactly light and dark CSS strings",
                action: "Add both light and dark strings, or replace the object with one CSS string.",
            });
            continue;
        }

        const lightPath = appendPropertyPath(tokenPath, "light");
        const darkPath = appendPropertyPath(tokenPath, "dark");
        if (!isSafeCssValue(tokenValue.light)) {
            addUnsafeCssValueError(errors, lightPath);
        }
        if (!isSafeCssValue(tokenValue.dark)) {
            addUnsafeCssValueError(errors, darkPath);
        }
        if (isSafeCssValue(tokenValue.light) && isSafeCssValue(tokenValue.dark)) {
            tokens[tokenName] = { light: tokenValue.light, dark: tokenValue.dark };
        }
    }

    return tokens;
}

function isLightDarkTokenValue(value: unknown): value is Readonly<{ light: string; dark: string }> {
    if (!isPlainObject(value)) {
        return false;
    }
    const propertyNames = Object.keys(value);
    return (
        propertyNames.length === 2 &&
        propertyNames.includes("light") &&
        propertyNames.includes("dark") &&
        typeof value.light === "string" &&
        typeof value.dark === "string"
    );
}

function isSafeCssValue(value: string): boolean {
    return value.trim().length > 0 && !UNSAFE_CSS_VALUE_PATTERN.test(value);
}

function addUnsafeCssValueError(errors: BlueprintThemeValidationError[], path: string): void {
    errors.push({
        path,
        expected: "a safe, non-empty CSS value",
        action: "Remove control characters, comments, semicolons, braces, or style-tag text.",
    });
}

function validateComponents(
    input: Record<string, unknown>,
    errors: BlueprintThemeValidationError[],
): BlueprintThemeComponents {
    const components: Partial<Record<BlueprintThemeTarget, ValidatedThemeTargetOverrides>> = {};
    const supportedTargets = Object.keys(BLUEPRINT_THEME_TARGET_MANIFEST).join(", ");

    for (const [targetName, targetValue] of Object.entries(input)) {
        const targetPath = appendPropertyPath("$.components", targetName);
        if (!isBlueprintThemeTarget(targetName)) {
            errors.push({
                path: targetPath,
                expected: `one of: ${supportedTargets}`,
                action: "Replace or remove the unsupported component target.",
            });
            continue;
        }
        if (!isPlainObject(targetValue)) {
            errors.push({
                path: targetPath,
                expected: "an object of documented modifiers",
                action: `Replace the ${targetName} value with an object of documented modifiers.`,
            });
            continue;
        }

        const targetOverrides = validateTargetOverrides(targetName, targetValue, errors, targetPath);
        components[targetName] = targetOverrides;
    }

    return components;
}

function validateTargetOverrides(
    targetName: BlueprintThemeTarget,
    input: Record<string, unknown>,
    errors: BlueprintThemeValidationError[],
    targetPath: string,
): ValidatedThemeTargetOverrides {
    const targetOverrides: ValidatedThemeTargetOverrides = {};
    const allowedModifiers: readonly string[] = BLUEPRINT_THEME_TARGET_MANIFEST[targetName].modifiers;

    for (const [modifierName, modifierValue] of Object.entries(input)) {
        const modifierPath = appendPropertyPath(targetPath, modifierName);
        if (!isBlueprintThemeModifier(targetName, modifierName)) {
            errors.push({
                path: modifierPath,
                expected: `one of: ${allowedModifiers.join(", ")}`,
                action: `Use a modifier documented for the ${targetName} target.`,
            });
            continue;
        }
        if (!isPlainObject(modifierValue)) {
            errors.push({
                path: modifierPath,
                expected: "an object of CSS declarations and documented interactions",
                action: "Replace the modifier value with a declaration object.",
            });
            continue;
        }

        targetOverrides[modifierName] = validateDeclaration(targetName, modifierValue, errors, modifierPath);
    }

    return targetOverrides;
}

function validateDeclaration(
    targetName: BlueprintThemeTarget,
    input: Record<string, unknown>,
    errors: BlueprintThemeValidationError[],
    declarationPath: string,
): BlueprintThemeDeclaration {
    const declaration: Record<string, string | BlueprintThemeInteractionDeclaration> = {};

    for (const [propertyName, propertyValue] of Object.entries(input)) {
        const propertyPath = appendPropertyPath(declarationPath, propertyName);
        if (propertyName.startsWith(":")) {
            if (!isBlueprintThemeInteraction(targetName, propertyName)) {
                const allowedInteractions: readonly string[] = BLUEPRINT_THEME_TARGET_MANIFEST[targetName].interactions;
                errors.push({
                    path: propertyPath,
                    expected:
                        allowedInteractions.length === 0
                            ? "CSS declarations only; interactions are not supported"
                            : `one of: ${allowedInteractions.join(", ")}`,
                    action:
                        allowedInteractions.length === 0
                            ? `Remove the interaction from the ${targetName} target.`
                            : `Use an interaction documented for the ${targetName} target, or remove the interaction.`,
                });
                continue;
            }
            if (!isPlainObject(propertyValue)) {
                errors.push({
                    path: propertyPath,
                    expected: "an object of CSS declarations",
                    action: "Replace the interaction value with a CSS declaration object.",
                });
                continue;
            }
            declaration[propertyName] = validateInteractionDeclaration(propertyValue, errors, propertyPath);
            continue;
        }
        if (!CSS_PROPERTY_NAME_PATTERN.test(propertyName)) {
            addInvalidCssPropertyError(errors, propertyPath);
            continue;
        }
        if (typeof propertyValue !== "string" || !isSafeCssValue(propertyValue)) {
            addUnsafeCssValueError(errors, propertyPath);
            continue;
        }
        declaration[propertyName] = propertyValue;
    }

    return declaration;
}

function validateInteractionDeclaration(
    input: Record<string, unknown>,
    errors: BlueprintThemeValidationError[],
    interactionPath: string,
): BlueprintThemeInteractionDeclaration {
    const declaration: Record<string, string> = {};

    for (const [propertyName, propertyValue] of Object.entries(input)) {
        const propertyPath = appendPropertyPath(interactionPath, propertyName);
        if (!CSS_PROPERTY_NAME_PATTERN.test(propertyName)) {
            addInvalidCssPropertyError(errors, propertyPath);
            continue;
        }
        if (typeof propertyValue !== "string" || !isSafeCssValue(propertyValue)) {
            addUnsafeCssValueError(errors, propertyPath);
            continue;
        }
        declaration[propertyName] = propertyValue;
    }

    return declaration;
}

function isBlueprintThemeTarget(value: string): value is BlueprintThemeTarget {
    return Object.prototype.hasOwnProperty.call(BLUEPRINT_THEME_TARGET_MANIFEST, value);
}

function isBlueprintThemeInteraction(
    targetName: BlueprintThemeTarget,
    value: string,
): value is BlueprintThemeInteraction {
    const interactions: readonly string[] = BLUEPRINT_THEME_TARGET_MANIFEST[targetName].interactions;
    return interactions.includes(value);
}

function isBlueprintThemeModifier(targetName: BlueprintThemeTarget, value: string): value is BlueprintThemeModifier {
    const modifiers: readonly string[] = BLUEPRINT_THEME_TARGET_MANIFEST[targetName].modifiers;
    return modifiers.includes(value);
}

function addInvalidCssPropertyError(errors: BlueprintThemeValidationError[], path: string): void {
    errors.push({
        path,
        expected: "a camelCase CSS property name or --bp-theme-* custom property",
        action: "Use a camelCase property such as backgroundColor, or remove the declaration.",
    });
}
