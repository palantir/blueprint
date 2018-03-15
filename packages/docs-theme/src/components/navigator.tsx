/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Classes, Icon, MenuItem } from "@blueprintjs/core";
import { ItemListPredicate, ItemRenderer, Omnibar } from "@blueprintjs/select";

import classNames from "classnames";
import { IHeadingNode, IPageNode } from "documentalist/dist/client";
import { filter } from "fuzzaldrin-plus";
import * as React from "react";

import { eachLayoutNode } from "../common/utils";

export interface INavigatorProps {
    isOpen: boolean;
    items: Array<IPageNode | IHeadingNode>;
    onNavigate: (route: string) => void;
    onClose: () => void;
}

export interface INavigationSection {
    filterKey: string;
    path: string[];
    route: string;
    title: string;
}

const NavOmnibar = Omnibar.ofType<INavigationSection>();

export class Navigator extends React.PureComponent<INavigatorProps> {
    private sections: INavigationSection[];

    public componentDidMount() {
        this.sections = [];
        eachLayoutNode(this.props.items, (node, parents) => {
            const { route, title } = node;
            const path = parents.map(p => p.title).reverse();
            const filterKey = [...path, "`" + title].join("/");
            this.sections.push({ filterKey, path, route, title });
        });
    }

    public render() {
        if (!this.sections) {
            return null;
        }
        return (
            <NavOmnibar
                className="docs-navigator-menu"
                itemListPredicate={this.filterMatches}
                isOpen={this.props.isOpen}
                items={this.sections}
                itemRenderer={this.renderItem}
                onItemSelect={this.handleItemSelect}
                onClose={this.props.onClose}
                resetOnSelect={true}
            />
        );
    }

    private filterMatches: ItemListPredicate<INavigationSection> = (query, items) =>
        filter(items, query, { key: "filterKey", isPath: true });

    private renderItem: ItemRenderer<INavigationSection> = (section, props) => {
        if (!props.modifiers.matchesPredicate) {
            return null;
        }

        const classes = classNames({
            [Classes.ACTIVE]: props.modifiers.active,
            [Classes.INTENT_PRIMARY]: props.modifiers.active,
        });

        // insert caret-right between each path element
        const pathElements = section.path.reduce<React.ReactChild[]>((elems, el) => {
            elems.push(el, <Icon icon="caret-right" />);
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
                className={classes}
                href={"#" + section.route}
                key={section.route}
                multiline={true}
                onClick={props.handleClick}
                text={text}
            />
        );
    };

    private handleItemSelect = (item: INavigationSection) => this.props.onNavigate(item.route);
}
