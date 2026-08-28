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

import { Classes } from "../common";

import { type BlueprintThemeModifier, type BlueprintThemeTarget } from "./blueprintTheme";

/** Marks where the compiler inserts an interaction pseudo after it has attached the provider scope. */
export const INTERACTION_PLACEHOLDER = "{{interaction}}";

/** Returns Blueprint-owned selector templates without exposing them in the public target manifest. */
export function getThemeTargetSelectorTemplates(
    target: BlueprintThemeTarget,
    modifier: BlueprintThemeModifier,
): readonly string[] {
    switch (target) {
        case "button":
            return getButtonOwnerSelectorTemplates(modifier);
        case "button-text":
            return getButtonOwnerSelectorTemplates(modifier).map(selector => `${selector} .${Classes.BUTTON_TEXT}`);
        case "input-group":
            return getInputGroupSelectorTemplates(modifier);
        case "input":
            return getInputSelectorTemplates(modifier);
        case "input-with-left-element":
            return getConditionalInputSelectorTemplates(modifier, ":not(:first-child)");
        case "input-with-action":
            return getConditionalInputSelectorTemplates(modifier, ":not(:last-child)");
        case "input-placeholder":
            return getInputPlaceholderSelectorTemplates(modifier);
        case "input-left-container":
            // InputGroup owns both part containers as direct children, which keeps intent and disabled state tied to the
            // nearest InputGroup instead of a nested group.
            return getInputPartSelectorTemplates({
                modifier,
                parentCombinator: " > ",
                partSelector: `.${Classes.INPUT_LEFT_CONTAINER}`,
            });
        case "input-left-icon":
            // InputGroup renders leftIcon directly, while right-side icons are nested inside INPUT_ACTION.
            return getInputPartSelectorTemplates({
                baseParentSelector: `.${Classes.INPUT_GROUP}`,
                modifier,
                parentCombinator: " > ",
                partSelector: `.${Classes.ICON}`,
            });
        case "input-action":
            return getInputPartSelectorTemplates({
                modifier,
                parentCombinator: " > ",
                partSelector: `.${Classes.INPUT_ACTION}`,
            });
        case "input-action-button":
            // InputGroup renders rightElement directly inside INPUT_ACTION; only Buttons in that owned slot are themed.
            return getButtonOwnerSelectorTemplates(modifier).map(selector => `.${Classes.INPUT_ACTION} > ${selector}`);
        case "menu":
            return getBaseOnlySelectorTemplates({ modifier, selector: `.${Classes.MENU}`, targetName: "Menu" });
        case "menu-item":
            return getMenuItemSelectorTemplates(modifier);
        case "menu-item-label":
            return getMenuItemSelectorTemplates(modifier).map(selector => `${selector} .${Classes.MENU_ITEM_LABEL}`);
        case "menu-item-icon":
            return getMenuItemSelectorTemplates(modifier).flatMap(selector => [
                `${selector} .${Classes.MENU_ITEM_ICON}`,
                `${selector} .${Classes.ICON}`,
            ]);
        case "menu-divider":
            return getBaseOnlySelectorTemplates({
                modifier,
                selector: `.${Classes.MENU_DIVIDER}`,
                targetName: "MenuDivider",
            });
        case "menu-item-separator":
            return getBaseOnlySelectorTemplates({
                modifier,
                selector: `.${Classes.MENU} > li:not(:first-child):not(.${Classes.MENU_DIVIDER})`,
                targetName: "Menu item separator",
            });
        case "popover":
            return getPopoverOwnerSelectorTemplates(modifier);
        case "popover-content":
            return getPopoverOwnerSelectorTemplates(modifier).map(
                selector => `${selector} .${Classes.POPOVER_CONTENT}`,
            );
        case "popover-arrow":
            return getPopoverOwnerSelectorTemplates(modifier).map(selector => `${selector} .${Classes.POPOVER_ARROW}`);
        default:
            target satisfies never;
            return [];
    }
}

