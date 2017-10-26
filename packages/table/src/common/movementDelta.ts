/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

export interface IMovementDelta {
    /** The number of rows by which to move. */
    rows: number;

    /** The number of columns by which to move. */
    cols: number;
}
