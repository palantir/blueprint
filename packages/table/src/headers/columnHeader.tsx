/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as React from "react";

import * as Classes from "../common/classes";
import { IColumnIndices } from "../common/grid";
import { Utils } from "../common/index";
import { IClientCoordinates } from "../interactions/draggable";
import { IIndexedResizeCallback } from "../interactions/resizable";
import { Orientation } from "../interactions/resizeHandle";
import { IRegion, RegionCardinality, Regions } from "../regions";
import { AbstractHeader, IHeaderProps } from "./abstractHeader";
import { ColumnHeaderCell, IColumnHeaderCellProps } from "./columnHeaderCell";

export type IColumnHeaderRenderer = (columnIndex: number) => React.ReactElement<IColumnHeaderCellProps>;

export interface IColumnWidths {
    minColumnWidth?: number;
    maxColumnWidth?: number;
    defaultColumnWidth?: number;
}

export interface IColumnHeaderProps extends IHeaderProps, IColumnWidths, IColumnIndices {
    /**
     * A IColumnHeaderRenderer that, for each `<Column>`, will delegate to:
     * 1. The `renderColumnHeader` method from the `<Column>`
     * 2. A `<ColumnHeaderCell>` using the `name` prop from the `<Column>`
     * 3. A `<ColumnHeaderCell>` with a `name` generated from `Utils.toBase26Alpha`
     */
    cellRenderer: IColumnHeaderRenderer;

    /**
     * A callback invoked when user is done resizing the column
     */
    onColumnWidthChanged: IIndexedResizeCallback;

    /**
     * This callback is called while the user is resizing a column. The guides
     * array contains pixel offsets for where to display the resize guides in
     * the table body's overlay layer.
     */
    onResizeGuide: (guides: number[]) => void;
}

export class ColumnHeader extends AbstractHeader<IColumnHeaderProps> {
    public static defaultProps = {
        isReorderable: false,
        isResizable: true,
        loading: false,
    };

    public render() {
        const { grid, viewportRect, columnIndexStart } = this.props;

        // always set width so that the layout can push out the element unless it overflows.
        const style: React.CSSProperties = {
            width: `${grid.getRect().width}px`,
        };

        // use CSS translation to offset the cells
        if (viewportRect != null) {
            style.transform = `translate3d(${grid.getColumnRect(columnIndexStart).left - viewportRect.left}px, 0, 0)`;
        }

        const classes = classNames(Classes.TABLE_THEAD, Classes.TABLE_COLUMN_HEADER_TR, {
            [Classes.TABLE_DRAGGABLE] : (this.props.onSelection != null),
        });

        return (
            <div style={style} className={classes}>
                {this.renderCells()}
            </div>
        );
    }

    protected convertPointToIndex(clientXOrY: number, useMidpoint?: boolean) {
        return this.props.locator.convertPointToColumn(clientXOrY, useMidpoint);
    }

    protected getCellExtremaClasses(index: number, endIndex: number) {
        return this.props.grid.getExtremaClasses(0, index, 1, endIndex);
    }

    protected getCellIndexClass(index: number) {
        return Classes.columnCellIndexClass(index);
    }

    protected getCellSize(index: number) {
        return this.props.grid.getColumnRect(index).width;
    }

    protected getDragCoordinate(clientCoords: IClientCoordinates) {
        return clientCoords[0]; // x-coordinate
    }

    protected getEndIndex() {
        return this.props.columnIndexEnd;
    }

    protected getFullRegionCardinality() {
        return RegionCardinality.FULL_COLUMNS;
    }

    protected getIndexClass(index: number) {
        return Classes.columnIndexClass(index);
    }

    protected getMaxSize() {
        return this.props.maxColumnWidth;
    }

    protected getMinSize() {
        return this.props.minColumnWidth;
    }

    protected getMouseCoordinate(event: MouseEvent) {
        return event.clientX;
    }

    protected getStartIndex() {
        return this.props.columnIndexStart;
    }

    protected handleResizeEnd(index: number, size: number) {
        this.props.onResizeGuide(null);
        this.props.onColumnWidthChanged(index, size);
    }

    protected handleSizeChanged(index: number, size: number) {
        const rect = this.props.grid.getColumnRect(index);
        this.props.onResizeGuide([rect.left + size]);
    }

    protected handleDoubleClick(index: number) {
        const { minColumnWidth, maxColumnWidth } = this.props;

        const width = this.props.locator.getWidestVisibleCellInColumn(index);
        const clampedWidth = Utils.clamp(width, minColumnWidth, maxColumnWidth);

        this.props.onResizeGuide(null);
        this.props.onColumnWidthChanged(index, clampedWidth);
    }

    protected isCellSelected(index: number) {
        return Regions.hasFullColumn(this.props.selectedRegions, index);
    }

    protected isGhostIndex(index: number) {
        return this.props.grid.isGhostIndex(-1, index);
    }

    protected getResizeOrientation() {
        return Orientation.VERTICAL;
    }

    protected renderHeaderCell(index: number) {
        return this.props.cellRenderer(index);
    }

    protected renderGhostCell(index: number, extremaClasses: string[]) {
        const { grid, loading } = this.props;
        const rect = grid.getGhostCellRect(0, index);
        const style = {
            flexBasis: `${rect.width}px`,
            width: `${rect.width}px`,
        };
        return (
            <ColumnHeaderCell
                key={Classes.columnIndexClass(index)}
                className={classNames(extremaClasses)}
                loading={loading}
                style={style}
            />);
    }

    protected toRegion(index1: number, index2?: number): IRegion {
        return Regions.column(index1, index2);
    }
}
