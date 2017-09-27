/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { AbstractComponent, IProps, Utils as CoreUtils } from "@blueprintjs/core";
import * as React from "react";

import * as Classes from "../common/classes";
import { Grid } from "../common/grid";
import * as ScrollUtils from "../common/internal/scrollUtils";
import { Utils } from "../common/utils";
import { QUADRANT_TYPES, QuadrantType, TableQuadrant } from "./tableQuadrant";
import { TableQuadrantStackCache } from "./tableQuadrantStackCache";

interface IQuadrantRefMap<T> {
    columnHeader?: T;
    menu?: T;
    quadrant?: T;
    rowHeader?: T;
    scrollContainer?: T;
}

type QuadrantRefHandler = (ref: HTMLElement) => void;
type IQuadrantRefs = IQuadrantRefMap<HTMLElement>;
type IQuadrantRefHandlers = IQuadrantRefMap<QuadrantRefHandler>;

export interface ITableQuadrantStackProps extends IProps {
    /**
     * A callback that receives a `ref` to the main quadrant's table-body element.
     */
    bodyRef?: React.Ref<HTMLElement>;

    /**
     * A callback that receives a `ref` to the main quadrant's column-header container.
     */
    columnHeaderRef?: (ref: HTMLElement) => void;

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
     * @default false
     */
    isHorizontalScrollDisabled?: boolean;

    /**
     * If `false`, hides the row headers and settings menu.
     * @default true
     */
    isRowHeaderShown?: boolean;

    /**
     * Whether vertical scrolling is currently disabled.
     * @default false
     */
    isVerticalScrollDisabled?: boolean;

    /**
     * The number of frozen columns.
     */
    numFrozenColumns?: number;

    /**
     * The number of frozen rows.
     */
    numFrozenRows?: number;

    /**
     * An optional callback invoked the quadrants are scrolled.
     */
    onScroll?: React.EventHandler<React.SyntheticEvent<HTMLElement>>;

    /**
     * A callback that receives a `ref` to the main-quadrant element.
     */
    quadrantRef?: (ref: HTMLElement) => void;

    /**
     * A callback that renders either all of or just frozen sections of the table body.
     */
    renderBody: (
        quadrantType: QuadrantType,
        showFrozenRowsOnly?: boolean,
        showFrozenColumnsOnly?: boolean,
    ) => JSX.Element;

    /**
     * A callback that renders either all of or just the frozen section of the column header.
     */
    renderColumnHeader?: (
        refHandler: (ref: HTMLElement) => void,
        resizeHandler: (verticalGuides: number[]) => void,
        reorderingHandler: (oldIndex: number, newIndex: number, length: number) => void,
        showFrozenColumnsOnly?: boolean,
    ) => JSX.Element;

    /**
     * A callback that renders the table menu (the rectangle in the top-left corner).
     */
    renderMenu?: (refHandler: (ref: HTMLElement) => void) => JSX.Element;

    /**
     * A callback that renders either all of or just the frozen section of the row header.
     */
    renderRowHeader?: (
        refHandler: (ref: HTMLElement) => void,
        resizeHandler: (verticalGuides: number[]) => void,
        reorderingHandler: (oldIndex: number, newIndex: number, length: number) => void,
        showFrozenRowsOnly?: boolean,
    ) => JSX.Element;

    /**
     * A callback that receives a `ref` to the main quadrant's row-header container.
     */
    rowHeaderRef?: (ref: HTMLElement) => void;

    /**
     * A callback that receives a `ref` to the main quadrant's scroll-container element.
     */
    scrollContainerRef?: (ref: HTMLElement) => void;

    /**
     * Whether "scroll" and "wheel" events should be throttled using
     * requestAnimationFrame. Disabling this can be useful for unit testing,
     * because tests can then be synchronous.
     * @default true
     */
    throttleScrolling?: boolean;

