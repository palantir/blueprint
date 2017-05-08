/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";

import * as Classes from "../common/classes";
import { Grid, IRowIndices } from "../common/grid";
import { Rect } from "../common/rect";
import { RoundSize } from "../common/roundSize";
import { ICoordinateData } from "../interactions/draggable";
import { DragReorderable, IReorderableProps } from "../interactions/reorderable";
import { IIndexedResizeCallback, Resizable } from "../interactions/resizable";
import { ILockableLayout, Orientation } from "../interactions/resizeHandle";
import { DragSelectable, ISelectableProps } from "../interactions/selectable";
import { ILocator } from "../locator";
import { IRegion, RegionCardinality, Regions } from "../regions";
import { IRowHeaderCellProps, RowHeaderCell } from "./rowHeaderCell";

export type IRowHeaderRenderer = (rowIndex: number) => React.ReactElement<IRowHeaderCellProps>;

export interface IRowHeights {
    minRowHeight?: number;
    maxRowHeight?: number;
    defaultRowHeight?: number;
}

export interface IRowHeaderProps extends
    ILockableLayout,
    IReorderableProps,
    IRowHeights,
    IRowIndices,
    ISelectableProps {

    /**
     * Enables/disables the reordering interaction.
     * @internal
     * @default true
     */
    isReorderable?: boolean;

    /**
     * Enables/disables the resize interaction.
     * @default false
     */
    isResizable?: boolean;

    /**
     * The grid computes sizes of cells, rows, or columns from the
     * configurable `columnWidths` and `rowHeights`.
     */
    grid: Grid;

    /**
     * If true, all `RowHeaderCell`s render their loading state except for those
     * who have their `loading` prop explicitly set to false.
     * @default false;
     */
    loading: boolean;

    /**
     * Locates the row/column/cell given a mouse event.
     */
    locator: ILocator;

    /**
     * This callback is called while the user is resizing a column. The guides
     * array contains pixel offsets for where to display the resize guides in
     * the table body's overlay layer.
     */
    onResizeGuide: (guides: number[]) => void;

    /**
     * A callback invoked when user is done resizing the column
     */
    onRowHeightChanged: IIndexedResizeCallback;

    /**
     * Renders the cell for each row header
     */
    renderRowHeader?: IRowHeaderRenderer;

    /**
     * The `Rect` bounds of the visible viewport with respect to its parent
     * scrollable pane.
     */
    viewportRect: Rect;
}

export interface IRowHeaderState {
    /**
     * Whether the drag-select interaction has finished (via mouseup). When
     * true, DragReorderable will know that it can override the click-and-drag
     * interactions that would normally be reserved for drag-select behavior.
     */
    hasSelectionEnded?: boolean;
}

@PureRender
export class RowHeader extends React.Component<IRowHeaderProps, IRowHeaderState> {
    public static defaultProps = {
        isResizable: false,
        loading: false,
        renderRowHeader: renderDefaultRowHeader,
    };

    public state: IRowHeaderState = {
        hasSelectionEnded: false,
    };

    // updating this doesn't need to trigger re-renders, so no need to keep it in this.state
    private activationRow: number;

    public componentDidMount() {
        const { selectedRegions } = this.props;
        if (selectedRegions != null && selectedRegions.length > 0) {
            // we already have a selection defined, so we'll want to enable reordering interactions
            // right away if other criteria are satisfied too.
            this.setState({ hasSelectionEnded: true });
        }
    }

    public componentWillReceiveProps(nextProps?: IRowHeaderProps) {
        if (nextProps.selectedRegions != null && nextProps.selectedRegions.length > 0) {
            this.setState({ hasSelectionEnded: true });
        } else {
            this.setState({ hasSelectionEnded: false });
        }
    }

    public render() {
        const { grid, rowIndexEnd, rowIndexStart, viewportRect } = this.props;

        const cells: Array<React.ReactElement<any>> = [];
        for (let rowIndex = rowIndexStart; rowIndex <= rowIndexEnd; rowIndex++) {
            const extremaClasses = grid.getExtremaClasses(rowIndex, 0, rowIndexEnd, 1);
            const renderer = grid.isGhostIndex(rowIndex, -1) ? this.renderGhostCell : this.renderCell;
            cells.push(renderer(rowIndex, extremaClasses));
        }

        // always set height so that the layout can push out the element unless it overflows.
        const style: React.CSSProperties = {
            height: `${grid.getRect().height}px`,
        };

        // use CSS translation to offset the cells
        if (viewportRect != null) {
            style.transform = `translate3d(0, ${grid.getRowRect(rowIndexStart).top - viewportRect.top}px, 0)`;
        }

        return (
            <RoundSize><div style={style}>{cells}</div></RoundSize>
        );
    }

    private renderGhostCell = (rowIndex: number, extremaClasses: string[]) => {
        const { grid, loading } = this.props;
        const rect = grid.getGhostCellRect(rowIndex, 0);
        const style = {
            height: `${rect.height}px`,
        };
        return (
            <RowHeaderCell
                key={Classes.rowIndexClass(rowIndex)}
                className={classNames(extremaClasses)}
                loading={loading}
                style={style}
            />);
    }

