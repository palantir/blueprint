/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";

import { Grid, IRowIndices } from "../common/grid";
import { Rect } from "../common/rect";
import { RoundSize } from "../common/roundSize";
import { ICoordinateData } from "../interactions/draggable";
import { IIndexedResizeCallback, Resizable } from "../interactions/resizable";
import { ILockableLayout, Orientation } from "../interactions/resizeHandle";
import { DragSelectable, ISelectableProps } from "../interactions/selectable";
import { ILocator } from "../locator";
import { Regions } from "../regions";
import { IRowHeaderCellProps, RowHeaderCell } from "./rowHeaderCell";

export type IRowHeaderRenderer = (rowIndex: number) => React.ReactElement<IRowHeaderCellProps>;

export interface IRowHeights {
    minRowHeight?: number;
    maxRowHeight?: number;
    defaultRowHeight?: number;
}

export interface IRowHeaderProps extends ISelectableProps, IRowIndices, IRowHeights, ILockableLayout {
    /**
     * Enables/disables the resize interaction.
     * @default false
     */
    isResizable?: boolean;

    /**
     * The grid computes sizes of cells, rows, or columns from the
     * configurable `columnWidths` and `rowHeights`.
     */
    grid: Grid;

    /**
     * If true, all `RowHeaderCell`s render their loading state except for those
     * who have their `loading` prop explicitly set to false.
     * @default false;
     */
    loading: boolean;

    /**
     * Locates the row/column/cell given a mouse event.
     */
    locator: ILocator;

    /**
     * This callback is called while the user is resizing a column. The guides
     * array contains pixel offsets for where to display the resize guides in
     * the table body's overlay layer.
     */
    onResizeGuide: (guides: number[]) => void;

    /**
     * A callback invoked when user is done resizing the column
     */
    onRowHeightChanged: IIndexedResizeCallback;

    /**
     * Renders the cell for each row header
     */
    renderRowHeader?: IRowHeaderRenderer;

    /**
     * The `Rect` bounds of the visible viewport with respect to its parent
     * scrollable pane.
     */
    viewportRect: Rect;
}

@PureRender
export class RowHeader extends React.Component<IRowHeaderProps, {}> {
    public static defaultProps = {
        isResizable: false,
        loading: false,
        renderRowHeader: renderDefaultRowHeader,
    };

    public render() {
        const { grid, rowIndexEnd, rowIndexStart, viewportRect } = this.props;

        const cells: Array<React.ReactElement<any>> = [];
        for (let rowIndex = rowIndexStart; rowIndex <= rowIndexEnd; rowIndex++) {
            const extremaClasses = grid.getExtremaClasses(rowIndex, 0, rowIndexEnd, 1);
            const renderer = grid.isGhostIndex(rowIndex, -1) ? this.renderGhostCell : this.renderCell;
            cells.push(renderer(rowIndex, extremaClasses));
        }

        // always set height so that the layout can push out the element unless it overflows.
        const style: React.CSSProperties = {
            height: `${grid.getRect().height}px`,
        };

        // use CSS translation to offset the cells
        if (viewportRect != null) {
            style.transform = `translate3d(0, ${grid.getRowRect(rowIndexStart).top - viewportRect.top}px, 0)`;
        }

        return (
            <RoundSize><div style={style}>{cells}</div></RoundSize>
        );
    }

    private renderGhostCell = (rowIndex: number, extremaClasses: string[]) => {
        const { grid, loading } = this.props;
        const rect = grid.getGhostCellRect(rowIndex, 0);
        const style = {
            height: `${rect.height}px`,
        };
        return (
            <RowHeaderCell
                key={`bp-table-row-${rowIndex}`}
                className={classNames(extremaClasses)}
                loading={loading}
                style={style}
            />);
    }

    private renderCell = (rowIndex: number, extremaClasses: string[]) => {
        const {
            allowMultipleSelection,
            grid,
            isResizable,
            loading,
            maxRowHeight,
            minRowHeight,
            onLayoutLock,
            onResizeGuide,
            onRowHeightChanged,
            onSelection,
            renderRowHeader,
            selectedRegions,
            selectedRegionTransform,
        } = this.props;

        const rect = grid.getRowRect(rowIndex);

        const handleSizeChanged = (size: number) => {
            onResizeGuide([rect.top + size + 1]);
        };

        const handleResizeEnd = (size: number) => {
            onResizeGuide(null);
            onRowHeightChanged(rowIndex, size);
        };

        const cell = renderRowHeader(rowIndex);
        const className = classNames(cell.props.className, extremaClasses, {
            "bp-table-draggable": onSelection != null,
        });
        const cellLoading = cell.props.loading != null ? cell.props.loading : loading;
        const isRowSelected = Regions.hasFullRow(selectedRegions, rowIndex);
        const cellProps: IRowHeaderCellProps = { className, isRowSelected, loading: cellLoading };

        return (
            <DragSelectable
                allowMultipleSelection={allowMultipleSelection}
                key={`bp-table-row-${rowIndex}`}
                locateClick={this.locateClick}
                locateDrag={this.locateDrag}
                onSelection={onSelection}
                selectedRegions={selectedRegions}
                selectedRegionTransform={selectedRegionTransform}
            >
                <Resizable
                    isResizable={isResizable}
                    maxSize={maxRowHeight}
                    minSize={minRowHeight}
                    onLayoutLock={onLayoutLock}
                    onResizeEnd={handleResizeEnd}
                    onSizeChanged={handleSizeChanged}
                    orientation={Orientation.HORIZONTAL}
                    size={rect.height}
                >
                    {React.cloneElement(cell, cellProps)}
                </Resizable>
            </DragSelectable>
        );
    }

    private locateClick = (event: MouseEvent) => {
        const row = this.props.locator.convertPointToRow(event.clientY);
        return Regions.row(row);
    }

    private locateDrag = (_event: MouseEvent, coords: ICoordinateData) => {
        const rowStart = this.props.locator.convertPointToRow(coords.activation[1]);
        const rowEnd = this.props.locator.convertPointToRow(coords.current[1]);
        return Regions.row(rowStart, rowEnd);
    }
}

/**
 * A default implementation of `IRowHeaderRenderer` that displays 1-indexed
 * numbers for each row.
 */
export function renderDefaultRowHeader(rowIndex: number) {
    return <RowHeaderCell name={`${rowIndex + 1}`}/>;
}
