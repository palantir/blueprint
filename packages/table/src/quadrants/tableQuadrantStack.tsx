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
import { QuadrantType, TableQuadrant } from "./tableQuadrant";

interface IQuadrantRefMap<T> {
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
    renderColumnHeader?: (showFrozenColumnsOnly?: boolean) => JSX.Element;

    /**
     * A callback that renders the table menu (the rectangle in the top-left corner).
     */
    renderMenu?: (refHandler: (ref: HTMLElement) => void) => JSX.Element;

    /**
     * A callback that renders either all of or just the frozen section of the row header.
     */
    renderRowHeader?: (refHandler: (ref: HTMLElement) => void, showFrozenRowsOnly?: boolean) => JSX.Element;

    /**
     * A callback that receives a `ref` to the main quadrant's row-header container.
     */
    rowHeaderRef?: (ref: HTMLElement) => void;

    /**
     * A callback that receives a `ref` to the main quadrant's scroll-container element.
     */
    scrollContainerRef?: (ref: HTMLElement) => void;
}

export class TableQuadrantStack extends AbstractComponent<ITableQuadrantStackProps, {}> {
    // we want the user to explicitly pass a quadrantType. define defaultProps as a Partial to avoid
    // declaring that and other required props here.
    public static defaultProps: Partial<ITableQuadrantStackProps> & object = {
        isHorizontalScrollDisabled: false,
        isRowHeaderShown: true,
        isVerticalScrollDisabled: false,
    };

    private quadrantRefs = {
        [QuadrantType.MAIN]: {} as IQuadrantRefs,
        [QuadrantType.TOP]: {} as IQuadrantRefs,
        [QuadrantType.LEFT]: {} as IQuadrantRefs,
        [QuadrantType.TOP_LEFT]: {} as IQuadrantRefs,
    };

    private quadrantRefHandlers = {
        [QuadrantType.MAIN]: this.generateQuadrantRefHandlers(QuadrantType.MAIN),
        [QuadrantType.TOP]: this.generateQuadrantRefHandlers(QuadrantType.TOP),
        [QuadrantType.LEFT]: this.generateQuadrantRefHandlers(QuadrantType.LEFT),
        [QuadrantType.TOP_LEFT]: this.generateQuadrantRefHandlers(QuadrantType.TOP_LEFT),
    };

    private wasMainQuadrantScrollChangedFromOtherOnWheelCallback = false;

    // Throttled event callbacks
    // =========================

    private throttledHandleMainQuadrantWheel: (event: React.WheelEvent<HTMLElement>) => any;
    private throttledHandleMainQuadrantScroll: (event: React.UIEvent<HTMLElement>) => any;
    private throttledHandleTopQuadrantWheel: (event: React.WheelEvent<HTMLElement>) => any;
    private throttledHandleLeftQuadrantWheel: (event: React.WheelEvent<HTMLElement>) => any;
    private throttledHandleTopLeftQuadrantWheel: (event: React.WheelEvent<HTMLElement>) => any;

    public constructor(props: ITableQuadrantStackProps, context?: any) {
        super(props, context);

        // declare throttled functions on each component instance, since they're stateful
        this.throttledHandleMainQuadrantWheel =
            CoreUtils.throttleReactEventCallback(this.handleMainQuadrantWheel, /* preventDefault */ true);
        this.throttledHandleMainQuadrantScroll = CoreUtils.throttleReactEventCallback(this.handleMainQuadrantScroll);
        this.throttledHandleTopQuadrantWheel =
            CoreUtils.throttleReactEventCallback(this.handleTopQuadrantWheel, /* preventDefault */ true);
        this.throttledHandleLeftQuadrantWheel =
            CoreUtils.throttleReactEventCallback(this.handleLeftQuadrantWheel, /* preventDefault */ true);
        this.throttledHandleTopLeftQuadrantWheel =
            CoreUtils.throttleReactEventCallback(this.handleTopLeftQuadrantWheel);
    }

