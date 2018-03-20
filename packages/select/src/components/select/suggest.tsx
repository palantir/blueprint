/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";

import {
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

export interface ISuggestProps<T> extends IListItemsProps<T> {
    /**
     * Whether the popover should close after selecting an item.
     * @default true
     */
    closeOnSelect?: boolean;

    /**
     * Props to spread to `InputGroup`. All props are supported except `ref` (use `inputRef` instead).
     * If you want to control the filter input, you can pass `value` and `onChange` here
     * to override `Suggest`'s own behavior.
     */
    inputProps?: IInputGroupProps & HTMLInputProps;

    /** Custom renderer to transform an item into a string for the input value. */
    inputValueRenderer: (item: T) => string;

    /**
     * Whether the popover opens on key down or when the input is focused.
     * @default false
     */
    openOnKeyDown?: boolean;

    /** Props to spread to `Popover`. Note that `content` cannot be changed. */
    popoverProps?: Partial<IPopoverProps> & object;
}

export interface ISuggestState<T> {
    activeItem?: T;
    isOpen: boolean;
    isTyping: boolean;
    query: string;
    selectedItem?: T;
}

export class Suggest<T> extends React.PureComponent<ISuggestProps<T>, ISuggestState<T>> {
    public static displayName = "Blueprint2.Suggest";

    // Note: can't use <T> in static members, so this remains dynamically typed.
    public static defaultProps = {
        closeOnSelect: true,
        openOnKeyDown: false,
    };

    public static ofType<T>() {
        return Suggest as new (props: ISuggestProps<T>) => Suggest<T>;
    }

    public state: ISuggestState<T> = {
        isOpen: false,
        isTyping: false,
        query: "",
    };

    private TypedQueryList = QueryList.ofType<T>();
    private input?: HTMLInputElement | null;
    private queryList?: QueryList<T> | null;
    private refHandlers = {
        input: (ref: HTMLInputElement | null) => {
            this.input = ref;
            const { inputProps = {} } = this.props;
            Utils.safeInvoke(inputProps.inputRef, ref);
        },
        queryList: (ref: QueryList<T> | null) => (this.queryList = ref),
    };

    public render() {
        // omit props specific to this component, spread the rest.
        const { inputProps, popoverProps, ...restProps } = this.props;

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

    public componentDidUpdate(_prevProps: ISuggestProps<T>, prevState: ISuggestState<T>) {
        if (this.state.isOpen && !prevState.isOpen && this.queryList != null) {
            this.queryList.scrollActiveItemIntoView();
        }
    }

    private renderQueryList = (listProps: IQueryListRendererProps<T>) => {
        const { inputValueRenderer, inputProps = {}, popoverProps = {} } = this.props;
        const { isTyping, selectedItem, query } = this.state;
        const { handleKeyDown, handleKeyUp } = listProps;
        const inputValue: string = isTyping ? query : selectedItem ? inputValueRenderer(selectedItem) : "";

        return (
            <Popover
                autoFocus={false}
                enforceFocus={false}
                isOpen={this.state.isOpen}
                position={Position.BOTTOM_LEFT}
                {...popoverProps}
                className={classNames(listProps.className, popoverProps.className)}
                onInteraction={this.handlePopoverInteraction}
                popoverClassName={classNames(Classes.SELECT_POPOVER, popoverProps.popoverClassName)}
                popoverDidOpen={this.handlePopoverDidOpen}
                popoverWillClose={this.handlePopoverWillClose}
            >
                <InputGroup
                    placeholder="Search..."
                    value={inputValue}
                    {...inputProps}
                    inputRef={this.refHandlers.input}
                    onChange={this.handleQueryChange}
                    onFocus={this.handleInputFocus}
                    onKeyDown={this.getTargetKeyDownHandler(handleKeyDown)}
                    onKeyUp={this.getTargetKeyUpHandler(handleKeyUp)}
                />
                <div onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>
                    {listProps.itemList}
                </div>
            </Popover>
        );
    };

    private selectText = () => {
        // wait until the input is properly focused to select the text inside of it
        requestAnimationFrame(() => {
            if (this.input != null) {
                this.input.setSelectionRange(0, this.input.value.length);
            }
        });
    };

    private handleInputFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        const { openOnKeyDown, inputProps = {} } = this.props;

        this.selectText();

        if (!openOnKeyDown) {
            this.setState({ isOpen: true });
        }

        Utils.safeInvoke(inputProps.onFocus, event);
    };

    private handleActiveItemChange = (activeItem?: T) => this.setState({ activeItem });

    private handleItemSelect = (item: T, event?: React.SyntheticEvent<HTMLElement>) => {
        let nextOpenState: boolean;
        if (!this.props.closeOnSelect) {
            if (this.input != null) {
                this.input.focus();
            }
            this.selectText();
            nextOpenState = true;
        } else {
            if (this.input != null) {
                this.input.blur();
            }
            nextOpenState = false;
        }

        this.setState({
            isOpen: nextOpenState,
            isTyping: false,
            query: "",
            selectedItem: item,
        });

        Utils.safeInvoke(this.props.onItemSelect, item, event);
    };

    private handlePopoverInteraction = (nextOpenState: boolean) =>
        requestAnimationFrame(() => {
            const { popoverProps = {} } = this.props;

            if (this.input != null && this.input !== document.activeElement) {
                // the input is no longer focused so we can close the popover
                this.setState({ isOpen: false });
            }

            Utils.safeInvoke(popoverProps.onInteraction, nextOpenState);
        });

    private handlePopoverDidOpen = () => {
        const { popoverProps = {} } = this.props;

        // scroll active item into view after popover transition completes and all dimensions are stable.
        if (this.queryList != null) {
            this.queryList.scrollActiveItemIntoView();
        }

        Utils.safeInvoke(popoverProps.popoverDidOpen);
    };

    private handlePopoverWillClose = () => {
        const { popoverProps = {} } = this.props;
        const { selectedItem } = this.state;

        // reset the query when the popover close, make sure that the list
        // isn't filtered on when the popover opens next
        this.setState({
            activeItem: selectedItem ? selectedItem : this.props.items[0],
            query: "",
        });

        Utils.safeInvoke(popoverProps.popoverDidOpen);
    };

    private handleQueryChange = (event: React.FormEvent<HTMLInputElement>) => {
        const { inputProps = {} } = this.props;

        this.setState({
            isTyping: true,
            query: event.currentTarget.value,
        });

        Utils.safeInvoke(inputProps.onChange, event);
    };

    private getTargetKeyDownHandler = (
        handleQueryListKeyDown: React.EventHandler<React.KeyboardEvent<HTMLElement>>,
    ) => {
        return (evt: React.KeyboardEvent<HTMLInputElement>) => {
            const { which } = evt;
            const { isTyping, selectedItem } = this.state;
            const { inputProps = {}, openOnKeyDown } = this.props;

            if (which === Keys.ESCAPE || which === Keys.TAB) {
                if (this.input != null) {
                    this.input.blur();
                }
                this.setState({
                    isOpen: false,
                    selectedItem: isTyping ? undefined : selectedItem,
                });
            } else if (
                openOnKeyDown &&
                which !== Keys.BACKSPACE &&
                which !== Keys.ARROW_LEFT &&
                which !== Keys.ARROW_RIGHT
            ) {
                this.setState({ isOpen: true });
            }

            if (this.state.isOpen) {
                Utils.safeInvoke(handleQueryListKeyDown, evt);
            }

            Utils.safeInvoke(inputProps.onKeyDown, evt);
        };
    };

    private getTargetKeyUpHandler = (handleQueryListKeyUp: React.EventHandler<React.KeyboardEvent<HTMLElement>>) => {
        return (evt: React.KeyboardEvent<HTMLInputElement>) => {
            const { inputProps = {} } = this.props;
            if (this.state.isOpen) {
                Utils.safeInvoke(handleQueryListKeyUp, evt);
            }
            Utils.safeInvoke(inputProps.onKeyUp, evt);
        };
    };
}
