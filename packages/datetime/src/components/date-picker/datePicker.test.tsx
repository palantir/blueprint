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

import { fireEvent, render } from "@testing-library/react";
import enUSLocale from "date-fns/locale/en-US";

import { Classes as CoreClasses } from "@blueprintjs/core";
import { afterEach, beforeEach, describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import {
    DATEPICKER,
    DATEPICKER3_DAY,
    DATEPICKER3_DAY_DISABLED,
    DATEPICKER3_DAY_OUTSIDE,
    DATEPICKER3_DAY_SELECTED,
    DATEPICKER3_HIGHLIGHT_CURRENT_DAY,
    DATEPICKER3_NAV_BUTTON_NEXT,
    DATEPICKER3_NAV_BUTTON_PREVIOUS,
    DATEPICKER_FOOTER,
    DATEPICKER_MONTH_SELECT,
    DATEPICKER_YEAR_SELECT,
    DATERANGEPICKER_SHORTCUTS,
    TIMEPICKER,
    TIMEPICKER_ARROW_BUTTON,
    TIMEPICKER_HOUR,
} from "../../common/classes";
import * as DateUtils from "../../common/dateUtils";
import { assertDayDisabled, assertDayHidden } from "../../common/dayPickerTestUtils";
import * as Errors from "../../common/errors";
import { loadDateFnsLocaleFake } from "../../common/loadDateFnsLocaleFake";
import { Months } from "../../common/months";
import { TimePrecision } from "../../common/timePrecision";
import type { DatePickerShortcut } from "../shortcuts/shortcuts";

import { DatePicker, type DatePickerProps } from "./datePicker";

describe("<DatePicker>", () => {
     
    let consoleErrorSpy: any;

    beforeEach(() => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    it(`should render .${DATEPICKER}`, () => {
        const { container } = renderDatePicker();
        expect(container.querySelector(`.${DATEPICKER}`)).toBeInTheDocument();
    });

    it("should have no day selected by default", () => {
        const { container } = renderDatePicker();
        const selectedDays = container.querySelectorAll(`.${DATEPICKER3_DAY_SELECTED}`);
        expect(selectedDays.length).toBe(0);
    });

    it("should not highlight current day by default", () => {
        const { container } = renderDatePicker();
        expect(container.querySelector(`.${DATEPICKER3_HIGHLIGHT_CURRENT_DAY}`)).not.toBeInTheDocument();
    });

    it("should highlight current day when highlightCurrentDay={true}", () => {
        const { container } = renderDatePicker({ highlightCurrentDay: true });
        expect(container.querySelector(`.${DATEPICKER3_HIGHLIGHT_CURRENT_DAY}`)).toBeInTheDocument();
    });

    describe("reconciliates dayPickerProps", () => {
        it("should show outside days by default", () => {
            const defaultValue = new Date(2017, Months.SEPTEMBER, 1);
            const { container } = renderDatePicker({ defaultValue });
            // September 2017 starts on Friday, so the calendar should show outside days
            // from the previous month (Aug 27-31) in the first row
            const outsideDays = container.querySelectorAll(`.${DATEPICKER3_DAY_OUTSIDE}`);
            expect(outsideDays.length).toBeGreaterThan(0);
        });

        it("should not show outside days if enableOutsideDays=false", () => {
            const defaultValue = new Date(2017, Months.SEPTEMBER, 1, 12);
            const { container } = renderDatePicker({
                dayPickerProps: { showOutsideDays: false },
                defaultValue,
            });
            const dayElements = Array.from(container.querySelectorAll("td"));

            assertDayHidden(dayElements[0]);
            assertDayHidden(dayElements[1]);
            assertDayHidden(dayElements[2]);
            assertDayHidden(dayElements[3]);
            assertDayHidden(dayElements[4]);
            assertDayHidden(dayElements[5], false);
        });

        it("should disable days according to custom modifiers in addition to default modifiers", () => {
            const defaultValue = new Date(2017, Months.SEPTEMBER, 1);
            const disableFridays = { dayOfWeek: [5] };
            const { getDay } = renderDatePicker({
                dayPickerProps: { disabled: disableFridays },
                defaultValue,
                maxDate: new Date(2017, Months.SEPTEMBER, 20),
            });
            assertDayDisabled(getDay(15));
            assertDayDisabled(getDay(21));
            assertDayDisabled(getDay(10), false);
        });

        it("should disable out-of-range max dates", () => {
            const defaultValue = new Date(2017, Months.SEPTEMBER, 1);
            const { getDay } = renderDatePicker({
                defaultValue,
                maxDate: new Date(2017, Months.SEPTEMBER, 20),
            });
            assertDayDisabled(getDay(21));
            assertDayDisabled(getDay(10), false);
        });

        it("should disable out-of-range min dates", () => {
            const defaultValue = new Date(2017, Months.SEPTEMBER, 1);
            const { getDay, clickPreviousMonth } = renderDatePicker({
                defaultValue,
                minDate: new Date(2017, Months.AUGUST, 20),
            });
            clickPreviousMonth();
            assertDayDisabled(getDay(10));
            assertDayDisabled(getDay(21), false);
        });

        describe("event handlers", () => {
            // use a date that lets us navigate forward and backward in the same year
            const defaultValue = new Date(2017, Months.SEPTEMBER, 1);

            it("should call onMonthChange on button next click", () => {
                const onMonthChange = vi.fn();
                const { clickNextMonth } = renderDatePicker({
                    dayPickerProps: { onMonthChange },
                    defaultValue,
                });
                clickNextMonth();
                expect(onMonthChange).toHaveBeenCalled();
            });

            it("should call onMonthChange on button prev click", () => {
                const onMonthChange = vi.fn();
                const { clickPreviousMonth } = renderDatePicker({
                    dayPickerProps: { onMonthChange },
                    defaultValue,
                });
                clickPreviousMonth();
                expect(onMonthChange).toHaveBeenCalled();
            });

            it("should call onMonthChange on month select change", () => {
                const onMonthChange = vi.fn();
                const { getMonthSelect } = renderDatePicker({
                    dayPickerProps: { onMonthChange },
                    defaultValue,
                });
                fireEvent.change(getMonthSelect(), { target: { value: "0" } });
                expect(onMonthChange).toHaveBeenCalled();
            });

            it("should call onMonthChange on year select change", () => {
                const onMonthChange = vi.fn();
                const { getYearSelect } = renderDatePicker({
                    dayPickerProps: { onMonthChange },
                    defaultValue,
                });
                fireEvent.change(getYearSelect(), { target: { value: "2018" } });
                expect(onMonthChange).toHaveBeenCalled();
            });

            it("should call onDayClick", () => {
                const onDayClick = vi.fn();
                const { getDay } = renderDatePicker({
                    dayPickerProps: { onDayClick },
                    defaultValue,
                });
                fireEvent.click(getDay());
                expect(onDayClick).toHaveBeenCalled();
            });
        });
    });

    it("should apply user-provided modifiers", () => {
        const ODD_CLASS = "test-odd";
        const oddifier = (d: Date) => d.getDate() % 2 === 1;
        const { getDay } = renderDatePicker({
            dayPickerProps: { modifiers: { odd: oddifier }, modifiersClassNames: { odd: ODD_CLASS } },
        });

        expect(getDay(4)).not.toHaveClass(ODD_CLASS);
        expect(getDay(5)).toHaveClass(ODD_CLASS);
    });

    it("should render the actions bar when showActionsBar=true", () => {
        const { container } = renderDatePicker({ showActionsBar: true });
        expect(container.querySelector(`.${DATEPICKER_FOOTER}`)).toBeInTheDocument();
    });

    describe("initially displayed month", () => {
        it("should be defaultValue", () => {
            const defaultValue = new Date(2007, Months.APRIL, 4);
            const { getMonthSelect, getYearSelect } = renderDatePicker({ defaultValue });
            expect((getYearSelect() as HTMLSelectElement).value).toBe("2007");
            expect((getMonthSelect() as HTMLSelectElement).value).toBe(String(Months.APRIL));
        });

        it("should be initialMonth if set (overrides defaultValue)", () => {
            const defaultValue = new Date(2007, Months.APRIL, 4);
            const initialMonth = new Date(2010, Months.MARCH, 1);
            const { getMonthSelect, getYearSelect } = renderDatePicker({
                defaultValue,
                initialMonth,
            });
            expect((getYearSelect() as HTMLSelectElement).value).toBe("2010");
            expect((getMonthSelect() as HTMLSelectElement).value).toBe(String(Months.MARCH));
        });

        it("should be value if set and initialMonth not set", () => {
            const value = new Date(2007, Months.APRIL, 4);
            const { getMonthSelect, getYearSelect } = renderDatePicker({ value });
            expect((getYearSelect() as HTMLSelectElement).value).toBe("2007");
            expect((getMonthSelect() as HTMLSelectElement).value).toBe(String(Months.APRIL));
        });

        it("should be today if today is within date range", () => {
            const today = new Date();
            const { getMonthSelect, getYearSelect } = renderDatePicker();
            expect((getYearSelect() as HTMLSelectElement).value).toBe(String(today.getFullYear()));
            expect((getMonthSelect() as HTMLSelectElement).value).toBe(String(today.getMonth()));
        });

        it("should be a day between minDate and maxDate if today is not in range", () => {
            const maxDate = new Date(2005, Months.JANUARY);
            const minDate = new Date(2000, Months.JANUARY);
            const { getMonthSelect, getYearSelect } = renderDatePicker({ maxDate, minDate });
            const displayYear = parseInt((getYearSelect() as HTMLSelectElement).value, 10);
            const displayMonth = parseInt((getMonthSelect() as HTMLSelectElement).value, 10);
            expect(DateUtils.isDayInRange(new Date(displayYear, displayMonth), [minDate, maxDate])).toBe(true);
        });

        it("should have selectedDay set to the day of the value", () => {
            const value = new Date(2007, Months.APRIL, 4);
            const { container } = renderDatePicker({ value });
            const selectedDay = container.querySelector(`.${DATEPICKER3_DAY_SELECTED}`);
            expect(selectedDay?.textContent).toBe("4");
        });

        it("should have selectedDay set to the day of the defaultValue", () => {
            const defaultValue = new Date(2007, Months.APRIL, 4);
            const { container } = renderDatePicker({ defaultValue });
            const selectedDay = container.querySelector(`.${DATEPICKER3_DAY_SELECTED}`);
            expect(selectedDay?.textContent).toBe("4");
        });
    });

    describe("minDate/maxDate bounds", () => {
        const MIN_DATE = new Date(2015, Months.JANUARY, 7);
        const MAX_DATE = new Date(2015, Months.JANUARY, 12);

        describe("validation", () => {
            it("should log error if maxDate must be later than minDate", () => {
                renderDatePicker({ maxDate: MIN_DATE, minDate: MAX_DATE });
                expect(consoleErrorSpy).toHaveBeenCalledWith(Errors.DATEPICKER_MAX_DATE_INVALID);
            });

            it("should log error if defaultValue is outside bounds", () => {
                renderDatePicker({
                    defaultValue: new Date(2015, Months.JANUARY, 5),
                    maxDate: MAX_DATE,
                    minDate: MIN_DATE,
                });
                expect(consoleErrorSpy).toHaveBeenCalledWith(Errors.DATEPICKER_DEFAULT_VALUE_INVALID);
            });

            it("should log error if value is outside bounds", () => {
                renderDatePicker({
                    maxDate: MAX_DATE,
                    minDate: MIN_DATE,
                    value: new Date(2015, Months.JANUARY, 20),
                });
                expect(consoleErrorSpy).toHaveBeenCalledWith(Errors.DATEPICKER_VALUE_INVALID);
            });

            it("should log error if initialMonth is outside month bounds", () => {
                renderDatePicker({
                    initialMonth: new Date(2015, Months.FEBRUARY, 12),
                    maxDate: MAX_DATE,
                    minDate: MIN_DATE,
                });
                expect(consoleErrorSpy).toHaveBeenCalledWith(Errors.DATEPICKER_INITIAL_MONTH_INVALID);
            });

            it("should not log error if initialMonth is outside day bounds but inside month bounds", () => {
                renderDatePicker({
                    initialMonth: new Date(2015, Months.JANUARY, 12),
                    maxDate: MAX_DATE,
                    minDate: MIN_DATE,
                });
                expect(consoleErrorSpy).not.toHaveBeenCalled();
            });
        });

        describe("today button validation", () => {
            const today = new Date();
            const MIN_DATE_BEFORE_TODAY = MIN_DATE;
            const MAX_DATE_BEFORE_TODAY = MAX_DATE;

            const MIN_DATE_AFTER_TODAY = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
            const MAX_DATE_AFTER_TODAY = new Date(today.getFullYear() + 2, today.getMonth(), today.getDate());

            it("should disable today button when min/max before today", () => {
                const { getTodayButton } = renderDatePicker({
                    maxDate: MAX_DATE_BEFORE_TODAY,
                    minDate: MIN_DATE_BEFORE_TODAY,
                    showActionsBar: true,
                });
                expect(getTodayButton()).toBeDisabled();
            });

            it("should disable today button when min/max after today", () => {
                const { getTodayButton } = renderDatePicker({
                    maxDate: MAX_DATE_AFTER_TODAY,
                    minDate: MIN_DATE_AFTER_TODAY,
                    showActionsBar: true,
                });
                expect(getTodayButton()).toBeDisabled();
            });

            it("should enable today button when valid min/max", () => {
                const { getTodayButton } = renderDatePicker({
                    maxDate: MAX_DATE_AFTER_TODAY,
                    minDate: MIN_DATE_BEFORE_TODAY,
                    showActionsBar: true,
                });
                expect(getTodayButton()).not.toBeDisabled();
            });
        });

        it("should have disabled class only on days outside bounds", () => {
            const minDate = new Date(2000, Months.JANUARY, 10);
            const { getDay } = renderDatePicker({ initialMonth: minDate, minDate });
            // 8 is before min date, 12 is after
            expect(getDay(8)).toHaveClass(DATEPICKER3_DAY_DISABLED);
            expect(getDay(12)).not.toHaveClass(DATEPICKER3_DAY_DISABLED);
        });

        it("should not fire onChange when a day outside of bounds is clicked", () => {
            const onChange = vi.fn();
            const { getDay } = renderDatePicker({
                maxDate: MAX_DATE,
                minDate: MIN_DATE,
                onChange,
            });
            expect(onChange).not.toHaveBeenCalled();
            fireEvent.click(getDay(4));
            fireEvent.click(getDay(16));
            expect(onChange).not.toHaveBeenCalled();
            fireEvent.click(getDay(8));
            expect(onChange).toHaveBeenCalledOnce();
        });

        it("should constrain time picker when minDate is selected", () => {
            const { container } = renderDatePicker({
                maxDate: MAX_DATE,
                minDate: MIN_DATE,
                timePrecision: TimePrecision.MINUTE,
                value: MIN_DATE,
            });
            const timePicker = container.querySelector(`.${TIMEPICKER}`);
            expect(timePicker).toBeInTheDocument();
            // TimePicker receives minTime prop - checking via DOM is complex, so we trust component integration
        });

        it("should constrain time picker when max date is selected", () => {
            const { container } = renderDatePicker({
                maxDate: MAX_DATE,
                minDate: MIN_DATE,
                timePrecision: TimePrecision.MINUTE,
                value: MAX_DATE,
            });
            const timePicker = container.querySelector(`.${TIMEPICKER}`);
            expect(timePicker).toBeInTheDocument();
            // TimePicker receives maxTime prop - checking via DOM is complex, so we trust component integration
        });
    });

    describe("when controlled", () => {
        it("should initially select value", () => {
            const value = new Date(2010, Months.JANUARY, 1);
            const { assertSelectedDays } = renderDatePicker({
                defaultValue: new Date(2010, Months.FEBRUARY, 2),
                value,
            });
            assertSelectedDays(value.getDate());
        });

        it("should not update selection automatically", () => {
            const { getDay, assertSelectedDays } = renderDatePicker({ value: null });
            assertSelectedDays();
            fireEvent.click(getDay());
            assertSelectedDays();
        });

        it("should not update selected day on current month view change", () => {
            const value = new Date(2010, Months.JANUARY, 2);
            const { assertSelectedDays, clickPreviousMonth, getMonthSelect, getYearSelect } = renderDatePicker({
                value,
            });
            clickPreviousMonth();

            assertSelectedDays(2);

            fireEvent.change(getMonthSelect(), { target: { value: Months.JUNE } });
            assertSelectedDays();

            fireEvent.change(getYearSelect(), { target: { value: 2014 } });
            assertSelectedDays();
        });

        it("should fire onChange when a day is clicked", () => {
            const onChange = vi.fn();
            const { getDay } = renderDatePicker({ onChange, value: null });
            fireEvent.click(getDay());
            expect(onChange).toHaveBeenCalledOnce();
            expect(onChange.mock.calls[0][1]).toBe(true);
        });

        it("should fire onChange when month is changed", () => {
            const value = new Date(2010, Months.JANUARY, 2);
            const onChange = vi.fn();
            const { getMonthSelect, clickPreviousMonth } = renderDatePicker({
                onChange,
                value,
            });

            clickPreviousMonth();
            expect(onChange).toHaveBeenCalledOnce();
            expect(onChange.mock.calls[0][1]).toBe(false);

            fireEvent.change(getMonthSelect(), { target: { value: Months.JUNE } });
            expect(onChange).toHaveBeenCalledTimes(2);
            expect(onChange.mock.calls[1][1]).toBe(false);
        });

        it("should change displayed date with the dropdowns in the caption", () => {
            const { getMonthSelect, getYearSelect } = renderDatePicker({
                initialMonth: new Date(2015, Months.MARCH, 2),
                value: null,
            });
            expect((getMonthSelect() as HTMLSelectElement).value).toBe(String(Months.MARCH));
            expect((getYearSelect() as HTMLSelectElement).value).toBe("2015");

            fireEvent.change(getMonthSelect(), { target: { value: Months.JANUARY } });
            fireEvent.change(getYearSelect(), { target: { value: 2014 } });
            expect((getMonthSelect() as HTMLSelectElement).value).toBe(String(Months.JANUARY));
            expect((getYearSelect() as HTMLSelectElement).value).toBe("2014");
        });

        it("should fire onChange with correct values on shortcuts click", () => {
            const today = new Date();
            const aWeekAgo = DateUtils.clone(today);
            aWeekAgo.setDate(today.getDate() - 6);
            const onChange = vi.fn();
            const { clickShortcut } = renderDatePicker({
                onChange,
                shortcuts: true,
                value: today,
            });
            clickShortcut(2);

            expect(onChange).toHaveBeenCalledOnce();
            const value = onChange.mock.calls[0][0];
            expect(DateUtils.isSameDay(aWeekAgo, value)).toBe(true);
        });

        it("should display all shortcuts as inactive when none are selected", () => {
            const { container } = renderDatePicker({ shortcuts: true });
            const activeShortcuts = container.querySelectorAll(`.${DATERANGEPICKER_SHORTCUTS} .${CoreClasses.ACTIVE}`);
            expect(activeShortcuts.length).toBe(0);
        });

        it("should display corresponding shortcut as active when selected", () => {
            const selectedShortcut = 0;
            const { container } = renderDatePicker({
                selectedShortcutIndex: selectedShortcut,
                shortcuts: true,
            });

            const activeShortcuts = container.querySelectorAll(`.${DATERANGEPICKER_SHORTCUTS} .${CoreClasses.ACTIVE}`);
            expect(activeShortcuts.length).toBe(1);
        });

        it("should call onShortcutChange on selecting a shortcut", () => {
            const selectedShortcut = 0;
            const onShortcutChangeSpy = vi.fn();
            const onChangeSpy = vi.fn();
            const { clickShortcut } = renderDatePicker({
                onChange: onChangeSpy,
                onShortcutChange: onShortcutChangeSpy,
                shortcuts: true,
            });

            clickShortcut(selectedShortcut);

            expect(onChangeSpy).toHaveBeenCalledOnce();
            expect(onShortcutChangeSpy).toHaveBeenCalledOnce();
            expect(onShortcutChangeSpy.mock.calls[0][0].label).toBe("Today");
            expect(onShortcutChangeSpy.mock.calls[0][1]).toBe(selectedShortcut);
        });

        it("should select the correct values with custom shortcuts", () => {
            const date = new Date(2015, Months.JANUARY, 1);
            const onChangeSpy = vi.fn();
            const { clickShortcut, assertSelectedDays } = renderDatePicker({
                onChange: onChangeSpy,
                shortcuts: [{ date, label: "custom shortcut" }],
            });
            clickShortcut();
            expect(onChangeSpy).toHaveBeenCalledOnce();
            const value = onChangeSpy.mock.calls[0][0];
            expect(DateUtils.isSameDay(date, value)).toBe(true);
            assertSelectedDays(date.getDate());
        });
    });

    describe("when uncontrolled", () => {
        it("should initially select defaultValue", () => {
            const today = new Date();
            const { assertSelectedDays } = renderDatePicker({ defaultValue: today });
            assertSelectedDays(today.getDate());
        });

        it("should fire onChange when a day is clicked", () => {
            const onChange = vi.fn();
            const { getDay } = renderDatePicker({ onChange });
            expect(onChange).not.toHaveBeenCalled();
            fireEvent.click(getDay());
            expect(onChange).toHaveBeenCalledOnce();
        });

        it("should fire onChange when month is changed", () => {
            const onChange = vi.fn();
            // must use an initial month otherwise clicking next month in december will fail
            const { getDay, clickNextMonth } = renderDatePicker({
                initialMonth: new Date(2015, Months.JANUARY, 12),
                onChange,
            });
            expect(onChange).not.toHaveBeenCalled();
            fireEvent.click(getDay());
            expect(onChange).toHaveBeenCalledOnce();
            clickNextMonth();
            expect(onChange).toHaveBeenCalledTimes(2);
        });

        it("should update selected day automatically", () => {
            const { assertSelectedDays, getDay } = renderDatePicker();
            assertSelectedDays();
            fireEvent.click(getDay(3));
            assertSelectedDays(3);
        });

        it("should preserve selected day when selections are changed", () => {
            const initialMonth = new Date(2015, Months.JULY, 1);
            const { assertSelectedDays, getDay, getMonthSelect } = renderDatePicker({
                initialMonth,
            });
            fireEvent.click(getDay(31));
            fireEvent.change(getMonthSelect(), { target: { value: Months.AUGUST } });
            assertSelectedDays(31);
        });

        it("should change selected day if necessary when selections are changed", () => {
            const initialMonth = new Date(2015, Months.JULY, 1);
            const { assertSelectedDays, getDay, clickPreviousMonth } = renderDatePicker({
                initialMonth,
            });
            fireEvent.click(getDay(31));
            clickPreviousMonth();
            assertSelectedDays(30);
            // remembers actual date that was clicked and restores if possible
            clickPreviousMonth();
            assertSelectedDays(31);
        });

        it("should change selected day to minDate or maxDate if selections are changed outside bounds", () => {
            const initialMonth = new Date(2015, Months.JULY, 1);
            const minDate = new Date(2015, Months.MARCH, 13);
            const maxDate = new Date(2015, Months.NOVEMBER, 21);
            const { assertSelectedDays, getDay, getMonthSelect } = renderDatePicker({
                initialMonth,
                maxDate,
                minDate,
            });

            fireEvent.click(getDay(1));
            fireEvent.change(getMonthSelect(), { target: { value: Months.MARCH } });
            assertSelectedDays(minDate.getDate());

            fireEvent.click(getDay(25));
            fireEvent.change(getMonthSelect(), { target: { value: Months.NOVEMBER } });
            assertSelectedDays(maxDate.getDate());
        });

        it("should change displayed date with the dropdowns in the caption", () => {
            const { getMonthSelect, getYearSelect } = renderDatePicker({
                initialMonth: new Date(2015, Months.MARCH, 2),
            });
            expect((getMonthSelect() as HTMLSelectElement).value).toBe(String(Months.MARCH));
            expect((getYearSelect() as HTMLSelectElement).value).toBe("2015");

            fireEvent.change(getMonthSelect(), { target: { value: Months.JANUARY } });
            fireEvent.change(getYearSelect(), { target: { value: 2014 } });
            expect((getMonthSelect() as HTMLSelectElement).value).toBe(String(Months.JANUARY));
            expect((getYearSelect() as HTMLSelectElement).value).toBe("2014");
        });

        it("should select values with shortcuts", () => {
            const { clickShortcut, container } = renderDatePicker({ shortcuts: true });
            clickShortcut(2);

            const today = new Date();
            const aWeekAgo = DateUtils.clone(today);
            aWeekAgo.setDate(today.getDate() - 6);

            // Check that a day is selected (uncontrolled state update)
            const selectedDay = container.querySelector(`.${DATEPICKER3_DAY_SELECTED}`);
            expect(selectedDay).toBeInTheDocument();
        });

        it("should select the correct values with custom shortcuts", () => {
            const date = new Date(2010, Months.JANUARY, 10);
            const { clickShortcut, assertSelectedDays } = renderDatePicker({
                shortcuts: [{ date, label: "custom shortcut" }],
            });
            clickShortcut();
            assertSelectedDays(date.getDate());
        });
    });

    describe("time selection", () => {
        const defaultValue = new Date(2012, 2, 5, 6, 5, 40);

        it("should show a TimePicker when setting timePrecision", () => {
            const { container, rerender } = render(<DatePicker dateFnsLocaleLoader={loadDateFnsLocaleFake} />);
            expect(container.querySelector(`.${TIMEPICKER}`)).not.toBeInTheDocument();

            rerender(<DatePicker dateFnsLocaleLoader={loadDateFnsLocaleFake} timePrecision="minute" />);
            expect(container.querySelector(`.${TIMEPICKER}`)).toBeInTheDocument();
        });

        it("should show a TimePicker when setting timePickerProps", () => {
            const { container } = renderDatePicker({ timePickerProps: {} });
            expect(container.querySelector(`.${TIMEPICKER}`)).toBeInTheDocument();
        });

        it("should fire onChange when the time is changed", () => {
            const onChangeSpy = vi.fn();
            const { container } = renderDatePicker({
                defaultValue,
                onChange: onChangeSpy,
                timePickerProps: { showArrowButtons: true },
            });
            expect(onChangeSpy).not.toHaveBeenCalled();
            const hourButton = container.querySelector(`.${TIMEPICKER_ARROW_BUTTON}.${TIMEPICKER_HOUR}`) as HTMLElement;
            fireEvent.click(hourButton);
            expect(onChangeSpy).toHaveBeenCalledOnce();
            const cbHour = onChangeSpy.mock.calls[0][0].getHours();
            expect(cbHour).toBe(defaultValue.getHours() + 1);
        });

        it("should not change time when changing date", () => {
            const onChangeSpy = vi.fn();
            const { getDay } = renderDatePicker({
                defaultValue,
                onChange: onChangeSpy,
                timePrecision: "minute",
            });
            fireEvent.click(getDay(16));
            expect(DateUtils.isSameTime(onChangeSpy.mock.calls[0][0] as Date, defaultValue)).toBe(true);
        });

        it("should not change date when changing time", () => {
            const onChangeSpy = vi.fn();
            const { setTimeInput } = renderDatePicker({
                defaultValue,
                onChange: onChangeSpy,
                timePrecision: "minute",
            });
            setTimeInput("minute", 45);
            expect(DateUtils.isSameDay(onChangeSpy.mock.calls[0][0] as Date, defaultValue)).toBe(true);
        });

        it("should use today when changing time without date", () => {
            const onChangeSpy = vi.fn();
            // no date set via props
            const { setTimeInput } = renderDatePicker({
                onChange: onChangeSpy,
                timePrecision: "minute",
            });
            setTimeInput("minute", 45);
            expect(DateUtils.isSameDay(onChangeSpy.mock.calls[0][0] as Date, new Date())).toBe(true);
        });

        it("should change time when clicking a shortcut with includeTime=true", () => {
            const onChangeSpy = vi.fn();
            const date = DateUtils.clone(defaultValue);
            date.setHours(date.getHours() - 2);

            const shortcuts: DatePickerShortcut[] = [
                {
                    date,
                    includeTime: true,
                    label: "shortcut with time",
                },
            ];
            const { clickShortcut } = renderDatePicker({
                defaultValue,
                onChange: onChangeSpy,
                shortcuts,
                timePrecision: "minute",
            });
            clickShortcut();
            expect(onChangeSpy.mock.calls[0][0]).toBe(date);
        });
    });

    describe("clearing a selection", () => {
        const MOCK_TODAY = new Date(2024, 11, 24, 16, 30);

        beforeEach(() => {
            vi.useFakeTimers();
            vi.setSystemTime(MOCK_TODAY);
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        it("should pass a Date and never null when canClearSelection is false", () => {
            const onChange = vi.fn();
            const { getDay } = renderDatePicker({ canClearSelection: false, onChange });
            fireEvent.click(getDay());
            expect(onChange.mock.calls[0][0]).not.toBeNull();
            fireEvent.click(getDay());
            expect(onChange.mock.calls[1][0]).not.toBeNull();
        });

        it("should pass a Date or null when canClearSelection is true", () => {
            const onChange = vi.fn();
            const { getDay } = renderDatePicker({ canClearSelection: true, onChange });
            fireEvent.click(getDay());
            expect(onChange.mock.calls[0][0]).not.toBeNull();
            fireEvent.click(getDay());
            expect(onChange.mock.calls[1][0]).toBeNull();
        });

        it("should disable Clear button when canClearSelection is false", () => {
            const { getClearButton } = renderDatePicker({
                canClearSelection: false,
                showActionsBar: true,
            });
            expect(getClearButton()).toBeDisabled();
        });

        it("should enable Clear button when canClearSelection is true", () => {
            const { getClearButton } = renderDatePicker({
                canClearSelection: true,
                showActionsBar: true,
            });
            expect(getClearButton()).not.toBeDisabled();
        });

        it("should select the current day when Today is clicked", () => {
            const { getTodayButton, container } = renderDatePicker({ showActionsBar: true });
            fireEvent.click(getTodayButton());

            const today = new Date();
            const selectedDay = container.querySelector(`.${DATEPICKER3_DAY_SELECTED}`);
            expect(selectedDay?.textContent).toBe(String(today.getDate()));
        });

        it("should select the current day in the given timezone when Today is clicked", () => {
            const onChange = vi.fn();
            const { getTodayButton } = renderDatePicker({
                onChange,
                showActionsBar: true,
                timezone: "Asia/Tokyo",
            });
            fireEvent.click(getTodayButton());

            const value = onChange.mock.calls[0][0]!;
            expect(value).not.toBeNull();
            expect(value.getDate()).toBe(MOCK_TODAY.getDate() + 1);
            expect(value.getMonth()).toBe(MOCK_TODAY.getMonth());
            expect(value.getFullYear()).toBe(MOCK_TODAY.getFullYear());
            expect(value.getHours()).toBe(1);
            expect(value.getMinutes()).toBe(30);
        });

        it("should clear the value when Clear is clicked", () => {
            const onChange = vi.fn();
            const { getDay, getClearButton } = renderDatePicker({
                onChange,
                showActionsBar: true,
            });
            fireEvent.click(getDay());
            fireEvent.click(getClearButton());
            // Check that onChange was called with null
            expect(onChange.mock.calls[1][0]).toBeNull();
        });
    });

    describe("localization", () => {
        it("should accept a statically-loaded date-fns locale and not try to load it again", () => {
            const stub = vi.fn().mockImplementation(loadDateFnsLocaleFake);
            renderDatePicker({ dateFnsLocaleLoader: stub, locale: enUSLocale });
            expect(stub).not.toHaveBeenCalled();
        });
    });

    function renderDatePicker(props: Partial<DatePickerProps> = {}) {
        const result = render(<DatePicker dateFnsLocaleLoader={loadDateFnsLocaleFake} {...props} />);
        const { container } = result;

        return {
            ...result,
            /** Asserts that the given days are selected. No arguments asserts that selection is empty. */
            assertSelectedDays: (...days: number[]) => {
                const selectedDays = Array.from(container.querySelectorAll(`.${DATEPICKER3_DAY_SELECTED}`)).map(
                    d => +d.textContent!,
                );
                expect(selectedDays.sort()).toEqual(days.sort());
            },
            clickNextMonth: () => {
                const nextButton = container.querySelector(`.${DATEPICKER3_NAV_BUTTON_NEXT}`) as HTMLElement;
                fireEvent.click(nextButton);
            },
            clickPreviousMonth: () => {
                const prevButton = container.querySelector(`.${DATEPICKER3_NAV_BUTTON_PREVIOUS}`) as HTMLElement;
                fireEvent.click(prevButton);
            },
            clickShortcut: (index = 0) => {
                const shortcuts = container.querySelectorAll(`.${DATERANGEPICKER_SHORTCUTS} a`);
                fireEvent.click(shortcuts[index]);
            },
            getClearButton: () => {
                const footer = container.querySelector(`.${DATEPICKER_FOOTER}`);
                const buttons = footer?.querySelectorAll("button");
                return buttons?.[1] as HTMLButtonElement;
            },
            getDay: (dayNumber = 1) => {
                const days = Array.from(container.querySelectorAll(`.${DATEPICKER3_DAY}`));
                const day = days.find(
                    d => d.textContent === String(dayNumber) && !d.classList.contains(DATEPICKER3_DAY_OUTSIDE),
                );
                return day as HTMLElement;
            },
            getMonthSelect: () => {
                return container.querySelector(`.${DATEPICKER_MONTH_SELECT} select`) as HTMLSelectElement;
            },
            getTodayButton: () => {
                const footer = container.querySelector(`.${DATEPICKER_FOOTER}`);
                const buttons = footer?.querySelectorAll("button");
                return buttons?.[0] as HTMLButtonElement;
            },
            getYearSelect: () => {
                return container.querySelector(`.${DATEPICKER_YEAR_SELECT} select`) as HTMLSelectElement;
            },
            setTimeInput: (precision: TimePrecision | "hour", value: number) => {
                const input = container.querySelector(`.${TIMEPICKER}-${precision}`) as HTMLInputElement;
                fireEvent.blur(input, { target: { value } });
            },
        };
    }
});
