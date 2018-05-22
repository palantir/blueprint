/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

// tslint:disable:object-literal-sort-keys
export const Elevation = {
    ZERO: 0 as 0,
    ONE: 1 as 1,
    TWO: 2 as 2,
    THREE: 3 as 3,
    FOUR: 4 as 4,
};
export type Elevation = typeof Elevation[keyof typeof Elevation];
