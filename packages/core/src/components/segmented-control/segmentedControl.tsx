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
import {
    type ControlledValueProps,
    DISPLAYNAME_PREFIX,
    type OptionProps,
    type Props,
    removeNonHTMLProps,
} from "../../common/props";
import type { ButtonProps } from "../button/buttonProps";
import { Button } from "../button/buttons";

export type SegmentedControlIntent = typeof Intent.NONE | typeof Intent.PRIMARY;

type SegmentedControlButtonProps = Pick<ButtonProps, "className" | "intent" | "active" | "minimal">;

/**
 * SegmentedControl component props.
 */
export interface SegmentedControlProps<T extends string = string>
    extends Props,
        ControlledValueProps<T>,
        React.RefAttributes<HTMLDivElement> {
    /**
     * Whether the control should use compact styles.
     *
     * @default false
     */
    compact?: boolean;

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
    options: Array<OptionProps<T>>;

    /**
     * Style props for the button elements.
     */
    buttonProps?: {
        /**
         * Props applied to selected button
         * @default { className: 'bp5-selected' }
         */
        selected?: SegmentedControlButtonProps;
        /**
         * Props applied to non-selected buttons
         * @default { className: 'bp5-minimal' }
         */
        nonSelected?: SegmentedControlButtonProps;
        /**
         * Props applied to all buttons (selected and non-selected)
         * @default undefined
         */
        all?: SegmentedControlButtonProps;
    };

    /**
     * Aria role for the overall component. Child buttons get appropriate roles.
     *
     * @see https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/examples/toolbar
     *
     * @default 'radiogroup'
     */
    role?: Extract<React.AriaRole, "radiogroup" | "group" | "toolbar">;

    /**
     * Whether this control should use small buttons.
     *
     * @default false
     */
    small?: boolean;
}

// This allows the ability to pass a more strict type for `options`/`onValueChange`
// i.e. <SegmentedControl<Intent> />
interface ReactFCWithGeneric extends React.FC<SegmentedControlProps> {
    <T extends string>(props: SegmentedControlProps<T>): ReturnType<React.FC<SegmentedControlProps<T>>>;
}

/**
 * Segmented control component.
 *
 * @see https://blueprintjs.com/docs/#core/components/segmented-control
 */
export const SegmentedControl: ReactFCWithGeneric = React.forwardRef(
    <T extends string>(props: SegmentedControlProps<T>, ref: React.ForwardedRef<HTMLDivElement>) => {
        const {
            buttonProps,
            className,
            compact,
            defaultValue,
            fill,
            inline,
            intent,
            large,
            onValueChange,
            options,
            role = "radiogroup",
            small,
            value: controlledValue,
            ...htmlProps
        } = props;

        const [localValue, setLocalValue] = React.useState<T | undefined>(defaultValue);
        const selectedValue = controlledValue ?? localValue;

        const outerRef = React.useRef<HTMLDivElement>(null);

        const handleOptionClick = React.useCallback(
            (newSelectedValue: T, targetElement: HTMLElement) => {
                setLocalValue(newSelectedValue);
                onValueChange?.(newSelectedValue, targetElement);
            },
            [onValueChange],
        );

        const handleKeyDown = React.useCallback(
            (e: React.KeyboardEvent<HTMLDivElement>) => {
                if (role === "radiogroup") {
                    // in a `radiogroup`, arrow keys select next item, not tab key.
                    const direction = Utils.getArrowKeyDirection(
                        e,
                        ["ArrowLeft", "ArrowUp"],
                        ["ArrowRight", "ArrowDown"],
                    );
                    const outerElement = outerRef.current;
                    if (direction === undefined || !outerElement) return;

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
                    const newIndex =
                        (focusedIndex + direction + enabledOptionElements.length) % enabledOptionElements.length;
                    const newOption = enabledOptionElements[newIndex];
                    newOption.click();
                    newOption.focus();
                }
            },
            [outerRef, role],
        );

        const classes = classNames(Classes.SEGMENTED_CONTROL, className, {
            [Classes.COMPACT]: compact,
            [Classes.BUTTON_GROUP]: compact,
            [Classes.FILL]: fill,
            [Classes.INLINE]: inline,
        });

        const isAnySelected = options.some(option => selectedValue === option.value);

        return (
            <div
                {...removeNonHTMLProps(htmlProps)}
                role={role}
                onKeyDown={handleKeyDown}
                className={classes}
                ref={mergeRefs(ref, outerRef)}
            >
                {options.map((option, index) => {
                    const isSelected = selectedValue === option.value;
                    return (
                        <SegmentedControlOption<T>
                            intent={intent}
                            {...(isSelected
                                ? buttonProps?.selected ?? { className: Classes.SELECTED }
                                : buttonProps?.nonSelected ?? { className: Classes.MINIMAL })}
                            {...buttonProps?.all}
                            {...option}
                            key={option.value}
                            large={large}
                            onClick={handleOptionClick}
                            small={small}
                            {...(role === "radiogroup"
                                ? {
                                      "aria-checked": isSelected,
                                      role: "radio",
                                      // "roving tabIndex" on a radiogroup: https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_roving_tabindex
                                      // `!isAnySelected` accounts for case where no value is currently selected
                                      // (passed value/defaultValue is not one of the values of the passed options.)
                                      // In this case, set first item to be tabbable even though it's unselected.
                                      tabIndex: isSelected || (index === 0 && !isAnySelected) ? 0 : -1,
                                  }
                                : {
                                      "aria-pressed": isSelected,
                                  })}
                        />
                    );
                })}
            </div>
        );
    },
);
SegmentedControl.defaultProps = {
    defaultValue: undefined,
    intent: Intent.NONE,
};
SegmentedControl.displayName = `${DISPLAYNAME_PREFIX}.SegmentedControl`;

interface SegmentedControlOptionProps<T extends string = string>
    extends OptionProps<T>,
        Omit<ButtonProps, "text" | "onClick" | "value"> {
    onClick: (value: T, targetElement: HTMLElement) => void;
}

function SegmentedControlOption<T extends string = string>({
    label,
    onClick,
    value,
    ...buttonProps
}: SegmentedControlOptionProps<T>) {
    const handleClick = React.useCallback(
        (event: React.MouseEvent<HTMLElement>) => onClick?.(value, event.currentTarget),
        [onClick, value],
    );

    return <Button {...buttonProps} onClick={handleClick} text={label} />;
}
SegmentedControlOption.displayName = `${DISPLAYNAME_PREFIX}.SegmentedControlOption`;
