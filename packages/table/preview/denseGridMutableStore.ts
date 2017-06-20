/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { Utils } from "../src/common/utils";

export class DenseGridMutableStore<T> {
    // column-major grid (i.e., index access looks like: [columnIndex][rowIndex])
    private grid: T[][];
    private DEFAULT_CELL_VALUE: T = undefined;

    public constructor() {
        this.clear();
    }

    public clear() {
        this.grid = [] as T[][];
    }

    public setNumColumns(numColumns: number) {
        const prevNumColumns = this.numColumns();

        if (numColumns < prevNumColumns) {
            const startIndex = numColumns;
            const deleteCount = prevNumColumns - numColumns + 1;
            this.grid.splice(startIndex, deleteCount);
        } else if (numColumns > prevNumColumns) {
            const addCount = numColumns - prevNumColumns;
            for (let i = 0; i < addCount; i++) {
                this.addColumn();
            }
        }
    }

    public setNumRows(numRows: number) {
        const prevNumRows = this.numRows();

        if (numRows < prevNumRows) {
            const startIndex = numRows;
            const deleteCount = prevNumRows - numRows + 1;
            this.forEachColumn((columnIndex) => this.grid[columnIndex].splice(startIndex, deleteCount));
        } else if (numRows > prevNumRows) {
            const addCount = numRows - prevNumRows;
            for (let i = 0; i < addCount; i++) {
                this.addRow();
            }
        }
    }

    // Column manipulation
    // ===================

    public addColumn() {
        // add to the end of the grid
        this.grid.push();
    }

    public addColumnBefore(columnIndex?: number) {
        this.grid.splice(columnIndex, 0, []);
    }

    public addColumnAfter(columnIndex: number) {
        this.addColumnBefore(columnIndex + 1);
    }

    public removeColumn(columnIndex: number) {
        this.grid.splice(columnIndex, 1);
    }

    // Row manipulation
    // ================

    public addRow() {
        this.forEachColumn((columnIndex) => this.grid[columnIndex].push(this.DEFAULT_CELL_VALUE));
    }

    public addRowBefore(rowIndex?: number) {
        this.forEachColumn((columnIndex) => this.grid[columnIndex].splice(rowIndex, 0, this.DEFAULT_CELL_VALUE));
    }

    public addRowAfter(rowIndex?: number) {
        this.addRowBefore(rowIndex + 1);
    }

    public removeRow(rowIndex: number) {
        this.forEachColumn((columnIndex) => this.grid[columnIndex].splice(rowIndex, 1));
    }

    // Reordering
    // ==========

    public reorderColumns(oldIndex: number, newIndex: number, length: number) {
        this.grid = Utils.reorderArray(this.grid, oldIndex, newIndex, length);
    }

    public reorderRows(oldIndex: number, newIndex: number, length: number) {
        this.forEachColumn((columnIndex) => {
            this.grid[columnIndex] = Utils.reorderArray(this.grid[columnIndex], oldIndex, newIndex, length);
        });
    }

    // Cell manipulation
    // =================

    public get(columnIndex: number, rowIndex: number) {
        return this.grid[columnIndex][rowIndex];
    }

    public set(columnIndex: number, rowIndex: number, value: T) {
        this.grid[columnIndex][rowIndex] = value;
    }

    // Private helpers
    // ===============

    private numColumns() {
        return this.grid.length;
    }

    private numRows() {
        // assume all columns have same number of rows
        return this.grid.length === 0 ? 0 : this.grid[0].length;
    }

    private forEachColumn(callback: (columnIndex: number) => void) {
        for (let col = 0; col < this.numColumns(); col++) {
            callback(col);
        }
    }
}
