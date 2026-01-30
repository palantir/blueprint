/*
 * Copyright 2025 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Checkbox, Radio } from "@blueprintjs/core";

import { ExcludedCheckbox } from "./excludedCheckbox";
import {
    type ListogramItemGroupBase,
    type ListogramItemId,
    type ListogramSelectionKind,
    type ListogramSelectionMode,
    type ListogramSelectionState,
    ListogramSelectionKind as SelectionKind,
    ListogramSelectionMode as SelectionMode,
} from "./listogramTypes";

export function getListogramSelectionComponent(
    showSelectionToggles: boolean,
    selectionKind: ListogramSelectionKind,
    selectionMode: ListogramSelectionMode,
) {
    if (!showSelectionToggles) {
        return undefined;
    } else if (selectionKind === SelectionKind.SINGLE) {
        return Radio;
    } else {
        return selectionMode === SelectionMode.KEEPING ? Checkbox : ExcludedCheckbox;
    }
}

export function updateListogramSelectionSingle(
    selectionState: ListogramSelectionState,
    selectedItemId: ListogramItemId,
): ListogramSelectionState {
    const newSelection = new Set<ListogramItemId>();
    newSelection.add(selectedItemId);

    return {
        ...selectionState,
        selectedItemIds: newSelection,
    };
}

export function updateListogramSelectionToggle(
    selectionState: ListogramSelectionState,
    selectedItemId: ListogramItemId,
): ListogramSelectionState {
    return {
        ...selectionState,
        selectedItemIds: toggleValueInSelection(selectionState.selectedItemIds, selectedItemId),
    };
}

export function updateListogramSelectionMultiple(
    selectionState: ListogramSelectionState,
    selectedItemId: ListogramItemId,
    items: ListogramItemGroupBase[],
    showSelectionToggles: boolean,
    evt: React.MouseEvent<HTMLElement>,
): ListogramSelectionState {
    if (evt.ctrlKey || evt.metaKey) {
        return handleCtrlClick(selectionState, selectedItemId, items);
    } else if (evt.shiftKey) {
        return handleShiftClick(selectionState, selectedItemId, items);
    } else {
        return handleRegularClick(selectionState.selectedItemIds, selectedItemId, showSelectionToggles);
    }
}

function handleCtrlClick(
    selectionState: ListogramSelectionState,
    selectedItemId: ListogramItemId,
    items: ListogramItemGroupBase[],
): ListogramSelectionState {
    const { selectedItemIds, shiftSelection } = selectionState;
    const newSelection = new Set<ListogramItemId>(selectedItemIds);
    let newShiftSelection: Set<ListogramItemId> = shiftSelection;
    let newPreviouslyClickedId: ListogramItemId | undefined;

    if (selectedItemIds.has(selectedItemId)) {
        const isSelectedItemInShiftSelection = shiftSelection.has(selectedItemId);
        if (isSelectedItemInShiftSelection) {
            newShiftSelection = new Set<ListogramItemId>(shiftSelection);
        }
        let indexOfClicked = -1;
        let haveFoundNextSelectedAfterDeselected = false;
        // TODO: change shiftSelection to be modeled as start/end range instead of Set
        items.forEach((item, index) => {
            // If deselected item is part of shift selection, remove all items in the shift selection before it
            // from the shift selection
            if (indexOfClicked === -1 && isSelectedItemInShiftSelection && shiftSelection.has(item.id)) {
                newShiftSelection.delete(item.id);
            }

            // newPreviouslyClicked is the next item selected after the deselected item. if there is none
            // it is the one right before. If there is no other item selected, the newPreviouslyClicked
            // will not be set, thus be undefined
            if (!haveFoundNextSelectedAfterDeselected) {
                if (item.id === selectedItemId) {
                    indexOfClicked = index;
                } else if (selectedItemIds.has(item.id)) {
                    newPreviouslyClickedId = item.id;
                    if (indexOfClicked !== -1 && index > indexOfClicked) {
                        haveFoundNextSelectedAfterDeselected = true;
                    }
                }
            }
        });

        newSelection.delete(selectedItemId);
    } else {
        newSelection.add(selectedItemId);
        newPreviouslyClickedId = selectedItemId;
        // TODO: if selectedItemId is adjacent to shift selection, add it to shift selection
    }

    return {
        previouslyClickedId: newPreviouslyClickedId,
        selectedItemIds: newSelection,
        shiftSelection: newShiftSelection,
    };
}

function handleShiftClick(
    selectionState: ListogramSelectionState,
    selectedItemId: ListogramItemId,
    items: ListogramItemGroupBase[],
): ListogramSelectionState {
    const { previouslyClickedId, selectedItemIds, shiftSelection } = selectionState;
    const newSelection = new Set<ListogramItemId>(selectedItemIds);
    const newPreviouslyClickedId: ListogramItemId | undefined = previouslyClickedId || selectedItemId;
    let newShiftSelection: Set<ListogramItemId>;

    newShiftSelection = shiftSelection;

    const itemIds = items.map(item => item.id);
    let indexOfClicked = -1;
    let indexOfPreviouslyClicked = -1;
    itemIds.forEach((id, index) => {
        if (id === selectedItemId) {
            indexOfClicked = index;
        }
        if (id === previouslyClickedId) {
            indexOfPreviouslyClicked = index;
        }
    });

    let idsInRange: ListogramItemId[];
    if (indexOfPreviouslyClicked === -1) {
        idsInRange = itemIds.slice(0, indexOfClicked + 1);
    } else if (indexOfClicked < indexOfPreviouslyClicked) {
        idsInRange = itemIds.slice(indexOfClicked, indexOfPreviouslyClicked + 1).reverse();
    } else {
        idsInRange = itemIds.slice(indexOfPreviouslyClicked, indexOfClicked + 1);
    }

    const rangeIntersectsOldShiftSelection = idsInRange.some((id: ListogramItemId) => shiftSelection.has(id));
    if (rangeIntersectsOldShiftSelection) {
        shiftSelection.forEach((id: ListogramItemId) => newSelection.delete(id));
    }
    // TODO: else if (selectedItemId overlaps with a selection that isn't in the old shift selection, remove all contiguous things in that direction)
    // else if (selectedItemId doesn't overlap with a selection, but is adjacent to a selection, add that chunk to the shift selection in the order of that direction)

    newShiftSelection = new Set<ListogramItemId>(idsInRange);
    newShiftSelection.forEach((id: ListogramItemId) => newSelection.add(id));

    return {
        previouslyClickedId: newPreviouslyClickedId,
        selectedItemIds: newSelection,
        shiftSelection: newShiftSelection,
    };
}

function handleRegularClick(
    selection: Set<ListogramItemId>,
    selectedItemId: ListogramItemId,
    showSelectionToggles: boolean,
): ListogramSelectionState {
    let newSelection: Set<ListogramItemId>;
    const newShiftSelection = new Set<ListogramItemId>();
    let newPreviouslyClickedId: ListogramItemId | undefined;

    if (showSelectionToggles) {
        newPreviouslyClickedId = selection.has(selectedItemId) ? undefined : selectedItemId;
        newSelection = toggleValueInSelection(selection, selectedItemId);
    } else {
        newPreviouslyClickedId = selectedItemId;
        newSelection = new Set<ListogramItemId>();
        newSelection.add(selectedItemId);
    }

    return {
        previouslyClickedId: newPreviouslyClickedId,
        selectedItemIds: newSelection,
        shiftSelection: newShiftSelection,
    };
}

function toggleValueInSelection(selection: Set<ListogramItemId>, selectedItemId: ListogramItemId) {
    const newSelection = new Set<ListogramItemId>(selection);
    if (selection.has(selectedItemId)) {
        newSelection.delete(selectedItemId);
    } else {
        newSelection.add(selectedItemId);
    }
    return newSelection;
}
