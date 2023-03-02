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

import * as React from "react";

import { AbstractComponent2, Utils as CoreUtils, Props, setRef } from "@blueprintjs/core";

import * as Classes from "../common/classes";
import { Grid } from "../common/grid";
import * as ScrollUtils from "../common/internal/scrollUtils";
import { Utils } from "../common/utils";
import { TableLoadingOption } from "../regions";
import { QuadrantType, TableQuadrant } from "./tableQuadrant";
import { TableQuadrantStackCache } from "./tableQuadrantStackCache";

interface QuadrantRefMap<T> {
    columnHeader?: T;
    menu?: T;
    quadrant?: T;
    rowHeader?: T;
    scrollContainer?: T;
}

type QuadrantRefHandler = React.Ref<HTMLDivElement>;
type QuadrantRefs = QuadrantRefMap<HTMLDivElement | null>;
type QuadrantRefHandlers = QuadrantRefMap<QuadrantRefHandler>;

export interface ITableQuadrantStackProps extends Props {
    /**
     * A callback that receives a `ref` to the main quadrant's table-body element.
     */
    bodyRef?: React.Ref<HTMLDivElement>;

    /**
     * A callback that receives a `ref` to the main quadrant's column-header container.
     */
    columnHeaderRef?: React.Ref<HTMLDivElement>;

    /**
     * The grid computes sizes of cells, rows, or columns from the
     * configurable `columnWidths` and `rowHeights`.
     */
    grid: Grid;

    /**
     * An optional callback for reacting to column-resize events.
     */
    handleColumnResizeGuide?: (verticalGuides: number[]) => void;

    /**
     * An optional callback for reacting to column-reordering events.
     */
    handleColumnsReordering?: (verticalGuides: number[]) => void;

    /**
     * An optional callback for reacting to row-resize events.
     */
    handleRowResizeGuide?: (horizontalGuides: number[]) => void;

    /**
     * An optional callback for reacting to column-reordering events.
     */
    handleRowsReordering?: (horizontalGuides: number[]) => void;

    /**
     * Whether horizontal scrolling is currently disabled.
     *
     * @default false
     */
    isHorizontalScrollDisabled?: boolean;

    /**
     * If `false`, hides the row headers and settings menu. Affects the layout
     * of the table, so we need to know when this changes in order to
     * synchronize quadrant sizes properly.
     *
     * REQUIRES QUADRANT RESYNC
     *
     * @default true
     */
    enableRowHeader?: boolean;

    /**
     * Whether vertical scrolling is currently disabled.
     *
     * @default false
     */
    isVerticalScrollDisabled?: boolean;

    /**
     * A list of `TableLoadingOption`. Loading cells may have different sizes
     * from potentially custom cells in the header or body, so we need to know
     * when the loading states change in order to synchronize quadrant sizes
     * properly.
     *
     * REQUIRES QUADRANT RESYNC
     */
    loadingOptions?: TableLoadingOption[];

    /**
     * The number of columns. Affects the layout of the table, so we need to
     * know when this changes in order to synchronize quadrant sizes properly.
     *
     * REQUIRES QUADRANT RESYNC
     */
    numColumns?: number;

    /**
     * The number of frozen columns. Affects the layout of the table, so we need
     * to know when this changes in order to synchronize quadrant sizes
     * properly.
     *
     * REQUIRES QUADRANT RESYNC
     */
    numFrozenColumns: number;

    /**
     * The number of frozen rows. Affects the layout of the table, so we need to
     * know when this changes in order to synchronize quadrant sizes properly.
     *
     * REQUIRES QUADRANT RESYNC
     */
    numFrozenRows: number;

    /**
     * The number of rows. Affects the layout of the table, so we need to know
     * when this changes in order to synchronize quadrant sizes properly.
     *
     * REQUIRES QUADRANT RESYNC
     */
    numRows?: number;

    /**
     * An optional callback invoked the quadrants are scrolled.
     */
    onScroll?: React.EventHandler<React.SyntheticEvent<HTMLElement>>;

    /**
     * A callback that receives a `ref` to the main-quadrant element.
     */
    quadrantRef?: React.Ref<HTMLDivElement>;

    /**
     * A callback that renders either all of or just frozen sections of the table body.
     * May return undefined if the table is not attached to the DOM yet.
     */
    bodyRenderer: (
        quadrantType: QuadrantType,
        showFrozenRowsOnly?: boolean,
        showFrozenColumnsOnly?: boolean,
    ) => JSX.Element | undefined;

    /**
     * A callback that renders either all of or just the frozen section of the column header.
     * May return undefined if the table is not attached to the DOM yet.
     */
    columnHeaderRenderer?: (
        refHandler: React.Ref<HTMLDivElement>,
        resizeHandler: (verticalGuides: number[] | null) => void,
        reorderingHandler: (oldIndex: number, newIndex: number, length: number) => void,
        showFrozenColumnsOnly?: boolean,
    ) => JSX.Element | undefined;

    /**
     * A callback that renders the table menu (the rectangle in the top-left corner).
     */
    menuRenderer?: (refHandler: React.Ref<HTMLDivElement> | undefined) => JSX.Element;

    /**
     * A callback that renders either all of or just the frozen section of the row header.
     * May return undefined if the table is not attached to the DOM yet.
     */
    rowHeaderRenderer?: (
        refHandler: React.Ref<HTMLDivElement>,
        resizeHandler: (verticalGuides: number[] | null) => void,
        reorderingHandler: (oldIndex: number, newIndex: number, length: number) => void,
        showFrozenRowsOnly?: boolean,
    ) => JSX.Element | undefined;

