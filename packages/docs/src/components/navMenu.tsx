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
    const classes = classNames("docs-menu-item", `depth-${item.depth}`, props.className);
    const itemClasses = classNames(Classes.MENU_ITEM, {
        [Classes.ACTIVE]: props.isActive,
        [Classes.INTENT_PRIMARY]: props.isActive,
    });
    const handleClick = () => props.onClick(item.reference);
    const title = props.children ? <strong>{item.title}</strong> : item.title;
    return (
        <li className={classes} key={item.reference}>
            <a className={itemClasses} href={"#" + item.reference} onClick={handleClick}>
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
        const isExpanded = isActive || props.activeSectionId.indexOf(`${section.reference}.`) === 0;
        // active section gets selected styles, expanded section shows its children
        const classes = classNames({ "docs-nav-expanded": isExpanded });
        const childrenMenu = isPageNode(section)
            ? <NavMenu {...props} items={section.children} />
            : undefined;
        return (
            <NavMenuItem
                className={classes}
                key={section.reference}
                item={section}
                isActive={isActive}
                onClick={props.onItemClick}
            >
                {childrenMenu}
            </NavMenuItem>
        );
    });
    return <ul className="docs-nav-menu pt-list-unstyled">{menu}</ul>;
};
NavMenu.displayName = "Docs.NavMenu";
