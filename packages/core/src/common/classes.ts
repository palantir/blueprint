/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
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

import { Alignment } from "./alignment";
import { Elevation } from "./elevation";
import { Intent } from "./intent";
import { Position } from "./position";

const NS = process.env.BLUEPRINT_NAMESPACE || process.env.REACT_APP_BLUEPRINT_NAMESPACE || "bp3";

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
export const OUTLINED = `${NS}-outlined`;
export const MULTILINE = `${NS}-multiline`;
export const ROUND = `${NS}-round`;
export const SMALL = `${NS}-small`;
export const VERTICAL = `${NS}-vertical`;
export const POSITION_TOP = positionClass(Position.TOP);
export const POSITION_BOTTOM = positionClass(Position.BOTTOM);
export const POSITION_LEFT = positionClass(Position.LEFT);
export const POSITION_RIGHT = positionClass(Position.RIGHT);

export const ELEVATION_0 = elevationClass(Elevation.ZERO);
export const ELEVATION_1 = elevationClass(Elevation.ONE);
export const ELEVATION_2 = elevationClass(Elevation.TWO);
export const ELEVATION_3 = elevationClass(Elevation.THREE);
export const ELEVATION_4 = elevationClass(Elevation.FOUR);

export const INTENT_PRIMARY = intentClass(Intent.PRIMARY)!;
export const INTENT_SUCCESS = intentClass(Intent.SUCCESS)!;
export const INTENT_WARNING = intentClass(Intent.WARNING)!;
export const INTENT_DANGER = intentClass(Intent.DANGER)!;

export const FOCUS_DISABLED = `${NS}-focus-disabled`;

// text utilities
export const UI_TEXT = `${NS}-ui-text`;
export const RUNNING_TEXT = `${NS}-running-text`;
export const MONOSPACE_TEXT = `${NS}-monospace-text`;
export const TEXT_LARGE = `${NS}-text-large`;
export const TEXT_SMALL = `${NS}-text-small`;
export const TEXT_MUTED = `${NS}-text-muted`;
export const TEXT_DISABLED = `${NS}-text-disabled`;
export const TEXT_OVERFLOW_ELLIPSIS = `${NS}-text-overflow-ellipsis`;

// textual elements
export const BLOCKQUOTE = `${NS}-blockquote`;
export const CODE = `${NS}-code`;
export const CODE_BLOCK = `${NS}-code-block`;
export const HEADING = `${NS}-heading`;
export const LIST = `${NS}-list`;
export const LIST_UNSTYLED = `${NS}-list-unstyled`;
export const RTL = `${NS}-rtl`;

// layout utilities
/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
 * @deprecated this is no longer needed for ContextMenu2, will be removed in v4.0
 */
export const FIXED_POSITIONING_CONTAINING_BLOCK = `${NS}-fixed-positioning-containing-block`;

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

export const DIALOG_STEP = `${NS}-dialog-step`;
export const DIALOG_STEP_CONTAINER = `${DIALOG_STEP}-container`;
export const DIALOG_STEP_TITLE = `${DIALOG_STEP}-title`;
export const DIALOG_STEP_ICON = `${DIALOG_STEP}-icon`;
export const DIALOG_STEP_VIEWED = `${DIALOG_STEP}-viewed`;

export const DIVIDER = `${NS}-divider`;

export const DRAWER = `${NS}-drawer`;
export const DRAWER_BODY = `${DRAWER}-body`;
export const DRAWER_FOOTER = `${DRAWER}-footer`;
export const DRAWER_HEADER = `${DRAWER}-header`;

export const EDITABLE_TEXT = `${NS}-editable-text`;
export const EDITABLE_TEXT_CONTENT = `${EDITABLE_TEXT}-content`;
export const EDITABLE_TEXT_EDITING = `${EDITABLE_TEXT}-editing`;
export const EDITABLE_TEXT_INPUT = `${EDITABLE_TEXT}-input`;
export const EDITABLE_TEXT_PLACEHOLDER = `${EDITABLE_TEXT}-placeholder`;

export const FLEX_EXPANDER = `${NS}-flex-expander`;

