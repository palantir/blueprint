/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as classNames from "classnames";
import * as React from "react";

import { IconName, IconSvgPaths, LegacyIconName } from "@blueprintjs/icons";
import { Classes, IIntentProps, IProps } from "../../common";

export { IconName };

export interface IIconProps extends IIntentProps, IProps {
    /**
     * Name of the icon (with or without `"pt-icon-"` prefix).
     * If `undefined`, this component will render nothing.
     */
    iconName: LegacyIconName | undefined;

    /**
     * Height of icon. A number value will be interpreted as pixels. Use a string value for other units.
     * By default, inherits height from surrounding styles, such as `line-height`.
     * @default "inherit"
     */
    height?: number | string;

    /**
     * Width of icon. A number value will be interpreted as pixels. Use a string value for other units.
     * @default 16
     */
    width?: number | string;
}

export class Icon extends React.PureComponent<IIconProps & React.HTMLAttributes<HTMLSpanElement>, never> {
    public static displayName = "Blueprint.Icon";

    public static readonly SIZE_STANDARD = 16 as 16;
    public static readonly SIZE_LARGE = 20 as 20;

    public render() {
        const { className, iconName, intent, width = 16, height = "inherit" } = this.props;
        if (iconName == null) {
            return null;
        }
        const shortName = iconName.replace("pt-icon-", "") as IconName;
        const classes = classNames(Classes.ICON, Classes.iconClass(iconName), Classes.intentClass(intent), className);
        return (
            <svg className={classes} width={width} height={height} viewBox="0 0 16 16">
                <title>{iconName}</title>
                {IconSvgPaths[shortName].map((d, i) => <path key={i} d={d} clip-rule="evenodd" fill-rule="evenodd" />)}
            </svg>
        );
    }
}
