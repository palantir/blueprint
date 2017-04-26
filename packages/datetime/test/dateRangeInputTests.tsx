/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { expect } from "chai";
import { mount, ReactWrapper } from "enzyme";
import * as React from "react";

import { HTMLInputProps, IInputGroupProps, InputGroup, Popover, Position } from "@blueprintjs/core";
import { Months } from "../src/common/months";
import { Classes as DateClasses, DateRange, DateRangeBoundary, DateRangeInput, DateRangePicker } from "../src/index";
import * as DateTestUtils from "./common/dateTestUtils";

type WrappedComponentRoot = ReactWrapper<any, {}>;
type WrappedComponentInput = ReactWrapper<React.HTMLAttributes<{}>, any>;
type WrappedComponentDayElement = ReactWrapper<React.HTMLAttributes<{}>, any>;

type OutOfRangeTestFunction = (input: WrappedComponentInput,
                               inputString: string,
                               boundary?: DateRangeBoundary) => void;

type InvalidDateTestFunction = (input: WrappedComponentInput,
                                boundary: DateRangeBoundary,
                                otherInput: WrappedComponentInput) => void;

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

    it("inner DateRangePicker receives all supported props", () => {
        const component = mount(<DateRangeInput locale="uk" contiguousCalendarMonths={false} />);
        component.setState({ isOpen: true });
        const picker = component.find(DateRangePicker);
        expect(picker.prop("locale")).to.equal("uk");
        expect(picker.prop("contiguousCalendarMonths")).to.be.false;
    });

    it("startInputProps.inputRef receives reference to HTML input element", () => {
        const inputRef = sinon.spy();
        // full DOM rendering here so the ref handler is invoked
        mount(<DateRangeInput startInputProps={{ inputRef }} />);
        expect(inputRef.calledOnce).to.be.true;
        expect(inputRef.firstCall.args[0]).to.be.an.instanceOf(HTMLInputElement);
    });

    it("shows empty fields when no date range is selected", () => {
        const { root } = wrap(<DateRangeInput />);
        assertInputTextsEqual(root, "", "");
    });

    it("throws error if value === null", () => {
        expect(() => mount(<DateRangeInput value={null} />)).to.throw;
    });

    describe("startInputProps and endInputProps", () => {

        describe("startInputProps", () => {
            runTestSuite(getStartInput, (inputGroupProps) => {
                return mount(<DateRangeInput startInputProps={inputGroupProps} />);
            });
        });

        describe("endInputProps", () => {
            runTestSuite(getEndInput, (inputGroupProps) => {
                return mount(<DateRangeInput endInputProps={inputGroupProps} />);
            });
        });

        function runTestSuite(inputGetterFn: (root: WrappedComponentRoot) => WrappedComponentInput,
                              mountFn: (inputGroupProps: HTMLInputProps & IInputGroupProps) => any) {
            it("inputRef receives reference to HTML input element", () => {
                const inputRef = sinon.spy();
                mountFn({ inputRef });
                expect(inputRef.calledOnce).to.be.true;
                expect(inputRef.firstCall.args[0]).to.be.an.instanceOf(HTMLInputElement);
            });

            it("allows custom placeholder text", () => {
                const { root } = mountFn({ placeholder: "Hello" });
                expect(getInputPlaceholderText(inputGetterFn(root))).to.equal("Hello");
            });

            // verify custom callbacks are called for each event that we listen for internally.
            // (note: we could be more clever and accept just one string param here, but this
            // approach keeps both string params grep-able in the codebase.)
            runCallbackTest("onChange", "change");
            runCallbackTest("onFocus", "focus");
            runCallbackTest("onBlur", "blur");
            runCallbackTest("onClick", "click");
            runCallbackTest("onKeyDown", "keydown");
            runCallbackTest("onMouseDown", "mousedown");

            function runCallbackTest(callbackName: string, eventName: string) {
                it(`fires custom ${callbackName} callback`, () => {
                    const spy = sinon.spy();
                    const component = mountFn({ [callbackName]: spy });
                    const input = inputGetterFn(component);
                    input.simulate(eventName);
                    expect(spy.calledOnce).to.be.true;
                });
            }
        }
    });

    it("placeholder text", () => {
        it("shows proper placeholder text when empty inputs are focused and unfocused", () => {
            // arbitrarily choose the out-of-range tests' min/max dates for this test
            const MIN_DATE = new Date(2017, Months.JANUARY, 1);
            const MAX_DATE = new Date(2017, Months.JANUARY, 31);
            const { root } = wrap(<DateRangeInput minDate={MIN_DATE} maxDate={MAX_DATE} />);

            const startInput = getStartInput(root);
            const endInput = getEndInput(root);

            expect(getInputPlaceholderText(startInput)).to.equal("Start date");
            expect(getInputPlaceholderText(endInput)).to.equal("End date");

            startInput.simulate("focus");
            expect(getInputPlaceholderText(startInput)).to.equal(DateTestUtils.toHyphenatedDateString(MIN_DATE));
            startInput.simulate("blur");
            endInput.simulate("focus");
            expect(getInputPlaceholderText(endInput)).to.equal(DateTestUtils.toHyphenatedDateString(MAX_DATE));
        });

        // need to check this case, because formatted min/max date strings are cached internally
        // until props change again
        it("updates placeholder text properly when min/max dates change", () => {
            const MIN_DATE_1 = new Date(2017, Months.JANUARY, 1);
            const MAX_DATE_1 = new Date(2017, Months.JANUARY, 31);
            const MIN_DATE_2 = new Date(2017, Months.JANUARY, 2);
            const MAX_DATE_2 = new Date(2017, Months.FEBRUARY, 1);
            const { root } = wrap(<DateRangeInput minDate={MIN_DATE_1} maxDate={MAX_DATE_1} />);

            const startInput = getStartInput(root);
            const endInput = getEndInput(root);

            // change while end input is still focused to make sure things change properly in spite of that
            endInput.simulate("focus");
            root.setProps({ minDate: MIN_DATE_2, maxDate: MAX_DATE_2 });

            endInput.simulate("blur");
            startInput.simulate("focus");
            expect(getInputPlaceholderText(startInput)).to.equal(DateTestUtils.toHyphenatedDateString(MIN_DATE_2));
            startInput.simulate("blur");
            endInput.simulate("focus");
            expect(getInputPlaceholderText(endInput)).to.equal(DateTestUtils.toHyphenatedDateString(MAX_DATE_2));
        });

        it("updates placeholder text properly when format changes", () => {
            const MIN_DATE = new Date(2017, Months.JANUARY, 1);
            const MAX_DATE = new Date(2017, Months.JANUARY, 31);
            const { root } = wrap(<DateRangeInput minDate={MIN_DATE} maxDate={MAX_DATE} />);

            const startInput = getStartInput(root);
            const endInput = getEndInput(root);

            root.setProps({ format: "MM/DD/YYYY" });

            startInput.simulate("focus");
            expect(getInputPlaceholderText(startInput)).to.equal("01/01/2017");
            startInput.simulate("blur");
            endInput.simulate("focus");
            expect(getInputPlaceholderText(endInput)).to.equal("01/31/2017");
        });
    });

    it("inputs disable and popover doesn't open if disabled=true", () => {
        const { root } = wrap(<DateRangeInput disabled={true} />);
        const startInput = getStartInput(root);
        startInput.simulate("click");
        expect(root.find(Popover).prop("isOpen")).to.be.false;
        expect(startInput.prop("disabled")).to.be.true;
        expect(getEndInput(root).prop("disabled")).to.be.true;
    });

    describe("closeOnSelection", () => {
        it("if closeOnSelection=false, popover stays open when full date range is selected", () => {
            const { root, getDayElement } = wrap(<DateRangeInput closeOnSelection={false} />);
            root.setState({ isOpen: true });
            getDayElement(1).simulate("click");
            getDayElement(10).simulate("click");
            expect(root.state("isOpen")).to.be.true;
        });

        it("if closeOnSelection=true, popover closes when full date range is selected", () => {
            const { root, getDayElement } = wrap(<DateRangeInput />);
            root.setState({ isOpen: true });
            getDayElement(1).simulate("click");
            getDayElement(10).simulate("click");
            expect(root.state("isOpen")).to.be.false;
        });
    });

    it("accepts contiguousCalendarMonths prop and passes it to the date range picker", () => {
        const { root } = wrap(<DateRangeInput contiguousCalendarMonths={false} />);
        root.setState({ isOpen: true });
        expect(root.find(DateRangePicker).prop("contiguousCalendarMonths")).to.be.false;
    });

    it("accepts shortcuts prop and passes it to the date range picker", () => {
        const { root } = wrap(<DateRangeInput shortcuts={false} />);
        root.setState({ isOpen: true });
        expect(root.find(DateRangePicker).prop("shortcuts")).to.be.false;
    });

    describe("selectAllOnFocus", () => {

        it("if false (the default), does not select any text on focus", () => {
            const attachTo = document.createElement("div");
            const { root } = wrap(<DateRangeInput defaultValue={[START_DATE, null]} />, attachTo);

            const startInput = getStartInput(root);
            startInput.simulate("focus");

            const startInputNode = attachTo.querySelectorAll("input")[0] as HTMLInputElement;
            expect(startInputNode.selectionStart).to.equal(startInputNode.selectionEnd);
        });

        // selectionStart/End works in Chrome but not Phantom. disabling to not fail builds.
        it.skip("if true, selects all text on focus", () => {
            const attachTo = document.createElement("div");
            const { root } = wrap(
                <DateRangeInput
                    defaultValue={[START_DATE, null]}
                    selectAllOnFocus={true}
                />, attachTo);

            const startInput = getStartInput(root);
            startInput.simulate("focus");

            const startInputNode = attachTo.querySelectorAll("input")[0] as HTMLInputElement;
            expect(startInputNode.selectionStart).to.equal(0);
            expect(startInputNode.selectionEnd).to.equal(START_STR.length);
        });

        it.skip("if true, selects all text on day mouseenter in calendar", () => {
            const attachTo = document.createElement("div");
            const { root, getDayElement } = wrap(
                <DateRangeInput
                    defaultValue={[START_DATE, null]}
                    selectAllOnFocus={true}
                />, attachTo);

            root.setState({ isOpen: true });
            // getDay is 0-indexed, but getDayElement is 1-indexed
            getDayElement(START_DATE_2.getDay() + 1).simulate("mouseenter");

            const startInputNode = attachTo.querySelectorAll("input")[0] as HTMLInputElement;
            expect(startInputNode.selectionStart).to.equal(0);
            expect(startInputNode.selectionEnd).to.equal(START_STR.length);
        });
    });

    describe("allowSingleDayRange", () => {
        it("allows start and end to be the same day when clicking", () => {
            const { root, getDayElement } = wrap(<DateRangeInput
                allowSingleDayRange={true}
                defaultValue={[START_DATE, END_DATE]}
            />);
            getEndInput(root).simulate("focus");
            getDayElement(END_DAY).simulate("click");
            getDayElement(START_DAY).simulate("click");
            assertInputTextsEqual(root, START_STR, START_STR);
        });

        it("allows start and end to be the same day when typing", () => {
            const { root } = wrap(<DateRangeInput
                allowSingleDayRange={true}
                defaultValue={[START_DATE, END_DATE]}
            />);
            changeEndInputText(root, "");
            changeEndInputText(root, START_STR);
            assertInputTextsEqual(root, START_STR, START_STR);
        });
    });

    describe("popoverProps", () => {
        it("accepts custom popoverProps", () => {
            const popoverProps = {
                popoverDidOpen: sinon.spy(),
                popoverWillClose: sinon.spy(),
                popoverWillOpen: sinon.spy(),
                position: Position.TOP_LEFT,
            };
            const { root } = wrap(<DateRangeInput popoverProps={popoverProps} />);

            expect(root.find(Popover).prop("position")).to.equal(Position.TOP_LEFT);

            root.setState({ isOpen: true });
            expect(popoverProps.popoverWillOpen.calledOnce).to.be.true;
            expect(popoverProps.popoverDidOpen.calledOnce).to.be.true;

            // not testing popoverProps.onClose, because it has some setTimeout stuff to work around
            root.setState({ isOpen: false });
            expect(popoverProps.popoverWillClose.calledOnce).to.be.true;
        });

        it("ignores autoFocus, enforceFocus, and content in custom popoverProps", () => {
            const CUSTOM_CONTENT = "Here is some custom content";
            const popoverProps = {
                autoFocus: true,
                content: CUSTOM_CONTENT,
                enforceFocus: true,
            };
            const { root } = wrap(<DateRangeInput popoverProps={popoverProps} />);

            // this test assumes the following values will be the defaults internally
            const popover = root.find(Popover);
            expect(popover.prop("autoFocus")).to.be.false;
            expect(popover.prop("enforceFocus")).to.be.false;
            expect(popover.prop("content")).to.not.equal(CUSTOM_CONTENT);
        });
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
            const { root, getDayElement } = wrap(<DateRangeInput
                closeOnSelection={false}
                defaultValue={defaultValue}
                onChange={onChange}
            />);
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

        it(`Typing in a field while hovering over a date shows the typed date, not the hovered date`, () => {
            const onChange = sinon.spy();
            const { root, getDayElement } = wrap(<DateRangeInput onChange={onChange} defaultValue={DATE_RANGE} />);

            getStartInput(root).simulate("focus");
            getDayElement(1).simulate("mouseenter");
            changeStartInputText(root, START_STR_2);
            assertInputTextsEqual(root, START_STR_2, END_STR);
        });

        describe("Typing an out-of-range date", () => {
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

            function runTestForEachScenario(runTestFn: OutOfRangeTestFunction) {
                const { START, END } = DateRangeBoundary; // deconstruct to keep line lengths under threshold
                it("if start < minDate", () => runTestFn(getStartInput(root), OUT_OF_RANGE_START_STR, START));
                it("if start > maxDate", () => runTestFn(getStartInput(root), OUT_OF_RANGE_END_STR, START));
                it("if end < minDate", () => runTestFn(getEndInput(root), OUT_OF_RANGE_START_STR, END));
                it("if end > maxDate", () => runTestFn(getEndInput(root), OUT_OF_RANGE_END_STR, END));
            }
        });

        describe("Typing an invalid date", () => {
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

            function runTestForEachScenario(runTestFn: InvalidDateTestFunction) {
                it("in start field", () => runTestFn(getStartInput(root), DateRangeBoundary.START, getEndInput(root)));
                it("in end field", () => runTestFn(getEndInput(root), DateRangeBoundary.END, getStartInput(root)));
            }
        });

        // this test sub-suite is structured a little differently because of the
        // different semantics of this error case in each field
        describe("Typing an overlapping date", () => {
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

            describe("in the start field", () => {
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

            describe("in the end field", () => {
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

        describe("Hovering over dates", () => {
            // define new constants to clarify chronological ordering of dates
            // TODO: rename all date constants in this file to use a similar
            // scheme, then get rid of these extra constants

            const HOVER_TEST_DAY_1 = 5;
            const HOVER_TEST_DAY_2 = 10;
            const HOVER_TEST_DAY_3 = 15;
            const HOVER_TEST_DAY_4 = 20;
            const HOVER_TEST_DAY_5 = 25;

            const HOVER_TEST_DATE_1 = new Date(2017, Months.JANUARY, HOVER_TEST_DAY_1);
            const HOVER_TEST_DATE_2 = new Date(2017, Months.JANUARY, HOVER_TEST_DAY_2);
            const HOVER_TEST_DATE_3 = new Date(2017, Months.JANUARY, HOVER_TEST_DAY_3);
            const HOVER_TEST_DATE_4 = new Date(2017, Months.JANUARY, HOVER_TEST_DAY_4);
            const HOVER_TEST_DATE_5 = new Date(2017, Months.JANUARY, HOVER_TEST_DAY_5);

            const HOVER_TEST_STR_1 = DateTestUtils.toHyphenatedDateString(HOVER_TEST_DATE_1);
            const HOVER_TEST_STR_2 = DateTestUtils.toHyphenatedDateString(HOVER_TEST_DATE_2);
            const HOVER_TEST_STR_3 = DateTestUtils.toHyphenatedDateString(HOVER_TEST_DATE_3);
            const HOVER_TEST_STR_4 = DateTestUtils.toHyphenatedDateString(HOVER_TEST_DATE_4);
            const HOVER_TEST_STR_5 = DateTestUtils.toHyphenatedDateString(HOVER_TEST_DATE_5);

            const HOVER_TEST_DATE_CONFIG_1 = { day: HOVER_TEST_DAY_1, date: HOVER_TEST_DATE_1, str: HOVER_TEST_STR_1 };
            const HOVER_TEST_DATE_CONFIG_2 = { day: HOVER_TEST_DAY_2, date: HOVER_TEST_DATE_2, str: HOVER_TEST_STR_2 };
            const HOVER_TEST_DATE_CONFIG_3 = { day: HOVER_TEST_DAY_3, date: HOVER_TEST_DATE_3, str: HOVER_TEST_STR_3 };
            const HOVER_TEST_DATE_CONFIG_4 = { day: HOVER_TEST_DAY_4, date: HOVER_TEST_DATE_4, str: HOVER_TEST_STR_4 };
            const HOVER_TEST_DATE_CONFIG_5 = { day: HOVER_TEST_DAY_5, date: HOVER_TEST_DATE_5, str: HOVER_TEST_STR_5 };

            interface IHoverTextDateConfig {
                day: number;
                date: Date;
                str: string;
            }

            let root: WrappedComponentRoot;
            let startInput: WrappedComponentInput;
            let endInput: WrappedComponentInput;
            let getDayElement: (dayNumber?: number, fromLeftMonth?: boolean) => WrappedComponentDayElement;
            let dayElement: WrappedComponentDayElement;

            beforeEach(() => {
                const result = wrap(<DateRangeInput
                    closeOnSelection={false}
                    defaultValue={[HOVER_TEST_DATE_2, HOVER_TEST_DATE_4]}
                />);

                root = result.root;
                getDayElement = result.getDayElement;
                startInput = getStartInput(root);
                endInput = getEndInput(root);

                // clear the inputs to start from a fresh state, but do so
                // *after* opening the popover so that the calendar doesn't
                // move away from the view we expect for these tests.
                root.setState({ isOpen: true });
                changeInputText(startInput, "");
                changeInputText(endInput, "");
            });

            function setSelectedRangeForHoverTest(selectedDateConfigs: IHoverTextDateConfig[]) {
                const [startConfig, endConfig] = selectedDateConfigs;
                changeInputText(startInput, (startConfig == null) ? "" : startConfig.str);
                changeInputText(endInput, (endConfig == null) ? "" : endConfig.str);
            }

            describe("when selected date range is [null, null]", () => {
                const SELECTED_RANGE = [null, null] as IHoverTextDateConfig[];
                const HOVER_TEST_DATE_CONFIG = HOVER_TEST_DATE_CONFIG_1;

                beforeEach(() => {
                    setSelectedRangeForHoverTest(SELECTED_RANGE);
                    dayElement = getDayElement(HOVER_TEST_DATE_CONFIG.day);
                });

                describe("if start field is focused", () => {
                    beforeEach(() => {
                        startInput.simulate("focus");
                        dayElement.simulate("mouseenter");
                    });

                    it("shows [<hoveredDate>, null] in input fields", () => {
                        assertInputTextsEqual(root, HOVER_TEST_DATE_CONFIG.str, "");
                    });

                    it("keeps focus on start field", () => {
                        assertStartInputFocused(root);
                    });

                    describe("on click", () => {
                        beforeEach(() => {
                            dayElement.simulate("click");
                        });

                        it("sets selection to [<hoveredDate>, null]", () => {
                            assertInputTextsEqual(root, HOVER_TEST_DATE_CONFIG.str, "");
                        });

                        it("moves focus to end field", () => {
                            assertEndInputFocused(root);
                        });
                    });

                    describe("if mouse moves to no longer be over a calendar day", () => {
                        beforeEach(() => {
                            dayElement.simulate("mouseleave");
                        });

                        it("shows [null, null] in input fields", () => {
                            assertInputTextsEqual(root, "", "");
                        });

                        it("keeps focus on start field", () => {
                            assertStartInputFocused(root);
                        });
                    });
                });

                describe("if end field is focused", () => {
                    beforeEach(() => {
                        endInput.simulate("focus");
                        dayElement.simulate("mouseenter");
                    });

                    it("shows [null, <hoveredDate>] in input fields", () => {
                        assertInputTextsEqual(root, "", HOVER_TEST_DATE_CONFIG.str);
                    });

                    it("keeps focus on end field", () => {
                        assertEndInputFocused(root);
                    });

                    it("sets selection to [null, <hoveredDate>] on click", () => {
                        dayElement.simulate("click");
                        assertInputTextsEqual(root, "", HOVER_TEST_DATE_CONFIG.str);
                    });

                    describe("on click", () => {
                        beforeEach(() => {
                            dayElement.simulate("click");
                        });

                        it("sets selection to [null, <hoveredDate>]", () => {
                            assertInputTextsEqual(root, "", HOVER_TEST_DATE_CONFIG.str);
                        });

                        it("moves focus to start field", () => {
                            assertStartInputFocused(root);
                        });
                    });

                    describe("if mouse moves to no longer be over a calendar day", () => {
                        beforeEach(() => {
                            dayElement.simulate("mouseleave");
                        });

                        it("shows [null, null] in input fields", () => {
                            assertInputTextsEqual(root, "", "");
                        });

                        it("keeps focus on end field", () => {
                            assertEndInputFocused(root);
                        });
                    });
                });
            });

            describe("when selected date range is [<startDate>, null]", () => {
                const SELECTED_RANGE = [HOVER_TEST_DATE_CONFIG_2, null];

                beforeEach(() => {
                    setSelectedRangeForHoverTest(SELECTED_RANGE);
                });

                describe("if start field is focused", () => {
                    beforeEach(() => {
                        startInput.simulate("focus");
                    });

                    describe("if <startDate> < <hoveredDate>", () => {
                        const DATE_CONFIG = HOVER_TEST_DATE_CONFIG_3;

                        beforeEach(() => {
                            dayElement = getDayElement(DATE_CONFIG.day);
                            dayElement.simulate("mouseenter");
                        });

                        it("shows [<hoveredDate>, null] in input fields", () => {
                            assertInputTextsEqual(root, DATE_CONFIG.str, "");
                        });

                        it("keeps focus on start field", () => {
                            assertStartInputFocused(root);
                        });

                        describe("on click", () => {
                            beforeEach(() => {
                                dayElement.simulate("click");
                            });

                            it("sets selection to [<hoveredDate>, null]", () => {
                                assertInputTextsEqual(root, DATE_CONFIG.str, "");
                            });

                            it("moves focus to end field", () => {
                                assertEndInputFocused(root);
                            });
                        });

                        describe("if mouse moves to no longer be over a calendar day", () => {
                            beforeEach(() => {
                                dayElement.simulate("mouseleave");
                            });

                            it("shows [<startDate>, null] in input fields", () => {
                                assertInputTextsEqual(root, SELECTED_RANGE[0].str, "");
                            });

                            it("keeps focus on start field", () => {
                                assertStartInputFocused(root);
                            });
                        });
                    });

                    describe("if <hoveredDate> < <startDate>", () => {
                        const DATE_CONFIG = HOVER_TEST_DATE_CONFIG_1;

                        beforeEach(() => {
                            dayElement = getDayElement(DATE_CONFIG.day);
                            dayElement.simulate("mouseenter");
                        });

                        it("shows [<hoveredDate>, null] in input fields", () => {
                            assertInputTextsEqual(root, DATE_CONFIG.str, "");
                        });

                        it("keeps focus on start field", () => {
                            assertStartInputFocused(root);
                        });

                        describe("on click", () => {
                            beforeEach(() => {
                                dayElement.simulate("click");
                            });

                            it("sets selection to [<hoveredDate>, null]", () => {
                                assertInputTextsEqual(root, DATE_CONFIG.str, "");
                            });

                            it("moves focus to end field", () => {
                                assertEndInputFocused(root);
                            });
                        });

                        describe("if mouse moves to no longer be over a calendar day", () => {
                            beforeEach(() => {
                                dayElement.simulate("mouseleave");
                            });

                            it("shows [<startDate>, null] in input fields", () => {
                                assertInputTextsEqual(root, SELECTED_RANGE[0].str, "");
                            });

                            it("keeps focus on start field", () => {
                                assertStartInputFocused(root);
                            });
                        });
                    });

                    describe("if <hoveredDate> == <startDate>", () => {
                        const DATE_CONFIG = HOVER_TEST_DATE_CONFIG_2;

                        beforeEach(() => {
                            dayElement = getDayElement(DATE_CONFIG.day);
                            dayElement.simulate("mouseenter");
                        });

                        it("shows [null, null] in input fields", () => {
                            assertInputTextsEqual(root, "", "");
                        });

                        it("keeps focus on start field", () => {
                            assertStartInputFocused(root);
                        });

                        describe("on click", () => {
                            beforeEach(() => {
                                dayElement.simulate("click");
                            });

                            it("sets selection to [null, null]", () => {
                                assertInputTextsEqual(root, "", "");
                            });

                            it("keeps focus on start field", () => {
                                assertStartInputFocused(root);
                            });
                        });

                        describe("if mouse moves to no longer be over a calendar day", () => {
                            beforeEach(() => {
                                dayElement.simulate("mouseleave");
                            });

                            it("shows [<startDate>, null] in input fields", () => {
                                assertInputTextsEqual(root, SELECTED_RANGE[0].str, "");
                            });

                            it("keeps focus on start field", () => {
                                assertStartInputFocused(root);
                            });
                        });
                    });
                });

                describe("if end field is focused", () => {
                    beforeEach(() => {
                        endInput.simulate("focus");
                    });

                    describe("if <startDate> < <hoveredDate>", () => {
                        const DATE_CONFIG = HOVER_TEST_DATE_CONFIG_3;

                        beforeEach(() => {
                            dayElement = getDayElement(DATE_CONFIG.day);
                            dayElement.simulate("mouseenter");
                        });

                        it("shows [<startDate>, <hoveredDate>] in input fields", () => {
                            assertInputTextsEqual(root, SELECTED_RANGE[0].str, DATE_CONFIG.str);
                        });

                        it("keeps focus on end field", () => {
                            assertEndInputFocused(root);
                        });

                        describe("on click", () => {
                            beforeEach(() => {
                                dayElement.simulate("click");
                            });

                            it("sets selection to [<startDate>, <hoveredDate>]", () => {
                                assertInputTextsEqual(root, SELECTED_RANGE[0].str, DATE_CONFIG.str);
                            });

                            it("keeps focus on end field", () => {
                                assertEndInputFocused(root);
                            });
                        });

                        describe("if mouse moves to no longer be over a calendar day", () => {
                            beforeEach(() => {
                                dayElement.simulate("mouseleave");
                            });

                            it("shows [<startDate>, null] in input fields", () => {
                                assertInputTextsEqual(root, SELECTED_RANGE[0].str, "");
                            });

                            it("keeps focus on end field", () => {
                                assertEndInputFocused(root);
                            });
                        });
                    });

                    describe("if <hoveredDate> < <startDate>", () => {
                        const DATE_CONFIG = HOVER_TEST_DATE_CONFIG_1;

                        beforeEach(() => {
                            dayElement = getDayElement(DATE_CONFIG.day);
                            dayElement.simulate("mouseenter");
                        });

                        it("shows [<hoveredDate>, <startDate>] in input fields", () => {
                            assertInputTextsEqual(root, DATE_CONFIG.str, SELECTED_RANGE[0].str);
                        });

                        it("moves focus to start field", () => {
                            assertStartInputFocused(root);
                        });

                        describe("on click", () => {
                            beforeEach(() => {
                                dayElement.simulate("click");
                            });

                            it("sets selection to [<hoveredDate>, <startDate>]", () => {
                                assertInputTextsEqual(root, DATE_CONFIG.str, SELECTED_RANGE[0].str);
                            });

                            it("leaves focus on start field", () => {
                                assertStartInputFocused(root);
                            });
                        });

                        describe("if mouse moves to no longer be over a calendar day", () => {
                            beforeEach(() => {
                                dayElement.simulate("mouseleave");
                            });

                            it("shows [<startDate>, null] in input fields", () => {
                                assertInputTextsEqual(root, SELECTED_RANGE[0].str, "");
                            });

                            it("keeps focus on end field", () => {
                                assertEndInputFocused(root);
                            });
                        });
                    });

                    describe("if <hoveredDate> == <startDate>", () => {
                        const DATE_CONFIG = HOVER_TEST_DATE_CONFIG_2;

                        beforeEach(() => {
                            dayElement = getDayElement(DATE_CONFIG.day);
                            dayElement.simulate("mouseenter");
                        });

                        it("shows [null, null] in input fields", () => {
                            assertInputTextsEqual(root, "", "");
                        });

                        it("moves focus to start field", () => {
                            assertStartInputFocused(root);
                        });

                        describe("on click", () => {
                            beforeEach(() => {
                                dayElement.simulate("click");
                            });

                            it("sets selection to [null, null] on click", () => {
                                assertInputTextsEqual(root, "", "");
                            });

                            it("leaves focus on start field", () => {
                                assertStartInputFocused(root);
                            });
                        });

                        describe("if mouse moves to no longer be over a calendar day", () => {
                            beforeEach(() => {
                                dayElement.simulate("mouseleave");
                            });

                            it("shows [<startDate>, null] in input fields", () => {
                                assertInputTextsEqual(root, SELECTED_RANGE[0].str, "");
                            });

                            it("keeps focus on end field", () => {
                                assertEndInputFocused(root);
                            });
                        });
                    });
                });
            });

            describe("when selected date range is [null, <endDate>]", () => {
                const SELECTED_RANGE = [null, HOVER_TEST_DATE_CONFIG_4];

                beforeEach(() => {
                    setSelectedRangeForHoverTest(SELECTED_RANGE);
                });

                describe("if start field is focused", () => {
                    beforeEach(() => {
                        startInput.simulate("focus");
                    });

                    describe("if <hoveredDate> < <endDate>", () => {
                        const DATE_CONFIG = HOVER_TEST_DATE_CONFIG_3;

                        beforeEach(() => {
                            dayElement = getDayElement(DATE_CONFIG.day);
                            dayElement.simulate("mouseenter");
                        });

                        it("shows [<hoveredDate>, <endDate>] in input fields", () => {
                            assertInputTextsEqual(root, DATE_CONFIG.str, SELECTED_RANGE[1].str);
                        });

                        it("keeps focus on start field", () => {
                            assertStartInputFocused(root);
                        });

                        describe("on click", () => {
                            beforeEach(() => {
                                dayElement.simulate("click");
                            });

                            it("sets selection to [<hoveredDate>, <endDate>]", () => {
                                assertInputTextsEqual(root, DATE_CONFIG.str, SELECTED_RANGE[1].str);
                            });

                            it("keeps focus on start field", () => {
                                assertStartInputFocused(root);
                            });
                        });

                        describe("if mouse moves to no longer be over a calendar day", () => {
                            beforeEach(() => {
                                dayElement.simulate("mouseleave");
                            });

                            it("shows [null, <endDate>] in input fields", () => {
                                assertInputTextsEqual(root, "", SELECTED_RANGE[1].str);
                            });

                            it("keeps focus on start field", () => {
                                assertStartInputFocused(root);
                            });
                        });
                    });

                    describe("if <endDate> < <hoveredDate>", () => {
                        const DATE_CONFIG = HOVER_TEST_DATE_CONFIG_5;

                        beforeEach(() => {
                            dayElement = getDayElement(DATE_CONFIG.day);
                            dayElement.simulate("mouseenter");
                        });

                        it("shows [<endDate>, <hoveredDate>] in input fields", () => {
                            assertInputTextsEqual(root, SELECTED_RANGE[1].str, DATE_CONFIG.str);
                        });

                        it("moves focus to end field", () => {
                            assertEndInputFocused(root);
                        });

                        describe("on click", () => {
                            beforeEach(() => {
                                dayElement.simulate("click");
                            });

                            it("sets selection to [<endDate>, <hoveredDate>] on click", () => {
                                assertInputTextsEqual(root, SELECTED_RANGE[1].str, DATE_CONFIG.str);
                            });

                            it("keeps focus on end field", () => {
                                assertEndInputFocused(root);
                            });
                        });

                        describe("if mouse moves to no longer be over a calendar day", () => {
                            beforeEach(() => {
                                dayElement.simulate("mouseleave");
                            });

                            it("shows [null, <endDate>] in input fields", () => {
                                assertInputTextsEqual(root, "", SELECTED_RANGE[1].str);
                            });

                            it("moves focus back to start field", () => {
                                assertStartInputFocused(root);
                            });
                        });
                    });

                    describe("if <hoveredDate> == <endDate>", () => {
                        const DATE_CONFIG = HOVER_TEST_DATE_CONFIG_4;

                        beforeEach(() => {
                            dayElement = getDayElement(DATE_CONFIG.day);
                            dayElement.simulate("mouseenter");
                        });

                        it("shows [null, null] in input fields", () => {
                            assertInputTextsEqual(root, "", "");
                        });

                        it("moves focus to end field", () => {
                            assertEndInputFocused(root);
                        });

                        describe("on click", () => {
                            beforeEach(() => {
                                dayElement.simulate("click");
                            });

                            it("sets selection to [null, null] on click", () => {
                                assertInputTextsEqual(root, "", "");
                            });

                            it("moves focus to start field", () => {
                                assertStartInputFocused(root);
                            });
                        });

                        describe("if mouse moves to no longer be over a calendar day", () => {
                            beforeEach(() => {
                                dayElement.simulate("mouseleave");
                            });

                            it("shows [null, <endDate>] in input fields", () => {
                                assertInputTextsEqual(root, "", SELECTED_RANGE[1].str);
                            });

                            it("keeps focus on start field", () => {
                                assertStartInputFocused(root);
                            });
                        });
                    });
                });

                describe("if end field is focused", () => {
                    beforeEach(() => {
                        endInput.simulate("focus");
                    });

                    describe("if <hoveredDate> < <endDate>", () => {
                        const DATE_CONFIG = HOVER_TEST_DATE_CONFIG_3;

                        beforeEach(() => {
                            dayElement = getDayElement(DATE_CONFIG.day);
                            dayElement.simulate("mouseenter");
                        });

                        it("shows [null, <hoveredDate>] in input fields", () => {
                            assertInputTextsEqual(root, "", DATE_CONFIG.str);
                        });

                        it("keeps focus on end field", () => {
                            assertEndInputFocused(root);
                        });

                        describe("on click", () => {
                            beforeEach(() => {
                                dayElement.simulate("click");
                            });

                            it("sets selection to [null, <hoveredDate>]", () => {
                                assertInputTextsEqual(root, "", DATE_CONFIG.str);
                            });

                            it("moves focus to start field", () => {
                                assertStartInputFocused(root);
                            });
                        });

                        describe("if mouse moves to no longer be over a calendar day", () => {
                            beforeEach(() => {
                                dayElement.simulate("mouseleave");
                            });

                            it("shows [null, <endDate>] in input fields", () => {
                                assertInputTextsEqual(root, "", SELECTED_RANGE[1].str);
                            });

                            it("keeps focus on end field", () => {
                                assertEndInputFocused(root);
                            });
                        });
                    });

                    describe("if <endDate> < <hoveredDate>", () => {
                        const DATE_CONFIG = HOVER_TEST_DATE_CONFIG_5;

                        beforeEach(() => {
                            dayElement = getDayElement(DATE_CONFIG.day);
                            dayElement.simulate("mouseenter");
                        });

                        it("shows [null, <hoveredDate>] in input fields", () => {
                            assertInputTextsEqual(root, "", DATE_CONFIG.str);
                        });

                        it("keeps focus on start field", () => {
                            assertEndInputFocused(root);
                        });

                        describe("on click", () => {
                            beforeEach(() => {
                                dayElement.simulate("click");
                            });

                            it("sets selection to [null, <hoveredDate>] on click", () => {
                                assertInputTextsEqual(root, "", DATE_CONFIG.str);
                            });

                            it("moves focus to start field", () => {
                                assertStartInputFocused(root);
                            });
                        });

                        describe("if mouse moves to no longer be over a calendar day", () => {
                            beforeEach(() => {
                                dayElement.simulate("mouseleave");
                            });

                            it("shows [null, <endDate>] in input fields", () => {
                                assertInputTextsEqual(root, "", SELECTED_RANGE[1].str);
                            });

                            it("keeps focus on end field", () => {
                                assertEndInputFocused(root);
                            });
                        });
                    });

                    describe("if <hoveredDate> == <endDate>", () => {
                        const DATE_CONFIG = HOVER_TEST_DATE_CONFIG_4;

                        beforeEach(() => {
                            dayElement = getDayElement(DATE_CONFIG.day);
                            dayElement.simulate("mouseenter");
                        });

                        it("shows [null, null] in input fields", () => {
                            assertInputTextsEqual(root, "", "");
                        });

                        it("keeps focus on end field", () => {
                            assertEndInputFocused(root);
                        });

                        describe("on click", () => {
                            beforeEach(() => {
                                dayElement.simulate("click");
                            });

                            it("sets selection to [null, null] on click", () => {
                                assertInputTextsEqual(root, "", "");
                            });

                            it("moves focus to start field", () => {
                                assertStartInputFocused(root);
                            });
                        });

                        describe("if mouse moves to no longer be over a calendar day", () => {
                            beforeEach(() => {
                                dayElement.simulate("mouseleave");
                            });

                            it("shows [null, <endDate>] in input fields", () => {
                                assertInputTextsEqual(root, "", SELECTED_RANGE[1].str);
                            });

                            it("keeps focus on end field", () => {
                                assertEndInputFocused(root);
                            });
                        });
                    });
                });
            });

            describe("when selected date range is [<startDate>, <endDate>]", () => {
                const SELECTED_RANGE = [HOVER_TEST_DATE_CONFIG_2, HOVER_TEST_DATE_CONFIG_4];

                beforeEach(() => {
                    setSelectedRangeForHoverTest(SELECTED_RANGE);
                });

                describe("if start field is focused", () => {
                    beforeEach(() => {
                        startInput.simulate("focus");
                    });

                    describe("if <hoveredDate> < <startDate>", () => {
                        const DATE_CONFIG = HOVER_TEST_DATE_CONFIG_1;

                        beforeEach(() => {
                            dayElement = getDayElement(DATE_CONFIG.day);
                            dayElement.simulate("mouseenter");
                        });

                        it("shows [<hoveredDate>, <endDate>] in input fields", () => {
                            assertInputTextsEqual(root, DATE_CONFIG.str, SELECTED_RANGE[1].str);
                        });

                        it("keeps focus on start field", () => {
                            assertStartInputFocused(root);
                        });

                        describe("on click", () => {
                            beforeEach(() => {
                                dayElement.simulate("click");
                            });

                            it("sets selection to [<hoveredDate>, <endDate>]", () => {
                                assertInputTextsEqual(root, DATE_CONFIG.str, SELECTED_RANGE[1].str);
                            });

                            it("keeps focus on start field", () => {
                                assertStartInputFocused(root);
                            });
                        });

                        describe("if mouse moves to no longer be over a calendar day", () => {
                            beforeEach(() => {
                                dayElement.simulate("mouseleave");
                            });

                            it("shows [<startDate>, <endDate>] in input fields", () => {
                                assertInputTextsEqual(root, SELECTED_RANGE[0].str, SELECTED_RANGE[1].str);
                            });

                            it("keeps focus on start field", () => {
                                assertStartInputFocused(root);
                            });
                        });
                    });

                    describe("if <startDate> < <hoveredDate> < <endDate>", () => {
                        const DATE_CONFIG = HOVER_TEST_DATE_CONFIG_3;

                        beforeEach(() => {
                            dayElement = getDayElement(DATE_CONFIG.day);
                            dayElement.simulate("mouseenter");
                        });

                        it("shows [<hoveredDate>, <endDate>] in input fields", () => {
                            assertInputTextsEqual(root, DATE_CONFIG.str, SELECTED_RANGE[1].str);
                        });

                        it("keeps focus on start field", () => {
                            assertStartInputFocused(root);
                        });

                        describe("on click", () => {
                            beforeEach(() => {
                                dayElement.simulate("click");
                            });

                            it("sets selection to [<hoveredDate>, <endDate>]", () => {
                                assertInputTextsEqual(root, DATE_CONFIG.str, SELECTED_RANGE[1].str);
                            });

                            it("keeps focus on start field", () => {
                                assertStartInputFocused(root);
                            });
                        });

                        describe("if mouse moves to no longer be over a calendar day", () => {
                            beforeEach(() => {
                                dayElement.simulate("mouseleave");
                            });

                            it("shows [<startDate>, <endDate>] in input fields", () => {
                                assertInputTextsEqual(root, SELECTED_RANGE[0].str, SELECTED_RANGE[1].str);
                            });

                            it("keeps focus on start field", () => {
                                assertStartInputFocused(root);
                            });
                        });
                    });

                    describe("if <endDate> < <hoveredDate>", () => {
                        const DATE_CONFIG = HOVER_TEST_DATE_CONFIG_5;

                        beforeEach(() => {
                            dayElement = getDayElement(DATE_CONFIG.day);
                            dayElement.simulate("mouseenter");
                        });

                        it("shows [<hoveredDate>, null] in input fields", () => {
                            assertInputTextsEqual(root, DATE_CONFIG.str, "");
                        });

                        it("keeps focus on start field", () => {
                            assertStartInputFocused(root);
                        });

                        describe("on click", () => {
                            beforeEach(() => {
                                dayElement.simulate("click");
                            });

                            it("sets selection to [<hoveredDate>, null]", () => {
                                assertInputTextsEqual(root, DATE_CONFIG.str, "");
                            });

                            it("moves focus to end field", () => {
                                assertEndInputFocused(root);
                            });
                        });

                        describe("if mouse moves to no longer be over a calendar day", () => {
                            beforeEach(() => {
                                dayElement.simulate("mouseleave");
                            });

                            it("shows [<startDate>, <endDate>] in input fields", () => {
                                assertInputTextsEqual(root, SELECTED_RANGE[0].str, SELECTED_RANGE[1].str);
                            });

                            it("keeps focus on start field", () => {
                                assertStartInputFocused(root);
                            });
                        });
                    });

                    describe("if <hoveredDate> == <startDate>", () => {
                        const DATE_CONFIG = HOVER_TEST_DATE_CONFIG_2;

                        beforeEach(() => {
                            dayElement = getDayElement(DATE_CONFIG.day);
                            dayElement.simulate("mouseenter");
                        });

                        it("shows [null, <endDate>] in input fields", () => {
                            assertInputTextsEqual(root, "", SELECTED_RANGE[1].str);
                        });

                        it("keeps focus on start field", () => {
                            assertStartInputFocused(root);
                        });

                        describe("on click", () => {
                            beforeEach(() => {
                                dayElement.simulate("click");
                            });

                            it("sets selection to [null, <endDate>]", () => {
                                assertInputTextsEqual(root, "", SELECTED_RANGE[1].str);
                            });

                            it("keep focus on start field", () => {
                                assertStartInputFocused(root);
                            });
                        });

                        describe("if mouse moves to no longer be over a calendar day", () => {
                            beforeEach(() => {
                                dayElement.simulate("mouseleave");
                            });

                            it("shows [<startDate>, <endDate>] in input fields", () => {
                                assertInputTextsEqual(root, SELECTED_RANGE[0].str, SELECTED_RANGE[1].str);
                            });

                            it("keeps focus on start field", () => {
                                assertStartInputFocused(root);
                            });
                        });
                    });

                    describe("if <hoveredDate> == <endDate>", () => {
                        const DATE_CONFIG = HOVER_TEST_DATE_CONFIG_4;

                        beforeEach(() => {
                            dayElement = getDayElement(DATE_CONFIG.day);
                            dayElement.simulate("mouseenter");
                        });

                        it("shows [<startDate>, null] in input fields", () => {
                            assertInputTextsEqual(root, SELECTED_RANGE[0].str, "");
                        });

                        it("moves focus to end field", () => {
                            assertEndInputFocused(root);
                        });

                        describe("on click", () => {
                            beforeEach(() => {
                                dayElement.simulate("click");
                            });

                            it("sets selection to [<startDate>, null]", () => {
                                assertInputTextsEqual(root, SELECTED_RANGE[0].str, "");
                            });

                            it("keeps focus on end field", () => {
                                assertEndInputFocused(root);
                            });
                        });

                        describe("if mouse moves to no longer be over a calendar day", () => {
                            beforeEach(() => {
                                dayElement.simulate("mouseleave");
                            });

                            it("shows [<startDate>, <endDate>] in input fields", () => {
                                assertInputTextsEqual(root, SELECTED_RANGE[0].str, SELECTED_RANGE[1].str);
                            });

                            it("moves focus back to start field", () => {
                                assertStartInputFocused(root);
                            });
                        });
                    });
                });

                describe("if end field is focused", () => {
                    beforeEach(() => {
                        endInput.simulate("focus");
                    });

                    describe("if <hoveredDate> < <startDate>", () => {
                        const DATE_CONFIG = HOVER_TEST_DATE_CONFIG_1;

                        beforeEach(() => {
                            dayElement = getDayElement(DATE_CONFIG.day);
                            dayElement.simulate("mouseenter");
                        });

                        it("shows [null, <hoveredDate>] in input fields", () => {
                            assertInputTextsEqual(root, "", DATE_CONFIG.str);
                        });

                        it("keeps focus on end field", () => {
                            assertEndInputFocused(root);
                        });

                        describe("on click", () => {
                            beforeEach(() => {
                                dayElement.simulate("click");
                            });

                            it("sets selection to [null, <hoveredDate>]", () => {
                                assertInputTextsEqual(root, "", DATE_CONFIG.str);
                            });

                            it("moves focus to start field", () => {
                                assertStartInputFocused(root);
                            });
                        });

                        describe("if mouse moves to no longer be over a calendar day", () => {
                            beforeEach(() => {
                                dayElement.simulate("mouseleave");
                            });

                            it("shows [<startDate>, <endDate>] in input fields", () => {
                                assertInputTextsEqual(root, SELECTED_RANGE[0].str, SELECTED_RANGE[1].str);
                            });

                            it("keeps focus on end field", () => {
                                assertEndInputFocused(root);
                            });
                        });
                    });

                    describe("if <startDate> < <hoveredDate> < <endDate>", () => {
                        const DATE_CONFIG = HOVER_TEST_DATE_CONFIG_3;

                        beforeEach(() => {
                            dayElement = getDayElement(DATE_CONFIG.day);
                            dayElement.simulate("mouseenter");
                        });

                        it("shows [<startDate>, <hoveredDate>] in input fields", () => {
                            assertInputTextsEqual(root, SELECTED_RANGE[0].str, DATE_CONFIG.str);
                        });

                        it("keeps focus on end field", () => {
                            assertEndInputFocused(root);
                        });

                        describe("on click", () => {
                            beforeEach(() => {
                                dayElement.simulate("click");
                            });

                            it("sets selection to [<startDate>, <hoveredDate>]", () => {
                                assertInputTextsEqual(root, SELECTED_RANGE[0].str, DATE_CONFIG.str);
                            });

                            it("keeps focus on end field", () => {
                                assertEndInputFocused(root);
                            });
                        });

                        describe("if mouse moves to no longer be over a calendar day", () => {
                            beforeEach(() => {
                                dayElement.simulate("mouseleave");
                            });

                            it("shows [<startDate>, <endDate>] in input fields", () => {
                                assertInputTextsEqual(root, SELECTED_RANGE[0].str, SELECTED_RANGE[1].str);
                            });

                            it("keeps focus on end field", () => {
                                assertEndInputFocused(root);
                            });
                        });
                    });

                    describe("if <endDate> < <hoveredDate>", () => {
                        const DATE_CONFIG = HOVER_TEST_DATE_CONFIG_5;

                        beforeEach(() => {
                            dayElement = getDayElement(DATE_CONFIG.day);
                            dayElement.simulate("mouseenter");
                        });

                        it("shows [<startDate>, <hoveredDate>] in input fields", () => {
                            assertInputTextsEqual(root, SELECTED_RANGE[0].str, DATE_CONFIG.str);
                        });

                        it("keeps focus on end field", () => {
                            assertEndInputFocused(root);
                        });

                        describe("on click", () => {
                            beforeEach(() => {
                                dayElement.simulate("click");
                            });

                            it("sets selection to [<startDate>, <hoveredDate>]", () => {
                                assertInputTextsEqual(root, SELECTED_RANGE[0].str, DATE_CONFIG.str);
                            });

                            it("keeps focus on end field", () => {
                                assertEndInputFocused(root);
                            });
                        });

                        describe("if mouse moves to no longer be over a calendar day", () => {
                            beforeEach(() => {
                                dayElement.simulate("mouseleave");
                            });

                            it("shows [<startDate>, <endDate>] in input fields", () => {
                                assertInputTextsEqual(root, SELECTED_RANGE[0].str, SELECTED_RANGE[1].str);
                            });

                            it("keeps focus on end field", () => {
                                assertEndInputFocused(root);
                            });
                        });
                    });

                    describe("if <hoveredDate> == <startDate>", () => {
                        const DATE_CONFIG = HOVER_TEST_DATE_CONFIG_2;

                        beforeEach(() => {
                            dayElement = getDayElement(DATE_CONFIG.day);
                            dayElement.simulate("mouseenter");
                        });

                        it("shows [null, <endDate>] in input fields", () => {
                            assertInputTextsEqual(root, "", SELECTED_RANGE[1].str);
                        });

                        it("moves focus to start field", () => {
                            assertStartInputFocused(root);
                        });

                        describe("on click", () => {
                            beforeEach(() => {
                                dayElement.simulate("click");
                            });

                            it("sets selection to [null, <endDate>]", () => {
                                assertInputTextsEqual(root, "", SELECTED_RANGE[1].str);
                            });

                            it("keeps focus on start field", () => {
                                assertStartInputFocused(root);
                            });
                        });

                        describe("if mouse moves to no longer be over a calendar day", () => {
                            beforeEach(() => {
                                dayElement.simulate("mouseleave");
                            });

                            it("shows [<startDate>, <endDate>] in input fields", () => {
                                assertInputTextsEqual(root, SELECTED_RANGE[0].str, SELECTED_RANGE[1].str);
                            });

                            it("moves focus back to end field", () => {
                                assertEndInputFocused(root);
                            });
                        });
                    });

                    describe("if <hoveredDate> == <endDate>", () => {
                        const DATE_CONFIG = HOVER_TEST_DATE_CONFIG_4;

                        beforeEach(() => {
                            dayElement = getDayElement(DATE_CONFIG.day);
                            dayElement.simulate("mouseenter");
                        });

                        it("shows [<startDate>, null] in input fields", () => {
                            assertInputTextsEqual(root, SELECTED_RANGE[0].str, "");
                        });

                        it("keeps focus on end field", () => {
                            assertEndInputFocused(root);
                        });

                        describe("on click", () => {
                            beforeEach(() => {
                                dayElement.simulate("click");
                            });

                            it("sets selection to [<startDate>, null]", () => {
                                assertInputTextsEqual(root, SELECTED_RANGE[0].str, "");
                            });

                            it("keeps focus on end field", () => {
                                assertEndInputFocused(root);
                            });
                        });

                        describe("if mouse moves to no longer be over a calendar day", () => {
                            beforeEach(() => {
                                dayElement.simulate("mouseleave");
                            });

                            it("shows [<startDate>, <endDate>] in input fields", () => {
                                assertInputTextsEqual(root, SELECTED_RANGE[0].str, SELECTED_RANGE[1].str);
                            });

                            it("keeps focus on end field", () => {
                                assertEndInputFocused(root);
                            });
                        });
                    });
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

            getStartInput(root).simulate("focus"); // to open popover
            getDayElement(START_DAY).simulate("click");
            assertDateRangesEqual(onChange.getCall(0).args[0], [null, END_STR]);
            assertInputTextsEqual(root, START_STR, END_STR);
            expect(onChange.callCount).to.equal(1);
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

        it("Clicking a start date causes focus to move to end field", () => {
            let controlledRoot: WrappedComponentRoot;

            const onChange = (nextValue: DateRange) => controlledRoot.setProps({ value: nextValue });
            const { root, getDayElement } = wrap(<DateRangeInput onChange={onChange} value={[null, null]} />);
            controlledRoot = root;

            getStartInput(root).simulate("focus");
            getDayElement(1).simulate("click"); // triggers a controlled value change
            assertEndInputFocused(root);
        });

        it(`Typing in a field while hovering over a date shows the typed date, not the hovered date`, () => {
            let controlledRoot: WrappedComponentRoot;

            const onChange = (nextValue: DateRange) => controlledRoot.setProps({ value: nextValue });
            const { root, getDayElement } = wrap(<DateRangeInput onChange={onChange} value={[null, null]} />);
            controlledRoot = root;

            getStartInput(root).simulate("focus");
            getDayElement(1).simulate("mouseenter");
            changeStartInputText(root, START_STR_2);
            assertInputTextsEqual(root, START_STR_2, "");
        });

        describe("Typing an out-of-range date", () => {
            let onChange: Sinon.SinonSpy;
            let onError: Sinon.SinonSpy;
            let root: WrappedComponentRoot;

            beforeEach(() => {
                onChange = sinon.spy();
                onError = sinon.spy();

                const result = wrap(<DateRangeInput
                    minDate={OUT_OF_RANGE_TEST_MIN}
                    maxDate={OUT_OF_RANGE_TEST_MAX}
                    onChange={onChange}
                    onError={onError}
                    outOfRangeMessage={OUT_OF_RANGE_MESSAGE}
                    value={[null, null]}
                />);
                root = result.root;
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

            function runTestForEachScenario(runTestFn: OutOfRangeTestFunction) {
                const { START, END } = DateRangeBoundary;
                it("if start < minDate", () => runTestFn(getStartInput(root), OUT_OF_RANGE_START_STR, START));
                it("if start > maxDate", () => runTestFn(getStartInput(root), OUT_OF_RANGE_END_STR, START));
                it("if end < minDate", () => runTestFn(getEndInput(root), OUT_OF_RANGE_START_STR, END));
                it("if end > maxDate", () => runTestFn(getEndInput(root), OUT_OF_RANGE_END_STR, END));
            }
        });

        describe("Typing an invalid date", () => {
            let onChange: Sinon.SinonSpy;
            let onError: Sinon.SinonSpy;
            let root: WrappedComponentRoot;

            beforeEach(() => {
                onChange = sinon.spy();
                onError = sinon.spy();

                const result = wrap(<DateRangeInput
                    invalidDateMessage={INVALID_MESSAGE}
                    onError={onError}
                    value={DATE_RANGE}
                />);
                root = result.root;

                changeStartInputText(root, "");
                changeEndInputText(root, "");
                root.setProps({ onChange });
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

            function runTestForEachScenario(runTestFn: InvalidDateTestFunction) {
                it("in start field", () => runTestFn(getStartInput(root), DateRangeBoundary.START, getEndInput(root)));
                it("in end field", () => runTestFn(getEndInput(root), DateRangeBoundary.END, getStartInput(root)));
            }
        });

        describe("Typing an overlapping date", () => {
            let onChange: Sinon.SinonSpy;
            let onError: Sinon.SinonSpy;
            let root: WrappedComponentRoot;
            let startInput: WrappedComponentInput;
            let endInput: WrappedComponentInput;

            beforeEach(() => {
                onChange = sinon.spy();
                onError = sinon.spy();

                const result = wrap(<DateRangeInput
                    overlappingDatesMessage={OVERLAPPING_DATES_MESSAGE}
                    onChange={onChange}
                    onError={onError}
                    value={DATE_RANGE}
                />);
                root = result.root;

                startInput = getStartInput(root);
                endInput = getEndInput(root);
            });

            describe("in the start field", () => {
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
            });

            describe("in the end field", () => {
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

            });
        });

        it("Clearing the dates in the picker invokes onChange with [null, null], but doesn't change the UI", () => {
            const onChange = sinon.spy();
            const value = [START_DATE, null] as DateRange;

            const { root, getDayElement } = wrap(<DateRangeInput value={value} onChange={onChange} />);

            // popover opens on focus
            getStartInput(root).simulate("focus");
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

    function getInputPlaceholderText(input: WrappedComponentInput) {
        return input.prop("placeholder");
    }

    function isStartInputFocused(root: WrappedComponentRoot) {
        // TODO: find a more elegant way to do this; reaching into component state is gross.
        return root.state("isStartInputFocused");
    }

    function isEndInputFocused(root: WrappedComponentRoot) {
        // TODO: find a more elegant way to do this; reaching into component state is gross.
        return root.state("isEndInputFocused");
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

    function assertStartInputFocused(root: WrappedComponentRoot) {
        expect(isStartInputFocused(root)).to.be.true;
    }

    function assertEndInputFocused(root: WrappedComponentRoot) {
        expect(isEndInputFocused(root)).to.be.true;
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

    function wrap(dateRangeInput: JSX.Element, attachTo?: HTMLElement) {
        const wrapper = mount(dateRangeInput, { attachTo });
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
