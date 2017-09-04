/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { IRegion, Regions } from "../../regions";
import { IFocusedCellCoordinates } from "../cell";

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
        // focus the top-left cell of the first selection
        return {
            ...Regions.getFocusCellCoordinatesFromRegion(selectedRegions[0]),
            focusSelectionIndex: 0,
        };
    } else {
        // focus the top-left cell of the table
        return { col: 0, row: 0, focusSelectionIndex: 0 };
    }
}

/**
 * Expands a set of selected regions to a new region in accordance with the
 * current location of the focused cell.
 *
 * @param focusedCell the currently focused cell
 * @param selectedRegions the currently selected regions
 * @param newRegion the new region to expand to
 */
export function expandSelectedRegions(
    focusedCell: IFocusedCellCoordinates,
    selectedRegions: IRegion[],
    newRegion: IRegion,
): IRegion[] {
    // TODO
    return null;
}
