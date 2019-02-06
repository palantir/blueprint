/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Button } from "@blueprintjs/core";
import { assert } from "chai";
import { mount, ReactWrapper } from "enzyme";
import * as React from "react";
import ReactDayPicker from "react-day-picker";
import * as sinon from "sinon";

import { expectPropValidationError } from "@blueprintjs/test-commons";

import * as DateUtils from "../src/common/dateUtils";
import * as Errors from "../src/common/errors";
import { Months } from "../src/common/months";
import { DatePickerNavbar } from "../src/datePickerNavbar";
import { IDateRangePickerState, IDateRangeShortcut } from "../src/dateRangePicker";
import {
    Classes as DateClasses,
    DateRange,
    DateRangePicker,
    IDatePickerModifiers,
    IDateRangePickerProps,
    TimePicker,
    TimePrecision,
} from "../src/index";
import { assertDayDisabled } from "./common/dateTestUtils";

describe("<DateRangePicker>", () => {
    let onChangeSpy: sinon.SinonSpy;
    let onHoverChangeSpy: sinon.SinonSpy;

    it("renders its template", () => {
        const { wrapper } = render();
        assert.isTrue(wrapper.find(`.${DateClasses.DATERANGEPICKER}`).exists());
    });

    it("no days are selected by default", () => {
        const { wrapper, assertSelectedDays } = render();
        assert.deepEqual(wrapper.state("value"), [null, null]);
        assertSelectedDays();
    });

    it("user-provided modifiers are applied", () => {
        const { left } = render({ modifiers: { odd: d => d.getDate() % 2 === 1 } });
        assert.isFalse(left.findDay(4).hasClass("DayPicker-Day--odd"));
        assert.isTrue(left.findDay(5).hasClass("DayPicker-Day--odd"));
    });

    describe("reconciliates dayPickerProps", () => {
        it("week starts with firstDayOfWeek value", () => {
            const selectedFirstDay = 3;
            const wrapper = mount(<DateRangePicker dayPickerProps={{ firstDayOfWeek: selectedFirstDay }} />);
            const firstWeekday = wrapper.find("Weekday").first();
            assert.equal(firstWeekday.prop("weekday"), selectedFirstDay);
        });

        it("hides unnecessary nav buttons in contiguous months mode", () => {
            const defaultValue = [new Date(2017, Months.SEPTEMBER, 1), null] as DateRange;
            const wrapper = mount(<DateRangePicker defaultValue={defaultValue} />);
            assert.isTrue(
                wrapper
                    .find(DatePickerNavbar)
                    .at(0)
                    .find(".DayPicker-NavButton--next")
                    .isEmpty(),
            );
            assert.isTrue(
                wrapper
                    .find(DatePickerNavbar)
                    .at(1)
                    .find(".DayPicker-NavButton--prev")
                    .isEmpty(),
            );
        });

        it("disables days according to custom modifiers in addition to default modifiers", () => {
            const disableFridays = { daysOfWeek: [5] };
            const defaultValue = [new Date(2017, Months.SEPTEMBER, 1), null] as DateRange;
            const maxDate = new Date(2017, Months.OCTOBER, 20);

            const { left, right } = wrap(
                <DateRangePicker
                    dayPickerProps={{ disabledDays: disableFridays }}
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
                <DateRangePicker
                    initialMonth={new Date(2017, Months.AUGUST, 1)}
                    maxDate={new Date(2017, Months.SEPTEMBER, 20)}
                />,
            );
            assertDayDisabled(right.findDay(21));
            assertDayDisabled(right.findDay(10), false);
        });

        it("disables out-of-range min dates", () => {
            const { left } = wrap(
                <DateRangePicker
                    initialMonth={new Date(2017, Months.AUGUST, 1)}
                    minDate={new Date(2017, Months.AUGUST, 20)}
                />,
            );
            assertDayDisabled(left.findDay(10));
            assertDayDisabled(left.findDay(21), false);
        });

        it("allows top-level locale, localeUtils, and modifiers to be overridden by same props in dayPickerProps", () => {
            const blueprintModifiers: IDatePickerModifiers = {
                blueprint: () => true,
            };
            const blueprintLocaleUtils = {
                ...ReactDayPicker.LocaleUtils,
                formatDay: () => "b",
            };
            const blueprintProps: IDateRangePickerProps = {
                locale: "blueprint",
                localeUtils: blueprintLocaleUtils,
                modifiers: blueprintModifiers,
            };

            const dayPickerModifiers: IDatePickerModifiers = {
                dayPicker: () => true,
            };
            const dayPickerLocaleUtils = {
                ...ReactDayPicker.LocaleUtils,
                formatDay: () => "d",
            };
            const dayPickerProps: IDateRangePickerProps = {
                locale: "dayPicker",
                localeUtils: dayPickerLocaleUtils,
                modifiers: dayPickerModifiers,
            };

            const wrapper = mount(<DateRangePicker {...blueprintProps} dayPickerProps={dayPickerProps} />);
            const dayPicker = wrapper.find("DayPicker").first();
            assert.equal(dayPicker.prop("locale"), dayPickerProps.locale);
            assert.equal(dayPicker.prop("localeUtils"), dayPickerProps.localeUtils);
            assert.equal(dayPicker.prop("modifiers"), dayPickerProps.modifiers);
        });

        describe("event handlers", () => {
            // use a date that lets us navigate forward and backward in the same year
            const defaultValue = [new Date(2017, Months.SEPTEMBER, 1), null] as DateRange;

            it("calls onMonthChange on button next click", () => {
                const onMonthChange = sinon.spy();
                wrap(<DateRangePicker defaultValue={defaultValue} dayPickerProps={{ onMonthChange }} />).clickNavButton(
                    "next",
                    1,
                );
                assert.isTrue(onMonthChange.called);
            });

            it("calls onMonthChange on button prev click", () => {
                const onMonthChange = sinon.spy();
                wrap(<DateRangePicker defaultValue={defaultValue} dayPickerProps={{ onMonthChange }} />).clickNavButton(
                    "prev",
                );
                assert.isTrue(onMonthChange.called);
            });

            it("calls onMonthChange on button next click of left calendar", () => {
                const onMonthChange = sinon.spy();
                wrap(
                    <DateRangePicker
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
                    <DateRangePicker
                        defaultValue={defaultValue}
                        contiguousCalendarMonths={false}
                        dayPickerProps={{ onMonthChange }}
                    />,
                ).clickNavButton("prev");
                assert.isTrue(onMonthChange.called);
            });

            it("calls onMonthChange on button next click of right calendar", () => {
                const onMonthChange = sinon.spy();
                wrap(
                    <DateRangePicker
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
                    <DateRangePicker
                        defaultValue={defaultValue}
                        contiguousCalendarMonths={false}
                        dayPickerProps={{ onMonthChange }}
                    />,
                ).clickNavButton("prev", 1);
                assert.isTrue(onMonthChange.called);
            });

            it("calls onMonthChange on month select change in left calendar", () => {
                const onMonthChange = sinon.spy();
                wrap(
                    <DateRangePicker defaultValue={defaultValue} dayPickerProps={{ onMonthChange }} />,
                ).left.monthSelect.simulate("change");
                assert.isTrue(onMonthChange.called);
            });

            it("calls onMonthChange on month select change in right calendar", () => {
                const onMonthChange = sinon.spy();
                wrap(
                    <DateRangePicker defaultValue={defaultValue} dayPickerProps={{ onMonthChange }} />,
                ).right.monthSelect.simulate("change");
                assert.isTrue(onMonthChange.called);
            });

            it("calls onMonthChange on year select change in left calendar", () => {
                const onMonthChange = sinon.spy();
                wrap(
                    <DateRangePicker defaultValue={defaultValue} dayPickerProps={{ onMonthChange }} />,
                ).left.monthSelect.simulate("change");
                assert.isTrue(onMonthChange.called);
            });

            it("calls onMonthChange on year select change in right calendar", () => {
                const onMonthChange = sinon.spy();
                wrap(
                    <DateRangePicker defaultValue={defaultValue} dayPickerProps={{ onMonthChange }} />,
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
    });

    describe("initially displayed month", () => {
        it("is initialMonth if set", () => {
            const defaultValue = [new Date(2007, Months.APRIL, 4), null] as DateRange;
            const initialMonth = new Date(2002, Months.MARCH, 1);
            const maxDate = new Date(2020, Months.JANUARY);
            const minDate = new Date(2000, Months.JANUARY);
            render({ defaultValue, initialMonth, maxDate, minDate }).left.assertMonthYear(Months.MARCH, 2002);
        });

        it("is defaultValue if set and initialMonth not set", () => {
            const defaultValue = [new Date(2007, Months.APRIL, 4), null] as DateRange;
            const maxDate = new Date(2020, Months.JANUARY);
            const minDate = new Date(2000, Months.JANUARY);
            render({ defaultValue, maxDate, minDate }).left.assertMonthYear(Months.APRIL, 2007);
        });

        it("is value if set and initialMonth not set", () => {
            const maxDate = new Date(2020, Months.JANUARY);
            const minDate = new Date(2000, Months.JANUARY);
            const value = [new Date(2007, Months.APRIL, 4), null] as DateRange;
            render({ maxDate, minDate, value }).left.assertMonthYear(Months.APRIL, 2007);
        });

        it("is (endDate - 1 month) if only endDate is set", () => {
            const value = [null, new Date(2007, Months.APRIL, 4)] as DateRange;
            render({ value }).left.assertMonthYear(Months.MARCH, 2007);
        });

        it("is endDate if only endDate is set and endDate === minDate month", () => {
            const minDate = new Date(2007, Months.APRIL);
            const value = [null, new Date(2007, Months.APRIL, 4)] as DateRange;
            render({ minDate, value }).left.assertMonthYear(Months.APRIL, 2007);
        });

        it("is today if only maxDate/minDate set and today is in date range", () => {
            const maxDate = new Date(2020, Months.JANUARY);
            const minDate = new Date(2000, Months.JANUARY);
            const today = new Date();
            render({ maxDate, minDate }).left.assertMonthYear(today.getMonth(), today.getFullYear());
        });

        it("is a day between minDate and maxDate if only maxDate/minDate set and today is not in range", () => {
            const maxDate = new Date(2005, Months.JANUARY);
            const minDate = new Date(2000, Months.JANUARY);
            const leftView = render({ maxDate, minDate }).wrapper.state("leftView");
            assert.isTrue(
                DateUtils.isDayInRange(new Date(leftView.getYear(), leftView.getMonth()), [minDate, maxDate]),
            );
        });

        it("is initialMonth - 1 if initialMonth === maxDate month", () => {
            const MAX_YEAR = 2016;

            const initialMonth = new Date(MAX_YEAR, Months.DECEMBER, 1);
            const maxDate = new Date(MAX_YEAR, Months.DECEMBER, 31);
            const minDate = new Date(2000, 0);

            render({ initialMonth, maxDate, minDate }).left.assertMonthYear(Months.NOVEMBER, MAX_YEAR);
        });

        it("is value - 1 if set and initialMonth not set and value month === maxDate month", () => {
            const value = [new Date(2017, Months.OCTOBER, 4), null] as DateRange;
            const maxDate = new Date(2017, Months.OCTOBER, 15);

            render({ maxDate, value }).left.assertMonthYear(Months.SEPTEMBER, 2017);
        });

        it("is initialMonth if initialMonth === minDate month and initialMonth === maxDate month", () => {
            const YEAR = 2016;

            const initialMonth = new Date(YEAR, Months.DECEMBER, 11);
            const maxDate = new Date(YEAR, Months.DECEMBER, 15);
            const minDate = new Date(YEAR, Months.DECEMBER, 1);

            render({ initialMonth, maxDate, minDate }).left.assertMonthYear(Months.DECEMBER, YEAR);
        });

        it("right calendar shows the month immediately after the left view by default", () => {
            const startDate = new Date(2017, Months.MAY, 5);
            const endDate = new Date(2017, Months.JULY, 5);
            render({ value: [startDate, endDate] }).right.assertMonthYear(Months.JUNE, 2017);
        });
    });

    describe("left/right calendar", () => {
        function assertFirstLastMonths(monthSelect: ReactWrapper, first: Months, last: Months) {
            const options = monthSelect.find("option");
            assert.equal(options.first().prop("value"), first);
            assert.equal(options.last().prop("value"), last);
        }

        it("only shows one calendar when minDate and maxDate are in the same month", () => {
            const minDate = new Date(2015, Months.DECEMBER, 1);
            const maxDate = new Date(2015, Months.DECEMBER, 15);
            const { wrapper, right } = render({ contiguousCalendarMonths: false, maxDate, minDate });
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
            const { monthSelect } = render({ contiguousCalendarMonths: false, maxDate, minDate }).left;
            assertFirstLastMonths(monthSelect, Months.JANUARY, Months.NOVEMBER);
        });

        it("right calendar is bound between (minDate + 1 month) and maxDate", () => {
            const minDate = new Date(2015, Months.JANUARY, 1);
            const maxDate = new Date(2015, Months.DECEMBER, 15);
            const { monthSelect } = render({ contiguousCalendarMonths: false, maxDate, minDate }).right;
            assertFirstLastMonths(monthSelect, Months.FEBRUARY, Months.DECEMBER);
        });

        it("right calendar shows the month containing the selected end date", () => {
            const startDate = new Date(2017, Months.MAY, 5);
            const endDate = new Date(2017, Months.JULY, 5);
            render({ contiguousCalendarMonths: false, value: [startDate, endDate] }).right.assertMonthYear(Months.JULY);
        });

        it("right calendar shows the month immediately after the left view if startDate === endDate month", () => {
            const startDate = new Date(2017, Months.MAY, 5);
            const endDate = new Date(2017, Months.MAY, 15);
            render({ contiguousCalendarMonths: false, value: [startDate, endDate] }).right.assertMonthYear(Months.JUNE);
        });
    });

    describe("left/right calendar when contiguous", () => {
        it("changing left calendar with month dropdown shifts left to the selected month", () => {
            const initialMonth = new Date(2015, Months.MAY, 5);

            const { left, right } = render({ initialMonth });
            left.assertMonthYear(Months.MAY);
            right.assertMonthYear(Months.JUNE);
            left.monthSelect.simulate("change", { target: { value: Months.AUGUST } });
            left.assertMonthYear(Months.AUGUST);
            right.assertMonthYear(Months.SEPTEMBER);
        });

        it("changing right calendar with month dropdown shifts right to the selected month", () => {
            const initialMonth = new Date(2015, Months.MAY, 5);

            const { left, right } = render({ initialMonth });
            left.assertMonthYear(Months.MAY);
            right.assertMonthYear(Months.JUNE);
            right.monthSelect.simulate("change", { target: { value: Months.AUGUST } });
            left.assertMonthYear(Months.JULY);
            right.assertMonthYear(Months.AUGUST);
        });

        it("changing left calendar with year dropdown shifts left to the selected year", () => {
            const initialMonth = new Date(2015, Months.MAY, 5);
            const NEW_YEAR = 2012;

            const { left, right } = render({ initialMonth });
            left.assertMonthYear(Months.MAY);
            right.assertMonthYear(Months.JUNE);
            left.yearSelect.simulate("change", { target: { value: NEW_YEAR } });
            left.assertMonthYear(Months.MAY, NEW_YEAR);
            right.assertMonthYear(Months.JUNE, NEW_YEAR);
        });

        it("changing right calendar with year dropdown shifts right to the selected year", () => {
            const initialMonth = new Date(2015, Months.MAY, 5);
            const NEW_YEAR = 2012;

            const { left, right } = render({ initialMonth });
            left.assertMonthYear(Months.MAY);
            right.assertMonthYear(Months.JUNE);
            right.yearSelect.simulate("change", { target: { value: NEW_YEAR } });
            left.assertMonthYear(Months.MAY, NEW_YEAR);
            right.assertMonthYear(Months.JUNE, NEW_YEAR);
        });

        it("when calendar is between December and January, changing left calendar with year dropdown shifts left to the selected year", () => {
            const INITIAL_YEAR = 2015;
            const initialMonth = new Date(INITIAL_YEAR, Months.DECEMBER, 5);
            const NEW_YEAR = 2012;

            const { left, right } = render({ initialMonth });
            left.assertMonthYear(Months.DECEMBER, INITIAL_YEAR);
            right.assertMonthYear(Months.JANUARY, INITIAL_YEAR + 1);
            left.yearSelect.simulate("change", { target: { value: NEW_YEAR } });
            left.assertMonthYear(Months.DECEMBER, NEW_YEAR);
            right.assertMonthYear(Months.JANUARY, NEW_YEAR + 1);
        });

        it("when calendar is between December and January, changing right calendar with year dropdown shifts right to the selected year", () => {
            const INITIAL_YEAR = 2015;
            const initialMonth = new Date(INITIAL_YEAR, Months.DECEMBER, 5);
            const NEW_YEAR = 2012;

            const { left, right } = render({ initialMonth });
            left.assertMonthYear(Months.DECEMBER, INITIAL_YEAR);
            right.assertMonthYear(Months.JANUARY, INITIAL_YEAR + 1);
            right.yearSelect.simulate("change", { target: { value: NEW_YEAR } });
            left.assertMonthYear(Months.DECEMBER, NEW_YEAR - 1);
            right.assertMonthYear(Months.JANUARY, NEW_YEAR);
        });
    });

    describe("left/right calendar when not contiguous", () => {
        it("left calendar can be altered independently of right calendar", () => {
            const initialMonth = new Date(2015, Months.MAY, 5);
            const { left, clickNavButton } = render({ initialMonth, contiguousCalendarMonths: false });
            left.assertMonthYear(Months.MAY);
            clickNavButton("prev");
            left.assertMonthYear(Months.APRIL);
            clickNavButton("next");
            left.assertMonthYear(Months.MAY);
        });

        it("right calendar can be altered independently of left calendar", () => {
            const initialMonth = new Date(2015, Months.MAY, 5);

            const { right, clickNavButton } = render({ initialMonth, contiguousCalendarMonths: false });
            right.assertMonthYear(Months.JUNE);
            clickNavButton("prev", 1);
            right.assertMonthYear(Months.MAY);
            clickNavButton("next", 1);
            right.assertMonthYear(Months.JUNE);
        });

        it("changing left calendar with month dropdown to be equal or after right calendar, shifts the right", () => {
            const initialMonth = new Date(2015, Months.MAY, 5);

            const { left, right } = render({ initialMonth, contiguousCalendarMonths: false });
            left.assertMonthYear(Months.MAY);
            right.assertMonthYear(Months.JUNE);
            left.monthSelect.simulate("change", { target: { value: Months.AUGUST } });
            left.assertMonthYear(Months.AUGUST);
            right.assertMonthYear(Months.SEPTEMBER);
        });

        it("changing right calendar with month dropdown to be equal or before left calendar, shifts the left", () => {
            const initialMonth = new Date(2015, Months.MAY, 5);

            const { left, right } = render({ initialMonth, contiguousCalendarMonths: false });
            left.assertMonthYear(Months.MAY);
            right.assertMonthYear(Months.JUNE);
            right.monthSelect.simulate("change", { target: { value: Months.APRIL } });
            left.assertMonthYear(Months.MARCH);
            right.assertMonthYear(Months.APRIL);
        });

        it("changing left calendar with year dropdown to be equal or after right calendar, shifts the right", () => {
            const initialMonth = new Date(2013, Months.MAY, 5);
            const NEW_YEAR = 2014;

            const { left, right } = render({ initialMonth, contiguousCalendarMonths: false });
            left.yearSelect.simulate("change", { target: { value: NEW_YEAR } });
            left.assertMonthYear(Months.MAY, NEW_YEAR);
            right.assertMonthYear(Months.JUNE, NEW_YEAR);
        });

        it("changing right calendar with year dropdown to be equal or before left calendar, shifts the left", () => {
            const initialMonth = new Date(2013, Months.MAY, 5);
            const NEW_YEAR = 2012;

            const { left, right } = render({ initialMonth, contiguousCalendarMonths: false });
            right.yearSelect.simulate("change", { target: { value: NEW_YEAR } });
            left.assertMonthYear(Months.MAY, NEW_YEAR);
            right.assertMonthYear(Months.JUNE, NEW_YEAR);
        });

        it("changing left calendar with navButton to equal right calendar, shifts the right", () => {
            const initialMonth = new Date(2015, Months.MAY, 5);

            const { left, right, clickNavButton } = render({ initialMonth, contiguousCalendarMonths: false });
            clickNavButton("next");
            left.assertMonthYear(Months.JUNE);
            right.assertMonthYear(Months.JULY);
        });

        it("changing right calendar with navButton to equal left calendar, shifts the left", () => {
            const initialMonth = new Date(2015, Months.MAY, 5);

            const { left, right, clickNavButton } = render({ initialMonth, contiguousCalendarMonths: false });
            clickNavButton("prev", 1);
            left.assertMonthYear(Months.APRIL);
            right.assertMonthYear(Months.MAY);
        });
    });

    describe("minDate/maxDate bounds", () => {
        const TODAY = new Date(2015, Months.FEBRUARY, 5);
        const LAST_WEEK_START = new Date(2015, Months.JANUARY, 29);
        const LAST_MONTH_START = new Date(2015, Months.JANUARY, 5);
        const TWO_WEEKS_AGO_START = new Date(2015, Months.JANUARY, 22);

        it("maxDate must be later than minDate", () => {
            const minDate = new Date(2000, Months.JANUARY, 10);
            const maxDate = new Date(2000, Months.JANUARY, 8);
            expectPropValidationError(DateRangePicker, { minDate, maxDate }, Errors.DATERANGEPICKER_MAX_DATE_INVALID);
        });

        it("only days outside bounds have disabled class", () => {
            const minDate = new Date(2000, Months.JANUARY, 10);
            const initialMonth = minDate;
            const { left } = render({ initialMonth, minDate });
            assert.isTrue(left.findDay(8).hasClass(DateClasses.DATEPICKER_DAY_DISABLED));
            assert.isFalse(left.findDay(10).hasClass(DateClasses.DATEPICKER_DAY_DISABLED));
        });

        it("an error is thrown if defaultValue is outside bounds", () => {
            const minDate = new Date(2015, Months.JANUARY, 5);
            const maxDate = new Date(2015, Months.JANUARY, 7);
            const defaultValue = [new Date(2015, Months.JANUARY, 12), null] as DateRange;
            expectPropValidationError(
                DateRangePicker,
                { defaultValue, minDate, maxDate },
                Errors.DATERANGEPICKER_DEFAULT_VALUE_INVALID,
            );
        });

        it("an error is thrown if initialMonth is outside month bounds", () => {
            const minDate = new Date(2015, Months.JANUARY, 5);
            const maxDate = new Date(2015, Months.JANUARY, 7);
            const initialMonth = new Date(2015, Months.FEBRUARY, 12);
            expectPropValidationError(
                DateRangePicker,
                { initialMonth, minDate, maxDate },
                Errors.DATERANGEPICKER_INITIAL_MONTH_INVALID,
            );
        });

        it("an error is not thrown if initialMonth is outside day bounds but inside month bounds", () => {
            const minDate = new Date(2015, Months.JANUARY, 5);
            const maxDate = new Date(2015, Months.JANUARY, 7);
            const initialMonth = new Date(2015, Months.JANUARY, 12);
            assert.doesNotThrow(() => {
                render({ initialMonth, minDate, maxDate });
            });
        });

        it("an error is thrown if value is outside bounds", () => {
            const minDate = new Date(2015, Months.JANUARY, 5);
            const maxDate = new Date(2015, Months.JANUARY, 7);
            const value = [new Date(2015, Months.JANUARY, 12), null] as DateRange;
            expectPropValidationError(
                DateRangePicker,
                { value, minDate, maxDate },
                Errors.DATERANGEPICKER_VALUE_INVALID,
            );
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
                left
                    .clickDay(14)
                    .clickDay(18)
                    .clickDay(14) // deselect start date
                    .mouseEnterDay(22);
                assertHoveredDays(18, 22);
            });

            it("should show a hovered range of [null, null] if day === end", () => {
                const { left, assertHoveredDays } = render();
                left
                    .clickDay(14)
                    .clickDay(18)
                    .clickDay(14)
                    .mouseEnterDay(18);
                assertHoveredDays(null, null);
            });

            it("should show a hovered range of [day, end] if day < end", () => {
                const { left, assertHoveredDays } = render();
                left
                    .clickDay(14)
                    .clickDay(18)
                    .clickDay(14)
                    .mouseEnterDay(14);
                assertHoveredDays(14, 18);
            });
        });

        describe("when both start and end date are defined", () => {
            it("should show a hovered range of [null, end] if day === start", () => {
                const { left, assertHoveredDays } = render();
                left
                    .clickDay(14)
                    .clickDay(18)
                    .mouseEnterDay(14);
                assertHoveredDays(null, 18);
            });

            it("should show a hovered range of [start, null] if day === end", () => {
                const { left, assertHoveredDays } = render();
                left
                    .clickDay(14)
                    .clickDay(18)
                    .mouseEnterDay(18);
                assertHoveredDays(14, null);
            });

            it("should show a hovered range of [day, null] if start < day < end", () => {
                const { left, assertHoveredDays } = render();
                left
                    .clickDay(14)
                    .clickDay(18)
                    .mouseEnterDay(16);
                assertHoveredDays(16, null);
            });

            it("should show a hovered range of [day, null] if day < start", () => {
                const { left, assertHoveredDays } = render();
                left
                    .clickDay(14)
                    .clickDay(18)
                    .mouseEnterDay(10);
                assertHoveredDays(10, null);
            });

            it("should show a hovered range of [day, null] if day > end", () => {
                const { left, assertHoveredDays } = render();
                left
                    .clickDay(14)
                    .clickDay(18)
                    .mouseEnterDay(22);
                assertHoveredDays(22, null);
            });

            it("should show a hovered range of [null, null] if start === day === end", () => {
                const { left, assertHoveredDays } = render({ allowSingleDayRange: true });
                left
                    .clickDay(14)
                    .clickDay(14)
                    .mouseEnterDay(14);
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
            left.assertMonthYear(MONTH_OUT_OF_VIEW);

            // hover on right month
            right.mouseEnterDay(14);
            left.assertMonthYear(MONTH_OUT_OF_VIEW);
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
            render({ defaultValue, value }).assertSelectedDays(value[0].getDate());
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
            const { left } = render({ initialMonth: new Date(2015, Months.MARCH, 2), value: [null, null] });
            left.assertMonthYear(Months.MARCH, 2015);
            left.monthSelect.simulate("change", { target: { value: Months.JANUARY } });
            left.yearSelect.simulate("change", { target: { value: 2014 } });
            left.assertMonthYear(Months.JANUARY, 2014);
        });

        it("shortcuts fire onChange with correct values", () => {
            render().clickShortcut();

            const today = new Date();
            const aWeekAgo = DateUtils.clone(today);
            aWeekAgo.setDate(today.getDate() - 6);

            assert.isTrue(onChangeSpy.calledOnce, "called");
            const value = onChangeSpy.args[0][0];
            assert.isTrue(DateUtils.areSameDay(aWeekAgo, value[0]));
            assert.isTrue(DateUtils.areSameDay(today, value[1]));
        });

        it("shortcuts fire onChange with correct values when single day range enabled", () => {
            render({ allowSingleDayRange: true }).clickShortcut();

            const today = new Date();

            assert.isTrue(onChangeSpy.calledOnce);
            const value = onChangeSpy.args[0][0];
            assert.isTrue(DateUtils.areSameDay(today, value[0]));
            assert.isTrue(DateUtils.areSameDay(today, value[1]));
        });

        it("custom shortcuts select the correct values", () => {
            const dateRange = [new Date(2015, Months.JANUARY, 1), new Date(2015, Months.JANUARY, 5)] as DateRange;
            render({
                initialMonth: new Date(2015, Months.JANUARY, 1),
                shortcuts: [{ label: "custom shortcut", dateRange }],
            }).clickShortcut();
            assert.isTrue(onChangeSpy.calledOnce);
            const value = onChangeSpy.args[0][0];
            assert.isTrue(DateUtils.areSameDay(dateRange[0], value[0]));
            assert.isTrue(DateUtils.areSameDay(dateRange[1], value[1]));
        });

        it("custom shortcuts set the displayed months correctly when start month changes", () => {
            const dateRange = [new Date(2016, Months.JANUARY, 1), new Date(2016, Months.DECEMBER, 31)] as DateRange;
            const { left, right } = render({
                initialMonth: new Date(2015, Months.JANUARY, 1),
                shortcuts: [{ label: "custom shortcut", dateRange }],
            }).clickShortcut();
            assert.isTrue(onChangeSpy.calledOnce);
            left.assertMonthYear(Months.JANUARY, 2016);
            right.assertMonthYear(Months.FEBRUARY, 2016);
        });

        it(
            "custom shortcuts set the displayed months correctly when start month changes " +
                "and contiguousCalendarMonths is false",
            () => {
                const dateRange = [new Date(2016, Months.JANUARY, 1), new Date(2016, Months.DECEMBER, 31)] as DateRange;
                const { left, right } = render({
                    contiguousCalendarMonths: false,
                    initialMonth: new Date(2015, Months.JANUARY, 1),
                    shortcuts: [{ label: "custom shortcut", dateRange }],
                }).clickShortcut();
                assert.isTrue(onChangeSpy.calledOnce);
                left.assertMonthYear(Months.JANUARY, 2016);
                right.assertMonthYear(Months.DECEMBER, 2016);
            },
        );

        it("custom shortcuts set the displayed months correctly when start month stays the same", () => {
            const dateRange = [new Date(2016, Months.JANUARY, 1), new Date(2016, Months.DECEMBER, 31)] as DateRange;
            const { clickShortcut, left, right } = render({
                initialMonth: new Date(2016, Months.JANUARY, 1),
                shortcuts: [{ label: "custom shortcut", dateRange }],
            });

            clickShortcut();
            assert.isTrue(onChangeSpy.calledOnce);
            left.assertMonthYear(Months.JANUARY, 2016);
            right.assertMonthYear(Months.FEBRUARY, 2016);

            clickShortcut();
            left.assertMonthYear(Months.JANUARY, 2016);
            right.assertMonthYear(Months.FEBRUARY, 2016);
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
            const dateRange = [new Date(2015, Months.JANUARY, 1), new Date(2015, Months.JANUARY, 5)] as DateRange;
            const { left } = render({ initialMonth: new Date(2015, Months.JANUARY, 1) });
            assert.isTrue(onHoverChangeSpy.notCalled);
            left.clickDay(1);
            assert.isTrue(onHoverChangeSpy.calledOnce);
            assert.isTrue(DateUtils.areSameDay(dateRange[0], onHoverChangeSpy.args[0][0][0]));
            assert.isNull(onHoverChangeSpy.args[0][0][1]);
        });

        it("onHoverChange fired with correct values on mouseenter within a day", () => {
            const dateRange = [new Date(2015, Months.JANUARY, 1), new Date(2015, Months.JANUARY, 5)] as DateRange;
            const { left } = render({ initialMonth: new Date(2015, Months.JANUARY, 1) });
            assert.isTrue(onHoverChangeSpy.notCalled);
            left.clickDay(1).mouseEnterDay(5);
            assert.isTrue(onHoverChangeSpy.calledTwice);
            assert.isTrue(DateUtils.areSameDay(dateRange[0], onHoverChangeSpy.args[1][0][0]));
            assert.isTrue(DateUtils.areSameDay(dateRange[1], onHoverChangeSpy.args[1][0][1]));
        });

        it("onHoverChange fired with `undefined` on mouseleave within a day", () => {
            const { left } = render({ initialMonth: new Date(2015, Months.JANUARY, 1) });
            assert.isTrue(onHoverChangeSpy.notCalled);
            left
                .clickDay(1)
                .findDay(5)
                .simulate("mouseleave");
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
            const { assertSelectedDays, left } = render({ initialMonth: new Date(2015, Months.JANUARY, 1) });
            assertSelectedDays();
            left.clickDay(10).clickDay(14);
            assertSelectedDays(10, 14);
        });

        it("selects a range of dates when days are clicked in reverse", () => {
            const { assertSelectedDays, left } = render({ initialMonth: new Date(2015, Months.JANUARY, 1) });
            assertSelectedDays();
            left.clickDay(14).clickDay(10);
            assertSelectedDays(10, 14);
        });

        it("deselects everything when only selected day is clicked", () => {
            const { assertSelectedDays, left } = render({ initialMonth: new Date(2015, Months.JANUARY, 1) });
            left.clickDay(10).clickDay(10);
            assertSelectedDays();
        });

        it("starts a new selection when a non-endpoint is clicked in the current selection", () => {
            const { assertSelectedDays, left, right } = render({ initialMonth: new Date(2015, Months.JANUARY, 1) });
            left.clickDay(10).clickDay(14);
            right.clickDay(11);
            assertSelectedDays(11);
        });

        it("deselects endpoint when an endpoint of the current selection is clicked", () => {
            const { assertSelectedDays, left } = render({ initialMonth: new Date(2015, Months.JANUARY, 1) });
            left
                .clickDay(10)
                .clickDay(14)
                .clickDay(10);
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
            assert.isTrue(DateUtils.areSameDay(aWeekAgo, start));
            assert.isTrue(DateUtils.areSameDay(today, end));
        });

        it("custom shortcuts select the correct values", () => {
            const dateRange = [new Date(2015, Months.JANUARY, 1), new Date(2015, Months.JANUARY, 5)] as DateRange;
            render({
                initialMonth: new Date(2015, Months.JANUARY, 1),
                shortcuts: [{ label: "custom shortcut", dateRange }],
            })
                .clickShortcut()
                .assertSelectedDays(1, 5);
        });

        it("can change displayed date with the dropdowns in the caption", () => {
            const { left } = render({ initialMonth: new Date(2015, Months.MARCH, 2) });
            left.assertMonthYear(Months.MARCH, 2015);
            left.monthSelect.simulate("change", { target: { value: Months.JANUARY } });
            left.yearSelect.simulate("change", { target: { value: 2014 } });
            left.assertMonthYear(Months.JANUARY, 2014);
        });

        it("does not change display month when selecting dates from left month", () => {
            render({ initialMonth: new Date(2015, Months.MARCH, 2) })
                .left.clickDay(2)
                .clickDay(15)
                .assertMonthYear(Months.MARCH, 2015);
        });

        it("does not change display month when selecting dates from right month", () => {
            render({ initialMonth: new Date(2015, Months.MARCH, 2) })
                .right.clickDay(2)
                .clickDay(15)
                .assertMonthYear(Months.APRIL, 2015);
        });

        it("does not change display month when selecting dates from left and right month", () => {
            const { left, right } = render({ initialMonth: new Date(2015, Months.MARCH, 2) });
            right.clickDay(15);
            left.clickDay(2).assertMonthYear(Months.MARCH, 2015);
        });

        it("does not change display month when selecting dates across December (left) and January (right)", () => {
            const { left, right } = render({ initialMonth: new Date(2015, Months.DECEMBER, 2) });
            left.clickDay(15);
            right.clickDay(2);
            left.assertMonthYear(Months.DECEMBER, 2015);
        });
    });

    describe("time selection", () => {
        const defaultRange: DateRange = [new Date(2012, 2, 5, 6, 5, 40), new Date(2012, 4, 5, 7, 8, 20)];

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
            const { wrapper } = render({ timePickerProps: { showArrowButtons: true }, defaultValue: defaultRange });
            assert.isTrue(onChangeSpy.notCalled);
            wrapper
                .find(`.${DateClasses.TIMEPICKER_ARROW_BUTTON}.${DateClasses.TIMEPICKER_HOUR}`)
                .first()
                .simulate("click");
            assert.isTrue(onChangeSpy.calledOnce);
            const cbHour = onChangeSpy.firstCall.args[0][0].getHours();
            assert.strictEqual(cbHour, defaultRange[0].getHours() + 1);
        });

        it("changing date does not change time", () => {
            render({ timePrecision: "minute", defaultValue: defaultRange }).left.clickDay(16);
            assert.isTrue(DateUtils.areSameTime(onChangeSpy.firstCall.args[0][0] as Date, defaultRange[0]));
        });

        it("changing time does not change date", () => {
            render({ timePrecision: "minute", defaultValue: defaultRange }).setTimeInput("minute", 10, "left");
            assert.isTrue(DateUtils.areSameDay(onChangeSpy.firstCall.args[0][0] as Date, defaultRange[0]));
        });

        it("changing time without date uses today", () => {
            render({ timePrecision: "minute" }).setTimeInput("minute", 45, "left");
            assert.isTrue(DateUtils.areSameDay(onChangeSpy.firstCall.args[0][0] as Date, new Date()));
        });

        it("clicking a shortcut with includeTime=false doesn't change time", () => {
            render({ timePrecision: "minute", defaultValue: defaultRange }).clickShortcut();
            assert.isTrue(DateUtils.areSameTime(onChangeSpy.firstCall.args[0][0] as Date, defaultRange[0]));
        });

        it("clicking a shortcut with includeTime=true changes time", () => {
            const endTime = defaultRange[1];
            const startTime = new Date(defaultRange[1].getTime());
            startTime.setHours(startTime.getHours() - 2);

            const shortcuts: IDateRangeShortcut[] = [
                {
                    dateRange: [startTime, endTime] as DateRange,
                    includeTime: true,
                    label: "shortcut with time",
                },
            ];

            render({ timePrecision: "minute", defaultValue: defaultRange, shortcuts }).clickShortcut();
            assert.equal(onChangeSpy.firstCall.args[0][0] as Date, startTime);
        });

        it("selecting and unselecting a day doesn't change time", () => {
            const leftDatePicker = render({ timePrecision: "minute", defaultValue: defaultRange }).left;
            leftDatePicker.clickDay(5);
            leftDatePicker.clickDay(5);
            assert.isTrue(DateUtils.areSameTime(onChangeSpy.secondCall.args[0][0] as Date, defaultRange[0]));
        });
    });

    function dayNotOutside(day: ReactWrapper) {
        return !day.hasClass(DateClasses.DATEPICKER_DAY_OUTSIDE);
    }

    function render(props?: IDateRangePickerProps) {
        onChangeSpy = sinon.spy();
        onHoverChangeSpy = sinon.spy();
        const wrapper = wrap(<DateRangePicker onChange={onChangeSpy} onHoverChange={onHoverChangeSpy} {...props} />);
        return wrapper;
    }

    function wrap(datepicker: JSX.Element) {
        const wrapper = mount<IDateRangePickerProps, IDateRangePickerState>(datepicker);
        // Don't cache the left/right day pickers into variables in this scope,
        // because as of Enzyme 3.0 they can get stale if the views change.
        const harness = {
            wrapper,

            left: wrapDayPicker(wrapper, "left"),
            right: wrapDayPicker(wrapper, "right"),
            shortcuts: wrapper.find(`.${DateClasses.DATERANGEPICKER_SHORTCUTS}`).hostNodes(),

            assertHoveredDays: (fromDate: number | null, toDate: number | null) => {
                const [from, to] = wrapper.state("hoverValue");
                fromDate == null ? assert.isNull(from) : assert.equal(from.getDate(), fromDate);
                toDate == null ? assert.isNull(to) : assert.equal(to.getDate(), toDate);
                return harness;
            },
            assertSelectedDays: (from?: number, to?: number) => {
                const [one, two] = harness.getDays(DateClasses.DATEPICKER_DAY_SELECTED).map(d => +d.text());
                assert.equal(one, from);
                assert.equal(two, to);
                if (from != null && to != null) {
                    assert.lengthOf(
                        harness.getDays(DateClasses.DATERANGEPICKER_DAY_SELECTED_RANGE),
                        Math.max(0, to - from - 1),
                    );
                }
            },
            clickNavButton: (which: "next" | "prev", navIndex = 0) => {
                wrapper
                    .find(DatePickerNavbar)
                    .at(navIndex)
                    .find(`.DayPicker-NavButton--${which}`)
                    .hostNodes()
                    .simulate("click");
                return harness;
            },
            clickShortcut: (index = 0) => {
                harness.shortcuts
                    .find("a")
                    .at(index)
                    .simulate("click");
                return harness;
            },
            getDays: (className: string) => {
                return wrapper.find(`.${className}`).filterWhere(dayNotOutside);
            },
            setTimeInput: (precision: TimePrecision | "hour", value: number, which: "left" | "right") =>
                harness.wrapper
                    .find(`.${DateClasses.TIMEPICKER}-${precision}`)
                    .at(which === "left" ? 0 : 1)
                    .simulate("blur", { target: { value } }),
        };
        return harness;
    }

    function wrapDayPicker(
        parent: ReactWrapper<IDateRangePickerProps, IDateRangePickerState>,
        which: "left" | "right",
    ) {
        const harness = {
            get wrapper() {
                // use accessor to ensure it's always the latest reference
                return parent
                    .find(ReactDayPicker)
                    .find("Month")
                    .at(which === "left" ? 0 : 1);
            },
            get monthSelect() {
                return harness.wrapper.find({ className: DateClasses.DATEPICKER_MONTH_SELECT }).find("select");
            },
            get yearSelect() {
                return harness.wrapper.find({ className: DateClasses.DATEPICKER_YEAR_SELECT }).find("select");
            },

            assertMonthYear: (month: number, year?: number) => {
                const view = parent.state(which === "left" ? "leftView" : "rightView");
                assert.equal(view.getMonth(), month, "month");
                if (year != null) {
                    assert.equal(view.getYear(), year, "year");
                }
                return harness;
            },
            clickDay: (dayNumber = 1) => {
                harness.findDay(dayNumber).simulate("click");
                return harness;
            },
            findDay: (dayNumber = 1) => {
                return harness
                    .findDays()
                    .filterWhere(day => day.text() === "" + dayNumber)
                    .filterWhere(day => !day.hasClass(DateClasses.DATEPICKER_DAY_OUTSIDE))
                    .first();
            },
            findDays: () => harness.wrapper.find(`.${DateClasses.DATEPICKER_DAY}`),
            mouseEnterDay: (dayNumber = 1) => {
                harness.findDay(dayNumber).simulate("mouseenter");
                return harness;
            },
        };
        return harness;
    }
});
