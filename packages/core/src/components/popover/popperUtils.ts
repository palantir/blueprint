/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
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

import type { BasePlacement, Placement } from "@popperjs/core";

export { placements as PopperPlacements } from "@popperjs/core";

// Popper placement utils
// ======================

/** Converts a full placement to one of the four positions by stripping text after the `-`. */
export function getBasePlacement(placement: Placement) {
    return placement.split("-")[0] as BasePlacement;
}

/** Returns true if position is left or right. */
export function isVerticalPlacement(side: BasePlacement) {
    return ["left", "right"].indexOf(side) !== -1;
}

/** Returns the opposite position. */
export function getOppositePlacement(side: BasePlacement) {
    switch (side) {
        case "top":
            return "bottom";
        case "left":
            return "right";
        case "bottom":
            return "top";
        default:
            return "left";
    }
}

/** Returns the CSS alignment keyword corresponding to given placement. */
export function getAlignment(placement: Placement) {
    const align = placement.split("-")[1] as "start" | "end" | undefined;
    switch (align) {
        case "start":
            return "left";
        case "end":
            return "right";
        default:
            return "center";
    }
}

// Popper modifiers
// ================

/** Modifier helper function to compute popper transform-origin based on arrow position */
export function getTransformOrigin(placement: Placement, arrowStyles: { left: string; top: string } | undefined) {
    const basePlacement = getBasePlacement(placement);
    if (arrowStyles === undefined) {
        return isVerticalPlacement(basePlacement)
            ? `${getOppositePlacement(basePlacement)} ${getAlignment(basePlacement)}`
            : `${getAlignment(basePlacement)} ${getOppositePlacement(basePlacement)}`;
    } else {
        // const arrowSizeShift = state.elements.arrow.clientHeight / 2;
        const arrowSizeShift = 30 / 2;
        // can use keyword for dimension without the arrow, to ease computation burden.
        // move origin by half arrow's height to keep it centered.
        return isVerticalPlacement(basePlacement)
            ? `${getOppositePlacement(basePlacement)} ${parseInt(arrowStyles.top, 10) + arrowSizeShift}px`
            : `${parseInt(arrowStyles.left, 10) + arrowSizeShift}px ${getOppositePlacement(basePlacement)}`;
    }
}
