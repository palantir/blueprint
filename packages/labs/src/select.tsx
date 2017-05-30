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
    Button,
    Classes,
    HTMLInputProps,
    IInputGroupProps,
    InputGroup,
    IPopoverProps,
    Popover,
    Position,
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

@PureRender
export class Select<T> extends React.Component<ISelectProps<T>, {}> {
    public static displayName = "Blueprint.Select";

    public static ofType<T>() {
        return Select as new () => Select<T>;
    }

    private DInputList = InputList.ofType<T>();

    public render() {
        // omit props specific to this component, spread the rest.
        // TODO: should InputList just support arbitrary props? could be useful for re-rendering
        const { filterable, itemRenderer, inputProps, noResults, popoverProps, ...props } = this.props;
        return <this.DInputList renderer={this.renderInputList} {...props} />;
    }

    private renderInputList = (listProps: IInputListRenderProps<T>) => {
        // not using defaultProps cuz they're hard to type with generics (can't use <T> on static members)
        const { filterable = true, inputProps = {}, popoverProps = {} } = this.props;
        const { onKeyDown, onQueryChange, query } = listProps;

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
                position={Position.BOTTOM_LEFT}
                {...popoverProps}
                className={classNames(listProps.className, popoverProps.className)}
                popoverClassName={classNames("pt-select-popover", popoverProps.popoverClassName)}
            >
                <div onKeyDown={onKeyDown}>
                    {this.props.children}
                </div>
                <div onKeyDown={onKeyDown}>
                    {filterable ? input : undefined}
                    <ul className={Classes.MENU} ref={listProps.itemsParentRef}>
                        {this.renderItems(listProps)}
                    </ul>
                </div>
            </Popover>
        );
    }

    private renderItems({ activeItem, items, onItemSelect }: IInputListRenderProps<T>) {
        return items.length > 0
            ? items.map((item) => this.props.itemRenderer(item, item === activeItem, () => onItemSelect(item)))
            : this.props.noResults;
    }

    private maybeRenderInputClearButton() {
        return this.props.query.length > 0
            ? <Button className={Classes.MINIMAL} iconName="cross" onClick={this.clearQuery} />
            : undefined;
    }

    private clearQuery = () => this.props.onQueryChange(undefined);
}
