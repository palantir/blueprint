/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { ICellInterval, IRegion, Regions } from "../../regions";
import { IFocusedCellCoordinates } from "../cell";
import { Direction } from "../direction";
import { IMovementDelta } from "../movementDelta";
import * as FocusedCellUtils from "./focusedCellUtils";

export function modifyLastSelectedRegion(
    selectedRegions: IRegion[],
    direction: Direction,
    focusedCell?: IFocusedCellCoordinates,
) {
    const lastSelectedRegion = getLastSelectedRegion(selectedRegions);
    const delta = directionToMovementDelta(direction);

    const nextRegion: IRegion = {
        cols: lastSelectedRegion.cols.slice() as ICellInterval,
        rows: lastSelectedRegion.rows.slice() as ICellInterval,
    };

    if (focusedCell != null) {
        // TODO: Implement
    } else {
        ["rows", "cols"].forEach((dimension: "rows" | "cols") => {
            if (nextRegion[dimension] != null) {
                const deltaValue = delta[dimension];
                const affectedIndex = deltaValue < 0 ? 0 : 1;
                nextRegion[dimension][affectedIndex] += deltaValue;
            }
        });
    }

    return expandLastSelectedRegion(selectedRegions, nextRegion, focusedCell);
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

function directionToMovementDelta(direction: Direction): IMovementDelta {
    switch (direction) {
        case Direction.UP:
            return { rows: -1, cols: 0 };
        case Direction.DOWN:
            return { rows: +1, cols: 0 };
        case Direction.LEFT:
            return { rows: 0, cols: -1 };
        case Direction.RIGHT:
            return { rows: 0, cols: +1 };
        default:
            return undefined;
    }
}
