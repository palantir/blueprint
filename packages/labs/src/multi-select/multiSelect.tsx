/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";

import {
    AbstractComponent,
    Classes,
    HTMLInputProps,
    IPopoverProps,
    Keys,
    Popover,
    Position,
    Utils,
} from "@blueprintjs/core";
import { IListItemsProps, IQueryListRendererProps, QueryList } from "../query-list/queryList";
import { ISelectItemRendererProps } from "../select/select";
import { ITagInputProps, TagInput } from "../tag-input/tagInput";

export interface IMultiSelectProps<T> extends IListItemsProps<T> {
    /**
     * Custom renderer for an item in the dropdown list. Receives a boolean indicating whether
     * this item is active (selected by keyboard arrows) and an `onClick` event handler that
     * should be attached to the returned element.
     */
    itemRenderer: (itemProps: IMultiSelectItemRendererProps<T>) => JSX.Element;

    /** React child to render when filtering items returns zero results. */
    noResults?: string | JSX.Element;

    /**
     * Whether the popover opens on key down or when `TagInput` is focused.
     * @default false
     */
    openOnKeyDown?: boolean;

    /** Props to spread to `Popover`. Note that `content` cannot be changed. */
    popoverProps?: Partial<IPopoverProps>;

    /**
     * Whether the filtering state should be reset to initial when an item is selected
     * (immediately before `onItemSelect` is invoked), or when the popover closes.
     * The query will become the empty string and the first item will be made active.
     * @default true
     */
    resetOnSelect?: boolean;

    /** Controlled selected values. */
    selectedItems?: T[];

    /** Props to spread to `TagInput`. */
    tagInputProps?: Partial<ITagInputProps>;

    /** Custom renderer to transform an item into a string for tags. */
    tagRenderer: (item: T) => string;
}

export interface IMultiSelectItemRendererProps<T> extends ISelectItemRendererProps<T> {
    /**
     * Whether the item is selected.
     */
    isSelected?: boolean;
}

export interface IMultiSelectState<T> {
    activeItem?: T;
    isOpen?: boolean;
    query?: string;
    selectedItems?: T[];
}

@PureRender
export class MultiSelect<T> extends AbstractComponent<IMultiSelectProps<T>, IMultiSelectState<T>> {
    public static displayName = "Blueprint.MultiSelect";

    public static ofType<T>() {
        return MultiSelect as new () => MultiSelect<T>;
    }

    public state: IMultiSelectState<T> = {
        isOpen: false,
        query: "",
        selectedItems: [],
    };

    private TypedQueryList = QueryList.ofType<T>();
    private input: HTMLInputElement;
    private queryList: QueryList<T>;
    private queryListKeyDown: React.EventHandler<React.KeyboardEvent<HTMLElement>>;
    private refHandlers = {
        input: (ref: HTMLInputElement) => this.input = ref,
        queryList: (ref: QueryList<T>) => this.queryList = ref,
    };

    public componentDidMount() {
        // can't use defaultProps because "static members
        // cannot reference class type parameters"
        this.setState({ selectedItems: this.props.selectedItems || [] });
    }

    public render() {
        // omit props specific to this component, spread the rest.
        const { itemRenderer, noResults, popoverProps, tagInputProps, ...props } = this.props;

        return <this.TypedQueryList
            {...props}
            activeItem={this.state.activeItem}
            onActiveItemChange={this.handleActiveItemChange}
            onItemSelect={this.handleItemSelect}
            query={this.state.query}
            ref={this.refHandlers.queryList}
            renderer={this.renderQueryList}
        />;
    }

    private renderQueryList = (listProps: IQueryListRendererProps<T>) => {
        const { tagInputProps = {}, popoverProps = {} } = this.props;
        const { handleKeyDown, handleKeyUp, query } = listProps;
        const defaultInputProps: HTMLInputProps = {
            onChange: this.handleQueryChange,
            placeholder: "Search...",
            ref: this.refHandlers.input,
            value: query,
        };

        this.queryListKeyDown = handleKeyDown;

        return (
            <Popover
                autoFocus={false}
                canEscapeKeyClose={true}
                enforceFocus={false}
                isOpen={this.state.isOpen}
                position={Position.BOTTOM_LEFT}
                {...popoverProps}
                className={classNames(listProps.className, popoverProps.className)}
                onInteraction={this.handlePopoverInteraction}
                popoverClassName={classNames("pt-multi-select-popover", popoverProps.popoverClassName)}
                popoverDidOpen={this.handlePopoverDidOpen}
            >
                <div
                    onKeyDown={this.handleKeyDown}
                    onKeyUp={this.state.isOpen && handleKeyUp}
                >
                    <TagInput
                        inputProps={defaultInputProps}
                        onRemove={this.handleTagRemove}
                        {...tagInputProps}
                        className={classNames("pt-multi-select", tagInputProps.className)}
                        values={this.state.selectedItems.map(this.props.tagRenderer)}
                    />
                </div>
                <div onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>
                    <ul className={Classes.MENU} ref={listProps.itemsParentRef}>
                        {this.renderItems(listProps)}
                    </ul>
                </div>
            </Popover>
        );
    }

