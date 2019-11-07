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

import { AbstractPureComponent2, Boundary, DISPLAYNAME_PREFIX, Divider, IProps, Utils } from "@blueprintjs/core";
import classNames from "classnames";
import * as React from "react";
import DayPicker, { CaptionElementProps, DayModifiers, DayPickerProps, NavbarElementProps } from "react-day-picker";
import { polyfill } from "react-lifecycles-compat";

import * as DateClasses from "./common/classes";
import * as DateUtils from "./common/dateUtils";
import DateRange = DateUtils.DateRange;

import * as Errors from "./common/errors";
import { MonthAndYear } from "./common/monthAndYear";
import { DatePickerCaption } from "./datePickerCaption";
import {
    combineModifiers,
    getDefaultMaxDate,
    getDefaultMinDate,
    HOVERED_RANGE_MODIFIER,
    IDatePickerBaseProps,
    IDatePickerModifiers,
    SELECTED_RANGE_MODIFIER,
} from "./datePickerCore";
import { DatePickerNavbar } from "./datePickerNavbar";
import { DateRangeSelectionStrategy } from "./dateRangeSelectionStrategy";
import { IDateRangeShortcut, Shortcuts } from "./shortcuts";
import { TimePicker } from "./timePicker";

export interface IDateRangePickerProps extends IDatePickerBaseProps, IProps {
    /**
     * Whether the start and end dates of the range can be the same day.
     * If `true`, clicking a selected date will create a one-day range.
     * If `false`, clicking a selected date will clear the selection.
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
     * @default true
     */
    contiguousCalendarMonths?: boolean;
    /**
     * Props to pass to ReactDayPicker. See API documentation
     * [here](http://react-day-picker.js.org/api/DayPicker).
     *
     * The following props are managed by the component and cannot be configured:
     * `canChangeMonth`, `captionElement`, `numberOfMonths`, `fromMonth` (use
     * `minDate`), `month` (use `initialMonth`), `toMonth` (use `maxDate`).
     */
    dayPickerProps?: DayPickerProps;

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
    onShortcutChange?: (shortcut: IDateRangeShortcut, index: number) => void;

    /**
     * Whether shortcuts to quickly select a range of dates are displayed or not.
     * If `true`, preset shortcuts will be displayed.
     * If `false`, no shortcuts will be displayed.
     * If an array is provided, the custom shortcuts will be displayed.
     * @default true
     */
    shortcuts?: boolean | IDateRangeShortcut[];

    /**
     * The currently selected shortcut.
     * If this prop is provided, the component acts in a controlled manner.
     */
    selectedShortcutIndex?: number;

    /**
     * Whether to show only a single month calendar.
     * @default false
     */
    singleMonthOnly?: boolean;

    /**
     * The currently selected `DateRange`.
     * If this prop is provided, the component acts in a controlled manner.
     */
    value?: DateRange;
}

// leftView and rightView controls the DayPicker displayed month
export interface IDateRangePickerState {
    hoverValue?: DateRange;
    leftView?: MonthAndYear;
    rightView?: MonthAndYear;
    value?: DateRange;
    time?: DateRange;
    selectedShortcutIndex?: number;
}

@polyfill
export class DateRangePicker extends AbstractPureComponent2<IDateRangePickerProps, IDateRangePickerState> {
    public static defaultProps: IDateRangePickerProps = {
        allowSingleDayRange: false,
        contiguousCalendarMonths: true,
        dayPickerProps: {},
        maxDate: getDefaultMaxDate(),
        minDate: getDefaultMinDate(),
        reverseMonthAndYearMenus: false,
        shortcuts: true,
        singleMonthOnly: false,
        timePickerProps: {},
    };

    public static displayName = `${DISPLAYNAME_PREFIX}.DateRangePicker`;

