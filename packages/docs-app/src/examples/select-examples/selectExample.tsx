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

import * as React from "react";

import { H5, Menu, MenuDivider, MenuItem, Switch } from "@blueprintjs/core";
import { Example, ExampleProps } from "@blueprintjs/docs-theme";
import { ItemListRendererProps } from "@blueprintjs/select";
import { Film, FilmSelect, filterFilm, TOP_100_FILMS } from "@blueprintjs/select/examples";

export interface ISelectExampleState {
    allowCreate: boolean;
    createFirst: boolean;
    createdItems: Film[];
    disableItems: boolean;
    disabled: boolean;
    fill: boolean;
    filterable: boolean;
    grouped: boolean;
    hasInitialContent: boolean;
    matchTargetWidth: boolean;
    minimal: boolean;
    resetOnClose: boolean;
    resetOnQuery: boolean;
    resetOnSelect: boolean;
}

/** Technically a Select2 example, since FilmSelect uses Select2. */
export class SelectExample extends React.PureComponent<ExampleProps, ISelectExampleState> {
    public state: ISelectExampleState = {
        allowCreate: false,
        createFirst: false,
        createdItems: [],
        disableItems: false,
        disabled: false,
        fill: false,
        filterable: true,
        grouped: false,
        hasInitialContent: false,
        matchTargetWidth: false,
        minimal: false,
        resetOnClose: false,
        resetOnQuery: true,
        resetOnSelect: false,
    };

    private handleAllowCreateChange = this.handleSwitchChange("allowCreate");

    private handleCreateFirstChange = this.handleSwitchChange("createFirst");

    private handleDisabledChange = this.handleSwitchChange("disabled");

    private handleFillChange = this.handleSwitchChange("fill");

    private handleFilterableChange = this.handleSwitchChange("filterable");

    private handleGroupedChange = this.handleSwitchChange("grouped");

    private handleInitialContentChange = this.handleSwitchChange("hasInitialContent");

    private handleItemDisabledChange = this.handleSwitchChange("disableItems");

    private handleMatchTargetWidthChange = this.handleSwitchChange("matchTargetWidth");

    private handleMinimalChange = this.handleSwitchChange("minimal");

    private handleResetOnCloseChange = this.handleSwitchChange("resetOnClose");

    private handleResetOnQueryChange = this.handleSwitchChange("resetOnQuery");

    private handleResetOnSelectChange = this.handleSwitchChange("resetOnSelect");

    public render() {
        const { allowCreate, disabled, disableItems, grouped, matchTargetWidth, minimal, ...flags } = this.state;

        const initialContent = this.getInitialContent();

        return (
            <Example options={this.renderOptions()} {...this.props}>
                <FilmSelect
                    {...flags}
                    allowCreate={allowCreate}
                    createNewItemPosition={this.state.createFirst ? "first" : "last"}
                    disabled={disabled}
                    itemDisabled={this.isItemDisabled}
                    itemListRenderer={grouped ? this.renderGroupedItemList : undefined}
                    itemListPredicate={grouped ? this.groupedItemListPredicate : undefined}
                    initialContent={initialContent}
                    popoverProps={{ matchTargetWidth, minimal }}
                />
            </Example>
        );
    }

