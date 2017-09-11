/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { expect } from "chai";
import { mount } from "enzyme";
import * as React from "react";

import { Cell } from "../src/cell/cell";
import { Batcher } from "../src/common/batcher";
import * as Classes from "../src/common/classes";
import { Grid } from "../src/common/grid";
import { Rect } from "../src/common/rect";
import { RenderMode } from "../src/common/renderMode";
import { ITableBodyProps, TableBody } from "../src/tableBody";

describe("TableBody", () => {
    // use enough rows that batching won't render all of them in one pass.
    // and careful: if this value is too big (~100), the batcher's reliance
    // on `requestIdleCallback` may cause the tests to run multiple times.
    const LARGE_NUM_ROWS = Batcher.DEFAULT_ADD_LIMIT * 2;
    const NUM_COLUMNS = 1;

    const COLUMN_WIDTH = 100;
    const ROW_HEIGHT = 20;

    it("cellClassNames", () => {
        expect(TableBody.cellClassNames(0, 0)).to.deep.equal([
          Classes.rowCellIndexClass(0),
          Classes.columnCellIndexClass(0),
        ]);
        expect(TableBody.cellClassNames(4096, 1024)).to.deep.equal([
          Classes.rowCellIndexClass(4096),
          Classes.columnCellIndexClass(1024),
        ]);
    });

    describe("onCompleteRender", () => {
        it("triggers onCompleteRender immediately when renderMode={RenderMode.NONE}", () => {
            const onCompleteRenderSpy = sinon.spy();

            mountTableBody({
                columnIndexEnd: 10,
                onCompleteRender: onCompleteRenderSpy,
                renderMode: RenderMode.NONE,
                rowIndexEnd: 50,
            });

            expect(onCompleteRenderSpy.calledOnce).to.be.true;
        });

        it("doesn't triggers onCompleteRender immediately when renderMode={RenderMode.BATCH}", () => {
            const onCompleteRenderSpy = sinon.spy();

            mountTableBody({
                columnIndexEnd: 10,
                onCompleteRender: onCompleteRenderSpy,
                renderMode: RenderMode.BATCH,
                rowIndexEnd: 500,
            });

            expect(onCompleteRenderSpy.called).to.be.false;
        });
    });

    describe("renderMode", () => {
        it("renders all cells immediately if renderMode === RenderMode.NONE", () => {
            const tableBody = mountTableBodyForRenderModeTest(RenderMode.NONE);

            // expect all cells to have rendered in one pass
            expect(tableBody.find(Cell).length).to.equal(LARGE_NUM_ROWS);
        });

        it("uses batch rendering if renderMode === RenderMode.BATCH", () => {
            const tableBody = mountTableBodyForRenderModeTest(RenderMode.BATCH);

            // run this assertion immediately, expecting that the batching hasn't finished yet.
            expect(tableBody.find(Cell).length).to.equal(Batcher.DEFAULT_ADD_LIMIT);
        });

        function mountTableBodyForRenderModeTest(renderMode: RenderMode) {
            const rowHeights = Array(LARGE_NUM_ROWS).fill(ROW_HEIGHT);
            const columnWidths = Array(NUM_COLUMNS).fill(COLUMN_WIDTH);

            const grid = new Grid(rowHeights, columnWidths);
            const viewportRect = new Rect(0, 0, NUM_COLUMNS * COLUMN_WIDTH, LARGE_NUM_ROWS * ROW_HEIGHT);

            return mountTableBody({
                grid,
                renderMode,
                viewportRect,
                columnIndexEnd: NUM_COLUMNS - 1,
                rowIndexEnd: LARGE_NUM_ROWS - 1,
            });
        }
    });

    function mountTableBody(props: Partial<ITableBodyProps> & object = {}) {
        const { rowIndexEnd, columnIndexEnd } = props;

        const numRows = rowIndexEnd != null ? rowIndexEnd : LARGE_NUM_ROWS;
        const numCols = columnIndexEnd != null ? columnIndexEnd : NUM_COLUMNS;

        const rowHeights = Array(numRows).fill(ROW_HEIGHT);
        const columnWidths = Array(numCols).fill(COLUMN_WIDTH);

        const grid = new Grid(rowHeights, columnWidths);
        const viewportRect = new Rect(0, 0, NUM_COLUMNS * COLUMN_WIDTH, LARGE_NUM_ROWS * ROW_HEIGHT);

        return mount(
            <TableBody
                cellRenderer={renderCell}
                grid={grid}
                loading={false}
                locator={null}
                viewportRect={viewportRect}

                // ISelectableProps
                allowMultipleSelection={true}
                onFocus={noop}
                onSelection={noop}
                selectedRegions={[]}

                // IRowIndices
                rowIndexStart={0}

                // IColumnIndices
                columnIndexStart={0}

                // missing: columnIndexEnd
                // missing: renderMode
                // missing: rowIndexEnd

                {...props}
            />,
        );
    }

    function renderCell() {
        return <Cell>gg</Cell>;
    }

    function noop() {
        return;
    }
});