    // these will get merged with the user's own
    private modifiers: IDatePickerModifiers = {
        [SELECTED_RANGE_MODIFIER]: day => {
            const { value } = this.state;
            return value[0] != null && value[1] != null && DateUtils.isDayInRange(day, value, true);
        },
        [`${SELECTED_RANGE_MODIFIER}-start`]: day => DateUtils.areSameDay(this.state.value[0], day),
        [`${SELECTED_RANGE_MODIFIER}-end`]: day => DateUtils.areSameDay(this.state.value[1], day),

        [HOVERED_RANGE_MODIFIER]: day => {
            const {
                hoverValue,
                value: [selectedStart, selectedEnd],
            } = this.state;
            if (selectedStart == null && selectedEnd == null) {
                return false;
            }
            if (hoverValue == null || hoverValue[0] == null || hoverValue[1] == null) {
                return false;
            }
            return DateUtils.isDayInRange(day, hoverValue, true);
        },
        [`${HOVERED_RANGE_MODIFIER}-start`]: day => {
            const { hoverValue } = this.state;
            if (hoverValue == null || hoverValue[0] == null) {
                return false;
            }
            return DateUtils.areSameDay(hoverValue[0], day);
        },
        [`${HOVERED_RANGE_MODIFIER}-end`]: day => {
            const { hoverValue } = this.state;
            if (hoverValue == null || hoverValue[1] == null) {
                return false;
            }
            return DateUtils.areSameDay(hoverValue[1], day);
        },
    };

    public constructor(props: IDateRangePickerProps, context?: any) {
        super(props, context);
        const value = getInitialValue(props);
        const time: DateRange = value;
        const initialMonth = getInitialMonth(props, value);

        // if the initial month is the last month of the picker's
        // allowable range, the react-day-picker library will show
        // the max month on the left and the *min* month on the right.
        // subtracting one avoids that weird, wraparound state (#289).
        const initialMonthEqualsMinMonth = DateUtils.areSameMonth(initialMonth, props.minDate);
        const initalMonthEqualsMaxMonth = DateUtils.areSameMonth(initialMonth, props.maxDate);
        if (!props.singleMonthOnly && !initialMonthEqualsMinMonth && initalMonthEqualsMaxMonth) {
            initialMonth.setMonth(initialMonth.getMonth() - 1);
        }

        // show the selected end date's encompassing month in the right view if
        // the calendars don't have to be contiguous.
        // if left view and right view months are the same, show next month in the right view.
        const leftView = MonthAndYear.fromDate(initialMonth);
        const rightDate = value[1];
        const rightView =
            !props.contiguousCalendarMonths && rightDate != null && !DateUtils.areSameMonth(initialMonth, rightDate)
                ? MonthAndYear.fromDate(rightDate)
                : leftView.getNextMonth();
        this.state = {
            hoverValue: [null, null],
            leftView,
            rightView,
            selectedShortcutIndex:
                this.props.selectedShortcutIndex !== undefined ? this.props.selectedShortcutIndex : -1,
            time,
            value,
        };
    }

    public render() {
        const { className, contiguousCalendarMonths, singleMonthOnly } = this.props;
        const isShowingOneMonth = singleMonthOnly || DateUtils.areSameMonth(this.props.minDate, this.props.maxDate);

        const classes = classNames(DateClasses.DATEPICKER, DateClasses.DATERANGEPICKER, className, {
            [DateClasses.DATERANGEPICKER_CONTIGUOUS]: contiguousCalendarMonths,
            [DateClasses.DATERANGEPICKER_SINGLE_MONTH]: isShowingOneMonth,
        });

        // use the left DayPicker when we only need one
        return (
            <div className={classes}>
                {this.maybeRenderShortcuts()}
                <div>
                    {this.renderCalendars(isShowingOneMonth)}
                    {this.maybeRenderTimePickers()}
                </div>
            </div>
        );
    }

