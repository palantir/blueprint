/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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

import type { FocusedRegion, FocusMode } from "./common/cellTypes";
import { type ContextMenuRenderer } from "./interactions/menus";
import { type SelectableProps } from "./interactions/selectable";
import type { Locator } from "./locator";
import { type TableBodyCellsProps } from "./tableBodyCells";

export interface TableBodyProps extends SelectableProps, TableBodyCellsProps {
    /**
     * An optional callback for displaying a context menu when right-clicking
     * on the table body. The callback is supplied with a `MenuContext`
     * containing the `Region`s of interest.
     */
    bodyContextMenuRenderer?: ContextMenuRenderer;

    /**
     * The the type shape allowed for focus areas. Can be cell, row, or none.
     */
    focusMode: FocusMode | undefined;

    /**
     * Locates the row/column/cell given a mouse event.
     */
    locator: Locator;

    /**
     * The number of columns to freeze to the left side of the table, counting from the leftmost column.
     */
    numFrozenColumns?: number;

    /**
     * The number of rows to freeze to the top of the table, counting from the topmost row.
     */
    numFrozenRows?: number;

    /**
     * Callback invoked when the focused region changes
     */
    onFocusedRegion: (focusedRegion: FocusedRegion) => void;
}
