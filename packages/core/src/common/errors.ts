/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

const ns = "[Blueprint]";
const deprec = `${ns} DEPRECATION:`;

export function deprecationWarning(oldName: string, newName: string, message: string = "") {
    return `${deprec} '${oldName}' prop has been replaced by the '${newName}' prop. ${message}
It will be removed in the next major version of blueprint.`;
}

export const ALERT_CANCEL_PROPS = `${ns} If either cancelButtonText or onCancel are set in <Alert>, both must be set.`;

export const DEPRECATION_SHOULD_ATTACH_TO_BODY = deprecationWarning("shouldAttachToBody", "inline");

export const COLLAPSIBLE_LIST_INVALID_CHILD = `${ns} <CollapsibleList> children must be <MenuItem>s`;

export const MENU_CHILDREN_SUBMENU_MUTEX = `${ns} <MenuItem> children and submenu props are mutually exclusive`;

export const NUMERIC_INPUT_MIN_MAX =
    `${ns} <NumericInput> requires min to be strictly less than max if both are defined`;
export const NUMERIC_INPUT_MINOR_STEP_SIZE_BOUND =
    `${ns} <NumericInput> requires minorStepSize to be strictly less than stepSize`;
export const NUMERIC_INPUT_MAJOR_STEP_SIZE_BOUND =
    `${ns} <NumericInput> requires majorStepSize to be strictly greater than stepSize`;
export const NUMERIC_INPUT_MINOR_STEP_SIZE_NON_POSITIVE =
    `${ns} <NumericInput> requires minorStepSize to be strictly greater than zero`;
export const NUMERIC_INPUT_MAJOR_STEP_SIZE_NON_POSITIVE =
    `${ns} <NumericInput> requires majorStepSize to be strictly greater than zero`;
export const NUMERIC_INPUT_STEP_SIZE_NON_POSITIVE =
    `${ns} <NumericInput> requires stepSize to be strictly greater than zero`;
export const NUMERIC_INPUT_STEP_SIZE_NULL =
    `${ns} <NumericInput> requires stepSize to be defined`;

export const POPOVER_ONE_CHILD = `${ns} <Popover> requires exactly one target element`;
export const POPOVER_CONTROLLED_DISABLED = `${ns} <Popover> isOpen and isDisabled props are mutually exclusive`;
export const POPOVER_UNCONTROLLED_ONINTERACTION = `${ns} <Popover> onInteraction is ignored when uncontrolled`;
export const POPOVER_MODAL_INLINE =
    `${ns} <Popover isModal={true}> requires inline={false}.`;
export const POPOVER_MODAL_INTERACTION =
    `${ns} <Popover isModal={true}> requires interactionKind={PopoverInteractionKind.CLICK}.`;
export const POPOVER_SMART_POSITIONING_INLINE =
    `{ns} <Popover useSmartPositioning={true}> requires inline={false}.`;

export const RADIOGROUP_RADIO_CHILDREN = `${ns} <RadioGroup> only supports <Radio> children`;
export const RADIOGROUP_CHILDREN_OPTIONS_MUTEX =
    `${ns} <RadioGroup> children and options props are mutually exclusive.`;

export const RANGESLIDER_NULL_VALUE = `${ns} <RangeSlider> value prop must be an array of two non-null numbers`;

export const TABS_FIRST_CHILD = `${ns} First child of <Tabs> component should be a <TabList>`;
export const TABS_MISMATCH = `${ns} Number of <Tab> components should equal number of <TabPanel> components`;
export const TABS_DEPRECATED = `${ns} <Tabs> is deprecated since v1.11.0; consider upgrading to <Tabs2>.`
    + " https://blueprintjs.com/#components.tabs.js";

export const TOASTER_INLINE_WARNING = `${ns} Toaster.create() ignores inline prop as it always creates a new element`;

export const WARNING_DIALOG_NO_HEADER_ICON = `${ns} Warning: Dialog iconName prop is ignored if title prop is omitted`;
export const WARNING_DIALOG_NO_HEADER_CLOSE_BUTTON =
    `${ns} Warning: Dialog isCloseButtonShown prop is ignored if title prop is omitted`;
