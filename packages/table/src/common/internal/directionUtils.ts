/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Direction } from "../direction";
import { IMovementDelta } from "../movementDelta";

export function directionToDelta(direction: Direction): IMovementDelta {
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
