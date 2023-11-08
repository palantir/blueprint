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
import * as React from "react";

import { CaretDown, DoubleCaretVertical, type IconName, type SVGIconProps } from "@blueprintjs/icons";

import { DISABLED, FILL, HTML_SELECT, LARGE, MINIMAL } from "../../common/classes";
import { DISPLAYNAME_PREFIX, type OptionProps } from "../../common/props";
import type { Extends } from "../../common/utils";

export type HTMLSelectIconName = Extends<IconName, "double-caret-vertical" | "caret-down">;

export interface HTMLSelectProps
    extends React.RefAttributes<HTMLSelectElement>,
        React.SelectHTMLAttributes<HTMLSelectElement> {
    children?: React.ReactNode;

    /** Whether this element is non-interactive. */
    disabled?: boolean;

    /** Whether this element should fill its container. */
    fill?: boolean;

    /**
     * Name of one of the supported icons for this component to display on the right side of the element.
     *
     * @default "double-caret-vertical"
     */
    iconName?: HTMLSelectIconName;

    /**
     * Props to spread to the icon element displayed on the right side of the element.
     */
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
    options?: ReadonlyArray<string | number | OptionProps>;

    /** Controlled value of this component. */
    value?: string | number;
}

// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
/**
 * HTML select component
 *
 * @see https://blueprintjs.com/docs/#core/components/html-select
 */
export const HTMLSelect: React.FC<HTMLSelectProps> = React.forwardRef((props, ref) => {
    const {
        className,
        children,
        disabled,
        fill,
        iconName = "double-caret-vertical",
        iconProps,
        large,
        minimal,
        options = [],
        value,
        ...htmlProps
    } = props;
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

    const iconTitle = "Open dropdown";
    const rightIcon =
        iconName === "double-caret-vertical" ? (
            <DoubleCaretVertical title={iconTitle} {...iconProps} />
        ) : (
            <CaretDown title={iconTitle} {...iconProps} />
        );

    const optionChildren = options.map(option => {
        const optionProps: OptionProps = typeof option === "object" ? option : { value: option };
        return <option {...optionProps} key={optionProps.value} children={optionProps.label || optionProps.value} />;
    });

    return (
        <div className={classes}>
            <select disabled={disabled} ref={ref} value={value} {...htmlProps} multiple={false}>
                {optionChildren}
                {children}
            </select>
            {rightIcon}
        </div>
    );
});
HTMLSelect.displayName = `${DISPLAYNAME_PREFIX}.HTMLSelect`;
