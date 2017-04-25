/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as React from "react";

import * as Classes from "../common/classes";
import { Grid, IColumnIndices } from "../common/grid";
import { Rect, Utils } from "../common/index";
import { IClientCoordinates, ICoordinateData } from "../interactions/draggable";
import { DragReorderable, IReorderableProps } from "../interactions/reorderable";
import { IIndexedResizeCallback, Resizable } from "../interactions/resizable";
import { ILockableLayout, Orientation } from "../interactions/resizeHandle";
import { DragSelectable, ISelectableProps } from "../interactions/selectable";
import { ILocator } from "../locator";
import { IRegion, RegionCardinality, Regions } from "../regions";
import { ColumnHeaderCell, IColumnHeaderCellProps, IColumnHeaderRenderer } from "./columnHeaderCell";

export interface IColumnWidths {
    minColumnWidth?: number;
    maxColumnWidth?: number;
    defaultColumnWidth?: number;
}

export interface IColumnHeaderProps extends
    IColumnIndices,
    IColumnWidths,
    ILockableLayout,
    IReorderableProps,
    ISelectableProps {

    /**
     * A IColumnHeaderRenderer that, for each `<Column>`, will delegate to:
     * 1. The `renderColumnHeader` method from the `<Column>`
     * 2. A `<ColumnHeaderCell>` using the `name` prop from the `<Column>`
     * 3. A `<ColumnHeaderCell>` with a `name` generated from `Utils.toBase26Alpha`
     */
    cellRenderer: IColumnHeaderRenderer;

    /**
     * The grid computes sizes of cells, rows, or columns from the
     * configurable `columnWidths` and `rowHeights`.
     */
    grid: Grid;

    /**
     * If true, all `ColumnHeaderCell`s render their loading state except for
     * those who have their `loading` prop explicitly set to false.
     * @default false
     */
    loading: boolean;

    /**
     * Locates the row/column/cell given a mouse event.
     */
    locator: ILocator;

    /**
     * The `Rect` bounds of the visible viewport with respect to its parent
     * scrollable pane.
     */
    viewportRect: Rect;

    /**
     * Enables/disables the reordering interaction.
     * @internal
     * @default true
     */
    isReorderable?: boolean;

    /**
     * Enables/disables the resize interaction.
     * @default true
     */
    isResizable?: boolean;

    /**
     * A callback invoked when user is done resizing the column
     */
    onColumnWidthChanged: IIndexedResizeCallback;

    /**
     * This callback is called while the user is resizing a column. The guides
     * array contains pixel offsets for where to display the resize guides in
     * the table body's overlay layer.
     */
    onResizeGuide: (guides: number[]) => void;
}

export interface IColumnHeaderState {
    /**
     * Whether the drag-select interaction has finished (via mouseup). When
     * true, DragReorderable will know that it can override the click-and-drag
     * interactions that would normally be reserved for drag-select behavior.
     */
    hasSelectionEnded?: boolean;

    activationCoordinates?: IClientCoordinates;
}

export class ColumnHeader extends React.Component<IColumnHeaderProps, IColumnHeaderState> {
    public static defaultProps = {
        isReorderable: false,
        isResizable: true,
        loading: false,
    };

    public state: IColumnHeaderState = {
        activationCoordinates: null,
        hasSelectionEnded: false,
    };

    public componentDidMount() {
        if (this.props.selectedRegions != null && this.props.selectedRegions.length > 0) {
            // we already have a selection defined, so we'll want to enable reordering interactions
            // right away if other criteria are satisfied too.
            this.setState({ hasSelectionEnded: true });
        }
    }

    public componentWillReceiveProps(nextProps?: IColumnHeaderProps) {
        if (nextProps.selectedRegions != null && nextProps.selectedRegions.length > 0) {
            this.setState({ hasSelectionEnded: true });
        } else {
            this.setState({ hasSelectionEnded: false });
        }
    }

    public shouldComponentUpdate(nextProps: IColumnHeaderProps) {
        // as is, state changes don't need to trigger re-renders, so look at props only.
        return !Utils.shallowCompareKeys(this.props, nextProps);
    }

    public render() {
        const { grid, viewportRect, columnIndexStart, columnIndexEnd } = this.props;
        const cells: Array<React.ReactElement<any>> = [];
        for (let columnIndex = columnIndexStart; columnIndex <= columnIndexEnd; columnIndex++) {
            const extremaClasses = grid.getExtremaClasses(0, columnIndex, 1, columnIndexEnd);
            const renderer = grid.isGhostIndex(-1, columnIndex) ? this.renderGhostCell : this.renderCell;
            cells.push(renderer(columnIndex, extremaClasses));
        }

        // always set width so that the layout can push out the element unless it overflows.
        const style: React.CSSProperties = {
            width: `${grid.getRect().width}px`,
        };

        // use CSS translation to offset the cells
        if (viewportRect != null) {
            style.transform = `translate3d(${grid.getColumnRect(columnIndexStart).left - viewportRect.left}px, 0, 0)`;
        }

        const classes = classNames(Classes.TABLE_THEAD, Classes.TABLE_COLUMN_HEADER_TR, {
            [Classes.TABLE_DRAGGABLE] : (this.props.onSelection != null),
        });

        return <div style={style} className={classes}>{cells}</div>;
    }

    private renderGhostCell = (columnIndex: number, extremaClasses: string[]) => {
        const { grid, loading } = this.props;
        const rect = grid.getGhostCellRect(0, columnIndex);
        const style = {
            flexBasis: `${rect.width}px`,
            width: `${rect.width}px`,
        };
        return (
            <ColumnHeaderCell
                key={Classes.columnIndexClass(columnIndex)}
                className={classNames(extremaClasses)}
                loading={loading}
                style={style}
            />);
    }

