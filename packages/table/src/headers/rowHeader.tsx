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
import { IRegion, RegionCardinality, Regions } from "../regions";
import { AbstractHeader, IHeaderProps } from "./abstractHeader";
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

export class RowHeader extends AbstractHeader<IRowHeaderProps> {
    public defaultProps = {
        renderRowHeader: renderDefaultRowHeader,
    };

    public render() {
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
                    {this.renderCells()}
                </div>
            </RoundSize>
        );
    }

    protected convertPointToIndex(clientXOrY: number, useMidpoint?: boolean) {
        return this.props.locator.convertPointToRow(clientXOrY, useMidpoint);
    }

    protected getDragCoordinate(clientCoords: IClientCoordinates) {
        return clientCoords[1]; // y-coordinate
    }

    protected getMouseCoordinate(event: MouseEvent) {
        return event.clientY;
    }

    protected getStartIndex() {
        return this.props.rowIndexStart;
    }

    protected getEndIndex() {
        return this.props.rowIndexEnd;
    }

    protected getMaxSize() {
        return this.props.maxRowHeight;
    }

    protected getMinSize() {
        return this.props.minRowHeight;
    }

    protected getCellExtremaClasses(index: number, endIndex: number) {
        return this.props.grid.getExtremaClasses(index, 0, endIndex, 1);
    }

    protected getCellIndexClass(index: number) {
        return Classes.rowIndexClass(index);
    }

    protected getCellSize(index: number) {
        return this.props.grid.getRowRect(index).height;
    }

    protected getFullRegionCardinality() {
        return RegionCardinality.FULL_ROWS;
    }

    protected getIndexClass(index: number) {
        return Classes.rowIndexClass(index);
    }

    protected isCellSelected(index: number) {
        return Regions.hasFullRow(this.props.selectedRegions, index);
    }

    protected isGhostIndex(index: number) {
        return this.props.grid.isGhostIndex(index, -1);
    }

    protected getResizeOrientation() {
        return Orientation.HORIZONTAL;
    }

    protected getHeaderCellIsSelectedKey() {
        return "isRowSelected";
    }

    protected getHeaderCellIsReorderableKey() {
        return "isRowReorderable";
    }

    protected renderGhostCell(index: number, extremaClasses: string[]) {
        const rect = this.props.grid.getGhostCellRect(index, 0);
        return (
            <RowHeaderCell
                key={Classes.rowIndexClass(index)}
                className={classNames(extremaClasses)}
                loading={this.props.loading}
                style={{ height: `${rect.height}px` }}
            />);
    }

    protected renderHeaderCell(index: number) {
        return this.props.renderRowHeader(index);
    }

    protected toRegion(index1: number, index2?: number): IRegion {
        return Regions.row(index1, index2);
    }

    protected handleSizeChanged(index: number, size: number) {
        const rect = this.props.grid.getRowRect(index);
        this.props.onResizeGuide([rect.top + size]);
    };

    protected handleResizeEnd(index: number, size: number) {
        this.props.onResizeGuide(null);
        this.props.onRowHeightChanged(index, size);
    };
}

/**
 * A default implementation of `IRowHeaderRenderer` that displays 1-indexed
 * numbers for each row.
 */
export function renderDefaultRowHeader(rowIndex: number) {
    return <RowHeaderCell name={`${rowIndex + 1}`}/>;
}
