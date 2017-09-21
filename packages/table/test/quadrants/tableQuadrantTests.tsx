/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { expect } from "chai";
import { mount, ReactWrapper } from "enzyme";
import * as React from "react";

import * as Classes from "../../src/common/classes";
import * as Errors from "../../src/common/errors";
import { Grid } from "../../src/common/grid";
import { ITableQuadrantProps, QuadrantType, TableQuadrant } from "../../src/quadrants/tableQuadrant";

/**
 * <TableQuadrant> is responsible for showing a single table "instance" of both
 * header and body cells.
 */
describe("TableQuadrant", () => {
    const NUM_ROWS = 5;
    const NUM_COLUMNS = 3;

    const ROW_HEIGHT = 10;
    const COLUMN_WIDTH = 100;

    const ROW_HEIGHTS = Array(NUM_ROWS).fill(ROW_HEIGHT);
    const COLUMN_WIDTHS = Array(NUM_COLUMNS).fill(COLUMN_WIDTH);

    let grid: Grid;
    const renderBody = sinon.spy();

    beforeEach(() => {
        grid = new Grid(ROW_HEIGHTS, COLUMN_WIDTHS);
    });

    afterEach(() => {
        renderBody.reset();
    });

    describe("Event callbacks", () => {
        it("adds onScroll to the TABLE_QUADRANT_SCROLL_CONTAINER", () => {
            const onScroll = sinon.spy();
            const component = mountTableQuadrant({ onScroll });
            component.find(`.${Classes.TABLE_QUADRANT_SCROLL_CONTAINER}`).simulate("scroll");
            expect(onScroll.called).to.be.true;
        });

        it("adds onWheel to the TABLE_QUADRANT_SCROLL_CONTAINER", () => {
            const onWheel = sinon.spy();
            const component = mountTableQuadrant({ onWheel });
            component.find(`.${Classes.TABLE_QUADRANT_SCROLL_CONTAINER}`).simulate("wheel");
            expect(onWheel.called).to.be.true;
        });

        it("prints a console warning if onScroll is provided when quadrantType != MAIN", () => {
            const consoleWarn = sinon.spy(console, "warn");
            mountTableQuadrant({ onScroll: sinon.spy(), quadrantType: QuadrantType.LEFT });
            expect(consoleWarn.calledOnce);
            expect(consoleWarn.firstCall.args[0]).to.equal(Errors.QUADRANT_ON_SCROLL_UNNECESSARILY_DEFINED);
            consoleWarn.restore();
        });
    });

    describe("refs", () => {
        it("bodyRef returns TABLE_QUADRANT_BODY_CONTAINER element", () => {
            runTest("bodyRef", Classes.TABLE_QUADRANT_BODY_CONTAINER);
        });

        it("quadrantRef returns top-level TABLE_QUADRANT element", () => {
            runTest("quadrantRef", Classes.TABLE_QUADRANT);
        });

        it("scrollContainerRef returns TABLE_QUADRANT_SCROLL_CONTAINER element", () => {
            runTest("scrollContainerRef", Classes.TABLE_QUADRANT_SCROLL_CONTAINER);
        });

        function runTest(propKey: "bodyRef" | "quadrantRef" | "scrollContainerRef", expectedClassName: string) {
            const refHandler = sinon.spy();
            mountTableQuadrant({ [propKey]: refHandler });
            expect(refHandler.calledOnce).to.be.true;
            const ref = refHandler.firstCall.args[0] as HTMLElement;
            expect(ref.classList.contains(expectedClassName)).to.be.true;
        }
    });

    describe("style", () => {
        it("applies custom props.style to the top-level element", () => {
            // need to use `rgb()` syntax, because colors are expressed that way
            // in rendered style object
            const style = { background: "rgb(1, 2, 3)", color: "rgb(4, 5, 6)" };
            const component = mountTableQuadrant({ style });

            const renderedStyle = (component.getDOMNode() as HTMLElement).style;
            expect(renderedStyle.background).to.deep.equal(style.background);
            expect(renderedStyle.color).to.deep.equal(style.color);
        });
    });

    /**
     * <TableQuadrant> knows which portions of the body should be rendered based on the quadrantType,
     * and it passes those opinions to the renderBody() callback via flags.
     */
    describe("renderBody", () => {
        it("invokes with proper params for QuarantType.MAIN", () => {
            runTest(QuadrantType.MAIN, [QuadrantType.MAIN, false, false]);
        });

        it("invokes with proper params for QuarantType.TOP", () => {
            runTest(QuadrantType.TOP, [QuadrantType.TOP, true, false]);
        });

        it("invokes with proper params for QuarantType.LEFT", () => {
            runTest(QuadrantType.LEFT, [QuadrantType.LEFT, false, true]);
        });

        it("invokes with proper params for QuarantType.TOP_LEFT", () => {
            runTest(QuadrantType.TOP_LEFT, [QuadrantType.TOP_LEFT, true, true]);
        });

        it("invokes with no params when quarantType not provided", () => {
            runTest(undefined, []);
        });

        function runTest(quadrantType: QuadrantType, expectedArgs: any[]) {
            mountTableQuadrant({ quadrantType });
            expect(renderBody.calledOnce).to.be.true;
            expect(renderBody.firstCall.args).to.deep.equal(expectedArgs);
        }
    });

    describe("Render logic", () => {
        describe("Menu", () => {
            const MENU_CLASS = "foo";

            it("renders menu if renderMenu provided", () => {
                const renderMenu = sinon.stub().returns(<div className={MENU_CLASS} />);
                const component = mountTableQuadrant({ renderMenu });
                expect(renderMenu.called).to.be.true;
                expect(component.find(`.${Classes.TABLE_TOP_CONTAINER} > .${MENU_CLASS}`).length).to.equal(1);
            });

            it("does not render menu if renderMenu not provided", () => {
                const component = mountTableQuadrant();
                expect(component.find(`.${Classes.TABLE_TOP_CONTAINER}`).children().length).to.equal(0);
            });

            it("does not render menu if isRowHeaderShown=false", () => {
                const renderMenu = sinon.stub().returns(<div className={MENU_CLASS} />);
                const component = mountTableQuadrant({ isRowHeaderShown: false, renderMenu });
                expect(renderMenu.called).to.be.false;
                expect(component.find(`.${Classes.TABLE_TOP_CONTAINER}`).children().length).to.equal(0);
            });
        });

        describe("Row header", () => {
            const ROW_HEADER_CLASS = "foo";

            it("renders row header if renderRowHeader provided", () => {
                const renderRowHeader = sinon.stub().returns(<div className={ROW_HEADER_CLASS} />);
                const component = mountTableQuadrant({ renderRowHeader });
                expect(renderRowHeader.called).to.be.true;
                expect(component.find(`.${Classes.TABLE_BOTTOM_CONTAINER} > .${ROW_HEADER_CLASS}`).length).to.equal(1);
            });

            it("does not render row header if renderRowHeader not provided", () => {
                const component = mountTableQuadrant();
                // just the body should exist
                expect(component.find(`.${Classes.TABLE_BOTTOM_CONTAINER}`).children().length).to.equal(1);
            });

            it("does not render row header if isRowHeaderShown=false", () => {
                const renderRowHeader = sinon.stub().returns(<div className={ROW_HEADER_CLASS} />);
                const component = mountTableQuadrant({ isRowHeaderShown: false, renderRowHeader });
                expect(renderRowHeader.called).to.be.false;
                expect(component.find(`.${Classes.TABLE_BOTTOM_CONTAINER}`).children().length).to.equal(1);
            });
        });

        describe("Column header", () => {
            const COLUMN_HEADER_CLASS = "foo";

            it("renders column header if renderColumnHeader provided", () => {
                const renderColumnHeader = sinon.stub().returns(<div className={COLUMN_HEADER_CLASS} />);
                const component = mountTableQuadrant({ renderColumnHeader });
                expect(renderColumnHeader.called).to.be.true;
                expect(component.find(`.${Classes.TABLE_TOP_CONTAINER} > .${COLUMN_HEADER_CLASS}`).length).to.equal(1);
            });

            it("does not render column header if renderColumnHeader not provided", () => {
                const component = mountTableQuadrant();
                expect(component.find(`.${Classes.TABLE_TOP_CONTAINER}`).children().length).to.equal(0);
            });

            it("still renders column header if isRowHeaderShown=false", () => {
                const renderColumnHeader = sinon.stub().returns(<div className={COLUMN_HEADER_CLASS} />);
                const component = mountTableQuadrant({ isRowHeaderShown: false, renderColumnHeader });
                expect(renderColumnHeader.called).to.be.true;
                expect(component.find(`.${Classes.TABLE_TOP_CONTAINER} > .${COLUMN_HEADER_CLASS}`).length).to.equal(1);
            });
        });
    });

    describe("CSS classes", () => {
        it("renders outermost element with TABLE_QUADRANT_MAIN class if quadrantType=MAIN", () => {
            runTest(QuadrantType.MAIN, Classes.TABLE_QUADRANT_MAIN);
        });

        it("renders outermost element with TABLE_QUADRANT_TOP class if quadrantType=TOP", () => {
            runTest(QuadrantType.TOP, Classes.TABLE_QUADRANT_TOP);
        });

        it("renders outermost element with TABLE_QUADRANT_LEFT class if quadrantType=LEFT", () => {
            runTest(QuadrantType.LEFT, Classes.TABLE_QUADRANT_LEFT);
        });

        it("renders outermost element with TABLE_QUADRANT_TOP_LEFT class if quadrantType=TOP_LEFT", () => {
            runTest(QuadrantType.TOP_LEFT, Classes.TABLE_QUADRANT_TOP_LEFT);
        });

        it("renders outermost element with no custom class if quadrantType not provided", () => {
            const component = mountTableQuadrant();
            const element = getDomNode(component);
            expect(element.classList.toString()).to.equal(Classes.TABLE_QUADRANT);
        });

        it("applies custom props.className to outermost element", () => {
            const CUSTOM_CLASS = "foo";
            const component = mountTableQuadrant({ className: CUSTOM_CLASS });
            const element = getDomNode(component);
            expect(element.classList.contains(CUSTOM_CLASS)).to.be.true;
        });

        function runTest(quadrantType: QuadrantType, expectedCssClass: string) {
            const component = mountTableQuadrant({ quadrantType });
            const element = getDomNode(component);
            expect(element.classList.contains(expectedCssClass)).to.be.true;
        }
    });

    function getDomNode(component: ReactWrapper<any, any>) {
        return component.getDOMNode() as HTMLElement;
    }

    function mountTableQuadrant(props: Partial<ITableQuadrantProps> & object = {}) {
        return mount(<TableQuadrant grid={grid} renderBody={renderBody} {...props} />);
    }
});
