/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";

import {
    DISPLAYNAME_PREFIX,
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
     * The uncontrolled default selected item.
     * This prop is ignored if `selectedItem` is used to control the state.
     */
    defaultSelectedItem?: T;

    /**
     * The currently selected item, or `null` to indicate that no item is selected.
     * If omitted, this prop will be uncontrolled (managed by the component's state).
     * Use `onItemSelect` to listen for updates.
     */
    selectedItem?: T | null;

    /**
     * Whether the popover opens on key down or when the input is focused.
     * @default false
     */
    openOnKeyDown?: boolean;

    /** Props to spread to `Popover`. Note that `content` cannot be changed. */
    popoverProps?: Partial<IPopoverProps> & object;
}

export interface ISuggestState<T> {
    isOpen: boolean;
    selectedItem: T | null;
}

export class Suggest<T> extends React.PureComponent<ISuggestProps<T>, ISuggestState<T>> {
    public static displayName = `${DISPLAYNAME_PREFIX}.Suggest`;

    // Note: can't use <T> in static members, so this remains dynamically typed.
    public static defaultProps = {
        closeOnSelect: true,
        openOnKeyDown: false,
    };

    public static ofType<T>() {
        return Suggest as new (props: ISuggestProps<T>) => Suggest<T>;
    }

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

    constructor(props: ISuggestProps<T>, context?: any) {
        super(props, context);
        this.state = {
            isOpen: (props.popoverProps && props.popoverProps.isOpen) || false,
            selectedItem: this.getInitialSelectedItem(),
        };
    }

    public render() {
        // omit props specific to this component, spread the rest.
        const { inputProps, popoverProps, ...restProps } = this.props;

        return (
            <this.TypedQueryList
                {...restProps}
                onItemSelect={this.handleItemSelect}
                ref={this.refHandlers.queryList}
                renderer={this.renderQueryList}
            />
        );
    }

    public componentWillReceiveProps(nextProps: ISuggestProps<T>) {
        // If the selected item prop changes, update the underlying state.
        if (nextProps.selectedItem !== undefined && nextProps.selectedItem !== this.state.selectedItem) {
            this.setState({ selectedItem: nextProps.selectedItem });
        }
    }

    public componentDidUpdate(_prevProps: ISuggestProps<T>, prevState: ISuggestState<T>) {
        if (this.state.isOpen && !prevState.isOpen && this.queryList != null) {
            this.queryList.scrollActiveItemIntoView();
        }
    }

    private renderQueryList = (listProps: IQueryListRendererProps<T>) => {
        const { inputProps = {}, popoverProps = {} } = this.props;
        const { isOpen, selectedItem } = this.state;
        const { handleKeyDown, handleKeyUp } = listProps;
        const { placeholder = "Search..." } = inputProps;

        const selectedItemText = selectedItem ? this.props.inputValueRenderer(selectedItem) : "";
        return (
            <Popover
                autoFocus={false}
                enforceFocus={false}
                isOpen={isOpen}
                position={Position.BOTTOM_LEFT}
                {...popoverProps}
                className={classNames(listProps.className, popoverProps.className)}
                onInteraction={this.handlePopoverInteraction}
                popoverClassName={classNames(Classes.SELECT_POPOVER, popoverProps.popoverClassName)}
                onOpened={this.handlePopoverOpened}
            >
                <InputGroup
                    {...inputProps}
                    placeholder={isOpen && selectedItemText ? selectedItemText : placeholder}
                    inputRef={this.refHandlers.input}
                    onChange={listProps.handleQueryChange}
                    onFocus={this.handleInputFocus}
                    onKeyDown={this.getTargetKeyDownHandler(handleKeyDown)}
                    onKeyUp={this.getTargetKeyUpHandler(handleKeyUp)}
                    value={isOpen ? listProps.query : selectedItemText}
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

        // TODO can we leverage Popover.openOnTargetFocus for this?
        if (!openOnKeyDown) {
            this.setState({ isOpen: true });
        }

        Utils.safeInvoke(inputProps.onFocus, event);
    };

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
        // the internal state should only change when uncontrolled.
        if (this.props.selectedItem === undefined) {
            this.setState({
                isOpen: nextOpenState,
                selectedItem: item,
            });
        } else {
            // otherwise just set the next open state.
            this.setState({ isOpen: nextOpenState });
        }

        Utils.safeInvoke(this.props.onItemSelect, item, event);
    };

    private getInitialSelectedItem(): T | null {
        // controlled > uncontrolled > default
        if (this.props.selectedItem !== undefined) {
            return this.props.selectedItem;
        } else if (this.props.defaultSelectedItem !== undefined) {
            return this.props.defaultSelectedItem;
        } else {
            return null;
        }
    }

    private handlePopoverInteraction = (nextOpenState: boolean) =>
        requestAnimationFrame(() => {
            const { popoverProps = {} } = this.props;

            if (this.input != null && this.input !== document.activeElement) {
                // the input is no longer focused so we can close the popover
                this.setState({ isOpen: false });
            }

            Utils.safeInvoke(popoverProps.onInteraction, nextOpenState);
        });

    private handlePopoverOpened = (node: HTMLElement) => {
        const { popoverProps = {} } = this.props;

        // scroll active item into view after popover transition completes and all dimensions are stable.
        if (this.queryList != null) {
            this.queryList.scrollActiveItemIntoView();
        }

        Utils.safeInvoke(popoverProps.onOpened, node);
    };

    private getTargetKeyDownHandler = (
        handleQueryListKeyDown: React.EventHandler<React.KeyboardEvent<HTMLElement>>,
    ) => {
        return (evt: React.KeyboardEvent<HTMLInputElement>) => {
            const { which } = evt;
            const { inputProps = {}, openOnKeyDown } = this.props;

            if (which === Keys.ESCAPE || which === Keys.TAB) {
                if (this.input != null) {
                    this.input.blur();
                }
                this.setState({
                    isOpen: false,
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