export const HTML_SELECT = `${NS}-html-select`;
/** @deprecated prefer `<HTMLSelect>` component */
export const SELECT = `${NS}-select`;

export const HTML_TABLE = `${NS}-html-table`;
export const HTML_TABLE_BORDERED = `${HTML_TABLE}-bordered`;
export const HTML_TABLE_CONDENSED = `${HTML_TABLE}-condensed`;
export const HTML_TABLE_STRIPED = `${HTML_TABLE}-striped`;

export const INPUT = `${NS}-input`;
export const INPUT_GHOST = `${INPUT}-ghost`;
export const INPUT_GROUP = `${INPUT}-group`;
export const INPUT_LEFT_CONTAINER = `${INPUT}-left-container`;
export const INPUT_ACTION = `${INPUT}-action`;

export const CONTROL = `${NS}-control`;
export const CONTROL_INDICATOR = `${CONTROL}-indicator`;
export const CONTROL_INDICATOR_CHILD = `${CONTROL_INDICATOR}-child`;
export const CHECKBOX = `${NS}-checkbox`;
export const RADIO = `${NS}-radio`;
export const SWITCH = `${NS}-switch`;
export const SWITCH_INNER_TEXT = `${SWITCH}-inner-text`;
export const FILE_INPUT = `${NS}-file-input`;
export const FILE_INPUT_HAS_SELECTION = `${NS}-file-input-has-selection`;
export const FILE_UPLOAD_INPUT = `${NS}-file-upload-input`;
export const FILE_UPLOAD_INPUT_CUSTOM_TEXT = `${NS}-file-upload-input-custom-text`;

export const KEY = `${NS}-key`;
export const KEY_COMBO = `${KEY}-combo`;
export const MODIFIER_KEY = `${NS}-modifier-key`;

export const HOTKEY = `${NS}-hotkey`;
export const HOTKEY_LABEL = `${HOTKEY}-label`;
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

export const MULTISTEP_DIALOG = `${NS}-multistep-dialog`;
export const MULTISTEP_DIALOG_PANELS = `${MULTISTEP_DIALOG}-panels`;
export const MULTISTEP_DIALOG_LEFT_PANEL = `${MULTISTEP_DIALOG}-left-panel`;
export const MULTISTEP_DIALOG_RIGHT_PANEL = `${MULTISTEP_DIALOG}-right-panel`;
export const MULTISTEP_DIALOG_FOOTER = `${MULTISTEP_DIALOG}-footer`;

export const NAVBAR = `${NS}-navbar`;
export const NAVBAR_GROUP = `${NAVBAR}-group`;
export const NAVBAR_HEADING = `${NAVBAR}-heading`;
export const NAVBAR_DIVIDER = `${NAVBAR}-divider`;

export const NON_IDEAL_STATE = `${NS}-non-ideal-state`;
export const NON_IDEAL_STATE_VISUAL = `${NON_IDEAL_STATE}-visual`;

export const NUMERIC_INPUT = `${NS}-numeric-input`;

export const OVERFLOW_LIST = `${NS}-overflow-list`;
export const OVERFLOW_LIST_SPACER = `${OVERFLOW_LIST}-spacer`;

export const OVERLAY = `${NS}-overlay`;
export const OVERLAY_BACKDROP = `${OVERLAY}-backdrop`;
export const OVERLAY_CONTAINER = `${OVERLAY}-container`;
export const OVERLAY_CONTENT = `${OVERLAY}-content`;
export const OVERLAY_INLINE = `${OVERLAY}-inline`;
export const OVERLAY_OPEN = `${OVERLAY}-open`;
export const OVERLAY_SCROLL_CONTAINER = `${OVERLAY}-scroll-container`;

export const PANEL_STACK = `${NS}-panel-stack`;
export const PANEL_STACK_HEADER = `${PANEL_STACK}-header`;
export const PANEL_STACK_HEADER_BACK = `${PANEL_STACK}-header-back`;
export const PANEL_STACK_VIEW = `${PANEL_STACK}-view`;

