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
import { IFocusedCellCoordinates } from "../cell";
import { Direction } from "../direction";
import * as DirectionUtils from "./directionUtils";
import * as FocusedCellUtils from "./focusedCellUtils";

/**
 * Resizes the provided region by 1 row/column in the specified direction,
 * returning a new region instance. The region may either expand *or* contract
 * depending on the presence and location of the focused cell.
 *
 * If no focused cell is provided, the region will always be *expanded* in the
 * specified direction.
 *
 * If a focused cell *is* provided, the behavior will change depending on where
 * the focused cell is within the region:
 *
 *   1. If along a top/bottom boundary while resizing UP/DOWN, the resize will
 *      expand from or shrink to the focused cell (same if along a left/right
 *      boundary while moving LEFT/RIGHT).
 *   2. If *not* along a top/bottom boundary while resizing UP/DOWN (or if *not*
 *      along a left/right boundary while moving LEFT/RIGHT), the region will
 *      simply expand in the specified direction.
 *
 * Other notes:
 * - A CELLS region can be resized vertically or horizontally.
 * - A FULL_ROWS region can be resized only vertically.
 * - A FULL_COLUMNS region can be resized only horizontally.
 * - A FULL_TABLE region cannot be resized.
 *
 * This function does not clamp the indices of the returned region; that is the
 * responsibility of the caller.
 */
export function resizeRegion(region: IRegion, direction: Direction, focusedCell?: IFocusedCellCoordinates) {
    if (Regions.getRegionCardinality(region) === RegionCardinality.FULL_TABLE) {
        // return the same instance to maintain referential integrity and
        // possibly avoid unnecessary update lifecycles.
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

        // the focused cell is found along the top and bottom boundary
        // simultaneously when the region is 1 row tall. check for this and
        // similar special cases.
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
        // when there is no focused cell, expand in the specified direction.
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
