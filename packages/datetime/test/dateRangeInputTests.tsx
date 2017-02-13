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

    it("invokes onChange when a day is selected or deselected in the picker", () => {
        const onChange = sinon.spy();
        const defaultValue = [new Date(2017, Months.JANUARY, 22), new Date(2017, Months.JANUARY, 24)] as DateRange;

        const { root, getDayElement } = wrap(<DateRangeInput defaultValue={defaultValue} onChange={onChange} />);
        root.setState({ isOpen: true });

        // deselect days
        getDayElement(22).simulate("click");
        getDayElement(24).simulate("click");

        // select days
        getDayElement(22).simulate("click");
        getDayElement(24).simulate("click");

        expect(onChange.callCount).to.equal(4);
        assertDateRangesEqual(onChange.getCall(0).args[0], [null, "2017-01-24"]);
        assertDateRangesEqual(onChange.getCall(1).args[0], [null, null]);
        assertDateRangesEqual(onChange.getCall(2).args[0], ["2017-01-22", null]);
        assertDateRangesEqual(onChange.getCall(3).args[0], ["2017-01-22", "2017-01-24"]);
    });

    it("shows empty fields when no date range is selected", () => {
        const onChange = sinon.spy();
        const { root } = wrap(<DateRangeInput onChange={onChange} />);

        expect(getStartInputText(root)).to.be.empty;
        expect(getEndInputText(root)).to.be.empty;
    });

    it("shows formatted dates in fields when date range is selected", () => {
        const onChange = sinon.spy();
        const defaultValue = [new Date(2017, Months.JANUARY, 22), new Date(2017, Months.JANUARY, 24)] as DateRange;

        const { root } = wrap(<DateRangeInput defaultValue={defaultValue} onChange={onChange} />);
        root.setState({ isOpen: true });

        expect(getStartInputText(root)).to.equal("2017-01-22");
        expect(getEndInputText(root)).to.equal("2017-01-24");
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