    public componentDidMount() {
        CoreUtils.safeInvoke(this.props.columnHeaderRef, this.findColumnHeader(QuadrantType.MAIN));
        CoreUtils.safeInvoke(this.props.rowHeaderRef, this.findRowHeader(QuadrantType.MAIN));
        this.syncQuadrantSizes();
        this.syncQuadrantMenuElementWidths();
    }

    public componentDidUpdate() {
        CoreUtils.safeInvoke(this.props.columnHeaderRef, this.findColumnHeader(QuadrantType.MAIN));
        CoreUtils.safeInvoke(this.props.rowHeaderRef, this.findRowHeader(QuadrantType.MAIN));
        this.syncQuadrantSizes();
        this.syncQuadrantMenuElementWidths();
    }

    public render() {
        const {
            grid,
            isRowHeaderShown,
            renderBody,
            renderColumnHeader,
        } = this.props;

        return (
            <div>
                <TableQuadrant
                    bodyRef={this.props.bodyRef}
                    grid={grid}
                    isRowHeaderShown={isRowHeaderShown}
                    onScroll={this.throttledHandleMainQuadrantScroll}
                    onWheel={this.throttledHandleMainQuadrantWheel}
                    quadrantRef={this.quadrantRefHandlers[QuadrantType.MAIN].quadrant}
                    quadrantType={QuadrantType.MAIN}
                    renderBody={renderBody}
                    renderColumnHeader={renderColumnHeader}
                    renderMenu={this.renderMainQuadrantMenu}
                    renderRowHeader={this.renderMainQuadrantRowHeader}
                    scrollContainerRef={this.quadrantRefHandlers[QuadrantType.MAIN].scrollContainer}
                />
                <TableQuadrant
                    grid={grid}
                    isRowHeaderShown={isRowHeaderShown}
                    onWheel={this.throttledHandleTopQuadrantWheel}
                    quadrantRef={this.quadrantRefHandlers[QuadrantType.TOP].quadrant}
                    quadrantType={QuadrantType.TOP}
                    renderBody={renderBody}
                    renderColumnHeader={renderColumnHeader}
                    renderMenu={this.renderTopQuadrantMenu}
                    renderRowHeader={this.renderTopQuadrantRowHeader}
                    scrollContainerRef={this.quadrantRefHandlers[QuadrantType.TOP].scrollContainer}
                />
                <TableQuadrant
                    grid={grid}
                    isRowHeaderShown={isRowHeaderShown}
                    onWheel={this.throttledHandleLeftQuadrantWheel}
                    quadrantRef={this.quadrantRefHandlers[QuadrantType.LEFT].quadrant}
                    quadrantType={QuadrantType.LEFT}
                    renderBody={renderBody}
                    renderColumnHeader={renderColumnHeader}
                    renderMenu={this.renderLeftQuadrantMenu}
                    renderRowHeader={this.renderLeftQuadrantRowHeader}
                    scrollContainerRef={this.quadrantRefHandlers[QuadrantType.LEFT].scrollContainer}
                />
                <TableQuadrant
                    grid={grid}
                    isRowHeaderShown={isRowHeaderShown}
                    onWheel={this.throttledHandleTopLeftQuadrantWheel}
                    quadrantRef={this.quadrantRefHandlers[QuadrantType.TOP_LEFT].quadrant}
                    quadrantType={QuadrantType.TOP_LEFT}
                    renderBody={renderBody}
                    renderColumnHeader={renderColumnHeader}
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
            agg[key] = (ref: HTMLElement) => {
                this.quadrantRefs[quadrantType][key] = ref;
                if (quadrantType === QuadrantType.MAIN) {
                    if (key === "quadrant") {
                        CoreUtils.safeInvoke(this.props.quadrantRef, ref);
                    } else if (key === "scrollContainer") {
                        CoreUtils.safeInvoke(this.props.scrollContainerRef, ref);
                    }
                }
            }
            return agg;
        };
        return ["menu", "quadrant", "rowHeader", "scrollContainer"].reduce(reducer, {});
    }

    // Quadrant-specific renderers
    // ===========================

    private renderMainQuadrantMenu = () => {
        return this.props.renderMenu(this.quadrantRefHandlers[QuadrantType.MAIN].menu);
    }

