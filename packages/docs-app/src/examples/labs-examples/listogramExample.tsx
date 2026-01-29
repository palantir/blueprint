/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
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

import { useCallback, useMemo, useState } from "react";

import {
    Button,
    FormGroup,
    H5,
    HTMLSelect,
    Menu,
    MenuItem,
    Popover,
    Switch,
} from "@blueprintjs/core";
import {
    Example,
    type ExampleProps,
    handleBooleanChange,
    handleValueChange,
} from "@blueprintjs/docs-theme";
import { ChevronDown, Control, Dollar } from "@blueprintjs/icons";
import {
    type IListogramItem,
    Listogram,
    type ListogramItemId,
    ListogramSelectionKind,
    ListogramSelectionMode,
} from "@blueprintjs/labs";

const SELECTION_KINDS = [
    ListogramSelectionKind.MULTIPLE,
    ListogramSelectionKind.SINGLE,
    ListogramSelectionKind.TOGGLE,
];

const contextMenuContent = (
    <Menu>
        <MenuItem icon={<Control />} text="Sell fruit" />
        <MenuItem icon={<Dollar />} text="Buy fruit" />
    </Menu>
);

const EXAMPLE_LISTOGRAM_ITEMS: IListogramItem[] = [
    { count: 7, title: "Apples" },
    { count: 6, title: "Strawberries and Cream" },
    { count: 3, title: "Apricots" },
    { count: 2, title: "Pears" },
    { count: 2, title: "Oranges" },
    { count: 1, title: "Cherries" },
].map((item, index) => ({
    contextMenu: { content: contextMenuContent },
    id: index.toString() as ListogramItemId,
    ...item,
}));

