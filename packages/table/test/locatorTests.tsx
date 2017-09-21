/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { expect } from "chai";
import * as React from "react";
import * as ReactDOM from "react-dom";

import { Utils } from "../src";
import { Grid } from "../src/common/grid";
import { Locator } from "../src/locator";

const N_ROWS = 10;
const N_COLS = 10;

const ROW_HEIGHT = 10;
const COL_WIDTH = 20;

describe("Locator", () => {
    const test10s = Utils.times(N_ROWS, () => ROW_HEIGHT);
    const test20s = Utils.times(N_COLS, () => COL_WIDTH);

    const grid = new Grid(test10s, test20s);

    let locator: Locator;
    let containerElement: HTMLElement;

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

        // mount in the DOM to let us test scrolling behavior.
        // ".body" will be the scrollable region.
        containerElement = document.createElement("div");
        document.body.appendChild(containerElement);
        ReactDOM.render(
            <div className="table-wrapper" style={style}>
                <div className="body" style={style}>
                    <div className="body-client" style={style}>
                        B
                    </div>
                </div>
            </div>,
            containerElement,
        );

        locator = new Locator(
            containerElement.query(".table-wrapper") as HTMLElement,
            containerElement.query(".body") as HTMLElement,
            containerElement.query(".body-client") as HTMLElement,
        );
        locator.setGrid(grid);
    });

    afterEach(() => {
        ReactDOM.unmountComponentAtNode(containerElement);
    });

    it("constructs", () => {
        // noop
    });

    describe("convertPointToColumn", () => {
        describe("when useMidpoint = false", () => {
            it("locates a column", () => {
                const left = containerElement.query(".body").getBoundingClientRect().left;
                expect(locator.convertPointToColumn(left + 10)).to.equal(0);
                expect(locator.convertPointToColumn(left + 30)).to.equal(1);
                expect(locator.convertPointToColumn(-1000)).to.equal(-1);
            });
        });

        runTestSuiteForConvertPointToRowOrColumn(COL_WIDTH, N_COLS, "convertPointToColumn");
    });

    describe("convertPointToRow", () => {
        describe("when useMidpoint = false", () => {
            it("locates a row", () => {
                const top = containerElement.query(".body").getBoundingClientRect().top;
                expect(locator.convertPointToRow(top + 5)).to.equal(0);
                expect(locator.convertPointToRow(top + 15)).to.equal(1);
                expect(locator.convertPointToRow(top + N_ROWS * ROW_HEIGHT - ROW_HEIGHT / 2)).to.equal(N_ROWS - 1);
                expect(locator.convertPointToRow(-1000)).to.equal(-1);
            });
        });

        runTestSuiteForConvertPointToRowOrColumn(ROW_HEIGHT, N_ROWS, "convertPointToRow");
    });

    describe("convertPointToCell", () => {
        describe("with frozen quadrants", () => {
            let bodyElement: HTMLElement;

            let originalOverflow: string;
            let originalHeight: string;
            let originalWidth: string;
            let originalScrollLeft: number;
            let originalScrollTop: number;

            const NUM_FROZEN_COLUMNS = 1;
            const NUM_FROZEN_ROWS = 1;

            const NUM_COLUMNS_SCROLLED_OUT_OF_VIEW = 1;
            const NUM_ROWS_SCROLLED_OUT_OF_VIEW = 1;

            beforeEach(() => {
                bodyElement = containerElement.query(".body") as HTMLElement;

                originalOverflow = bodyElement.style.overflow;
                originalHeight = bodyElement.style.height;
                originalWidth = bodyElement.style.width;
                originalScrollLeft = bodyElement.scrollLeft;
                originalScrollTop = bodyElement.scrollTop;

                // make the table smaller, then scroll it one column and one row over
                bodyElement.style.height = `${N_ROWS / 2 * ROW_HEIGHT}px`;
                bodyElement.style.width = `${N_COLS / 2 * COL_WIDTH}px`;
                bodyElement.style.overflow = "auto";
                bodyElement.scrollLeft = NUM_COLUMNS_SCROLLED_OUT_OF_VIEW * COL_WIDTH;
                bodyElement.scrollTop = NUM_ROWS_SCROLLED_OUT_OF_VIEW * ROW_HEIGHT;
            });

            afterEach(() => {
                locator.setNumFrozenColumns(0);
                locator.setNumFrozenRows(0);
                bodyElement.scrollLeft = originalScrollLeft;
                bodyElement.scrollTop = originalScrollTop;
                bodyElement.style.overflow = originalOverflow;
                bodyElement.style.width = originalWidth;
                bodyElement.style.height = originalHeight;
            });

            describe("when table is scrolled downward and rightward", () => {
                describe("with frozen column(s) only", () => {
                    beforeEach(() => {
                        locator.setNumFrozenColumns(NUM_FROZEN_COLUMNS);
                    });

                    it("locates a cell in the frozen LEFT quadrant", () => {
                        const { x, y } = getUnscrolledCellCoords(0, 0);
                        // frozen column still moves vertically on scroll
                        assertCellLocatedProperly(x, y, NUM_ROWS_SCROLLED_OUT_OF_VIEW, 0);
                    });

                    it("locates a scrolled cell in the MAIN quadrant", () => {
                        const lastFrozenIndex = NUM_FROZEN_COLUMNS - 1;
                        const unfrozenIndex = lastFrozenIndex + 1;

                        const { x, y } = getUnscrolledCellCoords(0, unfrozenIndex);

                        // unfrozen column moves horizontall and vertically on scroll
                        const expectedRow = NUM_ROWS_SCROLLED_OUT_OF_VIEW;
                        const expectedCol = unfrozenIndex + NUM_ROWS_SCROLLED_OUT_OF_VIEW;
                        assertCellLocatedProperly(x, y, expectedRow, expectedCol);
                    });
                });

                describe("with frozen rows(s) only", () => {
                    beforeEach(() => {
                        locator.setNumFrozenRows(NUM_FROZEN_ROWS);
                    });

                    it("locates a cell in the frozen TOP quadrant", () => {
                        const { x, y } = getUnscrolledCellCoords(0, 0);
                        // frozen row still moves horizontally on scroll
                        assertCellLocatedProperly(x, y, 0, NUM_COLUMNS_SCROLLED_OUT_OF_VIEW);
                    });

                    it("locates a scrolled cell in the MAIN quadrant", () => {
                        const lastFrozenIndex = NUM_FROZEN_ROWS - 1;
                        const unfrozenIndex = lastFrozenIndex + 1;

                        const { x, y } = getUnscrolledCellCoords(unfrozenIndex, 0);

                        // unfrozen column moves horizontall and vertically on scroll
                        const expectedRow = unfrozenIndex + NUM_COLUMNS_SCROLLED_OUT_OF_VIEW;
                        const expectedCol = NUM_COLUMNS_SCROLLED_OUT_OF_VIEW;
                        assertCellLocatedProperly(x, y, expectedRow, expectedCol);
                    });
                });

                describe("with frozen row(s) AND column(s)", () => {
                    beforeEach(() => {
                        locator.setNumFrozenRows(NUM_FROZEN_ROWS);
                        locator.setNumFrozenColumns(NUM_FROZEN_COLUMNS);
                    });

                    it("locates a cell in a frozen row AND column (TOP_LEFT quadrant)", () => {
                        const { x, y } = getUnscrolledCellCoords(0, 0);
                        // top-left frozen area doesn't move on scroll
                        assertCellLocatedProperly(x, y, 0, 0);
                    });

                    it("locates a scrolled cell in the MAIN quadrant", () => {
                        const lastFrozenRowIndex = NUM_FROZEN_ROWS - 1;
                        const lastFrozenColumnIndex = NUM_FROZEN_COLUMNS - 1;
                        const unfrozenRowIndex = lastFrozenRowIndex + 1;
                        const unfrozenColumnIndex = lastFrozenColumnIndex + 1;

                        const { x, y } = getUnscrolledCellCoords(unfrozenRowIndex, unfrozenColumnIndex);

                        // unfrozen column moves horizontall and vertically on scroll
                        const expectedRow = unfrozenRowIndex + NUM_COLUMNS_SCROLLED_OUT_OF_VIEW;
                        const expectedCol = unfrozenColumnIndex + NUM_COLUMNS_SCROLLED_OUT_OF_VIEW;
                        assertCellLocatedProperly(x, y, expectedRow, expectedCol);
                    });
                });
            });
        });
    });

    function runTestSuiteForConvertPointToRowOrColumn(
        elementSizeInPx: number,
        nElements: number,
        testFnName: "convertPointToColumn" | "convertPointToRow",
    ) {
        const LAST_INDEX = nElements - 1;

        describe("out of bounds", () => {
            runTest(-100, -1);
            runTest(-1, -1);
            runTest((LAST_INDEX + 10) * elementSizeInPx, -1);
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
            runTest((LAST_INDEX + 1) * elementSizeInPx + 1, LAST_INDEX + 1);
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
                const { top, left } = containerElement.query(".body").getBoundingClientRect();
                const baseOffset = testFnName === "convertPointToColumn" ? left : top;
                const actualResult = locator[testFnName](baseOffset + clientCoord, true);
                expect(actualResult).to.equal(expectedResult);
            });
        }
    }

    function assertCellLocatedProperly(clientX: number, clientY: number, expectedRow: number, expectedCol: number) {
        const cell = locator.convertPointToCell(clientX, clientY);
        expect(cell).to.deep.equal({ row: expectedRow, col: expectedCol });
    }

    function getUnscrolledCellCoords(row: number, col: number) {
        const bodyRect = containerElement.query(".body").getBoundingClientRect();

        const colMidpointOffset = COL_WIDTH / 2;
        const rowMidpointOffset = ROW_HEIGHT / 2;

        // return the midpoint of the desired cell within the table container as if the table
        // weren't scrolled
        return {
            x: bodyRect.left + col * COL_WIDTH + colMidpointOffset,
            y: bodyRect.top + row * ROW_HEIGHT + rowMidpointOffset,
        };
    }
});
