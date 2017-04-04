/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as PureRender from "pure-render-decorator";
import * as React from "react";
// import * as Utils from "../common/utils";
// import { DragEvents } from "../interactions/dragEvents";
import { Draggable, ICoordinateData, IDraggableProps } from "../interactions/draggable";
import { IRegion, RegionCardinality, Regions } from "../regions";

export interface IReorderedCoords {
    oldIndex: number;
    newIndex: number;
}

export interface IReorderableProps {
    /**
     * Invoked when the user is dragging the mouse with the mouse down.
     * TODO: Improve this description.
     */
    onReorderPreview: (oldIndex: number, newIndex: number, length: number) => void;

    /**
     * Invoked when the user releases the mouse to reorder one or more columns.
     * TODO: Improve this description.
     */
    onReorder: (oldIndex: number, newIndex: number, length: number) => void;

    /**
     * An array containing the table's selection Regions.
     */
    selectedRegions: IRegion[];
}

export interface IDragReorderable extends IReorderableProps {
    /**
     * A callback that determines a `Region` for the single `MouseEvent`. If
     * no valid region can be found, `null` may be returned.
     */
    locateClick: (event: MouseEvent) => IRegion;

    /**
     * A callback that determines the old and new indices of the dragged row or column.
     */
    locateDrag: (event: MouseEvent, coords: ICoordinateData) => IReorderedCoords;
}

@PureRender
export class DragReorderable extends React.Component<IDragReorderable, {}> {
    public static isLeftClick(event: MouseEvent) {
        return event.button === 0;
    }

    private selectedRegionStartIndex: number;
    private selectedRegionLength: number;

    public render() {
        const draggableProps = this.getDraggableProps();
        return (
            <Draggable {...draggableProps} preventDefault={false}>
                {this.props.children}
            </Draggable>
        );
    }

    private getDraggableProps(): IDraggableProps {
        return this.props.onReorder == null ? {} : {
            onActivate: this.handleActivate,
            onDragMove: this.handleDragMove,
            onDragEnd: this.handleDragEnd,
        };
    }

    private handleActivate = (event: MouseEvent) => {
        const { selectedRegions } = this.props;

        if (!DragReorderable.isLeftClick(event)) {
            return false;
        }

        let region = this.props.locateClick(event);

        console.log("reorderable.tsx: handleActivate");
        console.log("  region.cols", region.cols);

        if (!Regions.isValid(region)) {
            console.log("  Region is not valid");
            return false;
        }

        const cardinality = Regions.getRegionCardinality(region);
        const isColumnHeader = cardinality === RegionCardinality.FULL_COLUMNS;
        const isRowHeader = cardinality === RegionCardinality.FULL_ROWS;

        if (!isColumnHeader && !isRowHeader) {
            console.log("  Clicked a non-header");
            return false;
        } else if (isColumnHeader) {
            console.log("  Clicked a column header");
        } else if (isRowHeader) {
            console.log("  Clicked a row header");
        }

        const selectedRegionIndex = Regions.findContainingRegion(selectedRegions, region);
        if (selectedRegionIndex < 0) {
            console.log("  Clicked on a region outside of the current selection");
            return false;
        }
        console.log("  Clicked on a region inside the current selection");

        const selectedRegion = selectedRegions[selectedRegionIndex];
        const selectedInterval = isRowHeader ? selectedRegion.rows : selectedRegion.cols;

        // cache for easy access later in the lifecycle
        this.selectedRegionStartIndex = selectedInterval[0];
        this.selectedRegionLength = selectedInterval[1] - selectedInterval[0] + 1; // add 1 to correct for the fencepost

        return true;
    }

    private handleDragMove = (event: MouseEvent, coords: ICoordinateData) => {
        const { newIndex } = this.props.locateDrag(event, coords);

        console.log("reorderable.tsx: handleDragMove");

        const length = this.selectedRegionLength;
        const adjustedOldIndex = this.selectedRegionStartIndex;
        const adjustedNewIndex = this.getAdjustedNewIndex(newIndex, length);

        console.log(
            " ",
            "length:", this.selectedRegionLength,
            "adjustedOldIndex:", adjustedOldIndex,
            "adjustedNewIndex:", adjustedNewIndex);

        this.props.onReorderPreview(adjustedOldIndex, adjustedNewIndex, length);
    }

    private handleDragEnd = (event: MouseEvent, coords: ICoordinateData) => {
        const { newIndex } = this.props.locateDrag(event, coords);

        console.log("reorderable.tsx: handleDragEnd");

        const length = this.selectedRegionLength;
        const adjustedOldIndex = this.selectedRegionStartIndex;
        const adjustedNewIndex = this.getAdjustedNewIndex(newIndex, length);

        console.log(" ",
            "length:", this.selectedRegionLength,
            "adjustedOldIndex:", adjustedOldIndex,
            "adjustedNewIndex:", adjustedNewIndex);

        this.props.onReorder(adjustedOldIndex, adjustedNewIndex, length);

        // resetting is not strictly required, but it's cleaner
        this.selectedRegionStartIndex = undefined;
        this.selectedRegionLength = undefined;
    }

    private getAdjustedNewIndex = (newIndex: number, length: number) => {
        // adjust new index based on how many elements will be moving during the drag interaction
        return Math.max(0, newIndex - (length - 1));
    }
}
