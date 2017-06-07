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
    Button,
    Classes,
    HTMLInputProps,
    IInputGroupProps,
    InputGroup,
    IPopoverProps,
    Keys,
    Popover,
    Position,
    Utils,
} from "@blueprintjs/core";
import { IInputListRendererProps, IListItemsProps, InputList } from "./inputList";

export interface ISelectProps<T> extends IListItemsProps<T> {
    /**
     * Whether the dropdown list can be filtered.
     * Disabling this option will remove the `InputGroup` and ignore `inputProps`.
     * @default true
     */
    filterable?: boolean;

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

    /** Props to spread to `Popover`. Note that `content` cannot be changed. */
    popoverProps?: Partial<IPopoverProps>;

    /**
     * Whether the filtering state should be reset to initial when an item is selected
     * (immediately before `onItemSelect` is invoked). The query will become the empty string
     * and the first item will be made active.
     * @default false
     */
    resetOnSelect?: boolean;
}

export interface ISelectItemRendererProps<T> {
    /**
     * Click handler that should be attached to item's `onClick` event.
     * Will invoke `Select` `onItemSelect` prop with this `item`.
     */
    handleClick: React.MouseEventHandler<HTMLElement>;

    /** Index of item in array of filtered items (_not_ the absolute position of item in full array). */
    index: number;

    /** The item being rendered */
    item: T;

    /**
     * Whether the item is active according to keyboard navigation.
     * An active item should have a distinct visual appearance.
     */
    isActive: boolean;
}

export interface ISelectState<T> {
    activeItem?: T;
    isOpen?: boolean;
    query?: string;
}

@PureRender
export class Select<T> extends AbstractComponent<ISelectProps<T>, ISelectState<T>> {
    public static displayName = "Blueprint.Select";

    public static ofType<T>() {
        return Select as new () => Select<T>;
    }

    public state: ISelectState<T> = { isOpen: false, query: "" };

    private TypedInputList = InputList.ofType<T>();
    private inputList: InputList<T>;
    private refHandlers = {
        inputList: (ref: InputList<T>) => {
            this.inputList = ref;
            (window as any).inputList = ref;
        },
    };
    private previousFocusedElement: HTMLElement;

    public render() {
        // omit props specific to this component, spread the rest.
        // TODO: should InputList just support arbitrary props? could be useful for re-rendering
        const { filterable, itemRenderer, inputProps, noResults, popoverProps, ...props } = this.props;
        return <this.TypedInputList
            {...props}
            activeItem={this.state.activeItem}
            onActiveItemChange={this.handleActiveItemChange}
            onItemSelect={this.handleItemSelect}
            query={this.state.query}
            ref={this.refHandlers.inputList}
            renderer={this.renderInputList}
        />;
    }

    public componentDidUpdate(_prevProps: ISelectProps<T>, prevState: ISelectState<T>) {
        if (this.state.isOpen && !prevState.isOpen && this.inputList != null) {
            this.inputList.scrollActiveItemIntoView();
        }
    }

    private renderInputList = (listProps: IInputListRendererProps<T>) => {
        // not using defaultProps cuz they're hard to type with generics (can't use <T> on static members)
        const { filterable = true, inputProps = {}, popoverProps = {} } = this.props;

        const { ref, ...htmlInputProps } = inputProps;
        const input = (
            <InputGroup
                autoFocus={true}
                leftIconName="search"
                onChange={this.handleQueryChange}
                placeholder="Filter..."
                rightElement={this.maybeRenderInputClearButton()}
                value={listProps.query}
                {...htmlInputProps}
            />
        );

        const { handleKeyDown, handleKeyUp } = listProps;
        return (
            <Popover
                autoFocus={false}
                enforceFocus={false}
                isOpen={this.state.isOpen}
                position={Position.BOTTOM_LEFT}
                {...popoverProps}
                className={classNames(listProps.className, popoverProps.className)}
                onInteraction={this.handlePopoverInteraction}
                popoverClassName={classNames("pt-select-popover", popoverProps.popoverClassName)}
                popoverWillOpen={this.handlePopoverWillOpen}
                popoverDidOpen={this.handlePopoverDidOpen}
                popoverWillClose={this.handlePopoverWillClose}
            >
                <div
                    onKeyDown={this.state.isOpen ? handleKeyDown : this.handleTargetKeyDown}
                    onKeyUp={this.state.isOpen && handleKeyUp}
                >
                    {this.props.children}
                </div>
                <div onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>
                    {filterable ? input : undefined}
                    <ul className={Classes.MENU} ref={listProps.itemsParentRef}>
                        {this.renderItems(listProps)}
                    </ul>
                </div>
            </Popover>
        );
    }

    private renderItems({ activeItem, filteredItems, handleItemSelect }: IInputListRendererProps<T>) {
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

    private maybeRenderInputClearButton() {
        return this.state.query.length > 0
            ? <Button className={Classes.MINIMAL} iconName="cross" onClick={this.resetQuery} />
            : undefined;
    }

    private handleActiveItemChange = (activeItem: T) => this.setState({ activeItem });

    private handleTargetKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        // open popover when arrow key pressed on target while closed
        if (event.which === Keys.ARROW_UP || event.which === Keys.ARROW_DOWN) {
            this.setState({ isOpen: true });
        }
    }

    private handleItemSelect = (item: T, event: React.SyntheticEvent<HTMLElement>) => {
        this.setState({ isOpen: false });
        if (this.props.resetOnSelect) {
            this.resetQuery();
        }
        Utils.safeInvoke(this.props.onItemSelect, item, event);
    }

    private handlePopoverInteraction = (isOpen: boolean) => {
        this.setState({ isOpen });

        const { popoverProps = {} } = this.props;
        Utils.safeInvoke(popoverProps.onInteraction, isOpen);
    }

    private handlePopoverWillOpen = () => {
        // save currently focused element before popover steals focus, so we can restore it when closing.
        this.previousFocusedElement = document.activeElement as HTMLElement;

        const { popoverProps = {} } = this.props;
        Utils.safeInvoke(popoverProps.popoverWillOpen);
    }

    private handlePopoverDidOpen = () => {
        // scroll active item into view after popover transition completes and all dimensions are stable.
        if (this.inputList != null) {
            this.inputList.scrollActiveItemIntoView();
        }

        const { popoverProps = {} } = this.props;
        Utils.safeInvoke(popoverProps.popoverDidOpen);
    }

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
    }

    private handleQueryChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({ query: event.currentTarget.value });
    }
    private resetQuery = () => this.setState({ activeItem: this.props.items[0], query: "" });
}
