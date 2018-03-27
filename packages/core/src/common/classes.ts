/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Alignment } from "./alignment";
import { Intent } from "./intent";

const NS = process.env.BLUEPRINT_NAMESPACE || "pt";

// modifiers
export const DARK = `${NS}-dark`;
export const ACTIVE = `${NS}-active`;
export const MINIMAL = `${NS}-minimal`;
export const DISABLED = `${NS}-disabled`;
export const SMALL = `${NS}-small`;
export const LARGE = `${NS}-large`;
export const LOADING = `${NS}-loading`;
export const INTERACTIVE = `${NS}-interactive`;
export const ALIGN_LEFT = `${NS}-align-left`;
export const ALIGN_RIGHT = `${NS}-align-right`;
export const INLINE = `${NS}-inline`;
export const FILL = `${NS}-fill`;
export const FIXED = `${NS}-fixed`;
export const FIXED_TOP = `${NS}-fixed-top`;
export const VERTICAL = `${NS}-vertical`;
export const ROUND = `${NS}-round`;

// text utilities
export const TEXT_MUTED = `${NS}-text-muted`;
export const TEXT_OVERFLOW_ELLIPSIS = `${NS}-text-overflow-ellipsis`;
export const UI_TEXT = `${NS}-ui-text`;
export const UI_TEXT_LARGE = `${NS}-ui-text-large`;
export const RUNNING_TEXT = `${NS}-running-text`;
export const RUNNING_TEXT_SMALL = `${NS}-running-text-small`;
export const MONOSPACE_TEXT = `${NS}-monospace-text`;

// lists
export const LIST = `${NS}-list`;
export const LIST_UNSTYLED = `${NS}-list-unstyled`;

// components
export const ALERT = `${NS}-alert`;
export const ALERT_BODY = `${NS}-alert-body`;
export const ALERT_CONTENTS = `${NS}-alert-contents`;
export const ALERT_FOOTER = `${NS}-alert-footer`;

export const BREADCRUMB = `${NS}-breadcrumb`;
export const BREADCRUMB_CURRENT = `${NS}-breadcrumb-current`;
export const BREADCRUMBS = `${NS}-breadcrumbs`;
export const BREADCRUMBS_COLLAPSED = `${NS}-breadcrumbs-collapsed`;

export const BUTTON = `${NS}-button`;
export const BUTTON_GROUP = `${NS}-button-group`;
export const BUTTON_SPINNER = `${NS}-button-spinner`;
export const BUTTON_TEXT = `${NS}-button-text`;

export const CALLOUT = `${NS}-callout`;
export const CALLOUT_ICON = `${NS}-callout-icon`;
export const CALLOUT_TITLE = `${NS}-callout-title`;

export const CARD = `${NS}-card`;

export const COLLAPSE = `${NS}-collapse`;

export const COLLAPSIBLE_LIST = `${NS}-collapse-list`;

export const CONTEXT_MENU = `${NS}-context-menu`;
export const CONTEXT_MENU_POPOVER_TARGET = `${NS}-context-menu-popover-target`;

export const CONTROL = `${NS}-control`;
export const CONTROL_GROUP = `${NS}-control-group`;
export const CONTROL_INDICATOR = `${NS}-control-indicator`;

export const DIALOG = `${NS}-dialog`;
export const DIALOG_CONTAINER = `${NS}-dialog-container`;
export const DIALOG_BODY = `${NS}-dialog-body`;
export const DIALOG_CLOSE_BUTTON = `${NS}-dialog-close-button`;
export const DIALOG_FOOTER = `${NS}-dialog-footer`;
export const DIALOG_FOOTER_ACTIONS = `${NS}-dialog-footer-actions`;
export const DIALOG_HEADER = `${NS}-dialog-header`;
export const DIALOG_HEADER_TITLE = `${NS}-dialog-header-title`;

export const EDITABLE_TEXT = `${NS}-editable-text`;

