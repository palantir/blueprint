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
import { Classes as DateClasses, DateRangeInput } from "../src/index";

describe("<DateRangeInput>", () => {
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
        const { root, getDayElement } = wrap(<DateRangeInput onChange={onChange} />);
        root.setState({ isOpen: true });

        // select days
        getDayElement(22).simulate("click");
        getDayElement(24).simulate("click");

        // deselect days
        getDayElement(22).simulate("click");
        getDayElement(24).simulate("click");

        // TODO: Make these checks more rigorous once controlled mode is supported,
        // when we'll be able to enforce which initial month is shown.
        expect(onChange.callCount).to.deep.equal(4);
    });

    it("shows empty fields when no date range is selected", () => {
        const onChange = sinon.spy();
        const { root } = wrap(<DateRangeInput onChange={onChange} />);

        expect(getStartInputText(root)).to.be.empty;
        expect(getEndInputText(root)).to.be.empty;
    });

    it("shows formatted dates in fields when date range is selected", () => {
        const onChange = sinon.spy();
        const { root, getDayElement } = wrap(<DateRangeInput onChange={onChange} />);
        root.setState({ isOpen: true });

        getDayElement(22).simulate("click");
        getDayElement(24).simulate("click");

        // TODO: Make these checks more rigorous once controlled mode is supported.
        expect(getStartInputText(root)).to.be.not.empty;
        expect(getEndInputText(root)).to.be.not.empty;
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
