/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
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

import * as React from "react";

import type { FocusedCellCoordinates } from "./common/cellTypes";
import { Clipboard } from "./common/clipboard";
import { Direction } from "./common/direction";
import { TABLE_COPY_FAILED } from "./common/errors";
import { Grid } from "./common/grid";
import * as FocusedCellUtils from "./common/internal/focusedCellUtils";
import * as SelectionUtils from "./common/internal/selectionUtils";
import { NonNullRegion, Region, RegionCardinality, Regions } from "./regions";
import type { TableProps } from "./tableProps";
import type { TableSnapshot, TableState } from "./tableState";

export interface TableHandlers {
    handleSelection: (selectedRegions: Region[]) => void;
    handleFocus: (focusedCell: FocusedCellCoordinates) => void;
    getEnabledSelectionHandler: (selectionMode: RegionCardinality) => (selectedRegions: Region[]) => void;
    syncViewportPosition: (snapshot: TableSnapshot) => void;
}

export class TableHotkeys {
    private grid?: Grid;

    public constructor(private props: TableProps, private state: TableState, private tableHandlers: TableHandlers) {
        // no-op
    }

    public setGrid(grid: Grid) {
        this.grid = grid;
    }

    public setProps(props: TableProps) {
        this.props = props;
    }

    public setState(state: TableState) {
        this.state = state;
    }

    // Selection
    // =========

    private selectAll = (shouldUpdateFocusedCell: boolean) => {
        const selectionHandler = this.tableHandlers.getEnabledSelectionHandler(RegionCardinality.FULL_TABLE);
        // clicking on upper left hand corner sets selection to "all"
        // regardless of current selection state (clicking twice does not deselect table)
        selectionHandler([Regions.table()]);

        if (shouldUpdateFocusedCell) {
            const newFocusedCellCoordinates = Regions.getFocusCellCoordinatesFromRegion(Regions.table());
            this.tableHandlers.handleFocus(FocusedCellUtils.toFullCoordinates(newFocusedCellCoordinates));
        }
    };

    public handleSelectAllHotkey = (e: KeyboardEvent) => {
        // prevent "real" select all from happening as well
        e.preventDefault();
        e.stopPropagation();

        // selecting-all via the keyboard should not move the focused cell.
        this.selectAll(false);
    };

    public handleSelectionResizeUp = (e: KeyboardEvent) => this.handleSelectionResize(e, Direction.UP);

    public handleSelectionResizeDown = (e: KeyboardEvent) => this.handleSelectionResize(e, Direction.DOWN);

    public handleSelectionResizeLeft = (e: KeyboardEvent) => this.handleSelectionResize(e, Direction.LEFT);

    public handleSelectionResizeRight = (e: KeyboardEvent) => this.handleSelectionResize(e, Direction.RIGHT);

    private handleSelectionResize = (e: KeyboardEvent, direction: Direction) => {
        e.preventDefault();
        e.stopPropagation();

        const { focusedCell, selectedRegions } = this.state;
        const index = FocusedCellUtils.getFocusedOrLastSelectedIndex(selectedRegions, focusedCell);

        if (index === undefined) {
            return;
        }

        const region = selectedRegions[index];
        const nextRegion = SelectionUtils.resizeRegion(region, direction, focusedCell);

        this.updateSelectedRegionAtIndex(nextRegion, index);
    };

    /**
     * Replaces the selected region at the specified array index, with the
     * region provided.
     */
    private updateSelectedRegionAtIndex(region: Region, index: number) {
        const { children, numRows } = this.props;
        const { selectedRegions } = this.state;
        const numColumns = React.Children.count(children);

        const maxRowIndex = Math.max(0, numRows! - 1);
        const maxColumnIndex = Math.max(0, numColumns - 1);
        const clampedNextRegion = Regions.clampRegion(region, maxRowIndex, maxColumnIndex);

        const nextSelectedRegions = Regions.update(selectedRegions, clampedNextRegion, index);
        this.tableHandlers.handleSelection(nextSelectedRegions);
    }

