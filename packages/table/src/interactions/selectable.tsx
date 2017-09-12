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
import * as FocusedCellUtils from "../common/internal/focusedCellUtils";
import { Utils } from "../common/utils";
import { DragEvents } from "../interactions/dragEvents";
import { Draggable, ICoordinateData, IDraggableProps } from "../interactions/draggable";
import { IRegion, Regions } from "../regions";

export type ISelectedRegionTransform = (region: IRegion, event: MouseEvent, coords?: ICoordinateData) => IRegion;

export interface ISelectableProps {
    /**
     * If `false`, only a single region of a single column/row/cell may be
     * selected at one time. Using `ctrl` or `meta` key will have no effect,
     * and a mouse drag will select the current column/row/cell only.
     * @default false
     */
    allowMultipleSelection?: boolean;

    /**
     * The currently focused cell.
     */
    focusedCell?: IFocusedCellCoordinates;

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
     * @default []
     */
    selectedRegions?: IRegion[];

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
    locateDrag: (event: MouseEvent, coords: ICoordinateData, returnEndOnly?: boolean) => IRegion;
}

@PureRender
export class DragSelectable extends React.Component<IDragSelectableProps, {}> {
    public static defaultProps: Partial<IDragSelectableProps> = {
        allowMultipleSelection: false,
        disabled: false,
        selectedRegions: [],
    };

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
        const { locateClick, selectedRegions, selectedRegionTransform } = this.props;
        if (this.shouldIgnoreMouseDown(event)) {
            return false;
        }

        let region = locateClick(event);

        if (!Regions.isValid(region)) {
            return false;
        }

        if (selectedRegionTransform != null) {
            region = selectedRegionTransform(region, event);
        }

        const foundIndex = Regions.findMatchingRegion(selectedRegions, region);
        const matchesExistingSelection = foundIndex !== -1;

        if (matchesExistingSelection) {
            this.handleUpdateExistingSelection(foundIndex, event);
            // no need to listen for subsequent drags
            return false;
        } else if (this.shouldExpandSelection(event)) {
            this.handleExpandSelection(region);
        } else if (this.shouldAddDisjointSelection(event)) {
            this.handleAddDisjointSelection(region);
        } else {
            this.handleReplaceSelection(region);
        }

