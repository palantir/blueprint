/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { expect } from "chai";
import * as OverlayStyleUtils from "../../../src/common/internal/overlayStyleUtils";
import { QuadrantType } from "../../../src/quadrants/tableQuadrant";
import { IRegion, Regions } from "../../../src/regions";

describe("OverlayStyleUtils", () => {

    describe("getBodyOverlayStyle", () => {
        const NUM_ROWS = 10;
        const NUM_COLUMNS = 10;

        const ROW_HEIGHT = 10;
        const COLUMN_WIDTH = 100;

        const LAST_ROW_INDEX = NUM_ROWS - 1;
        const LAST_COLUMN_INDEX = NUM_COLUMNS - 1;

        const GRID_HEIGHT = NUM_ROWS * ROW_HEIGHT;
        const GRID_WIDTH = NUM_COLUMNS * COLUMN_WIDTH;

        const NUM_FROZEN_COLUMNS = 3;

        function getRegionStyle() {
            // use a bunch of weird values to make them easy to detect. also,
            // careful not to return the same object instance; it's mutated in
            // getBodyOverlayStyle, which can have lingering effects across
            // tests.
            return {
                height: 2190,
                left: 299,
                top: 174,
                width: 5820,
            };
        }

        // shorthand
        function fn(region: IRegion, quadrantType: QuadrantType, numFrozenColumns?: number) {
            return OverlayStyleUtils.getBodyOverlayStyle(
                region,
                quadrantType,
                GRID_WIDTH,
                GRID_HEIGHT,
                getRegionStyle,
                numFrozenColumns,
            );
        }

        describe("MAIN quadrant", () => {
            runMainOrTopTests(QuadrantType.MAIN);
        });

        describe("TOP quadrant", () => {
            runMainOrTopTests(QuadrantType.TOP);
        });

        describe("LEFT quadrant", () => {
            runLeftOrTopLeftTests(QuadrantType.LEFT);
        });

        describe("TOP_LEFT quadrant", () => {
            runLeftOrTopLeftTests(QuadrantType.TOP_LEFT);
        });

        function runMainOrTopTests(quadrantType: QuadrantType.MAIN | QuadrantType.TOP) {
            describe("no frozen columns", () => {
                runTests(0);
            });

            describe("with frozen columns", () => {
                runTests(NUM_FROZEN_COLUMNS);
            });

            function runTests(numFrozenColumns: number) {
                it("CELLS region", () => {
                    const region = Regions.cell(0, 0, LAST_ROW_INDEX, LAST_COLUMN_INDEX);
                    const actualStyle = fn(region, quadrantType, numFrozenColumns);
                    const expectedStyle = getRegionStyle();
                    expect(actualStyle).to.deep.equal(expectedStyle);
                });

                it("FULL_ROWS region", () => {
                    const region = Regions.row(0, LAST_ROW_INDEX);
                    const actualStyle = fn(region, quadrantType, numFrozenColumns);
                    const expectedStyle = {
                        ...getRegionStyle(),
                        left: "-1px",
                        // TODO: should this be a string followed by "px"?
                        width: GRID_WIDTH + 1,
                    };
                    expect(actualStyle).to.deep.equal(expectedStyle);
                });

                it("FULL_COLUMNS region", () => {
                    const region = Regions.column(0, LAST_COLUMN_INDEX);
                    const actualStyle = fn(region, quadrantType, numFrozenColumns);
                    const expectedStyle = {
                        ...getRegionStyle(),
                        // TODO: should this be a string followed by "px"?
                        height: GRID_HEIGHT + 1,
                        top: "-1px",
                    };
                    expect(actualStyle).to.deep.equal(expectedStyle);
                });

                it("FULL_TABLE region", () => {
                    const region = Regions.table();
                    const actualStyle = fn(region, quadrantType, numFrozenColumns);
                    const expectedStyle = {
                        height: GRID_HEIGHT + 1,
                        left: "-1px",
                        top: "-1px",
                        width: GRID_WIDTH + 1,
                    };
                    expect(actualStyle).to.deep.equal(expectedStyle);
                });
            }
        }

        function runLeftOrTopLeftTests(quadrantType: QuadrantType.LEFT | QuadrantType.TOP_LEFT) {
            describe("no frozen columns", () => {
                it("FULL_ROWS region", () => {
                    const region = Regions.row(0, LAST_ROW_INDEX);
                    const actualStyle = fn(region, quadrantType, /* numFrozenColumns */ 0);
                    const expectedStyle = {
                        ...getRegionStyle(),
                        left: "-1px",
                        width: GRID_WIDTH + 1,
                    };
                    expect(actualStyle).to.deep.equal(expectedStyle);
                });

                it("FULL_TABLE region", () => {
                    const region = Regions.table();
                    const actualStyle = fn(region, quadrantType, /* numFrozenColumns */ 0);
                    const expectedStyle = {
                        height: GRID_HEIGHT + 1,
                        left: "-1px",
                        top: "-1px",
                        width: GRID_WIDTH + 1,
                    };
                    expect(actualStyle).to.deep.equal(expectedStyle);
                });
            });

            describe("with frozen columns", () => {
                it("CELLS region", () => {
                    const region = Regions.cell(0, 0, LAST_ROW_INDEX, LAST_COLUMN_INDEX);
                    const actualStyle = fn(region, quadrantType, NUM_FROZEN_COLUMNS);
                    const expectedStyle = getRegionStyle();
                    expect(actualStyle).to.deep.equal(expectedStyle);
                });

                it("FULL_ROWS region", () => {
                    const region = Regions.row(0, LAST_ROW_INDEX);
                    const actualStyle = fn(region, quadrantType, NUM_FROZEN_COLUMNS);
                    const { width, ...defaultStyle } = getRegionStyle();
                    const expectedStyle = {
                        ...defaultStyle,
                        left: "-1px",
                        right: "-1px",
                    };
                    expect(actualStyle).to.deep.equal(expectedStyle);
                });

                it("FULL_COLUMNS region", () => {
                    const region = Regions.column(0, LAST_COLUMN_INDEX);
                    const actualStyle = fn(region, quadrantType, NUM_FROZEN_COLUMNS);
                    const expectedStyle = {
                        ...getRegionStyle(),
                        height: GRID_HEIGHT + 1,
                        top: "-1px",
                    };
                    expect(actualStyle).to.deep.equal(expectedStyle);
                });

                it("FULL_TABLE region", () => {
                    const region = Regions.table();
                    const actualStyle = fn(region, quadrantType, NUM_FROZEN_COLUMNS);
                    const expectedStyle = {
                        height: GRID_HEIGHT + 1,
                        left: "-1px",
                        right: "-1px",
                        top: "-1px",
                    };
                    expect(actualStyle).to.deep.equal(expectedStyle);
                });
            });
        }
    });
});
