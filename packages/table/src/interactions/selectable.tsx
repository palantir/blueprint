/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { Utils as BlueprintUtils } from "@blueprintjs/core";
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
     * When the user selects something, this callback is called with a new
     * array of `Region`s. This array should be considered the new selection
     * state for the entire table.
     */
    onSelection: (regions: IRegion[]) => void;

    /**
     * An additional convenience callback invoked when the user releases the
     * mouse from either a click or a drag, indicating that the selection
     * interaction has ended.
     */
    onSelectionEnd?: (regions: IRegion[]) => void;

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
     * A list of CSS selectors that should _not_ trigger selection when a `mousedown` occurs inside of them.
     */
    ignoredSelectors?: string[];

    /**
     * Whether the selection behavior is disabled.
     * @default false
     */
    disabled?: boolean;

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
    private didExpandSelectionOnActivate = false;

    public render() {
        const draggableProps = this.getDraggableProps();
        return (
            <Draggable {...draggableProps} preventDefault={false}>
                {this.props.children}
            </Draggable>
        );
    }

    private getDraggableProps(): IDraggableProps {
        return this.props.onSelection == null ? {} : {
            onActivate: this.handleActivate,
            onClick: this.handleClick,
            onDragEnd: this.handleDragEnd,
            onDragMove: this.handleDragMove,
        };
    }

    private handleActivate = (event: MouseEvent) => {
        if (this.shouldIgnoreMouseDown(event)) {
            return false;
        }

        let region = this.props.locateClick(event);

        if (!Regions.isValid(region)) {
            return false;
        }

        const {
            allowMultipleSelection,
            onSelection,
            selectedRegions,
            selectedRegionTransform,
        } = this.props;

        const focusCellCoordinates = Regions.getFocusCellCoordinatesFromRegion(region);
        if (selectedRegionTransform != null) {
            region = selectedRegionTransform(region, event);
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
            const fullFocusCellCoordinates: IFocusedCellCoordinates = {
                col: focusCellCoordinates.col,
                focusSelectionIndex: null,
                row: focusCellCoordinates.row,
            };
            this.props.onFocus(fullFocusCellCoordinates);

            return false;
        }

        let focusSelectionIndex = null;

        if (event.shiftKey && selectedRegions.length > 0 && allowMultipleSelection) {
            this.didExpandSelectionOnActivate = true;
            onSelection(expandSelectedRegions(selectedRegions, region));
            focusSelectionIndex = 0;
        } else if (DragEvents.isAdditive(event) && allowMultipleSelection) {
            onSelection(Regions.add(selectedRegions, region));
            // the focus should be in the newly created region,
            // which is at index of the current list of regions plus one,
            // which is the length of the current list of regions
            focusSelectionIndex = selectedRegions.length;
        } else {
            onSelection([region]);
            focusSelectionIndex = 0;
        }

        const fullFocusCellCoordinates: IFocusedCellCoordinates = {
            col: focusCellCoordinates.col,
            focusSelectionIndex,
            row: focusCellCoordinates.row,
        };
        this.props.onFocus(fullFocusCellCoordinates);

        return true;
    }

    private handleDragMove = (event: MouseEvent, coords: ICoordinateData) => {
        const nextSelectedRegions = this.getDragSelectedRegions(event, coords);
        if (nextSelectedRegions == null) {
            return;
        }
        this.maybeInvokeSelectionCallback(nextSelectedRegions);

        if (!this.props.allowMultipleSelection) {
            // have the focused cell follow the selected region
            const mostRecentRegion = nextSelectedRegions[nextSelectedRegions.length - 1];
            const focusCellCoordinates = Regions.getFocusCellCoordinatesFromRegion(mostRecentRegion);
            const fullFocusCellCoordinates: IFocusedCellCoordinates = {
                col: focusCellCoordinates.col,
                focusSelectionIndex: nextSelectedRegions.length - 1,
                row: focusCellCoordinates.row,
            };
            this.props.onFocus(fullFocusCellCoordinates);
        }
    }

    private handleDragEnd = (event: MouseEvent, coords: ICoordinateData) => {
        const nextSelectedRegions = this.getDragSelectedRegions(event, coords);
        if (nextSelectedRegions == null) {
            return;
        }
        this.maybeInvokeSelectionCallback(nextSelectedRegions);
        BlueprintUtils.safeInvoke(this.props.onSelectionEnd, nextSelectedRegions);
        this.finishInteraction();
    }

    private handleClick = (event: MouseEvent) => {
        if (this.shouldIgnoreMouseDown(event)) {
            return false;
        }

        let region = this.props.locateClick(event);
        const { selectedRegions } = this.props;

        if (!Regions.isValid(region)) {
            this.maybeInvokeSelectionCallback([]);
            BlueprintUtils.safeInvoke(this.props.onSelectionEnd, []);
            return false;
        }

        if (this.props.selectedRegionTransform != null) {
            region = this.props.selectedRegionTransform(region, event);
        }

        let nextSelectedRegions: IRegion[];
        if (this.didExpandSelectionOnActivate) {
            // we already expanded the selection in handleActivate,
            // so we don't want to overwrite it here
            nextSelectedRegions = selectedRegions;
        } else if (selectedRegions.length > 0) {
            nextSelectedRegions = Regions.update(selectedRegions, region);
        } else {
            nextSelectedRegions = [region];
        }

        this.maybeInvokeSelectionCallback(nextSelectedRegions);
        BlueprintUtils.safeInvoke(this.props.onSelectionEnd, nextSelectedRegions);
        this.finishInteraction();
        return false;
    }

    private finishInteraction = () => {
        this.didExpandSelectionOnActivate = false;
    }

    private shouldIgnoreMouseDown(event: MouseEvent) {
        const { ignoredSelectors = [] } = this.props;
        const element = event.target as HTMLElement;
        return !Utils.isLeftClick(event)
            || this.props.disabled
            || ignoredSelectors.some((selector: string) => element.closest(selector) != null);
    }

    private getDragSelectedRegions(event: MouseEvent, coords: ICoordinateData) {
        const { selectedRegions, selectedRegionTransform } = this.props;

        let region = this.props.allowMultipleSelection
            ? this.props.locateDrag(event, coords)
            : this.props.locateClick(event);

        if (!Regions.isValid(region)) {
            return undefined;
        }

        if (selectedRegionTransform != null) {
            region = selectedRegionTransform(region, event, coords);
        }

        return this.didExpandSelectionOnActivate
            ? expandSelectedRegions(selectedRegions, region)
            : Regions.update(selectedRegions, region);
    }

    private maybeInvokeSelectionCallback(nextSelectedRegions: IRegion[]) {
        const { selectedRegions } = this.props;
        // invoke only if the selection changed
        if (!Utils.deepCompareKeys(selectedRegions, nextSelectedRegions)) {
            this.props.onSelection(nextSelectedRegions);
        }
    }
}

