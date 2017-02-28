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

    const OVERLAPPING_DATES_MESSAGE = "Custom overlapping-dates message";
    const OVERLAPPING_START_DATE = END_DATE_2; // should be later then END_DATE
    const OVERLAPPING_END_DATE = START_DATE_2; // should be earlier then START_DATE
    const OVERLAPPING_START_STR = DateTestUtils.toHyphenatedDateString(OVERLAPPING_START_DATE);
    const OVERLAPPING_END_STR = DateTestUtils.toHyphenatedDateString(OVERLAPPING_END_DATE);

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

    it("startInputProps.onChange receives change events in the start field", () => {
        const onChange = sinon.spy();
        const component = mount(<DateRangeInput startInputProps={{ onChange }} />);
        changeStartInputText(component, "text");
        expect(onChange.calledOnce).to.be.true;
        expect((onChange.firstCall.args[0].target as HTMLInputElement).value).to.equal("text");
    });

    it("endInputProps.inputRef receives reference to HTML input element", () => {
        const inputRef = sinon.spy();
        // full DOM rendering here so the ref handler is invoked
        mount(<DateRangeInput endInputProps={{ inputRef }} />);
        expect(inputRef.calledOnce).to.be.true;
        expect(inputRef.firstCall.args[0]).to.be.an.instanceOf(HTMLInputElement);
    });

    it("endInputProps.onChange receives change events in the end field", () => {
        const onChange = sinon.spy();
        const component = mount(<DateRangeInput endInputProps={{ onChange }} />);
        changeEndInputText(component, "text");
        expect(onChange.calledOnce).to.be.true;
        expect((onChange.firstCall.args[0].target as HTMLInputElement).value).to.equal("text");
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
            });

            describe("shows the error message on blur", () => {
                runTestForEachScenario((input, inputString) => {
                    changeInputText(input, inputString);
                    input.simulate("blur");
                    assertInputTextEquals(input, OUT_OF_RANGE_MESSAGE);
                });
            });

            describe("shows the offending date in the field on focus", () => {
                runTestForEachScenario((input, inputString) => {
                    changeInputText(input, inputString);
                    input.simulate("blur");
                    input.simulate("focus");
                    assertInputTextEquals(input, inputString);
                });
            });

            describe("calls onError with invalid date on blur", () => {
                runTestForEachScenario((input, inputString, boundary) => {
                    const expectedRange = (boundary === DateRangeBoundary.START)
                        ? [inputString, null]
                        : [null, inputString];
                    input.simulate("focus");
                    changeInputText(input, inputString);
                    expect(onError.called).to.be.false;
                    input.simulate("blur");
                    expect(onError.calledOnce).to.be.true;
                    assertDateRangesEqual(onError.getCall(0).args[0], expectedRange);
                });
            });

            describe("does NOT call onChange before OR after blur", () => {
                runTestForEachScenario((input, inputString) => {
                    input.simulate("focus");
                    changeInputText(input, inputString);
                    expect(onChange.called).to.be.false;
                    input.simulate("blur");
                    expect(onChange.called).to.be.false;
                });
            });

            describe("removes error message if input is changed to an in-range date again", () => {
                runTestForEachScenario((input, inputString) => {
                    changeInputText(input, inputString);
                    input.simulate("blur");

                    const IN_RANGE_DATE_STR = START_STR;
                    input.simulate("focus");
                    changeInputText(input, IN_RANGE_DATE_STR);
                    input.simulate("blur");
                    assertInputTextEquals(input, IN_RANGE_DATE_STR);
                });
            });

            type OutOfRangeTestFunction = (input: WrappedComponentInput,
                                           inputString: string,
                                           boundary?: DateRangeBoundary) => void;

            function runTestForEachScenario(runTestFn: OutOfRangeTestFunction) {
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
            });

            describe("shows the error message on blur", () => {
                runTestForEachScenario((input) => {
                    input.simulate("focus");
                    changeInputText(input, INVALID_STR);
                    input.simulate("blur");
                    assertInputTextEquals(input, INVALID_MESSAGE);
                });
            });

            describe("keeps showing the error message on next focus", () => {
                runTestForEachScenario((input) => {
                    input.simulate("focus");
                    changeInputText(input, INVALID_STR);
                    input.simulate("blur");
                    input.simulate("focus");
                    assertInputTextEquals(input, INVALID_MESSAGE);
                });
            });

            describe("calls onError on blur with Date(undefined) in place of the invalid date", () => {
                runTestForEachScenario((input, boundary) => {
                    input.simulate("focus");
                    changeInputText(input, INVALID_STR);
                    expect(onError.called).to.be.false;
                    input.simulate("blur");
                    expect(onError.calledOnce).to.be.true;

                    const dateRange = onError.getCall(0).args[0];
                    const dateIndex = (boundary === DateRangeBoundary.START) ? 0 : 1;
                    expect((dateRange[dateIndex] as Date).valueOf()).to.be.NaN;
                });
            });

            describe("does NOT call onChange before OR after blur", () => {
                runTestForEachScenario((input) => {
                    input.simulate("focus");
                    changeInputText(input, INVALID_STR);
                    expect(onChange.called).to.be.false;
                    input.simulate("blur");
                    expect(onChange.called).to.be.false;
                });
            });

            describe("removes error message if input is changed to an in-range date again", () => {
                runTestForEachScenario((input) => {
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
                });
            });

            // tslint:disable-next-line:max-line-length
            describe("calls onChange if last-edited boundary is in range and the other boundary is out of range", () => {
                runTestForEachScenario((input, boundary, otherInput) => {
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
                });
            });

            type InvalidDateTestFunction = (input: WrappedComponentInput,
                                            boundary: DateRangeBoundary,
                                            otherInput: WrappedComponentInput) => void;

            function runTestForEachScenario(runTestFn: InvalidDateTestFunction) {
                it("in start field", () => runTestFn(getStartInput(root), DateRangeBoundary.START, getEndInput(root)));
                it("in end field", () => runTestFn(getEndInput(root), DateRangeBoundary.END, getStartInput(root)));
            }
        });

        // this test sub-suite is structured a little differently because of the
        // different semantics of this error case in each field
        describe("Typing an overlapping date...", () => {

            let onChange: Sinon.SinonSpy;
            let onError: Sinon.SinonSpy;
            let root: WrappedComponentRoot;

            let startInput: WrappedComponentInput;
            let endInput: WrappedComponentInput;

            beforeEach(() => {
                onChange = sinon.spy();
                onError = sinon.spy();

                const result = wrap(<DateRangeInput
                    defaultValue={DATE_RANGE}
                    overlappingDatesMessage={OVERLAPPING_DATES_MESSAGE}
                    onChange={onChange}
                    onError={onError}
                />);
                root = result.root;
                startInput = getStartInput(root);
                endInput = getEndInput(root);
            });

            describe("in the start field...", () => {

                it("shows an error message in the end field right away", () => {
                    startInput.simulate("focus");
                    changeInputText(startInput, OVERLAPPING_START_STR);
                    assertInputTextEquals(endInput, OVERLAPPING_DATES_MESSAGE);
                });

                it("shows the offending date in the end field on focus in the end field", () => {
                    startInput.simulate("focus");
                    changeInputText(startInput, OVERLAPPING_START_STR);
                    startInput.simulate("blur");
                    endInput.simulate("focus");
                    assertInputTextEquals(endInput, END_STR);
                });

                it("calls onError with [<overlappingDate>, <endDate] on blur", () => {
                    startInput.simulate("focus");
                    changeInputText(startInput, OVERLAPPING_START_STR);
                    expect(onError.called).to.be.false;
                    startInput.simulate("blur");
                    expect(onError.calledOnce).to.be.true;
                    assertDateRangesEqual(onError.getCall(0).args[0], [OVERLAPPING_START_STR, END_STR]);
                });

                it("does NOT call onChange before OR after blur", () => {
                    startInput.simulate("focus");
                    changeInputText(startInput, OVERLAPPING_START_STR);
                    expect(onChange.called).to.be.false;
                    startInput.simulate("blur");
                    expect(onChange.called).to.be.false;
                });

                it("removes error message if input is changed to an in-range date again", () => {
                    startInput.simulate("focus");
                    changeInputText(startInput, OVERLAPPING_START_STR);
                    changeInputText(startInput, START_STR);
                    assertInputTextEquals(endInput, END_STR);
                });
            });

            describe("in the end field...", () => {

                it("shows an error message in the end field on blur", () => {
                    endInput.simulate("focus");
                    changeInputText(endInput, OVERLAPPING_END_STR);
                    assertInputTextEquals(endInput, OVERLAPPING_END_STR);
                    endInput.simulate("blur");
                    assertInputTextEquals(endInput, OVERLAPPING_DATES_MESSAGE);
                });

                it("shows the offending date in the end field on re-focus", () => {
                    endInput.simulate("focus");
                    changeInputText(endInput, OVERLAPPING_END_STR);
                    endInput.simulate("blur");
                    endInput.simulate("focus");
                    assertInputTextEquals(endInput, OVERLAPPING_END_STR);
                });

                it("calls onError with [<startDate>, <overlappingDate>] on blur", () => {
                    endInput.simulate("focus");
                    changeInputText(endInput, OVERLAPPING_END_STR);
                    expect(onError.called).to.be.false;
                    endInput.simulate("blur");
                    expect(onError.calledOnce).to.be.true;
                    assertDateRangesEqual(onError.getCall(0).args[0], [START_STR, OVERLAPPING_END_STR]);
                });

                it("does NOT call onChange before OR after blur", () => {
                    endInput.simulate("focus");
                    changeInputText(endInput, OVERLAPPING_END_STR);
                    expect(onChange.called).to.be.false;
                    endInput.simulate("blur");
                    expect(onChange.called).to.be.false;
                });

                it("removes error message if input is changed to an in-range date again", () => {
                    endInput.simulate("focus");
                    changeInputText(endInput, OVERLAPPING_END_STR);
                    endInput.simulate("blur");
                    endInput.simulate("focus");
                    changeInputText(endInput, END_STR);
                    endInput.simulate("blur");
                    assertInputTextEquals(endInput, END_STR);
                });
            });
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
