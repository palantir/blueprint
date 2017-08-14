/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { assert } from "chai";
import { mount } from "enzyme";
import * as React from "react";

import { DateTimePicker } from "../src/dateTimePicker";
import { Classes, DatePicker, TimePicker } from "../src/index";

describe("<DateTimePicker>", () => {
    it("renders a DatePicker and a TimePicker", () => {
        const { root } = wrap(<DateTimePicker />);
        assert.lengthOf(root.find(DatePicker), 1);
        assert.lengthOf(root.find(TimePicker), 1);
    });

    it("value initially selects a date/time", () => {
        const defaultValue = new Date(2010, 1, 2, 5, 2, 10);
        const value = new Date(2010, 0, 1, 11, 2, 30);
        const { root } = wrap(<DateTimePicker defaultValue={defaultValue} value={value} />);
        assert.strictEqual(root.state("dateValue"), value);
        assert.strictEqual(root.state("timeValue"), value);
    });

    it("defaultValue initially selects a date/time", () => {
        const defaultValue = new Date(2012, 2, 5, 6, 5, 40);
        const { root } = wrap(<DateTimePicker defaultValue={defaultValue} />);
        assert.strictEqual(root.state("dateValue"), defaultValue);
        assert.strictEqual(root.state("timeValue"), defaultValue);
    });

    it("onChange fired when a day is clicked", () => {
        const defaultValue = new Date(2012, 2, 5, 6, 5, 40);
        const onChangeSpy = sinon.spy();
        const { getDay } = wrap(<DateTimePicker defaultValue={defaultValue} onChange={onChangeSpy} />);
        assert.isTrue(onChangeSpy.notCalled);
        getDay().simulate("click");
        assert.isTrue(onChangeSpy.calledOnce);
        assert.deepEqual(onChangeSpy.firstCall.args[0], new Date(2012, 2, 1, 6, 5, 40));
    });

    it("onChange fired when the time is changed", () => {
        const defaultValue = new Date(2012, 2, 5, 6, 5, 40);
        const onChangeSpy = sinon.spy();
        const { root } = wrap(
            <DateTimePicker
                defaultValue={defaultValue}
                onChange={onChangeSpy}
                timePickerProps={{ showArrowButtons: true }}
            />,
        );
        assert.isTrue(onChangeSpy.notCalled);
        root.find(`.${Classes.TIMEPICKER_ARROW_BUTTON}.${Classes.TIMEPICKER_HOUR}`).first().simulate("click");
        assert.isTrue(onChangeSpy.calledOnce);
        assert.deepEqual(onChangeSpy.firstCall.args[0], new Date(2012, 2, 5, 7, 5, 40));
    });

    it("clearing a date and selecting another does not change the time", () => {
        const defaultValue = new Date(2012, 2, 5, 6, 5, 40);
        const { getDay, root } = wrap(<DateTimePicker defaultValue={defaultValue} />);
        getDay(5).simulate("click");
        getDay(15).simulate("click");
        assert.equal(root.state("timeValue").getHours(), defaultValue.getHours());
        assert.equal(root.state("timeValue").getMinutes(), defaultValue.getMinutes());
        assert.equal(root.state("timeValue").getSeconds(), defaultValue.getSeconds());
        assert.equal(root.state("timeValue").getMilliseconds(), defaultValue.getMilliseconds());
    });

    it("changing the time before selecting a date works as expected", () => {
        const defaultValue = new Date(2012, 2, 5, 6, 5, 40);
        const { getDay, root } = wrap(
            <DateTimePicker
                defaultValue={defaultValue}
                timePickerProps={{ showArrowButtons: true }}
            />,
        );
        getDay(5).simulate("click");
        root.find(`.${Classes.TIMEPICKER_ARROW_BUTTON}.${Classes.TIMEPICKER_HOUR}`).first().simulate("click");
        getDay(15).simulate("click");
        assert.equal(root.state("timeValue").getHours(), defaultValue.getHours() + 1);
        assert.equal(root.state("timeValue").getMinutes(), defaultValue.getMinutes());
        assert.equal(root.state("timeValue").getSeconds(), defaultValue.getSeconds());
        assert.equal(root.state("timeValue").getMilliseconds(), defaultValue.getMilliseconds());
    });

    describe("when controlled", () => {
        runValuNotDefinedTest(undefined);
        runValuNotDefinedTest(null);

        function runValuNotDefinedTest(value: null | undefined) {
            it(`passing value={${value}} clears the selected date in the calendar`, () => {
                const defaultValue = new Date(2012, 2, 5, 6, 5, 40);
                const { root, getSelectedDay } = wrap(<DateTimePicker value={defaultValue} />);
                assert.isTrue(getSelectedDay().exists());
                root.setProps({ value });
                assert.isFalse(getSelectedDay().exists());
            });
        }
    });

    function wrap(dtp: JSX.Element) {
        const root = mount(dtp);
        return {
            getDay: (dayNumber = 1) => {
                return root
                    .find(`.${Classes.DATEPICKER_DAY}`)
                    .filterWhere((day) => day.text() === "" + dayNumber &&
                        !day.hasClass(Classes.DATEPICKER_DAY_OUTSIDE));
            },
            getSelectedDay: () => root.find(`.${Classes.DATEPICKER_DAY_SELECTED}`),
            root,
        };
    }
});
