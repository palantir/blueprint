/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
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

import classNames from "classnames";
import * as React from "react";

import { Classes, Intent, mergeRefs, Utils } from "../../common";
import { getArrowKeyDirection } from "../../common/utils/keyboardUtils";
import {
    type ControlledValueProps,
    DISPLAYNAME_PREFIX,
    type OptionProps,
    type Props,
    removeNonHTMLProps,
} from "../../common/props";
import { Button } from "../button/buttons";
import type { ButtonProps } from "../button/buttonProps";

export type SegmentedControlIntent = typeof Intent.NONE | typeof Intent.PRIMARY;

/**
 * SegmentedControl component props.
 */
export interface SegmentedControlProps
    extends Props,
        ControlledValueProps<string>,
        React.RefAttributes<HTMLDivElement> {
    /**
     * Whether the control should take up the full width of its container.
     *
     * @default false
     */
    fill?: boolean;

    /**
     * Whether the control should appear as an inline element.
     */
    inline?: boolean;

    /**
     * Whether this control should use large buttons.
     *
     * @default false
     */
    large?: boolean;

    /**
     * Visual intent to apply to the selected value.
     */
    intent?: SegmentedControlIntent;

    /**
     * List of available options.
     */
    options: Array<OptionProps<string>>;

    /**
     * Whether this control should use small buttons.
     *
     * @default false
     */
    small?: boolean;
}

/**
 * Segmented control component.
 *
 * @see https://blueprintjs.com/docs/#core/components/segmented-control
 */
export const SegmentedControl: React.FC<SegmentedControlProps> = React.forwardRef((props, ref) => {
    const {
        className,
        defaultValue,
        fill,
        inline,
        intent,
        large,
        onValueChange,
        options,
        small,
        value: controlledValue,
        ...htmlProps
    } = props;

    const [localValue, setLocalValue] = React.useState<string | undefined>(defaultValue);
    const selectedValue = controlledValue ?? localValue;

    const outerRef = React.useRef<HTMLDivElement>(null);

    const handleOptionClick = React.useCallback(
        (newSelectedValue: string, targetElement: HTMLElement) => {
            setLocalValue(newSelectedValue);
            onValueChange?.(newSelectedValue, targetElement);
        },
        [onValueChange],
    );

    const handleKeyDown = React.useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            const direction = getArrowKeyDirection(e, true);
            const { current: outerElement } = outerRef;
            if (direction == undefined || !outerElement) return;

            const focusedElement = Utils.getActiveElement(outerElement)?.closest<HTMLButtonElement>("button");
            if (!focusedElement) return;

            // must rely on DOM state because we have no way of mapping `focusedElement` to a React.JSX.Element
            const enabledOptionElements = Array.from(
                outerElement.querySelectorAll<HTMLButtonElement>("button:not(:disabled)"),
            );
            const focusedIndex = enabledOptionElements.indexOf(focusedElement);
            if (focusedIndex < 0) return;

            e.preventDefault();
            // auto-wrapping at 0 and `length`
            const newIndex = (focusedIndex + direction + enabledOptionElements.length) % enabledOptionElements.length;
            const newOption = enabledOptionElements[newIndex];
            newOption.click();
            newOption.focus();
        },
        [outerRef],
    );

    const classes = classNames(Classes.SEGMENTED_CONTROL, className, {
        [Classes.FILL]: fill,
        [Classes.INLINE]: inline,
    });

    const isAnySelected = options.some(option => selectedValue === option.value);

    return (
        <div
            // radiogroup is the role given by official aria example https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/examples/toolbar/
            role="radiogroup"
            {...removeNonHTMLProps(htmlProps)}
            onKeyDown={handleKeyDown}
            className={classes}
            ref={mergeRefs(ref, outerRef)}
        >
            {options.map((option, index) => (
                <SegmentedControlOption
                    {...option}
                    intent={intent}
                    isSelected={selectedValue === option.value}
                    key={option.value}
                    large={large}
                    onClick={handleOptionClick}
                    small={small}
                    // Accounts for case where no value is currently selected
                    // (passed value/defaultValue is not one of the values of the passed options.)
                    // In this case, set first item to be tabbable even though it's unselected.
                    tabIndex={index == 0 && !isAnySelected ? 0 : undefined}
                />
            ))}
        </div>
    );
});
SegmentedControl.defaultProps = {
    defaultValue: undefined,
    intent: Intent.NONE,
};
SegmentedControl.displayName = `${DISPLAYNAME_PREFIX}.SegmentedControl`;

interface SegmentedControlOptionProps
    extends OptionProps<string>,
        Pick<SegmentedControlProps, "intent" | "small" | "large">,
        Pick<ButtonProps, "tabIndex"> {
    isSelected: boolean;
    onClick: (value: string, targetElement: HTMLElement) => void;
    /**
     * @default 0 if isSelected else -1
     */
    tabIndex?: ButtonProps["tabIndex"];
}

function SegmentedControlOption({
    isSelected,
    label,
    onClick,
    tabIndex,
    value,
    ...buttonProps
}: SegmentedControlOptionProps) {
    const handleClick = React.useCallback(
        (event: React.MouseEvent<HTMLElement>) => onClick?.(value, event.currentTarget),
        [onClick, value],
    );

    return (
        <Button
            role="radio"
            onClick={handleClick}
            aria-checked={isSelected}
            minimal={!isSelected}
            text={label}
            {...buttonProps}
            // "roving tabIndex" on a radiogroup: https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_roving_tabindex
            tabIndex={tabIndex ?? (isSelected ? 0 : -1)}
        />
    );
}
SegmentedControlOption.displayName = `${DISPLAYNAME_PREFIX}.SegmentedControlOption`;
