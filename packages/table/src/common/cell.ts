/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

export interface ICellCoordinates {
    col: number;
    row: number;
}

export interface IFocusedCellCoordinates extends ICellCoordinates {
    focusSelectionIndex: number;
}
