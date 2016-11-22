/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { ICellProps, ICellRenderer, emptyCellRenderer } from "./cell/cell";
import { Grid, IColumnIndices, IRowIndices } from "./common/grid";
import { Rect } from "./common/rect";
import { Utils } from "./common/utils";
import { ICoordinateData } from "./interactions/draggable";
import { IContextMenuRenderer, MenuContext } from "./interactions/menus";
import { DragSelectable, ISelectableProps } from "./interactions/selectable";
import { ILocator } from "./locator";
import { Regions } from "./regions";
import { ContextMenuTarget, IProps } from "@blueprintjs/core";
import * as React from "react";

export interface ITableBodyProps extends ISelectableProps, IRowIndices, IColumnIndices, IProps {
    /**
     * A cell renderer for the cells in the body.
     */
    cellRenderer: ICellRenderer;

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
     * The `Rect` bounds of the visible viewport with respect to its parent
     * scrollable pane.
     */
    viewportRect: Rect;

    /**
     * An optional callback for displaying a context menu when right-clicking
     * on the table body. The callback is supplied with an `IMenuContext`
     * containing the `IRegion`s of interest.
     */
    renderBodyContextMenu?: IContextMenuRenderer;
}

const TABLE_BODY_CLASSES = "bp-table-body-virtual-client bp-table-cell-client";
const CELL_GHOST_CLASS = "bp-table-cell-ghost";
const CELL_LEDGER_ODD_CLASS = "bp-table-cell-ledger-odd";
const CELL_LEDGER_EVEN_CLASS = "bp-table-cell-ledger-even";

/**
 * For perf, we want to ignore changes to the `ISelectableProps` part of the
 * `ITableBodyProps` since those are only used when a context menu is launched.
 */
const UPDATE_PROPS_KEYS = [
    "grid",
    "locator",
    "viewportRect",
    "cellRenderer",
    "rowIndexStart",
    "rowIndexEnd",
    "columnIndexStart",
    "columnIndexEnd",
];

@ContextMenuTarget
export class TableBody extends React.Component<ITableBodyProps, {}> {
    /**
     * Returns the array of class names that must be applied to each table
     * cell so that we can locate any cell based on its coordinate.
     */
    public static cellClassNames(rowIndex: number, columnIndex: number) {
        return [
            `bp-table-cell-row-${rowIndex}`,
            `bp-table-cell-col-${columnIndex}`,
        ];
    }

    public static shallowCompareKeys(objA: any, objB: any, keys: string[]) {
        for (const key of keys) {
            if (objA[key] !== objB[key]) {
                return false;
            }
        }
        return true;
    }

    private static cellReactKey(rowIndex: number, columnIndex: number) {
        return `cell-${rowIndex}-${columnIndex}`;
    }

    public shouldComponentUpdate(nextProps: ITableBodyProps) {
        const shallowEqual = TableBody.shallowCompareKeys(this.props, nextProps, UPDATE_PROPS_KEYS);
        return !shallowEqual;
    }

    public render() {
        const { grid, rowIndexStart, rowIndexEnd, columnIndexStart, columnIndexEnd } = this.props;
        const cells: React.ReactElement<any>[] = [];
        for (let rowIndex = rowIndexStart; rowIndex <= rowIndexEnd; rowIndex++) {
            for (let columnIndex = columnIndexStart; columnIndex <= columnIndexEnd; columnIndex++) {
                const isGhost = grid.isGhostIndex(rowIndex, columnIndex);
                const extremaClasses = grid.getExtremaClasses(rowIndex, columnIndex, rowIndexEnd, columnIndexEnd);
                const renderer = isGhost ? this.renderGhostCell : this.renderCell;
                cells.push(renderer(rowIndex, columnIndex, extremaClasses));
            }
        }
        const style = grid.getRect().sizeStyle();
        return <div className={TABLE_BODY_CLASSES} style={style}>{cells}</div>;
    }

    public renderContextMenu(e: React.MouseEvent<HTMLElement>) {
        const { selectedRegions, renderBodyContextMenu, grid } = this.props;

        if (renderBodyContextMenu == null) {
            return undefined;
        }

        const target = this.locateClick(e.nativeEvent as MouseEvent);
        return renderBodyContextMenu(new MenuContext(target, selectedRegions, grid.numRows, grid.numCols));
    }

    private renderGhostCell = (rowIndex: number, columnIndex: number, extremaClasses: string[]) => {
        const { grid } = this.props;
        const cell = Utils.assignClasses(
            emptyCellRenderer(rowIndex, columnIndex),
            TableBody.cellClassNames(rowIndex, columnIndex),
            extremaClasses,
            CELL_GHOST_CLASS, {
                [CELL_LEDGER_ODD_CLASS]: (rowIndex % 2) === 1,
                [CELL_LEDGER_EVEN_CLASS]: (rowIndex % 2) === 0,
            });
        const key = TableBody.cellReactKey(rowIndex, columnIndex);
        const style = Rect.style(grid.getGhostCellRect(rowIndex, columnIndex));
        return React.cloneElement(cell, { key, style } as ICellProps);
    }

    private renderCell = (rowIndex: number, columnIndex: number, extremaClasses: string[]) => {
        const { allowMultipleSelection, grid, cellRenderer, selectedRegions, onSelection } = this.props;
        const cell = Utils.assignClasses(
            cellRenderer(rowIndex, columnIndex),
            TableBody.cellClassNames(rowIndex, columnIndex),
            extremaClasses,
            {
                [CELL_LEDGER_ODD_CLASS]: (rowIndex % 2) === 1,
                [CELL_LEDGER_EVEN_CLASS]: (rowIndex % 2) === 0,
            });
        const key = TableBody.cellReactKey(rowIndex, columnIndex);
        const style = Rect.style(grid.getCellRect(rowIndex, columnIndex));
        return (
            <DragSelectable
                allowMultipleSelection={allowMultipleSelection}
                key={key}
                locateClick={this.locateClick}
                locateDrag={this.locateDrag}
                onSelection={onSelection}
                selectedRegions={selectedRegions}
            >
                {React.cloneElement(cell, { style } as ICellProps)}
            </DragSelectable>
        );
    }

    private locateClick = (event: MouseEvent) => {
        const { col, row } = this.props.locator.convertPointToCell(event.clientX, event.clientY);
        return Regions.cell(row, col);
    }

    private locateDrag = (_event: MouseEvent, coords: ICoordinateData) => {
        const start = this.props.locator.convertPointToCell(coords.activation[0], coords.activation[1]);
        const end = this.props.locator.convertPointToCell(coords.current[0], coords.current[1]);
        return Regions.cell(start.row, start.col, end.row, end.col);
    }
}
