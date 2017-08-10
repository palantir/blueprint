/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";

import { Classes, IIntentProps, IProps } from "../../common";
import { IconName } from "../../generated/iconName";

export { IconName }

export interface IIconProps extends IIntentProps, IProps {
    /**
     * Name of the icon (with or without `"pt-icon-"` prefix).
     * If `undefined`, this component will render nothing.
     */
    iconName: IconName | undefined;

    /**
     * Size of the icon.
     * Blueprint provides each icon in two sizes: 16px and 20px. The keyword `"inherit"` will
     * render a 20px icon but inherit `font-size` from its parent.
     * Constants are exposed for each of these values on the component itself:
     * `Icon.SIZE_(STANDARD|LARGE|INHERIT)`,
     * @default 16
     */
    iconSize?: 16 | 20 | "inherit";
}

@PureRender
export class Icon extends React.Component<IIconProps & React.HTMLAttributes<HTMLSpanElement>, never> {
    public static displayName = "Blueprint.Icon";

    public static readonly SIZE_STANDARD = 16 as 16;
    public static readonly SIZE_LARGE = 20 as 20;
    public static readonly SIZE_INHERIT = "inherit" as "inherit";

    public render() {
        if (this.props.iconName == null) {
            return null;
        }
        const { className, iconName, intent, iconSize = Icon.SIZE_STANDARD, ...restProps }  = this.props;

        const classes = classNames(
            getSizeClass(iconSize),
            Classes.iconClass(iconName),
            Classes.intentClass(intent),
            className,
        );
        return <span className={classes} {...restProps} />;
    }
};

// NOTE: not using a type alias here so the full union will appear in the interface docs
function getSizeClass(size: 16 | 20 | "inherit") {
    switch (size) {
        case Icon.SIZE_STANDARD: return Classes.ICON_STANDARD;
        case Icon.SIZE_LARGE: return Classes.ICON_LARGE;
        default: return Classes.ICON;
    }
}
