/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as React from "react";

import { Cell,
    Column,
    ColumnHeaderCell,
    ColumnLoadingOption,
    RowHeaderCell,
    RowLoadingOption,
    Table,
    TableLoadingOption,
} from "../src";
import { CellType, expectCellLoading } from "./cellTestUtils";
import { ReactHarness } from "./harness";

describe("Loading Options", () => {
    const harness = new ReactHarness();
    const allTableLoadingOptions = generatePowerSet([
        TableLoadingOption.CELLS,
        TableLoadingOption.COLUMN_HEADERS,
        TableLoadingOption.ROW_HEADERS,
    ]);
    const allColumnLoadingOptions = generatePowerSet([
        ColumnLoadingOption.CELLS,
        ColumnLoadingOption.HEADER,
    ]);
    const allRowLoadingOptions = generatePowerSet([
        RowLoadingOption.CELLS,
        RowLoadingOption.HEADER,
    ]);

    afterEach(() => {
        harness.unmount();
    });

    after(() => {
        harness.destroy();
    });

    /*
     * Cell loading overrides column loading which in turn overrides table loading. If loading
     * options are omitted, then the loading options of the parent component are used. Because there
     * is no `Row` component, row header cell loading overrides table loading. Below is an
     * exhaustive set of tests of all possible combinations of loading options.
     */
    allTableLoadingOptions.forEach((tableLoadingOptions: TableLoadingOption[]) => {
        allColumnLoadingOptions.forEach((columnLoadingOptions: ColumnLoadingOption[]) => {
            allRowLoadingOptions.forEach((rowLoadingOptions: RowLoadingOption[]) => {
                it(`table: ${tableLoadingOptions}, column: ${columnLoadingOptions}, row: ${rowLoadingOptions}`, () => {
                    const isCellLoading = (index: number) => {
                        if (index === 0) {
                            return true;
                        } else if (index === 1) {
                            return false;
                        } else {
                            return undefined;
                        }
                    };

                    const renderCell = (rowIndex: number) => {
                        return <Cell loading={isCellLoading(rowIndex)}>some cell text</Cell>;
                    };
                    const renderColumnHeader = (columnIndex: number) => {
                        return <ColumnHeaderCell loading={isCellLoading(columnIndex)} name="column header" />;
                    };
                    const renderRowHeader = (rowIndex: number) => {
                        return <RowHeaderCell loading={isCellLoading(rowIndex)} name="row header" />;
                    };

                    const tableHarness = harness.mount(
                        <Table loadingOptions={tableLoadingOptions} numRows={2} renderRowHeader={renderRowHeader}>
                            <Column
                                loadingOptions={columnLoadingOptions}
                                renderCell={renderCell}
                                renderColumnHeader={renderColumnHeader}
                            />
                            <Column
                                loadingOptions={columnLoadingOptions}
                                renderColumnHeader={renderColumnHeader}
                            />
                            <Column
                                loadingOptions={columnLoadingOptions}
                                renderColumnHeader={renderColumnHeader}
                            />
                        </Table>,
                    );

                    // only testing the first column of body cells because the second and third
                    // columns are meant to test column related loading combinations
                    const cells = tableHarness.element.querySelectorAll(".bp-table-cell.bp-table-cell-col-0");
                    const columnHeaders = tableHarness.element
                        .querySelectorAll(".bp-table-column-headers .bp-table-header");
                    const rowHeaders = tableHarness.element.querySelectorAll(".bp-table-row-headers .bp-table-header");
                    testLoadingOptionOverrides(
                        columnHeaders,
                        CellType.COLUMN_HEADER,
                        isCellLoading,
                        columnLoadingOptions,
                        tableLoadingOptions,
                    );
                    testLoadingOptionOverrides(
                        rowHeaders,
                        CellType.ROW_HEADER,
                        isCellLoading,
                        columnLoadingOptions,
                        tableLoadingOptions,
                    );
                    testLoadingOptionOverrides(
                        cells,
                        CellType.BODY_CELL,
                        isCellLoading,
                        columnLoadingOptions,
                        tableLoadingOptions,
                    );
                });
            });
        });
    });
});

function generatePowerSet<T>(list: T[]) {
    const base2 = (number: number) => number.toString(2);
    const numberOfSubsets = Math.pow(2, list.length);
    const listOfSubsets: T[][] = [];

    for (let i = 1; i < numberOfSubsets; i++) {
        const subset: T[] = [];
        // front-pad the string and then slice from the back to ensure fixed length binary string
        let binaryString = (Array(list.length).join("0") + base2(i)).slice(list.length * -1);
        for (let j = 0; j < binaryString.length; j++) {
            if (binaryString.charAt(j) === "1") {
                subset.push(list[j]);
            }
        }
        listOfSubsets.push(subset);
    }

    return listOfSubsets;
}

function testLoadingOptionOverrides(
    cells: NodeListOf<Element>,
    cellType: CellType,
    cellLoading: (index: number) => boolean,
    columnLoadingOptions: ColumnLoadingOption[],
    tableLoadingOptions: TableLoadingOption[]) {

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < cells.length; i++) {
        if (cellLoading(i)) {
            expectCellLoading(cells[i], cellType, true);
        } else if (cellLoading(i) === false) {
            expectCellLoading(cells[i], cellType, false);
        } else if ((cellType === CellType.BODY_CELL || cellType === CellType.COLUMN_HEADER)
            && columnLoadingOptions != null) {

            // cast is safe because cellType is guaranteed to not be TableLoadingOption.ROW_HEADERS
            const loading = columnLoadingOptions.indexOf(cellType as ColumnLoadingOption) >= 0;
            expectCellLoading(cells[i], cellType, loading);
        } else if (tableLoadingOptions != null) {
            expectCellLoading(cells[i], cellType, tableLoadingOptions.indexOf(cellType) >= 0);
        } else {
            expectCellLoading(cells[i], cellType, false);
        }
    }
}
