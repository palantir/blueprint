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

import type { DayPickerRangeProps } from "react-day-picker";

import type { Boundary } from "@blueprintjs/core";
import type { DateRange, MonthAndYear } from "@blueprintjs/datetime";

import type { DateRangePicker3Props } from "./dateRangePicker3Props";
import type { DateRangePicker3State } from "./dateRangePicker3State";

/**
 * Props used to render an interactive single- or double-calendar day range picker.
 * This is the core UI of DateRangePicker3 (exclusive of time pickers, shortcuts, and the actions bar).
 */
export interface DayRangePickerProps
    extends Omit<DateRangePicker3Props, "initialMonth" | "locale" | "value">,
        Pick<DateRangePicker3State, "locale" | "value"> {
    /**
     * react-day-picker event handlers. These are used to update hover state in DateRangePicker3.
     */
    dayPickerEventHandlers: Required<Pick<DayPickerRangeProps, "onDayMouseEnter" | "onDayMouseLeave">>;

    /**
     * Initial month and year to display. If there are multiple calendars, this applies to the left calendar.
     */
    initialMonthAndYear: MonthAndYear;

    /**
     * Date range selection handler triggered when clicking a day in one of the calendars.
     *
     * @param selectedRange the new selected date range
     * @param selectedDay the date that was clicked to trigger this selection
     * @param boundary the boundary (start or end) which has just been modified by this click
     */
    onRangeSelect: (selectedRange: DateRange, selectedDay: Date, boundary: Boundary) => void;
}
