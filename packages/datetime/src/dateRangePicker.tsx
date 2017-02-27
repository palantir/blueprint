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
import { Months } from "./common/months";

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
     * Called when the user changes the hovered date range, either from mouseenter or mouseleave.
     * When triggered from mouseenter, it will pass the date range that would result from next click.
     * When triggered from mouseleave, it will pass `undefined`.
     */
    onHoverChange?: (hoveredDates: DateRange) => void;

    /**
     * The date-range boundary that the next click should modify.
     * This will be honored unless the next click would overlap an existing date selection for the other boundary.
     * In that case, the next click will auto-swap the two boundary dates to keep the date range boundaries in
     * chronological order, effectively changing the other boundary's selected date.
     * If `null`, the picker will revert to its default selection behavior.
     */
    preferredBoundaryToModify?: DateRangeBoundary;

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
    displayMonth?: number;
    displayYear?: number;
    hoverValue?: DateRange;
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

        // if the initial month is the last month of the picker's
        // allowable range, the react-day-picker library will show
        // the max month on the left and the *min* month on the right.
        // subtracting one avoids that weird, wraparound state (#289).
        const initialMonthEqualsMinMonth = initialMonth.getMonth() === props.minDate.getMonth();
        const initalMonthEqualsMaxMonth = initialMonth.getMonth() === props.maxDate.getMonth();
        if (!initialMonthEqualsMinMonth && initalMonthEqualsMaxMonth) {
            initialMonth.setMonth(initialMonth.getMonth() - 1);
        }

        this.state = {
            displayMonth: initialMonth.getMonth(),
            displayYear: initialMonth.getFullYear(),
            hoverValue: [null, null],
            value,
        };
    }

    public render() {
        const modifiers = combineModifiers(this.modifiers, this.props.modifiers);
        const { className, locale, localeUtils, maxDate, minDate } = this.props;
        const { displayMonth, displayYear } = this.state;
        const isShowingOneMonth = DateUtils.areSameMonth(this.props.minDate, this.props.maxDate);

        return (
            <div className={classNames(DateClasses.DATEPICKER, DateClasses.DATERANGEPICKER, className)}>
                {this.maybeRenderShortcuts()}
                <DayPicker
                    canChangeMonth={true}
                    captionElement={this.renderCaption()}
                    disabledDays={this.states.disabledDays}
                    enableOutsideDays={true}
                    fromMonth={minDate}
                    initialMonth={new Date(displayYear, displayMonth)}
                    locale={locale}
                    localeUtils={localeUtils}
                    modifiers={modifiers}
                    numberOfMonths={isShowingOneMonth ? 1 : 2}
                    onDayClick={this.handleDayClick}
                    onDayMouseEnter={this.handleDayMouseEnter}
                    onDayMouseLeave={this.handleDayMouseLeave}
                    onMonthChange={this.handleMonthChange}
                    selectedDays={this.states.selectedDays}
                    toMonth={maxDate}
                />
            </div>
        );
    }

    public componentWillReceiveProps(nextProps: IDateRangePickerProps) {
        super.componentWillReceiveProps(nextProps);

        const { displayMonth, displayYear } = this.state;
        const nextState = getStateChange(this.props.value, nextProps.value, displayMonth, displayYear);
        this.setState(nextState);
    }

    protected validateProps(props: IDateRangePickerProps) {
        const {
            defaultValue,
            initialMonth,
            maxDate,
            minDate,
            preferredBoundaryToModify,
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

        if (preferredBoundaryToModify != null
            && preferredBoundaryToModify !== DateRangeBoundary.START
            && preferredBoundaryToModify !== DateRangeBoundary.END) {
            throw new Error(Errors.DATERANGEPICKER_PREFERRED_BOUNDARY_TO_MODIFY_INVALID)
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

    private renderCaption() {
        const { maxDate, minDate } = this.props;
        return (
            <DatePickerCaption
                maxDate={maxDate}
                minDate={minDate}
                onMonthChange={this.handleMonthSelectChange}
                onYearChange={this.handleYearSelectChange}
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
        const boundary = this.props.preferredBoundaryToModify;

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
        const { displayMonth, displayYear, value } = this.state;
        const nextState = getStateChange(value, nextValue, displayMonth, displayYear);

        if (this.props.value == null) {
            this.setState(nextState);
        }

        Utils.safeInvoke(this.props.onChange, nextValue);
    }

    private handleMonthChange = (newDate: Date) => {
        const displayMonth = newDate.getMonth();
        const displayYear = newDate.getFullYear();
        this.setState({ displayMonth, displayYear });
    }

    private handleMonthSelectChange = (displayMonth: number) => {
        this.setState({ displayMonth });
    }

    private handleYearSelectChange = (displayYear: number) => {
        const { minDate, maxDate } = this.props;
        // we display two months, so we want our display max date to be one month earlier than our real max date
        const adjustedMaxDate = DateUtils.clone(maxDate);
        adjustedMaxDate.setMonth(adjustedMaxDate.getMonth() - 1);

        const minYear = minDate.getFullYear();
        const maxYear = adjustedMaxDate.getFullYear();
        const minMonth = minDate.getMonth();
        const maxMonth = adjustedMaxDate.getMonth();

        let { displayMonth } = this.state;

        if (displayYear === minYear && displayMonth < minMonth) {
            displayMonth = minMonth;
        } else if (displayYear === maxYear && displayMonth > maxMonth) {
            displayMonth = maxMonth;
        }

        this.setState({ displayMonth, displayYear });
    }
}

function getStateChange(value: DateRange,
                        nextValue: DateRange,
                        currMonth: number,
                        currYear: number): IDateRangePickerState {
    let returnVal: IDateRangePickerState;

    if (value != null && nextValue == null) {
        returnVal = { value: [null, null] };
    } else if (value == null && nextValue != null) {
        // calendar displays first month of the new start date if provided
        if (nextValue[0] != null) {
            returnVal = {
                displayMonth: nextValue[0].getMonth(),
                displayYear: nextValue[0].getFullYear(),
                value: nextValue,
            };
        } else {
            returnVal = { value: nextValue };
        }
    } else if (value != null && nextValue != null) {
        const [valueStart, valueEnd] = value;
        const [nextValueStart, nextValueEnd] = nextValue;

        if (nextValueStart == null) {
           returnVal = { value: nextValue };
        } else {
            const hasEndDateChanged = !DateUtils.areSameDay(valueEnd, nextValueEnd);
            const isStartDateNowEndDate = DateUtils.areSameDay(valueStart, nextValueEnd);

            const newDate = hasEndDateChanged && !isStartDateNowEndDate && nextValueEnd != null ?
                nextValueEnd :
                nextValueStart;
            returnVal = {
                displayMonth: newDate.getMonth(),
                displayYear: newDate.getFullYear(),
                value: nextValue,
            };
        }
    } else {
        returnVal = {};
    }

    // adjust calendar display month as little as possible
    const { displayMonth, displayYear } = returnVal;
    if (displayMonth != null && displayYear != null) {
        const nextMonth = getNextMonth([currMonth, currYear]);
        const monthToDisplay: DisplayMonth = [displayMonth, displayYear];
        if (areSameMonth(nextMonth, monthToDisplay)) {
            returnVal.displayMonth = currMonth;
            returnVal.displayYear = currYear;
        } else if (areSameMonth(getNextMonth(nextMonth), monthToDisplay)) {
           returnVal.displayMonth = nextMonth[0];
           returnVal.displayYear = nextMonth[1];
        }
    }

    return returnVal;
}

type DisplayMonth = [number, number];

function getNextMonth([month, year]: DisplayMonth): DisplayMonth {
    return month === Months.DECEMBER ? [Months.JANUARY, year + 1] : [month + 1, year];
}

function areSameMonth([month, year]: DisplayMonth, [month2, year2]: DisplayMonth) {
    return month === month2 && year === year2;
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
