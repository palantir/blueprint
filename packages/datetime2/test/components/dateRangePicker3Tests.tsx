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

import { assert } from "chai";
import { format, parse } from "date-fns";
import enUSLocale from "date-fns/locale/en-US";
import { mount, type ReactWrapper } from "enzyme";
import * as React from "react";
import { type DayModifiers, DayPicker, type ModifiersClassNames } from "react-day-picker";
import sinon from "sinon";

import { Button, Classes, Menu, MenuItem } from "@blueprintjs/core";
import {
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
} from "@blueprintjs/datetime";

import { DateRangePicker3, type DateRangePicker3Props, Datetime2Classes, ReactDayPickerClasses } from "../../src";
import type { DateRangePicker3State } from "../../src/components/date-range-picker3/dateRangePicker3State";
import { assertDayDisabled } from "../common/dayPickerTestUtils";
import { loadDateFnsLocaleFake } from "../common/loadDateFnsLocaleFake";

// Change the default for testability
(DateRangePicker3.defaultProps as DateRangePicker3Props).dateFnsLocaleLoader = loadDateFnsLocaleFake;

describe("<DateRangePicker3>", () => {
    let testsContainerElement: HTMLElement;
    let drpWrapper: ReactWrapper<DateRangePicker3Props, DateRangePicker3State>;

    let onChangeSpy: sinon.SinonSpy;
    let onHoverChangeSpy: sinon.SinonSpy;

    beforeEach(() => {
        testsContainerElement = document.createElement("div");
        document.body.appendChild(testsContainerElement);
    });

    afterEach(() => {
        drpWrapper?.unmount();
        drpWrapper?.detach();
        testsContainerElement.remove();
    });

    it("renders its template", () => {
        const { wrapper } = render();
        assert.isTrue(wrapper.find(`.${Datetime2Classes.DATERANGEPICKER}`).exists());
    });

    it("no days are selected by default", () => {
        const { wrapper, assertSelectedDays } = render();
        assert.deepEqual(wrapper.state("value"), [null, null]);
        assertSelectedDays();
    });

    it("user-provided modifiers are applied", () => {
        const modifiers: DayModifiers = { odd: (d: Date) => d.getDate() % 2 === 1 };
        const modifiersClassNames: ModifiersClassNames = {
            odd: "test-odd",
        };
        const { left } = render({ dayPickerProps: { modifiers, modifiersClassNames } });
        assert.isFalse(left.findDay(4).hasClass(modifiersClassNames.odd));
        assert.isTrue(left.findDay(5).hasClass(modifiersClassNames.odd));
    });

    describe("reconciliates dayPickerProps", () => {
        it("hides unnecessary nav buttons in contiguous months mode", () => {
            const defaultValue: DateRange = [new Date(2017, Months.SEPTEMBER, 1), null];
            const { wrapper } = wrap(<DateRangePicker3 defaultValue={defaultValue} />);
            assert.isFalse(
                wrapper.find(".rdp-month").at(0).find(`.${Datetime2Classes.DATEPICKER3_NAV_BUTTON_NEXT}`).exists(),
            );
            assert.isFalse(
                wrapper.find(".rdp-month").at(1).find(`.${Datetime2Classes.DATEPICKER3_NAV_BUTTON_PREVIOUS}`).exists(),
            );
        });

        it("disables days according to custom modifiers in addition to default modifiers", () => {
            const disableFridays = { dayOfWeek: [5] };
            const defaultValue: DateRange = [new Date(2017, Months.SEPTEMBER, 1), null];
            const maxDate = new Date(2017, Months.OCTOBER, 20);

            const { left, right } = wrap(
                <DateRangePicker3
                    dayPickerProps={{ disabled: disableFridays }}
                    defaultValue={defaultValue}
                    maxDate={maxDate}
                />,
            );

            assertDayDisabled(left.findDay(15));
            assertDayDisabled(right.findDay(21));
            assertDayDisabled(left.findDay(10), false);
        });

        it("disables out-of-range max dates", () => {
            const { right } = wrap(
                <DateRangePicker3
                    initialMonth={new Date(2017, Months.AUGUST, 1)}
                    maxDate={new Date(2017, Months.SEPTEMBER, 20)}
                />,
            );
            assertDayDisabled(right.findDay(21));
            assertDayDisabled(right.findDay(10), false);
        });

        it("disables out-of-range min dates", () => {
            const { left } = wrap(
                <DateRangePicker3
                    initialMonth={new Date(2017, Months.AUGUST, 1)}
                    minDate={new Date(2017, Months.AUGUST, 20)}
                />,
            );
            assertDayDisabled(left.findDay(10));
            assertDayDisabled(left.findDay(21), false);
        });

        describe("event handlers", () => {
            // use a date that lets us navigate forward and backward in the same year
            const defaultValue = [new Date(2017, Months.SEPTEMBER, 1), null] as DateRange;

            it("calls onMonthChange on button next click", () => {
                const onMonthChange = sinon.spy();
                wrap(
                    <DateRangePicker3 defaultValue={defaultValue} dayPickerProps={{ onMonthChange }} />,
                ).clickNavButton("next", 1);
                assert.isTrue(onMonthChange.called);
            });

            it("calls onMonthChange on button prev click", () => {
                const onMonthChange = sinon.spy();
                wrap(
                    <DateRangePicker3 defaultValue={defaultValue} dayPickerProps={{ onMonthChange }} />,
                ).clickNavButton("previous");
                assert.isTrue(onMonthChange.called);
            });

            it("calls onMonthChange on button next click of left calendar", () => {
                const onMonthChange = sinon.spy();
                wrap(
                    <DateRangePicker3
                        defaultValue={defaultValue}
                        contiguousCalendarMonths={false}
                        dayPickerProps={{ onMonthChange }}
                    />,
                ).clickNavButton("next");
                assert.isTrue(onMonthChange.called);
            });

            it("calls onMonthChange on button prev click of left calendar", () => {
                const onMonthChange = sinon.spy();
                wrap(
                    <DateRangePicker3
                        defaultValue={defaultValue}
                        contiguousCalendarMonths={false}
                        dayPickerProps={{ onMonthChange }}
                    />,
                ).clickNavButton("previous");
                assert.isTrue(onMonthChange.called);
            });

            it("calls onMonthChange on button next click of right calendar", () => {
                const onMonthChange = sinon.spy();
                wrap(
                    <DateRangePicker3
                        defaultValue={defaultValue}
                        contiguousCalendarMonths={false}
                        dayPickerProps={{ onMonthChange }}
                    />,
                ).clickNavButton("next", 1);
                assert.isTrue(onMonthChange.called);
            });

            it("calls onMonthChange on button prev click of right calendar", () => {
                const onMonthChange = sinon.spy();
                wrap(
                    <DateRangePicker3
                        defaultValue={defaultValue}
                        contiguousCalendarMonths={false}
                        dayPickerProps={{ onMonthChange }}
                    />,
                ).clickNavButton("previous", 1);
                assert.isTrue(onMonthChange.called);
            });

            it("calls onMonthChange on month select change in left calendar", () => {
                const onMonthChange = sinon.spy();
                wrap(
                    <DateRangePicker3 defaultValue={defaultValue} dayPickerProps={{ onMonthChange }} />,
                ).left.monthSelect.simulate("change");
                assert.isTrue(onMonthChange.called);
            });

            it("calls onMonthChange on month select change in right calendar", () => {
                const onMonthChange = sinon.spy();
                wrap(
                    <DateRangePicker3 defaultValue={defaultValue} dayPickerProps={{ onMonthChange }} />,
                ).right.monthSelect.simulate("change");
                assert.isTrue(onMonthChange.called);
            });

            it("calls onMonthChange on year select change in left calendar", () => {
                const onMonthChange = sinon.spy();
                wrap(
                    <DateRangePicker3 defaultValue={defaultValue} dayPickerProps={{ onMonthChange }} />,
                ).left.monthSelect.simulate("change");
                assert.isTrue(onMonthChange.called);
            });

            it("calls onMonthChange on year select change in right calendar", () => {
                const onMonthChange = sinon.spy();
                wrap(
                    <DateRangePicker3 defaultValue={defaultValue} dayPickerProps={{ onMonthChange }} />,
                ).right.monthSelect.simulate("change");
                assert.isTrue(onMonthChange.called);
            });

            it("calls onDayMouseEnter", () => {
                const onDayMouseEnter = sinon.spy();
                render({ defaultValue, dayPickerProps: { onDayMouseEnter } }).left.mouseEnterDay(14);
                assert.isTrue(onDayMouseEnter.called);
            });

            it("calls onDayMouseLeave", () => {
                const onDayMouseLeave = sinon.spy();
                render({ defaultValue, dayPickerProps: { onDayMouseLeave } })
                    .left.mouseEnterDay(14)
                    .findDay(14)
                    .simulate("mouseleave");
                assert.isTrue(onDayMouseLeave.called);
            });

            it("calls onDayClick", () => {
                const onDayClick = sinon.spy();
                render({ defaultValue, dayPickerProps: { onDayClick } }).left.clickDay(14);
                assert.isTrue(onDayClick.called);
            });
        });

        describe("for i18n", () => {
            // regression test for https://github.com/palantir/blueprint/issues/6489
            it("DatePicker3Caption accepts custom month name formatters (contiguousCalendarMonths={false})", () => {
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
                    <DateRangePicker3
                        initialMonth={initialMonth}
                        contiguousCalendarMonths={false}
                        dayPickerProps={{ formatters }}
                    />,
                );
                const leftMonth = left.monthSelect.getDOMNode<HTMLSelectElement>();
                assert.strictEqual(leftMonth.selectedIndex, initialMonthIndex);
                for (const option of Array.from(leftMonth.options)) {
                    assert.strictEqual(option.text, CUSTOM_MONTH_NAMES[option.index]);
                }
            });
        });
    });

    describe("initially displayed month", () => {
        it("is initialMonth if set", () => {
            const defaultValue = [new Date(2007, Months.APRIL, 4), null] as DateRange;
            const initialMonth = new Date(2002, Months.MARCH, 1);
            const maxDate = new Date(2030, Months.JANUARY);
            const minDate = new Date(2000, Months.JANUARY);
            const { left } = render({ defaultValue, initialMonth, maxDate, minDate });
            left.assertDisplayMonth(Months.MARCH, 2002);
        });

        it("is defaultValue if set and initialMonth not set", () => {
            const defaultValue = [new Date(2007, Months.APRIL, 4), null] as DateRange;
            const maxDate = new Date(2030, Months.JANUARY);
            const minDate = new Date(2000, Months.JANUARY);
            const { left } = render({ defaultValue, maxDate, minDate });
            left.assertDisplayMonth(Months.APRIL, 2007);
        });

        it("is value if set and initialMonth not set", () => {
            const maxDate = new Date(2030, Months.JANUARY);
            const minDate = new Date(2000, Months.JANUARY);
            const value = [new Date(2007, Months.APRIL, 4), null] as DateRange;
            const { left } = render({ maxDate, minDate, value });
            left.assertDisplayMonth(Months.APRIL, 2007);
        });

        it("has correct initial month on singleMonthOnly and maxDate == initialMonth", () => {
            const maxDate = new Date(2019, Months.MAY, 6);
            const minDate = new Date(2019, Months.MARCH, 3);
            const initialMonth = maxDate;
            const { left } = render({ singleMonthOnly: true, maxDate, minDate, initialMonth });
            left.assertDisplayMonth(Months.MAY, 2019);
        });

        it("is (endDate - 1 month) if only endDate is set", () => {
            const value = [null, new Date(2007, Months.APRIL, 4)] as DateRange;
            const { left } = render({ value });
            left.assertDisplayMonth(Months.MARCH, 2007);
        });

        it("is endDate if only endDate is set and endDate === minDate month", () => {
            const minDate = new Date(2007, Months.APRIL);
            const value = [null, new Date(2007, Months.APRIL, 4)] as DateRange;
            const { left } = render({ minDate, value });
            left.assertDisplayMonth(Months.APRIL, 2007);
        });

        it("is today if only maxDate/minDate set and today is in date range", () => {
            const maxDate = new Date(2030, Months.JANUARY);
            const minDate = new Date(2000, Months.JANUARY);
            const today = new Date();
            const { left } = render({ maxDate, minDate });
            left.assertDisplayMonth(today.getMonth(), today.getFullYear());
        });

        it("is a day between minDate and maxDate if only maxDate/minDate set and today is not in range", () => {
            const maxDate = new Date(2005, Months.JANUARY);
            const minDate = new Date(2000, Months.JANUARY);
            const { left } = render({ maxDate, minDate });
            assert.isTrue(DateUtils.isDayInRange(left.displayMonthAndYear.getFullDate(), [minDate, maxDate]));
        });

        it("is initialMonth - 1 if initialMonth === maxDate month", () => {
            const MAX_YEAR = 2016;

            const initialMonth = new Date(MAX_YEAR, Months.DECEMBER, 1);
            const maxDate = new Date(MAX_YEAR, Months.DECEMBER, 31);
            const minDate = new Date(2000, 0);

            const { left } = render({ initialMonth, maxDate, minDate });
            left.assertDisplayMonth(Months.NOVEMBER, MAX_YEAR);
        });

        it("is value - 1 if set and initialMonth not set and value month === maxDate month", () => {
            const value = [new Date(2017, Months.OCTOBER, 4), null] as DateRange;
            const maxDate = new Date(2017, Months.OCTOBER, 15);

            const { left } = render({ maxDate, value });
            left.assertDisplayMonth(Months.SEPTEMBER, 2017);
        });

        it("is initialMonth if initialMonth === minDate month and initialMonth === maxDate month", () => {
            const YEAR = 2016;

            const initialMonth = new Date(YEAR, Months.DECEMBER, 11);
            const maxDate = new Date(YEAR, Months.DECEMBER, 15);
            const minDate = new Date(YEAR, Months.DECEMBER, 1);

            const { left } = render({ initialMonth, maxDate, minDate });
            left.assertDisplayMonth(Months.DECEMBER, YEAR);
        });

        it("right calendar shows the month immediately after the left view by default", () => {
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
            assert.equal(options.first().text(), expectedFirstOption, "First option in dropdown");
            assert.equal(options.last().text(), expectedLastOption, "Last option in dropdown");
        }

        it("only shows one calendar when minDate and maxDate are in the same month", () => {
            const minDate = new Date(2015, Months.DECEMBER, 1);
            const maxDate = new Date(2015, Months.DECEMBER, 15);
            const { wrapper, right } = render({
                contiguousCalendarMonths: false,
                maxDate,
                minDate,
            });
            assert.isFalse(right.wrapper.exists());
            // nav buttons are disabled
            assert.isTrue(wrapper.find(Button).every({ disabled: true }));
        });

        it("only shows one calendar when singleMonthOnly is set", () => {
            const { right } = render({ singleMonthOnly: true });
            assert.isFalse(right.wrapper.exists());
        });

        it("left calendar is bound between minDate and (maxDate - 1 month)", () => {
            const minDate = new Date(2015, Months.JANUARY, 1);
            const maxDate = new Date(2015, Months.DECEMBER, 15);
            const { monthSelect } = render({
                contiguousCalendarMonths: false,
                maxDate,
                minDate,
            }).left;
            assertSelectOptionBounds(monthSelect, Months.JANUARY, Months.NOVEMBER);
        });

        it("right calendar is bound between (minDate + 1 month) and maxDate", () => {
            const minDate = new Date(2015, Months.JANUARY, 1);
            const maxDate = new Date(2015, Months.DECEMBER, 15);
            const { monthSelect } = render({
                contiguousCalendarMonths: false,
                maxDate,
                minDate,
            }).right;
            assertSelectOptionBounds(monthSelect, Months.FEBRUARY, Months.DECEMBER);
        });

        it("right calendar shows the month containing the selected end date", () => {
            const startDate = new Date(2017, Months.MAY, 5);
            const endDate = new Date(2017, Months.JULY, 5);
            const { right } = render({
                contiguousCalendarMonths: false,
                value: [startDate, endDate],
            });
            right.assertDisplayMonth(Months.JULY);
        });

        it("right calendar shows the month immediately after the left view if startDate === endDate month", () => {
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
        it("changing left calendar with month dropdown shifts left to the selected month", () => {
            const initialMonth = new Date(2015, Months.MAY, 5);

            const { left, right } = render({ initialMonth });
            left.assertDisplayMonth(Months.MAY);
            right.assertDisplayMonth(Months.JUNE);
            left.monthSelect.simulate("change", { target: { value: Months.AUGUST } });
            left.assertDisplayMonth(Months.AUGUST);
            right.assertDisplayMonth(Months.SEPTEMBER);
        });

        it("changing right calendar with month dropdown shifts right to the selected month", () => {
            const initialMonth = new Date(2015, Months.MAY, 5);

            const { left, right } = render({ initialMonth });
            left.assertDisplayMonth(Months.MAY);
            right.assertDisplayMonth(Months.JUNE);
            right.monthSelect.simulate("change", { target: { value: Months.AUGUST } });
            left.assertDisplayMonth(Months.JULY);
            right.assertDisplayMonth(Months.AUGUST);
        });

        it("changing left calendar with year dropdown shifts left to the selected year", () => {
            const initialMonth = new Date(2015, Months.MAY, 5);
            const NEW_YEAR = 2012;

            const { left, right } = render({ initialMonth });
            left.assertDisplayMonth(Months.MAY);
            right.assertDisplayMonth(Months.JUNE);
            left.yearSelect.simulate("change", { target: { value: NEW_YEAR } });
            left.assertDisplayMonth(Months.MAY, NEW_YEAR);
            right.assertDisplayMonth(Months.JUNE, NEW_YEAR);
        });

        it("changing right calendar with year dropdown shifts right to the selected year", () => {
            const initialMonth = new Date(2015, Months.MAY, 5);
            const NEW_YEAR = 2012;

            const { left, right } = render({ initialMonth });
            left.assertDisplayMonth(Months.MAY);
            right.assertDisplayMonth(Months.JUNE);
            right.yearSelect.simulate("change", { target: { value: NEW_YEAR } });
            left.assertDisplayMonth(Months.MAY, NEW_YEAR);
            right.assertDisplayMonth(Months.JUNE, NEW_YEAR);
        });

        it("when calendar is between December and January, changing left calendar with year dropdown shifts left to the selected year", () => {
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

        it("when calendar is between December and January, changing right calendar with year dropdown shifts right to the selected year", () => {
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
        it("left calendar can be altered independently of right calendar", () => {
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

        it("right calendar can be altered independently of left calendar", () => {
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

        it("changing left calendar with month dropdown to be equal or after right calendar, shifts the right", () => {
            const initialMonth = new Date(2015, Months.MAY, 5);

            const { left, right } = render({ initialMonth, contiguousCalendarMonths: false });
            left.assertDisplayMonth(Months.MAY);
            right.assertDisplayMonth(Months.JUNE);
            left.monthSelect.simulate("change", { target: { value: Months.AUGUST } });
            left.assertDisplayMonth(Months.AUGUST);
            right.assertDisplayMonth(Months.SEPTEMBER);
        });

        it("changing right calendar with month dropdown to be equal or before left calendar, shifts the left", () => {
            const initialMonth = new Date(2015, Months.MAY, 5);

            const { left, right } = render({ initialMonth, contiguousCalendarMonths: false });
            left.assertDisplayMonth(Months.MAY);
            right.assertDisplayMonth(Months.JUNE);
            right.monthSelect.simulate("change", { target: { value: Months.APRIL } });
            left.assertDisplayMonth(Months.MARCH);
            right.assertDisplayMonth(Months.APRIL);
        });

        it("changing left calendar with year dropdown to be equal or after right calendar, shifts the right", () => {
            const initialMonth = new Date(2013, Months.MAY, 5);
            const NEW_YEAR = 2014;

            const { left, right } = render({ initialMonth, contiguousCalendarMonths: false });
            left.yearSelect.simulate("change", { target: { value: NEW_YEAR } });
            left.assertDisplayMonth(Months.MAY, NEW_YEAR);
            right.assertDisplayMonth(Months.JUNE, NEW_YEAR);
        });

        it("changing right calendar with year dropdown to be equal or before left calendar, shifts the left", () => {
            const initialMonth = new Date(2013, Months.MAY, 5);
            const NEW_YEAR = 2012;

            const { left, right } = render({ initialMonth, contiguousCalendarMonths: false });
            right.yearSelect.simulate("change", { target: { value: NEW_YEAR } });
            left.assertDisplayMonth(Months.MAY, NEW_YEAR);
            right.assertDisplayMonth(Months.JUNE, NEW_YEAR);
        });

        it("changing left calendar with navButton to equal right calendar, shifts the right", () => {
            const initialMonth = new Date(2015, Months.MAY, 5);

            const { left, right, clickNavButton } = render({
                contiguousCalendarMonths: false,
                initialMonth,
            });
            clickNavButton("next");
            left.assertDisplayMonth(Months.JUNE);
            right.assertDisplayMonth(Months.JULY);
        });

        it("changing right calendar with navButton to equal left calendar, shifts the left", () => {
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

        let consoleError: sinon.SinonStub;

        before(() => (consoleError = sinon.stub(console, "error")));
        afterEach(() => consoleError.resetHistory());
        after(() => consoleError.restore());

        it("maxDate must be later than minDate", () => {
            wrap(
                <DateRangePicker3
                    minDate={new Date(2000, Months.JANUARY, 10)}
                    maxDate={new Date(2000, Months.JANUARY, 8)}
                />,
            );
            assert.isTrue(consoleError.calledOnceWith(Errors.DATERANGEPICKER_MAX_DATE_INVALID));
        });

        it("only days outside bounds have disabled class", () => {
            const minDate = new Date(2000, Months.JANUARY, 10);
            const initialMonth = minDate;
            const { left } = render({ initialMonth, minDate });
            assert.isTrue(left.findDay(8).hasClass(Datetime2Classes.DATEPICKER3_DAY_DISABLED));
            assert.isFalse(left.findDay(10).hasClass(Datetime2Classes.DATEPICKER3_DAY_DISABLED));
        });

        it("an error is logged if defaultValue is outside bounds", () => {
            wrap(
                <DateRangePicker3
                    defaultValue={[new Date(2015, Months.JANUARY, 12), null] as DateRange}
                    minDate={new Date(2015, Months.JANUARY, 5)}
                    maxDate={new Date(2015, Months.JANUARY, 7)}
                />,
            );
            assert.isTrue(consoleError.calledOnceWith(Errors.DATERANGEPICKER_DEFAULT_VALUE_INVALID));
        });

        it("an error is logged if initialMonth is outside month bounds", () => {
            wrap(
                <DateRangePicker3
                    initialMonth={new Date(2015, Months.FEBRUARY, 12)}
                    minDate={new Date(2015, Months.JANUARY, 5)}
                    maxDate={new Date(2015, Months.JANUARY, 7)}
                />,
            );
            assert.isTrue(consoleError.calledOnceWith(Errors.DATERANGEPICKER_INITIAL_MONTH_INVALID));
        });

        it("no error if initialMonth is outside day bounds but inside month bounds", () => {
            wrap(
                <DateRangePicker3
                    initialMonth={new Date(2015, Months.JANUARY, 12)}
                    minDate={new Date(2015, Months.JANUARY, 5)}
                    maxDate={new Date(2015, Months.JANUARY, 7)}
                />,
            );
            assert.isTrue(consoleError.notCalled);
        });

        it("an error is logged if value is outside bounds", () => {
            wrap(
                <DateRangePicker3
                    value={[new Date(2015, Months.JANUARY, 12), null] as DateRange}
                    minDate={new Date(2015, Months.JANUARY, 5)}
                    maxDate={new Date(2015, Months.JANUARY, 7)}
                />,
            );
            assert.isTrue(consoleError.calledOnceWith(Errors.DATERANGEPICKER_VALUE_INVALID));
        });

        it("onChange not fired when a day outside of bounds is clicked", () => {
            const minDate = new Date(2015, Months.JANUARY, 5);
            const maxDate = new Date(2015, Months.JANUARY, 7);
            const { left } = render({ minDate, maxDate });
            assert.isTrue(onChangeSpy.notCalled);
            left.findDay(10).simulate("click");
            assert.isTrue(onChangeSpy.notCalled);
        });

        it("caption options are only displayed for possible months and years", () => {
            const minDate = new Date(2015, Months.JANUARY, 5);
            const maxDate = new Date(2015, Months.JANUARY, 7);
            const { left } = render({ minDate, maxDate });
            const monthOptions = left.monthSelect.find("option").map(o => o.text());
            const yearOptions = left.yearSelect.find("option").map(o => o.text());
            assert.sameMembers(monthOptions, ["January"]);
            assert.sameMembers(yearOptions, ["2015"]);
        });

        it("disables shortcuts that begin earlier than minDate", () => {
            const { shortcuts } = render({
                initialMonth: TODAY,
                minDate: TWO_WEEKS_AGO_START,
                shortcuts: [
                    { label: "last week", dateRange: [LAST_WEEK_START, TODAY] },
                    { label: "last month", dateRange: [LAST_MONTH_START, TODAY] },
                ],
            });
            assert.isFalse(shortcuts.childAt(0).prop("disabled"));
            assert.isTrue(shortcuts.childAt(1).prop("disabled"));
        });

        it("disables shortcuts that end later than maxDate", () => {
            const { shortcuts } = render({
                initialMonth: TWO_WEEKS_AGO_START,
                maxDate: TWO_WEEKS_AGO_START,
                shortcuts: [
                    { label: "last week", dateRange: [LAST_WEEK_START, TODAY] },
                    { label: "last month", dateRange: [LAST_MONTH_START, TODAY] },
                ],
            });
            assert.isTrue(shortcuts.childAt(0).prop("disabled"));
            assert.isTrue(shortcuts.childAt(1).prop("disabled"));
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
        it("hovering when contiguousCalendarMonths=false shows a hovered range", () => {
            const { left, right, assertHoveredDays } = render({ contiguousCalendarMonths: false });
            left.clickDay(14);
            right.mouseEnterDay(18);
            assertHoveredDays(14, 18);
        });
    });

    describe("when controlled", () => {
        it("value initially selects a day", () => {
            const defaultValue: DateRange = [new Date(2010, Months.FEBRUARY, 2), null];
            const value: DateRange = [new Date(2010, Months.JANUARY, 1), null];
            render({ defaultValue, value }).assertSelectedDays(value[0]!.getDate());
        });

        it("onChange fired when a day is clicked", () => {
            const { left } = render({ value: [null, null] });
            assert.isTrue(onChangeSpy.notCalled);
            left.clickDay();
            assert.isTrue(onChangeSpy.calledOnce);
        });

        it("onHoverChange fired on mouseenter within a day", () => {
            const { left } = render({ value: [null, null] });
            assert.isTrue(onHoverChangeSpy.notCalled);
            left.mouseEnterDay();
            assert.isTrue(onHoverChangeSpy.calledOnce);
        });

        it("onHoverChange fired on mouseleave within a day", () => {
            const { left } = render({ value: [null, null] });
            assert.isTrue(onHoverChangeSpy.notCalled);
            left.findDay().simulate("mouseleave");
            assert.isTrue(onHoverChangeSpy.calledOnce);
        });

        it("selected day updates are not automatic", () => {
            const { left, assertSelectedDays } = render({ value: [null, null] });
            assertSelectedDays();
            left.clickDay();
            assertSelectedDays();
        });

        it("can change displayed date with the dropdowns in the caption", () => {
            const { left } = render({
                initialMonth: new Date(2015, Months.MARCH, 2),
                value: [null, null],
            });
            left.assertDisplayMonth(Months.MARCH, 2015);
            left.monthSelect.simulate("change", { target: { value: Months.JANUARY } });
            left.yearSelect.simulate("change", { target: { value: 2014 } });
            left.assertDisplayMonth(Months.JANUARY, 2014);
        });

        it("shortcuts fire onChange with correct values", () => {
            render().clickShortcut();

            const today = new Date();
            const aWeekAgo = DateUtils.clone(today);
            aWeekAgo.setDate(today.getDate() - 6);

            assert.isTrue(onChangeSpy.calledOnce, "called");
            const value = onChangeSpy.args[0][0];
            assert.isTrue(DateUtils.isSameDay(aWeekAgo, value[0]));
            assert.isTrue(DateUtils.isSameDay(today, value[1]));
        });

        it("shortcuts fire onChange with correct values when single day range enabled", () => {
            render({ allowSingleDayRange: true }).clickShortcut();

            const today = new Date();

            assert.isTrue(onChangeSpy.calledOnce);
            const value = onChangeSpy.args[0][0];
            assert.isTrue(DateUtils.isSameDay(today, value[0]));
            assert.isTrue(DateUtils.isSameDay(today, value[1]));
        });

        it("shortcuts fire onChange with correct values when single day range and allowSingleDayRange enabled", () => {
            render({ allowSingleDayRange: true, timePrecision: "minute" }).clickShortcut();

            const today = new Date();
            const tomorrow = DateUtils.clone(today);
            tomorrow.setDate(today.getDate() + 1);

            assert.isTrue(onChangeSpy.calledOnce);
            const value = onChangeSpy.args[0][0];
            assert.isTrue(DateUtils.isSameDay(today, value[0]));
            assert.isTrue(DateUtils.isSameDay(tomorrow, value[1]));
        });

        it("all shortcuts are displayed as inactive when none are selected", () => {
            const { wrapper } = render();

            assert.isFalse(
                wrapper.find(DatePickerShortcutMenu).find(Menu).find(MenuItem).find(`.${Classes.ACTIVE}`).exists(),
            );
        });

        it("corresponding shortcut is displayed as active when selected", () => {
            const selectedShortcut = 0;
            const { wrapper } = render({ selectedShortcutIndex: selectedShortcut });

            assert.isTrue(
                wrapper.find(DatePickerShortcutMenu).find(Menu).find(MenuItem).find(`.${Classes.ACTIVE}`).exists(),
            );

            assert.lengthOf(
                wrapper.find(DatePickerShortcutMenu).find(Menu).find(MenuItem).find(`.${Classes.ACTIVE}`),
                1,
            );

            assert.isTrue(wrapper.state("selectedShortcutIndex") === selectedShortcut);
        });

        it("should call onShortcutChangeSpy on selecting a shortcut ", () => {
            const selectedShortcut = 1;
            const onShortcutChangeSpy = sinon.spy();
            const { clickShortcut } = render({ onShortcutChange: onShortcutChangeSpy });

            clickShortcut(selectedShortcut);

            assert.isTrue(onChangeSpy.calledOnce);
            assert.isTrue(onShortcutChangeSpy.calledOnce);
            assert.isTrue(onShortcutChangeSpy.lastCall.lastArg === selectedShortcut);
        });

        it("custom shortcuts select the correct values", () => {
            const dateRange: NonNullDateRange = [new Date(2015, Months.JANUARY, 1), new Date(2015, Months.JANUARY, 5)];
            render({
                initialMonth: new Date(2015, Months.JANUARY, 1),
                shortcuts: [{ label: "custom shortcut", dateRange }],
            }).clickShortcut();
            assert.isTrue(onChangeSpy.calledOnce);
            const value = onChangeSpy.args[0][0];
            assert.isTrue(DateUtils.isSameDay(dateRange[0], value[0]));
            assert.isTrue(DateUtils.isSameDay(dateRange[1], value[1]));
        });

        it("custom shortcuts set the displayed months correctly when start month changes", () => {
            const dateRange: NonNullDateRange = [
                new Date(2016, Months.JANUARY, 1),
                new Date(2016, Months.DECEMBER, 31),
            ];
            const { left, right } = render({
                initialMonth: new Date(2015, Months.JANUARY, 1),
                shortcuts: [{ label: "custom shortcut", dateRange }],
            }).clickShortcut();
            assert.isTrue(onChangeSpy.calledOnce);
            left.assertDisplayMonth(Months.JANUARY, 2016);
            right.assertDisplayMonth(Months.FEBRUARY, 2016);
        });

        it(
            "custom shortcuts set the displayed months correctly when start month changes " +
                "and contiguousCalendarMonths is false",
            () => {
                const dateRange: NonNullDateRange = [
                    new Date(2016, Months.JANUARY, 1),
                    new Date(2016, Months.DECEMBER, 31),
                ];
                const { left, right } = render({
                    contiguousCalendarMonths: false,
                    initialMonth: new Date(2015, Months.JANUARY, 1),
                    shortcuts: [{ label: "custom shortcut", dateRange }],
                }).clickShortcut();
                assert.isTrue(onChangeSpy.calledOnce);
                left.assertDisplayMonth(Months.JANUARY, 2016);
                right.assertDisplayMonth(Months.DECEMBER, 2016);
            },
        );

        it("custom shortcuts set the displayed months correctly when start month stays the same", () => {
            const dateRange: NonNullDateRange = [
                new Date(2016, Months.JANUARY, 1),
                new Date(2016, Months.DECEMBER, 31),
            ];
            const { clickShortcut, left, right } = render({
                initialMonth: new Date(2016, Months.JANUARY, 1),
                shortcuts: [{ label: "custom shortcut", dateRange }],
            });

            clickShortcut();
            assert.isTrue(onChangeSpy.calledOnce);
            left.assertDisplayMonth(Months.JANUARY, 2016);
            right.assertDisplayMonth(Months.FEBRUARY, 2016);

            clickShortcut();
            left.assertDisplayMonth(Months.JANUARY, 2016);
            right.assertDisplayMonth(Months.FEBRUARY, 2016);
        });

        it("custom shortcuts set the displayed dates correctly when month stays the same but not years and contiguousCalendarMonths is false", () => {
            const dateRange: NonNullDateRange = [new Date(2014, Months.JUNE, 1), new Date(2015, Months.JUNE, 1)];
            const { clickShortcut, left, right } = render({
                contiguousCalendarMonths: false,
                initialMonth: new Date(2015, Months.JUNE, 1),
                shortcuts: [{ label: "custom shortcut", dateRange }],
            });

            clickShortcut();
            assert.isTrue(onChangeSpy.calledOnce);
            left.assertDisplayMonth(Months.JUNE, 2014);
            right.assertDisplayMonth(Months.JUNE, 2015);

            clickShortcut();
            left.assertDisplayMonth(Months.JUNE, 2014);
            right.assertDisplayMonth(Months.JUNE, 2015);
        });
    });

    describe("when uncontrolled", () => {
        it("defaultValue initially selects a day", () => {
            const today = new Date();
            render({ defaultValue: [today, null] }).assertSelectedDays(today.getDate());
        });

        it("onChange fired when a day is clicked", () => {
            const { left } = render();
            assert.isTrue(onChangeSpy.notCalled);
            left.clickDay();
            assert.isTrue(onChangeSpy.calledOnce);
        });

        it("onHoverChange fired with correct values when a day is clicked", () => {
            const dateRange: NonNullDateRange = [new Date(2015, Months.JANUARY, 1), new Date(2015, Months.JANUARY, 5)];
            const { left } = render({ initialMonth: new Date(2015, Months.JANUARY, 1) });
            assert.isTrue(onHoverChangeSpy.notCalled);
            left.clickDay(1);
            assert.isTrue(onHoverChangeSpy.calledOnce);
            assert.isTrue(DateUtils.isSameDay(dateRange[0], onHoverChangeSpy.args[0][0][0]));
            assert.isNull(onHoverChangeSpy.args[0][0][1]);
        });

        it("onHoverChange fired with correct values on mouseenter within a day", () => {
            const dateRange: NonNullDateRange = [new Date(2015, Months.JANUARY, 1), new Date(2015, Months.JANUARY, 5)];
            const { left } = render({ initialMonth: new Date(2015, Months.JANUARY, 1) });
            assert.isTrue(onHoverChangeSpy.notCalled);
            left.clickDay(1).mouseEnterDay(5);
            assert.isTrue(onHoverChangeSpy.calledTwice);
            assert.isTrue(DateUtils.isSameDay(dateRange[0], onHoverChangeSpy.args[1][0][0]));
            assert.isTrue(DateUtils.isSameDay(dateRange[1], onHoverChangeSpy.args[1][0][1]));
        });

        it("onHoverChange fired with `undefined` on mouseleave within a day", () => {
            const { left } = render({ initialMonth: new Date(2015, Months.JANUARY, 1) });
            assert.isTrue(onHoverChangeSpy.notCalled);
            left.clickDay(1).findDay(5).simulate("mouseleave");
            assert.isTrue(onHoverChangeSpy.calledTwice);
            assert.isUndefined(onHoverChangeSpy.args[1][0]);
        });

        it("selected day updates are automatic", () => {
            const { assertSelectedDays, left } = render();
            assertSelectedDays();
            left.clickDay(3);
            assertSelectedDays(3);
        });

        it("selects a range of dates when two days are clicked", () => {
            const { assertSelectedDays, left } = render({
                initialMonth: new Date(2015, Months.JANUARY, 1),
            });
            assertSelectedDays();
            left.clickDay(10).clickDay(14);
            assertSelectedDays(10, 14);
        });

        it("selects a range of dates when days are clicked in reverse", () => {
            const { assertSelectedDays, left } = render({
                initialMonth: new Date(2015, Months.JANUARY, 1),
            });
            assertSelectedDays();
            left.clickDay(14).clickDay(10);
            assertSelectedDays(10, 14);
        });

        it("deselects everything when only selected day is clicked", () => {
            const { assertSelectedDays, left } = render({
                initialMonth: new Date(2015, Months.JANUARY, 1),
            });
            left.clickDay(10).clickDay(10);
            assertSelectedDays();
        });

        it("starts a new selection when a non-endpoint is clicked in the current selection", () => {
            const { assertSelectedDays, left, right } = render({
                initialMonth: new Date(2015, Months.JANUARY, 1),
            });
            left.clickDay(10).clickDay(14);
            right.clickDay(11);
            assertSelectedDays(11);
        });

        it("deselects endpoint when an endpoint of the current selection is clicked", () => {
            const { assertSelectedDays, left } = render({
                initialMonth: new Date(2015, Months.JANUARY, 1),
            });
            left.clickDay(10).clickDay(14).clickDay(10);
            assertSelectedDays(14);

            left.clickDay(10).clickDay(14);
            assertSelectedDays(10);
        });

        it("allowSingleDayRange={true} allows start and end to be the same day", () => {
            const { assertSelectedDays, left } = render({
                allowSingleDayRange: true,
                initialMonth: new Date(2015, Months.JANUARY, 1),
            });
            left.clickDay(10).clickDay(10);
            assertSelectedDays(10);
        });

        it("shortcuts select values", () => {
            const { wrapper } = render().clickShortcut();

            const today = new Date();
            const aWeekAgo = DateUtils.clone(today);
            aWeekAgo.setDate(today.getDate() - 6);

            const [start, end] = wrapper.state("value");
            assert.isTrue(DateUtils.isSameDay(aWeekAgo, start!));
            assert.isTrue(DateUtils.isSameDay(today, end!));
        });

        it("custom shortcuts select the correct values", () => {
            const dateRange: NonNullDateRange = [new Date(2015, Months.JANUARY, 1), new Date(2015, Months.JANUARY, 5)];
            render({
                initialMonth: new Date(2015, Months.JANUARY, 1),
                shortcuts: [{ label: "custom shortcut", dateRange }],
            })
                .clickShortcut()
                .assertSelectedDays(1, 5);
        });

        it("can change displayed date with the dropdowns in the caption", () => {
            const { left } = render({ initialMonth: new Date(2015, Months.MARCH, 2) });
            left.assertDisplayMonth(Months.MARCH, 2015);
            left.monthSelect.simulate("change", { target: { value: Months.JANUARY } });
            left.yearSelect.simulate("change", { target: { value: 2014 } });
            left.assertDisplayMonth(Months.JANUARY, 2014);
        });

        it("does not change display month when selecting dates from left month", () => {
            const { left } = render({ initialMonth: new Date(2015, Months.MARCH, 2) });
            left.clickDay(2).clickDay(15).assertDisplayMonth(Months.MARCH, 2015);
        });

        it("does not change display month when selecting dates from right month", () => {
            const { right } = render({ initialMonth: new Date(2015, Months.MARCH, 2) });
            right.clickDay(2).clickDay(15).assertDisplayMonth(Months.APRIL, 2015);
        });

        it("does not change display month when selecting dates from left and right month", () => {
            const { left, right } = render({ initialMonth: new Date(2015, Months.MARCH, 2) });
            right.clickDay(15);
            left.clickDay(2).assertDisplayMonth(Months.MARCH, 2015);
        });

        it("does not change display month when selecting dates across December (left) and January (right)", () => {
            const { left, right } = render({ initialMonth: new Date(2015, Months.DECEMBER, 2) });
            left.clickDay(15);
            right.clickDay(2);
            left.assertDisplayMonth(Months.DECEMBER, 2015);
        });
    });

    describe("time selection", () => {
        const defaultRange: NonNullDateRange = [new Date(2012, 2, 5, 6, 5, 40), new Date(2012, 4, 5, 7, 8, 20)];

        it("setting timePrecision shows a TimePicker", () => {
            const { wrapper } = render();
            assert.isFalse(wrapper.find(TimePicker).exists());
            wrapper.setProps({ timePrecision: "minute" });
            assert.isTrue(wrapper.find(TimePicker).exists());
        });

        it("setting timePickerProps shows a TimePicker", () => {
            const { wrapper } = render({ timePickerProps: {} });
            assert.isTrue(wrapper.find(TimePicker).exists());
        });

        it("onChange fired when the time is changed", () => {
            const { wrapper } = render({
                defaultValue: defaultRange,
                timePickerProps: { showArrowButtons: true },
            });
            assert.isTrue(onChangeSpy.notCalled);
            wrapper
                .find(`.${Datetime2Classes.TIMEPICKER_ARROW_BUTTON}.${Datetime2Classes.TIMEPICKER_HOUR}`)
                .first()
                .simulate("click");
            assert.isTrue(onChangeSpy.calledOnce);
            const cbHour = onChangeSpy.firstCall.args[0][0].getHours();
            assert.strictEqual(cbHour, defaultRange[0].getHours() + 1);
        });

        it("changing date does not change time", () => {
            render({ timePrecision: "minute", defaultValue: defaultRange }).left.clickDay(16);
            assert.isTrue(DateUtils.isSameTime(onChangeSpy.firstCall.args[0][0] as Date, defaultRange[0]));
        });

        it("changing time does not change date", () => {
            render({ timePrecision: "minute", defaultValue: defaultRange }).setTimeInput("minute", "left", 10);
            assert.isTrue(DateUtils.isSameDay(onChangeSpy.firstCall.args[0][0] as Date, defaultRange[0]));
        });

        it("hovering over date does not change entered time", () => {
            const harness = render({ timePrecision: "minute", defaultValue: defaultRange });
            const newLeftMinute = 10;
            harness.setTimeInput("minute", "left", newLeftMinute);
            onChangeSpy.resetHistory();
            const { left } = harness;
            left.mouseEnterDay(5);
            assert.isTrue(onChangeSpy.notCalled);
            const minuteInputText = harness.getTimeInput("minute", "left");
            assert.equal(parseInt(minuteInputText, 10), newLeftMinute);
        });

        it("changing time without date uses today", () => {
            render({ timePrecision: "minute" }).setTimeInput("minute", "left", 45);
            assert.isTrue(DateUtils.isSameDay(onChangeSpy.firstCall.args[0][0] as Date, new Date()));
        });

        it("clicking a shortcut with includeTime=false doesn't change time", () => {
            render({ timePrecision: "minute", defaultValue: defaultRange }).clickShortcut();
            assert.isTrue(DateUtils.isSameTime(onChangeSpy.firstCall.args[0][0] as Date, defaultRange[0]));
        });

        it("clicking a shortcut with includeTime=true changes time", () => {
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
            assert.isTrue(DateUtils.isEqual(onChangeSpy.firstCall.args[0][0] as Date, startTime));
        });

        it("selecting and unselecting a day doesn't change time", () => {
            const leftDatePicker = render({ timePrecision: "minute", defaultValue: defaultRange }).left;
            leftDatePicker.clickDay(5);
            leftDatePicker.clickDay(5);
            assert.isTrue(DateUtils.isSameTime(onChangeSpy.secondCall.args[0][0] as Date, defaultRange[0]));
        });
    });

    function dayNotOutside(day: ReactWrapper) {
        return !day.hasClass(Datetime2Classes.DATEPICKER3_DAY_OUTSIDE);
    }

    function render(props?: DateRangePicker3Props) {
        onChangeSpy = sinon.spy();
        onHoverChangeSpy = sinon.spy();
        return wrap(<DateRangePicker3 onChange={onChangeSpy} onHoverChange={onHoverChangeSpy} {...props} />);
    }

    function wrap(datepicker: JSX.Element) {
        const wrapper = mount<DateRangePicker3Props, DateRangePicker3State>(datepicker, {
            attachTo: testsContainerElement,
        });
        drpWrapper = wrapper;

        const findTimeInput = (precision: TimePrecision | "hour", which: "left" | "right") =>
            wrapper.find(`.${Datetime2Classes.TIMEPICKER}-${precision}`).at(which === "left" ? 0 : 1);

        // Don't cache the left/right day pickers into variables in this scope,
        // because as of Enzyme 3.0 they can get stale if the views change.
        const harness = {
            wrapper,

            left: wrapDayPicker(wrapper, "left"),
            right: wrapDayPicker(wrapper, "right"),
            shortcuts: wrapper.find(`.${Datetime2Classes.DATERANGEPICKER_SHORTCUTS}`).hostNodes(),

            assertHoveredDays: (fromDate: number | null, toDate: number | null) => {
                const [from, to] = wrapper.state("hoverValue")!;

                if (fromDate == null) {
                    assert.isNull(from);
                } else {
                    assert.equal(from!.getDate(), fromDate);
                }

                if (toDate == null) {
                    assert.isNull(to);
                } else {
                    assert.equal(to!.getDate(), toDate);
                }

                return harness;
            },
            assertSelectedDays: (from?: number, to?: number) => {
                const rangeStart = wrapper.find(`.${Datetime2Classes.DATERANGEPICKER3_SELECTED_RANGE_START}`).first();
                const rangeEnd = wrapper.find(`.${Datetime2Classes.DATERANGEPICKER3_SELECTED_RANGE_END}`).first();
                if (from !== undefined) {
                    assert.isTrue(rangeStart.exists());
                    assert.equal(parseInt(rangeStart.text(), 10), from);
                }
                if (to !== undefined) {
                    assert.isTrue(rangeEnd.exists());
                    assert.equal(parseInt(rangeEnd.text(), 10), to);
                }
                if (from !== undefined && to !== undefined) {
                    assert.lengthOf(
                        harness.getDays(Datetime2Classes.DATERANGEPICKER3_SELECTED_RANGE_MIDDLE),
                        Math.max(0, to - from - 1),
                    );
                }
            },
            changeTimeInput: (precision: TimePrecision | "hour", which: "left" | "right", value: number) =>
                findTimeInput(precision, which).simulate("change", { target: { value } }),
            clickNavButton: (which: "next" | "previous", navIndex = 0) => {
                const month = wrapper.find(`.rdp-month`).at(navIndex);
                const navButton = month.find(`.${Datetime2Classes.DATEPICKER3_NAV_BUTTON}-${which}`);
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
        parent: ReactWrapper<DateRangePicker3Props, DateRangePicker3State>,
        whichCalendar: "left" | "right",
    ) {
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
                assert.exists(captionLabel, "Expected caption label which labels the current display month to exist");
                const [monthText, yearText] = captionLabel.text().split(" ");
                const month = getMonthIndex(monthText);
                const year = parseInt(yearText, 10);
                return new MonthAndYear(month, year);
            },
            get monthSelect() {
                return harness.wrapper.find(`.${Datetime2Classes.DATEPICKER_MONTH_SELECT}`).find("select");
            },
            get yearSelect() {
                return harness.wrapper.find(`.${Datetime2Classes.DATEPICKER_YEAR_SELECT}`).find("select");
            },

            assertDisplayMonth: (expectedMonth: number, expectedYear?: number) => {
                const displayMonthAndYear = harness.displayMonthAndYear;
                assert.equal(displayMonthAndYear.getMonth(), expectedMonth);
                if (expectedYear !== undefined) {
                    assert.equal(displayMonthAndYear.getYear(), expectedYear);
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
                    .filterWhere(day => !day.hasClass(Datetime2Classes.DATEPICKER3_DAY_OUTSIDE))
                    .first();
            },
            findDays: () => harness.wrapper.find(`.${Datetime2Classes.DATEPICKER3_DAY}`),
            mouseEnterDay: (dayNumber = 1) => {
                harness.findDay(dayNumber).simulate("mouseenter");
                return harness;
            },
        };
        return harness;
    }
});

function renderMonthName(monthIndex: number) {
    return format(new Date(2023, monthIndex), "LLLL", { locale: enUSLocale });
}

function getMonthIndex(monthName: string) {
    return parse(monthName, "LLLL", new Date(), { locale: enUSLocale }).getMonth();
}
