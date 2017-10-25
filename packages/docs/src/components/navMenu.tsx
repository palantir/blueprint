/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
export const NavMenuItem: React.SFC<INavMenuItemProps & { children?: React.ReactNode }> = props => {
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
    return (
        <li className={classes} key={item.route}>
            <a className={itemClasses} href={"#" + item.route} onClick={handleClick}>
                {item.title}
            </a>
            {props.children}
        </li>
    );
};
NavMenuItem.displayName = "Docs.NavMenuItem";

export const NavMenu: React.SFC<INavMenuProps> = props => {
    const menu = props.items.map(section => {
        const isActive = props.activeSectionId === section.route;
        const isExpanded = isActive || isParentOfRoute(section.route, props.activeSectionId);
        // active section gets selected styles, expanded section shows its children
        const itemClasses = classNames({ "docs-nav-expanded": isExpanded });
        const childrenMenu = isPageNode(section) ? <NavMenu {...props} items={section.children} /> : undefined;
        return (
            <NavMenuItem
                className={itemClasses}
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

function isParentOfRoute(parent: string, route: string) {
    return route.indexOf(parent + "/") === 0 || route.indexOf(parent + ".") === 0;
}
