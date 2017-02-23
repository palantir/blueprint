/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { expect } from "chai";
import * as React from "react";

import { Cell, Column, Table, TableLoadingOption } from "../src";
import * as Classes from "../src/common/classes";
import { CellType, expectCellLoading } from "./cellTestUtils";
import { ElementHarness, ReactHarness } from "./harness";

describe("<Table>", () => {
    const harness = new ReactHarness();

    afterEach(() => {
        harness.unmount();
    });

    after(() => {
        harness.destroy();
    });

    it("Defaults to Base26Alpha column names", () => {
        const table = harness.mount(
            <Table>
                <Column />
                <Column />
                <Column name="My Name" />
            </Table>,
        );

        expect(table.find(`.${Classes.TABLE_COLUMN_NAME_TEXT}`, 2).text()).to.equal("My Name");
        expect(table.find(`.${Classes.TABLE_COLUMN_NAME_TEXT}`, 1).text()).to.equal("B");
    });

    it("Renders without ghost cells", () => {
        const table = harness.mount(
            <Table>
                <Column />
            </Table>,
        );

        expect(table.find(`.${Classes.TABLE_COLUMN_HEADERS} .${Classes.TABLE_HEADER}`, 0).element).to.be.ok;
        expect(table.find(`.${Classes.TABLE_COLUMN_HEADERS} .${Classes.TABLE_HEADER}`, 1).element).to.not.be.ok;
    });

    it("Renders ghost cells", () => {
        const table = harness.mount(
            <Table fillBodyWithGhostCells={true}>
                <Column />
            </Table>,
        );

        expect(table.find(`.${Classes.TABLE_COLUMN_HEADERS} .${Classes.TABLE_HEADER}`, 0).element).to.be.ok;
        expect(table.find(`.${Classes.TABLE_COLUMN_HEADERS} .${Classes.TABLE_HEADER}`, 1).element).to.be.ok;
    });

    it("Renders correctly with loading options", () => {
        const renderCell = () => <Cell>my cell value</Cell>;
        const loadingOptions = [
            TableLoadingOption.CELLS,
            TableLoadingOption.COLUMN_HEADERS,
            TableLoadingOption.ROW_HEADERS,
        ];
        const tableHarness = harness.mount(
            <Table loadingOptions={loadingOptions} numRows={2}>
                <Column name="Column0" renderCell={renderCell} />
                <Column name="Column1" renderCell={renderCell} />
            </Table>,
        );

        expect(tableHarness.element.textContent).to.equal("");

        const cells = tableHarness.element.queryAll(`.${Classes.TABLE_CELL}`);
        cells.forEach((cell) => expectCellLoading(cell, CellType.BODY_CELL));

        const columnHeaders = tableHarness.element
            .queryAll(`.${Classes.TABLE_COLUMN_HEADERS} .${Classes.TABLE_HEADER}`);
        columnHeaders.forEach((columnHeader) => expectCellLoading(columnHeader, CellType.COLUMN_HEADER));

        const rowHeaders = tableHarness.element.queryAll(`.${Classes.TABLE_ROW_HEADERS} .${Classes.TABLE_HEADER}`);
        rowHeaders.forEach((rowHeader) => expectCellLoading(rowHeader, CellType.ROW_HEADER));
    });

    xit("Accepts a sparse array of column widths", () => {
        const table = harness.mount(
            <Table columnWidths={[null, 200, null]} defaultColumnWidth={75}>
                <Column />
                <Column />
                <Column />
            </Table>,
        );

        const columns = table.find(`.${Classes.TABLE_COLUMN_HEADERS}`);
        expect(columns.find(`.${Classes.TABLE_HEADER}`, 0).bounds().width).to.equal(75);
        expect(columns.find(`.${Classes.TABLE_HEADER}`, 1).bounds().width).to.equal(200);
        expect(columns.find(`.${Classes.TABLE_HEADER}`, 2).bounds().width).to.equal(75);
    });

    xdescribe("Persists column widths", () => {
        const expectHeaderWidth = (table: ElementHarness, index: number, width: number) => {
            expect(table
                .find(`.${Classes.TABLE_COLUMN_HEADERS}`)
                .find(`.${Classes.TABLE_HEADER}`, index)
                .bounds().width,
            ).to.equal(width);
        };

        it("remembers width for columns that have an ID", () => {
            const columns = [
                <Column key="a" id="a" />,
                <Column key="b" id="b" />,
                <Column key="c" id="c" />,
            ];

            // default and explicit sizes sizes
            const table0 = harness.mount(
                <Table columnWidths={[null, 100, null]} defaultColumnWidth={50}>{columns}</Table>,
            );
            expectHeaderWidth(table0, 0, 50);
            expectHeaderWidth(table0, 1, 100);
            expectHeaderWidth(table0, 2, 50);

            // removing explicit size props
            const table1 = harness.mount(
                <Table>{columns}</Table>,
            );
            expectHeaderWidth(table1, 0, 50);
            expectHeaderWidth(table1, 1, 100);
            expectHeaderWidth(table1, 2, 50);

            // re-arranging and REMOVING columns
            const table2 = harness.mount(
                <Table>{[columns[1], columns[0]]}</Table>,
            );
            expectHeaderWidth(table2, 0, 100);
            expectHeaderWidth(table2, 1, 50);

            // re-arranging and ADDING columns
            const table3 = harness.mount(
                <Table defaultColumnWidth={51}>{columns}</Table>,
            );
            expectHeaderWidth(table3, 0, 50);
            expectHeaderWidth(table3, 1, 100);
            expectHeaderWidth(table3, 2, 51);
        });

        it("remembers width for columns without IDs using index", () => {
            const columns = [
                <Column key="a" id="a" />,
                <Column key="b" />,
                <Column key="c" />,
            ];

            // default and explicit sizes sizes
            const table0 = harness.mount(
                <Table columnWidths={[null, 100, null]} defaultColumnWidth={50}>{columns}</Table>,
            );
            expectHeaderWidth(table0, 0, 50);
            expectHeaderWidth(table0, 1, 100);
            expectHeaderWidth(table0, 2, 50);

            // removing explicit size props
            const table1 = harness.mount(
                <Table>{columns}</Table>,
            );
            expectHeaderWidth(table1, 0, 50);
            expectHeaderWidth(table1, 1, 100);
            expectHeaderWidth(table1, 2, 50);

            // re-arranging and REMOVING columns
            const table2 = harness.mount(
                <Table>{[columns[1], columns[0]]}</Table>,
            );
            expectHeaderWidth(table2, 0, 50); // <= difference when no IDs
            expectHeaderWidth(table2, 1, 50);

            // re-arranging and ADDING columns
            const table3 = harness.mount(
                <Table defaultColumnWidth={51}>{columns}</Table>,
            );
            expectHeaderWidth(table3, 0, 50);
            expectHeaderWidth(table3, 1, 50); // <= difference when no IDs
            expectHeaderWidth(table3, 2, 51);
        });
    });

});
