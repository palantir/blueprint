/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

const ns = "[Blueprint Table]";
const deprec = `${ns} DEPRECATION:`;

export const COLUMN_HEADER_CELL_MENU_DEPRECATED =
    `${deprec} <ColumnHeaderCell> menu is deprecated. Use renderMenu instead.`;

export const ROW_HEADER_CELL_MENU_DEPRECATED =
    `${deprec} <RowHeaderCell> menu is deprecated. Use renderMenu instead.`;

export const QUADRANT_ON_SCROLL_UNNECESSARILY_DEFINED =
    `${ns} <TableQuadrant> onScroll need not be defined for any quadrant aside from the MAIN quadrant.`;

export const TABLE_NON_COLUMN_CHILDREN_WARNING =
    `${ns} <Table> Children of Table must be Columns"`;

export const TABLE_NUM_FROZEN_COLUMNS_BOUND_WARNING =
    `${ns} <Table> numFrozenColumns must be in [0, number of columns]`;

export const TABLE_NUM_FROZEN_ROWS_BOUND_WARNING =
    `${ns} <Table> numFrozenRows must be in [0, numRows]`;

export const TABLE_EXPAND_FOCUSED_SELECTION_MULTI_ROW_REGION =
    `${ns} <Table> Cannot expand a FULL_COLUMNS selection using a multi-row region`;

export const TABLE_EXPAND_FOCUSED_SELECTION_MULTI_COLUMN_REGION =
    `${ns} <Table> Cannot expand a FULL_COLUMNS selection using a multi-column region`;
