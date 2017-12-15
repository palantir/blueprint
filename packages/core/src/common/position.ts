/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

export enum Position {
    TOP_LEFT = "top-left",
    TOP = "top",
    TOP_RIGHT = "top-right",
    RIGHT_TOP = "right-top",
    RIGHT = "right",
    RIGHT_BOTTOM = "right-bottom",
    BOTTOM_RIGHT = "bottom-right",
    BOTTOM = "bottom",
    BOTTOM_LEFT = "bottom-left",
    LEFT_BOTTOM = "left-bottom",
    LEFT = "left",
    LEFT_TOP = "left-top",
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
