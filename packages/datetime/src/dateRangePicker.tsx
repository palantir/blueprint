/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { AbstractComponent, Classes, IProps, Menu, MenuItem, Utils } from "@blueprintjs/core";
import * as classNames from "classnames";
import * as React from "react";
import * as DayPicker from "react-day-picker";

import * as DateClasses from "./common/classes";
import * as DateUtils from "./common/dateUtils";
import { DateRange, DateRangeBoundary } from "./common/dateUtils";
import * as Errors from "./common/errors";
import { MonthAndYear } from "./common/monthAndYear";

import { DatePickerCaption } from "./datePickerCaption";
import {
    combineModifiers,
    getDefaultMaxDate,
    getDefaultMinDate,
    HOVERED_RANGE_MODIFIER,
    IDatePickerBaseProps,
    IDatePickerDayModifiers,
    IDatePickerModifiers,
    SELECTED_RANGE_MODIFIER,
} from "./datePickerCore";

export interface IDateRangeShortcut {
    label: string;
    dateRange: DateRange;
}

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
    boundaryToModify?: DateRangeBoundary;

    /**
     * Initial `DateRange` the calendar will display as selected.
     * This should not be set if `value` is set.
     */
    defaultValue?: DateRange;

    /**
     * Whether displayed months in the calendar are contiguous.
     * If false, each side of the calendar can move independently to non-contiguous months.
     * @default true
     */
    contiguousCalendarMonths?: boolean;

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
    onHoverChange?: (hoveredDates: DateRange) => void;

    /**
     * Whether shortcuts to quickly select a range of dates are displayed or not.
     * If `true`, preset shortcuts will be displayed.
     * If `false`, no shortcuts will be displayed.
     * If an array is provided, the custom shortcuts will be displayed.
     * @default true
     */
    shortcuts?: boolean | IDateRangeShortcut[];

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
}

