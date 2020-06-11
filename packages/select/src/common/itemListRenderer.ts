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

import { ICreateNewItem } from "./listItemsUtils";

/**
 * An object describing how to render the list of items.
 * An `itemListRenderer` receives this object as its sole argument.
 */
export interface IItemListRendererProps<T> {
    /**
     * The currently focused item (for keyboard interactions), or `null` to
     * indicate that no item is active.
     */
    activeItem: T | ICreateNewItem | null;

    /**
     * Array of items filtered by `itemListPredicate` or `itemPredicate`.
     * See `items` for the full list of items.
     *
     * Use `renderFilteredItems()` utility function from this library to
     * map each item in this array through `renderItem`, with support for
     * optional `noResults` and `initialContent` states.
     */
    filteredItems: T[];

    /**
     * Array of all items in the list.
     * See `filteredItems` for a filtered array based on `query` and predicate props.
     */
    items: T[];

    /**
     * The current query string.
     */
    query: string;

    /**
     * A ref handler that should be attached to the parent HTML element of the menu items.
     * This is required for the active item to scroll into view automatically.
     */
    itemsParentRef: (ref: HTMLElement | null) => void;

    /**
     * Call this function to render an item.
     * This retrieves the modifiers for the item and delegates actual rendering
     * to the owner component's `itemRenderer` prop.
     */
    renderItem: (item: T, index: number) => JSX.Element | null;
}

/** Type alias for a function that renders the list of items. */
export type ItemListRenderer<T> = (itemListProps: IItemListRendererProps<T>) => JSX.Element | null;

/**
 * `ItemListRenderer` helper method for rendering each item in `filteredItems`,
 * with optional support for `noResults` (when filtered items is empty)
 * and `initialContent` (when query is empty).
 */
export function renderFilteredItems(
    props: IItemListRendererProps<any>,
    noResults?: React.ReactNode,
    initialContent?: React.ReactNode | null,
): React.ReactNode {
    if (props.query.length === 0 && initialContent !== undefined) {
        return initialContent;
    }
    const items = props.filteredItems.map(props.renderItem).filter(item => item != null);
    return items.length > 0 ? items : noResults;
}
