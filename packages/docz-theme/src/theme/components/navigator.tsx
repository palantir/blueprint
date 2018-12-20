/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Classes, Icon, IInputGroupProps, MenuItem } from "@blueprintjs/core";
import { ItemListPredicate, ItemRenderer, Omnibar } from "@blueprintjs/select";
import { Menu, MenuItem as DoczMenuItem } from "docz";

import { filter } from "fuzzaldrin-plus";
import * as React from "react";

export interface INavigatorProps {
    /** Whether navigator is open. */
    isOpen: boolean;

    /**
     * Callback invoked when the navigator is closed. Navigation is performed by
     * updating browser `location` directly.
     */
    onClose: () => void;
}

export interface INavigatorConfigProps {
    /** All potentially navigable items. */
    items: INavigationEntry[];

    /** Callback to determine if a given item should be excluded. */
    itemExclude?: (menu: DoczMenuItem) => boolean;
}

export interface INavigationEntry {
    path: string[];
    route: string;
    title: string;
}

const NavOmnibar = Omnibar.ofType<INavigationEntry>();
const INPUT_PROPS: IInputGroupProps = { placeholder: "Fuzzy search pages and headings..." };

class NavigatorCmp extends React.PureComponent<INavigatorProps & INavigatorConfigProps> {
    public render() {
        return (
            <NavOmnibar
                className="docs-navigator-menu"
                inputProps={INPUT_PROPS}
                itemListPredicate={this.filterMatches}
                isOpen={this.props.isOpen}
                items={this.props.items}
                itemRenderer={this.renderItem}
                onItemSelect={this.handleItemSelect}
                onClose={this.props.onClose}
                resetOnSelect={true}
            />
        );
    }

    private filterMatches: ItemListPredicate<INavigationEntry> = (query, items) =>
        filter(items, query, {
            key: "route",
            maxInners: items.length / 5,
            maxResults: 10,
            pathSeparator: "/",
            usePathScoring: true,
        });

    private renderItem: ItemRenderer<INavigationEntry> = (section, props) => {
        if (!props.modifiers.matchesPredicate) {
            return null;
        }

        // insert caret-right between each path element
        const pathElements = section.path.reduce<React.ReactChild[]>((elems, el) => {
            elems.push(el, <Icon key={el} icon="caret-right" />);
            return elems;
        }, []);
        pathElements.pop();

        const text = (
            <>
                <div>{section.title}</div>
                <small className={Classes.TEXT_MUTED}>{pathElements}</small>
            </>
        );
        return (
            <MenuItem
                active={props.modifiers.active}
                href={"#" + section.route}
                key={section.route}
                multiline={true}
                onClick={props.handleClick}
                text={text}
            />
        );
    };

    // updating location.hash will trigger hashchange event, which Documentation will receive and use to navigate.
    private handleItemSelect = (item: INavigationEntry) => {
        location.hash = item.route;
        this.props.onClose();
    };
}

export const Navigator: React.SFC<INavigatorProps> = props => (
    <Menu>{menu => <NavigatorCmp items={flattenMenu(menu)} {...props} />}</Menu>
);

function flattenMenu(menu?: DoczMenuItem[], parents: string[] = []): INavigationEntry[] {
    if (menu == null) {
        return [];
    }
    return [].concat(
        ...menu.map<INavigationEntry[]>(item => [
            { title: item.name, route: item.route, path: parents },
            ...flattenMenu(item.menu, parents.concat(item.name)),
        ]),
    );
}