    // Focus
    // =====

    public handleFocusMoveLeft = (e: KeyboardEvent) => this.handleFocusMove(e, "left");

    public handleFocusMoveLeftInternal = (e: KeyboardEvent) => this.handleFocusMoveInternal(e, "left");

    public handleFocusMoveRight = (e: KeyboardEvent) => this.handleFocusMove(e, "right");

    public handleFocusMoveRightInternal = (e: KeyboardEvent) => this.handleFocusMoveInternal(e, "right");

    public handleFocusMoveUp = (e: KeyboardEvent) => this.handleFocusMove(e, "up");

    public handleFocusMoveUpInternal = (e: KeyboardEvent) => this.handleFocusMoveInternal(e, "up");

    public handleFocusMoveDown = (e: KeyboardEvent) => this.handleFocusMove(e, "down");

    public handleFocusMoveDownInternal = (e: KeyboardEvent) => this.handleFocusMoveInternal(e, "down");

    // no good way to call arrow-key keyboard events from tests
    /* istanbul ignore next */
    private handleFocusMove = (e: KeyboardEvent, direction: "up" | "down" | "left" | "right") => {
        e.preventDefault();
        e.stopPropagation();

        const { focusedCell } = this.state;
        if (focusedCell == null) {
            // halt early if we have a selectedRegionTransform or something else in play that nixes
            // the focused cell.
            return;
        }

        const newFocusedCell = {
            col: focusedCell.col,
            focusSelectionIndex: 0,
            row: focusedCell.row,
        };

        switch (direction) {
            case "up":
                newFocusedCell.row -= 1;
                break;
            case "down":
                newFocusedCell.row += 1;
                break;
            case "left":
                newFocusedCell.col -= 1;
                break;
            case "right":
                newFocusedCell.col += 1;
                break;
            default:
                break;
        }

        if (
            newFocusedCell.row < 0 ||
            newFocusedCell.row >= this.grid!.numRows ||
            newFocusedCell.col < 0 ||
            newFocusedCell.col >= this.grid!.numCols
        ) {
            return;
        }

        // change selection to match new focus cell location
        const newSelectionRegions = [Regions.cell(newFocusedCell.row, newFocusedCell.col)];
        const { selectedRegionTransform } = this.props;
        const transformedSelectionRegions =
            selectedRegionTransform != null
                ? newSelectionRegions.map(region => selectedRegionTransform(region, e))
                : newSelectionRegions;
        this.tableHandlers.handleSelection(transformedSelectionRegions);
        this.tableHandlers.handleFocus(newFocusedCell);

        // keep the focused cell in view
        this.scrollBodyToFocusedCell(newFocusedCell);
    };

