/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 * 
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Classes, H6, IProps } from "@blueprintjs/core";
import classNames from "classnames";
import { Link } from "docz";
import React from "react";

export interface INavItemProps extends IProps {
    depth: number;
    expanded: boolean;
    name: string;
    route?: string;
}

export const NavMenuItem: React.SFC<INavItemProps> = ({ className, depth, expanded, name, route }) => {
    const classes = classNames(
        route ? Classes.MENU_ITEM : "docs-nav-heading",
        `depth-${depth}`,
        { "docs-nav-expanded": expanded },
        className,
    );
    return route ? (
        <Link activeClassName={Classes.ACTIVE} className={classes} to={route}>
            <span>{name}</span>
        </Link>
    ) : (
        <H6 className={classes}>{name}</H6>
    );
};
NavMenuItem.displayName = "Docs.NavMenuItem";
