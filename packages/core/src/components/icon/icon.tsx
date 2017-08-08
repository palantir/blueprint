/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as React from "react";

import { Classes, IIntentProps, IProps } from "../../common";
import { IconName } from "../../generated/iconName";

export { IconName }

export type IconSize = 16 | 20 | "inherit";

export interface IIconProps extends IIntentProps, IProps {
    /**
     * Name of the icon (the part after `pt-icon-`).
     * If `undefined`, this component will render nothing.
     */
    iconName: IconName | undefined;

    /**
     * Size of the icon.
     * Blueprint provides each icon in two sizes: 16px and 20px. The keyword `"inherit"` will
     * render a 20px icon but inherit `font-size` from its parent.
     * @default 16
     */
    iconSize?: IconSize;
}

export const Icon: React.SFC<IIconProps & React.HTMLAttributes<HTMLSpanElement>> = (props) => {
    if (props.iconName == null) {
        return null;
    }
    const { className, iconName, intent, iconSize = 16, ...restProps }  = props;
    const classes = classNames(
        getSizeClass(iconSize),
        Classes.iconClass(iconName),
        Classes.intentClass(intent),
        className,
    );
    return <span className={classes} {...restProps} />;
};
Icon.displayName = "Blueprint.Icon";

function getSizeClass(size: IconSize) {
    switch (size) {
        case 16: return Classes.ICON_STANDARD;
        case 20: return Classes.ICON_LARGE;
        default: return Classes.ICON;
    }
}
