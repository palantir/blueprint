/**
 * @license Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 */

import * as React from "react";

import {
    Cell,
    Column,
    IColumnProps,
    ITableProps,
    Table,
    Utils,
} from "../../src";

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
    const columnPropsWithDefaults = Object.assign({
        renderCell: (rowIndex: number, columnIndex: number) => {
            const cell = data[rowIndex][columnIndex];
            return ( <Cell>{ cell }</Cell> );
        },
    }, columnProps) as IColumnProps;

    // combine table overrides
    const tablePropsWithDefaults = Object.assign({
        numRows: data.length,
    }, tableProps) as ITableProps;

    /* tslint:disable:variable-name */
    const SampleColumns = columnNames.map((name, index) => {
        return (
             <Column key={index} name={name} {...columnPropsWithDefaults} />
        );
    });
    /* tslint:enable:variable-name */

    // return component
    return (
        <Table {...tablePropsWithDefaults}>
            {SampleColumns}
        </Table>
    );
}
