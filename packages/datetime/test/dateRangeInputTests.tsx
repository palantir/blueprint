/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { expect } from "chai";
import { mount, ReactWrapper } from "enzyme";
import * as React from "react";

import { InputGroup } from "@blueprintjs/core";
import { Months } from "../src/common/months";
import { Classes as DateClasses, DateRange, DateRangeInput } from "../src/index";
import * as DateTestUtils from "./common/dateTestUtils";

type WrappedComponentRoot = ReactWrapper<any, {}>;
type WrappedComponentInput = ReactWrapper<React.HTMLAttributes<{}>, any>;

describe("<DateRangeInput>", () => {

    const START_DAY = 22;
    const START_DATE = new Date(2017, Months.JANUARY, START_DAY);
    const START_STR = DateTestUtils.toHyphenatedDateString(START_DATE);
    const END_DAY = 24;
    const END_DATE = new Date(2017, Months.JANUARY, END_DAY);
    const END_STR = DateTestUtils.toHyphenatedDateString(END_DATE);
    const DATE_RANGE = [START_DATE, END_DATE] as DateRange;

    const START_DATE_2 = new Date(2017, Months.JANUARY, 1);
    const START_STR_2 = DateTestUtils.toHyphenatedDateString(START_DATE_2);
    const END_DATE_2 = new Date(2017, Months.JANUARY, 31);
    const END_STR_2 = DateTestUtils.toHyphenatedDateString(END_DATE_2);
    const DATE_RANGE_2 = [START_DATE_2, END_DATE_2] as DateRange;

    it("renders with two InputGroup children", () => {
        const component = mount(<DateRangeInput />);
        expect(component.find(InputGroup).length).to.equal(2);
    });

    it("startInputProps.inputRef receives reference to HTML input element", () => {
        const inputRef = sinon.spy();
        // full DOM rendering here so the ref handler is invoked
        mount(<DateRangeInput startInputProps={{ inputRef }} />);
        expect(inputRef.calledOnce).to.be.true;
        expect(inputRef.firstCall.args[0]).to.be.an.instanceOf(HTMLInputElement);
    });

    it("endInputProps.inputRef receives reference to HTML input element", () => {
        const inputRef = sinon.spy();
        // full DOM rendering here so the ref handler is invoked
        mount(<DateRangeInput endInputProps={{ inputRef }} />);
        expect(inputRef.calledOnce).to.be.true;
        expect(inputRef.firstCall.args[0]).to.be.an.instanceOf(HTMLInputElement);
    });

    it("shows empty fields when no date range is selected", () => {
        const { root } = wrap(<DateRangeInput />);
        assertInputTextsEqual(root, "", "");
    });

    describe("when uncontrolled", () => {
        it("Shows empty fields when defaultValue is [null, null]", () => {
            const { root } = wrap(<DateRangeInput defaultValue={[null, null]} />);
            assertInputTextsEqual(root, "", "");
        });

        it("Shows empty start field and formatted date in end field when defaultValue is [null, <date>]", () => {
            const { root } = wrap(<DateRangeInput defaultValue={[null, END_DATE]} />);
            assertInputTextsEqual(root, "", END_STR);
        });

        it("Shows empty end field and formatted date in start field when defaultValue is [<date>, null]", () => {
            const { root } = wrap(<DateRangeInput defaultValue={[START_DATE, null]} />);
            assertInputTextsEqual(root, START_STR, "");
        });

        it("Shows formatted dates in both fields when defaultValue is [<date1>, <date2>]", () => {
            const { root } = wrap(<DateRangeInput defaultValue={[START_DATE, END_DATE]} />);
            assertInputTextsEqual(root, START_STR, END_STR);
        });

        it("Clicking a date invokes onChange with the new date range and updates the input fields", () => {
            const defaultValue = [START_DATE, null] as DateRange;

            const onChange = sinon.spy();
            const { root, getDayElement } = wrap(<DateRangeInput defaultValue={defaultValue} onChange={onChange} />);
            root.setState({ isOpen: true });

            getDayElement(END_DAY).simulate("click");
            assertDateRangesEqual(onChange.getCall(0).args[0], [START_STR, END_STR]);
            assertInputTextsEqual(root, START_STR, END_STR);

            getDayElement(START_DAY).simulate("click");
            assertDateRangesEqual(onChange.getCall(1).args[0], [null, END_STR]);
            assertInputTextsEqual(root, "", END_STR);

            getDayElement(END_DAY).simulate("click");
            assertDateRangesEqual(onChange.getCall(2).args[0], [null, null]);
            assertInputTextsEqual(root, "", "");

            getDayElement(START_DAY).simulate("click");
            assertDateRangesEqual(onChange.getCall(3).args[0], [START_STR, null]);
            assertInputTextsEqual(root, START_STR, "");

            expect(onChange.callCount).to.equal(4);
        });

        it(`Typing a valid start or end date invokes onChange with the new date range and updates the
            input fields`, () => {
            const onChange = sinon.spy();
            const { root } = wrap(<DateRangeInput onChange={onChange} defaultValue={DATE_RANGE} />);

            changeStartInputText(root, START_STR_2);
            expect(onChange.callCount).to.equal(1);
            assertDateRangesEqual(onChange.getCall(0).args[0], [START_STR_2, END_STR]);
            assertInputTextsEqual(root, START_STR_2, END_STR);

            changeEndInputText(root, END_STR_2);
            expect(onChange.callCount).to.equal(2);
            assertDateRangesEqual(onChange.getCall(1).args[0], [START_STR_2, END_STR_2]);
            assertInputTextsEqual(root, START_STR_2, END_STR_2);
        });

        it.skip("Typing a date out of range displays the error message and calls onError with invalid date", () => {
            expect(true).to.be.false;
        });

        it.skip("Typing an invalid date displays the error message and calls onError with Date(undefined)", () => {
            expect(true).to.be.false;
        });

        it("Clearing the date range in the picker invokes onChange with [null, null] and clears the inputs", () => {
            const onChange = sinon.spy();
            const defaultValue = [START_DATE, null] as DateRange;

            const { root, getDayElement } = wrap(<DateRangeInput defaultValue={defaultValue} onChange={onChange} />);
            root.setState({ isOpen: true });

            getDayElement(START_DAY).simulate("click");
            assertInputTextsEqual(root, "", "");
            expect(onChange.called).to.be.true;
            expect(onChange.calledWith([null, null])).to.be.true;
        });

        it(`Clearing the date range in the inputs invokes onChange with [null, null] and leaves the
            inputs empty`, () => {
            const onChange = sinon.spy();
            const { root } = wrap(<DateRangeInput onChange={onChange} defaultValue={[START_DATE, null]} />);

            changeStartInputText(root, "");
            expect(onChange.called).to.be.true;
            assertDateRangesEqual(onChange.getCall(0).args[0], [null, null]);
            assertInputTextsEqual(root, "", "");
        });
    });

    describe("when controlled", () => {
        it("Setting value causes defaultValue to be ignored", () => {
            const { root } = wrap(<DateRangeInput
                defaultValue={DATE_RANGE_2}
                value={DATE_RANGE}
            />);
            assertInputTextsEqual(root, START_STR, END_STR);
        });

        it("Setting value to [null, null] shows empty fields", () => {
            const { root } = wrap(<DateRangeInput value={[null, null]} />);
            assertInputTextsEqual(root, "", "");
        });

        it("Shows empty start field and formatted date in end field when value is [null, <date>]", () => {
            const { root } = wrap(<DateRangeInput value={[null, END_DATE]} />);
            assertInputTextsEqual(root, "", END_STR);
        });

        it("Shows empty end field and formatted date in start field when value is [<date>, null]", () => {
            const { root } = wrap(<DateRangeInput value={[START_DATE, null]} />);
            assertInputTextsEqual(root, START_STR, "");
        });

        it("Shows formatted dates in both fields when value is [<date1>, <date2>]", () => {
            const { root } = wrap(<DateRangeInput value={[START_DATE, END_DATE]} />);
            assertInputTextsEqual(root, START_STR, END_STR);
        });

        it("Updating value changes the text accordingly in both fields", () => {
            const { root } = wrap(<DateRangeInput value={DATE_RANGE} />);
            root.setState({ isOpen: true });
            root.setProps({ value: DATE_RANGE_2 });
            assertInputTextsEqual(root, START_STR_2, END_STR_2);
        });

        it("Clicking a date invokes onChange with the new date range, but doesn't change the UI", () => {
            const onChange = sinon.spy();
            const { root, getDayElement } = wrap(<DateRangeInput value={DATE_RANGE} onChange={onChange} />);
            root.setState({ isOpen: true });

            // click start date
            getDayElement(START_DAY).simulate("click");
            assertDateRangesEqual(onChange.getCall(0).args[0], [null, END_STR]);
            assertInputTextsEqual(root, START_STR, END_STR);

            // click end date
            getDayElement(END_DAY).simulate("click");
            assertDateRangesEqual(onChange.getCall(1).args[0], [START_STR, null]);
            assertInputTextsEqual(root, START_STR, END_STR);

            expect(onChange.callCount).to.equal(2);
        });

        it("Typing a valid start or end date invokes onChange with the new date range but doesn't change UI", () => {
            const onChange = sinon.spy();
            const { root } = wrap(<DateRangeInput onChange={onChange} value={DATE_RANGE} />);

            changeStartInputText(root, START_STR_2);
            expect(onChange.callCount).to.equal(1);
            assertDateRangesEqual(onChange.getCall(0).args[0], [START_STR_2, END_STR]);
            assertInputTextsEqual(root, START_STR, END_STR);

            // since the component is controlled, value changes don't persist across onChanges
            changeEndInputText(root, END_STR_2);
            expect(onChange.callCount).to.equal(2);
            assertDateRangesEqual(onChange.getCall(1).args[0], [START_STR, END_STR_2]);
            assertInputTextsEqual(root, START_STR, END_STR);
        });

        it.skip("Typing a date out of range displays the error message and calls onError with invalid date", () => {
            expect(true).to.be.false;
        });

        it.skip("Typing an invalid date displays the error message and calls onError with Date(undefined)", () => {
            expect(true).to.be.false;
        });

        it("Clearing the dates in the picker invokes onChange with [null, null], but doesn't change the UI", () => {
            const onChange = sinon.spy();
            const value = [START_DATE, null] as DateRange;

            const { root, getDayElement } = wrap(<DateRangeInput value={value} onChange={onChange} />);
            root.setState({ isOpen: true });

            getDayElement(START_DAY).simulate("click");

            assertDateRangesEqual(onChange.getCall(0).args[0], [null, null]);
            assertInputTextsEqual(root, START_STR, "");
        });

        it(`Clearing the inputs invokes onChange with [null, null], doesn't clear the selected dates, and\
            repopulates the controlled values in the inputs on blur`, () => {
            const onChange = sinon.spy();
            const { root, getDayElement } = wrap(<DateRangeInput onChange={onChange} value={[START_DATE, null]} />);

            const startInput = getStartInput(root);
            startInput.simulate("focus");
            changeInputText(startInput, "");

            // emit the new date range
            expect(onChange.callCount).to.equal(1);
            assertDateRangesEqual(onChange.getCall(0).args[0], [null, null]);

            // update the fields per the user's typing
            assertInputTextsEqual(root, "", "");

            // start day should still be selected in the calendar, ignoring user's typing
            const startDayElement = getDayElement(START_DAY);
            expect(startDayElement.hasClass(DateClasses.DATEPICKER_DAY_SELECTED)).to.be.true;

            // blurring should put the controlled start date back in the start input, overriding user's typing
            startInput.simulate("blur");
            assertInputTextsEqual(root, START_STR, "");
        });
    });

    function getStartInput(root: WrappedComponentRoot): WrappedComponentInput {
        return root.find(InputGroup).first().find("input");
    }

    function getEndInput(root: WrappedComponentRoot): WrappedComponentInput {
        return root.find(InputGroup).last().find("input");
    }

    function getStartInputText(root: WrappedComponentRoot) {
        return getInputText(getStartInput(root));
    }

    function getEndInputText(root: WrappedComponentRoot) {
        return getInputText(getEndInput(root));
    }

    function getInputText(input: WrappedComponentInput) {
        return input.props().value;
    }

    function changeStartInputText(root: WrappedComponentRoot, value: string) {
        changeInputText(getStartInput(root), value);
    }

    function changeEndInputText(root: WrappedComponentRoot, value: string) {
        changeInputText(getEndInput(root), value);
    }

    function changeInputText(input: WrappedComponentInput, value: string) {
        input.simulate("change", { target: { value }});
    }

    function assertInputTextsEqual(root: WrappedComponentRoot, startInputText: string, endInputText: string) {
        expect(getStartInputText(root)).to.equal(startInputText);
        expect(getEndInputText(root)).to.equal(endInputText);
    }

    function assertDateRangesEqual(actual: DateRange, expected: string[]) {
        const [expectedStart, expectedEnd] = expected;
        const [actualStart, actualEnd] = actual.map((date: Date) => {
            return (date == null) ? null : DateTestUtils.toHyphenatedDateString(date);
        });
        expect(actualStart).to.equal(expectedStart);
        expect(actualEnd).to.equal(expectedEnd);
    }

    function wrap(dateRangeInput: JSX.Element) {
        const wrapper = mount(dateRangeInput);
        return {
            getDayElement: (dayNumber = 1, fromLeftMonth = true) => {
                const monthElement = wrapper.find(".DayPicker-Month").at(fromLeftMonth ? 0 : 1);
                const dayElements = monthElement.find(`.${DateClasses.DATEPICKER_DAY}`);
                return dayElements.filterWhere((d) => {
                    return d.text() === dayNumber.toString()
                        && !d.hasClass(DateClasses.DATEPICKER_DAY_OUTSIDE);
                });
            },
            root: wrapper,
        };
    }
});
