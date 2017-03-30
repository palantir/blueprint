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

export interface IReorderableProps {
    /**
     * When the user reorders a column, this callback is called with the
     * column's old index and new index.
     */
    onReorder: (oldIndex: number, newIndex: number) => void;
}

export interface IDragReorderable extends IReorderableProps {
    /**
     * A callback that determines a `Region` for the single `MouseEvent`. If
     * no valid region can be found, `null` may be returned.
     */
    locateClick: (event: MouseEvent) => IRegion;

    /**
     * A callback that determines a `Region` for the `MouseEvent` and
     * coordinate data representing a drag. If no valid region can be found,
     * `null` may be returned.
     */
    locateDrag: (event: MouseEvent, coords: ICoordinateData) => IRegion;
}

@PureRender
export class DragReorderable extends React.Component<IDragReorderable, {}> {
    public static isLeftClick(event: MouseEvent) {
        return event.button === 0;
    }

    public render() {
        debugger;
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
            onClick: this.handleClick,
            onDragMove: this.handleDragMove,
        };
    }

    private handleActivate = (event: MouseEvent) => {
        if (!DragReorderable.isLeftClick(event)) {
            return false;
        }

        let region = this.props.locateClick(event);

        console.log("reorderable.tsx: handleActivate");
        console.log("  region", region);

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

        // const foundIndex = Regions.findMatchingRegion(this.props.selectedRegions, region);
        // if (foundIndex !== -1) {
        //     // If re-clicking on an existing region, we either carefully
        //     // remove it if the meta key is used or otherwise we clear the
        //     // selection entirely.
        //     if (DragEvents.isAdditive(event)) {
        //         const newSelectedRegions = this.props.selectedRegions.slice();
        //         newSelectedRegions.splice(foundIndex, 1);
        //         this.props.onSelection(newSelectedRegions);
        //     } else {
        //         this.props.onSelection([]);
        //     }
        //     return false;
        // }

        // if (DragEvents.isAdditive(event) && this.props.allowMultipleSelection) {
        //     this.props.onSelection(Regions.add(this.props.selectedRegions, region));
        // } else {
        //     this.props.onSelection([region]);
        // }

        return true;
    }

    private handleDragMove = (_event: MouseEvent, _coords: ICoordinateData) => {
        // let region = (this.props.allowMultipleSelection) ?
        //     this.props.locateDrag(event, coords) :
        //     this.props.locateClick(event);

        // if (!Regions.isValid(region)) {
        //     return;
        // }

        // if (this.props.selectedRegionTransform != null) {
        //     region = this.props.selectedRegionTransform(region, event, coords);
        // }

        // this.props.onSelection(Regions.update(this.props.selectedRegions, region));
    }

    private handleClick = (_event: MouseEvent) => {
        // if (!Utils.isLeftClick(event)) {
        //     return false;
        // }

        // let region = this.props.locateClick(event);

        // if (!Regions.isValid(region)) {
        //     this.props.onSelection([]);
        //     return false;
        // }

        // if (this.props.selectedRegionTransform != null) {
        //     region = this.props.selectedRegionTransform(region, event);
        // }

        // if (this.props.selectedRegions.length > 0) {
        //     this.props.onSelection(Regions.update(this.props.selectedRegions, region));
        // } else {
        //     this.props.onSelection([region]);
        // }

        // return false;
    }
}