    public componentDidUpdate(prevProps: IDateRangePickerProps, prevState: IDateRangePickerState, snapshot?: {}) {
        super.componentDidUpdate(prevProps, prevState, snapshot);

        if (
            !DateUtils.areRangesEqual(prevProps.value, this.props.value) ||
            prevProps.contiguousCalendarMonths !== this.props.contiguousCalendarMonths
        ) {
            const nextState = getStateChange(
                prevProps.value,
                this.props.value,
                this.state,
                prevProps.contiguousCalendarMonths,
            );
            this.setState(nextState);
        }

        if (this.props.selectedShortcutIndex !== prevProps.selectedShortcutIndex) {
            this.setState({ selectedShortcutIndex: this.props.selectedShortcutIndex });
        }
    }

    protected validateProps(props: IDateRangePickerProps) {
        const { defaultValue, initialMonth, maxDate, minDate, boundaryToModify, value } = props;
        const dateRange: DateRange = [minDate, maxDate];

        if (defaultValue != null && !DateUtils.isDayRangeInRange(defaultValue, dateRange)) {
            throw new Error(Errors.DATERANGEPICKER_DEFAULT_VALUE_INVALID);
        }

        if (initialMonth != null && !DateUtils.isMonthInRange(initialMonth, dateRange)) {
            throw new Error(Errors.DATERANGEPICKER_INITIAL_MONTH_INVALID);
        }

        if (maxDate != null && minDate != null && maxDate < minDate && !DateUtils.areSameDay(maxDate, minDate)) {
            throw new Error(Errors.DATERANGEPICKER_MAX_DATE_INVALID);
        }

        if (value != null && !DateUtils.isDayRangeInRange(value, dateRange)) {
            throw new Error(Errors.DATERANGEPICKER_VALUE_INVALID);
        }

        if (boundaryToModify != null && boundaryToModify !== Boundary.START && boundaryToModify !== Boundary.END) {
            throw new Error(Errors.DATERANGEPICKER_PREFERRED_BOUNDARY_TO_MODIFY_INVALID);
        }
    }

    private disabledDays = (day: Date) => !DateUtils.isDayInRange(day, [this.props.minDate, this.props.maxDate]);

    private getDisabledDaysModifier = () => {
        const {
            dayPickerProps: { disabledDays },
        } = this.props;

        return disabledDays instanceof Array ? [this.disabledDays, ...disabledDays] : [this.disabledDays, disabledDays];
    };

    private maybeRenderShortcuts() {
        const { shortcuts } = this.props;
        if (shortcuts == null || shortcuts === false) {
            return null;
        }

        const { selectedShortcutIndex } = this.state;
        const { allowSingleDayRange, maxDate, minDate, timePrecision } = this.props;
        return [
            <Shortcuts
                key="shortcuts"
                {...{ allowSingleDayRange, maxDate, minDate, shortcuts, timePrecision, selectedShortcutIndex }}
                onShortcutClick={this.handleShortcutClick}
            />,
            <Divider key="div" />,
        ];
    }

    private maybeRenderTimePickers() {
        const { timePrecision, timePickerProps } = this.props;
        if (timePrecision == null && timePickerProps === DateRangePicker.defaultProps.timePickerProps) {
            return null;
        }
        return (
            <div className={DateClasses.DATERANGEPICKER_TIMEPICKERS}>
                <TimePicker
                    precision={timePrecision}
                    {...timePickerProps}
                    onChange={this.handleTimeChangeLeftCalendar}
                    value={this.state.time[0]}
                />
                <TimePicker
                    precision={timePrecision}
                    {...timePickerProps}
                    onChange={this.handleTimeChangeRightCalendar}
                    value={this.state.time[1]}
                />
            </div>
        );
    }

    private handleTimeChange = (newTime: Date, dateIndex: number) => {
        Utils.safeInvoke(this.props.timePickerProps.onChange, newTime);
        const { value, time } = this.state;
        const newValue = DateUtils.getDateTime(
            value[dateIndex] != null ? DateUtils.clone(value[dateIndex]) : new Date(),
            newTime,
        );
        const newDateRange: DateRange = [value[0], value[1]];
        newDateRange[dateIndex] = newValue;
        const newTimeRange: DateRange = [time[0], time[1]];
        newTimeRange[dateIndex] = newTime;
        Utils.safeInvoke(this.props.onChange, newDateRange);
        this.setState({ value: newDateRange, time: newTimeRange });
    };

