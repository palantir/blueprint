/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import { Grid } from "../src/common/grid";
import { Rect } from "../src/common/rect";
import { Utils } from "../src/common/utils";
import { expect } from "chai";

const test7s = Utils.times(10, () => 7);
const test13s = Utils.times(10, () => 13);

describe("Grid", () => {
    it("accumulates offsets", () => {
        const grid = new Grid(test7s, test13s);
        expect(grid.numRows).to.equal(10);
        expect(grid.numCols).to.equal(10);

        expect(grid.getHeight()).to.equal(7 * 10);
        expect(grid.getWidth()).to.equal(13 * 10);

        const rect = grid.getCellRect(2, 3);
        expect(rect.top).to.equal(2 * 7);
        expect(rect.height).to.equal(7);
        expect(rect.left).to.equal(3 * 13);
        expect(rect.width).to.equal(13);
    });

    it("locates column indices of overlapping rect", () => {
        const grid = new Grid(test7s, test13s, 0);
        const rect = new Rect(15, 0, 30, 0);
        const {columnIndexStart, columnIndexEnd} = grid.getColumnIndicesInRect(rect);
        expect(columnIndexStart).to.equal(1);
        expect(columnIndexEnd).to.equal(3);

        const mapped = grid.mapColumnsInRect(rect, () => "X");
        expect(mapped).to.have.lengthOf(3);
    });

    it("locates row indices of overlapping rect", () => {
        const grid = new Grid(test7s, test13s, 0);
        const rect = new Rect(0, 15, 0, 15);
        const {rowIndexStart, rowIndexEnd} = grid.getRowIndicesInRect(rect);
        expect(rowIndexStart).to.equal(2);
        expect(rowIndexEnd).to.equal(4);

        const mapped = grid.mapRowsInRect(rect, () => "X");
        expect(mapped).to.have.lengthOf(3);
    });

    it("locates all cell indices of overlapping rect", () => {
        const grid = new Grid(test7s, test13s, 0);
        const rect = new Rect(15, 15, 30, 15);
        const mapped = grid.mapCellsInRect(rect, () => "X");
        expect(mapped).to.have.lengthOf(3 * 3);
    });

    describe("border intersection behavior", () => {
        it("column before border", () => {
            const grid = new Grid(test7s, test13s, 0);
            const rect = new Rect(25, 0, 1, 0);
            const {columnIndexStart, columnIndexEnd} = grid.getColumnIndicesInRect(rect);
            expect(columnIndexStart).to.equal(1);
            expect(columnIndexEnd).to.equal(1);
        });

        it("column overlapping border", () => {
            const grid = new Grid(test7s, test13s, 0);
            const rect = new Rect(25, 0, 2, 0);
            const {columnIndexStart, columnIndexEnd} = grid.getColumnIndicesInRect(rect);
            expect(columnIndexStart).to.equal(1);
            expect(columnIndexEnd).to.equal(2);
        });

        it("column after border", () => {
            const grid = new Grid(test7s, test13s, 0);
            const rect = new Rect(26, 0, 13, 0);
            const {columnIndexStart, columnIndexEnd} = grid.getColumnIndicesInRect(rect);
            expect(columnIndexStart).to.equal(2);
            expect(columnIndexEnd).to.equal(2);
        });

        it("row before border", () => {
            const grid = new Grid(test7s, test13s, 0);
            const rect = new Rect(0, 13, 0, 1);
            const {rowIndexStart, rowIndexEnd} = grid.getRowIndicesInRect(rect);
            expect(rowIndexStart).to.equal(1);
            expect(rowIndexEnd).to.equal(1);
        });

        it("row overlapping border", () => {
            const grid = new Grid(test7s, test13s, 0);
            const rect = new Rect(0, 13, 0, 2);
            const {rowIndexStart, rowIndexEnd} = grid.getRowIndicesInRect(rect);
            expect(rowIndexStart).to.equal(1);
            expect(rowIndexEnd).to.equal(2);
        });

        it("row after border", () => {
            const grid = new Grid(test7s, test13s, 0);
            const rect = new Rect(0, 14, 0, 7);
            const {rowIndexStart, rowIndexEnd} = grid.getRowIndicesInRect(rect);
            expect(rowIndexStart).to.equal(2);
            expect(rowIndexEnd).to.equal(2);
        });
    });

    describe("bleed", () => {
        it("bleed === 0", () => {
            const grid = new Grid(test7s, test13s, 0);
            const rect = new Rect(40, 0, 30, 0);
            const {columnIndexStart, columnIndexEnd} = grid.getColumnIndicesInRect(rect);
            expect(columnIndexStart).to.equal(3);
            expect(columnIndexEnd).to.equal(5);
        });

        it("bleed === 2", () => {
            const grid = new Grid(test7s, test13s, 2);
            const rect = new Rect(40, 0, 30, 0);
            const {columnIndexStart, columnIndexEnd} = grid.getColumnIndicesInRect(rect);
            expect(columnIndexStart).to.equal(1);
            expect(columnIndexEnd).to.equal(7);
        });

        it("bleed === 40 is clamped", () => {
            const grid = new Grid(test7s, test13s, 40);
            const rect = new Rect(40, 0, 30, 0);
            const {columnIndexStart, columnIndexEnd} = grid.getColumnIndicesInRect(rect);
            expect(columnIndexStart).to.equal(0);
            expect(columnIndexEnd).to.equal(9);
        });
    });

    describe("limit", () => {
        const many10s = Utils.times(5000, () => 10);
        const grid = new Grid(many10s, many10s);
        const rect = new Rect(0, 0, 50000, 50000);

        it("limits rows", () => {
            const {rowIndexStart, rowIndexEnd} = grid.getRowIndicesInRect(rect);
            expect(rowIndexStart).to.equal(0);
            expect(rowIndexEnd).to.equal(Grid.DEFAULT_MAX_ROWS);
        });

        it("unlimited rows", () => {
            const {rowIndexStart, rowIndexEnd} = grid.getRowIndicesInRect(rect, false, 0);
            expect(rowIndexStart).to.equal(0);
            expect(rowIndexEnd).to.equal(5000 - 1);
        });

        it("limits columns", () => {
            const {columnIndexStart, columnIndexEnd} = grid.getColumnIndicesInRect(rect);
            expect(columnIndexStart).to.equal(0);
            expect(columnIndexEnd).to.equal(Grid.DEFAULT_MAX_COLUMNS);
        });

        it("unlimited columns", () => {
            const {columnIndexStart, columnIndexEnd} = grid.getColumnIndicesInRect(rect, false, 0);
            expect(columnIndexStart).to.equal(0);
            expect(columnIndexEnd).to.equal(5000 - 1);
        });
    });

    it("clamps to min index", () => {
        const grid = new Grid(test7s, test13s, 0);
        const rect = new Rect(-10, 0, 15, 0);
        const {columnIndexStart, columnIndexEnd} = grid.getColumnIndicesInRect(rect);
        expect(columnIndexStart).to.equal(0);
        expect(columnIndexEnd).to.equal(0);
    });

    it("clamps to max index", () => {
        const grid = new Grid(test7s, test13s, 0);
        const rect = new Rect(125, 0, 100, 0);
        const {columnIndexStart, columnIndexEnd} = grid.getColumnIndicesInRect(rect);
        expect(columnIndexStart).to.equal(9);
        expect(columnIndexEnd).to.equal(9);
    });
});
