/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { expect } from "chai";

import { resizeRowsByApproximateHeight } from "../src/resizeRows";

import { createStringOfLength } from "./mocks/table";

const numRows = 4;
const columnWidths = [150, 150];

const cellTextShort = createStringOfLength(10);
const cellTextLong = createStringOfLength(100);
const getCellText = (rowIndex: number) => {
    return rowIndex === 0 ? cellTextShort : cellTextLong;
};

describe("resizeRowsByApproximateHeight", () => {
    it("resizes each row to fit its respective tallest cell", () => {
        const result = resizeRowsByApproximateHeight(numRows, columnWidths, getCellText);
        expect(result).to.deep.equal([36, 144, 144, 144]);
    });

    it("still uses defaults if an empty `options` object is passed", () => {
        const result = resizeRowsByApproximateHeight(numRows, columnWidths, getCellText, {});
        expect(result).to.deep.equal([36, 144, 144, 144]);
    });

    it("can customize options", () => {
        const result = resizeRowsByApproximateHeight(numRows, columnWidths, getCellText, { getNumBufferLines: 2 });
        expect(result).to.deep.equal([54, 162, 162, 162]);
    });
});
