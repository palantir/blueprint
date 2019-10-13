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

import { AbstractComponent2, DISPLAYNAME_PREFIX, IProps, Keys, Menu, Utils } from "@blueprintjs/core";
import {
    executeItemsEqual,
    getActiveItem,
    getCreateNewItem,
    ICreateNewItem,
    IItemListRendererProps,
    IItemModifiers,
    IListItemsProps,
    isCreateNewItem,
    renderFilteredItems,
} from "../../common";

export interface IQueryListProps<T> extends IListItemsProps<T> {
    /**
     * Callback invoked when user presses a key, after processing `QueryList`'s own key events
     * (up/down to navigate active item). This callback is passed to `renderer` and (along with
     * `onKeyUp`) can be attached to arbitrary content elements to support keyboard selection.
     */
    onKeyDown?: React.KeyboardEventHandler<HTMLElement>;

    /**
     * Callback invoked when user releases a key, after processing `QueryList`'s own key events
     * (enter to select active item). This callback is passed to `renderer` and (along with
     * `onKeyDown`) can be attached to arbitrary content elements to support keyboard selection.
     */
    onKeyUp?: React.KeyboardEventHandler<HTMLElement>;

    /**
     * Customize rendering of the component.
     * Receives an object with props that should be applied to elements as necessary.
     */
    renderer: (listProps: IQueryListRendererProps<T>) => JSX.Element;

    /**
     * Whether the list is disabled.
     * @default false
     */
    disabled?: boolean;
}

/**
 * An object describing how to render a `QueryList`.
 * A `QueryList` `renderer` receives this object as its sole argument.
 */
export interface IQueryListRendererProps<T>  // Omit `createNewItem`, because it's used strictly for internal tracking.
    extends Pick<IQueryListState<T>, "activeItem" | "filteredItems" | "query">,
        IProps {
    /**
     * Selection handler that should be invoked when a new item has been chosen,
     * perhaps because the user clicked it.
     */
    handleItemSelect: (item: T, event?: React.SyntheticEvent<HTMLElement>) => void;

    /**
     * Handler that should be invoked when the user pastes one or more values.
     *
     * This callback will use `itemPredicate` with `exactMatch=true` to find a
     * subset of `items` exactly matching the pasted `values` provided, then it
     * will invoke `onItemsPaste` with those found items. Each pasted value that
     * does not exactly match an item will be ignored.
     *
     * If creating items is enabled (by providing both `createNewItemFromQuery`
     * and `createNewItemRenderer`), then pasted values that do not exactly
     * match an existing item will emit a new item as created via
     * `createNewItemFromQuery`.
     *
     * If `itemPredicate` returns multiple matching items for a particular query
     * in `queries`, then only the first matching item will be emitted.
     */
    handlePaste: (queries: string[]) => void;

    /**
     * Keyboard handler for up/down arrow keys to shift the active item.
     * Attach this handler to any element that should support this interaction.
     */
    handleKeyDown: React.KeyboardEventHandler<HTMLElement>;

    /**
     * Keyboard handler for enter key to select the active item.
     * Attach this handler to any element that should support this interaction.
     */
    handleKeyUp: React.KeyboardEventHandler<HTMLElement>;

    /**
     * Change handler for query string. Attach this to an input element to allow
     * `QueryList` to control the query.
     */
    handleQueryChange: React.ChangeEventHandler<HTMLInputElement>;

    /** Rendered elements returned from `itemListRenderer` prop. */
    itemList: React.ReactNode;
}

export interface IQueryListState<T> {
    /** The currently focused item (for keyboard interactions). */
    activeItem: T | ICreateNewItem | null;

    /**
     * The item returned from `createNewItemFromQuery(this.state.query)`, cached
     * to avoid continuous reinstantions within `isCreateItemRendered`, where
     * this element will be used to hide the "Create Item" option if its value
     * matches the current `query`.
     */
    createNewItem: T | undefined;

    /** The original `items` array filtered by `itemListPredicate` or `itemPredicate`. */
    filteredItems: T[];

    /** The current query string. */
    query: string;
}

export class QueryList<T> extends AbstractComponent2<IQueryListProps<T>, IQueryListState<T>> {
    public static displayName = `${DISPLAYNAME_PREFIX}.QueryList`;

