/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as classNames from "classnames";
import * as React from "react";

import { IconName, IconSvgPaths16, IconSvgPaths20 } from "@blueprintjs/icons";
import { Classes, IIntentProps, IProps } from "../../common";

export { IconName };

export interface IIconProps extends IIntentProps, IProps {
    /**
     * Color of icon. Equivalent to setting CSS `fill` property.
     */
    color?: string;

    /**
     * Name of the icon (with or without `"pt-icon-"` prefix).
     * If omitted or `undefined`, this component will render nothing.
     */
    iconName?: IconName;

    /**
     * Size of the icon, in pixels.
     * Blueprint contains 16px and 20px SVG icon images,
     * and chooses the appropriate resolution based on this prop.
     * @default Icon.SIZE_STANDARD = 16
     */
    iconSize?: number;

    /** CSS style properties. */
    style?: React.CSSProperties;
}

export class Icon extends React.PureComponent<IIconProps & React.SVGAttributes<SVGElement>> {
    public static displayName = "Blueprint2.Icon";

    public static readonly SIZE_STANDARD = 16;
    public static readonly SIZE_LARGE = 20;

    public render() {
        if (this.props.iconName == null) {
            return null;
        }
        const { className, iconName, iconSize = Icon.SIZE_STANDARD, intent, ...svgProps } = this.props;

        // choose which pixel grid is most appropriate for given icon size
        const pixelGridSize = iconSize >= Icon.SIZE_LARGE ? Icon.SIZE_LARGE : Icon.SIZE_STANDARD;
        const paths = this.renderSvgPaths(pixelGridSize, iconName);
        if (paths == null) {
            return null;
        }

        const classes = classNames(Classes.ICON, Classes.intentClass(intent), className);
        const viewBox = `0 0 ${pixelGridSize} ${pixelGridSize}`;
        return (
            <svg
                {...svgProps}
                className={classes}
                data-icon={iconName}
                width={iconSize}
                height={iconSize}
                viewBox={viewBox}
            >
                <title>{iconName}</title>
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