    private handleTimeChangeLeftCalendar = (time: Date) => {
        this.handleTimeChange(time, 0);
    };

    private handleTimeChangeRightCalendar = (time: Date) => {
        this.handleTimeChange(time, 1);
    };

    private renderCalendars(isShowingOneMonth: boolean) {
        const { dayPickerProps, locale, localeUtils, maxDate, minDate } = this.props;
        const dayPickerBaseProps: DayPickerProps = {
            locale,
            localeUtils,
            modifiers: combineModifiers(this.modifiers, this.props.modifiers),
            showOutsideDays: true,
            ...dayPickerProps,
            disabledDays: this.getDisabledDaysModifier(),
            onDayClick: this.handleDayClick,
            onDayMouseEnter: this.handleDayMouseEnter,
            onDayMouseLeave: this.handleDayMouseLeave,
            selectedDays: this.state.value,
        };

        if (isShowingOneMonth) {
            return (
                <DayPicker
                    {...dayPickerBaseProps}
                    captionElement={this.renderSingleCaption}
                    navbarElement={this.renderSingleNavbar}
                    fromMonth={minDate}
                    month={this.state.leftView.getFullDate()}
                    numberOfMonths={1}
                    onMonthChange={this.handleLeftMonthChange}
                    toMonth={maxDate}
                />
            );
        } else {
            return [
                <DayPicker
                    key="left"
                    {...dayPickerBaseProps}
                    canChangeMonth={true}
                    captionElement={this.renderLeftCaption}
                    navbarElement={this.renderLeftNavbar}
                    fromMonth={minDate}
                    month={this.state.leftView.getFullDate()}
                    numberOfMonths={1}
                    onMonthChange={this.handleLeftMonthChange}
                    toMonth={DateUtils.getDatePreviousMonth(maxDate)}
                />,
                <DayPicker
                    key="right"
                    {...dayPickerBaseProps}
                    canChangeMonth={true}
                    captionElement={this.renderRightCaption}
                    navbarElement={this.renderRightNavbar}
                    fromMonth={DateUtils.getDateNextMonth(minDate)}
                    month={this.state.rightView.getFullDate()}
                    numberOfMonths={1}
                    onMonthChange={this.handleRightMonthChange}
                    toMonth={maxDate}
                />,
            ];
        }
    }

    private renderSingleNavbar = (navbarProps: NavbarElementProps) => (
        <DatePickerNavbar {...navbarProps} maxDate={this.props.maxDate} minDate={this.props.minDate} />
    );

    private renderLeftNavbar = (navbarProps: NavbarElementProps) => (
        <DatePickerNavbar
            {...navbarProps}
            hideRightNavButton={this.props.contiguousCalendarMonths}
            maxDate={this.props.maxDate}
            minDate={this.props.minDate}
        />
    );

    private renderRightNavbar = (navbarProps: NavbarElementProps) => (
        <DatePickerNavbar
            {...navbarProps}
            hideLeftNavButton={this.props.contiguousCalendarMonths}
            maxDate={this.props.maxDate}
            minDate={this.props.minDate}
        />
    );

    private renderSingleCaption = (captionProps: CaptionElementProps) => (
        <DatePickerCaption
            {...captionProps}
            maxDate={this.props.maxDate}
            minDate={this.props.minDate}
            onMonthChange={this.handleLeftMonthSelectChange}
            onYearChange={this.handleLeftYearSelectChange}
            reverseMonthAndYearMenus={this.props.reverseMonthAndYearMenus}
        />
    );

    private renderLeftCaption = (captionProps: CaptionElementProps) => (
        <DatePickerCaption
            {...captionProps}
            maxDate={DateUtils.getDatePreviousMonth(this.props.maxDate)}
            minDate={this.props.minDate}
            onMonthChange={this.handleLeftMonthSelectChange}
            onYearChange={this.handleLeftYearSelectChange}
            reverseMonthAndYearMenus={this.props.reverseMonthAndYearMenus}
        />
    );

