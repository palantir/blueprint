/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as Classes from "./common/classes";
import { Grid } from "./common/grid";
import { Rect } from "./common/rect";
import { Utils } from "./common/utils";

export interface ILocator {
    /**
     * Returns the width that a column must be to contain all the content of
     * its cells without truncating or wrapping.
     */
    getWidestVisibleCellInColumn: (columnIndex: number) => number;

    /**
     * Returns the height of the tallest cell in a given column -- specifically,
     * tallest as in how tall the cell would have to be to display all the content in it
     */
    getTallestVisibleCellInColumn: (columnIndex: number) => number;

    /**
     * Locates a column's index given the client X coordinate. Returns -1 if
     * the coordinate is not over a column.
     * If `useMidpoint` is `true`, returns the index of the column whose left
     * edge is closest, splitting on the midpoint of each column.
     */
    convertPointToColumn: (clientX: number, useMidpoint?: boolean) => number;

    /**
     * Locates a row's index given the client Y coordinate. Returns -1 if
     * the coordinate is not over a row.
     * If `useMidpoint` is `true`, returns the index of the row whose top
     * edge is closest, splitting on the midpoint of each row.
     */
    convertPointToRow: (clientY: number, useMidpoint?: boolean) => number;

    /**
     * Locates a cell's row and column index given the client X
     * coordinate. Returns -1 if the coordinate is not over a table cell.
     */
    convertPointToCell: (clientX: number, clientY: number) => {col: number, row: number};
}

export class Locator implements ILocator {
    private static CELL_HORIZONTAL_PADDING = 10;

    private grid: Grid;

    private rowHeaderWidth: number;
    private columnHeaderHeight: number;

    private numFrozenRows: number;
    private numFrozenColumns: number;

    public constructor(
        private tableElement: HTMLElement,
        private bodyElement: HTMLElement,
    ) {
        // empty constructor
    }

    // Setters
    // =======

    public setGrid(grid: Grid) {
        this.grid = grid;
        return this;
    }

    public setNumFrozenRows(numFrozenRows: number) {
        this.numFrozenRows = numFrozenRows;
        return this;
    }

    public setNumFrozenColumns(numFrozenColumns: number) {
        this.numFrozenColumns = numFrozenColumns;
        return this;
    }

    public setColumnHeaderHeight(columnHeaderHeight: number) {
        this.columnHeaderHeight = columnHeaderHeight;
        return this;
    }

    public setRowHeaderWidth(rowHeaderWidth: number) {
        this.rowHeaderWidth = rowHeaderWidth;
        return this;
    }

    // Getters
    // =======

    public getViewportRect() {
        return new Rect(
            this.bodyElement.scrollLeft,
            this.bodyElement.scrollTop,
            this.bodyElement.clientWidth,
            this.bodyElement.clientHeight,
        );
    }

    public getWidestVisibleCellInColumn(columnIndex: number): number {
        const cells = this.tableElement.getElementsByClassName(Classes.columnCellIndexClass(columnIndex));
        let max = 0;
        for (let i = 0; i < cells.length; i++) {
            const contentWidth = Utils.measureElementTextContent(cells.item(i)).width;
            const cellWidth = Math.ceil(contentWidth) + Locator.CELL_HORIZONTAL_PADDING * 2;
            if (cellWidth > max) {
                max = cellWidth;
            }
        }
        return max;
    }

    public getTallestVisibleCellInColumn(columnIndex: number): number {
        const cells = this.tableElement
            .getElementsByClassName(`${Classes.columnCellIndexClass(columnIndex)} ${Classes.TABLE_CELL}`);
        let max = 0;
        for (let i = 0; i < cells.length; i++) {
            const cellValue = cells.item(i).querySelector(`.${Classes.TABLE_TRUNCATED_VALUE}`);
            const cellTruncatedFormatText = cells.item(i).querySelector(`.${Classes.TABLE_TRUNCATED_FORMAT_TEXT}`);
            const cellTruncatedText = cells.item(i).querySelector(`.${Classes.TABLE_TRUNCATED_TEXT}`);
            let height = 0;
            if (cellValue != null) {
                height = cellValue.scrollHeight;
            } else if (cellTruncatedFormatText != null) {
                height = cellTruncatedFormatText.scrollHeight;
            } else if (cellTruncatedText != null) {
                height = cellTruncatedText.scrollHeight;
            } else {
                // it's not anything we recognize, just use the current height of the cell
                height = cells.item(i).scrollHeight;
            }
            if (height > max) {
                max = height;
            }
        }
        return max;
    }

