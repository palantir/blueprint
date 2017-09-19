/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { expect } from "chai";

import * as ScrollUtils from "../../../src/common/internal/scrollUtils";
import { IRegion, Regions } from "../../../src/regions";

describe("scrollUtils", () => {
    describe("getScrollPositionForRegion", () => {
        const COLUMN_WIDTH = 150;
        const ROW_HEIGHT = 20;

        const INITIAL_SCROLL_LEFT = 17;
        const INITIAL_SCROLL_TOP = 33;

        const NUM_FROZEN_ROWS = 2;
        const NUM_FROZEN_COLUMNS = 2;

        describe("no frozen rows or columns", () => {
            const TARGET_ROW = 2;
            const TARGET_COLUMN = 3;

            function fn(region: IRegion) {
                return ScrollUtils.getScrollPositionForRegion(
                    region,
                    INITIAL_SCROLL_LEFT,
                    INITIAL_SCROLL_TOP,
                    getLeftOffset,
                    getTopOffset,
                );
            }

            it("scrolling to cell", () => {
                const region = Regions.cell(TARGET_ROW, TARGET_COLUMN);
                const { scrollLeft, scrollTop } = fn(region);
                expect(scrollLeft).to.equal(TARGET_COLUMN * COLUMN_WIDTH);
                expect(scrollTop).to.equal(TARGET_ROW * ROW_HEIGHT);
            });

            it("scrolling to row", () => {
                const region = Regions.row(TARGET_ROW);
                const { scrollLeft, scrollTop } = fn(region);
                expect(scrollLeft).to.equal(INITIAL_SCROLL_LEFT);
                expect(scrollTop).to.equal(TARGET_ROW * ROW_HEIGHT);
            });

            it("scrolling to column", () => {
                const region = Regions.column(TARGET_COLUMN);
                const { scrollLeft, scrollTop } = fn(region);
                expect(scrollLeft).to.equal(TARGET_COLUMN * COLUMN_WIDTH);
                expect(scrollTop).to.equal(INITIAL_SCROLL_TOP);
            });

            it("scrolling to full table", () => {
                const region = Regions.table();
                const { scrollLeft, scrollTop } = fn(region);
                expect(scrollLeft).to.equal(0);
                expect(scrollTop).to.equal(0);
            });
        });

        describe("with frozen rows", () => {
            function fn(region: IRegion) {
                return ScrollUtils.getScrollPositionForRegion(
                    region,
                    INITIAL_SCROLL_LEFT,
                    INITIAL_SCROLL_TOP,
                    getLeftOffset,
                    getTopOffset,
                    NUM_FROZEN_ROWS,
                );
            }

            it("scrolling to a frozen cell", () => {
                const TARGET_ROW = NUM_FROZEN_ROWS - 1;
                const TARGET_COLUMN = 3;
                const region = Regions.cell(TARGET_ROW, TARGET_COLUMN);
                const { scrollLeft, scrollTop } = fn(region);
                expect(scrollLeft).to.equal(TARGET_COLUMN * COLUMN_WIDTH);
                expect(scrollTop).to.equal(0);
            });

            it("scrolling to a non-frozen cell", () => {
                const TARGET_ROW = NUM_FROZEN_ROWS; // 1 row beyond the last frozen row, b/c num is 1-indexed
                const TARGET_COLUMN = 3;
                const region = Regions.cell(TARGET_ROW, TARGET_COLUMN);
                const { scrollLeft, scrollTop } = fn(region);
                expect(scrollLeft).to.equal(TARGET_COLUMN * COLUMN_WIDTH);
                expect(scrollTop).to.equal(TARGET_ROW * ROW_HEIGHT - NUM_FROZEN_ROWS * ROW_HEIGHT);
            });

            it("scrolling to a column", () => {
                const TARGET_COLUMN = 3;
                const region = Regions.column(TARGET_COLUMN);
                const { scrollLeft, scrollTop } = fn(region);
                expect(scrollLeft).to.equal(TARGET_COLUMN * COLUMN_WIDTH);
                expect(scrollTop).to.equal(INITIAL_SCROLL_TOP);
            });

            it("scrolling to a frozen row", () => {
                const TARGET_ROW = NUM_FROZEN_ROWS - 1;
                const region = Regions.row(TARGET_ROW);
                const { scrollLeft, scrollTop } = fn(region);
                expect(scrollLeft).to.equal(INITIAL_SCROLL_LEFT);
                expect(scrollTop).to.equal(0);
            });

            it("scrolling to a non-frozen row", () => {
                const TARGET_ROW = NUM_FROZEN_ROWS; // 1 row beyond the frozen region
                const region = Regions.row(TARGET_ROW);
                const { scrollLeft, scrollTop } = fn(region);
                expect(scrollLeft).to.equal(INITIAL_SCROLL_LEFT);
                expect(scrollTop).to.equal(TARGET_ROW * ROW_HEIGHT - NUM_FROZEN_ROWS * ROW_HEIGHT);
            });

            it("scrolling to full table", () => {
                const region = Regions.table();
                const { scrollLeft, scrollTop } = fn(region);
                expect(scrollLeft).to.equal(0);
                expect(scrollTop).to.equal(0);
            });
        });

        describe("with frozen columns", () => {
            function fn(region: IRegion) {
                return ScrollUtils.getScrollPositionForRegion(
                    region,
                    INITIAL_SCROLL_LEFT,
                    INITIAL_SCROLL_TOP,
                    getLeftOffset,
                    getTopOffset,
                    0,
                    NUM_FROZEN_COLUMNS,
                );
            }

            it("scrolling to a frozen cell", () => {
                const TARGET_ROW = 3;
                const TARGET_COLUMN = NUM_FROZEN_COLUMNS - 1;
                const region = Regions.cell(TARGET_ROW, TARGET_COLUMN);
                const { scrollLeft, scrollTop } = fn(region);
                expect(scrollLeft).to.equal(0);
                expect(scrollTop).to.equal(TARGET_ROW * ROW_HEIGHT);
            });

            it("scrolling to a non-frozen cell", () => {
                const TARGET_ROW = 3;
                const TARGET_COLUMN = NUM_FROZEN_COLUMNS;
                const region = Regions.cell(TARGET_ROW, TARGET_COLUMN);
                const { scrollLeft, scrollTop } = fn(region);
                expect(scrollTop).to.equal(TARGET_ROW * ROW_HEIGHT);
                expect(scrollLeft).to.equal(TARGET_COLUMN * COLUMN_WIDTH - NUM_FROZEN_COLUMNS * COLUMN_WIDTH);
            });

            it("scrolling to a frozen column", () => {
                const TARGET_COLUMN = NUM_FROZEN_COLUMNS - 1;
                const region = Regions.column(TARGET_COLUMN);
                const { scrollLeft, scrollTop } = fn(region);
                expect(scrollLeft).to.equal(0);
                expect(scrollTop).to.equal(INITIAL_SCROLL_TOP);
            });

            it("scrolling to a non-frozen column", () => {
                const TARGET_COLUMN = NUM_FROZEN_COLUMNS; // 1 row beyond the frozen region
                const region = Regions.column(TARGET_COLUMN);
                const { scrollLeft, scrollTop } = fn(region);
                expect(scrollLeft).to.equal(TARGET_COLUMN * COLUMN_WIDTH - NUM_FROZEN_COLUMNS * COLUMN_WIDTH);
                expect(scrollTop).to.equal(INITIAL_SCROLL_TOP);
            });

            it("scrolling to a row", () => {
                const TARGET_ROW = 3;
                const region = Regions.row(TARGET_ROW);
                const { scrollLeft, scrollTop } = fn(region);
                expect(scrollLeft).to.equal(INITIAL_SCROLL_LEFT);
                expect(scrollTop).to.equal(TARGET_ROW * ROW_HEIGHT);
            });

            it("scrolling to full table", () => {
                const region = Regions.table();
                const { scrollLeft, scrollTop } = fn(region);
                expect(scrollLeft).to.equal(0);
                expect(scrollTop).to.equal(0);
            });
        });

        describe("with frozen rows and columns", () => {
            function fn(region: IRegion) {
                return ScrollUtils.getScrollPositionForRegion(
                    region,
                    INITIAL_SCROLL_LEFT,
                    INITIAL_SCROLL_TOP,
                    getLeftOffset,
                    getTopOffset,
                    NUM_FROZEN_ROWS,
                    NUM_FROZEN_COLUMNS,
                );
            }

            it("scrolling to a frozen cell", () => {
                const TARGET_ROW = NUM_FROZEN_ROWS - 1;
                const TARGET_COLUMN = NUM_FROZEN_COLUMNS - 1;
                const region = Regions.cell(TARGET_ROW, TARGET_COLUMN);
                const { scrollLeft, scrollTop } = fn(region);
                expect(scrollLeft).to.equal(0);
                expect(scrollTop).to.equal(0);
            });

            it("scrolling to a non-frozen cell", () => {
                const TARGET_ROW = NUM_FROZEN_ROWS;
                const TARGET_COLUMN = NUM_FROZEN_COLUMNS;
                const region = Regions.cell(TARGET_ROW, TARGET_COLUMN);
                const { scrollLeft, scrollTop } = fn(region);
                expect(scrollTop).to.equal(TARGET_ROW * ROW_HEIGHT - NUM_FROZEN_ROWS * ROW_HEIGHT);
                expect(scrollLeft).to.equal(TARGET_COLUMN * COLUMN_WIDTH - NUM_FROZEN_COLUMNS * COLUMN_WIDTH);
            });

            it("scrolling to a frozen column", () => {
                const TARGET_COLUMN = NUM_FROZEN_COLUMNS - 1;
                const region = Regions.column(TARGET_COLUMN);
                const { scrollLeft, scrollTop } = fn(region);
                expect(scrollLeft).to.equal(0);
                expect(scrollTop).to.equal(INITIAL_SCROLL_TOP);
            });

            it("scrolling to a non-frozen column", () => {
                const TARGET_COLUMN = NUM_FROZEN_COLUMNS; // 1 row beyond the frozen region
                const region = Regions.column(TARGET_COLUMN);
                const { scrollLeft, scrollTop } = fn(region);
                expect(scrollLeft).to.equal(TARGET_COLUMN * COLUMN_WIDTH - NUM_FROZEN_COLUMNS * COLUMN_WIDTH);
                expect(scrollTop).to.equal(INITIAL_SCROLL_TOP);
            });

            it("scrolling to a frozen row", () => {
                const TARGET_ROW = NUM_FROZEN_ROWS - 1;
                const region = Regions.row(TARGET_ROW);
                const { scrollLeft, scrollTop } = fn(region);
                expect(scrollLeft).to.equal(INITIAL_SCROLL_LEFT);
                expect(scrollTop).to.equal(0);
            });

            it("scrolling to a non-frozen row", () => {
                const TARGET_ROW = NUM_FROZEN_ROWS; // 1 row beyond the frozen region
                const region = Regions.row(TARGET_ROW);
                const { scrollLeft, scrollTop } = fn(region);
                expect(scrollLeft).to.equal(INITIAL_SCROLL_LEFT);
                expect(scrollTop).to.equal(TARGET_ROW * ROW_HEIGHT - NUM_FROZEN_ROWS * ROW_HEIGHT);
            });

            it("scrolling to full table", () => {
                const region = Regions.table();
                const { scrollLeft, scrollTop } = fn(region);
                expect(scrollLeft).to.equal(0);
                expect(scrollTop).to.equal(0);
            });
        });

        function getTopOffset(rowIndex: number) {
            return ROW_HEIGHT * rowIndex;
        }

        function getLeftOffset(columnIndex: number) {
            return COLUMN_WIDTH * columnIndex;
        }
    });
});
