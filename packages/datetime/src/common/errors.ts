/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

const ns = "[Blueprint]";

export const DATEPICKER_DEFAULT_VALUE_INVALID =
    ns + ` <DatePicker> defaultValue must be within minDate and maxDate bounds.`;
export const DATEPICKER_INITIAL_MONTH_INVALID =
    ns + ` <DatePicker> initialMonth must be within minDate and maxDate bounds.`;
export const DATEPICKER_MAX_DATE_INVALID = ns + ` <DatePicker> maxDate must be later than minDate.`;
export const DATEPICKER_VALUE_INVALID = ns + ` <DatePicker> value prop must be within minDate and maxDate bounds.`;

export const DATERANGEPICKER_DEFAULT_VALUE_INVALID = DATEPICKER_DEFAULT_VALUE_INVALID.replace(
    "DatePicker",
    "DateRangePicker",
);
export const DATERANGEPICKER_INITIAL_MONTH_INVALID = DATEPICKER_INITIAL_MONTH_INVALID.replace(
    "DatePicker",
    "DateRangePicker",
);
export const DATERANGEPICKER_MAX_DATE_INVALID = DATEPICKER_MAX_DATE_INVALID.replace("DatePicker", "DateRangePicker");
export const DATERANGEPICKER_VALUE_INVALID = DATEPICKER_VALUE_INVALID.replace("DatePicker", "DateRangePicker");
export const DATERANGEPICKER_PREFERRED_BOUNDARY_TO_MODIFY_INVALID =
    "<DateRangePicker> preferredBoundaryToModify must be a valid DateRangeBoundary if defined.";

export const DATERANGEINPUT_NULL_VALUE =
    ns +
    ` <DateRangeInput> value cannot be null. Pass undefined to clear the value and operate in` +
    " uncontrolled mode, or pass [null, null] to clear the value and continue operating in controlled mode.";
