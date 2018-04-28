/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Elevation } from "../components/card/card";
import { Alignment } from "./alignment";
import { Intent } from "./intent";

const NS = process.env.BLUEPRINT_NAMESPACE || "pt";

// modifiers
export const ACTIVE = `${NS}-active`;
export const ALIGN_LEFT = `${NS}-align-left`;
export const ALIGN_RIGHT = `${NS}-align-right`;
export const DARK = `${NS}-dark`;
export const DISABLED = `${NS}-disabled`;
export const FILL = `${NS}-fill`;
export const FIXED = `${NS}-fixed`;
export const FIXED_TOP = `${NS}-fixed-top`;
export const INLINE = `${NS}-inline`;
export const INTERACTIVE = `${NS}-interactive`;
export const LARGE = `${NS}-large`;
export const LOADING = `${NS}-loading`;
export const MINIMAL = `${NS}-minimal`;
export const MULTILINE = `${NS}-multiline`;
export const ROUND = `${NS}-round`;
export const SMALL = `${NS}-small`;
export const VERTICAL = `${NS}-vertical`;

export const ELEVATION_0 = elevationClass(Elevation.ZERO);
export const ELEVATION_1 = elevationClass(Elevation.ONE);
export const ELEVATION_2 = elevationClass(Elevation.TWO);
export const ELEVATION_3 = elevationClass(Elevation.THREE);
export const ELEVATION_4 = elevationClass(Elevation.FOUR);

export const INTENT_PRIMARY = intentClass(Intent.PRIMARY);
export const INTENT_SUCCESS = intentClass(Intent.SUCCESS);
export const INTENT_WARNING = intentClass(Intent.WARNING);
export const INTENT_DANGER = intentClass(Intent.DANGER);

// text utilities
export const TEXT_MUTED = `${NS}-text-muted`;
export const TEXT_OVERFLOW_ELLIPSIS = `${NS}-text-overflow-ellipsis`;
export const UI_TEXT = `${NS}-ui-text`;
export const UI_TEXT_LARGE = `${NS}-ui-text-large`;
export const RUNNING_TEXT = `${NS}-running-text`;
export const RUNNING_TEXT_SMALL = `${NS}-running-text-small`;
export const MONOSPACE_TEXT = `${NS}-monospace-text`;

export const FOCUS_DISABLED = `${NS}-focus-disabled`;

// lists
export const LIST = `${NS}-list`;
export const LIST_UNSTYLED = `${LIST}-unstyled`;

// components
export const ALERT = `${NS}-alert`;
export const ALERT_BODY = `${ALERT}-body`;
export const ALERT_CONTENTS = `${ALERT}-contents`;
export const ALERT_FOOTER = `${ALERT}-footer`;

export const BREADCRUMB = `${NS}-breadcrumb`;
export const BREADCRUMB_CURRENT = `${BREADCRUMB}-current`;
export const BREADCRUMBS = `${BREADCRUMB}s`;
export const BREADCRUMBS_COLLAPSED = `${BREADCRUMB}s-collapsed`;

export const BUTTON = `${NS}-button`;
export const BUTTON_GROUP = `${BUTTON}-group`;
export const BUTTON_SPINNER = `${BUTTON}-spinner`;
export const BUTTON_TEXT = `${BUTTON}-text`;

export const CALLOUT = `${NS}-callout`;
export const CALLOUT_ICON = `${CALLOUT}-icon`;
export const CALLOUT_TITLE = `${CALLOUT}-title`;

export const CARD = `${NS}-card`;

export const COLLAPSE = `${NS}-collapse`;
export const COLLAPSE_BODY = `${COLLAPSE}-body`;

export const COLLAPSIBLE_LIST = `${NS}-collapse-list`;

export const CONTEXT_MENU = `${NS}-context-menu`;
export const CONTEXT_MENU_POPOVER_TARGET = `${CONTEXT_MENU}-popover-target`;

export const CONTROL_GROUP = `${NS}-control-group`;

