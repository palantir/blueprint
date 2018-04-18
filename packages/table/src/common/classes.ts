/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

// tslint:disable:blueprint-classes-constants

export const TABLE_BODY = "pt-table-body";
export const TABLE_BODY_CELLS = "pt-table-body-cells";
export const TABLE_BODY_SCROLL_CLIENT = "pt-table-body-scroll-client";
export const TABLE_BODY_VIRTUAL_CLIENT = "pt-table-body-virtual-client";
export const TABLE_BOTTOM_CONTAINER = "pt-table-bottom-container";
export const TABLE_CELL = "pt-table-cell";
export const TABLE_CELL_CLIENT = "pt-table-cell-client";
export const TABLE_CELL_GHOST = "pt-table-cell-ghost";
export const TABLE_CELL_INTERACTIVE = "pt-table-cell-interactive";
export const TABLE_CELL_LEDGER_EVEN = "pt-table-cell-ledger-even";
export const TABLE_CELL_LEDGER_ODD = "pt-table-cell-ledger-odd";
export const TABLE_COLUMN_HEADER_TR = "pt-table-column-header-tr";
export const TABLE_COLUMN_HEADERS = "pt-table-column-headers";
export const TABLE_COLUMN_HEADER_CELL = "pt-table-column-header-cell";
export const TABLE_COLUMN_NAME = "pt-table-column-name";
export const TABLE_COLUMN_NAME_TEXT = "pt-table-column-name-text";
export const TABLE_CONTAINER = "pt-table-container";
export const TABLE_DRAGGING = "pt-table-dragging";
export const TABLE_EDITABLE_NAME = "pt-table-editable-name";
export const TABLE_EDITABLE_TEXT = "pt-table-editable-text";
export const TABLE_FOCUS_REGION = "pt-table-focus-region";
export const TABLE_HAS_INTERACTION_BAR = "pt-table-has-interaction-bar";
export const TABLE_HAS_REORDER_HANDLE = "pt-table-has-reorder-handle";
export const TABLE_HEADER = "pt-table-header";
export const TABLE_HEADER_ACTIVE = "pt-table-header-active";
export const TABLE_HEADER_CONTENT = "pt-table-header-content";
export const TABLE_HEADER_REORDERABLE = "pt-table-header-reorderable";
export const TABLE_HEADER_SELECTED = "pt-table-header-selected";
export const TABLE_HORIZONTAL_CELL_DIVIDER = "pt-table-horizontal-cell-divider";
export const TABLE_HORIZONTAL_GUIDE = "pt-table-horizontal-guide";
export const TABLE_INTERACTION_BAR = "pt-table-interaction-bar";
export const TABLE_LAST_IN_COLUMN = "pt-table-last-in-column";
export const TABLE_LAST_IN_ROW = "pt-table-last-in-row";
export const TABLE_MENU = "pt-table-menu";
export const TABLE_NO_HORIZONTAL_SCROLL = "pt-table-no-horizontal-scroll";
export const TABLE_NO_LAYOUT = "pt-table-no-layout";
export const TABLE_NO_ROWS = "pt-table-no-rows";
export const TABLE_NO_VERTICAL_SCROLL = "pt-table-no-vertical-scroll";
export const TABLE_NO_WRAP_TEXT = "pt-table-no-wrap-text";
export const TABLE_NULL = "pt-table-null";
export const TABLE_OVERLAY = "pt-table-overlay";
export const TABLE_OVERLAY_LAYER = "pt-table-overlay-layer";
export const TABLE_OVERLAY_REORDERING_CURSOR = "pt-table-reordering-cursor-overlay";
export const TABLE_POPOVER_WHITESPACE_NORMAL = "pt-table-popover-whitespace-normal";
export const TABLE_POPOVER_WHITESPACE_PRE = "pt-table-popover-whitespace-pre";
export const TABLE_QUADRANT = "pt-table-quadrant";
export const TABLE_QUADRANT_BODY_CONTAINER = "pt-table-quadrant-body-container";
export const TABLE_QUADRANT_LEFT = "pt-table-quadrant-left";
export const TABLE_QUADRANT_MAIN = "pt-table-quadrant-main";
export const TABLE_QUADRANT_SCROLL_CONTAINER = "pt-table-quadrant-scroll-container";
export const TABLE_QUADRANT_STACK = "pt-table-quadrant-stack";
export const TABLE_QUADRANT_TOP = "pt-table-quadrant-top";
export const TABLE_QUADRANT_TOP_LEFT = "pt-table-quadrant-top-left";
export const TABLE_REGION = "pt-table-region";
export const TABLE_REORDER_HANDLE = "pt-table-reorder-handle";
export const TABLE_REORDER_HANDLE_TARGET = "pt-table-reorder-handle-target";
export const TABLE_REORDERING = "pt-table-reordering";
export const TABLE_RESIZE_GUIDES = "pt-table-resize-guides";
export const TABLE_RESIZE_HANDLE = "pt-table-resize-handle";
export const TABLE_RESIZE_HANDLE_TARGET = "pt-table-resize-handle-target";
export const TABLE_RESIZE_HORIZONTAL = "pt-table-resize-horizontal";
export const TABLE_RESIZE_SENSOR = "pt-table-resize-sensor";
export const TABLE_RESIZE_SENSOR_EXPAND = "pt-table-resize-sensor-expand";
export const TABLE_RESIZE_SENSOR_SHRINK = "pt-table-resize-sensor-shrink";
export const TABLE_RESIZE_VERTICAL = "pt-table-resize-vertical";
export const TABLE_ROUNDED_LAYOUT = "pt-table-rounded-layout";
export const TABLE_ROW_HEADERS = "pt-table-row-headers";
export const TABLE_ROW_HEADERS_CELLS_CONTAINER = "pt-table-row-headers-cells-container";
export const TABLE_ROW_NAME = "pt-table-row-name";
export const TABLE_ROW_NAME_TEXT = "pt-table-row-name-text";
export const TABLE_SELECTION_ENABLED = "pt-table-selection-enabled";
export const TABLE_SELECTION_REGION = "pt-table-selection-region";
export const TABLE_TH_MENU = "pt-table-th-menu";
export const TABLE_TH_MENU_CONTAINER = "pt-table-th-menu-container";
export const TABLE_TH_MENU_CONTAINER_BACKGROUND = "pt-table-th-menu-container-background";
export const TABLE_TH_MENU_OPEN = "pt-table-th-menu-open";
export const TABLE_THEAD = "pt-table-thead";
export const TABLE_TOP_CONTAINER = "pt-table-top-container";
export const TABLE_TRUNCATED_CELL = "pt-table-truncated-cell";
export const TABLE_TRUNCATED_FORMAT = "pt-table-truncated-format";
export const TABLE_TRUNCATED_FORMAT_TEXT = "pt-table-truncated-format-text";
export const TABLE_TRUNCATED_POPOVER = "pt-table-truncated-popover";
export const TABLE_TRUNCATED_POPOVER_TARGET = "pt-table-truncated-popover-target";
export const TABLE_TRUNCATED_TEXT = "pt-table-truncated-text";
export const TABLE_TRUNCATED_VALUE = "pt-table-truncated-value";
export const TABLE_VERTICAL_GUIDE = "pt-table-vertical-guide";

