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

import { Classes, Icon, IInputGroupProps, MenuItem, Utils } from "@blueprintjs/core";
import { ItemListPredicate, ItemRenderer, Omnibar } from "@blueprintjs/select";

import { IHeadingNode, IPageNode } from "@documentalist/client";
import { filter } from "fuzzaldrin-plus";
import * as React from "react";

import { eachLayoutNode } from "../common/utils";

export interface INavigatorProps {
    /** Whether navigator is open. */
    isOpen: boolean;

    /** All potentially navigable items. */
    items: Array<IPageNode | IHeadingNode>;

    /** Callback to determine if a given item should be excluded. */
    itemExclude?: (node: IPageNode | IHeadingNode) => boolean;

    /**
     * Callback invoked when the navigator is closed. Navigation is performed by
     * updating browser `location` directly.
     */
    onClose: () => void;
}

export interface INavigationSection {
    path: string[];
    route: string;
    title: string;
}

const NavOmnibar = Omnibar.ofType<INavigationSection>();
const INPUT_PROPS: IInputGroupProps = { placeholder: "Fuzzy search headings..." };

export class Navigator extends React.PureComponent<INavigatorProps> {
    private sections: INavigationSection[];

    public componentDidMount() {
        this.sections = [];
        eachLayoutNode(this.props.items, (node, parents) => {
            if (Utils.safeInvoke(this.props.itemExclude, node) === true) {
                // ignore excluded item
                return;
            }
            const { route, title } = node;
            const path = parents.map(p => p.title).reverse();
            this.sections.push({ path, route, title });
        });
    }

    public render() {
        if (!this.sections) {
            return null;
        }
        return (
            <NavOmnibar
                className="docs-navigator-menu"
                inputProps={INPUT_PROPS}
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
        filter(items, query, {
            key: "route",
            maxInners: items.length / 5,
            maxResults: 10,
            pathSeparator: "/",
            usePathScoring: true,
        });

    private renderItem: ItemRenderer<INavigationSection> = (section, props) => {
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
    private handleItemSelect = (item: INavigationSection) => {
        location.hash = item.route;
        this.props.onClose();
    };
}