    // no good way to call arrow-key keyboard events from tests
    /* istanbul ignore next */
    private handleFocusMoveInternal = (e: KeyboardEvent, direction: "up" | "down" | "left" | "right") => {
        e.preventDefault();
        e.stopPropagation();

        const { focusedCell, selectedRegions } = this.state;

        if (focusedCell == null) {
            // halt early if we have a selectedRegionTransform or something else in play that nixes
            // the focused cell.
            return;
        }

        let newFocusedCell = {
            col: focusedCell.col,
            focusSelectionIndex: focusedCell.focusSelectionIndex,
            row: focusedCell.row,
        };

        // if we're not in any particular focus cell region, and one exists, go to the first cell of the first one
        if (focusedCell.focusSelectionIndex == null && selectedRegions.length > 0) {
            const focusCellRegion = Regions.getCellRegionFromRegion(
                selectedRegions[0],
                this.grid!.numRows,
                this.grid!.numCols,
            );

            newFocusedCell = {
                col: focusCellRegion.cols[0],
                focusSelectionIndex: 0,
                row: focusCellRegion.rows[0],
            };
        } else {
            if (selectedRegions.length === 0) {
                this.handleFocusMove(e, direction);
                return;
            }

            const focusCellRegion = Regions.getCellRegionFromRegion(
                selectedRegions[focusedCell.focusSelectionIndex],
                this.grid!.numRows,
                this.grid!.numCols,
            );

            if (
                focusCellRegion.cols[0] === focusCellRegion.cols[1] &&
                focusCellRegion.rows[0] === focusCellRegion.rows[1] &&
                selectedRegions.length === 1
            ) {
                this.handleFocusMove(e, direction);
                return;
            }

            switch (direction) {
                case "up":
                    newFocusedCell = this.moveFocusCell("row", "col", true, newFocusedCell, focusCellRegion);
                    break;
                case "left":
                    newFocusedCell = this.moveFocusCell("col", "row", true, newFocusedCell, focusCellRegion);
                    break;
                case "down":
                    newFocusedCell = this.moveFocusCell("row", "col", false, newFocusedCell, focusCellRegion);
                    break;
                case "right":
                    newFocusedCell = this.moveFocusCell("col", "row", false, newFocusedCell, focusCellRegion);
                    break;
                default:
                    break;
            }
        }

        if (
            newFocusedCell.row < 0 ||
            newFocusedCell.row >= this.grid!.numRows ||
            newFocusedCell.col < 0 ||
            newFocusedCell.col >= this.grid!.numCols
        ) {
            return;
        }

        this.tableHandlers.handleFocus(newFocusedCell);

        // keep the focused cell in view
        this.scrollBodyToFocusedCell(newFocusedCell);
    };

    private scrollBodyToFocusedCell = (focusedCell: FocusedCellCoordinates) => {
        const { row, col } = focusedCell;
        const { viewportRect } = this.state;

        if (viewportRect === undefined || this.grid === undefined) {
            return;
        }

        // sort keys in normal CSS position order (per the trusty TRBL/"trouble" acronym)
        // tslint:disable:object-literal-sort-keys
        const viewportBounds = {
            top: viewportRect.top,
            right: viewportRect.left + viewportRect.width,
            bottom: viewportRect.top + viewportRect.height,
            left: viewportRect.left,
        };
        const focusedCellBounds = {
            top: this.grid.getCumulativeHeightBefore(row),
            right: this.grid.getCumulativeWidthAt(col),
            bottom: this.grid.getCumulativeHeightAt(row),
            left: this.grid.getCumulativeWidthBefore(col),
        };
        // tslint:enable:object-literal-sort-keys

        const focusedCellWidth = focusedCellBounds.right - focusedCellBounds.left;
        const focusedCellHeight = focusedCellBounds.bottom - focusedCellBounds.top;

        const isFocusedCellWiderThanViewport = focusedCellWidth > viewportRect.width;
        const isFocusedCellTallerThanViewport = focusedCellHeight > viewportRect.height;

        const ss: TableSnapshot = {};

        // keep the top end of an overly tall focused cell in view when moving left and right
        // (without this OR check, the body seesaws to fit the top end, then the bottom end, etc.)
        if (focusedCellBounds.top < viewportBounds.top || isFocusedCellTallerThanViewport) {
            // scroll up (minus one pixel to avoid clipping the focused-cell border)
            ss.nextScrollTop = Math.max(0, focusedCellBounds.top - 1);
        } else if (focusedCellBounds.bottom > viewportBounds.bottom) {
            // scroll down
            const scrollDelta = focusedCellBounds.bottom - viewportBounds.bottom;
            ss.nextScrollTop = viewportBounds.top + scrollDelta;
        }

        // keep the left end of an overly wide focused cell in view when moving up and down
        if (focusedCellBounds.left < viewportBounds.left || isFocusedCellWiderThanViewport) {
            // scroll left (again minus one additional pixel)
            ss.nextScrollLeft = Math.max(0, focusedCellBounds.left - 1);
        } else if (focusedCellBounds.right > viewportBounds.right) {
            // scroll right
            const scrollDelta = focusedCellBounds.right - viewportBounds.right;
            ss.nextScrollLeft = viewportBounds.left + scrollDelta;
        }

        this.tableHandlers.syncViewportPosition(ss);
    };

