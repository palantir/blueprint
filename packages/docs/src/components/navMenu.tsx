/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { Classes, IProps } from "@blueprintjs/core";
import * as classNames from "classnames";
import * as React from "react";

import { IHeadingNode, IPageNode, isPageNode } from "documentalist/dist/client";

export interface INavMenuProps extends IProps {
    activePageId: string;
    activeSectionId: string;
    onItemClick: (reference: string) => void;
    items: Array<IPageNode | IHeadingNode>;
}

export interface INavMenuItemProps extends IProps {
    item: IPageNode | IHeadingNode;
    isActive: boolean;
    onClick: (reference: string) => void;
}

// tslint:disable-next-line:max-line-length
export const NavMenuItem: React.SFC<INavMenuItemProps & { children?: React.ReactNode }> = (props) => {
    const { item } = props;
    const classes = classNames(
        "docs-menu-item",
        `docs-menu-item-${isPageNode(item) ? "page" : "heading"}`,
        `depth-${item.level}`,
        props.className,
    );
    const itemClasses = classNames(Classes.MENU_ITEM, {
        [Classes.ACTIVE]: props.isActive,
        [Classes.INTENT_PRIMARY]: props.isActive,
    });
    const handleClick = () => props.onClick(item.route);
    const title = props.children ? <strong>{item.title}</strong> : item.title;
    return (
        <li className={classes} key={item.route}>
            <a className={itemClasses} href={"#" + item.route} onClick={handleClick}>
                {title}
            </a>
            {props.children}
        </li>
    );
};
NavMenuItem.displayName = "Docs.NavMenuItem";

export const NavMenu: React.SFC<INavMenuProps> = (props) => {
    const menu = props.items.map((section) => {
        const isActive = props.activeSectionId === section.route;
        const isExpanded = isActive || props.activePageId === (section as IPageNode).reference;
        // active section gets selected styles, expanded section shows its children
        const menuClasses = classNames({ "docs-nav-expanded": isExpanded });
        const childrenMenu = isPageNode(section)
            ? <NavMenu {...props} className={menuClasses} items={section.children} />
            : undefined;
        return (
            <NavMenuItem
                key={section.route}
                item={section}
                isActive={isActive}
                onClick={props.onItemClick}
            >
                {childrenMenu}
            </NavMenuItem>
        );
    });
    const classes = classNames("docs-nav-menu", "pt-list-unstyled", props.className);
    return <ul className={classes}>{menu}</ul>;
};
NavMenu.displayName = "Docs.NavMenu";
