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

import classNames from "classnames";

import { Classes, type Props } from "@blueprintjs/core";

import { COMPONENT_DISPLAY_NAMESPACE } from "../common";
import type * as PageTree from "../common/pageTreeTypes";

import { NavMenuItem, type NavMenuItemProps } from "./navMenuItem";

/** Get the route string for a PageTree node. */
function getNodeRoute(node: PageTree.Node): string {
    if (node.type === "page") return node.url;
    if (node.type === "folder") return (node.$id as string) ?? "";
    return "";
}

export interface NavMenuProps extends Props {
    activePageId: string;
    activeSectionId: string;
    depth: number;
    onItemClick: (reference: string) => void;
    items: PageTree.Node[];
    renderNavMenuItem?: (props: NavMenuItemProps) => React.JSX.Element;
}

export const NavMenu: React.FC<NavMenuProps> = props => {
    const { renderNavMenuItem = NavMenuItem } = props;
    const menu = props.items
        .filter((node): node is PageTree.Item | PageTree.Folder => node.type !== "separator")
        .map(node => {
            const route = getNodeRoute(node);
            const isActive = props.activeSectionId === route;
            const isExpanded = isActive || isParentOfRoute(route, props.activeSectionId);
            const itemClasses = classNames(`depth-${props.depth}`, {
                "docs-nav-expanded": isExpanded,
                [Classes.ACTIVE]: isActive,
            });
            const item = renderNavMenuItem({
                className: itemClasses,
                href: "#" + route,
                isActive,
                isExpanded,
                onClick: () => props.onItemClick(route),
                section: node,
            });
            return (
                <li key={route}>
                    {item}
                    {node.type === "folder" ? (
                        <NavMenu {...props} depth={props.depth + 1} items={node.children} />
                    ) : null}
                </li>
            );
        });
    const classes = classNames("docs-nav-menu", Classes.LIST_UNSTYLED, props.className);
    return <ul className={classes}>{menu}</ul>;
};
NavMenu.displayName = `${COMPONENT_DISPLAY_NAMESPACE}.NavMenu`;

function isParentOfRoute(parent: string, route: string) {
    return route.indexOf(parent + "/") === 0 || route.indexOf(parent + ".") === 0;
}
