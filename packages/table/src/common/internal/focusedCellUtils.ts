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

import { IRegion, RegionCardinality, Regions } from "../../regions";
import { ICellCoordinates, IFocusedCellCoordinates } from "../cell";
import * as Errors from "../errors";

/**
 * Returns the `focusedSelectionIndex` if both the focused cell and that
 * property are defined, or the last index of `selectedRegions` otherwise. If
 * `selectedRegions` is empty, the function always returns `undefined`.
 */
export function getFocusedOrLastSelectedIndex(selectedRegions: IRegion[], focusedCell?: IFocusedCellCoordinates) {
    if (selectedRegions.length === 0) {
        return undefined;
    } else if (focusedCell != null) {
        return focusedCell.focusSelectionIndex;
    } else {
        return selectedRegions.length - 1;
    }
}

/**
 * Returns the proper focused cell for the given set of initial conditions.
 */
export function getInitialFocusedCell(
    enableFocusedCell: boolean,
    focusedCellFromProps: IFocusedCellCoordinates,
    focusedCellFromState: IFocusedCellCoordinates,
    selectedRegions: IRegion[],
): IFocusedCellCoordinates {
    if (!enableFocusedCell) {
        return undefined;
    } else if (focusedCellFromProps != null) {
        // controlled mode
        return focusedCellFromProps;
    } else if (focusedCellFromState != null) {
        // use the current focused cell from state
        return focusedCellFromState;
    } else if (selectedRegions.length > 0) {
        // focus the top-left cell of the last selection
        const lastIndex = selectedRegions.length - 1;
        return {
            ...Regions.getFocusCellCoordinatesFromRegion(selectedRegions[lastIndex]),
            focusSelectionIndex: lastIndex,
        };
    } else {
        // focus the top-left cell of the table
        return { col: 0, row: 0, focusSelectionIndex: 0 };
    }
}

/**
 * Returns `true` if the focused cell is located along the top boundary of the
 * provided region, or `false` otherwise.
 */
export function isFocusedCellAtRegionTop(region: IRegion, focusedCell: IFocusedCellCoordinates) {
    return region.rows != null && focusedCell.row === region.rows[0];
}

/**
 * Returns `true` if the focused cell is located along the bottom boundary of
 * the provided region, or `false` otherwise.
 */
export function isFocusedCellAtRegionBottom(region: IRegion, focusedCell: IFocusedCellCoordinates) {
    return region.rows != null && focusedCell.row === region.rows[1];
}

/**
 * Returns `true` if the focused cell is located along the left boundary of the
 * provided region, or `false` otherwise.
 */
export function isFocusedCellAtRegionLeft(region: IRegion, focusedCell: IFocusedCellCoordinates) {
    return region.cols != null && focusedCell.col === region.cols[0];
}

/**
 * Returns `true` if the focused cell is located along the right boundary of the
 * provided region, or `false` otherwise.
 */
export function isFocusedCellAtRegionRight(region: IRegion, focusedCell: IFocusedCellCoordinates) {
    return region.cols != null && focusedCell.col === region.cols[1];
}

/**
 * Returns a new cell-coordinates object that includes a focusSelectionIndex property.
 * The returned object will have the proper IFocusedCellCoordinates type.
 */
export function toFullCoordinates(
    cellCoords: ICellCoordinates,
    focusSelectionIndex: number = 0,
): IFocusedCellCoordinates {
    return { ...cellCoords, focusSelectionIndex };
}

/**
 * Expands an existing region to new region based on the current focused cell.
 * The focused cell is an invariant and should not move as a result of this
 * operation. This function is used, for instance, to expand a selected region
 * on shift+click.
 */
export function expandFocusedRegion(focusedCell: IFocusedCellCoordinates, newRegion: IRegion) {
    switch (Regions.getRegionCardinality(newRegion)) {
        case RegionCardinality.FULL_COLUMNS: {
            const [indexStart, indexEnd] = getExpandedRegionIndices(focusedCell, newRegion, "col", "cols");
            return Regions.column(indexStart, indexEnd);
        }
        case RegionCardinality.FULL_ROWS: {
            const [indexStart, indexEnd] = getExpandedRegionIndices(focusedCell, newRegion, "row", "rows");
            return Regions.row(indexStart, indexEnd);
        }
        case RegionCardinality.CELLS:
            const [rowIndexStart, rowIndexEnd] = getExpandedRegionIndices(focusedCell, newRegion, "row", "rows");
            const [colIndexStart, colIndexEnd] = getExpandedRegionIndices(focusedCell, newRegion, "col", "cols");
            return Regions.cell(rowIndexStart, colIndexStart, rowIndexEnd, colIndexEnd);
        default:
            // i.e. `case RegionCardinality.FULL_TABLE:`
            return Regions.table();
    }
}

function getExpandedRegionIndices(
    focusedCell: IFocusedCellCoordinates,
    newRegion: IRegion,
    focusedCellDimension: "row" | "col",
    regionDimension: "rows" | "cols",
) {
    const sourceIndex = focusedCell[focusedCellDimension];
    const [destinationIndex, destinationIndexEnd] = newRegion[regionDimension];

    if (destinationIndex !== destinationIndexEnd) {
        if (regionDimension === "rows") {
            throw new Error(Errors.TABLE_EXPAND_FOCUSED_REGION_MULTI_ROW_REGION);
        } else if (regionDimension === "cols") {
            throw new Error(Errors.TABLE_EXPAND_FOCUSED_REGION_MULTI_COLUMN_REGION);
        }
    }

    return sourceIndex <= destinationIndex ? [sourceIndex, destinationIndex] : [destinationIndex, sourceIndex];
}
