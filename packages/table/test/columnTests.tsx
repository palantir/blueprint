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

import { expect } from "chai";
import * as React from "react";

import { Cell, Column, ColumnLoadingOption, Table } from "../src";
import * as Classes from "../src/common/classes";
import { CellType, expectCellLoading } from "./cellTestUtils";
import { ElementHarness, ReactHarness } from "./harness";

describe("Column", () => {
    const harness = new ReactHarness();

    afterEach(() => {
        harness.unmount();
    });

    after(() => {
        harness.destroy();
    });

    it("displays a table with columns", () => {
        const table = harness.mount(
            <Table numRows={5}>
                <Column />
                <Column />
                <Column />
            </Table>,
        );
        const selector = `.${Classes.TABLE_QUADRANT_MAIN} .${Classes.TABLE_COLUMN_NAME_TEXT}`;
        expect(table.find(selector, 0).element).to.exist;
        expect(table.find(selector, 1).element).to.exist;
        expect(table.find(selector, 2).element).to.exist;
        expect(table.find(selector, 3).element).to.not.exist;
    });

    it("passes column name to renderer or defaults if none specified", () => {
        const table = harness.mount(
            <Table numRows={5}>
                <Column name="Zero" />
                <Column name="One" />
                <Column />
            </Table>,
        );

        const selector = `.${Classes.TABLE_QUADRANT_MAIN} .${Classes.TABLE_COLUMN_NAME_TEXT}`;

        expect(table.find(selector, 0).text()).to.equal("Zero"); // custom
        expect(table.find(selector, 1).text()).to.equal("One"); // custom
        expect(table.find(selector, 2).text()).to.equal("C"); // default
    });

    it("renders correctly with loading options", () => {
        const NUM_ROWS = 5;
        const cellValue = "my cell value";
        const cellRenderer = () => <Cell>{cellValue}</Cell>;
        const table = harness.mount(
            <Table numRows={NUM_ROWS}>
                <Column name="Zero" loadingOptions={[ColumnLoadingOption.CELLS]} cellRenderer={cellRenderer} />
                <Column
                    name="One"
                    loadingOptions={[ColumnLoadingOption.CELLS, ColumnLoadingOption.HEADER]}
                    cellRenderer={cellRenderer}
                />
                <Column name="Two" cellRenderer={cellRenderer} />
            </Table>,
        );

        const columnHeaders = table.element.querySelectorAll(
            `.${Classes.TABLE_QUADRANT_TOP} .${Classes.TABLE_COLUMN_HEADERS} .${Classes.TABLE_HEADER}`,
        );

        expectCellLoading(columnHeaders[0], CellType.COLUMN_HEADER, false);
        expectCellLoading(columnHeaders[1], CellType.COLUMN_HEADER);
        expectCellLoading(columnHeaders[2], CellType.COLUMN_HEADER, false);

        expectColumnCells(table, 0, true, NUM_ROWS);
        expectColumnCells(table, 1, true, NUM_ROWS);
        expectColumnCells(table, 2, false, NUM_ROWS);
    });

    it("passes custom class name to renderer", () => {
        const CLASS_NAME = "my-custom-class-name";
        const table = harness.mount(
            <Table numRows={5}>
                <Column className={CLASS_NAME} />
            </Table>,
        );
        const hasCustomClass = table.find(`.${Classes.TABLE_HEADER}`, 0).hasClass(CLASS_NAME);
        expect(hasCustomClass).to.be.true;
    });

    function expectColumnCells(
        table: ElementHarness,
        columnIndex: number,
        isCellLoading: boolean,
        expectedLength: number,
    ) {
        const cellsSelector = `.${Classes.TABLE_QUADRANT_MAIN} .${Classes.columnCellIndexClass(columnIndex)}.${
            Classes.TABLE_CELL
        }`;
        const cells = Array.from(table.element.querySelectorAll(cellsSelector));
        cells.forEach(cell => expectCellLoading(cell, CellType.BODY_CELL, isCellLoading));
        expect(cells.length).to.equal(expectedLength);
    }
});
