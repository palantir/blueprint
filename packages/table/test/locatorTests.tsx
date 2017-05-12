/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { expect } from "chai";
import * as React from "react";
import { Utils } from "../src";
import { Grid } from "../src/common/grid";
import { Locator } from "../src/locator";
import { ElementHarness, ReactHarness } from "./harness";

const N_ROWS = 10;
const N_COLS = 10;

const ROW_HEIGHT = 10;
const COL_WIDTH = 20;

// choose intentionally weird values for these to make sure we're considering them properly
const BOUNDS_LEFT = 17;
const BOUNDS_TOP = 313;

describe("Locator", () => {
    const harness = new ReactHarness();

    const test10s = Utils.times(N_ROWS, () => ROW_HEIGHT);
    const test20s = Utils.times(N_COLS, () => COL_WIDTH);

    const grid = new Grid(test10s, test20s);

    let locator: Locator;
    let divs: ElementHarness;
    let fakeBodyElement: any; // will be missing a bunch of required props for HTMLElement

    beforeEach(() => {
        // for some reason, the height is only 18px by default. need to manually increase it to fit
        // all rows, which is necessary for certain row tests to pass.
        //
        // we also add room for one additional row to verify that certain behavior works when
        // extending beyond the final row or column while still being within the table.
        //
        // finally, might as well explicitly set the width to make sure row and column tests operate
        // with the same initial conditions.
        const style = {
            height: (N_ROWS + 1) * ROW_HEIGHT,
            width: (N_COLS + 1) * COL_WIDTH,
        };
        divs = harness.mount(
            <div className="table-wrapper" style={style}>
                <div className="body">
                    <div className="body-client">B</div>
                </div>
            </div>,
        );

        // apparently need to create a fake body element in order to have scrollTop/scrolLeft
        // modifications stick
        const bodyWidth = N_ROWS * ROW_HEIGHT;
        const bodyHeight = N_COLS * COL_WIDTH;
        fakeBodyElement = {
            bounds: sinon.stub().returns({ left: BOUNDS_LEFT, top: BOUNDS_TOP }),
            clientHeight: bodyWidth,
            clientWidth: bodyHeight,
            getBoundingClientRect: sinon.stub().returns({ left: BOUNDS_LEFT, top: BOUNDS_TOP }),
            height: bodyHeight,
            left: 0,
            scrollLeft: 0,
            scrollTop: 0,
            top: 0,
            width: bodyWidth,
        };

        locator = new Locator(
            divs.find(".table-wrapper").element as HTMLElement,
            fakeBodyElement,
            grid,
        );
    });

    afterEach(() => {
        harness.unmount();
    });

    after(() => {
        harness.destroy();
    });

    it("constructs", () => {
        // noop
    });

    describe("convertPointToColumn", () => {
        describe("when useMidpoint = false", () => {
            it("locates a column", () => {
                const left = getBodyElement().bounds().left;
                expect(locator.convertPointToColumn(left + 10)).to.equal(0);
                expect(locator.convertPointToColumn(left + 30)).to.equal(1);
                expect(locator.convertPointToColumn(-1000)).to.equal(0);
            });
        });

        runTestSuiteForConvertPointToRowOrColumn(COL_WIDTH, N_COLS, "convertPointToColumn");
    });

    describe("convertPointToRow", () => {
        describe("when useMidpoint = false", () => {
            it("locates a row", () => {
                const top = getBodyElement().bounds().top;
                expect(locator.convertPointToRow(top + 5)).to.equal(0);
                expect(locator.convertPointToRow(top + 15)).to.equal(1);
                expect(locator.convertPointToRow(top + (N_ROWS * ROW_HEIGHT) - (ROW_HEIGHT / 2))).to.equal(N_ROWS - 1);
                expect(locator.convertPointToRow(-1000)).to.equal(0);
            });
        });

        runTestSuiteForConvertPointToRowOrColumn(ROW_HEIGHT, N_ROWS, "convertPointToRow");
    });

    function runTestSuiteForConvertPointToRowOrColumn(
            elementSizeInPx: number,
            nElements: number,
            testFnName: "convertPointToColumn" | "convertPointToRow") {
        const LAST_INDEX = nElements - 1;

        describe("out of bounds", () => {
            runTest(-100, 0);
            runTest(-1, 0);
            runTest((LAST_INDEX + 10) * elementSizeInPx, LAST_INDEX + 1);
        });

        describe("snapping to index 0", () => {
            runTest(0, 0);
            runTest(getElementMidpoint(0), 0);
        });

        describe("snapping to index 1", () => {
            runTest(getElementMidpointPlusOne(0), 1);
            runTest(getElementMidpoint(1), 1);
        });

        describe("snapping to index 2", () => {
            runTest(getElementMidpointPlusOne(1), 2);
        });

        describe("snapping to the last index", () => {
            runTest(getElementMidpoint(LAST_INDEX), LAST_INDEX);
        });

        describe("snapping to the outer boundary of the last index", () => {
            runTest(getElementMidpointPlusOne(LAST_INDEX), LAST_INDEX + 1);

            // since we explicitly set the table width/height to fit one additional column/row, this
            // coordinate should fall beyond the last column but still be within the table's
            // bounding box.
            runTest(((LAST_INDEX + 1) * elementSizeInPx) + 1, LAST_INDEX + 1);
        });

        describe("correctly identifying an index while container is scrolled", () => {
            beforeEach(() => {
                // cast as any to scroll the private body element on the already-instantiated locator
                (locator as any).bodyElement.scrollLeft = COL_WIDTH;
                (locator as any).bodyElement.scrollTop = ROW_HEIGHT;
            });

            // the origin should now be over the cell B2 (second row, second column)
            runTest(0, 1);
        });

        function getElementMidpoint(elementIndex: number) {
            const prevElementPixelOffset = elementIndex * elementSizeInPx;
            const elementPixelOffset = (elementIndex + 1) * elementSizeInPx;
            return (prevElementPixelOffset + elementPixelOffset) / 2;
        }

        function getElementMidpointPlusOne(elementIndex: number) {
            return getElementMidpoint(elementIndex) + 1;
        }

        function runTest(clientCoord: number, expectedResult: number) {
            it(`${clientCoord}px => ${expectedResult}`, () => {
                const { top, left } = getBodyElement().bounds();
                const baseOffset = (testFnName === "convertPointToColumn") ? left : top;
                const actualResult = locator[testFnName](baseOffset + clientCoord, true);
                expect(actualResult).to.equal(expectedResult);
            });
        }
    }

    function getBodyElement() {
        return fakeBodyElement;
        // TODO: if we can get scrollLeft and scrollTop mutations to stick, we should just use the
        // real body HTMLElement as follows:
        // return divs.find("body");
    }
});
