/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import { assert } from "chai";
import { mount } from "enzyme";
import * as React from "react";

import { Button, InputGroup, Popover } from "@blueprintjs/core";
import { padWithZeroes } from "../src/common/utils";
import { Classes, DateInput } from "../src/index";

describe("<DateInput>", () => {
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

    it("Popover opens on icon click", () => {
        const wrapper = mount(<DateInput />);
        wrapper.find(Button).simulate("click");
        assert.isTrue(wrapper.find(Popover).prop("isOpen"));
    });

    it("Popover closes on icon click if open", () => {
        const wrapper = mount(<DateInput />);
        wrapper.setState({ isOpen: true });
        wrapper.find(Button).simulate("click");
        assert.isFalse(wrapper.find(Popover).prop("isOpen"));
    });

    it("Popover doesn't open if disabled=true", () => {
        const wrapper = mount(<DateInput disabled />);
        wrapper.find(InputGroup).simulate("focus");
        wrapper.find(Button).simulate("click");
        assert.isFalse(wrapper.find(Popover).prop("isOpen"));
    });

    describe("when uncontrolled", () => {
        it("Clicking a date puts it in the input box and closes the popover", () => {
            const wrapper = mount(<DateInput />).setState({ isOpen: true });
            assert.equal(wrapper.find(InputGroup).prop("value"), "");
            wrapper.find(`.${Classes.DATEPICKER_DAY}`).first().simulate("click");
            assert.isFalse(wrapper.state("isOpen"));
            assert.notEqual(wrapper.find(InputGroup).prop("value"), "");
        });

        it("The popover stays open on date click if closeOnSelection=false", () => {
            const wrapper = mount(<DateInput closeOnSelection={false} />).setState({ isOpen: true });
            wrapper.find(`.${Classes.DATEPICKER_DAY}`).first().simulate("click");
            assert.isTrue(wrapper.state("isOpen"));
        });

        it("Clicking a date in a different month sets input value but keeps popover open", () => {
            const date = new Date(2016, 3, 3);
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
                defaultValue={new Date(2015, 4, 1)}
                minDate={new Date(2015, 2, 1)}
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
                defaultValue={new Date(2015, 4, 1)}
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
        const DATE = new Date(2016, 3, 4);
        const DATE_STR = "2016-04-04";
        const DATE2 = new Date(2015, 1, 1);
        const DATE2_STR = "2015-02-01";

        it("Clicking a date invokes onChange callback with that date", () => {
            const onChange = sinon.spy();
            mount(<DateInput onChange={onChange} value={DATE} />)
                .setState({ isOpen: true })
                .find(`.${Classes.DATEPICKER_DAY}`).first()
                    .simulate("click");

            assert.isTrue(onChange.calledOnce);
            assertDateEquals(onChange.args[0][0], "2016-03-27");
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
    });

    /* Assert Date equals YYYY-MM-DD string. */
    function assertDateEquals(actual: Date, expected: string) {
        const actualString = [
            actual.getFullYear(),
            padWithZeroes((actual.getMonth() + 1) + "", 2),
            padWithZeroes(actual.getDate() + "", 2),
        ].join("-");
        assert.strictEqual(actualString, expected);
    }
});
