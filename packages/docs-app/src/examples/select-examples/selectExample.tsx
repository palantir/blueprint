/*
 * Copyright 2025 Palantir Technologies, Inc. All rights reserved.
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

import React, { useCallback, useMemo, useState } from "react";

import { H5, Menu, MenuDivider, MenuItem, Switch } from "@blueprintjs/core";
import { Example, type ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";
import type { ItemListRendererProps } from "@blueprintjs/select";
import { type Film, FilmSelect, filterFilm, TOP_100_FILMS } from "@blueprintjs/select/examples";

export const SelectExample: React.FC<ExampleProps> = props => {
    const [allowCreate, setAllowCreate] = useState(false);
    const [createFirst, setCreateFirst] = useState(false);
    const [disableItems, setDisableItems] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [fill, setFill] = useState(false);
    const [filterable, setFilterable] = useState(true);
    const [grouped, setGrouped] = useState(false);
    const [hasInitialContent, setHasInitialContent] = useState(false);
    const [matchTargetWidth, setMatchTargetWidth] = useState(false);
    const [minimal, setMinimal] = useState(false);
    const [resetOnClose, setResetOnClose] = useState(false);
    const [resetOnQuery, setResetOnQuery] = useState(true);
    const [resetOnSelect, setResetOnSelect] = useState(false);

    const initialContent = useMemo(
        () =>
            hasInitialContent ? (
                <MenuItem disabled={true} text={`${TOP_100_FILMS.length} items loaded.`} roleStructure="listoption" />
            ) : undefined,
        [hasInitialContent],
    );

    const isItemDisabled = useCallback((film: Film) => disableItems && film.year < 2000, [disableItems]);

    const renderGroupedMenuContent = useCallback(
        (listProps: ItemListRendererProps<Film>, noResults?: React.ReactNode) => {
            if (listProps.query.length === 0 && initialContent !== undefined) {
                return initialContent;
            }
            const groupedItems = getGroupedItems(listProps.filteredItems);

            const menuContent = groupedItems.map(groupedItem => (
                <React.Fragment key={groupedItem.key}>
                    <MenuDivider title={groupedItem.group} />
                    {groupedItem.items.map((item, index) => listProps.renderItem(item, groupedItem.index + index))}
                </React.Fragment>
            ));

            return groupedItems.length > 0 ? menuContent : noResults;
        },
        [initialContent],
    );

    const renderGroupedItemList = useCallback(
        (listProps: ItemListRendererProps<Film>) => {
            const noResults = <MenuItem disabled={true} text="No results." roleStructure="listoption" />;

            // omit noResults if createNewItemFromQuery and createNewItemRenderer are both supplied, and query is not empty
            const createItemView = listProps.renderCreateItem();
            const maybeNoResults = createItemView != null ? null : noResults;

            const menuContent = renderGroupedMenuContent(listProps, maybeNoResults);
            if (menuContent == null && createItemView == null) {
                return null;
            }
            return (
                <Menu role="listbox" {...listProps.menuProps} ulRef={listProps.itemsParentRef}>
                    {createFirst && createItemView}
                    {menuContent}
                    {!createFirst && createItemView}
                </Menu>
            );
        },
        [createFirst, renderGroupedMenuContent],
    );

    const options = (
        <>
            <H5>Props</H5>
            <Switch checked={filterable} label="Filterable" onChange={handleBooleanChange(setFilterable)} />
            <Switch checked={grouped} label="Grouped" onChange={handleBooleanChange(setGrouped)} />
            <Switch checked={resetOnClose} label="Reset on close" onChange={handleBooleanChange(setResetOnClose)} />
            <Switch checked={resetOnQuery} label="Reset on query" onChange={handleBooleanChange(setResetOnQuery)} />
            <Switch checked={resetOnSelect} label="Reset on select" onChange={handleBooleanChange(setResetOnSelect)} />
            <Switch
                checked={hasInitialContent}
                label="Use initial content"
                onChange={handleBooleanChange(setHasInitialContent)}
            />
            <Switch
                checked={disableItems}
                label="Disable films before 2000"
                onChange={handleBooleanChange(setDisableItems)}
            />
            <Switch
                checked={allowCreate}
                label="Allow creating new items"
                onChange={handleBooleanChange(setAllowCreate)}
            />
            <Switch
                checked={createFirst}
                disabled={!allowCreate}
                label="Create new position: first"
                onChange={handleBooleanChange(setCreateFirst)}
            />
            <H5>Appearance props</H5>
            <Switch checked={disabled} label="Disabled" onChange={handleBooleanChange(setDisabled)} />
            <Switch checked={fill} label="Fill container width" onChange={handleBooleanChange(setFill)} />
            <H5>Popover props</H5>
            <Switch
                checked={matchTargetWidth}
                label="Match target width"
                onChange={handleBooleanChange(setMatchTargetWidth)}
            />
            <Switch checked={minimal} label="Minimal popover style" onChange={handleBooleanChange(setMinimal)} />
        </>
    );

    return (
        <Example options={options} {...props}>
            <FilmSelect
                allowCreate={allowCreate}
                createNewItemPosition={createFirst ? "first" : "last"}
                disabled={disabled}
                fill={fill}
                filterable={filterable}
                itemDisabled={isItemDisabled}
                itemListRenderer={grouped ? renderGroupedItemList : undefined}
                itemListPredicate={grouped ? groupedItemListPredicate : undefined}
                initialContent={hasInitialContent ? initialContent : undefined}
                popoverProps={{ matchTargetWidth, minimal }}
                resetOnClose={resetOnClose}
                resetOnQuery={resetOnQuery}
                resetOnSelect={resetOnSelect}
            />
        </Example>
    );
};

const getGroup = (item: Film) => {
    const firstLetter = item.title[0].toUpperCase();
    return /[0-9]/.test(firstLetter) ? "0-9" : firstLetter;
};

const getGroupedItems = (filteredItems: Film[]) => {
    return filteredItems.reduce<Array<{ group: string; index: number; items: Film[]; key: number }>>(
        (acc, item, index) => {
            const group = getGroup(item);

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

const groupedItemListPredicate = (query: string, items: Film[]) => {
    return items
        .filter((item, index) => filterFilm(query, item, index))
        .sort((a, b) => getGroup(a).localeCompare(getGroup(b)));
};