    renderScrollIndicatorOverlay?: (scrollBarWidth: number, columnHeaderHeight: number) => JSX.Element | undefined;

    /**
     * A callback that receives a `ref` to the main quadrant's row-header container.
     */
    rowHeaderRef?: React.Ref<HTMLDivElement>;

    /**
     * A callback that receives a `ref` to the main quadrant's scroll-container element.
     */
    scrollContainerRef?: React.Ref<HTMLDivElement>;

    /**
     * Whether "scroll" and "wheel" events should be throttled using
     * requestAnimationFrame. Disabling this can be useful for unit testing,
     * because tests can then be synchronous.
     *
     * @default true
     */
    throttleScrolling?: boolean;

    /**
     * The amount of time in milliseconds the component should wait before
     * synchronizing quadrant sizes and offsets after the user has stopped
     * scrolling. If this value is negative, the updates will happen
     * synchronously (this is helpful for unit testing).
     *
     * @default 500
     */
    viewSyncDelay?: number;

    /**
     * If `true`, adds an interaction bar on top of all column header cells, and
     * moves interaction triggers into it. Affects the layout of the table, so
     * we need to know when this changes in order to synchronize quadrant sizes
     * properly.
     *
     * This value defaults to `undefined` so that, by default, it won't override
     * the `enableColumnInteractionBar` values that you might have provided directly to
     * each `<ColumnHeaderCell2>`.
     *
     * REQUIRES QUADRANT RESYNC
     *
     * @default undefined
     */
    enableColumnInteractionBar?: boolean;

    /**
     * Flag indicating that both the column headers (if present)
     * and row headers (if present) have been rendered and mounted, including any
     * custom renderers which may affect quadrant layout measurements.
     */
    didHeadersMount: boolean;

    /**
     * If `false`, hides the column headers. Affects the layout
     * of the table, so we need to know when this changes in order to
     * synchronize quadrant sizes properly.
     *
     * REQUIRES QUADRANT RESYNC
     *
     * @default true
     */
    enableColumnHeader?: boolean;
}

// the debounce delay for updating the view on scroll. elements will be resized
// and rejiggered once scroll has ceased for at least this long, but not before.
const DEFAULT_VIEW_SYNC_DELAY = 500;

// if there are no frozen rows or columns, we still want the quadrant to be 1px
// bigger to reveal the header border. this border leaks into the cell grid to
// ensure that selection overlay borders (e.g.) will be perfectly flush with it.
const QUADRANT_MIN_SIZE = 1;

// a list of props that trigger layout changes. when these props change,
// quadrant views need to be explicitly resynchronized.
const SYNC_TRIGGER_PROP_KEYS: Array<keyof ITableQuadrantStackProps> = [
    "enableRowHeader",
    "loadingOptions",
    "numFrozenColumns",
    "numFrozenRows",
    "numColumns",
    "numRows",
    "enableColumnInteractionBar",
    "didHeadersMount",
    "enableColumnHeader",
];

export class TableQuadrantStack extends AbstractComponent2<ITableQuadrantStackProps> {
    // we want the user to explicitly pass a quadrantType. define defaultProps as a Partial to avoid
    // declaring that and other required props here.
    public static defaultProps: Partial<ITableQuadrantStackProps> = {
        enableColumnHeader: true,
        enableColumnInteractionBar: undefined,
        enableRowHeader: true,
        isHorizontalScrollDisabled: false,
        isVerticalScrollDisabled: false,
        throttleScrolling: true,
        viewSyncDelay: DEFAULT_VIEW_SYNC_DELAY,
    };

    // Instance variables
    // ==================

    private quadrantRefs: Record<QuadrantType, QuadrantRefs> = {
        [QuadrantType.MAIN]: {},
        [QuadrantType.TOP]: {},
        [QuadrantType.LEFT]: {},
        [QuadrantType.TOP_LEFT]: {},
    };

    private quadrantRefHandlers = {
        [QuadrantType.MAIN]: this.generateQuadrantRefHandlers(QuadrantType.MAIN),
        [QuadrantType.TOP]: this.generateQuadrantRefHandlers(QuadrantType.TOP),
        [QuadrantType.LEFT]: this.generateQuadrantRefHandlers(QuadrantType.LEFT),
        [QuadrantType.TOP_LEFT]: this.generateQuadrantRefHandlers(QuadrantType.TOP_LEFT),
    };

    // this flag helps us avoid redundant work in the MAIN quadrant's onScroll callback, if the
    // callback was triggered from a manual scrollTop/scrollLeft update within an onWheel.
    private wasMainQuadrantScrollTriggeredByWheelEvent = false;

    // keep throttled event callbacks around as instance variables, so we don't
    // have to continually reinstantiate them.
    private throttledHandleMainQuadrantScroll: (event: React.UIEvent<HTMLElement>) => any;

    private throttledHandleWheel: (event: React.WheelEvent<HTMLElement>) => any;

    // cancel function for the debounced view sync handler
    private cancelPendingViewSync?: () => void;

    private cache: TableQuadrantStackCache;

    // Public
    // ======

    public constructor(props: ITableQuadrantStackProps, context?: any) {
        super(props, context);

        // callbacks trigger too frequently unless we throttle scroll and wheel
        // events. declare these functions on the component instance since
        // they're stateful.
        this.throttledHandleMainQuadrantScroll = CoreUtils.throttleReactEventCallback(this.handleMainQuadrantScroll);
        this.throttledHandleWheel = CoreUtils.throttleReactEventCallback(this.handleWheel);

        this.cache = new TableQuadrantStackCache();
    }

