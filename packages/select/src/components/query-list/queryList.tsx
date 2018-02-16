/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { IProps, Keys, Utils } from "@blueprintjs/core";
import { IItemModifiers, ItemRenderer } from "../../common/itemRenderer";
import { ItemListPredicate, ItemPredicate } from "../../common/predicate";

/** Reusable generic props for a component that operates on a filterable, selectable list of `items`. */
export interface IListItemsProps<T> extends IProps {
    /** Array of items in the list. */
    items: T[];

    /**
     * Customize querying of entire `items` array. Return new list of items.
     * This method can reorder, add, or remove items at will.
     * (Supports filter algorithms that operate on the entire set, rather than individual items.)
     *
     * If defined with `itemPredicate`, this prop takes priority and the other will be ignored.
     */
    itemListPredicate?: ItemListPredicate<T>;

    /**
     * Customize querying of individual items. Return `true` to keep the item, `false` to hide.
     * This method will be invoked once for each item, so it should be performant. For more complex
     * queries, use `itemListPredicate` to operate once on the entire array.
     *
     * If defined with `itemListPredicate`, this prop will be ignored.
     */
    itemPredicate?: ItemPredicate<T>;

    /**
     * Custom renderer for an item in the dropdown list. Receives a boolean indicating whether
     * this item is active (selected by keyboard arrows) and an `onClick` event handler that
     * should be attached to the returned element.
     */
    itemRenderer: ItemRenderer<T>;

    /**
     * Callback invoked when an item from the list is selected,
     * typically by clicking or pressing `enter` key.
     */
    onItemSelect: (item: T, event?: React.SyntheticEvent<HTMLElement>) => void;
}

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

/** Interface for object passed to `QueryList` `renderer` function. */
export interface IQueryListRendererProps<T> extends IProps {
    /**
     * Selection handler that should be invoked when a new item has been chosen,
     * perhaps because the user clicked it.
     */
    handleItemSelect: (item: T | undefined, event?: React.SyntheticEvent<HTMLElement>) => void;

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
     * Call this function to render an `item`.
     * `QueryList` will retrieve modifiers for the item and delegate to `itemRenderer` prop for the actual rendering.
     * The second parameter `index` is optional here; if provided, it will be passed through `itemRenderer` props.
     */
    renderItem: (item: T, index?: number) => JSX.Element;

    /**
     * Array of all (unfiltered) items in the list.
     * See `filteredItems` for a filtered array based on `query`.
     */
    items: T[];

    /**
     * A ref handler that should be applied to the HTML element that contains the rendererd items.
     * This is required for the `QueryList` to scroll the active item into view automatically.
     */
    itemsParentRef: (ref: HTMLElement) => void;

    /**
     * Controlled query string. Attach an `onChange` handler to the relevant
     * element to control this prop from your application's state.
     */
    query: string;
}

export interface IQueryListState<T> {
    filteredItems?: T[];
}

export class QueryList<T> extends React.Component<IQueryListProps<T>, IQueryListState<T>> {
    public static displayName = "Blueprint2.QueryList";

    public static ofType<T>() {
        return QueryList as new (props: IQueryListProps<T>) => QueryList<T>;
    }

    private itemsParentRef: HTMLElement;
    private refHandlers = {
        itemsParent: (ref: HTMLElement) => (this.itemsParentRef = ref),
    };

    /**
     * flag indicating that we should check whether selected item is in viewport after rendering,
     * typically because of keyboard change.
     */
    private shouldCheckActiveItemInViewport: boolean;

    public render() {
        const { items, renderer, query } = this.props;
        return renderer({
            handleItemSelect: this.handleItemSelect,
            handleKeyDown: this.handleKeyDown,
            handleKeyUp: this.handleKeyUp,
            items,
            itemsParentRef: this.refHandlers.itemsParent,
            query,
            renderItem: this.renderItem,
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

    private getActiveElement() {
        if (this.itemsParentRef != null) {
            return this.itemsParentRef.children.item(this.getActiveIndex()) as HTMLElement;
        }
        return undefined;
    }

    private getActiveIndex() {
        // NOTE: this operation is O(n) so it should be avoided in render(). safe for events though.
        return this.state.filteredItems.indexOf(this.props.activeItem);
    }

    private getItemsParentPadding() {
        const { paddingTop, paddingBottom } = getComputedStyle(this.itemsParentRef);
        return {
            paddingBottom: pxToNumber(paddingBottom),
            paddingTop: pxToNumber(paddingTop),
        };
    }

    private handleItemSelect = (item: T, event: React.SyntheticEvent<HTMLElement>) => {
        Utils.safeInvoke(this.props.onActiveItemChange, item);
        Utils.safeInvoke(this.props.onItemSelect, item, event);
    };

    private handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        switch (event.keyCode) {
            case Keys.ARROW_UP:
                event.preventDefault();
                this.moveActiveIndex(-1);
                break;
            case Keys.ARROW_DOWN:
                event.preventDefault();
                this.moveActiveIndex(1);
                break;
            default:
                break;
        }
        Utils.safeInvoke(this.props.onKeyDown, event);
    };

    private handleKeyUp = (event: React.KeyboardEvent<HTMLElement>) => {
        const { activeItem, onItemSelect, onKeyUp } = this.props;
        // using keyup for enter to play nice with Button's keyboard clicking.
        // if we were to process enter on keydown, then Button would click itself on keyup
        // and the popvoer would re-open out of our control :(.
        if (event.keyCode === Keys.ENTER) {
            event.preventDefault();
            Utils.safeInvoke(onItemSelect, activeItem, event);
        }
        Utils.safeInvoke(onKeyUp, event);
    };

    private moveActiveIndex(direction: number) {
        // indicate that the active item may need to be scrolled into view after update.
        // this is not possible with mouse hover cuz you can't hover on something off screen.
        this.shouldCheckActiveItemInViewport = true;
        const { filteredItems } = this.state;
        const maxIndex = Math.max(filteredItems.length - 1, 0);
        const nextActiveIndex = Utils.clamp(this.getActiveIndex() + direction, 0, maxIndex);
        Utils.safeInvoke(this.props.onActiveItemChange, filteredItems[nextActiveIndex]);
    }

    private renderItem = (item: T, index?: number) => {
        const { activeItem, itemListPredicate, itemPredicate = () => true, query } = this.props;
        const matchesPredicate = Utils.isFunction(itemListPredicate)
            ? this.state.filteredItems.indexOf(item) >= 0
            : itemPredicate(query, item, index);
        const modifiers: IItemModifiers = {
            active: activeItem === item,
            disabled: false,
            matchesPredicate,
        };
        return this.props.itemRenderer(item, {
            handleClick: e => this.handleItemSelect(item, e),
            index,
            modifiers,
        });
    };
}

function pxToNumber(value: string) {
    return parseInt(value.slice(0, -2), 10);
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