    public static defaultProps = {
        disabled: false,
        resetOnQuery: true,
    };

    public static ofType<T>() {
        return QueryList as new (props: IQueryListProps<T>) => QueryList<T>;
    }

    private itemsParentRef?: HTMLElement | null;
    private refHandlers = {
        itemsParent: (ref: HTMLElement | null) => (this.itemsParentRef = ref),
    };

    /**
     * Flag indicating that we should check whether selected item is in viewport
     * after rendering, typically because of keyboard change. Set to `true` when
     * manipulating state in a way that may cause active item to scroll away.
     */
    private shouldCheckActiveItemInViewport = false;

    /**
     * The item that we expect to be the next selected active item (based on click
     * or key interactions). When scrollToActiveItem = false, used to detect if
     * an unexpected external change to the active item has been made.
     */
    private expectedNextActiveItem: T | ICreateNewItem | null = null;

    public constructor(props: IQueryListProps<T>, context?: any) {
        super(props, context);

        const { query = "" } = props;
        const createNewItem = Utils.safeInvoke(props.createNewItemFromQuery, query);
        const filteredItems = getFilteredItems(query, props);

        this.state = {
            activeItem:
                props.activeItem !== undefined
                    ? props.activeItem
                    : getFirstEnabledItem(filteredItems, props.itemDisabled),
            createNewItem,
            filteredItems,
            query,
        };
    }

    public render() {
        const { className, items, renderer, itemListRenderer = this.renderItemList } = this.props;
        const { createNewItem, ...spreadableState } = this.state;
        return renderer({
            ...spreadableState,
            className,
            handleItemSelect: this.handleItemSelect,
            handleKeyDown: this.handleKeyDown,
            handleKeyUp: this.handleKeyUp,
            handlePaste: this.handlePaste,
            handleQueryChange: this.handleQueryChange,
            itemList: itemListRenderer({
                ...spreadableState,
                items,
                itemsParentRef: this.refHandlers.itemsParent,
                renderItem: this.renderItem,
            }),
        });
    }

    public componentDidUpdate(prevProps: IQueryListProps<T>) {
        if (this.props.activeItem !== undefined && this.props.activeItem !== this.state.activeItem) {
            this.shouldCheckActiveItemInViewport = true;
            this.setState({ activeItem: this.props.activeItem });
        }

        if (this.props.query != null && this.props.query !== prevProps.query) {
            // new query
            this.setQuery(this.props.query, this.props.resetOnQuery, this.props);
        } else if (
            // same query (or uncontrolled query), but items in the list changed
            !Utils.shallowCompareKeys(this.props, prevProps, {
                include: ["items", "itemListPredicate", "itemPredicate"],
            })
        ) {
            this.setQuery(this.state.query);
        }

        if (this.shouldCheckActiveItemInViewport) {
            // update scroll position immediately before repaint so DOM is accurate
            // (latest filteredItems) and to avoid flicker.
            requestAnimationFrame(() => this.scrollActiveItemIntoView());
            // reset the flag
            this.shouldCheckActiveItemInViewport = false;
        }
    }

    public scrollActiveItemIntoView() {
        const scrollToActiveItem = this.props.scrollToActiveItem !== false;
        const externalChangeToActiveItem = !executeItemsEqual(
            this.props.itemsEqual,
            getActiveItem(this.expectedNextActiveItem),
            getActiveItem(this.props.activeItem),
        );
        this.expectedNextActiveItem = null;

        if (!scrollToActiveItem && externalChangeToActiveItem) {
            return;
        }

        const activeElement = this.getActiveElement();
        if (this.itemsParentRef != null && activeElement != null) {
            const { offsetTop: activeTop, offsetHeight: activeHeight } = activeElement;
            const {
                offsetTop: parentOffsetTop,
                scrollTop: parentScrollTop,
                clientHeight: parentHeight,
            } = this.itemsParentRef;
            // compute padding on parent element to ensure we always leave space
            const { paddingTop, paddingBottom } = this.getItemsParentPadding();

            // compute the two edges of the active item for comparison, including parent padding
            const activeBottomEdge = activeTop + activeHeight + paddingBottom - parentOffsetTop;
            const activeTopEdge = activeTop - paddingTop - parentOffsetTop;

            if (activeBottomEdge >= parentScrollTop + parentHeight) {
                // offscreen bottom: align bottom of item with bottom of viewport
                this.itemsParentRef.scrollTop = activeBottomEdge + activeHeight - parentHeight;
            } else if (activeTopEdge <= parentScrollTop) {
                // offscreen top: align top of item with top of viewport
                this.itemsParentRef.scrollTop = activeTopEdge - activeHeight;
            }
        }
    }

