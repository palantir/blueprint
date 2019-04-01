/**
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

import { expect } from "chai";
import * as sinon from "sinon";

import * as Classes from "../src/common/classes";
import { Clipboard } from "../src/common/clipboard";
import { Utils } from "../src/common/utils";
import { RegionCardinality, Regions, SelectionModes } from "../src/index";
import { ReactHarness } from "./harness";
import { createTableOfSize } from "./mocks/table";

describe("Selection", () => {
    const harness = new ReactHarness();
    const COLUMN_TH_SELECTOR = `.${Classes.TABLE_QUADRANT_MAIN} .${Classes.TABLE_COLUMN_HEADERS} .${
        Classes.TABLE_HEADER
    }`;
    const ROW_TH_SELECTOR = `.${Classes.TABLE_QUADRANT_MAIN} .${Classes.TABLE_ROW_HEADERS} .${Classes.TABLE_HEADER}`;
    const CELL_SELECTOR = `.${Classes.TABLE_QUADRANT_MAIN} .${Classes.rowCellIndexClass(
        2,
    )}.${Classes.columnCellIndexClass(0)}`;

    afterEach(() => {
        harness.unmount();
    });

    after(() => {
        harness.destroy();
    });

    it("Selects a single column on click", () => {
        const onSelection = sinon.spy();
        const onFocusedCell = sinon.spy();
        const table = harness.mount(
            createTableOfSize(3, 7, {}, { enableFocusedCell: true, onSelection, onFocusedCell }),
        );

        table
            .find(COLUMN_TH_SELECTOR)
            .mouse("mousedown")
            .mouse("mouseup");

        expect(onSelection.called).to.equal(true);
        expect(onSelection.lastCall.args).to.deep.equal([[Regions.column(0)]]);
        expect(onFocusedCell.called).to.equal(true);
        expect(onFocusedCell.lastCall.args).to.deep.equal([{ col: 0, row: 0, focusSelectionIndex: 0 }]);
    });

    // TODO: Fix
    it.skip("Copies selected cells when keys are pressed", () => {
        const onCopy = sinon.spy();
        const getCellClipboardData = Utils.toBase26CellName;
        const copyCellsStub = sinon.stub(Clipboard, "copyCells").returns(true);
        const table = harness.mount(createTableOfSize(3, 7, {}, { getCellClipboardData, onCopy }));

        table
            .find(COLUMN_TH_SELECTOR)
            .mouse("mousedown")
            .mouse("mouseup");
        table.find(COLUMN_TH_SELECTOR).focus();
        table.find(COLUMN_TH_SELECTOR).keyboard("keydown", "C", true);
        expect(copyCellsStub.lastCall.args).to.deep.equal([[["A1"], ["A2"], ["A3"], ["A4"], ["A5"], ["A6"], ["A7"]]]);
        expect(onCopy.lastCall.args).to.deep.equal([true]);
    });

    it("De-selects on table body click", () => {
        const onSelection = sinon.spy();
        const table = harness.mount(
            createTableOfSize(
                3,
                7,
                {},
                {
                    onSelection,
                    selectionModes: SelectionModes.COLUMNS_ONLY,
                },
            ),
        );

        table
            .find(COLUMN_TH_SELECTOR)
            .mouse("mousedown")
            .mouse("mouseup");
        expect(onSelection.called).to.equal(true);
        expect(onSelection.lastCall.args).to.deep.equal([[Regions.column(0)]]);
        onSelection.resetHistory();

        table
            .find(`.${Classes.rowCellIndexClass(1)}.${Classes.columnCellIndexClass(1)}`)
            .mouse("mousedown")
            .mouse("mouseup");
        expect(onSelection.called).to.equal(true);
        expect(onSelection.lastCall.args).to.deep.equal([[]]);
    });

    it("Row selection works when enabled", () => {
        const onSelection = sinon.spy();
        const selectionModes = [RegionCardinality.FULL_COLUMNS, RegionCardinality.FULL_ROWS];
        const table = harness.mount(createTableOfSize(3, 7, {}, { onSelection, selectionModes }));

        // select a column to ensure it deselects when we click the row
        table
            .find(COLUMN_TH_SELECTOR)
            .mouse("mousedown")
            .mouse("mouseup");
        onSelection.resetHistory();

        // select a row
        table
            .find(ROW_TH_SELECTOR)
            .mouse("mousedown")
            .mouse("mouseup");
        expect(onSelection.called).to.equal(true);
        expect(onSelection.lastCall.args).to.deep.equal([[Regions.row(0)]]);
        onSelection.resetHistory();

        // deselects on cmd+click
        table
            .find(ROW_TH_SELECTOR)
            .mouse("mousedown", { metaKey: true })
            .mouse("mouseup");
        expect(onSelection.called).to.equal(true, "cmd+click to deselect");
        expect(onSelection.lastCall.args.length).to.equal(1);
        expect(onSelection.lastCall.args).to.deep.equal([[]]);
        onSelection.resetHistory();
    });

    it("Column selection works when enabled", () => {
        const onSelection = sinon.spy();
        const table = harness.mount(createTableOfSize(3, 7, {}, { onSelection }));

        // initial selection
        table
            .find(COLUMN_TH_SELECTOR)
            .mouse("mousedown")
            .mouse("mouseup");
        expect(onSelection.called).to.equal(true, "first select");
        expect(onSelection.lastCall.args.length).to.equal(1);
        expect(onSelection.lastCall.args).to.deep.equal([[Regions.column(0)]]);
        onSelection.resetHistory();

        // deselects on cmd+click
        table
            .find(COLUMN_TH_SELECTOR)
            .mouse("mousedown", { metaKey: true })
            .mouse("mouseup");
        expect(onSelection.called).to.equal(true, "cmd+click to deselect");
        expect(onSelection.lastCall.args.length).to.equal(1);
        expect(onSelection.lastCall.args).to.deep.equal([[]]);
        onSelection.resetHistory();

        // re-select
        table
            .find(COLUMN_TH_SELECTOR)
            .mouse("mousedown")
            .mouse("mouseup");
        expect(onSelection.lastCall.args).to.deep.equal([[Regions.column(0)]], "second select");
        onSelection.resetHistory();

        // clears even with meta key
        const isMetaKeyDown = true;
        table
            .find(COLUMN_TH_SELECTOR)
            .mouse("mousedown", 0, 0, isMetaKeyDown)
            .mouse("mouseup", 0, 0, isMetaKeyDown);
        expect(onSelection.called).to.equal(true);
        expect(onSelection.lastCall.args).to.deep.equal([[]], "meta key clear");
    });

    it("Keeps same column selected and reinvokes onSelection when clicked again", () => {
        const onSelection = sinon.spy();
        const table = harness.mount(createTableOfSize(3, 7, {}, { onSelection }));

        // leaves the selection in place on re-click
        const column = table.find(COLUMN_TH_SELECTOR);
        column.mouse("mousedown").mouse("mouseup");
        column.mouse("mousedown").mouse("mouseup");
        expect(onSelection.callCount).to.equal(2);
    });

    it("Keeps same row selected and reinvokes onSelection when clicked again", () => {
        const onSelection = sinon.spy();
        const table = harness.mount(createTableOfSize(3, 7, {}, { onSelection }));

        // leaves the selection in place on re-click
        const row = table.find(ROW_TH_SELECTOR);
        row.mouse("mousedown").mouse("mouseup");
        row.mouse("mousedown").mouse("mouseup");
        expect(onSelection.callCount).to.equal(2);
    });

    it("Transforms regions on selections", () => {
        const selectedRegionTransform = () => {
            return Regions.row(1);
        };
        const onSelection = sinon.spy();
        const table = harness.mount(createTableOfSize(3, 7, {}, { onSelection, selectedRegionTransform }));

        // clicking adds transformed selection
        table
            .find(CELL_SELECTOR)
            .mouse("mousedown")
            .mouse("mouseup");

        expect(onSelection.called).to.be.true;
        expect(onSelection.lastCall.args).to.deep.equal([[Regions.row(1)]]);
    });

    it("Accepts controlled selection", () => {
        const table = harness.mount(createTableOfSize(3, 7, {}, { selectedRegions: [Regions.row(0)] }));
        const selectionRegion = table.find(`.${Classes.TABLE_SELECTION_REGION}`);
        expect(selectionRegion.element).to.exist;
    });

    // TODO fix these tests on CircleCI.
    //
    // These tests pass locally. They are disabled because in the linux
    // headless browser, the flexbox layout causes the header cells to stack
    // vertically instead of in a row. This causes the locator to fail
    // calculating the correct column index because it assumes a row layout
    // for the header cells.
    //
    // (bdwyer) I have manually tested the rendering of the table on linux on
    // the actual CircleCI node in both chrome and firefox, and everything
    // looks/works fine. So, for now, I just disable the tests and note the
    // issue in #126.
    xit("Meta key is additive selection", () => {
        const onSelection = sinon.spy();
        const table = harness.mount(createTableOfSize(3, 7, {}, { onSelection }));

        table
            .find(COLUMN_TH_SELECTOR, 0)
            .mouse("mousedown")
            .mouse("mouseup");

        expect(onSelection.called).to.equal(true, "first select called");
        expect(onSelection.lastCall.args.length).to.equal(1);
        expect(onSelection.lastCall.args).to.deep.equal([[Regions.column(0)]]);
        onSelection.resetHistory();

        const isMetaKeyDown = true;
        table
            .find(COLUMN_TH_SELECTOR, 1)
            .mouse("mousedown", 0, 0, isMetaKeyDown)
            .mouse("mouseup", 0, 0, isMetaKeyDown);

        expect(onSelection.called).to.equal(true, "second select called");
        expect(onSelection.lastCall.args.length).to.equal(1);
        expect(onSelection.lastCall.args).to.deep.equal([[Regions.column(0), Regions.column(1)]]);
    });

    xit("Drag select creates multiple selections", () => {
        const onSelection = sinon.spy();
        const table = harness.mount(createTableOfSize(3, 7, {}, { onSelection }));

        table.find(COLUMN_TH_SELECTOR).mouse("mousedown");
        table
            .find(COLUMN_TH_SELECTOR, 1)
            .mouse("mousemove")
            .mouse("mouseup");

        expect(onSelection.called).to.equal(true);
        expect(onSelection.lastCall.args.length).to.equal(1);
        expect(onSelection.lastCall.args).to.deep.equal([[Regions.column(0, 1)]]);
    });

    it("Meta-click for initial selection works", () => {
        const onSelection = sinon.spy();
        const table = harness.mount(createTableOfSize(3, 7, {}, { onSelection }));

        // initial selection
        const isMetaKeyDown = true;
        table
            .find(COLUMN_TH_SELECTOR)
            .mouse("mousedown", 0, 0, isMetaKeyDown)
            .mouse("mouseup", 0, 0, isMetaKeyDown);
        expect(onSelection.called).to.equal(true, "first select");
        expect(onSelection.lastCall.args.length).to.equal(1);
        expect(onSelection.lastCall.args).to.deep.equal([[Regions.column(0)]]);
    });
});