    /**
     * Scroll the main quadrant to the specified scroll offset, keeping all other quadrants in sync.
     */
    public scrollToPosition(scrollLeft: number, scrollTop: number) {
        const { scrollContainer } = this.quadrantRefs[QuadrantType.MAIN];

        if (scrollContainer == null) {
            return;
        }

        this.wasMainQuadrantScrollTriggeredByWheelEvent = false;

        // this will trigger the main quadrant's scroll callback below
        scrollContainer.scrollLeft = scrollLeft;
        scrollContainer.scrollTop = scrollTop;

        this.syncQuadrantViews();
    }

    /**
     * Synchronizes quadrant sizes and scroll offsets based on the current
     * column, row, and header sizes. Useful for correcting quadrant sizes after
     * explicitly resizing columns and rows, for instance.
     *
     * Invoking this method imperatively is cheaper than providing columnWidths
     * or rowHeights array props to TableQuadrantStack and forcing it to run
     * expensive array diffs upon every update.
     */
    public synchronizeQuadrantViews() {
        this.syncQuadrantViews();
    }

    public componentDidMount() {
        this.emitRefs();
        this.syncQuadrantViews();
    }

    public componentDidUpdate(prevProps: ITableQuadrantStackProps) {
        if (
            // sync'ing quadrant views triggers expensive reflows, so we only call
            // it when layout-affecting props change.
            !CoreUtils.shallowCompareKeys(this.props, prevProps, {
                include: SYNC_TRIGGER_PROP_KEYS,
            }) ||
            // in addition to those props, we also care about frozen parts of the grid
            // which may cause the top / left quadrants to change height / width
            this.didFrozenColumnWidthsChange(prevProps) ||
            this.didFrozenRowHeightsChange(prevProps)
        ) {
            this.emitRefs();
            this.syncQuadrantViews();
        }
    }

    public render() {
        const { grid, enableRowHeader, bodyRenderer, throttleScrolling, enableColumnHeader } = this.props;

        // use the more generic "scroll" event for the main quadrant to capture
        // *both* scrollbar interactions and trackpad/mousewheel gestures.
        const onMainQuadrantScroll = throttleScrolling
            ? this.throttledHandleMainQuadrantScroll
            : this.handleMainQuadrantScroll;
        const onWheel = throttleScrolling ? this.throttledHandleWheel : this.handleWheel;

        const baseProps = {
            bodyRenderer,
            enableColumnHeader,
            enableRowHeader,
            grid,
            onWheel,
        };

        const shouldRenderLeftQuadrants = this.shouldRenderLeftQuadrants();
        const maybeLeftQuadrant = shouldRenderLeftQuadrants ? (
            <TableQuadrant
                {...baseProps}
                quadrantRef={this.quadrantRefHandlers[QuadrantType.LEFT].quadrant}
                quadrantType={QuadrantType.LEFT}
                columnHeaderCellRenderer={this.renderLeftQuadrantColumnHeader}
                menuRenderer={this.renderLeftQuadrantMenu}
                rowHeaderCellRenderer={this.renderLeftQuadrantRowHeader}
                scrollContainerRef={this.quadrantRefHandlers[QuadrantType.LEFT].scrollContainer}
            />
        ) : undefined;
        const maybeTopLeftQuadrant = shouldRenderLeftQuadrants ? (
            <TableQuadrant
                {...baseProps}
                quadrantRef={this.quadrantRefHandlers[QuadrantType.TOP_LEFT].quadrant}
                quadrantType={QuadrantType.TOP_LEFT}
                columnHeaderCellRenderer={this.renderTopLeftQuadrantColumnHeader}
                menuRenderer={this.renderTopLeftQuadrantMenu}
                rowHeaderCellRenderer={this.renderTopLeftQuadrantRowHeader}
                scrollContainerRef={this.quadrantRefHandlers[QuadrantType.TOP_LEFT].scrollContainer}
            />
        ) : undefined;

        return (
            <div className={Classes.TABLE_QUADRANT_STACK}>
                {this.renderTableOverlay()}
                <TableQuadrant
                    {...baseProps}
                    bodyRef={this.props.bodyRef}
                    onScroll={onMainQuadrantScroll}
                    quadrantRef={this.quadrantRefHandlers[QuadrantType.MAIN].quadrant}
                    quadrantType={QuadrantType.MAIN}
                    columnHeaderCellRenderer={this.renderMainQuadrantColumnHeader}
                    menuRenderer={this.renderMainQuadrantMenu}
                    rowHeaderCellRenderer={this.renderMainQuadrantRowHeader}
                    scrollContainerRef={this.quadrantRefHandlers[QuadrantType.MAIN].scrollContainer}
                />
                <TableQuadrant
                    {...baseProps}
                    quadrantRef={this.quadrantRefHandlers[QuadrantType.TOP].quadrant}
                    quadrantType={QuadrantType.TOP}
                    columnHeaderCellRenderer={this.renderTopQuadrantColumnHeader}
                    menuRenderer={this.renderTopQuadrantMenu}
                    rowHeaderCellRenderer={this.renderTopQuadrantRowHeader}
                    scrollContainerRef={this.quadrantRefHandlers[QuadrantType.TOP].scrollContainer}
                />
                {maybeLeftQuadrant}
                {maybeTopLeftQuadrant}
            </div>
        );
    }

    // Ref handlers
    // ============

