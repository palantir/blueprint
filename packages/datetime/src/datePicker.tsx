/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import { AbstractComponent, Button, IProps, Utils } from "@blueprintjs/core";
import * as classNames from "classnames";
import * as React from "react";
import * as ReactDayPicker from "react-day-picker";

import * as Classes from "./common/classes";
import * as DateUtils from "./common/dateUtils";
import * as Errors from "./common/errors";

import { DatePickerCaption } from "./datePickerCaption";
import {
    getDefaultMaxDate,
    getDefaultMinDate,
    IDatePickerBaseProps,
    IDatePickerDayModifiers,
} from "./datePickerCore";

export interface IDatePickerProps extends IDatePickerBaseProps, IProps {
   /**
    * Allows the user to clear the selection by clicking the currently selected day.
    */
    canClearSelection?: boolean;

   /**
    * Initial day the calendar will display as selected.
    * This should not be set if `value` is set.
    */
    defaultValue?: Date;

   /**
    * Called when the user selects a day.
    * If being used in an uncontrolled manner, `selectedDate` will be `null` if the user clicks the currently selected
    * day. If being used in a controlled manner, `selectedDate` will contain the day clicked no matter what.
    * `hasUserManuallySelectedDate` is true if the user selected a day, and false if the date was automatically changed
    * by the user navigating to a new month or year rather than explicitly clicking on a date in the calendar.
    */
    onChange?: (selectedDate: Date, hasUserManuallySelectedDate: boolean) => void;

   /**
    * Whether the bottom bar displaying 'Today' and 'Clear' buttons should be shown.
    * @default false
    */
    showActionsBar?: boolean;

   /**
    * The currently selected day. If this prop is present, the component acts in a controlled manner.
    */
    value?: Date;
}

export interface IDatePickerState {
    displayMonth?: number;
    displayYear?: number;
    selectedDay?: number;
    value?: Date;
}

export class DatePicker extends AbstractComponent<IDatePickerProps, IDatePickerState> {
    public static defaultProps: IDatePickerProps = {
        canClearSelection: true,
        maxDate: getDefaultMaxDate(),
        minDate: getDefaultMinDate(),
        showActionsBar: false,
    };

    public displayName = "Blueprint.DatePicker";

    private ignoreNextMonthChange = false;

    public constructor(props?: IDatePickerProps, context?: any) {
        super(props, context);

        let value: Date = null;
        if (props.value !== undefined) {
            value = props.value;
        } else if (props.defaultValue != null) {
            value = props.defaultValue;
        }

        let selectedDay: number;
        if (value !== null) { selectedDay = value.getDate(); }

        let initialMonth: Date;
        const today = new Date();
        if (props.initialMonth != null) {
            initialMonth = props.initialMonth;
        } else if (value != null) {
            initialMonth = value;
        } else if (DateUtils.isDayInRange(today, [props.minDate, props.maxDate])) {
            initialMonth = today;
        } else {
            initialMonth = DateUtils.getDateBetween([props.minDate, props.maxDate]);
        }

        this.state = {
            displayMonth: initialMonth.getMonth(),
            displayYear: initialMonth.getFullYear(),
            selectedDay,
            value,
        };
    }

    public render() {
        const { className, locale, localeUtils, maxDate, minDate, showActionsBar } = this.props;
        const { displayMonth, displayYear } = this.state;

        return (
            <div className={classNames(Classes.DATEPICKER, className)}>
                <ReactDayPicker
                    canChangeMonth={true}
                    captionElement={this.renderCaption()}
                    disabledDays={this.disabledDays}
                    enableOutsideDays={true}
                    fromMonth={minDate}
                    initialMonth={new Date(displayYear, displayMonth)}
                    locale={locale}
                    localeUtils={localeUtils}
                    modifiers={this.props.modifiers}
                    onDayClick={this.handleDayClick}
                    onMonthChange={this.handleMonthChange}
                    selectedDays={this.selectedDays}
                    toMonth={maxDate}
                />
                { showActionsBar ? this.renderOptionsBar() : null }
            </div>
        );
    }

    public componentWillReceiveProps(nextProps: IDatePickerProps) {
        if (nextProps.value !== this.props.value) {
            let {displayMonth, displayYear, selectedDay} = this.state;
            if (nextProps.value != null) {
                displayMonth = nextProps.value.getMonth();
                displayYear = nextProps.value.getFullYear();
                selectedDay = nextProps.value.getDate();
            }
            this.setState({ displayMonth, displayYear, selectedDay, value: nextProps.value });
        }

        super.componentWillReceiveProps(nextProps);
    }

    protected validateProps(props: IDatePickerProps) {
        const { defaultValue, initialMonth, maxDate, minDate, value } = props;
        if (defaultValue != null && !DateUtils.isDayInRange(defaultValue, [minDate, maxDate])) {
            throw new Error(Errors.DATEPICKER_DEFAULT_VALUE_INVALID);
        }

        if (initialMonth != null && !DateUtils.isMonthInRange(initialMonth, [minDate, maxDate])) {
            throw new Error(Errors.DATEPICKER_INITIAL_MONTH_INVALID);
        }

        if (maxDate != null
                && minDate != null
                && maxDate < minDate
                && !DateUtils.areSameDay(maxDate, minDate)) {
            throw new Error(Errors.DATEPICKER_MAX_DATE_INVALID);
        }

        if (value != null && !DateUtils.isDayInRange(value, [minDate, maxDate])) {
            throw new Error(Errors.DATEPICKER_VALUE_INVALID);
        }
    }

