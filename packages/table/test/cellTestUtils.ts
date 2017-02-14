/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { expect } from "chai";

import { Classes as BlueprintClasses } from "@blueprintjs/core";
import { TableLoadingOption } from "../src";
import * as Classes from "../src/common/classes";

// Redefining TableLoadingOption for unit test clarity
export type CellType = TableLoadingOption;
export const CellType = {
    BODY_CELL: TableLoadingOption.CELLS,
    COLUMN_HEADER: TableLoadingOption.COLUMN_HEADERS,
    ROW_HEADER: TableLoadingOption.ROW_HEADERS,
};

export function expectCellLoading(cell: Element, cellType: CellType, loading = true) {
    if (loading) {
        expect(cell.classList.contains(BlueprintClasses.LOADING)).to.be.true;
        expect(cell.querySelector(`.${BlueprintClasses.SKELETON}`)).to.not.be.null;
        if (cellType !== CellType.BODY_CELL) {
            const headerNameText = cellType === CellType.COLUMN_HEADER
                ? cell.querySelector(`.${Classes.TABLE_COLUMN_NAME_TEXT}`)
                : cell.querySelector(`.${Classes.TABLE_ROW_NAME}`);
            expect(headerNameText).to.not.be.null;
            expect(headerNameText.textContent).to.equal("");
        } else {
            expect(cell.textContent).to.equal("");
        }
    } else {
        expect(cell.classList.contains(BlueprintClasses.LOADING)).to.be.false;
        expect(cell.querySelector(`.${BlueprintClasses.SKELETON}`)).to.be.null;
    }
}