export const ELEVATION_0 = `${NS}-elevation-0`;
export const ELEVATION_1 = `${NS}-elevation-1`;
export const ELEVATION_2 = `${NS}-elevation-2`;
export const ELEVATION_3 = `${NS}-elevation-3`;
export const ELEVATION_4 = `${NS}-elevation-4`;

export const HTML_TABLE = `${NS}-html-table`;
export const HTML_TABLE_STRIPED = `${NS}-html-table-striped`;
export const HTML_TABLE_BORDERED = `${NS}-html-table-bordered`;

export const INPUT = `${NS}-input`;
export const INPUT_GROUP = `${NS}-input-group`;

export const CHECKBOX = `${NS}-checkbox`;
export const RADIO = `${NS}-radio`;
export const SWITCH = `${NS}-switch`;
export const FILE_INPUT = `${NS}-file-input`;
export const FILE_UPLOAD_INPUT = `${NS}-file-upload-input`;

export const INPUT_GHOST = `${NS}-input-ghost`;

export const INTENT_PRIMARY = `${NS}-intent-primary`;
export const INTENT_SUCCESS = `${NS}-intent-success`;
export const INTENT_WARNING = `${NS}-intent-warning`;
export const INTENT_DANGER = `${NS}-intent-danger`;

export const LABEL = `${NS}-label`;
export const FORM_GROUP = `${NS}-form-group`;
export const FORM_CONTENT = `${NS}-form-content`;
export const FORM_HELPER_TEXT = `${NS}-form-helper-text`;

export const MENU = `${NS}-menu`;
export const MENU_ITEM = `${NS}-menu-item`;
export const MENU_ITEM_LABEL = `${NS}-menu-item-label`;
export const MENU_SUBMENU = `${NS}-submenu`;
export const MENU_DIVIDER = `${NS}-menu-divider`;
export const MENU_HEADER = `${NS}-menu-header`;

export const NAVBAR = `${NS}-navbar`;
export const NAVBAR_GROUP = `${NS}-navbar-group`;
export const NAVBAR_HEADING = `${NS}-navbar-heading`;
export const NAVBAR_DIVIDER = `${NS}-navbar-divider`;

export const NON_IDEAL_STATE = `${NS}-non-ideal-state`;
export const NON_IDEAL_STATE_ACTION = `${NS}-non-ideal-state-action`;
export const NON_IDEAL_STATE_DESCRIPTION = `${NS}-non-ideal-state-description`;
export const NON_IDEAL_STATE_ICON = `${NS}-non-ideal-state-icon`;
export const NON_IDEAL_STATE_TITLE = `${NS}-non-ideal-state-title`;
export const NON_IDEAL_STATE_VISUAL = `${NS}-non-ideal-state-visual`;

export const NUMERIC_INPUT = `${NS}-numeric-input`;

export const OVERLAY = `${NS}-overlay`;
export const OVERLAY_BACKDROP = `${NS}-overlay-backdrop`;
export const OVERLAY_CONTENT = `${NS}-overlay-content`;
export const OVERLAY_INLINE = `${NS}-overlay-inline`;
export const OVERLAY_OPEN = `${NS}-overlay-open`;
export const OVERLAY_SCROLL_CONTAINER = `${NS}-overlay-scroll-container`;

export const POPOVER = `${NS}-popover`;
export const POPOVER_ARROW = `${NS}-popover-arrow`;
export const POPOVER_BACKDROP = `${NS}-popover-backdrop`;
export const POPOVER_CONTENT = `${NS}-popover-content`;
export const POPOVER_DISMISS = `${NS}-popover-dismiss`;
export const POPOVER_DISMISS_OVERRIDE = `${NS}-popover-dismiss-override`;
export const POPOVER_OPEN = `${NS}-popover-open`;
export const POPOVER_TARGET = `${NS}-popover-target`;
export const POPOVER_WRAPPER = `${NS}-popover-wrapper`;
export const TRANSITION_CONTAINER = `${NS}-transition-container`;

