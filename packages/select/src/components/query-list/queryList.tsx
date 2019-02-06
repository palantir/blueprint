/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { DISPLAYNAME_PREFIX, IProps, Keys, Menu, Utils } from "@blueprintjs/core";
import {
    executeItemsEqual,
    IItemListRendererProps,
    IItemModifiers,
    IListItemsProps,
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
}

/**
 * An object describing how to render a `QueryList`.
 * A `QueryList` `renderer` receives this object as its sole argument.
 */
export interface IQueryListRendererProps<T> extends IQueryListState<T>, IProps {
    /**
     * Selection handler that should be invoked when a new item has been chosen,
     * perhaps because the user clicked it.
     */
    handleItemSelect: (item: T, event?: React.SyntheticEvent<HTMLElement>) => void;

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
    activeItem: T | null;

    /** The original `items` array filtered by `itemListPredicate` or `itemPredicate`. */
    filteredItems: T[];

    /** The current query string. */
    query: string;
}

export class QueryList<T> extends React.Component<IQueryListProps<T>, IQueryListState<T>> {
    public static displayName = `${DISPLAYNAME_PREFIX}.QueryList`;

    public static defaultProps = {
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
    private expectedNextActiveItem: T | null = null;

    public constructor(props: IQueryListProps<T>, context?: any) {
        super(props, context);
        const { query = "" } = this.props;
        const filteredItems = getFilteredItems(query, this.props);
        this.state = {
            activeItem:
                this.props.activeItem !== undefined
                    ? this.props.activeItem
                    : getFirstEnabledItem(filteredItems, this.props.itemDisabled),
            filteredItems,
            query,
        };
    }

    public render() {
        const { className, items, renderer, itemListRenderer = this.renderItemList } = this.props;
        return renderer({
            ...this.state,
            className,
            handleItemSelect: this.handleItemSelect,
            handleKeyDown: this.handleKeyDown,
            handleKeyUp: this.handleKeyUp,
            handleQueryChange: this.handleQueryChange,
            itemList: itemListRenderer({
                ...this.state,
                items,
                itemsParentRef: this.refHandlers.itemsParent,
                renderItem: this.renderItem,
            }),
        });
    }

    public componentWillReceiveProps(nextProps: IQueryListProps<T>) {
        if (nextProps.activeItem !== undefined) {
            this.shouldCheckActiveItemInViewport = true;
            this.setState({ activeItem: nextProps.activeItem });
        }
        if (nextProps.query != null) {
            this.setQuery(nextProps.query, nextProps.resetOnQuery, nextProps);
        }
    }

    public componentDidUpdate(prevProps: IQueryListProps<T>) {
        if (
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
            this.expectedNextActiveItem,
            this.props.activeItem,
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
        this.shouldCheckActiveItemInViewport = true;
        const hasQueryChanged = query !== this.state.query;
        if (hasQueryChanged) {
            Utils.safeInvoke(props.onQueryChange, query);
        }

        const filteredItems = getFilteredItems(query, props);
        this.setState({ filteredItems, query });

        // always reset active item if it's now filtered or disabled
        const activeIndex = this.getActiveIndex(filteredItems);
        const shouldUpdateActiveItem =
            resetActiveItem ||
            activeIndex < 0 ||
            // non-null assertion is safe because activeItem exists and was found in filteredItems
            // (guaranteed because activeIndex >=0 here)
            isItemDisabled(this.state.activeItem!, activeIndex, props.itemDisabled);

        if (hasQueryChanged && shouldUpdateActiveItem) {
            this.setActiveItem(getFirstEnabledItem(filteredItems, props.itemDisabled));
        }
    }

    /** default `itemListRenderer` implementation */
    private renderItemList = (listProps: IItemListRendererProps<T>) => {
        const { initialContent, noResults } = this.props;
        const menuContent = renderFilteredItems(listProps, noResults, initialContent);
        return <Menu ulRef={listProps.itemsParentRef}>{menuContent}</Menu>;
    };

    /** wrapper around `itemRenderer` to inject props */
    private renderItem = (item: T, index: number) => {
        const { activeItem, query } = this.state;
        const matchesPredicate = this.state.filteredItems.indexOf(item) >= 0;
        const modifiers: IItemModifiers = {
            active: executeItemsEqual(this.props.itemsEqual, activeItem, item),
            disabled: isItemDisabled(item, index, this.props.itemDisabled),
            matchesPredicate,
        };
        return this.props.itemRenderer(item, {
            handleClick: e => this.handleItemSelect(item, e),
            index,
            modifiers,
            query,
        });
    };

    private getActiveElement() {
        if (this.itemsParentRef != null) {
            return this.itemsParentRef.children.item(this.getActiveIndex()) as HTMLElement;
        }
        return undefined;
    }

    private getActiveIndex(items = this.state.filteredItems) {
        const { activeItem } = this.state;
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

    private handleItemSelect = (item: T, event?: React.SyntheticEvent<HTMLElement>) => {
        this.setActiveItem(item);
        Utils.safeInvoke(this.props.onItemSelect, item, event);
        if (this.props.resetOnSelect) {
            this.setQuery("", true);
        }
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
        if (event.keyCode === Keys.ENTER && activeItem != null) {
            event.preventDefault();
            this.handleItemSelect(activeItem, event);
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
     */
    private getNextActiveItem(direction: number, startIndex = this.getActiveIndex()): T | null {
        return getFirstEnabledItem(this.state.filteredItems, this.props.itemDisabled, direction, startIndex);
    }

    private setActiveItem(activeItem: T | null) {
        this.expectedNextActiveItem = activeItem;
        if (this.props.activeItem === undefined) {
            // indicate that the active item may need to be scrolled into view after update.
            this.shouldCheckActiveItemInViewport = true;
            this.setState({ activeItem });
        }
        Utils.safeInvoke(this.props.onActiveItemChange, activeItem);
    }
}

function pxToNumber(value: string | null) {
    return value == null ? 0 : parseInt(value.slice(0, -2), 10);
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
 * @param isItemDisabled callback to determine if a given item is disabled
 * @param direction amount to move in each iteration, typically +/-1
 * @param startIndex which index to begin moving from
 */
export function getFirstEnabledItem<T>(
    items: T[],
    itemDisabled?: keyof T | ((item: T, index: number) => boolean),
    direction = 1,
    startIndex = items.length - 1,
): T | null {
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
    } while (index !== startIndex);
    return null;
}
