/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { IRegion, Regions } from "../../regions";
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
    // const cardinality = Regions.getRegionCardinality(lastSelectedRegion);
    const delta = directionToMovementDelta(direction);

    // const expansionDestinationRegion: IRegion = {};

    // if (cardinality === RegionCardinality.FULL_COLUMNS) {
    //     if (direction === Direction.LEFT) {
    //         expansionDestinationRegion.cols[0] += ;
    //     }
    // }

    const nextRegion: IRegion = { ...lastSelectedRegion };

    if (focusedCell != null) {
        // TODO: Implement
    } else {
        // the region sans focused cell can never shrink
        const affectedRowIndex = getIndexToModify(delta.rows);
        const affectedColumnIndex = getIndexToModify(delta.cols);

        if (nextRegion.rows != null) {
            nextRegion.rows[affectedRowIndex] += delta.rows;
        }
        if (nextRegion.cols != null) {
            nextRegion.cols[affectedColumnIndex] += delta.cols;
        }
    }

    return nextRegion;
    // TODO: Implement
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

// function getModifiedRegion(region: IRegion, delta: IMovementDelta, focusedCell?: IFocusedCellCoordinates) {
//     if (region == null) {
//         return undefined;
//     }

//     const nextRegion: IRegion = { ...region };

//     if (focusedCell != null) {
//         // TODO: Implement
//     } else {
//         // the region sans focused cell can never shrink
//         const affectedRowIndex = getIndexToModify(delta.rows);
//         const affectedColumnIndex = getIndexToModify(delta.cols);

//         if (nextRegion.rows != null) {
//             nextRegion.rows[affectedRowIndex] += delta.rows;
//         }
//         if (nextRegion.cols != null) {
//             nextRegion.cols[affectedColumnIndex] += delta.cols;
//         }
//     }

//     return nextRegion;
// }

function getIndexToModify(deltaValue: number) {
    const START = 0;
    const END = 1;
    return deltaValue < 0 ? START : END;
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
