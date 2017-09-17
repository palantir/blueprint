/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { IProps, Utils as CoreUtils } from "@blueprintjs/core";
import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";

import { emptyCellRenderer, ICellProps, ICellRenderer } from "./cell/cell";
import { Batcher } from "./common/batcher";
import * as Classes from "./common/classes";
import { Grid, IColumnIndices, IRowIndices } from "./common/grid";
import { Rect } from "./common/rect";
import { RenderMode } from "./common/renderMode";
import { Utils } from "./common/utils";

export interface ITableBodyCellsProps extends IRowIndices, IColumnIndices, IProps {
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
     * An optional callback invoked when all cells in view have completely rendered.
     */
    onCompleteRender?: () => void;

    /**
     * Dictates how cells should be rendered. Supported modes are:
     * - `RenderMode.BATCH`: renders cells in batches to improve
     *   performance
     * - `RenderMode.NONE`: renders cells synchronously all at once
     * @default RenderMode.BATCH
     */
    renderMode?: RenderMode;
}

/**
 * We don't want to reset the batcher when this set of keys changes. Any other
 * changes should reset the batcher's internal cache.
 */
const BATCHER_RESET_PROP_KEYS_BLACKLIST: Array<keyof ITableBodyCellsProps> = [
    "columnIndexEnd",
    "columnIndexStart",
    "rowIndexEnd",
    "rowIndexStart",
];

@PureRender
export class TableBodyCells extends React.Component<ITableBodyCellsProps, {}> {
    public static defaultProps = {
        renderMode: RenderMode.BATCH,
    };

    /**
     * Returns the array of class names that must be applied to each table
     * cell so that we can locate any cell based on its coordinate.
     */
    private static cellClassNames(rowIndex: number, columnIndex: number) {
        return [Classes.rowCellIndexClass(rowIndex), Classes.columnCellIndexClass(columnIndex)];
    }

    private static cellReactKey(rowIndex: number, columnIndex: number) {
        return `cell-${rowIndex}-${columnIndex}`;
    }

    private batcher = new Batcher<JSX.Element>();
    private isRenderingBatchedCells = false;

    public componentDidMount() {
        this.maybeInvokeOnCompleteRender();
    }

    public componentWillUpdate(nextProps?: ITableBodyCellsProps) {
        const resetKeysBlacklist = { exclude: BATCHER_RESET_PROP_KEYS_BLACKLIST };
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
        const { renderMode } = this.props;
        const cells = renderMode === RenderMode.BATCH ? this.renderBatchedCells() : this.renderAllCells();
        return <div className="bp-table-body-cells">{cells}</div>;
    }

    // Render modes
    // ============

    private renderBatchedCells() {
        const { columnIndexEnd, columnIndexStart, rowIndexEnd, rowIndexStart } = this.props;

        // render cells in batches
        this.batcher.startNewBatch();
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
        const { columnIndexEnd, columnIndexStart, grid, rowIndexEnd, rowIndexStart } = this.props;

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
        const { columnIndexEnd, grid, rowIndexEnd } = this.props;
        const extremaClasses = grid.getExtremaClasses(row, col, rowIndexEnd, columnIndexEnd);
        const isGhost = grid.isGhostIndex(row, col);
        return this.renderCell(row, col, extremaClasses, isGhost);
    };

    private renderCell = (rowIndex: number, columnIndex: number, extremaClasses: string[], isGhost: boolean) => {
        const { cellRenderer, loading, grid } = this.props;
        const baseCell = isGhost ? emptyCellRenderer() : cellRenderer(rowIndex, columnIndex);
        const className = classNames(
            TableBodyCells.cellClassNames(rowIndex, columnIndex),
            extremaClasses,
            {
                [Classes.TABLE_CELL_GHOST]: isGhost,
                [Classes.TABLE_CELL_LEDGER_ODD]: rowIndex % 2 === 1,
                [Classes.TABLE_CELL_LEDGER_EVEN]: rowIndex % 2 === 0,
            },
            baseCell.props.className,
        );
        const key = TableBodyCells.cellReactKey(rowIndex, columnIndex);
        const rect = isGhost ? grid.getGhostCellRect(rowIndex, columnIndex) : grid.getCellRect(rowIndex, columnIndex);
        const cellLoading = baseCell.props.loading != null ? baseCell.props.loading : loading;

        const style = { ...baseCell.props.style, ...Rect.style(rect) };
        return React.cloneElement(baseCell, { className, key, loading: cellLoading, style } as ICellProps);
    };

    // Callbacks
    // =========

    private maybeInvokeOnCompleteRender() {
        const { onCompleteRender, renderMode } = this.props;

        if (renderMode === RenderMode.BATCH && this.isRenderingBatchedCells && this.batcher.isDone()) {
            this.isRenderingBatchedCells = false;
            CoreUtils.safeInvoke(onCompleteRender);
        } else if (renderMode === RenderMode.NONE) {
            CoreUtils.safeInvoke(onCompleteRender);
        }
    }
}
