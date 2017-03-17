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
    refPath: string[];
}

export interface INavMenuItemProps extends IProps {
    item: IPageNode | IHeadingNode;
    isActive: boolean;
    onClick: (reference: string) => void;
    refPath: string[];
}

// tslint:disable-next-line:max-line-length
export const NavMenuItem: React.SFC<INavMenuItemProps & { children?: React.ReactNode }> = (props) => {
    const { item } = props;
    const isPage = isPageNode(item);
    const classes = classNames(
        "docs-menu-item",
        `docs-menu-item-${isPage ? "page" : "heading"}`,
        `depth-${item.depth}`,
        props.className,
    );
    const itemClasses = classNames(Classes.MENU_ITEM, {
        [Classes.ACTIVE]: props.isActive,
        [Classes.INTENT_PRIMARY]: props.isActive,
    });
    const reference = [props.refPath.join("/"), item.reference].join(isPage ? "/" : ".");
    const handleClick = () => props.onClick(reference);
    const title = props.children ? <strong>{item.title}</strong> : item.title;
    return (
        <li className={classes} key={reference}>
            <a className={itemClasses} href={"#" + reference} onClick={handleClick}>
                {title}
            </a>
            {props.children}
        </li>
    );
};
NavMenuItem.displayName = "Docs.NavMenuItem";

export const NavMenu: React.SFC<INavMenuProps> = (props) => {
    const menu = props.items.map((section) => {
        const isActive = props.activeSectionId === section.reference;
        const isExpanded = isActive || props.activePageId === section.reference;
        const refPath = props.refPath.concat(section.reference);
        // active section gets selected styles, expanded section shows its children
        const menuClasses = classNames({ "docs-nav-expanded": isExpanded });
        const childrenMenu = isPageNode(section)
            ? <NavMenu {...props} className={menuClasses} items={section.children} refPath={refPath} />
            : undefined;
        return (
            <NavMenuItem
                key={section.reference}
                item={section}
                isActive={isActive}
                onClick={props.onItemClick}
                refPath={props.refPath}
            >
                {childrenMenu}
            </NavMenuItem>
        );
    });
    const classes = classNames("docs-nav-menu", "pt-list-unstyled", props.className);
    return <ul className={classes}>{menu}</ul>;
};
NavMenu.displayName = "Docs.NavMenu";
