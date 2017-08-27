/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { expect } from "chai";
import { Grid } from "../../../src/common/grid";
import * as OverlayStyleUtils from "../../../src/common/internal/overlayStyleUtils";
import { QuadrantType } from "../../../src/quadrants/tableQuadrant";
import { IRegion, Regions } from "../../../src/regions";

describe.only("OverlayStyleUtils", () => {

    describe("getBodyOverlayStyle", () => {

        const NUM_ROWS = 10;
        const NUM_COLUMNS = 10;

        const ROW_HEIGHT = 10;
        const COLUMN_WIDTH = 100;

        const ROW_HEIGHTS = Array(NUM_ROWS).fill(ROW_HEIGHT);
        const COLUMN_WIDTHS = Array(NUM_COLUMNS).fill(COLUMN_WIDTH);

        const GRID_INSTANCE = new Grid(ROW_HEIGHTS, COLUMN_WIDTHS);

        // shorthand
        function fn(region: IRegion, quadrantType: QuadrantType, numFrozenColumns?: number) {
            return OverlayStyleUtils.getBodyOverlayStyle(
                region,
                quadrantType,
                GRID_INSTANCE.getWidth(),
                GRID_INSTANCE.getHeight(),
                GRID_INSTANCE.getRegionStyle,
                numFrozenColumns,
            );
        }

        describe("MAIN quadrant", () => {

            function fn2(region: IRegion, numFrozenColumns?: number) {
                return fn(region, QuadrantType.MAIN, numFrozenColumns);
            }

            describe("CELLS region", () => {
                it("within quadrant", () => {
                    const region = Regions.cell(1, 1, NUM_ROWS - 2, NUM_COLUMNS - 2);
                    const actualStyle = fn2(region);
                    const expectedStyle = GRID_INSTANCE.getRegionStyle(region);
                    expect(actualStyle).to.deep.equal(expectedStyle);
                });
                it("at quadrant boundary", () => {
                    expect(true).to.equal(false);
                });
            });

            describe("FULL_ROWS region", () => {
                it("within quadrant", () => {
                    expect(true).to.equal(false);
                });
                it("at quadrant boundary", () => {
                    expect(true).to.equal(false);
                });
                it("beyond boundary", () => {
                    expect(true).to.equal(false);
                });
            });

            describe("FULL_COLUMNS region", () => {
                it("within quadrant", () => {
                    expect(true).to.equal(false);
                });
                it("at quadrant boundary", () => {
                    expect(true).to.equal(false);
                });
                it("beyond boundary", () => {
                    expect(true).to.equal(false);
                });
            });

            describe("FULL_TABLE region", () => {
                it("within quadrant", () => {
                    expect(true).to.equal(false);
                });
                it("at quadrant boundary", () => {
                    expect(true).to.equal(false);
                });
                it("beyond boundary", () => {
                    expect(true).to.equal(false);
                });
            });
        });

        describe("LEFT quadrant", () => {
            describe("CELLS region", () => {
                it("within quadrant", () => {
                    expect(true).to.equal(false);
                });
                it("at quadrant boundary", () => {
                    expect(true).to.equal(false);
                });
                it("beyond boundary", () => {
                    expect(true).to.equal(false);
                });
            });

            describe("FULL_ROWS region", () => {
                it("within quadrant", () => {
                    expect(true).to.equal(false);
                });
                it("at quadrant boundary", () => {
                    expect(true).to.equal(false);
                });
                it("beyond boundary", () => {
                    expect(true).to.equal(false);
                });
            });

            describe("FULL_COLUMNS region", () => {
                it("within quadrant", () => {
                    expect(true).to.equal(false);
                });
                it("at quadrant boundary", () => {
                    expect(true).to.equal(false);
                });
                it("beyond boundary", () => {
                    expect(true).to.equal(false);
                });
            });

            describe("FULL_TABLE region", () => {
                it("within quadrant", () => {
                    expect(true).to.equal(false);
                });
                it("at quadrant boundary", () => {
                    expect(true).to.equal(false);
                });
                it("beyond boundary", () => {
                    expect(true).to.equal(false);
                });
            });
        });

        describe("TOP quadrant", () => {
            describe("CELLS region", () => {
                it("within quadrant", () => {
                    expect(true).to.equal(false);
                });
                it("at quadrant boundary", () => {
                    expect(true).to.equal(false);
                });
                it("beyond boundary", () => {
                    expect(true).to.equal(false);
                });
            });

            describe("FULL_ROWS region", () => {
                it("within quadrant", () => {
                    expect(true).to.equal(false);
                });
                it("at quadrant boundary", () => {
                    expect(true).to.equal(false);
                });
                it("beyond boundary", () => {
                    expect(true).to.equal(false);
                });
            });

            describe("FULL_COLUMNS region", () => {
                it("within quadrant", () => {
                    expect(true).to.equal(false);
                });
                it("at quadrant boundary", () => {
                    expect(true).to.equal(false);
                });
                it("beyond boundary", () => {
                    expect(true).to.equal(false);
                });
            });

            describe("FULL_TABLE region", () => {
                it("within quadrant", () => {
                    expect(true).to.equal(false);
                });
                it("at quadrant boundary", () => {
                    expect(true).to.equal(false);
                });
                it("beyond boundary", () => {
                    expect(true).to.equal(false);
                });
            });
        });

        describe("TOP_LEFT quadrant", () => {
            describe("CELLS region", () => {
                it("within quadrant", () => {
                    expect(true).to.equal(false);
                });
                it("at quadrant boundary", () => {
                    expect(true).to.equal(false);
                });
                it("beyond boundary", () => {
                    expect(true).to.equal(false);
                });
            });

            describe("FULL_ROWS region", () => {
                it("within quadrant", () => {
                    expect(true).to.equal(false);
                });
                it("at quadrant boundary", () => {
                    expect(true).to.equal(false);
                });
                it("beyond boundary", () => {
                    expect(true).to.equal(false);
                });
            });

            describe("FULL_COLUMNS region", () => {
                it("within quadrant", () => {
                    expect(true).to.equal(false);
                });
                it("at quadrant boundary", () => {
                    expect(true).to.equal(false);
                });
                it("beyond boundary", () => {
                    expect(true).to.equal(false);
                });
            });

            describe("FULL_TABLE region", () => {
                it("within quadrant", () => {
                    expect(true).to.equal(false);
                });
                it("at quadrant boundary", () => {
                    expect(true).to.equal(false);
                });
                it("beyond boundary", () => {
                    expect(true).to.equal(false);
                });
            });
        });
    });
});