    private renderItems({ activeItem, filteredItems, handleItemSelect }: IQueryListRendererProps<T>) {
        const { itemRenderer, noResults } = this.props;

        if (filteredItems.length === 0) {
            return noResults;
        }

        return filteredItems.map((item, index) => itemRenderer({
            index,
            item,
            handleClick: (e) => handleItemSelect(item, e),
            isActive: item === activeItem,
            isSelected: this.isItemSelected(item),
        }));
    }

    private handleQueryChange = (event: React.FormEvent<HTMLInputElement>) => {
        const query = event.currentTarget.value;
        let nextState: IMultiSelectState<T> = { query };

        if (query.length === 0 && this.props.openOnKeyDown) {
            nextState = { ...nextState, isOpen: false };
        }

        this.setState(nextState);
    }

    private getSelectedItemIndex(item: T) {
        return this.state.selectedItems.indexOf(item);
    }

    private isItemSelected(item: T) {
        return this.getSelectedItemIndex(item) !== -1;
    }

    private selectItem(item: T) {
        const { openOnKeyDown, resetOnSelect } = this.props;
        let nextState: IMultiSelectState<T> = { selectedItems: [...this.state.selectedItems, item] };

        if (openOnKeyDown) {
            nextState = { ...nextState, isOpen: false };
        }
        if (resetOnSelect) {
            nextState = { ...nextState, query: "" };
        }

        this.setState(nextState);
    }

    private deselectItem(index: number) {
        this.setState({ selectedItems: this.state.selectedItems.filter((_, i) => i !== index) });
    }

    private handleTagRemove = (_item: string, index: number) => {
        this.deselectItem(index);

        Utils.safeInvoke(this.props.tagInputProps.onRemove, _item, index);
    }

    private handleItemSelect = (item: T, _event: React.SyntheticEvent<HTMLElement>) => {
        // check whether the query string is in the item list
        if (item !== undefined && this.state.activeItem !== undefined) {
            if (!this.isItemSelected(item)) {
                this.selectItem(item);
            } else {
                this.deselectItem(this.getSelectedItemIndex(item));
            }
        }
        this.input.focus();

        Utils.safeInvoke(this.props.onItemSelect, item, _event);
    }

    private handlePopoverInteraction = (nextOpenState: boolean) => requestAnimationFrame(() => {
        // deferring to rAF to get properly updated activeElement
        const { popoverProps = {} } = this.props;

        if (this.input != null && this.input !== document.activeElement) {
            // the input is no longer focused so we can close the popover
            let nextState = { isOpen: false };

            if (this.props.resetOnSelect) {
                nextState = { ...nextState, query: "" };
            }

            this.setState(nextState);
        } else if (!this.props.openOnKeyDown) {
            // open the popover when focusing the tag input
            this.setState({ isOpen: true });
        }

        Utils.safeInvoke(popoverProps.onInteraction, nextOpenState);
    })

    private handlePopoverDidOpen = () => {
        const { popoverProps = {} } = this.props;

        if (this.queryList != null) {
            // scroll active item into view after popover transition completes and all dimensions are stable.
            this.queryList.scrollActiveItemIntoView();
        }

        Utils.safeInvoke(popoverProps.popoverDidOpen);
    }

    private handleActiveItemChange = (activeItem: T) => {
        this.setState({ activeItem });
    }

    private handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.which === Keys.ESCAPE
            || event.which === Keys.TAB) {
            let nextState = { isOpen: false };

            if (this.props.resetOnSelect) {
                nextState = { ...nextState, query: "" };
            }

            this.setState(nextState);
        } else if (!(event.which === Keys.ARROW_LEFT
           || event.which === Keys.ARROW_RIGHT
           || event.which === Keys.BACKSPACE)) {
           // these three keys help with navigating tags in the tag input,
           // when triggered the popover should not open
           this.setState({ isOpen: true });
        }

        if (this.queryListKeyDown) {
            Utils.safeInvoke(this.queryListKeyDown, event);
        }
    }
}
