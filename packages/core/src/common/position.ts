/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

export enum Position {
    TOP_LEFT = "top_left",
    TOP = "top",
    TOP_RIGHT = "top_right",
    RIGHT_TOP = "right_top",
    RIGHT = "right",
    RIGHT_BOTTOM = "right_bottom",
    BOTTOM_RIGHT = "bottom_right",
    BOTTOM = "bottom",
    BOTTOM_LEFT = "bottom_left",
    LEFT_BOTTOM = "left_bottom",
    LEFT = "left",
    LEFT_TOP = "left_top",
}

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
