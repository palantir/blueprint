/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { Intent } from "./intent";

// modifiers
export const DARK = "pt-dark";
export const ACTIVE = "pt-active";
export const MINIMAL = "pt-minimal";
export const DISABLED = "pt-disabled";
export const SMALL = "pt-small";
export const LARGE = "pt-large";
export const LOADING = "pt-loading";
export const INTERACTIVE = "pt-interactive";
export const ALIGN_LEFT = "pt-align-left";
export const ALIGN_RIGHT = "pt-align-right";
export const INLINE = "pt-inline";
export const FILL = "pt-fill";
export const FIXED = "pt-fixed";
export const FIXED_TOP = "pt-fixed-top";
export const VERTICAL = "pt-vertical";
export const ROUND = "pt-round";

// text utilities
export const TEXT_MUTED = "pt-text-muted";
export const TEXT_OVERFLOW_ELLIPSIS = "pt-text-overflow-ellipsis";
export const UI_TEXT_LARGE = "pt-ui-text-large";

// components
export const ALERT = "pt-alert";
export const ALERT_BODY = "pt-alert-body";
export const ALERT_CONTENTS = "pt-alert-contents";
export const ALERT_FOOTER = "pt-alert-footer";

export const BREADCRUMB = "pt-breadcrumb";
export const BREADCRUMB_CURRENT = "pt-breadcrumb-current";
export const BREADCRUMBS = "pt-breadcrumbs";
export const BREADCRUMBS_COLLAPSED = "pt-breadcrumbs-collapsed";

export const BUTTON = "pt-button";
export const BUTTON_GROUP = "pt-button-group";

export const CALLOUT = "pt-callout";

export const CARD = "pt-card";

export const COLLAPSE = "pt-collapse";

export const COLLAPSIBLE_LIST = "pt-collapse-list";

export const CONTEXT_MENU = "pt-context-menu";
export const CONTEXT_MENU_POPOVER_TARGET = "pt-context-menu-popover-target";

export const CONTROL = "pt-control";
export const CONTROL_GROUP = "pt-control-group";
export const CONTROL_INDICATOR = "pt-control-indicator";

export const DIALOG = "pt-dialog";
export const DIALOG_BODY = "pt-dialog-body";
export const DIALOG_CLOSE_BUTTON = "pt-dialog-close-button";
export const DIALOG_FOOTER = "pt-dialog-footer";
export const DIALOG_FOOTER_ACTIONS = "pt-dialog-footer-actions";
export const DIALOG_HEADER = "pt-dialog-header";

export const EDITABLE_TEXT = "pt-editable-text";

export const ELEVATION_0 = "pt-elevation-0";
export const ELEVATION_1 = "pt-elevation-1";
export const ELEVATION_2 = "pt-elevation-2";
export const ELEVATION_3 = "pt-elevation-3";
export const ELEVATION_4 = "pt-elevation-4";

export const INPUT = "pt-input";
export const INPUT_GROUP = "pt-input-group";
export const CHECKBOX = "pt-checkbox";
export const RADIO = "pt-radio";
export const SWITCH = "pt-switch";
export const FILE_UPLOAD = "pt-file-upload";
export const FILE_UPLOAD_INPUT = "pt-file-upload-input";

export const INTENT_PRIMARY = "pt-intent-primary";
export const INTENT_SUCCESS = "pt-intent-success";
export const INTENT_WARNING = "pt-intent-warning";
export const INTENT_DANGER = "pt-intent-danger";

export const LABEL = "pt-label";
export const FORM_GROUP = "pt-form-group";
export const FORM_CONTENT = "pt-form-content";
export const FORM_HELPER_TEXT = "pt-form-helper-text";

export const MENU = "pt-menu";
export const MENU_ITEM = "pt-menu-item";
export const MENU_ITEM_LABEL = "pt-menu-item-label";
export const MENU_SUBMENU = "pt-submenu";
export const MENU_DIVIDER = "pt-menu-divider";
export const MENU_HEADER = "pt-menu-header";

export const NAVBAR = "pt-navbar";
export const NAVBAR_GROUP = "pt-navbar-group";
export const NAVBAR_HEADING = "pt-navbar-heading";
export const NAVBAR_DIVIDER = "pt-navbar-divider";

