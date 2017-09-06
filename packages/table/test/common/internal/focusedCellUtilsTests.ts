/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { expect } from "chai";

import { ICellCoordinates, IFocusedCellCoordinates } from "../../../src/common/cell";
import * as FocusedCellUtils from "../../../src/common/internal/focusedCellUtils";
import { IRegion, Regions } from "../../../src/regions";

describe("FocusedCellUtils", () => {
    describe("getInitialFocusedCell", () => {
        const FOCUSED_CELL_FROM_PROPS = getFocusedCell(1, 2);
        const FOCUSED_CELL_FROM_STATE = getFocusedCell(3, 4);
        const SELECTED_REGIONS = [
            Regions.cell(1, 1, 4, 5),
            Regions.cell(5, 1, 6, 2),
        ];

        it("returns undefined if enableFocus=false", () => {
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
            const focusedCell = FocusedCellUtils.getInitialFocusedCell(
                true,
                null,
                null,
                SELECTED_REGIONS,
            );
            const lastIndex = SELECTED_REGIONS.length - 1;
            const expectedFocusedCell = {
                ...Regions.getFocusCellCoordinatesFromRegion(SELECTED_REGIONS[lastIndex]),
                focusSelectionIndex: lastIndex,
            };
            expect(focusedCell).to.deep.equal(expectedFocusedCell);
        });

        it("returns cell (0, 0) if nothing else is defined", () => {
            const focusedCell = FocusedCellUtils.getInitialFocusedCell(
                true,
                null,
                null,
                [],
            );
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