export const ListogramExample: React.FC<ExampleProps> = props => {
    const [defaultSelectionMode, setDefaultSelectionMode] = useState(
        ListogramSelectionMode.KEEPING,
    );
    const [disableEvenItems, setDisableEvenItems] = useState(false);
    const [enableContextMenus, setEnableContextMenus] = useState(true);
    const [enableSelectionDrawer, setEnableSelectionDrawer] = useState(false);
    const [enableSorts, setEnableSorts] = useState(true);
    const [hasCountTotal, setHasCountTotal] = useState(false);
    const [hasSubTotal, setHasSubTotal] = useState(false);
    const [hasVisibleItemLimit, setHasVisibleItemLimit] = useState(true);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [itemShouldDismissPopover, setItemShouldDismissPopover] = useState(true);
    const [selectedItemIds, setSelectedItemIds] = useState<Set<ListogramItemId>>(new Set());
    const [selectionKind, setSelectionKind] = useState<ListogramSelectionKind>(
        ListogramSelectionKind.MULTIPLE,
    );
    const [showBars, setShowBars] = useState(true);
    const [showSelectionToggles, setShowSelectionToggles] = useState(true);

    const items = useMemo(() => {
        return EXAMPLE_LISTOGRAM_ITEMS.map(item => {
            const newItem = { ...item };

            // Add subtotals if enabled
            if (hasSubTotal) {
                newItem.countSubtotal = Math.round(Math.random() * item.count);
            } else {
                newItem.countSubtotal = undefined;
            }

            // Disable even items if enabled
            if (disableEvenItems && item.count % 2 === 0) {
                newItem.disabled = true;
            } else {
                newItem.disabled = false;
            }

            // Toggle context menus
            newItem.contextMenu = { ...item.contextMenu, disabled: !enableContextMenus };

            return newItem;
        });
    }, [hasSubTotal, disableEvenItems, enableContextMenus]);

    const handleSelectedItemsChange = useCallback(
        (ids: Set<ListogramItemId>) => {
            // Filter out disabled items from selection
            const filteredIds = new Set<ListogramItemId>();
            ids.forEach(id => {
                const item = items.find(i => i.id === id);
                if (item && !item.disabled) {
                    filteredIds.add(id);
                }
            });
            setSelectedItemIds(filteredIds);
        },
        [items],
    );

    const handleSelectionKindChange = useCallback(
        (newSelectionKind: ListogramSelectionKind) => {
            if (newSelectionKind === ListogramSelectionKind.SINGLE) {
                // Trim down to just first item in selected set
                const firstSelectedItemId = selectedItemIds.values().next().value;
                const newSelection = new Set<ListogramItemId>();
                if (firstSelectedItemId !== undefined) {
                    newSelection.add(firstSelectedItemId);
                }
                setSelectedItemIds(newSelection);
            }
            setSelectionKind(newSelectionKind);
        },
        [selectedItemIds],
    );

    const toggleShowSelectionToggles = handleBooleanChange(setShowSelectionToggles);
    const toggleCountTotal = handleBooleanChange(setHasCountTotal);
    const toggleHasVisibleItemLimit = handleBooleanChange(setHasVisibleItemLimit);
    const toggleSubTotal = handleBooleanChange(setHasSubTotal);
    const toggleSelectionDrawer = handleBooleanChange(setEnableSelectionDrawer);
    const toggleSorting = handleBooleanChange(setEnableSorts);
    const toggleShowBars = handleBooleanChange(setShowBars);
    const toggleDisableEvenItems = handleBooleanChange(setDisableEvenItems);
    const toggleEnableContextMenus = handleBooleanChange(setEnableContextMenus);
    const toggleShouldDismissPopoverOnItemClick = handleBooleanChange(setItemShouldDismissPopover);
    const handleDefaultSelectionModeChange = handleValueChange(setDefaultSelectionMode);

    const openPopover = useCallback(() => setIsPopoverOpen(true), []);
    const closePopover = useCallback(() => setIsPopoverOpen(false), []);

    const listogramProps = {
        defaultSelectionMode,
        enableSelectionDrawer,
        enableSorts,
        itemShouldDismissPopover,
        items,
        selectedItemIds,
        selectionKind,
        showBars,
        showSelectionToggles,
    };

    const options = (
        <>
            <H5>Props</H5>
            <Switch checked={hasSubTotal} label="Show sub totals" onChange={toggleSubTotal} />
            <Switch
                checked={enableSelectionDrawer}
                label="Enable selection drawer"
                onChange={toggleSelectionDrawer}
            />
            <Switch checked={enableSorts} label="Enable sorting" onChange={toggleSorting} />
            <Switch
                checked={showSelectionToggles}
                label="Show selection as toggles"
                onChange={toggleShowSelectionToggles}
            />
            <Switch
                checked={hasCountTotal}
                label="Set countTotal to 10"
                onChange={toggleCountTotal}
            />
            <Switch checked={showBars} label="Show bars" onChange={toggleShowBars} />
            <Switch
                checked={itemShouldDismissPopover}
                label="Should item click dismiss popover"
                onChange={toggleShouldDismissPopoverOnItemClick}
            />
            <Switch
                checked={hasVisibleItemLimit}
                label="Set visible item limit to 4"
                onChange={toggleHasVisibleItemLimit}
            />
            <FormGroup label="Selection interaction kind">
                <HTMLSelect
                    value={selectionKind}
                    onChange={handleValueChange(handleSelectionKindChange)}
                    options={SELECTION_KINDS}
                />
            </FormGroup>
            <FormGroup label="Default selection mode">
                <HTMLSelect
                    disabled={selectionKind === ListogramSelectionKind.SINGLE}
                    options={[ListogramSelectionMode.KEEPING, ListogramSelectionMode.EXCLUDING]}
                    onChange={handleDefaultSelectionModeChange}
                    value={defaultSelectionMode}
                />
            </FormGroup>
            <H5>Items</H5>
            <Switch
                checked={enableContextMenus}
                label="Enable context menus"
                onChange={toggleEnableContextMenus}
            />
            <Switch
                checked={disableEvenItems}
                label="Disable items with even counts"
                onChange={toggleDisableEvenItems}
            />
        </>
    );

    return (
        <Example options={options} {...props}>
            <Listogram
                {...listogramProps}
                className="docs-listogram-example"
                countTotal={hasCountTotal ? 10 : undefined}
                onSelectionChange={handleSelectedItemsChange}
                title="Fruits"
                visibleItemLimit={hasVisibleItemLimit ? 4 : undefined}
            />
            <br />
            <Popover
                isOpen={isPopoverOpen}
                minimal={true}
                content={
                    <Listogram
                        {...listogramProps}
                        className="docs-listogram-example"
                        countTotal={hasCountTotal ? 10 : undefined}
                        onSelectionChange={handleSelectedItemsChange}
                        title="Fruits"
                        visibleItemLimit={hasVisibleItemLimit ? 4 : undefined}
                    />
                }
                onClose={closePopover}
            >
                <Button text="Select fruits" rightIcon={<ChevronDown />} onClick={openPopover} />
            </Popover>
        </Example>
    );
};
