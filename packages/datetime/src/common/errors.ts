/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

const ns = "[Blueprint]";

export const DATEPICKER_DEFAULT_VALUE_INVALID =
    `${ns} <DatePicker> defaultValue must be within minDate and maxDate bounds`;
export const DATEPICKER_INITIAL_MONTH_INVALID =
    `${ns} <DatePicker> initialMonth must be within minDate and maxDate bounds`;
export const DATEPICKER_MAX_DATE_INVALID =
    `${ns} <DatePicker> maxDate must be later than minDate`;
export const DATEPICKER_VALUE_INVALID =
    `${ns} <DatePicker> value prop must be within minDate and maxDate bounds`;

export const DATERANGEPICKER_DEFAULT_VALUE_INVALID =
    DATEPICKER_DEFAULT_VALUE_INVALID.replace("DatePicker", "DateRangePicker");
export const DATERANGEPICKER_INITIAL_MONTH_INVALID =
    DATEPICKER_INITIAL_MONTH_INVALID.replace("DatePicker", "DateRangePicker");
export const DATERANGEPICKER_INVALID_DATE_RANGE =
    `${ns} <DateRangePicker> value and defaultValue props cannot have a null start date and a non-null end date.`;
export const DATERANGEPICKER_MAX_DATE_INVALID = DATEPICKER_MAX_DATE_INVALID.replace("DatePicker", "DateRangePicker");
export const DATERANGEPICKER_VALUE_INVALID = DATEPICKER_VALUE_INVALID.replace("DatePicker", "DateRangePicker");
