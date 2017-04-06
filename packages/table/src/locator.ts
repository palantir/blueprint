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

    getTallestVisibleCellInColumn: (columnIndex: number) => number;

    /**
     * Locates a column's index given the client X coordinate. Returns -1 if
     * the coordinate is not over a column.
     */
    convertPointToColumn: (clientX: number) => number;

    /**
     * Locates a row's index given the client Y coordinate. Returns -1 if
     * the coordinate is not over a row.
     */
    convertPointToRow: (clientY: number) => number;

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

    public getTallestVisibleCellInColumn(columnIndex: number): number {
        const cells = this.tableElement.querySelectorAll(`.${Classes.columnCellIndexClass(columnIndex)}`);
        let max = 0;
        for (let i = 0; i < cells.length; i++) {
            const cellValue = (cells.item(i) as any).query(`.${Classes.TABLE_TRUNCATED_VALUE}`);
            let height = 0;
            if (cellValue != null) {
                height = cellValue.scrollHeight;
            } else {
                height = (cells.item(i) as any).query(`.${Classes.TABLE_TRUNCATED_TEXT}`).scrollHeight;
            }
            if (max < height) {
                max = height;
            }
        }
        return max;
    }

    public convertPointToColumn(clientX: number): number {
        const tableRect = this.getTableRect();
        if (!tableRect.containsX(clientX)) {
            return -1;
        }
        return Utils.binarySearch(clientX, this.grid.numCols - 1, this.convertCellIndexToClientX);
    }

    public convertPointToRow(clientY: number): number {
        const tableRect = this.getTableRect();

        if (!tableRect.containsY(clientY)) {
            return -1;
        }
        return Utils.binarySearch(clientY, this.grid.numRows - 1, this.convertCellIndexToClientY);
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

    private convertCellIndexToClientY = (index: number) => {
        const bodyRect = this.getBodyRect();
        return bodyRect.top + this.grid.getCumulativeHeightAt(index);
    }
}
