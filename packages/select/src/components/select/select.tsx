/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";

import {
    Button,
    HTMLInputProps,
    IInputGroupProps,
    InputGroup,
    IPopoverProps,
    Keys,
    Popover,
    Position,
    Utils,
} from "@blueprintjs/core";
import { Classes, IListItemsProps } from "../../common";
import { IQueryListRendererProps, QueryList } from "../query-list/queryList";

export interface ISelectProps<T> extends IListItemsProps<T> {
    /**
     * Whether the dropdown list can be filtered.
     * Disabling this option will remove the `InputGroup` and ignore `inputProps`.
     * @default true
     */
    filterable?: boolean;

    /**
     * Whether the component is non-interactive.
     * Note that you'll also need to disable the component's children, if appropriate.
     * @default false
     */
    disabled?: boolean;

    /**
     * Props to spread to `InputGroup`. All props are supported except `ref` (use `inputRef` instead).
     * If you want to control the filter input, you can pass `value` and `onChange` here
     * to override `Select`'s own behavior.
     */
    inputProps?: IInputGroupProps & HTMLInputProps;

    /** Props to spread to `Popover`. Note that `content` cannot be changed. */
    popoverProps?: Partial<IPopoverProps> & object;

    /**
     * Whether the filtering state should be reset to initial when an item is selected
     * (immediately before `onItemSelect` is invoked). The query will become the empty string
     * and the first item will be made active.
     * @default false
     */
    resetOnSelect?: boolean;

    /**
     * Whether the filtering state should be reset to initial when the popover closes.
     * The query will become the empty string and the first item will be made active.
     * @default false
     */
    resetOnClose?: boolean;

    /**
     * Callback invoked when the query value changes,
     * through user input or when the filter is reset.
     */
    onQueryChange?: (query: string) => void;
}

export interface ISelectState<T> {
    activeItem?: T;
    isOpen: boolean;
    query: string;
}

export class Select<T> extends React.PureComponent<ISelectProps<T>, ISelectState<T>> {
    public static displayName = "Blueprint2.Select";

    public static ofType<T>() {
        return Select as new (props: ISelectProps<T>) => Select<T>;
    }

    private TypedQueryList = QueryList.ofType<T>();
    private input?: HTMLInputElement | null;
    private list?: QueryList<T> | null;
    private previousFocusedElement: HTMLElement | undefined;
    private refHandlers = {
        input: (ref: HTMLInputElement | null) => {
            this.input = ref;

            const { inputProps = {} } = this.props;
            Utils.safeInvoke(inputProps.inputRef, ref);
        },
        queryList: (ref: QueryList<T> | null) => (this.list = ref),
    };

    constructor(props: ISelectProps<T>, context?: any) {
        super(props, context);
        const { inputProps = {} } = props;
        const query = inputProps.value == null ? "" : inputProps.value.toString();
        this.state = { isOpen: false, query };
    }

    public render() {
        // omit props specific to this component, spread the rest.
        const { filterable, inputProps, popoverProps, ...restProps } = this.props;

        return (
            <this.TypedQueryList
                {...restProps}
                activeItem={this.state.activeItem}
                onActiveItemChange={this.handleActiveItemChange}
                onItemSelect={this.handleItemSelect}
                query={this.state.query}
                ref={this.refHandlers.queryList}
                renderer={this.renderQueryList}
            />
        );
    }

    public componentWillReceiveProps(nextProps: ISelectProps<T>) {
        const { inputProps: nextInputProps = {} } = nextProps;
        if (nextInputProps.value !== undefined && this.state.query !== nextInputProps.value) {
            this.setState({ query: nextInputProps.value.toString() });
        }
    }

    public componentDidUpdate(_prevProps: ISelectProps<T>, prevState: ISelectState<T>) {
        if (this.state.isOpen && !prevState.isOpen && this.list != null) {
            this.list.scrollActiveItemIntoView();
        }
    }

