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

import { type Region, RegionCardinality, Regions } from "../../regions";
import type { TableProps } from "../../tableProps";
import { type CellCoordinates, type FocusedCellCoordinates, type FocusedRegion, FocusMode } from "../cellTypes";
import * as Errors from "../errors";

export function getFocusModeFromProps(props: TableProps): FocusMode | undefined {
    // eslint-disable-next-line deprecation/deprecation
    const { enableFocusedCell, focusMode } = props;
    return focusMode ?? getFocusModeFromEnabled(enableFocusedCell);
}

function getFocusModeFromEnabled(enableFocusedCell: boolean | undefined): FocusMode | undefined {
    return enableFocusedCell ? FocusMode.CELL : undefined;
}

export function getFocusedRegionFromProps(props: TableProps): FocusedRegion | undefined {
    // eslint-disable-next-line deprecation/deprecation
    const { focusedRegion, focusedCell } = props;
    return focusedRegion ?? getFocusedRegionFromCell(focusedCell);
}

function getFocusedRegionFromCell(focusedCell: FocusedCellCoordinates | undefined): FocusedRegion | undefined {
    return focusedCell != null ? { type: FocusMode.CELL, ...focusedCell } : undefined;
}

/**
 * Returns the `focusedSelectionIndex` if both the focused region and that
 * property are defined, or the last index of `selectedRegions` otherwise. If
 * `selectedRegions` is empty, the function always returns `undefined`.
 */
export function getFocusedOrLastSelectedIndex(selectedRegions: Region[], focusedRegion?: FocusedRegion) {
    if (selectedRegions.length === 0) {
        return undefined;
    } else if (focusedRegion != null) {
        return focusedRegion.focusSelectionIndex;
    } else {
        return selectedRegions.length - 1;
    }
}

/**
 * Returns the proper focused cell for the given set of initial conditions.
 */
export function getInitialFocusedRegion(
    focusMode: FocusMode | undefined,
    focusedRegionFromProps: FocusedRegion | undefined,
    focusedRegionFromState: FocusedRegion | undefined,
    selectedRegions: Region[],
): FocusedRegion | undefined {
    return validateFocusedRegion(
        focusMode,
        getInitialFocusedCell(focusedRegionFromProps, focusedRegionFromState, selectedRegions),
    );
}

function getInitialFocusedCell(
    focusedRegionFromProps: FocusedRegion | undefined,
    focusedRegionFromState: FocusedRegion | undefined,
    selectedRegions: Region[],
): FocusedRegion {
    return focusedRegionFromProps ?? focusedRegionFromState ?? getInitialFocusedCellFromSelection(selectedRegions);
}

function getInitialFocusedCellFromSelection(selectedRegions: Region[]): FocusedRegion {
    if (selectedRegions.length === 0) {
        return { col: 0, row: 0, focusSelectionIndex: 0, type: FocusMode.CELL };
    }
    const lastIndex = selectedRegions.length - 1;
    // focus the top-left cell of the last selection
    return {
        ...Regions.getFocusCellCoordinatesFromRegion(selectedRegions[lastIndex]),
        focusSelectionIndex: lastIndex,
        type: FocusMode.CELL,
    };
}

export function validateFocusedRegion(
    focusMode: FocusMode | undefined,
    focusedRegion: FocusedRegion,
): FocusedRegion | undefined {
    if (focusMode == null) {
        return undefined;
    }

    if (focusedRegion.type === focusMode) {
        return focusedRegion;
    }

    if (focusedRegion.type === FocusMode.CELL && focusMode === FocusMode.ROW) {
        return {
            focusSelectionIndex: focusedRegion.focusSelectionIndex,
            row: focusedRegion.row,
            type: focusMode,
        };
    }

    if (focusedRegion.type === FocusMode.ROW && focusMode === FocusMode.CELL) {
        return {
            col: 0,
            focusSelectionIndex: focusedRegion.focusSelectionIndex,
            row: focusedRegion.row,
            type: focusMode,
        };
    }

    return undefined;
}

/**
 * Returns `true` if the focused cell is located along the top boundary of the
 * provided region, or `false` otherwise.
 */
export function isFocusAtRegionTop(region: Region, focusedRegion: FocusedRegion) {
    return region.rows != null && focusedRegion.row === region.rows[0];
}

