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

import * as classes from "./common/classes";

// re-exporting these symbols to preserve compatility
import { DayModifiers as IDatePickerDayModifiers, LocaleUtils } from "react-day-picker";

type IDatePickerLocaleUtils = LocaleUtils;
export { IDatePickerLocaleUtils, IDatePickerDayModifiers };

export const Classes = classes;

export { DateRange } from "./common/dateUtils";
export { Months } from "./common/months";
export { IDateFormatProps } from "./dateFormat";
export { DateInput, IDateInputProps } from "./dateInput";
export { DatePicker, IDatePickerProps } from "./datePicker";
export { IDatePickerModifiers } from "./datePickerCore";
export { DateTimePicker, IDateTimePickerProps } from "./dateTimePicker";
export { DateRangeInput, IDateRangeInputProps } from "./dateRangeInput";
export { DateRangePicker, IDateRangePickerProps } from "./dateRangePicker";
export { ITimePickerProps, TimePicker, TimePrecision } from "./timePicker";
export { IDatePickerShortcut, IDateRangeShortcut } from "./shortcuts";
