/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";
import { DISABLED, FILL, HTML_SELECT, LARGE, MINIMAL } from "../../common/classes";
import { IElementRefProps } from "../html/html";
import { Icon } from "../icon/icon";

export interface IHTMLOptionProps {
    /** Optional label for this option. Defaults to `value`. */
    label?: string;

    /** Value of this option. Should be locally unique. */
    value: string | number;
}

export interface IHTMLSelectProps
    extends IElementRefProps<HTMLSelectElement>,
        React.SelectHTMLAttributes<HTMLSelectElement> {
    /** Whether this element is non-interactive. */
    disabled?: boolean;

    /** Whether this element should fill its container. */
    fill?: boolean;

    /** Whether to use large styles. */
    large?: boolean;

    /** Whether to use minimal styles. */
    minimal?: boolean;

    /** Multiple select is not supported. */
    multiple?: never;

    /** Change event handler. Use `event.currentTarget.value` to access the new value. */
    onChange?: React.ChangeEventHandler<HTMLSelectElement>;

    /**
     * Shorthand for supplying options: an array of basic types or
     * `{ label?, value }` objects. If no `label` is supplied, `value`
     * will be used as the label.
     */
    options?: Array<string | number | IHTMLOptionProps>;

    /** Controlled value of this component. */
    value?: string | number;
}

// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
export class HTMLSelect extends React.PureComponent<IHTMLSelectProps> {
    public render() {
        const { className, disabled, elementRef, fill, large, minimal, options = [], ...htmlProps } = this.props;
        const classes = classNames(
            HTML_SELECT,
            {
                [DISABLED]: disabled,
                [FILL]: fill,
                [LARGE]: large,
                [MINIMAL]: minimal,
            },
            className,
        );

        return (
            <div className={classes}>
                <select disabled={disabled} ref={elementRef} {...htmlProps} multiple={false}>
                    {this.renderOptions(options)}
                    {htmlProps.children}
                </select>
                <Icon icon="double-caret-vertical" />
            </div>
        );
    }

    private renderOptions(options: Array<string | number | IHTMLOptionProps>) {
        return options.map(value => {
            const option: IHTMLOptionProps =
                typeof value === "object"
                    ? this.coercePlainObj(value)
                    : {
                          label: value.toString(),
                          value,
                      };
            return <option key={option.value} children={option.label} {...option} />;
        });
    }

    private coercePlainObj(option: IHTMLOptionProps) {
        return {
            label: option.label || option.value.toString(),
            value: option.value,
        };
    }
}
