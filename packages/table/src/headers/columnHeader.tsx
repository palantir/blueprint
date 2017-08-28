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
import { ColumnHeaderCell, IColumnHeaderCellProps } from "./columnHeaderCell";
import { Header, IHeaderProps, shouldHeaderComponentUpdate } from "./header";

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

export class ColumnHeader extends React.Component<IColumnHeaderProps, {}> {
    public static defaultProps = {
        isReorderable: false,
        isResizable: true,
        loading: false,
    };

    public shouldComponentUpdate(nextProps: IColumnHeaderProps) {
        return shouldHeaderComponentUpdate(this.props, nextProps, this.isSelectedRegionRelevant);
    }

    public render() {
        const {
            // from IColumnHeaderProps
            cellRenderer,
            onColumnWidthChanged,

            // from IColumnWidths
            minColumnWidth,
            maxColumnWidth,
            defaultColumnWidth,

            // from IColumnIndices
            columnIndexStart,
            columnIndexEnd,

            // from IHeaderProps
            ...spreadableProps,
        } = this.props;

        return (
            <Header
                convertPointToIndex={this.convertPointToColumn}
                endIndex={this.props.columnIndexEnd}
                fullRegionCardinality={RegionCardinality.FULL_COLUMNS}
                getCellExtremaClasses={this.getCellExtremaClasses}
                getCellIndexClass={Classes.columnCellIndexClass}
                getCellSize={this.getColumnWidth}
                getDragCoordinate={this.getDragCoordinate}
                getIndexClass={Classes.columnIndexClass}
                getMouseCoordinate={this.getMouseCoordinate}
                handleResizeDoubleClick={this.handleResizeDoubleClick}
                handleResizeEnd={this.handleResizeEnd}
                handleSizeChanged={this.handleSizeChanged}
                headerCellIsReorderablePropName={"isColumnReorderable"}
                headerCellIsSelectedPropName={"isColumnSelected"}
                isCellSelected={this.isCellSelected}
                isGhostIndex={this.isGhostIndex}
                maxSize={this.props.maxColumnWidth}
                minSize={this.props.minColumnWidth}
                renderGhostCell={this.renderGhostCell}
                renderHeaderCell={this.props.cellRenderer}
                resizeOrientation={Orientation.VERTICAL}
                startIndex={this.props.columnIndexStart}
                toRegion={this.toRegion}
                wrapCells={this.wrapCells}
                {...spreadableProps}
            />
        );
    }

private wrapCells = (cells: Array<React.ReactElement<any>>) => {
    const { columnIndexStart, grid } = this.props;

    const tableWidth = grid.getRect().width;
    const scrollLeftCorrection = this.props.grid.getCumulativeWidthBefore(columnIndexStart);
    const style: React.CSSProperties = {
        // only header cells in view will render, but we need to reposition them to stay in view
        // as we scroll horizontally.
        transform: `translateX(${scrollLeftCorrection || 0}px)`,
        // reduce the width to clamp the sliding window as we approach the final headers; otherwise,
        // we'll have tons of useless whitespace at the end.
        width: tableWidth - scrollLeftCorrection,
    };

    const classes = classNames(Classes.TABLE_THEAD, Classes.TABLE_COLUMN_HEADER_TR);

    // add a wrapper set to the full-table width to ensure container styles stretch from the first
    // cell all the way to the last
    return (
        <div style={{ width: tableWidth }}>
            <div style={style} className={classes}>
                {cells}
            </div>
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
                className={classNames(extremaClasses)}
                index={index}
                key={Classes.columnIndexClass(index)}
                loading={loading}
                style={style}
            />);
    }

    private toRegion = (index1: number, index2?: number) => {
        return Regions.column(index1, index2);
    }

    private isSelectedRegionRelevant = (selectedRegion: IRegion) => {
        const regionCardinality = Regions.getRegionCardinality(selectedRegion);
        return regionCardinality === RegionCardinality.FULL_COLUMNS
            || regionCardinality === RegionCardinality.FULL_TABLE;
    }
}