export const NON_IDEAL_STATE = "pt-non-ideal-state";
export const NON_IDEAL_STATE_ACTION = "pt-non-ideal-state-action";
export const NON_IDEAL_STATE_DESCRIPTION = "pt-non-ideal-state-description";
export const NON_IDEAL_STATE_ICON = "pt-non-ideal-state-icon";
export const NON_IDEAL_STATE_TITLE = "pt-non-ideal-state-title";
export const NON_IDEAL_STATE_VISUAL = "pt-non-ideal-state-visual";

export const NUMERIC_INPUT = "pt-numeric-input";

export const OVERLAY = "pt-overlay";
export const OVERLAY_BACKDROP = "pt-overlay-backdrop";
export const OVERLAY_CONTENT = "pt-overlay-content";
export const OVERLAY_INLINE = "pt-overlay-inline";
export const OVERLAY_OPEN = "pt-overlay-open";
export const OVERLAY_SCROLL_CONTAINER = "pt-overlay-scroll-container";

export const POPOVER = "pt-popover";
export const POPOVER_ARROW = "pt-popover-arrow";
export const POPOVER_BACKDROP = "pt-popover-backdrop";
export const POPOVER_CONTENT = "pt-popover-content";
export const POPOVER_DISMISS = "pt-popover-dismiss";
export const POPOVER_DISMISS_OVERRIDE = "pt-popover-dismiss-override";
export const POPOVER_OPEN = "pt-popover-open";
export const POPOVER_TARGET = "pt-popover-target";
export const TRANSITION_CONTAINER = "pt-transition-container";

export const PROGRESS_BAR = "pt-progress-bar";
export const PROGRESS_METER = "pt-progress-meter";
export const PROGRESS_NO_STRIPES = "pt-no-stripes";
export const PROGRESS_NO_ANIMATION = "pt-no-animation";

export const PORTAL = "pt-portal";

export const SELECT = "pt-select";

export const SKELETON = "pt-skeleton";

export const SLIDER = "pt-slider";
export const SLIDER_HANDLE = `${SLIDER}-handle`;
export const SLIDER_LABEL = `${SLIDER}-label`;
export const RANGE_SLIDER = "pt-range-slider";

export const SPINNER = "pt-spinner";
export const SVG_SPINNER = "pt-svg-spinner";

export const TAB = "pt-tab";
export const TAB_LIST = "pt-tab-list";
export const TAB_PANEL = "pt-tab-panel";
export const TABS = "pt-tabs";

export const TABLE = "pt-table";
export const TABLE_CONDENSED = "pt-condensed";
export const TABLE_STRIPED = "pt-striped";
export const TABLE_BORDERED = "pt-bordered";

export const TAG = "pt-tag";
export const TAG_REMOVABLE = "pt-tag-removable";
export const TAG_REMOVE = "pt-tag-remove";

export const TOAST = "pt-toast";
export const TOAST_CONTAINER = "pt-toast-container";
export const TOAST_MESSAGE = "pt-toast-message";

export const TOOLTIP = "pt-tooltip";

export const TREE = "pt-tree";
export const TREE_NODE = "pt-tree-node";
export const TREE_NODE_CARET = "pt-tree-node-caret";
export const TREE_NODE_CARET_CLOSED = "pt-tree-node-caret-closed";
export const TREE_NODE_CARET_NONE = "pt-tree-node-caret-none";
export const TREE_NODE_CARET_OPEN = "pt-tree-node-caret-open";
export const TREE_NODE_CONTENT = "pt-tree-node-content";
export const TREE_NODE_EXPANDED = "pt-tree-node-expanded";
export const TREE_NODE_ICON = "pt-tree-node-icon";
export const TREE_NODE_LABEL = "pt-tree-node-label";
export const TREE_NODE_LIST = "pt-tree-node-list";
export const TREE_NODE_SECONDARY_LABEL = "pt-tree-node-secondary-label";
export const TREE_NODE_SELECTED = "pt-tree-node-selected";
export const TREE_ROOT = "pt-tree-root";

export const ICON = "pt-icon";
export const ICON_STANDARD = "pt-icon-standard";
export const ICON_LARGE = "pt-icon-large";

/** Return CSS class for icon, whether or not 'pt-icon-' prefix is included */
export function iconClass(iconName: string) {
    if (iconName == null) {
        return undefined;
    }
    return iconName.indexOf("pt-icon-") === 0 ? iconName : `pt-icon-${iconName}`;
}

export function intentClass(intent = Intent.NONE) {
    if (intent === Intent.NONE || Intent[intent] == null) {
        return undefined;
    }
    return `pt-intent-${Intent[intent].toLowerCase()}`;
}
