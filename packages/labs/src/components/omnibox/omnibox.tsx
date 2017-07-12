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
    Classes as CoreClasses,
    HTMLInputProps,
    IBackdropProps,
    IInputGroupProps,
    InputGroup,
    IOverlayableProps,
    IOverlayProps,
    Overlay,
    Utils,
} from "@blueprintjs/core";
import {
    IListItemsProps,
    IQueryListRendererProps,
    ISelectItemRendererProps,
    QueryList,
} from "../";
import * as Classes from "../../common/classes";

export interface IOmniboxProps<T> extends IListItemsProps<T> {
    /**
     * Custom renderer for an item in the dropdown list. Receives a boolean indicating whether
     * this item is active (selected by keyboard arrows) and an `onClick` event handler that
     * should be attached to the returned element.
     */
    itemRenderer: (itemProps: ISelectItemRendererProps<T>) => JSX.Element;

    /** React child to render when filtering items returns zero results. */
    noResults?: string | JSX.Element;

    /**
     * Props to spread to `InputGroup`. All props are supported except `ref` (use `inputRef` instead).
     * If you want to control the filter input, you can pass `value` and `onChange` here
     * to override `Select`'s own behavior.
     */
    inputProps?: IInputGroupProps & HTMLInputProps;

    /**
     * Toggles the visibility of the omnibox.
     * This prop is required because the component is controlled.
     */
    isOpen: boolean;

    /**
     * A callback that is invoked when user interaction causes the overlay to close, such as
     * clicking on the overlay or pressing the `esc` key (if enabled).
     * Receives the event from the user's interaction, if there was an event (generally either a
     * mouse or key event). Note that, since this component is controlled by the `isOpen` prop, it
     * will not actually close itself until that prop becomes `false`.
     */
    onClose?: (event?: React.SyntheticEvent<HTMLElement>) => void;

    /** Props to spread to `Overlay`. Note that `content` cannot be changed. */
    overlayProps?: Partial<IOverlayProps>;

    /**
     * Whether the filtering state should be reset to initial when an item is selected
     * (immediately before `onItemSelect` is invoked). The query will become the empty string
     * and the first item will be made active.
     * @default false
     */
    resetOnSelect?: boolean;
}

export interface IOmniboxState<T> extends IOverlayableProps, IBackdropProps {
    activeItem?: T;
    query?: string;
}

@PureRender
export class Omnibox<T> extends React.Component<IOmniboxProps<T>, IOmniboxState<T>> {
    public static displayName = "Blueprint.Omnibox";

    public static ofType<T>() {
        return Omnibox as new () => Omnibox<T>;
    }

    public state: IOmniboxState<T> = {
        query: "",
    };

    private TypedQueryList = QueryList.ofType<T>();
    private queryList: QueryList<T>;
    private refHandlers = {
        queryList: (ref: QueryList<T>) => this.queryList = ref,
    };

    public render() {
        // omit props specific to this component, spread the rest.
        const { isOpen, itemRenderer, inputProps, noResults, overlayProps, ...props } = this.props;
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

    public componentWillReceiveProps(nextProps: IOmniboxProps<T>) {
        const { isOpen } = nextProps;
        const canClearQuery = !this.props.isOpen && isOpen && this.props.resetOnSelect;

        this.setState({
            activeItem: canClearQuery ? this.props.items[0] : this.state.activeItem,
            query: canClearQuery ? "" : this.state.query,
        });
    }

    private renderQueryList = (listProps: IQueryListRendererProps<T>) => {
        const { inputProps = {}, isOpen, overlayProps = {} } = this.props;
        const { query } = this.state;
        const { ref, ...htmlInputProps } = inputProps;
        const { handleKeyDown, handleKeyUp } = listProps;

        return (
            <Overlay
                hasBackdrop={true}
                {...overlayProps}
                isOpen={isOpen}
                className={classNames(overlayProps.className, Classes.OMNIBOX_OVERLAY)}
                onClose={this.handleOverlayClose}
            >
                <div
                    className={classNames(listProps.className, Classes.OMNIBOX)}
                    onKeyDown={isOpen && query.length > 0 && handleKeyDown}
                    onKeyUp={isOpen && query.length > 0 && handleKeyUp}
                >
                    <InputGroup
                        autoFocus={true}
                        className={CoreClasses.LARGE}
                        leftIconName="search"
                        onChange={this.handleQueryChange}
                        placeholder="Search..."
                        value={listProps.query}
                        {...htmlInputProps}
                    />
                    {this.maybeRenderMenu(listProps)}
                </div>
            </Overlay>
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
        }));
    }

    private maybeRenderMenu(listProps: IQueryListRendererProps<T>) {
        if (this.state.query.length > 0) {
            return (
                <ul className={CoreClasses.MENU} ref={listProps.itemsParentRef}>
                    {this.renderItems(listProps)}
                </ul>
            );
        }
        return undefined;
    }

    private handleActiveItemChange = (activeItem: T) => this.setState({ activeItem });

    private handleItemSelect = (item: T, event: React.SyntheticEvent<HTMLElement>) => {
        if (this.state.query.length > 0) {
            Utils.safeInvoke(this.props.onItemSelect, item, event);
        }
    }

    private handleQueryChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({ query: event.currentTarget.value });
    }

    private handleOverlayClose = (event: React.SyntheticEvent<HTMLElement>) => {
        Utils.safeInvoke(this.props.onClose, event);
    }
}
