/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as PureRender from "pure-render-decorator";
import * as React from "react";
import { Utils } from "../common/utils";
import { Draggable, ICoordinateData, IDraggableProps } from "../interactions/draggable";
import { IRegion, RegionCardinality, Regions } from "../regions";

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
     * When the user reorders something, this callback is called with a new
     * array of `Region`s. This array should be considered the new selection
     * state for the entire table.
     */
    onSelection: (regions: IRegion[]) => void;

    /**
     * A callback that converts the provided index into a region.
     *
     * TODO: This shouldn't be optional, but since ColumnHeader and RowHeader extend
     * IReorderableProps, that means Table would have to provide a toRegion callback to each of
     * them, and that's not necessary.
     */
    toRegion?: (index1: number, index2?: number) => IRegion;

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
     * A callback that determines the index at which to show the preview guide.
     * This is equivalent to the absolute index in the old ordering where the
     * reordered element will move.
     */
    locateDrag: (event: MouseEvent, coords: ICoordinateData) => number;
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
            onDragEnd: this.handleDragEnd,
            onDragMove: this.handleDragMove,
        };
    }

    private handleActivate = (event: MouseEvent) => {
        const { selectedRegions } = this.props;

        if (!DragReorderable.isLeftClick(event)) {
            return false;
        }

        const region = this.props.locateClick(event);
        if (!Regions.isValid(region)) {
            return false;
        }

        const cardinality = Regions.getRegionCardinality(region);
        const isColumnHeader = cardinality === RegionCardinality.FULL_COLUMNS;
        const isRowHeader = cardinality === RegionCardinality.FULL_ROWS;
        if (!isColumnHeader && !isRowHeader) {
            return false;
        }

        const selectedRegionIndex = Regions.findContainingRegion(selectedRegions, region);
        if (selectedRegionIndex < 0) {
            return false;
        }

        const selectedRegion = selectedRegions[selectedRegionIndex];
        const selectedInterval = isRowHeader ? selectedRegion.rows : selectedRegion.cols;

        // cache for easy access later in the lifecycle
        this.selectedRegionStartIndex = selectedInterval[0];
        this.selectedRegionLength = selectedInterval[1] - selectedInterval[0] + 1; // add 1 to correct for the fencepost

        return true;
    }

    private handleDragMove = (event: MouseEvent, coords: ICoordinateData) => {
        const oldIndex = this.selectedRegionStartIndex;
        const guideIndex = this.props.locateDrag(event, coords);
        const length = this.selectedRegionLength;
        const reorderedIndex = Utils.guideIndexToReorderedIndex(oldIndex, guideIndex, length);
        this.props.onReorderPreview(oldIndex, reorderedIndex, length);
    }

    private handleDragEnd = (event: MouseEvent, coords: ICoordinateData) => {
        const oldIndex = this.selectedRegionStartIndex;
        const guideIndex = this.props.locateDrag(event, coords);
        const length = this.selectedRegionLength;
        const reorderedIndex = Utils.guideIndexToReorderedIndex(oldIndex, guideIndex, length);
        this.props.onReorder(oldIndex, reorderedIndex, length);

        const newRegion = this.props.toRegion(reorderedIndex, reorderedIndex + length - 1);
        this.props.onSelection(Regions.update(this.props.selectedRegions, newRegion));

        // resetting is not strictly required, but it's cleaner
        this.selectedRegionStartIndex = undefined;
        this.selectedRegionLength = undefined;
    }
}
