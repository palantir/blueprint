/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
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

import { AbstractPureComponent2, Button, DISPLAYNAME_PREFIX, Divider, IProps, Utils } from "@blueprintjs/core";
import classNames from "classnames";
import * as React from "react";
import DayPicker, { CaptionElementProps, DayModifiers, DayPickerProps, NavbarElementProps } from "react-day-picker";
import { polyfill } from "react-lifecycles-compat";

import * as Classes from "./common/classes";
import * as DateUtils from "./common/dateUtils";
import * as Errors from "./common/errors";
import { DatePickerCaption } from "./datePickerCaption";
import { getDefaultMaxDate, getDefaultMinDate, IDatePickerBaseProps } from "./datePickerCore";
import { DatePickerNavbar } from "./datePickerNavbar";
import { IDatePickerShortcut, IDateRangeShortcut, Shortcuts } from "./shortcuts";
import { TimePicker } from "./timePicker";

export interface IDatePickerProps extends IDatePickerBaseProps, IProps {
    /**
     * Allows the user to clear the selection by clicking the currently selected day.
     * @default true
     */
    canClearSelection?: boolean;

    /**
     * Props to pass to ReactDayPicker. See API documentation
     * [here](http://react-day-picker.js.org/api/DayPicker).
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
     * Whether the current day should be highlighted in the calendar.
     * @default false
     */
    highlightCurrentDay?: boolean;

    /**
     * Called when the user selects a day.
     * If being used in an uncontrolled manner, `selectedDate` will be `null` if the user clicks the currently selected
     * day. If being used in a controlled manner, `selectedDate` will contain the day clicked no matter what.
     * `isUserChange` is true if the user selected a day, and false if the date was automatically changed
     * by the user navigating to a new month or year rather than explicitly clicking on a date in the calendar.
     */
    onChange?: (selectedDate: Date, isUserChange: boolean) => void;

    /**
     * Called when the `shortcuts` props is enabled and the user changes the shortcut.
     */
    onShortcutChange?: (shortcut: IDatePickerShortcut, index: number) => void;

    /**
     * Whether the bottom bar displaying "Today" and "Clear" buttons should be shown.
     * @default false
     */
    showActionsBar?: boolean;

    /**
     * Whether shortcuts to quickly select a date are displayed or not.
     * If `true`, preset shortcuts will be displayed.
     * If `false`, no shortcuts will be displayed.
     * If an array is provided, the custom shortcuts will be displayed.
     */
    shortcuts?: boolean | IDatePickerShortcut[];

    /**
     * The currently selected shortcut.
     * If this prop is provided, the component acts in a controlled manner.
     */
    selectedShortcutIndex?: number;

    /**
     * Text for the today button in the action bar.
     * @default "Today"
     */
    todayButtonText?: string;

    /**
     * Text for the reset button in the action bar.
     * @default "Clear"
     */
    clearButtonText?: string;

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
    selectedShortcutIndex?: number;
}

