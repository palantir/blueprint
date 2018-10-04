/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";

import {
    Button,
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
     * Props to spread to the query `InputGroup`. Use `query` and
     * `onQueryChange` instead of `inputProps.value` and `inputProps.onChange`
     * to control this input. Use `inputRef` instead of `ref`.
     */
    inputProps?: IInputGroupProps & HTMLInputProps;

    /** Props to spread to `Popover`. Note that `content` cannot be changed. */
    popoverProps?: Partial<IPopoverProps> & object;

    /**
     * Whether the active item should be reset to the first matching item _when
     * the popover closes_. The query will also be reset to the empty string.
     * @default false
     */
    resetOnClose?: boolean;
}

export interface ISelectState {
    isOpen: boolean;
}

export class Select<T> extends React.PureComponent<ISelectProps<T>, ISelectState> {
    public static displayName = `${DISPLAYNAME_PREFIX}.Select`;

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
        this.state = { isOpen: false };
    }

    public render() {
        // omit props specific to this component, spread the rest.
        const { filterable, inputProps, popoverProps, ...restProps } = this.props;

        return (
            <this.TypedQueryList
                {...restProps}
                onItemSelect={this.handleItemSelect}
                ref={this.refHandlers.queryList}
                renderer={this.renderQueryList}
            />
        );
    }

    public componentDidUpdate(_prevProps: ISelectProps<T>, prevState: ISelectState) {
        if (this.state.isOpen && !prevState.isOpen && this.list != null) {
            this.list.scrollActiveItemIntoView();
        }
    }

    private renderQueryList = (listProps: IQueryListRendererProps<T>) => {
        // not using defaultProps cuz they're hard to type with generics (can't use <T> on static members)
        const { filterable = true, disabled = false, inputProps = {}, popoverProps = {} } = this.props;

        const input = (
            <InputGroup
                leftIcon="search"
                placeholder="Filter..."
                rightElement={this.maybeRenderClearButton(listProps.query)}
                {...inputProps}
                inputRef={this.refHandlers.input}
                onChange={listProps.handleQueryChange}
                value={listProps.query}
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
                onOpening={this.handlePopoverOpening}
                onOpened={this.handlePopoverOpened}
                onClosing={this.handlePopoverClosing}
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

    private maybeRenderClearButton(query: string) {
        return query.length > 0 ? <Button icon="cross" minimal={true} onClick={this.resetQuery} /> : undefined;
    }

    private handleTargetKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        // open popover when arrow key pressed on target while closed
        if (event.which === Keys.ARROW_UP || event.which === Keys.ARROW_DOWN) {
            event.preventDefault();
            this.setState({ isOpen: true });
        }
    };

    private handleItemSelect = (item: T, event?: React.SyntheticEvent<HTMLElement>) => {
        this.setState({ isOpen: false });
        Utils.safeInvoke(this.props.onItemSelect, item, event);
    };

    private handlePopoverInteraction = (isOpen: boolean) => {
        this.setState({ isOpen });

        const { popoverProps = {} } = this.props;
        Utils.safeInvoke(popoverProps.onInteraction, isOpen);
    };

    private handlePopoverOpening = (node: HTMLElement) => {
        const { popoverProps = {}, resetOnClose } = this.props;
        // save currently focused element before popover steals focus, so we can restore it when closing.
        this.previousFocusedElement = document.activeElement as HTMLElement;

        if (resetOnClose) {
            this.resetQuery();
        }

        Utils.safeInvoke(popoverProps.onOpening, node);
    };

    private handlePopoverOpened = (node: HTMLElement) => {
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
        Utils.safeInvoke(popoverProps.onOpened, node);
    };

    private handlePopoverClosing = (node: HTMLElement) => {
        // restore focus to saved element.
        // timeout allows popover to begin closing and remove focus handlers beforehand.
        requestAnimationFrame(() => {
            if (this.previousFocusedElement !== undefined) {
                this.previousFocusedElement.focus();
                this.previousFocusedElement = undefined;
            }
        });

        const { popoverProps = {} } = this.props;
        Utils.safeInvoke(popoverProps.onClosing, node);
    };

    private resetQuery = () => this.list && this.list.setQuery("", true);
}
