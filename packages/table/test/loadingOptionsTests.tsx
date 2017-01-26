/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { expect } from "chai";
import * as React from "react";
import { Cell, Column, ColumnLoadingOption, Table, TableLoadingOption } from "../src";
import { ReactHarness } from "./harness";

describe("Loading Options", () => {
    const harness = new ReactHarness();

    afterEach(() => {
        harness.unmount();
    });

    after(() => {
        harness.destroy();
    });

    it("cell, column, and table options override each other correctly", () => {
        // The text value of each cell indicates its coordinates in the table, allowing us to
        // execute a single `table.textContent` to determine which cells are loading
        const renderCell = (rowIndex: number, columnIndex: number) => {
            let loading: boolean;
            if (rowIndex === 0) {
                loading = true;
            }
            if (rowIndex === 0 && columnIndex === 1) {
                loading = false;
            }
            return <Cell loading={loading}>{`row${rowIndex}col${columnIndex}|`}</Cell>;
        };
        const loadingOptions = [
            TableLoadingOption.CELLS,
            TableLoadingOption.COLUMN_HEADERS,
            TableLoadingOption.ROW_HEADERS,
        ];
        const tableHarness = harness.mount(
            <Table loadingOptions={loadingOptions} numRows={2}>
                <Column name="Column0" loadingOptions={[ ColumnLoadingOption.HEADER ]} renderCell={renderCell} />
                <Column name="Column1" renderCell={renderCell} />
            </Table>,
        );
        const tableElement = tableHarness.element.children[0];

        /**
         * Cell loading overrides column loading which in turn overrides table loading. If loading
         * options are omitted, then the loading options of the parent component are used. The
         * following table explains why only the cells in (row0, col1) and (row1, col0) are expected
         * to not show their loading state.
         *
         *              Loading
         * Row | Col    Cell | Column | Table | Result
         * ---------    ------------------------------
         *   0     0       T        F       T        T
         *   0     1       F     null       T        F
         *   1     0    null        F       T        F
         *   1     1    null     null       T        T
         */
        expect(tableElement.textContent).to.equal("row0col1|row1col0|");
    });
});
