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
import { forwardRef, useMemo } from "react";

import { CaretDownIcon, DoubleCaretVerticalIcon, type IconName, type SVGIconProps } from "@blueprintjs/icons";

import { DISABLED, FILL, HTML_SELECT, LARGE, MINIMAL } from "../../common/classes";
import { DISPLAYNAME_PREFIX, type MaybeElement, type OptionProps } from "../../common/props";
import type { Extends } from "../../common/utils";
import { Icon } from "../icon/icon";

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
     * Name of a Blueprint icon (or an icon element) to render on the right side of the element.
     *
     * @default "double-caret-vertical"
     */
    icon?: IconName | MaybeElement;

    /**
     * Name of one of the supported icons for this component to display on the right side of the element.
     *
     * @deprecated use `icon` instead
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

    /** Placeholder text to display when no option is selected. */
    placeholder?: string;
}

/**
 * HTML select component
 *
 * @see https://blueprintjs.com/docs/#core/components/html-select
 */
export const HTMLSelect: React.FC<HTMLSelectProps> = forwardRef((props, ref) => {
    const {
        className,
        children,
        disabled,
        fill,
        icon,
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        iconName,
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

    // `icon` takes precedence over the deprecated `iconName`.
    const iconValue = icon !== undefined ? icon : iconName;
    const endIcon = useMemo(() => {
        const iconTitle = "Open dropdown";
        if (iconValue === "double-caret-vertical" || iconValue === undefined) {
            return <DoubleCaretVerticalIcon title={iconTitle} {...iconProps} />;
        } else if (iconValue === "caret-down") {
            return <CaretDownIcon title={iconTitle} {...iconProps} />;
        } else {
            return <Icon icon={iconValue} title={iconTitle} {...iconProps} />;
        }
    }, [iconValue, iconProps]);

    const optionChildren = useMemo(
        () =>
            options.map(option => {
                const optionProps: OptionProps = typeof option === "object" ? option : { value: option };
                return (
                    <option
                        {...optionProps}
                        key={optionProps.value}
                        children={optionProps.label || optionProps.value}
                    />
                );
            }),
        [options],
    );

    return (
        <div className={classes}>
            <select disabled={disabled} ref={ref} value={value} {...htmlProps} multiple={false}>
                {optionChildren}
                {children}
            </select>
            {endIcon}
        </div>
    );
});
HTMLSelect.displayName = `${DISPLAYNAME_PREFIX}.HTMLSelect`;