    private renderRightCaption = (captionProps: CaptionElementProps) => (
        <DatePickerCaption
            {...captionProps}
            maxDate={this.props.maxDate}
            minDate={DateUtils.getDateNextMonth(this.props.minDate)}
            onMonthChange={this.handleRightMonthSelectChange}
            onYearChange={this.handleRightYearSelectChange}
            reverseMonthAndYearMenus={this.props.reverseMonthAndYearMenus}
        />
    );

    private handleDayMouseEnter = (day: Date, modifiers: DayModifiers, e: React.MouseEvent<HTMLDivElement>) => {
        Utils.safeInvoke(this.props.dayPickerProps.onDayMouseEnter, day, modifiers, e);

        if (modifiers.disabled) {
            return;
        }
        const { dateRange, boundary } = DateRangeSelectionStrategy.getNextState(
            this.state.value,
            day,
            this.props.allowSingleDayRange,
            this.props.boundaryToModify,
        );
        this.setState({ hoverValue: dateRange });
        Utils.safeInvoke(this.props.onHoverChange, dateRange, day, boundary);
    };

    private handleDayMouseLeave = (day: Date, modifiers: DayModifiers, e: React.MouseEvent<HTMLDivElement>) => {
        Utils.safeInvoke(this.props.dayPickerProps.onDayMouseLeave, day, modifiers, e);
        if (modifiers.disabled) {
            return;
        }
        this.setState({ hoverValue: undefined });
        Utils.safeInvoke(this.props.onHoverChange, undefined, day, undefined);
    };

    private handleDayClick = (day: Date, modifiers: DayModifiers, e: React.MouseEvent<HTMLDivElement>) => {
        Utils.safeInvoke(this.props.dayPickerProps.onDayClick, day, modifiers, e);

        if (modifiers.disabled) {
            // rerender base component to get around bug where you can navigate past bounds by clicking days
            this.forceUpdate();
            return;
        }

        const nextValue = DateRangeSelectionStrategy.getNextState(
            this.state.value,
            day,
            this.props.allowSingleDayRange,
            this.props.boundaryToModify,
        ).dateRange;

        // update the hovered date range after click to show the newly selected
        // state, at leasts until the mouse moves again
        this.handleDayMouseEnter(day, modifiers, e);

        this.handleNextState(nextValue);
    };

    private handleShortcutClick = (shortcut: IDateRangeShortcut, selectedShortcutIndex: number) => {
        const { onChange, contiguousCalendarMonths, onShortcutChange } = this.props;
        const { dateRange, includeTime } = shortcut;
        if (includeTime) {
            const newDateRange: DateRange = [dateRange[0], dateRange[1]];
            const newTimeRange: DateRange = [dateRange[0], dateRange[1]];
            const nextState = getStateChange(this.state.value, dateRange, this.state, contiguousCalendarMonths);
            this.setState({ ...nextState, time: newTimeRange });
            Utils.safeInvoke(onChange, newDateRange);
        } else {
            this.handleNextState(dateRange);
        }

        if (this.props.selectedShortcutIndex === undefined) {
            this.setState({ selectedShortcutIndex });
        }

        Utils.safeInvoke(onShortcutChange, shortcut, selectedShortcutIndex);
    };

    private handleNextState = (nextValue: DateRange) => {
        const { value } = this.state;
        nextValue[0] = DateUtils.getDateTime(nextValue[0], this.state.time[0]);
        nextValue[1] = DateUtils.getDateTime(nextValue[1], this.state.time[1]);

        const nextState = getStateChange(value, nextValue, this.state, this.props.contiguousCalendarMonths);

        if (this.props.value == null) {
            this.setState(nextState);
        }
        Utils.safeInvoke(this.props.onChange, nextValue);
    };

    private handleLeftMonthChange = (newDate: Date) => {
        const leftView = MonthAndYear.fromDate(newDate);
        Utils.safeInvoke(this.props.dayPickerProps.onMonthChange, leftView.getFullDate());
        this.updateLeftView(leftView);
    };

