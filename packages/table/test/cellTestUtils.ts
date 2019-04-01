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

import { Classes as CoreClasses } from "@blueprintjs/core";
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
        expect(cell.classList.contains(CoreClasses.LOADING)).to.be.true;
        expect(cell.querySelector(`.${CoreClasses.SKELETON}`)).to.not.be.null;
        if (cellType !== CellType.BODY_CELL) {
            const headerNameText =
                cellType === CellType.COLUMN_HEADER
                    ? cell.querySelector(`.${Classes.TABLE_COLUMN_NAME_TEXT}`)
                    : cell.querySelector(`.${Classes.TABLE_ROW_NAME}`);
            expect(headerNameText).to.not.be.null;
            expect(headerNameText.textContent).to.equal("");
        } else {
            expect(cell.textContent).to.equal("");
        }
    } else {
        expect(cell.classList.contains(CoreClasses.LOADING)).to.be.false;
        expect(cell.querySelector(`.${CoreClasses.SKELETON}`)).to.be.null;
    }
}
