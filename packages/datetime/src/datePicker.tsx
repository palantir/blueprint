/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { AbstractPureComponent, Button, DISPLAYNAME_PREFIX, IProps, Utils } from "@blueprintjs/core";
import classNames from "classnames";
import * as React from "react";
import DayPicker, { CaptionElementProps, DayModifiers, DayPickerProps } from "react-day-picker";

import * as Classes from "./common/classes";
import * as DateUtils from "./common/dateUtils";
import * as Errors from "./common/errors";
import { DatePickerCaption } from "./datePickerCaption";
import { getDefaultMaxDate, getDefaultMinDate, IDatePickerBaseProps } from "./datePickerCore";

export interface IDatePickerProps extends IDatePickerBaseProps, IProps {
    /**
     * Allows the user to clear the selection by clicking the currently selected day.
     * @default true
     */
    canClearSelection?: boolean;

    /**
     * Props to pass to ReactDayPicker. See API documentation
     * [here](http://react-day-picker.js.org/docs/api-daypicker.html).
     *
     * The following props are managed by the component and cannot be configured:
     * `canChangeMonth`, `captionElement`, `fromMonth` (use `minDate`), `month` (use
     * `initialMonth`), `toMonth` (use `maxDate`).
     */
    dayPickerProps?: DayPickerProps;

    /**
     * Initial day the calendar will display as selected.
     * This should not be set if `value` is set.
     */
    defaultValue?: Date;

    /**
     * Called when the user selects a day.
     * If being used in an uncontrolled manner, `selectedDate` will be `null` if the user clicks the currently selected
     * day. If being used in a controlled manner, `selectedDate` will contain the day clicked no matter what.
     * `isUserChange` is true if the user selected a day, and false if the date was automatically changed
     * by the user navigating to a new month or year rather than explicitly clicking on a date in the calendar.
     */
    onChange?: (selectedDate: Date, isUserChange: boolean) => void;

    /**
     * Whether the bottom bar displaying "Today" and "Clear" buttons should be shown.
     * @default false
     */
    showActionsBar?: boolean;

    /**
     * The currently selected day. If this prop is provided, the component acts in a controlled manner.
     */
    value?: Date;
}

export interface IDatePickerState {
    displayMonth: number;
    displayYear: number;
    selectedDay: number | null;
    value: Date | null;
}

export class DatePicker extends AbstractPureComponent<IDatePickerProps, IDatePickerState> {
    public static defaultProps: IDatePickerProps = {
        canClearSelection: true,
        dayPickerProps: {},
        maxDate: getDefaultMaxDate(),
        minDate: getDefaultMinDate(),
        reverseMonthAndYearMenus: false,
        showActionsBar: false,
    };

    public static displayName = `${DISPLAYNAME_PREFIX}.DatePicker`;

    private ignoreNextMonthChange = false;

    public constructor(props: IDatePickerProps, context?: any) {
        super(props, context);
        const value = getInitialValue(props);
        const initialMonth = getInitialMonth(props, value);
        this.state = {
            displayMonth: initialMonth.getMonth(),
            displayYear: initialMonth.getFullYear(),
            selectedDay: value == null ? null : value.getDate(),
            value,
        };
    }

    public render() {
        const {
            className,
            dayPickerProps,
            locale,
            localeUtils,
            maxDate,
            minDate,
            modifiers,
            showActionsBar,
        } = this.props;
        const { displayMonth, displayYear } = this.state;

        return (
            <div className={classNames(Classes.DATEPICKER, className)}>
                <DayPicker
                    showOutsideDays={true}
                    locale={locale}
                    localeUtils={localeUtils}
                    modifiers={modifiers}
                    {...dayPickerProps}
                    canChangeMonth={true}
                    captionElement={this.renderCaption}
                    disabledDays={this.getDisabledDaysModifier()}
                    fromMonth={minDate}
                    month={new Date(displayYear, displayMonth)}
                    onDayClick={this.handleDayClick}
                    onMonthChange={this.handleMonthChange}
                    selectedDays={this.state.value}
                    toMonth={maxDate}
                />
                {showActionsBar ? this.renderOptionsBar() : null}
            </div>
        );
    }

