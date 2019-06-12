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
import classNames from "classnames";
import * as React from "react";

import { IHeadingNode, IPageNode, isPageNode } from "@documentalist/client";
import { INavMenuItemProps, NavMenuItem } from "./navMenuItem";

export interface INavMenuProps extends IProps {
    activePageId: string;
    activeSectionId: string;
    level: number;
    onItemClick: (reference: string) => void;
    items: Array<IPageNode | IHeadingNode>;
    renderNavMenuItem?: (props: INavMenuItemProps) => JSX.Element;
}

export const NavMenu: React.SFC<INavMenuProps> = props => {
    const { renderNavMenuItem = NavMenuItem } = props;
    const menu = props.items.map(section => {
        const isActive = props.activeSectionId === section.route;
        const isExpanded = isActive || isParentOfRoute(section.route, props.activeSectionId);
        // active section gets selected styles, expanded section shows its children
        const itemClasses = classNames(`depth-${section.level - props.level - 1}`, {
            "docs-nav-expanded": isExpanded,
            [Classes.ACTIVE]: isActive,
        });
        const item = renderNavMenuItem({
            className: itemClasses,
            href: "#" + section.route,
            isActive,
            isExpanded,
            onClick: () => props.onItemClick(section.route),
            section,
        });
        return (
            <li key={section.route}>
                {item}
                {isPageNode(section) ? <NavMenu {...props} level={section.level} items={section.children} /> : null}
            </li>
        );
    });
    const classes = classNames("docs-nav-menu", Classes.LIST_UNSTYLED, props.className);
    return <ul className={classes}>{menu}</ul>;
};
NavMenu.displayName = "Docs2.NavMenu";

function isParentOfRoute(parent: string, route: string) {
    return route.indexOf(parent + "/") === 0 || route.indexOf(parent + ".") === 0;
}
