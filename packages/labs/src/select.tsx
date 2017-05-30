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

// a quick SFC to conditionally render InputGroup "X" button
const InputClearButton: React.SFC<{ onClick: React.MouseEventHandler<HTMLElement>, visible: boolean }>
    = ({ onClick, visible }) => {
        return visible ? <Button className={Classes.MINIMAL} iconName="cross" onClick={onClick} /> : null;
    };

export interface ISelectProps<D> extends ICoreInputListProps<D> {
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
    itemRenderer: (item: D, isActive: boolean, onClick: React.MouseEventHandler<HTMLElement>) => JSX.Element;

    /** React child to render when filtering items returns zero results. */
    noResults?: string | JSX.Element;

    /** React props to spread to `InputGroup`. All props are supported except `ref` (use `inputRef` instead). */
    inputProps?: IInputGroupProps & HTMLInputProps;

    /** React props to spread to `Popover`. Note that `content` cannot be changed. */
    popoverProps?: Partial<IPopoverProps>;
}

@PureRender
export class Select<D> extends React.Component<ISelectProps<D>, {}> {
    public static displayName = "Blueprint.Select";
    public static defaultProps: Partial<ISelectProps<any>> = {
        filterable: true,
        inputProps: {},
        popoverProps: {},
    };

    public static ofType<T>() { return Select as new () => Select<T>; }

    private DInputList = InputList.ofType<D>();

    public render() {
        // omit props specific to this component, spread the rest.
        // TODO: should InputList just support arbitrary props? could be useful for re-rendering
        const { filterable, itemRenderer, inputProps, noResults, popoverProps, ...props } = this.props;
        return <this.DInputList renderer={this.renderInputList} {...props} />;
    }

    private renderInputList = (listProps: IInputListRenderProps<D>) => {
        const { onKeyDown, onQueryChange, query } = listProps;

        const { ref, ...htmlInputProps } = this.props.inputProps;
        const input = (
            <InputGroup
                autoFocus={true}
                leftIconName="search"
                onChange={onQueryChange}
                placeholder="Filter..."
                rightElement={<InputClearButton onClick={this.clearQuery} visible={query.length > 0} />}
                value={query}
                {...htmlInputProps}
            />
        );

        const { popoverProps } = this.props;
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
                    {this.props.filterable ? input : undefined}
                    <ul className={Classes.MENU} ref={listProps.itemsParentRef}>
                        {this.renderItems(listProps)}
                    </ul>
                </div>
            </Popover>
        );
    }

    private renderItems({ activeItem, items, onItemSelect }: IInputListRenderProps<D>) {
        return items.length > 0
            ? items.map((item) => this.props.itemRenderer(item, item === activeItem, () => onItemSelect(item)))
            : this.props.noResults;
    }

    private clearQuery = () => this.props.onQueryChange(undefined);
}
