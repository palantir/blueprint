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

/* eslint-disable deprecation/deprecation */

export { Cell, type CellProps, type ICellProps, type ICellRenderer, type CellRenderer } from "./cell/cell";

export { EditableCell, type IEditableCellProps, type EditableCellProps } from "./cell/editableCell";

export { EditableCell2, type EditableCell2Props } from "./cell/editableCell2";

export { JSONFormat, type IJSONFormatProps, type JSONFormatProps } from "./cell/formats/jsonFormat";

export { JSONFormat2 } from "./cell/formats/jsonFormat2";

export {
    TruncatedFormat,
    TruncatedPopoverMode,
    type TruncatedFormatProps,
    type ITruncatedFormatProps,
} from "./cell/formats/truncatedFormat";

export { TruncatedFormat2 } from "./cell/formats/truncatedFormat2";

export { Column, type ColumnProps, type IColumnProps } from "./column";

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

export { type IDraggableProps, Draggable } from "./interactions/draggable";

export type {
    IClientCoordinates,
    ClientCoordinates,
    ICoordinateData,
    CoordinateData,
    IDragHandler,
    DragHandler,
} from "./interactions/dragTypes";

export {
    CopyCellsMenuItem,
    type IContextMenuRenderer,
    type ContextMenuRenderer,
    type IMenuContext,
} from "./interactions/menus";

export {
    type ILockableLayout,
    type IResizeHandleProps,
    type Orientation,
    ResizeHandle,
} from "./interactions/resizeHandle";

export { type ISelectableProps, type IDragSelectableProps, DragSelectable } from "./interactions/selectable";

export type { ColumnHeaderRenderer, IColumnHeaderRenderer } from "./headers/columnHeader";

export type { RowHeaderRenderer } from "./headers/rowHeader";

export {
    ColumnHeaderCell,
    type ColumnHeaderCellProps,
    type IColumnHeaderCellProps,
    HorizontalCellDivider,
} from "./headers/columnHeaderCell";

export { ColumnHeaderCell2, type ColumnHeaderCell2Props } from "./headers/columnHeaderCell2";

export { type IRowHeaderCellProps, type RowHeaderCellProps, RowHeaderCell } from "./headers/rowHeaderCell";

export { RowHeaderCell2 } from "./headers/rowHeaderCell2";

export { type IEditableNameProps, type EditableNameProps, EditableName } from "./headers/editableName";

export {
    type CellInterval,
    type CellCoordinate,
    ColumnLoadingOption,
    type ICellInterval,
    type IRegion,
    type Region,
    type IStyledRegionGroup,
    RegionCardinality,
    Regions,
    RowLoadingOption,
    SelectionModes,
    type StyledRegionGroup,
    TableLoadingOption,
} from "./regions";

export type { ITableProps, TableProps } from "./tableProps";

export { Table } from "./table";

export { Table2, type Table2Props } from "./table2";