        return true;
    }

    private handleDragMove = (event: MouseEvent, coords: ICoordinateData) => {
        const {
            allowMultipleSelection,
            focusedCell,
            locateClick,
            locateDrag,
            selectedRegions,
            selectedRegionTransform,
        } = this.props;

        let region = allowMultipleSelection
            ? locateDrag(event, coords, /* returnEndOnly? */ this.didExpandSelectionOnActivate)
            : locateClick(event);

        if (!Regions.isValid(region)) {
            return;
        } else if (selectedRegionTransform != null) {
            region = selectedRegionTransform(region, event, coords);
        }

        const nextSelectedRegions = this.didExpandSelectionOnActivate
            ? this.expandSelectedRegions(selectedRegions, region, focusedCell)
            : Regions.update(selectedRegions, region);

        this.maybeInvokeSelectionCallback(nextSelectedRegions);

        if (!allowMultipleSelection) {
            // move the focused cell with the selected region
            const lastIndex = nextSelectedRegions.length - 1;
            const mostRecentRegion = nextSelectedRegions[lastIndex];
            this.invokeOnFocusCallbackForRegion(mostRecentRegion, lastIndex);
        }
    }

    private handleDragEnd = () => {
        this.finishInteraction();
    }

    private handleClick = () => {
        this.finishInteraction();
    }

    // Boolean checks
    // ==============

    private shouldExpandSelection = (event: MouseEvent) => {
        const { allowMultipleSelection } = this.props;
        return allowMultipleSelection && event.shiftKey;
    }

    private shouldAddDisjointSelection = (event: MouseEvent) => {
        const { allowMultipleSelection } = this.props;
        return allowMultipleSelection && DragEvents.isAdditive(event);
    }

    private shouldIgnoreMouseDown(event: MouseEvent) {
        const { ignoredSelectors = [] } = this.props;
        const element = event.target as HTMLElement;
        return !Utils.isLeftClick(event)
            || this.props.disabled
            || ignoredSelectors.some((selector: string) => element.closest(selector) != null);
    }

    // Update logic
    // ============

    private handleUpdateExistingSelection = (selectedRegionIndex: number, event: MouseEvent) => {
        const { onSelection, selectedRegions } = this.props;

        if (DragEvents.isAdditive(event)) {
            // remove just the clicked region, leaving other selected regions in place
            const nextSelectedRegions = selectedRegions.slice();
            nextSelectedRegions.splice(selectedRegionIndex, 1);
            onSelection(nextSelectedRegions);

            // if there are still any selections, move the focused cell to the
            // most recent selection. otherwise, don't update it.
            if (nextSelectedRegions.length > 0) {
                const lastIndex = nextSelectedRegions.length - 1;
                this.invokeOnFocusCallbackForRegion(nextSelectedRegions[lastIndex], lastIndex);
            }
        } else {
            // clear all selections, but don't update the focused cell
            onSelection([]);
        }
    }

    private handleExpandSelection = (region: IRegion) => {
        const { focusedCell, onSelection, selectedRegions } = this.props;
        this.didExpandSelectionOnActivate = true;

        // there should be only one selected region after expanding. do not
        // update the focused cell.
        const nextSelectedRegions = this.expandSelectedRegions(selectedRegions, region, focusedCell);
        onSelection(nextSelectedRegions);

        // move the focused cell into the new region if there were no selections before
        if (selectedRegions == null || selectedRegions.length === 0) {
            this.invokeOnFocusCallbackForRegion(region);
        }
    }

    private handleAddDisjointSelection = (region: IRegion) => {
        const { onSelection, selectedRegions } = this.props;

        // add the new region to the existing selections
        const nextSelectedRegions = Regions.add(selectedRegions, region);
        onSelection(nextSelectedRegions);

        // put the focused cell in the new region
        this.invokeOnFocusCallbackForRegion(region, nextSelectedRegions.length - 1);
    }

    private handleReplaceSelection = (region: IRegion) => {
        const { onSelection } = this.props;

        // clear all selections and retain only the new one
        const nextSelectedRegions = [region];
        onSelection(nextSelectedRegions);

        // move the focused cell into the new selection
        this.invokeOnFocusCallbackForRegion(region);
    }

    // Callbacks
    // =========

    private maybeInvokeSelectionCallback(nextSelectedRegions: IRegion[]) {
        const { onSelection, selectedRegions } = this.props;
        // invoke only if the selection changed
        if (!Utils.deepCompareKeys(selectedRegions, nextSelectedRegions)) {
            onSelection(nextSelectedRegions);
        }
    }

    private invokeOnFocusCallbackForRegion = (focusRegion: IRegion, focusSelectionIndex = 0) => {
        const { onFocus } = this.props;
        const focusedCellCoords = Regions.getFocusCellCoordinatesFromRegion(focusRegion);
        onFocus(FocusedCellUtils.toFullCoordinates(focusedCellCoords, focusSelectionIndex));
    }

    // Other
    // =====

    private finishInteraction = () => {
        BlueprintUtils.safeInvoke(this.props.onSelectionEnd, this.props.selectedRegions);
        this.didExpandSelectionOnActivate = false;
    }

    private expandSelectedRegions(regions: IRegion[], region: IRegion, focusedCell?: IFocusedCellCoordinates) {
        if (regions.length === 0) {
            return [region];
        } else if (focusedCell != null) {
            const expandedRegion = FocusedCellUtils.expandFocusedRegion(focusedCell, region);
            return Regions.update(regions, expandedRegion);
        } else {
            const expandedRegion = Regions.expandRegion(regions[regions.length - 1], region);
            return Regions.update(regions, expandedRegion);
        }
    }
}
