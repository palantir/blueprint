/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as React from "react";

import { Cell, Column, IColumnProps, ITableProps, RenderMode, Table, Utils } from "../../src";

export function createStringOfLength(length: number) {
    return new Array(length).fill("a").join("");
}

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
    const columnPropsWithDefaults: IColumnProps = {
        cellRenderer: (rowIndex: number, columnIndex: number) => <Cell>{data[rowIndex][columnIndex]}</Cell>,
        ...columnProps,
    };

    // combine table overrides
    const tablePropsWithDefaults: ITableProps = {
        numRows: data.length,
        renderMode: RenderMode.NONE, // much easier to test things when all cells render synchronously
        ...tableProps,
    };

    const SampleColumns = columnNames.map((name, index) => {
        return <Column key={index} name={name} {...columnPropsWithDefaults} />;
    });

    return <Table {...tablePropsWithDefaults}>{SampleColumns}</Table>;
}
