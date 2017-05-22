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
import { Grid } from "../common/grid";
import { Rect } from "../common/rect";
import { RoundSize } from "../common/roundSize";
import { ICoordinateData } from "../interactions/draggable";
import { DragReorderable, IReorderableProps } from "../interactions/reorderable";
import { IIndexedResizeCallback, Resizable } from "../interactions/resizable";
import { ILockableLayout, Orientation } from "../interactions/resizeHandle";
import { DragSelectable, ISelectableProps } from "../interactions/selectable";
import { ILocator } from "../locator";
import { IRegion, RegionCardinality, Regions } from "../regions";
import { IHeaderCellProps } from "./abstractHeaderCell";
import { RowHeaderCell } from "./rowHeaderCell";

export type IHeaderCellRenderer = (index: number) => React.ReactElement<IHeaderCellProps>;

export interface IHeaderProps extends
    ILockableLayout,
    IReorderableProps,
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
     * This callback is called while the user is resizing a header cell. The guides
     * array contains pixel offsets for where to display the resize guides in
     * the table body's overlay layer.
     */
    onResizeGuide: (guides: number[]) => void;

    onSizeChanged: IIndexedResizeCallback;

    /**
     * Renders each header cell.
     */
    renderHeaderCell?: IHeaderCellRenderer;

    /**
     * The `Rect` bounds of the visible viewport with respect to its parent
     * scrollable pane.
     */
    viewportRect: Rect;
}

export interface IHeaderState {
    /**
     * Whether the drag-select interaction has finished (via mouseup). When
     * true, DragReorderable will know that it can override the click-and-drag
     * interactions that would normally be reserved for drag-select behavior.
     */
    hasSelectionEnded?: boolean;
}

@PureRender
export abstract class AbstractHeader extends React.Component<IHeaderProps, IHeaderState> {
    public static defaultProps = {
        isResizable: false,
        loading: false,
    };

    public state: IHeaderState = {
        hasSelectionEnded: false,
    };

    protected activationIndex: number;

    public componentDidMount() {
        if (this.props.selectedRegions != null && this.props.selectedRegions.length > 0) {
            // we already have a selection defined, so we'll want to enable reordering interactions
            // right away if other criteria are satisfied too.
            this.setState({ hasSelectionEnded: true });
        }
    }

    public componentWillReceiveProps(nextProps?: IHeaderProps) {
        if (nextProps.selectedRegions != null && nextProps.selectedRegions.length > 0) {
            this.setState({ hasSelectionEnded: true });
        } else {
            this.setState({ hasSelectionEnded: false });
        }
    }

    public render() {
        const style = this.getHeaderStyle();
        const cells = this.getCellRenderers(this.getStartIndex(), this.getEndIndex());
        return (
            <RoundSize>
                <div style={style}>
                    {cells}
                </div>
            </RoundSize>
        );
    }

    protected abstract getCellExtremaClasses(index: number, indexEnd: number): string[];
    protected abstract getCellIndexClass(index: number): string;
    protected abstract getCellKey(index: number): string;
    protected abstract getCellSize(index: number): number;
    protected abstract getEndIndex(): number;
    protected abstract getFullRegionCardinality(): RegionCardinality;
    protected abstract getGhostCellRect(): React.CSSProperties;
    protected abstract getGhostCellStyle(): React.CSSProperties;
    protected abstract getHeaderStyle(): React.CSSProperties;
    protected abstract getMaxSize(): number;
    protected abstract getMinSize(): number;
    protected abstract getStartIndex(): number;
    protected abstract handleResizeEnd(size: number): void;
    protected abstract handleSizeChanged(size: number): void;
    protected abstract isCellSelected(index: number): boolean;
    protected abstract isGhostIndex(index: number): boolean;
    protected abstract locateClick(event: MouseEvent): IRegion;
    protected abstract locateDragForReordering(event: MouseEvent, coords: ICoordinateData): number;
    protected abstract locateDragForSelection(event: MouseEvent, coords: ICoordinateData): IRegion;
    protected abstract toRegion(startIndex: number, endIndex: number): IRegion;

