/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";

import * as Classes from "../../common/classes";
import { DISPLAYNAME_PREFIX, IProps } from "../../common/props";
import { MenuDivider } from "./menuDivider";
import { MenuItem } from "./menuItem";

export interface IMenuProps extends IProps, React.HTMLAttributes<HTMLUListElement> {
    /** Whether the menu items in this menu should use a large appearance. */
    large?: boolean;

    /** Ref handler that receives the HTML `<ul>` element backing this component. */
    ulRef?: (ref: HTMLUListElement | null) => any;
}

export class Menu extends React.Component<IMenuProps, {}> {
    public static displayName = `${DISPLAYNAME_PREFIX}.Menu`;

    public static Divider = MenuDivider;
    public static Item = MenuItem;

    public render() {
        const { className, children, large, ulRef, ...htmlProps } = this.props;
        const classes = classNames(Classes.MENU, { [Classes.LARGE]: large }, className);
        return (
            <ul {...htmlProps} className={classes} ref={ulRef}>
                {children}
            </ul>
        );
    }
}
