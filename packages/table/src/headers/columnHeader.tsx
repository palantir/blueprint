/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import { Grid, IColumnIndices } from "../common/grid";
import { Rect, Utils } from "../common/index";
import { ICoordinateData } from "../interactions/draggable";
import { IIndexedResizeCallback, Resizable } from "../interactions/resizable";
import { ILockableLayout, Orientation } from "../interactions/resizeHandle";
import { DragSelectable, ISelectableProps } from "../interactions/selectable";
import { ILocator } from "../locator";
import { Regions } from "../regions";
import { ColumnHeaderCell, IColumnHeaderCellProps, IColumnHeaderRenderer } from "./columnHeaderCell";
import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";

export interface IColumnWidths {
    minColumnWidth?: number;
    maxColumnWidth?: number;
    defaultColumnWidth?: number;
}

export interface IColumnHeaderProps extends ISelectableProps, IColumnIndices, IColumnWidths, ILockableLayout {
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
    };

    public render() {
        const { grid, viewportRect, columnIndexStart, columnIndexEnd } = this.props;
        const cells: React.ReactElement<any>[] = [];
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

        const classes = classNames("bp-table-thead", "bp-table-column-header-tr", {
            "bp-table-draggable" : (this.props.onSelection != null),
        });

        return <div style={style} className={classes}>{cells}</div>;
    }

    private renderGhostCell = (columnIndex: number, extremaClasses: string[]) => {
        const { grid } = this.props;
        const rect = grid.getGhostCellRect(0, columnIndex);
        const style = {
            flexBasis: `${rect.width}px`,
            width: `${rect.width}px`,
        };
        return (
            <ColumnHeaderCell
                key={`bp-table-col-${columnIndex}`}
                className={classNames(extremaClasses)}
                style={style}
            />);
    }

    private renderCell = (columnIndex: number, extremaClasses: string[]) => {
        const {
            allowMultipleSelection,
            cellRenderer,
            grid,
            isResizable,
            maxColumnWidth,
            minColumnWidth,
            onColumnWidthChanged,
            onLayoutLock,
            onResizeGuide,
            onSelection,
            selectedRegions,
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
            "bp-table-draggable": (onSelection != null),
        });
        const isColumnSelected = Regions.hasFullColumn(selectedRegions, columnIndex);

        return (
            <DragSelectable
                allowMultipleSelection={allowMultipleSelection}
                key={`bp-table-col-${columnIndex}`}
                locateClick={this.locateClick}
                locateDrag={this.locateDrag}
                onSelection={onSelection}
                selectedRegions={selectedRegions}
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
                    {React.cloneElement(cell, { className, isColumnSelected } as IColumnHeaderCellProps)}
                </Resizable>
            </DragSelectable>
        );
    }

    private locateClick = (event: MouseEvent) => {
        // Abort selection unless the mouse actually hit a table header. This allows
        // users to supply interactive components in their renderHeader methods.
        if (!ColumnHeaderCell.isHeaderMouseTarget(event.target as HTMLElement)) {
            return null;
        }

        const col = this.props.locator.convertPointToColumn(event.clientX);
        return Regions.column(col);
    }

    private locateDrag = (_event: MouseEvent, coords: ICoordinateData) => {
        const colStart = this.props.locator.convertPointToColumn(coords.activation[0]);
        const colEnd = this.props.locator.convertPointToColumn(coords.current[0]);
        return Regions.column(colStart, colEnd);
    }
}
