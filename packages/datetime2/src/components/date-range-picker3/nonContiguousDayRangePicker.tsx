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
import {
    DayPicker,
    type DayPickerRangeProps,
    type MonthChangeEventHandler,
    type SelectRangeEventHandler,
} from "react-day-picker";

import { DISPLAYNAME_PREFIX } from "@blueprintjs/core";
import { type DateRange, DateRangeSelectionStrategy, DateUtils, MonthAndYear } from "@blueprintjs/datetime";

import { Classes } from "../../classes";
import { dateRangeToDayPickerRange } from "../../common/reactDayPickerUtils";
import { DatePicker3Caption } from "../react-day-picker/datePicker3Caption";
import type { DayRangePickerProps } from "./dayRangePickerProps";

/**
 * Date range picker with two calendars which can move independently of each other.
 */
export const NonContiguousDayRangePicker: React.FC<DayRangePickerProps> = ({
    allowSingleDayRange,
    boundaryToModify,
    dayPickerEventHandlers,
    dayPickerProps,
    initialMonthAndYear,
    locale,
    maxDate,
    minDate,
    onRangeSelect,
    value,
}) => {
    const { displayMonths, handleLeftMonthChange, handleRightMonthChange } = useNonContiguousCalendarViews(
        initialMonthAndYear,
        value,
        dayPickerProps?.onMonthChange,
    );

    const handleDaySelect = React.useCallback<SelectRangeEventHandler>(
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

    // props applied to both the left and right calendars
    const commonDayPickerProps: DayPickerRangeProps = {
        locale,
        mode: "range",
        showOutsideDays: true,
        ...dayPickerProps,
        ...dayPickerEventHandlers,
        components: {
            Caption: DatePicker3Caption,
            ...dayPickerProps?.components,
        },
        onSelect: handleDaySelect,
        selected: dateRangeToDayPickerRange(value),
    };

    return (
        <div className={Classes.DATERANGEPICKER_CALENDARS}>
            <DayPicker
                key="left"
                {...commonDayPickerProps}
                fromDate={minDate}
                month={displayMonths.left.getFullDate()}
                numberOfMonths={1}
                onMonthChange={handleLeftMonthChange}
                toMonth={DateUtils.getDatePreviousMonth(maxDate!)}
            />
            <DayPicker
                key="right"
                {...commonDayPickerProps}
                fromMonth={DateUtils.getDateNextMonth(minDate!)}
                month={displayMonths.right.getFullDate()}
                numberOfMonths={1}
                onMonthChange={handleRightMonthChange}
                toDate={maxDate}
            />
        </div>
    );
};
NonContiguousDayRangePicker.displayName = `${DISPLAYNAME_PREFIX}.NonContiguousDayRangePicker`;

interface LeftAndRightDisplayMonths {
    left: MonthAndYear;
    right: MonthAndYear;
}

interface NonContiguousCalendarViews {
    handleLeftMonthChange: MonthChangeEventHandler;
    handleRightMonthChange: MonthChangeEventHandler;
    displayMonths: LeftAndRightDisplayMonths;
}

/**
 * State management and navigation event handlers for two (left and right) non-contiguous calendar views.
 *
 * @param initialMonthAndYear initial month and year to display in the left calendar
 * @param selectedRange currently selected date range
 * @param userOnMonthChange custom `dayPickerProps.onMonthChange` handler supplied by users of `DateRangePicker3`
 */
function useNonContiguousCalendarViews(
    initialMonthAndYear: MonthAndYear,
    selectedRange: DateRange,
    userOnMonthChange: MonthChangeEventHandler | undefined,
): NonContiguousCalendarViews {
    // show the selected end date's encompassing month in the right view if
    // the calendars don't have to be contiguous.
    // if left view and right view months are the same, show next month in the right view.
    const [views, setViews] = React.useState<LeftAndRightDisplayMonths>({
        left: initialMonthAndYear,
        right: getInitialRightView(selectedRange[1], initialMonthAndYear),
    });

    React.useEffect(() => {
        if (selectedRange == null) {
            return;
        }

        setViews(({ left, right }) => {
            let newLeftView = left.clone();
            let newRightView = right.clone();

            const nextValueStartView = MonthAndYear.fromDate(selectedRange[0]);
            const nextValueEndView = MonthAndYear.fromDate(selectedRange[1]);

            if (nextValueStartView == null && nextValueEndView != null) {
                // Only end date selected.
                // If the newly selected end date isn't in either of the displayed months, then
                //   - set the right DayPicker to the month of the selected end date
                //   - ensure the left DayPicker is before the right, changing if needed
                if (!nextValueEndView.isSame(newLeftView) && !nextValueEndView.isSame(newRightView)) {
                    newRightView = nextValueEndView;
                    if (!newLeftView.isBefore(newRightView)) {
                        newLeftView = newRightView.getPreviousMonth();
                    }
                }
            } else if (nextValueStartView != null && nextValueEndView == null) {
                // Only start date selected.
                // If the newly selected start date isn't in either of the displayed months, then
                //   - set the left DayPicker to the month of the selected start date
                //   - ensure the right DayPicker is before the left, changing if needed
                if (!nextValueStartView.isSame(newLeftView) && !nextValueStartView.isSame(newRightView)) {
                    newLeftView = nextValueStartView;
                    if (!newRightView.isAfter(newLeftView)) {
                        newRightView = newLeftView.getNextMonth();
                    }
                }
            } else if (nextValueStartView != null && nextValueEndView != null) {
                // Both start and end date months are identical
                // If the selected month isn't in either of the displayed months, then
                //   - set the left DayPicker to be the selected month
                //   - set the right DayPicker to +1
                if (nextValueStartView.isSame(nextValueEndView)) {
                    if (newLeftView.isSame(nextValueStartView) || newRightView.isSame(nextValueStartView)) {
                        // do nothing
                    } else {
                        newLeftView = nextValueStartView;
                        newRightView = nextValueStartView.getNextMonth();
                    }
                } else {
                    // Different start and end date months, adjust display months.
                    if (!newLeftView.isSame(nextValueStartView)) {
                        newLeftView = nextValueStartView;
                        newRightView = nextValueStartView.getNextMonth();
                    }
                    if (!newRightView.isSame(nextValueEndView)) {
                        newRightView = nextValueEndView;
                    }
                }
            }

            return { left: newLeftView, right: newRightView };
        });
    }, [setViews, selectedRange]);

    const updateLeftView = React.useCallback(
        (newLeftView: MonthAndYear) => {
            setViews(({ right }) => {
                let newRightView = right.clone();
                if (!newLeftView.isBefore(newRightView)) {
                    newRightView = newLeftView.getNextMonth();
                }
                return { left: newLeftView, right: newRightView };
            });
        },
        [setViews],
    );

    const updateRightView = React.useCallback(
        (newRightView: MonthAndYear) => {
            setViews(({ left }) => {
                let newLeftView = left.clone();
                if (!newRightView.isAfter(newLeftView)) {
                    newLeftView = newRightView.getPreviousMonth();
                }
                return { left: newLeftView, right: newRightView };
            });
        },
        [setViews],
    );

    const handleLeftMonthChange = React.useCallback<MonthChangeEventHandler>(
        newDate => {
            const newLeftView = MonthAndYear.fromDate(newDate);
            updateLeftView(newLeftView);
            userOnMonthChange?.(newDate);
        },
        [userOnMonthChange, updateLeftView],
    );

    const handleRightMonthChange = React.useCallback<MonthChangeEventHandler>(
        newDate => {
            const newRightView = MonthAndYear.fromDate(newDate);
            updateRightView(newRightView);
            userOnMonthChange?.(newDate);
        },
        [userOnMonthChange, updateRightView],
    );

    return {
        displayMonths: views,
        handleLeftMonthChange,
        handleRightMonthChange,
    };
}

function getInitialRightView(selectedRangeEnd: Date | null, leftView: MonthAndYear) {
    const rightView = MonthAndYear.fromDate(selectedRangeEnd);

    if (rightView === undefined || rightView.isSameMonth(leftView)) {
        return leftView.getNextMonth();
    }

    return rightView;
}