    private generateQuadrantRefHandlers(quadrantType: QuadrantType): QuadrantRefHandlers {
        const reducer = (agg: QuadrantRefHandlers, key: keyof QuadrantRefHandlers) => {
            agg[key] = (ref: HTMLDivElement | null) => (this.quadrantRefs[quadrantType][key] = ref);
            return agg;
        };
        const refHandlers: Array<keyof QuadrantRefHandlers> = [
            "columnHeader",
            "menu",
            "quadrant",
            "rowHeader",
            "scrollContainer",
        ];
        return refHandlers.reduce(reducer, {});
    }

    // Scrolling overlay renderer
    // ===========================

    private renderTableOverlay = () => {
        const columnHeaderHeight = this.cache.getColumnHeaderHeight();
        const mainScrollContainer = this.quadrantRefs[QuadrantType.MAIN].scrollContainer;
        const scrollBarWidth = ScrollUtils.measureScrollBarThickness(mainScrollContainer!, "vertical");
        return this.props.renderScrollIndicatorOverlay?.(scrollBarWidth, columnHeaderHeight);
    };

    // Quadrant-specific renderers
    // ===========================

    // Menu

    private renderMainQuadrantMenu = () => {
        return this.props.menuRenderer?.(this.quadrantRefHandlers[QuadrantType.MAIN].menu);
    };

    private renderTopQuadrantMenu = () => {
        return this.props.menuRenderer?.(this.quadrantRefHandlers[QuadrantType.TOP].menu);
    };

    private renderLeftQuadrantMenu = () => {
        return this.props.menuRenderer?.(this.quadrantRefHandlers[QuadrantType.LEFT].menu);
    };

    private renderTopLeftQuadrantMenu = () => {
        return this.props.menuRenderer?.(this.quadrantRefHandlers[QuadrantType.TOP_LEFT].menu);
    };

    // Column header

    private renderMainQuadrantColumnHeader = (showFrozenColumnsOnly: boolean) => {
        const refHandler = this.quadrantRefHandlers[QuadrantType.MAIN].columnHeader;
        const resizeHandler = this.handleColumnResizeGuideMain;
        const reorderingHandler = this.handleColumnsReordering;

        if (refHandler === undefined) {
            return undefined;
        }

        return this.props.columnHeaderRenderer?.(refHandler, resizeHandler, reorderingHandler, showFrozenColumnsOnly);
    };

    private renderTopQuadrantColumnHeader = (showFrozenColumnsOnly: boolean) => {
        const refHandler = this.quadrantRefHandlers[QuadrantType.TOP].columnHeader;
        const resizeHandler = this.handleColumnResizeGuideTop;
        const reorderingHandler = this.handleColumnsReordering;

        if (refHandler === undefined) {
            return undefined;
        }

        return this.props.columnHeaderRenderer?.(refHandler, resizeHandler, reorderingHandler, showFrozenColumnsOnly);
    };

    private renderLeftQuadrantColumnHeader = (showFrozenColumnsOnly: boolean) => {
        const refHandler = this.quadrantRefHandlers[QuadrantType.LEFT].columnHeader;
        const resizeHandler = this.handleColumnResizeGuideLeft;
        const reorderingHandler = this.handleColumnsReordering;

        if (refHandler === undefined) {
            return undefined;
        }

        return this.props.columnHeaderRenderer?.(refHandler, resizeHandler, reorderingHandler, showFrozenColumnsOnly);
    };

    private renderTopLeftQuadrantColumnHeader = (showFrozenColumnsOnly: boolean) => {
        const refHandler = this.quadrantRefHandlers[QuadrantType.TOP_LEFT].columnHeader;
        const resizeHandler = this.handleColumnResizeGuideTopLeft;
        const reorderingHandler = this.handleColumnsReordering;

        if (refHandler === undefined) {
            return undefined;
        }

        return this.props.columnHeaderRenderer?.(refHandler, resizeHandler, reorderingHandler, showFrozenColumnsOnly);
    };

    // Row header

    private renderMainQuadrantRowHeader = (showFrozenRowsOnly: boolean) => {
        const refHandler = this.quadrantRefHandlers[QuadrantType.MAIN].rowHeader;
        if (refHandler === undefined) {
            return undefined;
        }

        return this.props.rowHeaderRenderer?.(
            refHandler,
            this.handleRowResizeGuideMain,
            this.handleRowsReordering,
            showFrozenRowsOnly,
        );
    };

    private renderTopQuadrantRowHeader = (showFrozenRowsOnly: boolean) => {
        const refHandler = this.quadrantRefHandlers[QuadrantType.TOP].rowHeader;
        if (refHandler === undefined) {
            return undefined;
        }

        return this.props.rowHeaderRenderer?.(
            refHandler,
            this.handleRowResizeGuideTop,
            this.handleRowsReordering,
            showFrozenRowsOnly,
        );
    };

    private renderLeftQuadrantRowHeader = (showFrozenRowsOnly: boolean) => {
        const refHandler = this.quadrantRefHandlers[QuadrantType.LEFT].rowHeader;
        if (refHandler === undefined) {
            return undefined;
        }

        return this.props.rowHeaderRenderer?.(
            refHandler,
            this.handleRowResizeGuideLeft,
            this.handleRowsReordering,
            showFrozenRowsOnly,
        );
    };

