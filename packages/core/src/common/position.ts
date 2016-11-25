/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

export enum Position {
    TOP_LEFT,
    TOP,
    TOP_RIGHT,
    RIGHT_TOP,
    RIGHT,
    RIGHT_BOTTOM,
    BOTTOM_RIGHT,
    BOTTOM,
    BOTTOM_LEFT,
    LEFT_BOTTOM,
    LEFT,
    LEFT_TOP,
}

export function isPositionHorizontal(position: Position) {
    /* istanbul ignore next */
    return position === Position.TOP || position === Position.TOP_LEFT || position === Position.TOP_RIGHT
        || position === Position.BOTTOM || position === Position.BOTTOM_LEFT || position === Position.BOTTOM_RIGHT;
}

export function isPositionVertical(position: Position) {
    /* istanbul ignore next */
    return position === Position.LEFT || position === Position.LEFT_TOP || position === Position.LEFT_BOTTOM
        || position === Position.RIGHT || position === Position.RIGHT_TOP || position === Position.RIGHT_BOTTOM;
}
