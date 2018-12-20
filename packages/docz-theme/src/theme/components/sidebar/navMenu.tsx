/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Menu } from "@blueprintjs/core";
import * as React from "react";

import { Entry, Menu as DoczMenu, MenuItem as DoczMenuItem } from "docz";
import { Heading } from "docz/dist/state";
import { INavItemProps, NavMenuItem } from "./navMenuItem";

export type NavItemRenderer = (item: INavItemProps) => JSX.Element;

interface INavMenuProps {
    currentPage: Entry;
    renderMenuItem?: NavItemRenderer;
}

export class NavMenu extends React.PureComponent<INavMenuProps> {
    public static displayName = "Docs.NavMenu";

    public render() {
        return <DoczMenu>{this.renderMenu}</DoczMenu>;
    }

    private renderMenu = (menu: DoczMenuItem[] | null): JSX.Element => {
        const {
            currentPage: { headings, route },
            renderMenuItem = NavMenuItem,
        } = this.props;
        if (menu == null) {
            return null;
        }

        const items = menu.map(item => (
            <li key={item.id}>
                {renderMenuItem({
                    depth: 1,
                    expanded: item.route == null || (item.route + "/").indexOf(route + "/") === 0,
                    name: item.name,
                    route: item.route,
                })}
                {this.renderMenu(item.menu)}
                {route === item.route && this.renderHeadings(headings)}
            </li>
        ));
        return <Menu className="docs-nav-menu">{items}</Menu>;
    };

    private renderHeadings(headings: Heading[] | null) {
        if (headings == null) {
            return null;
        }
        const { renderMenuItem = NavMenuItem } = this.props;
        const items = headings.map(h => (
            <li key={h.slug}>
                {renderMenuItem({
                    depth: h.depth,
                    expanded: false,
                    name: h.value,
                    route: `${this.props.currentPage.route}#${h.slug}`,
                })}
            </li>
        ));
        items.shift(); // remove first heading == page title
        return <Menu className="docs-nav-menu">{items}</Menu>;
    }
}