    public setQuery(query: string, resetActiveItem = this.props.resetOnQuery, props = this.props) {
        const { createNewItemFromQuery } = props;

        this.shouldCheckActiveItemInViewport = true;
        const hasQueryChanged = query !== this.state.query;
        if (hasQueryChanged) {
            Utils.safeInvoke(props.onQueryChange, query);
        }

        const filteredItems = getFilteredItems(query, props);
        const createNewItem =
            createNewItemFromQuery != null && query !== "" ? createNewItemFromQuery(query) : undefined;
        this.setState({ createNewItem, filteredItems, query });

        // always reset active item if it's now filtered or disabled
        const activeIndex = this.getActiveIndex(filteredItems);
        const shouldUpdateActiveItem =
            resetActiveItem ||
            activeIndex < 0 ||
            isItemDisabled(getActiveItem(this.state.activeItem), activeIndex, props.itemDisabled);

        if (shouldUpdateActiveItem) {
            this.setActiveItem(getFirstEnabledItem(filteredItems, props.itemDisabled));
        }
    }

    /** default `itemListRenderer` implementation */
    private renderItemList = (listProps: IItemListRendererProps<T>) => {
        const { initialContent, noResults } = this.props;

        // omit noResults if createNewItemFromQuery and createNewItemRenderer are both supplied, and query is not empty
        const maybeNoResults = this.isCreateItemRendered() ? null : noResults;
        const menuContent = renderFilteredItems(listProps, maybeNoResults, initialContent);
        const createItemView = this.isCreateItemRendered() ? this.renderCreateItemMenuItem(this.state.query) : null;
        if (menuContent == null && createItemView == null) {
            return null;
        }
        return (
            <Menu ulRef={listProps.itemsParentRef}>
                {menuContent}
                {createItemView}
            </Menu>
        );
    };

    /** wrapper around `itemRenderer` to inject props */
    private renderItem = (item: T, index: number) => {
        if (this.props.disabled !== true) {
            const { activeItem, query } = this.state;
            const matchesPredicate = this.state.filteredItems.indexOf(item) >= 0;
            const modifiers: IItemModifiers = {
                active: executeItemsEqual(this.props.itemsEqual, getActiveItem(activeItem), item),
                disabled: isItemDisabled(item, index, this.props.itemDisabled),
                matchesPredicate,
            };
            return this.props.itemRenderer(item, {
                handleClick: e => this.handleItemSelect(item, e),
                index,
                modifiers,
                query,
            });
        }

        return null;
    };

    private renderCreateItemMenuItem = (query: string) => {
        const { activeItem } = this.state;
        const handleClick: React.MouseEventHandler<HTMLElement> = evt => {
            this.handleItemCreate(query, evt);
        };
        const isActive = isCreateNewItem(activeItem);
        return Utils.safeInvoke(this.props.createNewItemRenderer, query, isActive, handleClick);
    };

    private getActiveElement() {
        const { activeItem } = this.state;
        if (this.itemsParentRef != null) {
            if (isCreateNewItem(activeItem)) {
                return this.itemsParentRef.children.item(this.state.filteredItems.length) as HTMLElement;
            } else {
                const activeIndex = this.getActiveIndex();
                return this.itemsParentRef.children.item(activeIndex) as HTMLElement;
            }
        }
        return undefined;
    }

    private getActiveIndex(items = this.state.filteredItems) {
        const { activeItem } = this.state;
        if (activeItem == null || isCreateNewItem(activeItem)) {
            return -1;
        }
        // NOTE: this operation is O(n) so it should be avoided in render(). safe for events though.
        for (let i = 0; i < items.length; ++i) {
            if (executeItemsEqual(this.props.itemsEqual, items[i], activeItem)) {
                return i;
            }
        }
        return -1;
    }