    private handleRightMonthChange = (newDate: Date) => {
        const rightView = MonthAndYear.fromDate(newDate);
        Utils.safeInvoke(this.props.dayPickerProps.onMonthChange, rightView.getFullDate());
        this.updateRightView(rightView);
    };

    private handleLeftMonthSelectChange = (leftMonth: number) => {
        const leftView = new MonthAndYear(leftMonth, this.state.leftView.getYear());
        Utils.safeInvoke(this.props.dayPickerProps.onMonthChange, leftView.getFullDate());
        this.updateLeftView(leftView);
    };

    private handleRightMonthSelectChange = (rightMonth: number) => {
        const rightView = new MonthAndYear(rightMonth, this.state.rightView.getYear());
        Utils.safeInvoke(this.props.dayPickerProps.onMonthChange, rightView.getFullDate());
        this.updateRightView(rightView);
    };

    private updateLeftView(leftView: MonthAndYear) {
        let rightView = this.state.rightView.clone();
        if (!leftView.isBefore(rightView) || this.props.contiguousCalendarMonths) {
            rightView = leftView.getNextMonth();
        }
        this.setViews(leftView, rightView);
    }

    private updateRightView(rightView: MonthAndYear) {
        let leftView = this.state.leftView.clone();
        if (!rightView.isAfter(leftView) || this.props.contiguousCalendarMonths) {
            leftView = rightView.getPreviousMonth();
        }
        this.setViews(leftView, rightView);
    }

    /*
     * The min / max months are offset by one because we are showing two months.
     * We do a comparison check to see if
     *   a) the proposed [Month, Year] change throws the two calendars out of order
     *   b) the proposed [Month, Year] goes beyond the min / max months
     * and rectify appropriately.
     */
    private handleLeftYearSelectChange = (leftDisplayYear: number) => {
        let leftView = new MonthAndYear(this.state.leftView.getMonth(), leftDisplayYear);
        Utils.safeInvoke(this.props.dayPickerProps.onMonthChange, leftView.getFullDate());
        const { minDate, maxDate } = this.props;
        const adjustedMaxDate = DateUtils.getDatePreviousMonth(maxDate);

        const minMonthAndYear = new MonthAndYear(minDate.getMonth(), minDate.getFullYear());
        const maxMonthAndYear = new MonthAndYear(adjustedMaxDate.getMonth(), adjustedMaxDate.getFullYear());

        if (leftView.isBefore(minMonthAndYear)) {
            leftView = minMonthAndYear;
        } else if (leftView.isAfter(maxMonthAndYear)) {
            leftView = maxMonthAndYear;
        }

        let rightView = this.state.rightView.clone();
        if (!leftView.isBefore(rightView) || this.props.contiguousCalendarMonths) {
            rightView = leftView.getNextMonth();
        }

        this.setViews(leftView, rightView);
    };

    private handleRightYearSelectChange = (rightDisplayYear: number) => {
        let rightView = new MonthAndYear(this.state.rightView.getMonth(), rightDisplayYear);
        Utils.safeInvoke(this.props.dayPickerProps.onMonthChange, rightView.getFullDate());
        const { minDate, maxDate } = this.props;
        const adjustedMinDate = DateUtils.getDateNextMonth(minDate);

        const minMonthAndYear = MonthAndYear.fromDate(adjustedMinDate);
        const maxMonthAndYear = MonthAndYear.fromDate(maxDate);

        if (rightView.isBefore(minMonthAndYear)) {
            rightView = minMonthAndYear;
        } else if (rightView.isAfter(maxMonthAndYear)) {
            rightView = maxMonthAndYear;
        }

        let leftView = this.state.leftView.clone();
        if (!rightView.isAfter(leftView) || this.props.contiguousCalendarMonths) {
            leftView = rightView.getPreviousMonth();
        }

        this.setViews(leftView, rightView);
    };

