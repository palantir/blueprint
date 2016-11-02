/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

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
import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";

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
    renderRowHeaderCell?: IRowHeaderRenderer;

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
        renderRowHeaderCell: renderDefaultRowHeader,
    };

    public render() {
        const { grid, rowIndexEnd, rowIndexStart, viewportRect } = this.props;

        const cells: React.ReactElement<any>[] = [];
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
        const { grid } = this.props;
        const rect = grid.getGhostCellRect(rowIndex, 0);
        const style = {
            height: `${rect.height}px`,
        };
        return (
            <RowHeaderCell
                key={`bp-table-row-${rowIndex}`}
                className={classNames(extremaClasses)}
                style={style}
            />);
    }

    private renderCell = (rowIndex: number, extremaClasses: string[]) => {
        const {
            allowMultipleSelection,
            grid,
            isResizable,
            maxRowHeight,
            minRowHeight,
            onLayoutLock,
            onResizeGuide,
            onRowHeightChanged,
            onSelection,
            renderRowHeaderCell,
            selectedRegions,
        } = this.props;

        const rect = grid.getRowRect(rowIndex);

        const handleSizeChanged = (size: number) => {
            onResizeGuide([rect.top + size + 1]);
        };

        const handleResizeEnd = (size: number) => {
            onResizeGuide(null);
            onRowHeightChanged(rowIndex, size);
        };

        const cell = renderRowHeaderCell(rowIndex);
        const className = classNames(cell.props.className, extremaClasses, {
            "bp-table-draggable": onSelection != null,
        });
        const isRowSelected = Regions.hasFullRow(selectedRegions, rowIndex);

        return (
            <DragSelectable
                allowMultipleSelection={allowMultipleSelection}
                key={`bp-table-row-${rowIndex}`}
                locateClick={this.locateClick}
                locateDrag={this.locateDrag}
                onSelection={onSelection}
                selectedRegions={selectedRegions}
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
                    {React.cloneElement(cell, { className, isRowSelected } as IRowHeaderCellProps)}
                </Resizable>
            </DragSelectable>
        );
    }

    private locateClick = (event: MouseEvent) => {
        const row = this.props.locator.convertPointToRow(event.clientY);
        return Regions.row(row);
    }

    private locateDrag = (event: MouseEvent, coords: ICoordinateData) => {
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
