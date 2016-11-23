
/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { expect } from "chai";
import * as React from "react";
import { Column, Table } from "../src";
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
});
