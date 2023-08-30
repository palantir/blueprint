/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
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

import * as Classes from "./classes";
import type { IconName } from "./iconNames";
import { IconSize } from "./iconTypes";
import { uniqueId } from "./jsUtils";
import type { SVGIconProps } from "./svgIconProps";

export type SVGIconContainerProps<T extends Element> = Omit<SVGIconProps<T>, "children"> & {
    /**
     * Icon name.
     */
    iconName: IconName;

    /**
     * Icon contents, loaded via `IconLoader` and specified as `<path>` elements.
     */
    children: JSX.Element | JSX.Element[];
};

/**
 * Generic icon container component type. This is essentially a type hack required to make forwardRef work with generic
 * components. Note that this slows down TypeScript compilation, but it better than the alternative of globally
 * augmenting "@types/react".
 *
 * @see https://stackoverflow.com/a/73795494/7406866
 */
export interface SVGIconContainerComponent extends React.FC<SVGIconContainerProps<Element>> {
    <T extends Element = Element>(props: SVGIconContainerProps<T>): React.ReactElement | null;
}

// eslint-disable-next-line prefer-arrow-callback
export const SVGIconContainer: SVGIconContainerComponent = React.forwardRef(function <T extends Element>(
    props: SVGIconContainerProps<T>,
    ref: React.Ref<T>,
) {
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
        ...htmlProps
    } = props;

    const isLarge = size >= IconSize.LARGE;
    const pixelGridSize = isLarge ? IconSize.LARGE : IconSize.STANDARD;
    const viewBox = `0 0 ${pixelGridSize} ${pixelGridSize}`;
    const titleId = uniqueId("iconTitle");
    const sharedSvgProps = {
        "data-icon": iconName,
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
                ref={ref as React.Ref<SVGSVGElement>}
                {...sharedSvgProps}
                {...htmlProps}
            >
                {title && <title id={titleId}>{title}</title>}
                {children}
            </svg>
        );
    } else {
        return React.createElement(
            tagName,
            {
                ...htmlProps,
                "aria-hidden": title ? undefined : true,
                className: classNames(Classes.ICON, `${Classes.ICON}-${iconName}`, className),
                ref,
                title: htmlTitle,
            },
            <svg {...sharedSvgProps}>
                {title && <title>{title}</title>}
                {children}
            </svg>,
        );
    }
});
SVGIconContainer.displayName = "Blueprint5.SVGIconContainer";
