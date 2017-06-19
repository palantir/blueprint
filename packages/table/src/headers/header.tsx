/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { Classes as CoreClasses } from "@blueprintjs/core";
import * as classNames from "classnames";
import * as React from "react";

import { Grid, Rect } from "../common";
import { Batcher } from "../common/batcher";
import * as Classes from "../common/classes";
import { Utils } from "../index";
import { IClientCoordinates, ICoordinateData } from "../interactions/draggable";
import { DragReorderable, IReorderableProps } from "../interactions/reorderable";
import { Resizable } from "../interactions/resizable";
import { ILockableLayout, Orientation } from "../interactions/resizeHandle";
import { DragSelectable, ISelectableProps } from "../interactions/selectable";
import { ILocator } from "../locator";
import { IRegion, RegionCardinality, Regions } from "../regions";
import { IHeaderCellProps } from "./headerCell";

export type IHeaderCellRenderer = (index: number) => React.ReactElement<IHeaderCellProps>;

export interface IHeaderProps extends ILockableLayout, IReorderableProps, ISelectableProps {
    /**
     * The grid computes sizes of cells, rows, or columns from the
     * configurable `columnWidths` and `rowHeights`.
     */
    grid: Grid;

    /**
     * Enables/disables the reordering interaction.
     * @internal
     * @default false
     */
    isReorderable?: boolean;

    /**
     * Enables/disables the resize interaction.
     * @default false
     */
    isResizable?: boolean;

    /**
     * Locates the row/column/cell given a mouse event.
     */
    locator: ILocator;

    /**
     * If true, all header cells render their loading state except for those
     * who have their `loading` prop explicitly set to false.
     * @default false;
     */
    loading?: boolean;

    /**
     * The `Rect` bounds of the visible viewport with respect to its parent
     * scrollable pane.
     */
    viewportRect: Rect;

    /**
     * This callback is called while the user is resizing a header cell. The guides
     * array contains pixel offsets for where to display the resize guides in
     * the table body's overlay layer.
     */
    onResizeGuide: (guides: number[]) => void;
}

/**
 * These are additional props passed internally from ColumnHeader and RowHeader.
 * They don't need to be exposed to the outside world.
 */
export interface IInternalHeaderProps extends IHeaderProps {
    /**
     * The highest cell index to render.
     */
    endIndex: number;

    /**
     * The cardinality of a fully selected region. Should be FULL_COLUMNS for column headers and
     * FULL_ROWS for row headers.
     */
    fullRegionCardinality: RegionCardinality;

    /**
     * An optional callback invoked when the user double-clicks a resize handle, if resizing is enabled.
     */
    handleResizeDoubleClick?: (index: number) => void;

    /**
     * The name of the header-cell prop specifying whether the header cell is reorderable or not.
     */
    headerCellIsReorderablePropName: string;

    /**
     * The name of the header-cell prop specifying whether the header cell is selected or not.
     */
    headerCellIsSelectedPropName: string;

    /**
     * The maximum permitted size of the header in pixels. Corresponds to a width for column headers and
     * a height for row headers.
     */
    maxSize: number;

    /**
     * The minimum permitted size of the header in pixels. Corresponds to a width for column headers and
     * a height for row headers.
     */
    minSize: number;

    /**
     * The orientation of the resize handle. Should be VERTICAL for column headers and HORIZONTAL
     * for row headers.
     */
    resizeOrientation: Orientation;

    /**
     * The lowest cell index to render.
     */
    startIndex: number;

    /**
     * Converts a point on the screen to a row or column index in the table grid.
     */
    convertPointToIndex?: (clientXOrY: number, useMidpoint?: boolean) => number;

    /**
     * Provides any extrema classes for the provided index range in the table grid.
     */
    getCellExtremaClasses: (index: number, endIndex: number) => string[];

    /**
     * Provides the index class for the cell. Should be Classes.columnCellIndexClass for column
     * headers or Classes.rowCellIndexClass for row headers.
     */
    getCellIndexClass: (index: number) => string;

    /**
     * Returns the size of the specified header cell in pixels. Corresponds to a width for column
     * headers and a height for row headers.
     */
    getCellSize: (index: number) => number;

