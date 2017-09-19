/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { expect } from "chai";
import * as React from "react";
import { Regions } from "../src/";
import { DragReorderable } from "../src/interactions/reorderable";
import { ReactHarness } from "./harness";

const ELEMENT_CLASS = "element";
const ELEMENT_SELECTOR = `.${ELEMENT_CLASS}`;

const OLD_INDEX = 0;
const NEW_INDEX = 1;

const SINGLE_LENGTH = 1;
const MULTI_LENGTH = 2;

const GUIDE_INDEX_SINGLE_CASE = NEW_INDEX + SINGLE_LENGTH;
const GUIDE_INDEX_MULTI_CASE = NEW_INDEX + MULTI_LENGTH;

describe("DragReorderable", () => {
    const harness = new ReactHarness();
    const children = (
        <div className="single-child">
            <div className={ELEMENT_CLASS}>Zero</div>
            <div className={ELEMENT_CLASS}>One</div>
            <div className={ELEMENT_CLASS}>Two</div>
            <div className={ELEMENT_CLASS}>Three</div>
            <div className={ELEMENT_CLASS}>Four</div>
        </div>
    );

    afterEach(() => {
        harness.unmount();
    });

    after(() => {
        harness.destroy();
    });

    describe("has no effect if", () => {
        it("clicked region is invalid", () => {
            const callbacks = initCallbackStubs();
            callbacks.locateClick.returns(Regions.column(-1));

            const reorderable = harness.mount(
                <DragReorderable
                    {...callbacks}
                    selectedRegions={[Regions.column(OLD_INDEX)]}
                    toRegion={toFullColumnRegion}
                >
                    {children}
                </DragReorderable>,
            );
            const element = reorderable.find(ELEMENT_SELECTOR, OLD_INDEX);

            element
                .mouse("mousedown")
                .mouse("mousemove")
                .mouse("mouseup");
            expect(callbacks.onReordering.called).to.be.false;
            expect(callbacks.onReordered.called).to.be.false;
            expect(callbacks.onSelection.called).to.be.false;
        });

        // tslint:disable-next-line:max-line-length
        it("an existing selection contains the clicked region but has a different cardinality (e.g. FULL_TABLE)", () => {
            const callbacks = initCallbackStubs();
            callbacks.locateClick.returns(Regions.column(OLD_INDEX));
            callbacks.locateDrag.returns(OLD_INDEX);

            const reorderable = harness.mount(
                <DragReorderable {...callbacks} selectedRegions={[Regions.table()]} toRegion={toFullColumnRegion}>
                    {children}
                </DragReorderable>,
            );
            const element = reorderable.find(ELEMENT_SELECTOR, OLD_INDEX);

            element
                .mouse("mousedown")
                .mouse("mousemove")
                .mouse("mouseup");
            expect(callbacks.onReordering.called).to.be.false;
            expect(callbacks.onReordered.called).to.be.false;
            expect(callbacks.onSelection.called).to.be.false;
        });

        it("disabled=true", () => {
            const callbacks = initCallbackStubs();
            callbacks.locateClick.returns(Regions.column(OLD_INDEX));
            callbacks.locateDrag.returns(GUIDE_INDEX_SINGLE_CASE);

            const reorderable = harness.mount(
                <DragReorderable
                    {...callbacks}
                    disabled={true}
                    selectedRegions={[Regions.column(OLD_INDEX)]}
                    toRegion={toFullColumnRegion}
                >
                    {children}
                </DragReorderable>,
            );
            const element = reorderable.find(ELEMENT_SELECTOR, OLD_INDEX);

            element
                .mouse("mousedown")
                .mouse("mousemove")
                .mouse("mouseup");
            expect(callbacks.onReordering.called).to.be.false;
            expect(callbacks.onReordered.called).to.be.false;
            expect(callbacks.onSelection.called).to.be.false;
        });
    });

    describe("general behavior", () => {
        it("selects the clicked region if the clicked region is not currently selected", () => {
            const callbacks = initCallbackStubs();
            callbacks.locateClick.returns(Regions.column(OLD_INDEX));
            callbacks.locateDrag.returns(OLD_INDEX);

            const reorderable = harness.mount(
                <DragReorderable {...callbacks} selectedRegions={[]} toRegion={toFullColumnRegion}>
                    {children}
                </DragReorderable>,
            );
            const element = reorderable.find(ELEMENT_SELECTOR, OLD_INDEX);

            element
                .mouse("mousedown")
                .mouse("mousemove")
                .mouse("mouseup");
            expect(callbacks.onReordering.called).to.be.true;
            expect(callbacks.onReordered.called).to.be.true;
            expect(callbacks.onSelection.called).to.be.true;
        });

        it("invokes callbacks appropriately throughout the drag-reorder interaction", () => {
            const callbacks = initCallbackStubs();
            callbacks.locateClick.returns(Regions.column(OLD_INDEX));
            callbacks.locateDrag.returns(GUIDE_INDEX_SINGLE_CASE);

            const reorderable = harness.mount(
                <DragReorderable
                    {...callbacks}
                    selectedRegions={[Regions.column(OLD_INDEX)]}
                    toRegion={toFullColumnRegion}
                >
                    {children}
                </DragReorderable>,
            );
            const element = reorderable.find(ELEMENT_SELECTOR, OLD_INDEX);

            element.mouse("mousedown").mouse("mousemove");
            expect(callbacks.onReordering.calledWith(OLD_INDEX, NEW_INDEX, SINGLE_LENGTH)).to.be.true;
            expect(callbacks.onReordered.called).to.be.false;
            expect(callbacks.onSelection.called).to.be.false;

            element.mouse("mouseup");
            expect(callbacks.onReordering.callCount).to.equal(2); // called on drag end too
            expect(callbacks.onReordered.calledWith(OLD_INDEX, NEW_INDEX, SINGLE_LENGTH)).to.be.true;
            expect(callbacks.onSelection.calledWith([Regions.column(NEW_INDEX)])).to.be.true;
        });

        it("reorders a selection of one single element", () => {
            const callbacks = initCallbackStubs();
            callbacks.locateClick.returns(Regions.column(OLD_INDEX));
            callbacks.locateDrag.returns(GUIDE_INDEX_SINGLE_CASE);

            const reorderable = harness.mount(
                <DragReorderable
                    {...callbacks}
                    selectedRegions={[Regions.column(OLD_INDEX)]}
                    toRegion={toFullColumnRegion}
                >
                    {children}
                </DragReorderable>,
            );
            const element = reorderable.find(ELEMENT_SELECTOR, OLD_INDEX);

            element.mouse("mousedown").mouse("mousemove");
            expect(callbacks.onReordering.calledWith(OLD_INDEX, NEW_INDEX, SINGLE_LENGTH)).to.be.true;

            element.mouse("mouseup");
            expect(callbacks.onReordered.calledWith(OLD_INDEX, NEW_INDEX, SINGLE_LENGTH)).to.be.true;
            expect(callbacks.onSelection.calledWith([Regions.column(NEW_INDEX)])).to.be.true;
        });

        it("reorders a selection of multiple contiguous elements", () => {
            const callbacks = initCallbackStubs();
            callbacks.locateClick.returns(Regions.column(OLD_INDEX));
            callbacks.locateDrag.returns(GUIDE_INDEX_MULTI_CASE);

            const reorderable = harness.mount(
                <DragReorderable
                    {...callbacks}
                    selectedRegions={[Regions.column(OLD_INDEX, OLD_INDEX + MULTI_LENGTH - 1)]}
                    toRegion={toFullColumnRegion}
                >
                    {children}
                </DragReorderable>,
            );
            const element = reorderable.find(ELEMENT_SELECTOR, OLD_INDEX);

            element.mouse("mousedown").mouse("mousemove");
            expect(callbacks.onReordering.calledWith(OLD_INDEX, NEW_INDEX, MULTI_LENGTH)).to.be.true;

            element.mouse("mouseup");
            expect(callbacks.onReordered.calledWith(OLD_INDEX, NEW_INDEX, MULTI_LENGTH)).to.be.true;
            expect(callbacks.onSelection.calledWith([Regions.column(NEW_INDEX, NEW_INDEX + MULTI_LENGTH - 1)])).to.be
                .true;
        });

        it("for a disjoint selection, reorders just the clicked region and clears all other selections", () => {
            const callbacks = initCallbackStubs();
            callbacks.locateClick.returns(Regions.column(OLD_INDEX));
            callbacks.locateDrag.returns(GUIDE_INDEX_MULTI_CASE);

            // try moving a contiguous multi-column selection
            const selectedRegions = [
                Regions.column(OLD_INDEX, OLD_INDEX + MULTI_LENGTH - 1),
                Regions.column(NEW_INDEX),
                Regions.column(NEW_INDEX + 1),
            ];

            const reorderable = harness.mount(
                <DragReorderable {...callbacks} selectedRegions={selectedRegions} toRegion={toFullColumnRegion}>
                    {children}
                </DragReorderable>,
            );
            const element = reorderable.find(ELEMENT_SELECTOR, OLD_INDEX);

            element.mouse("mousedown").mouse("mousemove");
            expect(callbacks.onReordering.calledWith(OLD_INDEX, NEW_INDEX, MULTI_LENGTH)).to.be.true;

            element.mouse("mouseup");
            expect(callbacks.onReordered.calledWith(OLD_INDEX, NEW_INDEX, MULTI_LENGTH)).to.be.true;
            expect(callbacks.onSelection.calledWith([Regions.column(NEW_INDEX, NEW_INDEX + MULTI_LENGTH - 1)])).to.be
                .true;
        });

        it("does not invoke callbacks if nothing was reordered after drag", () => {
            const callbacks = initCallbackStubs();
            callbacks.locateClick.returns(Regions.column(OLD_INDEX));
            callbacks.locateDrag.returns(OLD_INDEX); // same index

            const reorderable = harness.mount(
                <DragReorderable
                    {...callbacks}
                    selectedRegions={[Regions.column(OLD_INDEX)]}
                    toRegion={toFullColumnRegion}
                >
                    {children}
                </DragReorderable>,
            );
            const element = reorderable.find(ELEMENT_SELECTOR, OLD_INDEX);

            element
                .mouse("mousedown")
                .mouse("mousemove")
                .mouse("mouseup");
            expect(callbacks.onSelection.called).to.be.false;
            expect(callbacks.onFocus.called).to.be.false;
        });
    });

    describe("focused cell", () => {
        it("moves the focused cell into the region on mousedown if region was not already selected", () => {
            const SELECTED_INDEX = NEW_INDEX;
            const UNSELECTED_INDEX = OLD_INDEX;

            const callbacks = initCallbackStubs();
            callbacks.locateClick.returns(Regions.column(UNSELECTED_INDEX));
            callbacks.locateDrag.returns(GUIDE_INDEX_SINGLE_CASE);

            const reorderable = harness.mount(
                <DragReorderable
                    {...callbacks}
                    selectedRegions={[Regions.column(SELECTED_INDEX)]}
                    toRegion={toFullColumnRegion}
                >
                    {children}
                </DragReorderable>,
            );
            const element = reorderable.find(ELEMENT_SELECTOR, UNSELECTED_INDEX);

            element.mouse("mousedown");
            expect(callbacks.onFocus.called).to.be.true;
            expect(callbacks.onFocus.firstCall.args[0]).to.deep.equal({
                col: UNSELECTED_INDEX,
                focusSelectionIndex: 0,
                row: 0,
            });
        });

        it("moves the focused cell into the newly selected region on drag end", () => {
            const callbacks = initCallbackStubs();
            callbacks.locateClick.returns(Regions.column(NEW_INDEX));
            callbacks.locateDrag.returns(GUIDE_INDEX_SINGLE_CASE);

            const reorderable = harness.mount(
                <DragReorderable
                    {...callbacks}
                    selectedRegions={[Regions.column(OLD_INDEX)]}
                    toRegion={toFullColumnRegion}
                >
                    {children}
                </DragReorderable>,
            );
            const element = reorderable.find(ELEMENT_SELECTOR, OLD_INDEX);

            element
                .mouse("mousedown")
                .mouse("mousemove")
                .mouse("mouseup");

            // called once on mousedown and again on mouseup
            expect(callbacks.onFocus.calledTwice).to.be.true;
            expect(callbacks.onFocus.secondCall.args[0]).to.deep.equal({
                col: NEW_INDEX,
                focusSelectionIndex: 0,
                row: 0,
            });
        });
    });

    function initCallbackStubs() {
        return {
            locateClick: sinon.stub(),
            locateDrag: sinon.stub(),
            onFocus: sinon.stub(),
            onReordered: sinon.stub(),
            onReordering: sinon.stub(),
            onSelection: sinon.stub(),
        };
    }

    // create these wrapper functions to avoid errors with `this` binding when passing
    // Regions.column / Regions.row as callbacks directly

    function toFullColumnRegion(index1: number, index2?: number) {
        return Regions.column(index1, index2);
    }
});
