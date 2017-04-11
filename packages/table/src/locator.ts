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

    public constructor(
        private tableElement: HTMLElement,
        private bodyElement: HTMLElement,
        private grid: Grid,
    ) {
    }

    public setGrid(grid: Grid) {
        this.grid = grid;
    }

    public getViewportRect() {
        return new Rect(
            this.bodyElement.scrollLeft,
            this.bodyElement.scrollTop,
            this.bodyElement.clientWidth,
            this.bodyElement.clientHeight,
        );
    }

    public getWidestVisibleCellInColumn(columnIndex: number): number {
        const cellClasses = [
            `.${Classes.columnCellIndexClass(columnIndex)}`,
            `.${Classes.TABLE_COLUMN_NAME}`,
        ];
        const cells = this.tableElement.querySelectorAll(cellClasses.join(", "));
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

    public convertPointToColumn(clientX: number, useMidpoint?: boolean): number {
        const tableRect = this.getTableRect();
        if (!tableRect.containsX(clientX)) {
            return -1;
        }
        const limit = useMidpoint ? this.grid.numCols : this.grid.numCols - 1;
        const lookupFn = useMidpoint ? this.convertCellMidpointToClientX : this.convertCellIndexToClientX;
        return Utils.binarySearch(clientX, limit, lookupFn);
    }

    public convertPointToRow(clientY: number, useMidpoint?: boolean): number {
        const tableRect = this.getTableRect();
        if (!tableRect.containsY(clientY)) {
            return -1;
        }
        const limit = useMidpoint ? this.grid.numRows : this.grid.numRows - 1;
        const lookupFn = useMidpoint ? this.convertCellMidpointToClientY : this.convertCellIndexToClientY;
        return Utils.binarySearch(clientY, limit, lookupFn);
    }

    public convertPointToCell(clientX: number, clientY: number) {
        const col = Utils.binarySearch(clientX, this.grid.numCols - 1, this.convertCellIndexToClientX);
        const row = Utils.binarySearch(clientY, this.grid.numRows - 1, this.convertCellIndexToClientY);
        return {col, row};
    }

    private getTableRect() {
        return Rect.wrap(this.tableElement.getBoundingClientRect());
    }

    private getBodyRect() {
        return this.unscrollElementRect(this.bodyElement);
    }

    /**
     * Subtracts the scroll offset from the element's bounding client rect.
     */
    private unscrollElementRect(element: HTMLElement) {
        const rect = Rect.wrap(element.getBoundingClientRect());
        rect.left -= element.scrollLeft;
        rect.top -= element.scrollTop;
        return rect;
    }

    private convertCellIndexToClientX = (index: number) => {
        const bodyRect = this.getBodyRect();
        return bodyRect.left + this.grid.getCumulativeWidthAt(index);
    }

    private convertCellMidpointToClientX = (index: number) => {
        const bodyRect = this.getBodyRect();
        const cumWidth = this.grid.getCumulativeWidthAt(index);
        const prevCumWidth = (index > 0) ? this.grid.getCumulativeWidthAt(index - 1) : 0;
        return bodyRect.left + ((cumWidth + prevCumWidth) / 2);
    }

    private convertCellIndexToClientY = (index: number) => {
        const bodyRect = this.getBodyRect();
        return bodyRect.top + this.grid.getCumulativeHeightAt(index);
    }

    private convertCellMidpointToClientY = (index: number) => {
        const bodyRect = this.getBodyRect();
        const cumHeight = this.grid.getCumulativeHeightAt(index);
        const prevCumHeight = (index > 0) ? this.grid.getCumulativeHeightAt(index - 1) : 0;
        return bodyRect.top + ((cumHeight + prevCumHeight) / 2);
    }
}