export const PROGRESS_BAR = `${NS}-progress-bar`;
export const PROGRESS_METER = `${NS}-progress-meter`;
export const PROGRESS_NO_STRIPES = `${NS}-no-stripes`;
export const PROGRESS_NO_ANIMATION = `${NS}-no-animation`;

export const PORTAL = `${NS}-portal`;

export const SELECT = `${NS}-select`;

export const SKELETON = `${NS}-skeleton`;

export const SLIDER = `${NS}-slider`;
export const SLIDER_HANDLE = `${SLIDER}-handle`;
export const SLIDER_LABEL = `${SLIDER}-label`;
export const RANGE_SLIDER = `${NS}-range-slider`;

export const SPINNER = `${NS}-spinner`;
export const SVG_SPINNER = `${NS}-svg-spinner`;

export const TAB = `${NS}-tab`;
export const TAB_LIST = `${NS}-tab-list`;
export const TAB_PANEL = `${NS}-tab-panel`;
export const TABS = `${NS}-tabs`;

export const TAG = `${NS}-tag`;
export const TAG_REMOVABLE = `${NS}-tag-removable`;
export const TAG_REMOVE = `${NS}-tag-remove`;

export const TAG_INPUT = `${NS}-tag-input`;
export const TAG_INPUT_ICON = `${NS}-tag-input-icon`;
export const TAG_INPUT_VALUES = `${NS}-tag-input-values`;

export const TOAST = `${NS}-toast`;
export const TOAST_CONTAINER = `${NS}-toast-container`;
export const TOAST_MESSAGE = `${NS}-toast-message`;

export const TOOLTIP = `${NS}-tooltip`;

export const TREE = `${NS}-tree`;
export const TREE_NODE = `${NS}-tree-node`;
export const TREE_NODE_CARET = `${NS}-tree-node-caret`;
export const TREE_NODE_CARET_CLOSED = `${NS}-tree-node-caret-closed`;
export const TREE_NODE_CARET_NONE = `${NS}-tree-node-caret-none`;
export const TREE_NODE_CARET_OPEN = `${NS}-tree-node-caret-open`;
export const TREE_NODE_CONTENT = `${NS}-tree-node-content`;
export const TREE_NODE_EXPANDED = `${NS}-tree-node-expanded`;
export const TREE_NODE_ICON = `${NS}-tree-node-icon`;
export const TREE_NODE_LABEL = `${NS}-tree-node-label`;
export const TREE_NODE_LIST = `${NS}-tree-node-list`;
export const TREE_NODE_SECONDARY_LABEL = `${NS}-tree-node-secondary-label`;
export const TREE_NODE_SELECTED = `${NS}-tree-node-selected`;
export const TREE_ROOT = `${NS}-tree-root`;

export const ICON = `${NS}-icon`;
export const ICON_STANDARD = `${NS}-icon-standard`;
export const ICON_LARGE = `${NS}-icon-large`;

/**
 * Returns the namespace prefix for all Blueprint CSS classes.
 * Customize this namespace with the `process.env.BLUEPRINT_NAMESPACE` environment variable.
 */
export function getClassNamespace() {
    return NS;
}

/** Return CSS class for alignment. */
export function alignmentClass(alignment: Alignment) {
    switch (alignment) {
        case Alignment.LEFT:
            return ALIGN_LEFT;
        case Alignment.RIGHT:
            return ALIGN_RIGHT;
        default:
            return undefined;
    }
}

/** Return CSS class for icon, whether or not 'pt-icon-' prefix is included */
export function iconClass(iconName?: string) {
    if (iconName == null) {
        return undefined;
    }
    return iconName.indexOf(`${NS}-icon-`) === 0 ? iconName : `${NS}-icon-${iconName}`;
}

/** Return CSS class for intent. */
export function intentClass(intent = Intent.NONE) {
    if (intent == null || intent === Intent.NONE) {
        return undefined;
    }
    return `${NS}-intent-${intent.toLowerCase()}`;
}
