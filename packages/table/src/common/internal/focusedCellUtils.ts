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
import {
    type CellCoordinates,
    type FocusedCell,
    type FocusedCellCoordinates,
    type FocusedRegion,
    type FocusedRow,
    FocusMode,
} from "../cellTypes";
import * as Errors from "../errors";

/**
 * Returns the inferred focus mode from the table props. This prefers the new focus mode API, falling back to the
 * deprecated enableFocusedCell API if that is not provided.
 */
export function getFocusModeFromProps(props: TableProps): FocusMode | undefined {
    // eslint-disable-next-line deprecation/deprecation
    const { enableFocusedCell, focusMode } = props;
    return focusMode ?? getFocusModeFromEnabled(enableFocusedCell);
}

function getFocusModeFromEnabled(enableFocusedCell = false): FocusMode | undefined {
    return enableFocusedCell ? FocusMode.CELL : undefined;
}

/**
 * Returns the inferred focused region from the table props. This prefers the new focus mode API, falling back to the
 * deprecated API if a focused region is not provided.
 */
export function getFocusedRegionFromProps(props: TableProps): FocusedRegion | undefined {
    // eslint-disable-next-line deprecation/deprecation
    const { focusedRegion, focusedCell } = props;
    return focusedRegion ?? getFocusedCellFromCoordinates(focusedCell);
}

export function getFocusedCellFromCoordinates(
    focusedCell: FocusedCellCoordinates | undefined,
): FocusedCell | undefined {
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
 * Returns the proper focused region for the given set of initial conditions.
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
        return { col: 0, focusSelectionIndex: 0, row: 0, type: FocusMode.CELL };
    }
    const lastIndex = selectedRegions.length - 1;
    // focus the top-left cell of the last selection
    return {
        ...Regions.getFocusCellCoordinatesFromRegion(selectedRegions[lastIndex]),
        focusSelectionIndex: lastIndex,
        type: FocusMode.CELL,
    };
}

/**
 * Returns a focused region that matches the given focus mode if possible. If such a conversion is not possible,
 * returns undefined instead.
 */
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
 * Returns `true` if the focused region is located along the top boundary of the
 * provided region, or `false` otherwise.
 */
export function isFocusAtRegionTop(region: Region, focusedRegion: FocusedRegion) {
    return region.rows != null && focusedRegion.row === region.rows[0];
}

/**
 * Returns `true` if the focused region is located along the bottom boundary of
 * the provided region, or `false` otherwise.
 */
export function isFocusAtRegionBottom(region: Region, focusedRegion: FocusedRegion) {
    return region.rows != null && focusedRegion.row === region.rows[1];
}

/**
 * Returns `true` if the focused region is located along the left boundary of the
 * provided region, or `false` otherwise.
 */
export function isFocusAtRegionLeft(region: Region, focusedRegion: FocusedRegion) {
    return region.cols != null && getFocusedColumn(focusedRegion) === region.cols[0];
}

/**
 * Returns `true` if the focused region is located along the right boundary of the
 * provided region, or `false` otherwise.
 */
export function isFocusAtRegionRight(region: Region, focusedRegion: FocusedRegion) {
    return region.cols != null && getFocusedColumn(focusedRegion) === region.cols[1];
}

/**
 * Returns the column associated with this region, if there is one.
 */
export function getFocusedColumn(focusedRegion: FocusedRegion): number | undefined {
    switch (focusedRegion.type) {
        case FocusMode.CELL:
            return focusedRegion.col;
        case FocusMode.ROW:
            return undefined;
    }
}

/**
 * Returns a new focused region object in the given focus mode that includes a focusSelectionIndex property.
 */
export function toFocusedRegion(
    focusMode: FocusMode.CELL,
    cellCoords: CellCoordinates,
    focusSelectionIndex?: number,
): FocusedCell;
export function toFocusedRegion(
    focusMode: FocusMode.ROW,
    cellCoords: CellCoordinates,
    focusSelectionIndex?: number,
): FocusedRow;
export function toFocusedRegion(
    focusMode: FocusMode | undefined,
    cellCoords: CellCoordinates,
    focusSelectionIndex?: number,
): FocusedRegion | undefined;
export function toFocusedRegion(
    focusMode: FocusMode | undefined,
    cellCoords: CellCoordinates,
    focusSelectionIndex: number = 0,
): FocusedRegion | undefined {
    switch (focusMode) {
        case FocusMode.CELL:
            return { type: FocusMode.CELL, ...cellCoords, focusSelectionIndex };
        case FocusMode.ROW:
            return { focusSelectionIndex, row: cellCoords.row, type: FocusMode.ROW };
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

export function areFocusedRegionsEqual(left: FocusedRegion, right: FocusedRegion) {
    if (left.type === FocusMode.CELL && right.type === FocusMode.CELL) {
        return left.row === right.row && left.col === right.col;
    } else if (left.type === FocusMode.ROW && right.type === FocusMode.ROW) {
        return left.row === right.row;
    } else {
        return false;
    }
}