    private renderTopQuadrantMenu = () => {
        return this.props.renderMenu(this.quadrantRefHandlers[QuadrantType.TOP].menu);
    }

    private renderLeftQuadrantMenu = () => {
        return this.props.renderMenu(this.quadrantRefHandlers[QuadrantType.LEFT].menu);
    }

    private renderTopLeftQuadrantMenu = () => {
        return this.props.renderMenu(this.quadrantRefHandlers[QuadrantType.TOP_LEFT].menu);
    }

    private renderMainQuadrantRowHeader = (showFrozenRowsOnly: boolean) => {
        return this.props.renderRowHeader(this.quadrantRefHandlers[QuadrantType.MAIN].rowHeader, showFrozenRowsOnly);
    }

    private renderTopQuadrantRowHeader = (showFrozenRowsOnly: boolean) => {
        return this.props.renderRowHeader(this.quadrantRefHandlers[QuadrantType.TOP].rowHeader, showFrozenRowsOnly);
    }

    private renderLeftQuadrantRowHeader = (showFrozenRowsOnly: boolean) => {
        return this.props.renderRowHeader(this.quadrantRefHandlers[QuadrantType.LEFT].rowHeader, showFrozenRowsOnly);
    }

    private renderTopLeftQuadrantRowHeader = (showFrozenRowsOnly: boolean) => {
        const refHandler = this.quadrantRefHandlers[QuadrantType.TOP_LEFT].rowHeader;
        return this.props.renderRowHeader(refHandler, showFrozenRowsOnly);
    }

    // Event handlers
    // ==============

    private handleMainQuadrantWheel = (event: React.WheelEvent<HTMLElement>) => {
        // we invoke event.preventDefault() when defining the throttled version of this function in
        // the constructor. this lets us prevent default scrolling animations and instead
        // programmatically keep all quadrants in the exact same spot in each frame.
        this.handleHorizontalWheel(event.deltaX, QuadrantType.MAIN, [QuadrantType.TOP]);
        this.handleVerticalWheel(event.deltaY, QuadrantType.MAIN, [QuadrantType.LEFT]);
        this.props.onScroll(event);
    }

    // use the more generic "scroll" event to sync quadrants in response to scrollbar interactions
    private handleMainQuadrantScroll = (event: React.UIEvent<HTMLElement>) => {
        if (this.wasMainQuadrantScrollChangedFromOtherOnWheelCallback) {
            this.wasMainQuadrantScrollChangedFromOtherOnWheelCallback = false;
            return;
        }
        const nextScrollTop = this.quadrantRefs[QuadrantType.MAIN].scrollContainer.scrollTop;
        const nextScrollLeft = this.quadrantRefs[QuadrantType.MAIN].scrollContainer.scrollLeft;

        this.quadrantRefs[QuadrantType.LEFT].scrollContainer.scrollTop = nextScrollTop;
        this.quadrantRefs[QuadrantType.TOP].scrollContainer.scrollLeft = nextScrollLeft;

        this.props.onScroll(event);
    }

    // listen to the wheel event on the top quadrant, since the scroll bar isn't visible and thus
    // can't trigger scroll events via clicking-and-dragging on the scroll bar.
    private handleTopQuadrantWheel = (event: React.WheelEvent<HTMLElement>) => {
        this.handleHorizontalWheel(event.deltaX, QuadrantType.TOP, [QuadrantType.MAIN]);
        this.handleVerticalWheel(event.deltaY, QuadrantType.MAIN, [QuadrantType.LEFT]);
        this.props.onScroll(event);
    }

    private handleLeftQuadrantWheel = (event: React.WheelEvent<HTMLElement>) => {
        this.handleHorizontalWheel(event.deltaX, QuadrantType.MAIN, [QuadrantType.TOP]);
        this.handleVerticalWheel(event.deltaY, QuadrantType.LEFT, [QuadrantType.MAIN]);
        this.props.onScroll(event);
    }

