/*
 * Copyright 2025 Palantir Technologies, Inc. All rights reserved.
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
import { Children, cloneElement, useMemo } from "react";

import { Classes, DISPLAYNAME_PREFIX, type HTMLDivProps, type OptionProps, type Props, removeNonHTMLProps } from "../../common";
import { isElementOfType, uniqueId } from "../../common/utils";

import { RadioCard, type RadioCardProps } from "./radioCard";

export interface RadioCardGroupProps extends Props, HTMLDivProps {
    /**
     * RadioCard elements to render in the group.
     */
    children?: React.ReactNode;

    /**
     * Whether the group and _all_ its radio cards are disabled.
     * Individual radio cards can be disabled using their `disabled` prop.
     */
    disabled?: boolean;

    /**
     * Whether the radio cards are to be displayed inline (horizontally).
     *
     * @default false
     */
    inline?: boolean;

    /** Optional label text to display above the radio cards. */
    label?: React.ReactNode;

    /**
     * Name of the group, used to link radio buttons together in HTML.
     * If omitted, a unique name will be generated internally.
     */
    name?: string;

    /**
     * Callback invoked when the currently selected radio changes.
     * Use `event.currentTarget.value` to read the currently selected value.
     * This prop is required because this component only supports controlled usage.
     */
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;

    /** Value of the selected radio card. The child with this value will be `:checked`. */
    selectedValue?: string | number;
}

/**
 * Radio card group component, used to lay out and manage a group of RadioCard components.
 *
 * @see https://blueprintjs.com/docs/#core/components/control-card.radio-card-group
 */
export const RadioCardGroup: React.FC<RadioCardGroupProps> = props => {
    const { children, className, disabled, inline, label, name, onChange, selectedValue, ...htmlProps } = props;

    const autoGroupName = useMemo(() => nextName(), []);
    const labelId = useMemo(() => uniqueId("label"), []);

    const groupName = name == null ? autoGroupName : name;

    const renderChildren = () => {
        return Children.map(children, child => {
            if (isElementOfType(child, RadioCard)) {
                const childProps = child.props as RadioCardProps & OptionProps;
                const injectedProps: Partial<RadioCardProps> = {
                    checked: childProps.value === selectedValue,
                    disabled: childProps.disabled || disabled,
                    inputProps: { ...childProps.inputProps, name: groupName },
                    onChange,
                    value: childProps.value,
                };
                return cloneElement(child as React.ReactElement<RadioCardProps>, injectedProps);
            }
            return child;
        });
    };

    return (
        <div
            role="radiogroup"
            aria-labelledby={label ? labelId : undefined}
            {...removeNonHTMLProps(htmlProps)}
            className={classNames(Classes.CONTROL_CARD_GROUP, { [Classes.INLINE]: inline }, className)}
        >
            {label && (
                <label className={Classes.LABEL} id={labelId}>
                    {label}
                </label>
            )}
            {renderChildren()}
        </div>
    );
};

RadioCardGroup.displayName = `${DISPLAYNAME_PREFIX}.RadioCardGroup`;

let counter = 0;
function nextName() {
    return `${RadioCardGroup.displayName}-${counter++}`;
}
