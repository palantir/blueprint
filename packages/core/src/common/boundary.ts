/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

/** Boundary of a one-dimensional interval. */
export const Boundary = {
    START: "start" as "start",
    // tslint:disable-next-line:object-literal-sort-keys
    END: "end" as "end",
};
export type Boundary = typeof Boundary[keyof typeof Boundary];
