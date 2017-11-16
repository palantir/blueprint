/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

const ns = "[Blueprint]";
const deprec = `${ns} DEPRECATION:`;

export const CLAMP_MIN_MAX = ns + ` clamp: max cannot be less than min`;

export const ALERT_WARN_CANCEL_PROPS = ns + ` <Alert> cancelButtonText and onCancel should be set together.`;

export const COLLAPSIBLE_LIST_INVALID_CHILD = ns + ` <CollapsibleList> children must be <MenuItem>s`;

export const CONTEXTMENU_WARN_DECORATOR_NO_METHOD =
    ns + ` @ContextMenuTarget-decorated class should implement renderContextMenu.`;

export const HOTKEYS_HOTKEY_CHILDREN = ns + ` <Hotkeys> only accepts <Hotkey> children.`;

export const MENU_WARN_CHILDREN_SUBMENU_MUTEX =
    ns + ` <MenuItem> children and submenu props are mutually exclusive, with children taking priority.`;

export const NUMERIC_INPUT_MIN_MAX =
    ns + ` <NumericInput> requires min to be strictly less than max if both are defined.`;
export const NUMERIC_INPUT_MINOR_STEP_SIZE_BOUND =
    ns + ` <NumericInput> requires minorStepSize to be strictly less than stepSize.`;
export const NUMERIC_INPUT_MAJOR_STEP_SIZE_BOUND =
    ns + ` <NumericInput> requires majorStepSize to be strictly greater than stepSize.`;
export const NUMERIC_INPUT_MINOR_STEP_SIZE_NON_POSITIVE =
    ns + ` <NumericInput> requires minorStepSize to be strictly greater than zero.`;
export const NUMERIC_INPUT_MAJOR_STEP_SIZE_NON_POSITIVE =
    ns + ` <NumericInput> requires majorStepSize to be strictly greater than zero.`;
export const NUMERIC_INPUT_STEP_SIZE_NON_POSITIVE =
    ns + ` <NumericInput> requires stepSize to be strictly greater than zero.`;
export const NUMERIC_INPUT_STEP_SIZE_NULL = ns + ` <NumericInput> requires stepSize to be defined.`;

export const POPOVER_REQUIRES_TARGET = ns + ` <Popover> requires target prop or at least one child element.`;
export const POPOVER_MODAL_INTERACTION =
    ns + ` <Popover isModal={true}> requires interactionKind={PopoverInteractionKind.CLICK}.`;
export const POPOVER_WARN_TOO_MANY_CHILDREN =
    ns +
    ` <Popover> supports one or two children; additional children are ignored.` +
    ` First child is the target, second child is the content. You may instead supply these two as props.`;
export const POPOVER_WARN_DOUBLE_CONTENT =
    ns + ` <Popover> with two children ignores content prop; use either prop or children.`;
export const POPOVER_WARN_DOUBLE_TARGET =
    ns + ` <Popover> with children ignores target prop; use either prop or children.`;
export const POPOVER_WARN_EMPTY_CONTENT = ns + ` Disabling <Popover> with empty/whitespace content...`;
export const POPOVER_WARN_MODAL_INLINE = ns + ` <Popover inline={true}> ignores isModal`;
export const POPOVER_WARN_DEPRECATED_CONSTRAINTS =
    ns + ` <Popover> constraints and useSmartPositioning are deprecated. Use tetherOptions directly.`;
export const POPOVER_WARN_INLINE_NO_TETHER =
    ns + ` <Popover inline={true}> ignores tetherOptions, constraints, and useSmartPositioning.`;
export const POPOVER_WARN_UNCONTROLLED_ONINTERACTION = ns + ` <Popover> onInteraction is ignored when uncontrolled.`;

export const PORTAL_CONTEXT_CLASS_NAME_STRING = ns + ` <Portal> context blueprintPortalClassName must be string`;

export const RADIOGROUP_WARN_CHILDREN_OPTIONS_MUTEX =
    ns + ` <RadioGroup> children and options prop are mutually exclusive, with options taking priority.`;

export const SLIDER_ZERO_STEP = ns + ` <Slider> stepSize must be greater than zero.`;
export const SLIDER_ZERO_LABEL_STEP = ns + ` <Slider> labelStepSize must be greater than zero.`;
export const RANGESLIDER_NULL_VALUE = ns + ` <RangeSlider> value prop must be an array of two non-null numbers.`;

export const TABS_FIRST_CHILD = ns + ` First child of <Tabs> component must be a <TabList>`;
export const TABS_MISMATCH = ns + ` Number of <Tab> components must equal number of <TabPanel> components`;
export const TABS_WARN_DEPRECATED =
    deprec +
    ` <Tabs> is deprecated since v1.11.0; consider upgrading to <Tabs2>.` +
    " https://blueprintjs.com/#components.tabs.js";

export const TOASTER_WARN_INLINE = ns + ` Toaster.create() ignores inline prop as it always creates a new element.`;
export const TOASTER_WARN_LEFT_RIGHT = ns + ` Toaster does not support LEFT or RIGHT positions.`;

export const DIALOG_WARN_NO_HEADER_ICON = ns + ` <Dialog> iconName is ignored if title is omitted.`;
export const DIALOG_WARN_NO_HEADER_CLOSE_BUTTON =
    ns + ` <Dialog> isCloseButtonShown prop is ignored if title is omitted.`;
