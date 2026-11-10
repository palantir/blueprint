/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
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
import { createElement, forwardRef, useId } from "react";

import * as Classes from "../classes";
import { IconSize } from "../iconTypes";
import type { SVGIconProps } from "../svgIconProps";

export type SvgIconContainerNextProps<T extends Element> = Omit<SVGIconProps<T>, "children"> & {
    children: React.JSX.Element | React.JSX.Element[];
    iconName: string;

    /**
     * `viewBox` for the rendered `<svg>`, i.e. the coordinate system the icon paths are drawn in.
     *
     * @default "0 0 16 16"
     */
    viewBox?: string;
};

export interface SvgIconContainerNextComponent extends React.FC<SvgIconContainerNextProps<Element>> {
    <T extends Element = Element>(props: SvgIconContainerNextProps<T>): React.ReactNode;
}

export const SvgIconContainerNext: SvgIconContainerNextComponent = forwardRef(
    <T extends Element>(props: SvgIconContainerNextProps<T>, ref: React.Ref<T>) => {
        const {
            children,
            className,
            color,
            htmlTitle,
            iconName,
            size = IconSize.STANDARD,
            svgProps,
            tagName = "span",
            title,
            viewBox = "0 0 16 16",
            ...htmlProps
        } = props;

        const titleId = useId();
        const sharedSvgProps: React.SVGProps<SVGSVGElement> = {
            fill: color,
            height: size,
            role: "img",
            viewBox,
            width: size,
            ...svgProps,
        };

        if (tagName === null) {
            return (
                <svg
                    aria-labelledby={title ? titleId : undefined}
                    data-icon={iconName}
                    ref={ref as React.Ref<SVGSVGElement>}
                    {...sharedSvgProps}
                    {...htmlProps}
                    className={classNames(className, svgProps?.className)}
                >
                    {title && <title id={titleId}>{title}</title>}
                    {children}
                </svg>
            );
        } else {
            return createElement(
                tagName,
                {
                    "aria-hidden": title ? undefined : true,
                    ...htmlProps,
                    className: classNames(Classes.ICON, `${Classes.ICON}-${iconName}`, className),
                    ref,
                    title: htmlTitle,
                },
                <svg data-icon={iconName} {...sharedSvgProps} className={svgProps?.className}>
                    {title && <title>{title}</title>}
                    {children}
                </svg>,
            );
        }
    },
);
SvgIconContainerNext.displayName = "Blueprint6.SvgIconContainerNext";