/** Common code for row and column index class generator functions, since they're essentially the same. */
function dimensionIndexClass(classPrefix: string, index: string | number) {
    if (index == null) {
        return undefined;
    }

    if (typeof index === "number") {
        return `${classPrefix}${index}`;
    }

    return index.indexOf(classPrefix) === 0 ? index : `${classPrefix}${index}`;
}

/** Return CSS class for table colummn index, whether or not 'pt-table-col-' prefix is included. */
export function columnIndexClass(columnIndex: string | number) {
    return dimensionIndexClass("pt-table-col-", columnIndex);
}

/** Return CSS class for table row index, whether or not 'pt-table-row-' prefix is included. */
export function rowIndexClass(rowIndex: string | number) {
    return dimensionIndexClass("pt-table-row-", rowIndex);
}

/** Return CSS class for table colummn cell index, whether or not 'pt-table-cell-col-' prefix is included. */
export function columnCellIndexClass(columnIndex: string | number) {
    return dimensionIndexClass("pt-table-cell-col-", columnIndex);
}

/** Return CSS class for table row cell index, whether or not 'pt-table-cell-row-' prefix is included. */
export function rowCellIndexClass(rowIndex: string | number) {
    return dimensionIndexClass("pt-table-cell-row-", rowIndex);
}

// tslint:enable:blueprint-classes-constants