function expandSelectedRegions(regions: IRegion[], region: IRegion) {
    if (regions.length === 0) {
        return [region];
    }

    const lastRegion = regions[regions.length - 1];
    const lastRegionCardinality = Regions.getRegionCardinality(lastRegion);
    const regionCardinality = Regions.getRegionCardinality(region);

    if (regionCardinality !== lastRegionCardinality) {
        // TODO: add proper handling for expanding regions from one cardinality to another depending
        // on the focused cell (see: https://github.com/palantir/blueprint/issues/823). for now,
        // just return the new region by itself.
        return [region];
    }

    // simplified algorithm: expand the most recently selected region, and clear all others.
    // TODO: pass the current focused cell into DragSelectable via props, then update this logic
    // to leverage the focus cell's coordinates appropriately.
    // (see: https://github.com/palantir/blueprint/issues/823)
    if (regionCardinality === RegionCardinality.FULL_ROWS) {
        const rowStart = Math.min(lastRegion.rows[0], region.rows[0]);
        const rowEnd = Math.max(lastRegion.rows[1], region.rows[1]);
        return [Regions.row(rowStart, rowEnd)];
    } else if (regionCardinality === RegionCardinality.FULL_COLUMNS) {
        const colStart = Math.min(lastRegion.cols[0], region.cols[0]);
        const colEnd = Math.max(lastRegion.cols[1], region.cols[1]);
        return [Regions.column(colStart, colEnd)];
    } else if (regionCardinality === RegionCardinality.CELLS) {
        const rowStart = Math.min(lastRegion.rows[0], region.rows[0]);
        const colStart = Math.min(lastRegion.cols[0], region.cols[0]);
        const rowEnd = Math.max(lastRegion.rows[1], region.rows[1]);
        const colEnd = Math.max(lastRegion.cols[1], region.cols[1]);
        return [Regions.cell(rowStart, colStart, rowEnd, colEnd)];
    } else {
        // if we've selected the FULL_TABLE, no need to expand it further.
        return [region];
    }
}
