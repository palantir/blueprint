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
    "<DateRangePicker> preferredBoundaryToModify must be a valid Boundary if defined.";

export const DATERANGEINPUT_NULL_VALUE =
    ns +
    ` <DateRangeInput> value cannot be null. Pass undefined to clear the value and operate in` +
    " uncontrolled mode, or pass [null, null] to clear the value and continue operating in controlled mode.";
