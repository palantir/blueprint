/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { IconName, IconPartial, IIconProps } from "../../common";
import * as Errors from "../../common/errors";

let allIcons: { [key: string]: IconPartial | undefined } | null = null;

if (!(global as any).BLUEPRINT_ICONS_TREE_SHAKING) {
    // tslint:disable-next-line:no-var-requires
    allIcons = require("../../generated/svgIcons");
}
export { IIconProps };

export class Icon extends React.PureComponent<IIconProps & React.SVGAttributes<SVGElement>> {
    public static displayName = "Blueprint2.Icon";

    public static readonly SIZE_STANDARD = 16;
    public static readonly SIZE_LARGE = 20;

    public render() {
        const { icon, ...props } = this.props;

        if (icon == null) {
            return null;
        } else if (typeof icon !== "string") {
            return icon;
        }

        const IconComponent = this.getIconComponentFromName(icon);
        return IconComponent != null ? <IconComponent {...props} /> : null;
    }

    private getIconComponentFromName(iconName: IconName) {
        const pascalCaseIconName = iconName
            .split("-")
            .reduce((result, word) => result + word[0].toUpperCase() + word.slice(1), "");

        if (allIcons == null) {
            throw new Error(Errors.ICON_STRING_NAMES_NOT_SUPPORTED);
        }
        return allIcons[`${pascalCaseIconName}Icon`];
    }
}
