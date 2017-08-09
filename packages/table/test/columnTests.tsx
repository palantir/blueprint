
/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { expect } from "chai";
import * as React from "react";

import { Cell, Column, ColumnLoadingOption, Table } from "../src";
import * as Classes from "../src/common/classes";
import { CellType, expectCellLoading } from "./cellTestUtils";
import { ReactHarness } from "./harness";

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
                <Column name="Zero"/>
                <Column name="One"/>
                <Column />
            </Table>,
        );

        const selector = `.${Classes.TABLE_QUADRANT_MAIN} .${Classes.TABLE_COLUMN_NAME_TEXT}`;

        expect(table.find(selector, 0).text()).to.equal("Zero"); // custom
        expect(table.find(selector, 1).text()).to.equal("One"); // custom
        expect(table.find(selector, 2).text()).to.equal("C"); // default
    });

    // TODO: Why was this test expecting four cells per column in a table with 5 rows?
    it("renders correctly with loading options", () => {
        const NUM_ROWS = 5;
        const cellValue = "my cell value";
        const renderCell = () => <Cell>{cellValue}</Cell>;
        const table = harness.mount(
            <Table numRows={NUM_ROWS}>
                <Column name="Zero" loadingOptions={[ ColumnLoadingOption.CELLS ]} renderCell={renderCell} />
                <Column
                    name="One"
                    loadingOptions={[ ColumnLoadingOption.CELLS, ColumnLoadingOption.HEADER ]}
                    renderCell={renderCell}
                />
                <Column name="Two" renderCell={renderCell} />
            </Table>,
        );

        const columnHeaders = table.element.queryAll(
            `.${Classes.TABLE_QUADRANT_TOP} .${Classes.TABLE_COLUMN_HEADERS} .${Classes.TABLE_HEADER}`);

        expectCellLoading(columnHeaders[0], CellType.COLUMN_HEADER, false);
        expectCellLoading(columnHeaders[1], CellType.COLUMN_HEADER);
        expectCellLoading(columnHeaders[2], CellType.COLUMN_HEADER, false);

        const col0CellsSelector =
            `.${Classes.TABLE_QUADRANT_MAIN} .${Classes.columnCellIndexClass(0)}.${Classes.TABLE_CELL}`;
        const col0cells = table.element.queryAll(col0CellsSelector);
        col0cells.forEach((cell) => expectCellLoading(cell, CellType.BODY_CELL));
        expect(col0cells.length).to.equal(NUM_ROWS);

        const col1CellsSelector =
            `.${Classes.TABLE_QUADRANT_MAIN} .${Classes.columnCellIndexClass(1)}.${Classes.TABLE_CELL}`;
        const col1cells = table.element.queryAll(col1CellsSelector);
        col1cells.forEach((cell) => expectCellLoading(cell, CellType.BODY_CELL));
        expect(col1cells.length).to.equal(NUM_ROWS);

        const col2CellsSelector =
            `.${Classes.TABLE_QUADRANT_MAIN} .${Classes.columnCellIndexClass(2)}.${Classes.TABLE_CELL}`;
        const col2cells = table.element.queryAll(col2CellsSelector);
        col2cells.forEach((cell) => expectCellLoading(cell, CellType.BODY_CELL, false));
        expect(col2cells.length).to.equal(NUM_ROWS);
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
});
