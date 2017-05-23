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
import { IClientCoordinates, ICoordinateData } from "../interactions/draggable";
import { DragReorderable, IReorderableProps } from "../interactions/reorderable";
import { Resizable } from "../interactions/resizable";
import { ILockableLayout, Orientation } from "../interactions/resizeHandle";
import { DragSelectable, ISelectableProps } from "../interactions/selectable";
import { ILocator } from "../locator";
import { IRegion, RegionCardinality, Regions } from "../regions";
import { IHeaderCellProps } from "./abstractHeaderCell";

export type IHeaderCellRenderer = (index: number) => React.ReactElement<IHeaderCellProps>;

export interface IHeaderProps extends
    ILockableLayout,
    IReorderableProps,
    ISelectableProps {

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
export abstract class AbstractHeader<P extends IHeaderProps> extends React.Component<P, IHeaderState> {
    public state: IHeaderState = {
        hasSelectionEnded: false,
    };

    protected activationIndex: number;

    public constructor(props?: P & IHeaderProps, context?: any) {
        super(props, context);

        // bind all abstract functions to `this` to prevent child classes from having to define
        // these functions with fat-arrows, which as of this writing is not possible to type
        // properly. see: https://github.com/Microsoft/TypeScript/issues/4669
        this.handleDragSelectableSelection = this.handleDragSelectableSelection.bind(this);
        this.handleDragSelectableSelectionEnd = this.handleDragSelectableSelectionEnd.bind(this);
        this.handleResizeEnd = this.handleResizeEnd.bind(this);
        this.handleSizeChanged = this.handleSizeChanged.bind(this);
        this.locateClick = this.locateClick.bind(this);
        this.locateDragForReordering = this.locateDragForReordering.bind(this);
        this.locateDragForSelection = this.locateDragForSelection.bind(this);
    }

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

    protected abstract convertPointToIndex(clientXOrY: number, useMidpoint?: boolean): number;
    protected abstract getCellExtremaClasses(index: number, endIndex: number): string[];
    protected abstract getCellIndexClass(index: number): string;
    protected abstract getCellSize(index: number): number;
    protected abstract getDragCoordinate(clientCoords: IClientCoordinates): number;
    protected abstract getEndIndex(): number;
    protected abstract getFullRegionCardinality(): RegionCardinality;
    protected abstract getMaxSize(): number;
    protected abstract getMinSize(): number;
    protected abstract getMouseCoordinate(event: MouseEvent): number;
    protected abstract getStartIndex(): number;
    protected abstract handleResizeEnd(index: number, size: number): void;
    protected abstract handleSizeChanged(index: number, size: number): void;
    protected abstract isCellSelected(index: number): boolean;
    protected abstract isGhostIndex(index: number): boolean;
    protected abstract renderGhostCell(index: number, extremaClasses: string[]): JSX.Element;
    protected abstract renderHeaderCell(index: number): JSX.Element;
    protected abstract toRegion(startIndex: number, endIndex?: number): IRegion;

    // declaring this method as abstract would require child classes to implement it even if they
    // didn't need it. define a default implementation here to obviate that requirement.
    protected handleDoubleClick(_index: number) {
        return;
    };

    protected locateClick(event: MouseEvent): IRegion {
        const coord = this.getMouseCoordinate(event);
        this.activationIndex = this.convertPointToIndex(coord);
        return this.toRegion(this.activationIndex);
    }

    protected locateDragForSelection(_event: MouseEvent, coords: ICoordinateData): IRegion {
        const coord = this.getDragCoordinate(coords.current);
        const startIndex = this.activationIndex;
        const endIndex = this.convertPointToIndex(coord);
        return this.toRegion(startIndex, endIndex);
    }

    protected locateDragForReordering(_event: MouseEvent, coords: ICoordinateData): number {
        const coord = this.getDragCoordinate(coords.current);
        const guideIndex = this.convertPointToIndex(coord, true);
        return (guideIndex < 0) ? undefined : guideIndex;
    }

    protected renderCells() {
        const startIndex = this.getStartIndex();
        const endIndex = this.getEndIndex();

        const cells: Array<React.ReactElement<any>> = [];

        for (let index = startIndex; index <= endIndex; index++) {
            const extremaClasses = this.getCellExtremaClasses(index, endIndex);
            // bind to `this` so that extending classes don't have to define these functions with
            // fat-arrow syntax, which would lead to typing hell.
            const renderer = this.isGhostIndex(index)
                ? this.renderGhostCell.bind(this)
                : this.renderCell.bind(this);
            cells.push(renderer(index, extremaClasses));
        }
        return cells;
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
            selectedRegions,
            selectedRegionTransform,
        } = this.props;

        const cell = this.renderHeaderCell(index);
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

        const handleSizeChanged = (size: number) => this.handleSizeChanged(index, size);
        const handleResizeEnd = (size: number) => this.handleResizeEnd(index, size);
        const handleDoubleClick = () => this.handleDoubleClick(index);

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
                        onDoubleClick={handleDoubleClick}
                        onLayoutLock={onLayoutLock}
                        onResizeEnd={handleResizeEnd}
                        onSizeChanged={handleSizeChanged}
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
