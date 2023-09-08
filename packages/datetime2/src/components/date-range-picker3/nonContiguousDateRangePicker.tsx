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
    DayModifiers,
    DayPicker,
    DayPickerRangeProps,
    MonthChangeEventHandler,
    SelectRangeEventHandler,
} from "react-day-picker";

import { DateRange, DateUtils } from "@blueprintjs/datetime";
// tslint:disable no-submodule-imports
import { MonthAndYear } from "@blueprintjs/datetime/lib/esm/common/monthAndYear";
import { DateRangeSelectionStrategy } from "@blueprintjs/datetime/lib/esm/common/dateRangeSelectionStrategy";
// tslint:enable no-submodule-imports

import { Classes } from "../../classes";
import { combineModifiers } from "../../common/dayPickerModifiers";
import { DateRangePicker3Props } from "./dateRangePicker3Props";
import { DateRangePicker3State } from "./dateRangePicker3State";
import { dateRangeToDayPickerRange } from "../../common/reactDayPickerUtils";
import { LeftDatePickerCaption, RightDatePickerCaption } from "../react-day-picker/datePicker3Caption";

export interface NonContiguousDateRangePickerProps
    extends Omit<DateRangePicker3Props, "locale" | "value">,
        Pick<DateRangePicker3State, "locale" | "value"> {
    /** Initial month computed in DateRangePicker3 constructor. */
    initialMonth: Date;

    /** DateRangePicker3's custom modifiers */
    modifiers: DayModifiers;

    /** Controlled month value set if the user forces a navigation using the shortcuts. */
    month?: Date;

    /** DateRangePicker3's selection event handler */
    onSelect: (nextValue: DateRange) => void;

    /** react-day-picker event handlers */
    dayPickerEventHandlers: Required<Pick<DayPickerRangeProps, "onDayMouseEnter" | "onDayMouseLeave">>;
}

function getInitialRightView(selectedRangeEnd: Date | null, leftView: MonthAndYear) {
    return MonthAndYear.fromDate(selectedRangeEnd) ?? leftView.getNextMonth();
}

/**
 * Date range picker with two calendars which can move independently of each other.
 */
export const NonContiguousDateRangePicker: React.FC<NonContiguousDateRangePickerProps> = props => {
    const { locale, maxDate, minDate, modifiers, month, initialMonth, value } = props;

    // show the selected end date's encompassing month in the right view if
    // the calendars don't have to be contiguous.
    // if left view and right view months are the same, show next month in the right view.
    const [leftView, setLeftView] = React.useState<MonthAndYear>(MonthAndYear.fromDate(initialMonth));
    const [rightView, setRightView] = React.useState<MonthAndYear>(getInitialRightView(value[1], leftView));

    React.useEffect(() => {
        if (month !== undefined) {
            const newLeftView = MonthAndYear.fromDate(month);
            setLeftView(newLeftView);
            setRightView(getInitialRightView(value[1], newLeftView));
        }
    }, [month, value]);

    const updateLeftView = React.useCallback(
        (newLeftView: MonthAndYear) => {
            let newRightView = rightView.clone();
            if (!newLeftView.isBefore(newRightView)) {
                newRightView = newLeftView.getNextMonth();
            }
            setLeftView(newLeftView);
            setRightView(rightView);
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

    const handleDaySelect = React.useCallback<SelectRangeEventHandler>(
        (range, selectedDay, activeModifiers, e) => {
            props.dayPickerProps?.onSelect?.(range, selectedDay, activeModifiers, e);

            if (activeModifiers.disabled) {
                // TODO(@adidahiya): see if this forceUpdate is still necessary?
                // rerender base component to get around bug where you can navigate past bounds by clicking days
                // this.forceUpdate();
                return;
            }

            const nextValue = DateRangeSelectionStrategy.getNextState(
                value,
                selectedDay,
                props.allowSingleDayRange!,
                props.boundaryToModify,
            ).dateRange;
            props.onSelect(nextValue);

            // update the hovered date range after click to show the newly selected
            // state, at leasts until the mouse moves again
            props.dayPickerEventHandlers.onDayMouseEnter(selectedDay, activeModifiers, e);
        },
        [props.dayPickerProps?.onSelect, props.allowSingleDayRange, props.boundaryToModify],
    );

    const handleLeftMonthChange = React.useCallback<MonthChangeEventHandler>(
        newDate => {
            const leftView = MonthAndYear.fromDate(newDate);
            props.dayPickerProps?.onMonthChange?.(leftView.getFullDate());
            updateLeftView(leftView);
        },
        [props.dayPickerProps?.onMonthChange, updateLeftView],
    );

    const handleRightMonthChange = React.useCallback<MonthChangeEventHandler>(
        newDate => {
            const rightView = MonthAndYear.fromDate(newDate);
            props.dayPickerProps?.onMonthChange?.(rightView.getFullDate());
            updateRightView(rightView);
        },
        [props.dayPickerProps?.onMonthChange, updateRightView],
    );

    // props applied to both the left and right calendars
    const commonDayPickerProps: DayPickerRangeProps = {
        mode: "range",
        locale,
        modifiers: combineModifiers(modifiers, props.dayPickerProps?.modifiers),
        showOutsideDays: true,
        ...props.dayPickerProps,
        ...props.dayPickerEventHandlers,
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
