/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { assert } from "chai";
import { mount } from "enzyme";
import * as React from "react";

import { InputGroup, Popover } from "@blueprintjs/core";
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
        const wrapper = mount(<DateInput timePrecision={TimePickerPrecision.SECOND} />);
        wrapper.find("input").simulate("focus");

        const timePicker = wrapper.find(TimePicker);
        assert.isFalse(timePicker.isEmpty());
        assert.strictEqual(timePicker.prop("precision"), TimePickerPrecision.SECOND);
    });

    describe("when uncontrolled", () => {
        it("Clicking a date puts it in the input box and closes the popover", () => {
            const wrapper = mount(<DateInput />).setState({ isOpen: true });
            assert.equal(wrapper.find(InputGroup).prop("value"), "");
            wrapper.find(`.${Classes.DATEPICKER_DAY}`).first().simulate("click");
            assert.isFalse(wrapper.state("isOpen"));
            assert.notEqual(wrapper.find(InputGroup).prop("value"), "");
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
            root.find("input").simulate("change", { target: { value: "" }});

            assert.lengthOf(getSelectedDays(), 0);
            assert.isTrue(onChange.calledWith(null));
        });

        it("The popover stays open on date click if closeOnSelection=false", () => {
            const wrapper = mount(<DateInput closeOnSelection={false} />).setState({ isOpen: true });
            wrapper.find(`.${Classes.DATEPICKER_DAY}`).first().simulate("click");
            assert.isTrue(wrapper.state("isOpen"));
        });

        it("Clicking a date in a different month sets input value but keeps popover open", () => {
            const date = new Date(2016, Months.APRIL, 3);
            const wrapper = mount(<DateInput defaultValue={date} />).setState({ isOpen: true });
            assert.equal(wrapper.find(InputGroup).prop("value"), "2016-04-03");

            wrapper.find(`.${Classes.DATEPICKER_DAY}`)
                .filterWhere((day) => day.text() === "27").first()
                .simulate("click");

            assert.isTrue(wrapper.state("isOpen"));
            assert.equal(wrapper.find(InputGroup).prop("value"), "2016-03-27");
        });

        it("Typing in a valid date runs the onChange callback", () => {
            const date = "2015-02-10";
            const onChange = sinon.spy();
            const wrapper = mount(<DateInput onChange={onChange} />);
            wrapper.find("input")
                .simulate("change", { target: { value: date }});

            assert.isTrue(onChange.calledOnce);
            assertDateEquals(onChange.args[0][0], date);
        });

        it("Typing in a date out of range displays the error message and calls onError with invalid date", () => {
            const rangeMessage = "RANGE ERROR";
            const onError = sinon.spy();
            const wrapper = mount(<DateInput
                defaultValue={new Date(2015, Months.MAY, 1)}
                minDate={new Date(2015, Months.MARCH, 1)}
                onError={onError}
                outOfRangeMessage={rangeMessage}
            />);
            wrapper.find("input")
                .simulate("change", { target: { value: "2015-02-01" }})
                .simulate("blur");

            assert.strictEqual(wrapper.find(InputGroup).prop("className"), "pt-intent-danger");
            assert.strictEqual(wrapper.find(InputGroup).prop("value"), rangeMessage);

            assert.isTrue(onError.calledOnce);
            assertDateEquals(onError.args[0][0], "2015-02-01");
        });

        it("Typing in an invalid date displays the error message and calls onError with Date(undefined)", () => {
            const invalidDateMessage = "INVALID DATE";
            const onError = sinon.spy();
            const wrapper = mount(<DateInput
                defaultValue={new Date(2015, Months.MAY, 1)}
                onError={onError}
                invalidDateMessage={invalidDateMessage}
            />);
            wrapper.find("input")
                .simulate("change", { target: { value: "not a date" }})
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
            const { root, getDay } = wrap(
                <DateInput value={DATE} onChange={onChange} />,
            );
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

        it("Typing in a date runs the onChange callback", () => {
            const onChange = sinon.spy();
            const wrapper = mount(<DateInput onChange={onChange} value={DATE} />);
            wrapper.find("input").simulate("change", { target: { value: DATE2 }});
            assert.isTrue(onChange.calledOnce);
            assertDateEquals(onChange.args[0][0], DATE2_STR);
        });

        it("Clearing the date in the input invokes onChange with null", () => {
            const onChange = sinon.spy();
            const { root } = wrap(
                <DateInput value={new Date(2016, Months.JULY, 22)} onChange={onChange} />,
            );
            root.find("input").simulate("change", { target: { value: "" }});
            assert.isTrue(onChange.calledWith(null));
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
                    .filterWhere((day) => day.text() === "" + dayNumber &&
                        !day.hasClass(Classes.DATEPICKER_DAY_OUTSIDE));
            },
            getSelectedDays: () => wrapper.find(`.${Classes.DATEPICKER_DAY_SELECTED}`),
            root: wrapper,
        };
    }
});