    private renderCell = (rowIndex: number, extremaClasses: string[]) => {
        const {
            allowMultipleSelection,
            grid,
            isResizable,
            loading,
            maxRowHeight,
            minRowHeight,
            onFocus,
            onLayoutLock,
            onReordered,
            onReordering,
            onResizeGuide,
            onRowHeightChanged,
            onSelection,
            renderRowHeader,
            selectedRegions,
            selectedRegionTransform,
        } = this.props;

        const rect = grid.getRowRect(rowIndex);

        const handleSizeChanged = (size: number) => {
            onResizeGuide([rect.top + size]);
        };

        const handleResizeEnd = (size: number) => {
            onResizeGuide(null);
            onRowHeightChanged(rowIndex, size);
        };

        const cell = renderRowHeader(rowIndex);
        const className = classNames(cell.props.className, extremaClasses, {
            [Classes.TABLE_DRAGGABLE]: onSelection != null,
        });
        const cellLoading = cell.props.loading != null ? cell.props.loading : loading;
        const isRowSelected = Regions.hasFullRow(selectedRegions, rowIndex);
        const isRowCurrentlyReorderable = this.isRowCurrentlyReorderable(isRowSelected);
        const cellProps: IRowHeaderCellProps = {
            className,
            isRowSelected,
            isRowReorderable: isRowCurrentlyReorderable,
            loading: cellLoading,
        };

        return (
            <DragReorderable
                disabled={!isRowCurrentlyReorderable}
                key={Classes.rowIndexClass(rowIndex)}
                locateClick={this.locateClick}
                locateDrag={this.locateDragForReordering}
                onReordered={onReordered}
                onReordering={onReordering}
                onSelection={onSelection}
                selectedRegions={selectedRegions}
                toRegion={this.toRegion}
            >
                <DragSelectable
                    allowMultipleSelection={allowMultipleSelection}
                    disabled={isRowCurrentlyReorderable}
                    key={Classes.rowIndexClass(rowIndex)}
                    locateClick={this.locateClick}
                    locateDrag={this.locateDragForSelection}
                    onFocus={onFocus}
                    onSelection={this.handleDragSelectableSelection}
                    onSelectionEnd={this.handleDragSelectableSelectionEnd}
                    selectedRegions={selectedRegions}
                    selectedRegionTransform={selectedRegionTransform}
                >
                    <Resizable
                        isResizable={isResizable}
                        maxSize={maxRowHeight}
                        minSize={minRowHeight}
                        onLayoutLock={onLayoutLock}
                        onResizeEnd={handleResizeEnd}
                        onSizeChanged={handleSizeChanged}
                        orientation={Orientation.HORIZONTAL}
                        size={rect.height}
                    >
                        {React.cloneElement(cell, cellProps)}
                    </Resizable>
                </DragSelectable>
            </DragReorderable>
        );
    }

    private handleDragSelectableSelection = (selectedRegions: IRegion[]) => {
        this.props.onSelection(selectedRegions);
        this.setState({ hasSelectionEnded: false });
    }

    private handleDragSelectableSelectionEnd = () => {
        this.activationRow = null;
        this.setState({ hasSelectionEnded: true });
    }

    private locateClick = (event: MouseEvent) => {
        this.activationRow = this.props.locator.convertPointToRow(event.clientY);
        return Regions.row(this.activationRow);
    }

    private locateDragForSelection = (_event: MouseEvent, coords: ICoordinateData) => {
        const rowStart = this.activationRow;
        const rowEnd = this.props.locator.convertPointToRow(coords.current[1]);
        return Regions.row(rowStart, rowEnd);
    }

    private locateDragForReordering = (_event: MouseEvent, coords: ICoordinateData): number => {
        const guideIndex = this.props.locator.convertPointToRow(coords.current[1], true);
        return (guideIndex < 0) ? undefined : guideIndex;
    }

    private toRegion = (index1: number, index2?: number) => {
        // can't pass Regions.row directly, because that would break its internal `this` binding.
        return Regions.row(index1, index2);
    }

    private isRowCurrentlyReorderable(isRowSelected: boolean) {
        const { selectedRegions } = this.props;
        // although reordering may be generally enabled for this row (via props.isReorderable), the
        // row shouldn't actually become reorderable from a user perspective until a few other
        // conditions are true:
        return this.props.isReorderable
            // the row should be the only selection (or it should be part of the only selection),
            // because reordering multiple disjoint row selections is a UX morass with no clear best
            // behavior.
            && isRowSelected
            && this.state.hasSelectionEnded
            && Regions.getRegionCardinality(selectedRegions[0]) === RegionCardinality.FULL_ROWS
            // selected regions can be updated during mousedown+drag and before mouseup; thus, we
            // add a final check to make sure we don't enable reordering until the selection
            // interaction is complete. this prevents one click+drag interaction from triggering
            // both selection and reordering behavior.
            && selectedRegions.length === 1;
    }
}

/**
 * A default implementation of `IRowHeaderRenderer` that displays 1-indexed
 * numbers for each row.
 */
export function renderDefaultRowHeader(rowIndex: number) {
    return <RowHeaderCell name={`${rowIndex + 1}`}/>;
}
