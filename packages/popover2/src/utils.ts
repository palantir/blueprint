/*
 * Copyright 2020 Palantir Technologies, Inc. All rights reserved.
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

import { BasePlacement, Placement, State } from "@popperjs/core";

// Popper placement utils
// ======================

/** Converts a full placement to one of the four positions by stripping text after the `-`. */
export function getPosition(placement: Placement) {
    return placement.split("-")[0] as BasePlacement;
}

/** Returns true if position is left or right. */
export function isVerticalPosition(side: BasePlacement) {
    return ["left", "right"].indexOf(side) !== -1;
}

/** Returns the opposite position. */
export function getOppositePosition(side: BasePlacement) {
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
export function getAlignment(placement: BasePlacement) {
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
export function getTransformOrigin(placement: Placement, arrowStyles: { left: number; top: number } | undefined) {
    const position = getPosition(placement);
    if (arrowStyles === undefined) {
        return isVerticalPosition(position)
            ? `${getOppositePosition(position)} ${getAlignment(position)}`
            : `${getAlignment(position)} ${getOppositePosition(position)}`;
    } else {
        // const arrowSizeShift = state.elements.arrow.clientHeight / 2;
        const arrowSizeShift = 30 / 2;
        // can use keyword for dimension without the arrow, to ease computation burden.
        // move origin by half arrow's height to keep it centered.
        return isVerticalPosition(position)
            ? `${getOppositePosition(position)} ${arrowStyles.top + arrowSizeShift}px`
            : `${arrowStyles.left + arrowSizeShift}px ${getOppositePosition(position)}`;
    }
}

// additional space between arrow and edge of target
const ARROW_SPACING = 4;

/** Popper modifier that offsets popper and arrow so arrow points out of the correct side */
export const arrowOffsetModifier: (state: State) => State = state => {
    if (state.elements.arrow == null) {
        return state;
    }
    // our arrows have equal width and height
    const arrowSize = state.elements.arrow.clientWidth;
    // this logic borrowed from original Popper arrow modifier itself
    const position = getPosition(state.placement);
    const isVertical = isVerticalPosition(position);
    const len = isVertical ? "width" : "height";
    const offsetSide = isVertical ? "left" : "top";

    const arrowOffsetSize = Math.round(arrowSize / 2 / Math.sqrt(2));
    // offset popover by arrow size, offset arrow in the opposite direction
    if (position === "top" || position === "left") {
        // the "up & back" directions require negative popper offsets
        state.modifiersData.offsets.popper[offsetSide] -= arrowOffsetSize + ARROW_SPACING;
        // can only use left/top on arrow so gotta get clever with 100% + X
        state.modifiersData.offsets.arrow[offsetSide] =
            state.modifiersData.offsets.popper[len] - arrowSize + arrowOffsetSize;
    } else {
        state.modifiersData.offsets.popper[offsetSide] += arrowOffsetSize + ARROW_SPACING;
        state.modifiersData.offsets.arrow[offsetSide] = -arrowOffsetSize;
    }
    return state;
};
