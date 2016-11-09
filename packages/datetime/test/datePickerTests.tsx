/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import { assert } from "chai";
import { mount } from "enzyme";
import * as React from "react";

import * as DateUtils from "../src/common/dateUtils";
import * as Errors from "../src/common/errors";
import { Classes, DatePicker } from "../src/index";
import { Button } from "@blueprintjs/core";

describe("<DatePicker>", () => {
    it(`renders .${Classes.DATEPICKER}`, () => {
        assert.lengthOf(wrap(<DatePicker />).root.find(`.${Classes.DATEPICKER}`), 1);
    });

    it("no day is selected by default", () => {
        const { getSelectedDays, root } = wrap(<DatePicker />);
        assert.lengthOf(getSelectedDays(), 0);
        assert.isUndefined(root.state("selectedDay"));
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
            const defaultValue = new Date(2007, 3, 4);
            const { root } = wrap(<DatePicker defaultValue={defaultValue} />);
            assert.equal(root.state("displayYear"), 2007);
            assert.equal(root.state("displayMonth"), 3);
        });

        it("is initialMonth if set (overrides defaultValue)", () => {
            const defaultValue = new Date(2007, 3, 4);
            const initialMonth = new Date(2002, 2, 1);
            const { root } = wrap(<DatePicker defaultValue={defaultValue} initialMonth={initialMonth} />);
            assert.equal(root.state("displayYear"), 2002);
            assert.equal(root.state("displayMonth"), 2);
        });

        it("is value if set and initialMonth not set", () => {
            const value = new Date(2007, 3, 4);
            const { root } = wrap(<DatePicker value={value} />);
            assert.equal(root.state("displayYear"), 2007);
            assert.equal(root.state("displayMonth"), 3);
        });

        it("is today if today is within date range", () => {
            const today = new Date();
            const { root } = wrap(<DatePicker />);
            assert.equal(root.state("displayYear"), today.getFullYear());
            assert.equal(root.state("displayMonth"), today.getMonth());
        });

        it("is a day between minDate and maxDate if today is not in range", () => {
            const maxDate = new Date(2005, 0);
            const minDate = new Date(2000, 0);
            const { root } = wrap(<DatePicker maxDate={maxDate} minDate={minDate} />);
            assert.isTrue(DateUtils.isDayInRange(
                new Date(root.state("displayYear"), root.state("displayMonth")),
                [minDate, maxDate])
            );
        });

        it("selectedDay is set to the day of the value", () => {
            const value = new Date(2007, 3, 4);
            const { root } = wrap(<DatePicker value={value} />);
            assert.strictEqual(root.state("selectedDay"), value.getDate());
        });

        it("selectedDay is set to the day of the defaultValue", () => {
            const defaultValue = new Date(2007, 3, 4);
            const { root } = wrap(<DatePicker defaultValue={defaultValue} />);
            assert.strictEqual(root.state("selectedDay"), defaultValue.getDate());
        });
    });

    describe("minDate/maxDate bounds", () => {
        const MIN_DATE = new Date(2015, 0, 7);
        const MAX_DATE = new Date(2015, 0, 12);
        it("maxDate must be later than minDate", () => {
            assert.throws(() => wrap(
                <DatePicker maxDate={MIN_DATE} minDate={MAX_DATE} />
            ), Errors.DATEPICKER_MAX_DATE_INVALID);
        });

        it("an error is thrown if defaultValue is outside bounds", () => {
            assert.throws(() => wrap(
                <DatePicker defaultValue={new Date(2015, 0, 5)} minDate={MIN_DATE} maxDate={MAX_DATE} />
            ), Errors.DATEPICKER_DEFAULT_VALUE_INVALID);
        });

        it("an error is thrown if value is outside bounds", () => {
            assert.throws(() => wrap(
                <DatePicker value={new Date(2015, 0, 20)} minDate={MIN_DATE} maxDate={MAX_DATE} />
            ), Errors.DATEPICKER_VALUE_INVALID);
        });

        it("an error is thrown if initialMonth is outside month bounds", () => {
            assert.throws(() => wrap(
                <DatePicker initialMonth={new Date(2015, 1, 12)} minDate={MIN_DATE} maxDate={MAX_DATE} />
            ), Errors.DATEPICKER_INITIAL_MONTH_INVALID);
        });

        it("an error is not thrown if initialMonth is outside day bounds but inside month bounds", () => {
            assert.doesNotThrow(() => wrap(
                <DatePicker initialMonth={new Date(2015, 0, 12)} minDate={MIN_DATE} maxDate={MAX_DATE} />
            ));
        });

        it("only days outside bounds have disabled class", () => {
            const minDate = new Date(2000, 0, 10);
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
            const value = new Date(2010, 0, 1);
            const { getSelectedDays } = wrap(
                <DatePicker defaultValue={new Date(2010, 1, 2)} value={value} />
            );
            assert.lengthOf(getSelectedDays(), 1);
            assert.equal(getSelectedDays().at(0).text(), value.getDate());
        });

        it("selection does not update automatically", () => {
            const { getDay, getSelectedDays } = wrap(<DatePicker value={null} />);
            assert.lengthOf(getSelectedDays(), 0);
            getDay().simulate("click");
            assert.lengthOf(getSelectedDays(), 0);
        });

        it("selected day doesn't update on current month view change", () => {
            const value = new Date(2010, 0, 2);
            const { months, root, getSelectedDays, years } = wrap(<DatePicker value={value} />);
            root.find(".DayPicker-NavButton--prev").simulate("click");

            assert.lengthOf(getSelectedDays(), 1);

            months.simulate("change", { target: { value: 5 } });
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
            const value = new Date(2010, 0, 2);
            const onChange = sinon.spy();
            const { months, root } = wrap(<DatePicker onChange={onChange} value={value} />);

            root.find(".DayPicker-NavButton--prev").simulate("click");
            assert.isTrue(onChange.calledOnce, "expected onChange called");
            assert.isFalse(onChange.firstCall.args[1], "expected hasUserManuallySelectedDate to be false");

            months.simulate("change", { target: { value: 5 } });
            assert.isTrue(onChange.calledTwice, "expected onChange called again");
            assert.isFalse(onChange.secondCall.args[1], "expected hasUserManuallySelectedDate to be false again");
        });

        it("can change displayed date with the dropdowns in the caption", () => {
            const { months, root, years } = wrap(<DatePicker initialMonth={new Date(2015, 2, 2)} value={null} />);
            assert.equal(root.state("displayMonth"), 2);
            assert.equal(root.state("displayYear"), 2015);

            months.simulate("change", { target: { value: 0 } });
            years.simulate("change", { target: { value: 2014 } });
            assert.equal(root.state("displayMonth"), 0);
            assert.equal(root.state("displayYear"), 2014);
        });
    });

    describe("when uncontrolled", () => {
        it("defaultValue initially selects a day", () => {
            const today = new Date();
            const selectedDays = wrap(<DatePicker defaultValue={today} />).getSelectedDays();
            assert.lengthOf(selectedDays, 1);
            assert.equal(selectedDays.at(0).text(), today.getDate());
        });

        it("onChange fired when a day is clicked", () => {
            const onChange = sinon.spy();
            const { getDay } = wrap(<DatePicker onChange={onChange} />);
            assert.isTrue(onChange.notCalled);
            getDay().simulate("click");
            assert.isTrue(onChange.calledOnce);
        });

        it("selected day updates are automatic", () => {
            const { getDay, getSelectedDays } = wrap(<DatePicker  />);
            assert.lengthOf(getSelectedDays(), 0);
            getDay(3).simulate("click");
            assert.deepEqual(getSelectedDays().map((d) => d.text()), ["3"]);
        });

        it("selected day is preserved when selections are changed", () => {
            const initialMonth = new Date(2015, 6, 1);
            const { getDay, getSelectedDays, months } = wrap(<DatePicker initialMonth={initialMonth} />);
            getDay(31).simulate("click");
            months.simulate("change", { target: { value: 7 } });
            assert.deepEqual(getSelectedDays().map((d) => d.text()), ["31"]);
        });

        it("selected day is changed if necessary when selections are changed", () => {
            const initialMonth = new Date(2015, 6, 1);
            const { getDay, getSelectedDays, root } = wrap(<DatePicker initialMonth={initialMonth} />);
            getDay(31).simulate("click");
            root.find(".DayPicker-NavButton--prev").simulate("click");
            assert.deepEqual(getSelectedDays().map((d) => d.text()), ["30"]);
        });

        it("selected day is changed to minDate or maxDate if selections are changed outside bounds", () => {
            const initialMonth = new Date(2015, 6, 1);
            const minDate = new Date(2015, 2, 13);
            const maxDate = new Date(2015, 10, 21);
            const { getDay, getSelectedDays, months } = wrap(
                <DatePicker initialMonth={initialMonth} minDate={minDate} maxDate={maxDate } />
            );

            getDay(1).simulate("click");
            months.simulate("change", { target: { value: 2 } });
            let selectedDayElements = getSelectedDays();
            assert.lengthOf(selectedDayElements, 1);
            assert.equal(selectedDayElements.at(0).text(), minDate.getDate());

            getDay(25).simulate("click");
            months.simulate("change", { target: { value: 10 } });
            selectedDayElements = getSelectedDays();
            assert.lengthOf(selectedDayElements, 1);
            assert.equal(selectedDayElements.at(0).text(), maxDate.getDate());
        });

        it("can change displayed date with the dropdowns in the caption", () => {
            const { months, root, years } = wrap(<DatePicker initialMonth={new Date(2015, 2, 2)} />);
            assert.equal(root.state("displayMonth"), 2);
            assert.equal(root.state("displayYear"), 2015);

            months.simulate("change", { target: { value: 0 } });
            years.simulate("change", { target: { value: 2014 } });
            assert.equal(root.state("displayMonth"), 0);
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
        root.find({ className: Classes.DATEPICKER_FOOTER }).find(Button).first().simulate("click");

        const today = new Date();
        const value = root.state("value");
        assert.equal(value.getDate(), today.getDate());
        assert.equal(value.getMonth(), today.getMonth());
        assert.equal(value.getFullYear(), today.getFullYear());
    });

    it("clears the value when Clear is clicked", () => {
        const { getDay, root } = wrap(<DatePicker showActionsBar={true} />);
        getDay().simulate("click");
        root.find({ className: Classes.DATEPICKER_FOOTER }).find(Button).last().simulate("click");
        assert.isNull(root.state("value"));
    });

    function wrap(datepicker: JSX.Element) {
        const wrapper = mount(datepicker);
        return {
            getDay: (dayNumber = 1) => {
                return wrapper
                    .find(`.${Classes.DATEPICKER_DAY}`)
                    .filterWhere((day) => day.text() === "" + dayNumber &&
                        !day.hasClass(Classes.DATEPICKER_DAY_OUTSIDE));
            },
            getSelectedDays: () => wrapper.find(`.${Classes.DATEPICKER_DAY_SELECTED}`),
            months: wrapper.find(`.${Classes.DATEPICKER_MONTH_SELECT}`),
            root: wrapper,
            years: wrapper.find(`.${Classes.DATEPICKER_YEAR_SELECT}`),
        };
    }
});