    private handleTopLeftQuadrantWheel = (event: React.WheelEvent<HTMLElement>) => {
        if (!this.props.isVerticalScrollDisabled) {
            const nextScrollTop = this.quadrantRefs[QuadrantType.MAIN].scrollContainer.scrollTop + event.deltaY;
            this.wasMainQuadrantScrollChangedFromOtherOnWheelCallback = true;
            this.quadrantRefs[QuadrantType.MAIN].scrollContainer.scrollTop = nextScrollTop;
            this.quadrantRefs[QuadrantType.LEFT].scrollContainer.scrollTop = nextScrollTop;
        }
        if (!this.props.isHorizontalScrollDisabled) {
            const nextScrollLeft = this.quadrantRefs[QuadrantType.MAIN].scrollContainer.scrollLeft + event.deltaX;
            this.wasMainQuadrantScrollChangedFromOtherOnWheelCallback = true;
            this.quadrantRefs[QuadrantType.MAIN].scrollContainer.scrollLeft = nextScrollLeft;
            this.quadrantRefs[QuadrantType.TOP].scrollContainer.scrollLeft = nextScrollLeft;
        }
        this.props.onScroll(event);
    }

    // Size syncing
    // ============

    private syncQuadrantMenuElementWidths() {
        this.syncQuadrantMenuElementWidth(QuadrantType.MAIN);
        this.syncQuadrantMenuElementWidth(QuadrantType.TOP);
        this.syncQuadrantMenuElementWidth(QuadrantType.LEFT);
        this.syncQuadrantMenuElementWidth(QuadrantType.TOP_LEFT);
    }

    private syncQuadrantMenuElementWidth(quadrantType: QuadrantType) {
        const mainQuadrantMenu = this.quadrantRefs[QuadrantType.MAIN].menu;
        const mainQuadrantRowHeader = this.quadrantRefs[QuadrantType.MAIN].rowHeader;
        const quadrantMenu = this.quadrantRefs[quadrantType].menu;

        // the main quadrant menu informs the size of every other quadrant menu
        if (mainQuadrantMenu != null && mainQuadrantRowHeader != null && quadrantMenu != null) {
            const { width } = mainQuadrantRowHeader.getBoundingClientRect();
            quadrantMenu.style.width = `${width}px`;

            // no need to use the main quadrant's menu to set its *own* height
            if (quadrantType !== QuadrantType.MAIN) {
                const { height } = mainQuadrantMenu.getBoundingClientRect();
                quadrantMenu.style.height = `${height}px`;
            }
        }
    }

    private syncQuadrantSizes() {
        const mainQuadrantScrollElement = this.quadrantRefs[QuadrantType.MAIN].scrollContainer;
        const topQuadrantElement = this.quadrantRefs[QuadrantType.TOP].quadrant;
        const topQuadrantRowHeaderElement = this.quadrantRefs[QuadrantType.TOP].rowHeader;
        const leftQuadrantElement = this.quadrantRefs[QuadrantType.LEFT].quadrant;
        const topLeftQuadrantElement = this.quadrantRefs[QuadrantType.TOP_LEFT].quadrant;
        const topLeftQuadrantRowHeaderElement = this.quadrantRefs[QuadrantType.TOP_LEFT].rowHeader;

        const { grid, numFrozenColumns, numFrozenRows } = this.props;

        // if there are no frozen rows or columns, we still want the quadrant to be 1px bigger to
        // reveal the header border.
        const BORDER_WIDTH_CORRECTION = 1;

        const leftQuadrantGridContentWidth = numFrozenColumns > 0
            ? grid.getCumulativeWidthAt(numFrozenColumns - 1)
            : BORDER_WIDTH_CORRECTION;
        const topQuadrantGridContentHeight = numFrozenRows > 0
            ? grid.getCumulativeHeightAt(numFrozenRows - 1)
            : BORDER_WIDTH_CORRECTION;

        // all menus are the same size, so arbitrarily use the one from the main quadrant.
        // assumes that the menu element width has already been sync'd after the last render

        const rowHeader = this.findRowHeader(QuadrantType.MAIN);
        const columnHeader = this.findColumnHeader(QuadrantType.MAIN);

        const rowHeaderWidth = rowHeader == null ? 0 : rowHeader.getBoundingClientRect().width;
        const columnHeaderHeight = columnHeader == null ? 0 : columnHeader.getBoundingClientRect().height;

        // no need to sync the main quadrant, because it fills the entire viewport
        topQuadrantElement.style.height = `${topQuadrantGridContentHeight + columnHeaderHeight}px`;
        leftQuadrantElement.style.width = `${leftQuadrantGridContentWidth + rowHeaderWidth}px`;
        topLeftQuadrantElement.style.width = `${leftQuadrantGridContentWidth + rowHeaderWidth}px`;
        topLeftQuadrantElement.style.height = `${topQuadrantGridContentHeight + columnHeaderHeight}px`;

        // resize the top and left quadrants to keep the main quadrant's scrollbar visible
        const scrollbarWidth = mainQuadrantScrollElement.offsetWidth - mainQuadrantScrollElement.clientWidth;
        const scrollbarHeight = mainQuadrantScrollElement.offsetHeight - mainQuadrantScrollElement.clientHeight;
        topQuadrantElement.style.right = `${scrollbarWidth}px`;
        leftQuadrantElement.style.bottom = `${scrollbarHeight}px`;

        // resize top and top-left quadrant row headers if main quadrant scrolls
        this.syncRowHeaderSize(topQuadrantRowHeaderElement, rowHeaderWidth);
        this.syncRowHeaderSize(topLeftQuadrantRowHeaderElement, rowHeaderWidth);
    }

