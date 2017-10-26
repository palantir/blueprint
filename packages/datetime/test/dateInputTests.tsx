/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { assert } from "chai";
import { mount } from "enzyme";
import * as React from "react";

import { InputGroup, Keys, Popover, Position } from "@blueprintjs/core";
import { Months } from "../src/common/months";
import { Classes, DateInput, TimePicker, TimePickerPrecision } from "../src/index";
import * as DateTestUtils from "./common/dateTestUtils";

describe("<DateInput>", () => {
    it("handles null inputs without crashing", () => {
        assert.doesNotThrow(() => mount(<DateInput value={null} />));
    });

    it("handles string inputs without crashing", () => {
        // strings are not permitted in the interface, but are handled correctly by moment.
        assert.doesNotThrow(() => mount(<DateInput value={"1988-08-07 11:01:12" as any} />));
    });

    it("Popover opens on input focus", () => {
        const wrapper = mount(<DateInput openOnFocus={true} />);
        wrapper.find("input").simulate("focus");
        assert.isTrue(wrapper.find(Popover).prop("isOpen"));
    });

    it("Popover does not open on input focus if openOnFocus=false", () => {
        const wrapper = mount(<DateInput openOnFocus={false} />);
        wrapper.find("input").simulate("focus");
        assert.isFalse(wrapper.find(Popover).prop("isOpen"));
    });

    it("Popover doesn't open if disabled=true", () => {
        const wrapper = mount(<DateInput disabled={true} />);
        wrapper.find("input").simulate("focus");
        assert.isFalse(wrapper.find(Popover).prop("isOpen"));
    });

    it("setting timePrecision renders a TimePicker", () => {
        const wrapper = mount(<DateInput timePrecision={TimePickerPrecision.SECOND} />).setState({ isOpen: true });
        // assert TimePicker appears
        const timePicker = wrapper.find(TimePicker);
        assert.isTrue(timePicker.exists());
        assert.strictEqual(timePicker.prop("precision"), TimePickerPrecision.SECOND);
        // assert TimePicker disappears in absence of prop
        wrapper.setProps({ timePrecision: undefined });
        assert.isFalse(wrapper.find(TimePicker).exists());
    });

    it("with TimePicker passes props correctly to DateTimePicker", () => {
        // verifies fixed https://github.com/palantir/blueprint/issues/980
        assert.doesNotThrow(() => {
            // max date and value are both well after default max date (end of this year).
            // if props are not passed correctly then validation will fail as value > default max date.
            mount(
                <DateInput
                    maxDate={new Date(2050, 5, 4)}
                    timePrecision={TimePickerPrecision.SECOND}
                    value={new Date(2030, 4, 5)}
                />,
            ).setState({ isOpen: true });
            // must open the popover so DateTimePicker is rendered
        });
    });

    it("inputProps are passed to InputGroup", () => {
        const inputRef = sinon.spy();
        const onFocus = sinon.spy();
        const wrapper = mount(
            <DateInput
                disabled={false}
                inputProps={{ disabled: true, inputRef, leftIconName: "star", onFocus, required: true, value: "fail" }}
            />,
        );
        wrapper.find("input").simulate("focus");

        const input = wrapper.find(InputGroup);
        assert.isFalse(input.prop("disabled"), "disabled comes from DateInput props");
        assert.notStrictEqual(input.prop("value"), "fail", "value cannot be changed");
        assert.strictEqual(input.prop("leftIconName"), "star");
        assert.isTrue(input.prop("required"));
        assert.isTrue(inputRef.calledOnce, "inputRef not invoked");
        assert.isTrue(onFocus.calledOnce, "onFocus not invoked");
    });

    it("popoverProps are passed to Popover", () => {
        const popoverWillOpen = sinon.spy();
        const wrapper = mount(
            <DateInput
                popoverProps={{
                    autoFocus: true,
                    content: "fail",
                    inline: true,
                    popoverWillOpen,
                    position: Position.TOP,
                }}
            />,
        );
        wrapper.find("input").simulate("focus");

        const popover = wrapper.find(Popover);
        assert.strictEqual(popover.prop("autoFocus"), false, "autoFocus cannot be changed");
        assert.notStrictEqual(popover.prop("content"), "fail", "content cannot be changed");
        assert.strictEqual(popover.prop("inline"), true);
        assert.strictEqual(popover.prop("position"), Position.TOP);
        assert.isTrue(popoverWillOpen.calledOnce);
    });

    describe("when uncontrolled", () => {
        it("Clicking a date puts it in the input box and closes the popover", () => {
            const wrapper = mount(<DateInput />).setState({ isOpen: true });
            assert.equal(wrapper.find(InputGroup).prop("value"), "");
            wrapper
                .find(`.${Classes.DATEPICKER_DAY}`)
                .first()
                .simulate("click");
            assert.isFalse(wrapper.state("isOpen"));
            assert.notEqual(wrapper.find(InputGroup).prop("value"), "");
        });

        it("Clicking a date in the same month closes the popover when there is already a default value", () => {
            const DAY = 15;
            const PREV_DAY = DAY - 1;
            const defaultValue = new Date(2017, Months.JANUARY, DAY, 15, 0, 0, 0); // include an arbitrary non-zero hour
            const wrapper = mount(<DateInput defaultValue={defaultValue} />).setState({ isOpen: true });
            wrapper
                .find(`.${Classes.DATEPICKER_DAY}`)
                .at(PREV_DAY - 1)
                .simulate("click");
            assert.isFalse(wrapper.state("isOpen"));
        });

        it("Clearing the date in the DatePicker clears the input, and invokes onChange with null", () => {
            const onChange = sinon.spy();
            const { root, getDay } = wrap(
                <DateInput defaultValue={new Date(2016, Months.JULY, 22)} onChange={onChange} />,
            );
            root.setState({ isOpen: true });
            getDay(22).simulate("click");
            assert.equal(root.find(InputGroup).prop("value"), "");
            assert.isTrue(onChange.calledWith(null));
        });

        it("Clearing the date in the input clears the selection and invokes onChange with null", () => {
            const onChange = sinon.spy();
            const { root, getSelectedDays } = wrap(
                <DateInput defaultValue={new Date(2016, Months.JULY, 22)} onChange={onChange} />,
            );
            root.find("input").simulate("change", { target: { value: "" } });

            assert.lengthOf(getSelectedDays(), 0);
            assert.isTrue(onChange.calledWith(null));
        });

        it("Popover stays open on date click if closeOnSelection=false", () => {
            const wrapper = mount(<DateInput closeOnSelection={false} />).setState({ isOpen: true });
            wrapper
                .find(`.${Classes.DATEPICKER_DAY}`)
                .first()
                .simulate("click");
            assert.isTrue(wrapper.state("isOpen"));
        });

        it("Popover doesn't close when month changes", () => {
            const defaultValue = new Date(2017, Months.JANUARY, 1);
            const wrapper = mount(<DateInput defaultValue={defaultValue} />);
            wrapper.setState({ isOpen: true });
            wrapper.find(".pt-datepicker-month-select").simulate("change", { value: Months.FEBRUARY.toString() });
            assert.isTrue(wrapper.find(Popover).prop("isOpen"));
        });

        it("Popover doesn't close when time changes", () => {
            const defaultValue = new Date(2017, Months.JANUARY, 1, 0, 0, 0, 0);
            const wrapper = mount(
                <DateInput defaultValue={defaultValue} timePrecision={TimePickerPrecision.MILLISECOND} />,
            );
            wrapper.setState({ isOpen: true });

            // try typing a new time
            wrapper.find(".pt-timepicker-millisecond").simulate("change", { target: { value: "1" } });
            assert.isTrue(wrapper.find(Popover).prop("isOpen"));

            // try keyboard-incrementing to a new time
            wrapper.find(".pt-timepicker-millisecond").simulate("keydown", { which: Keys.ARROW_UP });
            assert.isTrue(wrapper.find(Popover).prop("isOpen"));
        });

        it("Clicking a date in a different month sets input value but keeps popover open", () => {
            const date = new Date(2016, Months.APRIL, 3);
            const wrapper = mount(<DateInput defaultValue={date} />).setState({ isOpen: true });
            assert.equal(wrapper.find(InputGroup).prop("value"), "2016-04-03");

            wrapper
                .find(`.${Classes.DATEPICKER_DAY}`)
                .filterWhere(day => day.text() === "27")
                .first()
                .simulate("click");

            assert.isTrue(wrapper.state("isOpen"));
            assert.equal(wrapper.find(InputGroup).prop("value"), "2016-03-27");
        });

        it("Typing in a valid date invokes onChange and inputProps.onChange", () => {
            const date = "2015-02-10";
            const onChange = sinon.spy();
            const onInputChange = sinon.spy();
            const wrapper = mount(<DateInput inputProps={{ onChange: onInputChange }} onChange={onChange} />);
            wrapper.find("input").simulate("change", { target: { value: date } });

            assert.isTrue(onChange.calledOnce);
            assertDateEquals(onChange.args[0][0], date);
            assert.isTrue(onInputChange.calledOnce);
            assert.strictEqual(onInputChange.args[0][0].type, "change", "inputProps.onChange expects change event");
        });

        it("Typing in a date out of range displays the error message and calls onError with invalid date", () => {
            const rangeMessage = "RANGE ERROR";
            const onError = sinon.spy();
            const wrapper = mount(
                <DateInput
                    defaultValue={new Date(2015, Months.MAY, 1)}
                    minDate={new Date(2015, Months.MARCH, 1)}
                    onError={onError}
                    outOfRangeMessage={rangeMessage}
                />,
            );
            wrapper
                .find("input")
                .simulate("change", { target: { value: "2015-02-01" } })
                .simulate("blur");

            assert.strictEqual(wrapper.find(InputGroup).prop("className"), "pt-intent-danger");
            assert.strictEqual(wrapper.find(InputGroup).prop("value"), rangeMessage);

            assert.isTrue(onError.calledOnce);
            assertDateEquals(onError.args[0][0], "2015-02-01");
        });

        it("Typing in an invalid date displays the error message and calls onError with Date(undefined)", () => {
            const invalidDateMessage = "INVALID DATE";
            const onError = sinon.spy();
            const wrapper = mount(
                <DateInput
                    defaultValue={new Date(2015, Months.MAY, 1)}
                    onError={onError}
                    invalidDateMessage={invalidDateMessage}
                />,
            );
            wrapper
                .find("input")
                .simulate("change", { target: { value: "not a date" } })
                .simulate("blur");

            assert.strictEqual(wrapper.find(InputGroup).prop("className"), "pt-intent-danger");
            assert.strictEqual(wrapper.find(InputGroup).prop("value"), invalidDateMessage);

            assert.isTrue(onError.calledOnce);
            assert.isNaN((onError.args[0][0] as Date).valueOf());
        });
    });

    describe("when controlled", () => {
        const DATE = new Date(2016, Months.APRIL, 4);
        const DATE_STR = "2016-04-04";
        const DATE2 = new Date(2015, Months.FEBRUARY, 1);
        const DATE2_STR = "2015-02-01";
        const DATE2_DE_STR = "01.02.2015";

        it("Clicking a date invokes onChange callback with that date", () => {
            const onChange = sinon.spy();
            const { getDay, root } = wrap(<DateInput onChange={onChange} value={DATE} />);
            root.setState({ isOpen: true });
            getDay(27).simulate("click");

            assert.isTrue(onChange.calledOnce);
            assertDateEquals(onChange.args[0][0], "2016-04-27");
        });

        it("Clearing the date in the DatePicker invokes onChange with null but doesn't change UI", () => {
            const onChange = sinon.spy();
            const { root, getDay } = wrap(<DateInput value={DATE} onChange={onChange} />);
            root.setState({ isOpen: true });
            getDay(4).simulate("click");
            assert.equal(root.find(InputGroup).prop("value"), "2016-04-04");
            assert.isTrue(onChange.calledWith(null));
        });

        it("Updating value updates the text box", () => {
            const wrapper = mount(<DateInput value={DATE} />);
            assert.strictEqual(wrapper.find(InputGroup).prop("value"), DATE_STR);
            wrapper.setProps({ value: DATE2 });
            assert.strictEqual(wrapper.find(InputGroup).prop("value"), DATE2_STR);
        });

        it("Typing in a date invokes onChange and inputProps.onChange", () => {
            const onChange = sinon.spy();
            const onInputChange = sinon.spy();
            const wrapper = mount(
                <DateInput inputProps={{ onChange: onInputChange }} onChange={onChange} value={DATE} />,
            );
            wrapper.find("input").simulate("change", { target: { value: DATE2 } });
            assert.isTrue(onChange.calledOnce);
            assertDateEquals(onChange.args[0][0], DATE2_STR);
            assert.isTrue(onInputChange.calledOnce);
            assert.strictEqual(onInputChange.args[0][0].type, "change", "inputProps.onChange expects change event");
        });

        it("Clearing the date in the input invokes onChange with null", () => {
            const onChange = sinon.spy();
            const { root } = wrap(<DateInput value={new Date(2016, Months.JULY, 22)} onChange={onChange} />);
            root.find("input").simulate("change", { target: { value: "" } });
            assert.isTrue(onChange.calledWith(null));
        });

        it("Formats locale-specific format strings properly", () => {
            const wrapper = mount(<DateInput locale="de" format="L" value={DATE2} />);
            assert.strictEqual(wrapper.find(InputGroup).prop("value"), DATE2_DE_STR);
        });
    });

    /* Assert Date equals YYYY-MM-DD string. */
    function assertDateEquals(actual: Date, expected: string) {
        const actualString = DateTestUtils.toHyphenatedDateString(actual);
        assert.strictEqual(actualString, expected);
    }

    function wrap(dateInput: JSX.Element) {
        const wrapper = mount(dateInput);
        return {
            getDay: (dayNumber = 1) => {
                return wrapper
                    .find(`.${Classes.DATEPICKER_DAY}`)
                    .filterWhere(day => day.text() === "" + dayNumber && !day.hasClass(Classes.DATEPICKER_DAY_OUTSIDE));
            },
            getSelectedDays: () => wrapper.find(`.${Classes.DATEPICKER_DAY_SELECTED}`),
            root: wrapper,
        };
    }
});
