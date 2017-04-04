/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

export interface ICellCoordinates {
    col: number;
    row: number;
}

/* tslint:disable:no-empty-interface */
export interface IFocusedCellCoordinates extends ICellCoordinates {
    // more to come here
}
/* tslint:enable:no-empty-interface */
