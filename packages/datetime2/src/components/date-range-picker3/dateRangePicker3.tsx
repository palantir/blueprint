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

import classNames from "classnames";
import { format, Locale } from "date-fns";
import * as React from "react";
import {
    DateRange as RDPRange,
    DayPicker,
    DayModifiers,
    ActiveModifiers,
    SelectRangeEventHandler,
    ModifiersClassNames,
    DateFormatter,
    CustomComponents,
} from "react-day-picker";

import { AbstractPureComponent, Boundary, DISPLAYNAME_PREFIX, Divider } from "@blueprintjs/core";
import { DateRange, DateUtils, DatePickerUtils, DateRangeShortcut, TimePicker } from "@blueprintjs/datetime";

// tslint:disable no-submodule-imports
import { MonthAndYear } from "@blueprintjs/datetime/lib/esm/common/monthAndYear";
import { DateRangeSelectionStrategy } from "@blueprintjs/datetime/lib/esm/common/dateRangeSelectionStrategy";
import * as Errors from "@blueprintjs/datetime/lib/esm/common/errors";
import { Shortcuts } from "@blueprintjs/datetime/lib/esm/components/shortcuts/shortcuts";
// tslint:enable no-submodule-imports

import { Classes } from "../../classes";
import { combineModifiers, HOVERED_RANGE_MODIFIER } from "../../common/dayPickerModifiers";
import { DateRangePicker3Props } from "./dateRangePicker3Props";
import { loadDateFnsLocale } from "../../common/dateFnsLocaleUtils";
import { DatePicker3Caption } from "../react-day-picker/datePicker3Caption";
import { DatePicker3Provider } from "../date-picker3/datePicker3Context";
import { DateRangePicker3CaptionLabel } from "./dateRangePicker3CaptionLabel";
import { DatePicker3Dropdown } from "../react-day-picker/datePicker3Dropdown";
import { IconLeft, IconRight } from "../react-day-picker/datePickerNavIcons";

export { DateRangePicker3Props };

// leftView and rightView controls the DayPicker displayed month
interface DateRangePicker3State {
    hoverValue?: DateRange;
    leftView: MonthAndYear;
    locale: Locale | undefined;
    rightView: MonthAndYear;
    value: DateRange;
    time: DateRange;
    selectedShortcutIndex?: number;
}

/**
 * Date range picker (v3) component.
 *
 * @see https://blueprintjs.com/docs/#datetime2/date-range-picker3
 */
export class DateRangePicker3 extends AbstractPureComponent<DateRangePicker3Props, DateRangePicker3State> {
    public static defaultProps: DateRangePicker3Props = {
        allowSingleDayRange: false,
        contiguousCalendarMonths: true,
        dayPickerProps: {},
        locale: "en-US",
        maxDate: DatePickerUtils.getDefaultMaxDate(),
        minDate: DatePickerUtils.getDefaultMinDate(),
        reverseMonthAndYearMenus: false,
        shortcuts: true,
        singleMonthOnly: false,
        timePickerProps: {},
    };

    public static displayName = `${DISPLAYNAME_PREFIX}.DateRangePicker3`;

