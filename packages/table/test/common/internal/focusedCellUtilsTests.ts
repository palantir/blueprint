/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { expect } from "chai";

import { IFocusedCellCoordinates } from "../../../src/common/cell";
import * as FocusedCellUtils from "../../../src/common/internal/focusedCellUtils";
import { Regions } from "../../../src/regions";

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

        it("returns the focused cell for the first selected region if " +
           "focusedCellFromState and focusedCellFromProps not defined", () => {
            const focusedCell = FocusedCellUtils.getInitialFocusedCell(
                true,
                null,
                null,
                SELECTED_REGIONS,
            );
            const expectedFocusedCell = {
                ...Regions.getFocusCellCoordinatesFromRegion(SELECTED_REGIONS[0]),
                focusSelectionIndex: 0,
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

    describe.only("expandSelectedRegions", () => {
        describe("Expands a FULL_COLUMNS selection", () => {
            describe("to another FULL_COLUMNS selection", () => {
                it("leftward", fail);

                it("rightward", fail);
            });

            describe("to a FULL_ROWS selection", () => {
                it("if focused cell is in same row");

                describe("if focused cell is in different row", () => {
                    it("upward", fail);

                    it("downward", fail);
                });
            });

            it("to a CELLS selection", fail);

            it("to a FULL_TABLE selection", fail);

            it("to itself");
        });

        describe("Expands a FULL_ROWS selection", () => {
            describe("to another FULL_ROWS selection", () => {
                it("upward", fail);

                it("downward", fail);
            });

            describe("to a FULL_COLUMNS selection", () => {
                it("if focused cell is in same column");

                describe("if focused cell is in different column", () => {
                    it("leftward", fail);

                    it("rightward", fail);
                });
            });

            it("to a CELLS selection", fail);

            it("to a FULL_TABLE selection", fail);

            it("to itself");
        });

        describe("Expands a CELLS selection", () => {
            describe("to another CELLS selection", () => {
                it("toward top-left", fail);

                it("toward top", fail);

                it("toward top-right", fail);

                it("toward right", fail);

                it("toward bottom-right", fail);

                it("toward bottom", fail);

                it("toward bottom-left", fail);

                it("toward left", fail);
            });

            describe("to a FULL_COLUMNS selection", () => {
                it("upward", fail);

                it("leftward", fail);

                it("rightward", fail);
            });

            describe("to a FULL_ROWS selection", () => {
                it("leftward", fail);

                it("upward", fail);

                it("downward", fail);
            });

            it("to a FULL_TABLE selection", fail);

            it("to itself");
        });

        describe("Expands a FULL_TABLE selection", () => {
            it("to a FULL_COLUMNS selection", fail);

            it("to a FULL_ROWS selection", fail);

            it("to a CELLS selection", fail);

            it("to a FULL_TABLE selection", fail);
        });
    });

    function fail() {
        expect(true, "unimplemented test").to.be.false;
    }
});
