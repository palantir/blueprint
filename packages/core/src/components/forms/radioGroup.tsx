/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as React from "react";

import { AbstractComponent } from "../../common/abstractComponent";
import * as Classes from "../../common/classes";
import * as Errors from "../../common/errors";
import { IOptionProps, IProps } from "../../common/props";
import { Radio } from "./controls";

export interface IRadioGroupProps extends IProps {
    /**
     * Whether the group and _all_ its radios are disabled.
     * Individual radios can be disabled using their `disabled` prop.
     */
    disabled?: boolean;

    /**
     * True if radio buttons are to be displayed inline horizontally.
     */
    inline?: boolean;

    /** Optional label text to display above the radio buttons. */
    label?: string;

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
     * Array of options to render in the group.
     * This prop is mutually exclusive with `children`: either provide an array of `IOptionProps`
     * objects or provide `<Radio>` children elements.
     */
    options?: IOptionProps[];

    /** Value of the selected radio. The child with this value will be `:checked`. */
    selectedValue?: string;
}

let counter = 0;
function nextName() { return `${RadioGroup.displayName}-${counter++}`; }

export class RadioGroup extends AbstractComponent<IRadioGroupProps, {}> {
    public static displayName = "Blueprint.RadioGroup";

    // a unique name for this group, which can be overridden by `name` prop.
    private autoGroupName = nextName();

    public render() {
        const { label } = this.props;
        return (
            <div className={this.props.className}>
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
        return React.Children.map(this.props.children, (child) => {
            if (isRadio(child)) {
                return React.cloneElement(child, this.getRadioProps(child.props));
            } else {
                return child;
            }
        });
    }

    private renderOptions() {
        return this.props.options.map((option) => (
            <Radio {...option} {...this.getRadioProps(option)} key={option.value} />
        ));
    }

    private getRadioProps(optionProps: IOptionProps) {
        const { name, inline } = this.props;
        const { value, disabled } = optionProps;
        return {
            checked: value === this.props.selectedValue,
            disabled: disabled || this.props.disabled,
            inline: inline == null ? false : inline,
            name: name == null ? this.autoGroupName : name,
            onChange: this.props.onChange,
        };
    }
};

function isRadio(child: any): child is JSX.Element {
    return child != null && (child as JSX.Element).type === Radio;
}