    // these will get merged with the user's own
    private modifiers: DayModifiers = {
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
            return DateUtils.isSameDay(hoverValue[0], day);
        },
        [`${HOVERED_RANGE_MODIFIER}-end`]: day => {
            const { hoverValue } = this.state;
            if (hoverValue == null || hoverValue[1] == null) {
                return false;
            }
            return DateUtils.isSameDay(hoverValue[1], day);
        },
    };

    private modifiersClassNames: ModifiersClassNames = {
        [HOVERED_RANGE_MODIFIER]: Classes.DATERANGEPICKER3_DAY_HOVERED_RANGE,
        [`${HOVERED_RANGE_MODIFIER}-start`]: Classes.DATERANGEPICKER3_DAY_HOVERED_RANGE_START,
        [`${HOVERED_RANGE_MODIFIER}-end`]: Classes.DATERANGEPICKER3_DAY_HOVERED_RANGE_END,
    };

    public constructor(props: DateRangePicker3Props) {
        super(props);
        const value = getInitialValue(props);
        const time: DateRange = value;
        const initialMonth = getInitialMonth(props, value);

        // if the initial month is the last month of the picker's
        // allowable range, the react-day-picker library will show
        // the max month on the left and the *min* month on the right.
        // subtracting one avoids that weird, wraparound state (#289).
        const initialMonthEqualsMinMonth = DateUtils.isSameMonth(initialMonth, props.minDate!);
        const initalMonthEqualsMaxMonth = DateUtils.isSameMonth(initialMonth, props.maxDate!);
        if (!props.singleMonthOnly && !initialMonthEqualsMinMonth && initalMonthEqualsMaxMonth) {
            initialMonth.setMonth(initialMonth.getMonth() - 1);
        }

        // show the selected end date's encompassing month in the right view if
        // the calendars don't have to be contiguous.
        // if left view and right view months are the same, show next month in the right view.
        const leftView = MonthAndYear.fromDate(initialMonth);
        const rightDate = value[1];
        const rightView =
            !props.contiguousCalendarMonths && rightDate != null && !DateUtils.isSameMonth(initialMonth, rightDate)
                ? MonthAndYear.fromDate(rightDate)
                : leftView.getNextMonth();
        this.state = {
            hoverValue: [null, null],
            leftView,
            locale: undefined,
            rightView,
            selectedShortcutIndex:
                this.props.selectedShortcutIndex !== undefined ? this.props.selectedShortcutIndex : -1,
            time,
            value,
        };
    }

    public render() {
        const { className, contiguousCalendarMonths, singleMonthOnly, footerElement } = this.props;
        const isShowingOneMonth = singleMonthOnly || DateUtils.isSameMonth(this.props.minDate!, this.props.maxDate!);

        const classes = classNames(Classes.DATEPICKER, Classes.DATERANGEPICKER, className, {
            [Classes.DATEPICKER_HIGHLIGHT_CURRENT_DAY]: this.props.highlightCurrentDay,
            [Classes.DATERANGEPICKER_CONTIGUOUS]: contiguousCalendarMonths,
            [Classes.DATERANGEPICKER_SINGLE_MONTH]: isShowingOneMonth,
        });

        // use the left DayPicker when we only need one
        return (
            <div className={classes}>
                {this.maybeRenderShortcuts()}
                <div className={Classes.DATEPICKER_CONTENT}>
                    {/* {this.renderCalendars(isShowingOneMonth)} */}
                    {this.renderDayRangePicker(isShowingOneMonth)}
                    {this.maybeRenderTimePickers(isShowingOneMonth)}
                    {footerElement}
                </div>
            </div>
        );
    }

    public async componentDidMount() {
        await this.loadLocale(this.props.locale);
    }

    public async componentDidUpdate(prevProps: DateRangePicker3Props) {
        const isControlled = prevProps.value !== undefined && this.props.value !== undefined;

        if (
            isControlled &&
            (!DateUtils.areRangesEqual(prevProps.value!, this.props.value!) ||
                prevProps.contiguousCalendarMonths !== this.props.contiguousCalendarMonths)
        ) {
            const nextState = getStateChange(
                prevProps.value,
                this.props.value,
                this.state,
                prevProps.contiguousCalendarMonths!,
            );
            this.setState(nextState);
        }

        if (this.props.selectedShortcutIndex !== prevProps.selectedShortcutIndex) {
            this.setState({ selectedShortcutIndex: this.props.selectedShortcutIndex });
        }

        if (this.props.locale !== prevProps.locale) {
            await this.loadLocale(this.props.locale);
        }
    }

    // HACKHACK: type fix for setState which does not accept partial state objects in our outdated version of
    // @types/react (v16.14.32)
    public setState<K extends keyof DateRangePicker3State>(
        nextStateOrAction:
            | Partial<DateRangePicker3State>
            | null
            | ((
                  prevState: DateRangePicker3State,
                  prevProps: DateRangePicker3Props,
              ) => Pick<DateRangePicker3State, K> | null),
        callback?: () => void,
    ) {
        if (typeof nextStateOrAction === "function") {
            super.setState(nextStateOrAction, callback);
        } else {
            super.setState(nextStateOrAction as DateRangePicker3State);
        }
    }

    protected validateProps(props: DateRangePicker3Props) {
        const { defaultValue, initialMonth, maxDate, minDate, boundaryToModify, value } = props;
        const dateRange: DateRange = [minDate!, maxDate!];

        if (defaultValue != null && !DateUtils.isDayRangeInRange(defaultValue, dateRange)) {
            console.error(Errors.DATERANGEPICKER_DEFAULT_VALUE_INVALID);
        }

        if (initialMonth != null && !DateUtils.isMonthInRange(initialMonth, dateRange)) {
            console.error(Errors.DATERANGEPICKER_INITIAL_MONTH_INVALID);
        }

        if (maxDate != null && minDate != null && maxDate < minDate && !DateUtils.isSameDay(maxDate, minDate)) {
            console.error(Errors.DATERANGEPICKER_MAX_DATE_INVALID);
        }

        if (value != null && !DateUtils.isDayRangeInRange(value, dateRange)) {
            console.error(Errors.DATERANGEPICKER_VALUE_INVALID);
        }

        if (boundaryToModify != null && boundaryToModify !== Boundary.START && boundaryToModify !== Boundary.END) {
            console.error(Errors.DATERANGEPICKER_PREFERRED_BOUNDARY_TO_MODIFY_INVALID);
        }
    }

    private async loadLocale(localeCode: string | undefined) {
        if (localeCode === undefined) {
            return;
        } else if (this.state.locale?.code === localeCode) {
            return;
        }

        const locale = await loadDateFnsLocale(localeCode);
        this.setState({ locale });
    }

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
                {...{
                    allowSingleDayRange,
                    maxDate,
                    minDate,
                    selectedShortcutIndex,
                    shortcuts,
                    timePrecision,
                }}
                onShortcutClick={this.handleShortcutClick}
            />,
            <Divider key="div" />,
        ];
    }

    private maybeRenderTimePickers(isShowingOneMonth: boolean) {
        const { timePrecision, timePickerProps } = this.props;
        if (timePrecision == null && timePickerProps === DateRangePicker3.defaultProps.timePickerProps) {
            return null;
        }

        if (isShowingOneMonth) {
            return (
                <TimePicker
                    precision={timePrecision}
                    {...timePickerProps}
                    onChange={this.handleTimeChangeLeftCalendar}
                    value={this.state.time[0]}
                />
            );
        } else {
            return (
                <div className={Classes.DATERANGEPICKER_TIMEPICKERS}>
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
    }

    private handleTimeChange = (newTime: Date, dateIndex: number) => {
        this.props.timePickerProps?.onChange?.(newTime);

        const { value, time } = this.state;
        const newValue = DateUtils.getDateTime(
            value[dateIndex] != null ? DateUtils.clone(value[dateIndex]!) : new Date(),
            newTime,
        );
        const newDateRange: DateRange = [value[0], value[1]];
        newDateRange[dateIndex] = newValue;
        const newTimeRange: DateRange = [time[0], time[1]];
        newTimeRange[dateIndex] = newTime;
        this.props.onChange?.(newDateRange);
        this.setState({ value: newDateRange, time: newTimeRange });
    };

    private handleTimeChangeLeftCalendar = (time: Date) => {
        this.handleTimeChange(time, 0);
    };

    private handleTimeChangeRightCalendar = (time: Date) => {
        this.handleTimeChange(time, 1);
    };

    private renderDayRangePicker(singleMonthOnly: boolean) {
        const { contiguousCalendarMonths, dayPickerProps, maxDate, minDate } = this.props;
        const customComponents: CustomComponents = contiguousCalendarMonths
            ? { Dropdown: DatePicker3Dropdown, IconLeft, IconRight }
            : { Caption: DatePicker3Caption };

        return (
            <DatePicker3Provider {...this.props} {...this.state}>
                <DayPicker
                    modifiers={combineModifiers(this.modifiers, this.props.dayPickerProps?.modifiers)}
                    modifiersClassNames={{ ...dayPickerProps?.modifiersClassNames, ...this.modifiersClassNames }}
                    showOutsideDays={true}
                    {...dayPickerProps}
                    captionLayout="dropdown-buttons"
                    components={{
                        ...customComponents,
                        ...dayPickerProps?.components,
                    }}
                    formatters={{
                        formatWeekdayName: this.renderWeekdayName,
                        ...dayPickerProps?.formatters,
                    }}
                    fromDate={minDate}
                    locale={this.state.locale}
                    mode="range"
                    month={contiguousCalendarMonths ? undefined : this.state.leftView.getFullDate()}
                    numberOfMonths={singleMonthOnly ? 1 : 2}
                    onDayMouseEnter={this.handleDayMouseEnter}
                    onDayMouseLeave={this.handleDayMouseLeave}
                    // onMonthChange={this.handleMonthChange}
                    onSelect={this.handleRangeSelect}
                    selected={dateRangeToDayPickerRange(this.state.value)}
                    toDate={maxDate}
                />
            </DatePicker3Provider>
        );
    }

    /**
     * Custom formatter to render weekday names in the calendar header. The default formatter generally works fine,
     * but it was returning CAPITALIZED strings for some reason, while we prefer Title Case.
     */
    private renderWeekdayName: DateFormatter = date => {
        return format(date, "EEEEEE", { locale: this.state.locale });
    };

    private handleRangeSelect: SelectRangeEventHandler = (range, selectedDay, modifiers, e) => {
        this.props.dayPickerProps?.onSelect?.(range, selectedDay, modifiers, e);

        if (modifiers.disabled) {
            // rerender base component to get around bug where you can navigate past bounds by clicking days
            this.forceUpdate();
            return;
        }

        const nextValue = DateRangeSelectionStrategy.getNextState(
            this.state.value,
            selectedDay,
            this.props.allowSingleDayRange!,
            this.props.boundaryToModify,
        ).dateRange;

        // update the hovered date range after click to show the newly selected
        // state, at leasts until the mouse moves again
        this.handleDayMouseEnter(selectedDay, modifiers, e);

        this.handleNextState(nextValue);
    };

    // private handleMonthChange = (newDate: Date) => {
    //     const date = this.computeValidDateInSpecifiedMonthYear(newDate.getFullYear(), newDate.getMonth());
    //     this.setState({ displayMonth: date.getMonth(), displayYear: date.getFullYear() });
    //     if (this.state.value !== null) {
    //         // if handleDayClick just got run (so this flag is set), then the
    //         // user selected a date in a new month, so don't invoke onChange a
    //         // second time
    //         this.updateValue(date, false, this.ignoreNextMonthChange);
    //         this.ignoreNextMonthChange = false;
    //     }
    //     this.props.dayPickerProps?.onMonthChange?.(date);
    // };

    // private renderCalendars(isShowingOneMonth: boolean) {
    //     const { dayPickerProps, maxDate, minDate, modifiers } = this.props;
    //     const { locale } = this.state;

    //     const dayPickerBaseProps: DayPickerMultipleProps = {
    //         // TODO(@adidahiya): load date-fns locale
    //         locale,
    //         modifiers: combineModifiers(this.modifiers, modifiers),
    //         showOutsideDays: true,
    //         ...dayPickerProps,
    //         onSelect: this.handleDaySelect,
    //         onDayMouseEnter: this.handleDayMouseEnter,
    //         onDayMouseLeave: this.handleDayMouseLeave,
    //         selectedDays: this.state.value,
    //     };

    //     if (isShowingOneMonth) {
    //         return (
    //             <DayPicker
    //                 {...dayPickerBaseProps}
    //                 captionElement={this.renderSingleCaption}
    //                 navbarElement={this.renderSingleNavbar}
    //                 fromDate={minDate}
    //                 month={this.state.leftView.getFullDate()}
    //                 numberOfMonths={1}
    //                 onMonthChange={this.handleLeftMonthChange}
    //                 toDate={maxDate}
    //                 renderDay={dayPickerProps?.renderDay ?? this.renderDay}
    //             />
    //         );
    //     } else {
    //         return (
    //             <div className={Classes.DATERANGEPICKER_CALENDARS}>
    //                 <DayPicker
    //                     key="left"
    //                     {...dayPickerBaseProps}
    //                     disableNavigation={true}
    //                     captionElement={this.renderLeftCaption}
    //                     navbarElement={this.renderLeftNavbar}
    //                     fromDate={minDate}
    //                     month={this.state.leftView.getFullDate()}
    //                     numberOfMonths={1}
    //                     onMonthChange={this.handleLeftMonthChange}
    //                     toDate={DateUtils.getDatePreviousMonth(maxDate!)}
    //                     renderDay={dayPickerProps?.renderDay ?? this.renderDay}
    //                 />
    //                 <DayPicker
    //                     key="right"
    //                     {...dayPickerBaseProps}
    //                     disableNavigation={true}
    //                     captionElement={this.renderRightCaption}
    //                     navbarElement={this.renderRightNavbar}
    //                     fromDate={DateUtils.getDateNextMonth(minDate!)}
    //                     month={this.state.rightView.getFullDate()}
    //                     numberOfMonths={1}
    //                     onMonthChange={this.handleRightMonthChange}
    //                     toDate={maxDate}
    //                     renderDay={dayPickerProps?.renderDay ?? this.renderDay}
    //                 />
    //             </div>
    //         );
    //     }
    // }

    // private renderSingleNavbar = (navbarProps: NavbarElementProps) => (
    //     <DatePickerNavbar {...navbarProps} maxDate={this.props.maxDate} minDate={this.props.minDate} />
    // );

    // private renderLeftNavbar = (navbarProps: NavbarElementProps) => (
    //     <DatePickerNavbar
    //         {...navbarProps}
    //         hideRightNavButton={this.props.contiguousCalendarMonths}
    //         maxDate={this.props.maxDate}
    //         minDate={this.props.minDate}
    //     />
    // );

    // private renderRightNavbar = (navbarProps: NavbarElementProps) => (
    //     <DatePickerNavbar
    //         {...navbarProps}
    //         hideLeftNavButton={this.props.contiguousCalendarMonths}
    //         maxDate={this.props.maxDate}
    //         minDate={this.props.minDate}
    //     />
    // );

    // private renderSingleCaption = (captionProps: CaptionElementProps) => (
    //     <DatePickerCaption
    //         {...captionProps}
    //         maxDate={this.props.maxDate}
    //         minDate={this.props.minDate}
    //         onMonthChange={this.handleLeftMonthSelectChange}
    //         onYearChange={this.handleLeftYearSelectChange}
    //         reverseMonthAndYearMenus={this.props.reverseMonthAndYearMenus}
    //     />
    // );

    // private renderLeftCaption = (captionProps: CaptionElementProps) => (
    //     <DatePickerCaption
    //         {...captionProps}
    //         maxDate={DateUtils.getDatePreviousMonth(this.props.maxDate)}
    //         minDate={this.props.minDate}
    //         onMonthChange={this.handleLeftMonthSelectChange}
    //         onYearChange={this.handleLeftYearSelectChange}
    //         reverseMonthAndYearMenus={this.props.reverseMonthAndYearMenus}
    //     />
    // );

    // private renderRightCaption = (captionProps: CaptionElementProps) => (
    //     <DatePickerCaption
    //         {...captionProps}
    //         maxDate={this.props.maxDate}
    //         minDate={DateUtils.getDateNextMonth(this.props.minDate)}
    //         onMonthChange={this.handleRightMonthSelectChange}
    //         onYearChange={this.handleRightYearSelectChange}
    //         reverseMonthAndYearMenus={this.props.reverseMonthAndYearMenus}
    //     />
    // );

    private handleDayMouseEnter = (day: Date, modifiers: ActiveModifiers, e: React.MouseEvent) => {
        this.props.dayPickerProps?.onDayMouseEnter?.(day, modifiers, e);

        if (modifiers.disabled) {
            return;
        }
        const { dateRange, boundary } = DateRangeSelectionStrategy.getNextState(
            this.state.value,
            day,
            this.props.allowSingleDayRange!,
            this.props.boundaryToModify,
        );
        this.setState({ hoverValue: dateRange });
        this.props.onHoverChange?.(dateRange, day, boundary);
    };

    private handleDayMouseLeave = (day: Date, modifiers: ActiveModifiers, e: React.MouseEvent) => {
        this.props.dayPickerProps?.onDayMouseLeave?.(day, modifiers, e);
        if (modifiers.disabled) {
            return;
        }
        this.setState({ hoverValue: undefined });
        this.props.onHoverChange?.(undefined, day, undefined);
    };

    // private handleDaySelect = (
    //     range: RDPRange | undefined,
    //     selectedDay: Date,
    //     modifiers: ActiveModifiers,
    //     e: React.MouseEvent,
    // ) => {
    //     this.props.dayPickerProps?.onSelect?.(range, selectedDay, modifiers, e);

    //     if (modifiers.disabled) {
    //         // rerender base component to get around bug where you can navigate past bounds by clicking days
    //         this.forceUpdate();
    //         return;
    //     }

    //     const nextValue = DateRangeSelectionStrategy.getNextState(
    //         this.state.value,
    //         selectedDay,
    //         this.props.allowSingleDayRange!,
    //         this.props.boundaryToModify,
    //     ).dateRange;

    //     // update the hovered date range after click to show the newly selected
    //     // state, at leasts until the mouse moves again
    //     this.handleDayMouseEnter(selectedDay, modifiers, e);

    //     this.handleNextState(nextValue);
    // };

    private handleShortcutClick = (shortcut: DateRangeShortcut, selectedShortcutIndex: number) => {
        const { onChange, contiguousCalendarMonths, onShortcutChange } = this.props;
        const { dateRange, includeTime } = shortcut;
        if (includeTime) {
            const newDateRange: DateRange = [dateRange[0], dateRange[1]];
            const newTimeRange: DateRange = [dateRange[0], dateRange[1]];
            const nextState = getStateChange(this.state.value, dateRange, this.state, contiguousCalendarMonths!);
            this.setState({ ...nextState, time: newTimeRange });
            onChange?.(newDateRange);
        } else {
            this.handleNextState(dateRange);
        }

        if (this.props.selectedShortcutIndex === undefined) {
            this.setState({ selectedShortcutIndex });
        }

        onShortcutChange?.(shortcut, selectedShortcutIndex);
    };

    private handleNextState = (nextValue: DateRange) => {
        const { value } = this.state;
        nextValue[0] = DateUtils.getDateTime(nextValue[0], this.state.time[0]);
        nextValue[1] = DateUtils.getDateTime(nextValue[1], this.state.time[1]);

        const nextState = getStateChange(value, nextValue, this.state, this.props.contiguousCalendarMonths!);

        if (this.props.value == null) {
            this.setState(nextState);
        }
        this.props.onChange?.(nextValue);
    };

    private handleLeftMonthChange = (newDate: Date) => {
        const leftView = MonthAndYear.fromDate(newDate);
        this.props.dayPickerProps?.onMonthChange?.(leftView.getFullDate());
        this.updateLeftView(leftView);
    };

    private handleRightMonthChange = (newDate: Date) => {
        const rightView = MonthAndYear.fromDate(newDate);
        this.props.dayPickerProps?.onMonthChange?.(rightView.getFullDate());
        this.updateRightView(rightView);
    };

    // private handleLeftMonthSelectChange = (leftMonth: number) => {
    //     const leftView = new MonthAndYear(leftMonth, this.state.leftView.getYear());
    //     this.props.dayPickerProps?.onMonthChange?.(leftView.getFullDate());
    //     this.updateLeftView(leftView);
    // };

    // private handleRightMonthSelectChange = (rightMonth: number) => {
    //     const rightView = new MonthAndYear(rightMonth, this.state.rightView.getYear());
    //     this.props.dayPickerProps?.onMonthChange?.(rightView.getFullDate());
    //     this.updateRightView(rightView);
    // };

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

    // /*
    //  * The min / max months are offset by one because we are showing two months.
    //  * We do a comparison check to see if
    //  *   a) the proposed [Month, Year] change throws the two calendars out of order
    //  *   b) the proposed [Month, Year] goes beyond the min / max months
    //  * and rectify appropriately.
    //  */
    // private handleLeftYearSelectChange = (leftDisplayYear: number) => {
    //     let leftView = new MonthAndYear(this.state.leftView.getMonth(), leftDisplayYear);
    //     this.props.dayPickerProps?.onMonthChange?.(leftView.getFullDate());
    //     const { minDate, maxDate } = this.props;
    //     const adjustedMaxDate = DateUtils.getDatePreviousMonth(maxDate!);

    //     const minMonthAndYear = new MonthAndYear(minDate!.getMonth(), minDate!.getFullYear());
    //     const maxMonthAndYear = new MonthAndYear(adjustedMaxDate.getMonth(), adjustedMaxDate.getFullYear());

    //     if (leftView.isBefore(minMonthAndYear)) {
    //         leftView = minMonthAndYear;
    //     } else if (leftView.isAfter(maxMonthAndYear)) {
    //         leftView = maxMonthAndYear;
    //     }

    //     let rightView = this.state.rightView.clone();
    //     if (!leftView.isBefore(rightView) || this.props.contiguousCalendarMonths) {
    //         rightView = leftView.getNextMonth();
    //     }

    //     this.setViews(leftView, rightView);
    // };

    // private handleRightYearSelectChange = (rightDisplayYear: number) => {
    //     let rightView = new MonthAndYear(this.state.rightView.getMonth(), rightDisplayYear);
    //     this.props.dayPickerProps?.onMonthChange?.(rightView.getFullDate());
    //     const { minDate, maxDate } = this.props;
    //     const adjustedMinDate = DateUtils.getDateNextMonth(minDate!);

    //     const minMonthAndYear = MonthAndYear.fromDate(adjustedMinDate);
    //     const maxMonthAndYear = MonthAndYear.fromDate(maxDate!);

    //     if (rightView.isBefore(minMonthAndYear)) {
    //         rightView = minMonthAndYear;
    //     } else if (rightView.isAfter(maxMonthAndYear)) {
    //         rightView = maxMonthAndYear;
    //     }

    //     let leftView = this.state.leftView.clone();
    //     if (!rightView.isAfter(leftView) || this.props.contiguousCalendarMonths) {
    //         leftView = rightView.getPreviousMonth();
    //     }

    //     this.setViews(leftView, rightView);
    // };

    // private setViews(leftView: MonthAndYear, rightView: MonthAndYear) {
    //     this.setState({ leftView, rightView });
    // }
}

function getStateChange(
    value: DateRange | undefined,
    nextValue: DateRange | undefined,
    state: DateRangePicker3State,
    contiguousCalendarMonths: boolean,
): Partial<DateRangePicker3State> {
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
            if (nextValueStartView.isSame(nextValueEndView)) {
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

function getInitialValue(props: DateRangePicker3Props): DateRange {
    if (props.value != null) {
        return props.value;
    }
    if (props.defaultValue != null) {
        return props.defaultValue;
    }
    return [null, null];
}

function getInitialMonth(props: DateRangePicker3Props, value: DateRange): Date {
    const today = new Date();
    // != because we must have a real `Date` to begin the calendar on.
    if (props.initialMonth != null) {
        return props.initialMonth;
    } else if (value[0] != null) {
        return DateUtils.clone(value[0]);
    } else if (value[1] != null) {
        const month = DateUtils.clone(value[1]);
        if (!DateUtils.isSameMonth(month, props.minDate!)) {
            month.setMonth(month.getMonth() - 1);
        }
        return month;
    } else if (DateUtils.isDayInRange(today, [props.minDate!, props.maxDate!])) {
        return today;
    } else {
        return DateUtils.getDateBetween([props.minDate!, props.maxDate!]);
    }
}

function dateRangeToDayPickerRange(range: DateRange): RDPRange {
    return { from: range[0] ?? undefined, to: range[1] ?? undefined };
}
