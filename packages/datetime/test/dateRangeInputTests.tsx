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
import { Classes as DateClasses, DateRange, DateRangeBoundary, DateRangeInput } from "../src/index";
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

    const INVALID_STR = "<this is an invalid date string>";
    const INVALID_MESSAGE = "Custom invalid-date message";

    const OUT_OF_RANGE_TEST_MIN = new Date(2000, 1, 1);
    const OUT_OF_RANGE_TEST_MAX = new Date(2020, 1, 1);
    const OUT_OF_RANGE_START_DATE = new Date(1000, 1, 1);
    const OUT_OF_RANGE_START_STR = DateTestUtils.toHyphenatedDateString(OUT_OF_RANGE_START_DATE);
    const OUT_OF_RANGE_END_DATE = new Date(3000, 1, 1);
    const OUT_OF_RANGE_END_STR = DateTestUtils.toHyphenatedDateString(OUT_OF_RANGE_END_DATE);
    const OUT_OF_RANGE_MESSAGE = "Custom out-of-range message";

    // a custom string representation for `new Date(undefined)` that we use in
    // date-range equality checks just in this file
    const UNDEFINED_DATE_STR = "<UNDEFINED DATE>";

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

        describe("Typing an out-of-range date...", () => {

            // we run the same four tests for each of several cases. putting
            // setup logic in beforeEach lets us express our it(...) tests as
            // nice one-liners further down this block, and it also gives
            // certain tests easy access to onError/onChange if they need it.

            let onChange: Sinon.SinonSpy;
            let onError: Sinon.SinonSpy;
            let root: WrappedComponentRoot;

            beforeEach(() => {
                onChange = sinon.spy();
                onError = sinon.spy();

                // use defaultValue to specify the calendar months in view
                const result = wrap(<DateRangeInput
                    defaultValue={DATE_RANGE}
                    minDate={OUT_OF_RANGE_TEST_MIN}
                    maxDate={OUT_OF_RANGE_TEST_MAX}
                    onError={onError}
                    outOfRangeMessage={OUT_OF_RANGE_MESSAGE}
                />);
                root = result.root;

                // clear the fields *before* setting up an onChange callback to
                // keep onChange.callCount at 0 before tests run
                changeStartInputText(root, "");
                changeEndInputText(root, "");
                root.setProps({ onChange });

                return { root, onError };
            });

            afterEach(() => {
                onChange = null;
                onError = null;
                root = null;
            });

            describe("shows the error message on blur", () => {
                const _runTest = (input: WrappedComponentInput, inputString: string) => {
                    changeInputText(input, inputString);
                    input.simulate("blur");
                    assertInputTextEquals(input, OUT_OF_RANGE_MESSAGE);
                };
                _runTestForEachScenario(_runTest);
            });

            describe("shows the offending date in the field on focus", () => {
                const _runTest = (input: WrappedComponentInput, inputString: string) => {
                    changeInputText(input, inputString);
                    input.simulate("blur");
                    input.simulate("focus");
                    assertInputTextEquals(input, inputString);
                };
                _runTestForEachScenario(_runTest);
            });

            describe("calls onError with invalid date on blur", () => {
                const _runTest = (input: WrappedComponentInput, inputString: string, boundary: DateRangeBoundary) => {
                    const expectedRange = (boundary === DateRangeBoundary.START)
                        ? [inputString, null]
                        : [null, inputString];
                    input.simulate("focus");
                    changeInputText(input, inputString);
                    expect(onError.called).to.be.false;
                    input.simulate("blur");
                    expect(onError.calledOnce).to.be.true;
                    assertDateRangesEqual(onError.getCall(0).args[0], expectedRange);
                };
                _runTestForEachScenario(_runTest);
            });

            describe("does NOT call onChange before OR after blur", () => {
                const _runTest = (input: WrappedComponentInput, inputString: string) => {
                    input.simulate("focus");
                    changeInputText(input, inputString);
                    expect(onChange.called).to.be.false;
                    input.simulate("blur");
                    expect(onChange.called).to.be.false;
                };
                _runTestForEachScenario(_runTest);
            });

            describe("removes error message if input is changed to an in-range date again", () => {
                const _runTest = (input: WrappedComponentInput, inputString: string) => {
                    changeInputText(input, inputString);
                    input.simulate("blur");

                    const IN_RANGE_DATE_STR = START_STR;
                    input.simulate("focus");
                    changeInputText(input, IN_RANGE_DATE_STR);
                    input.simulate("blur");
                    assertInputTextEquals(input, IN_RANGE_DATE_STR);
                };
                _runTestForEachScenario(_runTest);
            });

            type OutOfRangeTestFunction = (input: WrappedComponentInput,
                                           inputString: string,
                                           boundary?: DateRangeBoundary) => void;

            function _runTestForEachScenario(runTestFn: OutOfRangeTestFunction) {
                const { START, END } = DateRangeBoundary; // deconstruct to keep line lengths under threshold
                it("if start < minDate", () => runTestFn(getStartInput(root), OUT_OF_RANGE_START_STR, START));
                it("if start > maxDate", () => runTestFn(getStartInput(root), OUT_OF_RANGE_END_STR, START));
                it("if end < minDate", () => runTestFn(getEndInput(root), OUT_OF_RANGE_START_STR, END));
                it("if end > maxDate", () => runTestFn(getEndInput(root), OUT_OF_RANGE_END_STR, END));
            }
        });

        describe("Typing an invalid date...", () => {

            let onChange: Sinon.SinonSpy;
            let onError: Sinon.SinonSpy;
            let root: WrappedComponentRoot;

            beforeEach(() => {
                onChange = sinon.spy();
                onError = sinon.spy();

                const result = wrap(<DateRangeInput
                    defaultValue={DATE_RANGE}
                    invalidDateMessage={INVALID_MESSAGE}
                    onError={onError}
                />);
                root = result.root;

                // clear the fields *before* setting up an onChange callback to
                // keep onChange.callCount at 0 before tests run
                changeStartInputText(root, "");
                changeEndInputText(root, "");
                root.setProps({ onChange });

                return { root, onError };
            });

            afterEach(() => {
                onChange = null;
                onError = null;
                root = null;
            });

            describe("shows the error message on blur", () => {
                const _runTest = (input: WrappedComponentInput) => {
                    input.simulate("focus");
                    changeInputText(input, INVALID_STR);
                    input.simulate("blur");
                    assertInputTextEquals(input, INVALID_MESSAGE);
                };
                _runTestForEachScenario(_runTest);
            });

            describe("keeps showing the error message on next focus", () => {
                const _runTest = (input: WrappedComponentInput) => {
                    input.simulate("focus");
                    changeInputText(input, INVALID_STR);
                    input.simulate("blur");
                    input.simulate("focus");
                    assertInputTextEquals(input, INVALID_MESSAGE);
                };
                _runTestForEachScenario(_runTest);
            });

            describe("calls onError on blur with Date(undefined) in place of the invalid date", () => {
                const _runTest = (input: WrappedComponentInput, boundary: DateRangeBoundary) => {
                    input.simulate("focus");
                    changeInputText(input, INVALID_STR);
                    expect(onError.called).to.be.false;
                    input.simulate("blur");
                    expect(onError.calledOnce).to.be.true;

                    const dateRange = onError.getCall(0).args[0];
                    const dateIndex = (boundary === DateRangeBoundary.START) ? 0 : 1;
                    expect((dateRange[dateIndex] as Date).valueOf()).to.be.NaN;
                };
                _runTestForEachScenario(_runTest);
            });

            describe("does NOT call onChange before OR after blur", () => {
                const _runTest = (input: WrappedComponentInput) => {
                    input.simulate("focus");
                    changeInputText(input, INVALID_STR);
                    expect(onChange.called).to.be.false;
                    input.simulate("blur");
                    expect(onChange.called).to.be.false;
                };
                _runTestForEachScenario(_runTest);
            });

            describe("removes error message if input is changed to an in-range date again", () => {
                const _runTest = (input: WrappedComponentInput) => {
                    input.simulate("focus");
                    changeInputText(input, INVALID_STR);
                    input.simulate("blur");

                    // just use START_STR for this test, because it will be
                    // valid in either field.
                    const VALID_STR = START_STR;
                    input.simulate("focus");
                    changeInputText(input, VALID_STR);
                    input.simulate("blur");
                    assertInputTextEquals(input, VALID_STR);
                };
                _runTestForEachScenario(_runTest);
            });

            // tslint:disable-next-line:max-line-length
            describe("calls onChange if last-edited boundary is in range and the other boundary is out of range", () => {
                const _runTest = (input: WrappedComponentInput,
                                  boundary: DateRangeBoundary,
                                  otherInput: WrappedComponentInput) => {
                    otherInput.simulate("focus");
                    changeInputText(otherInput, INVALID_STR);
                    otherInput.simulate("blur");
                    expect(onChange.called).to.be.false;

                    const VALID_STR = START_STR;
                    input.simulate("focus");
                    changeInputText(input, VALID_STR);
                    expect(onChange.calledOnce).to.be.true; // because latest date is valid

                    const actualRange = onChange.getCall(0).args[0];
                    const expectedRange = (boundary === DateRangeBoundary.START)
                        ? [VALID_STR, UNDEFINED_DATE_STR]
                        : [UNDEFINED_DATE_STR, VALID_STR];

                    assertDateRangesEqual(actualRange, expectedRange);
                }
                _runTestForEachScenario(_runTest);
            });

            type InvalidDateTestFunction = (input: WrappedComponentInput,
                                            boundary: DateRangeBoundary,
                                            otherInput: WrappedComponentInput) => void;

            function _runTestForEachScenario(runTestFn: InvalidDateTestFunction) {
                it("in start field", () => runTestFn(getStartInput(root), DateRangeBoundary.START, getEndInput(root)));
                it("in end field", () => runTestFn(getEndInput(root), DateRangeBoundary.END, getStartInput(root)));
            }
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

        it(`Clearing only the start input (e.g.) invokes onChange with [null, <endDate>]`, () => {
            const onChange = sinon.spy();
            const { root } = wrap(<DateRangeInput onChange={onChange} defaultValue={DATE_RANGE} />);

            changeStartInputText(root, "");
            expect(onChange.called).to.be.true;
            assertDateRangesEqual(onChange.getCall(0).args[0], [null, END_STR]);
            assertInputTextsEqual(root, "", END_STR);
        });

        it(`Clearing the dates in both inputs invokes onChange with [null, null] and leaves the inputs empty`, () => {
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

        it(`Clearing only the start input (e.g.) invokes onChange with [null, <endDate>], doesn't clear the\
            selected dates, and repopulates the controlled values in the inputs on blur`, () => {
            const onChange = sinon.spy();
            const { root, getDayElement } = wrap(<DateRangeInput onChange={onChange} value={DATE_RANGE} />);

            const startInput = getStartInput(root);

            startInput.simulate("focus");
            changeInputText(startInput, "");
            expect(onChange.calledOnce).to.be.true;
            assertDateRangesEqual(onChange.getCall(0).args[0], [null, END_STR]);
            assertInputTextsEqual(root, "", END_STR);

            // start day should still be selected in the calendar, ignoring user's typing
            expect(getDayElement(START_DAY).hasClass(DateClasses.DATEPICKER_DAY_SELECTED)).to.be.true;

            // blurring should put the controlled start date back in the start input, overriding user's typing
            startInput.simulate("blur");
            assertInputTextsEqual(root, START_STR, END_STR);
        });

        it(`Clearing the inputs invokes onChange with [null, null], doesn't clear the selected dates, and\
            repopulates the controlled values in the inputs on blur`, () => {
            const onChange = sinon.spy();
            const { root, getDayElement } = wrap(<DateRangeInput onChange={onChange} value={[START_DATE, null]} />);

            const startInput = getStartInput(root);

            startInput.simulate("focus");
            changeInputText(startInput, "");
            expect(onChange.calledOnce).to.be.true;
            assertDateRangesEqual(onChange.getCall(0).args[0], [null, null]);
            assertInputTextsEqual(root, "", "");

            expect(getDayElement(START_DAY).hasClass(DateClasses.DATEPICKER_DAY_SELECTED)).to.be.true;

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
        assertInputTextEquals(getStartInput(root), startInputText);
        assertInputTextEquals(getEndInput(root), endInputText);
    }

    function assertInputTextEquals(input: WrappedComponentInput, inputText: string) {
        expect(getInputText(input)).to.equal(inputText);
    }

    function assertDateRangesEqual(actual: DateRange, expected: string[]) {
        const [expectedStart, expectedEnd] = expected;
        const [actualStart, actualEnd] = actual.map((date: Date) => {
            if (date == null) {
               return null;
            } else if (isNaN(date.valueOf())) {
               return UNDEFINED_DATE_STR;
            } else {
               return DateTestUtils.toHyphenatedDateString(date);
            }
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
