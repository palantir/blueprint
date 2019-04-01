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

import { ICellCoordinates, IFocusedCellCoordinates } from "../../../src/common/cell";
import * as FocusedCellUtils from "../../../src/common/internal/focusedCellUtils";
import { IRegion, Regions } from "../../../src/regions";

describe("FocusedCellUtils", () => {
    describe("expandFocusedRegion", () => {
        const FOCUSED_ROW = 3;
        const FOCUSED_COL = 3;

        const PREV_ROW = FOCUSED_ROW - 2;
        const NEXT_ROW = FOCUSED_ROW + 2;
        const PREV_COL = FOCUSED_COL - 2;
        const NEXT_COL = FOCUSED_COL + 2;

        const focusedCell = toCellCoords(FOCUSED_ROW, FOCUSED_COL);

        // shorthand
        const fn = FocusedCellUtils.expandFocusedRegion;

        describe("Expands to a FULL_ROWS selection", () => {
            it("upward", () => {
                const newRegion = Regions.row(PREV_ROW);
                const result = fn(focusedCell, newRegion);
                checkEqual(result, Regions.row(PREV_ROW, FOCUSED_COL));
            });

            it("downward", () => {
                const newRegion = Regions.row(NEXT_ROW);
                const result = fn(focusedCell, newRegion);
                checkEqual(result, Regions.row(FOCUSED_ROW, NEXT_ROW));
            });

            it("same row", () => {
                const newRegion = Regions.row(FOCUSED_ROW);
                const result = fn(focusedCell, newRegion);
                checkEqual(result, Regions.row(FOCUSED_ROW, FOCUSED_COL));
            });
        });

        describe("Expands to a FULL_COLUMNS selection", () => {
            it("leftward", () => {
                const newRegion = Regions.column(PREV_COL);
                const result = fn(focusedCell, newRegion);
                checkEqual(result, Regions.column(PREV_COL, FOCUSED_COL));
            });

            it("rightward", () => {
                const newRegion = Regions.column(NEXT_COL);
                const result = fn(focusedCell, newRegion);
                checkEqual(result, Regions.column(FOCUSED_COL, NEXT_COL));
            });

            it("same column", () => {
                const newRegion = Regions.column(FOCUSED_COL);
                const result = fn(focusedCell, newRegion);
                checkEqual(result, Regions.column(FOCUSED_COL, FOCUSED_COL));
            });
        });

        describe("Expands to a CELLS selection", () => {
            it("toward top-left", () => {
                const newRegion = Regions.cell(PREV_ROW, PREV_COL);
                const result = fn(focusedCell, newRegion);
                checkEqual(result, Regions.cell(PREV_ROW, PREV_COL, FOCUSED_ROW, FOCUSED_COL));
            });

            it("toward top", () => {
                const newRegion = Regions.cell(FOCUSED_ROW, PREV_COL);
                const result = fn(focusedCell, newRegion);
                checkEqual(result, Regions.cell(FOCUSED_ROW, PREV_COL, FOCUSED_ROW, FOCUSED_COL));
            });

            it("toward top-right", () => {
                const newRegion = Regions.cell(PREV_ROW, NEXT_COL);
                const result = fn(focusedCell, newRegion);
                checkEqual(result, Regions.cell(PREV_ROW, FOCUSED_COL, FOCUSED_ROW, NEXT_COL));
            });

            it("toward right", () => {
                const newRegion = Regions.cell(FOCUSED_ROW, NEXT_COL);
                const result = fn(focusedCell, newRegion);
                checkEqual(result, Regions.cell(FOCUSED_ROW, FOCUSED_COL, FOCUSED_ROW, NEXT_COL));
            });

            it("toward bottom-right", () => {
                const newRegion = Regions.cell(NEXT_ROW, NEXT_COL);
                const result = fn(focusedCell, newRegion);
                checkEqual(result, Regions.cell(FOCUSED_ROW, FOCUSED_COL, NEXT_ROW, NEXT_COL));
            });

            it("toward bottom", () => {
                const newRegion = Regions.cell(NEXT_ROW, FOCUSED_COL);
                const result = fn(focusedCell, newRegion);
                checkEqual(result, Regions.cell(FOCUSED_ROW, FOCUSED_COL, NEXT_ROW, FOCUSED_COL));
            });

            it("toward bottom-left", () => {
                const newRegion = Regions.cell(NEXT_ROW, PREV_COL);
                const result = fn(focusedCell, newRegion);
                checkEqual(result, Regions.cell(FOCUSED_ROW, PREV_COL, NEXT_ROW, FOCUSED_COL));
            });

            it("toward left", () => {
                const newRegion = Regions.cell(FOCUSED_ROW, PREV_COL);
                const result = fn(focusedCell, newRegion);
                checkEqual(result, Regions.cell(FOCUSED_ROW, PREV_COL, FOCUSED_ROW, FOCUSED_COL));
            });
        });

        it("Expands to a FULL_TABLE selection", () => {
            const newRegion = Regions.table();
            const result = fn(focusedCell, newRegion);
            checkEqual(result, Regions.table());
        });

        function checkEqual(result: IRegion, expected: IRegion) {
            expect(result).to.deep.equal(expected);
        }

        function toCellCoords(row: number, col: number): IFocusedCellCoordinates {
            return { row, col, focusSelectionIndex: 0 };
        }
    });

    describe("getFocusedOrLastSelectedIndex", () => {
        const fn = FocusedCellUtils.getFocusedOrLastSelectedIndex;

        it("always returns `undefined` if selectedRegions is empty", () => {
            const focusedCell = FocusedCellUtils.toFullCoordinates({ row: 0, col: 0 });
            expect(fn([], undefined)).to.equal(undefined);
            expect(fn([], focusedCell)).to.equal(undefined);
        });

        it("returns selectedRegions's last index if focused cell not defined", () => {
            const selectedRegions = [Regions.row(0), Regions.row(1), Regions.row(3)];
            const lastIndex = selectedRegions.length - 1;
            expect(fn(selectedRegions, undefined)).to.deep.equal(lastIndex);
        });

        it("returns focusSelectionIndex if focused cell is defined", () => {
            const INDEX = 1;
            const selectedRegions = [Regions.row(0), Regions.row(1), Regions.row(3)];
            const focusedCell = { row: 0, col: 0, focusSelectionIndex: INDEX };
            expect(fn(selectedRegions, focusedCell)).to.deep.equal(INDEX);
        });
    });

    describe("getInitialFocusedCell", () => {
        const FOCUSED_CELL_FROM_PROPS = getFocusedCell(1, 2);
        const FOCUSED_CELL_FROM_STATE = getFocusedCell(3, 4);
        const SELECTED_REGIONS = [Regions.cell(1, 1, 4, 5), Regions.cell(5, 1, 6, 2)];

        it("returns undefined if enableFocusedCell=false", () => {
            const focusedCell = FocusedCellUtils.getInitialFocusedCell(
                false,
                FOCUSED_CELL_FROM_PROPS,
                FOCUSED_CELL_FROM_STATE,
                SELECTED_REGIONS,
            );
            expect(focusedCell).to.be.undefined;
        });

        it("returns the focusedCellFromProps if defined", () => {
            const focusedCell = FocusedCellUtils.getInitialFocusedCell(
                true,
                FOCUSED_CELL_FROM_PROPS,
                FOCUSED_CELL_FROM_STATE,
                SELECTED_REGIONS,
            );
            expect(focusedCell).to.deep.equal(FOCUSED_CELL_FROM_PROPS);
        });

        it("returns the focusedCellFromState if focusedCellFromProps not defined", () => {
            const focusedCell = FocusedCellUtils.getInitialFocusedCell(
                true,
                null,
                FOCUSED_CELL_FROM_STATE,
                SELECTED_REGIONS,
            );
            expect(focusedCell).to.deep.equal(FOCUSED_CELL_FROM_STATE);
        });

        // tslint:disable-next-line:max-line-length
        it("returns the focused cell for the last selected region if focusedCell not provided", () => {
            const focusedCell = FocusedCellUtils.getInitialFocusedCell(true, null, null, SELECTED_REGIONS);
            const lastIndex = SELECTED_REGIONS.length - 1;
            const expectedFocusedCell = {
                ...Regions.getFocusCellCoordinatesFromRegion(SELECTED_REGIONS[lastIndex]),
                focusSelectionIndex: lastIndex,
            };
            expect(focusedCell).to.deep.equal(expectedFocusedCell);
        });

        it("returns cell (0, 0) if nothing else is defined", () => {
            const focusedCell = FocusedCellUtils.getInitialFocusedCell(true, null, null, []);
            const expectedFocusedCell = {
                col: 0,
                focusSelectionIndex: 0,
                row: 0,
            };
            expect(focusedCell).to.deep.equal(expectedFocusedCell);
        });

        function getFocusedCell(row: number, col: number, focusSelectionIndex: number = 0): IFocusedCellCoordinates {
            return { row, col, focusSelectionIndex };
        }
    });

    describe("itFocusedCellAtRegion___", () => {
        const ROW_START = 3;
        const ROW_END = 5;
        const COL_START = 4;
        const COL_END = 6;

        const cellRegion = Regions.cell(ROW_START, COL_START, ROW_END, COL_END);
        const columnRegion = Regions.column(COL_START, COL_END);
        const rowRegion = Regions.row(ROW_START, ROW_END);
        const tableRegion = Regions.table();

        describe("isFocusedCellAtRegionTop", () => {
            const fn = FocusedCellUtils.isFocusedCellAtRegionTop;

            describe("CELLS region", () => {
                it("returns true if focused cell at region top and inside region", () => {
                    const focusedCell = FocusedCellUtils.toFullCoordinates({ row: ROW_START, col: COL_START });
                    expect(fn(cellRegion, focusedCell)).to.be.true;
                });

                it("returns true if focused cell at region top and not inside region", () => {
                    const focusedCell = FocusedCellUtils.toFullCoordinates({ row: ROW_START, col: COL_END + 1 });
                    expect(fn(cellRegion, focusedCell)).to.be.true;
                });

                it("returns false if focused cell not at region top", () => {
                    const focusedCell = FocusedCellUtils.toFullCoordinates({ row: ROW_START + 1, col: COL_START });
                    expect(fn(cellRegion, focusedCell)).to.be.false;
                });
            });

            describe("FULL_COLUMNS region", () => {
                it("always returns false", () => {
                    const focusedCell1 = FocusedCellUtils.toFullCoordinates({ row: ROW_START, col: COL_START });
                    const focusedCell2 = FocusedCellUtils.toFullCoordinates({ row: ROW_START, col: COL_END + 1 });
                    const focusedCell3 = FocusedCellUtils.toFullCoordinates({ row: ROW_START + 1, col: COL_START });
                    expect(fn(columnRegion, focusedCell1)).to.be.false;
                    expect(fn(columnRegion, focusedCell2)).to.be.false;
                    expect(fn(columnRegion, focusedCell3)).to.be.false;
                });
            });

            describe("FULL_ROWS region", () => {
                it("returns true if focused cell at region top and inside region", () => {
                    const focusedCell = FocusedCellUtils.toFullCoordinates({ row: ROW_START, col: COL_START });
                    expect(fn(rowRegion, focusedCell)).to.be.true;
                });

                it("returns false if focused cell not at region top", () => {
                    const focusedCell = FocusedCellUtils.toFullCoordinates({ row: ROW_START + 1, col: COL_START });
                    expect(fn(rowRegion, focusedCell)).to.be.false;
                });
            });

            describe("FULL_TABLE region", () => {
                it("always returns false", () => {
                    const focusedCell1 = FocusedCellUtils.toFullCoordinates({ row: 0, col: 0 });
                    const focusedCell2 = FocusedCellUtils.toFullCoordinates({ row: ROW_START, col: COL_START });
                    expect(fn(tableRegion, focusedCell1)).to.be.false;
                    expect(fn(tableRegion, focusedCell2)).to.be.false;
                });
            });
        });

        describe("isFocusedCellAtRegionBottom", () => {
            const fn = FocusedCellUtils.isFocusedCellAtRegionBottom;

            describe("CELLS region", () => {
                it("returns true if focused cell at region bottom and inside region", () => {
                    const focusedCell = FocusedCellUtils.toFullCoordinates({ row: ROW_END, col: COL_START });
                    expect(fn(cellRegion, focusedCell)).to.be.true;
                });

                it("returns true if focused cell at region bottom and not inside region", () => {
                    const focusedCell = FocusedCellUtils.toFullCoordinates({ row: ROW_END, col: COL_END + 1 });
                    expect(fn(cellRegion, focusedCell)).to.be.true;
                });

                it("returns false if focused cell not at region bottom", () => {
                    const focusedCell = FocusedCellUtils.toFullCoordinates({ row: ROW_END - 1, col: COL_START });
                    expect(fn(cellRegion, focusedCell)).to.be.false;
                });
            });

            describe("FULL_COLUMNS region", () => {
                it("always returns false", () => {
                    const focusedCell1 = FocusedCellUtils.toFullCoordinates({ row: ROW_END, col: COL_START });
                    const focusedCell2 = FocusedCellUtils.toFullCoordinates({ row: ROW_END, col: COL_END + 1 });
                    const focusedCell3 = FocusedCellUtils.toFullCoordinates({ row: ROW_END - 1, col: COL_START });
                    expect(fn(columnRegion, focusedCell1)).to.be.false;
                    expect(fn(columnRegion, focusedCell2)).to.be.false;
                    expect(fn(columnRegion, focusedCell3)).to.be.false;
                });
            });

            describe("FULL_ROWS region", () => {
                it("returns true if focused cell at region bottom and inside region", () => {
                    const focusedCell = FocusedCellUtils.toFullCoordinates({ row: ROW_END, col: COL_START });
                    expect(fn(rowRegion, focusedCell)).to.be.true;
                });

                it("returns false if focused cell not at region bottom", () => {
                    const focusedCell = FocusedCellUtils.toFullCoordinates({ row: ROW_END + 1, col: COL_START });
                    expect(fn(rowRegion, focusedCell)).to.be.false;
                });
            });

            describe("FULL_TABLE region", () => {
                it("always returns false", () => {
                    const focusedCell1 = FocusedCellUtils.toFullCoordinates({ row: 0, col: 0 });
                    const focusedCell2 = FocusedCellUtils.toFullCoordinates({ row: ROW_END, col: COL_START });
                    expect(fn(tableRegion, focusedCell1)).to.be.false;
                    expect(fn(tableRegion, focusedCell2)).to.be.false;
                });
            });
        });

        describe("isFocusedCellAtRegionLeft", () => {
            const fn = FocusedCellUtils.isFocusedCellAtRegionLeft;

            describe("CELLS region", () => {
                it("returns true if focused cell at region left and inside region", () => {
                    const focusedCell = FocusedCellUtils.toFullCoordinates({ row: ROW_START, col: COL_START });
                    expect(fn(cellRegion, focusedCell)).to.be.true;
                });

                it("returns true if focused cell at region left and not inside region", () => {
                    const focusedCell = FocusedCellUtils.toFullCoordinates({ row: ROW_END + 1, col: COL_START });
                    expect(fn(cellRegion, focusedCell)).to.be.true;
                });

                it("returns false if focused cell not at region left", () => {
                    const focusedCell = FocusedCellUtils.toFullCoordinates({ row: ROW_START, col: COL_START + 1 });
                    expect(fn(cellRegion, focusedCell)).to.be.false;
                });
            });

            describe("FULL_COLUMNS region", () => {
                it("returns true if focused cell at region left and inside region", () => {
                    const focusedCell = FocusedCellUtils.toFullCoordinates({ row: ROW_START, col: COL_START });
                    expect(fn(columnRegion, focusedCell)).to.be.true;
                });

                it("returns false if focused cell not at region left", () => {
                    const focusedCell = FocusedCellUtils.toFullCoordinates({ row: ROW_START, col: COL_START + 1 });
                    expect(fn(columnRegion, focusedCell)).to.be.false;
                });
            });

            describe("FULL_ROWS region", () => {
                it("always returns false", () => {
                    const focusedCell1 = FocusedCellUtils.toFullCoordinates({ row: ROW_START, col: COL_START });
                    const focusedCell2 = FocusedCellUtils.toFullCoordinates({ row: ROW_END + 1, col: COL_START });
                    const focusedCell3 = FocusedCellUtils.toFullCoordinates({ row: ROW_START, col: COL_START + 1 });
                    expect(fn(rowRegion, focusedCell1)).to.be.false;
                    expect(fn(rowRegion, focusedCell2)).to.be.false;
                    expect(fn(rowRegion, focusedCell3)).to.be.false;
                });
            });

            describe("FULL_TABLE region", () => {
                it("always returns false", () => {
                    const focusedCell1 = FocusedCellUtils.toFullCoordinates({ row: 0, col: 0 });
                    const focusedCell2 = FocusedCellUtils.toFullCoordinates({ row: ROW_START, col: COL_START });
                    expect(fn(tableRegion, focusedCell1)).to.be.false;
                    expect(fn(tableRegion, focusedCell2)).to.be.false;
                });
            });
        });

        describe("isFocusedCellAtRegionRight", () => {
            const fn = FocusedCellUtils.isFocusedCellAtRegionRight;

            describe("CELLS region", () => {
                it("returns true if focused cell at region right and inside region", () => {
                    const focusedCell = FocusedCellUtils.toFullCoordinates({ row: ROW_START, col: COL_END });
                    expect(fn(cellRegion, focusedCell)).to.be.true;
                });

                it("returns true if focused cell at region right and not inside region", () => {
                    const focusedCell = FocusedCellUtils.toFullCoordinates({ row: ROW_END + 1, col: COL_END });
                    expect(fn(cellRegion, focusedCell)).to.be.true;
                });

                it("returns false if focused cell not at region right", () => {
                    const focusedCell = FocusedCellUtils.toFullCoordinates({ row: ROW_START, col: COL_END - 1 });
                    expect(fn(cellRegion, focusedCell)).to.be.false;
                });
            });

            describe("FULL_COLUMNS region", () => {
                it("returns true if focused cell at region right and inside region", () => {
                    const focusedCell = FocusedCellUtils.toFullCoordinates({ row: ROW_START, col: COL_END });
                    expect(fn(columnRegion, focusedCell)).to.be.true;
                });

                it("returns false if focused cell not at region right", () => {
                    const focusedCell = FocusedCellUtils.toFullCoordinates({ row: ROW_START, col: COL_END - 1 });
                    expect(fn(columnRegion, focusedCell)).to.be.false;
                });
            });

            describe("FULL_ROWS region", () => {
                it("always returns false", () => {
                    const focusedCell1 = FocusedCellUtils.toFullCoordinates({ row: ROW_START, col: COL_END });
                    const focusedCell2 = FocusedCellUtils.toFullCoordinates({ row: ROW_END + 1, col: COL_END });
                    const focusedCell3 = FocusedCellUtils.toFullCoordinates({ row: ROW_START, col: COL_END - 1 });
                    expect(fn(rowRegion, focusedCell1)).to.be.false;
                    expect(fn(rowRegion, focusedCell2)).to.be.false;
                    expect(fn(rowRegion, focusedCell3)).to.be.false;
                });
            });

            describe("FULL_TABLE region", () => {
                it("always returns false", () => {
                    const focusedCell1 = FocusedCellUtils.toFullCoordinates({ row: 0, col: 0 });
                    const focusedCell2 = FocusedCellUtils.toFullCoordinates({ row: ROW_START, col: COL_END });
                    expect(fn(tableRegion, focusedCell1)).to.be.false;
                    expect(fn(tableRegion, focusedCell2)).to.be.false;
                });
            });
        });
    });

    describe("toFullCoordinates", () => {
        it("applies focusSelectionIndex=0 by default", () => {
            const cellCoords: ICellCoordinates = { row: 2, col: 3 };
            const result = FocusedCellUtils.toFullCoordinates(cellCoords);
            expect(result).to.deep.equal({ ...result, focusSelectionIndex: 0 });
        });

        it("applies a custom focusSelectionIndex if provided", () => {
            const cellCoords: ICellCoordinates = { row: 2, col: 3 };
            const INDEX = 1;
            const result = FocusedCellUtils.toFullCoordinates(cellCoords, INDEX);
            expect(result).to.deep.equal({ ...result, focusSelectionIndex: INDEX });
        });
    });
});