    private disabledDays = (day: Date) => !DateUtils.isDayInRange(day, [this.props.minDate, this.props.maxDate]);
    private selectedDays = (day: Date) => DateUtils.areSameDay(this.state.value, day);

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

    private renderOptionsBar() {
        return (
            <div className={Classes.DATEPICKER_FOOTER}>
                <Button
                    className="pt-minimal pt-datepicker-footer-button"
                    onClick={this.handleTodayClick}
                    text="Today"
                />
                <Button
                    className="pt-minimal pt-datepicker-footer-button"
                    onClick={this.handleClearClick}
                    text="Clear"
                />
            </div>
        );
    }

    private handleDayClick = (_e: React.SyntheticEvent<HTMLElement>, day: Date, modifiers: IDatePickerDayModifiers) => {
        let newValue = day;

        if (this.props.canClearSelection && modifiers.selected) {
            newValue = null;
        }

        if (this.props.value === undefined) {
            // component is uncontrolled
            if (!modifiers.disabled) {
                const displayMonth = day.getMonth();
                const displayYear = day.getFullYear();
                const selectedDay = day.getDate();
                this.setState({ displayMonth, displayYear, selectedDay, value: newValue });
            }
        }

        if (!modifiers.disabled) {
            Utils.safeInvoke(this.props.onChange, newValue, true);
            if (this.state.value != null && this.state.value.getMonth() !== day.getMonth()) {
                this.ignoreNextMonthChange = true;
            }
        } else {
            // rerender base component to get around bug where you can navigate past bounds by clicking days
            this.forceUpdate();
        }
    }

    private computeValidDateInSpecifiedMonthYear(displayYear: number, displayMonth: number): Date {
        const { minDate, maxDate } = this.props;
        const maxDaysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();
        let { selectedDay } = this.state;

        if (selectedDay > maxDaysInMonth) {
            selectedDay = maxDaysInMonth;
        }

        // matches the underlying react-day-picker timestamp behavior
        let value = new Date(displayYear, displayMonth, selectedDay, 12);

        if (value < minDate) {
            value = minDate;
        } else if (value > maxDate) {
            value = maxDate;
        }

        return value;
    }

    private handleMonthChange = (newDate: Date) => {
        const displayMonth = newDate.getMonth();
        const displayYear = newDate.getFullYear();
        let { value } = this.state;

        if (value !== null) {
            value = this.computeValidDateInSpecifiedMonthYear(displayYear, displayMonth);
            if (this.ignoreNextMonthChange) {
                this.ignoreNextMonthChange = false;
            } else {
                // if handleDayClick just got run, it means the user selected a date in a new month,
                // so don't run onChange again
                Utils.safeInvoke(this.props.onChange, value, false);
            }
        }

        this.setStateWithValueIfUncontrolled({ displayMonth, displayYear }, value);
    }

    private handleMonthSelectChange = (displayMonth: number) => {
        let { value } = this.state;

        if (value !== null) {
            value = this.computeValidDateInSpecifiedMonthYear(value.getFullYear(), displayMonth);
            Utils.safeInvoke(this.props.onChange, value, false);
        }

        this.setStateWithValueIfUncontrolled({ displayMonth }, value);
    }

    private handleYearSelectChange = (displayYear: number) => {
        let { displayMonth, value } = this.state;

        if (value !== null) {
            value = this.computeValidDateInSpecifiedMonthYear(displayYear, displayMonth);
            Utils.safeInvoke(this.props.onChange, value, false);
            displayMonth = value.getMonth();
        } else {
            const { minDate, maxDate } = this.props;
            const minYear = minDate.getFullYear();
            const maxYear = maxDate.getFullYear();
            const minMonth = minDate.getMonth();
            const maxMonth = maxDate.getMonth();

            if (displayYear === minYear && displayMonth < minMonth) {
                displayMonth = minMonth;
            } else if (displayYear === maxYear && displayMonth > maxMonth) {
                displayMonth = maxMonth;
            }
        }

        this.setStateWithValueIfUncontrolled({ displayMonth, displayYear }, value);
    }

    private setStateWithValueIfUncontrolled(newState: IDatePickerState, value: Date) {
        if (this.props.value === undefined) {
            // uncontrolled mode means we track value in state
            newState.value = value;
        }
        return this.setState(newState);
    }

    private handleClearClick = () => {
        if (this.props.value === undefined) {
            this.setState({ value: null });
        }
        Utils.safeInvoke(this.props.onChange, null, true);
    }

    private handleTodayClick = () => {
        const value = new Date();
        const displayMonth = value.getMonth();
        const displayYear = value.getFullYear();
        const selectedDay = value.getDate();
        if (this.props.value === undefined) {
            this.setState({ displayMonth, displayYear, selectedDay, value });
        } else {
            this.setState({ displayMonth, displayYear, selectedDay });
        }
        Utils.safeInvoke(this.props.onChange, value, true);
    }
}

export let DatePickerFactory = React.createFactory(DatePicker);
