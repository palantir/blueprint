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

import type { Boundary, Props } from "@blueprintjs/core";

import type { DateRange } from "./common/dateRange";
import type { DatePickerBaseProps } from "./datePickerCore";
import type { DateRangeShortcut } from "./shortcuts";

/** @deprecated use DateRangePickerProps */
export type IDateRangePickerProps = DateRangePickerProps;

export interface DateRangePickerProps extends DatePickerBaseProps, Props {
    /**
     * Whether the start and end dates of the range can be the same day.
     * If `true`, clicking a selected date will create a one-day range.
     * If `false`, clicking a selected date will clear the selection.
     *
     * @default false
     */
    allowSingleDayRange?: boolean;

    /**
     * The date-range boundary that the next click should modify.
     * This will be honored unless the next click would overlap the other boundary date.
     * In that case, the two boundary dates will be auto-swapped to keep them in chronological order.
     * If `undefined`, the picker will revert to its default selection behavior.
     */
    boundaryToModify?: Boundary;

    /**
     * Whether displayed months in the calendar are contiguous.
     * If false, each side of the calendar can move independently to non-contiguous months.
     *
     * @default true
     */
    contiguousCalendarMonths?: boolean;

    /**
     * Initial `DateRange` the calendar will display as selected.
     * This should not be set if `value` is set.
     */
    defaultValue?: DateRange;

    /**
     * Called when the user selects a day.
     * If no days are selected, it will pass `[null, null]`.
     * If a start date is selected but not an end date, it will pass `[selectedDate, null]`.
     * If both a start and end date are selected, it will pass `[startDate, endDate]`.
     */
    onChange?: (selectedDates: DateRange) => void;

    /**
     * Called when the user changes the hovered date range, either from mouseenter or mouseleave.
     * When triggered from mouseenter, it will pass the date range that would result from next click.
     * When triggered from mouseleave, it will pass `undefined`.
     */
    onHoverChange?: (hoveredDates: DateRange, hoveredDay: Date, hoveredBoundary: Boundary) => void;

    /**
     * Called when the `shortcuts` props is enabled and the user changes the shortcut.
     */
    onShortcutChange?: (shortcut: DateRangeShortcut, index: number) => void;

    /**
     * Whether shortcuts to quickly select a range of dates are displayed or not.
     * If `true`, preset shortcuts will be displayed.
     * If `false`, no shortcuts will be displayed.
     * If an array is provided, the custom shortcuts will be displayed.
     *
     * @default true
     */
    shortcuts?: boolean | DateRangeShortcut[];

    /**
     * The currently selected shortcut.
     * If this prop is provided, the component acts in a controlled manner.
     */
    selectedShortcutIndex?: number;

    /**
     * Whether to show only a single month calendar.
     *
     * @default false
     */
    singleMonthOnly?: boolean;

    /**
     * The currently selected `DateRange`.
     * If this prop is provided, the component acts in a controlled manner.
     */
    value?: DateRange;
}
