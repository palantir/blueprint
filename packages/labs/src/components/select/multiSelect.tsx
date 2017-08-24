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
    HTMLInputProps,
    IPopoverProps,
    Keys,
    Menu,
    Popover,
    Position,
    Utils,
} from "@blueprintjs/core";
import {
    IListItemsProps,
    IQueryListRendererProps,
    ISelectItemRendererProps,
    ITagInputProps,
    QueryList,
    TagInput,
} from "../";
import * as Classes from "../../common/classes";

export interface IMultiSelectProps<T> extends IListItemsProps<T> {
    /** Controlled selected values. */
    selectedItems?: T[];

    /**
     * React child to render when query is empty.
     */
    initialContent?: JSX.Element;

    /**
     * Custom renderer for an item in the dropdown list. Receives a boolean indicating whether
     * this item is active (selected by keyboard arrows) and an `onClick` event handler that
     * should be attached to the returned element.
     */
    itemRenderer: (itemProps: ISelectItemRendererProps<T>) => JSX.Element;

    /** React child to render when filtering items returns zero results. */
    noResults?: React.ReactChild;

    /**
     * Whether the popover opens on key down or when `TagInput` is focused.
     * @default false
     */
    openOnKeyDown?: boolean;

    /** Props to spread to `Popover`. Note that `content` cannot be changed. */
    popoverProps?: Partial<IPopoverProps> & object;

    /**
     * Whether the filtering state should be reset to initial when an item is selected
     * (immediately before `onItemSelect` is invoked), or when the popover closes.
     * The query will become the empty string and the first item will be made active.
     * @default true
     */
    resetOnSelect?: boolean;

    /** Props to spread to `TagInput`. */
    tagInputProps?: Partial<ITagInputProps> & object;

    /** Custom renderer to transform an item into tag content. */
    tagRenderer: (item: T) => React.ReactNode;
}

export interface IMultiSelectState<T> {
    activeItem?: T;
    isOpen?: boolean;
    query?: string;
}

@PureRender
export class MultiSelect<T> extends React.Component<IMultiSelectProps<T>, IMultiSelectState<T>> {
    public static displayName = "Blueprint.MultiSelect";

    public static ofType<T>() {
        return MultiSelect as new () => MultiSelect<T>;
    }

    public state: IMultiSelectState<T> = {
        isOpen: false,
        query: "",
    };

    private TypedQueryList = QueryList.ofType<T>();
    private input: HTMLInputElement;
    private queryList: QueryList<T>;
    private refHandlers = {
        input: (ref: HTMLInputElement) => this.input = ref,
        queryList: (ref: QueryList<T>) => this.queryList = ref,
    };

    public render() {
        // omit props specific to this component, spread the rest.
        const {
            initialContent,
            itemRenderer,
            noResults,
            openOnKeyDown,
            popoverProps,
            resetOnSelect,
            tagInputProps,
            ...restProps,
        } = this.props;

        return <this.TypedQueryList
            {...restProps}
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
            placeholder: "Search...",
            ...tagInputProps.inputProps,
            // tslint:disable-next-line:object-literal-sort-keys
            onChange: this.handleQueryChange,
            ref: this.refHandlers.input,
            value: query,
        };

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
                popoverClassName={classNames(Classes.MULTISELECT_POPOVER, popoverProps.popoverClassName)}
                popoverDidOpen={this.handlePopoverDidOpen}
                popoverWillOpen={this.handlePopoverWillOpen}
            >
                <div
                    onKeyDown={this.getTargetKeyDownHandler(handleKeyDown)}
                    onKeyUp={this.state.isOpen ? handleKeyUp : undefined}
                >
                    <TagInput
                        {...tagInputProps}
                        inputProps={defaultInputProps}
                        className={classNames(Classes.MULTISELECT, tagInputProps.className)}
                        values={this.props.selectedItems.map(this.props.tagRenderer)}
                    />
                </div>
                <div onKeyDown={this.getTargetKeyDownHandler(handleKeyDown)} onKeyUp={handleKeyUp}>
                    <Menu ulRef={listProps.itemsParentRef}>
                        {this.renderItems(listProps)}
                    </Menu>
                </div>
            </Popover>
        );
    }

    private renderItems({ activeItem, filteredItems, handleItemSelect }: IQueryListRendererProps<T>) {
        const { initialContent, itemRenderer, noResults } = this.props;
        if (initialContent != null && this.isQueryEmpty()) {
            return initialContent;
        }
        if (filteredItems.length === 0) {
            return noResults;
        }
        return filteredItems.map((item, index) => itemRenderer({
            index,
            item,
            handleClick: (e) => handleItemSelect(item, e),
            isActive: item === activeItem,
        }));
    }

    private isQueryEmpty = () => this.state.query.length === 0;

    private handleQueryChange = (e: React.FormEvent<HTMLInputElement>) => {
        const { tagInputProps = {}, openOnKeyDown } = this.props;
        const query = e.currentTarget.value;
        this.setState({ query, isOpen: !this.isQueryEmpty() || !openOnKeyDown });

        if (tagInputProps.inputProps != null) {
            Utils.safeInvoke(tagInputProps.inputProps.onChange, e);
        }
    }

    private handleItemSelect = (item: T, e: React.SyntheticEvent<HTMLElement>) => {
        this.input.focus();
        // make sure the query is valid by checking if activeItem is defined
        if (this.state.activeItem != null) {
            if (this.props.resetOnSelect && !this.isQueryEmpty()) {
                this.setState({
                    activeItem: this.props.items[0],
                    query: "",
                });
            }
            Utils.safeInvoke(this.props.onItemSelect, item, e);
        }
    }

    private handlePopoverInteraction = (nextOpenState: boolean) => requestAnimationFrame(() => {
        // deferring to rAF to get properly updated activeElement
        const { popoverProps = {}, resetOnSelect } = this.props;
        if (this.input != null && this.input !== document.activeElement) {
            // the input is no longer focused so we can close the popover
            this.setState({
                activeItem: resetOnSelect ? this.props.items[0] : this.state.activeItem,
                isOpen: false,
                query: resetOnSelect ? "" : this.state.query,
            });
        } else if (!this.props.openOnKeyDown) {
            // open the popover when focusing the tag input
            this.setState({ isOpen: true });
        }
        Utils.safeInvoke(popoverProps.onInteraction, nextOpenState);
    })

    private handlePopoverWillOpen = () => {
        const { popoverProps = {}, resetOnSelect } = this.props;
        if (resetOnSelect) {
            this.setState({ activeItem: this.props.items[0] });
        }
        Utils.safeInvoke(popoverProps.popoverWillOpen);
    }

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

    private getTargetKeyDownHandler = (
        handleQueryListKeyDown: React.EventHandler<React.KeyboardEvent<HTMLElement>>,
    ) => {
        return (e: React.KeyboardEvent<HTMLElement>) => {
            const { which } = e;
            const { resetOnSelect } = this.props;

            if (which === Keys.ESCAPE || which === Keys.TAB) {
                this.setState({
                    activeItem: resetOnSelect ? this.props.items[0] : this.state.activeItem,
                    isOpen: false,
                    query: resetOnSelect ? "" : this.state.query,
                });
            } else if (!(which === Keys.BACKSPACE || which === Keys.ARROW_LEFT || which === Keys.ARROW_RIGHT)) {
                this.setState({ isOpen: true });
            }

            if (this.state.isOpen) {
                Utils.safeInvoke(handleQueryListKeyDown, e);
            }
        };
    }
}
