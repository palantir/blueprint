/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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

import { AbstractPureComponent, Classes, DISPLAYNAME_PREFIX, type OptionProps, type Props } from "../../common";
import * as Errors from "../../common/errors";
import { isElementOfType } from "../../common/utils";
import { RadioCard } from "../control-card/radioCard";
import type { ControlProps } from "./controlProps";
import { Radio, type RadioProps } from "./controls";

export interface RadioGroupProps extends Props {
    /**
     * Radio elements. This prop is mutually exclusive with `options`.
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

let counter = 0;
function nextName() {
    return `${RadioGroup.displayName}-${counter++}`;
}

/**
 * Radio group component.
 *
 * @see https://blueprintjs.com/docs/#core/components/radio.radiogroup
 */
export class RadioGroup extends AbstractPureComponent<RadioGroupProps> {
    public static displayName = `${DISPLAYNAME_PREFIX}.RadioGroup`;

    // a unique name for this group, which can be overridden by `name` prop.
    private autoGroupName = nextName();

    public render() {
        const { label } = this.props;
        return (
            <div className={classNames(Classes.RADIO_GROUP, this.props.className)}>
                {label == null ? null : <label className={Classes.LABEL}>{label}</label>}
                {Array.isArray(this.props.options) ? this.renderOptions() : this.renderChildren()}
            </div>
        );
    }

    protected validateProps() {
        if (this.props.children != null && this.props.options != null) {
            console.warn(Errors.RADIOGROUP_WARN_CHILDREN_OPTIONS_MUTEX);
        }
    }

    private renderChildren() {
        return React.Children.map(this.props.children, child => {
            if (isElementOfType(child, Radio) || isElementOfType(child, RadioCard)) {
                return React.cloneElement(
                    // Need this cast here to suppress a TS error caused by differing `ref` types for the Radio and
                    // RadioCard components. We aren't injecting a ref, so we don't need to be strict about that
                    // incompatibility.
                    child as React.ReactElement<ControlProps>,
                    this.getRadioProps(child.props as OptionProps),
                );
            } else {
                return child;
            }
        });
    }

    private renderOptions() {
        return this.props.options?.map(option => (
            <Radio {...this.getRadioProps(option)} key={option.value} labelElement={option.label || option.value} />
        ));
    }

    private getRadioProps(optionProps: OptionProps): Omit<RadioProps, "ref"> {
        const { name } = this.props;
        const { className, disabled, value } = optionProps;
        return {
            checked: value === this.props.selectedValue,
            className,
            disabled: disabled || this.props.disabled,
            inline: this.props.inline,
            name: name == null ? this.autoGroupName : name,
            onChange: this.props.onChange,
            value,
        };
    }
}
