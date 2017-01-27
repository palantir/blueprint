/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as React from "react";

import {
    Cell,
    Column,
    ColumnHeaderCell,
    ColumnLoadingOption,
    RowHeaderCell,
    Table,
    TableLoadingOption,
} from "../src";
import { CellType, expectCellLoading } from "./cellTestUtils";
import { ReactHarness } from "./harness";

interface ITableLoadingOptionsTesterProps {
    columnLoadingOptions: ColumnLoadingOption[];
    tableLoadingOptions: TableLoadingOption[];
}

class TableLoadingOptionsTester extends React.Component<ITableLoadingOptionsTesterProps, {}> {
    public static isCellLoading = (index: number) => {
        if (index === 0) {
            return true;
        } else if (index === 1) {
            return false;
        } else {
            return undefined;
        }
    }

    private static renderCell = (rowIndex: number) => {
        return <Cell loading={TableLoadingOptionsTester.isCellLoading(rowIndex)}>some cell text</Cell>;
    }

    private static renderColumnHeader = (columnIndex: number) => {
        return <ColumnHeaderCell loading={TableLoadingOptionsTester.isCellLoading(columnIndex)} name="column header" />;
    }

    private static renderRowHeader = (rowIndex: number) => {
        return <RowHeaderCell loading={TableLoadingOptionsTester.isCellLoading(rowIndex)} name="row header" />;
    }

    public render() {
        const { columnLoadingOptions, tableLoadingOptions } = this.props;
        return (
            <Table
                loadingOptions={tableLoadingOptions}
                numRows={3}
                renderRowHeader={TableLoadingOptionsTester.renderRowHeader}
            >
                <Column
                    loadingOptions={columnLoadingOptions}
                    renderCell={TableLoadingOptionsTester.renderCell}
                    renderColumnHeader={TableLoadingOptionsTester.renderColumnHeader}
                />
                <Column
                    loadingOptions={columnLoadingOptions}
                    renderColumnHeader={TableLoadingOptionsTester.renderColumnHeader}
                />
                <Column
                    loadingOptions={columnLoadingOptions}
                    renderColumnHeader={TableLoadingOptionsTester.renderColumnHeader}
                />
            </Table>
        );
    }
}

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

    afterEach(() => {
        harness.unmount();
    });

    after(() => {
        harness.destroy();
    });

    // Below is an exhaustive set of tests of all possible combinations of loading options
    allTableLoadingOptions.forEach((tableLoadingOptions) => {
        allColumnLoadingOptions.forEach((columnLoadingOptions) => {
            it(`table: [${tableLoadingOptions}], column: [${columnLoadingOptions}]`, () => {
                const tableHarness = harness.mount(
                    <TableLoadingOptionsTester
                        columnLoadingOptions={columnLoadingOptions}
                        tableLoadingOptions={tableLoadingOptions}
                    />,
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
                    TableLoadingOptionsTester.isCellLoading,
                    columnLoadingOptions,
                    tableLoadingOptions,
                );
                testLoadingOptionOverrides(
                    rowHeaders,
                    CellType.ROW_HEADER,
                    TableLoadingOptionsTester.isCellLoading,
                    columnLoadingOptions,
                    tableLoadingOptions,
                );
                testLoadingOptionOverrides(
                    cells,
                    CellType.BODY_CELL,
                    TableLoadingOptionsTester.isCellLoading,
                    columnLoadingOptions,
                    tableLoadingOptions,
                );
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

/*
 * This function tests the expected loading option override behavior for all cell types.
 *
 * For convenience, it accepts a list of cells of a single type and tests that each cell conforms to
 * the expected loading option override behavior.
 *
 * For any given cell, beginning at the cell-level, if loading options are present, use them for
 * cell rendering and ignore parent options. If loading options are absent look to the closest
 * parent. For body cells and column headers, this means look to the column-level loading options.
 * For row headers, this means look to the table-level. Repeat this process until loading options
 * are found. If loading options ultimately remain undefined, do not render the loading state for
 * the cell.
 */
function testLoadingOptionOverrides(
    cells: NodeListOf<Element>,
    cellType: CellType,
    cellLoading: (index: number) => boolean,
    columnLoadingOptions: ColumnLoadingOption[],
    tableLoadingOptions: TableLoadingOption[],
) {
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
