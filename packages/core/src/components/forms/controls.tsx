/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

// HACKHACK: these components should go in separate files
// tslint:disable max-classes-per-file

// we need some empty interfaces to show up in docs
// tslint:disable no-empty-interface

import * as classNames from "classnames";
import * as React from "react";

import * as Classes from "../../common/classes";
import { IProps, removeNonHTMLProps } from "../../common/props";
import { safeInvoke } from "../../common/utils";
import { HTMLInputProps } from "../../index";

export interface IControlProps extends IProps, HTMLInputProps {
    // NOTE: HTML props are duplicated here to provide control-specific documentation

    /** Whether the control is checked. */
    checked?: boolean;

    /** Whether the control is initially checked (uncontrolled mode). */
    defaultChecked?: boolean;

    /** Whether the control is non-interactive. */
    disabled?: boolean;

    /** Ref handler that receives HTML `<input>` element backing this component. */
    inputRef?: (ref: HTMLInputElement) => any;

    /** Whether the control is inline. */
    inline?: boolean;

    /**
     * Text label for the control.
     *
     * This prop actually supports JSX elements, but TypeScript will throw an error because
     * `HTMLProps` only allows strings. Use `labelElement` to supply a JSX element in TypeScript.
     */
    label?: string;

    /**
     * JSX Element label for the control.
     *
     * This prop is necessary for TypeScript consumers as the type definition for `label` only
     * accepts strings. JavaScript consumers can provide a JSX element directly to `label`.
     */
    labelElement?: React.ReactNode;

    /** Event handler invoked when input value is changed. */
    onChange?: React.FormEventHandler<HTMLInputElement>;
}

const INVALID_PROPS: Array<keyof ICheckboxProps> = [
    // we spread props to `<input>` but render `children` as its sibling
    "children",
    "defaultIndeterminate",
    "indeterminate",
    "labelElement",
];

/** Base Component class for all Controls */
export class Control<P extends IControlProps> extends React.Component<P, {}> {
    // generates control markup for given input type.
    // optional inputRef in case the component needs reference for itself (don't forget to invoke the prop!).
    protected renderControl(type: "checkbox" | "radio", typeClassName: string, inputRef = this.props.inputRef) {
        const className = classNames(
            Classes.CONTROL,
            typeClassName,
            {
                [Classes.DISABLED]: this.props.disabled,
                [Classes.INLINE]: this.props.inline,
            },
            this.props.className,
        );
        const inputProps = removeNonHTMLProps(this.props, INVALID_PROPS, true);
        return (
            <label className={className} style={this.props.style}>
                <input {...inputProps} ref={inputRef} type={type} />
                <span className={Classes.CONTROL_INDICATOR} />
                {this.props.label}
                {this.props.labelElement}
                {this.props.children}
            </label>
        );
    }
}

export interface ICheckboxProps extends IControlProps {
    /** Whether this checkbox is initially indeterminate (uncontrolled mode). */
    defaultIndeterminate?: boolean;

    /**
     * Whether this checkbox is indeterminate, or "partially checked."
     * The checkbox will appear with a small dash instead of a tick to indicate that the value
     * is not exactly true or false.
     */
    indeterminate?: boolean;
}

export class Checkbox extends Control<ICheckboxProps> {
    public static displayName = "Blueprint.Checkbox";

    // must maintain internal reference for `indeterminate` support
    private input: HTMLInputElement;

    public render() {
        return this.renderControl("checkbox", "pt-checkbox", this.handleInputRef);
    }

    public componentDidMount() {
        if (this.props.defaultIndeterminate != null) {
            this.input.indeterminate = this.props.defaultIndeterminate;
        }
        this.updateIndeterminate();
    }

    public componentDidUpdate() {
        this.updateIndeterminate();
    }

    private updateIndeterminate() {
        if (this.props.indeterminate != null) {
            this.input.indeterminate = this.props.indeterminate;
        }
    }

    private handleInputRef = (ref: HTMLInputElement) => {
        this.input = ref;
        safeInvoke(this.props.inputRef, ref);
    };
}

export interface ISwitchProps extends IControlProps {}

export class Switch extends Control<ISwitchProps> {
    public static displayName = "Blueprint.Switch";

    public render() {
        return this.renderControl("checkbox", "pt-switch");
    }
}

export interface IRadioProps extends IControlProps {}

export class Radio extends Control<IRadioProps> {
    public static displayName = "Blueprint.Radio";

    public render() {
        return this.renderControl("radio", "pt-radio");
    }
}

export const CheckboxFactory = React.createFactory(Checkbox);
export const SwitchFactory = React.createFactory(Switch);
export const RadioFactory = React.createFactory(Radio);
