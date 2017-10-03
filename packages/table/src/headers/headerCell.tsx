/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as React from "react";

import { Classes as CoreClasses, ContextMenuTarget, IProps, Utils as CoreUtils } from "@blueprintjs/core";
import * as Classes from "../common/classes";
import { ResizeHandle } from "../interactions/resizeHandle";

export interface IHeaderCellProps extends IProps {
    /**
     * The index of the cell in the header. If provided, this will be passed as an argument to any
     * callbacks when they are invoked.
     */
    index?: number;

    /**
     * If `true`, will apply the active class to the header to indicate it is
     * part of an external operation.
     */
    isActive?: boolean;

    /**
     * If `true`, the row/column `name` will be replaced with a fixed-height skeleton, and the
     * `resizeHandle` will not be rendered. If passing in additional children to this component, you
     * will also want to conditionally apply the `.pt-skeleton` class where appropriate.
     * @default false
     */
    loading?: boolean;

    /**
     * An element, like a `<Menu>`, this is displayed by right-clicking
     * anywhere in the header.
     * @deprecated since v1.17.0; use `renderMenu` instead
     */
    menu?: JSX.Element;

    /**
     * The name displayed in the header of the row/column.
     */
    name?: string;

    /**
     * A callback that returns an element, like a `<Menu>`, which is displayed by right-clicking
     * anywhere in the header. The callback will receive the cell index if it was provided via
     * props.
     */
    renderMenu?: (index?: number) => JSX.Element;

    /**
     * A `ReorderHandle` React component that allows users to drag-reorder the column header.
     */
    reorderHandle?: JSX.Element;

    /**
     * A `ResizeHandle` React component that allows users to drag-resize the header.
     */
    resizeHandle?: ResizeHandle;

    /**
     * CSS styles for the top level element.
     */
    style?: React.CSSProperties;
}

export interface IInternalHeaderCellProps extends IHeaderCellProps {
    /**
     * Specifies if the cell is reorderable.
     * @deprecated since 1.21.0; pass `isReorderable` to `ColumnHeader` or `RowHeader` instead
     */
    isReorderable?: boolean;

    /**
     * Specifies if the cell is selected.
     */
    isSelected?: boolean;
}

export interface IHeaderCellState {
    isActive: boolean;
}

@ContextMenuTarget
export class HeaderCell extends React.Component<IInternalHeaderCellProps, IHeaderCellState> {
    public state: IHeaderCellState = {
        isActive: false,
    };

    public shouldComponentUpdate(nextProps: IHeaderCellProps) {
        return (
            !CoreUtils.shallowCompareKeys(this.props, nextProps, { exclude: ["style"] }) ||
            !CoreUtils.deepCompareKeys(this.props, nextProps, ["style"])
        );
    }

    public renderContextMenu(_event: React.MouseEvent<HTMLElement>) {
        const { renderMenu } = this.props;

        if (CoreUtils.isFunction(renderMenu)) {
            // the preferred way (a consistent function instance that won't cause as many re-renders)
            return renderMenu(this.props.index);
        } else {
            // the deprecated way (leads to lots of unnecessary re-renders because of menu-item
            // callbacks needing access to the index of the right-clicked cell, which demands that
            // new callback functions and JSX elements be recreated on each render of the parent)
            return this.props.menu;
        }
    }

    public render() {
        const classes = classNames(
            Classes.TABLE_HEADER,
            {
                [Classes.TABLE_HEADER_ACTIVE]: this.props.isActive || this.state.isActive,
                [Classes.TABLE_HEADER_SELECTED]: this.props.isSelected,
                [CoreClasses.LOADING]: this.props.loading,
            },
            this.props.className,
        );

        return (
            <div className={classes} style={this.props.style}>
                {this.props.children}
            </div>
        );
    }
}
