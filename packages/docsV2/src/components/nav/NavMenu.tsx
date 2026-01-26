'use client';

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
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PageTree } from "fumadocs-core/server";

import { Classes } from "@blueprintjs/core";

import { NavIcon } from "./NavIcon";

export interface NavMenuProps {
    items: PageTree.Node[];
    level?: number;
}

export const NavMenu: React.FC<NavMenuProps> = ({ items, level = 0 }) => {
    const pathname = usePathname();

    const menu = items.map(node => {
        if (node.type === "separator") {
            return (
                <li key={`sep-${String(node.name)}`}>
                    <div className="docs-nav-section docs-nav-expanded">{node.name}</div>
                </li>
            );
        }

        if (node.type === "folder") {
            const isExpanded = node.children.some(child =>
                child.type === "page" && (pathname === child.url || pathname.startsWith(child.url + "/"))
            ) || node.children.some(child =>
                child.type === "folder" && child.children.some(grandchild =>
                    grandchild.type === "page" && (pathname === grandchild.url || pathname.startsWith(grandchild.url + "/"))
                )
            );

            return (
                <li key={String(node.name)}>
                    <div className={classNames("docs-nav-folder", { "docs-nav-expanded": isExpanded })}>
                        {node.name}
                    </div>
                    <NavMenu items={node.children} level={level + 1} />
                </li>
            );
        }

        if (node.type === "page") {
            const isActive = pathname === node.url;
            const isExpanded = isActive || pathname.startsWith(node.url + "/");
            const itemClasses = classNames(`depth-${level}`, {
                "docs-nav-expanded": isExpanded,
                [Classes.ACTIVE]: isActive,
            });

            // Top-level package pages get special treatment with icons
            if (level === 0) {
                const route = node.url.split("/").pop() ?? "";
                return (
                    <li key={node.url}>
                        <div className={classNames("docs-nav-package", itemClasses)} data-route={route}>
                            <Link className={Classes.MENU_ITEM} href={node.url}>
                                <NavIcon route={route} />
                                <span>{node.name}</span>
                            </Link>
                        </div>
                    </li>
                );
            }

            return (
                <li key={node.url}>
                    <Link
                        className={classNames(Classes.MENU_ITEM, itemClasses)}
                        href={node.url}
                    >
                        <span>{node.name}</span>
                    </Link>
                </li>
            );
        }

        return null;
    });

    const classes = classNames("docs-nav-menu", Classes.LIST_UNSTYLED, {
        "docs-nav-menu-nested": level > 0,
    });

    return <ul className={classes}>{menu}</ul>;
};
