/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { IconName, IconPartial, IIconBaseProps } from "../../common";
import * as Errors from "../../common/errors";
import { SVGIcon } from "./svgIcon";

let allIcons: { [key: string]: IconPartial | undefined } | null = null;

if (!(global as any).BLUEPRINT_ICONS_TREE_SHAKING) {
    // tslint:disable-next-line:no-var-requires
    allIcons = require("../../generated/svgIcons");
}

export interface IIconProps extends IIconBaseProps {
    /**
     * Name of a Blueprint UI icon, or an icon element, to render.
     * This prop is required because it determines the content of the component, but it can
     * be explicitly set to falsy values to render nothing.
     *
     * - If `null` or `undefined` or `false`, this component will render nothing.
     * - If given an `IconName` (a string literal union of all icon names) or an `SVGIcon`,
     *   that icon will be rendered as an `<svg>` with `<path>` tags.
     * - If given a `JSX.Element`, that element will be rendered and _all other props on this component are ignored._
     *   This type is supported to simplify usage of this component in other Blueprint components.
     *   As a consumer, you should never use `<Icon icon={<element />}` directly; simply render `<element />` instead.
     */
    icon: IconName | JSX.Element | false | null | undefined;
}

export class Icon extends React.PureComponent<IIconProps & React.SVGAttributes<SVGElement>> {
    public static displayName = "Blueprint2.Icon";

    public static readonly SIZE_STANDARD = SVGIcon.SIZE_STANDARD;
    public static readonly SIZE_LARGE = SVGIcon.SIZE_LARGE;

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
