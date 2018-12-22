/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Classes, IconName, IProps, MaybeElement } from "@blueprintjs/core";
import classNames from "classnames";
import { Link } from "docz";
import React from "react";

export interface INavItemProps extends IProps {
    /** Depth of heading, from 1-6. */
    depth: number;
    /** Whether this item is expanded: either it or a child is the active route. */
    expanded: boolean;
    /** Icon. */
    icon?: IconName | MaybeElement;
    /** Name of item. */
    name: string;
    /** Navigation route. Use `Link` from `docz` to render links. */
    route?: string;
}

export type NavItemRenderer = (item: INavItemProps) => JSX.Element;

export const NavMenuItem: React.SFC<INavItemProps> = ({ children, className, depth, expanded, icon, name, route }) => {
    const classes = classNames(
        route ? Classes.MENU_ITEM : "docs-nav-heading",
        { "docs-nav-expanded": expanded },
        `depth-${depth}`,
        className,
    );
    return route ? (
        <Link activeClassName={Classes.ACTIVE} className={classes} id={route} to={route}>
            {icon}
            <span>{name}</span>
            {children}
        </Link>
    ) : (
        <div className={classes}>{name}</div>
    );
};
NavMenuItem.displayName = "Docs.NavMenuItem";
