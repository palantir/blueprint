/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";

import * as Classes from "../common/classes";
import { IColumnIndices } from "../common/grid";
import { Utils } from "../common/index";
import { IClientCoordinates } from "../interactions/draggable";
import { IIndexedResizeCallback } from "../interactions/resizable";
import { Orientation } from "../interactions/resizeHandle";
import { RegionCardinality, Regions } from "../regions";
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
}

@PureRender
export class ColumnHeader extends React.Component<IColumnHeaderProps, {}> {
    public static defaultProps = {
        isReorderable: false,
        isResizable: true,
        loading: false,
    };

    public render() {
        return (
            <AbstractHeader
                allowMultipleSelection={this.props.allowMultipleSelection}
                convertPointToIndex={this.convertPointToColumn}
                endIndex={this.props.columnIndexEnd}
                fullRegionCardinality={RegionCardinality.FULL_COLUMNS}
                getCellExtremaClasses={this.getCellExtremaClasses}
                getCellIndexClass={Classes.columnCellIndexClass}
                getCellSize={this.getColumnWidth}
                getDragCoordinate={this.getDragCoordinate}
                getIndexClass={Classes.columnIndexClass}
                getMouseCoordinate={this.getMouseCoordinate}
                grid={this.props.grid}
                handleResizeDoubleClick={this.handleResizeDoubleClick}
                handleResizeEnd={this.handleResizeEnd}
                handleSizeChanged={this.handleSizeChanged}
                headerCellIsReorderablePropName={"isColumnReorderable"}
                headerCellIsSelectedPropName={"isColumnSelected"}
                isCellSelected={this.isCellSelected}
                isGhostIndex={this.isGhostIndex}
                isReorderable={this.props.isReorderable}
                isResizable={this.props.isResizable}
                loading={this.props.loading}
                locator={this.props.locator}
                maxSize={this.props.maxColumnWidth}
                minSize={this.props.minColumnWidth}
                onFocus={this.props.onFocus}
                onLayoutLock={this.props.onLayoutLock}
                onReordered={this.props.onReordered}
                onReordering={this.props.onReordering}
                onResizeGuide={this.props.onResizeGuide}
                onSelection={this.props.onSelection}
                renderGhostCell={this.renderGhostCell}
                renderHeaderCell={this.props.cellRenderer}
                resizeOrientation={Orientation.VERTICAL}
                selectedRegions={this.props.selectedRegions}
                selectedRegionTransform={this.props.selectedRegionTransform}
                startIndex={this.props.columnIndexStart}
                toRegion={this.toRegion}
                viewportRect={this.props.viewportRect}
                wrapCells={this.wrapCells}
            />
        );
    }

    private wrapCells = (cells: Array<React.ReactElement<any>>) => {
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
                {cells}
            </div>
        );
    }

    private convertPointToColumn = (clientXOrY: number, useMidpoint?: boolean) => {
        const { locator } = this.props;
        return locator != null ? locator.convertPointToColumn(clientXOrY, useMidpoint) : null;
    }

    private getCellExtremaClasses = (index: number, endIndex: number) => {
        return this.props.grid.getExtremaClasses(0, index, 1, endIndex);
    }

    private getColumnWidth = (index: number) => {
        return this.props.grid.getColumnRect(index).width;
    }

    private getDragCoordinate = (clientCoords: IClientCoordinates) => {
        return clientCoords[0]; // x-coordinate
    }

    private getMouseCoordinate = (event: MouseEvent) => {
        return event.clientX;
    }

    private handleResizeEnd = (index: number, size: number) => {
        this.props.onResizeGuide(null);
        this.props.onColumnWidthChanged(index, size);
    }

    private handleResizeDoubleClick = (index: number) => {
        const { minColumnWidth, maxColumnWidth } = this.props;

        const width = this.props.locator.getWidestVisibleCellInColumn(index);
        const clampedWidth = Utils.clamp(width, minColumnWidth, maxColumnWidth);

        this.props.onResizeGuide(null);
        this.props.onColumnWidthChanged(index, clampedWidth);
    }

    private handleSizeChanged = (index: number, size: number) => {
        const rect = this.props.grid.getColumnRect(index);
        this.props.onResizeGuide([rect.left + size]);
    }

    private isCellSelected = (index: number) => {
        return Regions.hasFullColumn(this.props.selectedRegions, index);
    }

    private isGhostIndex = (index: number) => {
        return this.props.grid.isGhostIndex(-1, index);
    }

    private renderGhostCell = (index: number, extremaClasses: string[]) => {
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

    private toRegion = (index1: number, index2?: number) => {
        return Regions.column(index1, index2);
    }
}
