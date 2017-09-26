/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { IRegion, RegionCardinality, Regions } from "../../regions";
import { ICellCoordinates, IFocusedCellCoordinates } from "../cell";
import * as Errors from "../errors";

/**
 * Returns the proper focused cell for the given set of initial conditions.
 */
export function getInitialFocusedCell(
    enableFocus: boolean,
    focusedCellFromProps: IFocusedCellCoordinates,
    focusedCellFromState: IFocusedCellCoordinates,
    selectedRegions: IRegion[],
): IFocusedCellCoordinates {
    if (!enableFocus) {
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
