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

    describe.only("expandFocusedRegion", () => {
        const focusedCell = toCellCoords(3, 3);

        // shorthand
        const fn = FocusedCellUtils.expandFocusedRegion;

        describe("Expands a FULL_COLUMNS selection", () => {
            const oldRegion = Regions.column(3);

            describe("to another FULL_COLUMNS selection", () => {
                it("leftward", () => {
                    const newRegion = Regions.column(1);
                    const result = fn(focusedCell, oldRegion, newRegion);
                    checkEqual(result, Regions.column(1, 3));
                });

                it("rightward", () => {
                    const newRegion = Regions.column(5);
                    const result = fn(focusedCell, oldRegion, newRegion);
                    checkEqual(result, Regions.column(3, 5));
                });

                it("to itself", () => {
                    const newRegion = Regions.column(3);
                    const result = fn(focusedCell, oldRegion, newRegion);
                    checkEqual(result, Regions.column(3, 3));
                });
            });

            describe("to a FULL_ROWS selection", () => {
                it("if focused cell is in same row", () => {
                    const newRegion = Regions.row(3);
                    const result = fn(focusedCell, oldRegion, newRegion);
                    checkEqual(result, Regions.row(3));
                });

                describe("if focused cell is in different row", () => {
                    it("upward", () => {
                        const newRegion = Regions.row(1);
                        const result = fn(focusedCell, oldRegion, newRegion);
                        checkEqual(result, Regions.row(1, 3));
                    });

                    it("downward", () => {
                        const newRegion = Regions.row(5);
                        const result = fn(focusedCell, oldRegion, newRegion);
                        checkEqual(result, Regions.row(3, 5));
                    });
                });
            });

            describe("to a CELLS selection", () => {
                it("toward bottom-right", () => {
                    const newRegion = Regions.cell(5, 5);
                    const result = fn(focusedCell, oldRegion, newRegion);
                    checkEqual(result, Regions.cell(3, 3, 5, 5));
                });

                it("toward top-left", () => {
                    const newRegion = Regions.cell(3, 1);
                    const result = fn(focusedCell, oldRegion, newRegion);
                    checkEqual(result, Regions.cell(3, 1, 3, 3));
                });

                // assume the other directions are fine too (there's no special
                // logic governing strictly leftward/downward selections, e.g.)
            });

            it("to a FULL_TABLE selection", () => {
                const newRegion = Regions.table();
                const result = fn(focusedCell, oldRegion, newRegion);
                checkEqual(result, Regions.table());
            });
        });

        describe("Expands a FULL_ROWS selection", () => {
            const oldRegion = Regions.row(3);

            describe("to another FULL_ROWS selection", () => {
                it("upward", () => {
                    const newRegion = Regions.row(1);
                    const result = fn(focusedCell, oldRegion, newRegion);
                    checkEqual(result, Regions.row(1, 3));
                });

                it("downward", () => {
                    const newRegion = Regions.row(5);
                    const result = fn(focusedCell, oldRegion, newRegion);
                    checkEqual(result, Regions.row(3, 5));
                });

                it("to itself", () => {
                    const newRegion = Regions.row(3);
                    const result = fn(focusedCell, oldRegion, newRegion);
                    checkEqual(result, Regions.row(3, 3));
                });
            });

            describe("to a FULL_COLUMNS selection", () => {
                it("if focused cell is in same column", fail);

                describe("if focused cell is in different column", () => {
                    it("leftward", () => {
                        const newRegion = Regions.column(1);
                        const result = fn(focusedCell, oldRegion, newRegion);
                        checkEqual(result, Regions.column(1, 3));
                    });

                    it("rightward", () => {
                        const newRegion = Regions.column(5);
                        const result = fn(focusedCell, oldRegion, newRegion);
                        checkEqual(result, Regions.column(3, 5));
                    });
                });
            });

            describe("to a CELLS selection", () => {
                it("toward bottom-right", () => {
                    const newRegion = Regions.cell(5, 5);
                    const result = fn(focusedCell, oldRegion, newRegion);
                    checkEqual(result, Regions.cell(3, 3, 5, 5));
                });

                it("toward top-left", () => {
                    const newRegion = Regions.cell(3, 1);
                    const result = fn(focusedCell, oldRegion, newRegion);
                    checkEqual(result, Regions.cell(3, 1, 3, 3));
                });

                // assume the other directions are fine too (there's no special
                // logic governing strictly leftward/downward selections, e.g.)
            });

            it("to a FULL_TABLE selection", () => {
                const newRegion = Regions.table();
                const result = fn(focusedCell, oldRegion, newRegion);
                checkEqual(result, Regions.table());
            });
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

            it("to itself", fail);
        });

        describe("Expands a FULL_TABLE selection", () => {
            it("to a FULL_COLUMNS selection", fail);

            it("to a FULL_ROWS selection", fail);

            it("to a CELLS selection", fail);

            it("to a FULL_TABLE selection", fail);
        });

        function checkEqual(result: IRegion, expected: IRegion) {
            expect(result).to.deep.equal(expected);
        }
    });

    function fail() {
        expect(true, "unimplemented test").to.be.false;
    }

    function toCellCoords(row: number, col: number): IFocusedCellCoordinates {
        return { row, col, focusSelectionIndex: 0 };
    }
});