    /**
     * Returns the relevant single coordinate from the provided client coordinates. Should return
     * the x coordinate for column headers and the y coordinate for row headers.
     */
    getDragCoordinate: (clientCoords: IClientCoordinates) => number;

    /**
     * A callback that returns the CSS index class for the specified index. Should be
     * Classes.columnIndexClass for column headers and Classes.rowIndexClass for row headers.
     */
    getIndexClass: (index: number) => string;

    /**
     * Given a mouse event, returns the relevant client coordinate (clientX or clientY). Should be
     * clientX for column headers and clientY for row headers.
     */
    getMouseCoordinate: (event: MouseEvent) => number;

    /**
     * Invoked when a resize interaction ends, if resizing is enabled.
     */
    handleResizeEnd: (index: number, size: number) => void;

    /**
     * Invoked whenever the size changes during a resize interaction, if resizing is enabled.
     */
    handleSizeChanged: (index: number, size: number) => void;

    /**
     * Returns true if the specified cell (and therefore the full column/row) is selected.
     */
    isCellSelected: (index: number) => boolean;

    /**
     * Returns true if the specified cell is at a ghost index.
     */
    isGhostIndex: (index: number) => boolean;

    /**
     * A callback that renders a ghost cell for the provided index.
     */
    renderGhostCell: (index: number, extremaClasses: string[]) => JSX.Element;

    /**
     * A callback that renders a regular header cell at the provided index.
     */
    renderHeaderCell: (index: number) => JSX.Element;

    /**
     * Converts a range to a region. This should be Regions.column for column headers and
     * Regions.row for row headers.
     */
    toRegion: (index1: number, index2?: number) => IRegion;

    /**
     * A callback that wraps the rendered cell components in additional parent elements as needed.
     */
    wrapCells: (cells: Array<React.ReactElement<any>>) => JSX.Element;
}

export interface IHeaderState {
    /**
     * Whether the drag-select interaction has finished (via mouseup). When
     * true, DragReorderable will know that it can override the click-and-drag
     * interactions that would normally be reserved for drag-select behavior.
     */
    hasSelectionEnded?: boolean;
}

const RESET_CELL_KEYS_BLACKLIST: Array<keyof IInternalHeaderProps> = [
    "endIndex",
    "startIndex",
    "viewportRect",
];

export class Header extends React.Component<IInternalHeaderProps, IHeaderState> {
    public state: IHeaderState = {
        hasSelectionEnded: false,
    };

    protected activationIndex: number;
    private batcher = new Batcher<JSX.Element>();

    public constructor(props?: IHeaderProps, context?: any) {
        super(props, context);
    }

    public componentDidMount() {
        if (this.props.selectedRegions != null && this.props.selectedRegions.length > 0) {
            // we already have a selection defined, so we'll want to enable reordering interactions
            // right away if other criteria are satisfied too.
            this.setState({ hasSelectionEnded: true });
        }
    }

    public componentWillUnmount() {
        this.batcher.cancelOutstandingCallback();
    }

    public componentWillReceiveProps(nextProps?: IInternalHeaderProps) {
        if (nextProps.selectedRegions != null && nextProps.selectedRegions.length > 0) {
            this.setState({ hasSelectionEnded: true });
        } else {
            this.setState({ hasSelectionEnded: false });
        }
    }

    public componentWillUpdate(nextProps?: IInternalHeaderProps, nextState?: IHeaderState) {
        const resetKeysBlacklist = { exclude: RESET_CELL_KEYS_BLACKLIST };
        let shouldResetBatcher = !Utils.shallowCompareKeys(this.props, nextProps, resetKeysBlacklist);
        shouldResetBatcher = shouldResetBatcher || !Utils.shallowCompareKeys(this.state, nextState);
        if (shouldResetBatcher) {
            this.batcher.reset();
        }
    }

    public render() {
        return this.props.wrapCells(this.renderCells());
    }

    private locateClick = (event: MouseEvent): IRegion => {
        const coord = this.props.getMouseCoordinate(event);
        this.activationIndex = this.props.convertPointToIndex(coord);
        return this.props.toRegion(this.activationIndex);
    }

