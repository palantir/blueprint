/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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

import { Classes as CoreClasses, H4, Menu, MenuItem } from "@blueprintjs/core";
import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";

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

    it("passes index prop to nameRenderer callback if index was provided", () => {
        const renderNameStub = sinon.stub();
        renderNameStub.returns("string");
        const NAME = "my-name";
        const INDEX = 17;
        shallow(<ColumnHeaderCell index={INDEX} name={NAME} nameRenderer={renderNameStub} />);
        expect(renderNameStub.firstCall.args).to.deep.equal([NAME, INDEX]);
    });

    describe("Custom renderer", () => {
        it("renders custom name", () => {
            const columnHeaderCellRenderer = (columnIndex: number) => {
                return <ColumnHeaderCell name={`COLUMN-${columnIndex}`} />;
            };
            const table = harness.mount(createTableOfSize(3, 2, { columnHeaderCellRenderer }));
            const text = table.find(`.${Classes.TABLE_COLUMN_NAME_TEXT}`, 1).element.textContent;
            expect(text).to.equal("COLUMN-1");
        });

        it("renders custom content", () => {
            const columnHeaderCellRenderer = (columnIndex: number) => {
                return (
                    <ColumnHeaderCell name={`COLUMN-${columnIndex}`}>
                        <H4>Header of {columnIndex}</H4>
                    </ColumnHeaderCell>
                );
            };
            const table = harness.mount(createTableOfSize(3, 2, { columnHeaderCellRenderer }));
            const text = table.find(`.${Classes.TABLE_HEADER_CONTENT} h4`, 2).element.textContent;
            expect(text).to.equal("Header of 2");
        });

        it("renders custom menu items", () => {
            const menuClickSpy = sinon.spy();
            const menu = getMenuComponent(menuClickSpy);
            const renderMenuFn = () => menu;

            const columnHeaderCellRenderer = (columnIndex: number) => {
                return <ColumnHeaderCell name={`COL-${columnIndex}`} menuRenderer={renderMenuFn} />;
            };
            const table = harness.mount(createTableOfSize(3, 2, { columnHeaderCellRenderer }));
            expectMenuToOpen(table, menuClickSpy);
        });

        it("renders custom menu items with a menuRenderer callback", () => {
            const menuClickSpy = sinon.spy();
            const menu = getMenuComponent(menuClickSpy);
            const menuRenderer = sinon.stub().returns(menu);

            const columnHeaderCellRenderer = (columnIndex: number) => (
                <ColumnHeaderCell name={`COL-${columnIndex}`} menuRenderer={menuRenderer} />
            );
            const table = harness.mount(createTableOfSize(3, 2, { columnHeaderCellRenderer }));
            expectMenuToOpen(table, menuClickSpy);
        });

        it("renders loading state properly", () => {
            const columnHeaderCellRenderer = (columnIndex: number) => {
                return <ColumnHeaderCell loading={columnIndex === 0} name="Column Header" />;
            };
            const table = harness.mount(createTableOfSize(2, 1, { columnHeaderCellRenderer }));
            expect(table.find(`.${Classes.TABLE_COLUMN_HEADERS} .${Classes.TABLE_HEADER}`, 0).text()).to.equal("");
            expect(table.find(`.${Classes.TABLE_COLUMN_HEADERS} .${Classes.TABLE_HEADER}`, 1).text()).to.equal(
                "Column Header",
            );
        });

        function getMenuComponent(menuClickSpy: sinon.SinonSpy) {
            return (
                <Menu>
                    <MenuItem icon="export" onClick={menuClickSpy} text="Teleport" />
                    <MenuItem icon="sort-alphabetical-desc" onClick={menuClickSpy} text="Down with ZA!" />
                    <MenuItem icon="curved-range-chart" onClick={menuClickSpy} text="Psi" />
                </Menu>
            );
        }

        function expectMenuToOpen(table: ElementHarness, menuClickSpy: sinon.SinonSpy) {
            table.find(`.${Classes.TABLE_COLUMN_HEADERS}`).mouse("mousemove");
            table.find(`.${Classes.TABLE_TH_MENU} .${CoreClasses.POPOVER_TARGET}`).mouse("click");
            ElementHarness.document()
                .find('[data-icon="export"]')
                .mouse("click");
            expect(menuClickSpy.called).to.be.true;
        }
    });

    // TODO: re-enable these tests when we switch to enzyme's testing harness instead of our own,
    // so that we can supply a react context with enableColumnInteractionBar: true
    // see https://github.com/palantir/blueprint/issues/2076
    describe.skip("Reorder handle", () => {
        const REORDER_HANDLE_CLASS = Classes.TABLE_REORDER_HANDLE_TARGET;

        it("shows reorder handle in interaction bar if reordering and interaction bar are enabled", () => {
            const element = mount({ enableColumnReordering: true });
            expect(element.find(`.${Classes.TABLE_INTERACTION_BAR} .${REORDER_HANDLE_CLASS}`).exists()).to.be.true;
        });

        it("shows reorder handle next to column name if reordering enabled but interaction bar disabled", () => {
            const element = mount({ enableColumnReordering: true });
            expect(element.find(`.${Classes.TABLE_COLUMN_NAME} .${REORDER_HANDLE_CLASS}`).exists()).to.be.true;
        });

        function mount(props: Partial<IColumnHeaderCellProps> & object) {
            const element = harness.mount(
                <ColumnHeaderCell
                    enableColumnReordering={props.enableColumnReordering}
                    reorderHandle={<div className={REORDER_HANDLE_CLASS} />}
                />,
            );
            return element;
        }
    });
});
