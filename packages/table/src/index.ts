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

export { Cell, type CellProps, type CellRenderer } from "./cell/cell";

export { EditableCell, type EditableCellProps } from "./cell/editableCell";

export { EditableCell2, type EditableCell2Props } from "./cell/editableCell2";

export { JSONFormat, type JSONFormatProps } from "./cell/formats/jsonFormat";

export { TruncatedPopoverMode, TruncatedFormat, type TruncatedFormatProps } from "./cell/formats/truncatedFormat";

export { Column, type ColumnProps } from "./column";

export {
    type AnyRect,
    type CellCoordinates,
    Clipboard,
    type FocusedCellCoordinates,
    Grid,
    Rect,
    RenderMode,
    Utils,
} from "./common/index";

export { type DraggableProps, Draggable } from "./interactions/draggable";

export { type ClientCoordinates, type CoordinateData, type DragHandler } from "./interactions/dragTypes";

export { CopyCellsMenuItem, type ContextMenuRenderer, type MenuContext } from "./interactions/menus";

export { type LockableLayout, type ResizeHandleProps, Orientation, ResizeHandle } from "./interactions/resizeHandle";

export { type SelectableProps, type DragSelectableProps, DragSelectable } from "./interactions/selectable";

export type { ColumnHeaderRenderer } from "./headers/columnHeader";

export type { RowHeaderRenderer } from "./headers/rowHeader";

export { ColumnHeaderCell, type ColumnHeaderCellProps } from "./headers/columnHeaderCell";

export { HorizontalCellDivider } from "./headers/horizontalCellDivider";

export { type RowHeaderCellProps, RowHeaderCell } from "./headers/rowHeaderCell";

export { type EditableNameProps, EditableName } from "./headers/editableName";

export {
    type CellCoordinate,
    type CellInterval,
    ColumnLoadingOption,
    type Region,
    RegionCardinality,
    Regions,
    RowLoadingOption,
    SelectionModes,
    type StyledRegionGroup,
    TableLoadingOption,
} from "./regions";

// eslint-disable-next-line deprecation/deprecation
export { Table } from "./table";

export type { TableProps } from "./tableProps";

export { Table2, type Table2Props } from "./table2";

export * from "./deprecatedAliases";