export const PANEL_STACK2 = `${NS}-panel-stack2`;
export const PANEL_STACK2_HEADER = `${PANEL_STACK}-header`;
export const PANEL_STACK2_HEADER_BACK = `${PANEL_STACK}-header-back`;
export const PANEL_STACK2_VIEW = `${PANEL_STACK}-view`;

export const POPOVER = `${NS}-popover`;
export const POPOVER_ARROW = `${POPOVER}-arrow`;
export const POPOVER_BACKDROP = `${POPOVER}-backdrop`;
export const POPOVER_CAPTURING_DISMISS = `${POPOVER}-capturing-dismiss`;
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

export const SKELETON = `${NS}-skeleton`;

export const SLIDER = `${NS}-slider`;
export const SLIDER_AXIS = `${SLIDER}-axis`;
export const SLIDER_HANDLE = `${SLIDER}-handle`;
export const SLIDER_LABEL = `${SLIDER}-label`;
export const SLIDER_TRACK = `${SLIDER}-track`;
export const SLIDER_PROGRESS = `${SLIDER}-progress`;
export const START = `${NS}-start`;
export const END = `${NS}-end`;

export const SPINNER = `${NS}-spinner`;
export const SPINNER_ANIMATION = `${SPINNER}-animation`;
export const SPINNER_HEAD = `${SPINNER}-head`;
export const SPINNER_NO_SPIN = `${NS}-no-spin`;
export const SPINNER_TRACK = `${SPINNER}-track`;

export const TAB = `${NS}-tab`;
export const TAB_INDICATOR = `${TAB}-indicator`;
export const TAB_INDICATOR_WRAPPER = `${TAB_INDICATOR}-wrapper`;
export const TAB_LIST = `${TAB}-list`;
export const TAB_PANEL = `${TAB}-panel`;
export const TABS = `${TAB}s`;

export const TAG = `${NS}-tag`;
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
/** @deprecated use <Icon> components and iconName prop APIs instead */
export const ICON_STANDARD = `${ICON}-standard`;
/** @deprecated use <Icon> components and iconName prop APIs instead */
export const ICON_LARGE = `${ICON}-large`;

/**
 * Returns the namespace prefix for all Blueprint CSS classes.
 * Customize this namespace at build time with the `process.env.BLUEPRINT_NAMESPACE` environment variable.
 */
export function getClassNamespace() {
    return NS;
}

/** Return CSS class for alignment. */
export function alignmentClass(alignment: Alignment | undefined) {
    switch (alignment) {
        case Alignment.LEFT:
            return ALIGN_LEFT;
        case Alignment.RIGHT:
            return ALIGN_RIGHT;
        default:
            return undefined;
    }
}

export function elevationClass(elevation: Elevation): string;
export function elevationClass(elevation: undefined): undefined;
export function elevationClass(elevation: Elevation | undefined): string | undefined;
export function elevationClass(elevation: Elevation | undefined) {
    if (elevation === undefined) {
        return undefined;
    }
    return `${NS}-elevation-${elevation}`;
}

/**
 * Returns CSS class for icon name.
 */
export function iconClass(iconName: string): string;
export function iconClass(iconName: undefined): undefined;
export function iconClass(iconName: string | undefined): string | undefined;
export function iconClass(iconName: string | undefined) {
    if (iconName == null) {
        return undefined;
    }
    return iconName.indexOf(`${NS}-icon-`) === 0 ? iconName : `${NS}-icon-${iconName}`;
}

/** Return CSS class for intent. */
export function intentClass(intent: Intent): string;
export function intentClass(intent: typeof Intent.NONE | undefined): undefined;
export function intentClass(intent: Intent | undefined): Intent | undefined;
export function intentClass(intent: Intent | undefined) {
    if (intent == null || intent === Intent.NONE) {
        return undefined;
    }
    return `${NS}-intent-${intent.toLowerCase()}`;
}

export function positionClass(position: Position): string;
export function positionClass(position: undefined): undefined;
export function positionClass(position: Position | undefined): string | undefined;
export function positionClass(position: Position | undefined) {
    if (position === undefined) {
        return undefined;
    }
    return `${NS}-position-${position}`;
}