    private getItemsParentPadding() {
        // assert ref exists because it was checked before calling
        const { paddingTop, paddingBottom } = getComputedStyle(this.itemsParentRef!);
        return {
            paddingBottom: pxToNumber(paddingBottom),
            paddingTop: pxToNumber(paddingTop),
        };
    }

    private handleItemCreate = (query: string, evt?: React.SyntheticEvent<HTMLElement>) => {
        // we keep a cached createNewItem in state, but might as well recompute
        // the result just to be sure it's perfectly in sync with the query.
        const item = Utils.safeInvoke(this.props.createNewItemFromQuery, query);
        if (item != null) {
            Utils.safeInvoke(this.props.onItemSelect, item, evt);
            this.setQuery("", true);
        }
    };

    private handleItemSelect = (item: T, event?: React.SyntheticEvent<HTMLElement>) => {
        this.setActiveItem(item);
        Utils.safeInvoke(this.props.onItemSelect, item, event);
        if (this.props.resetOnSelect) {
            this.setQuery("", true);
        }
    };

    private handlePaste = (queries: string[]) => {
        const { createNewItemFromQuery, onItemsPaste } = this.props;

        let nextActiveItem: T | undefined;
        const nextQueries = [];

        // Find an exising item that exactly matches each pasted value, or
        // create a new item if possible. Ignore unmatched values if creating
        // items is disabled.
        const pastedItemsToEmit = [];

        for (const query of queries) {
            const equalItem = getMatchingItem(query, this.props);

            if (equalItem !== undefined) {
                nextActiveItem = equalItem;
                pastedItemsToEmit.push(equalItem);
            } else if (this.canCreateItems()) {
                const newItem = Utils.safeInvoke(createNewItemFromQuery, query);
                if (newItem !== undefined) {
                    pastedItemsToEmit.push(newItem);
                }
            } else {
                nextQueries.push(query);
            }
        }

        // UX nicety: combine all unmatched queries into a single
        // comma-separated query in the input, so we don't lose any information.
        // And don't reset the active item; we'll do that ourselves below.
        this.setQuery(nextQueries.join(", "), false);

        // UX nicety: update the active item if we matched with at least one
        // existing item.
        if (nextActiveItem !== undefined) {
            this.setActiveItem(nextActiveItem);
        }

        Utils.safeInvoke(onItemsPaste, pastedItemsToEmit);
    };

