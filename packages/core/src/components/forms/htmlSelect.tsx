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

export interface IHtmlSelectProps
    extends React.SelectHTMLAttributes<HTMLSelectElement>,
        IElementRefProps<HTMLSelectElement> {
    disabled?: boolean;
    fill?: boolean;
    large?: boolean;
    minimal?: boolean;
    options?: Array<string | number | { label?: string; value: string | number }>;
}

// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
export class HtmlSelect extends React.PureComponent<IHtmlSelectProps> {
    public render() {
        const { className, disabled, elementRef, fill, large, minimal, options, ...htmlProps } = this.props;
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

        const optionChildren = options.map(value => {
            const option = typeof value === "object" ? value : { label: value.toString(), value };
            return <option key={option.value} {...option} />;
        });

        return (
            <div className={classes}>
                <select disabled={disabled} ref={elementRef} {...htmlProps}>
                    {optionChildren}
                    {htmlProps.children}
                </select>
                <Icon icon="double-caret-vertical" />
            </div>
        );
    }
}
