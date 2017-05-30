/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as React from "react";

import { Classes as CoreClasses, ContextMenuTarget, IProps } from "@blueprintjs/core";
import * as Classes from "../common/classes";
import { Utils } from "../common/utils";
import { ResizeHandle } from "../interactions/resizeHandle";

export interface IHeaderCellProps extends IProps {
    /**
     * If `true`, will apply the active class to the header to indicate it is
     * part of an external operation.
     */
    isActive?: boolean;

    /**
     * The name displayed in the header of the row/column.
     */
    name?: string;

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
     */
    menu?: JSX.Element;

    /**
     * A `ResizeHandle` React component that allows users to drag-resize the
     * header.
     */
    resizeHandle?: ResizeHandle;

    /**
     * CSS styles for the top level element.
     */
    style?: React.CSSProperties;
}

export interface IAbstractHeaderCellProps extends IHeaderCellProps {
    /**
     * Specifies if the cell is reorderable.
     */
    isReorderable?: boolean;

    /**
     * Specifies if the cell is selected.
     */
    isSelected?: boolean;

    /**
     * Props that should be shallowly compared in shouldComponentUpdate.
     */
    shallowlyComparablePropKeys?: string[];
}

export interface IAbstractHeaderCellState {
    isActive: boolean;
}

@ContextMenuTarget
export class AbstractHeaderCell  extends React.Component<IAbstractHeaderCellProps, IAbstractHeaderCellState> {
    public state: IAbstractHeaderCellState = {
        isActive: false,
    };

    public shouldComponentUpdate(nextProps: IHeaderCellProps) {
        return !Utils.shallowCompareKeys(this.props, nextProps, this.props.shallowlyComparablePropKeys)
            || !Utils.deepCompareKeys(this.props.style, nextProps.style);
    }

    public renderContextMenu(_event: React.MouseEvent<HTMLElement>) {
        return this.props.menu;
    }

    public render() {
        const classes = classNames(Classes.TABLE_HEADER, {
            [Classes.TABLE_HEADER_ACTIVE]: this.props.isActive || this.state.isActive,
            [Classes.TABLE_HEADER_REORDERABLE]: this.props.isReorderable,
            [Classes.TABLE_HEADER_SELECTED]: this.props.isSelected,
            [CoreClasses.LOADING]: this.props.loading,
        }, this.props.className);

        return (
            <div className={classes} style={this.props.style}>
                {this.props.children}
            </div>
        );
    }
}
