/*
 * Copyright 2022 Palantir Technologies, Inc. All rights reserved.
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
import { mount } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";

import { H4, Menu, MenuItem } from "@blueprintjs/core";
import { Classes as Popover2Classes } from "@blueprintjs/popover2";

import { ColumnHeaderCell2, ColumnHeaderCell2Props } from "../src";
import * as Classes from "../src/common/classes";
import { ElementHarness, ReactHarness } from "./harness";
import { createTableOfSize } from "./mocks/table";

describe("<ColumnHeaderCell2>", () => {
    const harness = new ReactHarness();

    afterEach(() => {
        harness.unmount();
    });

    after(() => {
        harness.destroy();
    });

    it("Default renderer", () => {
        const table = harness.mount(createTableOfSize(3, 2));
        const text = table.find(`.${Classes.TABLE_COLUMN_NAME_TEXT}`, 1)!.text();
        expect(text).to.equal("B");
    });

    it("renders with custom className if provided", () => {
        const CLASS_NAME = "my-custom-class-name";
        const table = harness.mount(<ColumnHeaderCell2 className={CLASS_NAME} />);
        const hasCustomClass = table.find(`.${Classes.TABLE_HEADER}`, 0)!.hasClass(CLASS_NAME);
        expect(hasCustomClass).to.be.true;
    });

    it("passes index prop to nameRenderer callback if index was provided", () => {
        const renderNameStub = sinon.stub();
        renderNameStub.returns(<span>name</span>);
        const NAME = "my-name";
        const INDEX = 17;
        mount(<ColumnHeaderCell2 index={INDEX} name={NAME} nameRenderer={renderNameStub} />);
        expect(renderNameStub.firstCall.args).to.deep.equal([NAME, INDEX]);
    });

    describe("Custom renderer", () => {
        const menuClickSpy = sinon.spy();

        beforeEach(() => {
            menuClickSpy.resetHistory();
        });

        it("renders custom name", () => {
            const columnHeaderCellRenderer = (columnIndex: number) => {
                return <ColumnHeaderCell2 name={`COLUMN-${columnIndex}`} />;
            };
            const table = harness.mount(createTableOfSize(3, 2, { columnHeaderCellRenderer }));
            const text = table.find(`.${Classes.TABLE_COLUMN_NAME_TEXT}`, 1)!.text();
            expect(text).to.equal("COLUMN-1");
        });

        it("renders custom content", () => {
            const columnHeaderCellRenderer = (columnIndex: number) => {
                return (
                    <ColumnHeaderCell2 name={`COLUMN-${columnIndex}`}>
                        <H4>Header of {columnIndex}</H4>
                    </ColumnHeaderCell2>
                );
            };
            const table = harness.mount(createTableOfSize(3, 2, { columnHeaderCellRenderer }));
            const text = table.find(`.${Classes.TABLE_HEADER_CONTENT} h4`, 2)!.text();
            expect(text).to.equal("Header of 2");
        });

        it("renders custom menu items with a menuRenderer callback", () => {
            const columnHeaderCellRenderer = (columnIndex: number) => (
                <ColumnHeaderCell2 name={`COL-${columnIndex}`} menuRenderer={renderMenu} />
            );
            const table = harness.mount(createTableOfSize(3, 2, { columnHeaderCellRenderer }));
            expectMenuToOpen(table);

            // attempt to click one of the menu items
            ElementHarness.document().find('[data-icon="export"]')!.mouse("click");
            expect(menuClickSpy.called).to.be.true;
        });

        it("custom menu supports popover props", () => {
            const expectedMenuPopoverProps = {
                placement: "top" as const,
                popoverClassName: "test-popover-class",
            };
            const columnHeaderCellRenderer = (columnIndex: number) => (
                <ColumnHeaderCell2
                    name={`COL-${columnIndex}`}
                    menuRenderer={renderMenu}
                    menuPopoverProps={expectedMenuPopoverProps}
                />
            );
            const table = harness.mount(createTableOfSize(3, 2, { columnHeaderCellRenderer }));
            expectMenuToOpen(table);
            const popover = ElementHarness.document().find(`.${Popover2Classes.POPOVER2}`);
            expect(popover.hasClass(expectedMenuPopoverProps.popoverClassName)).to.be.true;
            expect(
                popover.hasClass(`${Popover2Classes.POPOVER2_CONTENT_PLACEMENT}-${expectedMenuPopoverProps.placement}`),
            ).to.be.true;
        });

        it("renders loading state properly", () => {
            const columnHeaderCellRenderer = (columnIndex: number) => {
                return <ColumnHeaderCell2 loading={columnIndex === 0} name="Column Header" />;
            };
            const table = harness.mount(createTableOfSize(2, 1, { columnHeaderCellRenderer }));
            expect(table.find(`.${Classes.TABLE_COLUMN_HEADERS} .${Classes.TABLE_HEADER}`, 0)!.text()).to.equal("");
            expect(table.find(`.${Classes.TABLE_COLUMN_HEADERS} .${Classes.TABLE_HEADER}`, 1)!.text()).to.equal(
                "Column Header",
            );
        });

        function renderMenu() {
            return (
                <Menu>
                    <MenuItem icon="export" onClick={menuClickSpy} text="Teleport" />
                    <MenuItem icon="sort-alphabetical-desc" onClick={menuClickSpy} text="Down with ZA!" />
                    <MenuItem icon="curved-range-chart" onClick={menuClickSpy} text="Psi" />
                </Menu>
            );
        }

        function expectMenuToOpen(table: ElementHarness) {
            table.find(`.${Classes.TABLE_COLUMN_HEADERS}`)!.mouse("mousemove");
            const target = table.find(`.${Classes.TABLE_TH_MENU}.${Popover2Classes.POPOVER2_TARGET}`)!;
            target.mouse("click");
            expect(target.hasClass(Popover2Classes.POPOVER2_OPEN)).to.be.true;
        }
    });

    describe("Reorder handle", () => {
        const REORDER_HANDLE_CLASS = Classes.TABLE_REORDER_HANDLE_TARGET;

        it("shows reorder handle in interaction bar if reordering and interaction bar are enabled", () => {
            const wrapper = mountHeaderCell();
            expect(wrapper.find(`.${Classes.TABLE_INTERACTION_BAR} .${REORDER_HANDLE_CLASS}`)!.exists()).to.be.true;
        });

        it("shows reorder handle next to column name if reordering enabled but interaction bar disabled", () => {
            const wrapper = mountHeaderCell({ enableColumnInteractionBar: false });
            expect(wrapper.find(`.${Classes.TABLE_COLUMN_NAME} .${REORDER_HANDLE_CLASS}`)!.exists()).to.be.true;
        });

        function mountHeaderCell(props?: Partial<ColumnHeaderCell2Props>) {
            return mount(
                <ColumnHeaderCell2
                    enableColumnInteractionBar={true}
                    reorderHandle={<div className={REORDER_HANDLE_CLASS} />}
                    enableColumnReordering={true}
                    {...props}
                />,
            );
        }
    });
});
