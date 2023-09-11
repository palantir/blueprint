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

import { format } from "date-fns";
import * as React from "react";
import { DateFormatter, DayPicker, MonthChangeEventHandler, SelectRangeEventHandler } from "react-day-picker";

// tslint:disable no-submodule-imports
import { DateRangeSelectionStrategy } from "@blueprintjs/datetime/lib/esm/common/dateRangeSelectionStrategy";
import { MonthAndYear } from "@blueprintjs/datetime/lib/esm/common/monthAndYear";
// tslint:enable no-submodule-imports

import { combineModifiers } from "../../common/dayPickerModifiers";
import { dateRangeToDayPickerRange } from "../../common/reactDayPickerUtils";
import { DatePicker3Dropdown } from "../react-day-picker/datePicker3Dropdown";
import { IconLeft, IconRight } from "../react-day-picker/datePickerNavIcons";
import { DayRangePickerProps } from "./dayRangePickerProps";

/**
 * Render a standard day range picker where props.contiguousCalendarMonths is expected to be `true`.
 */
export const ContiguousDayRangePicker: React.FC<DayRangePickerProps> = ({
    allowSingleDayRange,
    boundaryToModify,
    dayPickerProps,
    dayPickerEventHandlers,
    initialMonthAndYear,
    locale,
    maxDate,
    minDate,
    modifiers,
    modifiersClassNames,
    singleMonthOnly,
    updateSelectedRange,
    value,
}) => {
    const [displayMonth, setDisplayMonth] = React.useState(initialMonthAndYear);

    // use an effect to react to external value updates (such as shortcut item selections)
    React.useEffect(() => {
        if (value == null) {
            return;
        }

        let newDisplayMonth = displayMonth.clone();

        const nextValueStart = MonthAndYear.fromDate(value[0]);
        const nextValueEnd = MonthAndYear.fromDate(value[1]);

        if (nextValueStart == null && nextValueEnd != null) {
            // Only end date selected.
            // If the newly selected end date isn't in either of the displayed months, then
            //   - set the right DayPicker to the month of the selected end date
            //   - ensure the left DayPicker is before the right, changing if needed
            if (!nextValueEnd.isSame(newDisplayMonth.getNextMonth())) {
                newDisplayMonth = nextValueEnd.getPreviousMonth();
            }
        } else if (nextValueStart != null && nextValueEnd == null) {
            // Only start date selected.
            // If the newly selected start date isn't in either of the displayed months, then
            //   - set the left DayPicker to the month of the selected start date
            //   - ensure the right DayPicker is before the left, changing if needed
            if (!nextValueStart.isSame(newDisplayMonth)) {
                newDisplayMonth = nextValueStart;
            }
        } else if (nextValueStart != null && nextValueEnd != null) {
            if (nextValueStart.isSame(nextValueEnd)) {
                // Both start and end date months are identical
                // If the selected month isn't in either of the displayed months, then
                //   - set the left DayPicker to be the selected month
                //   - set the right DayPicker to +1
                if (newDisplayMonth.isSame(nextValueStart) || newDisplayMonth.getNextMonth().isSame(nextValueStart)) {
                    // do nothing
                } else {
                    newDisplayMonth = nextValueStart;
                }
            } else {
                // Different start and end date months, adjust display months.
                if (!newDisplayMonth.isSame(nextValueStart)) {
                    // do nothing
                }
            }
        }

        setDisplayMonth(newDisplayMonth);
    }, [setDisplayMonth, value]);

    const handleMonthChange = React.useCallback<MonthChangeEventHandler>(
        month => {
            setDisplayMonth(MonthAndYear.fromDate(month));
            dayPickerProps?.onMonthChange?.(month);
        },
        [dayPickerProps?.onMonthChange, setDisplayMonth],
    );

    const handleRangeSelect = React.useCallback<SelectRangeEventHandler>(
        (range, selectedDay, activeModifiers, e) => {
            dayPickerProps?.onSelect?.(range, selectedDay, activeModifiers, e);

            if (modifiers.disabled) {
                // TODO(@adidahiya): see if this forceUpdate is still necessary?
                // rerender base component to get around bug where you can navigate past bounds by clicking days
                // this.forceUpdate();
                return;
            }

            const nextValue = DateRangeSelectionStrategy.getNextState(
                value,
                selectedDay,
                allowSingleDayRange!,
                boundaryToModify,
            ).dateRange;

            // update the hovered date range after click to show the newly selected
            // state, at leasts until the mouse moves again
            dayPickerEventHandlers.onDayMouseEnter?.(selectedDay, activeModifiers, e);

            updateSelectedRange(nextValue);
        },
        [allowSingleDayRange, boundaryToModify, dayPickerEventHandlers.onDayMouseEnter, updateSelectedRange, value],
    );

    /**
     * Custom formatter to render weekday names in the calendar header. The default formatter generally works fine,
     * but it was returning CAPITALIZED strings for some reason, while we prefer Title Case.
     */
    const formatWeekdayName = React.useCallback<DateFormatter>(
        date => {
            return format(date, "EEEEEE", { locale });
        },
        [locale],
    );

    return (
        <DayPicker
            modifiers={combineModifiers(modifiers, dayPickerProps?.modifiers)}
            modifiersClassNames={{ ...dayPickerProps?.modifiersClassNames, ...modifiersClassNames }}
            showOutsideDays={true}
            {...dayPickerProps}
            captionLayout="dropdown-buttons"
            components={{
                Dropdown: DatePicker3Dropdown,
                IconLeft,
                IconRight,
                ...dayPickerProps?.components,
            }}
            formatters={{
                formatWeekdayName,
                ...dayPickerProps?.formatters,
            }}
            fromDate={minDate}
            locale={locale}
            mode="range"
            month={displayMonth.getFullDate()}
            numberOfMonths={singleMonthOnly ? 1 : 2}
            onDayMouseEnter={dayPickerEventHandlers.onDayMouseEnter}
            onDayMouseLeave={dayPickerEventHandlers.onDayMouseLeave}
            onMonthChange={handleMonthChange}
            onSelect={handleRangeSelect}
            selected={dateRangeToDayPickerRange(value)}
            toDate={maxDate}
        />
    );
};
