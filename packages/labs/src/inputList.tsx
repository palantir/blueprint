/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

// import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";

import { IProps, Keys, Utils } from "@blueprintjs/core";

export interface ICoreInputListProps<D> extends IProps {
    /** Array of items in the list. */
    items: D[];

    /** Customize filtering of individual items. Return `true` to keep the item, `false` to hide. */
    itemFilterer?: (item: D, query: string) => boolean;

    /**
     * Customize filtering of entire items array. Return subset of items that pass filter.
     * (Some filter algorithms operate on the entire set, rather than individual items.)
     */
    itemsFilterer?: (items: D[], query: string) => D[];

    /**
     * Callback invoked when an item from the list is selected,
     * typically by clicking or pressing `enter` key.
     */
    onItemSelect: (item: D) => void;

    /**
     * Callback invoked when user presses a key, after processing `InputList`'s own key events
     * (up/down to navigate active item, enter to select it). This callback is passed to `compose`
     * and can be attached to arbitrary content elements to support key events.
     */
    onKeyDown?: React.KeyboardEventHandler<HTMLElement>;

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

export interface IInputListProps<D> extends ICoreInputListProps<D> {
    /**
     * Customize rendering of the input list.
     * Receives an object with props that should be applied to elements as necessary.
     */
    renderer: (data: IInputListRenderProps<D>) => JSX.Element;
}

export interface IInputListRenderProps<D> extends ICoreInputListProps<D> {
    activeItem: D;
    itemsParentRef: (ref: HTMLElement) => void;
    onKeyDown: React.KeyboardEventHandler<HTMLElement>;
}

export interface IInputListState<D> {
    activeIndex: number;
    filteredItems: D[];
}

@PureRender
export class InputList<D> extends React.Component<IInputListProps<D>, IInputListState<D>> {
    public static displayName = "Blueprint.InputList";

    public static ofType<T>() { return InputList as new () => InputList<T>; }

    private itemsParentRef: HTMLElement;
    private refHandlers = {
        itemsParent: (ref: HTMLElement) => this.itemsParentRef = ref,
    };

    /**
     * flag indicating that we should check whether selected item is in viewport after rendering,
     * typically because of keyboard change.
     */
    private shouldCheckActiveItemInViewport: boolean;

    constructor(props?: IInputListProps<D>, context?: any) {
        super(props, context);
        this.state = {
            activeIndex: 0,
            filteredItems: this.getFilteredItems(props.query),
        };
    }

    public render() {
        const { renderer, ...props } = this.props;
        const items = this.state.filteredItems;
        return renderer({
            ...props,
            items,
            activeItem: items[this.state.activeIndex],
            itemsParentRef: this.refHandlers.itemsParent,
            onKeyDown: this.handleKeyDown,
        });
    }

    public componentWillReceiveProps(nextProps: IInputListProps<D>) {
        // TODO: check other props, and use them in getFilteredItems
        if (nextProps.query !== this.props.query) {
            this.setState({
                activeIndex: 0,
                filteredItems: this.getFilteredItems(nextProps.query),
            });
        }
    }

    public componentDidUpdate() {
        if (this.shouldCheckActiveItemInViewport && this.itemsParentRef != null) {
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

            // reset the flag
            this.shouldCheckActiveItemInViewport = false;
        }
    }

    private getActiveElement() {
        if (this.itemsParentRef != null) {
            return this.itemsParentRef.children.item(this.state.activeIndex) as HTMLElement;
        }
        return undefined;
    }

    private getFilteredItems(query = this.props.query) {
        const { items, itemFilterer, itemsFilterer } = this.props;
        if (Utils.isFunction(itemsFilterer)) {
            return itemsFilterer(items, query);
        } else if (Utils.isFunction(itemFilterer)) {
            return items.filter((item) => itemFilterer(item, query));
        }
        return items;
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
            case Keys.ENTER:
                this.selectActiveItem();
                return;
            default: return;
        }
        Utils.safeInvoke(this.props.onKeyDown, event);
    }

    private moveActiveIndex(direction = 1) {
        // indicate that the active item may need to be scrolled into view after update.
        // this is not possible with mouse hover cuz you can't hover on something off screen.
        this.shouldCheckActiveItemInViewport = true;
        const { filteredItems, activeIndex } = this.state;
        this.setState({
            ...this.state,
            activeIndex: Utils.clamp(activeIndex + direction, 0, Math.max(filteredItems.length - 1, 0)),
        });
    }

    private selectActiveItem() {
        this.props.onItemSelect(this.state.filteredItems[this.state.activeIndex]);
    }
}

function pxToNumber(value: string) {
    return parseInt(value.slice(0, -2), 10);
}