    private renderTopLeftQuadrantRowHeader = (showFrozenRowsOnly: boolean) => {
        const refHandler = this.quadrantRefHandlers[QuadrantType.TOP_LEFT].rowHeader;
        if (refHandler === undefined) {
            return undefined;
        }

        return this.props.rowHeaderRenderer?.(
            refHandler,
            this.handleRowResizeGuideTopLeft,
            this.handleRowsReordering,
            showFrozenRowsOnly,
        );
    };

    // Event handlers
    // ==============

    // Scrolling
    // ---------

    private handleMainQuadrantScroll = (event: React.UIEvent<HTMLElement>) => {
        if (this.wasMainQuadrantScrollTriggeredByWheelEvent) {
            this.wasMainQuadrantScrollTriggeredByWheelEvent = false;
            return;
        }

        const mainScrollContainer = this.quadrantRefs[QuadrantType.MAIN].scrollContainer;
        if (mainScrollContainer == null) {
            return;
        }

        // invoke onScroll - which may read current scroll position - before
        // forcing a reflow with upcoming .scroll{Top,Left} setters.
        this.props.onScroll?.(event);

        // batch DOM reads here. note that onScroll events don't include deltas
        // like onWheel events do, so we have to read from the DOM directly.
        const nextScrollLeft = mainScrollContainer.scrollLeft;
        const nextScrollTop = mainScrollContainer.scrollTop;

        // with the "scroll" event, scroll offsets are updated prior to the
        // event's firing, so no explicit update needed.
        this.handleScrollOffsetChange("scrollLeft", nextScrollLeft);
        this.handleScrollOffsetChange("scrollTop", nextScrollTop);

        // sync less important view stuff when scrolling/wheeling stops.
        this.syncQuadrantViewsDebounced();
    };

    private handleWheel = (event: React.WheelEvent<HTMLElement>) => {
        // again, let the listener read the current scroll position before we
        // force a reflow by resizing or repositioning stuff.
        this.props.onScroll?.(event);

        // this helper performs DOM reads, so do them together before the writes below.
        const nextScrollLeft = this.getNextScrollOffset("horizontal", event.deltaX);
        const nextScrollTop = this.getNextScrollOffset("vertical", event.deltaY);

        // update this flag before updating the main quadrant scroll offsets,
        // since we need this set before onScroll fires.
        if (nextScrollLeft != null || nextScrollTop != null) {
            this.wasMainQuadrantScrollTriggeredByWheelEvent = true;
        }

        // manually update the affected quadrant's scroll position to make sure
        // it stays perfectly in sync with dependent quadrants in each frame.
        // note: these DOM writes are batched together after the reads above.
        if (nextScrollLeft !== undefined) {
            this.quadrantRefs[QuadrantType.MAIN].scrollContainer!.scrollLeft = nextScrollLeft;
            this.handleScrollOffsetChange("scrollLeft", nextScrollLeft);
        }
        if (nextScrollTop !== undefined) {
            this.quadrantRefs[QuadrantType.MAIN].scrollContainer!.scrollTop = nextScrollTop;
            this.handleScrollOffsetChange("scrollTop", nextScrollTop);
        }

        // sync less important view stuff when scrolling/wheeling stops.
        this.syncQuadrantViewsDebounced();
    };

    private getNextScrollOffset = (direction: "horizontal" | "vertical", delta: number) => {
        const { grid, isHorizontalScrollDisabled, isVerticalScrollDisabled } = this.props;

        const isHorizontal = direction === "horizontal";
        const scrollKey = isHorizontal ? "scrollLeft" : "scrollTop";
        const isScrollDisabled = isHorizontal ? isHorizontalScrollDisabled : isVerticalScrollDisabled;

        if (isScrollDisabled) {
            return undefined;
        }

        // measure client size on the first event of the current wheel gesture,
        // then grab cached values on successive events to eliminate DOM reads.
        // requires clearing the cached values in the debounced view-update at
        // the end of the wheel event.
        // ASSUMPTION: the client size won't change during the wheel event.
        let clientSize = isHorizontal
            ? this.cache.getScrollContainerClientWidth()
            : this.cache.getScrollContainerClientHeight();

        if (clientSize == null) {
            // should trigger only on the first scroll of the wheel gesture.
            // will save client width and height sizes in the cache.
            clientSize = this.updateScrollContainerClientSize(isHorizontal);
        }

        // By now, the client width and height will have been saved in cache, so
        // they can't be undefined anymore. Also, events can only happen after
        // mount, so we're guaranteed to have measured the header sizes in
        // syncQuadrantViews() by now too, as it's invoked on mount.
        const containerSize = isHorizontal
            ? this.cache.getScrollContainerClientWidth()! - this.cache.getRowHeaderWidth()
            : this.cache.getScrollContainerClientHeight()! - this.cache.getColumnHeaderHeight();

        const gridSize = isHorizontal ? grid.getWidth() : grid.getHeight();
        const maxScrollOffset = Math.max(0, gridSize - containerSize);
        const currScrollOffset = this.cache.getScrollOffset(scrollKey);
        const nextScrollOffset = CoreUtils.clamp(currScrollOffset + delta, 0, maxScrollOffset);

        return nextScrollOffset;
    };

    // Resizing
    // --------

    // Columns

    private handleColumnResizeGuideMain = (verticalGuides: number[] | null) => {
        this.invokeColumnResizeHandler(verticalGuides, QuadrantType.MAIN);
    };

    private handleColumnResizeGuideTop = (verticalGuides: number[] | null) => {
        this.invokeColumnResizeHandler(verticalGuides, QuadrantType.TOP);
    };

    private handleColumnResizeGuideLeft = (verticalGuides: number[] | null) => {
        this.invokeColumnResizeHandler(verticalGuides, QuadrantType.LEFT);
    };

