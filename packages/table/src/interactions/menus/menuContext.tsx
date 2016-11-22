/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import { IMenuItemProps, MenuItem } from "@blueprintjs/core";
import * as React from "react";

import { Clipboard } from "../../common/clipboard";
import { ICellCoordinate, IRegion, Regions } from "../../regions";

export type IContextMenuRenderer = (context: IMenuContext) => JSX.Element;

export interface IMenuContext {
    /**
     * Returns an array of `IRegion`s that represent the user-intended context
     * of this menu. If the mouse click was on a selection, the array will
     * contain all selected regions. Otherwise it will have one `IRegion` that
     * represents the clicked cell (the same `IRegion` from `getTarget`).
     */
    getRegions: () => IRegion[];

    /**
     * Returns the list of selected `IRegion` in the table, regardless of
     * where the users clicked to launch the context menu. For the user-
     * intended regions for this context, use `getRegions` instead.
     */
    getSelectedRegions: () => IRegion[];

    /**
     * Returns a region containing the single cell that was clicked to launch
     * this context menu.
     */
    getTarget: () => IRegion;

    /**
     * Returns an array containing all of the unique, potentially non-
     * contiguous, cells contained in all the regions from `getRegions`. The
     * cell coordinates are sorted by rows then columns.
     */
    getUniqueCells: () => ICellCoordinate[];
}

export class MenuContext implements IMenuContext {
    private regions: IRegion[];

    constructor(
        private target: IRegion,
        private selectedRegions: IRegion[],
        private numRows: number,
        private numCols: number) {
        this.regions = Regions.containsRegion(selectedRegions, target) ? selectedRegions : [ target ];
    }

    public getTarget() {
        return this.target;
    }

    public getSelectedRegions() {
        return this.selectedRegions;
    }

    public getRegions() {
        return this.regions;
    }

    public getUniqueCells() {
        return Regions.enumerateUniqueCells(this.regions, this.numRows, this.numCols);
    }
}