@polyfill
export class DatePicker extends AbstractPureComponent2<IDatePickerProps, IDatePickerState> {
    public static defaultProps: IDatePickerProps = {
        canClearSelection: true,
        clearButtonText: "Clear",
        dayPickerProps: {},
        highlightCurrentDay: false,
        maxDate: getDefaultMaxDate(),
        minDate: getDefaultMinDate(),
        reverseMonthAndYearMenus: false,
        shortcuts: false,
        showActionsBar: false,
        timePickerProps: {},
        todayButtonText: "Today",
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
            selectedShortcutIndex:
                this.props.selectedShortcutIndex !== undefined ? this.props.selectedShortcutIndex : -1,
            value,
        };
    }

    public render() {
        const { className, dayPickerProps, locale, localeUtils, maxDate, minDate, showActionsBar } = this.props;
        const { displayMonth, displayYear } = this.state;

        return (
            <div className={classNames(Classes.DATEPICKER, className)}>
                {this.maybeRenderShortcuts()}
                <div>
                    <DayPicker
                        showOutsideDays={true}
                        locale={locale}
                        localeUtils={localeUtils}
                        modifiers={this.getDatePickerModifiers()}
                        {...dayPickerProps}
                        canChangeMonth={true}
                        captionElement={this.renderCaption}
                        navbarElement={this.renderNavbar}
                        disabledDays={this.getDisabledDaysModifier()}
                        fromMonth={minDate}
                        month={new Date(displayYear, displayMonth)}
                        onDayClick={this.handleDayClick}
                        onMonthChange={this.handleMonthChange}
                        selectedDays={this.state.value}
                        toMonth={maxDate}
                        renderDay={this.renderDay}
                    />
                    {this.maybeRenderTimePicker()}
                    {showActionsBar && this.renderOptionsBar()}
                </div>
            </div>
        );
    }

    public componentDidUpdate(prevProps: IDatePickerProps, prevState: IDatePickerState, snapshot?: {}) {
        super.componentDidUpdate(prevProps, prevState, snapshot);
        const { value } = this.props;
        if (value === prevProps.value) {
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

        if (this.props.selectedShortcutIndex !== prevProps.selectedShortcutIndex) {
            this.setState({ selectedShortcutIndex: this.props.selectedShortcutIndex });
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

    private isToday = (date: Date) => DateUtils.areSameDay(date, new Date());

    private shouldHighlightCurrentDay = (date: Date) => {
        const { highlightCurrentDay } = this.props;

        return highlightCurrentDay && this.isToday(date);
    };

    private getDatePickerModifiers = () => {
        const { modifiers } = this.props;

        return {
            isToday: this.shouldHighlightCurrentDay,
            ...modifiers,
        };
    };

    private renderDay = (day: Date) => {
        const date = day.getDate();

        return <div className={Classes.DATEPICKER_DAY_WRAPPER}>{date}</div>;
    };

    private disabledDays = (day: Date) => !DateUtils.isDayInRange(day, [this.props.minDate, this.props.maxDate]);

    private getDisabledDaysModifier = () => {
        const {
            dayPickerProps: { disabledDays },
        } = this.props;

        return Array.isArray(disabledDays) ? [this.disabledDays, ...disabledDays] : [this.disabledDays, disabledDays];
    };

    private renderCaption = (props: CaptionElementProps) => (
        <DatePickerCaption
            {...props}
            maxDate={this.props.maxDate}
            minDate={this.props.minDate}
            onDateChange={this.handleMonthChange}
            reverseMonthAndYearMenus={this.props.reverseMonthAndYearMenus}
        />
    );

    private renderNavbar = (props: NavbarElementProps) => (
        <DatePickerNavbar {...props} maxDate={this.props.maxDate} minDate={this.props.minDate} />
    );

    private renderOptionsBar() {
        const { clearButtonText, todayButtonText } = this.props;
        return [
            <Divider key="div" />,
            <div className={Classes.DATEPICKER_FOOTER} key="footer">
                <Button minimal={true} onClick={this.handleTodayClick} text={todayButtonText} />
                <Button minimal={true} onClick={this.handleClearClick} text={clearButtonText} />
            </div>,
        ];
    }

    private maybeRenderTimePicker() {
        const { timePrecision, timePickerProps } = this.props;
        if (timePrecision == null && timePickerProps === DatePicker.defaultProps.timePickerProps) {
            return null;
        }
        return (
            <TimePicker
                precision={timePrecision}
                {...timePickerProps}
                onChange={this.handleTimeChange}
                value={this.state.value}
            />
        );
    }

    private maybeRenderShortcuts() {
        const { shortcuts } = this.props;
        if (shortcuts == null || shortcuts === false) {
            return null;
        }

        const { selectedShortcutIndex } = this.state;
        const { maxDate, minDate, timePrecision } = this.props;
        // Reuse the existing date range shortcuts and only care about start date
        const dateRangeShortcuts: IDateRangeShortcut[] | true =
            shortcuts === true
                ? true
                : shortcuts.map(shortcut => ({
                      ...shortcut,
                      dateRange: [shortcut.date, undefined],
                  }));
        return [
            <Shortcuts
                key="shortcuts"
                {...{
                    allowSingleDayRange: true,
                    maxDate,
                    minDate,
                    selectedShortcutIndex,
                    shortcuts: dateRangeShortcuts,
                    timePrecision,
                }}
                onShortcutClick={this.handleShortcutClick}
                useSingleDateShortcuts={true}
            />,
            <Divider key="div" />,
        ];
    }

    private handleDayClick = (day: Date, modifiers: DayModifiers, e: React.MouseEvent<HTMLDivElement>) => {
        Utils.safeInvoke(this.props.dayPickerProps.onDayClick, day, modifiers, e);
        if (modifiers.disabled) {
            return;
        }

        this.updateDay(day);

        // allow toggling selected date by clicking it again (if prop enabled)
        const newValue =
            this.props.canClearSelection && modifiers.selected ? null : DateUtils.getDateTime(day, this.state.value);
        this.updateValue(newValue, true);
    };

    private handleShortcutClick = (shortcut: IDateRangeShortcut, selectedShortcutIndex: number) => {
        const { onShortcutChange, selectedShortcutIndex: currentShortcutIndex } = this.props;
        const { dateRange, includeTime } = shortcut;
        const newDate = dateRange[0];
        const newValue = includeTime ? newDate : DateUtils.getDateTime(newDate, this.state.value);

        this.updateDay(newDate);
        this.updateValue(newValue, true);

        if (currentShortcutIndex === undefined) {
            this.setState({ selectedShortcutIndex });
        }

        const datePickerShortcut = { ...shortcut, date: shortcut.dateRange[0] };
        Utils.safeInvoke(onShortcutChange, datePickerShortcut, selectedShortcutIndex);
    };

    private updateDay = (day: Date) => {
        if (this.props.value === undefined) {
            // set now if uncontrolled, otherwise they'll be updated in `componentDidUpdate`
            this.setState({
                displayMonth: day.getMonth(),
                displayYear: day.getFullYear(),
                selectedDay: day.getDate(),
            });
        }
        if (this.state.value != null && this.state.value.getMonth() !== day.getMonth()) {
            this.ignoreNextMonthChange = true;
        }
    };

    private computeValidDateInSpecifiedMonthYear(displayYear: number, displayMonth: number): Date {
        const { minDate, maxDate } = this.props;
        const { selectedDay } = this.state;
        // month is 0-based, date is 1-based. date 0 is last day of previous month.
        const maxDaysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();
        const displayDate = selectedDay == null ? 1 : Math.min(selectedDay, maxDaysInMonth);

        // 12:00 matches the underlying react-day-picker timestamp behavior
        const value = DateUtils.getDateTime(new Date(displayYear, displayMonth, displayDate, 12), this.state.value);
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
        const date = this.computeValidDateInSpecifiedMonthYear(newDate.getFullYear(), newDate.getMonth());
        this.setState({ displayMonth: date.getMonth(), displayYear: date.getFullYear() });
        if (this.state.value !== null) {
            // if handleDayClick just got run (so this flag is set), then the
            // user selected a date in a new month, so don't invoke onChange a
            // second time
            this.updateValue(date, false, this.ignoreNextMonthChange);
            this.ignoreNextMonthChange = false;
        }
        Utils.safeInvoke(this.props.dayPickerProps.onMonthChange, date);
    };

    private handleTodayClick = () => {
        const value = new Date();
        const displayMonth = value.getMonth();
        const displayYear = value.getFullYear();
        const selectedDay = value.getDate();
        this.setState({ displayMonth, displayYear, selectedDay });
        this.updateValue(value, true);
    };

    private handleTimeChange = (time: Date) => {
        Utils.safeInvoke(this.props.timePickerProps.onChange, time);
        const { value } = this.state;
        const newValue = DateUtils.getDateTime(value != null ? value : new Date(), time);
        this.updateValue(newValue, true);
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
