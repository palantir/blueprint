/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import * as PureRender from "pure-render-decorator";
import * as React from "react";
import { DragEvents, Draggable, ICoordinateData, IDraggableProps } from "../interactions/draggable";
import { IRegion, Regions } from "../regions";

export interface ISelectableProps {
    /**
     * If `false`, only a single region of a single column/row/cell may be
     * selected at one time. Using <kbd class="pt-key">ctrl</kbd> or
     * <kbd class="pt-key">meta</kbd> key will have no effect,
     * and a mouse drag will select the current column/row/cell only.
     */
    allowMultipleSelection: boolean;

    /**
     * An array containing the table's selection Regions.
     */
    selectedRegions: IRegion[];

    /**
     * When the user selects something, this callback is called with a new
     * array of Regions. This array should be considered the new selection
     * state for the entire table.
     */
    onSelection: (regions: IRegion[]) => void;
}

export interface IDragSelectableProps extends ISelectableProps {
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
export class DragSelectable extends React.Component<IDragSelectableProps, {}> {
    public static isLeftClick(event: MouseEvent) {
        return event.button === 0;
    }

    public render() {
        const draggableProps = this.getDraggableProps();
        return (
            <Draggable {...draggableProps}>
                {this.props.children}
            </Draggable>
        );
    }

    private getDraggableProps(): IDraggableProps {
        return this.props.onSelection == null ? {} : {
            onActivate: this.handleActivate,
            onClick: this.handleClick,
            onDragMove: this.handleDragMove,
        };
    }

    private handleActivate = (event: MouseEvent) => {
        if (!DragSelectable.isLeftClick(event)) {
            return false;
        }

        const region = this.props.locateClick(event);

        if (!Regions.isValid(region)) {
            return false;
        }

        const foundIndex = Regions.findMatchingRegion(this.props.selectedRegions, region);
        if (foundIndex !== -1) {
            // If re-clicking on an existing region, we either carefully
            // remove it if the meta key is used or otherwise we clear the
            // selection entirely.
            if (DragEvents.isAdditive(event)) {
                const newSelectedRegions = this.props.selectedRegions.slice();
                newSelectedRegions.splice(foundIndex, 1);
                this.props.onSelection(newSelectedRegions);
            } else {
                this.props.onSelection([]);
            }
            return false;
        }

        if (DragEvents.isAdditive(event) && this.props.allowMultipleSelection) {
            this.props.onSelection(Regions.add(this.props.selectedRegions, region));
        } else {
            this.props.onSelection([region]);
        }

        return true;
    }

    private handleDragMove = (event: MouseEvent, coords: ICoordinateData) => {
        const region = (this.props.allowMultipleSelection) ?
            this.props.locateDrag(event, coords) :
            this.props.locateClick(event);

        if (!Regions.isValid(region)) {
            return;
        }

        this.props.onSelection(Regions.update(this.props.selectedRegions, region));
    }

    private handleClick = (event: MouseEvent) => {
        if (!DragSelectable.isLeftClick(event)) {
            return false;
        }

        const region = this.props.locateClick(event);

        if (!Regions.isValid(region)) {
            this.props.onSelection([]);
            return false;
        }

        if (this.props.selectedRegions.length > 0) {
            this.props.onSelection(Regions.update(this.props.selectedRegions, region));
        } else {
            this.props.onSelection([region]);
        }

        return false;
    }
}
