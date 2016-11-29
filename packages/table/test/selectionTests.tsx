/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { expect } from "chai";
import "es6-shim";
import { RegionCardinality, Regions, SelectionModes } from "../src/index";
import { ReactHarness } from "./harness";
import { createTableOfSize } from "./mocks/table";

describe("Selection", () => {
    let harness = new ReactHarness();
    const TH_SELECTOR = ".bp-table-column-headers .bp-table-header";
    const ROW_TH_SELECTOR = ".bp-table-row-headers .bp-table-header";
    const CELL_SELECTOR = ".bp-table-cell-row-2.bp-table-cell-col-0";

    afterEach(() => {
        harness.unmount();
    });

    after(() => {
        harness.destroy();
    });

    it("Selects a single column on click", () => {
        const onSelection = sinon.spy();
        const table = harness.mount(createTableOfSize(3, 7, {}, {onSelection}));

        table.find(TH_SELECTOR).mouse("mousedown").mouse("mouseup");

        expect(onSelection.called).to.equal(true);
        expect(onSelection.lastCall.args).to.deep.equal([[Regions.column(0)]]);
    });

    it("De-selects on table body click", () => {
        const onSelection = sinon.spy();
        const table = harness.mount(createTableOfSize(3, 7, {}, {
            onSelection, selectionModes : SelectionModes.COLUMNS_ONLY }));

        table.find(TH_SELECTOR).mouse("mousedown").mouse("mouseup");
        expect(onSelection.called).to.equal(true);
        expect(onSelection.lastCall.args).to.deep.equal([[Regions.column(0)]]);
        onSelection.reset();

        table.find(".bp-table-cell-row-1.bp-table-cell-col-1").mouse("mousedown").mouse("mouseup");
        expect(onSelection.called).to.equal(true);
        expect(onSelection.lastCall.args).to.deep.equal([[]]);
    });

    it("Row selection works when enabled", () => {
        const onSelection = sinon.spy();
        const selectionModes = [
            RegionCardinality.FULL_COLUMNS,
            RegionCardinality.FULL_ROWS,
        ];
        const table = harness.mount(createTableOfSize(3, 7, {}, {onSelection, selectionModes}));

        table.find(TH_SELECTOR).mouse("mousedown").mouse("mouseup");
        expect(onSelection.called).to.equal(true);
        expect(onSelection.lastCall.args).to.deep.equal([[Regions.column(0)]]);
        onSelection.reset();

        table.find(ROW_TH_SELECTOR).mouse("mousedown").mouse("mouseup");
        expect(onSelection.called).to.equal(true);
        expect(onSelection.lastCall.args).to.deep.equal([[Regions.row(0)]]);
    });

    it("Doesn't select twice the same column on click", () => {
        const onSelection = sinon.spy();
        const table = harness.mount(createTableOfSize(3, 7, {}, {onSelection}));

        // initial selection
        table.find(TH_SELECTOR).mouse("mousedown").mouse("mouseup");
        expect(onSelection.called).to.equal(true, "first select");
        expect(onSelection.lastCall.args.length).to.equal(1);
        expect(onSelection.lastCall.args).to.deep.equal([[Regions.column(0)]]);
        onSelection.reset();

        // clears the selection on re-click
        table.find(TH_SELECTOR).mouse("mousedown").mouse("mouseup");
        expect(onSelection.called).to.equal(true);
        expect(onSelection.lastCall.args).to.deep.equal([[]], "re-click clear");
        onSelection.reset();

        // re-select
        table.find(TH_SELECTOR).mouse("mousedown").mouse("mouseup");
        expect(onSelection.lastCall.args).to.deep.equal([[Regions.column(0)]], "second select");
        onSelection.reset();

        // clears even with meta key
        const isMetaKeyDown = true;
        table.find(TH_SELECTOR).mouse("mousedown", 0, 0, isMetaKeyDown).mouse("mouseup", 0, 0, isMetaKeyDown);
        expect(onSelection.called).to.equal(true);
        expect(onSelection.lastCall.args).to.deep.equal([[]], "meta key clear");
    });

    it("Transforms regions on selections", () => {
        const selectedRegionTransform = () => {
            return Regions.row(1);
        };
        const onSelection = sinon.spy();
        const table = harness.mount(createTableOfSize(3, 7, {}, {onSelection, selectedRegionTransform}));

        // clicking adds transformed selection
        table.find(CELL_SELECTOR).mouse("mousedown").mouse("mouseup");

        expect(onSelection.called).to.be.true;
        expect(onSelection.lastCall.args).to.deep.equal([[Regions.row(1)]]);
    });

    it("Accepts controlled selection", () => {
        const table = harness.mount(createTableOfSize(3, 7, {}, { selectedRegions: [ Regions.row(0) ]}));
        const selectionRegion = table.find(".bp-table-selection-region");
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
        const table = harness.mount(createTableOfSize(3, 7, {}, {onSelection}));

        table.find(TH_SELECTOR, 0)
            .mouse("mousedown").mouse("mouseup");

        expect(onSelection.called).to.equal(true, "first select called");
        expect(onSelection.lastCall.args.length).to.equal(1);
        expect(onSelection.lastCall.args).to.deep.equal([[Regions.column(0)]]);
        onSelection.reset();

        const isMetaKeyDown = true;
        table.find(TH_SELECTOR, 1)
            .mouse("mousedown", 0, 0, isMetaKeyDown)
            .mouse("mouseup", 0, 0, isMetaKeyDown);

        expect(onSelection.called).to.equal(true, "second select called");
        expect(onSelection.lastCall.args.length).to.equal(1);
        expect(onSelection.lastCall.args).to.deep.equal([[Regions.column(0), Regions.column(1)]]);
    });

    xit("Drag select creates multiple selections", () => {
        const onSelection = sinon.spy();
        const table = harness.mount(createTableOfSize(3, 7, {}, {onSelection}));

        table.find(TH_SELECTOR).mouse("mousedown");
        table.find(TH_SELECTOR, 1).mouse("mousemove").mouse("mouseup");

        expect(onSelection.called).to.equal(true);
        expect(onSelection.lastCall.args.length).to.equal(1);
        expect(onSelection.lastCall.args).to.deep.equal([[Regions.column(0, 1)]]);
    });

    it("Meta-click for initial selection works", () => {
        const onSelection = sinon.spy();
        const table = harness.mount(createTableOfSize(3, 7, {}, {onSelection}));

        // initial selection
        const isMetaKeyDown = true;
        table.find(TH_SELECTOR).mouse("mousedown", 0, 0, isMetaKeyDown).mouse("mouseup", 0, 0, isMetaKeyDown);
        expect(onSelection.called).to.equal(true, "first select");
        expect(onSelection.lastCall.args.length).to.equal(1);
        expect(onSelection.lastCall.args).to.deep.equal([[Regions.column(0)]]);
    });
});
