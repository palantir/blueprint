/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import "es6-shim";

import { Menu, MenuItem } from "@blueprintjs/core";
import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import * as Classes from "../src/common/classes";
import { ColumnHeaderCell, IColumnHeaderCellProps } from "../src/index";
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

    it("renders with custom className if provided", () => {
        const CLASS_NAME = "my-custom-class-name";
        const table = harness.mount(<ColumnHeaderCell className={CLASS_NAME} />);
        const hasCustomClass = table.find(`.${Classes.TABLE_HEADER}`, 0).hasClass(CLASS_NAME);
        expect(hasCustomClass).to.be.true;
    });

    it("passes index prop to renderName callback if index was provided", () => {
        const renderNameSpy = sinon.spy();
        const NAME = "my-name";
        const INDEX = 17;
        shallow(<ColumnHeaderCell index={INDEX} name={NAME} renderName={renderNameSpy} />);
        expect(renderNameSpy.firstCall.args).to.deep.equal([NAME, INDEX]);
    });

    describe("Custom renderer", () => {
        it("renders custom name", () => {
            const renderColumnHeader = (columnIndex: number) => {
                return <ColumnHeaderCell name={`COLUMN-${columnIndex}`} />;
            };
            const table = harness.mount(createTableOfSize(3, 2, { renderColumnHeader }));
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
            const table = harness.mount(createTableOfSize(3, 2, { renderColumnHeader }));
            const text = table.find(`.${Classes.TABLE_HEADER_CONTENT} h4`, 2).element.textContent;
            expect(text).to.equal("Header of 2");
        });

        it("renders custom menu items", () => {
            const menuClickSpy = sinon.spy();
            const menu = getMenuComponent(menuClickSpy);

            const renderColumnHeader = (columnIndex: number) => {
                return <ColumnHeaderCell name={`COL-${columnIndex}`} menu={menu} />;
            };
            const table = harness.mount(createTableOfSize(3, 2, { renderColumnHeader }));
            expectMenuToOpen(table, menuClickSpy);
        });

        it("renders custom menu items with a renderMenu callback", () => {
            const menuClickSpy = sinon.spy();
            const menu = getMenuComponent(menuClickSpy);
            const renderMenu = sinon.stub().returns(menu);

            const renderColumnHeader = (columnIndex: number) => (
                <ColumnHeaderCell name={`COL-${columnIndex}`} renderMenu={renderMenu} />
            );
            const table = harness.mount(createTableOfSize(3, 2, { renderColumnHeader }));
            expectMenuToOpen(table, menuClickSpy);
        });

        it("renders loading state properly", () => {
            const renderColumnHeader = (columnIndex: number) => {
                return <ColumnHeaderCell loading={columnIndex === 0} name="Column Header" />;
            };
            const table = harness.mount(createTableOfSize(2, 1, { renderColumnHeader }));
            expect(table.find(`.${Classes.TABLE_COLUMN_HEADERS} .${Classes.TABLE_HEADER}`, 0).text()).to.equal("");
            expect(table.find(`.${Classes.TABLE_COLUMN_HEADERS} .${Classes.TABLE_HEADER}`, 1).text()).to.equal(
                "Column Header",
            );
        });

        function getMenuComponent(menuClickSpy: Sinon.SinonSpy) {
            return (
                <Menu>
                    <MenuItem iconName="export" onClick={menuClickSpy} text="Teleport" />
                    <MenuItem iconName="sort-alphabetical-desc" onClick={menuClickSpy} text="Down with ZA!" />
                    <MenuItem iconName="curved-range-chart" onClick={menuClickSpy} text="Psi" />
                </Menu>
            );
        }

        function expectMenuToOpen(table: ElementHarness, menuClickSpy: Sinon.SinonSpy) {
            table.find(`.${Classes.TABLE_COLUMN_HEADERS}`).mouse("mousemove");
            table
                .find(`.${Classes.TABLE_TH_MENU}`)
                .mouse("mousemove")
                .mouse("click");
            ElementHarness.document()
                .find(".pt-icon-export")
                .mouse("click");
            expect(menuClickSpy.called).to.be.true;
        }
    });

    describe("Reorder handle", () => {
        const REORDER_HANDLE_CLASS = Classes.TABLE_REORDER_HANDLE_TARGET;

        it("shows reorder handle in interaction bar if reordering and interaction bar are enabled", () => {
            const element = mount({ useInteractionBar: true, isColumnReorderable: true });
            expect(element.find(`.${Classes.TABLE_INTERACTION_BAR} .${REORDER_HANDLE_CLASS}`).exists()).to.be.true;
        });

        it("shows reorder handle next to column name if reordering enabled but interaction bar disabled", () => {
            const element = mount({ useInteractionBar: false, isColumnReorderable: true });
            expect(element.find(`.${Classes.TABLE_COLUMN_NAME} .${REORDER_HANDLE_CLASS}`).exists()).to.be.true;
        });

        function mount(props: Partial<IColumnHeaderCellProps> & object) {
            const element = harness.mount(
                <ColumnHeaderCell
                    useInteractionBar={props.useInteractionBar}
                    isColumnReorderable={props.isColumnReorderable}
                    reorderHandle={<div className={REORDER_HANDLE_CLASS} />}
                />,
            );
            return element;
        }
    });
});
