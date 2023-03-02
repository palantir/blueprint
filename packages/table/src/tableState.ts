/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
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

import type { ColumnProps } from "./column";
import type { Rect } from "./common";
import type { FocusedCellCoordinates } from "./common/cellTypes";
import { ScrollDirection } from "./common/scrollDirection";
import type { Region } from "./regions";

export interface TableState {
    /**
     * An array of column widths. These are initialized from the column props
     * and updated when the user drags column header resize handles.
     */
    columnWidths: number[];

    /**
     * The coordinates of the currently focused table cell
     */
    focusedCell: FocusedCellCoordinates | undefined;

    /**
     * An array of pixel offsets for resize guides, which are drawn over the
     * table body when a row is being resized.
     */
    horizontalGuides: number[];

    /**
     * Flag indicating that both the column headers (if present)
     * and row headers (if present) have been rendered and mounted, including any
     * custom renderers which may affect quadrant layout measurements.
     */
    didHeadersMount: boolean;

    /**
     * If `true`, will disable updates that will cause re-renders of children
     * components. This is used, for example, to disable layout updates while
     * the user is dragging a resize handle.
     */
    isLayoutLocked?: boolean;

    /**
     * Whether the user is currently dragging to reorder one or more elements.
     * Can be referenced to toggle the reordering-cursor overlay, which
     * displays a `grabbing` CSS cursor wherever the mouse moves in the table
     * for the duration of the dragging interaction.
     */
    isReordering?: boolean;

    /**
     * The number of frozen columns, clamped to [0, num <Column>s].
     */
    numFrozenColumnsClamped: number;

    /**
     * The number of frozen rows, clamped to [0, numRows].
     */
    numFrozenRowsClamped: number;

    /**
     * An array of row heights. These are initialized updated when the user
     * drags row header resize handles.
     */
    rowHeights: number[];

    /**
     * An array of Regions representing the selections of the table.
     */
    selectedRegions: Region[];

    /**
     * An array of pixel offsets for resize guides, which are drawn over the
     * table body when a column is being resized.
     */
    verticalGuides: number[];

    /**
     * The `Rect` bounds of the viewport used to perform virtual viewport
     * performance enhancements.
     */
    viewportRect?: Rect;

    columnIdToIndex: { [key: string]: number };

    childrenArray: Array<React.ReactElement<ColumnProps>>;

    scrollDirection?: ScrollDirection | null;
}

export interface TableSnapshot {
    nextScrollTop?: number;
    nextScrollLeft?: number;
}
