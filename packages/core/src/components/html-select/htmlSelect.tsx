/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
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
import React from "react";

import { DoubleCaretVertical, SVGIconProps } from "@blueprintjs/icons";

import { AbstractPureComponent } from "../../common";
import { DISABLED, FILL, HTML_SELECT, LARGE, MINIMAL } from "../../common/classes";
import { ElementRefProps, OptionProps } from "../../common/props";

export interface HTMLSelectProps
    extends ElementRefProps<HTMLSelectElement>,
        React.SelectHTMLAttributes<HTMLSelectElement> {
    /** Whether this element is non-interactive. */
    disabled?: boolean;

    /** Whether this element should fill its container. */
    fill?: boolean;

    /** Props to spread to the icon element. */
    iconProps?: Partial<SVGIconProps>;

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
    options?: Array<string | number | OptionProps>;

    /** Controlled value of this component. */
    value?: string | number;
}

// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */

export class HTMLSelect extends AbstractPureComponent<HTMLSelectProps> {
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
            const props: OptionProps = typeof option === "object" ? option : { value: option };
            return <option {...props} key={props.value} children={props.label || props.value} />;
        });

        return (
            <div className={classes}>
                <select disabled={disabled} ref={elementRef} {...htmlProps} multiple={false}>
                    {optionChildren}
                    {htmlProps.children}
                </select>
                <DoubleCaretVertical {...iconProps} />
            </div>
        );
    }
}
