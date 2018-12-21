/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";
import { DISABLED, FILL, HTML_SELECT, LARGE, MINIMAL } from "../../common/classes";
import { IOptionProps } from "../../common/props";
import { IElementRefProps } from "../html/html";
import { Icon, IIconProps } from "../icon/icon";

export interface IHTMLSelectProps
    extends IElementRefProps<HTMLSelectElement>,
        React.SelectHTMLAttributes<HTMLSelectElement> {
    /** Whether this element is non-interactive. */
    disabled?: boolean;

    /** Whether this element should fill its container. */
    fill?: boolean;

    /** Props to spread to the `<Icon>` element. */
    iconProps?: Partial<IIconProps>;

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
    options?: Array<string | number | IOptionProps>;

    /** Controlled value of this component. */
    value?: string | number;
}

// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
export class HTMLSelect extends React.PureComponent<IHTMLSelectProps> {
    public render() {
        const {
            className,
            disabled,
            elementRef,
            fill,
            iconProps,
            large,
            minimal,
            options = [],
            ...htmlProps
        } = this.props;
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

        const optionChildren = options.map(option => {
            const props: IOptionProps = typeof option === "object" ? option : { value: option };
            return <option {...props} key={props.value} children={props.label || props.value} />;
        });

        return (
            <div className={classes}>
                <select disabled={disabled} ref={elementRef} {...htmlProps} multiple={false}>
                    {optionChildren}
                    {htmlProps.children}
                </select>
                <Icon icon="double-caret-vertical" {...iconProps} />
            </div>
        );
    }
}