    private handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        const { keyCode } = event;
        if (keyCode === Keys.ARROW_UP || keyCode === Keys.ARROW_DOWN) {
            event.preventDefault();
            const nextActiveItem = this.getNextActiveItem(keyCode === Keys.ARROW_UP ? -1 : 1);
            if (nextActiveItem != null) {
                this.setActiveItem(nextActiveItem);
            }
        }
        Utils.safeInvoke(this.props.onKeyDown, event);
    };

    private handleKeyUp = (event: React.KeyboardEvent<HTMLElement>) => {
        const { onKeyUp } = this.props;
        const { activeItem } = this.state;
        // using keyup for enter to play nice with Button's keyboard clicking.
        // if we were to process enter on keydown, then Button would click itself on keyup
        // and the popvoer would re-open out of our control :(.
        if (event.keyCode === Keys.ENTER) {
            event.preventDefault();
            if (activeItem == null || isCreateNewItem(activeItem)) {
                this.handleItemCreate(this.state.query, event);
            } else {
                this.handleItemSelect(activeItem, event);
            }
        }
        Utils.safeInvoke(onKeyUp, event);
    };

    private handleQueryChange = (event?: React.ChangeEvent<HTMLInputElement>) => {
        const query = event == null ? "" : event.target.value;
        this.setQuery(query);
        Utils.safeInvoke(this.props.onQueryChange, query, event);
    };

    /**
     * Get the next enabled item, moving in the given direction from the start
     * index. A `null` return value means no suitable item was found.
     * @param direction amount to move in each iteration, typically +/-1
     * @param startIndex item to start iteration
     */
    private getNextActiveItem(direction: number, startIndex = this.getActiveIndex()): T | ICreateNewItem | null {
        if (this.isCreateItemRendered()) {
            const reachedCreate =
                (startIndex === 0 && direction === -1) ||
                (startIndex === this.state.filteredItems.length - 1 && direction === 1);
            if (reachedCreate) {
                return getCreateNewItem();
            }
        }
        return getFirstEnabledItem(this.state.filteredItems, this.props.itemDisabled, direction, startIndex);
    }

    private setActiveItem(activeItem: T | ICreateNewItem | null) {
        this.expectedNextActiveItem = activeItem;
        if (this.props.activeItem === undefined) {
            // indicate that the active item may need to be scrolled into view after update.
            this.shouldCheckActiveItemInViewport = true;
            this.setState({ activeItem });
        }

        if (isCreateNewItem(activeItem)) {
            Utils.safeInvoke(this.props.onActiveItemChange, null, true);
        } else {
            Utils.safeInvoke(this.props.onActiveItemChange, activeItem, false);
        }
    }

    private isCreateItemRendered(): boolean {
        return (
            this.canCreateItems() &&
            this.state.query !== "" &&
            // this check is unfortunately O(N) on the number of items, but
            // alas, hiding the "Create Item" option when it exactly matches an
            // existing item is much clearer.
            !this.wouldCreatedItemMatchSomeExistingItem()
        );
    }

    private canCreateItems(): boolean {
        return this.props.createNewItemFromQuery != null && this.props.createNewItemRenderer != null;
    }

    private wouldCreatedItemMatchSomeExistingItem() {
        // search only the filtered items, not the full items list, because we
        // only need to check items that match the current query.
        return this.state.filteredItems.some(item =>
            executeItemsEqual(this.props.itemsEqual, item, this.state.createNewItem),
        );
    }
}

function pxToNumber(value: string | null) {
    return value == null ? 0 : parseInt(value.slice(0, -2), 10);
}

function getMatchingItem<T>(query: string, { items, itemPredicate }: IQueryListProps<T>): T | undefined {
    if (Utils.isFunction(itemPredicate)) {
        // .find() doesn't exist in ES5. Alternative: use a for loop instead of
        // .filter() so that we can return as soon as we find the first match.
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (itemPredicate(query, item, i, true)) {
                return item;
            }
        }
    }
    return undefined;
}

function getFilteredItems<T>(query: string, { items, itemPredicate, itemListPredicate }: IQueryListProps<T>) {
    if (Utils.isFunction(itemListPredicate)) {
        // note that implementations can reorder the items here
        return itemListPredicate(query, items);
    } else if (Utils.isFunction(itemPredicate)) {
        return items.filter((item, index) => itemPredicate(query, item, index));
    }
    return items;
}

/** Wrap number around min/max values: if it exceeds one bound, return the other. */
function wrapNumber(value: number, min: number, max: number) {
    if (value < min) {
        return max;
    } else if (value > max) {
        return min;
    }
    return value;
}

function isItemDisabled<T>(item: T | null, index: number, itemDisabled?: IListItemsProps<T>["itemDisabled"]) {
    if (itemDisabled == null || item == null) {
        return false;
    } else if (Utils.isFunction(itemDisabled)) {
        return itemDisabled(item, index);
    }
    return !!item[itemDisabled];
}

/**
 * Get the next enabled item, moving in the given direction from the start
 * index. A `null` return value means no suitable item was found.
 * @param items the list of items
 * @param itemDisabled callback to determine if a given item is disabled
 * @param direction amount to move in each iteration, typically +/-1
 * @param startIndex which index to begin moving from
 */
export function getFirstEnabledItem<T>(
    items: T[],
    itemDisabled?: keyof T | ((item: T, index: number) => boolean),
    direction = 1,
    startIndex = items.length - 1,
): T | ICreateNewItem | null {
    if (items.length === 0) {
        return null;
    }
    // remember where we started to prevent an infinite loop
    let index = startIndex;
    const maxIndex = items.length - 1;
    do {
        // find first non-disabled item
        index = wrapNumber(index + direction, 0, maxIndex);
        if (!isItemDisabled(items[index], index, itemDisabled)) {
            return items[index];
        }
    } while (index !== startIndex && startIndex !== -1);
    return null;
}
