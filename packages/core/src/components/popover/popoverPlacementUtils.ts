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

import type { Placement } from "@popperjs/core";

import { PopoverPosition } from "./popoverPosition";

/**
 * Convert a position to a placement.
 *
 * @param position the position to convert
 */
export function positionToPlacement(position: PopoverPosition): Placement {
    /* istanbul ignore next */
    switch (position) {
        case PopoverPosition.TOP_LEFT:
            return "top-start";
        case PopoverPosition.TOP:
            return "top";
        case PopoverPosition.TOP_RIGHT:
            return "top-end";
        case PopoverPosition.RIGHT_TOP:
            return "right-start";
        case PopoverPosition.RIGHT:
            return "right";
        case PopoverPosition.RIGHT_BOTTOM:
            return "right-end";
        case PopoverPosition.BOTTOM_RIGHT:
            return "bottom-end";
        case PopoverPosition.BOTTOM:
            return "bottom";
        case PopoverPosition.BOTTOM_LEFT:
            return "bottom-start";
        case PopoverPosition.LEFT_BOTTOM:
            return "left-end";
        case PopoverPosition.LEFT:
            return "left";
        case PopoverPosition.LEFT_TOP:
            return "left-start";
        case "auto":
        case "auto-start":
        case "auto-end":
            // Return the string unchanged.
            return position;
        default:
            return assertNever(position);
    }
}

/* istanbul ignore next */
function assertNever(x: never): never {
    throw new Error("Unexpected position: " + x);
}
