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

import { Classes, Intent } from "../../common";
import {
    type ControlledValueProps,
    DISPLAYNAME_PREFIX,
    type OptionProps,
    type Props,
    removeNonHTMLProps,
} from "../../common/props";
import { Button } from "../button/buttons";

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

    const handleOptionClick = React.useCallback(
        (newSelectedValue: string, targetElement: HTMLElement) => {
            setLocalValue(newSelectedValue);
            onValueChange?.(newSelectedValue, targetElement);
        },
        [onValueChange],
    );

    const classes = classNames(Classes.SEGMENTED_CONTROL, className, {
        [Classes.FILL]: fill,
        [Classes.INLINE]: inline,
    });

    return (
        <div className={classes} ref={ref} {...removeNonHTMLProps(htmlProps)}>
            {options.map(option => (
                <SegmentedControlOption
                    {...option}
                    intent={intent}
                    isSelected={selectedValue === option.value}
                    key={option.value}
                    large={large}
                    onClick={handleOptionClick}
                    small={small}
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
        Pick<SegmentedControlProps, "intent" | "small" | "large"> {
    isSelected: boolean;
    onClick: (value: string, targetElement: HTMLElement) => void;
}

function SegmentedControlOption({ isSelected, label, onClick, value, ...buttonProps }: SegmentedControlOptionProps) {
    const handleClick = React.useCallback(
        (event: React.MouseEvent<HTMLElement>) => onClick?.(value, event.currentTarget),
        [onClick, value],
    );

    return <Button onClick={handleClick} minimal={!isSelected} text={label} {...buttonProps} />;
}
SegmentedControlOption.displayName = `${DISPLAYNAME_PREFIX}.SegmentedControlOption`;