    protected renderOptions() {
        return (
            <>
                <H5>Props</H5>
                <Switch label="Filterable" checked={this.state.filterable} onChange={this.handleFilterableChange} />
                <Switch label="Grouped" checked={this.state.grouped} onChange={this.handleGroupedChange} />
                <Switch
                    label="Reset on close"
                    checked={this.state.resetOnClose}
                    onChange={this.handleResetOnCloseChange}
                />
                <Switch
                    label="Reset on query"
                    checked={this.state.resetOnQuery}
                    onChange={this.handleResetOnQueryChange}
                />
                <Switch
                    label="Reset on select"
                    checked={this.state.resetOnSelect}
                    onChange={this.handleResetOnSelectChange}
                />
                <Switch
                    label="Use initial content"
                    checked={this.state.hasInitialContent}
                    onChange={this.handleInitialContentChange}
                />
                <Switch
                    label="Disable films before 2000"
                    checked={this.state.disableItems}
                    onChange={this.handleItemDisabledChange}
                />
                <Switch
                    label="Allow creating new items"
                    checked={this.state.allowCreate}
                    onChange={this.handleAllowCreateChange}
                />
                <Switch
                    label="Create new position: first"
                    disabled={!this.state.allowCreate}
                    checked={this.state.createFirst}
                    onChange={this.handleCreateFirstChange}
                />
                <H5>Appearance props</H5>
                <Switch label="Disabled" checked={this.state.disabled} onChange={this.handleDisabledChange} />
                <Switch label="Fill container width" checked={this.state.fill} onChange={this.handleFillChange} />
                <H5>Popover props</H5>
                <Switch
                    label="Match target width"
                    checked={this.state.matchTargetWidth}
                    onChange={this.handleMatchTargetWidthChange}
                />
                <Switch
                    label="Minimal popover style"
                    checked={this.state.minimal}
                    onChange={this.handleMinimalChange}
                />
            </>
        );
    }

    private getGroup(item: Film) {
        const firstLetter = item.title[0].toUpperCase();
        return /[0-9]/.test(firstLetter) ? "0-9" : firstLetter;
    }

    private getGroupedItems = (filteredItems: Film[]) => {
        return filteredItems.reduce<Array<{ group: string; index: number; items: Film[]; key: number }>>(
            (acc, item, index) => {
                const group = this.getGroup(item);

                const lastGroup = acc.at(-1);
                if (lastGroup && lastGroup.group === group) {
                    lastGroup.items.push(item);
                } else {
                    acc.push({ group, index, items: [item], key: index });
                }

                return acc;
            },
            [],
        );
    };

    private getInitialContent = () => {
        return this.state.hasInitialContent ? (
            <MenuItem disabled={true} text={`${TOP_100_FILMS.length} items loaded.`} roleStructure="listoption" />
        ) : undefined;
    };

    private groupedItemListPredicate = (query: string, items: Film[]) => {
        return items
            .filter((item, index) => filterFilm(query, item, index))
            .sort((a, b) => this.getGroup(a).localeCompare(this.getGroup(b)));
    };

    private handleSwitchChange(prop: keyof ISelectExampleState) {
        return (event: React.FormEvent<HTMLInputElement>) => {
            const checked = event.currentTarget.checked;
            this.setState(state => ({ ...state, [prop]: checked }));
        };
    }

    private isItemDisabled = (film: Film) => this.state.disableItems && film.year < 2000;

    private renderGroupedItemList = (listProps: ItemListRendererProps<Film>) => {
        const initialContent = this.getInitialContent();
        const noResults = <MenuItem disabled={true} text="No results." roleStructure="listoption" />;

        // omit noResults if createNewItemFromQuery and createNewItemRenderer are both supplied, and query is not empty
        const createItemView = listProps.renderCreateItem();
        const maybeNoResults = createItemView != null ? null : noResults;

        const menuContent = this.renderGroupedMenuContent(listProps, maybeNoResults, initialContent);
        if (menuContent == null && createItemView == null) {
            return null;
        }
        const { createFirst } = this.state;
        return (
            <Menu role="listbox" {...listProps.menuProps} ulRef={listProps.itemsParentRef}>
                {createFirst && createItemView}
                {menuContent}
                {!createFirst && createItemView}
            </Menu>
        );
    };

    private renderGroupedMenuContent = (
        listProps: ItemListRendererProps<Film>,
        noResults?: React.ReactNode,
        initialContent?: React.ReactNode | null,
    ) => {
        if (listProps.query.length === 0 && initialContent !== undefined) {
            return initialContent;
        }

        const groupedItems = this.getGroupedItems(listProps.filteredItems);

        const menuContent = groupedItems.map(groupedItem => (
            <React.Fragment key={groupedItem.key}>
                <MenuDivider title={groupedItem.group} />
                {groupedItem.items.map((item, index) => listProps.renderItem(item, groupedItem.index + index))}
            </React.Fragment>
        ));

        return groupedItems.length > 0 ? menuContent : noResults;
    };
}
