/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
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

export const Position = {
    BOTTOM: "bottom" as "bottom",
    BOTTOM_LEFT: "bottom-left" as "bottom-left",
    BOTTOM_RIGHT: "bottom-right" as "bottom-right",
    LEFT: "left" as "left",
    LEFT_BOTTOM: "left-bottom" as "left-bottom",
    LEFT_TOP: "left-top" as "left-top",
    RIGHT: "right" as "right",
    RIGHT_BOTTOM: "right-bottom" as "right-bottom",
    RIGHT_TOP: "right-top" as "right-top",
    TOP: "top" as "top",
    TOP_LEFT: "top-left" as "top-left",
    TOP_RIGHT: "top-right" as "top-right",
};
export type Position = typeof Position[keyof typeof Position];

export function isPositionHorizontal(position: Position) {
    /* istanbul ignore next */
    return (
        position === Position.TOP ||
        position === Position.TOP_LEFT ||
        position === Position.TOP_RIGHT ||
        position === Position.BOTTOM ||
        position === Position.BOTTOM_LEFT ||
        position === Position.BOTTOM_RIGHT
    );
}

export function isPositionVertical(position: Position) {
    /* istanbul ignore next */
    return (
        position === Position.LEFT ||
        position === Position.LEFT_TOP ||
        position === Position.LEFT_BOTTOM ||
        position === Position.RIGHT ||
        position === Position.RIGHT_TOP ||
        position === Position.RIGHT_BOTTOM
    );
}

export function getPositionIgnoreAngles(position: Position) {
    if (
        position === Position.TOP ||
        position === Position.TOP_LEFT ||
        position === Position.TOP_RIGHT
    ) {
        return Position.TOP;
    } else if (
        position === Position.BOTTOM ||
        position === Position.BOTTOM_LEFT ||
        position === Position.BOTTOM_RIGHT
    ) {
        return Position.BOTTOM;
    } else if (
        position === Position.LEFT ||
        position === Position.LEFT_TOP ||
        position === Position.LEFT_BOTTOM
    ) {
        return Position.LEFT;
    } else {
        return Position.RIGHT;
    }
}
