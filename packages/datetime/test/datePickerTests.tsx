/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { assert } from "chai";
import { mount } from "enzyme";
import * as React from "react";
import { LocaleUtils } from "react-day-picker";
import * as sinon from "sinon";

import { Button } from "@blueprintjs/core";
import * as DateUtils from "../src/common/dateUtils";
import * as Errors from "../src/common/errors";
import { Months } from "../src/common/months";
import { Classes, DatePicker, IDatePickerModifiers, IDatePickerProps } from "../src/index";
import { assertDatesEqual, assertDayDisabled, assertDayHidden } from "./common/dateTestUtils";

describe("<DatePicker>", () => {
    it(`renders .${Classes.DATEPICKER}`, () => {
        assert.lengthOf(wrap(<DatePicker />).root.find(`.${Classes.DATEPICKER}`), 1);
    });

    it("no day is selected by default", () => {
        const { getSelectedDays, root } = wrap(<DatePicker />);
        assert.lengthOf(getSelectedDays(), 0);
        assert.isUndefined(root.state("selectedDay"));
    });

    describe("reconciliates dayPickerProps", () => {
        it("week starts with firstDayOfWeek value", () => {
            const selectedFirstDay = 3;
            const wrapper = mount(<DatePicker dayPickerProps={{ firstDayOfWeek: selectedFirstDay }} />);
            const firstWeekday = wrapper.find("Weekday").first();
            assert.equal(firstWeekday.prop("weekday"), selectedFirstDay);
        });

        it("shows outside days by default", () => {
            const defaultValue = new Date(2017, Months.SEPTEMBER, 1);
            const firstDayInView = new Date(2017, Months.AUGUST, 27, 12, 0);
            const wrapper = mount(<DatePicker defaultValue={defaultValue} />);
            const firstDay = wrapper.find("Day").first();
            assertDatesEqual(new Date(firstDay.prop("day")), firstDayInView);
        });

        it("doesn't show outside days if enableOutsideDays=false", () => {
            const defaultValue = new Date(2017, Months.SEPTEMBER, 1, 12);
            const wrapper = mount(
                <DatePicker defaultValue={defaultValue} dayPickerProps={{ enableOutsideDays: false }} />,
            );
            const days = wrapper.find("Day");

            assertDayHidden(days.at(0));
            assertDayHidden(days.at(1));
            assertDayHidden(days.at(2));
            assertDayHidden(days.at(3));
            assertDayHidden(days.at(4));
            assertDayHidden(days.at(5), false);
        });

        it("disables days according to custom modifiers in addition to default modifiers", () => {
            const defaultValue = new Date(2017, Months.SEPTEMBER, 1);
            const disableFridays = { daysOfWeek: [5] };
            const { getDay } = wrap(
                <DatePicker
                    defaultValue={defaultValue}
                    maxDate={new Date(2017, Months.SEPTEMBER, 20)}
                    dayPickerProps={{ disabledDays: disableFridays }}
                />,
            );
            assertDayDisabled(getDay(15));
            assertDayDisabled(getDay(21));
            assertDayDisabled(getDay(10), false);
        });

        it("disables out-of-range max dates", () => {
            const defaultValue = new Date(2017, Months.SEPTEMBER, 1);
            const { getDay } = wrap(
                <DatePicker defaultValue={defaultValue} maxDate={new Date(2017, Months.SEPTEMBER, 20)} />,
            );
            assertDayDisabled(getDay(21));
            assertDayDisabled(getDay(10), false);
        });

        it("disables out-of-range min dates", () => {
            const defaultValue = new Date(2017, Months.SEPTEMBER, 1);
            const { getDay, root } = wrap(
                <DatePicker defaultValue={defaultValue} minDate={new Date(2017, Months.AUGUST, 20)} />,
            );
            const prevMonthButton = root.find(".DayPicker-NavButton--prev").first();
            prevMonthButton.simulate("click");
            assertDayDisabled(getDay(10));
            assertDayDisabled(getDay(21), false);
        });

        it("allows top-level locale, localeUtils, and modifiers to be overridden by same props in dayPickerProps", () => {
            const blueprintModifiers: IDatePickerModifiers = {
                blueprint: () => true,
            };
            const blueprintLocaleUtils = {
                ...LocaleUtils,
                formatDay: () => "b",
            };
            const blueprintProps: IDatePickerProps = {
                locale: "blueprint",
                localeUtils: blueprintLocaleUtils,
                modifiers: blueprintModifiers,
            };

            const dayPickerModifiers: IDatePickerModifiers = {
                dayPicker: () => true,
            };
            const dayPickerLocaleUtils = {
                ...LocaleUtils,
                formatDay: () => "d",
            };
            const dayPickerProps: IDatePickerProps = {
                locale: "dayPicker",
                localeUtils: dayPickerLocaleUtils,
                modifiers: dayPickerModifiers,
            };

            const wrapper = mount(<DatePicker {...blueprintProps} dayPickerProps={dayPickerProps} />);
            const DayPicker = wrapper.find("DayPicker").first();
            assert.equal(DayPicker.prop("locale"), dayPickerProps.locale);
            assert.equal(DayPicker.prop("localeUtils"), dayPickerProps.localeUtils);
            assert.equal(DayPicker.prop("modifiers"), dayPickerProps.modifiers);
        });

        describe("event handlers", () => {
            // use a date that lets us navigate forward and backward in the same year
            const defaultValue = new Date(2017, Months.SEPTEMBER, 1);

            it("calls onMonthChange on button next click", () => {
                const onMonthChange = sinon.spy();
                const { root } = wrap(<DatePicker defaultValue={defaultValue} dayPickerProps={{ onMonthChange }} />);
                root
                    .find(".DayPicker-NavButton--next")
                    .first()
                    .simulate("click");
                assert.isTrue(onMonthChange.called);
            });

            it("calls onMonthChange on button prev click", () => {
                const onMonthChange = sinon.spy();
                const { root } = wrap(<DatePicker defaultValue={defaultValue} dayPickerProps={{ onMonthChange }} />);
                root
                    .find(".DayPicker-NavButton--prev")
                    .first()
                    .simulate("click");
                assert.isTrue(onMonthChange.called);
            });

            it("calls onMonthChange on month select change", () => {
                const onMonthChange = sinon.spy();
                const { root } = wrap(<DatePicker defaultValue={defaultValue} dayPickerProps={{ onMonthChange }} />);
                root
                    .find({ className: Classes.DATEPICKER_MONTH_SELECT })
                    .first()
                    .simulate("change");
                assert.isTrue(onMonthChange.called);
            });

            it("calls onMonthChange on year select change", () => {
                const onMonthChange = sinon.spy();
                const { root } = wrap(<DatePicker defaultValue={defaultValue} dayPickerProps={{ onMonthChange }} />);
                root
                    .find({ className: Classes.DATEPICKER_YEAR_SELECT })
                    .first()
                    .simulate("change");
                assert.isTrue(onMonthChange.called);
            });

            it("calls onDayClick", () => {
                const onDayClick = sinon.spy();
                const { getDay } = wrap(<DatePicker defaultValue={defaultValue} dayPickerProps={{ onDayClick }} />);
                getDay().simulate("click");
                assert.isTrue(onDayClick.called);
            });
        });
    });

    it("user-provided modifiers are applied", () => {
        const oddifier = (d: Date) => d.getDate() % 2 === 1;
        const { getDay } = wrap(<DatePicker modifiers={{ odd: oddifier }} />);

        assert.isFalse(getDay(4).hasClass("DayPicker-Day--odd"));
        assert.isTrue(getDay(5).hasClass("DayPicker-Day--odd"));
    });

    it("renders the actions bar when showActionsBar=true", () => {
        const { root } = wrap(<DatePicker showActionsBar={true} />);
        assert.lengthOf(root.find({ className: Classes.DATEPICKER_FOOTER }), 1);
    });

    describe("initially displayed month", () => {
        it("is defaultValue", () => {
            const defaultValue = new Date(2007, Months.APRIL, 4);
            const { root } = wrap(<DatePicker defaultValue={defaultValue} />);
            assert.equal(root.state("displayYear"), 2007);
            assert.equal(root.state("displayMonth"), Months.APRIL);
        });

        it("is initialMonth if set (overrides defaultValue)", () => {
            const defaultValue = new Date(2007, Months.APRIL, 4);
            const initialMonth = new Date(2002, Months.MARCH, 1);
            const { root } = wrap(<DatePicker defaultValue={defaultValue} initialMonth={initialMonth} />);
            assert.equal(root.state("displayYear"), 2002);
            assert.equal(root.state("displayMonth"), Months.MARCH);
        });

        it("is value if set and initialMonth not set", () => {
            const value = new Date(2007, Months.APRIL, 4);
            const { root } = wrap(<DatePicker value={value} />);
            assert.equal(root.state("displayYear"), 2007);
            assert.equal(root.state("displayMonth"), Months.APRIL);
        });

        it("is today if today is within date range", () => {
            const today = new Date();
            const { root } = wrap(<DatePicker />);
            assert.equal(root.state("displayYear"), today.getFullYear());
            assert.equal(root.state("displayMonth"), today.getMonth());
        });

        it("is a day between minDate and maxDate if today is not in range", () => {
            const maxDate = new Date(2005, Months.JANUARY);
            const minDate = new Date(2000, Months.JANUARY);
            const { root } = wrap(<DatePicker maxDate={maxDate} minDate={minDate} />);
            assert.isTrue(
                DateUtils.isDayInRange(new Date(root.state("displayYear"), root.state("displayMonth")), [
                    minDate,
                    maxDate,
                ]),
            );
        });

        it("selectedDay is set to the day of the value", () => {
            const value = new Date(2007, Months.APRIL, 4);
            const { root } = wrap(<DatePicker value={value} />);
            assert.strictEqual(root.state("selectedDay"), value.getDate());
        });

        it("selectedDay is set to the day of the defaultValue", () => {
            const defaultValue = new Date(2007, Months.APRIL, 4);
            const { root } = wrap(<DatePicker defaultValue={defaultValue} />);
            assert.strictEqual(root.state("selectedDay"), defaultValue.getDate());
        });
    });

    describe("minDate/maxDate bounds", () => {
        const MIN_DATE = new Date(2015, Months.JANUARY, 7);
        const MAX_DATE = new Date(2015, Months.JANUARY, 12);
        it("maxDate must be later than minDate", () => {
            assert.throws(
                () => wrap(<DatePicker maxDate={MIN_DATE} minDate={MAX_DATE} />),
                Errors.DATEPICKER_MAX_DATE_INVALID,
            );
        });

        it("an error is thrown if defaultValue is outside bounds", () => {
            assert.throws(
                () =>
                    wrap(
                        <DatePicker
                            defaultValue={new Date(2015, Months.JANUARY, 5)}
                            minDate={MIN_DATE}
                            maxDate={MAX_DATE}
                        />,
                    ),
                Errors.DATEPICKER_DEFAULT_VALUE_INVALID,
            );
        });

        it("an error is thrown if value is outside bounds", () => {
            assert.throws(
                () =>
                    wrap(
                        <DatePicker value={new Date(2015, Months.JANUARY, 20)} minDate={MIN_DATE} maxDate={MAX_DATE} />,
                    ),
                Errors.DATEPICKER_VALUE_INVALID,
            );
        });

        it("an error is thrown if initialMonth is outside month bounds", () => {
            assert.throws(
                () =>
                    wrap(
                        <DatePicker
                            initialMonth={new Date(2015, Months.FEBRUARY, 12)}
                            minDate={MIN_DATE}
                            maxDate={MAX_DATE}
                        />,
                    ),
                Errors.DATEPICKER_INITIAL_MONTH_INVALID,
            );
        });

        it("an error is not thrown if initialMonth is outside day bounds but inside month bounds", () => {
            assert.doesNotThrow(() =>
                wrap(
                    <DatePicker
                        initialMonth={new Date(2015, Months.JANUARY, 12)}
                        minDate={MIN_DATE}
                        maxDate={MAX_DATE}
                    />,
                ),
            );
        });

        it("only days outside bounds have disabled class", () => {
            const minDate = new Date(2000, Months.JANUARY, 10);
            const { getDay } = wrap(<DatePicker initialMonth={minDate} minDate={minDate} />);
            // 8 is before min date, 12 is after
            assert.isTrue(getDay(8).hasClass(Classes.DATEPICKER_DAY_DISABLED));
            assert.isFalse(getDay(12).hasClass(Classes.DATEPICKER_DAY_DISABLED));
        });

        it("onChange not fired when a day outside of bounds is clicked", () => {
            const onChange = sinon.spy();
            const { getDay } = wrap(<DatePicker maxDate={MAX_DATE} minDate={MIN_DATE} onChange={onChange} />);
            assert.isTrue(onChange.notCalled);
            getDay(4).simulate("click");
            getDay(16).simulate("click");
            assert.isTrue(onChange.notCalled);
            getDay(8).simulate("click");
            assert.isTrue(onChange.calledOnce);
        });
    });

    describe("when controlled", () => {
        it("value initially selects a day", () => {
            const value = new Date(2010, Months.JANUARY, 1);
            const { getSelectedDays } = wrap(
                <DatePicker defaultValue={new Date(2010, Months.FEBRUARY, 2)} value={value} />,
            );
            assert.lengthOf(getSelectedDays(), 1);
            assert.equal(
                getSelectedDays()
                    .at(0)
                    .text(),
                value.getDate().toString(),
            );
        });

        it("selection does not update automatically", () => {
            const { getDay, getSelectedDays } = wrap(<DatePicker value={null} />);
            assert.lengthOf(getSelectedDays(), 0);
            getDay().simulate("click");
            assert.lengthOf(getSelectedDays(), 0);
        });

        it("selected day doesn't update on current month view change", () => {
            const value = new Date(2010, Months.JANUARY, 2);
            const { months, root, getSelectedDays, years } = wrap(<DatePicker value={value} />);
            root.find(".DayPicker-NavButton--prev").simulate("click");

            assert.lengthOf(getSelectedDays(), 1);

            months.simulate("change", { target: { value: Months.JUNE } });
            assert.lengthOf(getSelectedDays(), 0);

            years.simulate("change", { target: { value: 2014 } });
            assert.lengthOf(getSelectedDays(), 0);
        });

        it("onChange fired when a day is clicked", () => {
            const onChange = sinon.spy();
            const { getDay } = wrap(<DatePicker onChange={onChange} value={null} />);
            getDay().simulate("click");
            assert.isTrue(onChange.calledOnce);
            assert.isTrue(onChange.args[0][1]);
        });

        it("onChange fired when month is changed", () => {
            const value = new Date(2010, Months.JANUARY, 2);
            const onChange = sinon.spy();
            const { months, root } = wrap(<DatePicker onChange={onChange} value={value} />);

            root.find(".DayPicker-NavButton--prev").simulate("click");
            assert.isTrue(onChange.calledOnce, "expected onChange called");
            assert.isFalse(onChange.firstCall.args[1], "expected hasUserManuallySelectedDate to be false");

            months.simulate("change", { target: { value: Months.JUNE } });
            assert.isTrue(onChange.calledTwice, "expected onChange called again");
            assert.isFalse(onChange.secondCall.args[1], "expected hasUserManuallySelectedDate to be false again");
        });

        it("can change displayed date with the dropdowns in the caption", () => {
            const { months, root, years } = wrap(
                <DatePicker initialMonth={new Date(2015, Months.MARCH, 2)} value={null} />,
            );
            assert.equal(root.state("displayMonth"), Months.MARCH);
            assert.equal(root.state("displayYear"), 2015);

            months.simulate("change", { target: { value: Months.JANUARY } });
            years.simulate("change", { target: { value: 2014 } });
            assert.equal(root.state("displayMonth"), Months.JANUARY);
            assert.equal(root.state("displayYear"), 2014);
        });
    });

    describe("when uncontrolled", () => {
        it("defaultValue initially selects a day", () => {
            const today = new Date();
            const selectedDays = wrap(<DatePicker defaultValue={today} />).getSelectedDays();
            assert.lengthOf(selectedDays, 1);
            assert.equal(selectedDays.at(0).text(), today.getDate().toString());
        });

        it("onChange fired when a day is clicked", () => {
            const onChange = sinon.spy();
            const { getDay } = wrap(<DatePicker onChange={onChange} />);
            assert.isTrue(onChange.notCalled);
            getDay().simulate("click");
            assert.isTrue(onChange.calledOnce);
        });

        it("selected day updates are automatic", () => {
            const { getDay, getSelectedDays } = wrap(<DatePicker />);
            assert.lengthOf(getSelectedDays(), 0);
            getDay(3).simulate("click");
            assert.deepEqual(getSelectedDays().map(d => d.text()), ["3"]);
        });

        it("selected day is preserved when selections are changed", () => {
            const initialMonth = new Date(2015, Months.JULY, 1);
            const { getDay, getSelectedDays, months } = wrap(<DatePicker initialMonth={initialMonth} />);
            getDay(31).simulate("click");
            months.simulate("change", { target: { value: Months.AUGUST } });
            assert.deepEqual(getSelectedDays().map(d => d.text()), ["31"]);
        });

        it("selected day is changed if necessary when selections are changed", () => {
            const initialMonth = new Date(2015, Months.JULY, 1);
            const { getDay, getSelectedDays, root } = wrap(<DatePicker initialMonth={initialMonth} />);
            getDay(31).simulate("click");
            root.find(".DayPicker-NavButton--prev").simulate("click");
            assert.deepEqual(getSelectedDays().map(d => d.text()), ["30"]);
        });

        it("selected day is changed to minDate or maxDate if selections are changed outside bounds", () => {
            const initialMonth = new Date(2015, Months.JULY, 1);
            const minDate = new Date(2015, Months.MARCH, 13);
            const maxDate = new Date(2015, Months.NOVEMBER, 21);
            const { getDay, getSelectedDays, months } = wrap(
                <DatePicker initialMonth={initialMonth} minDate={minDate} maxDate={maxDate} />,
            );

            getDay(1).simulate("click");
            months.simulate("change", { target: { value: Months.MARCH } });
            let selectedDayElements = getSelectedDays();
            assert.lengthOf(selectedDayElements, 1);
            assert.equal(selectedDayElements.at(0).text(), minDate.getDate().toString());

            getDay(25).simulate("click");
            months.simulate("change", { target: { value: Months.NOVEMBER } });
            selectedDayElements = getSelectedDays();
            assert.lengthOf(selectedDayElements, 1);
            assert.equal(selectedDayElements.at(0).text(), maxDate.getDate().toString());
        });

        it("can change displayed date with the dropdowns in the caption", () => {
            const { months, root, years } = wrap(<DatePicker initialMonth={new Date(2015, Months.MARCH, 2)} />);
            assert.equal(root.state("displayMonth"), Months.MARCH);
            assert.equal(root.state("displayYear"), 2015);

            months.simulate("change", { target: { value: Months.JANUARY } });
            years.simulate("change", { target: { value: 2014 } });
            assert.equal(root.state("displayMonth"), Months.JANUARY);
            assert.equal(root.state("displayYear"), 2014);
        });
    });

    it("onChange correctly passes a Date and never null when canClearSelection is false", () => {
        const onChange = sinon.spy();
        const { getDay } = wrap(<DatePicker canClearSelection={false} onChange={onChange} />);
        getDay().simulate("click");
        assert.isNotNull(onChange.firstCall.args[0]);
        getDay().simulate("click");
        assert.isNotNull(onChange.secondCall.args[0]);
    });

    it("onChange correctly passes a Date or null when canClearSelection is true", () => {
        const onChange = sinon.spy();
        const { getDay } = wrap(<DatePicker canClearSelection={true} onChange={onChange} />);
        getDay().simulate("click");
        assert.isNotNull(onChange.firstCall.args[0]);
        getDay().simulate("click");
        assert.isNull(onChange.secondCall.args[0]);
    });

    it("selects the current day when Today is clicked", () => {
        const { root } = wrap(<DatePicker showActionsBar={true} />);
        root
            .find({ className: Classes.DATEPICKER_FOOTER })
            .find(Button)
            .first()
            .simulate("click");

        const today = new Date();
        const value = root.state("value");
        assert.equal(value.getDate(), today.getDate());
        assert.equal(value.getMonth(), today.getMonth());
        assert.equal(value.getFullYear(), today.getFullYear());
    });

    it("clears the value when Clear is clicked", () => {
        const { getDay, root } = wrap(<DatePicker showActionsBar={true} />);
        getDay().simulate("click");
        root
            .find({ className: Classes.DATEPICKER_FOOTER })
            .find(Button)
            .last()
            .simulate("click");
        assert.isNull(root.state("value"));
    });

    function wrap(datepicker: JSX.Element) {
        const wrapper = mount(datepicker);
        return {
            getDay: (dayNumber = 1) => {
                return wrapper
                    .find(`.${Classes.DATEPICKER_DAY}`)
                    .filterWhere(day => day.text() === "" + dayNumber && !day.hasClass(Classes.DATEPICKER_DAY_OUTSIDE));
            },
            getSelectedDays: () => wrapper.find(`.${Classes.DATEPICKER_DAY_SELECTED}`),
            months: wrapper.find(`.${Classes.DATEPICKER_MONTH_SELECT}`),
            root: wrapper,
            years: wrapper.find(`.${Classes.DATEPICKER_YEAR_SELECT}`),
        };
    }
});
