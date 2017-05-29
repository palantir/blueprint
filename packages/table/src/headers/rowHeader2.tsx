/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as React from "react";

import * as Classes from "../common/classes";
import { IRowIndices } from "../common/grid";
import { RoundSize } from "../common/roundSize";
import { IClientCoordinates } from "../interactions/draggable";
import { IIndexedResizeCallback } from "../interactions/resizable";
import { Orientation } from "../interactions/resizeHandle";
import { RegionCardinality, Regions } from "../regions";
import { AbstractHeader, IHeaderProps } from "./abstractHeader2";
import { IRowHeaderCellProps, RowHeaderCell } from "./rowHeaderCell";

export type IRowHeaderRenderer = (rowIndex: number) => React.ReactElement<IRowHeaderCellProps>;

export interface IRowHeights {
    minRowHeight?: number;
    maxRowHeight?: number;
    defaultRowHeight?: number;
}

export interface IRowHeaderProps extends IHeaderProps, IRowHeights, IRowIndices {
    /**
     * A callback invoked when user is done resizing the column
     */
    onRowHeightChanged: IIndexedResizeCallback;

    /**
     * Renders the cell for each row header
     */
    renderRowHeader?: IRowHeaderRenderer;
}

export class RowHeader extends React.Component<IRowHeaderProps, {}> {
    public defaultProps = {
        renderRowHeader: renderDefaultRowHeader,
    };

    public render() {
        return (
            <AbstractHeader
                allowMultipleSelection={this.props.allowMultipleSelection}
                convertPointToIndex={this.convertPointToRow}
                endIndex={this.props.rowIndexEnd}
                fullRegionCardinality={RegionCardinality.FULL_ROWS}
                getCellExtremaClasses={this.getCellExtremaClasses}
                getCellIndexClass={Classes.rowCellIndexClass}
                getCellSize={this.getRowHeight}
                getDragCoordinate={this.getDragCoordinate}
                getIndexClass={Classes.rowIndexClass}
                getMouseCoordinate={this.getMouseCoordinate}
                grid={this.props.grid}
                handleResizeEnd={this.handleResizeEnd}
                handleSizeChanged={this.handleSizeChanged}
                headerCellIsReorderablePropName={"isRowReorderable"}
                headerCellIsSelectedPropName={"isRowSelected"}
                isCellSelected={this.isCellSelected}
                isGhostIndex={this.isGhostIndex}
                isReorderable={this.props.isReorderable}
                isResizable={this.props.isResizable}
                loading={this.props.loading}
                locator={this.props.locator}
                maxSize={this.props.maxRowHeight}
                minSize={this.props.minRowHeight}
                onFocus={this.props.onFocus}
                onLayoutLock={this.props.onLayoutLock}
                onReordered={this.props.onReordered}
                onReordering={this.props.onReordering}
                onResizeGuide={this.props.onResizeGuide}
                onSelection={this.props.onSelection}
                renderGhostCell={this.renderGhostCell}
                renderHeaderCell={this.props.renderRowHeader}
                resizeOrientation={Orientation.HORIZONTAL}
                selectedRegions={this.props.selectedRegions}
                selectedRegionTransform={this.props.selectedRegionTransform}
                startIndex={this.props.rowIndexStart}
                toRegion={this.toRegion}
                viewportRect={this.props.viewportRect}
                wrapCells={this.wrapCells}
            />
        );
    }

    private wrapCells = (cells: Array<React.ReactElement<any>>) => {
        const { grid, viewportRect } = this.props;

        // always set height so that the layout can push out the element unless it overflows.
        const style: React.CSSProperties = {
            height: `${grid.getRect().height}px`,
        };

        // use CSS translation to offset the cells
        if (viewportRect != null) {
            const startIndex = this.getStartIndex();
            const topOffset = grid.getRowRect(startIndex).top - viewportRect.top;
            style.transform = `translate3d(0, ${topOffset}px, 0)`;
        }

        return (
            <RoundSize>
                <div style={style}>
                    {cells}
                </div>
            </RoundSize>
        );
    }

    private convertPointToRow = (clientXOrY: number, useMidpoint?: boolean) => {
        const { locator } = this.props;
        return locator != null ? locator.convertPointToRow(clientXOrY, useMidpoint) : null;
    }

    private getCellExtremaClasses = (index: number, endIndex: number) => {
        return this.props.grid.getExtremaClasses(index, 0, endIndex, 1);
    }

    private getRowHeight = (index: number) => {
        return this.props.grid.getRowRect(index).height;
    }

    private getDragCoordinate = (clientCoords: IClientCoordinates) => {
        return clientCoords[1]; // y-coordinate
    }

    private getMouseCoordinate = (event: MouseEvent) => {
        return event.clientY;
    }

    private getStartIndex = () => {
        return this.props.rowIndexStart;
    }

    private handleResizeEnd = (index: number, size: number) => {
        this.props.onResizeGuide(null);
        this.props.onRowHeightChanged(index, size);
    };

    private handleSizeChanged = (index: number, size: number) => {
        const rect = this.props.grid.getRowRect(index);
        this.props.onResizeGuide([rect.top + size]);
    };

    private isCellSelected = (index: number) => {
        return Regions.hasFullRow(this.props.selectedRegions, index);
    }

    private isGhostIndex = (index: number) => {
        return this.props.grid.isGhostIndex(index, -1);
    }

    private renderGhostCell = (index: number, extremaClasses: string[]) => {
        const rect = this.props.grid.getGhostCellRect(index, 0);
        return (
            <RowHeaderCell
                key={Classes.rowIndexClass(index)}
                className={classNames(extremaClasses)}
                loading={this.props.loading}
                style={{ height: `${rect.height}px` }}
            />);
    }

    private toRegion = (index1: number, index2?: number) => {
        // the `this` value is messed up for Regions.row, so we have to have a wrapper function here
        return Regions.row(index1, index2);
    }
}

/**
 * A default implementation of `IRowHeaderRenderer` that displays 1-indexed
 * numbers for each row.
 */
export function renderDefaultRowHeader(rowIndex: number) {
    return <RowHeaderCell name={`${rowIndex + 1}`}/>;
}
