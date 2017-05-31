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
import { ICoreInputListProps, IInputListRenderProps, InputList } from "./inputList";

export interface ISelectProps<T> extends ICoreInputListProps<T> {
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
    itemRenderer: (item: T, isActive: boolean, onClick: React.MouseEventHandler<HTMLElement>) => JSX.Element;

    /** React child to render when filtering items returns zero results. */
    noResults?: string | JSX.Element;

    /** React props to spread to `InputGroup`. All props are supported except `ref` (use `inputRef` instead). */
    inputProps?: IInputGroupProps & HTMLInputProps;

    /** React props to spread to `Popover`. Note that `content` cannot be changed. */
    popoverProps?: Partial<IPopoverProps> & object;
}

export interface ISelectState {
    isOpen: boolean;
}

@PureRender
export class Select<T> extends AbstractComponent<ISelectProps<T>, ISelectState> {
    public static displayName = "Blueprint.Select";

    public static ofType<T>() {
        return Select as new () => Select<T>;
    }

    public state: ISelectState = { isOpen: false };

    private DInputList = InputList.ofType<T>();
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
        return <this.DInputList
            renderer={this.renderInputList}
            {...props}
            ref={this.refHandlers.inputList}
            onItemSelect={this.handleItemSelect}
            onKeyDown={this.handleTargetKeyDown}
        />;
    }

    public componentDidUpdate(_prevProps: ISelectProps<T>, prevState: ISelectState) {
        if (this.state.isOpen && !prevState.isOpen && this.inputList != null) {
            this.inputList.scrollActiveItemIntoView();
        }
    }

    private renderInputList = (listProps: IInputListRenderProps<T>) => {
        // not using defaultProps cuz they're hard to type with generics (can't use <T> on static members)
        const { filterable = true, inputProps = {}, popoverProps = {} } = this.props;
        const { onKeyDown, onKeyUp, onQueryChange, query } = listProps;

        const { ref, ...htmlInputProps } = inputProps;
        const input = (
            <InputGroup
                autoFocus={true}
                leftIconName="search"
                onChange={onQueryChange}
                placeholder="Filter..."
                rightElement={this.maybeRenderInputClearButton()}
                value={query}
                {...htmlInputProps}
            />
        );

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
                    onKeyDown={this.state.isOpen ? onKeyDown : this.handleTargetKeyDown}
                    onKeyUp={this.state.isOpen && onKeyUp}
                >
                    {this.props.children}
                </div>
                <div onKeyDown={onKeyDown} onKeyUp={onKeyUp}>
                    {filterable ? input : undefined}
                    <ul className={Classes.MENU} ref={listProps.itemsParentRef}>
                        {this.renderItems(listProps)}
                    </ul>
                </div>
            </Popover>
        );
    }

    private renderItems({ activeItem, items, onItemSelect }: IInputListRenderProps<T>) {
        const { itemRenderer, noResults } = this.props;
        return items.length > 0
            ? items.map((item) => itemRenderer(item, item === activeItem, (e) => onItemSelect(item, e)))
            : noResults;
    }

    private maybeRenderInputClearButton() {
        return this.props.query.length > 0
            ? <Button className={Classes.MINIMAL} iconName="cross" onClick={this.clearQuery} />
            : undefined;
    }

    private clearQuery = () => this.props.onQueryChange(undefined);

    private handleTargetKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        // open popover when arrow key pressed on target while closed
        if (event.which === Keys.ARROW_UP || event.which === Keys.ARROW_DOWN) {
            this.setState({ isOpen: true });
        }
    }

    private handleItemSelect = (item: T, event: React.SyntheticEvent<HTMLElement>) => {
        this.setState({ isOpen: false });
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
    }

    private handlePopoverDidOpen = () => {
        // scroll active item into view after popover transition completes and all dimensions are stable.
        if (this.inputList != null) {
            this.inputList.scrollActiveItemIntoView();
        }
    }

    private handlePopoverWillClose = () => {
        // restore focus to saved element.
        // timeout allows popover to begin closing and remove focus handlers beforehand.
        this.setTimeout(() => {
            if (this.previousFocusedElement !== undefined) {
                this.previousFocusedElement.focus();
                this.previousFocusedElement = undefined;
            }
        });
    }
}