    // Quadrant refs
    // =============

    private moveFocusCell(
        primaryAxis: "row" | "col",
        secondaryAxis: "row" | "col",
        isUpOrLeft: boolean,
        newFocusedCell: FocusedCellCoordinates,
        focusCellRegion: NonNullRegion,
    ) {
        const { selectedRegions } = this.state;

        const primaryAxisPlural = primaryAxis === "row" ? "rows" : "cols";
        const secondaryAxisPlural = secondaryAxis === "row" ? "rows" : "cols";

        const movementDirection = isUpOrLeft ? -1 : +1;
        const regionIntervalIndex = isUpOrLeft ? 1 : 0;

        // try moving the cell in the direction along the primary axis
        newFocusedCell[primaryAxis] += movementDirection;

        const isPrimaryIndexOutOfBounds = isUpOrLeft
            ? newFocusedCell[primaryAxis] < focusCellRegion[primaryAxisPlural]![0]
            : newFocusedCell[primaryAxis] > focusCellRegion[primaryAxisPlural]![1];

        if (isPrimaryIndexOutOfBounds) {
            // if we moved outside the bounds of selection region,
            // move to the start (or end) of the primary axis, and move one along the secondary
            newFocusedCell[primaryAxis] = focusCellRegion[primaryAxisPlural][regionIntervalIndex];
            newFocusedCell[secondaryAxis] += movementDirection;

            const isSecondaryIndexOutOfBounds = isUpOrLeft
                ? newFocusedCell[secondaryAxis] < focusCellRegion[secondaryAxisPlural][0]
                : newFocusedCell[secondaryAxis] > focusCellRegion[secondaryAxisPlural][1];

            if (isSecondaryIndexOutOfBounds) {
                // if moving along the secondary also moves us outside
                // go to the start (or end) of the next (or previous region)
                // (note that if there's only one region you'll be moving to the opposite corner, which is fine)
                let newFocusCellSelectionIndex = newFocusedCell.focusSelectionIndex + movementDirection;

                // newFocusCellSelectionIndex should be one more (or less), unless we need to wrap around
                if (
                    isUpOrLeft ? newFocusCellSelectionIndex < 0 : newFocusCellSelectionIndex >= selectedRegions.length
                ) {
                    newFocusCellSelectionIndex = isUpOrLeft ? selectedRegions.length - 1 : 0;
                }

                const newFocusCellRegion = Regions.getCellRegionFromRegion(
                    selectedRegions[newFocusCellSelectionIndex],
                    this.grid!.numRows,
                    this.grid!.numCols,
                );

                newFocusedCell = {
                    col: newFocusCellRegion.cols[regionIntervalIndex],
                    focusSelectionIndex: newFocusCellSelectionIndex,
                    row: newFocusCellRegion.rows[regionIntervalIndex],
                };
            }
        }
        return newFocusedCell;
    }

    public handleCopy = (e: KeyboardEvent) => {
        const { getCellClipboardData, onCopy } = this.props;
        const { selectedRegions } = this.state;

        if (getCellClipboardData == null || this.grid === undefined) {
            return;
        }

        // prevent "real" copy from being called
        e.preventDefault();
        e.stopPropagation();

        const cells = Regions.enumerateUniqueCells(selectedRegions, this.grid.numRows, this.grid.numCols);
        // non-null assertion because Column.defaultProps.cellRenderer is defined
        const sparse = Regions.sparseMapCells(cells, (row, col) =>
            getCellClipboardData(row, col, this.state.childrenArray[col].props.cellRenderer!),
        );

        if (sparse != null) {
            Clipboard.copyCells(sparse)
                .then(() => onCopy?.(true))
                .catch((reason: any) => {
                    console.error(TABLE_COPY_FAILED, reason);
                    onCopy?.(false);
                });
        }
    };
}
