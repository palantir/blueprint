/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";

import { IconName, IconSvgPaths16, IconSvgPaths20 } from "@blueprintjs/icons";
import { Classes, DISPLAYNAME_PREFIX, IIntentProps, IProps } from "../../common";

export { IconName };

export interface IIconProps extends IIntentProps, IProps {
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
     * Name of a Blueprint UI icon, or an icon element, to render. This prop is
     * required because it determines the content of the component, but it can
     * be explicitly set to falsy values to render nothing.
     *
     * - If `null` or `undefined` or `false`, this component will render
     *   nothing.
     * - If given an `IconName` (a string literal union of all icon names), that
     *   icon will be rendered as an `<svg>` with `<path>` tags. Unknown strings
     *   will render a blank icon to occupy space.
     * - If given a `JSX.Element`, that element will be rendered and _all other
     *   props on this component are ignored._ This type is supported to
     *   simplify icon support in other Blueprint components. As a consumer, you
     *   should avoid using `<Icon icon={<Element />}` directly; simply render
     *   `<Element />` instead.
     */
    icon: IconName | JSX.Element | false | null | undefined;

    /**
     * Size of the icon, in pixels. Blueprint contains 16px and 20px SVG icon
     * images, and chooses the appropriate resolution based on this prop.
     * @default Icon.SIZE_STANDARD = 16
     */
    iconSize?: number;

    /** CSS style properties. */
    style?: React.CSSProperties;

    /**
     * HTML tag to use for the rendered element.
     * @default "span"
     */
    tagName?: keyof JSX.IntrinsicElements;

    /**
     * Description string. This string does not appear in normal browsers, but
     * it increases accessibility. For instance, screen readers will use it for
     * aural feedback. By default, this is set to the icon's name. Pass an
     * explicit falsy value to disable.
     */
    title?: string | false | null;
}

export class Icon extends React.PureComponent<IIconProps & React.DOMAttributes<HTMLElement>> {
    public static displayName = `${DISPLAYNAME_PREFIX}.Icon`;

    public static readonly SIZE_STANDARD = 16;
    public static readonly SIZE_LARGE = 20;

    public render() {
        const { icon } = this.props;
        if (icon == null) {
            return null;
        } else if (typeof icon !== "string") {
            return icon;
        }

        const {
            className,
            color,
            iconSize = Icon.SIZE_STANDARD,
            intent,
            title = icon,
            tagName: TagName = "span",
            ...htmlprops
        } = this.props;

        // choose which pixel grid is most appropriate for given icon size
        const pixelGridSize = iconSize >= Icon.SIZE_LARGE ? Icon.SIZE_LARGE : Icon.SIZE_STANDARD;
        // render path elements, or nothing if icon name is unknown.
        const paths = this.renderSvgPaths(pixelGridSize, icon);

        const classes = classNames(Classes.ICON, Classes.iconClass(icon), Classes.intentClass(intent), className);
        const viewBox = `0 0 ${pixelGridSize} ${pixelGridSize}`;

        return (
            <TagName className={classes} {...htmlprops}>
                <svg fill={color} data-icon={icon} width={iconSize} height={iconSize} viewBox={viewBox}>
                    {title && <desc>{title}</desc>}
                    {paths}
                </svg>
            </TagName>
        );
    }

    /** Render `<path>` elements for the given icon name. Returns `null` if name is unknown. */
    private renderSvgPaths(pathsSize: number, iconName: IconName): JSX.Element[] | null {
        const svgPathsRecord = pathsSize === Icon.SIZE_STANDARD ? IconSvgPaths16 : IconSvgPaths20;
        const pathStrings = svgPathsRecord[iconName];
        if (pathStrings == null) {
            return null;
        }
        return pathStrings.map((d, i) => <path key={i} d={d} fillRule="evenodd" />);
    }
}
