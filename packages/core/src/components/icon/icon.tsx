/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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
import { polyfill } from "react-lifecycles-compat";

import { IconName, IconSvgPaths16, IconSvgPaths20 } from "@blueprintjs/icons";

import { AbstractPureComponent2, Classes, DISPLAYNAME_PREFIX, IntentProps, Props, MaybeElement } from "../../common";

export { IconName };

export enum IconSize {
    STANDARD = 16,
    LARGE = 20,
}

// eslint-disable-next-line deprecation/deprecation
export type IconProps = IIconProps;
/** @deprecated use IconProps */
export interface IIconProps extends IntentProps, Props {
    /** This component does not support custom children. Use the `icon` prop. */
    children?: never;

    /**
     * Color of icon. This is used as the `fill` attribute on the `<svg>` image
     * so it will override any CSS `color` property, including that set by
     * `intent`. If this prop is omitted, icon color is inherited from
     * surrounding text.
     */
    color?: string;

    /**
     * String for the `title` attribute on the rendered element, which will appear
     * on hover as a native browser tooltip.
     */
    htmlTitle?: string;

    /**
     * Name of a Blueprint UI icon, or an icon element, to render. This prop is
     * required because it determines the content of the component, but it can
     * be explicitly set to falsy values to render nothing.
     *
     * - If `null` or `undefined` or `false`, this component will render nothing.
     * - If given an `IconName` (a string literal union of all icon names), that
     *   icon will be rendered as an `<svg>` with `<path>` tags. Unknown strings
     *   will render a blank icon to occupy space.
     * - If given a `JSX.Element`, that element will be rendered and _all other
     *   props on this component are ignored._ This type is supported to
     *   simplify icon support in other Blueprint components. As a consumer, you
     *   should avoid using `<Icon icon={<Element />}` directly; simply render
     *   `<Element />` instead.
     */
    icon: IconName | MaybeElement;

    /**
     * @deprecated use size prop instead
     */
    iconSize?: number;

    /**
     * Size of the icon, in pixels. Blueprint contains 16px and 20px SVG icon
     * images, and chooses the appropriate resolution based on this prop.
     *
     * @default IconSize.STANDARD = 16
     */
    size?: number;

    /** CSS style properties. */
    style?: React.CSSProperties;

    /**
     * HTML tag to use for the rendered element.
     *
     * @default "span"
     */
    tagName?: keyof JSX.IntrinsicElements;

    /**
     * Description string. This string does not appear in normal browsers, but
     * it increases accessibility. For instance, screen readers will use it for
     * aural feedback.
     *
     * If this value is nullish, `false`, or an empty string, the component will assume
     * that the icon is decorative and `aria-hidden="true"` will be applied.
     *
     * @see https://www.w3.org/WAI/tutorials/images/decorative/
     */
    title?: string | false | null;
}

@polyfill
export class Icon extends AbstractPureComponent2<IconProps & Omit<React.HTMLAttributes<HTMLElement>, "title">> {
    public static displayName = `${DISPLAYNAME_PREFIX}.Icon`;

    /** @deprecated use IconSize.STANDARD */
    public static readonly SIZE_STANDARD = IconSize.STANDARD;

    /** @deprecated use IconSize.LARGE */
    public static readonly SIZE_LARGE = IconSize.LARGE;

    public render(): JSX.Element | null {
        const { icon } = this.props;
        if (icon == null || typeof icon === "boolean") {
            return null;
        } else if (typeof icon !== "string") {
            return icon;
        }

        const {
            className,
            color,
            htmlTitle,
            // eslint-disable-next-line deprecation/deprecation
            iconSize,
            intent,
            size = iconSize ?? IconSize.STANDARD,
            title,
            tagName = "span",
            ...htmlprops
        } = this.props;

        // choose which pixel grid is most appropriate for given icon size
        const pixelGridSize = size >= IconSize.LARGE ? IconSize.LARGE : IconSize.STANDARD;
        // render path elements, or nothing if icon name is unknown.
        const paths = this.renderSvgPaths(pixelGridSize, icon);

        // eslint-disable-next-line deprecation/deprecation
        const classes = classNames(Classes.ICON, Classes.iconClass(icon), Classes.intentClass(intent), className);
        const viewBox = `0 0 ${pixelGridSize} ${pixelGridSize}`;

        return React.createElement(
            tagName,
            {
                ...htmlprops,
                "aria-hidden": title ? undefined : true,
                className: classes,
                title: htmlTitle,
            },
            <svg fill={color} data-icon={icon} width={size} height={size} viewBox={viewBox}>
                {title && <desc>{title}</desc>}
                {paths}
            </svg>,
        );
    }

    /** Render `<path>` elements for the given icon name. Returns `null` if name is unknown. */
    private renderSvgPaths(pathsSize: number, iconName: IconName): JSX.Element[] | null {
        const svgPathsRecord = pathsSize === IconSize.STANDARD ? IconSvgPaths16 : IconSvgPaths20;
        const pathStrings = svgPathsRecord[iconName];
        if (pathStrings == null) {
            return null;
        }
        return pathStrings.map((d, i) => <path key={i} d={d} fillRule="evenodd" />);
    }
}
