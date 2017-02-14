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
        it("Clicking a date puts the selected date range in the input boxes", () => {
            const defaultValue = [START_DATE, null] as DateRange;

            const { root, getDayElement } = wrap(<DateRangeInput defaultValue={defaultValue} />);
            root.setState({ isOpen: true });

            // verify the default value
            assertInputTextsEqual(root, START_STR, "");

            getDayElement(END_DAY).simulate("click");
            assertInputTextsEqual(root, START_STR, END_STR);

            getDayElement(START_DAY).simulate("click");
            assertInputTextsEqual(root, "", END_STR);

            getDayElement(END_DAY).simulate("click");
            assertInputTextsEqual(root, "", "");

            getDayElement(START_DAY).simulate("click");
            assertInputTextsEqual(root, START_STR, "");
        });

        it("Clearing the date range clears the inputs, and invokes onChange with [null, null]", () => {
            const onChange = sinon.spy();
            const defaultValue = [START_DATE, null] as DateRange;

            const { root, getDayElement } = wrap(<DateRangeInput defaultValue={defaultValue} onChange={onChange} />);
            root.setState({ isOpen: true });

            getDayElement(START_DAY).simulate("click");

            expect(getStartInputText(root)).to.be.empty;
            expect(getEndInputText(root)).to.be.empty;
            expect(onChange.calledWith([null, null])).to.be.true;
        });
    });

    describe("when controlled", () => {
        it("Ignores defaultValue if it is also set", () => {
            const { root } = wrap(<DateRangeInput
                defaultValue={DATE_RANGE_2}
                value={DATE_RANGE}
            />);
            assertInputTextsEqual(root, START_STR, END_STR);
        });

        it("shows empty fields when value is [null, null]", () => {
            const { root } = wrap(<DateRangeInput value={[null, null]} />);
            assertInputTextsEqual(root, "", "");
        });

        it("Clicking a date invokes onChange with the selected date range but doesn't change UI", () => {
            const onChange = sinon.spy();
            const { root, getDayElement } = wrap(<DateRangeInput value={DATE_RANGE} onChange={onChange} />);
            root.setState({ isOpen: true });

            // click start date
            getDayElement(START_DAY).simulate("click");
            assertDateRangesEqual(onChange.getCall(0).args[0], [null, END_STR]);
            expect(getStartInputText(root)).to.equal(START_STR);
            expect(getEndInputText(root)).to.equal(END_STR);

            // click end date
            getDayElement(END_DAY).simulate("click");
            assertDateRangesEqual(onChange.getCall(1).args[0], [START_STR, null]);
            expect(getStartInputText(root)).to.equal(START_STR);
            expect(getEndInputText(root)).to.equal(END_STR);

            expect(onChange.callCount).to.equal(2);
        });

        it("Clearing the date in the DatePicker invokes onChange with [null, null] but doesn't change UI", () => {
            const onChange = sinon.spy();
            const value = [START_DATE, null] as DateRange;

            const { root, getDayElement } = wrap(<DateRangeInput value={value} onChange={onChange} />);
            root.setState({ isOpen: true });

            getDayElement(START_DAY).simulate("click");

            assertDateRangesEqual(onChange.getCall(0).args[0], [null, null]);
            expect(getStartInputText(root)).to.equal(START_STR);
            expect(getEndInputText(root)).to.be.empty;
        });

        it("Updating value updates the text boxes", () => {
            const { root } = wrap(<DateRangeInput value={DATE_RANGE} />);
            root.setState({ isOpen: true });

            expect(getStartInputText(root)).to.equal(START_STR);
            expect(getEndInputText(root)).to.equal(END_STR);

            root.setProps({ value: DATE_RANGE_2 });
            expect(getStartInputText(root)).to.equal(START_STR_2);
            expect(getEndInputText(root)).to.equal(END_STR_2);
        });
    });

    function getStartInput(root: ReactWrapper<any, {}>) {
        return root.find(InputGroup).first();
    }

    function getEndInput(root: ReactWrapper<any, {}>) {
        return root.find(InputGroup).last();
    }

    function getStartInputText(root: ReactWrapper<any, {}>) {
        return getStartInput(root).props().value;
    }

    function getEndInputText(root: ReactWrapper<any, {}>) {
        return getEndInput(root).props().value;
    }

    function assertInputTextsEqual(root: ReactWrapper<any, {}>, startInputText: string, endInputText: string) {
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
