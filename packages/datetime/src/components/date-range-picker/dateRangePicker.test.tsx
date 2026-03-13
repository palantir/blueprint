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

import { addDays, format, parse } from "date-fns";
import enUSLocale from "date-fns/locale/en-US";
import { mount, type ReactWrapper } from "enzyme";
import { type DayModifiers, DayPicker, type ModifiersClassNames } from "react-day-picker";

import { Button, Classes as CoreClasses, Menu, MenuItem } from "@blueprintjs/core";
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import {
    Classes,
    DatePickerShortcutMenu,
    type DateRange,
    type DateRangeShortcut,
    DateUtils,
    Errors,
    MonthAndYear,
    Months,
    type NonNullDateRange,
    TimePicker,
    type TimePrecision,
} from "../..";
import { ReactDayPickerClasses } from "../../common/classes";
import { assertDayDisabled } from "../../common/dayPickerTestUtils";
import { loadDateFnsLocaleFake } from "../../common/loadDateFnsLocaleFake";
import { DateRangePicker, type DateRangePickerProps } from "../date-range-picker/dateRangePicker";
import type { DateRangePickerState } from "../date-range-picker/dateRangePickerState";

// Change the default for testability
(DateRangePicker.defaultProps as DateRangePickerProps).dateFnsLocaleLoader = loadDateFnsLocaleFake;