    private renderQueryList = (listProps: IQueryListRendererProps<T>) => {
        // not using defaultProps cuz they're hard to type with generics (can't use <T> on static members)
        const { filterable = true, disabled = false, inputProps = {}, popoverProps = {} } = this.props;

        const input = (
            <InputGroup
                autoFocus={true}
                leftIcon="search"
                placeholder="Filter..."
                rightElement={this.maybeRenderInputClearButton()}
                value={listProps.query}
                {...inputProps}
                inputRef={this.refHandlers.input}
                onChange={this.handleQueryChange}
            />
        );

        const { handleKeyDown, handleKeyUp } = listProps;
        return (
            <Popover
                autoFocus={false}
                enforceFocus={false}
                isOpen={this.state.isOpen}
                disabled={disabled}
                position={Position.BOTTOM_LEFT}
                {...popoverProps}
                className={classNames(listProps.className, popoverProps.className)}
                onInteraction={this.handlePopoverInteraction}
                popoverClassName={classNames(Classes.SELECT_POPOVER, popoverProps.popoverClassName)}
                popoverWillOpen={this.handlePopoverWillOpen}
                popoverDidOpen={this.handlePopoverDidOpen}
                popoverWillClose={this.handlePopoverWillClose}
            >
                <div
                    onKeyDown={this.state.isOpen ? handleKeyDown : this.handleTargetKeyDown}
                    onKeyUp={this.state.isOpen ? handleKeyUp : undefined}
                >
                    {this.props.children}
                </div>
                <div onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>
                    {filterable ? input : undefined}
                    {listProps.itemList}
                </div>
            </Popover>
        );
    };

    private maybeRenderInputClearButton() {
        return this.state.query.length === 0 ? (
            undefined
        ) : (
            <Button icon="cross" minimal={true} onClick={this.resetQuery} />
        );
    }

    private handleActiveItemChange = (activeItem?: T) => this.setState({ activeItem });

    private handleTargetKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        // open popover when arrow key pressed on target while closed
        if (event.which === Keys.ARROW_UP || event.which === Keys.ARROW_DOWN) {
            this.setState({ isOpen: true });
        }
    };

    private handleItemSelect = (item: T, event?: React.SyntheticEvent<HTMLElement>) => {
        this.setState({ isOpen: false });
        if (this.props.resetOnSelect) {
            this.resetQuery();
        }
        Utils.safeInvoke(this.props.onItemSelect, item, event);
    };

    private handlePopoverInteraction = (isOpen: boolean) => {
        this.setState({ isOpen });

        const { popoverProps = {} } = this.props;
        Utils.safeInvoke(popoverProps.onInteraction, isOpen);
    };

    private handlePopoverWillOpen = () => {
        const { popoverProps = {}, resetOnClose } = this.props;
        // save currently focused element before popover steals focus, so we can restore it when closing.
        this.previousFocusedElement = document.activeElement as HTMLElement;

        if (resetOnClose) {
            this.resetQuery();
        }

        Utils.safeInvoke(popoverProps.popoverWillOpen);
    };

    private handlePopoverDidOpen = () => {
        // scroll active item into view after popover transition completes and all dimensions are stable.
        if (this.list != null) {
            this.list.scrollActiveItemIntoView();
        }

        requestAnimationFrame(() => {
            const { inputProps = {} } = this.props;
            // autofocus is enabled by default
            if (inputProps.autoFocus !== false && this.input != null) {
                this.input.focus();
            }
        });

        const { popoverProps = {} } = this.props;
        Utils.safeInvoke(popoverProps.popoverDidOpen);
    };

    private handlePopoverWillClose = () => {
        // restore focus to saved element.
        // timeout allows popover to begin closing and remove focus handlers beforehand.
        requestAnimationFrame(() => {
            if (this.previousFocusedElement !== undefined) {
                this.previousFocusedElement.focus();
                this.previousFocusedElement = undefined;
            }
        });

        const { popoverProps = {} } = this.props;
        Utils.safeInvoke(popoverProps.popoverWillClose);
    };

    private handleQueryChange = (event: React.FormEvent<HTMLInputElement>) => {
        const { inputProps = {}, onQueryChange } = this.props;
        const query = event.currentTarget.value;
        this.setState({ query });
        Utils.safeInvoke(inputProps.onChange, event);
        Utils.safeInvoke(onQueryChange, query);
    };

    private resetQuery = () => {
        const { items, onQueryChange } = this.props;
        const query = "";
        this.setState({ activeItem: items[0], query });
        Utils.safeInvoke(onQueryChange, query);
    };
}
