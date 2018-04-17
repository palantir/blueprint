/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";

import {
    HTMLInputProps,
    IBackdropProps,
    IInputGroupProps,
    InputGroup,
    IOverlayableProps,
    IOverlayProps,
    Overlay,
    Utils,
} from "@blueprintjs/core";

import { Classes, IListItemsProps } from "../../common";
import { IQueryListRendererProps, QueryList } from "../query-list/queryList";

export interface IOmnibarProps<T> extends IListItemsProps<T> {
    /**
     * Props to spread to `InputGroup`. All props are supported except `ref` (use `inputRef` instead).
     * If you want to control the filter input, you can pass `value` and `onChange` here
     * to override `Select`'s own behavior.
     */
    inputProps?: IInputGroupProps & HTMLInputProps;

    /**
     * Toggles the visibility of the omnibar.
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
    overlayProps?: Partial<IOverlayProps> & object;

    /**
     * Whether the filtering state should be reset to initial when an item is selected
     * (immediately before `onItemSelect` is invoked). The query will become the empty string
     * and the first item will be made active.
     * @default false
     */
    resetOnSelect?: boolean;
}

export interface IOmnibarState<T> extends IOverlayableProps, IBackdropProps {
    activeItem?: T;
    query: string;
}

export class Omnibar<T> extends React.PureComponent<IOmnibarProps<T>, IOmnibarState<T>> {
    public static displayName = "Blueprint2.Omnibar";

    public static ofType<T>() {
        return Omnibar as new (props: IOmnibarProps<T>) => Omnibar<T>;
    }

    public state: IOmnibarState<T> = {
        query: "",
    };

    private TypedQueryList = QueryList.ofType<T>();
    private queryList?: QueryList<T> | null;
    private refHandlers = {
        queryList: (ref: QueryList<T> | null) => (this.queryList = ref),
    };

    public render() {
        // omit props specific to this component, spread the rest.
        const { initialContent = null, isOpen, inputProps, overlayProps, ...restProps } = this.props;

        return (
            <this.TypedQueryList
                {...restProps}
                activeItem={this.state.activeItem}
                initialContent={initialContent}
                onActiveItemChange={this.handleActiveItemChange}
                onItemSelect={this.handleItemSelect}
                query={this.state.query}
                ref={this.refHandlers.queryList}
                renderer={this.renderQueryList}
            />
        );
    }

    public componentWillReceiveProps(nextProps: IOmnibarProps<T>) {
        const { isOpen } = nextProps;
        const canClearQuery = !this.props.isOpen && isOpen && this.props.resetOnSelect;

        this.setState({
            activeItem: canClearQuery ? this.props.items[0] : this.state.activeItem,
            query: canClearQuery ? "" : this.state.query,
        });
    }

    private renderQueryList = (listProps: IQueryListRendererProps<T>) => {
        const { inputProps = {}, isOpen, overlayProps = {} } = this.props;
        const { handleKeyDown, handleKeyUp } = listProps;
        const handlers = isOpen && !this.isQueryEmpty() ? { onKeyDown: handleKeyDown, onKeyUp: handleKeyUp } : {};

        return (
            <Overlay
                hasBackdrop={true}
                {...overlayProps}
                isOpen={isOpen}
                className={classNames(overlayProps.className, Classes.OMNIBAR_OVERLAY)}
                onClose={this.handleOverlayClose}
            >
                <div className={classNames(listProps.className, Classes.OMNIBAR)} {...handlers}>
                    <InputGroup
                        autoFocus={true}
                        large={true}
                        leftIcon="search"
                        placeholder="Search..."
                        value={listProps.query}
                        {...inputProps}
                        onChange={this.handleQueryChange}
                    />
                    {listProps.itemList}
                </div>
            </Overlay>
        );
    };

    private isQueryEmpty = () => this.state.query.length === 0;

    private handleActiveItemChange = (activeItem?: T) => this.setState({ activeItem });

    private handleItemSelect = (item: T, event?: React.SyntheticEvent<HTMLElement>) => {
        if (!this.isQueryEmpty()) {
            Utils.safeInvoke(this.props.onItemSelect, item, event);
        }
    };

    private handleQueryChange = (event: React.FormEvent<HTMLInputElement>) => {
        const { inputProps = {} } = this.props;
        this.setState({ query: event.currentTarget.value });
        Utils.safeInvoke(inputProps.onChange, event);
    };

    private handleOverlayClose = (event: React.SyntheticEvent<HTMLElement>) => {
        Utils.safeInvoke(this.props.onClose, event);
    };
}
