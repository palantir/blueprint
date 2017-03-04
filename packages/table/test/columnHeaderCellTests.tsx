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

import * as Classes from "../src/common/classes";
import { ColumnHeaderCell } from "../src/index";
import { ElementHarness, ReactHarness } from "./harness";
import { createTableOfSize } from "./mocks/table";

describe("<ColumnHeaderCell>", () => {
    const harness = new ReactHarness();

    afterEach(() => {
        harness.unmount();
    });

    after(() => {
        harness.destroy();
    });

    it("Default renderer", () => {
        const table = harness.mount(createTableOfSize(3, 2));
        const text = table.find(`.${Classes.TABLE_COLUMN_NAME_TEXT}`, 1).element.textContent;
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
            const text = table.find(`.${Classes.TABLE_COLUMN_NAME_TEXT}`, 1).element.textContent;
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
            const text = table.find(`.${Classes.TABLE_HEADER_CONTENT} h4`, 2).element.textContent;
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

            table.find(`.${Classes.TABLE_COLUMN_HEADERS}`).mouse("mousemove");
            table.find(`.${Classes.TABLE_TH_MENU}`).mouse("mousemove").mouse("click");
            ElementHarness.document().find(".pt-icon-export").mouse("click");
            expect(menuClickSpy.called).to.be.true;
        });

        it("renders loading state properly", () => {
            const renderColumnHeader = (columnIndex: number) => {
                return <ColumnHeaderCell loading={columnIndex === 0} name="Column Header" />;
            };
            const table = harness.mount(createTableOfSize(2, 1, { renderColumnHeader }));
            expect(table.find(`.${Classes.TABLE_COLUMN_HEADERS} .${Classes.TABLE_HEADER}`, 0).text()).to.equal("");
            expect(table.find(`.${Classes.TABLE_COLUMN_HEADERS} .${Classes.TABLE_HEADER}`, 1).text())
                .to.equal("Column Header");
        });
    });
});
