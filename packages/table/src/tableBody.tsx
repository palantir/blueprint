/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { IProps, Utils as CoreUtils } from "@blueprintjs/core";
import * as classNames from "classnames";
import * as React from "react";
import { emptyCellRenderer, ICellProps, ICellRenderer } from "./cell/cell";
import { Batcher } from "./common/batcher";
import { ICellCoordinates } from "./common/cell";
import * as Classes from "./common/classes";
import { ContextMenuTargetWrapper } from "./common/contextMenuTargetWrapper";
import { Grid, IColumnIndices, IRowIndices } from "./common/grid";
import { Rect } from "./common/rect";
import { RenderOptimizationMode } from "./common/renderOptimizationMode";
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
     * The number of columns to freeze to the left side of the table, counting from the leftmost column.
     */
    numFrozenColumns?: number;

    /**
     * The number of rows to freeze to the top of the table, counting from the topmost row.
     */
    numFrozenRows?: number;

    /**
     * An optional callback invoked when all cells in view have completely rendered.
     */
    onCompleteRender?: () => void;

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

    /**
     * Dictates how cells should be rendered. Supported modes are:
     * - `RenderOptimizationMode.BATCH`: renders cells in batches to improve
     *   performance
     * - `RenderOptimizationMode.NONE`: renders cells synchronously all at once
     * @default RenderOptimizationMode.BATCH
     */
    renderOptimizationMode?: RenderOptimizationMode;
}

/**
 * For perf, we want to ignore changes to the `ISelectableProps` part of the
 * `ITableBodyProps` since those are only used when a context menu is launched.
 */
const UPDATE_PROPS_KEYS: Array<keyof ITableBodyProps> = [
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

/**
 * We don't want to reset the batcher when this set of keys changes. Any other
 * changes should reset the batcher's internal cache.
 */
const RESET_CELL_KEYS_BLACKLIST: Array<keyof ITableBodyProps> = [
    "columnIndexEnd",
    "columnIndexStart",
    "rowIndexEnd",
    "rowIndexStart",
    "viewportRect",
];

export class TableBody extends React.Component<ITableBodyProps, {}> {
    public static defaultProps = {
        loading: false,
        renderOptimizationMode: RenderOptimizationMode.BATCH,
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

    private activationCell: ICellCoordinates;
    private batcher = new Batcher<JSX.Element>();
    private isRenderingBatchedCells = false;

    public componentDidMount() {
        this.maybeInvokeOnCompleteRender();
    }

    public shouldComponentUpdate(nextProps: ITableBodyProps) {
        const propKeysWhitelist = { include: UPDATE_PROPS_KEYS };
        return !Utils.shallowCompareKeys(this.props, nextProps, propKeysWhitelist);
    }

    public componentWillUpdate(nextProps?: ITableBodyProps) {
        const resetKeysBlacklist = { exclude: RESET_CELL_KEYS_BLACKLIST };
        const shouldResetBatcher = !Utils.shallowCompareKeys(this.props, nextProps, resetKeysBlacklist);
        if (shouldResetBatcher) {
            this.batcher.reset();
        }
    }

    public componentDidUpdate() {
        this.maybeInvokeOnCompleteRender();
    }

    public componentWillUnmount() {
        this.batcher.cancelOutstandingCallback();
    }

    public render() {
        const {
            allowMultipleSelection,
            grid,
            numFrozenColumns,
            numFrozenRows,
            onFocus,
            onSelection,
            renderOptimizationMode,
            selectedRegions,
            selectedRegionTransform,
        } = this.props;

        const cells = (renderOptimizationMode === RenderOptimizationMode.BATCH)
            ? this.renderBatchedCells()
            : this.renderAllCells();

        const defaultStyle = grid.getRect().sizeStyle();

        const style = {
            height: (numFrozenRows != null) ? grid.getCumulativeHeightAt(numFrozenRows - 1) : defaultStyle.height,
            width: (numFrozenColumns != null) ? grid.getCumulativeWidthAt(numFrozenColumns - 1) : defaultStyle.width,
        };

        return (
            <DragSelectable
                allowMultipleSelection={allowMultipleSelection}
                locateClick={this.locateClick}
                locateDrag={this.locateDrag}
                onFocus={onFocus}
                onSelection={onSelection}
                onSelectionEnd={this.handleSelectionEnd}
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

    // Render modes
    // ============

    private renderBatchedCells() {
        const {
            columnIndexEnd,
            columnIndexStart,
            rowIndexEnd,
            rowIndexStart,
        } = this.props;

        // render cells in batches
        this.batcher.startNewBatch();
        this.isRenderingBatchedCells = true;
        for (let rowIndex = rowIndexStart; rowIndex <= rowIndexEnd; rowIndex++) {
            for (let columnIndex = columnIndexStart; columnIndex <= columnIndexEnd; columnIndex++) {
                this.batcher.addArgsToBatch(rowIndex, columnIndex);
            }
        }
        this.batcher.removeOldAddNew(this.renderNewCell);
        if (!this.batcher.isDone()) {
            this.batcher.idleCallback(() => this.forceUpdate());
        }

        const cells: Array<React.ReactElement<any>> = this.batcher.getList();
        return cells;
    }

    private renderAllCells() {
        const {
            columnIndexEnd,
            columnIndexStart,
            grid,
            rowIndexEnd,
            rowIndexStart,
        } = this.props;

        const cells: Array<React.ReactElement<any>> = [];

        for (let rowIndex = rowIndexStart; rowIndex <= rowIndexEnd; rowIndex++) {
            for (let columnIndex = columnIndexStart; columnIndex <= columnIndexEnd; columnIndex++) {
                const extremaClasses = grid.getExtremaClasses(rowIndex, columnIndex, rowIndexEnd, columnIndexEnd);
                const isGhost = grid.isGhostIndex(rowIndex, columnIndex);
                cells.push(this.renderCell(rowIndex, columnIndex, extremaClasses, isGhost));
            }
        }

        return cells;
    }

    // Cell renderers
    // ==============

    private renderNewCell = (row: number, col: number) => {
        const {
            columnIndexEnd,
            grid,
            rowIndexEnd,
        } = this.props;
        const extremaClasses = grid.getExtremaClasses(row, col, rowIndexEnd, columnIndexEnd);
        const isGhost = grid.isGhostIndex(row, col);
        return this.renderCell(row, col, extremaClasses, isGhost);
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

    // Callbacks
    // =========

    private handleSelectionEnd = () => {
        this.activationCell = null; // not strictly required, but good practice
    }

    private locateClick = (event: MouseEvent) => {
        this.activationCell = this.props.locator.convertPointToCell(event.clientX, event.clientY);
        return Regions.cell(this.activationCell.row, this.activationCell.col);
    }

    private locateDrag = (_event: MouseEvent, coords: ICoordinateData) => {
        const start = this.activationCell;
        const end = this.props.locator.convertPointToCell(coords.current[0], coords.current[1]);
        return Regions.cell(start.row, start.col, end.row, end.col);
    }

    private maybeInvokeOnCompleteRender() {
        const { onCompleteRender, renderOptimizationMode } = this.props;

        if (renderOptimizationMode === RenderOptimizationMode.BATCH
            && this.isRenderingBatchedCells
            && this.batcher.isDone()
        ) {
            this.isRenderingBatchedCells = false;
            CoreUtils.safeInvoke(onCompleteRender);
        } else if (renderOptimizationMode === RenderOptimizationMode.NONE) {
            CoreUtils.safeInvoke(onCompleteRender);
        }
    }
}
