
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

    // TODO: FROZEN
    it.skip("displays a table with columns", () => {
        const table = harness.mount(
            <Table numRows={5}>
                <Column />
                <Column />
                <Column />
            </Table>,
        );

        expect(table.find(`.${Classes.TABLE_COLUMN_NAME_TEXT}`, 0).element).to.exist;
        expect(table.find(`.${Classes.TABLE_COLUMN_NAME_TEXT}`, 1).element).to.exist;
        expect(table.find(`.${Classes.TABLE_COLUMN_NAME_TEXT}`, 2).element).to.exist;
        expect(table.find(`.${Classes.TABLE_COLUMN_NAME_TEXT}`, 3).element).to.not.exist;
    });

    it("passes column name to renderer or defaults if none specified", () => {
        const table = harness.mount(
            <Table numRows={5}>
                <Column name="Zero"/>
                <Column name="One"/>
                <Column />
            </Table>,
        );

        expect(table.find(`.${Classes.TABLE_COLUMN_NAME_TEXT}`, 0).text()).to.equal("Zero");
        expect(table.find(`.${Classes.TABLE_COLUMN_NAME_TEXT}`, 1).text()).to.equal("One");
        // TODO: re-enable once other PR merges
        // expect(table.find(`.${Classes.TABLE_COLUMN_NAME_TEXT}`, 2).text()).to.equal("C");
    });

    // TODO: FROZEN
    it.skip("renders correctly with loading options", () => {
        const cellValue = "my cell value";
        const renderCell = () => <Cell>{cellValue}</Cell>;
        const table = harness.mount(
            <Table numRows={5}>
                <Column name="Zero" loadingOptions={[ ColumnLoadingOption.CELLS ]} renderCell={renderCell} />
                <Column
                    name="One"
                    loadingOptions={[ ColumnLoadingOption.CELLS, ColumnLoadingOption.HEADER ]}
                    renderCell={renderCell}
                />
                <Column name="Two" renderCell={renderCell} />
            </Table>,
        );

        const columnHeaders = table.element.queryAll(`.${Classes.TABLE_COLUMN_HEADERS} .${Classes.TABLE_HEADER}`);
        expectCellLoading(columnHeaders[0], CellType.COLUMN_HEADER, false);
        expectCellLoading(columnHeaders[1], CellType.COLUMN_HEADER);
        expectCellLoading(columnHeaders[2], CellType.COLUMN_HEADER, false);

        const col0CellsSelector = `.${Classes.columnCellIndexClass(0)}.${Classes.TABLE_CELL}`;
        const col0cells = table.element.queryAll(col0CellsSelector);
        col0cells.forEach((cell) => expectCellLoading(cell, CellType.BODY_CELL));
        expect(col0cells.length).to.equal(4);

        const col1CellsSelector = `.${Classes.columnCellIndexClass(1)}.${Classes.TABLE_CELL}`;
        const col1cells = table.element.queryAll(col1CellsSelector);
        col1cells.forEach((cell) => expectCellLoading(cell, CellType.BODY_CELL));
        expect(col1cells.length).to.equal(4);

        const col2CellsSelector = `.${Classes.columnCellIndexClass(2)}.${Classes.TABLE_CELL}`;
        const col2cells = table.element.queryAll(col2CellsSelector);
        col2cells.forEach((cell) => expectCellLoading(cell, CellType.BODY_CELL, false));
        expect(col2cells.length).to.equal(4);
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
