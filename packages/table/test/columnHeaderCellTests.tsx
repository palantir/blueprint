/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import { ColumnHeaderCell } from "../src/index";
import { ElementHarness, ReactHarness } from "./harness";
import { createTableOfSize } from "./mocks/table";
import { Menu, MenuItem } from "@blueprint/core";
import { expect } from "chai";
import "es6-shim";

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