function getButtonOwnerSelectorTemplates(modifier: BlueprintThemeModifier): readonly string[] {
    const buttonSelector = `.${Classes.BUTTON}`;
    switch (modifier) {
        case "base":
            return [`${buttonSelector}${INTERACTION_PLACEHOLDER}`];
        case "intent:primary":
            return [`${buttonSelector}.${Classes.INTENT_PRIMARY}${INTERACTION_PLACEHOLDER}`];
        case "intent:success":
            return [`${buttonSelector}.${Classes.INTENT_SUCCESS}${INTERACTION_PLACEHOLDER}`];
        case "intent:warning":
            return [`${buttonSelector}.${Classes.INTENT_WARNING}${INTERACTION_PLACEHOLDER}`];
        case "intent:danger":
            return [`${buttonSelector}.${Classes.INTENT_DANGER}${INTERACTION_PLACEHOLDER}`];
        case "minimal":
            return [`${buttonSelector}.${Classes.MINIMAL}${INTERACTION_PLACEHOLDER}`];
        case "outlined":
            return [`${buttonSelector}.${Classes.OUTLINED}${INTERACTION_PLACEHOLDER}`];
        case "active":
            return [`${buttonSelector}.${Classes.ACTIVE}${INTERACTION_PLACEHOLDER}`];
        case "disabled":
            return [
                `${buttonSelector}.${Classes.DISABLED}${INTERACTION_PLACEHOLDER}`,
                `${buttonSelector}:disabled${INTERACTION_PLACEHOLDER}`,
            ];
        case "selected":
            throw new Error("The selected modifier is not supported by the Button theme target.");
    }
}

function getInputGroupSelectorTemplates(modifier: BlueprintThemeModifier): readonly string[] {
    const inputGroupSelector = `.${Classes.INPUT_GROUP}`;
    if (modifier === "base") {
        return [`${inputGroupSelector}${INTERACTION_PLACEHOLDER}`];
    }
    if (modifier === "disabled") {
        return [`${inputGroupSelector}.${Classes.DISABLED}${INTERACTION_PLACEHOLDER}`];
    }
    const intentClassName = getIntentClassName(modifier);
    if (intentClassName !== undefined) {
        return [`${inputGroupSelector}.${intentClassName}${INTERACTION_PLACEHOLDER}`];
    }
    throw new Error(`The ${modifier} modifier is not supported by the InputGroup theme target.`);
}

function getInputSelectorTemplates(modifier: BlueprintThemeModifier): readonly string[] {
    const inputSelector = `.${Classes.INPUT}`;
    if (modifier === "base") {
        return [`.${Classes.INPUT_GROUP} ${inputSelector}${INTERACTION_PLACEHOLDER}`];
    }
    if (modifier === "disabled") {
        return [
            `.${Classes.INPUT_GROUP}.${Classes.DISABLED} ${inputSelector}${INTERACTION_PLACEHOLDER}`,
            `${inputSelector}:disabled${INTERACTION_PLACEHOLDER}`,
        ];
    }
    if (modifier === "active") {
        return [`${inputSelector}.${Classes.ACTIVE}${INTERACTION_PLACEHOLDER}`];
    }
    const intentClassName = getIntentClassName(modifier);
    if (intentClassName !== undefined) {
        return [`.${Classes.INPUT_GROUP}.${intentClassName} ${inputSelector}${INTERACTION_PLACEHOLDER}`];
    }
    throw new Error(`The ${modifier} modifier is not supported by the Input theme target.`);
}

function getConditionalInputSelectorTemplates(
    modifier: BlueprintThemeModifier,
    condition: ":not(:first-child)" | ":not(:last-child)",
): readonly string[] {
    const inputSelector = `.${Classes.INPUT}${condition}`;
    if (modifier === "base") {
        return [`.${Classes.INPUT_GROUP} ${inputSelector}${INTERACTION_PLACEHOLDER}`];
    }
    if (modifier === "disabled") {
        return [
            `.${Classes.INPUT_GROUP}.${Classes.DISABLED} ${inputSelector}${INTERACTION_PLACEHOLDER}`,
            `${inputSelector}:disabled${INTERACTION_PLACEHOLDER}`,
        ];
    }
    if (modifier === "active") {
        return [`${inputSelector}.${Classes.ACTIVE}${INTERACTION_PLACEHOLDER}`];
    }
    const intentClassName = getIntentClassName(modifier);
    if (intentClassName !== undefined) {
        return [`.${Classes.INPUT_GROUP}.${intentClassName} ${inputSelector}${INTERACTION_PLACEHOLDER}`];
    }
    throw new Error(`The ${modifier} modifier is not supported by this conditional Input theme target.`);
}