    public componentWillReceiveProps(nextProps: IDatePickerProps) {
        super.componentWillReceiveProps(nextProps);
        const { value } = nextProps;
        if (value === this.props.value) {
            // no action needed
            return;
        } else if (value == null) {
            // clear the value
            this.setState({ value });
        } else {
            this.setState({
                displayMonth: value.getMonth(),
                displayYear: value.getFullYear(),
                selectedDay: value.getDate(),
                value,
            });
        }
    }

    protected validateProps(props: IDatePickerProps) {
        const { defaultValue, initialMonth, maxDate, minDate, value } = props;
        if (defaultValue != null && !DateUtils.isDayInRange(defaultValue, [minDate, maxDate])) {
            throw new Error(Errors.DATEPICKER_DEFAULT_VALUE_INVALID);
        }

        if (initialMonth != null && !DateUtils.isMonthInRange(initialMonth, [minDate, maxDate])) {
            throw new Error(Errors.DATEPICKER_INITIAL_MONTH_INVALID);
        }

        if (maxDate != null && minDate != null && maxDate < minDate && !DateUtils.areSameDay(maxDate, minDate)) {
            throw new Error(Errors.DATEPICKER_MAX_DATE_INVALID);
        }

        if (value != null && !DateUtils.isDayInRange(value, [minDate, maxDate])) {
            throw new Error(Errors.DATEPICKER_VALUE_INVALID);
        }
    }

    private disabledDays = (day: Date) => !DateUtils.isDayInRange(day, [this.props.minDate, this.props.maxDate]);

    private getDisabledDaysModifier = () => {
        const { dayPickerProps: { disabledDays } } = this.props;

        return Array.isArray(disabledDays) ? [this.disabledDays, ...disabledDays] : [this.disabledDays, disabledDays];
    };

    private renderCaption = (props: CaptionElementProps) => (
        <DatePickerCaption
            {...props}
            maxDate={this.props.maxDate}
            minDate={this.props.minDate}
            onMonthChange={this.handleMonthSelectChange}
            onYearChange={this.handleYearSelectChange}
            reverseMonthAndYearMenus={this.props.reverseMonthAndYearMenus}
        />
    );

    private renderOptionsBar() {
        return (
            <div className={Classes.DATEPICKER_FOOTER}>
                <Button minimal={true} onClick={this.handleTodayClick} text="Today" />
                <Button minimal={true} onClick={this.handleClearClick} text="Clear" />
            </div>
        );
    }

    private handleDayClick = (day: Date, modifiers: DayModifiers, e: React.MouseEvent<HTMLDivElement>) => {
        Utils.safeInvoke(this.props.dayPickerProps.onDayClick, day, modifiers, e);
        if (modifiers.disabled) {
            return;
        }
        if (this.props.value === undefined) {
            // set now if uncontrolled, otherwise they'll be updated in `componentWillReceiveProps`
            this.setState({
                displayMonth: day.getMonth(),
                displayYear: day.getFullYear(),
                selectedDay: day.getDate(),
            });
        }
        if (this.state.value == null || this.state.value.getMonth() !== day.getMonth()) {
            this.ignoreNextMonthChange = true;
        }

        // allow toggling selected date by clicking it again (if prop enabled)
        const newValue = this.props.canClearSelection && modifiers.selected ? null : day;
        this.updateValue(newValue, true);
    };

