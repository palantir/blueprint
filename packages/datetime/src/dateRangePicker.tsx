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
import { DateRange } from "./common/dateUtils";
import * as Errors from "./common/errors";
import { Months } from "./common/months";

import { DatePickerCaption } from "./datePickerCaption";
import {
    combineModifiers,
    getDefaultMaxDate,
    getDefaultMinDate,
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
     * Initial DateRange the calendar will display as selected.
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
     * Whether shortcuts to quickly select a range of dates are displayed or not.
     * If `true`, preset shortcuts will be displayed.
     * If `false`, no shortcuts will be displayed.
     * If an array, the custom shortcuts provided will be displayed.
     * @default true
     */
    shortcuts?: boolean | IDateRangeShortcut[];

    /**
     * The currently selected DateRange.
     * If this prop is present, the component acts in a controlled manner.
     */
    value?: DateRange;
}

export interface IDateRangePickerState {
    leftDisplayMonth?: number;
    leftDisplayYear?: number;
    rightDisplayMonth?: number;
    rightDisplayYear?: number;
    value?: DateRange;
}

export class DateRangePicker
    extends AbstractComponent<IDateRangePickerProps, IDateRangePickerState> {

    public static defaultProps: IDateRangePickerProps = {
        allowSingleDayRange: false,
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

        // if the initial month is the last month of the picker's
        // allowable range, the react-day-picker library will show
        // the max month on the left and the *min* month on the right.
        // subtracting one avoids that weird, wraparound state (#289).
        const initialMonthEqualsMinMonth = DateUtils.areSameMonth(initialMonth, props.minDate);
        const initalMonthEqualsMaxMonth = DateUtils.areSameMonth(initialMonth, props.maxDate);
        if (!initialMonthEqualsMinMonth && initalMonthEqualsMaxMonth) {
            initialMonth.setMonth(initialMonth.getMonth() - 1);
        }

        const [leftDisplayMonth, leftDisplayYear] = [initialMonth.getMonth(), initialMonth.getFullYear()];
        const [rightDisplayMonth, rightDisplayYear] = getNextMonth([leftDisplayMonth, leftDisplayYear]);

        this.state = {
            leftDisplayMonth,
            leftDisplayYear,
            rightDisplayMonth,
            rightDisplayYear,
            value,
        };
    }

    public render() {
        const modifiers = combineModifiers(this.modifiers, this.props.modifiers);
        const { className, locale, localeUtils, maxDate, minDate } = this.props;
        const isShowingOneMonth = DateUtils.areSameMonth(this.props.minDate, this.props.maxDate);
        const { leftDisplayMonth, leftDisplayYear, rightDisplayMonth, rightDisplayYear } = this.state;
        const { disabledDays, selectedDays } = this.states;

        if (isShowingOneMonth) {
            // use the left DatePicker when we only need one
            return (
                <div className={classNames(DateClasses.DATEPICKER, DateClasses.DATERANGEPICKER, className)}>
                    {this.maybeRenderShortcuts()}
                    <DayPicker
                        captionElement={this.renderOneMonthCaption()}
                        disabledDays={disabledDays}
                        fromMonth={minDate}
                        initialMonth={new Date(leftDisplayYear, leftDisplayMonth)}
                        locale={locale}
                        localeUtils={localeUtils}
                        modifiers={modifiers}
                        onDayClick={this.handleDayClick}
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
                        initialMonth={new Date(leftDisplayYear, leftDisplayMonth)}
                        locale={locale}
                        localeUtils={localeUtils}
                        modifiers={modifiers}
                        onDayClick={this.handleDayClick}
                        onMonthChange={this.handleLeftMonthChange}
                        selectedDays={selectedDays}
                        toMonth={getDatePreviousMonth(maxDate)}
                    />
                    <DayPicker
                        canChangeMonth={true}
                        captionElement={this.renderRightCaption()}
                        disabledDays={disabledDays}
                        fromMonth={getDateNextMonth(minDate)}
                        initialMonth={new Date(rightDisplayYear, rightDisplayMonth)}
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
        const { defaultValue, initialMonth, maxDate, minDate, value } = props;
        const dateRange: DateRange = [minDate, maxDate];

        if (defaultValue != null && !DateUtils.isDayRangeInRange(defaultValue, dateRange)) {
            throw new Error(Errors.DATERANGEPICKER_DEFAULT_VALUE_INVALID);
        }

        if (initialMonth != null && !DateUtils.isMonthInRange(initialMonth, dateRange)) {
            throw new Error(Errors.DATERANGEPICKER_INITIAL_MONTH_INVALID);
        }

        if (defaultValue != null && defaultValue[0] == null && defaultValue[1] != null
            || value != null && value[0] == null && value[1] != null) {
            throw new Error(Errors.DATERANGEPICKER_INVALID_DATE_RANGE);
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

    private renderOneMonthCaption() {
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
                maxDate={getDatePreviousMonth(maxDate)}
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
                minDate={getDateNextMonth(minDate)}
                onMonthChange={this.handleRightMonthSelectChange}
                onYearChange={this.handleRightYearSelectChange}
            />
        );
    }

    private handleDayClick = (_e: React.SyntheticEvent<HTMLElement>, day: Date, modifiers: IDatePickerDayModifiers) => {
        if (modifiers.disabled) {
            // rerender base component to get around bug where you can navigate past bounds by clicking days
            this.forceUpdate();
            return;
        }

        const [start, end] = this.state.value;
        let nextValue: DateRange;

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

        this.handleNextState(nextValue);
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
        const leftDisplay: DisplayMonth = [newDate.getMonth(), newDate.getFullYear()];
        this.updateLeftMonth(leftDisplay);
    }

    private handleRightMonthChange = (newDate: Date) => {
        const rightDisplay: DisplayMonth = [newDate.getMonth(), newDate.getFullYear()];
        this.updateRightMonth(rightDisplay);
    }

    private handleLeftMonthSelectChange = (leftDisplayMonth: number) => {
        this.updateLeftMonth([leftDisplayMonth, this.state.leftDisplayYear]);
    }

    private handleRightMonthSelectChange = (rightDisplayMonth: number) => {
        this.updateRightMonth([rightDisplayMonth, this.state.rightDisplayYear]);
    }

    private updateLeftMonth(leftDisplay: DisplayMonth) {
        let potentialRightDisplay: DisplayMonth = [this.state.rightDisplayMonth, this.state.rightDisplayYear];
        if (compareDisplayMonth(leftDisplay, potentialRightDisplay) !== DisplayMonthOrder.IN_ORDER) {
            potentialRightDisplay = getNextMonth(leftDisplay);
        }
        this.setDisplay(leftDisplay, potentialRightDisplay);
    }

    private updateRightMonth(rightDisplay: DisplayMonth) {
        let potentialLeftDisplay: DisplayMonth = [this.state.leftDisplayMonth, this.state.leftDisplayYear];
        if (compareDisplayMonth(potentialLeftDisplay, rightDisplay) !== DisplayMonthOrder.IN_ORDER) {
            potentialLeftDisplay = getPreviousMonth(rightDisplay);
        }
        this.setDisplay(potentialLeftDisplay, rightDisplay);
    }

    /*
    * The min / max months are offset by one because we are showing two months.
    * We do a comparison to check if
    *   a) the proposed [Month, Year] change throws the two calendars out of order
    *   b) the proposed [Month, Year] go beyond the min / max months
    */
    private handleLeftYearSelectChange = (leftDisplayYear: number) => {
        let potentialLeftDisplay: DisplayMonth = [this.state.leftDisplayMonth, leftDisplayYear];
        const { minDate, maxDate } = this.props;
        const adjustedMaxDate = getDatePreviousMonth(maxDate);

        const minDisplayMonth: DisplayMonth = [minDate.getMonth(), minDate.getFullYear()];
        const maxDisplayMonth: DisplayMonth = [adjustedMaxDate.getMonth(), adjustedMaxDate.getFullYear()];

        if (compareDisplayMonth(minDisplayMonth, potentialLeftDisplay) === DisplayMonthOrder.NOT_IN_ORDER) {
            potentialLeftDisplay = minDisplayMonth;
        } else if (compareDisplayMonth(potentialLeftDisplay, maxDisplayMonth) === DisplayMonthOrder.NOT_IN_ORDER) {
            potentialLeftDisplay = maxDisplayMonth;
        }

        let potentialRightDisplay: DisplayMonth = [this.state.rightDisplayMonth, this.state.rightDisplayYear];
        if (compareDisplayMonth(potentialLeftDisplay, potentialRightDisplay) !== DisplayMonthOrder.IN_ORDER) {
            potentialRightDisplay = getNextMonth(potentialLeftDisplay);
        }

        this.setDisplay(potentialLeftDisplay, potentialRightDisplay);
    }

    private handleRightYearSelectChange = (rightDisplayYear: number) => {
        let potentialRightDisplay: DisplayMonth = [this.state.rightDisplayMonth, rightDisplayYear];
        const { minDate, maxDate } = this.props;
        const adjustedMinDate = getDateNextMonth(minDate);

        const minDisplayMonth: DisplayMonth = [adjustedMinDate.getMonth(), adjustedMinDate.getFullYear()];
        const maxDisplayMonth: DisplayMonth = [maxDate.getMonth(), maxDate.getFullYear()];

        if (compareDisplayMonth(minDisplayMonth, potentialRightDisplay) === DisplayMonthOrder.NOT_IN_ORDER) {
            potentialRightDisplay = minDisplayMonth;
        } else if (compareDisplayMonth(potentialRightDisplay, maxDisplayMonth) === DisplayMonthOrder.NOT_IN_ORDER) {
            potentialRightDisplay = maxDisplayMonth;
        }

        let potentialLeftDisplay: DisplayMonth = [this.state.leftDisplayMonth, this.state.leftDisplayYear];
        if (compareDisplayMonth(potentialLeftDisplay, potentialRightDisplay) !== DisplayMonthOrder.IN_ORDER) {
            potentialLeftDisplay = getPreviousMonth(potentialRightDisplay);
        }

        this.setDisplay(potentialLeftDisplay, potentialRightDisplay);
    }

    private setDisplay(leftDisplay: DisplayMonth, rightDisplay: DisplayMonth) {
        this.setState({
            leftDisplayMonth: leftDisplay[0],
            leftDisplayYear: leftDisplay[1],
            rightDisplayMonth: rightDisplay[0],
            rightDisplayYear: rightDisplay[1],
        });
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

        let potentialLeftDisplay: DisplayMonth = [state.leftDisplayMonth, state.leftDisplayYear];
        let potentialRightDisplay: DisplayMonth = [state.rightDisplayMonth, state.rightDisplayYear];

        if (nextValueStart == null && nextValueEnd != null) {
            const nextValueEndMonthDisplay: DisplayMonth = [nextValueEnd.getMonth(), nextValueEnd.getFullYear()];

            const potentialLeftDisplayNotEqualsNextValueEnd =
                compareDisplayMonth(potentialLeftDisplay, nextValueEndMonthDisplay) !== DisplayMonthOrder.SAME;
            const potentialRightDisplayNotEqualsNextValueEnd =
                compareDisplayMonth(potentialRightDisplay, nextValueEndMonthDisplay) !== DisplayMonthOrder.SAME;

            if (potentialLeftDisplayNotEqualsNextValueEnd && potentialRightDisplayNotEqualsNextValueEnd) {
                potentialRightDisplay = [nextValueEnd.getMonth(), nextValueEnd.getFullYear()];
                if (compareDisplayMonth(potentialLeftDisplay, potentialRightDisplay) !== DisplayMonthOrder.IN_ORDER) {
                    potentialLeftDisplay = getPreviousMonth(potentialRightDisplay);
                }
            }
        } else if (nextValueStart != null && nextValueEnd == null) {
            const nextValueStartMonthDisplay: DisplayMonth = [nextValueStart.getMonth(), nextValueStart.getFullYear()];

            const potentialLeftDisplayNotEqualsNextValueStart =
                compareDisplayMonth(potentialLeftDisplay, nextValueStartMonthDisplay) !== DisplayMonthOrder.SAME;
            const potentialRightDisplayNotEqualsNextValueStart =
                compareDisplayMonth(potentialRightDisplay, nextValueStartMonthDisplay) !== DisplayMonthOrder.SAME;

            if (potentialLeftDisplayNotEqualsNextValueStart && potentialRightDisplayNotEqualsNextValueStart) {
                potentialLeftDisplay = [nextValueStart.getMonth(), nextValueStart.getFullYear()];
                if (compareDisplayMonth(potentialLeftDisplay, potentialRightDisplay) !== DisplayMonthOrder.IN_ORDER) {
                    potentialRightDisplay = getNextMonth(potentialLeftDisplay);
                }
            }
        } else if (nextValueStart != null && nextValueEnd != null) {
            const nextValueStartMonthDisplay: DisplayMonth = [nextValueStart.getMonth(), nextValueStart.getFullYear()];
            const nextValueEndMonthDisplay: DisplayMonth = [nextValueEnd.getMonth(), nextValueEnd.getFullYear()];

            if (DateUtils.areSameMonth(nextValueStart, nextValueEnd)) {
                const potentialLeftDisplayEqualsNextValueStart =
                    compareDisplayMonth(potentialLeftDisplay, nextValueStartMonthDisplay) === DisplayMonthOrder.SAME;
                const potentialRightDisplayEqualsNextValueStart =
                    compareDisplayMonth(potentialRightDisplay, nextValueStartMonthDisplay) === DisplayMonthOrder.SAME;

                if (potentialLeftDisplayEqualsNextValueStart || potentialRightDisplayEqualsNextValueStart) {
                    // do nothing
                } else {
                    potentialLeftDisplay = [nextValueStart.getMonth(), nextValueStart.getFullYear()];
                    potentialRightDisplay = getNextMonth(potentialLeftDisplay);
                }
            } else {
                if (compareDisplayMonth(potentialLeftDisplay, nextValueStartMonthDisplay) !== DisplayMonthOrder.SAME) {
                    potentialLeftDisplay = nextValueStartMonthDisplay;
                }
                if (compareDisplayMonth(potentialRightDisplay, nextValueEndMonthDisplay) !== DisplayMonthOrder.SAME) {
                    potentialRightDisplay = nextValueEndMonthDisplay;
                }
            }
        }

        returnVal = {
            leftDisplayMonth: potentialLeftDisplay[0],
            leftDisplayYear: potentialLeftDisplay[1],
            rightDisplayMonth: potentialRightDisplay[0],
            rightDisplayYear: potentialRightDisplay[1],
            value: nextValue,
        };
    } else {
        returnVal = {};
    }

    return returnVal;
}

type DisplayMonth = [number, number];

function getNextMonth([month, year]: DisplayMonth): DisplayMonth {
    return month === Months.DECEMBER ? [Months.JANUARY, year + 1] : [month + 1, year];
}

function getPreviousMonth([month, year]: DisplayMonth): DisplayMonth {
  return month === Months.JANUARY ? [Months.DECEMBER, year - 1] : [month - 1, year];
}

function getDateNextMonth(date: Date): Date {
    const nextMonth = getNextMonth([date.getMonth(), date.getFullYear()]);
    return new Date(nextMonth[1], nextMonth[0]);
}

function getDatePreviousMonth(date: Date): Date {
    const previousMonth = getPreviousMonth([date.getMonth(), date.getFullYear()]);
    return new Date(previousMonth[1], previousMonth[0]);
}

enum DisplayMonthOrder {
    IN_ORDER, NOT_IN_ORDER, SAME,
};

function compareDisplayMonth(
        [leftMonth, leftYear]: DisplayMonth, [rightMonth, rightYear]: DisplayMonth): DisplayMonthOrder {
    if (leftYear < rightYear) {
        return DisplayMonthOrder.IN_ORDER;
    }

    if (leftYear > rightYear) {
        return DisplayMonthOrder.NOT_IN_ORDER;
    }

    if (leftYear === rightYear) {
        if (leftMonth < rightMonth) {
        return DisplayMonthOrder.IN_ORDER;
        }

        if (leftMonth > rightMonth) {
        return DisplayMonthOrder.NOT_IN_ORDER;
        }
    }

    return DisplayMonthOrder.SAME;
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
