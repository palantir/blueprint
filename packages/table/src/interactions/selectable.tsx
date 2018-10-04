/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Utils as CoreUtils } from "@blueprintjs/core";
import * as React from "react";

import { IFocusedCellCoordinates } from "../common/cell";
import * as FocusedCellUtils from "../common/internal/focusedCellUtils";
import * as PlatformUtils from "../common/internal/platformUtils";
import { Utils } from "../common/utils";
import { IRegion, Regions } from "../regions";
import { DragEvents } from "./dragEvents";
import { Draggable, ICoordinateData, IDraggableProps } from "./draggable";

export type ISelectedRegionTransform = (
    region: IRegion,
    event: MouseEvent | KeyboardEvent,
    coords?: ICoordinateData,
) => IRegion;

export interface ISelectableProps {
    /**
     * If `false`, only a single region of a single column/row/cell may be
     * selected at one time. Using `ctrl` or `meta` key will have no effect,
     * and a mouse drag will select the current column/row/cell only.
     * @default false
     */
    enableMultipleSelection?: boolean;

    /**
     * The currently focused cell.
     */
    focusedCell?: IFocusedCellCoordinates;

    /**
     * When the user focuses something, this callback is called with new
     * focused cell coordinates. This should be considered the new focused cell
     * state for the entire table.
     */
    onFocusedCell: (focusedCell: IFocusedCellCoordinates) => void;

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
    disabled?: boolean | ((event: MouseEvent) => boolean);

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

export class DragSelectable extends React.PureComponent<IDragSelectableProps, {}> {
    public static defaultProps: Partial<IDragSelectableProps> = {
        disabled: false,
        enableMultipleSelection: false,
        selectedRegions: [],
    };

    private didExpandSelectionOnActivate = false;
    private lastEmittedSelectedRegions: IRegion[];

    public render() {
        const draggableProps = this.getDraggableProps();
        return (
            <Draggable {...draggableProps} preventDefault={false}>
                {this.props.children}
            </Draggable>
        );
    }

