/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { expect } from "chai";
import { mount, ReactWrapper } from "enzyme";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-dom/test-utils";

import * as Classes from "../../src/common/classes";
import { Grid } from "../../src/common/grid";
import * as ScrollUtils from "../../src/common/internal/scrollUtils";
import { QuadrantType } from "../../src/quadrants/tableQuadrant";
import { TableQuadrantStack } from "../../src/quadrants/tableQuadrantStack";

/**
 * <TableQuadrantStack> is responsible for sync'ing sizes and scroll positions
 * of all four child <TableQuadrant>s.
 */
describe("TableQuadrantStack", () => {
    const NUM_ROWS = 5;
    const NUM_COLUMNS = 5;

    const NUM_FROZEN_ROWS = 1;
    const NUM_FROZEN_COLUMNS = 1;

    const ROW_HEADER_WIDTH = 30;
    const COLUMN_HEADER_HEIGHT = 30;
    const EXPECTED_HEADER_BORDER_WIDTH = 1;

    // for Grid initialization
    const ROW_HEIGHT = 20;
    const COLUMN_WIDTH = 100;
    const ROW_HEIGHTS = Array(NUM_ROWS).fill(ROW_HEIGHT);
    const COLUMN_WIDTHS = Array(NUM_COLUMNS).fill(COLUMN_WIDTH);

    const GRID_HEIGHT = NUM_ROWS * ROW_HEIGHT;
    const GRID_WIDTH = NUM_COLUMNS * COLUMN_WIDTH;

    let grid: Grid;

    beforeEach(() => {
        grid = new Grid(ROW_HEIGHTS, COLUMN_WIDTHS);
    });

    it("emits refs using elements from the MAIN quadrant", () => {
        const quadrantRef = sinon.spy();
        const rowHeaderRef = sinon.spy();
        const columnHeaderRef = sinon.spy();
        const scrollContainerRef = sinon.spy();

        const renderColumnHeader = (refHandler: (ref: HTMLElement) => void) => {
            return <div ref={refHandler} />;
        };
        const rendeRowHeader = (refHandler: (ref: HTMLElement) => void) => {
            return <div ref={refHandler} />;
        };

        mount(
            <TableQuadrantStack
                grid={grid}
                renderBody={sinon.spy()}
                quadrantRef={quadrantRef}
                rowHeaderRef={rowHeaderRef}
                columnHeaderRef={columnHeaderRef}
                scrollContainerRef={scrollContainerRef}

                renderColumnHeader={renderColumnHeader}
                renderRowHeader={rendeRowHeader}
            />,
        );

        const isMainQuadrantChild = (refSpy: Sinon.SinonSpy) => {
            const refElement = refSpy.firstCall.args[0] as HTMLElement;
            const quadrantElement = refElement.closest(`.${Classes.TABLE_QUADRANT_MAIN}`) as HTMLElement;
            return quadrantElement != null;
        };

        expect(isMainQuadrantChild(quadrantRef)).to.be.true;
        expect(isMainQuadrantChild(rowHeaderRef)).to.be.true;
        expect(isMainQuadrantChild(columnHeaderRef)).to.be.true;
        expect(isMainQuadrantChild(scrollContainerRef)).to.be.true;

    });

    it("on row resize, doesn't throw an error if handleRowResizeGuide not provided", () => {
        type ResizeHandler = (verticalGuides: number[]) => void;
        let resizeHandlerMain: ResizeHandler;
        let resizeHandlerTop: ResizeHandler;
        let resizeHandlerLeft: ResizeHandler;
        let resizeHandlerTopLeft: ResizeHandler;

        let callCount = 0;
        const renderRowHeader = (_a: any, resizeHandler: any) => {
            switch (callCount) {
                case 0: resizeHandlerMain = resizeHandler; break;
                case 1: resizeHandlerTop = resizeHandler; break;
                case 2: resizeHandlerLeft = resizeHandler; break;
                case 3: resizeHandlerTopLeft = resizeHandler; break;
                default: break;
            }
            callCount += 1;
            return <div />;
        };

        mount(<TableQuadrantStack
            grid={grid}
            renderBody={sinon.spy()}
            renderRowHeader={renderRowHeader}
        />);

        const HORIZONTAL_GUIDES = [1, 2, 3];
        expect(() => resizeHandlerMain(HORIZONTAL_GUIDES)).not.to.throw();
    });

    it("resizes quadrants to clear scrollbars if they are showing", () => {
        // make the container 1px smaller to force scrollbars to show
        const containerHeight = GRID_HEIGHT - 1;
        const containerWidth = GRID_WIDTH - 1;

        const containerStyle = {
            height: containerHeight,
            overflow: "auto",
            width: containerWidth,
        };
        const bodyStyle = {
            height: GRID_HEIGHT,
            width: GRID_WIDTH,
        };

        const { container } = renderIntoDom(
            <div style={containerStyle}>
                <TableQuadrantStack
                    grid={grid}
                    renderBody={sinon.stub().returns(<div style={bodyStyle} />)}
                />
            </div>,
        );
        const { mainQuadrant, topQuadrant, leftQuadrant } = findQuadrants(container);

        // measure the scrollbar size for our test environment.
        // we assume this utility works, because it's unit-tested elsewhere.
        const mainScrollContainer = mainQuadrant.querySelector(`.${Classes.TABLE_QUADRANT_SCROLL_CONTAINER}`);
        const scrollbarSize = ScrollUtils.measureScrollBarThickness(mainScrollContainer as HTMLElement, "vertical");

        const { width: mainWidth, height: mainHeight } = mainQuadrant.getBoundingClientRect();
        expect(mainWidth).to.equal(containerWidth);
        expect(mainHeight).to.equal(containerHeight);

        const { width: topWidth } = topQuadrant.getBoundingClientRect();
        expect(topWidth).to.equal(containerWidth - scrollbarSize);

        const { height: leftHeight } = leftQuadrant.getBoundingClientRect();
        expect(leftHeight).to.equal(containerHeight - scrollbarSize);
    });

    it("resizes quadrants to be flush with parent if scrollbars are not showing", () => {
        // make the container big enough to fit the grid without scrolling
        const containerHeight = GRID_HEIGHT * 2;
        const containerWidth = GRID_WIDTH * 2;

        const containerStyle = {
            height: containerHeight,
            overflow: "auto",
            width: containerWidth,
        };
        const bodyStyle = {
            height: GRID_HEIGHT,
            width: GRID_WIDTH,
        };

        const { container } = renderIntoDom(
            <div style={containerStyle}>
                <TableQuadrantStack
                    grid={grid}
                    renderBody={sinon.stub().returns(<div style={bodyStyle} />)}
                />
            </div>,
        );

        const { mainQuadrant, topQuadrant, leftQuadrant } = findQuadrants(container);

        const { width: mainWidth, height: mainHeight } = mainQuadrant.getBoundingClientRect();
        expect(mainWidth).to.equal(containerWidth);
        expect(mainHeight).to.equal(containerHeight);

        const { width: topWidth } = topQuadrant.getBoundingClientRect();
        expect(topWidth).to.equal(containerWidth);

        const { height: leftHeight } = leftQuadrant.getBoundingClientRect();
        expect(leftHeight).to.equal(containerHeight);
    });

    describe("Initial render", () => {
        it("renders four quadrants (one of each type)", () => {
            const renderBody = sinon.spy();
            const component = mount(<TableQuadrantStack grid={grid} renderBody={renderBody} />);
            const element = getDomNode(component);
            expect(element.classList.contains(Classes.TABLE_QUADRANT_STACK));
            expect(element.children.item(0).classList.contains(Classes.TABLE_QUADRANT_MAIN));
            expect(element.children.item(1).classList.contains(Classes.TABLE_QUADRANT_TOP));
            expect(element.children.item(2).classList.contains(Classes.TABLE_QUADRANT_LEFT));
            expect(element.children.item(3).classList.contains(Classes.TABLE_QUADRANT_TOP_LEFT));
        });

        it("invokes renderMenu once for each quadrant on mount", () => {
            const renderBody = sinon.spy();
            const renderMenu = sinon.spy();
            mount(<TableQuadrantStack
                grid={grid}
                renderBody={renderBody}
                renderMenu={renderMenu}
            />);
            expect(renderMenu.callCount).to.equal(4);
        });

        it("invokes renderColumnHeader once for each quadrant on mount", () => {
            const renderBody = sinon.spy();
            const renderColumnHeader = sinon.spy();
            mount(<TableQuadrantStack
                grid={grid}
                renderBody={renderBody}
                renderColumnHeader={renderColumnHeader}
            />);
            expect(renderColumnHeader.callCount).to.equal(4);
        });

        it("invokes renderRowHeader once for each quadrant on mount", () => {
            const renderBody = sinon.spy();
            const renderRowHeader = sinon.spy();
            mount(<TableQuadrantStack
                grid={grid}
                renderBody={renderBody}
                renderRowHeader={renderRowHeader}
            />);
            expect(renderRowHeader.callCount).to.equal(4);
        });
    });

    describe("Resize callbacks", () => {
        type ResizeHandler = (verticalGuides: number[]) => void;
        let resizeHandler: ResizeHandler;

        // this will be called four times, but doesn't matter.
        const renderRowOrColumnHeader = (_a: any, resizeHandlerInstance: any) => {
            resizeHandler = resizeHandlerInstance;
            return <div />;
        };

        describe("on column resize", () => {
            it("doesn't throw an error if handleColumnResizeGuide not provided", () => {
                mount(<TableQuadrantStack
                    grid={grid}
                    renderBody={sinon.spy()}
                    renderColumnHeader={renderRowOrColumnHeader}
                />);
                expect(() => resizeHandler([])).not.to.throw();
            });

            it("invokes props.handleColumnResizeGuide if provided", () => {
                const handleColumnResizeGuide = sinon.spy();
                mount(<TableQuadrantStack
                    grid={grid}
                    handleColumnResizeGuide={handleColumnResizeGuide}
                    renderBody={sinon.spy()}
                    renderColumnHeader={renderRowOrColumnHeader}
                />);
                resizeHandler([]);
                expect(handleColumnResizeGuide.calledOnce).to.be.true;
            });
        });

        describe("on row resize", () => {
            it("doesn't throw an error if handleRowResizeGuide not provided", () => {
                mount(<TableQuadrantStack
                    grid={grid}
                    renderBody={sinon.spy()}
                    renderRowHeader={renderRowOrColumnHeader}
                />);
                expect(() => resizeHandler([])).not.to.throw();
            });

            it("invokes props.handleRowResizeGuide if provided", () => {
                const handleRowResizeGuide = sinon.spy();
                mount(<TableQuadrantStack
                    grid={grid}
                    handleRowResizeGuide={handleRowResizeGuide}
                    renderBody={sinon.spy()}
                    renderRowHeader={renderRowOrColumnHeader}
                />);
                resizeHandler([]);
                expect(handleRowResizeGuide.calledOnce).to.be.true;
            });
        });
    });

    describe("Reordering callbacks", () => {
        type ReorderingHandler = (oldIndex: number, newIndex: number, length: number) => void;
        let reorderingHandler: ReorderingHandler;

        // this will be called four times, but doesn't matter.
        const renderRowOrColumnHeader = (_a: any, _b: any, reorderingHandlerInstance: any) => {
            reorderingHandler = reorderingHandlerInstance;
            return <div />;
        };

        describe("on column resize", () => {
            it("doesn't throw an error if handleColumnsReordering not provided", () => {
                mount(<TableQuadrantStack
                    grid={grid}
                    renderBody={sinon.spy()}
                    renderColumnHeader={renderRowOrColumnHeader}
                />);
                expect(() => reorderingHandler(1, 2, 3)).not.to.throw();
            });

            it("invokes props.handleColumnsReordering if provided", () => {
                const handleColumnsReordering = sinon.spy();
                mount(<TableQuadrantStack
                    grid={grid}
                    handleColumnsReordering={handleColumnsReordering}
                    renderBody={sinon.spy()}
                    renderColumnHeader={renderRowOrColumnHeader}
                />);
                reorderingHandler(1, 2, 3);
                expect(handleColumnsReordering.calledOnce).to.be.true;
            });
        });

        describe("on row resize", () => {
            it("doesn't throw an error if handleRowsReordering not provided", () => {
                mount(<TableQuadrantStack
                    grid={grid}
                    renderBody={sinon.spy()}
                    renderRowHeader={renderRowOrColumnHeader}
                />);
                expect(() => reorderingHandler(1, 2, 3)).not.to.throw();
            });

            it("invokes props.handleRowsReordering if provided", () => {
                const handleRowsReordering = sinon.spy();
                mount(<TableQuadrantStack
                    grid={grid}
                    handleRowsReordering={handleRowsReordering}
                    renderBody={sinon.spy()}
                    renderRowHeader={renderRowOrColumnHeader}
                />);
                reorderingHandler(1, 2, 3);
                expect(handleRowsReordering.calledOnce).to.be.true;
            });
        });
    });

    describe("Size syncing", () => {
        describe("if numFrozenRows == 0 && numFrozenColumns == 0", () => {
            runQuadrantSizeTestSuite(0, 0);
        });

        describe("if numFrozenRows > 0 && numFrozenColumns == 0", () => {
            runQuadrantSizeTestSuite(NUM_FROZEN_ROWS, 0);
        });

        describe("if numFrozenRows == 0 && numFrozenColumns > 0", () => {
            runQuadrantSizeTestSuite(0, NUM_FROZEN_COLUMNS);
        });

        describe("if numFrozenRows > 0 && numFrozenColumns > 0", () => {
            runQuadrantSizeTestSuite(NUM_FROZEN_ROWS, NUM_FROZEN_COLUMNS);
        });
    });

    describe("Scroll syncing", () => {
        let container: HTMLElement;
        let component: TableQuadrantStack;
        let leftScrollContainer: HTMLElement;
        let mainScrollContainer: HTMLElement;
        let topScrollContainer: HTMLElement;
        let topLeftScrollContainer: HTMLElement;

        const onScroll = sinon.spy();

        // use a negative value to force synchronous view updates.
        const DISABLED_VIEW_SYNC_DELAY = -1;

        // container should be smaller than the grid to enable scrolling
        const CONTAINER_WIDTH = GRID_WIDTH - 1;
        const CONTAINER_HEIGHT = GRID_HEIGHT - 1;

        // container isn't *that* much smaller in these tests, so don't expect
        // that huge scroll offsets will be possible. tiny values suffice here.
        const SCROLL_OFFSET_X = 2;
        const SCROLL_OFFSET_Y = 3;

        beforeEach(() => {
            /**
             * Testing scrolling when throttling and debouncing are enabled is a
             * huge pain, so disable both.
             */
            const result = renderIntoDom(
                <div style={{ height: CONTAINER_HEIGHT, width: CONTAINER_WIDTH }}>
                    <TableQuadrantStack
                        grid={grid}
                        onScroll={onScroll}
                        renderBody={renderGridBody()}
                        throttleScrolling={false}
                        viewSyncDelay={DISABLED_VIEW_SYNC_DELAY}
                    />
                </div>,
            );
            container = result.container;
            component = result.component;

            // can't destructure into existing, mutable variables; so need to assign each explicitly
            const scrollContainers = findQuadrantScrollContainers(container);
            mainScrollContainer = scrollContainers.mainScrollContainer;
            leftScrollContainer = scrollContainers.leftScrollContainer;
            topScrollContainer = scrollContainers.topScrollContainer;
            topLeftScrollContainer = scrollContainers.topLeftScrollContainer;
        });

        afterEach(() => {
            ReactDOM.unmountComponentAtNode(container);
            onScroll.reset();
        });

        describe("onScroll", () => {
            // "wheel" is invoked before "scroll"; both listeners may invoke
            // onScroll, but we want it to be invoked just once on each "wheel"
            // event. thus, use the stricter `calledOnce` instead of `called`.

            it("invokes onScroll on MAIN quadrant scroll", () => {
                TestUtils.Simulate.scroll(mainScrollContainer);
                expect(onScroll.calledOnce).to.be.true;
            });

            it("invokes onScroll on MAIN quadrant wheel", () => {
                TestUtils.Simulate.wheel(mainScrollContainer);
                expect(onScroll.calledOnce).to.be.true;
            });

            it("invokes onScroll on TOP quadrant wheel", () => {
                TestUtils.Simulate.wheel(topScrollContainer);
                expect(onScroll.calledOnce).to.be.true;
            });

            it("invokes onScroll on LEFT quadrant wheel", () => {
                TestUtils.Simulate.wheel(leftScrollContainer);
                expect(onScroll.calledOnce).to.be.true;
            });

            it("invokes onScroll on TOP_LEFT quadrant wheel", () => {
                TestUtils.Simulate.wheel(topLeftScrollContainer);
                expect(onScroll.calledOnce).to.be.true;
            });
        });

        it("syncs quadrant scroll offsets when scrolling the main quadrant", () => {
            // simulating a "scroll" or "wheel" event doesn't seem to affect the
            // scrollTop/scrollLeft the way it would in practice, so we need to tweak those
            // explicitly before triggering.
            mainScrollContainer.scrollLeft = SCROLL_OFFSET_X;
            mainScrollContainer.scrollTop = SCROLL_OFFSET_Y;

            TestUtils.Simulate.scroll(mainScrollContainer);

            assertScrollPositionEquals(topScrollContainer, SCROLL_OFFSET_X, 0);
            assertScrollPositionEquals(leftScrollContainer, 0, SCROLL_OFFSET_Y);
            assertScrollPositionEquals(topLeftScrollContainer, 0, 0);
        });

        it("syncs quadrant scroll offsets when mouse-wheeling in the main quadrant", () => {
            TestUtils.Simulate.wheel(mainScrollContainer, {
                deltaX: SCROLL_OFFSET_X,
                deltaY: SCROLL_OFFSET_Y,
            });

            assertScrollPositionEquals(topScrollContainer, SCROLL_OFFSET_X, 0);
            assertScrollPositionEquals(leftScrollContainer, 0, SCROLL_OFFSET_Y);
            assertScrollPositionEquals(topLeftScrollContainer, 0, 0);
        });

        it("syncs quadrant scroll offsets when mouse-wheeling in the top quadrant", () => {
            topScrollContainer.scrollLeft = SCROLL_OFFSET_X;
            TestUtils.Simulate.wheel(topScrollContainer, {
                deltaX: SCROLL_OFFSET_X,
                deltaY: SCROLL_OFFSET_Y,
            });

            assertScrollPositionEquals(mainScrollContainer, SCROLL_OFFSET_X, SCROLL_OFFSET_Y);
            assertScrollPositionEquals(leftScrollContainer, 0, SCROLL_OFFSET_Y);
            assertScrollPositionEquals(topLeftScrollContainer, 0, 0);
        });

        it("syncs quadrant scroll offsets when mouse-wheeling in the left quadrant", () => {
            leftScrollContainer.scrollTop = SCROLL_OFFSET_Y;
            TestUtils.Simulate.wheel(leftScrollContainer, {
                deltaX: SCROLL_OFFSET_X,
                deltaY: SCROLL_OFFSET_Y,
            });

            assertScrollPositionEquals(mainScrollContainer, SCROLL_OFFSET_X, SCROLL_OFFSET_Y);
            assertScrollPositionEquals(topScrollContainer, SCROLL_OFFSET_X, 0);
            assertScrollPositionEquals(topLeftScrollContainer, 0, 0);
        });

        it("syncs quadrant scroll offsets when mouse-wheeling in the top-left quadrant", () => {
            TestUtils.Simulate.wheel(topLeftScrollContainer, {
                deltaX: SCROLL_OFFSET_X,
                deltaY: SCROLL_OFFSET_Y,
            });

            assertScrollPositionEquals(mainScrollContainer, SCROLL_OFFSET_X, SCROLL_OFFSET_Y);
            assertScrollPositionEquals(topScrollContainer, SCROLL_OFFSET_X, 0);
            assertScrollPositionEquals(leftScrollContainer, 0, SCROLL_OFFSET_Y);
        });
    });

    // Test templates
    // ==============

    function runQuadrantSizeTestSuite(numFrozenRows: number, numFrozenColumns: number) {
        it("syncs initial quadrant sizes properly", () => {
            assertDefaultQuadrantSizesCorrect(numFrozenRows, numFrozenColumns);
        });

        it("syncs quadrants sizes properly when row header hidden", () => {
            assertQuadrantSizesCorrectIfRowHeadersHidden(numFrozenRows, numFrozenColumns);
        });
    }

    // Assertions
    // ==========

    function assertDefaultQuadrantSizesCorrect(numFrozenRows: number, numFrozenColumns: number) {
        const renderRowHeader = (refHandler: (ref: HTMLElement) => void) => {
            // need to set the width on a child so the header maintains its size
            // when the component measures the "desired" row-header width (by
            // setting width:auto on the parent here).
            return (
                <div ref={refHandler} style={{ height: "100%" }}>
                    <div style={{ width: ROW_HEADER_WIDTH }} />
                </div>
            );
        };
        const renderColumnHeader = (refHandler: (ref: HTMLElement) => void) => {
            return <div ref={refHandler} style={{ height: COLUMN_HEADER_HEIGHT, width: "100%" }} />;
        };

        const { container } = renderIntoDom(
            <TableQuadrantStack
                grid={grid}
                numFrozenColumns={numFrozenColumns}
                numFrozenRows={numFrozenRows}
                renderBody={renderGridBody()}
                renderRowHeader={renderRowHeader}
                renderColumnHeader={renderColumnHeader}
            />,
        );

        const expectedWidth = numFrozenColumns === 0
            ? ROW_HEADER_WIDTH + EXPECTED_HEADER_BORDER_WIDTH
            : ROW_HEADER_WIDTH + (numFrozenColumns * COLUMN_WIDTH);
        const expectedHeight = numFrozenRows === 0
            ? COLUMN_HEADER_HEIGHT + EXPECTED_HEADER_BORDER_WIDTH
            : COLUMN_HEADER_HEIGHT + (numFrozenRows * ROW_HEIGHT);
        assertNonMainQuadrantSizesCorrect(container, expectedWidth, expectedHeight);
    }

    function assertQuadrantSizesCorrectIfRowHeadersHidden(numFrozenRows: number, numFrozenColumns: number) {
        const renderColumnHeader = (refHandler: (ref: HTMLElement) => void) => {
            return <div ref={refHandler} style={{ height: COLUMN_HEADER_HEIGHT, width: "100%" }} />;
        };

        const { container } = renderIntoDom(
            <TableQuadrantStack
                grid={grid}
                isRowHeaderShown={false}
                numFrozenColumns={numFrozenColumns}
                numFrozenRows={numFrozenRows}
                renderBody={renderGridBody()}
                renderColumnHeader={renderColumnHeader}
            />,
        );
        // add explicit 0 to communicate that we're considering the zero-width row headers
        const expectedWidth = numFrozenColumns === 0
            ? EXPECTED_HEADER_BORDER_WIDTH
            : 0 + (numFrozenColumns * COLUMN_WIDTH);
        const expectedHeight = COLUMN_HEADER_HEIGHT + (
            numFrozenRows === 0
                ? EXPECTED_HEADER_BORDER_WIDTH
                : numFrozenRows * ROW_HEIGHT
            );
        assertNonMainQuadrantSizesCorrect(container, expectedWidth, expectedHeight);
    }

    function assertNonMainQuadrantSizesCorrect(
        component: HTMLElement,
        expectedWidth: number,
        expectedHeight: number,
    ) {
        const expectedWidthString = toPxString(expectedWidth);
        const expectedHeightString = toPxString(expectedHeight);

        const { topQuadrant, leftQuadrant, topLeftQuadrant } = findQuadrants(component);

        assertStyleEquals(leftQuadrant, "width", expectedWidthString);
        assertStyleEquals(topQuadrant, "height", expectedHeightString);
        assertStyleEquals(topLeftQuadrant, "width", expectedWidthString);
        assertStyleEquals(topLeftQuadrant, "height", expectedHeightString);
    }

    function assertScrollPositionEquals(container: Element, scrollLeft: number, scrollTop: number) {
        expect(container.scrollLeft).to.equal(scrollLeft);
        expect(container.scrollTop).to.equal(scrollTop);
    }

    function assertStyleEquals(
        element: HTMLElement,
        key: keyof React.CSSProperties,
        expectedValue: any,
    ) {
        // key's type should be okay, but TS was throwing error TS7015, hence the `any` cast
        expect(toHtmlElement(element).style[key as any]).to.equal(expectedValue);
    }

    // Helpers
    // =======

    function getDomNode(component: ReactWrapper<any, any>) {
        return component.getDOMNode() as HTMLElement;
    }

    function findQuadrants(element: Element) {
        const htmlElement = element as HTMLElement;
        // this order is clearer than alphabetical order
        // tslint:disable:object-literal-sort-keys
        return {
            mainQuadrant: htmlElement.querySelector(`.${Classes.TABLE_QUADRANT_MAIN}`) as HTMLElement,
            leftQuadrant: htmlElement.querySelector(`.${Classes.TABLE_QUADRANT_LEFT}`) as HTMLElement,
            topQuadrant: htmlElement.querySelector(`.${Classes.TABLE_QUADRANT_TOP}`) as HTMLElement,
            topLeftQuadrant: htmlElement.querySelector(`.${Classes.TABLE_QUADRANT_TOP_LEFT}`) as HTMLElement,
        };
        // tslint:enable:object-literal-sort-keys
    }

    function findQuadrantScrollContainers(container: HTMLElement) {
        // this order is clearer than alphabetical order
        // tslint:disable:object-literal-sort-keys
        return {
            leftScrollContainer: findQuadrantScrollContainer(container, QuadrantType.LEFT),
            mainScrollContainer: findQuadrantScrollContainer(container, QuadrantType.MAIN),
            topScrollContainer: findQuadrantScrollContainer(container, QuadrantType.TOP),
            topLeftScrollContainer: findQuadrantScrollContainer(container, QuadrantType.TOP_LEFT),
        };
        // tslint:enable:object-literal-sort-keys
    }

    function findQuadrantScrollContainer(container: HTMLElement, quadrantType: QuadrantType) {
        const quadrantClass = getQuadrantCssClass(quadrantType);
        return container.query(`.${quadrantClass} .${Classes.TABLE_QUADRANT_SCROLL_CONTAINER}`) as HTMLElement;
    }

    function getQuadrantCssClass(quadrantType: QuadrantType) {
        switch (quadrantType) {
            case QuadrantType.MAIN: return Classes.TABLE_QUADRANT_MAIN;
            case QuadrantType.TOP: return Classes.TABLE_QUADRANT_TOP;
            case QuadrantType.LEFT: return Classes.TABLE_QUADRANT_LEFT;
            case QuadrantType.TOP_LEFT: return Classes.TABLE_QUADRANT_TOP_LEFT;
            default: return undefined;
        }
    }

    function renderIntoDom(element: JSX.Element) {
        const containerElement = document.createElement("div");
        document.body.appendChild(containerElement);
        const component = ReactDOM.render(element, containerElement);
        return {
            component: component as TableQuadrantStack,
            container: containerElement,
        };
    }

    function toHtmlElement(element: Element) {
        return element as HTMLElement;
    }

    function toPxString(value: number) {
        return `${value}px`;
    }

    function renderGridBody() {
        return sinon.stub().returns(<div style={{ width: GRID_WIDTH, height: GRID_HEIGHT }} />);
    }
});