    protected getCellRenderers(indexStart: number, indexEnd: number) {
        const cells: Array<React.ReactElement<any>> = [];
        for (let index = indexStart; index <= indexEnd; index++) {
            const extremaClasses = this.getCellExtremaClasses(index, indexEnd);
            const renderer = this.isGhostIndex(index)
                ? this.renderGhostCell
                : this.renderCell;
            cells.push(renderer(index, extremaClasses));
        }
        return cells;
    }

    protected renderGhostCell = (index: number, extremaClasses: string[]) => {
        const { loading } = this.props;
        return (
            <RowHeaderCell
                key={this.getCellKey(index)}
                className={classNames(extremaClasses)}
                loading={loading}
                style={this.getGhostCellStyle()}
            />);
    }

    protected renderCell = (index: number, extremaClasses: string[]) => {
        const {
            allowMultipleSelection,
            isResizable,
            loading,
            onFocus,
            onLayoutLock,
            onReordered,
            onReordering,
            onSelection,
            renderHeaderCell,
            selectedRegions,
            selectedRegionTransform,
        } = this.props;

        const cell = renderHeaderCell(index);
        const className = classNames(extremaClasses, {
            [Classes.TABLE_DRAGGABLE]: onSelection != null,
        }, this.getCellIndexClass(index), cell.props.className);

        const isLoading = cell.props.loading != null ? cell.props.loading : loading;
        const isSelected = this.isCellSelected(index);
        const isCurrentlyReorderable = this.isCellCurrentlyReorderable(isSelected);

        const cellProps: IHeaderCellProps = {
            className,
            isSelected,
            isReorderable: isCurrentlyReorderable,
            loading: isLoading,
        };

        return (
            <DragReorderable
                disabled={!isCurrentlyReorderable}
                key={this.getCellIndexClass(index)}
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
                    disabled={isCurrentlyReorderable}
                    key={this.getCellIndexClass(index)}
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
                        maxSize={this.getMaxSize()}
                        minSize={this.getMinSize()}
                        onLayoutLock={onLayoutLock}
                        onResizeEnd={this.handleResizeEnd}
                        onSizeChanged={this.handleSizeChanged}
                        orientation={Orientation.HORIZONTAL}
                        size={this.getCellSize(index)}
                    >
                        {React.cloneElement(cell, cellProps)}
                    </Resizable>
                </DragSelectable>
            </DragReorderable>
        );
    }

    protected handleDragSelectableSelection = (selectedRegions: IRegion[]) => {
        this.props.onSelection(selectedRegions);
        this.setState({ hasSelectionEnded: false });
    }

    protected handleDragSelectableSelectionEnd = () => {
        this.activationIndex = null; // not strictly required, but good practice
        this.setState({ hasSelectionEnded: true });
    }

    protected isCellCurrentlyReorderable(isSelected: boolean) {
        const { selectedRegions } = this.props;
        // although reordering may be generally enabled for this row/column (via props.isReorderable), the
        // row/col shouldn't actually become reorderable from a user perspective until a few other
        // conditions are true:
        return this.props.isReorderable
            // the row/column should be the only selection (or it should be part of the only selection),
            // because reordering multiple disjoint row/column selections is a UX morass with no clear best
            // behavior.
            && isSelected
            && this.state.hasSelectionEnded
            && Regions.getRegionCardinality(selectedRegions[0]) === this.getFullRegionCardinality()
            // selected regions can be updated during mousedown+drag and before mouseup; thus, we
            // add a final check to make sure we don't enable reordering until the selection
            // interaction is complete. this prevents one click+drag interaction from triggering
            // both selection and reordering behavior.
            && selectedRegions.length === 1;
    }
}
