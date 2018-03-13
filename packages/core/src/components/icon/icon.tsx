/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";

import { IconName, IconSvgPaths16, IconSvgPaths20 } from "@blueprintjs/icons";
import { Classes, IIntentProps, IProps } from "../../common";

export { IconName };

export interface IIconProps extends IIntentProps, IProps {
    /** This component does not support custom children. Use the `icon` prop. */
    children?: never;

    /**
     * Color of icon. Equivalent to setting CSS `fill` property.
     */
    color?: string;

    /**
     * Name of a Blueprint UI icon, or an icon element, to render.
     * This prop is required because it determines the content of the component, but it can
     * be explicitly set to falsy values to render nothing.
     *
     * - If `null` or `undefined` or `false`, this component will render nothing.
     * - If given an `IconName` (a string literal union of all icon names),
     *   that icon will be rendered as an `<svg>` with `<path>` tags.
     * - If given a `JSX.Element`, that element will be rendered and _all other props on this component are ignored._
     *   This type is supported to simplify usage of this component in other Blueprint components.
     *   As a consumer, you should never use `<Icon icon={<element />}` directly; simply render `<element />` instead.
     */
    icon: IconName | JSX.Element | false | null | undefined;

    /**
     * Size of the icon, in pixels.
     * Blueprint contains 16px and 20px SVG icon images,
     * and chooses the appropriate resolution based on this prop.
     * @default Icon.SIZE_STANDARD = 16
     */
    iconSize?: number;

    /** CSS style properties. */
    style?: React.CSSProperties;

    /**
     * Description string.
     * Browsers usually render this as a tooltip on hover, whereas screen
     * readers will use it for aural feedback.
     * By default, this is set to the icon's name for accessibility.
     */
    title?: string | false | null;
}

export class Icon extends React.PureComponent<IIconProps & React.SVGAttributes<SVGElement>> {
    public static displayName = "Blueprint2.Icon";

    public static readonly SIZE_STANDARD = 16;
    public static readonly SIZE_LARGE = 20;

    public render() {
        const { className, color, icon, iconSize = Icon.SIZE_STANDARD, intent, title = icon, ...svgProps } = this.props;

        if (icon == null) {
            return null;
        } else if (typeof icon !== "string") {
            return icon;
        }

        // choose which pixel grid is most appropriate for given icon size
        const pixelGridSize = iconSize >= Icon.SIZE_LARGE ? Icon.SIZE_LARGE : Icon.SIZE_STANDARD;
        const paths = this.renderSvgPaths(pixelGridSize, icon);
        if (paths == null) {
            return null;
        }

        const classes = classNames(Classes.ICON, Classes.intentClass(intent), className);
        const viewBox = `0 0 ${pixelGridSize} ${pixelGridSize}`;

        // ".pt-icon" will apply a "fill" CSS style, so we need to inject an inline style to override it
        let { style = {} } = this.props;
        if (color != null) {
            style = { ...style, fill: color };
        }

        return (
            <svg
                {...svgProps}
                className={classes}
                style={style}
                data-icon={icon}
                width={iconSize}
                height={iconSize}
                viewBox={viewBox}
            >
                {title ? <title>{title}</title> : null}
                {paths}
            </svg>
        );
    }

    private renderSvgPaths(pathsSize: number, iconName: IconName) {
        const svgPathsRecord = pathsSize === Icon.SIZE_STANDARD ? IconSvgPaths16 : IconSvgPaths20;
        const pathStrings = svgPathsRecord[iconName];
        if (pathStrings == null) {
            return null;
        }
        return pathStrings.map((d, i) => <path key={i} d={d} fillRule="evenodd" />);
    }
}
