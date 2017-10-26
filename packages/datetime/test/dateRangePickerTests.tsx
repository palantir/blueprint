/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Classes } from "@blueprintjs/core";
import { assert } from "chai";
import { mount } from "enzyme";
import * as React from "react";
import * as ReactDayPicker from "react-day-picker";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-dom/test-utils";

import * as DateUtils from "../src/common/dateUtils";
import * as Errors from "../src/common/errors";
import { Months } from "../src/common/months";
import { IDateRangeShortcut } from "../src/dateRangePicker";
import {
    Classes as DateClasses,
    DateRange,
    DateRangePicker,
    IDatePickerModifiers,
    IDateRangePickerProps,
} from "../src/index";
import { assertDatesEqual, assertDayDisabled, assertDayHidden } from "./common/dateTestUtils";

describe("<DateRangePicker>", () => {
    let testsContainerElement: Element;
    let dateRangePicker: DateRangePicker;
    let onDateRangePickerChangeSpy: Sinon.SinonSpy;
    let onDateRangePickerHoverChangeSpy: Sinon.SinonSpy;

    before(() => {
        // this is essentially what TestUtils.renderIntoDocument does
        testsContainerElement = document.createElement("div");
        document.documentElement.appendChild(testsContainerElement);
    });

    afterEach(() => {
        ReactDOM.unmountComponentAtNode(testsContainerElement);
    });

    it("renders its template", () => {
        renderDateRangePicker();
        assert.lengthOf(document.getElementsByClassName(DateClasses.DATERANGEPICKER), 1);
    });

    it("no day is selected by default", () => {
        renderDateRangePicker();
        assert.lengthOf(getSelectedDayElements(), 0);
    });

    it("user-provided modifiers are applied", () => {
        renderDateRangePicker({
            modifiers: { odd: (d: Date) => d.getDate() % 2 === 1 },
        });

        assert.isFalse(getDayElement(4).classList.contains("DayPicker-Day--odd"));
        assert.isTrue(getDayElement(5).classList.contains("DayPicker-Day--odd"));
    });

    describe("reconciliates dayPickerProps", () => {
        it("week starts with firstDayOfWeek value", () => {
            const selectedFirstDay = 3;
            const wrapper = mount(<DateRangePicker dayPickerProps={{ firstDayOfWeek: selectedFirstDay }} />);
            const firstWeekday = wrapper.find("Weekday").first();
            assert.equal(firstWeekday.prop("weekday"), selectedFirstDay);
        });

        it("shows outside days by default", () => {
            const defaultValue = [new Date(2017, Months.SEPTEMBER, 1), null] as DateRange;
            const firstDayInView = new Date(2017, Months.AUGUST, 27, 12, 0);
            const { leftView } = wrap(<DateRangePicker defaultValue={defaultValue} />);
            const firstDay = leftView.find("Day").first();
            assertDatesEqual(new Date(firstDay.prop("day")), firstDayInView);
        });

        it("doesn't show outside days if enableOutsideDays=false", () => {
            const defaultValue = [new Date(2017, Months.SEPTEMBER, 1, 12), null] as DateRange;
            const { leftView, rightView } = wrap(
                <DateRangePicker defaultValue={defaultValue} dayPickerProps={{ enableOutsideDays: false }} />,
            );
            const leftDays = leftView.find("Day");
            const rightDays = rightView.find("Day");

            assertDayHidden(leftDays.at(0));
            assertDayHidden(leftDays.at(1));
            assertDayHidden(leftDays.at(2));
            assertDayHidden(leftDays.at(3));
            assertDayHidden(leftDays.at(4));
            assertDayHidden(leftDays.at(5), false);

            assertDayHidden(rightDays.at(30), false);
            assertDayHidden(rightDays.at(31));
            assertDayHidden(rightDays.at(32));
            assertDayHidden(rightDays.at(33));
            assertDayHidden(rightDays.at(34));
        });

        it("disables days according to custom modifiers in addition to default modifiers", () => {
            const disableFridays = { daysOfWeek: [5] };
            const defaultValue = [new Date(2017, Months.SEPTEMBER, 1), null] as DateRange;
            const maxDate = new Date(2017, Months.OCTOBER, 20);

            const { getDayLeftView, getDayRightView } = wrap(
                <DateRangePicker
                    dayPickerProps={{ disabledDays: disableFridays }}
                    defaultValue={defaultValue}
                    maxDate={maxDate}
                />,
            );

            assertDayDisabled(getDayLeftView(15));
            assertDayDisabled(getDayRightView(21));
            assertDayDisabled(getDayLeftView(10), false);
        });

        it("disables out-of-range max dates", () => {
            const defaultValue = [new Date(2017, Months.AUGUST, 1), null] as DateRange;
            const { getDayRightView } = wrap(
                <DateRangePicker defaultValue={defaultValue} maxDate={new Date(2017, Months.SEPTEMBER, 20)} />,
            );
            assertDayDisabled(getDayRightView(21));
            assertDayDisabled(getDayRightView(10), false);
        });

        it("disables out-of-range min dates", () => {
            const defaultValue = [new Date(2017, Months.SEPTEMBER, 1), null] as DateRange;
            const { getDayLeftView, root } = wrap(
                <DateRangePicker defaultValue={defaultValue} minDate={new Date(2017, Months.AUGUST, 20)} />,
            );
            const prevMonthButton = root.find(".DayPicker-NavButton--prev").first();
            prevMonthButton.simulate("click");
            assertDayDisabled(getDayLeftView(10));
            assertDayDisabled(getDayLeftView(21), false);
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
            const DayPicker = wrapper.find("DayPicker").first();
            assert.equal(DayPicker.prop("locale"), dayPickerProps.locale);
            assert.equal(DayPicker.prop("localeUtils"), dayPickerProps.localeUtils);
            assert.equal(DayPicker.prop("modifiers"), dayPickerProps.modifiers);
        });

        describe("event handlers", () => {
            it("calls onMonthChange on button next click", () => {
                const onMonthChange = sinon.spy();
                const { leftDayPickerNavbar } = wrap(<DateRangePicker dayPickerProps={{ onMonthChange }} />);
                leftDayPickerNavbar.find(".DayPicker-NavButton--next").simulate("click");
                assert.isTrue(onMonthChange.called);
            });

            it("calls onMonthChange on button prev click", () => {
                const onMonthChange = sinon.spy();
                const { leftDayPickerNavbar } = wrap(<DateRangePicker dayPickerProps={{ onMonthChange }} />);
                leftDayPickerNavbar.find(".DayPicker-NavButton--prev").simulate("click");
                assert.isTrue(onMonthChange.called);
            });

            it("calls onMonthChange on button next click of left calendar", () => {
                const onMonthChange = sinon.spy();
                const { leftDayPickerNavbar } = wrap(
                    <DateRangePicker contiguousCalendarMonths={false} dayPickerProps={{ onMonthChange }} />,
                );
                leftDayPickerNavbar.find(".DayPicker-NavButton--next").simulate("click");
                assert.isTrue(onMonthChange.called);
            });

            it("calls onMonthChange on button prev click of left calendar", () => {
                const onMonthChange = sinon.spy();
                const { leftDayPickerNavbar } = wrap(
                    <DateRangePicker contiguousCalendarMonths={false} dayPickerProps={{ onMonthChange }} />,
                );
                leftDayPickerNavbar.find(".DayPicker-NavButton--prev").simulate("click");
                assert.isTrue(onMonthChange.called);
            });

            it("calls onMonthChange on button next click of right calendar", () => {
                const onMonthChange = sinon.spy();
                const { rightDayPickerNavbar } = wrap(
                    <DateRangePicker contiguousCalendarMonths={false} dayPickerProps={{ onMonthChange }} />,
                );
                rightDayPickerNavbar.find(".DayPicker-NavButton--next").simulate("click");
                assert.isTrue(onMonthChange.called);
            });

            it("calls onMonthChange on button prev click of right calendar", () => {
                const onMonthChange = sinon.spy();
                const { rightDayPickerNavbar } = wrap(
                    <DateRangePicker contiguousCalendarMonths={false} dayPickerProps={{ onMonthChange }} />,
                );
                rightDayPickerNavbar.find(".DayPicker-NavButton--prev").simulate("click");
                assert.isTrue(onMonthChange.called);
            });

            it("calls onMonthChange on month select change in left calendar", () => {
                const onMonthChange = sinon.spy();
                const { leftView } = wrap(<DateRangePicker dayPickerProps={{ onMonthChange }} />);
                leftView.find({ className: DateClasses.DATEPICKER_MONTH_SELECT }).simulate("change");
                assert.isTrue(onMonthChange.called);
            });

            it("calls onMonthChange on month select change in right calendar", () => {
                const onMonthChange = sinon.spy();
                const { rightView } = wrap(<DateRangePicker dayPickerProps={{ onMonthChange }} />);
                rightView.find({ className: DateClasses.DATEPICKER_MONTH_SELECT }).simulate("change");
                assert.isTrue(onMonthChange.called);
            });

            it("calls onMonthChange on year select change in left calendar", () => {
                const onMonthChange = sinon.spy();
                const { leftView } = wrap(<DateRangePicker dayPickerProps={{ onMonthChange }} />);
                leftView.find({ className: DateClasses.DATEPICKER_YEAR_SELECT }).simulate("change");
                assert.isTrue(onMonthChange.called);
            });

            it("calls onMonthChange on year select change in right calendar", () => {
                const onMonthChange = sinon.spy();
                const { rightView } = wrap(<DateRangePicker dayPickerProps={{ onMonthChange }} />);
                rightView.find({ className: DateClasses.DATEPICKER_YEAR_SELECT }).simulate("change");
                assert.isTrue(onMonthChange.called);
            });

            it("calls onDayMouseEnter", () => {
                const onDayMouseEnter = sinon.spy();
                renderDateRangePicker({ dayPickerProps: { onDayMouseEnter } });
                mouseEnterDay(14);
                assert.isTrue(onDayMouseEnter.called);
            });

            it("calls onDayMouseLeave", () => {
                const onDayMouseLeave = sinon.spy();
                renderDateRangePicker({ dayPickerProps: { onDayMouseLeave } });
                mouseEnterDay(14);
                mouseLeaveDay(14);
                assert.isTrue(onDayMouseLeave.called);
            });

            it("calls onDayClick", () => {
                const onDayClick = sinon.spy();
                renderDateRangePicker({ dayPickerProps: { onDayClick } });
                clickDay(14);
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
            renderDateRangePicker({ defaultValue, initialMonth, maxDate, minDate });
            assert.equal(dateRangePicker.state.leftView.getYear(), 2002);
            assert.equal(dateRangePicker.state.leftView.getMonth(), Months.MARCH);
        });

        it("is defaultValue if set and initialMonth not set", () => {
            const defaultValue = [new Date(2007, Months.APRIL, 4), null] as DateRange;
            const maxDate = new Date(2020, Months.JANUARY);
            const minDate = new Date(2000, Months.JANUARY);
            renderDateRangePicker({ defaultValue, maxDate, minDate });
            assert.equal(dateRangePicker.state.leftView.getYear(), 2007);
            assert.equal(dateRangePicker.state.leftView.getMonth(), Months.APRIL);
        });

        it("is value if set and initialMonth not set", () => {
            const maxDate = new Date(2020, Months.JANUARY);
            const minDate = new Date(2000, Months.JANUARY);
            const value = [new Date(2007, Months.APRIL, 4), null] as DateRange;
            renderDateRangePicker({ maxDate, minDate, value });
            assert.equal(dateRangePicker.state.leftView.getYear(), 2007);
            assert.equal(dateRangePicker.state.leftView.getMonth(), Months.APRIL);
        });

        it("is today if only maxDate/minDate set and today is in date range", () => {
            const maxDate = new Date(2020, Months.JANUARY);
            const minDate = new Date(2000, Months.JANUARY);
            const today = new Date();
            renderDateRangePicker({ maxDate, minDate });
            assert.equal(dateRangePicker.state.leftView.getYear(), today.getFullYear());
            assert.equal(dateRangePicker.state.leftView.getMonth(), today.getMonth());
        });

        it("is a day between minDate and maxDate if only maxDate/minDate set and today is not in range", () => {
            const maxDate = new Date(2005, Months.JANUARY);
            const minDate = new Date(2000, Months.JANUARY);
            renderDateRangePicker({ maxDate, minDate });
            const leftView = dateRangePicker.state.leftView;
            assert.isTrue(
                DateUtils.isDayInRange(new Date(leftView.getYear(), leftView.getMonth()), [minDate, maxDate]),
            );
        });

        it("is initialMonth - 1 if initialMonth === maxDate month", () => {
            const MAX_YEAR = 2016;

            const initialMonth = new Date(MAX_YEAR, Months.DECEMBER, 1);
            const maxDate = new Date(MAX_YEAR, Months.DECEMBER, 31);
            const minDate = new Date(2000, 0);

            renderDateRangePicker({ initialMonth, maxDate, minDate });

            assert.equal(dateRangePicker.state.leftView.getYear(), MAX_YEAR);
            assert.equal(dateRangePicker.state.leftView.getMonth(), Months.NOVEMBER);
        });

        it("is value - 1 if set and initialMonth not set and value month === maxDate month", () => {
            const value = [new Date(2017, Months.OCTOBER, 4), null] as DateRange;
            const maxDate = new Date(2017, Months.OCTOBER, 15);

            renderDateRangePicker({ maxDate, value });
            assert.equal(dateRangePicker.state.leftView.getYear(), 2017);
            assert.equal(dateRangePicker.state.leftView.getMonth(), Months.SEPTEMBER);
        });

        it("is initialMonth if initialMonth === minDate month and initialMonth === maxDate month", () => {
            const YEAR = 2016;

            const initialMonth = new Date(YEAR, Months.DECEMBER, 11);
            const maxDate = new Date(YEAR, Months.DECEMBER, 15);
            const minDate = new Date(YEAR, Months.DECEMBER, 1);

            renderDateRangePicker({ initialMonth, maxDate, minDate });

            assert.equal(dateRangePicker.state.leftView.getYear(), YEAR);
            assert.equal(dateRangePicker.state.leftView.getMonth(), Months.DECEMBER);
        });
    });

    describe("left/right calendar when not sequential", () => {
        it("only shows one calendar when minDate and maxDate are in the same month", () => {
            const contiguousCalendarMonths = false;
            const minDate = new Date(2015, Months.DECEMBER, 1);
            const maxDate = new Date(2015, Months.DECEMBER, 15);

            renderDateRangePicker({ contiguousCalendarMonths, maxDate, minDate });
            assert.lengthOf(document.getElementsByClassName("DayPicker"), 1);
            assert.lengthOf(document.getElementsByClassName("DayPicker-NavButton--prev"), 0);
            assert.lengthOf(document.getElementsByClassName("DayPicker-NavButton--next"), 0);
        });

        it("left calendar is bound between minDate and (maxDate - 1 month)", () => {
            const contiguousCalendarMonths = false;
            const minDate = new Date(2015, Months.JANUARY, 1);
            const maxDate = new Date(2015, Months.DECEMBER, 15);

            renderDateRangePicker({ contiguousCalendarMonths, maxDate, minDate });
            const monthSelects = getMonthSelect().children;
            const assertValueAt = (index: number, month: Months) =>
                assert.equal(monthSelects[index].getAttribute("value"), month.toString());
            assertValueAt(0, Months.JANUARY);
            assertValueAt(monthSelects.length - 1, Months.NOVEMBER);
        });

        it("right calendar is bound between (minDate + 1 month) and maxDate", () => {
            const contiguousCalendarMonths = false;
            const minDate = new Date(2015, Months.JANUARY, 1);
            const maxDate = new Date(2015, Months.DECEMBER, 15);

            renderDateRangePicker({ contiguousCalendarMonths, maxDate, minDate });
            const monthSelects = getMonthSelect(false).children;
            const assertValueAt = (index: number, month: Months) =>
                assert.equal(monthSelects[index].getAttribute("value"), month.toString());
            assertValueAt(0, Months.FEBRUARY);
            assertValueAt(monthSelects.length - 1, Months.DECEMBER);
        });

        it("left calendar can be altered independently of right calendar", () => {
            const contiguousCalendarMonths = false;
            const initialMonth = new Date(2015, Months.MAY, 5);

            renderDateRangePicker({ initialMonth, contiguousCalendarMonths });
            assert.equal(dateRangePicker.state.leftView.getMonth(), Months.MAY);
            const prevBtn = document.queryAll(".DayPicker-NavButton--prev");
            const nextBtn = document.queryAll(".DayPicker-NavButton--next");

            TestUtils.Simulate.click(prevBtn[0]);
            assert.equal(dateRangePicker.state.leftView.getMonth(), Months.APRIL);
            TestUtils.Simulate.click(nextBtn[0]);
            assert.equal(dateRangePicker.state.leftView.getMonth(), Months.MAY);
        });

        it("right calendar can be altered independently of left calendar", () => {
            const contiguousCalendarMonths = false;
            const initialMonth = new Date(2015, Months.MAY, 5);

            renderDateRangePicker({ initialMonth, contiguousCalendarMonths });
            assert.equal(dateRangePicker.state.rightView.getMonth(), Months.JUNE);
            const prevBtn = document.queryAll(".DayPicker-NavButton--prev");
            const nextBtn = document.queryAll(".DayPicker-NavButton--next");

            TestUtils.Simulate.click(nextBtn[1]);
            assert.equal(dateRangePicker.state.rightView.getMonth(), Months.JULY);
            TestUtils.Simulate.click(prevBtn[1]);
            assert.equal(dateRangePicker.state.rightView.getMonth(), Months.JUNE);
        });

        it("changing left calendar with month dropdown to be equal or after right calendar, shifts the right", () => {
            const contiguousCalendarMonths = false;
            const initialMonth = new Date(2015, Months.MAY, 5);

            renderDateRangePicker({ initialMonth, contiguousCalendarMonths });
            assert.equal(dateRangePicker.state.leftView.getMonth(), Months.MAY);
            assert.equal(dateRangePicker.state.rightView.getMonth(), Months.JUNE);
            TestUtils.Simulate.change(getMonthSelect(), { target: { value: Months.AUGUST } } as any);
            assert.equal(dateRangePicker.state.leftView.getMonth(), Months.AUGUST);
            assert.equal(dateRangePicker.state.rightView.getMonth(), Months.SEPTEMBER);
        });

        it("changing right calendar with month dropdown to be equal or before left calendar, shifts the left", () => {
            const contiguousCalendarMonths = false;
            const initialMonth = new Date(2015, Months.MAY, 5);

            renderDateRangePicker({ initialMonth, contiguousCalendarMonths });
            assert.equal(dateRangePicker.state.leftView.getMonth(), Months.MAY);
            assert.equal(dateRangePicker.state.rightView.getMonth(), Months.JUNE);
            TestUtils.Simulate.change(getMonthSelect(false), { target: { value: Months.APRIL } } as any);
            assert.equal(dateRangePicker.state.leftView.getMonth(), Months.MARCH);
            assert.equal(dateRangePicker.state.rightView.getMonth(), Months.APRIL);
        });

        it("changing left calendar with year dropdown to be equal or after right calendar, shifts the right", () => {
            const contiguousCalendarMonths = false;
            const initialMonth = new Date(2013, Months.MAY, 5);
            const NEW_YEAR = 2014;

            renderDateRangePicker({ initialMonth, contiguousCalendarMonths });
            TestUtils.Simulate.change(getYearSelect(), { target: { value: NEW_YEAR } } as any);
            assert.equal(dateRangePicker.state.leftView.getMonth(), Months.MAY);
            assert.equal(dateRangePicker.state.leftView.getYear(), NEW_YEAR);
            assert.equal(dateRangePicker.state.rightView.getMonth(), Months.JUNE);
            assert.equal(dateRangePicker.state.rightView.getYear(), NEW_YEAR);
        });

        it("changing right calendar with year dropdown to be equal or before left calendar, shifts the left", () => {
            const contiguousCalendarMonths = false;
            const initialMonth = new Date(2013, Months.MAY, 5);
            const NEW_YEAR = 2012;

            renderDateRangePicker({ initialMonth, contiguousCalendarMonths });
            TestUtils.Simulate.change(getYearSelect(false), { target: { value: NEW_YEAR } } as any);
            assert.equal(dateRangePicker.state.leftView.getMonth(), Months.MAY);
            assert.equal(dateRangePicker.state.leftView.getYear(), NEW_YEAR);
            assert.equal(dateRangePicker.state.rightView.getMonth(), Months.JUNE);
            assert.equal(dateRangePicker.state.rightView.getYear(), NEW_YEAR);
        });

        it("changing left calendar with navButton to equal right calendar, shifts the right", () => {
            const contiguousCalendarMonths = false;
            const initialMonth = new Date(2015, Months.MAY, 5);

            renderDateRangePicker({ initialMonth, contiguousCalendarMonths });
            const nextBtn = document.queryAll(".DayPicker-NavButton--next");

            TestUtils.Simulate.click(nextBtn[0]);
            assert.equal(dateRangePicker.state.leftView.getMonth(), Months.JUNE);
            assert.equal(dateRangePicker.state.rightView.getMonth(), Months.JULY);
        });

        it("changing right calendar with navButton to equal left calendar, shifts the left", () => {
            const contiguousCalendarMonths = false;
            const initialMonth = new Date(2015, Months.MAY, 5);

            renderDateRangePicker({ initialMonth, contiguousCalendarMonths });
            const prevBtn = document.queryAll(".DayPicker-NavButton--prev");

            TestUtils.Simulate.click(prevBtn[1]);
            assert.equal(dateRangePicker.state.leftView.getMonth(), Months.APRIL);
            assert.equal(dateRangePicker.state.rightView.getMonth(), Months.MAY);
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
            assert.throws(() => {
                renderDateRangePicker({ minDate, maxDate });
            }, Errors.DATERANGEPICKER_MAX_DATE_INVALID);
        });

        it("only days outside bounds have disabled class", () => {
            const minDate = new Date(2000, Months.JANUARY, 10);
            const initialMonth = minDate;
            renderDateRangePicker({ initialMonth, minDate });
            const disabledDay = getDayElement(8);
            const selectableDay = getDayElement(10);
            assert.isTrue(disabledDay.classList.contains(DateClasses.DATEPICKER_DAY_DISABLED));
            assert.isFalse(selectableDay.classList.contains(DateClasses.DATEPICKER_DAY_DISABLED));
        });

        it("an error is thrown if defaultValue is outside bounds", () => {
            const minDate = new Date(2015, Months.JANUARY, 5);
            const maxDate = new Date(2015, Months.JANUARY, 7);
            const defaultValue = [new Date(2015, Months.JANUARY, 12), null] as DateRange;
            assert.throws(() => {
                renderDateRangePicker({ defaultValue, minDate, maxDate });
            }, Errors.DATERANGEPICKER_DEFAULT_VALUE_INVALID);
        });

        it("an error is thrown if initialMonth is outside month bounds", () => {
            const minDate = new Date(2015, Months.JANUARY, 5);
            const maxDate = new Date(2015, Months.JANUARY, 7);
            const initialMonth = new Date(2015, Months.FEBRUARY, 12);
            assert.throws(() => {
                renderDateRangePicker({ initialMonth, minDate, maxDate });
            }, Errors.DATERANGEPICKER_INITIAL_MONTH_INVALID);
        });

        it("an error is not thrown if initialMonth is outside day bounds but inside month bounds", () => {
            const minDate = new Date(2015, Months.JANUARY, 5);
            const maxDate = new Date(2015, Months.JANUARY, 7);
            const initialMonth = new Date(2015, Months.JANUARY, 12);
            assert.doesNotThrow(() => {
                renderDateRangePicker({ initialMonth, minDate, maxDate });
            });
        });

        it("an error is thrown if value is outside bounds", () => {
            const minDate = new Date(2015, Months.JANUARY, 5);
            const maxDate = new Date(2015, Months.JANUARY, 7);
            const value = [new Date(2015, Months.JANUARY, 12), null] as DateRange;
            assert.throws(() => {
                renderDateRangePicker({ value, minDate, maxDate });
            }, Errors.DATERANGEPICKER_VALUE_INVALID);
        });

        it("onChange not fired when a day outside of bounds is clicked", () => {
            const minDate = new Date(2015, Months.JANUARY, 5);
            const maxDate = new Date(2015, Months.JANUARY, 7);
            renderDateRangePicker({ minDate, maxDate });
            assert.isTrue(onDateRangePickerChangeSpy.notCalled);
            clickDay(10);
            assert.isTrue(onDateRangePickerChangeSpy.notCalled);
        });

        it("caption options are only displayed for possible months and years", () => {
            const minDate = new Date(2015, Months.JANUARY, 5);
            const maxDate = new Date(2015, Months.JANUARY, 7);
            renderDateRangePicker({ minDate, maxDate });
            const monthOptions = getOptionsText(DateClasses.DATEPICKER_MONTH_SELECT);
            const yearOptions = getOptionsText(DateClasses.DATEPICKER_YEAR_SELECT);
            assert.lengthOf(monthOptions, 1);
            assert.isTrue(monthOptions[0] === "January");
            assert.lengthOf(yearOptions, 1);
            assert.isTrue(yearOptions[0] === "2015");
        });

        it("can change month down to start date with arrow button", () => {
            const minDate = new Date(2015, Months.JANUARY, 5);
            const initialMonth = new Date(2015, Months.FEBRUARY, 5);
            renderDateRangePicker({ initialMonth, minDate });
            assert.strictEqual(dateRangePicker.state.leftView.getMonth(), Months.FEBRUARY);
            let prevBtn = document.queryAll(".DayPicker-NavButton--prev");
            assert.lengthOf(prevBtn, 1);

            TestUtils.Simulate.click(prevBtn[0]);
            assert.strictEqual(dateRangePicker.state.leftView.getMonth(), Months.JANUARY);
            prevBtn = document.queryAll(".DayPicker-NavButton--prev");
            assert.lengthOf(prevBtn, 0);
        });

        it("disables shortcuts that begin earlier than minDate", () => {
            const minDate = TWO_WEEKS_AGO_START;
            const initialMonth = TODAY;
            const shortcuts: IDateRangeShortcut[] = [
                { label: "last week", dateRange: [LAST_WEEK_START, TODAY] },
                { label: "last month", dateRange: [LAST_MONTH_START, TODAY] },
            ];

            renderDateRangePicker({ initialMonth, minDate, shortcuts });
            assert.isFalse(isShortcutDisabled(0));
            assert.isTrue(isShortcutDisabled(1));
        });

        it("disables shortcuts that end later than maxDate", () => {
            const maxDate = TWO_WEEKS_AGO_START;
            const initialMonth = TWO_WEEKS_AGO_START;
            const shortcuts: IDateRangeShortcut[] = [
                { label: "last week", dateRange: [LAST_WEEK_START, TODAY] },
                { label: "last month", dateRange: [LAST_MONTH_START, TODAY] },
            ];

            renderDateRangePicker({ initialMonth, maxDate, shortcuts });
            assert.isTrue(isShortcutDisabled(0));
            assert.isTrue(isShortcutDisabled(1));
        });
    });

    describe("hover interactions", () => {
        describe("when neither start nor end date is defined", () => {
            it("should show a hovered range of [day, null]", () => {
                renderDateRangePicker();
                assert.lengthOf(getHoveredRangeDayElements(), 0);
                mouseEnterDay(14);
                assert.lengthOf(getHoveredRangeDayElements(), 0);
                assert.equal(getHoveredRangeStartDayElement().textContent, "14");
                assert.isNull(getHoveredRangeEndDayElement());
            });
        });

        describe("when only start date is defined", () => {
            it("should show a hovered range of [start, day] if day > start", () => {
                renderDateRangePicker();
                clickDay(14);
                mouseEnterDay(18);
                assert.lengthOf(getHoveredRangeDayElements(), 3);
                assert.equal(getHoveredRangeStartDayElement().textContent, "14");
                assert.equal(getHoveredRangeEndDayElement().textContent, "18");
            });

            it("should show a hovered range of [null, null] if day === start", () => {
                renderDateRangePicker();
                clickDay(14);
                mouseEnterDay(14);
                assert.lengthOf(getHoveredRangeDayElements(), 0);
                assert.isNull(getHoveredRangeStartDayElement());
                assert.isNull(getHoveredRangeEndDayElement());
            });

            it("should show a hovered range of [day, start] if day < start", () => {
                renderDateRangePicker();
                clickDay(14);
                mouseEnterDay(10);
                assert.lengthOf(getHoveredRangeDayElements(), 3);
                assert.equal(getHoveredRangeStartDayElement().textContent, "10");
                assert.equal(getHoveredRangeEndDayElement().textContent, "14");
            });

            it("should not show a hovered range when mousing over a disabled date", () => {
                renderDateRangePicker({
                    maxDate: new Date(2017, Months.FEBRUARY, 1),
                    minDate: new Date(2017, Months.JANUARY, 1),
                });
                clickDay(14); // Jan 14th
                mouseEnterDay(5, false); // Feb 5th
                assert.lengthOf(getHoveredRangeDayElements(), 0);
                assert.equal(getHoveredRangeStartDayElement().textContent, "14");
                assert.isNull(getHoveredRangeEndDayElement());
            });
        });

        describe("when only end date is defined", () => {
            it("should show a hovered range of [end, day] if day > end", () => {
                renderDateRangePicker();
                clickDay(14);
                clickDay(18);
                clickDay(14); // deselect start date

                mouseEnterDay(22);
                assert.lengthOf(getHoveredRangeDayElements(), 3);
                assert.equal(getHoveredRangeStartDayElement().textContent, "18");
                assert.equal(getHoveredRangeEndDayElement().textContent, "22");
            });

            it("should show a hovered range of [null, null] if day === end", () => {
                renderDateRangePicker();
                clickDay(14);
                clickDay(18);
                clickDay(14);

                mouseEnterDay(18);
                assert.lengthOf(getHoveredRangeDayElements(), 0);
                assert.isNull(getHoveredRangeStartDayElement());
                assert.isNull(getHoveredRangeEndDayElement());
            });

            it("should show a hovered range of [day, end] if day < end", () => {
                renderDateRangePicker();
                clickDay(14);
                clickDay(18);
                clickDay(14);

                mouseEnterDay(14);
                assert.lengthOf(getHoveredRangeDayElements(), 3);
                assert.equal(getHoveredRangeStartDayElement().textContent, "14");
                assert.equal(getHoveredRangeEndDayElement().textContent, "18");
            });
        });

        describe("when both start and end date are defined", () => {
            it("should show a hovered range of [null, end] if day === start", () => {
                renderDateRangePicker();
                clickDay(14);
                clickDay(18);

                mouseEnterDay(14);
                assert.lengthOf(getHoveredRangeDayElements(), 0);
                assert.isNull(getHoveredRangeStartDayElement());
                assert.equal(getHoveredRangeEndDayElement().textContent, "18");
            });

            it("should show a hovered range of [start, null] if day === end", () => {
                renderDateRangePicker();
                clickDay(14);
                clickDay(18);

                mouseEnterDay(18);
                assert.lengthOf(getHoveredRangeDayElements(), 0);
                assert.equal(getHoveredRangeStartDayElement().textContent, "14");
                assert.isNull(getHoveredRangeEndDayElement());
            });

            it("should show a hovered range of [day, null] if start < day < end", () => {
                renderDateRangePicker();
                clickDay(14);
                clickDay(18);

                mouseEnterDay(16);
                assert.lengthOf(getHoveredRangeDayElements(), 0);
                assert.equal(getHoveredRangeStartDayElement().textContent, "16");
                assert.isNull(getHoveredRangeEndDayElement());
            });

            it("should show a hovered range of [day, null] if day < start", () => {
                renderDateRangePicker();
                clickDay(14);
                clickDay(18);

                mouseEnterDay(10);
                assert.lengthOf(getHoveredRangeDayElements(), 0);
                assert.equal(getHoveredRangeStartDayElement().textContent, "10");
                assert.isNull(getHoveredRangeEndDayElement());
            });

            it("should show a hovered range of [day, null] if day > end", () => {
                renderDateRangePicker();
                clickDay(14);
                clickDay(18);

                mouseEnterDay(22);
                assert.lengthOf(getHoveredRangeDayElements(), 0);
                assert.equal(getHoveredRangeStartDayElement().textContent, "22");
                assert.isNull(getHoveredRangeEndDayElement());
            });

            it("should show a hovered range of [null, null] if start === day === end", () => {
                renderDateRangePicker({ allowSingleDayRange: true });
                clickDay(14);
                clickDay(14);

                mouseEnterDay(14);
                assert.lengthOf(getHoveredRangeDayElements(), 0);
                assert.isNull(getHoveredRangeStartDayElement());
                assert.isNull(getHoveredRangeEndDayElement());
            });
        });

        it("hovering on day in month prior to selected start date's month, should not shift calendar view", () => {
            const INITIAL_MONTH = Months.MARCH;
            const MONTH_OUT_OF_VIEW = Months.JANUARY;
            renderDateRangePicker({ initialMonth: new Date(2017, INITIAL_MONTH, 1) });

            clickDay(14);
            clickDay(18);

            TestUtils.Simulate.change(getMonthSelect(), { target: { value: MONTH_OUT_OF_VIEW } } as any);

            // hover on left month
            mouseEnterDay(14);
            assert.equal(dateRangePicker.state.leftView.getMonth(), MONTH_OUT_OF_VIEW);

            // hover on right month
            mouseEnterDay(14, false);
            assert.equal(dateRangePicker.state.leftView.getMonth(), MONTH_OUT_OF_VIEW);
        });

        // verifies the fix for https://github.com/palantir/blueprint/issues/1048
        it("hovering when contiguousCalendarMonths=false shows a hovered range", () => {
            renderDateRangePicker({ contiguousCalendarMonths: false });
            clickDay(14);
            // hover on right month
            mouseEnterDay(18, false);
            assert.equal(getHoveredRangeStartDayElement().textContent, "14");
            assert.equal(getHoveredRangeEndDayElement().textContent, "18");
        });
    });

    describe("when controlled", () => {
        it("value initially selects a day", () => {
            const defaultValue = [new Date(2010, Months.FEBRUARY, 2), null] as DateRange;
            const value = [new Date(2010, Months.JANUARY, 1), null] as DateRange;
            renderDateRangePicker({ defaultValue, value });
            const selectedDays = getSelectedDayElements();
            assert.lengthOf(selectedDays, 1);
            assert.equal(selectedDays[0].textContent, value[0].getDate().toString());
        });

        it("onChange fired when a day is clicked", () => {
            renderDateRangePicker({ value: [null, null] });
            assert.isTrue(onDateRangePickerChangeSpy.notCalled);
            clickDay();
            assert.isTrue(onDateRangePickerChangeSpy.calledOnce);
        });

        it("onHoverChange fired on mouseenter within a day", () => {
            renderDateRangePicker({ value: [null, null] });
            assert.isTrue(onDateRangePickerHoverChangeSpy.notCalled);
            mouseEnterDay();
            assert.isTrue(onDateRangePickerHoverChangeSpy.calledOnce);
        });

        it("onHoverChange fired on mouseleave within a day", () => {
            renderDateRangePicker({ value: [null, null] });
            assert.isTrue(onDateRangePickerHoverChangeSpy.notCalled);
            mouseLeaveDay();
            assert.isTrue(onDateRangePickerHoverChangeSpy.calledOnce);
        });

        it("selected day updates are not automatic", () => {
            renderDateRangePicker({ value: [null, null] });
            assert.lengthOf(getSelectedDayElements(), 0);
            clickDay();
            assert.lengthOf(getSelectedDayElements(), 0);
        });

        it("can change displayed date with the dropdowns in the caption", () => {
            renderDateRangePicker({ initialMonth: new Date(2015, Months.MARCH, 2), value: [null, null] });
            assert.equal(dateRangePicker.state.leftView.getMonth(), Months.MARCH);
            assert.equal(dateRangePicker.state.leftView.getYear(), 2015);

            TestUtils.Simulate.change(getMonthSelect(), { target: { value: Months.JANUARY } } as any);
            TestUtils.Simulate.change(getYearSelect(), { target: { value: 2014 } } as any);
            assert.equal(dateRangePicker.state.leftView.getMonth(), Months.JANUARY);
            assert.equal(dateRangePicker.state.leftView.getYear(), 2014);
        });

        it("shortcuts fire onChange with correct values", () => {
            renderDateRangePicker();
            clickFirstShortcut();

            const today = new Date();
            const aWeekAgo = DateUtils.clone(today);
            aWeekAgo.setDate(today.getDate() - 6);

            assert.isTrue(onDateRangePickerChangeSpy.calledOnce);
            assert.isTrue(DateUtils.areSameDay(aWeekAgo, onDateRangePickerChangeSpy.args[0][0][0]));
            assert.isTrue(DateUtils.areSameDay(today, onDateRangePickerChangeSpy.args[0][0][1]));
        });

        it("custom shortcuts select the correct values", () => {
            const dateRange = [new Date(2015, Months.JANUARY, 1), new Date(2015, Months.JANUARY, 5)] as DateRange;
            renderDateRangePicker({
                initialMonth: new Date(2015, Months.JANUARY, 1),
                shortcuts: [{ label: "custom shortcut", dateRange }],
            });

            clickFirstShortcut();
            assert.isTrue(onDateRangePickerChangeSpy.calledOnce);
            assert.isTrue(DateUtils.areSameDay(dateRange[0], onDateRangePickerChangeSpy.args[0][0][0]));
            assert.isTrue(DateUtils.areSameDay(dateRange[1], onDateRangePickerChangeSpy.args[0][0][1]));
        });

        it("custom shortcuts set the displayed months correctly when start month changes", () => {
            const dateRange = [new Date(2016, Months.JANUARY, 1), new Date(2016, Months.DECEMBER, 31)] as DateRange;
            renderDateRangePicker({
                initialMonth: new Date(2015, Months.JANUARY, 1),
                shortcuts: [{ label: "custom shortcut", dateRange }],
            });

            clickFirstShortcut();
            assert.isTrue(onDateRangePickerChangeSpy.calledOnce);
            assert.equal(dateRangePicker.state.leftView.getMonth(), Months.JANUARY);
            assert.equal(dateRangePicker.state.leftView.getYear(), 2016);
            assert.equal(dateRangePicker.state.rightView.getMonth(), Months.FEBRUARY);
            assert.equal(dateRangePicker.state.rightView.getYear(), 2016);
        });

        it(
            "custom shortcuts set the displayed months correctly when start month changes " +
                "and contiguousCalendarMonths is false",
            () => {
                const dateRange = [new Date(2016, Months.JANUARY, 1), new Date(2016, Months.DECEMBER, 31)] as DateRange;
                renderDateRangePicker({
                    contiguousCalendarMonths: false,
                    initialMonth: new Date(2015, Months.JANUARY, 1),
                    shortcuts: [{ label: "custom shortcut", dateRange }],
                });

                clickFirstShortcut();
                assert.isTrue(onDateRangePickerChangeSpy.calledOnce);
                assert.equal(dateRangePicker.state.leftView.getMonth(), Months.JANUARY);
                assert.equal(dateRangePicker.state.leftView.getYear(), 2016);
                assert.equal(dateRangePicker.state.rightView.getMonth(), Months.DECEMBER);
                assert.equal(dateRangePicker.state.rightView.getYear(), 2016);
            },
        );

        it("custom shortcuts set the displayed months correctly when start month stays the same", () => {
            const dateRange = [new Date(2016, Months.JANUARY, 1), new Date(2016, Months.DECEMBER, 31)] as DateRange;
            renderDateRangePicker({
                initialMonth: new Date(2016, Months.JANUARY, 1),
                shortcuts: [{ label: "custom shortcut", dateRange }],
            });

            clickFirstShortcut();
            assert.isTrue(onDateRangePickerChangeSpy.calledOnce);
            assert.equal(dateRangePicker.state.leftView.getMonth(), Months.JANUARY);
            assert.equal(dateRangePicker.state.leftView.getYear(), 2016);
            assert.equal(dateRangePicker.state.rightView.getMonth(), Months.FEBRUARY);
            assert.equal(dateRangePicker.state.rightView.getYear(), 2016);

            clickFirstShortcut();
            assert.equal(dateRangePicker.state.leftView.getMonth(), Months.JANUARY);
            assert.equal(dateRangePicker.state.leftView.getYear(), 2016);
            assert.equal(dateRangePicker.state.rightView.getMonth(), Months.FEBRUARY);
            assert.equal(dateRangePicker.state.rightView.getYear(), 2016);
        });
    });

    describe("when uncontrolled", () => {
        it("defaultValue initially selects a day", () => {
            const today = new Date();
            renderDateRangePicker({ defaultValue: [today, null] });
            const selectedDays = getSelectedDayElements();
            assert.lengthOf(selectedDays, 1);
            assert.equal(selectedDays[0].textContent, today.getDate().toString());
        });

        it("onChange fired when a day is clicked", () => {
            renderDateRangePicker();
            assert.isTrue(onDateRangePickerChangeSpy.notCalled);
            clickDay();
            assert.isTrue(onDateRangePickerChangeSpy.calledOnce);
        });

        it("onHoverChange fired with correct values when a day is clicked", () => {
            const dateRange = [new Date(2015, Months.JANUARY, 1), new Date(2015, Months.JANUARY, 5)] as DateRange;
            renderDateRangePicker({ initialMonth: new Date(2015, Months.JANUARY, 1) });
            assert.isTrue(onDateRangePickerHoverChangeSpy.notCalled);
            clickDay(1);
            assert.isTrue(onDateRangePickerHoverChangeSpy.calledOnce);
            assert.isTrue(DateUtils.areSameDay(dateRange[0], onDateRangePickerHoverChangeSpy.args[0][0][0]));
            assert.isNull(onDateRangePickerHoverChangeSpy.args[0][0][1]);
        });

        it("onHoverChange fired with correct values on mouseenter within a day", () => {
            const dateRange = [new Date(2015, Months.JANUARY, 1), new Date(2015, Months.JANUARY, 5)] as DateRange;
            renderDateRangePicker({ initialMonth: new Date(2015, Months.JANUARY, 1) });
            assert.isTrue(onDateRangePickerHoverChangeSpy.notCalled);
            clickDay(1);
            mouseEnterDay(5);
            assert.isTrue(onDateRangePickerHoverChangeSpy.calledTwice);
            assert.isTrue(DateUtils.areSameDay(dateRange[0], onDateRangePickerHoverChangeSpy.args[1][0][0]));
            assert.isTrue(DateUtils.areSameDay(dateRange[1], onDateRangePickerHoverChangeSpy.args[1][0][1]));
        });

        it("onHoverChange fired with `undefined` on mouseleave within a day", () => {
            renderDateRangePicker({ initialMonth: new Date(2015, Months.JANUARY, 1) });
            assert.isTrue(onDateRangePickerHoverChangeSpy.notCalled);
            clickDay(1);
            mouseLeaveDay(5);
            assert.isTrue(onDateRangePickerHoverChangeSpy.calledTwice);
            assert.isUndefined(onDateRangePickerHoverChangeSpy.args[1][0]);
        });

        it("selected day updates are automatic", () => {
            renderDateRangePicker();
            assert.lengthOf(getSelectedDayElements(), 0);
            clickDay(3);
            const selectedDayElements = getSelectedDayElements();
            assert.lengthOf(selectedDayElements, 1);
            assert.equal(selectedDayElements[0].textContent, "3");
        });

        it("selects a range of dates when two days are clicked", () => {
            renderDateRangePicker({ initialMonth: new Date(2015, Months.JANUARY, 1) });
            assert.lengthOf(getSelectedDayElements(), 0);
            assert.lengthOf(getSelectedRangeDayElements(), 0);

            clickDay(10);
            clickDay(14);
            assert.lengthOf(getSelectedDayElements(), 2);
            assert.lengthOf(getSelectedRangeDayElements(), 3);
        });

        it("selects a range of dates when days are clicked in reverse", () => {
            renderDateRangePicker({ initialMonth: new Date(2015, Months.JANUARY, 1) });
            assert.lengthOf(getSelectedDayElements(), 0);
            assert.lengthOf(getSelectedRangeDayElements(), 0);

            clickDay(14);
            clickDay(10);
            assert.lengthOf(getSelectedDayElements(), 2);
            assert.lengthOf(getSelectedRangeDayElements(), 3);
        });

        it("deselects everything when only selected day is clicked", () => {
            renderDateRangePicker({ initialMonth: new Date(2015, Months.JANUARY, 1) });
            assert.lengthOf(getSelectedDayElements(), 0);
            assert.lengthOf(getSelectedRangeDayElements(), 0);

            clickDay(10);
            assert.lengthOf(getSelectedDayElements(), 1);
            assert.lengthOf(getSelectedRangeDayElements(), 0);

            clickDay(10);
            assert.lengthOf(getSelectedDayElements(), 0);
            assert.lengthOf(getSelectedRangeDayElements(), 0);
        });

        it("starts a new selection when a non-endpoint is clicked in the current selection", () => {
            renderDateRangePicker({ initialMonth: new Date(2015, Months.JANUARY, 1) });
            clickDay(10);
            clickDay(14);

            clickDay(11, false);
            assert.lengthOf(getSelectedDayElements(), 1);
            assert.lengthOf(getSelectedRangeDayElements(), 0);
            assert.deepEqual(getSelectedDayElements()[0].textContent, "11");
        });

        it("deselects endpoint when an endpoint of the current selection is clicked", () => {
            renderDateRangePicker({ initialMonth: new Date(2015, Months.JANUARY, 1) });
            clickDay(10);
            clickDay(14);

            clickDay(10);
            assert.lengthOf(getSelectedDayElements(), 1);
            assert.lengthOf(getSelectedRangeDayElements(), 0);
            assert.deepEqual(getSelectedDayElements()[0].textContent, "14");

            clickDay(10);
            clickDay(14);
            assert.lengthOf(getSelectedDayElements(), 1);
            assert.lengthOf(getSelectedRangeDayElements(), 0);
            assert.deepEqual(getSelectedDayElements()[0].textContent, "10");
        });

        it("allowSingleDayRange={true} allows start and end to be the same day", () => {
            renderDateRangePicker({ allowSingleDayRange: true, initialMonth: new Date(2015, Months.JANUARY, 1) });
            clickDay(10);
            clickDay(10);

            const days = getSelectedDayElements();
            assert.lengthOf(days, 1);
            assert.deepEqual(days[0].textContent, "10");
            assert.lengthOf(getSelectedRangeDayElements(), 0);
        });

        it("shortcuts select values", () => {
            renderDateRangePicker();

            clickFirstShortcut();

            const today = new Date();
            const aWeekAgo = DateUtils.clone(today);
            aWeekAgo.setDate(today.getDate() - 6);
            assert.isTrue(DateUtils.areSameDay(aWeekAgo, dateRangePicker.state.value[0]));
            assert.isTrue(DateUtils.areSameDay(today, dateRangePicker.state.value[1]));
        });

        it("custom shortcuts select the correct values", () => {
            const dateRange = [new Date(2015, Months.JANUARY, 1), new Date(2015, Months.JANUARY, 5)] as DateRange;
            renderDateRangePicker({
                initialMonth: new Date(2015, Months.JANUARY, 1),
                shortcuts: [{ label: "custom shortcut", dateRange }],
            });

            clickFirstShortcut();
            assert.lengthOf(getSelectedDayElements(), 2);
            assert.lengthOf(getSelectedRangeDayElements(), 3);
            assert.deepEqual(getSelectedDayElements()[0].textContent, "1");
            assert.deepEqual(getSelectedDayElements()[1].textContent, "5");
        });

        it("can change displayed date with the dropdowns in the caption", () => {
            renderDateRangePicker({ initialMonth: new Date(2015, Months.MARCH, 2) });
            assert.equal(dateRangePicker.state.leftView.getMonth(), Months.MARCH);
            assert.equal(dateRangePicker.state.leftView.getYear(), 2015);

            TestUtils.Simulate.change(getMonthSelect(), { target: { value: Months.JANUARY } } as any);
            TestUtils.Simulate.change(getYearSelect(), { target: { value: 2014 } } as any);
            assert.equal(dateRangePicker.state.leftView.getMonth(), Months.JANUARY);
            assert.equal(dateRangePicker.state.leftView.getYear(), 2014);
        });

        it("does not change display month when selecting dates from left month", () => {
            renderDateRangePicker({ initialMonth: new Date(2015, Months.MARCH, 2) });
            clickDay(2);
            clickDay(15, false);

            assert.equal(dateRangePicker.state.leftView.getMonth(), Months.MARCH);
            assert.equal(dateRangePicker.state.leftView.getYear(), 2015);
        });

        it("does not change display month when selecting dates from right month", () => {
            renderDateRangePicker({ initialMonth: new Date(2015, Months.MARCH, 2) });
            clickDay(2, false);
            clickDay(15, false);

            assert.equal(dateRangePicker.state.leftView.getMonth(), Months.MARCH);
            assert.equal(dateRangePicker.state.leftView.getYear(), 2015);
        });

        it("does not change display month when selecting dates from left and right month", () => {
            renderDateRangePicker({ initialMonth: new Date(2015, Months.MARCH, 2) });
            clickDay(2);
            clickDay(15, false);

            assert.equal(dateRangePicker.state.leftView.getMonth(), Months.MARCH);
            assert.equal(dateRangePicker.state.leftView.getYear(), 2015);
        });

        it("does not change display month when selecting dates across December (left) and January (right)", () => {
            renderDateRangePicker();
            TestUtils.Simulate.change(getMonthSelect(), { target: { value: Months.DECEMBER } } as any);
            TestUtils.Simulate.change(getYearSelect(), { target: { value: 2015 } } as any);
            clickDay(15);
            clickDay(2, false);

            assert.equal(dateRangePicker.state.leftView.getMonth(), Months.DECEMBER);
            assert.equal(dateRangePicker.state.leftView.getYear(), 2015);
        });
    });

    function renderDateRangePicker(props?: IDateRangePickerProps) {
        onDateRangePickerChangeSpy = sinon.spy();
        onDateRangePickerHoverChangeSpy = sinon.spy();
        dateRangePicker = ReactDOM.render(
            <DateRangePicker
                onChange={onDateRangePickerChangeSpy}
                onHoverChange={onDateRangePickerHoverChangeSpy}
                {...props}
            />,
            testsContainerElement,
        ) as DateRangePicker;
    }

    function wrap(datepicker: JSX.Element) {
        const wrapper = mount(datepicker);
        const dayPickers = wrapper.find(ReactDayPicker).find("Month");
        const leftDayPicker = dayPickers.at(0);
        const rightDayPicker = dayPickers.length > 1 ? dayPickers.at(1) : dayPickers.at(0);
        return {
            getDayLeftView: (dayNumber = 1) => {
                return leftDayPicker
                    .find(`.${DateClasses.DATEPICKER_DAY}`)
                    .filterWhere(
                        day => day.text() === "" + dayNumber && !day.hasClass(DateClasses.DATEPICKER_DAY_OUTSIDE),
                    );
            },
            getDayRightView: (dayNumber = 1) => {
                return rightDayPicker
                    .find(`.${DateClasses.DATEPICKER_DAY}`)
                    .filterWhere(
                        day => day.text() === "" + dayNumber && !day.hasClass(DateClasses.DATEPICKER_DAY_OUTSIDE),
                    );
            },
            leftDayPickerNavbar: wrapper.find("Navbar").at(0),
            leftView: leftDayPicker,
            rightDayPickerNavbar: wrapper.find("Navbar").at(1) || wrapper.find("Navbar").at(0),
            rightView: rightDayPicker,
            root: wrapper,
        };
    }

    function clickDay(dayNumber = 1, fromLeftMonth = true) {
        TestUtils.Simulate.click(getDayElement(dayNumber, fromLeftMonth));
    }

    function mouseEnterDay(dayNumber = 1, fromLeftMonth = true) {
        TestUtils.Simulate.mouseEnter(getDayElement(dayNumber, fromLeftMonth));
    }

    function mouseLeaveDay(dayNumber = 1, fromLeftMonth = true) {
        TestUtils.Simulate.mouseLeave(getDayElement(dayNumber, fromLeftMonth));
    }

    function getShortcut(index: number) {
        return document.queryAll(`.${DateClasses.DATERANGEPICKER_SHORTCUTS} .${Classes.MENU_ITEM}`)[index];
    }

    function isShortcutDisabled(index: number) {
        return getShortcut(index).classList.contains(Classes.DISABLED);
    }

    function clickFirstShortcut() {
        TestUtils.Simulate.click(getShortcut(0));
    }

    function getDayElement(dayNumber = 1, fromLeftMonth = true) {
        const month = document.queryAll(".DayPicker-Month")[fromLeftMonth ? 0 : 1];
        const days = month.queryAll(`.${DateClasses.DATEPICKER_DAY}`);
        return days.filter(d => {
            return d.textContent === dayNumber.toString() && !d.classList.contains(DateClasses.DATEPICKER_DAY_OUTSIDE);
        })[0];
    }

    function getMonthSelect(fromLeftView: boolean = true) {
        const monthSelect = document.getElementsByClassName(DateClasses.DATEPICKER_MONTH_SELECT);
        return fromLeftView ? monthSelect[0] : monthSelect[1];
    }

    function getOptionsText(selectElementClass: string): string[] {
        return document
            .queryAll(`.DayPicker-Month:last-child .${selectElementClass} option`)
            .map(e => (e as HTMLElement).innerText);
    }

    function getSelectedDayElements() {
        return document.queryAll(`.${DateClasses.DATEPICKER_DAY_SELECTED}:not(.${DateClasses.DATEPICKER_DAY_OUTSIDE})`);
    }

    /**
     * Returns the selected range excluding endpoints.
     */
    function getSelectedRangeDayElements() {
        const selectedRange = DateClasses.DATERANGEPICKER_DAY_SELECTED_RANGE;
        return document.queryAll(`.${selectedRange}:not(.${DateClasses.DATEPICKER_DAY_OUTSIDE})`);
    }

    /**
     * Returns the hovered range excluding endpoints.
     */
    function getHoveredRangeDayElements() {
        const selectedRange = DateClasses.DATERANGEPICKER_DAY_HOVERED_RANGE;
        return document.queryAll(`.${selectedRange}:not(.${DateClasses.DATEPICKER_DAY_OUTSIDE})`);
    }

    function getHoveredRangeStartDayElement() {
        return document.query(`.${DateClasses.DATERANGEPICKER_DAY_HOVERED_RANGE}-start`);
    }

    function getHoveredRangeEndDayElement() {
        return document.query(`.${DateClasses.DATERANGEPICKER_DAY_HOVERED_RANGE}-end`);
    }

    function getYearSelect(fromLeftView: boolean = true) {
        const yearSelect = document.getElementsByClassName(DateClasses.DATEPICKER_YEAR_SELECT);
        return fromLeftView ? yearSelect[0] : yearSelect[1];
    }
});