export class DateRangePicker
    extends AbstractComponent<IDateRangePickerProps, IDateRangePickerState> {

    public static defaultProps: IDateRangePickerProps = {
        allowSingleDayRange: false,
        contiguousCalendarMonths: true,
        maxDate: getDefaultMaxDate(),
        minDate: getDefaultMinDate(),
        shortcuts: true,
    };

    public displayName = "Blueprint.DateRangePicker";

    private get isControlled() {
        return this.props.value != null;
    }

    // these will get merged with the user's own
    private modifiers: IDatePickerModifiers = {
        [SELECTED_RANGE_MODIFIER]: (day) => {
            const { value } = this.state;
            return value[0] != null && value[1] != null && DateUtils.isDayInRange(day, value, true);
        },
        [`${SELECTED_RANGE_MODIFIER}-start`]: (day) => DateUtils.areSameDay(this.state.value[0], day),
        [`${SELECTED_RANGE_MODIFIER}-end`]: (day) => DateUtils.areSameDay(this.state.value[1], day),

        [HOVERED_RANGE_MODIFIER]: (day: Date) => {
            const { hoverValue, value } = this.state;
            const [selectedStart, selectedEnd] = value;
            if (selectedStart == null && selectedEnd == null) {
                return false;
            }
            if (hoverValue == null || hoverValue[0] == null || hoverValue[1] == null) {
                return false;
            }
            return DateUtils.isDayInRange(day, hoverValue, true);
        },
        [`${HOVERED_RANGE_MODIFIER}-start`]: (day: Date) => {
            const { hoverValue } = this.state;
            if (hoverValue == null ||  hoverValue[0] == null) {
                return false;
            }
            return DateUtils.areSameDay(hoverValue[0], day);
        },
        [`${HOVERED_RANGE_MODIFIER}-end`]: (day: Date) => {
            const { hoverValue } = this.state;
            if (hoverValue == null || hoverValue[1] == null) {
                return false;
            }
            return DateUtils.areSameDay(hoverValue[1], day);
        },
    };

    // these will get passed directly to DayPicker
    private states = {
        disabledDays: (day: Date) => !DateUtils.isDayInRange(day, [this.props.minDate, this.props.maxDate]),
        selectedDays: (day: Date) => {
            const [start, end] = this.state.value;
            return DateUtils.areSameDay(start, day) || DateUtils.areSameDay(end, day);
        },
    };

    public constructor(props?: IDateRangePickerProps, context?: any) {
        super(props, context);

        let value: DateRange = [null, null];
        if (props.value != null) {
            value = props.value;
        } else if (props.defaultValue != null) {
            value = props.defaultValue;
        }

        let initialMonth: Date;
        const today = new Date();

        if (props.initialMonth != null) {
            initialMonth = props.initialMonth;
        } else if (value[0] != null) {
            initialMonth = DateUtils.clone(value[0]);
        } else if (DateUtils.isDayInRange(today, [props.minDate, props.maxDate])) {
            initialMonth = today;
        } else {
            initialMonth = DateUtils.getDateBetween([props.minDate, props.maxDate]);
        }

        /*
        * if the initial month is the last month of the picker's
        * allowable range, the react-day-picker library will show
        * the max month on the left and the *min* month on the right.
        * subtracting one avoids that weird, wraparound state (#289).
        */
        const initialMonthEqualsMinMonth = DateUtils.areSameMonth(initialMonth, props.minDate);
        const initalMonthEqualsMaxMonth = DateUtils.areSameMonth(initialMonth, props.maxDate);
        if (!initialMonthEqualsMinMonth && initalMonthEqualsMaxMonth) {
            initialMonth.setMonth(initialMonth.getMonth() - 1);
        }

        const leftView = new MonthAndYear(initialMonth.getMonth(), initialMonth.getFullYear());
        const rightView = leftView.getNextMonth();
        this.state = { leftView, rightView, value, hoverValue: [null, null] };
    }

    public render() {
        const modifiers = combineModifiers(this.modifiers, this.props.modifiers);
        const { className, contiguousCalendarMonths, locale, localeUtils, maxDate, minDate } = this.props;
        const isShowingOneMonth = DateUtils.areSameMonth(this.props.minDate, this.props.maxDate);

        const { leftView, rightView } = this.state;
        const { disabledDays, selectedDays } = this.states;

        if (contiguousCalendarMonths || isShowingOneMonth) {
            const classes = classNames(DateClasses.DATEPICKER, DateClasses.DATERANGEPICKER, className, {
                [DateClasses.DATERANGEPICKER_CONTIGUOUS]: contiguousCalendarMonths,
                [DateClasses.DATERANGEPICKER_SINGLE_MONTH]: isShowingOneMonth,
            });
            // use the left DayPicker when we only need one
            return (
                <div className={classes}>
                    {this.maybeRenderShortcuts()}
                    <DayPicker
                        captionElement={this.renderSingleCaption()}
                        disabledDays={disabledDays}
                        fromMonth={minDate}
                        initialMonth={leftView.getFullDate()}
                        locale={locale}
                        localeUtils={localeUtils}
                        modifiers={modifiers}
                        numberOfMonths={isShowingOneMonth ? 1 : 2}
                        onDayClick={this.handleDayClick}
                        onDayMouseEnter={this.handleDayMouseEnter}
                        onDayMouseLeave={this.handleDayMouseLeave}
                        onMonthChange={this.handleLeftMonthChange}
                        selectedDays={selectedDays}
                        toMonth={maxDate}
                    />
                </div>
            );
        } else {
            return (
                <div className={classNames(DateClasses.DATEPICKER, DateClasses.DATERANGEPICKER, className)}>
                    {this.maybeRenderShortcuts()}
                    <DayPicker
                        canChangeMonth={true}
                        captionElement={this.renderLeftCaption()}
                        disabledDays={disabledDays}
                        fromMonth={minDate}
                        initialMonth={leftView.getFullDate()}
                        locale={locale}
                        localeUtils={localeUtils}
                        modifiers={modifiers}
                        onDayClick={this.handleDayClick}
                        onMonthChange={this.handleLeftMonthChange}
                        selectedDays={selectedDays}
                        toMonth={DateUtils.getDatePreviousMonth(maxDate)}
                    />
                    <DayPicker
                        canChangeMonth={true}
                        captionElement={this.renderRightCaption()}
                        disabledDays={disabledDays}
                        fromMonth={DateUtils.getDateNextMonth(minDate)}
                        initialMonth={rightView.getFullDate()}
                        locale={locale}
                        localeUtils={localeUtils}
                        modifiers={modifiers}
                        onDayClick={this.handleDayClick}
                        onMonthChange={this.handleRightMonthChange}
                        selectedDays={selectedDays}
                        toMonth={maxDate}
                    />
                </div>
            );
        }
    }

    public componentWillReceiveProps(nextProps: IDateRangePickerProps) {
        super.componentWillReceiveProps(nextProps);

        const nextState = getStateChange(this.props.value, nextProps.value, this.state);
        this.setState(nextState);
    }

    protected validateProps(props: IDateRangePickerProps) {
        const {
            defaultValue,
            initialMonth,
            maxDate,
            minDate,
            boundaryToModify,
            value,
        } = props;
        const dateRange: DateRange = [minDate, maxDate];

        if (defaultValue != null && !DateUtils.isDayRangeInRange(defaultValue, dateRange)) {
            throw new Error(Errors.DATERANGEPICKER_DEFAULT_VALUE_INVALID);
        }

        if (initialMonth != null && !DateUtils.isMonthInRange(initialMonth, dateRange)) {
            throw new Error(Errors.DATERANGEPICKER_INITIAL_MONTH_INVALID);
        }

        if (maxDate != null
                && minDate != null
                && maxDate < minDate
                && !DateUtils.areSameDay(maxDate, minDate)) {
            throw new Error(Errors.DATERANGEPICKER_MAX_DATE_INVALID);
        }

        if (value != null && !DateUtils.isDayRangeInRange(value, dateRange)) {
            throw new Error(Errors.DATERANGEPICKER_VALUE_INVALID);
        }

        if (boundaryToModify != null
            && boundaryToModify !== DateRangeBoundary.START
            && boundaryToModify !== DateRangeBoundary.END) {
            throw new Error(Errors.DATERANGEPICKER_PREFERRED_BOUNDARY_TO_MODIFY_INVALID);
        }
    }

    private maybeRenderShortcuts() {
        const propsShortcuts = this.props.shortcuts;
        if (propsShortcuts == null || propsShortcuts === false) {
            return undefined;
        }

        const shortcuts = typeof propsShortcuts === "boolean" ? createDefaultShortcuts() : propsShortcuts;
        const shortcutElements = shortcuts.map((s, i) => (
            <MenuItem
                className={Classes.POPOVER_DISMISS_OVERRIDE}
                key={i}
                onClick={this.getShorcutClickHandler(s.dateRange)}
                text={s.label}
            />
        ));

        return (
            <Menu className={DateClasses.DATERANGEPICKER_SHORTCUTS}>
                {shortcutElements}
            </Menu>
        );
    }

    private renderSingleCaption() {
        const { maxDate, minDate } = this.props;
        return (
            <DatePickerCaption
                maxDate={maxDate}
                minDate={minDate}
                onMonthChange={this.handleLeftMonthSelectChange}
                onYearChange={this.handleLeftYearSelectChange}
            />
        );
    }

    private renderLeftCaption() {
        const { maxDate, minDate } = this.props;
        return (
            <DatePickerCaption
                maxDate={DateUtils.getDatePreviousMonth(maxDate)}
                minDate={minDate}
                onMonthChange={this.handleLeftMonthSelectChange}
                onYearChange={this.handleLeftYearSelectChange}
            />
        );
    }

    private renderRightCaption() {
        const { maxDate, minDate } = this.props;
        return (
            <DatePickerCaption
                maxDate={maxDate}
                minDate={DateUtils.getDateNextMonth(minDate)}
                onMonthChange={this.handleRightMonthSelectChange}
                onYearChange={this.handleRightYearSelectChange}
            />
        );
    }

    private handleDayMouseEnter =
        (_e: React.SyntheticEvent<HTMLElement>, day: Date, modifiers: IDatePickerDayModifiers) => {

        if (modifiers.disabled) {
            return;
        }
        const nextHoverValue = this.getNextValue(this.state.value, day);
        this.setState({ hoverValue: nextHoverValue });
        Utils.safeInvoke(this.props.onHoverChange, nextHoverValue);
    }

    private handleDayMouseLeave =
        (_e: React.SyntheticEvent<HTMLElement>, _day: Date, modifiers: IDatePickerDayModifiers) => {

        if (modifiers.disabled) {
            return;
        }
        const nextHoverValue = undefined as DateRange;
        this.setState({ hoverValue: nextHoverValue });
        Utils.safeInvoke(this.props.onHoverChange, nextHoverValue);
    }

    private handleDayClick = (e: React.SyntheticEvent<HTMLElement>, day: Date, modifiers: IDatePickerDayModifiers) => {
        if (modifiers.disabled) {
            // rerender base component to get around bug where you can navigate past bounds by clicking days
            this.forceUpdate();
            return;
        }

        const nextValue = this.getNextValue(this.state.value, day);

        // update the hovered date range after click to show the newly selected
        // state, at leasts until the mouse moves again
        this.handleDayMouseEnter(e, day, modifiers);

        this.handleNextState(nextValue);
    }

    private getNextValue(currentRange: DateRange, day: Date) {
        const [start, end] = currentRange;
        let nextValue: DateRange;

        const { allowSingleDayRange } = this.props;

        // rename for conciseness
        const boundary = this.props.boundaryToModify;

        if (boundary != null) {
            const boundaryDate = (boundary === DateRangeBoundary.START) ? start : end;
            const otherBoundaryDate = (boundary === DateRangeBoundary.START) ? end : start;

            if (boundaryDate == null && otherBoundaryDate == null) {
                nextValue = this.createRangeForBoundary(day, null, boundary);
            } else if (boundaryDate != null && otherBoundaryDate == null) {
                const nextBoundaryDate = DateUtils.areSameDay(boundaryDate, day) ? null : day;
                nextValue = this.createRangeForBoundary(nextBoundaryDate, null, boundary);
            } else if (boundaryDate == null && otherBoundaryDate != null) {
                if (DateUtils.areSameDay(day, otherBoundaryDate)) {
                    const nextOtherBoundaryDate = allowSingleDayRange ? otherBoundaryDate : null;
                    nextValue = this.createRangeForBoundary(day, nextOtherBoundaryDate, boundary);
                } else if (this.isDateOverlappingOtherBoundary(day, otherBoundaryDate, boundary)) {
                    nextValue = this.createRangeForBoundary(otherBoundaryDate, day, boundary);
                } else {
                    nextValue = this.createRangeForBoundary(day, otherBoundaryDate, boundary);
                }
            } else {
                // both boundaryDate and otherBoundaryDate are already defined
                if (DateUtils.areSameDay(boundaryDate, day)) {
                    const isSingleDayRangeSelected = DateUtils.areSameDay(boundaryDate, otherBoundaryDate);
                    const nextOtherBoundaryDate = isSingleDayRangeSelected ? null : otherBoundaryDate;
                    nextValue = this.createRangeForBoundary(null, nextOtherBoundaryDate, boundary);
                } else if (DateUtils.areSameDay(day, otherBoundaryDate)) {
                    const nextOtherBoundaryDate = (allowSingleDayRange) ? otherBoundaryDate : null;
                    nextValue = this.createRangeForBoundary(day, nextOtherBoundaryDate, boundary);
                } else if (this.isDateOverlappingOtherBoundary(day, otherBoundaryDate, boundary)) {
                    nextValue = this.createRangeForBoundary(day, null, boundary);
                } else {
                    // extend the date range with an earlier boundaryDate date
                    nextValue = this.createRangeForBoundary(day, otherBoundaryDate, boundary);
                }
            }
        } else {
            if (start == null && end == null) {
                nextValue = [day, null];
            } else if (start != null && end == null) {
                nextValue = this.createRange(day, start);
            } else if (start == null && end != null) {
                nextValue = this.createRange(day, end);
            } else {
                const isStart = DateUtils.areSameDay(start, day);
                const isEnd = DateUtils.areSameDay(end, day);
                if (isStart && isEnd) {
                    nextValue = [null, null];
                } else if (isStart) {
                    nextValue = [null, end];
                } else if (isEnd) {
                    nextValue = [start, null];
                } else {
                    nextValue = [day, null];
                }
            }
        }

        return nextValue;
    }

    private isDateOverlappingOtherBoundary(date: Date, otherBoundaryDate: Date, boundary: DateRangeBoundary) {
        return (boundary === DateRangeBoundary.START)
            ? date > otherBoundaryDate
            : date < otherBoundaryDate;
    }

    private createRangeForBoundary(boundaryDate: Date, otherBoundaryDate: Date, boundary: DateRangeBoundary) {
        if (boundary === DateRangeBoundary.START) {
            return [boundaryDate, otherBoundaryDate] as DateRange;
        } else if (boundary === DateRangeBoundary.END) {
            return [otherBoundaryDate, boundaryDate] as DateRange;
        } else {
            return this.createRange(boundaryDate, otherBoundaryDate);
        }
    }

    private createRange(a: Date, b: Date): DateRange {
        // clicking the same date again will clear it
        if (!this.props.allowSingleDayRange && DateUtils.areSameDay(a, b)) {
            return [null, null];
        }
        return a < b ? [a, b] : [b, a];
    }

    private getShorcutClickHandler(nextValue: DateRange) {
        return () => this.handleNextState(nextValue);
    }

    private handleNextState(nextValue: DateRange) {
        const { value } = this.state;
        const nextState = getStateChange(value, nextValue, this.state);

        if (!this.isControlled) {
            this.setState(nextState);
        }

        Utils.safeInvoke(this.props.onChange, nextValue);
    }

    private handleLeftMonthChange = (newDate: Date) => {
        const leftView = new MonthAndYear(newDate.getMonth(), newDate.getFullYear());
        this.updateLeftView(leftView);
    }

    private handleRightMonthChange = (newDate: Date) => {
        const rightView = new MonthAndYear(newDate.getMonth(), newDate.getFullYear());
        this.updateRightView(rightView);
    }

    private handleLeftMonthSelectChange = (leftMonth: number) => {
        const leftView = new MonthAndYear(leftMonth, this.state.leftView.getYear());
        this.updateLeftView(leftView);
    }

    private handleRightMonthSelectChange = (rightMonth: number) => {
        const rightView = new MonthAndYear(rightMonth, this.state.rightView.getYear());
        this.updateRightView(rightView);
    }

    private updateLeftView(leftView: MonthAndYear) {
        let rightView = this.state.rightView.clone();
        if (!leftView.isBefore(rightView)) {
            rightView = leftView.getNextMonth();
        }
        this.setViews(leftView, rightView);
    }

    private updateRightView(rightView: MonthAndYear) {
        let leftView = this.state.leftView.clone();
        if (!rightView.isAfter(leftView)) {
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
        if (!leftView.isBefore(rightView)) {
            rightView = leftView.getNextMonth();
        }

        this.setViews(leftView, rightView);
    }

    private handleRightYearSelectChange = (rightDisplayYear: number) => {
        let rightView = new MonthAndYear(this.state.rightView.getMonth(), rightDisplayYear);
        const { minDate, maxDate } = this.props;
        const adjustedMinDate = DateUtils.getDateNextMonth(minDate);

        const minMonthAndYear = new MonthAndYear(adjustedMinDate.getMonth(), adjustedMinDate.getFullYear());
        const maxMonthAndYear = new MonthAndYear(maxDate.getMonth(), maxDate.getFullYear());

        if (rightView.isBefore(minMonthAndYear)) {
            rightView = minMonthAndYear;
        } else if (rightView.isAfter(maxMonthAndYear)) {
            rightView = maxMonthAndYear;
        }

        let leftView = this.state.leftView.clone();
        if (!rightView.isAfter(leftView)) {
            leftView = rightView.getPreviousMonth();
        }

        this.setViews(leftView, rightView);
    }

    private setViews(leftView: MonthAndYear, rightView: MonthAndYear) {
        this.setState({ leftView, rightView });
    }
}

function getStateChange(value: DateRange,
                        nextValue: DateRange,
                        state: IDateRangePickerState): IDateRangePickerState {
    let returnVal: IDateRangePickerState;

    if (value != null && nextValue == null) {
        returnVal = { value: [null, null] };
    } else if (nextValue != null) {
        const [nextValueStart, nextValueEnd] = nextValue;

        let leftView = state.leftView.clone();
        let rightView = state.rightView.clone();

        /*
        * Only end date selected.
        * If the newly selected end date isn't in either of the displayed months, then
        *   - set the right DayPicker to the month of the selected end date
        *   - ensure the left DayPicker is before the right, changing if needed
        */
        if (nextValueStart == null && nextValueEnd != null) {
            const nextValueEndMonthAndYear = new MonthAndYear(nextValueEnd.getMonth(), nextValueEnd.getFullYear());

            if (!nextValueEndMonthAndYear.isSame(leftView) && !nextValueEndMonthAndYear.isSame(rightView)) {
                rightView = nextValueEndMonthAndYear;
                if (!leftView.isBefore(rightView)) {
                    leftView = rightView.getPreviousMonth();
                }
            }
        /*
        * Only start date selected.
        * If the newly selected start date isn't in either of the displayed months, then
        *   - set the left DayPicker to the month of the selected start date
        *   - ensure the right DayPicker is before the left, changing if needed
        */
        } else if (nextValueStart != null && nextValueEnd == null) {
            const nextValueStartMonthAndYear =
                new MonthAndYear(nextValueStart.getMonth(), nextValueStart.getFullYear());

            if (!nextValueStartMonthAndYear.isSame(leftView) && !nextValueStartMonthAndYear.isSame(rightView)) {
                leftView = nextValueStartMonthAndYear;
                if (!rightView.isAfter(leftView)) {
                    rightView = leftView.getNextMonth();
                }
            }
        /*
        * Both start date and end date selected.
        */
        } else if (nextValueStart != null && nextValueEnd != null) {
            const nextValueStartMonthAndYear =
                new MonthAndYear(nextValueStart.getMonth(), nextValueStart.getFullYear());
            const nextValueEndMonthAndYear =
                new MonthAndYear(nextValueEnd.getMonth(), nextValueEnd.getFullYear());

            /*
            * Both start and end date months are identical
            * If the selected month isn't in either of the displayed months, then
            *   - set the left DayPicker to be the selected month
            *   - set the right DayPicker to +1
            */
            if (DateUtils.areSameMonth(nextValueStart, nextValueEnd)) {
                const potentialLeftEqualsNextValueStart = leftView.isSame(nextValueStartMonthAndYear);
                const potentialRightEqualsNextValueStart = rightView.isSame(nextValueStartMonthAndYear);

                if (potentialLeftEqualsNextValueStart || potentialRightEqualsNextValueStart) {
                    // do nothing
                } else {
                    leftView = nextValueStartMonthAndYear;
                    rightView = nextValueStartMonthAndYear.getNextMonth();
                }
            /*
            * Different start and end date months, adjust display months.
            */
            } else {
                if (!leftView.isSame(nextValueStartMonthAndYear)) {
                    leftView = nextValueStartMonthAndYear;
                    rightView = nextValueStartMonthAndYear.getNextMonth();
                } else if (!rightView.isSame(nextValueEndMonthAndYear)) {
                    rightView = nextValueEndMonthAndYear;
                    if (!rightView.isAfter(leftView)) {
                        leftView = rightView.getPreviousMonth();
                    }
                }
            }
        }

        returnVal = {
            leftView,
            rightView,
            value: nextValue,
        };
    } else {
        returnVal = {};
    }

    return returnVal;
}

function createShortcut(label: string, dateRange: DateRange): IDateRangeShortcut {
    return { dateRange, label };
}

function createDefaultShortcuts() {
    const today = new Date();
    const makeDate = (action: (d: Date) => void) => {
        const returnVal = DateUtils.clone(today);
        action(returnVal);
        returnVal.setDate(returnVal.getDate() + 1);
        return returnVal;
    };

    const oneWeekAgo = makeDate((d) => d.setDate(d.getDate() - 7));
    const oneMonthAgo = makeDate((d) => d.setMonth(d.getMonth() - 1));
    const threeMonthsAgo = makeDate((d) => d.setMonth(d.getMonth() - 3));
    const sixMonthsAgo = makeDate((d) => d.setMonth(d.getMonth() - 6));
    const oneYearAgo = makeDate((d) => d.setFullYear(d.getFullYear() - 1));
    const twoYearsAgo = makeDate((d) => d.setFullYear(d.getFullYear() - 2));

    return [
        createShortcut("Past week", [oneWeekAgo, today]),
        createShortcut("Past month", [oneMonthAgo, today]),
        createShortcut("Past 3 months", [threeMonthsAgo, today]),
        createShortcut("Past 6 months", [sixMonthsAgo, today]),
        createShortcut("Past year", [oneYearAgo, today]),
        createShortcut("Past 2 years", [twoYearsAgo, today]),
    ];
}

export const DateRangePickerFactory = React.createFactory(DateRangePicker);
