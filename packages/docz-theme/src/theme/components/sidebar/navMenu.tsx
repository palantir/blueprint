/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Classes } from "@blueprintjs/core";
import classNames from "classnames";
import { Entry, Menu as DoczMenu, MenuItem as DoczMenuItem } from "docz";
import { Heading } from "docz/dist/state";
import * as React from "react";
import { NavItemRenderer, NavMenuItem } from "./navMenuItem";

const listClasses = classNames("docs-nav-menu", Classes.LIST_UNSTYLED);

interface INavMenuProps {
    currentPage: Entry;
    renderMenuItem?: NavItemRenderer;
}

export class NavMenu extends React.PureComponent<INavMenuProps> {
    public static displayName = "Docs.NavMenu";

    public render() {
        return <DoczMenu>{this.renderMenu}</DoczMenu>;
    }

    private renderMenu = (menu: DoczMenuItem[] | null, depth = 1): JSX.Element => {
        console.log(menu);

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
                    depth,
                    expanded: item.route == null || (item.route + "/").indexOf(route + "/") === 0,
                    name: item.name,
                    route: item.route,
                })}
                {this.renderMenu(item.menu, depth + 1)}
                {route === item.route && this.renderHeadings(headings, depth)}
            </li>
        ));
        return <ol className={listClasses}>{items}</ol>;
    };

    private renderHeadings(headings: Heading[] | null, depth: number) {
        if (headings == null) {
            return null;
        }
        const { renderMenuItem = NavMenuItem } = this.props;
        const items = headings.map(h => (
            <li key={h.slug}>
                {renderMenuItem({
                    depth: h.depth + depth - 1,
                    expanded: false,
                    name: h.value,
                    route: `${this.props.currentPage.route}#${h.slug}`,
                })}
            </li>
        ));
        items.shift(); // remove first heading == page title
        return <ol className={listClasses}>{items}</ol>;
    }
}
