/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { expect } from "chai";

import { IFocusedCellCoordinates } from "../../../src/common/cell";
import * as FocusedCellUtils from "../../../src/common/internal/focusedCellUtils";

describe.only("focusCellUtils", () => {
    describe("getInitialFocusedCell", () => {
        const FOCUSED_CELL_FROM_PROPS = getFocusedCell(1, 2);
        const FOCUSED_CELL_FROM_STATE = getFocusedCell(3, 4);

        it("returns undefined if enableFocus=false", () => {
            const focusedCell = FocusedCellUtils.getInitialFocusedCell(
                false,
                FOCUSED_CELL_FROM_PROPS,
                FOCUSED_CELL_FROM_STATE,
                [],
            );
            expect(focusedCell).to.be.undefined;
        });

        function getFocusedCell(row: number, col: number, focusSelectionIndex: number = 0): IFocusedCellCoordinates {
            return { row, col, focusSelectionIndex };
        }
    });
});