export const DIALOG = `${NS}-dialog`;
export const DIALOG_CONTAINER = `${DIALOG}-container`;
export const DIALOG_BODY = `${DIALOG}-body`;
export const DIALOG_CLOSE_BUTTON = `${DIALOG}-close-button`;
export const DIALOG_FOOTER = `${DIALOG}-footer`;
export const DIALOG_FOOTER_ACTIONS = `${DIALOG}-footer-actions`;
export const DIALOG_HEADER = `${DIALOG}-header`;
export const DIALOG_HEADER_TITLE = `${DIALOG}-header-title`;

export const EDITABLE_TEXT = `${NS}-editable-text`;
export const EDITABLE_TEXT_CONTENT = `${EDITABLE_TEXT}-content`;
export const EDITABLE_TEXT_EDITING = `${EDITABLE_TEXT}-editing`;
export const EDITABLE_TEXT_INPUT = `${EDITABLE_TEXT}-input`;
export const EDITABLE_TEXT_PLACEHOLDER = `${EDITABLE_TEXT}-placeholder`;

export const FLEX_EXPANDER = `${NS}-flex-expander`;

export const HTML_TABLE = `${NS}-html-table`;
export const HTML_TABLE_STRIPED = `${HTML_TABLE}-striped`;
export const HTML_TABLE_BORDERED = `${HTML_TABLE}-bordered`;

export const INPUT = `${NS}-input`;
export const INPUT_GHOST = `${INPUT}-ghost`;
export const INPUT_GROUP = `${INPUT}-group`;
export const INPUT_ACTION = `${INPUT}-action`;

export const CONTROL = `${NS}-control`;
export const CONTROL_INDICATOR = `${CONTROL}-indicator`;
export const CHECKBOX = `${NS}-checkbox`;
export const RADIO = `${NS}-radio`;
export const SWITCH = `${NS}-switch`;
export const FILE_INPUT = `${NS}-file-input`;
export const FILE_UPLOAD_INPUT = `${NS}-file-upload-input`;

export const KEY = `${NS}-key`;
export const KEY_COMBO = `${KEY}-combo`;
export const MODIFIER_KEY = `${NS}-modifier-key`;

export const HOTKEY = `${NS}-hotkey`;
export const HOTKEY_LABEL = `${HOTKEY}-label`;
export const HOTKEY_GROUP = `${HOTKEY}-group`;
export const HOTKEY_COLUMN = `${HOTKEY}-column`;
export const HOTKEY_DIALOG = `${HOTKEY}-dialog`;

export const LABEL = `${NS}-label`;
export const FORM_GROUP = `${NS}-form-group`;
export const FORM_CONTENT = `${NS}-form-content`;
export const FORM_HELPER_TEXT = `${NS}-form-helper-text`;

export const MENU = `${NS}-menu`;
export const MENU_ITEM = `${MENU}-item`;
export const MENU_ITEM_LABEL = `${MENU_ITEM}-label`;
export const MENU_SUBMENU = `${NS}-submenu`;
export const MENU_DIVIDER = `${MENU}-divider`;
export const MENU_HEADER = `${MENU}-header`;

export const NAVBAR = `${NS}-navbar`;
export const NAVBAR_GROUP = `${NAVBAR}-group`;
export const NAVBAR_HEADING = `${NAVBAR}-heading`;
export const NAVBAR_DIVIDER = `${NAVBAR}-divider`;

export const NON_IDEAL_STATE = `${NS}-non-ideal-state`;
export const NON_IDEAL_STATE_ACTION = `${NON_IDEAL_STATE}-action`;
export const NON_IDEAL_STATE_DESCRIPTION = `${NON_IDEAL_STATE}-description`;
export const NON_IDEAL_STATE_ICON = `${NON_IDEAL_STATE}-icon`;
export const NON_IDEAL_STATE_TITLE = `${NON_IDEAL_STATE}-title`;
export const NON_IDEAL_STATE_VISUAL = `${NON_IDEAL_STATE}-visual`;

export const NUMERIC_INPUT = `${NS}-numeric-input`;

export const OVERLAY = `${NS}-overlay`;
export const OVERLAY_BACKDROP = `${OVERLAY}-backdrop`;
export const OVERLAY_CONTENT = `${OVERLAY}-content`;
export const OVERLAY_INLINE = `${OVERLAY}-inline`;
export const OVERLAY_OPEN = `${OVERLAY}-open`;
export const OVERLAY_SCROLL_CONTAINER = `${OVERLAY}-scroll-container`;

