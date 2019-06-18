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
 * limitations under the License.```
 */

import { H4 } from "@blueprintjs/core";
import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";

import * as Classes from "../src/common/classes";
import { IRowHeaderCellProps, RowHeaderCell } from "../src/index";
import { ReactHarness } from "./harness";
import { createTableOfSize } from "./mocks/table";

describe("<RowHeaderCell>", () => {
    const harness = new ReactHarness();

    afterEach(() => {
        harness.unmount();
    });

    after(() => {
        harness.destroy();
    });

    it("Default renderer", () => {
        const table = harness.mount(createTableOfSize(3, 2));
        const text = table.find(`.${Classes.TABLE_ROW_NAME_TEXT}`, 1).element.textContent;
        expect(text).to.equal("2");
    });

    it("renders with custom className if provided", () => {
        const CLASS_NAME = "my-custom-class-name";
        const table = harness.mount(<RowHeaderCell className={CLASS_NAME} />);
        const hasCustomClass = table.find(`.${Classes.TABLE_HEADER}`, 0).hasClass(CLASS_NAME);
        expect(hasCustomClass).to.be.true;
    });

    it("passes index prop to nameRenderer callback if index was provided", () => {
        const renderNameStub = sinon.stub();
        renderNameStub.returns("string");
        const NAME = "my-name";
        const INDEX = 17;
        shallow(<RowHeaderCell index={INDEX} name={NAME} nameRenderer={renderNameStub} />);
        expect(renderNameStub.firstCall.args).to.deep.equal([NAME, INDEX]);
    });

    describe("Custom renderer", () => {
        it("renders custom name", () => {
            const rowHeaderCellRenderer = (rowIndex: number) => {
                return <RowHeaderCell name={`ROW-${rowIndex}`} />;
            };
            const table = harness.mount(createTableOfSize(3, 2, null, { rowHeaderCellRenderer }));
            const text = table.find(`.${Classes.TABLE_ROW_NAME_TEXT}`, 1).element.textContent;
            expect(text).to.equal("ROW-1");
        });

        it("renders custom content", () => {
            const rowHeaderCellRenderer = (rowIndex: number) => {
                return (
                    <RowHeaderCell name={`ROW-${rowIndex}`}>
                        <H4>Header of {rowIndex}</H4>
                    </RowHeaderCell>
                );
            };
            const table = harness.mount(createTableOfSize(3, 2, null, { rowHeaderCellRenderer }));
            const text = table.find(`.${Classes.TABLE_ROW_HEADERS} h4`, 1).element.textContent;
            expect(text).to.equal("Header of 1");
        });

        it("renders loading state properly", () => {
            const rowHeaderCellRenderer = (rowIndex: number) => {
                return <RowHeaderCell loading={rowIndex === 0} name="Row Header" />;
            };
            const table = harness.mount(createTableOfSize(2, 2, null, { rowHeaderCellRenderer }));
            expect(table.find(`.${Classes.TABLE_ROW_HEADERS} .${Classes.TABLE_HEADER}`, 0).text()).to.equal("");
            expect(table.find(`.${Classes.TABLE_ROW_HEADERS} .${Classes.TABLE_HEADER}`, 1).text()).to.equal(
                "Row Header",
            );
        });
    });

    // TODO: re-enable these tests when we switch to enzyme's testing harness instead of our own,
    // so that we can supply a react context with enableColumnInteractionBar: true
    // see https://github.com/palantir/blueprint/issues/2076
    describe.skip("Reorder handle", () => {
        const REORDER_HANDLE_CLASS = Classes.TABLE_REORDER_HANDLE_TARGET;

        it("shows reorder handle in interaction bar if reordering and interaction bar are enabled", () => {
            const element = mount({ enableRowReordering: true });
            expect(element.find(`.${Classes.TABLE_INTERACTION_BAR} .${REORDER_HANDLE_CLASS}`).exists()).to.be.true;
        });

        it("shows reorder handle next to row name if reordering enabled but interaction bar disabled", () => {
            const element = mount({ enableRowReordering: true });
            expect(element.find(`.${Classes.TABLE_ROW_NAME} .${REORDER_HANDLE_CLASS}`).exists()).to.be.true;
        });

        function mount(props: Partial<IRowHeaderCellProps> & object) {
            const element = harness.mount(
                <RowHeaderCell
                    enableRowReordering={props.enableRowReordering}
                    reorderHandle={<div className={REORDER_HANDLE_CLASS} />}
                />,
            );
            return element;
        }
    });
});