    private handleColumnResizeGuideTopLeft = (verticalGuides: number[] | null) => {
        this.invokeColumnResizeHandler(verticalGuides, QuadrantType.TOP_LEFT);
    };

    private invokeColumnResizeHandler = (verticalGuides: number[] | null, quadrantType: QuadrantType) => {
        const adjustedGuides = this.adjustVerticalGuides(verticalGuides, quadrantType);
        this.props.handleColumnResizeGuide?.(adjustedGuides);
    };

    // Rows

    private handleRowResizeGuideMain = (horizontalGuides: number[] | null) => {
        this.invokeRowResizeHandler(horizontalGuides, QuadrantType.MAIN);
    };

    private handleRowResizeGuideTop = (horizontalGuides: number[] | null) => {
        this.invokeRowResizeHandler(horizontalGuides, QuadrantType.TOP);
    };

    private handleRowResizeGuideLeft = (horizontalGuides: number[] | null) => {
        this.invokeRowResizeHandler(horizontalGuides, QuadrantType.LEFT);
    };

    private handleRowResizeGuideTopLeft = (horizontalGuides: number[] | null) => {
        this.invokeRowResizeHandler(horizontalGuides, QuadrantType.TOP_LEFT);
    };

    private invokeRowResizeHandler = (horizontalGuides: number[] | null, quadrantType: QuadrantType) => {
        const adjustedGuides = this.adjustHorizontalGuides(horizontalGuides, quadrantType);
        this.props.handleRowResizeGuide?.(adjustedGuides);
    };

    // Reordering
    // ----------

    // Columns

    private handleColumnsReordering = (oldIndex: number, newIndex: number, length: number) => {
        const guideIndex = Utils.reorderedIndexToGuideIndex(oldIndex, newIndex, length);
        const leftOffset = this.props.grid.getCumulativeWidthBefore(guideIndex);
        const { numFrozenColumns = 0 } = this.props;
        const quadrantType = guideIndex <= numFrozenColumns ? QuadrantType.TOP_LEFT : QuadrantType.TOP;
        const verticalGuides = this.adjustVerticalGuides([leftOffset], quadrantType);
        this.props.handleColumnsReordering?.(verticalGuides);
    };

    // Rows

    private handleRowsReordering = (oldIndex: number, newIndex: number, length: number) => {
        const guideIndex = Utils.reorderedIndexToGuideIndex(oldIndex, newIndex, length);
        const topOffset = this.props.grid.getCumulativeHeightBefore(guideIndex);
        const { numFrozenRows = 0 } = this.props;
        const quadrantType = guideIndex <= numFrozenRows ? QuadrantType.TOP_LEFT : QuadrantType.LEFT;
        const horizontalGuides = this.adjustHorizontalGuides([topOffset], quadrantType);
        this.props.handleRowsReordering?.(horizontalGuides);
    };

    // Emitters
    // ========

    private emitRefs() {
        setRef(this.props.quadrantRef, this.quadrantRefs[QuadrantType.MAIN].quadrant!);
        setRef(this.props.rowHeaderRef, this.quadrantRefs[QuadrantType.MAIN].rowHeader!);
        setRef(this.props.columnHeaderRef, this.quadrantRefs[QuadrantType.MAIN].columnHeader!);
        setRef(this.props.scrollContainerRef, this.quadrantRefs[QuadrantType.MAIN].scrollContainer!);
    }

    // Size syncing
    // ============

    private syncQuadrantViewsDebounced = () => {
        const { viewSyncDelay } = this.props;
        if (viewSyncDelay! < 0) {
            // update synchronously
            this.syncQuadrantViews();
        } else {
            // update asynchronously after a debounced delay
            this.cancelPendingViewSync?.();
            this.cancelPendingViewSync = this.setTimeout(this.syncQuadrantViews, viewSyncDelay);
        }
    };

    private syncQuadrantViews = () => {
        const mainRefs = this.quadrantRefs[QuadrantType.MAIN];
        const mainScrollContainer = mainRefs.scrollContainer;

        //
        // Reads (batched to avoid DOM thrashing)
        //

        const rowHeaderWidth = this.measureDesiredRowHeaderWidth();
        const columnHeaderHeight = this.measureDesiredColumnHeaderHeight();

        const leftQuadrantGridWidth = this.getSecondaryQuadrantGridSize("width");
        const topQuadrantGridHeight = this.getSecondaryQuadrantGridSize("height");

        const leftQuadrantWidth = rowHeaderWidth + leftQuadrantGridWidth;
        const topQuadrantHeight = columnHeaderHeight + topQuadrantGridHeight;

        const rightScrollBarWidth = ScrollUtils.measureScrollBarThickness(mainScrollContainer!, "vertical");
        const bottomScrollBarHeight = ScrollUtils.measureScrollBarThickness(mainScrollContainer!, "horizontal");

        // if columnHeader is enabled, ensure neither of these measurements confusingly clamps to zero height.
        const adjustedColumnHeaderHeight = this.maybeIncreaseToMinColHeaderHeight(columnHeaderHeight);
        const adjustedTopQuadrantHeight = this.maybeIncreaseToMinColHeaderHeight(topQuadrantHeight);

        // Update cache: let's read now whatever values we might need later.
        // prevents unnecessary reflows in the future.
        this.cache.setRowHeaderWidth(rowHeaderWidth);
        this.cache.setColumnHeaderHeight(columnHeaderHeight);
        // ...however, we also clear the cached client size, so we can read it
        // again when a new scroll begins. not safe to assume this won't change.
        // TODO: maybe use the ResizeSensor?
        this.cache.setScrollContainerClientWidth(undefined);
        this.cache.setScrollContainerClientHeight(undefined);

        //
        // Writes (batched to avoid DOM thrashing)
        //

        // Quadrant-size sync'ing: make the quadrants precisely as big as they
        // need to be to fit their variable-sized headers and/or frozen areas.
        this.maybesSetQuadrantRowHeaderSizes(rowHeaderWidth);
        this.maybeSetQuadrantMenuElementSizes(rowHeaderWidth, adjustedColumnHeaderHeight);
        this.maybeSetQuadrantSizes(leftQuadrantWidth, adjustedTopQuadrantHeight);

        // Scrollbar clearance: tweak the quadrant bottom/right offsets to
        // reveal the MAIN-quadrant scrollbars if they're visible.
        this.maybeSetQuadrantPositionOffset(QuadrantType.TOP, "right", rightScrollBarWidth);
        this.maybeSetQuadrantPositionOffset(QuadrantType.LEFT, "bottom", bottomScrollBarHeight);

        // Scroll syncing: sync the scroll offsets of quadrants that may or may
        // not have been around prior to this update.
        this.maybeSetQuadrantScrollOffset(QuadrantType.LEFT, "scrollTop");
        this.maybeSetQuadrantScrollOffset(QuadrantType.TOP, "scrollLeft");
    };

