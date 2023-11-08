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

import type { DayModifiers as DatePickerDayModifiers, LocaleUtils } from "react-day-picker";

export * from "./common";

// re-exporting these symbols to preserve compatibility
type DatePickerLocaleUtils = typeof LocaleUtils;
export type { DatePickerLocaleUtils, DatePickerDayModifiers };

export type { DateFormatProps } from "./common/dateFormatProps";
export { DateRangeSelectionStrategy, type DateRangeSelectionState } from "./common/dateRangeSelectionStrategy";
export { MonthAndYear } from "./common/monthAndYear";
export type { TimePickerProps } from "./common/timePickerProps";
export { TimePrecision } from "./common/timePrecision";

export { DatePickerUtils } from "./components/date-picker/datePickerUtils";
export type { DatePickerBaseProps, DatePickerModifiers } from "./common/datePickerBaseProps";
export { TimePicker } from "./components/time-picker/timePicker";
export {
    type DatePickerShortcut,
    DatePickerShortcutMenu,
    type DatePickerShortcutMenuProps,
    type DateRangeShortcut,
} from "./components/shortcuts/shortcuts";
export { TimezoneSelect, type TimezoneSelectProps } from "./components/timezone-select/timezoneSelect";

/* eslint-disable deprecation/deprecation */

export { DateInput, type DateInputProps } from "./components/date-input/dateInput";
export { DatePicker, type DatePickerProps } from "./components/date-picker/datePicker";
export { DateRangeInput, type DateRangeInputProps } from "./components/date-range-input/dateRangeInput";
export { DateRangePicker, type DateRangePickerProps } from "./components/date-range-picker/dateRangePicker";
