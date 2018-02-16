/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

const ns = "[Blueprint]";

export const CLAMP_MIN_MAX = ns + ` clamp: max cannot be less than min`;

export const ALERT_WARN_CANCEL_PROPS = ns + ` <Alert> cancelButtonText and onCancel should be set together.`;
export const ALERT_WARN_CANCEL_ESCAPE_KEY =
    ns + ` <Alert> canEscapeKeyCancel enabled without onCancel or onClose handler.`;
export const ALERT_WARN_CANCEL_OUTSIDE_CLICK =
    ns + ` <Alert> canOutsideClickCancel enbaled without onCancel or onClose handler.`;

export const COLLAPSIBLE_LIST_INVALID_CHILD = ns + ` <CollapsibleList> children must be <MenuItem>s`;

export const CONTEXTMENU_WARN_DECORATOR_NO_METHOD =
    ns + ` @ContextMenuTarget-decorated class should implement renderContextMenu.`;
export const CONTEXTMENU_WARN_DECORATOR_NEEDS_REACT_ELEMENT =
    ns + ` "@ContextMenuTarget-decorated components must return a single JSX.Element or an empty render.`;

export const HOTKEYS_HOTKEY_CHILDREN = ns + ` <Hotkeys> only accepts <Hotkey> children.`;
export const HOTKEYS_WARN_DECORATOR_NO_METHOD = ns + ` @HotkeysTarget-decorated class should implement renderHotkeys.`;
export const HOTKEYS_WARN_DECORATOR_NEEDS_REACT_ELEMENT =
    ns + ` "@HotkeysTarget-decorated components must return a single JSX.Element or an empty render.`;

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

// TODO (clewis): Migrate old Popover validation errors to the component formerly known as Popover2.
// See: https://github.com/palantir/blueprint/issues/1940
export const POPOVER_REQUIRES_TARGET = ns + ` <Popover> requires target prop or at least one child element.`;
export const POPOVER_HAS_BACKDROP_INTERACTION =
    ns + ` <Popover hasBackdrop={true}> requires interactionKind={PopoverInteractionKind.CLICK}.`;
export const POPOVER_WARN_TOO_MANY_CHILDREN =
    ns +
    ` <Popover> supports one or two children; additional children are ignored.` +
    ` First child is the target, second child is the content. You may instead supply these two as props.`;
export const POPOVER_WARN_DOUBLE_CONTENT =
    ns + ` <Popover> with two children ignores content prop; use either prop or children.`;
export const POPOVER_WARN_DOUBLE_TARGET =
    ns + ` <Popover> with children ignores target prop; use either prop or children.`;
export const POPOVER_WARN_EMPTY_CONTENT = ns + ` Disabling <Popover> with empty/whitespace content...`;
export const POPOVER_WARN_HAS_BACKDROP_INLINE = ns + ` <Popover usePortal={false}> ignores hasBackdrop`;
export const POPOVER_WARN_UNCONTROLLED_ONINTERACTION = ns + ` <Popover> onInteraction is ignored when uncontrolled.`;

export const PORTAL_CONTEXT_CLASS_NAME_STRING = ns + ` <Portal> context blueprintPortalClassName must be string`;

export const RADIOGROUP_WARN_CHILDREN_OPTIONS_MUTEX =
    ns + ` <RadioGroup> children and options prop are mutually exclusive, with options taking priority.`;

export const SLIDER_ZERO_STEP = ns + ` <Slider> stepSize must be greater than zero.`;
export const SLIDER_ZERO_LABEL_STEP = ns + ` <Slider> labelStepSize must be greater than zero.`;
export const RANGESLIDER_NULL_VALUE = ns + ` <RangeSlider> value prop must be an array of two non-null numbers.`;

export const TOASTER_WARN_INLINE = ns + ` Toaster.create() ignores inline prop as it always creates a new element.`;

export const DIALOG_WARN_NO_HEADER_ICON = ns + ` <Dialog> iconName is ignored if title is omitted.`;
export const DIALOG_WARN_NO_HEADER_CLOSE_BUTTON =
    ns + ` <Dialog> isCloseButtonShown prop is ignored if title is omitted.`;
