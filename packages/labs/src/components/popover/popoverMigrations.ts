/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { Position } from "@blueprintjs/core";
import { Placement } from "./popover2";

/**
 * Get the first non-undefined prop value, falling back to the specified default value.
 * @param candidates the ordered list of value candidates
 * @param defaultValue the fallback value
 */
export function resolvePropValue<T>(candidates: Array<T | undefined>, defaultValue: T): T {
    return [...candidates].reverse().reduce((prev, cur) => (cur !== undefined ? cur : prev), defaultValue);
}

/**
 * Migrate a legacy position into a placement.
 * @param position the position to convert
 */
export function migratePosition(position: Position): Placement {
    switch (position) {
        case Position.TOP_LEFT:
            return "top-start";
        case Position.TOP:
            return "top";
        case Position.TOP_RIGHT:
            return "top-end";
        case Position.RIGHT_TOP:
            return "right-start";
        case Position.RIGHT:
            return "right";
        case Position.RIGHT_BOTTOM:
            return "right-end";
        case Position.BOTTOM_RIGHT:
            return "bottom-end";
        case Position.BOTTOM:
            return "bottom";
        case Position.BOTTOM_LEFT:
            return "bottom-start";
        case Position.LEFT_BOTTOM:
            return "left-end";
        case Position.LEFT:
            return "left";
        case Position.LEFT_TOP:
            return "left-start";
        default:
            return assertNever(position);
    }
}

function assertNever(x: never): never {
    throw new Error("Unexpected position: " + x);
}