    // Converters
    // ==========

    public convertPointToColumn(clientX: number, useMidpoint?: boolean): number {
        const tableRect = this.getTableRect();
        if (!tableRect.containsX(clientX)) {
            return -1;
        }
        const gridX = this.toGridX(clientX);
        const limit = useMidpoint ? this.grid.numCols : this.grid.numCols - 1;
        const lookupFn = useMidpoint ? this.convertCellMidpointToClientX : this.convertCellIndexToClientX;
        return Utils.binarySearch(gridX, limit, lookupFn);
    }

    public convertPointToRow(clientY: number, useMidpoint?: boolean): number {
        const tableRect = this.getTableRect();
        if (!tableRect.containsY(clientY)) {
            return -1;
        }
        const gridY = this.toGridY(clientY);
        const limit = useMidpoint ? this.grid.numRows : this.grid.numRows - 1;
        const lookupFn = useMidpoint ? this.convertCellMidpointToClientY : this.convertCellIndexToClientY;
        return Utils.binarySearch(gridY, limit, lookupFn);
    }

    public convertPointToCell(clientX: number, clientY: number) {
        const gridX = this.toGridX(clientX);
        const gridY = this.toGridY(clientY);
        const col = Utils.binarySearch(gridX, this.grid.numCols - 1, this.convertCellIndexToClientX);
        const row = Utils.binarySearch(gridY, this.grid.numRows - 1, this.convertCellIndexToClientY);
        return {col, row};
    }

    // Private helpers
    // ===============

    private getTableRect() {
        return Rect.wrap(this.tableElement.getBoundingClientRect());
    }

    private convertCellIndexToClientX = (index: number) => {
        return this.grid.getCumulativeWidthAt(index);
    }

    private convertCellMidpointToClientX = (index: number) => {
        const cellLeft = this.grid.getCumulativeWidthBefore(index);
        const cellRight = this.grid.getCumulativeWidthAt(index);
        return (cellLeft + cellRight) / 2;
    }

    private convertCellIndexToClientY = (index: number) => {
        return this.grid.getCumulativeHeightAt(index);
    }

    private convertCellMidpointToClientY = (index: number) => {
        const cellTop = this.grid.getCumulativeHeightBefore(index);
        const cellBottom = this.grid.getCumulativeHeightAt(index);
        return (cellTop + cellBottom) / 2;
    }

    private toGridX = (clientX: number) => {
        const tableOffsetFromPageLeft = this.tableElement.getBoundingClientRect().left;
        const cursorOffsetFromTableLeft = clientX - tableOffsetFromPageLeft;
        const cursorOffsetFromGridLeft = cursorOffsetFromTableLeft - this.rowHeaderWidth;
        const scrollOffsetFromTableLeft = this.bodyElement.scrollLeft;

        const isCursorWithinFrozenColumns = this.numFrozenColumns != null
            && this.numFrozenColumns > 0
            && cursorOffsetFromGridLeft <= this.grid.getCumulativeWidthBefore(this.numFrozenColumns);

        // the frozen-column region doesn't scroll, so ignore the scroll distance in that case
        return isCursorWithinFrozenColumns
            ? cursorOffsetFromGridLeft
            : cursorOffsetFromGridLeft + scrollOffsetFromTableLeft;
    }

    private toGridY = (clientY: number) => {
        const tableOffsetFromPageTop = this.tableElement.getBoundingClientRect().top;
        const cursorOffsetFromTableTop = clientY - tableOffsetFromPageTop;
        const cursorOffsetFromGridTop = cursorOffsetFromTableTop - this.columnHeaderHeight;
        const scrollOffsetFromTableTop = this.bodyElement.scrollTop;

        const isCursorWithinFrozenRows = this.numFrozenRows != null
            && this.numFrozenRows > 0
            && cursorOffsetFromGridTop <= this.grid.getCumulativeHeightBefore(this.numFrozenRows);

        return isCursorWithinFrozenRows
            ? cursorOffsetFromGridTop
            : cursorOffsetFromGridTop + scrollOffsetFromTableTop;
    }
}
