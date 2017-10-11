/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { IRegion, Regions } from "../../regions";
import { IFocusedCellCoordinates } from "../cell";
import * as FocusedCellUtils from "./focusedCellUtils";

/**
 * Expands the last-selected region to the new region, and replaces the
 * last-selected region with the expanded region. If a focused cell is provided,
 * the focused cell will serve as an anchor for the expansion.
 */
export function expandLastSelectedRegion(
    selectedRegions: IRegion[],
    newRegion: IRegion,
    focusedCell?: IFocusedCellCoordinates,
) {
    if (selectedRegions.length === 0) {
        return [newRegion];
    } else if (focusedCell != null) {
        const expandedRegion = FocusedCellUtils.expandFocusedRegion(focusedCell, newRegion);
        return Regions.update(selectedRegions, expandedRegion);
    } else {
        const expandedRegion = Regions.expandRegion(selectedRegions[selectedRegions.length - 1], newRegion);
        return Regions.update(selectedRegions, expandedRegion);
    }
}
