/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

import { getClassNamespace } from "../../common/classes";

const NS = getClassNamespace();

// TODO: contribute "button link" styles to @blueprintjs/core
export const BUTTON_LINK = `${NS}-button-link`;

export const LISTOGRAM = `${NS}-listogram`;
export const LISTOGRAM_EXCLUDED = `${LISTOGRAM}-excluded`;
export const MULTI_LISTOGRAM = `${NS}-multi-listogram`;

export const LISTOGRAM_BAR = `${LISTOGRAM}-bar`;
export const LISTOGRAM_EXPAND_BUTTON = `${LISTOGRAM}-expand-button`;

export const LISTOGRAM_HEADER = `${LISTOGRAM}-header`;
export const LISTOGRAM_HEADER_TITLE = `${LISTOGRAM_HEADER}-title`;

export const LISTOGRAM_ITEM = `${LISTOGRAM}-item`;
export const LISTOGRAM_ITEM_FIRST_OF_SELECTION_BLOB = `${LISTOGRAM_ITEM}-first-of-selection-blob`;
export const LISTOGRAM_ITEM_LAST_OF_SELECTION_BLOB = `${LISTOGRAM_ITEM}-last-of-selection-blob`;
export const LISTOGRAM_ITEM_SHOWING_MULTIPLE_SERIES = `${LISTOGRAM_ITEM}-showing-multiple-series`;
export const LISTOGRAM_ITEM_BARS = `${LISTOGRAM_ITEM}-bars`;
export const LISTOGRAM_ITEM_BAR_WITH_SERIE_COLOR = `${LISTOGRAM_ITEM_BARS}-with-serie-color`;
export const LISTOGRAM_ITEM_BAR_TOOLTIP = `${LISTOGRAM_ITEM_BARS}-tooltip`;
export const LISTOGRAM_ITEM_COUNT = `${LISTOGRAM_ITEM}-count`;
export const LISTOGRAM_ITEM_BAR_HIDDEN = `${LISTOGRAM_ITEM}-bar-hidden`;
// "-subtotal" only used when hasSubtotals={true}
export const LISTOGRAM_ITEM_COUNT_SUBTOTAL = `${LISTOGRAM_ITEM_COUNT}-subtotal`;
// "-total" only used when hasSubtotals={true}
export const LISTOGRAM_ITEM_COUNT_TOTAL = `${LISTOGRAM_ITEM_COUNT}-total`;
export const LISTOGRAM_ITEM_COUNT_WRAPPER = `${LISTOGRAM_ITEM_COUNT}-wrapper`;
export const LISTOGRAM_ITEM_COUNT_WRAPPER_SHOWING_SUBTOTAL = `${LISTOGRAM_ITEM_COUNT}-wrapper-showing-subtotal`;
export const LISTOGRAM_ITEM_COUNT_WITH_SERIE_COLOR = `${LISTOGRAM_ITEM_COUNT}-with-serie-color`;
export const LISTOGRAM_ITEM_COUNT_DISPLAY_VALUE_WRAPPER = `${LISTOGRAM_ITEM_COUNT}-display-value-wrapper`;
export const LISTOGRAM_ITEM_TOGGLE_CONTROL = `${LISTOGRAM_ITEM}-toggle-control`;
export const LISTOGRAM_ITEM_EXCLUDED_CHECKBOX = `${LISTOGRAM_ITEM}-excluded-checkbox`;
export const LISTOGRAM_ITEM_TEXT = `${LISTOGRAM_ITEM}-text`;
export const LISTOGRAM_ITEM_TEXT_WRAPPER = `${LISTOGRAM_ITEM_TEXT}-wrapper`;
export const LISTOGRAM_ITEM_EXCLUDED = `${LISTOGRAM_ITEM}-excluded`;

export const LISTOGRAM_DRAWER = `${LISTOGRAM}-drawer`;
export const LISTOGRAM_SORT_DRAWER = `${LISTOGRAM}-sort-drawer`;
export const LISTOGRAM_SORT_DRAWER_BUTTON = `${LISTOGRAM_SORT_DRAWER}-button`;
export const LISTOGRAM_SORT_DRAWER_TYPES = `${LISTOGRAM_SORT_DRAWER}-types`;
export const LISTOGRAM_SORT_DRAWER_TYPE = `${LISTOGRAM_SORT_DRAWER}-type`;

export const LISTOGRAM_SELECTION_DRAWER = `${LISTOGRAM}-selection-drawer`;
export const LISTOGRAM_SELECTION_DRAWER_BUTTON = `${LISTOGRAM_SELECTION_DRAWER}-button`;
export const LISTOGRAM_SELECTION_CLEAR_ALL = `${LISTOGRAM}-selection-clear-all`;
export const LISTOGRAM_SELECTION_MODE = `${LISTOGRAM}-selection-mode`;
export const LISTOGRAM_SELECTION_MODE_BUTTON = `${LISTOGRAM_SELECTION_MODE}-button`;
export const LISTOGRAM_SELECTION_MODE_POPOVER = `${LISTOGRAM_SELECTION_MODE}-popover`;
