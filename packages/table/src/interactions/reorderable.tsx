/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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
     * A callback that is called while the user is dragging to reorder.
     *
     * @param oldIndex the original index of the element or set of elements
     * @param newIndex the new index of the element or set of elements
     * @param length the number of contiguous elements that were moved
     */
    onReordering: (oldIndex: number, newIndex: number, length: number) => void;

    /**
     * A callback that is called when the user is done dragging to reorder.
     *
     * @param oldIndex the original index of the element or set of elements
     * @param newIndex the new index of the element or set of elements
     * @param length the number of contiguous elements that were moved
     */
    onReordered: (oldIndex: number, newIndex: number, length: number) => void;

    /**
     * When the user reorders something, this callback is called with a new
     * array of `Region`s. This array should be considered the new selection
     * state for the entire table.
     */
    onSelection: (regions: IRegion[]) => void;

    /**
     * An array containing the table's selection Regions.
     */
    selectedRegions: IRegion[];
}

export interface IDragReorderable extends IReorderableProps {
    /**
     * Whether the reordering behavior is disabled.
     * @default false
     */
    disabled?: boolean;

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

    /**
     * A callback that converts the provided index into a region. The returned
     * region will be used to update the current selection after drag-reordering.
     */
    toRegion: (index1: number, index2?: number) => IRegion;
}

@PureRender
export class DragReorderable extends React.Component<IDragReorderable, {}> {
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
        return this.props.onReordered == null ? {} : {
            onActivate: this.handleActivate,
            onDragEnd: this.handleDragEnd,
            onDragMove: this.handleDragMove,
        };
    }

    private handleActivate = (event: MouseEvent) => {
        if (!Utils.isLeftClick(event) || this.props.disabled) {
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

        const { selectedRegions } = this.props;

        const selectedRegionIndex = Regions.findContainingRegion(selectedRegions, region);
        if (selectedRegionIndex >= 0) {
            const selectedRegion = selectedRegions[selectedRegionIndex];
            if (Regions.getRegionCardinality(selectedRegion) !== cardinality) {
                // ignore FULL_TABLE selections
                return false;
            }

            // cache for easy access later in the lifecycle
            const selectedInterval = isRowHeader ? selectedRegion.rows : selectedRegion.cols;
            this.selectedRegionStartIndex = selectedInterval[0];
            // add 1 because the selected interval is inclusive, which simple subtraction doesn't
            // account for (e.g. in a FULL_COLUMNS range from 3 to 6, 6 - 3 = 3, but the selection
            // actually includes four columns: 3, 4, 5, and 6)
            this.selectedRegionLength = selectedInterval[1] - selectedInterval[0] + 1;
        } else {
            // select the new region to avoid complex and unintuitive UX w/r/t the existing selection
            this.props.onSelection([region]);

            const regionRange = isRowHeader ? region.rows : region.cols;
            this.selectedRegionStartIndex = regionRange[0];
            this.selectedRegionLength = regionRange[1] - regionRange[0] + 1;
        }

        return true;
    }

    private handleDragMove = (event: MouseEvent, coords: ICoordinateData) => {
        const oldIndex = this.selectedRegionStartIndex;
        const guideIndex = this.props.locateDrag(event, coords);
        const length = this.selectedRegionLength;
        const reorderedIndex = Utils.guideIndexToReorderedIndex(oldIndex, guideIndex, length);
        this.props.onReordering(oldIndex, reorderedIndex, length);
    }

    private handleDragEnd = (event: MouseEvent, coords: ICoordinateData) => {
        const oldIndex = this.selectedRegionStartIndex;
        const guideIndex = this.props.locateDrag(event, coords);
        const length = this.selectedRegionLength;

        const reorderedIndex = Utils.guideIndexToReorderedIndex(oldIndex, guideIndex, length);
        this.props.onReordered(oldIndex, reorderedIndex, length);

        // the newly reordered region becomes the only selection
        const newRegion = this.props.toRegion(reorderedIndex, reorderedIndex + length - 1);
        this.props.onSelection(Regions.update([], newRegion));

        // resetting is not strictly required, but it's cleaner
        this.selectedRegionStartIndex = undefined;
        this.selectedRegionLength = undefined;
    }
}
