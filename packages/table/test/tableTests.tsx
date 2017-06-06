/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { expect } from "chai";
import { mount, ReactWrapper } from "enzyme";
import * as React from "react";
import * as ReactDOM from "react-dom";

import { Keys } from "@blueprintjs/core";
import { dispatchMouseEvent } from "@blueprintjs/core/test/common/utils";
import { Cell, Column, Grid, ITableProps, Table, TableLoadingOption, Utils } from "../src";
import { ICellCoordinates, IFocusedCellCoordinates } from "../src/common/cell";
import * as Classes from "../src/common/classes";
import { Rect } from "../src/common/rect";
import { Regions } from "../src/regions";
import { CellType, expectCellLoading } from "./cellTestUtils";
import { ElementHarness, ReactHarness } from "./harness";

describe("<Table>", () => {
    const harness = new ReactHarness();

    afterEach(() => {
        harness.unmount();
    });

    after(() => {
        harness.destroy();
    });

    it("Defaults to Base26Alpha column names", () => {
        const table = harness.mount(
            <Table>
                <Column />
                <Column />
                <Column name="My Name" />
            </Table>,
        );

        expect(table.find(`.${Classes.TABLE_COLUMN_NAME_TEXT}`, 2).text()).to.equal("My Name");
        expect(table.find(`.${Classes.TABLE_COLUMN_NAME_TEXT}`, 1).text()).to.equal("B");
    });

    it("Adds custom className to table container", () => {
        const CLASS_NAME = "my-custom-class-name";
        const table = harness.mount(
            <Table className={CLASS_NAME}>
                <Column />
                <Column />
                <Column />
            </Table>,
        );
        const hasCustomClass = table.find(`.${Classes.TABLE_CONTAINER}`, 0).hasClass(CLASS_NAME);
        expect(hasCustomClass).to.be.true;
    });

    it("Renders without ghost cells", () => {
        const table = harness.mount(
            <Table>
                <Column />
            </Table>,
        );

        expect(table.find(`.${Classes.TABLE_COLUMN_HEADERS} .${Classes.TABLE_HEADER}`, 0).element).to.be.ok;
        expect(table.find(`.${Classes.TABLE_COLUMN_HEADERS} .${Classes.TABLE_HEADER}`, 1).element).to.not.be.ok;
    });

    it("Renders ghost cells", () => {
        const table = harness.mount(
            <Table fillBodyWithGhostCells={true}>
                <Column />
            </Table>,
        );

        expect(table.find(`.${Classes.TABLE_COLUMN_HEADERS} .${Classes.TABLE_HEADER}`, 0).element).to.be.ok;
        expect(table.find(`.${Classes.TABLE_COLUMN_HEADERS} .${Classes.TABLE_HEADER}`, 1).element).to.be.ok;
    });

    it("Renders correctly with loading options", () => {
        const loadingOptions = [
            TableLoadingOption.CELLS,
            TableLoadingOption.COLUMN_HEADERS,
            TableLoadingOption.ROW_HEADERS,
        ];
        const tableHarness = harness.mount(
            <Table loadingOptions={loadingOptions} numRows={2}>
                <Column name="Column0" renderCell={renderCell} />
                <Column name="Column1" renderCell={renderCell} />
            </Table>,
        );

        expect(tableHarness.element.textContent).to.equal("");

        const cells = tableHarness.element.queryAll(`.${Classes.TABLE_CELL}`);
        cells.forEach((cell) => expectCellLoading(cell, CellType.BODY_CELL));

        const columnHeaders = tableHarness.element
            .queryAll(`.${Classes.TABLE_COLUMN_HEADERS} .${Classes.TABLE_HEADER}`);
        columnHeaders.forEach((columnHeader) => expectCellLoading(columnHeader, CellType.COLUMN_HEADER));

        const rowHeaders = tableHarness.element.queryAll(`.${Classes.TABLE_ROW_HEADERS} .${Classes.TABLE_HEADER}`);
        rowHeaders.forEach((rowHeader) => expectCellLoading(rowHeader, CellType.ROW_HEADER));
    });

    it("Gets and sets the tallest cell by columns correctly", () => {
        const DEFAULT_RESIZE_HEIGHT = 20;
        const MAX_HEIGHT = 40;
        const renderCellLong = () => <Cell wrapText={true}>my cell value with lots and lots of words</Cell>;
        const renderCellShort = () => <Cell wrapText={false}>short value</Cell>;

        let table: Table;

        const saveTable = (t: Table) => table = t;

        harness.mount(
            <Table ref={saveTable} numRows={4}>
                <Column name="Column0" renderCell={renderCellLong} />
                <Column name="Column1" renderCell={renderCellShort} />
            </Table>,
        );

        // Resize by first column
        table.resizeRowsByTallestCell(0);
        expect(table.state.rowHeights[0]).to.equal(MAX_HEIGHT);

        // Resize by second column
        table.resizeRowsByTallestCell(1);
        expect(table.state.rowHeights[0]).to.equal(DEFAULT_RESIZE_HEIGHT);

        // Resize by both columns
        table.resizeRowsByTallestCell([0, 1]);
        expect(table.state.rowHeights[0]).to.equal(MAX_HEIGHT);

        // Resize by second column via array
        table.resizeRowsByTallestCell([1]);
        expect(table.state.rowHeights[0]).to.equal(DEFAULT_RESIZE_HEIGHT);

        // Resize by visible columns
        table.resizeRowsByTallestCell();
        expect(table.state.rowHeights[0]).to.equal(MAX_HEIGHT);
    });

    it("Selects all and moves focus cell to (0, 0) on click of upper-left corner", () => {
        const onFocus = sinon.spy();
        const onSelection = sinon.spy();

        const table = harness.mount(
            <Table
                enableFocus={true}
                onFocus={onFocus}
                onSelection={onSelection}
                numRows={10}
            >
                <Column renderCell={renderCell}/>
                <Column renderCell={renderCell}/>
                <Column renderCell={renderCell}/>
            </Table>,
        );

        const menu = table.find(`.${Classes.TABLE_MENU}`);
        menu.mouse("click");

        expect(onSelection.args[0][0]).to.deep.equal([Regions.table()]);
        expect(onFocus.args[0][0]).to.deep.equal({ col: 0, row: 0 });
    });

    describe("Resizing", () => {
        it("Resizes selected rows together", () => {
            const table = mountTable();
            const rows = getRowHeadersWrapper(table);
            const resizeHandleTarget = getRowResizeHandle(rows, 0);

            resizeHandleTarget.mouse("mousemove")
                .mouse("mousedown")
                .mouse("mousemove", 0, 2)
                .mouse("mouseup");

            expect(rows.find(`.${Classes.TABLE_HEADER}`, 0).bounds().height).to.equal(3);
            expect(rows.find(`.${Classes.TABLE_HEADER}`, 1).bounds().height).to.equal(3);
            expect(rows.find(`.${Classes.TABLE_HEADER}`, 2).bounds().height).to.equal(1);
            expect(rows.find(`.${Classes.TABLE_HEADER}`, 3).bounds().height).to.equal(1);
            expect(rows.find(`.${Classes.TABLE_HEADER}`, 4).bounds().height).to.equal(3);
            expect(rows.find(`.${Classes.TABLE_HEADER}`, 5).bounds().height).to.equal(3);
            expect(rows.find(`.${Classes.TABLE_HEADER}`, 6).bounds().height).to.equal(3);
            expect(rows.find(`.${Classes.TABLE_HEADER}`, 7).bounds().height).to.equal(1);
            expect(rows.find(`.${Classes.TABLE_HEADER}`, 8).bounds().height).to.equal(3);
        });

        it("Hides selected-region styles while resizing", () => {
            const table = mountTable();
            const resizeHandleTarget = getRowResizeHandle(getRowHeadersWrapper(table), 0);

            resizeHandleTarget.mouse("mousemove")
                .mouse("mousedown")
                .mouse("mousemove", 0, 2);
            expect(table.find(`.${Classes.TABLE_SELECTION_REGION}`).exists()).to.be.false;

            resizeHandleTarget.mouse("mouseup");
            expect(table.find(`.${Classes.TABLE_SELECTION_REGION}`).exists()).to.be.true;
        });

        function mountTable() {
            return harness.mount(
                // set the row height so small so they can all fit in the viewport and be rendered
                <Table
                    defaultRowHeight={1}
                    isRowResizable={true}
                    minRowHeight={1}
                    numRows={10}
                    selectedRegions={[Regions.row(0, 1), Regions.row(4, 6), Regions.row(8)]}
                >
                    <Column renderCell={renderCell}/>
                    <Column renderCell={renderCell}/>
                    <Column renderCell={renderCell}/>
                </Table>,
            );
        }

        function getRowHeadersWrapper(table: ElementHarness) {
            return table.find(`.${Classes.TABLE_ROW_HEADERS}`);
        }

        function getRowResizeHandle(rows: ElementHarness, rowIndex: number) {
            return rows.find(`.${Classes.TABLE_RESIZE_HANDLE_TARGET}`, rowIndex);
        }
    });

    describe("Reordering", () => {
        // Phantom renders the table at a fixed width regardless of the number of columns. if
        // NEW_INDEX is too big, we risk simulating mouse events that fall outside of the table
        // bounds, which causes tests to fail.
        const OLD_INDEX = 0;
        const NEW_INDEX = 1;
        const LENGTH = 2;
        const NUM_COLUMNS = 5;
        const NUM_ROWS = 5;

        // table hardcodes itself to 60px tall in Phantom, so use a tiny sizes to ensure
        // all rows fit.
        const HEIGHT_IN_PX = 5;
        const WIDTH_IN_PX = 5;

        const OFFSET_X = (NEW_INDEX + LENGTH) * WIDTH_IN_PX;
        const OFFSET_Y = (NEW_INDEX + LENGTH) * HEIGHT_IN_PX;

        let onColumnsReordered: Sinon.SinonSpy;
        let onRowsReordered: Sinon.SinonSpy;
        let onSelection: Sinon.SinonSpy;

        beforeEach(() => {
            onColumnsReordered = sinon.spy();
            onRowsReordered = sinon.spy();
            onSelection = sinon.spy();
        });

        it("Shows preview guide and invokes callback when columns reordered", () => {
            const table = mountTable({
                isColumnReorderable: true,
                onColumnsReordered,
                selectedRegions: [Regions.column(OLD_INDEX, LENGTH - 1)],
            });
            const header = getTableHeader(getColumnHeadersWrapper(table), 0);
            header.mouse("mousedown").mouse("mousemove", OFFSET_X);

            const guide = table.find(`.${Classes.TABLE_VERTICAL_GUIDE}`);
            expect(guide).to.exist;

            header.mouse("mouseup", OFFSET_X);
            expect(onColumnsReordered.called).to.be.true;
            expect(onColumnsReordered.calledWith(OLD_INDEX, NEW_INDEX, LENGTH)).to.be.true;
        });

        it("Shows preview guide and invokes callback when rows reordered", () => {
            const table = mountTable({
                isRowReorderable: true,
                onRowsReordered,
                selectedRegions: [Regions.row(OLD_INDEX, LENGTH - 1)],
            });
            const header = getTableHeader(getRowHeadersWrapper(table), 0);
            header.mouse("mousedown").mouse("mousemove", 0, OFFSET_Y);

            const guide = table.find(`.${Classes.TABLE_HORIZONTAL_GUIDE}`);
            expect(guide).to.exist;

            header.mouse("mouseup", 0, OFFSET_Y);
            expect(onRowsReordered.called).to.be.true;
            expect(onRowsReordered.calledWith(OLD_INDEX, NEW_INDEX, LENGTH)).to.be.true;
        });

        it("Doesn't work on columns if there is no selected region defined yet", () => {
            const table = mountTable({
                isColumnReorderable: true,
                onColumnsReordered,
            });
            getTableHeader(getColumnHeadersWrapper(table), 0)
                .mouse("mousedown")
                .mouse("mousemove", OFFSET_X)
                .mouse("mouseup", OFFSET_X);
            expect(onColumnsReordered.called).to.be.false;
        });

        it("Doesn't work on rows if there is no selected region defined yet", () => {
            const table = mountTable({
                isColumnReorderable: true,
                onColumnsReordered,
            });
            getTableHeader(getColumnHeadersWrapper(table), 0)
                .mouse("mousedown")
                .mouse("mousemove", OFFSET_X)
                .mouse("mouseup", OFFSET_X);
            expect(onColumnsReordered.called).to.be.false;
        });

        it("Selecting a column via click and then reordering it works", () => {
            const table = mountTable({
                isColumnReorderable: true,
                onColumnsReordered,
                onSelection,
            });
            const header = getTableHeader(getColumnHeadersWrapper(table), 0);

             // "click" doesn't trigger DragHandler.onActivate
            header.mouse("mousedown").mouse("mouseup");
            expect(onSelection.called).to.be.true;

            // now we can reorder the column one spot to the right
            const newIndex = 1;
            const length = 1;
            const offsetX = (newIndex + length) * WIDTH_IN_PX;
            header.mouse("mousedown")
                .mouse("mousemove", offsetX)
                .mouse("mouseup", offsetX);
            expect(onColumnsReordered.called).to.be.true;
            expect(onColumnsReordered.calledWith(OLD_INDEX, newIndex, length)).to.be.true;
        });

        it("Selecting multiple columns via click+drag and then reordering works", () => {
            const table = mountTable({
                isColumnReorderable: true,
                onColumnsReordered,
                onSelection,
            });
            const header = getTableHeader(getColumnHeadersWrapper(table), 0);
            const selectionOffsetX = (OLD_INDEX + LENGTH) * WIDTH_IN_PX;
            header
                .mouse("mousedown")
                .mouse("mousemove", selectionOffsetX)
                .mouse("mouseup", selectionOffsetX);
            expect(onSelection.called).to.be.true;

            header.mouse("mousedown")
                .mouse("mousemove", OFFSET_X)
                .mouse("mouseup", OFFSET_X);
            expect(onColumnsReordered.called).to.be.true;
            expect(onColumnsReordered.calledWith(OLD_INDEX, NEW_INDEX, LENGTH)).to.be.true;
        });

        it("Moves selection with reordered column when reordering is complete (if selection not controlled)", () => {
            const table = mountTable({
                isColumnReorderable: true,
                onColumnsReordered,
            });
            const headers = getColumnHeadersWrapper(table);
            const oldHeader = getTableHeader(headers, 0);
            const newHeader = getTableHeader(headers, 1);

            const newIndex = 1;
            const length = 1;
            const offsetX = (newIndex + length) * WIDTH_IN_PX;

            // select the old header
            oldHeader.mouse("mousedown").mouse("mouseup");

            // show selection region while reordering
            oldHeader.mouse("mousedown").mouse("mousemove", offsetX);
            expect(table.find(`.${Classes.TABLE_SELECTION_REGION}`).exists()).to.be.true;

            oldHeader.mouse("mouseup", offsetX);
            expect(table.find(`.${Classes.TABLE_SELECTION_REGION}`).exists()).to.be.true;
            expect(oldHeader.hasClass(Classes.TABLE_HEADER_SELECTED)).to.be.false;
            expect(newHeader.hasClass(Classes.TABLE_HEADER_SELECTED)).to.be.true;
        });

        function mountTable(props: Partial<ITableProps>) {
            const table = harness.mount(
                <Table
                    columnWidths={Array(NUM_COLUMNS).fill(WIDTH_IN_PX)}
                    numRows={NUM_ROWS}
                    rowHeights={Array(NUM_ROWS).fill(HEIGHT_IN_PX)}
                    {...props}
                >
                    <Column renderCell={renderCell}/>
                    <Column renderCell={renderCell}/>
                    <Column renderCell={renderCell}/>
                    <Column renderCell={renderCell}/>
                    <Column renderCell={renderCell}/>
                </Table>,
            );
            return table;
        }

        function getColumnHeadersWrapper(table: ElementHarness) {
            return table.find(`.${Classes.TABLE_COLUMN_HEADERS}`);
        }

        function getRowHeadersWrapper(table: ElementHarness) {
            return table.find(`.${Classes.TABLE_ROW_HEADERS}`);
        }

        function getTableHeader(headersWrapper: ElementHarness, columnIndex: number) {
            return headersWrapper.find(`.${Classes.TABLE_HEADER}`, columnIndex);
        }
    });

    describe("Focused cell", () => {
        let onFocus: Sinon.SinonSpy;

        const NUM_ROWS = 3;
        const NUM_COLS = 3;

        // center the initial focus cell
        const DEFAULT_FOCUSED_CELL_COORDS = { row: 1, col: 1 } as IFocusedCellCoordinates;

        // Enzyme appears to render our Table at 60px high x 400px wide. make all rows and columns
        // the same size as the table to force scrolling no matter which direction we move the focus
        // cell.
        const ROW_HEIGHT = 60;
        const COL_WIDTH = 400;

        // make these values arbitrarily bigger than the table bounds
        const OVERSIZED_ROW_HEIGHT = 10000;
        const OVERSIZED_COL_WIDTH = 10000;

        beforeEach(() => {
            onFocus = sinon.spy();
        });

        describe("moves a focus cell with arrow keys", () => {
            runFocusCellMoveTest("up", Keys.ARROW_UP, { row: 0, col: 1 });
            runFocusCellMoveTest("down", Keys.ARROW_DOWN, { row: 2, col: 1 });
            runFocusCellMoveTest("left", Keys.ARROW_LEFT, { row: 1, col: 0 });
            runFocusCellMoveTest("right", Keys.ARROW_RIGHT, { row: 1, col: 2 });

            it("doesn't move a focus cell if modifier key is pressed", () => {
                const { component } = mountTable();
                component.simulate("keyDown", createKeyEventConfig(component, "right", Keys.ARROW_RIGHT, true));
                expect(onFocus.called).to.be.false;
            });

            function runFocusCellMoveTest(key: string, keyCode: number, expectedCoords: IFocusedCellCoordinates) {
                it(key, () => {
                    const { component } = mountTable();
                    component.simulate("keyDown", createKeyEventConfig(component, key, keyCode));
                    expect(onFocus.called).to.be.true;
                    expect(onFocus.getCall(0).args[0]).to.deep.equal(expectedCoords);
                });
            }
        });

        describe("scrolls viewport to fit focused cell after moving it", () => {
            runFocusCellViewportScrollTest("up", Keys.ARROW_UP, "top", ROW_HEIGHT * 0);
            runFocusCellViewportScrollTest("down", Keys.ARROW_DOWN, "top", ROW_HEIGHT * 2);
            runFocusCellViewportScrollTest("left", Keys.ARROW_LEFT, "left", COL_WIDTH * 0);
            runFocusCellViewportScrollTest("right", Keys.ARROW_RIGHT, "left", COL_WIDTH * 2);

            it("keeps top edge of oversized focus cell in view when moving left and right", () => {
                // subtract one pixel to avoid clipping the focus cell
                const EXPECTED_TOP_OFFSET = (OVERSIZED_ROW_HEIGHT * 1) - 1;

                const { component } = mountTable(OVERSIZED_ROW_HEIGHT, OVERSIZED_COL_WIDTH);
                const keyEventConfig = createKeyEventConfig(component, "right", Keys.ARROW_RIGHT);

                // move right twice, expecting the viewport to snap to the top of the oversize
                // focused cell both times

                component.simulate("keyDown", keyEventConfig);
                expect(component.state("viewportRect").top).to.equal(EXPECTED_TOP_OFFSET);
                component.simulate("keyDown", keyEventConfig);
                expect(component.state("viewportRect").top).to.equal(EXPECTED_TOP_OFFSET);
            });

            it("keeps left edge of oversized focus cell in view when moving up and down", () => {
                // subtract one pixel to avoid clipping the focus cell
                const EXPECTED_LEFT_OFFSET = (OVERSIZED_COL_WIDTH * 1) - 1;

                const { component } = mountTable(OVERSIZED_ROW_HEIGHT, OVERSIZED_COL_WIDTH);
                const keyEventConfig = createKeyEventConfig(component, "down", Keys.ARROW_DOWN);

                // move down twice, expecting the viewport to snap to the left of the oversize
                // focused cell both times

                component.simulate("keyDown", keyEventConfig);
                expect(component.state("viewportRect").left).to.equal(EXPECTED_LEFT_OFFSET);
                component.simulate("keyDown", keyEventConfig);
                expect(component.state("viewportRect").left).to.equal(EXPECTED_LEFT_OFFSET);
            });

            function runFocusCellViewportScrollTest(key: string,
                                                    keyCode: number,
                                                    attrToCheck: "top" | "left",
                                                    expectedOffset: number) {
                it(key, () => {
                    const { component } = mountTable();
                    component.simulate("keyDown", createKeyEventConfig(component, key, keyCode));
                    expect(component.state("viewportRect")[attrToCheck]).to.equal(expectedOffset);
                });
            }
        });

        function mountTable(rowHeight = ROW_HEIGHT, colWidth = COL_WIDTH) {
            const attachTo = document.createElement("div");
            // need to `.fill` with some explicit value so that mapping will work, apparently
            const columns = Array(NUM_COLS).fill(undefined).map((_, i) => <Column key={i} renderCell={renderCell}/>);
            const component = mount(
                <Table
                    columnWidths={Array(NUM_ROWS).fill(colWidth)}
                    enableFocus={true}
                    focusedCell={DEFAULT_FOCUSED_CELL_COORDS}
                    onFocus={onFocus}
                    rowHeights={Array(NUM_ROWS).fill(rowHeight)}
                    numRows={NUM_ROWS}
                >
                    {columns}
                </Table>
            , { attachTo });

            // center the viewport on the focused cell
            const viewportLeft = DEFAULT_FOCUSED_CELL_COORDS.col * COL_WIDTH;
            const viewportTop = DEFAULT_FOCUSED_CELL_COORDS.row * ROW_HEIGHT;
            const viewportWidth = COL_WIDTH;
            const viewportHeight = ROW_HEIGHT;
            component.setState({ viewportRect: new Rect(viewportLeft, viewportTop, viewportWidth, viewportHeight) });

            return { attachTo, component };
        }

        function createKeyEventConfig(component: ReactWrapper<any, any>,
                                      key: string,
                                      keyCode: number,
                                      shiftKey = false) {
            const eventConfig = {
                key,
                keyCode,
                shiftKey,
                preventDefault: () => { /* Empty */ },
                stopPropagation: () => { /* Empty */ },
                target: (component as any).getNode(), // `getNode` is a real Enzyme method, just not in the typings?
                which: keyCode,
            };
            return {
                eventConfig,
                nativeEvent: eventConfig,
            };
        }
    });

    describe("Manually scrolling while drag-selecting", () => {
        const ACTIVATION_CELL_COORDS = { row: 1, col: 1 } as ICellCoordinates;

        const NUM_ROWS = 3;
        const NUM_COLS = 3;

        const ROW_HEIGHT = 60;
        const COL_WIDTH = 400;

        let onSelection: Sinon.SinonSpy;

        beforeEach(() => {
            onSelection = sinon.spy();
        });

        runTest("up");
        runTest("down");
        runTest("left");
        runTest("right");

        function runTest(direction: "up" | "down" | "left" | "right") {
            const nextCellCoords = ACTIVATION_CELL_COORDS;

            if (direction === "up") {
                nextCellCoords.col -= 1;
            } else if (direction === "down") {
                nextCellCoords.col += 1;
            } else if (direction === "left") {
                nextCellCoords.row -= 1;
            } else { // if direction === "right"
                nextCellCoords.row += 1;
            }

            it(`should keep the same activation coordinates when manually scrolling ${direction}`, () => {
                assertActivationCellUnaffected(nextCellCoords);
            });
        }

        function assertActivationCellUnaffected(nextCellCoords: ICellCoordinates) {
            // setup
            const table = mountTable();
            const grid = (table.instance() as any).grid as Grid;
            const prevViewportRect = table.state("locator").getViewportRect();

            // get native DOM nodes
            const tableNode = ReactDOM.findDOMNode(table.instance());
            const tableBodySelector = `.${Classes.TABLE_BODY_VIRTUAL_CLIENT}`;
            const tableBodyNode = ReactDOM.findDOMNode(tableNode.querySelector(tableBodySelector));

            // trigger a drag-selection starting at the center of the activation cell
            const activationX = COL_WIDTH / 2;
            const activationY = ROW_HEIGHT / 2;
            dispatchMouseEvent(tableBodyNode, "mousedown", activationX, activationY);

            // scroll the next cell into view
            updateViewport(table,
                grid.getCumulativeWidthBefore(nextCellCoords.col),
                grid.getCumulativeHeightBefore(nextCellCoords.row),
                prevViewportRect.height,
                prevViewportRect.width,
            );

            // move the mouse a little to trigger a selection update
            dispatchMouseEvent(document, "mousemove", activationX, activationY + 1);

            // verify the selection is still anchored to the activation cell
            // (onSelection will now have been called after the "mousedown" and after the "mousemove")
            const selections = onSelection.getCall(1).args[0];
            const selection = selections[0];

            const selectedCols = selection.cols;
            const selectedRows = selection.rows;

            const expectedCols = sortInterval(ACTIVATION_CELL_COORDS.col, nextCellCoords.col);
            const expectedRows = sortInterval(ACTIVATION_CELL_COORDS.row, nextCellCoords.row);

            expect(Utils.arraysEqual(selectedCols, expectedCols)).to.be.true;
            expect(Utils.arraysEqual(selectedRows, expectedRows)).to.be.true;
        }

        function updateViewport(table: ReactWrapper<any, {}>,
                                left: number,
                                top: number,
                                width: number,
                                height: number) {
            // bodyElement is private, so we need to cast as `any` to access it
            (table.state("locator") as any).bodyElement = {
                clientHeight: height,
                clientWidth: width,
                getBoundingClientRect: () => ({ left: 0, top: 0 }),
                scrollLeft: left,
                scrollTop: top,
            };
        }

        function mountTable(rowHeight = ROW_HEIGHT, colWidth = COL_WIDTH) {
            // need to explicitly `.fill` a new array with empty values for mapping to work
            const defineColumn = (_unused: any, i: number) => <Column key={i} renderCell={renderCell}/>;
            const columns = Array(NUM_COLS).fill(undefined).map(defineColumn);

            const table = mount(
                <Table
                    columnWidths={Array(NUM_ROWS).fill(colWidth)}
                    onSelection={onSelection}
                    rowHeights={Array(NUM_ROWS).fill(rowHeight)}
                    numRows={NUM_ROWS}
                >
                    {columns}
                </Table>);

            // scroll to the activation cell
            updateViewport(table,
                ACTIVATION_CELL_COORDS.col * colWidth,
                ACTIVATION_CELL_COORDS.row * rowHeight,
                colWidth,
                rowHeight,
            );

            return table;
        }

        function sortInterval(coord1: number, coord2: number) {
            return (coord1 > coord2) ? [coord2, coord1] : [coord1, coord2];
        }
    });

    xit("Accepts a sparse array of column widths", () => {
        const table = harness.mount(
            <Table columnWidths={[null, 200, null]} defaultColumnWidth={75}>
                <Column />
                <Column />
                <Column />
            </Table>,
        );

        const columns = table.find(`.${Classes.TABLE_COLUMN_HEADERS}`);
        expect(columns.find(`.${Classes.TABLE_HEADER}`, 0).bounds().width).to.equal(75);
        expect(columns.find(`.${Classes.TABLE_HEADER}`, 1).bounds().width).to.equal(200);
        expect(columns.find(`.${Classes.TABLE_HEADER}`, 2).bounds().width).to.equal(75);
    });

    xdescribe("Persists column widths", () => {
        const expectHeaderWidth = (table: ElementHarness, index: number, width: number) => {
            expect(table
                .find(`.${Classes.TABLE_COLUMN_HEADERS}`)
                .find(`.${Classes.TABLE_HEADER}`, index)
                .bounds().width,
            ).to.equal(width);
        };

        it("remembers width for columns that have an ID", () => {
            const columns = [
                <Column key="a" id="a" />,
                <Column key="b" id="b" />,
                <Column key="c" id="c" />,
            ];

            // default and explicit sizes sizes
            const table0 = harness.mount(
                <Table columnWidths={[null, 100, null]} defaultColumnWidth={50}>{columns}</Table>,
            );
            expectHeaderWidth(table0, 0, 50);
            expectHeaderWidth(table0, 1, 100);
            expectHeaderWidth(table0, 2, 50);

            // removing explicit size props
            const table1 = harness.mount(
                <Table>{columns}</Table>,
            );
            expectHeaderWidth(table1, 0, 50);
            expectHeaderWidth(table1, 1, 100);
            expectHeaderWidth(table1, 2, 50);

            // re-arranging and REMOVING columns
            const table2 = harness.mount(
                <Table>{[columns[1], columns[0]]}</Table>,
            );
            expectHeaderWidth(table2, 0, 100);
            expectHeaderWidth(table2, 1, 50);

            // re-arranging and ADDING columns
            const table3 = harness.mount(
                <Table defaultColumnWidth={51}>{columns}</Table>,
            );
            expectHeaderWidth(table3, 0, 50);
            expectHeaderWidth(table3, 1, 100);
            expectHeaderWidth(table3, 2, 51);
        });

        it("remembers width for columns without IDs using index", () => {
            const columns = [
                <Column key="a" id="a" />,
                <Column key="b" />,
                <Column key="c" />,
            ];

            // default and explicit sizes sizes
            const table0 = harness.mount(
                <Table columnWidths={[null, 100, null]} defaultColumnWidth={50}>{columns}</Table>,
            );
            expectHeaderWidth(table0, 0, 50);
            expectHeaderWidth(table0, 1, 100);
            expectHeaderWidth(table0, 2, 50);

            // removing explicit size props
            const table1 = harness.mount(
                <Table>{columns}</Table>,
            );
            expectHeaderWidth(table1, 0, 50);
            expectHeaderWidth(table1, 1, 100);
            expectHeaderWidth(table1, 2, 50);

            // re-arranging and REMOVING columns
            const table2 = harness.mount(
                <Table>{[columns[1], columns[0]]}</Table>,
            );
            expectHeaderWidth(table2, 0, 50); // <= difference when no IDs
            expectHeaderWidth(table2, 1, 50);

            // re-arranging and ADDING columns
            const table3 = harness.mount(
                <Table defaultColumnWidth={51}>{columns}</Table>,
            );
            expectHeaderWidth(table3, 0, 50);
            expectHeaderWidth(table3, 1, 50); // <= difference when no IDs
            expectHeaderWidth(table3, 2, 51);
        });
    });

    function renderCell() {
        return <Cell>gg</Cell>;
    }
});
