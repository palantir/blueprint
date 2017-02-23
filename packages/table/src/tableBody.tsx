/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { IProps } from "@blueprintjs/core";
import * as classNames from "classnames";
import * as React from "react";
import { emptyCellRenderer, ICellProps, ICellRenderer } from "./cell/cell";
import * as Classes from "./common/classes";
import { ContextMenuTargetWrapper } from "./common/contextMenuTargetWrapper";
import { Grid, IColumnIndices, IRowIndices } from "./common/grid";
import { Rect } from "./common/rect";
import { Utils } from "./common/utils";
import { ICoordinateData } from "./interactions/draggable";
import { IContextMenuRenderer, MenuContext } from "./interactions/menus";
import { DragSelectable, ISelectableProps } from "./interactions/selectable";
import { ILocator } from "./locator";
import { Regions } from "./regions";

export interface ITableBodyProps extends ISelectableProps, IRowIndices, IColumnIndices, IProps {
    /**
     * A cell renderer for the cells in the body.
     */
    cellRenderer: ICellRenderer;

    /**
     * The grid computes sizes of cells, rows, or columns from the
     * configurable `columnWidths` and `rowHeights`.
     */
    grid: Grid;

    /**
     * If true, all `Cell`s render their loading state except for those who have
     * their `loading` prop explicitly set to false.
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
     * An optional callback for displaying a context menu when right-clicking
     * on the table body. The callback is supplied with an `IMenuContext`
     * containing the `IRegion`s of interest.
     */
    renderBodyContextMenu?: IContextMenuRenderer;
}

/**
 * For perf, we want to ignore changes to the `ISelectableProps` part of the
 * `ITableBodyProps` since those are only used when a context menu is launched.
 */
const UPDATE_PROPS_KEYS = [
    "grid",
    "locator",
    "viewportRect",
    "cellRenderer",
    "rowIndexStart",
    "rowIndexEnd",
    "columnIndexStart",
    "columnIndexEnd",
    "selectedRegions",
];

export class TableBody extends React.Component<ITableBodyProps, {}> {
    public static defaultProps = {
        loading: false,
    };

    /**
     * Returns the array of class names that must be applied to each table
     * cell so that we can locate any cell based on its coordinate.
     */
    public static cellClassNames(rowIndex: number, columnIndex: number) {
        return [
            Classes.rowCellIndexClass(rowIndex),
            Classes.columnCellIndexClass(columnIndex),
        ];
    }

    private static cellReactKey(rowIndex: number, columnIndex: number) {
        return `cell-${rowIndex}-${columnIndex}`;
    }

    public shouldComponentUpdate(nextProps: ITableBodyProps) {
        const shallowEqual = Utils.shallowCompareKeys(this.props, nextProps, UPDATE_PROPS_KEYS);
        return !shallowEqual;
    }

    public render() {
        const {
            allowMultipleSelection,
            columnIndexEnd,
            columnIndexStart,
            grid,
            onSelection,
            rowIndexEnd,
            rowIndexStart,
            selectedRegions,
            selectedRegionTransform,
        } = this.props;

        const style = grid.getRect().sizeStyle();
        const cells: Array<React.ReactElement<any>> = [];
        for (let rowIndex = rowIndexStart; rowIndex <= rowIndexEnd; rowIndex++) {
            for (let columnIndex = columnIndexStart; columnIndex <= columnIndexEnd; columnIndex++) {
                const extremaClasses = grid.getExtremaClasses(rowIndex, columnIndex, rowIndexEnd, columnIndexEnd);
                const isGhost = grid.isGhostIndex(rowIndex, columnIndex);
                cells.push(this.renderCell(rowIndex, columnIndex, extremaClasses, isGhost));
            }
        }

        return (
            <DragSelectable
                allowMultipleSelection={allowMultipleSelection}
                locateClick={this.locateClick}
                locateDrag={this.locateDrag}
                onSelection={onSelection}
                selectedRegions={selectedRegions}
                selectedRegionTransform={selectedRegionTransform}
            >
                <ContextMenuTargetWrapper
                    className={classNames(Classes.TABLE_BODY_VIRTUAL_CLIENT, Classes.TABLE_CELL_CLIENT)}
                    renderContextMenu={this.renderContextMenu}
                    style={style}
                >
                    {cells}
                </ContextMenuTargetWrapper>
            </DragSelectable>
        );
    }

    public renderContextMenu = (e: React.MouseEvent<HTMLElement>) => {
        const { selectedRegions, renderBodyContextMenu, grid } = this.props;

        if (renderBodyContextMenu == null) {
            return undefined;
        }

        const target = this.locateClick(e.nativeEvent as MouseEvent);
        return renderBodyContextMenu(new MenuContext(target, selectedRegions, grid.numRows, grid.numCols));
    }

   private renderCell = (rowIndex: number, columnIndex: number, extremaClasses: string[], isGhost: boolean) => {
        const { cellRenderer, loading, grid } = this.props;
        const baseCell = isGhost ? emptyCellRenderer() : cellRenderer(rowIndex, columnIndex);
        const className = classNames(
            TableBody.cellClassNames(rowIndex, columnIndex),
            extremaClasses,
            {
                [Classes.TABLE_CELL_GHOST]: isGhost,
                [Classes.TABLE_CELL_LEDGER_ODD]: (rowIndex % 2) === 1,
                [Classes.TABLE_CELL_LEDGER_EVEN]: (rowIndex % 2) === 0,
            },
            baseCell.props.className,
        );
        const key = TableBody.cellReactKey(rowIndex, columnIndex);
        const rect = isGhost ? grid.getGhostCellRect(rowIndex, columnIndex) : grid.getCellRect(rowIndex, columnIndex);
        const cellLoading = baseCell.props.loading != null ? baseCell.props.loading : loading;

        const style = { ...baseCell.props.style, ...Rect.style(rect) };
        return React.cloneElement(baseCell, { className, key, loading: cellLoading, style } as ICellProps);
    }

    private locateClick = (event: MouseEvent) => {
        const { col, row } = this.props.locator.convertPointToCell(event.clientX, event.clientY);
        return Regions.cell(row, col);
    }

    private locateDrag = (_event: MouseEvent, coords: ICoordinateData) => {
        const start = this.props.locator.convertPointToCell(coords.activation[0], coords.activation[1]);
        const end = this.props.locator.convertPointToCell(coords.current[0], coords.current[1]);
        return Regions.cell(start.row, start.col, end.row, end.col);
    }
}
