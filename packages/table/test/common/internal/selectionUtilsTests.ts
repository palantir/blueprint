/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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

import { IFocusedCellCoordinates } from "../../../src/common/cell";
import { Direction } from "../../../src/common/direction";
import * as SelectionUtils from "../../../src/common/internal/selectionUtils";
import { Regions } from "../../../src/regions";

describe("SelectionUtils", () => {
    describe("resizeRegion", () => {
        const fn = SelectionUtils.resizeRegion;

        const ROW_START = 3;
        const ROW_MIDDLE = 4;
        const ROW_END = 5;

        const COL_START = 4;
        const COL_MIDDLE = 5;
        const COL_END = 6;

        describe("when focusedCell is defined", () => {
            describe("CELLS region", () => {
                const region = Regions.cell(ROW_START, COL_START, ROW_END, COL_END);

                const regionExpandedTop = Regions.cell(ROW_START - 1, COL_START, ROW_END, COL_END);
                const regionExpandedBottom = Regions.cell(ROW_START, COL_START, ROW_END + 1, COL_END);
                const regionExpandedLeft = Regions.cell(ROW_START, COL_START - 1, ROW_END, COL_END);
                const regionExpandedRight = Regions.cell(ROW_START, COL_START, ROW_END, COL_END + 1);

                const regionShrunkenTop = Regions.cell(ROW_START + 1, COL_START, ROW_END, COL_END);
                const regionShrunkenBottom = Regions.cell(ROW_START, COL_START, ROW_END - 1, COL_END);
                const regionShrunkenLeft = Regions.cell(ROW_START, COL_START + 1, ROW_END, COL_END);
                const regionShrunkenRight = Regions.cell(ROW_START, COL_START, ROW_END, COL_END - 1);

                const singleCellRegion = Regions.cell(ROW_START, COL_START);
                const singleCellRegionFocusedCell = getFocusedCell(ROW_START, COL_START);
                const singleCellRegionExpandedTop = Regions.cell(ROW_START - 1, COL_START, ROW_START, COL_START);
                const singleCellRegionExpandedBottom = Regions.cell(ROW_START, COL_START, ROW_START + 1, COL_START);
                const singleCellRegionExpandedLeft = Regions.cell(ROW_START, COL_START - 1, ROW_START, COL_START);
                const singleCellRegionExpandedRight = Regions.cell(ROW_START, COL_START, ROW_START, COL_START + 1);

                const focusedCellTop = getFocusedCell(ROW_START, COL_MIDDLE);
                const focusedCellBottom = getFocusedCell(ROW_END, COL_MIDDLE);
                const focusedCellLeft = getFocusedCell(ROW_MIDDLE, COL_START);
                const focusedCellRight = getFocusedCell(ROW_MIDDLE, COL_END);

                it("on Direction.UP", () => {
                    expect(fn(region, Direction.UP, focusedCellTop)).to.deep.equal(regionShrunkenBottom);
                    expect(fn(region, Direction.UP, focusedCellBottom)).to.deep.equal(regionExpandedTop);
                    expect(fn(region, Direction.UP, focusedCellLeft)).to.deep.equal(regionExpandedTop);
                    expect(fn(region, Direction.UP, focusedCellRight)).to.deep.equal(regionExpandedTop);

                    const result = fn(singleCellRegion, Direction.UP, singleCellRegionFocusedCell);
                    expect(result).to.deep.equal(singleCellRegionExpandedTop);
                });

                it("on Direction.DOWN", () => {
                    expect(fn(region, Direction.DOWN, focusedCellTop)).to.deep.equal(regionExpandedBottom);
                    expect(fn(region, Direction.DOWN, focusedCellBottom)).to.deep.equal(regionShrunkenTop);
                    expect(fn(region, Direction.DOWN, focusedCellLeft)).to.deep.equal(regionExpandedBottom);
                    expect(fn(region, Direction.DOWN, focusedCellRight)).to.deep.equal(regionExpandedBottom);

                    const result = fn(singleCellRegion, Direction.DOWN, singleCellRegionFocusedCell);
                    expect(result).to.deep.equal(singleCellRegionExpandedBottom);
                });

                it("on Direction.LEFT", () => {
                    expect(fn(region, Direction.LEFT, focusedCellTop)).to.deep.equal(regionExpandedLeft);
                    expect(fn(region, Direction.LEFT, focusedCellBottom)).to.deep.equal(regionExpandedLeft);
                    expect(fn(region, Direction.LEFT, focusedCellLeft)).to.deep.equal(regionShrunkenRight);
                    expect(fn(region, Direction.LEFT, focusedCellRight)).to.deep.equal(regionExpandedLeft);

                    const result = fn(singleCellRegion, Direction.LEFT, singleCellRegionFocusedCell);
                    expect(result).to.deep.equal(singleCellRegionExpandedLeft);
                });

                it("on Direction.RIGHT", () => {
                    expect(fn(region, Direction.RIGHT, focusedCellTop)).to.deep.equal(regionExpandedRight);
                    expect(fn(region, Direction.RIGHT, focusedCellBottom)).to.deep.equal(regionExpandedRight);
                    expect(fn(region, Direction.RIGHT, focusedCellLeft)).to.deep.equal(regionExpandedRight);
                    expect(fn(region, Direction.RIGHT, focusedCellRight)).to.deep.equal(regionShrunkenLeft);

                    const result = fn(singleCellRegion, Direction.RIGHT, singleCellRegionFocusedCell);
                    expect(result).to.deep.equal(singleCellRegionExpandedRight);
                });
            });

            describe("FULL_COLUMNS region", () => {
                const region = Regions.column(COL_START, COL_END);

                const regionExpandedLeft = Regions.column(COL_START - 1, COL_END);
                const regionExpandedRight = Regions.column(COL_START, COL_END + 1);

                const regionShrunkenLeft = Regions.column(COL_START + 1, COL_END);
                const regionShrunkenRight = Regions.column(COL_START, COL_END - 1);

                const singleColumnRegion = Regions.column(COL_START);
                const singleColumnRegionFocusedCell = getFocusedCell(0, COL_START);
                const singleColumnRegionExpandedLeft = Regions.column(COL_START - 1, COL_START);
                const singleColumnRegionExpandedRight = Regions.column(COL_START, COL_START + 1);

                const focusedCellLeft = getFocusedCell(1, COL_START);
                const focusedCellRight = getFocusedCell(1, COL_END);

                it("on Direction.UP", () => {
                    expect(fn(region, Direction.UP, focusedCellLeft)).to.deep.equal(region);
                    expect(fn(region, Direction.UP, focusedCellRight)).to.deep.equal(region);
                });

                it("on Direction.DOWN", () => {
                    expect(fn(region, Direction.DOWN, focusedCellLeft)).to.deep.equal(region);
                    expect(fn(region, Direction.DOWN, focusedCellRight)).to.deep.equal(region);
                });

                it("on Direction.LEFT", () => {
                    expect(fn(region, Direction.LEFT, focusedCellLeft)).to.deep.equal(regionShrunkenRight);
                    expect(fn(region, Direction.LEFT, focusedCellRight)).to.deep.equal(regionExpandedLeft);

                    const result = fn(singleColumnRegion, Direction.LEFT, singleColumnRegionFocusedCell);
                    expect(result).to.deep.equal(singleColumnRegionExpandedLeft);
                });

                it("on Direction.RIGHT", () => {
                    expect(fn(region, Direction.RIGHT, focusedCellLeft)).to.deep.equal(regionExpandedRight);
                    expect(fn(region, Direction.RIGHT, focusedCellRight)).to.deep.equal(regionShrunkenLeft);

                    const result = fn(singleColumnRegion, Direction.RIGHT, singleColumnRegionFocusedCell);
                    expect(result).to.deep.equal(singleColumnRegionExpandedRight);
                });
            });

            describe("FULL_ROWS region", () => {
                const region = Regions.row(ROW_START, ROW_END);

                const regionExpandedTop = Regions.row(ROW_START - 1, ROW_END);
                const regionExpandedBottom = Regions.row(ROW_START, ROW_END + 1);

                const regionShrunkenTop = Regions.row(ROW_START + 1, ROW_END);
                const regionShrunkenBottom = Regions.row(ROW_START, ROW_END - 1);

                const singleRowRegion = Regions.row(ROW_START);
                const singleRowRegionFocusedCell = getFocusedCell(0, ROW_START);
                const singleRowRegionExpandedTop = Regions.row(ROW_START - 1, ROW_START);
                const singleRowRegionExpandedBottom = Regions.row(ROW_START, ROW_START + 1);

                const focusedCellTop = getFocusedCell(ROW_START, 1);
                const focusedCellBottom = getFocusedCell(ROW_END, 1);

                it("on Direction.UP", () => {
                    expect(fn(region, Direction.UP, focusedCellTop)).to.deep.equal(regionShrunkenBottom);
                    expect(fn(region, Direction.UP, focusedCellBottom)).to.deep.equal(regionExpandedTop);

                    const result = fn(singleRowRegion, Direction.UP, singleRowRegionFocusedCell);
                    expect(result).to.deep.equal(singleRowRegionExpandedTop);
                });

                it("on Direction.DOWN", () => {
                    expect(fn(region, Direction.DOWN, focusedCellTop)).to.deep.equal(regionExpandedBottom);
                    expect(fn(region, Direction.DOWN, focusedCellBottom)).to.deep.equal(regionShrunkenTop);

                    const result = fn(singleRowRegion, Direction.DOWN, singleRowRegionFocusedCell);
                    expect(result).to.deep.equal(singleRowRegionExpandedBottom);
                });

                it("on Direction.LEFT", () => {
                    expect(fn(region, Direction.LEFT, focusedCellTop)).to.deep.equal(region);
                    expect(fn(region, Direction.LEFT, focusedCellBottom)).to.deep.equal(region);
                });

                it("on Direction.RIGHT", () => {
                    expect(fn(region, Direction.RIGHT, focusedCellTop)).to.deep.equal(region);
                    expect(fn(region, Direction.RIGHT, focusedCellBottom)).to.deep.equal(region);
                });
            });

            describe("FULL_TABLE region", () => {
                it("returns the same region instance unchanged", () => {
                    const region = Regions.table();
                    const focusedCell = getFocusedCell(0, 0);
                    expect(fn(region, Direction.UP, focusedCell)).to.equal(region);
                    expect(fn(region, Direction.DOWN, focusedCell)).to.equal(region);
                    expect(fn(region, Direction.LEFT, focusedCell)).to.equal(region);
                    expect(fn(region, Direction.RIGHT, focusedCell)).to.equal(region);
                });
            });
        });

        describe("when focusedCell is not defined", () => {
            it("expands CELLS regions horizontally or vertically", () => {
                const cellRegion = Regions.cell(ROW_START, COL_START, ROW_END, COL_END);
                const cellExpectedUp = Regions.cell(ROW_START - 1, COL_START, ROW_END, COL_END);
                const cellExpectedDown = Regions.cell(ROW_START, COL_START, ROW_END + 1, COL_END);
                const cellExpectedLeft = Regions.cell(ROW_START, COL_START - 1, ROW_END, COL_END);
                const cellExpectedRight = Regions.cell(ROW_START, COL_START, ROW_END, COL_END + 1);

                expect(fn(cellRegion, Direction.UP)).to.deep.equal(cellExpectedUp);
                expect(fn(cellRegion, Direction.DOWN)).to.deep.equal(cellExpectedDown);
                expect(fn(cellRegion, Direction.LEFT)).to.deep.equal(cellExpectedLeft);
                expect(fn(cellRegion, Direction.RIGHT)).to.deep.equal(cellExpectedRight);
            });

            it("expands FULL_COLUMNS regions only horizontally", () => {
                const columnRegion = Regions.column(COL_START, COL_END);
                const columnExpectedUp = Regions.column(COL_START, COL_END);
                const columnExpectedDown = Regions.column(COL_START, COL_END);
                const columnExpectedLeft = Regions.column(COL_START - 1, COL_END);
                const columnExpectedRight = Regions.column(COL_START, COL_END + 1);

                expect(fn(columnRegion, Direction.UP)).to.deep.equal(columnExpectedUp);
                expect(fn(columnRegion, Direction.DOWN)).to.deep.equal(columnExpectedDown);
                expect(fn(columnRegion, Direction.LEFT)).to.deep.equal(columnExpectedLeft);
                expect(fn(columnRegion, Direction.RIGHT)).to.deep.equal(columnExpectedRight);
            });

            it("expands FULL_ROWS regions only vertically", () => {
                const rowRegion = Regions.row(ROW_START, ROW_END);
                const rowExpectedUp = Regions.row(ROW_START - 1, ROW_END);
                const rowExpectedDown = Regions.row(ROW_START, ROW_END + 1);
                const rowExpectedLeft = Regions.row(ROW_START, ROW_END);
                const rowExpectedRight = Regions.row(ROW_START, ROW_END);

                expect(fn(rowRegion, Direction.UP)).to.deep.equal(rowExpectedUp);
                expect(fn(rowRegion, Direction.DOWN)).to.deep.equal(rowExpectedDown);
                expect(fn(rowRegion, Direction.LEFT)).to.deep.equal(rowExpectedLeft);
                expect(fn(rowRegion, Direction.RIGHT)).to.deep.equal(rowExpectedRight);
            });

            it("returns the same FULL_TABLE region instance unchanged", () => {
                const tableRegion = Regions.table();

                expect(fn(tableRegion, Direction.UP)).to.equal(tableRegion);
                expect(fn(tableRegion, Direction.DOWN)).to.equal(tableRegion);
                expect(fn(tableRegion, Direction.LEFT)).to.equal(tableRegion);
                expect(fn(tableRegion, Direction.RIGHT)).to.equal(tableRegion);
            });
        });
    });
});

function getFocusedCell(row: number, col: number): IFocusedCellCoordinates {
    return { row, col, focusSelectionIndex: 0 };
}
