
/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { expect } from "chai";
import * as React from "react";
import { Cell, Column, ColumnLoadingOption, Table } from "../src";
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

        expect(table.find(".bp-table-column-name-text", 0).element).to.exist;
        expect(table.find(".bp-table-column-name-text", 1).element).to.exist;
        expect(table.find(".bp-table-column-name-text", 2).element).to.exist;
        expect(table.find(".bp-table-column-name-text", 3).element).to.not.exist;
    });

    it("passes column name to renderer or defaults if none specified", () => {
        const table = harness.mount(
            <Table numRows={5}>
                <Column name="Zero"/>
                <Column name="One"/>
                <Column />
            </Table>,
        );

        expect(table.find(".bp-table-column-name-text", 0).text()).to.equal("Zero");
        expect(table.find(".bp-table-column-name-text", 1).text()).to.equal("One");
        // TODO: re-enable once other PR merges
        // expect(table.find(".bp-table-column-name-text", 2).text()).to.equal("C");
    });

    it("renders correctly with loading options", () => {
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

        const columnHeaderSelector = ".bp-table-column-headers .bp-table-header";
        expect(table.find(columnHeaderSelector, 0).text()).to.equal("Zero");
        expect(table.find(columnHeaderSelector, 1).text()).to.equal("");
        expect(table.find(columnHeaderSelector, 2).text()).to.equal("Two");

        const col0cells = table.element.querySelectorAll(".bp-table-cell-col-0");
        for (let i = 0; i < col0cells.length; i++) {
            expect(col0cells.item(i).textContent).to.equal("");
        }

        const col1cells = table.element.querySelectorAll(".bp-table-cell-col-1");
        for (let i = 0; i < col1cells.length; i++) {
            expect(col1cells.item(i).textContent).to.equal("");
        }

        const col2cells = table.element.querySelectorAll(".bp-table-cell-col-2");
        for (let i = 0; i < col2cells.length; i++) {
            expect(col2cells.item(i).textContent).to.equal(cellValue);
        }

    });
});
