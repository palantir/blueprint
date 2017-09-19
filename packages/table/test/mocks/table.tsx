/**
 * @license Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 */

import * as React from "react";

import { Cell, Column, IColumnProps, ITableProps, Table, Utils } from "../../src";

export function createTableOfSize(numColumns: number, numRows: number, columnProps?: any, tableProps?: any) {
    const columns = Utils.times(numColumns, Utils.toBase26Alpha);
    const data = Utils.times(numRows, (row: number) => {
        return columns.map((column: string) => {
            return column + row;
        });
    });
    return createTableWithData(columns, data, columnProps, tableProps);
}

export function createTableWithData(columnNames: string[], data: string[][], columnProps?: any, tableProps?: any) {
    // combine column overrides
    const columnPropsWithDefaults = {
        renderCell: (rowIndex: number, columnIndex: number) => <Cell>{data[rowIndex][columnIndex]}</Cell>,
        ...columnProps,
    } as IColumnProps;

    // combine table overrides
    const tablePropsWithDefaults = {
        numRows: data.length,
        ...tableProps,
    } as ITableProps;

    const SampleColumns = columnNames.map((name, index) => {
        return <Column key={index} name={name} {...columnPropsWithDefaults} />;
    });

    return <Table {...tablePropsWithDefaults}>{SampleColumns}</Table>;
}
