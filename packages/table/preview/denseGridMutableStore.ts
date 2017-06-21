/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { Utils } from "../src/common/utils";

interface IDataRow<T> {
    [key: string]: T;
}

type Data<T> = Array<IDataRow<T>>;

export class DenseGridMutableStore<T> {
    private data: Data<T>;
    private orderedColumnKeys: string[];
    private DEFAULT_CELL_VALUE: T = undefined;

    public constructor() {
        this.clear();
    }

    public clear() {
        this.data = [] as Data<T>;
        this.orderedColumnKeys = [];
    }

    // public setNumColumns(numColumns: number) {
    //     const prevNumColumns = this.numColumns();

    //     if (numColumns < prevNumColumns) {
    //         const startIndex = numColumns;
    //         const deleteCount = prevNumColumns - numColumns + 1;
    //         this.grid.splice(startIndex, deleteCount);
    //     } else if (numColumns > prevNumColumns) {
    //         const addCount = numColumns - prevNumColumns;
    //         for (let i = 0; i < addCount; i++) {
    //             this.addColumn();
    //         }
    //     }
    // }

    // public setNumRows(numRows: number) {
    //     const prevNumRows = this.numRows();

    //     if (numRows < prevNumRows) {
    //         const startIndex = numRows;
    //         const deleteCount = prevNumRows - numRows + 1;
    //         this.forEachColumn((columnIndex) => this.grid[columnIndex].splice(startIndex, deleteCount));
    //     } else if (numRows > prevNumRows) {
    //         const addCount = numRows - prevNumRows;
    //         for (let i = 0; i < addCount; i++) {
    //             this.addRow();
    //         }
    //     }
    // }

    public setOrderedColumnKeys(orderedColumnKeys: string[]) {
        this.orderedColumnKeys = orderedColumnKeys;
    }

    // Column manipulation
    // ===================

    public addColumn(columnKey: string) {
        this.orderedColumnKeys.push(columnKey);
    }

    public addColumnBefore(columnIndex: number) {
        const columnKey = this.orderedColumnKeys[columnIndex];
        this.orderedColumnKeys.splice(columnIndex, 0, columnKey);
    }

    public addColumnAfter(columnIndex: number) {
        this.addColumnBefore(columnIndex + 1);
    }

    public removeColumn(columnIndex: number) {
        this.orderedColumnKeys.splice(columnIndex, 1);
    }

    // Row manipulation
    // ================

    public addRow() {
        this.data.push(this.createRow());
    }

    public addRowBefore(rowIndex?: number) {
        this.data.splice(rowIndex, 0, this.createRow());
    }

    public addRowAfter(rowIndex?: number) {
        this.addRowBefore(rowIndex + 1);
    }

    public removeRow(rowIndex: number) {
        this.data.splice(rowIndex, 1);
    }

    // Reordering
    // ==========

    public reorderColumns(oldIndex: number, newIndex: number, length: number) {
        this.orderedColumnKeys = Utils.reorderArray(this.orderedColumnKeys, oldIndex, newIndex, length);
    }

    public reorderRows(oldIndex: number, newIndex: number, length: number) {
        this.data = Utils.reorderArray(this.data, oldIndex, newIndex, length);
    }

    // Cell manipulation
    // =================

    public get(rowIndex: number, columnIndex: number) {
        const columnKey = this.orderedColumnKeys[columnIndex];
        return (this.data[rowIndex] == null)
            ? this.DEFAULT_CELL_VALUE
            : this.data[rowIndex][columnKey];
    }

    public getColumnKey(columnIndex: number) {
        return this.orderedColumnKeys[columnIndex];
    }

    public set(rowIndex: number, columnIndex: number, value: T) {
        if (this.data[rowIndex] == null) {
            this.data[rowIndex] = this.createRow();
        }
        const columnKey = this.orderedColumnKeys[columnIndex];
        this.data[rowIndex][columnKey] = value;
    }

    // Private helpers
    // ===============

    private createRow() {
        return this.orderedColumnKeys.reduce((agg, columnKey) => {
            agg[columnKey] = this.DEFAULT_CELL_VALUE;
            return agg;
        }, {} as IDataRow<T>);
    }

    // private numColumns() {
    //     // return this.grid.length;
    //     return this.orderedColumnKeys.length;
    // }

    // private numRows() {
    //     // assume all columns have same number of rows
    //     // return this.grid.length === 0 ? 0 : this.grid[0].length;
    //     return this.data.length;
    // }

    // private forEachColumn(callback: (columnIndex: number) => void) {
    //     for (let col = 0; col < this.numColumns(); col++) {
    //         callback(col);
    //     }
    // }
}
