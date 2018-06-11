/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { IProps, Keys, Menu, Utils } from "@blueprintjs/core";
import { IItemListRendererProps, IItemModifiers, IListItemsProps, renderFilteredItems } from "../../common";

export interface IQueryListProps<T> extends IListItemsProps<T> {
    /**
     * The active item is the current keyboard-focused element.
     * Listen to `onActiveItemChange` for updates from interactions.
     */
    activeItem: T | undefined;

    /**
     * Invoked when user interaction should change the active item: arrow keys move it up/down
     * in the list, selecting an item makes it active, and changing the query may reset it to
     * the first item in the list if it no longer matches the filter.
     */
    onActiveItemChange: (activeItem: T | undefined) => void;

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
     * Query string passed to `itemListPredicate` or `itemPredicate` to filter items.
     * This value is controlled: its state must be managed externally by attaching an `onChange`
     * handler to the relevant element in your `renderer` implementation.
     */
    query: string;
}

/**
 * An object describing how to render a `QueryList`.
 * A `QueryList` `renderer` receives this object as its sole argument.
 */
export interface IQueryListRendererProps<T> extends IProps {
    /**
     * Array of items filtered by `itemListPredicate` or `itemPredicate`.
     */
    filteredItems: T[];

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

    /** Rendered elements returned from `itemListRenderer` prop. */
    itemList: React.ReactNode;

    /** The current query string. */
    query: string;
}

export interface IQueryListState<T> {
    filteredItems: T[];
}

export class QueryList<T> extends React.Component<IQueryListProps<T>, IQueryListState<T>> {
    public static displayName = "Blueprint2.QueryList";

    public static ofType<T>() {
        return QueryList as new (props: IQueryListProps<T>) => QueryList<T>;
    }

    private itemsParentRef?: HTMLElement | null;
    private refHandlers = {
        itemsParent: (ref: HTMLElement | null) => (this.itemsParentRef = ref),
    };

    /**
     * flag indicating that we should check whether selected item is in viewport after rendering,
     * typically because of keyboard change.
     */
    private shouldCheckActiveItemInViewport: boolean = false;

    public render() {
        const { className, items, renderer, query, itemListRenderer = this.renderItemList } = this.props;
        const { filteredItems } = this.state;
        return renderer({
            className,
            filteredItems,
            handleItemSelect: this.handleItemSelect,
            handleKeyDown: this.handleKeyDown,
            handleKeyUp: this.handleKeyUp,
            itemList: itemListRenderer({
                filteredItems,
                items,
                itemsParentRef: this.refHandlers.itemsParent,
                query,
                renderItem: this.renderItem,
            }),
            query,
        });
    }

    public componentWillMount() {
        this.setState({ filteredItems: getFilteredItems(this.props) });
    }

    public componentWillReceiveProps(nextProps: IQueryListProps<T>) {
        if (
            nextProps.items !== this.props.items ||
            nextProps.itemListPredicate !== this.props.itemListPredicate ||
            nextProps.itemPredicate !== this.props.itemPredicate ||
            nextProps.query !== this.props.query
        ) {
            this.shouldCheckActiveItemInViewport = true;
            this.setState({ filteredItems: getFilteredItems(nextProps) });
        }
    }

    public componentDidUpdate() {
        if (this.shouldCheckActiveItemInViewport) {
            // update scroll position immediately before repaint so DOM is accurate
            // (latest filteredItems) and to avoid flicker.
            requestAnimationFrame(() => this.scrollActiveItemIntoView());
            // reset the flag
            this.shouldCheckActiveItemInViewport = false;
        }
        // reset active item (in the same step) if it's no longer valid
        // Also don't fire the event if the active item is already undefined and there is nothing to pick
        if (
            this.getActiveIndex() < 0 &&
            (this.state.filteredItems.length !== 0 || this.props.activeItem !== undefined)
        ) {
            Utils.safeInvoke(this.props.onActiveItemChange, this.state.filteredItems[0]);
        }
    }

    public scrollActiveItemIntoView() {
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

    /** default `itemListRenderer` implementation */
    private renderItemList = (listProps: IItemListRendererProps<T>) => {
        const { initialContent, noResults } = this.props;
        const menuContent = renderFilteredItems(listProps, noResults, initialContent);
        return <Menu ulRef={listProps.itemsParentRef}>{menuContent}</Menu>;
    };

    /** wrapper around `itemRenderer` to inject props */
    private renderItem = (item: T, index: number) => {
        const { activeItem, query } = this.props;
        const matchesPredicate = this.state.filteredItems.indexOf(item) >= 0;
        const modifiers: IItemModifiers = {
            active: activeItem === item,
            disabled: this.isItemDisabled(item, index),
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

    private getActiveIndex() {
        const { activeItem } = this.props;
        // NOTE: this operation is O(n) so it should be avoided in render(). safe for events though.
        return activeItem == null ? -1 : this.state.filteredItems.indexOf(activeItem);
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
        Utils.safeInvoke(this.props.onActiveItemChange, item);
        Utils.safeInvoke(this.props.onItemSelect, item, event);
    };

    private handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        const { keyCode } = event;
        if (keyCode === Keys.ARROW_UP || keyCode === Keys.ARROW_DOWN) {
            event.preventDefault();
            const nextActiveItem = this.getNextActiveItem(keyCode === Keys.ARROW_UP ? -1 : 1);
            if (nextActiveItem != null) {
                // indicate that the active item may need to be scrolled into view after update.
                this.shouldCheckActiveItemInViewport = true;
                Utils.safeInvoke(this.props.onActiveItemChange, nextActiveItem);
            }
        }
        Utils.safeInvoke(this.props.onKeyDown, event);
    };

    private handleKeyUp = (event: React.KeyboardEvent<HTMLElement>) => {
        const { activeItem, onItemSelect, onKeyUp } = this.props;
        // using keyup for enter to play nice with Button's keyboard clicking.
        // if we were to process enter on keydown, then Button would click itself on keyup
        // and the popvoer would re-open out of our control :(.
        if (event.keyCode === Keys.ENTER && activeItem != null) {
            event.preventDefault();
            Utils.safeInvoke(onItemSelect, activeItem, event);
        }
        Utils.safeInvoke(onKeyUp, event);
    };

    /**
     * Get the next enabled item, moving in the given direction from the current
     * index. An `undefined` return value means no suitable item was found.
     * @param direction amount to move in each iteration, typically +/-1
     */
    private getNextActiveItem(direction: number): T | undefined {
        const { filteredItems } = this.state;
        let index = this.getActiveIndex();
        // remember where we started to prevent an infinite loop
        const startIndex = index;
        const maxIndex = filteredItems.length - 1;
        do {
            // find first non-disabled item
            index = wrapNumber(index + direction, 0, maxIndex);
            if (!this.isItemDisabled(filteredItems[index], index)) {
                return filteredItems[index];
            }
        } while (index !== startIndex);
        return undefined;
    }

    private isItemDisabled(item: T, index: number) {
        const { itemDisabled } = this.props;
        if (itemDisabled == null) {
            return false;
        } else if (Utils.isFunction(itemDisabled)) {
            return itemDisabled(item, index);
        } else {
            return !!item[itemDisabled];
        }
    }
}

function pxToNumber(value: string | null) {
    return value == null ? 0 : parseInt(value.slice(0, -2), 10);
}

function getFilteredItems<T>({ items, itemPredicate, itemListPredicate, query }: IQueryListProps<T>) {
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
