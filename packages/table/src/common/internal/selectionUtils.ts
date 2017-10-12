/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { IRegion, RegionCardinality, Regions } from "../../regions";
import { IFocusedCellCoordinates } from "../cell";
import { Direction } from "../direction";
import * as DirectionUtils from "./directionUtils";
import * as FocusedCellUtils from "./focusedCellUtils";

export function resizeSelectedRegion(region: IRegion, direction: Direction, focusedCell?: IFocusedCellCoordinates) {
    if (Regions.getRegionCardinality(region) === RegionCardinality.FULL_TABLE) {
        // return the same instance to maintain referential integrity and avoid
        // unnecessary updates.
        return region;
    }

    const nextRegion: IRegion = Regions.copy(region);

    let affectedRowIndex: number = 0;
    let affectedColumnIndex: number = 0;

    if (focusedCell != null) {
        const isAtTop = FocusedCellUtils.isFocusedCellAtRegionTop(nextRegion, focusedCell);
        const isAtBottom = FocusedCellUtils.isFocusedCellAtRegionBottom(nextRegion, focusedCell);
        const isAtLeft = FocusedCellUtils.isFocusedCellAtRegionLeft(nextRegion, focusedCell);
        const isAtRight = FocusedCellUtils.isFocusedCellAtRegionRight(nextRegion, focusedCell);

        // note the special case when the focused cell is in a region that is
        // only 1 row wide or 1 column wide.
        if (direction === Direction.UP) {
            affectedRowIndex = isAtTop && !isAtBottom ? 1 : 0;
        } else if (direction === Direction.DOWN) {
            affectedRowIndex = isAtBottom && !isAtTop ? 0 : 1;
        } else if (direction === Direction.LEFT) {
            affectedColumnIndex = isAtLeft && !isAtRight ? 1 : 0;
        } else {
            // i.e. `Direction.RIGHT:`
            affectedColumnIndex = isAtRight && !isAtLeft ? 0 : 1;
        }
    } else {
        affectedRowIndex = direction === Direction.DOWN ? 1 : 0;
        affectedColumnIndex = direction === Direction.RIGHT ? 1 : 0;
    }

    const delta = DirectionUtils.directionToDelta(direction);

    if (nextRegion.rows != null) {
        nextRegion.rows[affectedRowIndex] += delta.rows;
    }
    if (nextRegion.cols != null) {
        nextRegion.cols[affectedColumnIndex] += delta.cols;
    }

    // the new coordinates might be out of bounds. the caller is responsible for
    // sanitizing the result.
    return nextRegion;
}

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

/**
 * Returns the last region in the provided `selectedRegions` array, or `undefined`.
 */
export function getLastSelectedRegion(selectedRegions: IRegion[]) {
    return selectedRegions == null || selectedRegions.length === 0
        ? undefined
        : selectedRegions[selectedRegions.length - 1];
}
