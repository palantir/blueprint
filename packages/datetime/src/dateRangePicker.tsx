/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { AbstractPureComponent, Boundary, Classes, IProps, Menu, MenuItem, Utils } from "@blueprintjs/core";
import classNames from "classnames";
import * as React from "react";
import ReactDayPicker from "react-day-picker";
import { DayModifiers } from "react-day-picker/types/common";
import { CaptionElementProps, DayPickerProps } from "react-day-picker/types/props";

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
import { DateRangeSelectionStrategy } from "./dateRangeSelectionStrategy";

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
    boundaryToModify?: Boundary;

    /**
     * Whether displayed months in the calendar are contiguous.
     * If false, each side of the calendar can move independently to non-contiguous months.
     * @default true
     */
    contiguousCalendarMonths?: boolean;
    /**
     * Props to pass to ReactDayPicker. See API documentation
     * [here](http://react-day-picker.js.org/docs/api-daypicker.html).
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

export class DateRangePicker extends AbstractPureComponent<IDateRangePickerProps, IDateRangePickerState> {
    public static defaultProps: IDateRangePickerProps = {
        allowSingleDayRange: false,
        contiguousCalendarMonths: true,
        dayPickerProps: {},
        maxDate: getDefaultMaxDate(),
        minDate: getDefaultMinDate(),
        reverseMonthAndYearMenus: false,
        shortcuts: true,
    };

    public static displayName = "Blueprint2.DateRangePicker";

    private get isControlled() {
        return this.props.value != null;
    }

    // these will get merged with the user's own
    private modifiers: IDatePickerModifiers = {
        [SELECTED_RANGE_MODIFIER]: day => {
            const { value } = this.state;
            return value[0] != null && value[1] != null && DateUtils.isDayInRange(day, value, true);
        },
        [`${SELECTED_RANGE_MODIFIER}-start`]: day => DateUtils.areSameDay(this.state.value[0], day),
        [`${SELECTED_RANGE_MODIFIER}-end`]: day => DateUtils.areSameDay(this.state.value[1], day),

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
            if (hoverValue == null || hoverValue[0] == null) {
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
        } else if (value[1] != null) {
            initialMonth = DateUtils.clone(value[1]);
            if (!DateUtils.areSameMonth(initialMonth, props.minDate)) {
                initialMonth.setMonth(initialMonth.getMonth() - 1);
            }
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

        // show the selected end date's encompassing month in the right view if
        // the calendars don't have to be contiguous.
        // if left view and right view months are the same, show next month in the right view.
        const leftView = MonthAndYear.fromDate(initialMonth);
        const rightDate = value[1];
        const rightView =
            !props.contiguousCalendarMonths && rightDate != null && !DateUtils.areSameMonth(initialMonth, rightDate)
                ? MonthAndYear.fromDate(rightDate)
                : leftView.getNextMonth();
        this.state = { leftView, rightView, value, hoverValue: [null, null] };
    }

    public render() {
        const modifiers = combineModifiers(this.modifiers, this.props.modifiers);
        const {
            className,
            contiguousCalendarMonths,
            dayPickerProps,
            locale,
            localeUtils,
            maxDate,
            minDate,
        } = this.props;
        const isShowingOneMonth = DateUtils.areSameMonth(this.props.minDate, this.props.maxDate);

        const { leftView, rightView } = this.state;
        const disabledDays = this.getDisabledDaysModifier();

        const dayPickerBaseProps: DayPickerProps = {
            locale,
            localeUtils,
            modifiers,
            showOutsideDays: true,
            ...dayPickerProps,
            disabledDays,
            onDayClick: this.handleDayClick,
            onDayMouseEnter: this.handleDayMouseEnter,
            onDayMouseLeave: this.handleDayMouseLeave,
            selectedDays: this.state.value,
        };

        if (contiguousCalendarMonths || isShowingOneMonth) {
            const classes = classNames(DateClasses.DATEPICKER, DateClasses.DATERANGEPICKER, className, {
                [DateClasses.DATERANGEPICKER_CONTIGUOUS]: contiguousCalendarMonths,
                [DateClasses.DATERANGEPICKER_SINGLE_MONTH]: isShowingOneMonth,
            });

            // use the left DayPicker when we only need one
            return (
                <div className={classes}>
                    {this.maybeRenderShortcuts()}
                    <ReactDayPicker
                        {...dayPickerBaseProps}
                        captionElement={this.renderSingleCaption}
                        fromMonth={minDate}
                        month={leftView.getFullDate()}
                        numberOfMonths={isShowingOneMonth ? 1 : 2}
                        onMonthChange={this.handleLeftMonthChange}
                        toMonth={maxDate}
                    />
                </div>
            );
        } else {
            // const rightMonth = contiguousCalendarMonths ? rightView.getFullDate()
            return (
                <div className={classNames(DateClasses.DATEPICKER, DateClasses.DATERANGEPICKER, className)}>
                    {this.maybeRenderShortcuts()}
                    <ReactDayPicker
                        {...dayPickerBaseProps}
                        canChangeMonth={true}
                        captionElement={this.renderLeftCaption}
                        fromMonth={minDate}
                        month={leftView.getFullDate()}
                        onMonthChange={this.handleLeftMonthChange}
                        toMonth={DateUtils.getDatePreviousMonth(maxDate)}
                    />
                    <ReactDayPicker
                        {...dayPickerBaseProps}
                        canChangeMonth={true}
                        captionElement={this.renderRightCaption}
                        fromMonth={DateUtils.getDateNextMonth(minDate)}
                        month={rightView.getFullDate()}
                        onMonthChange={this.handleRightMonthChange}
                        toMonth={maxDate}
                    />
                </div>
            );
        }
    }

    public componentWillReceiveProps(nextProps: IDateRangePickerProps) {
        super.componentWillReceiveProps(nextProps);

        if (!DateUtils.areRangesEqual(this.props.value, nextProps.value)) {
            const nextState = getStateChange(
                this.props.value,
                nextProps.value,
                this.state,
                nextProps.contiguousCalendarMonths,
            );
            this.setState(nextState);
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
        const { dayPickerProps: { disabledDays } } = this.props;

        return disabledDays instanceof Array ? [this.disabledDays, ...disabledDays] : [this.disabledDays, disabledDays];
    };

    private maybeRenderShortcuts() {
        const propsShortcuts = this.props.shortcuts;
        if (propsShortcuts == null || propsShortcuts === false) {
            return undefined;
        }

        const shortcuts =
            typeof propsShortcuts === "boolean"
                ? createDefaultShortcuts(this.props.allowSingleDayRange)
                : propsShortcuts;

        const shortcutElements = shortcuts.map((s, i) => {
            return (
                <MenuItem
                    className={Classes.POPOVER_DISMISS_OVERRIDE}
                    disabled={!this.isShortcutInRange(s.dateRange)}
                    key={i}
                    onClick={this.getShorcutClickHandler(s.dateRange)}
                    text={s.label}
                />
            );
        });

        return <Menu className={DateClasses.DATERANGEPICKER_SHORTCUTS}>{shortcutElements}</Menu>;
    }

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

    private getShorcutClickHandler(nextValue: DateRange) {
        return () => this.handleNextState(nextValue);
    }

    private handleNextState(nextValue: DateRange) {
        const { value } = this.state;
        const nextState = getStateChange(value, nextValue, this.state, this.props.contiguousCalendarMonths);

        if (!this.isControlled) {
            this.setState(nextState);
        }

        Utils.safeInvoke(this.props.onChange, nextValue);
    }

    private handleLeftMonthChange = (newDate: Date) => {
        const leftView = new MonthAndYear(newDate.getMonth(), newDate.getFullYear());
        Utils.safeInvoke(this.props.dayPickerProps.onMonthChange, leftView.getFullDate());
        this.updateLeftView(leftView);
    };

    private handleRightMonthChange = (newDate: Date) => {
        const rightView = new MonthAndYear(newDate.getMonth(), newDate.getFullYear());
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
        if (!leftView.isBefore(rightView)) {
            rightView = leftView.getNextMonth();
        }

        this.setViews(leftView, rightView);
    };

    private handleRightYearSelectChange = (rightDisplayYear: number) => {
        let rightView = new MonthAndYear(this.state.rightView.getMonth(), rightDisplayYear);
        Utils.safeInvoke(this.props.dayPickerProps.onMonthChange, rightView.getFullDate());
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
    };

    private setViews(leftView: MonthAndYear, rightView: MonthAndYear) {
        this.setState({ leftView, rightView });
    }

    private isShortcutInRange(shortcutDateRange: DateRange) {
        return DateUtils.isDayRangeInRange(shortcutDateRange, [this.props.minDate, this.props.maxDate]);
    }
}

function getStateChange(
    value: DateRange,
    nextValue: DateRange,
    state: IDateRangePickerState,
    contiguousCalendarMonths: boolean,
): IDateRangePickerState {
    let returnVal: IDateRangePickerState;

    if (value != null && nextValue == null) {
        returnVal = { value: [null, null] };
    } else if (nextValue != null) {
        const [nextValueStart, nextValueEnd] = nextValue;

        let leftView = state.leftView.clone();
        let rightView = state.rightView.clone();

        // Only end date selected.
        // If the newly selected end date isn't in either of the displayed months, then
        //   - set the right DayPicker to the month of the selected end date
        //   - ensure the left DayPicker is before the right, changing if needed
        if (nextValueStart == null && nextValueEnd != null) {
            const nextValueEndMonthAndYear = new MonthAndYear(nextValueEnd.getMonth(), nextValueEnd.getFullYear());

            if (!nextValueEndMonthAndYear.isSame(leftView) && !nextValueEndMonthAndYear.isSame(rightView)) {
                rightView = nextValueEndMonthAndYear;
                if (!leftView.isBefore(rightView)) {
                    leftView = rightView.getPreviousMonth();
                }
            }
        } else if (nextValueStart != null && nextValueEnd == null) {
            // Only start date selected.
            // If the newly selected start date isn't in either of the displayed months, then
            //   - set the left DayPicker to the month of the selected start date
            //   - ensure the right DayPicker is before the left, changing if needed
            const nextValueStartMonthAndYear = new MonthAndYear(
                nextValueStart.getMonth(),
                nextValueStart.getFullYear(),
            );

            if (!nextValueStartMonthAndYear.isSame(leftView) && !nextValueStartMonthAndYear.isSame(rightView)) {
                leftView = nextValueStartMonthAndYear;
                if (!rightView.isAfter(leftView)) {
                    rightView = leftView.getNextMonth();
                }
            }
        } else if (nextValueStart != null && nextValueEnd != null) {
            // Both start date and end date selected.
            const nextValueStartMonthAndYear = new MonthAndYear(
                nextValueStart.getMonth(),
                nextValueStart.getFullYear(),
            );
            const nextValueEndMonthAndYear = new MonthAndYear(nextValueEnd.getMonth(), nextValueEnd.getFullYear());

            // Both start and end date months are identical
            // If the selected month isn't in either of the displayed months, then
            //   - set the left DayPicker to be the selected month
            //   - set the right DayPicker to +1
            if (DateUtils.areSameMonth(nextValueStart, nextValueEnd)) {
                const potentialLeftEqualsNextValueStart = leftView.isSame(nextValueStartMonthAndYear);
                const potentialRightEqualsNextValueStart = rightView.isSame(nextValueStartMonthAndYear);

                if (potentialLeftEqualsNextValueStart || potentialRightEqualsNextValueStart) {
                    // do nothing
                } else {
                    leftView = nextValueStartMonthAndYear;
                    rightView = nextValueStartMonthAndYear.getNextMonth();
                }
            } else {
                // Different start and end date months, adjust display months.
                if (!leftView.isSame(nextValueStartMonthAndYear)) {
                    leftView = nextValueStartMonthAndYear;
                    rightView = nextValueStartMonthAndYear.getNextMonth();
                }
                if (contiguousCalendarMonths === false && !rightView.isSame(nextValueEndMonthAndYear)) {
                    rightView = nextValueEndMonthAndYear;
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

function createDefaultShortcuts(allowSingleDayRange: boolean) {
    const today = new Date();
    const makeDate = (action: (d: Date) => void) => {
        const returnVal = DateUtils.clone(today);
        action(returnVal);
        returnVal.setDate(returnVal.getDate() + 1);
        return returnVal;
    };

    const yesterday = makeDate(d => d.setDate(d.getDate() - 2));
    const oneWeekAgo = makeDate(d => d.setDate(d.getDate() - 7));
    const oneMonthAgo = makeDate(d => d.setMonth(d.getMonth() - 1));
    const threeMonthsAgo = makeDate(d => d.setMonth(d.getMonth() - 3));
    const sixMonthsAgo = makeDate(d => d.setMonth(d.getMonth() - 6));
    const oneYearAgo = makeDate(d => d.setFullYear(d.getFullYear() - 1));
    const twoYearsAgo = makeDate(d => d.setFullYear(d.getFullYear() - 2));

    const singleDayShortcuts = allowSingleDayRange
        ? [createShortcut("Today", [today, today]), createShortcut("Yesterday", [yesterday, yesterday])]
        : [];

    return [
        ...singleDayShortcuts,
        createShortcut("Past week", [oneWeekAgo, today]),
        createShortcut("Past month", [oneMonthAgo, today]),
        createShortcut("Past 3 months", [threeMonthsAgo, today]),
        createShortcut("Past 6 months", [sixMonthsAgo, today]),
        createShortcut("Past year", [oneYearAgo, today]),
        createShortcut("Past 2 years", [twoYearsAgo, today]),
    ];
}
