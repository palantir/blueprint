/*
* Copyright 2018 Palantir Technologies, Inc. All rights reserved.
*
* Licensed under the terms of the LICENSE file distributed with this project.
*/

import { IProps } from "@blueprintjs/core";
import { ItemListRenderer } from "./itemListRenderer";
import { ItemRenderer } from "./itemRenderer";
import { ItemListPredicate, ItemPredicate } from "./predicate";

/** Reusable generic props for a component that operates on a filterable, selectable list of `items`. */
export interface IListItemsProps<T> extends IProps {
    /**
     * The currently focused item for keyboard interactions, or `null` to
     * indicate that no item is active. If omitted, this prop will be
     * uncontrolled (managed by the component's state). Use `onActiveItemChange`
     * to listen for updates.
     */
    activeItem?: T | null;

    /** Array of items in the list. */
    items: T[];

    /**
     * Determine if the given item is disabled. Provide a callback function, or
     * simply provide the name of a boolean property on the item that exposes
     * its disabled state.
     */
    itemDisabled?: keyof T | ((item: T, index: number) => boolean);

    /**
     * Customize querying of entire `items` array. Return new list of items.
     * This method can reorder, add, or remove items at will.
     * (Supports filter algorithms that operate on the entire set, rather than individual items.)
     *
     * If `itemPredicate` is also defined, this prop takes priority and the other will be ignored.
     */
    itemListPredicate?: ItemListPredicate<T>;

    /**
     * Customize querying of individual items. Return `true` to keep the item, `false` to hide.
     * This method will be invoked once for each item, so it should be performant. For more complex
     * queries, use `itemListPredicate` to operate once on the entire array.
     *
     * This prop is ignored if `itemListPredicate` is also defined.
     */
    itemPredicate?: ItemPredicate<T>;

    /**
     * Custom renderer for an item in the dropdown list. Receives a boolean indicating whether
     * this item is active (selected by keyboard arrows) and an `onClick` event handler that
     * should be attached to the returned element.
     */
    itemRenderer: ItemRenderer<T>;

    /**
     * Custom renderer for the contents of the dropdown.
     *
     * The default implementation invokes `itemRenderer` for each item that passes the predicate
     * and wraps them all in a `Menu` element. If the query is empty then `initialContent` is returned,
     * and if there are no items that match the predicate then `noResults` is returned.
     */
    itemListRenderer?: ItemListRenderer<T>;

    /**
     * React content to render when query is empty.
     * If omitted, all items will be rendered (or result of `itemListPredicate` with empty query).
     * If explicit `null`, nothing will be rendered when query is empty.
     *
     * This prop is ignored if a custom `itemListRenderer` is supplied.
     */
    initialContent?: React.ReactNode | null;

    /**
     * React content to render when filtering items returns zero results.
     * If omitted, nothing will be rendered in this case.
     *
     * This prop is ignored if a custom `itemListRenderer` is supplied.
     */
    noResults?: React.ReactNode;

    /**
     * Invoked when user interaction should change the active item: arrow keys move it up/down
     * in the list, selecting an item makes it active, and changing the query may reset it to
     * the first item in the list if it no longer matches the filter.
     */
    onActiveItemChange?: (activeItem: T | null) => void;

    /**
     * Callback invoked when an item from the list is selected,
     * typically by clicking or pressing `enter` key.
     */
    onItemSelect: (item: T, event?: React.SyntheticEvent<HTMLElement>) => void;

    /**
     * Callback invoked when the query string changes.
     */
    onQueryChange?: (query: string, event?: React.ChangeEvent<HTMLInputElement>) => void;

    /**
     * Whether the active item should be reset to the first matching item _every
     * time the query changes_ (via prop or by user input).
     * @default true
     */
    resetOnQuery?: boolean;

    /**
     * Whether the active item should be reset to the first matching item _when
     * an item is selected_. The query will also be reset to the empty string.
     * @default false
     */
    resetOnSelect?: boolean;

    /**
     * Query string passed to `itemListPredicate` or `itemPredicate` to filter items.
     * This value is controlled: its state must be managed externally by attaching an `onChange`
     * handler to the relevant element in your `renderer` implementation.
     */
    query?: string;
}
