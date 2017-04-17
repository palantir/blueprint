/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

const ns = "[Blueprint]";

export const DATEPICKER_DEFAULT_VALUE_INVALID =
    `${ns} <DatePicker> defaultValue must be within minDate and maxDate bounds.`;
export const DATEPICKER_INITIAL_MONTH_INVALID =
    `${ns} <DatePicker> initialMonth must be within minDate and maxDate bounds.`;
export const DATEPICKER_MAX_DATE_INVALID =
    `${ns} <DatePicker> maxDate must be later than minDate.`;
export const DATEPICKER_VALUE_INVALID =
    `${ns} <DatePicker> value prop must be within minDate and maxDate bounds.`;

export const DATERANGEPICKER_DEFAULT_VALUE_INVALID =
    DATEPICKER_DEFAULT_VALUE_INVALID.replace("DatePicker", "DateRangePicker");
export const DATERANGEPICKER_INITIAL_MONTH_INVALID =
    DATEPICKER_INITIAL_MONTH_INVALID.replace("DatePicker", "DateRangePicker");
export const DATERANGEPICKER_MAX_DATE_INVALID = DATEPICKER_MAX_DATE_INVALID.replace("DatePicker", "DateRangePicker");
export const DATERANGEPICKER_VALUE_INVALID = DATEPICKER_VALUE_INVALID.replace("DatePicker", "DateRangePicker");
export const DATERANGEPICKER_PREFERRED_BOUNDARY_TO_MODIFY_INVALID =
    "<DateRangePicker> preferredBoundaryToModify must be a valid DateRangeBoundary if defined.";

export const DATEINPUT_WARN_DEPRECATED_POPOVER_POSITION =
    `${ns} DEPRECATION: <DateInput> popoverProps is deprecated. Use popoverProps.position.`;
export const DATEINPUT_WARN_DEPRECATED_OPEN_ON_FOCUS =
    `${ns} DEPRECATION: <DateInput> openOnFocus is deprecated. This feature will be removed in the next major version.`;