    private syncRowHeaderSize(rowHeaderElement: HTMLElement, width: number) {
        if (rowHeaderElement == null) {
            return;
        }
        const selector = `.${Classes.TABLE_ROW_HEADERS_CELLS_CONTAINER}`;
        // this child element dictates the width of all row-header cells
        const elementToResize = rowHeaderElement.querySelector(selector) as HTMLElement;
        elementToResize.style.width = `${width}px`;
    }

    // Helpers
    // =======

    private findColumnHeader(quadrantType: QuadrantType) {
        const quadrantElement = this.quadrantRefs[quadrantType].quadrant;
        return quadrantElement.querySelector(`.${Classes.TABLE_COLUMN_HEADERS}`) as HTMLElement;
    }

    private findRowHeader(quadrantType: QuadrantType) {
        const quadrantElement = this.quadrantRefs[quadrantType].quadrant;
        return quadrantElement.querySelector(`.${Classes.TABLE_ROW_HEADERS}`) as HTMLElement;
    }

    private handleVerticalWheel = (
        deltaY: number,
        quadrantType: QuadrantType,
        quadrantTypesToSync: QuadrantType[],
    ) => {
        if (!this.props.isVerticalScrollDisabled) {
            this.wasMainQuadrantScrollChangedFromOtherOnWheelCallback = true;

            const nextScrollTop = this.quadrantRefs[quadrantType].scrollContainer.scrollTop + deltaY;
            this.quadrantRefs[quadrantType].scrollContainer.scrollTop = nextScrollTop;
            quadrantTypesToSync.forEach((quadrantTypeToSync) => {
                this.quadrantRefs[quadrantTypeToSync].scrollContainer.scrollTop = nextScrollTop;
            });
        }
    }

    private handleHorizontalWheel = (
        deltaX: number,
        quadrantType: QuadrantType,
        quadrantTypesToSync: QuadrantType[],
    ) => {
        if (!this.props.isHorizontalScrollDisabled) {
            this.wasMainQuadrantScrollChangedFromOtherOnWheelCallback = true;

            const nextScrollLeft = this.quadrantRefs[quadrantType].scrollContainer.scrollLeft + deltaX;
            this.quadrantRefs[quadrantType].scrollContainer.scrollLeft = nextScrollLeft;
            quadrantTypesToSync.forEach((quadrantTypeToSync) => {
                this.quadrantRefs[quadrantTypeToSync].scrollContainer.scrollLeft = nextScrollLeft;
            });
        }
    }
}