export const POPOVER = `${NS}-popover`;
export const POPOVER_ARROW = `${POPOVER}-arrow`;
export const POPOVER_BACKDROP = `${POPOVER}-backdrop`;
export const POPOVER_CONTENT = `${POPOVER}-content`;
export const POPOVER_CONTENT_SIZING = `${POPOVER_CONTENT}-sizing`;
export const POPOVER_DISMISS = `${POPOVER}-dismiss`;
export const POPOVER_DISMISS_OVERRIDE = `${POPOVER_DISMISS}-override`;
export const POPOVER_OPEN = `${POPOVER}-open`;
export const POPOVER_TARGET = `${POPOVER}-target`;
export const POPOVER_WRAPPER = `${POPOVER}-wrapper`;
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
export const SLIDER_PROGRESS = `${SLIDER}-progress`;
export const RANGE_SLIDER = `${NS}-range-slider`;

export const SPINNER = `${NS}-spinner`;
export const SPINNER_HEAD = `${SPINNER}-head`;
export const SPINNER_NO_SPIN = `${NS}-no-spin`;
export const SPINNER_TRACK = `${SPINNER}-track`;
export const SPINNER_SVG_CONTAINER = `${SPINNER}-svg-container`;
export const SVG_SPINNER = `${NS}-svg-spinner`;

export const TAB = `${NS}-tab`;
export const TAB_INDICATOR = `${TAB}-indicator`;
export const TAB_INDICATOR_WRAPPER = `${TAB_INDICATOR}-wrapper`;
export const TAB_LIST = `${TAB}-list`;
export const TAB_PANEL = `${TAB}-panel`;
export const TABS = `${TAB}s`;

export const TAG = `${NS}-tag`;
export const TAG_REMOVABLE = `${TAG}-removable`;
export const TAG_REMOVE = `${TAG}-remove`;

export const TAG_INPUT = `${NS}-tag-input`;
export const TAG_INPUT_ICON = `${TAG_INPUT}-icon`;
export const TAG_INPUT_VALUES = `${TAG_INPUT}-values`;

export const TOAST = `${NS}-toast`;
export const TOAST_CONTAINER = `${TOAST}-container`;
export const TOAST_MESSAGE = `${TOAST}-message`;

export const TOOLTIP = `${NS}-tooltip`;
export const TOOLTIP_INDICATOR = `${TOOLTIP}-indicator`;

export const TREE = `${NS}-tree`;
export const TREE_NODE = `${NS}-tree-node`;
export const TREE_NODE_CARET = `${TREE_NODE}-caret`;
export const TREE_NODE_CARET_CLOSED = `${TREE_NODE_CARET}-closed`;
export const TREE_NODE_CARET_NONE = `${TREE_NODE_CARET}-none`;
export const TREE_NODE_CARET_OPEN = `${TREE_NODE_CARET}-open`;
export const TREE_NODE_CONTENT = `${TREE_NODE}-content`;
export const TREE_NODE_EXPANDED = `${TREE_NODE}-expanded`;
export const TREE_NODE_ICON = `${TREE_NODE}-icon`;
export const TREE_NODE_LABEL = `${TREE_NODE}-label`;
export const TREE_NODE_LIST = `${TREE_NODE}-list`;
export const TREE_NODE_SECONDARY_LABEL = `${TREE_NODE}-secondary-label`;
export const TREE_NODE_SELECTED = `${TREE_NODE}-selected`;
export const TREE_ROOT = `${NS}-tree-root`;

export const ICON = `${NS}-icon`;
export const ICON_STANDARD = `${ICON}-standard`;
export const ICON_LARGE = `${ICON}-large`;

/**
 * Returns the namespace prefix for all Blueprint CSS classes.
 * Customize this namespace at build time with the `process.env.BLUEPRINT_NAMESPACE` environment variable.
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

export function elevationClass(elevation: Elevation) {
    if (elevation == null) {
        return undefined;
    }
    return `${NS}-elevation-${elevation}`;
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
