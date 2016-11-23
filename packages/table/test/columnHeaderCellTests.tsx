/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import "es6-shim";

import { Menu, MenuItem } from "@blueprintjs/core";
import { expect } from "chai";
import * as React from "react";

import { ColumnHeaderCell } from "../src/index";
import { ElementHarness, ReactHarness } from "./harness";
import { createTableOfSize } from "./mocks/table";

describe("<ColumnHeaderCell>", () => {
    let harness = new ReactHarness();

    afterEach(() => {
        harness.unmount();
    });

    after(() => {
        harness.destroy();
    });

    it("Default renderer", () => {
        const table = harness.mount(createTableOfSize(3, 2));
        const text = table.find(".bp-table-column-name-text", 1).element.textContent;
        expect(text).to.equal("B");
    });

    describe("Custom renderer", () => {
        it("renders custom name", () => {
            const renderColumnHeader = (columnIndex: number) => {
                return (
                    <ColumnHeaderCell name={`COLUMN-${columnIndex}`}/>
                );
            };
            const table = harness.mount(createTableOfSize(3, 2, {renderColumnHeader}));
            const text = table.find(".bp-table-column-name-text", 1).element.textContent;
            expect(text).to.equal("COLUMN-1");
        });

        it("renders custom content", () => {
            const renderColumnHeader = (columnIndex: number) => {
                return (
                    <ColumnHeaderCell name={`COLUMN-${columnIndex}`}>
                        <h4>Header of {columnIndex}</h4>
                    </ColumnHeaderCell>
                );
            };
            const table = harness.mount(createTableOfSize(3, 2, {renderColumnHeader}));
            const text = table.find(".bp-table-header-content h4", 2).element.textContent;
            expect(text).to.equal("Header of 2");
        });

        it("renders custom menu items", () => {
            const menuClickSpy = sinon.spy();
            const menu = (
                <Menu>
                    <MenuItem
                        iconName="export"
                        onClick={menuClickSpy}
                        text="Teleport"
                    />
                    <MenuItem
                        iconName="sort-alphabetical-desc"
                        onClick={menuClickSpy}
                        text="Down with ZA!"
                    />
                    <MenuItem
                        iconName="curved-range-chart"
                        onClick={menuClickSpy}
                        text="Psi"
                    />
                </Menu>
            );

            const renderColumnHeader = (columnIndex: number) => {
                return (
                    <ColumnHeaderCell name={`COL-${columnIndex}`} menu={menu} />
                );
            };
            const table = harness.mount(createTableOfSize(3, 2, {renderColumnHeader}));

            table.find(".bp-table-column-headers").mouse("mousemove");
            table.find(".bp-table-th-menu").mouse("mousemove").mouse("click");
            ElementHarness.document().find(".pt-icon-export").mouse("click");
            expect(menuClickSpy.called).to.be.true;
        });
    });
});
