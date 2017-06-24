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

interface IColumnNameDict<T> {
    [key: string]: T;
}

type Data<T> = Array<IDataRow<T>>;

export class DenseGridMutableStore<T> {
    private data: Data<T>;
    private columnNameDict: IColumnNameDict<T>;
    private orderedColumnKeys: string[];
    private DEFAULT_CELL_VALUE: T = undefined;

    public constructor() {
        this.clear();
    }

    public clear() {
        this.data = [];
        this.orderedColumnKeys = [];
        this.columnNameDict = {};
    }

    /**
     * Specifies the order of the column keys. Must invoke this before invoking `set` to ensure
     * there is a key for each column.
     */
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

    public getColumnName(columnIndex: number) {
        const columnKey = this.orderedColumnKeys[columnIndex];
        return this.columnNameDict[columnKey];
    }

    public set(rowIndex: number, columnIndex: number, value: T) {
        if (this.data[rowIndex] == null) {
            this.data[rowIndex] = this.createRow();
        }
        const columnKey = this.orderedColumnKeys[columnIndex];
        this.data[rowIndex][columnKey] = value;
    }

    public setColumnName(columnIndex: number, value: T) {
        const columnKey = this.orderedColumnKeys[columnIndex];
        this.columnNameDict[columnKey] = value;
    }

    // Private helpers
    // ===============

    private createRow() {
        return this.orderedColumnKeys.reduce((agg, columnKey) => {
            agg[columnKey] = this.DEFAULT_CELL_VALUE;
            return agg;
        }, {} as IDataRow<T>);
    }
}