    private locateDragForSelection = (_event: MouseEvent, coords: ICoordinateData): IRegion => {
        const coord = this.props.getDragCoordinate(coords.current);
        const startIndex = this.activationIndex;
        const endIndex = this.props.convertPointToIndex(coord);
        return this.props.toRegion(startIndex, endIndex);
    }

    private locateDragForReordering = (_event: MouseEvent, coords: ICoordinateData): number => {
        const coord = this.props.getDragCoordinate(coords.current);
        const guideIndex = this.props.convertPointToIndex(coord, true);
        return (guideIndex < 0) ? undefined : guideIndex;
    }

    private renderCells = () => {
        const startIndex = this.props.startIndex;
        const endIndex = this.props.endIndex;

        this.batcher.startNewBatch();
        for (let index = startIndex; index <= endIndex; index++) {
            this.batcher.addArgsToBatch(index);
        }
        this.batcher.removeOldAddNew(this.renderNewCell);

        if (!this.batcher.isDone()) {
            this.batcher.idleCallback(() => this.forceUpdate());
        }
        return this.batcher.getList();
    }

    private renderNewCell = (index: number) => {
        const extremaClasses = this.props.getCellExtremaClasses(index, this.props.endIndex);
        const renderer = this.props.isGhostIndex(index)
            ? this.props.renderGhostCell
            : this.renderCell;
        return renderer(index, extremaClasses);
    }

    private renderCell = (index: number, extremaClasses: string[]) => {
        const { getIndexClass, onSelection, selectedRegions } = this.props;

        const cell = this.props.renderHeaderCell(index);

        const isLoading = cell.props.loading != null ? cell.props.loading : this.props.loading;
        const isSelected = this.props.isCellSelected(index);
        const isEntireCellTargetReorderable = this.isEntireCellTargetReorderable(cell, isSelected);

        const className = classNames(extremaClasses, {
            [Classes.TABLE_DRAGGABLE]: onSelection != null,
            [Classes.TABLE_HEADER_REORDERABLE]: isEntireCellTargetReorderable,
        }, this.props.getCellIndexClass(index), cell.props.className);

        const cellProps: IHeaderCellProps = {
            className,
            index,
            [this.props.headerCellIsSelectedPropName]: isSelected,
            [this.props.headerCellIsReorderablePropName]: isEntireCellTargetReorderable,
            loading: isLoading,
            reorderHandle: this.maybeRenderReorderHandle(cell, index),
        };

        const modifiedHandleSizeChanged = (size: number) => this.props.handleSizeChanged(index, size);
        const modifiedHandleResizeEnd = (size: number) => this.props.handleResizeEnd(index, size);
        const modifiedHandleResizeHandleDoubleClick = () => this.props.handleResizeDoubleClick(index);

        const baseChildren = (
            <DragSelectable
                allowMultipleSelection={this.props.allowMultipleSelection}
                disabled={isEntireCellTargetReorderable}
                ignoredSelectors={[`.${Classes.TABLE_REORDER_HANDLE}`]}
                key={getIndexClass(index)}
                locateClick={this.locateClick}
                locateDrag={this.locateDragForSelection}
                onFocus={this.props.onFocus}
                onSelection={this.handleDragSelectableSelection}
                onSelectionEnd={this.handleDragSelectableSelectionEnd}
                selectedRegions={selectedRegions}
                selectedRegionTransform={this.props.selectedRegionTransform}
            >
                <Resizable
                    isResizable={this.props.isResizable}
                    maxSize={this.props.maxSize}
                    minSize={this.props.minSize}
                    onDoubleClick={modifiedHandleResizeHandleDoubleClick}
                    onLayoutLock={this.props.onLayoutLock}
                    onResizeEnd={modifiedHandleResizeEnd}
                    onSizeChanged={modifiedHandleSizeChanged}
                    orientation={this.props.resizeOrientation}
                    size={this.props.getCellSize(index)}
                >
                    {React.cloneElement(cell, cellProps)}
                </Resizable>
            </DragSelectable>
        );

        return this.isReorderHandleEnabled(cell)
            ? baseChildren // reordering will be handled by interacting with the reorder handle
            : this.wrapInDragReorderable(index, baseChildren, !isEntireCellTargetReorderable);
    }

