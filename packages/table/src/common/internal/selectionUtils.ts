/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { IRegion, RegionCardinality, Regions } from "../../regions";
import { IFocusedCellCoordinates } from "../cell";
import { Direction } from "../direction";
import { IMovementDelta } from "../movementDelta";
import * as FocusedCellUtils from "./focusedCellUtils";

export function resizeLastSelectedRegion(
    selectedRegions: IRegion[],
    direction: Direction,
    focusedCell?: IFocusedCellCoordinates,
) {
    const lastSelectedRegion = getLastSelectedRegion(selectedRegions);
    const cardinality = Regions.getRegionCardinality(lastSelectedRegion);
    const delta = directionToMovementDelta(direction);

    if (cardinality === RegionCardinality.FULL_TABLE) {
        return selectedRegions;
    }

    const nextRegion: IRegion = Regions.copy(lastSelectedRegion);

    if (focusedCell != null) {
        const isAtTop = FocusedCellUtils.isFocusedCellAtRegionTop(nextRegion, focusedCell);
        const isAtBottom = FocusedCellUtils.isFocusedCellAtRegionBottom(nextRegion, focusedCell);
        const isAtLeft = FocusedCellUtils.isFocusedCellAtRegionLeft(nextRegion, focusedCell);
        const isAtRight = FocusedCellUtils.isFocusedCellAtRegionRight(nextRegion, focusedCell);

        if (direction === Direction.UP && cardinality !== RegionCardinality.FULL_COLUMNS) {
            if (isAtTop && !isAtBottom) {
                // move the bottom up
                nextRegion.rows[1] += delta.rows;
            } else {
                // move the top up
                nextRegion.rows[0] += delta.rows;
            }
            nextRegion.rows[0] = Math.max(0, nextRegion.rows[0]);
            nextRegion.rows[1] = Math.max(0, nextRegion.rows[1]);
        } else if (direction === Direction.DOWN && cardinality !== RegionCardinality.FULL_COLUMNS) {
            if (isAtBottom && !isAtTop) {
                // move the top down
                nextRegion.rows[0] += delta.rows;
            } else {
                // move the bottom down
                nextRegion.rows[1] += delta.rows;
            }
            nextRegion.rows[0] = Math.max(0, nextRegion.rows[0]);
            nextRegion.rows[1] = Math.max(0, nextRegion.rows[1]);
        } else if (direction === Direction.LEFT && cardinality !== RegionCardinality.FULL_ROWS) {
            if (isAtLeft && !isAtRight) {
                // move the right side left
                nextRegion.cols[1] += delta.cols;
            } else {
                // move the left side left
                nextRegion.cols[0] += delta.cols;
            }
            nextRegion.cols[0] = Math.max(0, nextRegion.cols[0]);
            nextRegion.cols[1] = Math.max(0, nextRegion.cols[1]);
        } else if (direction === Direction.RIGHT && cardinality !== RegionCardinality.FULL_ROWS) {
            if (isAtRight && !isAtLeft) {
                // move the left side right
                nextRegion.cols[0] += delta.cols;
            } else {
                // move the right side right
                nextRegion.cols[1] += delta.cols;
            }
            nextRegion.cols[0] = Math.max(0, nextRegion.cols[0]);
            nextRegion.cols[1] = Math.max(0, nextRegion.cols[1]);
        }
    } else {
        ["rows", "cols"].forEach((dimension: "rows" | "cols") => {
            if (nextRegion[dimension] != null) {
                const deltaValue = delta[dimension];
                const affectedIndex = deltaValue < 0 ? 0 : 1;
                nextRegion[dimension][affectedIndex] += deltaValue;
            }
        });
    }

    return Regions.update(selectedRegions, nextRegion);
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
