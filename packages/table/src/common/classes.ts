/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

export const TABLE_CELL = "bp-table-cell";
export const TABLE_CELL_INTERACTIVE = "bp-table-cell-interactive";
export const TABLE_TRUNCATED_TEXT = "bp-table-truncated-text";
export const TABLE_EDITABLE_NAME = "bp-table-editable-name";
export const TABLE_NULL = "bp-table-null";
export const TABLE_TRUNCATED_POPOVER = "bp-table-truncated-popover";
export const TABLE_POPOVER_WHITESPACE_PRE = "bp-table-popover-whitespace-pre";
export const TABLE_POPOVER_WHITESPACE_NORMAL = "bp-table-popover-whitespace-normal";
export const TABLE_TRUNCATED_FORMAT = "bp-table-truncated-format";
export const TABLE_TRUNCATED_VALUE = "bp-table-truncated-value";
export const TABLE_TRUNCATED_POPOVER_TARGET = "bp-table-truncated-popover-target";
export const TABLE_LAST_IN_ROW = "bp-table-last-in-row";
export const TABLE_LAST_IN_COLUMN = "bp-table-last-in-column";
export const TABLE_ROUNDED_LAYOUT = "bp-table-rounded-layout";
export const TABLE_NO_LAYOUT = "bp-table-no-layout";
export const TABLE_THEAD = "bp-table-thead";
export const TABLE_COLUMN_HEADER_TR = "bp-table-column-header-tr";
export const TABLE_DRAGGABLE = "bp-table-draggable";
export const TABLE_HEADER = "bp-table-header";
export const TABLE_COLUMN_NAME = "bp-table-column-name";
export const TABLE_HEADER_CONTENT = "bp-table-header-content";
export const TABLE_COLUMN_NAME_TEXT = "bp-table-column-name-text";
export const TABLE_INTERACTION_BAR = "bp-table-interaction-bar";
export const TABLE_HORIZONTAL_CELL_DIVIDER = "bp-table-horizontal-cell-divider";
export const TABLE_TH_MENU = "bp-table-th-menu";
export const TABLE_HEADER_ACTIVE = "bp-table-header-active";
export const TABLE_HEADER_SELECTED = "bp-table-header-selected";
export const TABLE_ROW_NAME = "bp-table-row-name";
export const TABLE_ROW_NAME_TEXT = "bp-table-row-name-text";
export const TABLE_RESIZE_HANDLE_TARGET = "bp-table-resize-handle-target";
export const TABLE_DRAGGING = "bp-table-dragging";
export const TABLE_RESIZE_HORIZONTAL = "bp-table-resize-horizontal";
export const TABLE_RESIZE_VERTICAL = "bp-table-resize-vertical";
export const TABLE_RESIZE_HANDLE = "bp-table-resize-handle";
export const TABLE_RESIZE_SENSOR = "bp-table-resize-sensor";
export const TABLE_RESIZE_SENSOR_EXPAND = "bp-table-resize-sensor-expand";
export const TABLE_RESIZE_SENSOR_SHRINK = "bp-table-resize-sensor-shrink";
export const TABLE_OVERLAY_LAYER = "bp-table-overlay-layer";
export const TABLE_OVERLAY = "bp-table-overlay";
export const TABLE_VERTICAL_GUIDE = "bp-table-vertical-guide";
export const TABLE_HORIZONTAL_GUIDE = "bp-table-horizontal-guide";
export const TABLE_REGION = "bp-table-region";
export const TABLE_SELECTION_REGION = "bp-table-selection-region";
export const TABLE_CONTAINER = "bp-table-container";
export const TABLE_TOP_CONTAINER = "bp-table-top-container";
export const TABLE_BOTTOM_CONTAINER = "bp-table-bottom-container";
export const TABLE_MENU = "bp-table-menu";
export const TABLE_COLUMN_HEADERS = "bp-table-column-headers";
export const TABLE_SELECTION_ENABLED = "bp-table-selection-enabled";
export const TABLE_ROW_HEADERS = "bp-table-row-headers";
export const TABLE_BODY = "bp-table-body";
export const TABLE_NO_HORIZONTAL_SCROLL = "bp-table-no-horizontal-scroll";
export const TABLE_NO_VERTICAL_SCROLL = "bp-table-no-vertical-scroll";
export const TABLE_BODY_SCROLL_CLIENT = "bp-table-body-scroll-client";
export const TABLE_RESIZE_GUIDES = "bp-table-resize-guides";
export const TABLE_BODY_VIRTUAL_CLIENT = "bp-table-body-virtual-client";
export const TABLE_CELL_CLIENT = "bp-table-cell-client";
export const TABLE_CELL_GHOST = "bp-table-cell-ghost";
export const TABLE_CELL_LEDGER_ODD = "bp-table-cell-ledger-odd";
export const TABLE_CELL_LEDGER_EVEN = "bp-table-cell-ledger-even";

/** Common code for row and column index class generator functions, since they're essentially the same */
function dimensionIndexClass(classPrefix: string, index: string | number) {
    if (index == null) {
        return undefined;
    }

    if (typeof index === "number") {
        return `${classPrefix}${index}`;
    }

    return index.indexOf(classPrefix) === 0 ? index : `${classPrefix}${index}`;
}

/** Return CSS class for table colummn index, whether or not 'bp-table-col-' prefix is included */
export function columnIndexClass(columnIndex: string | number) {
    return dimensionIndexClass("bp-table-col-", columnIndex);
}

/** Return CSS class for table row index, whether or not 'bp-table-row-' prefix is included */
export function rowIndexClass(rowIndex: string | number) {
    return dimensionIndexClass("bp-table-row-", rowIndex);
}

/** Return CSS class for table colummn cell index, whether or not 'bp-table-cell-col-' prefix is included */
export function columnCellIndexClass(columnIndex: string | number) {
    return dimensionIndexClass("bp-table-cell-col-", columnIndex);
}

/** Return CSS class for table row cell index, whether or not 'bp-table-cell-row-' prefix is included */
export function rowCellIndexClass(rowIndex: string | number) {
    return dimensionIndexClass("bp-table-cell-row-", rowIndex);
}
