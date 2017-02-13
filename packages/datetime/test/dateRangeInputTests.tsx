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
import { padWithZeroes } from "../src/common/utils";
import { Classes as DateClasses, DateRange, DateRangeInput } from "../src/index";

describe.only("<DateRangeInput>", () => {
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

        expect(getStartInputText(root)).to.be.empty;
        expect(getEndInputText(root)).to.be.empty;
    });

    describe("when uncontrolled", () => {
        it("Clicking a date puts the selected date range in the input boxes", () => {
            const defaultValue = [new Date(2017, Months.JANUARY, 22), null] as DateRange;

            const { root, getDayElement } = wrap(<DateRangeInput defaultValue={defaultValue} />);
            root.setState({ isOpen: true });

            getDayElement(24).simulate("click");

            expect(getStartInputText(root)).to.equal("2017-01-22");
            expect(getEndInputText(root)).to.equal("2017-01-24");
        });

        it("Clearing the date range clears the inputs, and invokes onChange with [null, null]", () => {
            const onChange = sinon.spy();
            const defaultValue = [new Date(2017, Months.JANUARY, 22), null] as DateRange;

            const { root, getDayElement } = wrap(<DateRangeInput defaultValue={defaultValue} onChange={onChange} />);
            root.setState({ isOpen: true });

            getDayElement(22).simulate("click");

            expect(getStartInputText(root)).to.be.empty;
            expect(getEndInputText(root)).to.be.empty;
            expect(onChange.calledWith([null, null])).to.be.true;
        });
    });

    describe("when controlled", () => {
        const START_DATE = new Date(2017, Months.JANUARY, 22);
        const START_STR = "2017-01-22";
        const END_DATE = new Date(2017, Months.JANUARY, 24);
        const END_STR = "2017-01-24";
        const DATE_RANGE = [START_DATE, END_DATE] as DateRange;

        const START_DATE_2 = new Date(2017, Months.JANUARY, 1);
        const START_STR_2 = "2017-01-01";
        const END_DATE_2 = new Date(2017, Months.JANUARY, 31);
        const END_STR_2 = "2017-01-31";
        const DATE_RANGE_2 = [START_DATE_2, END_DATE_2] as DateRange;

        it("Clicking a date invokes onChange with the selected date range", () => {
            const onChange = sinon.spy();
            const { root, getDayElement } = wrap(<DateRangeInput value={DATE_RANGE} onChange={onChange} />);
            root.setState({ isOpen: true });

            // deselect days
            getDayElement(22).simulate("click");
            getDayElement(24).simulate("click");

            // select days
            getDayElement(22).simulate("click");
            getDayElement(24).simulate("click");

            expect(onChange.callCount).to.equal(4);
            assertDateRangesEqual(onChange.getCall(0).args[0], [null, END_STR]);
            assertDateRangesEqual(onChange.getCall(1).args[0], [null, null]);
            assertDateRangesEqual(onChange.getCall(2).args[0], [START_STR, null]);
            assertDateRangesEqual(onChange.getCall(3).args[0], [START_STR, END_STR]);
        });

        it("Clearing the date in the DatePicker invokes onChange with [null, null] but doesn't change UI", () => {
            const onChange = sinon.spy();

            const { root, getDayElement } = wrap(<DateRangeInput value={DATE_RANGE} onChange={onChange} />);
            root.setState({ isOpen: true });

            getDayElement(22).simulate("click");
            getDayElement(24).simulate("click");

            assertDateRangesEqual(onChange.getCall(1).args[0], [null, null]);
            expect(getStartInputText(root)).to.equal(START_STR);
            expect(getEndInputText(root)).to.equal(END_STR);
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

    function assertDateRangesEqual(actual: DateRange, expected: string[]) {
        const [expectedStart, expectedEnd] = expected;
        const [actualStart, actualEnd] = actual.map((date: Date) => {
            if (date == null) {
                return null;
            }
            return [
                date.getFullYear(),
                padWithZeroes((date.getMonth() + 1) + "", 2),
                padWithZeroes(date.getDate() + "", 2),
            ].join("-");
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