    private maybeSetQuadrantSizes = (width: number, height: number) => {
        const leftWidth = Utils.clamp(width, this.props.enableRowHeader ? Grid.MIN_ROW_HEADER_WIDTH : 0);
        const topHeight = Utils.clamp(height, this.props.enableColumnHeader ? Grid.MIN_COLUMN_HEADER_HEIGHT : 0);
        this.maybesSetQuadrantSize(QuadrantType.LEFT, "width", leftWidth);
        this.maybesSetQuadrantSize(QuadrantType.TOP, "height", topHeight);
        this.maybesSetQuadrantSize(QuadrantType.TOP_LEFT, "width", leftWidth);
        this.maybesSetQuadrantSize(QuadrantType.TOP_LEFT, "height", topHeight);
    };

    private maybesSetQuadrantSize = (quadrantType: QuadrantType, dimension: "width" | "height", value: number) => {
        const { quadrant } = this.quadrantRefs[quadrantType];
        if (quadrant != null) {
            quadrant.style[dimension] = `${value}px`;
        }
    };

    private maybeSetQuadrantPositionOffset = (quadrantType: QuadrantType, side: "right" | "bottom", value: number) => {
        const { quadrant } = this.quadrantRefs[quadrantType];
        if (quadrant != null) {
            quadrant.style[side] = `${value}px`;
        }
    };

    private maybesSetQuadrantRowHeaderSizes = (width: number) => {
        const rowHeaderWidth = Utils.clamp(width, this.props.enableRowHeader ? Grid.MIN_ROW_HEADER_WIDTH : 0);
        this.maybeSetQuadrantRowHeaderSize(QuadrantType.MAIN, rowHeaderWidth);
        this.maybeSetQuadrantRowHeaderSize(QuadrantType.TOP, rowHeaderWidth);
        this.maybeSetQuadrantRowHeaderSize(QuadrantType.LEFT, rowHeaderWidth);
        this.maybeSetQuadrantRowHeaderSize(QuadrantType.TOP_LEFT, rowHeaderWidth);
    };

    private maybeSetQuadrantRowHeaderSize = (quadrantType: QuadrantType, width: number) => {
        const { rowHeader } = this.quadrantRefs[quadrantType];
        if (rowHeader != null) {
            rowHeader.style.width = `${width}px`;
        }
    };

    private maybeSetQuadrantMenuElementSizes = (width: number, height: number) => {
        const rowHeaderWidth = Utils.clamp(width, this.props.enableRowHeader ? Grid.MIN_ROW_HEADER_WIDTH : 0);
        this.maybeSetQuadrantMenuElementSize(QuadrantType.MAIN, rowHeaderWidth, height);
        this.maybeSetQuadrantMenuElementSize(QuadrantType.TOP, rowHeaderWidth, height);
        this.maybeSetQuadrantMenuElementSize(QuadrantType.LEFT, rowHeaderWidth, height);
        this.maybeSetQuadrantMenuElementSize(QuadrantType.TOP_LEFT, rowHeaderWidth, height);
    };

    private maybeSetQuadrantMenuElementSize = (quadrantType: QuadrantType, width: number, height: number) => {
        const { menu } = this.quadrantRefs[quadrantType];
        if (menu != null) {
            menu.style.width = `${width}px`;
            menu.style.height = `${height}px`;
        }
    };

    private maybeSetQuadrantScrollOffset = (
        quadrantType: QuadrantType,
        scrollKey: "scrollLeft" | "scrollTop",
        newOffset?: number,
    ) => {
        const { scrollContainer } = this.quadrantRefs[quadrantType];
        const scrollOffset = newOffset != null ? newOffset : this.cache.getScrollOffset(scrollKey);
        if (scrollContainer != null) {
            scrollContainer[scrollKey] = scrollOffset;
        }
    };

    private handleScrollOffsetChange = (scrollKey: "scrollLeft" | "scrollTop", offset: number) => {
        this.cache.setScrollOffset(scrollKey, offset);
        const dependentQuadrantType = scrollKey === "scrollLeft" ? QuadrantType.TOP : QuadrantType.LEFT;
        this.maybeSetQuadrantScrollOffset(dependentQuadrantType, scrollKey);
    };

