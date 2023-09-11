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
import { DayPicker, DayPickerRangeProps, MonthChangeEventHandler, SelectRangeEventHandler } from "react-day-picker";

import { DISPLAYNAME_PREFIX } from "@blueprintjs/core";
import { DateRange, DateUtils } from "@blueprintjs/datetime";
// tslint:disable no-submodule-imports
import { DateRangeSelectionStrategy } from "@blueprintjs/datetime/lib/esm/common/dateRangeSelectionStrategy";
import { MonthAndYear } from "@blueprintjs/datetime/lib/esm/common/monthAndYear";
// tslint:enable no-submodule-imports

import { Classes } from "../../classes";
import { combineModifiers } from "../../common/dayPickerModifiers";
import { dateRangeToDayPickerRange } from "../../common/reactDayPickerUtils";
import { LeftDatePickerCaption, RightDatePickerCaption } from "../react-day-picker/datePicker3Caption";
import { DayRangePickerProps } from "./dayRangePickerProps";

function getInitialRightView(selectedRangeEnd: Date | null, leftView: MonthAndYear) {
    return MonthAndYear.fromDate(selectedRangeEnd) ?? leftView.getNextMonth();
}

/**
 * Date range picker with two calendars which can move independently of each other.
 */
export const NonContiguousDayRangePicker: React.FC<DayRangePickerProps> = ({
    allowSingleDayRange,
    boundaryToModify,
    dayPickerProps,
    locale,
    maxDate,
    minDate,
    modifiers,
    modifiersClassNames,
    initialMonthAndYear,
    value,
    updateSelectedRange,
    dayPickerEventHandlers,
}) => {
    const { leftView, rightView, handleLeftMonthChange, handleRightMonthChange } = useNonContiguousCalendarViews(
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

            const nextValue = DateRangeSelectionStrategy.getNextState(
                value,
                selectedDay,
                allowSingleDayRange!,
                boundaryToModify,
            ).dateRange;
            updateSelectedRange(nextValue);

            // update the hovered date range after click to show the newly selected
            // state, at leasts until the mouse moves again
            dayPickerEventHandlers.onDayMouseEnter(selectedDay, activeModifiers, e);
        },
        [
            allowSingleDayRange,
            boundaryToModify,
            dayPickerEventHandlers.onDayMouseEnter,
            dayPickerProps?.onSelect,
            updateSelectedRange,
            value,
        ],
    );

    // props applied to both the left and right calendars
    const commonDayPickerProps: DayPickerRangeProps = {
        locale,
        mode: "range",
        modifiers: combineModifiers(modifiers, dayPickerProps?.modifiers),
        modifiersClassNames,
        showOutsideDays: true,
        ...dayPickerProps,
        ...dayPickerEventHandlers,
        onSelect: handleDaySelect,
        selected: dateRangeToDayPickerRange(value),
    };

    return (
        <div className={Classes.DATERANGEPICKER_CALENDARS}>
            <DayPicker
                key="left"
                {...commonDayPickerProps}
                components={{
                    Caption: LeftDatePickerCaption,
                }}
                fromDate={minDate}
                month={leftView.getFullDate()}
                numberOfMonths={1}
                onMonthChange={handleLeftMonthChange}
                toDate={DateUtils.getDatePreviousMonth(maxDate!)}
            />
            <DayPicker
                key="right"
                {...commonDayPickerProps}
                components={{
                    Caption: RightDatePickerCaption,
                }}
                fromDate={DateUtils.getDateNextMonth(minDate!)}
                month={rightView.getFullDate()}
                numberOfMonths={1}
                onMonthChange={handleRightMonthChange}
                toDate={maxDate}
            />
        </div>
    );
};
NonContiguousDayRangePicker.displayName = `${DISPLAYNAME_PREFIX}.NonContiguousDayRangePicker`;

interface NonContiguousCalendarViews {
    leftView: MonthAndYear;
    rightView: MonthAndYear;
    handleLeftMonthChange: MonthChangeEventHandler;
    handleRightMonthChange: MonthChangeEventHandler;
}

function useNonContiguousCalendarViews(
    initialMonthAndYear: MonthAndYear,
    value: DateRange,
    userOnMonthChange: MonthChangeEventHandler | undefined,
): NonContiguousCalendarViews {
    // show the selected end date's encompassing month in the right view if
    // the calendars don't have to be contiguous.
    // if left view and right view months are the same, show next month in the right view.
    const [leftView, setLeftView] = React.useState<MonthAndYear>(initialMonthAndYear);
    const [rightView, setRightView] = React.useState<MonthAndYear>(getInitialRightView(value[1], leftView));

    React.useEffect(() => {
        if (value == null) {
            return;
        }

        let newLeftView = leftView.clone();
        let newRightView = rightView.clone();

        const nextValueStartView = MonthAndYear.fromDate(value[0]);
        const nextValueEndView = MonthAndYear.fromDate(value[1]);

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

        setLeftView(newLeftView);
        setRightView(newRightView);
    }, [value]);

    const updateLeftView = React.useCallback(
        (newLeftView: MonthAndYear) => {
            let newRightView = rightView.clone();
            if (!newLeftView.isBefore(newRightView)) {
                newRightView = newLeftView.getNextMonth();
            }
            setLeftView(newLeftView);
            setRightView(newRightView);
        },
        [rightView],
    );

    const updateRightView = React.useCallback(
        (newRightView: MonthAndYear) => {
            let newLeftView = leftView.clone();
            if (!newRightView.isAfter(newLeftView)) {
                newLeftView = newRightView.getPreviousMonth();
            }
            setLeftView(newLeftView);
            setRightView(newRightView);
        },
        [leftView],
    );

    const handleLeftMonthChange = React.useCallback<MonthChangeEventHandler>(
        newDate => {
            const newLeftView = MonthAndYear.fromDate(newDate);
            userOnMonthChange?.(newLeftView.getFullDate());
            updateLeftView(newLeftView);
        },
        [userOnMonthChange, updateLeftView],
    );

    const handleRightMonthChange = React.useCallback<MonthChangeEventHandler>(
        newDate => {
            const newRightView = MonthAndYear.fromDate(newDate);
            userOnMonthChange?.(newRightView.getFullDate());
            updateRightView(newRightView);
        },
        [userOnMonthChange, updateRightView],
    );

    return {
        leftView,
        rightView,
        handleLeftMonthChange,
        handleRightMonthChange,
    };
}
