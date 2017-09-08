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

    it("does not work if clicked region is invalid", () => {
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

        element.mouse("mousedown").mouse("mousemove").mouse("mouseup");
        expect(callbacks.onReordering.called).to.be.false;
        expect(callbacks.onReordered.called).to.be.false;
        expect(callbacks.onSelection.called).to.be.false;
    });

    it("does not work on a selection with FULL_TABLE cardinality", () => {
        const callbacks = initCallbackStubs();
        callbacks.locateClick.returns(Regions.column(OLD_INDEX));
        callbacks.locateDrag.returns(OLD_INDEX);

        const reorderable = harness.mount(
            <DragReorderable
                {...callbacks}
                selectedRegions={[Regions.table()]}
                toRegion={toFullColumnRegion}
            >
                {children}
            </DragReorderable>,
        );
        const element = reorderable.find(ELEMENT_SELECTOR, OLD_INDEX);

        element.mouse("mousedown").mouse("mousemove").mouse("mouseup");
        expect(callbacks.onReordering.called).to.be.false;
        expect(callbacks.onReordered.called).to.be.false;
        expect(callbacks.onSelection.called).to.be.false;
    });

    it("if enabled, selects the clicked region if the clicked region is not currently selected", () => {
        const callbacks = initCallbackStubs();
        callbacks.locateClick.returns(Regions.column(OLD_INDEX));
        callbacks.locateDrag.returns(OLD_INDEX);

        const reorderable = harness.mount(
            <DragReorderable
                {...callbacks}
                selectedRegions={[]}
                toRegion={toFullColumnRegion}
            >
                {children}
            </DragReorderable>,
        );
        const element = reorderable.find(ELEMENT_SELECTOR, OLD_INDEX);

        element.mouse("mousedown").mouse("mousemove").mouse("mouseup");
        expect(callbacks.onReordering.called).to.be.true;
        expect(callbacks.onReordered.called).to.be.true;
        expect(callbacks.onSelection.called).to.be.true;
    });

    it("does nothing if disabled", () => {
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

        element.mouse("mousedown").mouse("mousemove").mouse("mouseup");
        expect(callbacks.onReordering.called).to.be.false;
        expect(callbacks.onReordered.called).to.be.false;
        expect(callbacks.onSelection.called).to.be.false;
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

    describe("columns", () => {
        it("works for one selected column", () => {
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

        it("works for a selection of multiple contiguous columns", () => {
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
            expect(callbacks.onSelection.calledWith([
                Regions.column(NEW_INDEX, NEW_INDEX + MULTI_LENGTH - 1),
            ])).to.be.true;
        });
    });

    describe("rows", () => {
        it("works for one selected row", () => {
            const callbacks = initCallbackStubs();
            callbacks.locateClick.returns(Regions.row(OLD_INDEX));
            callbacks.locateDrag.returns(GUIDE_INDEX_SINGLE_CASE);

            const reorderable = harness.mount(
                <DragReorderable
                    {...callbacks}
                    selectedRegions={[Regions.row(OLD_INDEX)]}
                    toRegion={toFullRowRegion}
                >
                    {children}
                </DragReorderable>,
            );
            const element = reorderable.find(ELEMENT_SELECTOR, OLD_INDEX);

            element.mouse("mousedown").mouse("mousemove");
            expect(callbacks.onReordering.calledWith(OLD_INDEX, NEW_INDEX, SINGLE_LENGTH)).to.be.true;

            element.mouse("mouseup");
            expect(callbacks.onReordered.calledWith(OLD_INDEX, NEW_INDEX, SINGLE_LENGTH)).to.be.true;
            expect(callbacks.onSelection.calledWith([Regions.row(NEW_INDEX)])).to.be.true;
        });

        it("works for a selection of multiple contiguous rows", () => {
            const callbacks = initCallbackStubs();
            callbacks.locateClick.returns(Regions.row(OLD_INDEX));
            callbacks.locateDrag.returns(GUIDE_INDEX_MULTI_CASE);

            const reorderable = harness.mount(
                <DragReorderable
                    {...callbacks}
                    selectedRegions={[Regions.row(OLD_INDEX, OLD_INDEX + MULTI_LENGTH - 1)]}
                    toRegion={toFullRowRegion}
                >
                    {children}
                </DragReorderable>,
            );
            const element = reorderable.find(ELEMENT_SELECTOR, OLD_INDEX);

            element.mouse("mousedown").mouse("mousemove");
            expect(callbacks.onReordering.calledWith(OLD_INDEX, NEW_INDEX, MULTI_LENGTH)).to.be.true;

            element.mouse("mouseup");
            expect(callbacks.onReordered.calledWith(OLD_INDEX, NEW_INDEX, MULTI_LENGTH)).to.be.true;
            expect(callbacks.onSelection.calledWith([Regions.row(NEW_INDEX, NEW_INDEX + MULTI_LENGTH - 1)])).to.be.true;
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

    function toFullRowRegion(index1: number, index2?: number) {
        return Regions.row(index1, index2);
    }
});
