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

import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import enUSLocale from "date-fns/locale/en-US";

import { Classes as CoreClasses } from "@blueprintjs/core";
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import {
    Classes,
    type DatePickerShortcut,
    DateUtils,
    Errors,
    Months,
    TimePrecision,
} from "../..";
import { assertDayDisabled, assertDayHidden } from "../../common/dayPickerTestUtils";
import { loadDateFnsLocaleFake } from "../../common/loadDateFnsLocaleFake";

import { DatePicker, type DatePickerProps } from "./datePicker";

const LOCALE_LOADER: DatePickerProps = {
    dateFnsLocaleLoader: loadDateFnsLocaleFake,
};

describe("<DatePicker>", () => {
    it(`should render .${Classes.DATEPICKER}`, () => {
        const { container } = wrap(<DatePicker {...LOCALE_LOADER} />);
        expect(container.querySelector(`.${Classes.DATEPICKER}`)).toBeInTheDocument();
    });

    it("should not select any day by default", () => {
        const { assertSelectedDays } = wrap(<DatePicker {...LOCALE_LOADER} />);
        assertSelectedDays();
    });

    it("should not highlight the current day by default", () => {
        const { container } = wrap(<DatePicker {...LOCALE_LOADER} />);
        expect(container.querySelector(`.${Classes.DATEPICKER3_HIGHLIGHT_CURRENT_DAY}`)).not.toBeInTheDocument();
    });

    it("current day should be highlighted when highlightCurrentDay={true}", () => {
        const { container } = wrap(<DatePicker {...LOCALE_LOADER} highlightCurrentDay={true} />);
        expect(container.querySelector(`.${Classes.DATEPICKER3_HIGHLIGHT_CURRENT_DAY}`)).toBeInTheDocument();
    });

    describe("reconciliates dayPickerProps", () => {
        it("should show outside days by default", () => {
            const defaultValue = new Date(2017, Months.SEPTEMBER, 1);
            const { container } = wrap(<DatePicker {...LOCALE_LOADER} defaultValue={defaultValue} />);
            // When viewing September 2017 starting on Sunday, the first visible day cell is Aug 27
            const allDays = container.querySelectorAll<HTMLElement>(`.${Classes.DATEPICKER3_DAY}`);
            const firstDay = allDays[0];
            expect(firstDay.textContent).toBe("27");
            expect(firstDay).toHaveClass(Classes.DATEPICKER3_DAY_OUTSIDE);
        });

        it("should not show outside days if enableOutsideDays=false", () => {
            const defaultValue = new Date(2017, Months.SEPTEMBER, 1, 12);
            const { container } = wrap(
                <DatePicker
                    {...LOCALE_LOADER}
                    defaultValue={defaultValue}
                    dayPickerProps={{ showOutsideDays: false }}
                />,
            );
            // When showOutsideDays=false, react-day-picker renders empty cells for outside days.
            // The cells won't have the day class, so query all table cells and check the first few.
            const allCells = container.querySelectorAll<HTMLElement>("td");
            assertDayHidden(allCells[0]);
            assertDayHidden(allCells[1]);
            assertDayHidden(allCells[2]);
            assertDayHidden(allCells[3]);
            assertDayHidden(allCells[4]);
            assertDayHidden(allCells[5], false);
        });

        it("should disable days according to custom modifiers in addition to default modifiers", () => {
            const defaultValue = new Date(2017, Months.SEPTEMBER, 1);
            const disableFridays = { dayOfWeek: [5] };
            const { getDay } = wrap(
                <DatePicker
                    {...LOCALE_LOADER}
                    defaultValue={defaultValue}
                    maxDate={new Date(2017, Months.SEPTEMBER, 20)}
                    dayPickerProps={{ disabled: disableFridays }}
                />,
            );
            assertDayDisabled(getDay(15));
            assertDayDisabled(getDay(21));
            assertDayDisabled(getDay(10), false);
        });

        it("should disable out-of-range max dates", () => {
            const defaultValue = new Date(2017, Months.SEPTEMBER, 1);
            const { getDay } = wrap(
                <DatePicker
                    {...LOCALE_LOADER}
                    defaultValue={defaultValue}
                    maxDate={new Date(2017, Months.SEPTEMBER, 20)}
                />,
            );
            assertDayDisabled(getDay(21));
            assertDayDisabled(getDay(10), false);
        });

        it("should disable out-of-range min dates", async () => {
            const defaultValue = new Date(2017, Months.SEPTEMBER, 1);
            const { getDay, clickPreviousMonth } = wrap(
                <DatePicker
                    {...LOCALE_LOADER}
                    defaultValue={defaultValue}
                    minDate={new Date(2017, Months.AUGUST, 20)}
                />,
            );
            await clickPreviousMonth();
            assertDayDisabled(getDay(10));
            assertDayDisabled(getDay(21), false);
        });

        describe("event handlers", () => {
            // use a date that lets us navigate forward and backward in the same year
            const defaultValue = new Date(2017, Months.SEPTEMBER, 1);

            it("should call onMonthChange on button next click", async () => {
                const onMonthChange = vi.fn();
                const { clickNextMonth } = wrap(
                    <DatePicker {...LOCALE_LOADER} defaultValue={defaultValue} dayPickerProps={{ onMonthChange }} />,
                );
                await clickNextMonth();
                expect(onMonthChange).toHaveBeenCalled();
            });

            it("should call onMonthChange on button prev click", async () => {
                const onMonthChange = vi.fn();
                const { clickPreviousMonth } = wrap(
                    <DatePicker {...LOCALE_LOADER} defaultValue={defaultValue} dayPickerProps={{ onMonthChange }} />,
                );
                await clickPreviousMonth();
                expect(onMonthChange).toHaveBeenCalled();
            });

            it("should call onMonthChange on month select change", () => {
                const onMonthChange = vi.fn();
                const { getMonthSelect } = wrap(
                    <DatePicker {...LOCALE_LOADER} defaultValue={defaultValue} dayPickerProps={{ onMonthChange }} />,
                );
                fireEvent.change(getMonthSelect(), { target: { value: Months.OCTOBER } });
                expect(onMonthChange).toHaveBeenCalled();
            });

            it("should call onMonthChange on year select change", () => {
                const onMonthChange = vi.fn();
                const { getYearSelect } = wrap(
                    <DatePicker {...LOCALE_LOADER} defaultValue={defaultValue} dayPickerProps={{ onMonthChange }} />,
                );
                fireEvent.change(getYearSelect(), { target: { value: 2018 } });
                expect(onMonthChange).toHaveBeenCalled();
            });

            it("should call onDayClick", async () => {
                const onDayClick = vi.fn();
                const { getDay } = wrap(
                    <DatePicker {...LOCALE_LOADER} defaultValue={defaultValue} dayPickerProps={{ onDayClick }} />,
                );
                await userEvent.click(getDay());
                expect(onDayClick).toHaveBeenCalled();
            });
        });
    });

    it("should apply user-provided modifiers", () => {
        const ODD_CLASS = "test-odd";
        const oddifier = (d: Date) => d.getDate() % 2 === 1;
        const { getDay } = wrap(
            <DatePicker
                {...LOCALE_LOADER}
                dayPickerProps={{ modifiers: { odd: oddifier }, modifiersClassNames: { odd: ODD_CLASS } }}
            />,
        );

        expect(getDay(4)).not.toHaveClass(ODD_CLASS);
        expect(getDay(5)).toHaveClass(ODD_CLASS);
    });

    it("should render the actions bar when showActionsBar=true", () => {
        const { container } = wrap(<DatePicker {...LOCALE_LOADER} showActionsBar={true} />);
        expect(container.querySelector(`.${Classes.DATEPICKER_FOOTER}`)).toBeInTheDocument();
    });

    describe("initially displayed month", () => {
        it("should be defaultValue", () => {
            const defaultValue = new Date(2007, Months.APRIL, 4);
            const { getDisplayYear, getDisplayMonth } = wrap(
                <DatePicker {...LOCALE_LOADER} defaultValue={defaultValue} />,
            );
            expect(getDisplayYear()).toBe(2007);
            expect(getDisplayMonth()).toBe(Months.APRIL);
        });

        it("should be initialMonth if set (overrides defaultValue)", () => {
            const defaultValue = new Date(2007, Months.APRIL, 4);
            const initialMonth = new Date(2002, Months.MARCH, 1);
            const { getDisplayYear, getDisplayMonth } = wrap(
                <DatePicker
                    {...LOCALE_LOADER}
                    defaultValue={defaultValue}
                    initialMonth={initialMonth}
                    minDate={new Date(2000, Months.JANUARY, 1)}
                />,
            );
            expect(getDisplayYear()).toBe(2002);
            expect(getDisplayMonth()).toBe(Months.MARCH);
        });

        it("should be value if set and initialMonth not set", () => {
            const value = new Date(2007, Months.APRIL, 4);
            const { getDisplayYear, getDisplayMonth } = wrap(<DatePicker {...LOCALE_LOADER} value={value} />);
            expect(getDisplayYear()).toBe(2007);
            expect(getDisplayMonth()).toBe(Months.APRIL);
        });

        it("should be today if today is within date range", () => {
            const today = new Date();
            const { getDisplayYear, getDisplayMonth } = wrap(<DatePicker {...LOCALE_LOADER} />);
            expect(getDisplayYear()).toBe(today.getFullYear());
            expect(getDisplayMonth()).toBe(today.getMonth());
        });

        it("should be a day between minDate and maxDate if today is not in range", () => {
            const maxDate = new Date(2005, Months.JANUARY);
            const minDate = new Date(2000, Months.JANUARY);
            const { getDisplayYear, getDisplayMonth } = wrap(
                <DatePicker {...LOCALE_LOADER} maxDate={maxDate} minDate={minDate} />,
            );
            expect(
                DateUtils.isDayInRange(new Date(getDisplayYear(), getDisplayMonth()), [minDate, maxDate]),
            ).toBe(true);
        });

        it("should set selectedDay to the day of the value", () => {
            const value = new Date(2007, Months.APRIL, 4);
            const { assertSelectedDays } = wrap(<DatePicker {...LOCALE_LOADER} value={value} />);
            assertSelectedDays(value.getDate());
        });

        it("should set selectedDay to the day of the defaultValue", () => {
            const defaultValue = new Date(2007, Months.APRIL, 4);
            const { assertSelectedDays } = wrap(<DatePicker {...LOCALE_LOADER} defaultValue={defaultValue} />);
            assertSelectedDays(defaultValue.getDate());
        });
    });

    describe("minDate/maxDate bounds", () => {
        const MIN_DATE = new Date(2015, Months.JANUARY, 7);
        const MAX_DATE = new Date(2015, Months.JANUARY, 12);

        describe("validation", () => {
            const consoleError = vi.spyOn(console, "error").mockImplementation(vi.fn());
            afterEach(() => consoleError.mockClear());
            afterAll(() => consoleError.mockRestore());

            it("should require maxDate to be later than minDate", () => {
                wrap(<DatePicker {...LOCALE_LOADER} maxDate={MIN_DATE} minDate={MAX_DATE} />);
                expect(consoleError).toHaveBeenCalledWith(Errors.DATEPICKER_MAX_DATE_INVALID);
            });

            it("should log an error if defaultValue is outside bounds", () => {
                wrap(
                    <DatePicker
                        {...LOCALE_LOADER}
                        defaultValue={new Date(2015, Months.JANUARY, 5)}
                        maxDate={MAX_DATE}
                        minDate={MIN_DATE}
                    />,
                );
                expect(consoleError).toHaveBeenCalledWith(Errors.DATEPICKER_DEFAULT_VALUE_INVALID);
            });

            it("should log an error if value is outside bounds", () => {
                wrap(
                    <DatePicker
                        {...LOCALE_LOADER}
                        value={new Date(2015, Months.JANUARY, 20)}
                        maxDate={MAX_DATE}
                        minDate={MIN_DATE}
                    />,
                );
                expect(consoleError).toHaveBeenCalledWith(Errors.DATEPICKER_VALUE_INVALID);
            });

            it("should log an error if initialMonth is outside month bounds", () => {
                wrap(
                    <DatePicker
                        {...LOCALE_LOADER}
                        initialMonth={new Date(2015, Months.FEBRUARY, 12)}
                        maxDate={MAX_DATE}
                        minDate={MIN_DATE}
                    />,
                );
                expect(consoleError).toHaveBeenCalledWith(Errors.DATEPICKER_INITIAL_MONTH_INVALID);
            });

            it("should not log an error if initialMonth is outside day bounds but inside month bounds", () => {
                wrap(
                    <DatePicker
                        {...LOCALE_LOADER}
                        initialMonth={new Date(2015, Months.JANUARY, 12)}
                        minDate={MIN_DATE}
                        maxDate={MAX_DATE}
                    />,
                );
                expect(consoleError).not.toHaveBeenCalled();
            });
        });

        describe("today button validation", () => {
            const today = new Date();
            const MIN_DATE_BEFORE_TODAY = MIN_DATE;
            const MAX_DATE_BEFORE_TODAY = MAX_DATE;

            const MIN_DATE_AFTER_TODAY = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
            const MAX_DATE_AFTER_TODAY = new Date(today.getFullYear() + 2, today.getMonth(), today.getDate());

            it("should have disabled button when min/max are before today", () => {
                const { getTodayButton } = wrap(
                    <DatePicker
                        {...LOCALE_LOADER}
                        minDate={MIN_DATE_BEFORE_TODAY}
                        maxDate={MAX_DATE_BEFORE_TODAY}
                        showActionsBar={true}
                    />,
                );

                expect(getTodayButton()).toBeDisabled();
            });

            it("should have disabled button when min/max are after today", () => {
                const { getTodayButton } = wrap(
                    <DatePicker
                        {...LOCALE_LOADER}
                        minDate={MIN_DATE_AFTER_TODAY}
                        maxDate={MAX_DATE_AFTER_TODAY}
                        showActionsBar={true}
                    />,
                );

                expect(getTodayButton()).toBeDisabled();
            });

            it("should have enabled button when today is within valid min/max", () => {
                const { getTodayButton } = wrap(
                    <DatePicker
                        {...LOCALE_LOADER}
                        minDate={MIN_DATE_BEFORE_TODAY}
                        maxDate={MAX_DATE_AFTER_TODAY}
                        showActionsBar={true}
                    />,
                );

                expect(getTodayButton()).not.toBeDisabled();
            });
        });

        it("should only disable days outside bounds", () => {
            const minDate = new Date(2000, Months.JANUARY, 10);
            const { getDay } = wrap(<DatePicker {...LOCALE_LOADER} initialMonth={minDate} minDate={minDate} />);
            // 8 is before min date, 12 is after
            expect(getDay(8)).toHaveClass(Classes.DATEPICKER3_DAY_DISABLED);
            expect(getDay(12)).not.toHaveClass(Classes.DATEPICKER3_DAY_DISABLED);
        });

        it("should not fire onChange when a day outside of bounds is clicked", async () => {
            const onChange = vi.fn();
            const { getDay } = wrap(
                <DatePicker {...LOCALE_LOADER} maxDate={MAX_DATE} minDate={MIN_DATE} onChange={onChange} />,
            );
            expect(onChange).not.toHaveBeenCalled();
            await userEvent.click(getDay(4));
            await userEvent.click(getDay(16));
            expect(onChange).not.toHaveBeenCalled();
            await userEvent.click(getDay(8));
            expect(onChange).toHaveBeenCalledOnce();
        });

        it("should constrain time picker when minDate is selected", () => {
            wrap(
                <DatePicker
                    {...LOCALE_LOADER}
                    maxDate={MAX_DATE}
                    minDate={MIN_DATE}
                    timePrecision={TimePrecision.MINUTE}
                    value={MIN_DATE}
                />,
            );
            // When the min date is selected, the TimePicker should show the min date's time
            const hourInput = screen.getByLabelText<HTMLInputElement>("hours (24hr clock)");
            expect(hourInput.value).toBe(String(MIN_DATE.getHours()));
        });

        it("should constrain time picker when max date is selected", () => {
            wrap(
                <DatePicker
                    {...LOCALE_LOADER}
                    maxDate={MAX_DATE}
                    minDate={MIN_DATE}
                    timePrecision={TimePrecision.MINUTE}
                    value={MAX_DATE}
                />,
            );
            // When the max date is selected, the TimePicker should show the max date's time
            const hourInput = screen.getByLabelText<HTMLInputElement>("hours (24hr clock)");
            expect(hourInput.value).toBe(String(MAX_DATE.getHours()));
        });
    });

    describe("when controlled", () => {
        it("should initially select a day from value", () => {
            const value = new Date(2010, Months.JANUARY, 1);
            const { assertSelectedDays } = wrap(
                <DatePicker {...LOCALE_LOADER} defaultValue={new Date(2010, Months.FEBRUARY, 2)} value={value} />,
            );
            assertSelectedDays(value.getDate());
        });

        it("should not update selection automatically", async () => {
            const { getDay, assertSelectedDays } = wrap(<DatePicker {...LOCALE_LOADER} value={null} />);
            assertSelectedDays();
            await userEvent.click(getDay());
            assertSelectedDays();
        });

        it("should not update selected day on current month view change", async () => {
            const value = new Date(2010, Months.JANUARY, 2);
            const { assertSelectedDays, clickPreviousMonth, getMonthSelect, getYearSelect } = wrap(
                <DatePicker {...LOCALE_LOADER} value={value} />,
            );
            await clickPreviousMonth();

            assertSelectedDays(2);

            fireEvent.change(getMonthSelect(), { target: { value: Months.JUNE } });
            assertSelectedDays();

            fireEvent.change(getYearSelect(), { target: { value: 2014 } });
            assertSelectedDays();
        });

        it("should fire onChange when a day is clicked", async () => {
            const onChange = vi.fn();
            const { getDay } = wrap(<DatePicker {...LOCALE_LOADER} onChange={onChange} value={null} />);
            await userEvent.click(getDay());
            expect(onChange).toHaveBeenCalledOnce();
            expect(onChange.mock.calls[0][1]).toBe(true);
        });

        it("should fire onChange when month is changed", async () => {
            const value = new Date(2010, Months.JANUARY, 2);
            const onChange = vi.fn();
            const { getMonthSelect, clickPreviousMonth } = wrap(
                <DatePicker {...LOCALE_LOADER} onChange={onChange} value={value} />,
            );

            await clickPreviousMonth();
            expect(onChange).toHaveBeenCalledOnce();
            expect(onChange.mock.calls[0][1]).toBe(false);

            fireEvent.change(getMonthSelect(), { target: { value: Months.JUNE } });
            expect(onChange).toHaveBeenCalledTimes(2);
            expect(onChange.mock.calls[1][1]).toBe(false);
        });

        it("should change displayed date with the dropdowns in the caption", () => {
            const { getMonthSelect, getYearSelect, getDisplayMonth, getDisplayYear } = wrap(
                <DatePicker {...LOCALE_LOADER} initialMonth={new Date(2015, Months.MARCH, 2)} value={null} />,
            );
            expect(getDisplayMonth()).toBe(Months.MARCH);
            expect(getDisplayYear()).toBe(2015);

            fireEvent.change(getMonthSelect(), { target: { value: Months.JANUARY } });
            fireEvent.change(getYearSelect(), { target: { value: 2014 } });
            expect(getDisplayMonth()).toBe(Months.JANUARY);
            expect(getDisplayYear()).toBe(2014);
        });

        it("should fire onChange with correct values from shortcuts", async () => {
            const today = new Date();
            const aWeekAgo = DateUtils.clone(today);
            aWeekAgo.setDate(today.getDate() - 6);
            const onChange = vi.fn();
            const { clickShortcut } = wrap(
                <DatePicker {...LOCALE_LOADER} onChange={onChange} value={today} shortcuts={true} />,
            );
            await clickShortcut(2);

            expect(onChange).toHaveBeenCalledOnce();
            const value = onChange.mock.calls[0][0];
            expect(DateUtils.isSameDay(aWeekAgo, value)).toBe(true);
        });

        it("should display all shortcuts as inactive when none are selected", () => {
            const { container } = wrap(<DatePicker {...LOCALE_LOADER} shortcuts={true} />);

            expect(
                container.querySelector(`.${Classes.DATERANGEPICKER_SHORTCUTS} .${CoreClasses.ACTIVE}`),
            ).not.toBeInTheDocument();
        });

        it("should display corresponding shortcut as active when selected", () => {
            const selectedShortcut = 0;
            const { container } = wrap(
                <DatePicker {...LOCALE_LOADER} shortcuts={true} selectedShortcutIndex={selectedShortcut} />,
            );

            const activeShortcuts = container.querySelectorAll(
                `.${Classes.DATERANGEPICKER_SHORTCUTS} .${CoreClasses.ACTIVE}`,
            );
            expect(activeShortcuts).toHaveLength(1);
        });

        it("should call onShortcutChangeSpy on selecting a shortcut ", async () => {
            const selectedShortcut = 0;
            const onShortcutChangeSpy = vi.fn();
            const onChangeSpy = vi.fn();
            const { clickShortcut } = wrap(
                <DatePicker
                    {...LOCALE_LOADER}
                    onChange={onChangeSpy}
                    shortcuts={true}
                    onShortcutChange={onShortcutChangeSpy}
                />,
            );

            await clickShortcut(selectedShortcut);

            expect(onChangeSpy).toHaveBeenCalledOnce();
            expect(onShortcutChangeSpy).toHaveBeenCalledOnce();
            expect(onShortcutChangeSpy.mock.calls[onShortcutChangeSpy.mock.calls.length - 1][0].label === "Today").toBe(
                true,
            );
            expect(
                onShortcutChangeSpy.mock.calls[onShortcutChangeSpy.mock.calls.length - 1][1] === selectedShortcut,
            ).toBe(true);
        });

        it("should select the correct values from custom shortcuts", async () => {
            const date = new Date(2015, Months.JANUARY, 1);
            const onChangeSpy = vi.fn();
            const { clickShortcut, assertSelectedDays } = wrap(
                <DatePicker
                    {...LOCALE_LOADER}
                    onChange={onChangeSpy}
                    shortcuts={[{ date, label: "custom shortcut" }]}
                />,
            );
            await clickShortcut();
            expect(onChangeSpy).toHaveBeenCalledOnce();
            const value = onChangeSpy.mock.calls[0][0];
            expect(DateUtils.isSameDay(date, value)).toBe(true);
            assertSelectedDays(date.getDate());
        });
    });

    describe("when uncontrolled", () => {
        it("should initially select a day from defaultValue", () => {
            const today = new Date();
            const { assertSelectedDays } = wrap(<DatePicker {...LOCALE_LOADER} defaultValue={today} />);
            assertSelectedDays(today.getDate());
        });

        it("should fire onChange when a day is clicked", async () => {
            const onChange = vi.fn();
            const { getDay } = wrap(<DatePicker {...LOCALE_LOADER} onChange={onChange} />);
            expect(onChange).not.toHaveBeenCalled();
            await userEvent.click(getDay());
            expect(onChange).toHaveBeenCalledOnce();
        });

        it("should fire onChange when month is changed", async () => {
            const onChange = vi.fn();
            // must use an initial month otherwise clicking next month in december will fail
            const { getDay, clickNextMonth } = wrap(
                <DatePicker {...LOCALE_LOADER} initialMonth={new Date(2015, Months.JANUARY, 12)} onChange={onChange} />,
            );
            expect(onChange).not.toHaveBeenCalled();
            await userEvent.click(getDay());
            expect(onChange).toHaveBeenCalledOnce();
            await clickNextMonth();
            expect(onChange).toHaveBeenCalledTimes(2);
        });

        it("should automatically update selected day", async () => {
            const { assertSelectedDays, getDay } = wrap(<DatePicker {...LOCALE_LOADER} />);
            assertSelectedDays();
            await userEvent.click(getDay(3));
            assertSelectedDays(3);
        });

        it("should preserve selected day when selections are changed", async () => {
            const initialMonth = new Date(2015, Months.JULY, 1);
            const { assertSelectedDays, getDay, getMonthSelect } = wrap(
                <DatePicker {...LOCALE_LOADER} initialMonth={initialMonth} />,
            );
            await userEvent.click(getDay(31));
            fireEvent.change(getMonthSelect(), { target: { value: Months.AUGUST } });
            assertSelectedDays(31);
        });

        it("should change selected day if necessary when selections are changed", async () => {
            const initialMonth = new Date(2015, Months.JULY, 1);
            const { assertSelectedDays, getDay, clickPreviousMonth } = wrap(
                <DatePicker {...LOCALE_LOADER} initialMonth={initialMonth} />,
            );
            await userEvent.click(getDay(31));
            await clickPreviousMonth();
            assertSelectedDays(30);
            // remembers actual date that was clicked and restores if possible
            await clickPreviousMonth();
            assertSelectedDays(31);
        });

        it("should change selected day to minDate or maxDate if selections are changed outside bounds", async () => {
            const initialMonth = new Date(2015, Months.JULY, 1);
            const minDate = new Date(2015, Months.MARCH, 13);
            const maxDate = new Date(2015, Months.NOVEMBER, 21);
            const { assertSelectedDays, getDay, getMonthSelect } = wrap(
                <DatePicker {...LOCALE_LOADER} initialMonth={initialMonth} minDate={minDate} maxDate={maxDate} />,
            );

            await userEvent.click(getDay(1));
            fireEvent.change(getMonthSelect(), { target: { value: Months.MARCH } });
            assertSelectedDays(minDate.getDate());

            await userEvent.click(getDay(25));
            fireEvent.change(getMonthSelect(), { target: { value: Months.NOVEMBER } });
            assertSelectedDays(maxDate.getDate());
        });

        it("should change displayed date with the dropdowns in the caption", () => {
            const { getMonthSelect, getYearSelect, getDisplayMonth, getDisplayYear } = wrap(
                <DatePicker {...LOCALE_LOADER} initialMonth={new Date(2015, Months.MARCH, 2)} />,
            );
            expect(getDisplayMonth()).toBe(Months.MARCH);
            expect(getDisplayYear()).toBe(2015);

            fireEvent.change(getMonthSelect(), { target: { value: Months.JANUARY } });
            fireEvent.change(getYearSelect(), { target: { value: 2014 } });
            expect(getDisplayMonth()).toBe(Months.JANUARY);
            expect(getDisplayYear()).toBe(2014);
        });

        it("should select values from shortcuts", async () => {
            const onChange = vi.fn();
            const { clickShortcut } = wrap(
                <DatePicker {...LOCALE_LOADER} shortcuts={true} onChange={onChange} />,
            );
            await clickShortcut(2);

            const today = new Date();
            const aWeekAgo = DateUtils.clone(today);
            aWeekAgo.setDate(today.getDate() - 6);

            const value = onChange.mock.calls[0][0];
            expect(DateUtils.isSameDay(aWeekAgo, value!)).toBe(true);
        });

        it("should select the correct values from custom shortcuts", async () => {
            const date = new Date(2010, Months.JANUARY, 10);
            const { clickShortcut, assertSelectedDays } = wrap(
                <DatePicker {...LOCALE_LOADER} shortcuts={[{ date, label: "custom shortcut" }]} />,
            );
            await clickShortcut();
            assertSelectedDays(date.getDate());
        });
    });

    describe("time selection", () => {
        const defaultValue = new Date(2012, 2, 5, 6, 5, 40);

        it("should show a TimePicker when timePrecision is set", () => {
            const { container, rerender } = wrap(<DatePicker {...LOCALE_LOADER} />);
            expect(container.querySelector(`.${Classes.TIMEPICKER}`)).not.toBeInTheDocument();
            rerender(<DatePicker {...LOCALE_LOADER} timePrecision="minute" />);
            expect(container.querySelector(`.${Classes.TIMEPICKER}`)).toBeInTheDocument();
        });

        it("should show a TimePicker when timePickerProps is set", () => {
            const { container } = wrap(<DatePicker {...LOCALE_LOADER} timePickerProps={{}} />);
            expect(container.querySelector(`.${Classes.TIMEPICKER}`)).toBeInTheDocument();
        });

        it("should fire onChange when the time is changed", async () => {
            const onChangeSpy = vi.fn();
            const { container } = wrap(
                <DatePicker
                    {...LOCALE_LOADER}
                    defaultValue={defaultValue}
                    onChange={onChangeSpy}
                    timePickerProps={{ showArrowButtons: true }}
                />,
            );
            expect(onChangeSpy).not.toHaveBeenCalled();
            const hourIncrementBtn = container.querySelector<HTMLElement>(
                `.${Classes.TIMEPICKER_ARROW_BUTTON}.${Classes.TIMEPICKER_HOUR}`,
            )!;
            await userEvent.click(hourIncrementBtn);
            expect(onChangeSpy).toHaveBeenCalledOnce();
            const cbHour = onChangeSpy.mock.calls[0][0].getHours();
            expect(cbHour).toBe(defaultValue.getHours() + 1);
        });

        it("should not change time when changing date", async () => {
            const onChangeSpy = vi.fn();
            const { getDay } = wrap(
                <DatePicker
                    {...LOCALE_LOADER}
                    defaultValue={defaultValue}
                    onChange={onChangeSpy}
                    timePrecision="minute"
                />,
            );
            await userEvent.click(getDay(16));
            expect(DateUtils.isSameTime(onChangeSpy.mock.calls[0][0] as Date, defaultValue)).toBe(true);
        });

        it("should not change date when changing time", () => {
            const onChangeSpy = vi.fn();
            const { setTimeInput } = wrap(
                <DatePicker
                    {...LOCALE_LOADER}
                    defaultValue={defaultValue}
                    onChange={onChangeSpy}
                    timePrecision="minute"
                />,
            );
            setTimeInput("minute", 45);
            expect(DateUtils.isSameDay(onChangeSpy.mock.calls[0][0] as Date, defaultValue)).toBe(true);
        });

        it("should use today when changing time without date", () => {
            const onChangeSpy = vi.fn();
            // no date set via props
            const { setTimeInput } = wrap(
                <DatePicker {...LOCALE_LOADER} onChange={onChangeSpy} timePrecision="minute" />,
            );
            setTimeInput("minute", 45);
            expect(DateUtils.isSameDay(onChangeSpy.mock.calls[0][0] as Date, new Date())).toBe(true);
        });

        it("should change time when clicking a shortcut with includeTime=true", async () => {
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
            const { clickShortcut } = wrap(
                <DatePicker
                    {...LOCALE_LOADER}
                    defaultValue={defaultValue}
                    onChange={onChangeSpy}
                    timePrecision="minute"
                    shortcuts={shortcuts}
                />,
            );
            await clickShortcut();
            expect(onChangeSpy.mock.calls[0][0] as Date).toBe(date);
        });
    });

    describe("clearing a selection", () => {
        const MOCK_TODAY = new Date("2020-12-24T15:45:00Z");
        beforeEach(() => {
            vi.useFakeTimers();
            vi.setSystemTime(MOCK_TODAY);
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        it("should correctly pass a Date and never null in onChange when canClearSelection is false", () => {
            const onChange = vi.fn();
            const { getDay } = wrap(<DatePicker {...LOCALE_LOADER} canClearSelection={false} onChange={onChange} />);
            fireEvent.click(getDay());
            expect(onChange.mock.calls[0][0]).not.toBeNull();
            fireEvent.click(getDay());
            expect(onChange.mock.calls[1][0]).not.toBeNull();
        });

        it("should correctly pass a Date or null in onChange when canClearSelection is true", () => {
            const onChange = vi.fn();
            const { getDay } = wrap(<DatePicker {...LOCALE_LOADER} canClearSelection={true} onChange={onChange} />);
            fireEvent.click(getDay());
            expect(onChange.mock.calls[0][0]).not.toBeNull();
            fireEvent.click(getDay());
            expect(onChange.mock.calls[1][0]).toBeNull();
        });

        it("should disable Clear button when canClearSelection is false", () => {
            const { getClearButton } = wrap(
                <DatePicker {...LOCALE_LOADER} canClearSelection={false} showActionsBar={true} />,
            );
            expect(getClearButton()).toBeDisabled();
        });

        it("should enable Clear button when canClearSelection is true", () => {
            const { getClearButton } = wrap(
                <DatePicker {...LOCALE_LOADER} canClearSelection={true} showActionsBar={true} />,
            );
            expect(getClearButton()).not.toBeDisabled();
        });

        it("should select the current day when Today is clicked", () => {
            const onChange = vi.fn();
            const { getTodayButton } = wrap(
                <DatePicker {...LOCALE_LOADER} showActionsBar={true} onChange={onChange} />,
            );
            fireEvent.click(getTodayButton());

            const today = new Date();
            const value = onChange.mock.calls[0][0] as Date;
            expect(value).not.toBeNull();
            expect(value.getDate()).toBe(today.getDate());
            expect(value.getMonth()).toBe(today.getMonth());
            expect(value.getFullYear()).toBe(today.getFullYear());
        });

        it("should select the current day in the given timezone when Today is clicked", () => {
            const onChange = vi.fn();
            const { getTodayButton } = wrap(
                <DatePicker {...LOCALE_LOADER} showActionsBar={true} timezone="Asia/Tokyo" onChange={onChange} />,
            );
            fireEvent.click(getTodayButton());

            const value = onChange.mock.calls[0][0] as Date;
            expect(value).not.toBeNull();
            // Asia/Tokyo is UTC+9, so 2020-12-24T15:45:00Z becomes 2020-12-25T00:45:00 in Tokyo
            expect(value.getDate()).toBe(MOCK_TODAY.getDate() + 1);
            expect(value.getMonth()).toBe(MOCK_TODAY.getMonth());
            expect(value.getFullYear()).toBe(MOCK_TODAY.getFullYear());
            expect(value.getHours()).toBe(0);
            expect(value.getMinutes()).toBe(45);
        });

        it("should clear the value when Clear is clicked", () => {
            const onChange = vi.fn();
            const { getDay, getClearButton } = wrap(
                <DatePicker {...LOCALE_LOADER} showActionsBar={true} onChange={onChange} />,
            );
            fireEvent.click(getDay());
            fireEvent.click(getClearButton());
            // The second onChange call (from clear) should pass null
            expect(onChange.mock.calls[1][0]).toBeNull();
        });
    });

    describe("localization", () => {
        it("should accept a statically-loaded date-fns locale and not try to load it again", () => {
            const stub = vi.fn().mockImplementation(loadDateFnsLocaleFake);
            wrap(<DatePicker dateFnsLocaleLoader={stub} locale={enUSLocale} />);
            expect(stub).not.toHaveBeenCalled();
        });
    });

    function wrap(datepicker: React.JSX.Element) {
        const { container, rerender } = render(datepicker);

        return {
            /** Asserts that the given days are selected. No arguments asserts that selection is empty. */
            assertSelectedDays: (...days: number[]) => {
                const selectedDays = Array.from(
                    container.querySelectorAll(`.${Classes.DATEPICKER3_DAY_SELECTED}`),
                ).map(d => +d.textContent!);
                expect(selectedDays.sort()).toEqual([...days].sort());
            },
            clickNextMonth: async () => {
                const btn = container.querySelector<HTMLElement>(`.${Classes.DATEPICKER3_NAV_BUTTON_NEXT}`)!;
                await userEvent.click(btn);
            },
            clickPreviousMonth: async () => {
                const btn = container.querySelector<HTMLElement>(`.${Classes.DATEPICKER3_NAV_BUTTON_PREVIOUS}`)!;
                await userEvent.click(btn);
            },
            clickShortcut: async (index = 0) => {
                const shortcuts = container.querySelector(`.${Classes.DATERANGEPICKER_SHORTCUTS}`)!;
                const links = shortcuts.querySelectorAll("a");
                await userEvent.click(links[index]);
            },
            container,
            getClearButton: () => {
                const footer = container.querySelector(`.${Classes.DATEPICKER_FOOTER}`)!;
                const buttons = footer.querySelectorAll<HTMLButtonElement>("button");
                return buttons[buttons.length - 1]; // last button = Clear
            },
            getDay: (dayNumber = 1) => {
                const allDays = container.querySelectorAll<HTMLElement>(`.${Classes.DATEPICKER3_DAY}`);
                return Array.from(allDays).find(
                    day =>
                        day.textContent === "" + dayNumber &&
                        !day.classList.contains(Classes.DATEPICKER3_DAY_OUTSIDE),
                )!;
            },
            getDisplayMonth: () => {
                const monthSelect = container.querySelector<HTMLSelectElement>(
                    `.${Classes.DATEPICKER_MONTH_SELECT} select`,
                )!;
                return Number(monthSelect.value);
            },
            getDisplayYear: () => {
                const yearSelect = container.querySelector<HTMLSelectElement>(
                    `.${Classes.DATEPICKER_YEAR_SELECT} select`,
                )!;
                return Number(yearSelect.value);
            },
            getMonthSelect: () =>
                container.querySelector<HTMLSelectElement>(`.${Classes.DATEPICKER_MONTH_SELECT} select`)!,
            getTodayButton: () => {
                const footer = container.querySelector(`.${Classes.DATEPICKER_FOOTER}`)!;
                return footer.querySelectorAll<HTMLButtonElement>("button")[0]; // first button = Today
            },
            getYearSelect: () =>
                container.querySelector<HTMLSelectElement>(`.${Classes.DATEPICKER_YEAR_SELECT} select`)!,
            rerender,
            setTimeInput: (precision: TimePrecision | "hour", value: number) => {
                const input = container.querySelector<HTMLInputElement>(`.${Classes.TIMEPICKER}-${precision}`)!;
                fireEvent.blur(input, { target: { value } });
            },
        };
    }
});
