/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { IRegion, Regions } from "../../regions";
import { IFocusedCellCoordinates } from "../cell";

export function getInitialFocusCell(
    focusCellFromProps: IFocusedCellCoordinates,
    focusCellFromState: IFocusedCellCoordinates,
    selectedRegions: IRegion[],
) {
    if (focusCellFromProps != null) {
        // controlled mode
        return focusCellFromProps;
    } else if (focusCellFromState != null) {
        // use the current focus cell from state
        return focusCellFromState;
    } else if (selectedRegions.length > 0) {
        // focus the top-left cell of the first selection
        return {
            ...Regions.getFocusCellCoordinatesFromRegion(selectedRegions[0]),
            focusSelectionIndex: 0,
        };
    } else {
        // focus the top-left cell of the table
        return { col: 0, row: 0, focusSelectionIndex: 0 };
    }
}
