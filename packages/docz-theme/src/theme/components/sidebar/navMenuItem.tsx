/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Classes, IProps } from "@blueprintjs/core";
import classNames from "classnames";
import { Link } from "docz";
import React from "react";

export interface INavItemProps extends IProps {
    /** Depth of heading, from 1-6. */
    depth: number;
    /** Whether this item is expanded: either it or a child is the active route. */
    expanded: boolean;
    /** Name of item. */
    name: string;
    /** Navigation route. Use `Link` from `docz` to render links. */
    route?: string;
}

export const NavMenuItem: React.SFC<INavItemProps> = ({ className, depth, expanded, name, route }) => {
    const classes = classNames(
        route ? Classes.MENU_ITEM : "docs-nav-heading",
        { "docs-nav-expanded": expanded },
        `depth-${depth}`,
        className,
    );
    return route ? (
        <Link activeClassName={Classes.ACTIVE} className={classes} to={route}>
            <span>{name}</span>
        </Link>
    ) : (
        <div className={classes}>{name}</div>
    );
};
NavMenuItem.displayName = "Docs.NavMenuItem";
