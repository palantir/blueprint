/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as PureRender from "pure-render-decorator";
import * as React from "react";
import { IFocusedCellCoordinates } from "../common/cell";
import { Utils } from "../common/utils";
import { DragEvents } from "../interactions/dragEvents";
import { Draggable, ICoordinateData, IDraggableProps } from "../interactions/draggable";
import { IRegion, RegionCardinality, Regions } from "../regions";

export type ISelectedRegionTransform = (region: IRegion, event: MouseEvent, coords?: ICoordinateData) => IRegion;

export interface ISelectableProps {
    /**
     * If `false`, only a single region of a single column/row/cell may be
     * selected at one time. Using `ctrl` or `meta` key will have no effect,
     * and a mouse drag will select the current column/row/cell only.
     */
    allowMultipleSelection: boolean;

    /**
     * When the user focuses something, this callback is called with new
     * focused cell coordinates. This should be considered the new focused cell
     * state for the entire table.
     */
    onFocus: (focusedCell: IFocusedCellCoordinates) => void;

    /**
     * Whether to ignore clicks on selected regions within this context. This
     * is useful for deferring to functionality from other contexts for the
     * same interaction (e.g. row and column reordering).
     */
    ignoreSelectedRegionClicks?: boolean;

    /**
     * When the user selects something, this callback is called with a new
     * array of `Region`s. This array should be considered the new selection
     * state for the entire table.
     */
    onSelection: (regions: IRegion[]) => void;

    /**
     * An array containing the table's selection Regions.
     */
    selectedRegions: IRegion[];

    /**
     * An optional transform function that will be applied to the located
     * `Region`.
     *
     * This allows you to, for example, convert cell `Region`s into row
     * `Region`s while maintaining the existing multi-select and meta-click
     * functionality.
     */
    selectedRegionTransform?: ISelectedRegionTransform;
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
    private static getFocusCellCoordinatesFromRegion(region: IRegion) {
        const regionCardinality = Regions.getRegionCardinality(region);

        switch (regionCardinality) {
            case RegionCardinality.FULL_TABLE:
                return { col: 0, row: 0 };
            case RegionCardinality.FULL_COLUMNS:
                return { col: region.cols[0], row: 0 };
            case RegionCardinality.FULL_ROWS:
                return { col: 0, row: region.rows[0] };
            case RegionCardinality.CELLS:
                return { col: region.cols[0], row: region.rows[0] };
            default:
                return null;
        }
    }

    public render() {
        const draggableProps = this.getDraggableProps();
        // stop immediate propagation so that the same mousedown gesture won't also trigger
        // reordering behavior
        return (
            <Draggable {...draggableProps} preventDefault={false} stopImmediatePropagation={true}>
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
        if (!Utils.isLeftClick(event)) {
            return false;
        }

        let region = this.props.locateClick(event);

        if (!Regions.isValid(region)) {
            return false;
        }

        const {
            ignoreSelectedRegionClicks,
            onSelection,
            selectedRegions,
            selectedRegionTransform,
        } = this.props;

        const focusCellCoordinates = DragSelectable.getFocusCellCoordinatesFromRegion(region);
        this.props.onFocus(focusCellCoordinates);

        if (selectedRegionTransform != null) {
            region = selectedRegionTransform(region, event);
        }

        if (ignoreSelectedRegionClicks && Regions.containsRegion(selectedRegions, region)) {
            return false;
        }

        const foundIndex = Regions.findMatchingRegion(selectedRegions, region);
        if (foundIndex !== -1) {
            // If re-clicking on an existing region, we either carefully
            // remove it if the meta key is used or otherwise we clear the
            // selection entirely.
            if (DragEvents.isAdditive(event)) {
                const newSelectedRegions = selectedRegions.slice();
                newSelectedRegions.splice(foundIndex, 1);
                onSelection(newSelectedRegions);
            } else {
                onSelection([]);
            }
            return false;
        }

        if (DragEvents.isAdditive(event) && this.props.allowMultipleSelection) {
            onSelection(Regions.add(selectedRegions, region));
        } else {
            onSelection([region]);
        }

        return true;
    }

    private handleDragMove = (event: MouseEvent, coords: ICoordinateData) => {
        let region = (this.props.allowMultipleSelection) ?
            this.props.locateDrag(event, coords) :
            this.props.locateClick(event);

        if (!Regions.isValid(region)) {
            return;
        }

        if (this.props.selectedRegionTransform != null) {
            region = this.props.selectedRegionTransform(region, event, coords);
        }

        this.props.onSelection(Regions.update(this.props.selectedRegions, region));
    }

    private handleClick = (event: MouseEvent) => {
        if (!Utils.isLeftClick(event)) {
            return false;
        }

        let region = this.props.locateClick(event);
        const { ignoreSelectedRegionClicks, selectedRegions } = this.props;

        if (ignoreSelectedRegionClicks && Regions.containsRegion(selectedRegions, region)) {
            return false;
        }

        if (!Regions.isValid(region)) {
            this.props.onSelection([]);
            return false;
        }

        if (this.props.selectedRegionTransform != null) {
            region = this.props.selectedRegionTransform(region, event);
        }

        if (selectedRegions.length > 0) {
            this.props.onSelection(Regions.update(selectedRegions, region));
        } else {
            this.props.onSelection([region]);
        }

        return false;
    }
}
