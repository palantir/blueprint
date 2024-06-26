/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
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

import type { DateRangePickerProps } from "@blueprintjs/datetime";

import type { DateFnsLocaleProps } from "../../common/dateFnsLocaleProps";
import type { ReactDayPickerRangeProps } from "../../common/reactDayPickerProps";

/** Props shared between DateRangePicker v1 and v3 */
type DateRangePickerSharedProps = Omit<DateRangePickerProps, "dayPickerProps" | "locale" | "localeUtils" | "modifiers">;

export type DateRangePicker3Props = DateRangePickerSharedProps & DateFnsLocaleProps & ReactDayPickerRangeProps;

export type DateRangePicker3DefaultProps = Required<
    Pick<
        DateRangePicker3Props,
        | "allowSingleDayRange"
        | "contiguousCalendarMonths"
        | "dayPickerProps"
        | "locale"
        | "maxDate"
        | "minDate"
        | "reverseMonthAndYearMenus"
        | "shortcuts"
        | "singleMonthOnly"
        | "timePickerProps"
    >
>;

export type DateRangePicker3PropsWithDefaults = Omit<DateRangePicker3Props, keyof DateRangePicker3DefaultProps> &
    DateRangePicker3DefaultProps;
