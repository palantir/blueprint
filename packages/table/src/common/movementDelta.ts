/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

export interface IMovementDelta {
    /**
     * The number of rows by which to move.
     */
    rows: number;

    /**
     * The number of columns by which to move.
     */
    cols: number;
}