    private getDraggableProps(): IDraggableProps {
        return this.props.onSelection == null
            ? {}
            : {
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

        if (matchesExistingSelection && DragEvents.isAdditive(event)) {
            this.handleClearSelectionAtIndex(foundIndex);
            // if we just deselected a selected region, a subsequent drag-move
            // could reselect it again and *also* clear other selections. that's
            // quite unintuitive, so ignore subsequent drag-move's.
            return false;
        }

        // we want to listen to subsequent drag-move's in all following cases,
        // so this mousedown can be the start of a new selection if desired.
        if (matchesExistingSelection) {
            this.handleClearAllSelectionsNotAtIndex(foundIndex);
        } else if (this.shouldExpandSelection(event)) {
            this.handleExpandSelection(region);
        } else if (this.shouldAddDisjointSelection(event)) {
            this.handleAddDisjointSelection(region);
        } else {
            this.handleReplaceSelection(region);
        }
        return true;
    };

    private handleDragMove = (event: MouseEvent, coords: ICoordinateData) => {
        const {
            enableMultipleSelection,
            focusedCell,
            locateClick,
            locateDrag,
            selectedRegions,
            selectedRegionTransform,
        } = this.props;

        let region = enableMultipleSelection
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

        if (!enableMultipleSelection) {
            // move the focused cell with the selected region
            const lastIndex = nextSelectedRegions.length - 1;
            const mostRecentRegion = nextSelectedRegions[lastIndex];
            this.invokeOnFocusCallbackForRegion(mostRecentRegion, lastIndex);
        }
    };

    private handleDragEnd = () => {
        this.finishInteraction();
    };

    private handleClick = () => {
        this.finishInteraction();
    };

    // Boolean checks
    // ==============

    private shouldExpandSelection = (event: MouseEvent) => {
        const { enableMultipleSelection } = this.props;
        return enableMultipleSelection && event.shiftKey;
    };

    private shouldAddDisjointSelection = (event: MouseEvent) => {
        const { enableMultipleSelection } = this.props;
        return enableMultipleSelection && DragEvents.isAdditive(event);
    };

    private shouldIgnoreMouseDown(event: MouseEvent) {
        const { disabled, ignoredSelectors = [] } = this.props;
        const element = event.target as HTMLElement;

        const isLeftClick = Utils.isLeftClick(event);
        const isContextMenuTrigger = isLeftClick && event.ctrlKey && PlatformUtils.isMac();
        const isDisabled = CoreUtils.safeInvokeOrValue(disabled, event);

        return (
            !isLeftClick ||
            isContextMenuTrigger ||
            isDisabled ||
            ignoredSelectors.some((selector: string) => element.closest(selector) != null)
        );
    }

    // Update logic
    // ============

    private handleClearSelectionAtIndex = (selectedRegionIndex: number) => {
        const { selectedRegions } = this.props;

        // remove just the clicked region, leaving other selected regions in place
        const nextSelectedRegions = selectedRegions.slice();
        nextSelectedRegions.splice(selectedRegionIndex, 1);
        this.maybeInvokeSelectionCallback(nextSelectedRegions);

        // if there are still any selections, move the focused cell to the
        // most recent selection. otherwise, don't update it.
        if (nextSelectedRegions.length > 0) {
            const lastIndex = nextSelectedRegions.length - 1;
            this.invokeOnFocusCallbackForRegion(nextSelectedRegions[lastIndex], lastIndex);
        }
    };

    private handleClearAllSelectionsNotAtIndex = (selectedRegionIndex: number) => {
        const { selectedRegions } = this.props;

        const nextSelectedRegion = selectedRegions[selectedRegionIndex];
        this.maybeInvokeSelectionCallback([nextSelectedRegion]);
        this.invokeOnFocusCallbackForRegion(nextSelectedRegion, 0);
    };

    private handleExpandSelection = (region: IRegion) => {
        const { focusedCell, selectedRegions } = this.props;
        this.didExpandSelectionOnActivate = true;

        // there should be only one selected region after expanding. do not
        // update the focused cell.
        const nextSelectedRegions = this.expandSelectedRegions(selectedRegions, region, focusedCell);
        this.maybeInvokeSelectionCallback(nextSelectedRegions);

        // move the focused cell into the new region if there were no selections before
        if (selectedRegions == null || selectedRegions.length === 0) {
            this.invokeOnFocusCallbackForRegion(region);
        }
    };

    private handleAddDisjointSelection = (region: IRegion) => {
        const { selectedRegions } = this.props;

        // add the new region to the existing selections
        const nextSelectedRegions = Regions.add(selectedRegions, region);
        this.maybeInvokeSelectionCallback(nextSelectedRegions);

        // put the focused cell in the new region
        this.invokeOnFocusCallbackForRegion(region, nextSelectedRegions.length - 1);
    };

    private handleReplaceSelection = (region: IRegion) => {
        // clear all selections and retain only the new one
        const nextSelectedRegions = [region];
        this.maybeInvokeSelectionCallback(nextSelectedRegions);

        // move the focused cell into the new selection
        this.invokeOnFocusCallbackForRegion(region);
    };

    // Callbacks
    // =========

    private maybeInvokeSelectionCallback(nextSelectedRegions: IRegion[]) {
        const { onSelection } = this.props;
        // invoke only if the selection changed. this is useful only on
        // mousemove; there's special handling for mousedown interactions that
        // target an already-selected region.
        if (
            this.lastEmittedSelectedRegions == null ||
            !CoreUtils.deepCompareKeys(this.lastEmittedSelectedRegions, nextSelectedRegions)
        ) {
            onSelection(nextSelectedRegions);
            this.lastEmittedSelectedRegions = nextSelectedRegions;
        }
    }

    private invokeOnFocusCallbackForRegion = (focusRegion: IRegion, focusSelectionIndex = 0) => {
        const { onFocusedCell } = this.props;
        const focusedCellCoords = Regions.getFocusCellCoordinatesFromRegion(focusRegion);
        onFocusedCell(FocusedCellUtils.toFullCoordinates(focusedCellCoords, focusSelectionIndex));
    };

    // Other
    // =====

    private finishInteraction = () => {
        CoreUtils.safeInvoke(this.props.onSelectionEnd, this.props.selectedRegions);
        this.didExpandSelectionOnActivate = false;
        this.lastEmittedSelectedRegions = null;
    };

    /**
     * Expands the last-selected region to the new region, and replaces the
     * last-selected region with the expanded region. If a focused cell is provided,
     * the focused cell will serve as an anchor for the expansion.
     */
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
