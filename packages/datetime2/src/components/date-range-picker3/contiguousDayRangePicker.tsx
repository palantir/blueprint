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

import * as React from "react";
import { DayPicker, type MonthChangeEventHandler, type SelectRangeEventHandler } from "react-day-picker";

import { DISPLAYNAME_PREFIX } from "@blueprintjs/core";
import { type DateRange, DateRangeSelectionStrategy, MonthAndYear } from "@blueprintjs/datetime";

import { dateRangeToDayPickerRange } from "../../common/reactDayPickerUtils";
import { DatePicker3Dropdown } from "../react-day-picker/datePicker3Dropdown";
import { IconLeft, IconRight } from "../react-day-picker/datePickerNavIcons";
import type { DayRangePickerProps } from "./dayRangePickerProps";

/**
 * Render a standard day range picker where props.contiguousCalendarMonths is expected to be `true`.
 */
export const ContiguousDayRangePicker: React.FC<DayRangePickerProps> = ({
    allowSingleDayRange,
    boundaryToModify,
    dayPickerEventHandlers,
    dayPickerProps,
    initialMonthAndYear,
    locale,
    maxDate,
    minDate,
    onRangeSelect,
    singleMonthOnly = false,
    value,
}) => {
    const { displayMonth, handleMonthChange } = useContiguousCalendarViews(
        initialMonthAndYear,
        singleMonthOnly,
        value,
        dayPickerProps?.onMonthChange,
    );

    const handleRangeSelect = React.useCallback<SelectRangeEventHandler>(
        (range, selectedDay, activeModifiers, e) => {
            dayPickerProps?.onSelect?.(range, selectedDay, activeModifiers, e);

            if (activeModifiers.disabled) {
                return;
            }

            const { dateRange: nextValue, boundary } = DateRangeSelectionStrategy.getNextState(
                value,
                selectedDay,
                allowSingleDayRange!,
                boundaryToModify,
            );
            onRangeSelect(nextValue, selectedDay, boundary);
        },
        [allowSingleDayRange, boundaryToModify, dayPickerProps, onRangeSelect, value],
    );

    return (
        <DayPicker
            showOutsideDays={true}
            {...dayPickerEventHandlers}
            {...dayPickerProps}
            captionLayout="dropdown-buttons"
            components={{
                Dropdown: DatePicker3Dropdown,
                IconLeft,
                IconRight,
                ...dayPickerProps?.components,
            }}
            fromDate={minDate}
            locale={locale}
            mode="range"
            month={displayMonth.getFullDate()}
            numberOfMonths={singleMonthOnly ? 1 : 2}
            onMonthChange={handleMonthChange}
            onSelect={handleRangeSelect}
            selected={dateRangeToDayPickerRange(value)}
            toDate={maxDate}
        />
    );
};
ContiguousDayRangePicker.displayName = `${DISPLAYNAME_PREFIX}.ContiguousDayRangePicker`;

interface ContiguousCalendarViews {
    displayMonth: MonthAndYear;
    handleMonthChange: MonthChangeEventHandler;
}

/**
 * State management and navigation event handlers for a single calendar or two contiguous calendar views.
 *
 * @param initialMonthAndYear initial month and year to display in the left calendar
 * @param singleMonthOnly whether we are only displaying a single month instead of two
 * @param selectedRange currently selected date range
 * @param userOnMonthChange custom `dayPickerProps.onMonthChange` handler supplied by users of `DateRangePicker3`
 */
function useContiguousCalendarViews(
    initialMonthAndYear: MonthAndYear,
    singleMonthOnly: boolean,
    selectedRange: DateRange,
    userOnMonthChange: MonthChangeEventHandler | undefined,
): ContiguousCalendarViews {
    const [displayMonth, setDisplayMonth] = React.useState(initialMonthAndYear);
    const prevSelectedRange = React.useRef<DateRange>(selectedRange);
    const isInitialRender = React.useRef<boolean>(true);

    // use an effect to react to external value updates (such as shortcut item selections)
    React.useEffect(() => {
        // upon first render, we shouldn't update the display month; instead just use the initially computed value.
        // this is important in cases where the user sets `initialMonth` and a controlled `value`.
        if (isInitialRender.current) {
            isInitialRender.current = false;
            return;
        }

        if (selectedRange == null) {
            return;
        }

        setDisplayMonth(prevDisplayMonth => {
            let newDisplayMonth = prevDisplayMonth.clone();

            if (selectedRange[0] == null || selectedRange[1] == null) {
                // special case: if only one boundary of the range is selected and it is already displayed in one of the
                // months, don't update the display month. this prevents the picker from shifting around when a user is in
                // the middle of a selection.
                if (
                    isDateDisplayed(selectedRange[0], prevDisplayMonth, singleMonthOnly) ||
                    isDateDisplayed(selectedRange[1], prevDisplayMonth, singleMonthOnly)
                ) {
                    return newDisplayMonth;
                }
            }

            const nextRangeStart = MonthAndYear.fromDate(selectedRange[0]);
            const nextRangeEnd = MonthAndYear.fromDate(selectedRange[1]);

            if (nextRangeStart == null && nextRangeEnd != null) {
                // Only end date selected.
                // If the newly selected end date isn't in either of the displayed months, then
                //   - set the right DayPicker to the month of the selected end date
                //   - ensure the left DayPicker is before the right, changing if needed
                if (!nextRangeEnd.isSame(newDisplayMonth.getNextMonth())) {
                    newDisplayMonth = nextRangeEnd.getPreviousMonth();
                }
            } else if (nextRangeStart != null && nextRangeEnd == null) {
                // Only start date selected.
                // If the newly selected start date isn't in either of the displayed months, then
                //   - set the left DayPicker to the month of the selected start date
                //   - ensure the right DayPicker is before the left, changing if needed
                if (!nextRangeStart.isSame(newDisplayMonth)) {
                    newDisplayMonth = nextRangeStart;
                }
            } else if (nextRangeStart != null && nextRangeEnd != null) {
                if (nextRangeStart.isSame(nextRangeEnd)) {
                    // Both start and end date months are identical
                    if (
                        newDisplayMonth.isSame(nextRangeStart) ||
                        (!singleMonthOnly && newDisplayMonth.getNextMonth().isSame(nextRangeEnd))
                    ) {
                        // do nothing
                    } else {
                        newDisplayMonth = nextRangeStart;
                    }
                } else {
                    // Different start and end date months, adjust display months.
                    newDisplayMonth = nextRangeStart;
                }
            }

            return newDisplayMonth;
        });
    }, [setDisplayMonth, selectedRange, singleMonthOnly]);

    React.useEffect(() => {
        prevSelectedRange.current = selectedRange;
    }, [selectedRange]);

    const handleMonthChange = React.useCallback<MonthChangeEventHandler>(
        newMonth => {
            setDisplayMonth(MonthAndYear.fromDate(newMonth));
            userOnMonthChange?.(newMonth);
        },
        [userOnMonthChange, setDisplayMonth],
    );

    return {
        displayMonth,
        handleMonthChange,
    };
}

/**
 * Determines whether a given date is displayed in a contiguous single- or double-calendar view.
 */
function isDateDisplayed(date: Date | null, displayMonth: MonthAndYear, singleMonthOnly: boolean): boolean {
    if (date == null) {
        return false;
    }

    const month = MonthAndYear.fromDate(date);

    return singleMonthOnly
        ? displayMonth.isSameMonth(month)
        : displayMonth.isSameMonth(month) || displayMonth.getNextMonth().isSameMonth(month);
}