    /**
     * The amount of time in milliseconds the component should wait before
     * synchronizing quadrant sizes and offsets after the user has stopped
     * scrolling. If this value is negative, the updates will happen
     * synchronously (this is helpful for unit testing).
     * @default 500
     */
    viewSyncDelay?: number;
}

// the debounce delay for updating the view on scroll. elements will be resized
// and rejiggered once scroll has ceased for at least this long, but not before.
const DEFAULT_VIEW_SYNC_DELAY = 500;

export class TableQuadrantStack extends AbstractComponent<ITableQuadrantStackProps, {}> {
    // Static variables
    // ================

    // we want the user to explicitly pass a quadrantType. define defaultProps as a Partial to avoid
    // declaring that and other required props here.
    public static defaultProps: Partial<ITableQuadrantStackProps> = {
        isHorizontalScrollDisabled: false,
        isRowHeaderShown: true,
        isVerticalScrollDisabled: false,
        throttleScrolling: true,
        viewSyncDelay: DEFAULT_VIEW_SYNC_DELAY,
    };

    // Instance variables
    // ==================

    private quadrantRefs: { [qType: number]: IQuadrantRefs } = {
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
    private wasMainQuadrantScrollChangedFromOtherOnWheelCallback = false;

    // keep throttled event callbacks around as instance variables, so we don't
    // have to continually reinstantiate them.
    private throttledHandleMainQuadrantScroll: (event: React.UIEvent<HTMLElement>) => any;
    private throttledHandleWheel: (event: React.WheelEvent<HTMLElement>) => any;

    // the interval instance that we maintain to enable debouncing of view
    // updates on scroll
    private debouncedViewSyncInterval: number;

    private cache: TableQuadrantStackCache;

    // Public
    // ======

    public constructor(props: ITableQuadrantStackProps, context?: any) {
        super(props, context);

        // a few points here:
        // - we throttle onScroll/onWheel callbacks to making scrolling look more fluid.
        // - we declare throttled functions on the component instance, since they're stateful.
        // - "wheel"-ing triggers super-fluid onScroll behavior by default, but relying on that
        //   causes sync'd quadrants to lag behind. thus, we preventDefault for onWheel and instead
        //   manually update all relevant quadrants using event.delta{X,Y} later, in the callback.
        //   this keeps every sync'd quadrant visually aligned in each animation frame.
        this.throttledHandleMainQuadrantScroll = CoreUtils.throttleReactEventCallback(this.handleMainQuadrantScroll);
        this.throttledHandleWheel = CoreUtils.throttleReactEventCallback(this.handleWheel, { preventDefault: true });

        this.cache = new TableQuadrantStackCache();
    }

    /**
     * Scroll the main quadrant to the specified scroll offset, keeping all other quadrants in sync.
     */
    public scrollToPosition(scrollLeft: number, scrollTop: number) {
        const { scrollContainer } = this.quadrantRefs[QuadrantType.MAIN];

        this.wasMainQuadrantScrollChangedFromOtherOnWheelCallback = false;

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
        // sync'ing quadrant views triggers expensive reflows, so we only call
        // it when layout-affecting props change.
        if (
            this.props.numFrozenColumns !== prevProps.numFrozenColumns ||
            this.props.numFrozenRows !== prevProps.numFrozenRows ||
            this.props.isRowHeaderShown !== prevProps.isRowHeaderShown
        ) {
            this.emitRefs();
            this.syncQuadrantViews();
        }
    }

    public render() {
        const { grid, isRowHeaderShown, renderBody, throttleScrolling } = this.props;

        const onMainQuadrantScroll = throttleScrolling
            ? this.throttledHandleMainQuadrantScroll
            : this.handleMainQuadrantScroll;
        const onWheel = throttleScrolling ? this.throttledHandleWheel : this.handleWheel;

        return (
            <div className={Classes.TABLE_QUADRANT_STACK}>
                <TableQuadrant
                    bodyRef={this.props.bodyRef}
                    grid={grid}
                    isRowHeaderShown={isRowHeaderShown}
                    onScroll={onMainQuadrantScroll}
                    onWheel={onWheel}
                    quadrantRef={this.quadrantRefHandlers[QuadrantType.MAIN].quadrant}
                    quadrantType={QuadrantType.MAIN}
                    renderBody={renderBody}
                    renderColumnHeader={this.renderMainQuadrantColumnHeader}
                    renderMenu={this.renderMainQuadrantMenu}
                    renderRowHeader={this.renderMainQuadrantRowHeader}
                    scrollContainerRef={this.quadrantRefHandlers[QuadrantType.MAIN].scrollContainer}
                />
                <TableQuadrant
                    grid={grid}
                    isRowHeaderShown={isRowHeaderShown}
                    onWheel={onWheel}
                    quadrantRef={this.quadrantRefHandlers[QuadrantType.TOP].quadrant}
                    quadrantType={QuadrantType.TOP}
                    renderBody={renderBody}
                    renderColumnHeader={this.renderTopQuadrantColumnHeader}
                    renderMenu={this.renderTopQuadrantMenu}
                    renderRowHeader={this.renderTopQuadrantRowHeader}
                    scrollContainerRef={this.quadrantRefHandlers[QuadrantType.TOP].scrollContainer}
                />
                <TableQuadrant
                    grid={grid}
                    isRowHeaderShown={isRowHeaderShown}
                    onWheel={onWheel}
                    quadrantRef={this.quadrantRefHandlers[QuadrantType.LEFT].quadrant}
                    quadrantType={QuadrantType.LEFT}
                    renderBody={renderBody}
                    renderColumnHeader={this.renderLeftQuadrantColumnHeader}
                    renderMenu={this.renderLeftQuadrantMenu}
                    renderRowHeader={this.renderLeftQuadrantRowHeader}
                    scrollContainerRef={this.quadrantRefHandlers[QuadrantType.LEFT].scrollContainer}
                />
                <TableQuadrant
                    grid={grid}
                    isRowHeaderShown={isRowHeaderShown}
                    onWheel={onWheel}
                    quadrantRef={this.quadrantRefHandlers[QuadrantType.TOP_LEFT].quadrant}
                    quadrantType={QuadrantType.TOP_LEFT}
                    renderBody={renderBody}
                    renderColumnHeader={this.renderTopLeftQuadrantColumnHeader}
                    renderMenu={this.renderTopLeftQuadrantMenu}
                    renderRowHeader={this.renderTopLeftQuadrantRowHeader}
                    scrollContainerRef={this.quadrantRefHandlers[QuadrantType.TOP_LEFT].scrollContainer}
                />
            </div>
        );
    }

    // Ref handlers
    // ============

    private generateQuadrantRefHandlers(quadrantType: QuadrantType): IQuadrantRefHandlers {
        const reducer = (agg: IQuadrantRefHandlers, key: keyof IQuadrantRefHandlers) => {
            agg[key] = (ref: HTMLElement) => (this.quadrantRefs[quadrantType][key] = ref);
            return agg;
        };
        return ["columnHeader", "menu", "quadrant", "rowHeader", "scrollContainer"].reduce(reducer, {});
    }

    // Quadrant-specific renderers
    // ===========================

    // Menu

    private renderMainQuadrantMenu = () => {
        return CoreUtils.safeInvoke(this.props.renderMenu, this.quadrantRefHandlers[QuadrantType.MAIN].menu);
    };

    private renderTopQuadrantMenu = () => {
        return CoreUtils.safeInvoke(this.props.renderMenu, this.quadrantRefHandlers[QuadrantType.TOP].menu);
    };

    private renderLeftQuadrantMenu = () => {
        return CoreUtils.safeInvoke(this.props.renderMenu, this.quadrantRefHandlers[QuadrantType.LEFT].menu);
    };

    private renderTopLeftQuadrantMenu = () => {
        return CoreUtils.safeInvoke(this.props.renderMenu, this.quadrantRefHandlers[QuadrantType.TOP_LEFT].menu);
    };

    // Column header

    private renderMainQuadrantColumnHeader = (showFrozenColumnsOnly: boolean) => {
        const refHandler = this.quadrantRefHandlers[QuadrantType.MAIN].columnHeader;
        const resizeHandler = this.handleColumnResizeGuideMain;
        const reorderingHandler = this.handleColumnsReordering;
        return CoreUtils.safeInvoke(
            this.props.renderColumnHeader,
            refHandler,
            resizeHandler,
            reorderingHandler,
            showFrozenColumnsOnly,
        );
    };

    private renderTopQuadrantColumnHeader = (showFrozenColumnsOnly: boolean) => {
        const refHandler = this.quadrantRefHandlers[QuadrantType.TOP].columnHeader;
        const resizeHandler = this.handleColumnResizeGuideTop;
        const reorderingHandler = this.handleColumnsReordering;
        return CoreUtils.safeInvoke(
            this.props.renderColumnHeader,
            refHandler,
            resizeHandler,
            reorderingHandler,
            showFrozenColumnsOnly,
        );
    };

    private renderLeftQuadrantColumnHeader = (showFrozenColumnsOnly: boolean) => {
        const refHandler = this.quadrantRefHandlers[QuadrantType.LEFT].columnHeader;
        const resizeHandler = this.handleColumnResizeGuideLeft;
        const reorderingHandler = this.handleColumnsReordering;
        return CoreUtils.safeInvoke(
            this.props.renderColumnHeader,
            refHandler,
            resizeHandler,
            reorderingHandler,
            showFrozenColumnsOnly,
        );
    };

    private renderTopLeftQuadrantColumnHeader = (showFrozenColumnsOnly: boolean) => {
        const refHandler = this.quadrantRefHandlers[QuadrantType.TOP_LEFT].columnHeader;
        const resizeHandler = this.handleColumnResizeGuideTopLeft;
        const reorderingHandler = this.handleColumnsReordering;
        return CoreUtils.safeInvoke(
            this.props.renderColumnHeader,
            refHandler,
            resizeHandler,
            reorderingHandler,
            showFrozenColumnsOnly,
        );
    };

    // Row header

    private renderMainQuadrantRowHeader = (showFrozenRowsOnly: boolean) => {
        const refHandler = this.quadrantRefHandlers[QuadrantType.MAIN].rowHeader;
        const resizeHandler = this.handleRowResizeGuideMain;
        const reorderingHandler = this.handleRowsReordering;
        return CoreUtils.safeInvoke(
            this.props.renderRowHeader,
            refHandler,
            resizeHandler,
            reorderingHandler,
            showFrozenRowsOnly,
        );
    };

    private renderTopQuadrantRowHeader = (showFrozenRowsOnly: boolean) => {
        const refHandler = this.quadrantRefHandlers[QuadrantType.TOP].rowHeader;
        const resizeHandler = this.handleRowResizeGuideTop;
        const reorderingHandler = this.handleRowsReordering;
        return CoreUtils.safeInvoke(
            this.props.renderRowHeader,
            refHandler,
            resizeHandler,
            reorderingHandler,
            showFrozenRowsOnly,
        );
    };

    private renderLeftQuadrantRowHeader = (showFrozenRowsOnly: boolean) => {
        const refHandler = this.quadrantRefHandlers[QuadrantType.LEFT].rowHeader;
        const resizeHandler = this.handleRowResizeGuideLeft;
        const reorderingHandler = this.handleRowsReordering;
        return CoreUtils.safeInvoke(
            this.props.renderRowHeader,
            refHandler,
            resizeHandler,
            reorderingHandler,
            showFrozenRowsOnly,
        );
    };

    private renderTopLeftQuadrantRowHeader = (showFrozenRowsOnly: boolean) => {
        const refHandler = this.quadrantRefHandlers[QuadrantType.TOP_LEFT].rowHeader;
        const resizeHandler = this.handleRowResizeGuideTopLeft;
        const reorderingHandler = this.handleRowsReordering;
        return CoreUtils.safeInvoke(
            this.props.renderRowHeader,
            refHandler,
            resizeHandler,
            reorderingHandler,
            showFrozenRowsOnly,
        );
    };

    // Event handlers
    // ==============

    // Scrolling
    // ---------

    // use the more generic "scroll" event for the main quadrant, which captures both click+dragging
    // on the scrollbar and trackpad/mousewheel gestures
    private handleMainQuadrantScroll = (event: React.UIEvent<HTMLElement>) => {
        if (this.wasMainQuadrantScrollChangedFromOtherOnWheelCallback) {
            this.wasMainQuadrantScrollChangedFromOtherOnWheelCallback = false;
            return;
        }

        // invoke onScroll - which may read current scroll position - before
        // forcing a reflow with upcoming .scroll{Top,Left} setters.
        CoreUtils.safeInvoke(this.props.onScroll, event);

        const mainScrollContainer = this.quadrantRefs[QuadrantType.MAIN].scrollContainer;
        const nextScrollTop = mainScrollContainer.scrollTop;
        const nextScrollLeft = mainScrollContainer.scrollLeft;

        this.quadrantRefs[QuadrantType.LEFT].scrollContainer.scrollTop = nextScrollTop;
        this.quadrantRefs[QuadrantType.TOP].scrollContainer.scrollLeft = nextScrollLeft;

        // update the cache immediately
        this.cache.setQuadrantScrollOffset(QuadrantType.LEFT, "scrollTop", nextScrollTop);
        this.cache.setQuadrantScrollOffset(QuadrantType.TOP, "scrollLeft", nextScrollLeft);

        // syncs the quadrants only after scrolling has stopped for a short time
        this.syncQuadrantViewsDebounced();
    };

    // recall that we've already invoked event.preventDefault() when defining the throttled versions
    // of these onWheel callbacks, so now we need to manually update the affected quadrant's scroll
    // position too.

    private handleWheel = (event: React.WheelEvent<HTMLElement>) => {
        // again, let the listener read the current scroll position before we
        // force a reflow by resizing or repositioning stuff.
        CoreUtils.safeInvoke(this.props.onScroll, event);

        this.handleDirectionalWheel("horizontal", event.deltaX, QuadrantType.MAIN, [QuadrantType.TOP]);
        this.handleDirectionalWheel("vertical", event.deltaY, QuadrantType.MAIN, [QuadrantType.LEFT]);

        this.syncQuadrantViewsDebounced();
    };

    private handleDirectionalWheel = (
        direction: "horizontal" | "vertical",
        delta: number,
        quadrantType: QuadrantType,
        quadrantTypesToSync: QuadrantType[],
    ) => {
        const isHorizontal = direction === "horizontal";

        const scrollKey = isHorizontal ? "scrollLeft" : "scrollTop";
        const isScrollDisabled = isHorizontal
            ? this.props.isHorizontalScrollDisabled
            : this.props.isVerticalScrollDisabled;

        if (!isScrollDisabled) {
            this.wasMainQuadrantScrollChangedFromOtherOnWheelCallback = true;

            const nextScrollOffset = this.quadrantRefs[quadrantType].scrollContainer[scrollKey] + delta;

            this.quadrantRefs[quadrantType].scrollContainer[scrollKey] = nextScrollOffset;
            this.cache.setQuadrantScrollOffset(quadrantType, scrollKey, nextScrollOffset);

            // sync the corresponding scroll position of all dependent quadrants
            quadrantTypesToSync.forEach(quadrantTypeToSync => {
                this.quadrantRefs[quadrantTypeToSync].scrollContainer[scrollKey] = nextScrollOffset;
                this.cache.setQuadrantScrollOffset(quadrantTypeToSync, scrollKey, nextScrollOffset);
            });
        }
    };

    // Resizing
    // --------

    // Columns

    private handleColumnResizeGuideMain = (verticalGuides: number[]) => {
        this.invokeColumnResizeHandler(verticalGuides, QuadrantType.MAIN);
    };

    private handleColumnResizeGuideTop = (verticalGuides: number[]) => {
        this.invokeColumnResizeHandler(verticalGuides, QuadrantType.TOP);
    };

    private handleColumnResizeGuideLeft = (verticalGuides: number[]) => {
        this.invokeColumnResizeHandler(verticalGuides, QuadrantType.LEFT);
    };

    private handleColumnResizeGuideTopLeft = (verticalGuides: number[]) => {
        this.invokeColumnResizeHandler(verticalGuides, QuadrantType.TOP_LEFT);
    };

    private invokeColumnResizeHandler = (verticalGuides: number[], quadrantType: QuadrantType) => {
        const adjustedGuides = this.adjustVerticalGuides(verticalGuides, quadrantType);
        CoreUtils.safeInvoke(this.props.handleColumnResizeGuide, adjustedGuides);
    };

    // Rows

    private handleRowResizeGuideMain = (verticalGuides: number[]) => {
        this.invokeRowResizeHandler(verticalGuides, QuadrantType.MAIN);
    };

    private handleRowResizeGuideTop = (verticalGuides: number[]) => {
        this.invokeRowResizeHandler(verticalGuides, QuadrantType.TOP);
    };

    private handleRowResizeGuideLeft = (verticalGuides: number[]) => {
        this.invokeRowResizeHandler(verticalGuides, QuadrantType.LEFT);
    };

    private handleRowResizeGuideTopLeft = (verticalGuides: number[]) => {
        this.invokeRowResizeHandler(verticalGuides, QuadrantType.TOP_LEFT);
    };

    private invokeRowResizeHandler = (verticalGuides: number[], quadrantType: QuadrantType) => {
        const adjustedGuides = this.adjustHorizontalGuides(verticalGuides, quadrantType);
        CoreUtils.safeInvoke(this.props.handleRowResizeGuide, adjustedGuides);
    };

    // Reordering
    // ----------

    // Columns

    private handleColumnsReordering = (oldIndex: number, newIndex: number, length: number) => {
        const guideIndex = Utils.reorderedIndexToGuideIndex(oldIndex, newIndex, length);
        const leftOffset = this.props.grid.getCumulativeWidthBefore(guideIndex);
        const quadrantType = guideIndex <= this.props.numFrozenColumns ? QuadrantType.TOP_LEFT : QuadrantType.TOP;
        const verticalGuides = this.adjustVerticalGuides([leftOffset], quadrantType);
        CoreUtils.safeInvoke(this.props.handleColumnsReordering, verticalGuides);
    };

    // Rows

    private handleRowsReordering = (oldIndex: number, newIndex: number, length: number) => {
        const guideIndex = Utils.reorderedIndexToGuideIndex(oldIndex, newIndex, length);
        const topOffset = this.props.grid.getCumulativeHeightBefore(guideIndex);
        const quadrantType = guideIndex <= this.props.numFrozenRows ? QuadrantType.TOP_LEFT : QuadrantType.LEFT;
        const horizontalGuides = this.adjustHorizontalGuides([topOffset], quadrantType);
        CoreUtils.safeInvoke(this.props.handleRowsReordering, horizontalGuides);
    };

    // Emitters
    // ========

    private emitRefs() {
        CoreUtils.safeInvoke(this.props.quadrantRef, this.quadrantRefs[QuadrantType.MAIN].quadrant);
        CoreUtils.safeInvoke(this.props.rowHeaderRef, this.quadrantRefs[QuadrantType.MAIN].rowHeader);
        CoreUtils.safeInvoke(this.props.columnHeaderRef, this.quadrantRefs[QuadrantType.MAIN].columnHeader);
        CoreUtils.safeInvoke(this.props.scrollContainerRef, this.quadrantRefs[QuadrantType.MAIN].scrollContainer);
    }

    // Size syncing
    // ============

    private syncQuadrantViewsDebounced = () => {
        const { viewSyncDelay } = this.props;
        if (viewSyncDelay < 0) {
            // update synchronously
            this.syncQuadrantViews();
        } else {
            // update asynchronously after a debounced delay
            clearInterval(this.debouncedViewSyncInterval);
            this.debouncedViewSyncInterval = setTimeout(this.syncQuadrantViews, viewSyncDelay);
        }
    };

    private syncQuadrantViews = () => {
        const mainRefs = this.quadrantRefs[QuadrantType.MAIN];
        const mainColumnHeader = mainRefs.columnHeader;
        const mainScrollContainer = mainRefs.scrollContainer;

        //
        // Reads (batched to avoid DOM thrashing)
        //

        // Row-header resizing: resize the row header to be as wide as its
        // widest contents require it to be.
        const rowHeaderWidth = this.measureDesiredRowHeaderWidth();

        // Menu-element resizing: keep the menu element's borders flush with
        // thsoe of the the row and column headers.
        const columnHeaderHeight = mainColumnHeader == null ? 0 : mainColumnHeader.clientHeight;
        const nextMenuElementWidth = rowHeaderWidth;
        const nextMenuElementHeight = columnHeaderHeight;

        // Quadrant-size sync'ing: make the quadrants precisely as big as they
        // need to be to fit their variable-sized headers and/or frozen areas.
        const leftQuadrantGridWidth = this.getSecondaryQuadrantSize("width");
        const topQuadrantGridHeight = this.getSecondaryQuadrantSize("height");
        const nextLeftQuadrantWidth = rowHeaderWidth + leftQuadrantGridWidth;
        const nextTopQuadrantHeight = columnHeaderHeight + topQuadrantGridHeight;

        // Scrollbar clearance: tweak the quadrant bottom/right offsets to
        // reveal the MAIN-quadrant scrollbars if they're visible.
        const rightScrollBarWidth = ScrollUtils.measureScrollBarThickness(mainScrollContainer, "vertical");
        const bottomScrollBarHeight = ScrollUtils.measureScrollBarThickness(mainScrollContainer, "horizontal");

        // Update cache: let's read now whatever values we might need later.
        // prevents unnecessary reflows in the future.
        this.cache.setRowHeaderWidth(rowHeaderWidth);
        this.cache.setColumnHeaderHeight(columnHeaderHeight);
        QUADRANT_TYPES.forEach(quadrantType => {
            const { scrollContainer } = this.quadrantRefs[quadrantType];
            this.cache.setQuadrantScrollOffset(quadrantType, "scrollLeft", scrollContainer.scrollLeft);
            this.cache.setQuadrantScrollOffset(quadrantType, "scrollTop", scrollContainer.scrollTop);
        });

        //
        // Writes (batched to avoid DOM thrashing)
        //

        this.setQuadrantRowHeaderSizes(rowHeaderWidth);
        this.setQuadrantMenuElementSizes(nextMenuElementWidth, nextMenuElementHeight);
        this.setQuadrantSize(QuadrantType.LEFT, "width", nextLeftQuadrantWidth);
        this.setQuadrantSize(QuadrantType.TOP, "height", nextTopQuadrantHeight);
        this.setQuadrantSize(QuadrantType.TOP_LEFT, "width", nextLeftQuadrantWidth);
        this.setQuadrantSize(QuadrantType.TOP_LEFT, "height", nextTopQuadrantHeight);
        this.setQuadrantOffset(QuadrantType.TOP, "right", rightScrollBarWidth);
        this.setQuadrantOffset(QuadrantType.LEFT, "bottom", bottomScrollBarHeight);
    };

    private setQuadrantSize = (quadrantType: QuadrantType, dimension: "width" | "height", value: number) => {
        this.quadrantRefs[quadrantType].quadrant.style[dimension] = `${value}px`;
    };

    private setQuadrantOffset = (quadrantType: QuadrantType, side: "right" | "bottom", value: number) => {
        this.quadrantRefs[quadrantType].quadrant.style[side] = `${value}px`;
    };

    private setQuadrantRowHeaderSizes = (width: number) => {
        const mainRowHeader = this.quadrantRefs[QuadrantType.MAIN].rowHeader;
        if (mainRowHeader == null) {
            return;
        }

        const widthString = `${width}px`;
        mainRowHeader.style.width = widthString;
        this.quadrantRefs[QuadrantType.TOP].rowHeader.style.width = widthString;
        this.quadrantRefs[QuadrantType.LEFT].rowHeader.style.width = widthString;
        this.quadrantRefs[QuadrantType.TOP_LEFT].rowHeader.style.width = widthString;
    };

    private setQuadrantMenuElementSizes = (width: number, height: number) => {
        this.setQuadrantMenuElementSize(QuadrantType.MAIN, width, height);
        this.setQuadrantMenuElementSize(QuadrantType.TOP, width, height);
        this.setQuadrantMenuElementSize(QuadrantType.LEFT, width, height);
        this.setQuadrantMenuElementSize(QuadrantType.TOP_LEFT, width, height);
    };

    private setQuadrantMenuElementSize = (quadrantType: QuadrantType, width: number, height: number) => {
        const quadrantMenu = this.quadrantRefs[quadrantType].menu;
        if (quadrantMenu == null) {
            return;
        }
        quadrantMenu.style.width = `${width}px`;
        quadrantMenu.style.height = `${height}px`;
    };

    // Helpers
    // =======

    /**
     * Returns the width or height of *only the grid* in the secondary quadrants
     * (TOP, LEFT, TOP_LEFT), based on the number of frozen rows and columns.
     */
    private getSecondaryQuadrantSize(dimension: "width" | "height") {
        const { grid, numFrozenColumns, numFrozenRows } = this.props;

        const numFrozen = dimension === "width" ? numFrozenColumns : numFrozenRows;
        const getterFn = dimension === "width" ? grid.getCumulativeWidthAt : grid.getCumulativeHeightAt;

        // if there are no frozen rows or columns, we still want the quadrant to be 1px bigger to
        // reveal the header border.
        const BORDER_WIDTH_CORRECTION = 1;

        // both getter functions do O(1) lookups.
        return numFrozen > 0 ? getterFn(numFrozen - 1) : BORDER_WIDTH_CORRECTION;
    }

    private measureDesiredRowHeaderWidth() {
        // the MAIN row header serves as the source of truth
        const mainRowHeader = this.quadrantRefs[QuadrantType.MAIN].rowHeader;

        if (mainRowHeader == null) {
            return 0;
        } else {
            // (alas, we must force a reflow to measure the row header's "desired" width)
            mainRowHeader.style.width = "auto";

            const desiredRowHeaderWidth = mainRowHeader.clientWidth;
            return desiredRowHeaderWidth;
        }
    }

    // Resizing

    private adjustVerticalGuides(verticalGuides: number[], quadrantType: QuadrantType) {
        const scrollAmount = this.cache.getQuadrantScrollOffset(quadrantType, "scrollLeft");
        const rowHeaderWidth = this.cache.getRowHeaderWidth();

        const adjustedVerticalGuides =
            verticalGuides != null
                ? verticalGuides.map(verticalGuide => verticalGuide - scrollAmount + rowHeaderWidth)
                : verticalGuides;

        return adjustedVerticalGuides;
    }

    private adjustHorizontalGuides(horizontalGuides: number[], quadrantType: QuadrantType) {
        const scrollAmount = this.cache.getQuadrantScrollOffset(quadrantType, "scrollTop");
        const columnHeaderHeight = this.cache.getColumnHeaderHeight();

        const adjustedHorizontalGuides =
            horizontalGuides != null
                ? horizontalGuides.map(horizontalGuide => horizontalGuide - scrollAmount + columnHeaderHeight)
                : horizontalGuides;

        return adjustedHorizontalGuides;
    }
}