    private isReorderHandleEnabled(cell: JSX.Element) {
        // the reorder handle can only appear in the column interaction bar
        return this.isColumnHeader() && cell.props.useInteractionBar;
    }

    private maybeRenderReorderHandle(cell: JSX.Element, index: number) {
        return !this.isReorderHandleEnabled(cell)
            ? undefined
            : this.wrapInDragReorderable(index,
                <div className={Classes.TABLE_REORDER_HANDLE_TARGET}>
                    <div className={Classes.TABLE_REORDER_HANDLE}>
                        <span className={CoreClasses.iconClass("drag-handle-vertical")} />
                    </div>
                </div>);
    }

    private isColumnHeader() {
        return this.props.fullRegionCardinality === RegionCardinality.FULL_COLUMNS;
    }

    private wrapInDragReorderable(index: number, children: JSX.Element, disabled?: boolean) {
        return (
            <DragReorderable
                disabled={disabled}
                key={this.props.getIndexClass(index)}
                locateClick={this.locateClick}
                locateDrag={this.locateDragForReordering}
                onReordered={this.props.onReordered}
                onReordering={this.props.onReordering}
                onSelection={this.props.onSelection}
                selectedRegions={this.props.selectedRegions}
                toRegion={this.props.toRegion}
            >
                {children}
            </DragReorderable>
        );
    }

    private handleDragSelectableSelection = (selectedRegions: IRegion[]) => {
        this.props.onSelection(selectedRegions);
        this.setState({ hasSelectionEnded: false });
    }

    private handleDragSelectableSelectionEnd = () => {
        this.activationIndex = null; // not strictly required, but good practice
        this.setState({ hasSelectionEnded: true });
    }

    private isEntireCellTargetReorderable = (cell: JSX.Element, isSelected: boolean) => {
        const { selectedRegions } = this.props;
        // although reordering may be generally enabled for this row/column (via props.isReorderable), the
        // row/column shouldn't actually become reorderable from a user perspective until a few other
        // conditions are true:
        return this.props.isReorderable
            // the row/column should be the only selection (or it should be part of the only selection),
            // because reordering multiple disjoint row/column selections is a UX morass with no clear best
            // behavior.
            && isSelected
            && this.state.hasSelectionEnded
            && Regions.getRegionCardinality(selectedRegions[0]) === this.props.fullRegionCardinality
            // selected regions can be updated during mousedown+drag and before mouseup; thus, we
            // add a final check to make sure we don't enable reordering until the selection
            // interaction is complete. this prevents one click+drag interaction from triggering
            // both selection and reordering behavior.
            && selectedRegions.length === 1
            // columns are reordered via a reorder handle, so drag-selection needn't be disabled
            && !this.isReorderHandleEnabled(cell);
    }
}

/**
 * In the current architecture, ColumnHeaderCell and RowHeaderCell each need to include this same
 * shouldComponentUpdate code at their level. To avoid writing the same code in two places, we
 * expose this utility for each higher-level component to leverage in their own respective
 * shouldComponentUpdate functions.
 *
 * (See: https://github.com/palantir/blueprint/issues/1214)
 *
 * @param props - the current props
 * @param nextProps - the next props
 */
export function shouldHeaderComponentUpdate<T extends IHeaderProps>(
    props: T, nextProps: T, isSelectedRegionRelevant: (selectedRegion: IRegion) => boolean) {

    if (!Utils.shallowCompareKeys(props, nextProps, { exclude: ["selectedRegions"] })) {
        return true;
    }

    const relevantSelectedRegions = props.selectedRegions.filter(isSelectedRegionRelevant);
    const nextRelevantSelectedRegions = nextProps.selectedRegions.filter(isSelectedRegionRelevant);

    // ignore selection changes that didn't involve any relevant selected regions (FULL_COLUMNS
    // for column headers, or FULL_ROWS for row headers)
    if (relevantSelectedRegions.length > 0 || nextRelevantSelectedRegions.length > 0) {
        return !Utils.deepCompareKeys(relevantSelectedRegions, nextRelevantSelectedRegions);
    }

    return false;
}
