/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import classNames from "classnames";
import * as React from "react";

import { AbstractComponent2, Utils as CoreUtils, Props } from "@blueprintjs/core";

import { CellRenderer, emptyCellRenderer } from "./cell/cell";
import { Batcher } from "./common/batcher";
import type { FocusedCellCoordinates } from "./common/cellTypes";
import * as Classes from "./common/classes";
import { ColumnIndices, Grid, RowIndices } from "./common/grid";
import { Rect } from "./common/rect";
import { RenderMode } from "./common/renderMode";

export interface ITableBodyCellsProps extends RowIndices, ColumnIndices, Props {
    /**
     * A cell renderer for the cells in the body.
     */
    cellRenderer: CellRenderer;

    /**
     * The coordinates of the currently focused cell, for setting the "isFocused" prop on cells.
     */
    focusedCell?: FocusedCellCoordinates;

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
     * Dictates how cells should be rendered. This component doesn't support
     * `RenderMode.BATCH_ON_UPDATE`, because there are actually multiple updates
     * that need to happen at higher levels before the table is considered fully
     * "mounted"; thus, we let higher components tell us when to switch modes.
     *
     * @default RenderMode.BATCH
     */
    renderMode?: RenderMode.BATCH | RenderMode.NONE;

    /**
     * The `Rect` bounds of the visible viewport with respect to its parent
     * scrollable pane. While not directly used by the component, this prop is
     * necessary for shouldComponentUpdate logic to run properly.
     */
    viewportRect: Rect;
}

const SHALLOW_COMPARE_DENYLIST: Array<keyof ITableBodyCellsProps> = ["viewportRect"];

/**
 * We don't want to reset the batcher when this set of keys changes. Any other
 * changes should reset the batcher's internal cache.
 */
const BATCHER_RESET_PROP_KEYS_DENYLIST: Array<keyof ITableBodyCellsProps> = [
    "columnIndexEnd",
    "columnIndexStart",
    "rowIndexEnd",
    "rowIndexStart",
];

export class TableBodyCells extends AbstractComponent2<ITableBodyCellsProps> {
    public static defaultProps = {
        renderMode: RenderMode.BATCH,
    };

    private static cellReactKey(rowIndex: number, columnIndex: number) {
        return `cell-${rowIndex}-${columnIndex}`;
    }

    private batcher = new Batcher<JSX.Element>();

    /**
     * Set this flag to true in componentDidUpdate() when we call forceUpdate() to avoid an extra
     * unnecessary update cycle.
     */
    private didForceUpdate = false;

    public componentDidMount() {
        this.maybeInvokeOnCompleteRender();
    }

    public shouldComponentUpdate(nextProps: ITableBodyCellsProps) {
        return (
            !CoreUtils.shallowCompareKeys(nextProps, this.props, {
                exclude: SHALLOW_COMPARE_DENYLIST,
            }) ||
            // "viewportRect" is not a plain object, so we can't just deep
            // compare; we need custom logic.
            this.didViewportRectChange(nextProps.viewportRect, this.props.viewportRect)
        );
    }

    public componentDidUpdate(prevProps: ITableBodyCellsProps) {
        if (this.didForceUpdate) {
            this.didForceUpdate = false;
            return;
        }

        const shouldResetBatcher = !CoreUtils.shallowCompareKeys(prevProps, this.props, {
            exclude: BATCHER_RESET_PROP_KEYS_DENYLIST,
        });
        if (shouldResetBatcher) {
            this.batcher.reset();
            // At this point, the batcher is reset, but it doesn't have a chance to re-run since render() is not called
            // by default after this lifecycle method. This causes issues like https://github.com/palantir/blueprint/issues/5193.
            // We can run forceUpdate() to re-render, but must take care to set a local flag indicating that we are doing so,
            // so that this lifecycle method doesn't get re-run as well within the same forced update cycle.
            this.didForceUpdate = true;
            this.forceUpdate();
        }
        this.maybeInvokeOnCompleteRender();
    }

    public componentWillUnmount() {
        this.batcher.cancelOutstandingCallback();
    }

    public render() {
        const { renderMode } = this.props;
        const cells = renderMode === RenderMode.BATCH ? this.renderBatchedCells() : this.renderAllCells();
        return <div className={Classes.TABLE_BODY_CELLS}>{cells}</div>;
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

        return this.batcher.getList();
    }

    private renderAllCells() {
        const { columnIndexEnd, columnIndexStart, rowIndexEnd, rowIndexStart } = this.props;

        const cells: Array<React.ReactElement<any>> = [];
        const cellsArgs: Array<[number, number]> = [];

        for (let rowIndex = rowIndexStart; rowIndex <= rowIndexEnd; rowIndex++) {
            for (let columnIndex = columnIndexStart; columnIndex <= columnIndexEnd; columnIndex++) {
                cells.push(this.renderNewCell(rowIndex, columnIndex));
                cellsArgs.push([rowIndex, columnIndex]);
            }
        }

        // pretend we did an entire rendering pass using the batcher. that way,
        // if we switch from `RenderMode.NONE` to `RenderMode.BATCH`, we don't
        // have to re-paint every cell still in view.
        this.batcher.setList(cellsArgs, cells);

        return cells;
    }

    // Cell renderers
    // ==============

    private renderNewCell = (rowIndex: number, columnIndex: number) => {
        const { columnIndexEnd, grid, rowIndexEnd } = this.props;
        const extremaClasses = grid.getExtremaClasses(rowIndex, columnIndex, rowIndexEnd, columnIndexEnd);
        const isGhost = grid.isGhostIndex(rowIndex, columnIndex);
        return this.renderCell(rowIndex, columnIndex, extremaClasses, isGhost);
    };

    private renderCell = (rowIndex: number, columnIndex: number, extremaClasses: string[], isGhost: boolean) => {
        const { cellRenderer, focusedCell, loading, grid } = this.props;
        let baseCell = isGhost ? emptyCellRenderer() : cellRenderer(rowIndex, columnIndex);
        // cellRenderer still may return null
        baseCell = baseCell == null ? emptyCellRenderer() : baseCell;

        const className = classNames(
            cellClassNames(rowIndex, columnIndex),
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
        const isFocused = focusedCell != null && focusedCell.row === rowIndex && focusedCell.col === columnIndex;
        return React.cloneElement(baseCell, {
            className,
            isFocused,
            key,
            loading: cellLoading,
            style,
        });
    };

    // Callbacks
    // =========

    private maybeInvokeOnCompleteRender() {
        const { onCompleteRender, renderMode } = this.props;

        if (renderMode === RenderMode.NONE || (renderMode === RenderMode.BATCH && this.batcher.isDone())) {
            onCompleteRender?.();
        }
    }

    // Other
    // =====

    private didViewportRectChange = (nextViewportRect: Rect, currViewportRect: Rect) => {
        if (nextViewportRect == null && currViewportRect == null) {
            return false;
        } else if (nextViewportRect == null || currViewportRect == null) {
            return true;
        } else {
            return !nextViewportRect.equals(currViewportRect);
        }
    };
}

/**
 * Returns the array of class names that must be applied to each table
 * cell so that we can locate any cell based on its coordinate.
 */
export function cellClassNames(rowIndex: number, columnIndex: number) {
    return [Classes.rowCellIndexClass(rowIndex), Classes.columnCellIndexClass(columnIndex)];
}
