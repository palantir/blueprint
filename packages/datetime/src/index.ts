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
export { DatePickerLocaleUtils, DatePickerDayModifiers };

export { DateFormatProps } from "./common/dateFormatProps";
export { DateRangeSelectionStrategy, DateRangeSelectionState } from "./common/dateRangeSelectionStrategy";
export { MonthAndYear } from "./common/monthAndYear";
export { TimePickerProps } from "./common/timePickerProps";
export { TimePrecision } from "./common/timePrecision";

export { DatePickerUtils } from "./components/date-picker/datePickerUtils";
export { DatePickerBaseProps, DatePickerModifiers } from "./common/datePickerBaseProps";
export { TimePicker } from "./components/time-picker/timePicker";
export {
    DatePickerShortcut,
    DatePickerShortcutMenu,
    DatePickerShortcutMenuProps,
    DateRangeShortcut,
} from "./components/shortcuts/shortcuts";
export { TimezoneSelect, TimezoneSelectProps } from "./components/timezone-select/timezoneSelect";

/* eslint-disable deprecation/deprecation */

export { DateInput, DateInputProps } from "./components/date-input/dateInput";
export { DatePicker, DatePickerProps } from "./components/date-picker/datePicker";
export { DateRangeInput, DateRangeInputProps } from "./components/date-range-input/dateRangeInput";
export { DateRangePicker, DateRangePickerProps } from "./components/date-range-picker/dateRangePicker";
