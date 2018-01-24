/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as classNames from "classnames";
import * as React from "react";

import { IconName, IconSvgPaths16, IconSvgPaths20, LegacyIconName } from "@blueprintjs/icons";
import { Classes, IIntentProps, IProps } from "../../common";

export { IconName };

export interface IIconProps extends IIntentProps, IProps {
    /**
     * Name of the icon (with or without `"pt-icon-"` prefix).
     * If `undefined`, this component will render nothing.
     */
    iconName: LegacyIconName | undefined;

    /**
     * Size of the icon, in pixels.
     * Blueprint contains 16px and 20px SVG icon images,
     * and chooses the appropriate resolution based on this prop.
     */
    iconSize?: number;
}

export class Icon extends React.PureComponent<IIconProps & React.HTMLAttributes<HTMLSpanElement>, never> {
    public static displayName = "Blueprint.Icon";

    public static readonly SIZE_STANDARD = 16;
    public static readonly SIZE_LARGE = 20;

    public render() {
        const { className, iconName, iconSize = 16, intent } = this.props;
        if (iconName == null) {
            return null;
        }
        const pathsSize = this.determineIconDimension();
        const classes = classNames(Classes.ICON, Classes.iconClass(iconName), Classes.intentClass(intent), className);
        return (
            <svg className={classes} width={iconSize} height={iconSize} viewBox={`0 0 ${pathsSize} ${pathsSize}`}>
                <title>{iconName}</title>
                {this.renderSvgPaths(pathsSize === Icon.SIZE_STANDARD ? IconSvgPaths16 : IconSvgPaths20)}
            </svg>
        );
    }

    private determineIconDimension() {
        const { iconSize = 16 } = this.props;
        if (numberDiff(Icon.SIZE_STANDARD, iconSize) < numberDiff(Icon.SIZE_LARGE, iconSize)) {
            return Icon.SIZE_STANDARD;
        }
        return Icon.SIZE_LARGE;
    }

    private renderSvgPaths(svgPaths: Record<IconName, string[]>) {
        const paths = svgPaths[this.props.iconName.replace("pt-icon-", "") as IconName];
        if (paths == null) {
            return null;
        }
        return paths.map((d, i) => <path key={i} d={d} clip-rule="evenodd" fill-rule="evenodd" />);
    }
}

function numberDiff(target: number, actual: number) {
    return Math.abs(Math.round(actual / target) - actual / target);
}