describe("<DateRangePicker>", () => {
    let testsContainerElement: HTMLElement;
    let drpWrapper: ReactWrapper<DateRangePickerProps, DateRangePickerState>;

    let onChangeSpy: ReturnType<typeof vi.fn<(selectedDates: DateRange) => void>>;
    let onHoverChangeSpy: ReturnType<typeof vi.fn<DateRangePickerProps["onHoverChange"] & {}>>;

    beforeEach(() => {
        testsContainerElement = document.createElement("div");
        document.body.appendChild(testsContainerElement);
    });

    afterEach(() => {
        drpWrapper?.unmount();
        drpWrapper?.detach();
        testsContainerElement.remove();
    });

    it("should render its template", () => {
        const { wrapper } = render();
        expect(wrapper.find(`.${Classes.DATERANGEPICKER}`).exists()).toBe(true);
    });

    it("should not select any days by default", () => {
        const { wrapper, assertSelectedDays } = render();
        expect(wrapper.state("value")).toEqual([null, null]);
        assertSelectedDays();
    });

    it("should apply user-provided modifiers", () => {
        const modifiers: DayModifiers = { odd: (d: Date) => d.getDate() % 2 === 1 };
        const modifiersClassNames: ModifiersClassNames = {
            odd: "test-odd",
        };
        const { left } = render({ dayPickerProps: { modifiers, modifiersClassNames } });
        expect(left.findDay(4).hasClass(modifiersClassNames.odd)).toBe(false);
        expect(left.findDay(5).hasClass(modifiersClassNames.odd)).toBe(true);
    });

    describe("reconciliates dayPickerProps", () => {
        it("should hide unnecessary nav buttons in contiguous months mode", () => {
            const defaultValue: DateRange = [new Date(2017, Months.SEPTEMBER, 1), null];
            const { wrapper } = wrap(<DateRangePicker defaultValue={defaultValue} />);
            expect(wrapper.find(".rdp-month").at(0).find(`.${Classes.DATEPICKER3_NAV_BUTTON_NEXT}`).exists()).toBe(
                false,
            );
            expect(wrapper.find(".rdp-month").at(1).find(`.${Classes.DATEPICKER3_NAV_BUTTON_PREVIOUS}`).exists()).toBe(
                false,
            );
        });

        it("should disable days according to custom modifiers in addition to default modifiers", () => {
            const disableFridays = { dayOfWeek: [5] };
            const defaultValue: DateRange = [new Date(2017, Months.SEPTEMBER, 1), null];
            const maxDate = new Date(2017, Months.OCTOBER, 20);

            const { left, right } = wrap(
                <DateRangePicker
                    dayPickerProps={{ disabled: disableFridays }}
                    defaultValue={defaultValue}
                    maxDate={maxDate}
                />,
            );

            assertDayDisabled(left.findDay(15).getDOMNode<HTMLElement>());
            assertDayDisabled(right.findDay(21).getDOMNode<HTMLElement>());
            assertDayDisabled(left.findDay(10).getDOMNode<HTMLElement>(), false);
        });

        it("should disable out-of-range max dates", () => {
            const { right } = wrap(
                <DateRangePicker
                    initialMonth={new Date(2017, Months.AUGUST, 1)}
                    maxDate={new Date(2017, Months.SEPTEMBER, 20)}
                />,
            );
            assertDayDisabled(right.findDay(21).getDOMNode<HTMLElement>());
            assertDayDisabled(right.findDay(10).getDOMNode<HTMLElement>(), false);
        });

        it("should disable out-of-range min dates", () => {
            const { left } = wrap(
                <DateRangePicker
                    initialMonth={new Date(2017, Months.AUGUST, 1)}
                    minDate={new Date(2017, Months.AUGUST, 20)}
                />,
            );
            assertDayDisabled(left.findDay(10).getDOMNode<HTMLElement>());
            assertDayDisabled(left.findDay(21).getDOMNode<HTMLElement>(), false);
        });

        describe("event handlers", () => {
            // use a date that lets us navigate forward and backward in the same year
            const defaultValue = [new Date(2017, Months.SEPTEMBER, 1), null] as DateRange;

            it("should call onMonthChange on button next click", () => {
                const onMonthChange = vi.fn();
                wrap(<DateRangePicker defaultValue={defaultValue} dayPickerProps={{ onMonthChange }} />).clickNavButton(
                    "next",
                    1,
                );
                expect(onMonthChange).toHaveBeenCalled();
            });

            it("should call onMonthChange on button prev click", () => {
                const onMonthChange = vi.fn();
                wrap(<DateRangePicker defaultValue={defaultValue} dayPickerProps={{ onMonthChange }} />).clickNavButton(
                    "previous",
                );
                expect(onMonthChange).toHaveBeenCalled();
            });

            it("should call onMonthChange on button next click of left calendar", () => {
                const onMonthChange = vi.fn();
                wrap(
                    <DateRangePicker
                        defaultValue={defaultValue}
                        contiguousCalendarMonths={false}
                        dayPickerProps={{ onMonthChange }}
                    />,
                ).clickNavButton("next");
                expect(onMonthChange).toHaveBeenCalled();
            });

            it("should call onMonthChange on button prev click of left calendar", () => {
                const onMonthChange = vi.fn();
                wrap(
                    <DateRangePicker
                        defaultValue={defaultValue}
                        contiguousCalendarMonths={false}
                        dayPickerProps={{ onMonthChange }}
                    />,
                ).clickNavButton("previous");
                expect(onMonthChange).toHaveBeenCalled();
            });

            it("should call onMonthChange on button next click of right calendar", () => {
                const onMonthChange = vi.fn();
                wrap(
                    <DateRangePicker
                        defaultValue={defaultValue}
                        contiguousCalendarMonths={false}
                        dayPickerProps={{ onMonthChange }}
                    />,
                ).clickNavButton("next", 1);
                expect(onMonthChange).toHaveBeenCalled();
            });

            it("should call onMonthChange on button prev click of right calendar", () => {
                const onMonthChange = vi.fn();
                wrap(
                    <DateRangePicker
                        defaultValue={defaultValue}
                        contiguousCalendarMonths={false}
                        dayPickerProps={{ onMonthChange }}
                    />,
                ).clickNavButton("previous", 1);
                expect(onMonthChange).toHaveBeenCalled();
            });

            it("should call onMonthChange on month select change in left calendar", () => {
                const onMonthChange = vi.fn();
                wrap(
                    <DateRangePicker defaultValue={defaultValue} dayPickerProps={{ onMonthChange }} />,
                ).left.monthSelect.simulate("change");
                expect(onMonthChange).toHaveBeenCalled();
            });

            it("should call onMonthChange on month select change in right calendar", () => {
                const onMonthChange = vi.fn();
                wrap(
                    <DateRangePicker defaultValue={defaultValue} dayPickerProps={{ onMonthChange }} />,
                ).right.monthSelect.simulate("change");
                expect(onMonthChange).toHaveBeenCalled();
            });

            it("should call onMonthChange on year select change in left calendar", () => {
                const onMonthChange = vi.fn();
                wrap(
                    <DateRangePicker defaultValue={defaultValue} dayPickerProps={{ onMonthChange }} />,
                ).left.monthSelect.simulate("change");
                expect(onMonthChange).toHaveBeenCalled();
            });

            it("should call onMonthChange on year select change in right calendar", () => {
                const onMonthChange = vi.fn();
                wrap(
                    <DateRangePicker defaultValue={defaultValue} dayPickerProps={{ onMonthChange }} />,
                ).right.monthSelect.simulate("change");
                expect(onMonthChange).toHaveBeenCalled();
            });

            it("should call onDayMouseEnter", () => {
                const onDayMouseEnter = vi.fn();
                render({ dayPickerProps: { onDayMouseEnter }, defaultValue }).left.mouseEnterDay(14);
                expect(onDayMouseEnter).toHaveBeenCalled();
            });

            it("should call onDayMouseLeave", () => {
                const onDayMouseLeave = vi.fn();
                render({ dayPickerProps: { onDayMouseLeave }, defaultValue })
                    .left.mouseEnterDay(14)
                    .findDay(14)
                    .simulate("mouseleave");
                expect(onDayMouseLeave).toHaveBeenCalled();
            });

            it("should call onDayClick", () => {
                const onDayClick = vi.fn();
                render({ dayPickerProps: { onDayClick }, defaultValue }).left.clickDay(14);
                expect(onDayClick).toHaveBeenCalled();
            });
        });

        describe("for i18n", () => {
            // regression test for https://github.com/palantir/blueprint/issues/6489
            it("should accept custom month name formatters in DatePicker3Caption (contiguousCalendarMonths={false})", () => {
                const CUSTOM_MONTH_NAMES = [
                    "First",
                    "Second",
                    "Third",
                    "Fourth",
                    "Fifth",
                    "Sixth",
                    "Seventh",
                    "Eighth",
                    "Ninth",
                    "Tenth",
                    "Eleventh",
                    "Twelfth",
                ];
                const formatters = {
                    formatMonthCaption: (d: Date) => CUSTOM_MONTH_NAMES[d.getMonth()],
                };
                // try a month which is not January to make sure we're actually setting a value in the <select>
                // and not just displaying the default value which is the first option
                const initialMonthIndex = Months.AUGUST;
                const initialMonth = new Date(2023, initialMonthIndex, 1);
                const { left } = wrap(
                    <DateRangePicker
                        initialMonth={initialMonth}
                        contiguousCalendarMonths={false}
                        dayPickerProps={{ formatters }}
                    />,
                );
                const leftMonth = left.monthSelect.getDOMNode<HTMLSelectElement>();
                expect(leftMonth.selectedIndex).toBe(initialMonthIndex);
                for (const option of Array.from(leftMonth.options)) {
                    expect(option.text).toBe(CUSTOM_MONTH_NAMES[option.index]);
                }
            });
        });
    });

    describe("initially displayed month", () => {
        it("should be initialMonth if set", () => {
            const defaultValue = [new Date(2007, Months.APRIL, 4), null] as DateRange;
            const initialMonth = new Date(2002, Months.MARCH, 1);
            const maxDate = new Date(2030, Months.JANUARY);
            const minDate = new Date(2000, Months.JANUARY);
            const { left } = render({ defaultValue, initialMonth, maxDate, minDate });
            left.assertDisplayMonth(Months.MARCH, 2002);
        });

        it("should be defaultValue if set and initialMonth not set", () => {
            const defaultValue = [new Date(2007, Months.APRIL, 4), null] as DateRange;
            const maxDate = new Date(2030, Months.JANUARY);
            const minDate = new Date(2000, Months.JANUARY);
            const { left } = render({ defaultValue, maxDate, minDate });
            left.assertDisplayMonth(Months.APRIL, 2007);
        });

        it("should be value if set and initialMonth not set", () => {
            const maxDate = new Date(2030, Months.JANUARY);
            const minDate = new Date(2000, Months.JANUARY);
            const value = [new Date(2007, Months.APRIL, 4), null] as DateRange;
            const { left } = render({ maxDate, minDate, value });
            left.assertDisplayMonth(Months.APRIL, 2007);
        });

        it("should have correct initial month on singleMonthOnly and maxDate == initialMonth", () => {
            const maxDate = new Date(2019, Months.MAY, 6);
            const minDate = new Date(2019, Months.MARCH, 3);
            const initialMonth = maxDate;
            const { left } = render({ initialMonth, maxDate, minDate, singleMonthOnly: true });
            left.assertDisplayMonth(Months.MAY, 2019);
        });

        it("should be (endDate - 1 month) if only endDate is set", () => {
            const value = [null, new Date(2007, Months.APRIL, 4)] as DateRange;
            const { left } = render({ value });
            left.assertDisplayMonth(Months.MARCH, 2007);
        });

        it("should be endDate if only endDate is set and endDate === minDate month", () => {
            const minDate = new Date(2007, Months.APRIL);
            const value = [null, new Date(2007, Months.APRIL, 4)] as DateRange;
            const { left } = render({ minDate, value });
            left.assertDisplayMonth(Months.APRIL, 2007);
        });

        it("should be today if only maxDate/minDate set and today is in date range", () => {
            const maxDate = new Date(2030, Months.JANUARY);
            const minDate = new Date(2000, Months.JANUARY);
            const today = new Date();
            const { left } = render({ maxDate, minDate });
            left.assertDisplayMonth(today.getMonth(), today.getFullYear());
        });

        it("should be a day between minDate and maxDate if only maxDate/minDate set and today is not in range", () => {
            const maxDate = new Date(2005, Months.JANUARY);
            const minDate = new Date(2000, Months.JANUARY);
            const { left } = render({ maxDate, minDate });
            expect(DateUtils.isDayInRange(left.displayMonthAndYear.getFullDate(), [minDate, maxDate])).toBe(true);
        });

        it("should be initialMonth - 1 if initialMonth === maxDate month", () => {
            const MAX_YEAR = 2016;

            const initialMonth = new Date(MAX_YEAR, Months.DECEMBER, 1);
            const maxDate = new Date(MAX_YEAR, Months.DECEMBER, 31);
            const minDate = new Date(2000, 0);

            const { left } = render({ initialMonth, maxDate, minDate });
            left.assertDisplayMonth(Months.NOVEMBER, MAX_YEAR);
        });

        it("should be value - 1 if set and initialMonth not set and value month === maxDate month", () => {
            const value = [new Date(2017, Months.OCTOBER, 4), null] as DateRange;
            const maxDate = new Date(2017, Months.OCTOBER, 15);

            const { left } = render({ maxDate, value });
            left.assertDisplayMonth(Months.SEPTEMBER, 2017);
        });

        it("should be initialMonth if initialMonth === minDate month and initialMonth === maxDate month", () => {
            const YEAR = 2016;

            const initialMonth = new Date(YEAR, Months.DECEMBER, 11);
            const maxDate = new Date(YEAR, Months.DECEMBER, 15);
            const minDate = new Date(YEAR, Months.DECEMBER, 1);

            const { left } = render({ initialMonth, maxDate, minDate });
            left.assertDisplayMonth(Months.DECEMBER, YEAR);
        });

        it("should show the month immediately after the left view by default in right calendar", () => {
            const startDate = new Date(2017, Months.MAY, 5);
            const endDate = new Date(2017, Months.JULY, 5);
            const { right } = render({ value: [startDate, endDate] });
            right.assertDisplayMonth(Months.JUNE, 2017);
        });
    });

    describe("left/right calendar", () => {
        function assertSelectOptionBounds(monthSelect: ReactWrapper, first: Months, last: Months) {
            const options = monthSelect.find("option");
            const expectedFirstOption = renderMonthName(first);
            const expectedLastOption = renderMonthName(last);
            expect(options.first().text()).toBe(expectedFirstOption);
            expect(options.last().text()).toBe(expectedLastOption);
        }

        it("should only show one calendar when minDate and maxDate are in the same month", () => {
            const minDate = new Date(2015, Months.DECEMBER, 1);
            const maxDate = new Date(2015, Months.DECEMBER, 15);
            const { wrapper, right } = render({
                contiguousCalendarMonths: false,
                maxDate,
                minDate,
            });
            expect(right.wrapper.exists()).toBe(false);
            // nav buttons are disabled
            expect(wrapper.find(Button).every({ disabled: true })).toBe(true);
        });

        it("should only show one calendar when singleMonthOnly is set", () => {
            const { right } = render({ singleMonthOnly: true });
            expect(right.wrapper.exists()).toBe(false);
        });

        it("should bound left calendar between minDate and (maxDate - 1 month)", () => {
            const minDate = new Date(2015, Months.JANUARY, 1);
            const maxDate = new Date(2015, Months.DECEMBER, 15);
            const { monthSelect } = render({
                contiguousCalendarMonths: false,
                maxDate,
                minDate,
            }).left;
            assertSelectOptionBounds(monthSelect, Months.JANUARY, Months.NOVEMBER);
        });

        it("should bound right calendar between (minDate + 1 month) and maxDate", () => {
            const minDate = new Date(2015, Months.JANUARY, 1);
            const maxDate = new Date(2015, Months.DECEMBER, 15);
            const { monthSelect } = render({
                contiguousCalendarMonths: false,
                maxDate,
                minDate,
            }).right;
            assertSelectOptionBounds(monthSelect, Months.FEBRUARY, Months.DECEMBER);
        });

        it("should show the month containing the selected end date in right calendar", () => {
            const startDate = new Date(2017, Months.MAY, 5);
            const endDate = new Date(2017, Months.JULY, 5);
            const { right } = render({
                contiguousCalendarMonths: false,
                value: [startDate, endDate],
            });
            right.assertDisplayMonth(Months.JULY);
        });

        it("should show the month immediately after the left view in right calendar if startDate === endDate month", () => {
            const startDate = new Date(2017, Months.MAY, 5);
            const endDate = new Date(2017, Months.MAY, 15);
            const { right } = render({
                contiguousCalendarMonths: false,
                value: [startDate, endDate],
            });
            right.assertDisplayMonth(Months.JUNE);
        });
    });

    describe("left/right calendar when contiguous", () => {
        it("should shift left calendar to the selected month when changing month dropdown", () => {
            const initialMonth = new Date(2015, Months.MAY, 5);

            const { left, right } = render({ initialMonth });
            left.assertDisplayMonth(Months.MAY);
            right.assertDisplayMonth(Months.JUNE);
            left.monthSelect.simulate("change", { target: { value: Months.AUGUST } });
            left.assertDisplayMonth(Months.AUGUST);
            right.assertDisplayMonth(Months.SEPTEMBER);
        });

        it("should shift right calendar to the selected month when changing month dropdown", () => {
            const initialMonth = new Date(2015, Months.MAY, 5);

            const { left, right } = render({ initialMonth });
            left.assertDisplayMonth(Months.MAY);
            right.assertDisplayMonth(Months.JUNE);
            right.monthSelect.simulate("change", { target: { value: Months.AUGUST } });
            left.assertDisplayMonth(Months.JULY);
            right.assertDisplayMonth(Months.AUGUST);
        });

        it("should shift left calendar to the selected year when changing year dropdown", () => {
            const initialMonth = new Date(2015, Months.MAY, 5);
            const NEW_YEAR = 2012;

            const { left, right } = render({ initialMonth });
            left.assertDisplayMonth(Months.MAY);
            right.assertDisplayMonth(Months.JUNE);
            left.yearSelect.simulate("change", { target: { value: NEW_YEAR } });
            left.assertDisplayMonth(Months.MAY, NEW_YEAR);
            right.assertDisplayMonth(Months.JUNE, NEW_YEAR);
        });

        it("should shift right calendar to the selected year when changing year dropdown", () => {
            const initialMonth = new Date(2015, Months.MAY, 5);
            const NEW_YEAR = 2012;

            const { left, right } = render({ initialMonth });
            left.assertDisplayMonth(Months.MAY);
            right.assertDisplayMonth(Months.JUNE);
            right.yearSelect.simulate("change", { target: { value: NEW_YEAR } });
            left.assertDisplayMonth(Months.MAY, NEW_YEAR);
            right.assertDisplayMonth(Months.JUNE, NEW_YEAR);
        });

        it("should shift left calendar to the selected year when changing year dropdown between December and January", () => {
            const INITIAL_YEAR = 2015;
            const initialMonth = new Date(INITIAL_YEAR, Months.DECEMBER, 5);
            const NEW_YEAR = 2012;

            const { left, right } = render({ initialMonth });
            left.assertDisplayMonth(Months.DECEMBER, INITIAL_YEAR);
            right.assertDisplayMonth(Months.JANUARY, INITIAL_YEAR + 1);
            left.yearSelect.simulate("change", { target: { value: NEW_YEAR } });
            left.assertDisplayMonth(Months.DECEMBER, NEW_YEAR);
            right.assertDisplayMonth(Months.JANUARY, NEW_YEAR + 1);
        });

        it("should shift right calendar to the selected year when changing year dropdown between December and January", () => {
            const INITIAL_YEAR = 2015;
            const initialMonth = new Date(INITIAL_YEAR, Months.DECEMBER, 5);
            const NEW_YEAR = 2012;

            const { left, right } = render({ initialMonth });
            left.assertDisplayMonth(Months.DECEMBER, INITIAL_YEAR);
            right.assertDisplayMonth(Months.JANUARY, INITIAL_YEAR + 1);
            right.yearSelect.simulate("change", { target: { value: NEW_YEAR } });
            left.assertDisplayMonth(Months.DECEMBER, NEW_YEAR - 1);
            right.assertDisplayMonth(Months.JANUARY, NEW_YEAR);
        });
    });

    describe("left/right calendar when not contiguous", () => {
        it("should allow left calendar to be altered independently of right calendar", () => {
            const initialMonth = new Date(2015, Months.MAY, 5);
            const { left, clickNavButton } = render({
                contiguousCalendarMonths: false,
                initialMonth,
            });
            left.assertDisplayMonth(Months.MAY);
            clickNavButton("previous");
            left.assertDisplayMonth(Months.APRIL);
            clickNavButton("next");
            left.assertDisplayMonth(Months.MAY);
        });

        it("should allow right calendar to be altered independently of left calendar", () => {
            const initialMonth = new Date(2015, Months.MAY, 5);

            const { right, clickNavButton } = render({
                contiguousCalendarMonths: false,
                initialMonth,
            });
            right.assertDisplayMonth(Months.JUNE);
            clickNavButton("previous", 1);
            right.assertDisplayMonth(Months.MAY);
            clickNavButton("next", 1);
            right.assertDisplayMonth(Months.JUNE);
        });

        it("should shift right calendar when left calendar month dropdown is changed to equal or after right", () => {
            const initialMonth = new Date(2015, Months.MAY, 5);

            const { left, right } = render({ contiguousCalendarMonths: false, initialMonth });
            left.assertDisplayMonth(Months.MAY);
            right.assertDisplayMonth(Months.JUNE);
            left.monthSelect.simulate("change", { target: { value: Months.AUGUST } });
            left.assertDisplayMonth(Months.AUGUST);
            right.assertDisplayMonth(Months.SEPTEMBER);
        });

        it("should shift left calendar when right calendar month dropdown is changed to equal or before left", () => {
            const initialMonth = new Date(2015, Months.MAY, 5);

            const { left, right } = render({ contiguousCalendarMonths: false, initialMonth });
            left.assertDisplayMonth(Months.MAY);
            right.assertDisplayMonth(Months.JUNE);
            right.monthSelect.simulate("change", { target: { value: Months.APRIL } });
            left.assertDisplayMonth(Months.MARCH);
            right.assertDisplayMonth(Months.APRIL);
        });

        it("should shift right calendar when left calendar year dropdown is changed to equal or after right", () => {
            const initialMonth = new Date(2013, Months.MAY, 5);
            const NEW_YEAR = 2014;

            const { left, right } = render({ contiguousCalendarMonths: false, initialMonth });
            left.yearSelect.simulate("change", { target: { value: NEW_YEAR } });
            left.assertDisplayMonth(Months.MAY, NEW_YEAR);
            right.assertDisplayMonth(Months.JUNE, NEW_YEAR);
        });

        it("should shift left calendar when right calendar year dropdown is changed to equal or before left", () => {
            const initialMonth = new Date(2013, Months.MAY, 5);
            const NEW_YEAR = 2012;

            const { left, right } = render({ contiguousCalendarMonths: false, initialMonth });
            right.yearSelect.simulate("change", { target: { value: NEW_YEAR } });
            left.assertDisplayMonth(Months.MAY, NEW_YEAR);
            right.assertDisplayMonth(Months.JUNE, NEW_YEAR);
        });

        it("should shift right calendar when left calendar navButton reaches right calendar", () => {
            const initialMonth = new Date(2015, Months.MAY, 5);

            const { left, right, clickNavButton } = render({
                contiguousCalendarMonths: false,
                initialMonth,
            });
            clickNavButton("next");
            left.assertDisplayMonth(Months.JUNE);
            right.assertDisplayMonth(Months.JULY);
        });

        it("should shift left calendar when right calendar navButton reaches left calendar", () => {
            const initialMonth = new Date(2015, Months.MAY, 5);

            const { left, right, clickNavButton } = render({
                contiguousCalendarMonths: false,
                initialMonth,
            });
            clickNavButton("previous", 1);
            left.assertDisplayMonth(Months.APRIL);
            right.assertDisplayMonth(Months.MAY);
        });
    });

    describe("validation: minDate/maxDate bounds", () => {
        const TODAY = new Date(2015, Months.FEBRUARY, 5);
        const LAST_WEEK_START = new Date(2015, Months.JANUARY, 29);
        const LAST_MONTH_START = new Date(2015, Months.JANUARY, 5);
        const TWO_WEEKS_AGO_START = new Date(2015, Months.JANUARY, 22);

        const consoleError = vi.spyOn(console, "error").mockImplementation(vi.fn());
        afterEach(() => consoleError.mockClear());
        afterAll(() => consoleError.mockRestore());

        it("should require maxDate to be later than minDate", () => {
            wrap(
                <DateRangePicker
                    minDate={new Date(2000, Months.JANUARY, 10)}
                    maxDate={new Date(2000, Months.JANUARY, 8)}
                />,
            );
            expect(consoleError).toHaveBeenCalledWith(Errors.DATERANGEPICKER_MAX_DATE_INVALID);
        });

        it("should only disable days outside bounds", () => {
            const minDate = new Date(2000, Months.JANUARY, 10);
            const initialMonth = minDate;
            const { left } = render({ initialMonth, minDate });
            expect(left.findDay(8).hasClass(Classes.DATEPICKER3_DAY_DISABLED)).toBe(true);
            expect(left.findDay(10).hasClass(Classes.DATEPICKER3_DAY_DISABLED)).toBe(false);
        });

        it("should log an error if defaultValue is outside bounds", () => {
            wrap(
                <DateRangePicker
                    defaultValue={[new Date(2015, Months.JANUARY, 12), null] as DateRange}
                    minDate={new Date(2015, Months.JANUARY, 5)}
                    maxDate={new Date(2015, Months.JANUARY, 7)}
                />,
            );
            expect(consoleError).toHaveBeenCalledExactlyOnceWith(Errors.DATERANGEPICKER_DEFAULT_VALUE_INVALID);
        });

        it("should log an error if initialMonth is outside month bounds", () => {
            wrap(
                <DateRangePicker
                    initialMonth={new Date(2015, Months.FEBRUARY, 12)}
                    minDate={new Date(2015, Months.JANUARY, 5)}
                    maxDate={new Date(2015, Months.JANUARY, 7)}
                />,
            );
            expect(consoleError).toHaveBeenCalledExactlyOnceWith(Errors.DATERANGEPICKER_INITIAL_MONTH_INVALID);
        });

        it("should not log an error if initialMonth is outside day bounds but inside month bounds", () => {
            wrap(
                <DateRangePicker
                    initialMonth={new Date(2015, Months.JANUARY, 12)}
                    minDate={new Date(2015, Months.JANUARY, 5)}
                    maxDate={new Date(2015, Months.JANUARY, 7)}
                />,
            );
            expect(consoleError).not.toHaveBeenCalled();
        });

        it("should log an error if value is outside bounds", () => {
            wrap(
                <DateRangePicker
                    value={[new Date(2015, Months.JANUARY, 12), null] as DateRange}
                    minDate={new Date(2015, Months.JANUARY, 5)}
                    maxDate={new Date(2015, Months.JANUARY, 7)}
                />,
            );
            expect(consoleError).toHaveBeenCalledExactlyOnceWith(Errors.DATERANGEPICKER_VALUE_INVALID);
        });

        it("should not fire onChange when a day outside of bounds is clicked", () => {
            const minDate = new Date(2015, Months.JANUARY, 5);
            const maxDate = new Date(2015, Months.JANUARY, 7);
            const { left } = render({ maxDate, minDate });
            expect(onChangeSpy).not.toHaveBeenCalled();
            left.findDay(10).simulate("click");
            expect(onChangeSpy).not.toHaveBeenCalled();
        });

        it("should only display caption options for possible months and years", () => {
            const minDate = new Date(2015, Months.JANUARY, 5);
            const maxDate = new Date(2015, Months.JANUARY, 7);
            const { left } = render({ maxDate, minDate });
            const monthOptions = left.monthSelect.find("option").map(o => o.text());
            const yearOptions = left.yearSelect.find("option").map(o => o.text());
            expect(monthOptions.sort()).toEqual(["January"]);
            expect(yearOptions.sort()).toEqual(["2015"]);
        });

        it("should disable shortcuts that begin earlier than minDate", () => {
            const { shortcuts } = render({
                initialMonth: TODAY,
                minDate: TWO_WEEKS_AGO_START,
                shortcuts: [
                    { dateRange: [LAST_WEEK_START, TODAY], label: "last week" },
                    { dateRange: [LAST_MONTH_START, TODAY], label: "last month" },
                ],
            });
            expect(shortcuts.find(MenuItem).at(0).prop("disabled")).toBe(false);
            expect(shortcuts.find(MenuItem).at(1).prop("disabled")).toBe(true);
        });

        it("should disable shortcuts that end later than maxDate", () => {
            const { shortcuts } = render({
                initialMonth: TWO_WEEKS_AGO_START,
                maxDate: TWO_WEEKS_AGO_START,
                shortcuts: [
                    { dateRange: [LAST_WEEK_START, TODAY], label: "last week" },
                    { dateRange: [LAST_MONTH_START, TODAY], label: "last month" },
                ],
            });
            expect(shortcuts.find(MenuItem).at(0).prop("disabled")).toBe(true);
            expect(shortcuts.find(MenuItem).at(1).prop("disabled")).toBe(true);
        });
    });

    describe("hover interactions", () => {
        describe("when neither start nor end date is defined", () => {
            it("should show a hovered range of [day, null]", () => {
                const { left, assertHoveredDays } = render();
                left.mouseEnterDay(14);
                assertHoveredDays(14, null);
            });
        });

        describe("when only start date is defined", () => {
            it("should show a hovered range of [start, day] if day > start", () => {
                const { left, assertHoveredDays } = render();
                left.clickDay(14).mouseEnterDay(18);
                assertHoveredDays(14, 18);
            });

            it("should show a hovered range of [null, null] if day === start", () => {
                const { left, assertHoveredDays } = render();
                left.clickDay(14).mouseEnterDay(14);
                assertHoveredDays(null, null);
            });

            it("should show a hovered range of [day, start] if day < start", () => {
                const { left, assertHoveredDays } = render();
                left.clickDay(14).mouseEnterDay(10);
                assertHoveredDays(10, 14);
            });

            it("should not show a hovered range when mousing over a disabled date", () => {
                const { left, right, assertHoveredDays } = render({
                    maxDate: new Date(2017, Months.FEBRUARY, 10),
                    minDate: new Date(2017, Months.JANUARY, 1),
                });
                left.clickDay(14); // Jan 14th
                right.mouseEnterDay(14); // Feb 14th
                assertHoveredDays(14, null);
            });
        });

        describe("when only end date is defined", () => {
            it("should show a hovered range of [end, day] if day > end", () => {
                const { left, assertHoveredDays } = render();
                left.clickDay(14)
                    .clickDay(18)
                    .clickDay(14) // deselect start date
                    .mouseEnterDay(22);
                assertHoveredDays(18, 22);
            });

            it("should show a hovered range of [null, null] if day === end", () => {
                const { left, assertHoveredDays } = render();
                left.clickDay(14).clickDay(18).clickDay(14).mouseEnterDay(18);
                assertHoveredDays(null, null);
            });

            it("should show a hovered range of [day, end] if day < end", () => {
                const { left, assertHoveredDays } = render();
                left.clickDay(14).clickDay(18).clickDay(14).mouseEnterDay(14);
                assertHoveredDays(14, 18);
            });
        });

        describe("when both start and end date are defined", () => {
            it("should show a hovered range of [null, end] if day === start", () => {
                const { left, assertHoveredDays } = render();
                left.clickDay(14).clickDay(18).mouseEnterDay(14);
                assertHoveredDays(null, 18);
            });

            it("should show a hovered range of [start, null] if day === end", () => {
                const { left, assertHoveredDays } = render();
                left.clickDay(14).clickDay(18).mouseEnterDay(18);
                assertHoveredDays(14, null);
            });

            it("should show a hovered range of [day, null] if start < day < end", () => {
                const { left, assertHoveredDays } = render();
                left.clickDay(14).clickDay(18).mouseEnterDay(16);
                assertHoveredDays(16, null);
            });

            it("should show a hovered range of [day, null] if day < start", () => {
                const { left, assertHoveredDays } = render();
                left.clickDay(14).clickDay(18).mouseEnterDay(10);
                assertHoveredDays(10, null);
            });

            it("should show a hovered range of [day, null] if day > end", () => {
                const { left, assertHoveredDays } = render();
                left.clickDay(14).clickDay(18).mouseEnterDay(22);
                assertHoveredDays(22, null);
            });

            it("should show a hovered range of [null, null] if start === day === end", () => {
                const { left, assertHoveredDays } = render({ allowSingleDayRange: true });
                left.clickDay(14).clickDay(14).mouseEnterDay(14);
                assertHoveredDays(null, null);
            });
        });

        it("hovering on day in month prior to selected start date's month, should not shift calendar view", () => {
            const INITIAL_MONTH = Months.MARCH;
            const MONTH_OUT_OF_VIEW = Months.JANUARY;
            const { left, right } = render({ initialMonth: new Date(2017, INITIAL_MONTH, 1) });

            left.clickDay(14).clickDay(18);
            left.monthSelect.simulate("change", { target: { value: MONTH_OUT_OF_VIEW } });
            // hover on left month
            left.mouseEnterDay(14);
            left.assertDisplayMonth(MONTH_OUT_OF_VIEW);

            // hover on right month
            right.mouseEnterDay(14);
            left.assertDisplayMonth(MONTH_OUT_OF_VIEW);
        });

        // verifies the fix for https://github.com/palantir/blueprint/issues/1048
        it("should show a hovered range when hovering with contiguousCalendarMonths=false", () => {
            const { left, right, assertHoveredDays } = render({ contiguousCalendarMonths: false });
            left.clickDay(14);
            right.mouseEnterDay(18);
            assertHoveredDays(14, 18);
        });
    });

    describe("when controlled", () => {
        it("should initially select a day from value", () => {
            const defaultValue: DateRange = [new Date(2010, Months.FEBRUARY, 2), null];
            const value: DateRange = [new Date(2010, Months.JANUARY, 1), null];
            render({ defaultValue, value }).assertSelectedDays(value[0]!.getDate());
        });

        it("should fire onChange when a day is clicked", () => {
            const { left } = render({ value: [null, null] });
            expect(onChangeSpy).not.toHaveBeenCalled();
            left.clickDay();
            expect(onChangeSpy).toHaveBeenCalledOnce();
        });

        it("should fire onHoverChange on mouseenter within a day", () => {
            const { left } = render({ value: [null, null] });
            expect(onHoverChangeSpy).not.toHaveBeenCalled();
            left.mouseEnterDay();
            expect(onHoverChangeSpy).toHaveBeenCalledOnce();
        });

        it("should fire onHoverChange on mouseleave within a day", () => {
            const { left } = render({ value: [null, null] });
            expect(onHoverChangeSpy).not.toHaveBeenCalled();
            left.findDay().simulate("mouseleave");
            expect(onHoverChangeSpy).toHaveBeenCalledOnce();
        });

        it("should not automatically update selected day", () => {
            const { left, assertSelectedDays } = render({ value: [null, null] });
            assertSelectedDays();
            left.clickDay();
            assertSelectedDays();
        });

        it("should change displayed date with the dropdowns in the caption", () => {
            const { left } = render({
                initialMonth: new Date(2015, Months.MARCH, 2),
                value: [null, null],
            });
            left.assertDisplayMonth(Months.MARCH, 2015);
            left.monthSelect.simulate("change", { target: { value: Months.JANUARY } });
            left.yearSelect.simulate("change", { target: { value: 2014 } });
            left.assertDisplayMonth(Months.JANUARY, 2014);
        });

        it("should fire onChange with correct values from shortcuts", () => {
            render().clickShortcut();

            const today = new Date();
            const aWeekAgo = DateUtils.clone(today);
            aWeekAgo.setDate(today.getDate() - 6);

            expect(onChangeSpy).toHaveBeenCalledOnce();
            const value = onChangeSpy.mock.calls[0][0];
            expect(DateUtils.isSameDay(aWeekAgo, value[0]!)).toBe(true);
            expect(DateUtils.isSameDay(today, value[1]!)).toBe(true);
        });

        it("should fire onChange with correct values from shortcuts when single day range enabled", () => {
            render({ allowSingleDayRange: true }).clickShortcut();

            const today = new Date();

            expect(onChangeSpy).toHaveBeenCalledOnce();
            const value = onChangeSpy.mock.calls[0][0];
            expect(DateUtils.isSameDay(today, value[0]!)).toBe(true);
            expect(DateUtils.isSameDay(today, value[1]!)).toBe(true);
        });

        it("should fire onChange with correct values from shortcuts when single day range and allowSingleDayRange enabled", () => {
            render({ allowSingleDayRange: true, timePrecision: "minute" }).clickShortcut();

            const today = new Date();
            const tomorrow = DateUtils.clone(today);
            tomorrow.setDate(today.getDate() + 1);

            expect(onChangeSpy).toHaveBeenCalledOnce();
            const value = onChangeSpy.mock.calls[0][0];
            expect(DateUtils.isSameDay(today, value[0]!)).toBe(true);
            expect(DateUtils.isSameDay(tomorrow, value[1]!)).toBe(true);
        });

        it("should display all shortcuts as inactive when none are selected", () => {
            const { wrapper } = render();

            expect(
                wrapper.find(DatePickerShortcutMenu).find(Menu).find(MenuItem).find(`.${CoreClasses.ACTIVE}`).exists(),
            ).toBe(false);
        });

        it("should display corresponding shortcut as active when selected", () => {
            const selectedShortcut = 0;
            const { wrapper } = render({ selectedShortcutIndex: selectedShortcut });

            expect(
                wrapper.find(DatePickerShortcutMenu).find(Menu).find(MenuItem).find(`.${CoreClasses.ACTIVE}`).exists(),
            ).toBe(true);

            expect(
                wrapper.find(DatePickerShortcutMenu).find(Menu).find(MenuItem).find(`.${CoreClasses.ACTIVE}`),
            ).toHaveLength(1);

            expect(wrapper.state("selectedShortcutIndex") === selectedShortcut).toBe(true);
        });

        it("should call onShortcutChangeSpy on selecting a shortcut ", () => {
            const selectedShortcut = 1;
            const onShortcutChangeSpy = vi.fn();
            const { clickShortcut } = render({ onShortcutChange: onShortcutChangeSpy });

            clickShortcut(selectedShortcut);

            expect(onChangeSpy).toHaveBeenCalledOnce();
            expect(onShortcutChangeSpy).toHaveBeenCalledOnce();
            expect(onShortcutChangeSpy.mock.lastCall?.at(-1)).toEqual(selectedShortcut);
        });

        it("should select the correct values from custom shortcuts", () => {
            const dateRange: NonNullDateRange = [new Date(2015, Months.JANUARY, 1), new Date(2015, Months.JANUARY, 5)];
            render({
                initialMonth: new Date(2015, Months.JANUARY, 1),
                shortcuts: [{ dateRange, label: "custom shortcut" }],
            }).clickShortcut();
            expect(onChangeSpy).toHaveBeenCalledOnce();
            const value = onChangeSpy.mock.calls[0][0];
            expect(DateUtils.isSameDay(dateRange[0], value[0]!)).toBe(true);
            expect(DateUtils.isSameDay(dateRange[1], value[1]!)).toBe(true);
        });

        it("should set the displayed months correctly from custom shortcuts when start month changes", () => {
            const dateRange: NonNullDateRange = [
                new Date(2016, Months.JANUARY, 1),
                new Date(2016, Months.DECEMBER, 31),
            ];
            const { left, right } = render({
                initialMonth: new Date(2015, Months.JANUARY, 1),
                shortcuts: [{ dateRange, label: "custom shortcut" }],
            }).clickShortcut();
            expect(onChangeSpy).toHaveBeenCalledOnce();
            left.assertDisplayMonth(Months.JANUARY, 2016);
            right.assertDisplayMonth(Months.FEBRUARY, 2016);
        });

        it(
            "should set the displayed months correctly from custom shortcuts when start month changes " +
                "and contiguousCalendarMonths is false",
            () => {
                const dateRange: NonNullDateRange = [
                    new Date(2016, Months.JANUARY, 1),
                    new Date(2016, Months.DECEMBER, 31),
                ];
                const { left, right } = render({
                    contiguousCalendarMonths: false,
                    initialMonth: new Date(2015, Months.JANUARY, 1),
                    shortcuts: [{ dateRange, label: "custom shortcut" }],
                }).clickShortcut();
                expect(onChangeSpy).toHaveBeenCalledOnce();
                left.assertDisplayMonth(Months.JANUARY, 2016);
                right.assertDisplayMonth(Months.DECEMBER, 2016);
            },
        );

        it("should set the displayed months correctly from custom shortcuts when start month stays the same", () => {
            const dateRange: NonNullDateRange = [
                new Date(2016, Months.JANUARY, 1),
                new Date(2016, Months.DECEMBER, 31),
            ];
            const { clickShortcut, left, right } = render({
                initialMonth: new Date(2016, Months.JANUARY, 1),
                shortcuts: [{ dateRange, label: "custom shortcut" }],
            });

            clickShortcut();
            expect(onChangeSpy).toHaveBeenCalledOnce();
            left.assertDisplayMonth(Months.JANUARY, 2016);
            right.assertDisplayMonth(Months.FEBRUARY, 2016);

            clickShortcut();
            left.assertDisplayMonth(Months.JANUARY, 2016);
            right.assertDisplayMonth(Months.FEBRUARY, 2016);
        });

        it("should set the displayed dates correctly from custom shortcuts when month stays the same but not years and contiguousCalendarMonths is false", () => {
            const dateRange: NonNullDateRange = [new Date(2014, Months.JUNE, 1), new Date(2015, Months.JUNE, 1)];
            const { clickShortcut, left, right } = render({
                contiguousCalendarMonths: false,
                initialMonth: new Date(2015, Months.JUNE, 1),
                shortcuts: [{ dateRange, label: "custom shortcut" }],
            });

            clickShortcut();
            expect(onChangeSpy).toHaveBeenCalledOnce();
            left.assertDisplayMonth(Months.JUNE, 2014);
            right.assertDisplayMonth(Months.JUNE, 2015);

            clickShortcut();
            left.assertDisplayMonth(Months.JUNE, 2014);
            right.assertDisplayMonth(Months.JUNE, 2015);
        });
    });

    describe("when uncontrolled", () => {
        it("should initially select a day from defaultValue", () => {
            const today = new Date();
            render({ defaultValue: [today, null] }).assertSelectedDays(today.getDate());
        });

        it("should fire onChange when a day is clicked", () => {
            const { left } = render();
            expect(onChangeSpy).not.toHaveBeenCalled();
            left.clickDay();
            expect(onChangeSpy).toHaveBeenCalledOnce();
        });

        it("should fire onHoverChange with correct values when a day is clicked", () => {
            const dateRange: NonNullDateRange = [new Date(2015, Months.JANUARY, 1), new Date(2015, Months.JANUARY, 5)];
            const { left } = render({ initialMonth: new Date(2015, Months.JANUARY, 1) });
            expect(onHoverChangeSpy).not.toHaveBeenCalled();
            left.clickDay(1);
            expect(onHoverChangeSpy).toHaveBeenCalledOnce();
            expect(DateUtils.isSameDay(dateRange[0], onHoverChangeSpy.mock.calls[0]![0]![0]!)).toBe(true);
            expect(onHoverChangeSpy.mock.calls[0]![0]![1]).toBeNull();
        });

        it("should fire onHoverChange with correct values on mouseenter within a day", () => {
            const dateRange: NonNullDateRange = [new Date(2015, Months.JANUARY, 1), new Date(2015, Months.JANUARY, 5)];
            const { left } = render({ initialMonth: new Date(2015, Months.JANUARY, 1) });
            expect(onHoverChangeSpy).not.toHaveBeenCalled();
            left.clickDay(1).mouseEnterDay(5);
            expect(onHoverChangeSpy).toHaveBeenCalledTimes(2);
            expect(DateUtils.isSameDay(dateRange[0], onHoverChangeSpy.mock.calls[1]![0]![0]!)).toBe(true);
            expect(DateUtils.isSameDay(dateRange[1], onHoverChangeSpy.mock.calls[1]![0]![1]!)).toBe(true);
        });

        it("should fire onHoverChange with `undefined` on mouseleave within a day", () => {
            const { left } = render({ initialMonth: new Date(2015, Months.JANUARY, 1) });
            expect(onHoverChangeSpy).not.toHaveBeenCalled();
            left.clickDay(1).findDay(5).simulate("mouseleave");
            expect(onHoverChangeSpy).toHaveBeenCalledTimes(2);
            expect(onHoverChangeSpy.mock.calls[1][0]).toBeUndefined();
        });

        it("should automatically update selected day", () => {
            const { assertSelectedDays, left } = render();
            assertSelectedDays();
            left.clickDay(3);
            assertSelectedDays(3);
        });

        it("should select a range of dates when two days are clicked", () => {
            const { assertSelectedDays, left } = render({
                initialMonth: new Date(2015, Months.JANUARY, 1),
            });
            assertSelectedDays();
            left.clickDay(10).clickDay(14);
            assertSelectedDays(10, 14);
        });

        it("should select a range of dates when days are clicked in reverse", () => {
            const { assertSelectedDays, left } = render({
                initialMonth: new Date(2015, Months.JANUARY, 1),
            });
            assertSelectedDays();
            left.clickDay(14).clickDay(10);
            assertSelectedDays(10, 14);
        });

        it("should deselect everything when only selected day is clicked", () => {
            const { assertSelectedDays, left } = render({
                initialMonth: new Date(2015, Months.JANUARY, 1),
            });
            left.clickDay(10).clickDay(10);
            assertSelectedDays();
        });

        it("should start a new selection when a non-endpoint is clicked in the current selection", () => {
            const { assertSelectedDays, left, right } = render({
                initialMonth: new Date(2015, Months.JANUARY, 1),
            });
            left.clickDay(10).clickDay(14);
            right.clickDay(11);
            assertSelectedDays(11);
        });

        it("should deselect endpoint when an endpoint of the current selection is clicked", () => {
            const { assertSelectedDays, left } = render({
                initialMonth: new Date(2015, Months.JANUARY, 1),
            });
            left.clickDay(10).clickDay(14).clickDay(10);
            assertSelectedDays(14);

            left.clickDay(10).clickDay(14);
            assertSelectedDays(10);
        });

        it("should allow start and end to be the same day when allowSingleDayRange={true}", () => {
            const { assertSelectedDays, left } = render({
                allowSingleDayRange: true,
                initialMonth: new Date(2015, Months.JANUARY, 1),
            });
            left.clickDay(10).clickDay(10);
            assertSelectedDays(10);
        });

        it("should select values from shortcuts", () => {
            const { wrapper } = render().clickShortcut();

            const today = new Date();
            const aWeekAgo = DateUtils.clone(today);
            aWeekAgo.setDate(today.getDate() - 6);

            const [start, end] = wrapper.state("value");
            expect(DateUtils.isSameDay(aWeekAgo, start!)).toBe(true);
            expect(DateUtils.isSameDay(today, end!)).toBe(true);
        });

        it("should select the correct values from custom shortcuts", () => {
            const dateRange: NonNullDateRange = [new Date(2015, Months.JANUARY, 1), new Date(2015, Months.JANUARY, 5)];
            render({
                initialMonth: new Date(2015, Months.JANUARY, 1),
                shortcuts: [{ dateRange, label: "custom shortcut" }],
            })
                .clickShortcut()
                .assertSelectedDays(1, 5);
        });

        it("should change displayed date with the dropdowns in the caption", () => {
            const { left } = render({ initialMonth: new Date(2015, Months.MARCH, 2) });
            left.assertDisplayMonth(Months.MARCH, 2015);
            left.monthSelect.simulate("change", { target: { value: Months.JANUARY } });
            left.yearSelect.simulate("change", { target: { value: 2014 } });
            left.assertDisplayMonth(Months.JANUARY, 2014);
        });

        it("should not change display month when selecting dates from left month", () => {
            const { left } = render({ initialMonth: new Date(2015, Months.MARCH, 2) });
            left.clickDay(2).clickDay(15).assertDisplayMonth(Months.MARCH, 2015);
        });

        it("should not change display month when selecting dates from right month", () => {
            const { right } = render({ initialMonth: new Date(2015, Months.MARCH, 2) });
            right.clickDay(2).clickDay(15).assertDisplayMonth(Months.APRIL, 2015);
        });

        it("should not change display month when selecting dates from left and right month", () => {
            const { left, right } = render({ initialMonth: new Date(2015, Months.MARCH, 2) });
            right.clickDay(15);
            left.clickDay(2).assertDisplayMonth(Months.MARCH, 2015);
        });

        it("should not change display month when selecting dates across December (left) and January (right)", () => {
            const { left, right } = render({ initialMonth: new Date(2015, Months.DECEMBER, 2) });
            left.clickDay(15);
            right.clickDay(2);
            left.assertDisplayMonth(Months.DECEMBER, 2015);
        });
    });

    describe("time selection", () => {
        const defaultRange: NonNullDateRange = [new Date(2012, 2, 5, 6, 5, 40), new Date(2012, 4, 5, 7, 8, 20)];

        it("should show a TimePicker when timePrecision is set", () => {
            const { wrapper } = render();
            expect(wrapper.find(TimePicker).exists()).toBe(false);
            wrapper.setProps({ timePrecision: "minute" });
            expect(wrapper.find(TimePicker).exists()).toBe(true);
        });

        it("should show a TimePicker when timePickerProps is set", () => {
            const { wrapper } = render({ timePickerProps: {} });
            expect(wrapper.find(TimePicker).exists()).toBe(true);
        });

        it("should fire onChange when the time is changed", () => {
            const { wrapper } = render({
                defaultValue: defaultRange,
                timePickerProps: { showArrowButtons: true },
            });
            expect(onChangeSpy).not.toHaveBeenCalled();
            wrapper.find(`.${Classes.TIMEPICKER_ARROW_BUTTON}.${Classes.TIMEPICKER_HOUR}`).first().simulate("click");
            expect(onChangeSpy).toHaveBeenCalledOnce();
            const cbHour = onChangeSpy.mock.calls[0][0][0]!.getHours();
            expect(cbHour).toBe(defaultRange[0].getHours() + 1);
        });

        it("should not change time when changing date", () => {
            render({ defaultValue: defaultRange, timePrecision: "minute" }).left.clickDay(16);
            expect(DateUtils.isSameTime(onChangeSpy.mock.calls[0][0][0] as Date, defaultRange[0])).toBe(true);
        });

        it("should not change date when changing time", () => {
            render({ defaultValue: defaultRange, timePrecision: "minute" }).setTimeInput("minute", "left", 10);
            expect(DateUtils.isSameDay(onChangeSpy.mock.calls[0][0][0] as Date, defaultRange[0])).toBe(true);
        });

        it("should not change entered time when hovering over date", () => {
            const harness = render({ defaultValue: defaultRange, timePrecision: "minute" });
            const newLeftMinute = 10;
            harness.setTimeInput("minute", "left", newLeftMinute);
            onChangeSpy.mockClear();
            const { left } = harness;
            left.mouseEnterDay(5);
            expect(onChangeSpy).not.toHaveBeenCalled();
            const minuteInputText = harness.getTimeInput("minute", "left");
            expect(parseInt(minuteInputText, 10)).toBe(newLeftMinute);
        });

        it("should use today when changing time without date and other date not selected", () => {
            render({ timePrecision: "minute" }).setTimeInput("minute", "left", 45);
            expect(DateUtils.isSameDay(onChangeSpy.mock.calls[0][0][0] as Date, new Date())).toBe(true);
        });

        it("should use other date when changing time without date if selected and `allowSingleDayRange` is true", () => {
            const dateRange = render({ allowSingleDayRange: true, timePrecision: "minute" });

            dateRange.left.clickDay(10);
            dateRange.setTimeInput("minute", "right", 45);
            const [start, end] = dateRange.wrapper.state("value");

            expect(start).not.toBeNull();
            expect(end).not.toBeNull();
            expect(DateUtils.isSameDay(start!, end!)).toBe(true);
        });

        it("should use 1 day offset from other date when changing time without date if selected and `allowSingleDayRange` is false", () => {
            const dateRange = render({ allowSingleDayRange: false, timePrecision: "minute" });

            dateRange.left.clickDay(10);
            dateRange.setTimeInput("minute", "right", 45);
            const [start, end] = dateRange.wrapper.state("value");

            expect(start).not.toBeNull();
            expect(end).not.toBeNull();
            expect(DateUtils.isSameDay(end!, addDays(start!, 1))).toBe(true);
        });

        it("should not change time when clicking a shortcut with includeTime=false", () => {
            render({ defaultValue: defaultRange, timePrecision: "minute" }).clickShortcut();
            expect(DateUtils.isSameTime(onChangeSpy.mock.calls[0][0][0] as Date, defaultRange[0])).toBe(true);
        });

        it("should change time when clicking a shortcut with includeTime=true", () => {
            const endTime = defaultRange[1];
            const startTime = new Date(defaultRange[1].getTime());
            startTime.setHours(startTime.getHours() - 2);

            const shortcuts: DateRangeShortcut[] = [
                {
                    dateRange: [startTime, endTime] as NonNullDateRange,
                    includeTime: true,
                    label: "shortcut with time",
                },
            ];

            render({
                defaultValue: defaultRange,
                shortcuts,
                timePrecision: "minute",
            }).clickShortcut();
            expect(DateUtils.isEqual(onChangeSpy.mock.calls[0][0][0] as Date, startTime)).toBe(true);
        });

        it("should not change time when selecting and unselecting a day", () => {
            const leftDatePicker = render({ defaultValue: defaultRange, timePrecision: "minute" }).left;
            leftDatePicker.clickDay(5);
            leftDatePicker.clickDay(5);
            expect(DateUtils.isSameTime(onChangeSpy.mock.calls[1][0][0] as Date, defaultRange[0])).toBe(true);
        });
    });

    function dayNotOutside(day: ReactWrapper) {
        return !day.hasClass(Classes.DATEPICKER3_DAY_OUTSIDE);
    }

    function render(props?: DateRangePickerProps) {
        onChangeSpy = vi.fn();
        onHoverChangeSpy = vi.fn();
        return wrap(<DateRangePicker onChange={onChangeSpy} onHoverChange={onHoverChangeSpy} {...props} />);
    }

    function wrap(datepicker: React.JSX.Element) {
        const wrapper = mount<DateRangePickerProps, DateRangePickerState>(datepicker, {
            attachTo: testsContainerElement,
        });
        drpWrapper = wrapper;

        const findTimeInput = (precision: TimePrecision | "hour", which: "left" | "right") =>
            wrapper.find(`.${Classes.TIMEPICKER}-${precision}`).at(which === "left" ? 0 : 1);

        // Don't cache the left/right day pickers into variables in this scope,
        // because as of Enzyme 3.0 they can get stale if the views change.
        const harness = {
            wrapper,

            left: wrapDayPicker(wrapper, "left"),
            right: wrapDayPicker(wrapper, "right"),
            shortcuts: wrapper.find(`.${Classes.DATERANGEPICKER_SHORTCUTS}`).hostNodes(),

            assertHoveredDays: (fromDate: number | null, toDate: number | null) => {
                const [from, to] = wrapper.state("hoverValue")!;

                if (fromDate == null) {
                    expect(from).toBeNull();
                } else {
                    expect(from!.getDate()).toBe(fromDate);
                }

                if (toDate == null) {
                    expect(to).toBeNull();
                } else {
                    expect(to!.getDate()).toBe(toDate);
                }

                return harness;
            },
            assertSelectedDays: (from?: number, to?: number) => {
                const rangeStart = wrapper.find(`.${Classes.DATERANGEPICKER3_SELECTED_RANGE_START}`).first();
                const rangeEnd = wrapper.find(`.${Classes.DATERANGEPICKER3_SELECTED_RANGE_END}`).first();
                if (from !== undefined) {
                    expect(rangeStart.exists()).toBe(true);
                    expect(parseInt(rangeStart.text(), 10)).toBe(from);
                }
                if (to !== undefined) {
                    expect(rangeEnd.exists()).toBe(true);
                    expect(parseInt(rangeEnd.text(), 10)).toBe(to);
                }
                if (from !== undefined && to !== undefined) {
                    expect(harness.getDays(Classes.DATERANGEPICKER3_SELECTED_RANGE_MIDDLE)).toHaveLength(
                        Math.max(0, to - from - 1),
                    );
                }
            },
            changeTimeInput: (precision: TimePrecision | "hour", which: "left" | "right", value: number) =>
                findTimeInput(precision, which).simulate("change", { target: { value } }),
            clickNavButton: (which: "next" | "previous", navIndex = 0) => {
                const month = wrapper.find(`.rdp-month`).at(navIndex);
                const navButton = month.find(`.${Classes.DATEPICKER3_NAV_BUTTON}-${which}`);
                navButton.hostNodes().simulate("click");
                return harness;
            },
            clickShortcut: (index = 0) => {
                harness.shortcuts.find("a").at(index).simulate("click");
                return harness;
            },
            getDays: (className: string) => {
                return wrapper.find(`.${className}`).filterWhere(dayNotOutside).hostNodes();
            },
            getTimeInput: (precision: TimePrecision | "hour", which: "left" | "right") =>
                findTimeInput(precision, which).props().value as string,
            setTimeInput: (precision: TimePrecision | "hour", which: "left" | "right", value: number) =>
                findTimeInput(precision, which).simulate("blur", { target: { value } }),
        };
        return harness;
    }

    function wrapDayPicker(
        parent: ReactWrapper<DateRangePickerProps, DateRangePickerState>,
        whichCalendar: "left" | "right",
    ) {
        /* eslint-disable sort-keys */
        const harness = {
            get wrapper() {
                // use accessor to ensure it's always the latest reference
                return parent
                    .find(DayPicker)
                    .find("Month")
                    .at(whichCalendar === "left" ? 0 : 1);
            },
            get displayMonthAndYear(): MonthAndYear {
                const captionLabel = harness.wrapper.find(`.${ReactDayPickerClasses.RDP_CAPTION_LABEL}`);
                expect(captionLabel.exists()).toBe(true);
                const [monthText, yearText] = captionLabel.text().split(" ");
                const month = getMonthIndex(monthText);
                const year = parseInt(yearText, 10);
                return new MonthAndYear(month, year);
            },
            get monthSelect() {
                return harness.wrapper.find(`.${Classes.DATEPICKER_MONTH_SELECT}`).find("select");
            },
            get yearSelect() {
                return harness.wrapper.find(`.${Classes.DATEPICKER_YEAR_SELECT}`).find("select");
            },

            assertDisplayMonth: (expectedMonth: number, expectedYear?: number) => {
                const displayMonthAndYear = harness.displayMonthAndYear;
                expect(displayMonthAndYear.getMonth()).toBe(expectedMonth);
                if (expectedYear !== undefined) {
                    expect(displayMonthAndYear.getYear()).toBe(expectedYear);
                }
            },
            clickDay: (dayNumber = 1) => {
                harness.findDay(dayNumber).simulate("click");
                return harness;
            },
            findDay: (dayNumber = 1) => {
                return harness
                    .findDays()
                    .filterWhere(day => day.text() === "" + dayNumber)
                    .filterWhere(day => !day.hasClass(Classes.DATEPICKER3_DAY_OUTSIDE))
                    .first();
            },
            findDays: () => harness.wrapper.find(`.${Classes.DATEPICKER3_DAY}`),
            mouseEnterDay: (dayNumber = 1) => {
                harness.findDay(dayNumber).simulate("mouseenter");
                return harness;
            },
        };
        /* eslint-enable sort-keys */
        return harness;
    }
});

function renderMonthName(monthIndex: number) {
    return format(new Date(2023, monthIndex), "LLLL", { locale: enUSLocale });
}

function getMonthIndex(monthName: string) {
    return parse(monthName, "LLLL", new Date(), { locale: enUSLocale }).getMonth();
}