    // this function is named 'update' instead of 'set', because a 'set'
    // function typically takes the new value as a parameter. we avoid that to
    // keep the isHorizontal logic tree contained within this function.
    private updateScrollContainerClientSize(isHorizontal: boolean) {
        const mainScrollContainer = this.quadrantRefs[QuadrantType.MAIN].scrollContainer;
        if (isHorizontal) {
            this.cache.setScrollContainerClientWidth(mainScrollContainer?.clientWidth);
            return this.cache.getScrollContainerClientWidth();
        } else {
            this.cache.setScrollContainerClientHeight(mainScrollContainer?.clientHeight);
            return this.cache.getScrollContainerClientHeight();
        }
    }

    private maybeIncreaseToMinColHeaderHeight(height: number) {
        if (this.props.enableColumnHeader) {
            return height <= QUADRANT_MIN_SIZE ? Grid.MIN_COLUMN_HEADER_HEIGHT : height;
        } else {
            return height;
        }
    }

    // Helpers
    // =======

    /** Returns true the cumulative width of all frozen columns in the grid changed. */
    private didFrozenColumnWidthsChange(prevProps: ITableQuadrantStackProps) {
        return (
            this.props.numFrozenColumns > 0 &&
            this.props.grid !== prevProps.grid &&
            this.props.grid.getCumulativeWidthAt(this.props.numFrozenColumns - 1) !==
                prevProps.grid.getCumulativeWidthAt(prevProps.numFrozenColumns - 1)
        );
    }

    /** Returns true the cumulative height of all frozen rows in the grid changed. */
    private didFrozenRowHeightsChange(prevProps: ITableQuadrantStackProps) {
        return (
            this.props.numFrozenRows > 0 &&
            this.props.grid !== prevProps.grid &&
            this.props.grid.getCumulativeHeightAt(this.props.numFrozenRows - 1) !==
                prevProps.grid.getCumulativeHeightAt(prevProps.numFrozenRows - 1)
        );
    }

    /**
     * Returns the width or height of *only the grid* in the secondary quadrants
     * (TOP, LEFT, TOP_LEFT), based on the number of frozen rows and columns.
     */
    private getSecondaryQuadrantGridSize(dimension: "width" | "height") {
        const { grid, numFrozenColumns, numFrozenRows } = this.props;

        const numFrozen = (dimension === "width" ? numFrozenColumns : numFrozenRows) ?? 0;
        const getterFn = dimension === "width" ? grid.getCumulativeWidthAt : grid.getCumulativeHeightAt;

        // both getter functions do O(1) lookups.
        return numFrozen > 0 ? getterFn(numFrozen - 1) : QUADRANT_MIN_SIZE;
    }

    /**
     * Measures the desired width of the row header based on its tallest
     * contents.
     */
    private measureDesiredRowHeaderWidth() {
        // the MAIN row header serves as the source of truth
        const mainRowHeader = this.quadrantRefs[QuadrantType.MAIN].rowHeader;

        if (mainRowHeader == null) {
            return 0;
        } else {
            // (alas, we must force a reflow to measure the row header's "desired" width)
            mainRowHeader.style.width = "auto";

            return Utils.clamp(mainRowHeader.clientWidth, Grid.MIN_ROW_HEADER_WIDTH);
        }
    }

    /**
     * Measures the desired height of the column header based on its tallest
     * contents.
     */
    private measureDesiredColumnHeaderHeight() {
        // unlike the row headers, the column headers are in a display-flex
        // layout and are not actually bound by any fixed `height` that we set,
        // so they'll grow freely to their necessary size. makes measuring easy!
        const mainColumnHeader = this.quadrantRefs[QuadrantType.MAIN].columnHeader;
        return mainColumnHeader == null ? 0 : Utils.clamp(mainColumnHeader.clientHeight, Grid.MIN_COLUMN_HEADER_HEIGHT);
    }

    private shouldRenderLeftQuadrants(props: ITableQuadrantStackProps = this.props) {
        const { enableRowHeader, numFrozenColumns } = props;
        return enableRowHeader || (numFrozenColumns != null && numFrozenColumns > 0);
    }

    // Resizing

    // should return empty array [] if we just finished resizing
    private adjustVerticalGuides(verticalGuides: number[] | null, quadrantType: QuadrantType) {
        const isFrozenQuadrant = quadrantType === QuadrantType.LEFT || quadrantType === QuadrantType.TOP_LEFT;
        const scrollAmount = isFrozenQuadrant ? 0 : this.cache.getScrollOffset("scrollLeft");
        const rowHeaderWidth = this.cache.getRowHeaderWidth();
        return verticalGuides?.map(verticalGuide => verticalGuide - scrollAmount + rowHeaderWidth) ?? [];
    }

    // should return empty array [] if we just finished resizing
    private adjustHorizontalGuides(horizontalGuides: number[] | null, quadrantType: QuadrantType) {
        const isFrozenQuadrant = quadrantType === QuadrantType.TOP || quadrantType === QuadrantType.TOP_LEFT;
        const scrollAmount = isFrozenQuadrant ? 0 : this.cache.getScrollOffset("scrollTop");
        const columnHeaderHeight = this.cache.getColumnHeaderHeight();
        return horizontalGuides?.map(horizontalGuide => horizontalGuide - scrollAmount + columnHeaderHeight) ?? [];
    }
}
