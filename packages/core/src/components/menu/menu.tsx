/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";

import * as Classes from "../../common/classes";
import { IProps } from "../../common/props";
import { MenuDivider } from "./menuDivider";
import { MenuItem } from "./menuItem";

export interface IMenuProps extends IProps {
    /** Whether the menu items in this menu should use a large appearance. */
    large?: boolean;

    /** Ref handler that receives the HTML `<ul>` element backing this component. */
    ulRef?: (ref: HTMLUListElement | null) => any;
}

export class Menu extends React.Component<IMenuProps, {}> {
    public static displayName = "Blueprint2.Menu";

    public static Divider = MenuDivider;
    public static Item = MenuItem;

    public render() {
        const classes = classNames(Classes.MENU, { [Classes.LARGE]: this.props.large }, this.props.className);
        return (
            <ul className={classes} ref={this.props.ulRef}>
                {this.props.children}
            </ul>
        );
    }
}
