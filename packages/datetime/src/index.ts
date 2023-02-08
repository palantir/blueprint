/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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

import { DayModifiers as IDatePickerDayModifiers, LocaleUtils } from "react-day-picker";

import * as classes from "./common/classes";
import * as DateUtils from "./common/dateUtils";

/* eslint-disable deprecation/deprecation */

// re-exporting these symbols to preserve compatility

type IDatePickerLocaleUtils = typeof LocaleUtils;
export { DateUtils, IDatePickerLocaleUtils, IDatePickerDayModifiers };

type DatePickerLocaleUtils = IDatePickerLocaleUtils;
type DatePickerDayModifiers = IDatePickerDayModifiers;
export { DatePickerLocaleUtils, DatePickerDayModifiers };

export const Classes = classes;

export { DateRange } from "./common/dateRange";
export { Months } from "./common/months";
export { TimeUnit } from "./common/timeUnit";
export { DateFormatProps, IDateFormatProps } from "./dateFormat";
export { DateInput, DateInputProps, IDateInputProps } from "./dateInput";
export { DatePicker, DatePickerProps, IDatePickerProps } from "./datePicker";
export { DatePickerUtils } from "./datePickerUtils";
export { DatePickerBaseProps, DatePickerModifiers, IDatePickerModifiers } from "./datePickerCore";
export { DateTimePicker, IDateTimePickerProps } from "./dateTimePicker";
export { DateRangeInput, DateRangeInputProps, IDateRangeInputProps } from "./dateRangeInput";
export { DateRangePicker, DateRangePickerProps, IDateRangePickerProps } from "./dateRangePicker";
export { ITimePickerProps, TimePicker, TimePickerProps, TimePrecision } from "./timePicker";
export { DatePickerShortcut, DateRangeShortcut, IDatePickerShortcut, IDateRangeShortcut } from "./shortcuts";
