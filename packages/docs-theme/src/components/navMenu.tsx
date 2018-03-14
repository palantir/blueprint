/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Classes, IProps } from "@blueprintjs/core";
import classNames from "classnames";
import * as React from "react";

import { IHeadingNode, IPageNode, isPageNode } from "documentalist/dist/client";

export interface INavMenuProps extends IProps {
    activePageId: string;
    activeSectionId: string;
    onItemClick: (reference: string) => void;
    items: Array<IPageNode | IHeadingNode>;
    renderNavMenuItem?: (props: INavMenuItemProps) => JSX.Element;
}

export interface INavMenuItemProps {
    href: string;
    isActive: boolean;
    isExpanded: boolean;
    onClick: () => void;
    section: IPageNode | IHeadingNode;
}

export const NavMenuItem: React.SFC<INavMenuItemProps> = props => {
    const itemClasses = classNames(Classes.MENU_ITEM, {
        [Classes.ACTIVE]: props.isActive,
    });
    return (
        <a className={itemClasses} href={props.href} onClick={props.onClick}>
            {props.section.title}
        </a>
    );
};
NavMenuItem.displayName = "Docs2.NavMenuItem";

export const NavMenu: React.SFC<INavMenuProps> = props => {
    const { renderNavMenuItem = NavMenuItem } = props;
    const menu = props.items.map(section => {
        const isActive = props.activeSectionId === section.route;
        const isExpanded = isActive || isParentOfRoute(section.route, props.activeSectionId);
        // active section gets selected styles, expanded section shows its children
        const itemClasses = classNames(
            "docs-menu-item",
            `docs-menu-item-${isPageNode(section) ? "page" : "heading"}`,
            `depth-${section.level}`,
            { "docs-nav-expanded": isExpanded },
        );
        const item = renderNavMenuItem({
            href: "#" + section.route,
            isActive,
            isExpanded,
            onClick: () => props.onItemClick(section.route),
            section,
        });
        return (
            <li className={itemClasses} key={section.route}>
                {item}
                {isPageNode(section) ? <NavMenu {...props} items={section.children} /> : null}
            </li>
        );
    });
    const classes = classNames("docs-nav-menu", "pt-list-unstyled", props.className);
    return <ul className={classes}>{menu}</ul>;
};
NavMenu.displayName = "Docs2.NavMenu";

function isParentOfRoute(parent: string, route: string) {
    return route.indexOf(parent + "/") === 0 || route.indexOf(parent + ".") === 0;
}