    private setViews(leftView: MonthAndYear, rightView: MonthAndYear) {
        this.setState({ leftView, rightView });
    }
}

function getStateChange(
    value: DateRange,
    nextValue: DateRange,
    state: IDateRangePickerState,
    contiguousCalendarMonths: boolean,
): IDateRangePickerState {
    if (value != null && nextValue == null) {
        return { value: [null, null] };
    } else if (nextValue != null) {
        let leftView = state.leftView.clone();
        let rightView = state.rightView.clone();

        const nextValueStartView = MonthAndYear.fromDate(nextValue[0]);
        const nextValueEndView = MonthAndYear.fromDate(nextValue[1]);

        // Only end date selected.
        // If the newly selected end date isn't in either of the displayed months, then
        //   - set the right DayPicker to the month of the selected end date
        //   - ensure the left DayPicker is before the right, changing if needed
        if (nextValueStartView == null && nextValueEndView != null) {
            if (!nextValueEndView.isSame(leftView) && !nextValueEndView.isSame(rightView)) {
                rightView = nextValueEndView;
                if (!leftView.isBefore(rightView)) {
                    leftView = rightView.getPreviousMonth();
                }
            }
        } else if (nextValueStartView != null && nextValueEndView == null) {
            // Only start date selected.
            // If the newly selected start date isn't in either of the displayed months, then
            //   - set the left DayPicker to the month of the selected start date
            //   - ensure the right DayPicker is before the left, changing if needed
            if (!nextValueStartView.isSame(leftView) && !nextValueStartView.isSame(rightView)) {
                leftView = nextValueStartView;
                if (!rightView.isAfter(leftView)) {
                    rightView = leftView.getNextMonth();
                }
            }
        } else if (nextValueStartView != null && nextValueEndView != null) {
            // Both start and end date months are identical
            // If the selected month isn't in either of the displayed months, then
            //   - set the left DayPicker to be the selected month
            //   - set the right DayPicker to +1
            if (nextValueStartView.isSameMonth(nextValueEndView)) {
                if (leftView.isSame(nextValueStartView) || rightView.isSame(nextValueStartView)) {
                    // do nothing
                } else {
                    leftView = nextValueStartView;
                    rightView = nextValueStartView.getNextMonth();
                }
            } else {
                // Different start and end date months, adjust display months.
                if (!leftView.isSame(nextValueStartView)) {
                    leftView = nextValueStartView;
                    rightView = nextValueStartView.getNextMonth();
                }
                if (contiguousCalendarMonths === false && !rightView.isSame(nextValueEndView)) {
                    rightView = nextValueEndView;
                }
            }
        }

        return {
            leftView,
            rightView,
            value: nextValue,
        };
    } else if (contiguousCalendarMonths === true) {
        // contiguousCalendarMonths is toggled on.
        // If the previous leftView and rightView are not contiguous, then set the right DayPicker to left + 1
        if (!state.leftView.getNextMonth().isSameMonth(state.rightView)) {
            const nextRightView = state.leftView.getNextMonth();
            return { rightView: nextRightView };
        }
    }

    return {};
}

function getInitialValue(props: IDateRangePickerProps): DateRange | null {
    if (props.value != null) {
        return props.value;
    }
    if (props.defaultValue != null) {
        return props.defaultValue;
    }
    return [null, null];
}

function getInitialMonth(props: IDateRangePickerProps, value: DateRange): Date {
    const today = new Date();
    // != because we must have a real `Date` to begin the calendar on.
    if (props.initialMonth != null) {
        return props.initialMonth;
    } else if (value[0] != null) {
        return DateUtils.clone(value[0]);
    } else if (value[1] != null) {
        const month = DateUtils.clone(value[1]);
        if (!DateUtils.areSameMonth(month, props.minDate)) {
            month.setMonth(month.getMonth() - 1);
        }
        return month;
    } else if (DateUtils.isDayInRange(today, [props.minDate, props.maxDate])) {
        return today;
    } else {
        return DateUtils.getDateBetween([props.minDate, props.maxDate]);
    }
}