/**
 * Returns `true` if the focused cell is located along the bottom boundary of
 * the provided region, or `false` otherwise.
 */
export function isFocusAtRegionBottom(region: Region, focusedRegion: FocusedRegion) {
    return region.rows != null && getFocusedColumn(focusedRegion) === region.rows[1];
}

/**
 * Returns `true` if the focused cell is located along the left boundary of the
 * provided region, or `false` otherwise.
 */
export function isFocusAtRegionLeft(region: Region, focusedRegion: FocusedRegion) {
    return region.cols != null && getFocusedColumn(focusedRegion) === region.cols[0];
}

/**
 * Returns `true` if the focused cell is located along the right boundary of the
 * provided region, or `false` otherwise.
 */
export function isFocusAtRegionRight(region: Region, focusedRegion: FocusedRegion) {
    return region.cols != null && focusedRegion.row === region.cols[1];
}

export function getFocusedColumn(focusedRegion: FocusedRegion): number | undefined {
    switch (focusedRegion.type) {
        case FocusMode.CELL:
            return focusedRegion.col;
        case FocusMode.ROW:
            return undefined;
    }
}

/**
 * Returns a new cell-coordinates object that includes a focusSelectionIndex property.
 * The returned object will have the proper FocusedCellCoordinates type.
 */
export function toFocusedRegion(
    focusMode: FocusMode | undefined,
    cellCoords: CellCoordinates,
    focusSelectionIndex: number = 0,
): FocusedRegion | undefined {
    switch (focusMode) {
        case FocusMode.CELL:
            return { type: FocusMode.CELL, ...cellCoords, focusSelectionIndex };
        case FocusMode.ROW:
            return { type: FocusMode.ROW, row: cellCoords.row, focusSelectionIndex };
        case undefined:
            return undefined;
    }
}

/**
 * Expands an existing region to new region based on the current focused region.
 * The focused region is an invariant and should not move as a result of this
 * operation. This function is used, for instance, to expand a selected region
 * on shift+click.
 */
export function expandFocusedRegion(focusedRegion: FocusedRegion, newRegion: Region) {
    switch (Regions.getRegionCardinality(newRegion)) {
        case RegionCardinality.FULL_COLUMNS: {
            const [indexStart, indexEnd] = getExpandedRegionIndices(focusedRegion, newRegion, "col", "cols");
            return Regions.column(indexStart, indexEnd);
        }
        case RegionCardinality.FULL_ROWS: {
            const [indexStart, indexEnd] = getExpandedRegionIndices(focusedRegion, newRegion, "row", "rows");
            return Regions.row(indexStart, indexEnd);
        }
        case RegionCardinality.CELLS:
            const [rowIndexStart, rowIndexEnd] = getExpandedRegionIndices(focusedRegion, newRegion, "row", "rows");
            const [colIndexStart, colIndexEnd] = getExpandedRegionIndices(focusedRegion, newRegion, "col", "cols");
            return Regions.cell(rowIndexStart, colIndexStart, rowIndexEnd, colIndexEnd);
        default:
            // i.e. `case RegionCardinality.FULL_TABLE:`
            return Regions.table();
    }
}

function getExpandedRegionIndices(
    focusedRegion: FocusedRegion,
    newRegion: Region,
    focusedCellDimension: "row" | "col",
    regionDimension: "rows" | "cols",
) {
    const sourceIndex = focusedCellDimension === "row" ? focusedRegion.row : getFocusedColumn(focusedRegion) ?? 0; // THIS IS QUESTIONABLE AT BEST
    const [destinationIndex, destinationIndexEnd] = newRegion[regionDimension]!;

    if (destinationIndex !== destinationIndexEnd) {
        if (regionDimension === "rows") {
            throw new Error(Errors.TABLE_EXPAND_FOCUSED_REGION_MULTI_ROW_REGION);
        } else if (regionDimension === "cols") {
            throw new Error(Errors.TABLE_EXPAND_FOCUSED_REGION_MULTI_COLUMN_REGION);
        }
    }

    return sourceIndex <= destinationIndex ? [sourceIndex, destinationIndex] : [destinationIndex, sourceIndex];
}
