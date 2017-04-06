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
import { Grid, IColumnIndices } from "../common/grid";
import { Rect, Utils } from "../common/index";
import { ICoordinateData } from "../interactions/draggable";
import { DragReorderable, IReorderableProps } from "../interactions/reorderable";
import { IIndexedResizeCallback, Resizable } from "../interactions/resizable";
import { ILockableLayout, Orientation } from "../interactions/resizeHandle";
import { DragSelectable, ISelectableProps } from "../interactions/selectable";
import { ILocator } from "../locator";
import { IRegion, Regions } from "../regions";
import { ColumnHeaderCell, IColumnHeaderCellProps, IColumnHeaderRenderer } from "./columnHeaderCell";

export interface IColumnWidths {
    minColumnWidth?: number;
    maxColumnWidth?: number;
    defaultColumnWidth?: number;
}

export interface IColumnHeaderProps extends IColumnIndices,
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

@PureRender
export class ColumnHeader extends React.Component<IColumnHeaderProps, {}> {
    public static defaultProps = {
        isResizable: true,
        loading: false,
    };

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
            onReorder,
            onReorderPreview,
            onResizeGuide,
            onSelection,
            selectedRegions,
            selectedRegionTransform,
        } = this.props;

        const rect = grid.getColumnRect(columnIndex);
        const handleSizeChanged = (size: number) => {
            onResizeGuide([rect.left + size + 1]);
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
        const cellProps: IColumnHeaderCellProps = { className, isColumnSelected, loading: cellLoading };

        return (
            <DragReorderable
                key={Classes.columnIndexClass(columnIndex)}
                locateClick={this.locateClick}
                locateDrag={this.locateDragForReordering}
                onReorder={onReorder}
                onReorderPreview={onReorderPreview}
                onSelection={onSelection}
                selectedRegions={selectedRegions}
                toRegion={this.toRegion}
            >
                <DragSelectable
                    allowMultipleSelection={allowMultipleSelection}
                    key={Classes.columnIndexClass(columnIndex)}
                    locateClick={this.locateClick}
                    locateDrag={this.locateDragForSelection}
                    selectedRegions={selectedRegions}
                    onFocus={onFocus}
                    onSelection={onSelection}
                    onSelectedRegionMouseDown={this.onSelectedRegionMouseDown}
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

    private onSelectedRegionMouseDown = (region: IRegion) => {
        console.log("ON SELECTED REGION MOUSE DOWN", region);
    }

    private locateClick = (event: MouseEvent) => {
        // Abort selection unless the mouse actually hit a table header. This allows
        // users to supply interactive components in their renderHeader methods.
        if (!ColumnHeaderCell.isHeaderMouseTarget(event.target as HTMLElement)) {
            return null;
        }

        const columnIndex = this.props.locator.convertPointToColumn(event.clientX);
        console.log("locateClick", columnIndex);

        // NOTE: can't do this because locateClick would return null to selectable.tsx's
        //       handleClick, immediately clearing a new selection.
        //
        // TODO: ignore this check if reordering is not enabled.
        //
        // if (Regions.hasFullColumn(this.props.selectedRegions, columnIndex)) {
        //     return null;
        // }

        return Regions.column(columnIndex);
    }

    private locateDragForSelection = (_event: MouseEvent, coords: ICoordinateData) => {
        const colStart = this.props.locator.convertPointToColumn(coords.activation[0]);
        const colEnd = this.props.locator.convertPointToColumn(coords.current[0]);
        console.log("locateDragForSelection", colStart, colEnd);
        return Regions.column(colStart, colEnd);
    }

    private locateDragForReordering = (_event: MouseEvent, coords: ICoordinateData): number => {
        let guideIndex = this.props.locator.convertPointToColumnLeftBoundary(coords.current[0]);

        const isValidIndex = guideIndex >= 0;
        if (!isValidIndex) {
            guideIndex = null;
        }

        console.log("columnHeader.tsx: locateDrag:\n", "newIndex:", guideIndex);

        return guideIndex;
    }

    private toRegion = (index1: number, index2?: number) => {
        return Regions.column(index1, index2);
    }
}