function getInputPlaceholderSelectorTemplates(modifier: BlueprintThemeModifier): readonly string[] {
    const inputSelector = `.${Classes.INPUT}`;
    if (modifier === "base") {
        return [`.${Classes.INPUT_GROUP} ${inputSelector}::placeholder`];
    }
    if (modifier === "disabled") {
        return [
            `.${Classes.INPUT_GROUP}.${Classes.DISABLED} ${inputSelector}::placeholder`,
            `${inputSelector}:disabled::placeholder`,
        ];
    }
    if (modifier === "active") {
        return [`${inputSelector}.${Classes.ACTIVE}::placeholder`];
    }
    const intentClassName = getIntentClassName(modifier);
    if (intentClassName !== undefined) {
        return [`.${Classes.INPUT_GROUP}.${intentClassName} ${inputSelector}::placeholder`];
    }
    throw new Error(`The ${modifier} modifier is not supported by the Input placeholder theme target.`);
}

interface InputPartSelectorOptions {
    readonly baseParentSelector?: string;
    readonly modifier: BlueprintThemeModifier;
    readonly partSelector: string;
    readonly parentCombinator: " " | " > ";
}

function getInputPartSelectorTemplates({
    baseParentSelector,
    modifier,
    partSelector,
    parentCombinator,
}: InputPartSelectorOptions): readonly string[] {
    if (modifier === "base") {
        const baseSelector =
            baseParentSelector === undefined ? partSelector : `${baseParentSelector}${parentCombinator}${partSelector}`;
        return [`${baseSelector}${INTERACTION_PLACEHOLDER}`];
    }
    if (modifier === "disabled") {
        return [
            `.${Classes.INPUT_GROUP}.${Classes.DISABLED}${parentCombinator}${partSelector}${INTERACTION_PLACEHOLDER}`,
        ];
    }
    const intentClassName = getIntentClassName(modifier);
    if (intentClassName !== undefined) {
        return [
            `.${Classes.INPUT_GROUP}.${intentClassName}${parentCombinator}${partSelector}${INTERACTION_PLACEHOLDER}`,
        ];
    }
    throw new Error(`The ${modifier} modifier is not supported by this InputGroup part theme target.`);
}

function getIntentClassName(modifier: BlueprintThemeModifier): string | undefined {
    switch (modifier) {
        case "intent:primary":
            return Classes.INTENT_PRIMARY;
        case "intent:success":
            return Classes.INTENT_SUCCESS;
        case "intent:warning":
            return Classes.INTENT_WARNING;
        case "intent:danger":
            return Classes.INTENT_DANGER;
        default:
            return undefined;
    }
}

function getMenuItemSelectorTemplates(modifier: BlueprintThemeModifier): readonly string[] {
    const menuItemSelector = `.${Classes.MENU_ITEM}`;
    if (modifier === "base") {
        return [`${menuItemSelector}${INTERACTION_PLACEHOLDER}`];
    }
    if (modifier === "disabled") {
        return [`${menuItemSelector}.${Classes.DISABLED}${INTERACTION_PLACEHOLDER}`];
    }
    if (modifier === "selected") {
        return [`${menuItemSelector}.${Classes.SELECTED}${INTERACTION_PLACEHOLDER}`];
    }
    if (modifier === "active") {
        return [`${menuItemSelector}.${Classes.ACTIVE}${INTERACTION_PLACEHOLDER}`];
    }
    const intentClassName = getIntentClassName(modifier);
    if (intentClassName !== undefined) {
        return [`${menuItemSelector}.${intentClassName}${INTERACTION_PLACEHOLDER}`];
    }
    throw new Error(`The ${modifier} modifier is not supported by the MenuItem theme target.`);
}

interface BaseOnlySelectorOptions {
    readonly modifier: BlueprintThemeModifier;
    readonly selector: string;
    readonly targetName: string;
}

function getBaseOnlySelectorTemplates({ modifier, selector, targetName }: BaseOnlySelectorOptions): readonly string[] {
    if (modifier !== "base") {
        throw new Error(`The ${modifier} modifier is not supported by the ${targetName} theme target.`);
    }
    return [`${selector}${INTERACTION_PLACEHOLDER}`];
}

function getPopoverOwnerSelectorTemplates(modifier: BlueprintThemeModifier): readonly string[] {
    const popoverSelector = `.${Classes.POPOVER}`;
    switch (modifier) {
        case "base":
            return [`${popoverSelector}${INTERACTION_PLACEHOLDER}`];
        case "minimal":
            return [`${popoverSelector}.${Classes.MINIMAL}${INTERACTION_PLACEHOLDER}`];
        default:
            throw new Error(`The ${modifier} modifier is not supported by the Popover theme target.`);
    }
}
