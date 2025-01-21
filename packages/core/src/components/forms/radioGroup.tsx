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
import * as React from "react";

import {
    Classes,
    DISPLAYNAME_PREFIX,
    type HTMLDivProps,
    type OptionProps,
    type Props,
    removeNonHTMLProps,
} from "../../common";
import * as Errors from "../../common/errors";
import { isElementOfType, uniqueId } from "../../common/utils";
import { useValidateProps } from "../../hooks/useValidateProps";
import { RadioCard } from "../control-card/radioCard";

import type { ControlProps } from "./controlProps";
import { Radio, type RadioProps } from "./controls";

export interface RadioGroupProps extends Props, HTMLDivProps {
    /**
     * Radio elements. This prop is mutually exclusive with `options`.
     * If passing custom children, ensure options have `role="radio"` or
     * `input` with `type="radio"`.
     */
    children?: React.ReactNode;

    /**
     * Whether the group and _all_ its radios are disabled.
     * Individual radios can be disabled using their `disabled` prop.
     */
    disabled?: boolean;

    /**
     * Whether the radio buttons are to be displayed inline horizontally.
     */
    inline?: boolean;

    /** Optional label text to display above the radio buttons. */
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
    onChange: (event: React.FormEvent<HTMLInputElement>) => void;

    /**
     * Array of options to render in the group. This prop is mutually exclusive
     * with `children`: either provide an array of `OptionProps` objects or
     * provide `<Radio>` children elements.
     */
    options?: readonly OptionProps[];

    /** Value of the selected radio. The child with this value will be `:checked`. */
    selectedValue?: string | number;
}

/**
 * Radio group component.
 *
 * @see https://blueprintjs.com/docs/#core/components/radio.radiogroup
 */
export const RadioGroup: React.FC<RadioGroupProps> = props => {
    const { children, className, disabled, inline, label, name, onChange, options, selectedValue, ...htmlProps } =
        props;

    // a unique name for this group, which can be overridden by `name` prop.
    const autoGroupName = React.useMemo(() => nextName(), []);

    const labelId = React.useMemo(() => uniqueId("label"), []);

    useValidateProps(() => {
        if (children != null && options != null) {
            console.warn(Errors.RADIOGROUP_WARN_CHILDREN_OPTIONS_MUTEX);
        }
    }, [children, options]);

    const getRadioProps = React.useCallback(
        (optionProps: OptionProps): Omit<RadioProps, "ref"> => {
            const { className: optionClassName, disabled: optionDisabled, value } = optionProps;
            return {
                checked: value === selectedValue,
                className: optionClassName,
                disabled: optionDisabled || disabled,
                inline,
                name: name == null ? autoGroupName : name,
                onChange,
                value,
            };
        },
        [autoGroupName, disabled, inline, name, onChange, selectedValue],
    );

    const renderChildren = () => {
        return React.Children.map(children, child => {
            if (isElementOfType(child, Radio) || isElementOfType(child, RadioCard)) {
                return React.cloneElement(
                    // Need this cast here to suppress a TS error caused by differing `ref` types for the Radio and
                    // RadioCard components. We aren't injecting a ref, so we don't need to be strict about that
                    // incompatibility.
                    child as React.ReactElement<ControlProps>,
                    getRadioProps(child.props as OptionProps),
                );
            }
            return child;
        });
    };

    const renderOptions = () => {
        return options?.map(option => (
            <Radio {...getRadioProps(option)} key={option.value} labelElement={option.label || option.value} />
        ));
    };

    return (
        <div
            role="radiogroup"
            aria-labelledby={label ? labelId : undefined}
            {...removeNonHTMLProps(htmlProps)}
            className={classNames(Classes.RADIO_GROUP, className)}
        >
            {label && (
                <label className={Classes.LABEL} id={labelId}>
                    {label}
                </label>
            )}
            {Array.isArray(options) ? renderOptions() : renderChildren()}
        </div>
    );
};

RadioGroup.displayName = `${DISPLAYNAME_PREFIX}.RadioGroup`;

let counter = 0;
function nextName() {
    return `${RadioGroup.displayName}-${counter++}`;
}