    private renderCell = (columnIndex: number, extremaClasses: string[]) => {
        const {
            allowMultipleSelection,
            cellRenderer,
            grid,
            isResizable,
            loading,
            maxColumnWidth,
            minColumnWidth,
            onFocus,
            onColumnWidthChanged,
            onLayoutLock,
            onReordered,
            onReordering,
            onResizeGuide,
            onSelection,
            selectedRegions,
            selectedRegionTransform,
        } = this.props;

        const rect = grid.getColumnRect(columnIndex);
        const handleSizeChanged = (size: number) => {
            onResizeGuide([rect.left + size]);
        };

        const handleResizeEnd = (size: number) => {
            onResizeGuide(null);
            onColumnWidthChanged(columnIndex, size);
        };

        const handleDoubleClick = () => {
            const width = this.props.locator.getWidestVisibleCellInColumn(columnIndex);
            const clampedWidth = Utils.clamp(width, minColumnWidth, maxColumnWidth);
            onResizeGuide(null);
            onColumnWidthChanged(columnIndex, clampedWidth);
        };

        const cell = cellRenderer(columnIndex);
        const className = classNames(cell.props.className, extremaClasses, {
            [Classes.TABLE_DRAGGABLE]: (onSelection != null),
        });
        const cellLoading = cell.props.loading != null ? cell.props.loading : loading;
        const isColumnSelected = Regions.hasFullColumn(selectedRegions, columnIndex);
        const isColumnCurrentlyReorderable = this.isColumnCurrentlyReorderable(isColumnSelected);

        const cellProps: IColumnHeaderCellProps = {
            className,
            isColumnSelected,
            isColumnReorderable: isColumnCurrentlyReorderable,
            loading: cellLoading,
        };

        return (
            <DragReorderable
                disabled={!isColumnCurrentlyReorderable}
                key={Classes.columnIndexClass(columnIndex)}
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
                    disabled={isColumnCurrentlyReorderable}
                    key={Classes.columnIndexClass(columnIndex)}
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
                        maxSize={maxColumnWidth}
                        minSize={minColumnWidth}
                        onDoubleClick={handleDoubleClick}
                        onLayoutLock={onLayoutLock}
                        onResizeEnd={handleResizeEnd}
                        onSizeChanged={handleSizeChanged}
                        orientation={Orientation.VERTICAL}
                        size={rect.width}
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
        this.setState({ hasSelectionEnded: true, activationCoordinates: null });
    }

    private locateClick = (event: MouseEvent) => {
        console.log("");
        console.log("=========================");
        console.log("ColumnHeader: locateClick");
        console.log("  coords:");
        console.log("    event.clientX        :", event.clientX);
        console.log("    viewportRect.left    :", this.props.viewportRect.left);
        console.log("    event.clientX + vp.l :", event.clientX + this.props.viewportRect.left);

        // Abort selection unless the mouse actually hit a table header. This allows
        // users to supply interactive components in their renderHeader methods.
        if (!ColumnHeaderCell.isHeaderMouseTarget(event.target as HTMLElement)) {
            return null;
        }
        const col = this.props.locator.convertPointToColumn(this.props.viewportRect.left + event.clientX);

        this.setState({
            activationCoordinates: [
                this.props.viewportRect.left + event.clientX,
                this.props.viewportRect.top + event.clientY,
            ] as IClientCoordinates,
        });

        return Regions.column(col);
    }

    private locateDragForSelection = (_event: MouseEvent, coords: ICoordinateData) => {
        console.log("");
        console.log("------------------------------------");
        console.log("ColumnHeader: locateDragForSelection");
        console.log("  coords:");
        console.log("    activation.x      :", coords.activation[0]);
        console.log("    this.state.activationCoordinates :", this.state.activationCoordinates);
        console.log("    current.x         :", coords.current[0]);
        console.log("    viewportRect.left :", this.props.viewportRect.left);
        console.log("    current.x + vp.l  :", coords.current[0] + this.props.viewportRect.left);
        console.log("    offset.x          :", coords.offset[0]);

        const colStart = this.props.locator.convertPointToColumn(this.state.activationCoordinates[0]);
        const colEnd = this.props.locator.convertPointToColumn(this.props.viewportRect.left + coords.current[0]);
        console.log("  cols:");
        console.log("    start:", colStart);
        console.log("    end:", colEnd);

        return Regions.column(colStart, colEnd);
    }

    private locateDragForReordering = (_event: MouseEvent, coords: ICoordinateData): number => {
        const tableX = this.props.viewportRect.left + coords.current[0];
        const guideIndex = this.props.locator.convertPointToColumn(tableX, true);
        return (guideIndex < 0) ? undefined : guideIndex;
    }

    private toRegion = (index1: number, index2?: number) => {
        // can't pass Regions.column directly, because that would break its internal `this` binding.
        return Regions.column(index1, index2);
    }

    private isColumnCurrentlyReorderable(isColumnSelected: boolean) {
        const { selectedRegions } = this.props;
        // although reordering may be generally enabled for this column (via props.isReorderable),
        // the column shouldn't actually become reorderable from a user perspective until a few
        // other conditions are true:
        return this.props.isReorderable
            // the column should be the only selection (or it should be part of the only selection),
            // because reordering multiple disjoint column selections is a UX morass with no clear
            // best behavior.
            && isColumnSelected
            && selectedRegions.length === 1
            && Regions.getRegionCardinality(selectedRegions[0]) === RegionCardinality.FULL_COLUMNS
            // selected regions can be updated during mousedown+drag and before mouseup; thus, we
            // add a final check to make sure we don't enable reordering until the selection
            // interaction is complete. this prevents one click+drag interaction from triggering
            // both selection and reordering behavior.
            && this.state.hasSelectionEnded;
    }
}