    private computeValidDateInSpecifiedMonthYear(displayYear: number, displayMonth: number): Date {
        const { minDate, maxDate } = this.props;
        const { selectedDay } = this.state;
        // month is 0-based, date is 1-based. date 0 is last day of previous month.
        const maxDaysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();
        const displayDate = selectedDay == null ? 1 : Math.min(selectedDay, maxDaysInMonth);

        // 12:00 matches the underlying react-day-picker timestamp behavior
        const value = new Date(displayYear, displayMonth, displayDate, 12);
        // clamp between min and max dates
        if (value < minDate) {
            return minDate;
        } else if (value > maxDate) {
            return maxDate;
        }
        return value;
    }

    private handleClearClick = () => this.updateValue(null, true);

    private handleMonthChange = (newDate: Date) => {
        const displayMonth = newDate.getMonth();
        const displayYear = newDate.getFullYear();
        this.setState({ displayMonth, displayYear });

        if (this.state.value !== null) {
            const value = this.computeValidDateInSpecifiedMonthYear(displayYear, displayMonth);
            Utils.safeInvoke(this.props.dayPickerProps.onMonthChange, value);
            // if handleDayClick just got run (so this flag is set), then the
            // user selected a date in a new month, so don't invoke onChange a
            // second time
            this.updateValue(value, false, this.ignoreNextMonthChange);
            this.ignoreNextMonthChange = false;
        }
        // don't change value if it's empty
    };

    private handleMonthSelectChange = (displayMonth: number) => {
        this.setState({ displayMonth });
        if (this.state.value !== null) {
            const value = this.computeValidDateInSpecifiedMonthYear(this.state.value.getFullYear(), displayMonth);
            Utils.safeInvoke(this.props.dayPickerProps.onMonthChange, value);
            this.updateValue(value, false);
        }
    };

    private handleYearSelectChange = (displayYear: number) => {
        let { displayMonth } = this.state;

        if (this.state.value !== null) {
            const value = this.computeValidDateInSpecifiedMonthYear(displayYear, displayMonth);
            Utils.safeInvoke(this.props.dayPickerProps.onMonthChange, value);
            this.updateValue(value, false);
            displayMonth = value.getMonth();
        } else {
            // if value is empty, then we need to clamp displayMonth to valid
            // months between min and max dates.
            const { minDate, maxDate } = this.props;
            const minMonth = minDate.getMonth();
            const maxMonth = maxDate.getMonth();
            if (displayYear === minDate.getFullYear() && displayMonth < minMonth) {
                displayMonth = minMonth;
            } else if (displayYear === maxDate.getFullYear() && displayMonth > maxMonth) {
                displayMonth = maxMonth;
            }
        }

        this.setState({ displayMonth, displayYear });
    };

    private handleTodayClick = () => {
        const value = new Date();
        const displayMonth = value.getMonth();
        const displayYear = value.getFullYear();
        const selectedDay = value.getDate();
        this.setState({ displayMonth, displayYear, selectedDay });
        this.updateValue(value, true);
    };

    /**
     * Update `value` by invoking `onChange` (always) and setting state (if uncontrolled).
     */
    private updateValue(value: Date, isUserChange: boolean, skipOnChange = false) {
        if (!skipOnChange) {
            Utils.safeInvoke(this.props.onChange, value, isUserChange);
        }
        if (this.props.value === undefined) {
            this.setState({ value });
        }
    }
}

function getInitialValue(props: IDatePickerProps): Date | null {
    // !== because `null` is a valid value (no date)
    if (props.value !== undefined) {
        return props.value;
    }
    if (props.defaultValue !== undefined) {
        return props.defaultValue;
    }
    return null;
}

function getInitialMonth(props: IDatePickerProps, value: Date | null): Date {
    const today = new Date();
    // != because we must have a real `Date` to begin the calendar on.
    if (props.initialMonth != null) {
        return props.initialMonth;
    } else if (value != null) {
        return value;
    } else if (DateUtils.isDayInRange(today, [props.minDate, props.maxDate])) {
        return today;
    } else {
        return DateUtils.getDateBetween([props.minDate, props.maxDate]);
    }
}
