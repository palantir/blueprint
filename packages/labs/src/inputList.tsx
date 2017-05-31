/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as React from "react";

import { IProps, Keys, Utils } from "@blueprintjs/core";

export interface ICoreInputListProps<T> extends IProps {
    /** Array of items in the list. */
    items: T[];

    /** Customize filtering of individual items. Return `true` to keep the item, `false` to hide. */
    itemPredicate?: (item: T, query: string) => boolean;

    /**
     * Customize filtering of entire items array. Return subset of items that pass filter.
     * (Some filter algorithms operate on the entire set, rather than individual items.)
     */
    itemListPredicate?: (items: T[], query: string) => T[];

    /**
     * Callback invoked when an item from the list is selected,
     * typically by clicking or pressing `enter` key.
     */
    onItemSelect: (item: T, event: React.SyntheticEvent<HTMLElement>) => void;

    /**
     * Callback invoked when `query` value changes. This is passed to `compose` and should be
     * attached to the query input element. Latest element value is `event.currentTarget.value`.
     */
    onQueryChange: React.FormEventHandler<HTMLInputElement>;

    /**
     * Controlled value of query input. Use `onQueryChange` to receive updates to this value.
     */
    query: string;
}

export interface IInputListProps<T> extends ICoreInputListProps<T> {
    /**
     * Callback invoked when user presses a key, after processing `InputList`'s own key events
     * (up/down to navigate active item). This callback is passed to `compose` and (along with
     * `onKeyUp`) can be attached to arbitrary content elements to support keyboard selection.
     */
    onKeyDown?: React.KeyboardEventHandler<HTMLElement>;

    /**
     * Callback invoked when user releases a key, after processing `InputList`'s own key events
     * (enter to select active item). This callback is passed to `compose` and (along with
     * `onKeyDown`) can be attached to arbitrary content elements to support keyboard selection.
     */
    onKeyUp?: React.KeyboardEventHandler<HTMLElement>;

    /**
     * Customize rendering of the input list.
     * Receives an object with props that should be applied to elements as necessary.
     */
    renderer: (data: IInputListRenderProps<T>) => JSX.Element;
}

/**
 * An object with the following keys will be passed to an `InputList` `renderer`.
 * The required properties will always be defined; the optional ones will only be defined if
 * they are passed as props to the `InputList`.
 */
export interface IInputListRenderProps<T> extends ICoreInputListProps<T> {
    /** The item focused by the keyboard (arrow keys). This item should stand out visually from the rest. */
    activeItem: T;

    /**
     * A ref handler that should be applied to the HTML element that contains the rendererd items.
     * This is required for the InputList to scroll the active item into view automatically.
     */
    itemsParentRef: (ref: HTMLElement) => void;

    /**
     * Keyboard handler for up/down arrow keys to shift the active item.
     * Attach this handler to any element that should support this interaction.
     */
    onKeyDown: React.KeyboardEventHandler<HTMLElement>;

    /**
     * Keyboard handler for enter key to select the active item.
     * Attach this handler to any element that should support this interaction.
     */
    onKeyUp: React.KeyboardEventHandler<HTMLElement>;
}

export interface IInputListState<T> {
    activeIndex?: number;
    filteredItems?: T[];
}

export class InputList<T> extends React.Component<IInputListProps<T>, IInputListState<T>> {
    public static displayName = "Blueprint.InputList";

    public static ofType<T>() {
        return InputList as new (props: IInputListProps<T>) => InputList<T>;
    }

    private itemsParentRef: HTMLElement;
    private refHandlers = {
        itemsParent: (ref: HTMLElement) => this.itemsParentRef = ref,
    };

    /**
     * flag indicating that we should check whether selected item is in viewport after rendering,
     * typically because of keyboard change.
     */
    private shouldCheckActiveItemInViewport: boolean;

    public render() {
        const { renderer, ...props } = this.props;
        const items = this.state.filteredItems;
        return renderer({
            ...props,
            items,
            activeItem: items[this.state.activeIndex],
            itemsParentRef: this.refHandlers.itemsParent,
            onKeyDown: this.handleKeyDown,
            onKeyUp: this.handleKeyUp,
        });
    }

    public componentWillMount() {
        this.initializeState(this.props);
    }

    public componentWillReceiveProps(nextProps: IInputListProps<T>) {
        if (nextProps.items !== this.props.items
            || nextProps.itemListPredicate !== this.props.itemListPredicate
            || nextProps.itemPredicate !== this.props.itemPredicate
            || nextProps.query !== this.props.query
        ) {
            this.initializeState(nextProps);
            this.shouldCheckActiveItemInViewport = true;
        }
    }

    public componentDidUpdate() {
        if (this.shouldCheckActiveItemInViewport) {
            this.scrollActiveItemIntoView();
            // reset the flag
            this.shouldCheckActiveItemInViewport = false;
        }
    }

    public scrollActiveItemIntoView() {
        if (this.itemsParentRef != null) {
            const { offsetTop: activeTop, offsetHeight: activeHeight } = this.getActiveElement();
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
            return this.itemsParentRef.children.item(this.state.activeIndex) as HTMLElement;
        }
        return undefined;
    }

    private getItemsParentPadding() {
        const { paddingTop, paddingBottom } = getComputedStyle(this.itemsParentRef);
        return {
            paddingBottom: pxToNumber(paddingBottom),
            paddingTop: pxToNumber(paddingTop),
        };
    }

    private handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        switch (event.keyCode) {
            case Keys.ARROW_UP:
                event.preventDefault();
                this.moveActiveIndex(-1);
                break;
            case Keys.ARROW_DOWN:
                event.preventDefault();
                this.moveActiveIndex();
                break;
            default: return;
        }
        Utils.safeInvoke(this.props.onKeyDown, event);
    }

    private handleKeyUp = (event: React.KeyboardEvent<HTMLElement>) => {
        // using keyup for enter to play nice with Button's keyboard clicking.
        // if we were to process enter on keydown, then Button would click itself on keyup
        // and the popvoer would re-open out of our control :(.
        if (event.keyCode === Keys.ENTER) {
            event.preventDefault();
            this.selectActiveItem(event);
        }
        Utils.safeInvoke(this.props.onKeyUp, event);
    }

    private moveActiveIndex(direction = 1) {
        // indicate that the active item may need to be scrolled into view after update.
        // this is not possible with mouse hover cuz you can't hover on something off screen.
        this.shouldCheckActiveItemInViewport = true;
        const { filteredItems, activeIndex } = this.state;
        this.setState({
            activeIndex: Utils.clamp(activeIndex + direction, 0, Math.max(filteredItems.length - 1, 0)),
        });
    }

    private selectActiveItem(event: React.SyntheticEvent<HTMLElement>) {
        this.props.onItemSelect(this.state.filteredItems[this.state.activeIndex], event);
    }

    private initializeState(props: IInputListProps<T>) {
        this.setState({
            activeIndex: 0,
            filteredItems: getFilteredItems(props),
        });
    }
}

function pxToNumber(value: string) {
    return parseInt(value.slice(0, -2), 10);
}

function getFilteredItems<T>({ items, itemPredicate, itemListPredicate, query }: IInputListProps<T>) {
    if (Utils.isFunction(itemListPredicate)) {
        return itemListPredicate(items, query);
    } else if (Utils.isFunction(itemPredicate)) {
        return items.filter((item) => itemPredicate(item, query));
    }
    return items;
}
