/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { expect } from "chai";
import { format, parse } from "date-fns";
import * as Locales from "date-fns/locale";
import esLocale from "date-fns/locale/es";
import { mount, type ReactWrapper } from "enzyme";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-dom/test-utils";
import * as sinon from "sinon";

import {
    Boundary,
    Classes as CoreClasses,
    type HTMLDivProps,
    type HTMLInputProps,
    InputGroup,
    type InputGroupProps,
    Popover,
    type PopoverProps,
} from "@blueprintjs/core";
import {
    type DateFormatProps,
    type DateRange,
    Classes as DatetimeClasses,
    Months,
    TimePrecision,
} from "@blueprintjs/datetime";
import { expectPropValidationError } from "@blueprintjs/test-commons";

import {
    DateRangeInput3,
    type DateRangeInput3Props,
    DateRangePicker3,
    Datetime2Classes,
    ReactDayPickerClasses,
} from "../../src";
import { loadDateFnsLocaleFake } from "../common/loadDateFnsLocaleFake";

type NullableRange<T> = [T | null, T | null];
type DateStringRange = NullableRange<string>;

type WrappedComponentRoot = ReactWrapper<any>;
type WrappedComponentInput = ReactWrapper<HTMLInputProps, any>;
type WrappedComponentDayElement = ReactWrapper<HTMLDivProps, any>;

type OutOfRangeTestFunction = (
    inputGetterFn: (root: WrappedComponentRoot) => WrappedComponentInput,
    inputString: string,
    boundary?: Boundary,
) => void;

type InvalidDateTestFunction = (
    inputGetterFn: (root: WrappedComponentRoot) => WrappedComponentInput,
    boundary: Boundary,
    otherInputGetterFn: (root: WrappedComponentRoot) => WrappedComponentInput,
) => void;

// Change the default for testability
DateRangeInput3.defaultProps.popoverProps = { usePortal: false };
(DateRangeInput3.defaultProps as DateRangeInput3Props).dateFnsLocaleLoader = loadDateFnsLocaleFake;

const DATE_FORMAT = getDateFnsFormatter("M/d/yyyy");
const DATETIME_FORMAT = getDateFnsFormatter("M/d/yyyy HH:mm:ss");

describe("<DateRangeInput3>", () => {
    let containerElement: HTMLElement | undefined;

    beforeEach(() => {
        containerElement = document.createElement("div");
        document.body.appendChild(containerElement);
    });

    afterEach(() => {
        if (containerElement !== undefined) {
            ReactDOM.unmountComponentAtNode(containerElement);
            containerElement.remove();
        }
    });

    const START_DAY = 22;
    const START_DATE = new Date(2022, Months.JANUARY, START_DAY);
    const START_STR = DATE_FORMAT.formatDate(START_DATE);
    const END_DAY = 24;
    const END_DATE = new Date(2022, Months.JANUARY, END_DAY);
    const END_STR = DATE_FORMAT.formatDate(END_DATE);
    const DATE_RANGE = [START_DATE, END_DATE] as DateRange;

    const START_DATE_2 = new Date(2022, Months.JANUARY, 1);
    const START_STR_2 = DATE_FORMAT.formatDate(START_DATE_2);
    const START_STR_2_ES_LOCALE = "1 de enero de 2022";
    const END_DATE_2 = new Date(2022, Months.JANUARY, 31);
    const END_STR_2 = DATE_FORMAT.formatDate(END_DATE_2);
    const END_STR_2_ES_LOCALE = "31 de enero de 2022";
    const DATE_RANGE_2 = [START_DATE_2, END_DATE_2] as DateRange;

    const INVALID_STR = "<this is an invalid date string>";
    const INVALID_MESSAGE = "Custom invalid-date message";

    const OUT_OF_RANGE_TEST_MIN = new Date(2000, 1, 1);
    const OUT_OF_RANGE_TEST_MAX = new Date(2030, 1, 1);
    const OUT_OF_RANGE_START_DATE = new Date(1000, 1, 1);
    const OUT_OF_RANGE_START_STR = DATE_FORMAT.formatDate(OUT_OF_RANGE_START_DATE);
    const OUT_OF_RANGE_END_DATE = new Date(3000, 1, 1);
    const OUT_OF_RANGE_END_STR = DATE_FORMAT.formatDate(OUT_OF_RANGE_END_DATE);
    const OUT_OF_RANGE_MESSAGE = "Custom out-of-range message";

    const OVERLAPPING_DATES_MESSAGE = "Custom overlapping-dates message";
    const OVERLAPPING_START_DATE = END_DATE_2; // should be later then END_DATE
    const OVERLAPPING_END_DATE = START_DATE_2; // should be earlier then START_DATE
    const OVERLAPPING_START_STR = DATE_FORMAT.formatDate(OVERLAPPING_START_DATE);
    const OVERLAPPING_END_STR = DATE_FORMAT.formatDate(OVERLAPPING_END_DATE);

    const OVERLAPPING_START_DATETIME = new Date(2022, Months.JANUARY, 1, 9); // should be same date but later time
    const OVERLAPPING_END_DATETIME = new Date(2022, Months.JANUARY, 1, 1); // should be same date but earlier time
    const OVERLAPPING_START_DT_STR = DATETIME_FORMAT.formatDate(OVERLAPPING_START_DATETIME);
    const OVERLAPPING_END_DT_STR = DATETIME_FORMAT.formatDate(OVERLAPPING_END_DATETIME);
    const DATE_RANGE_3 = [OVERLAPPING_END_DATETIME, OVERLAPPING_START_DATETIME] as DateRange; // initial state should be correct

    // a custom string representation for `new Date(undefined)` that we use in
    // date-range equality checks just in this file
    const UNDEFINED_DATE_STR = "<UNDEFINED DATE>";

    it("renders with two InputGroup children", () => {
        const component = mount(<DateRangeInput3 {...DATE_FORMAT} />);
        expect(component.find(InputGroup).length).to.equal(2);
    });

    it("passes custom classNames to popover wrapper", () => {
        const CLASS_1 = "foo";
        const CLASS_2 = "bar";

        const wrapper = mount(
            <DateRangeInput3
                {...DATE_FORMAT}
                className={CLASS_1}
                popoverProps={{ className: CLASS_2, usePortal: false }}
            />,
        );
        wrapper.setState({ isOpen: true });

        const popoverTarget = wrapper.find(`.${CoreClasses.POPOVER_TARGET}`).hostNodes();
        expect(popoverTarget.hasClass(CLASS_1)).to.be.true;
        expect(popoverTarget.hasClass(CLASS_2)).to.be.true;
    });

    it("inner DateRangePicker3 receives all supported props", () => {
        const component = mount(<DateRangeInput3 {...DATE_FORMAT} locale="uk" contiguousCalendarMonths={false} />);
        component.setState({ isOpen: true });
        component.update();
        const picker = component.find(DateRangePicker3);
        expect(picker.prop("locale")).to.equal("uk");
        expect(picker.prop("contiguousCalendarMonths")).to.be.false;
    });

    it("shows empty fields when no date range is selected", () => {
        const { root } = wrap(<DateRangeInput3 {...DATE_FORMAT} />);
        assertInputValuesEqual(root, "", "");
    });

    it("throws error if value === null", () => {
        expectPropValidationError(DateRangeInput3, { ...DATE_FORMAT, value: null! });
    });

    describe("timePrecision prop", () => {
        it("<TimePicker /> should not lose focus on increment/decrement with up/down arrows", () => {
            const { root } = wrap(<DateRangeInput3 {...DATE_FORMAT} timePrecision={TimePrecision.MINUTE} />, true);

            root.setState({ isOpen: true }).update();
            expect(root.find(Popover).prop("isOpen"), "Popover isOpen").to.be.true;

            keyDownOnInput(DatetimeClasses.TIMEPICKER_HOUR, "ArrowUp");
            expect(isStartInputFocused(root), "start input is focused").to.be.false;
            expect(isEndInputFocused(root), "end input is focused").to.be.false;
        });

        it("when timePrecision != null && closeOnSelection=true && <TimePicker /> values is changed popover should not close", () => {
            const { root, getDayElement } = wrap(
                <DateRangeInput3 {...DATE_FORMAT} timePrecision={TimePrecision.MINUTE} />,
                true,
            );

            root.setState({ isOpen: true }).update();

            getDayElement(1).simulate("click");
            getDayElement(10).simulate("click");

            root.setState({ isOpen: true }).update();

            keyDownOnInput(DatetimeClasses.TIMEPICKER_HOUR, "ArrowUp");
            root.update();
            expect(root.find(Popover).prop("isOpen")).to.be.true;
        });

        it("when timePrecision != null && closeOnSelection=true && end <TimePicker /> values is changed directly (without setting the selectedEnd date) - popover should not close", () => {
            const { root } = wrap(<DateRangeInput3 {...DATE_FORMAT} timePrecision={TimePrecision.MINUTE} />, true);

            root.setState({ isOpen: true });
            keyDownOnInput(DatetimeClasses.TIMEPICKER_HOUR, "ArrowUp");
            root.update();
            keyDownOnInput(DatetimeClasses.TIMEPICKER_HOUR, "ArrowUp", 1);
            root.update();
            expect(root.find(Popover).prop("isOpen")).to.be.true;
        });

        function keyDownOnInput(className: string, key: string, inputElementIndex: number = 0) {
            TestUtils.Simulate.keyDown(findTimePickerInputElement(className, inputElementIndex), { key });
        }

        function findTimePickerInputElement(className: string, inputElementIndex: number = 0) {
            return document.querySelectorAll<HTMLInputElement>(`.${DatetimeClasses.TIMEPICKER_INPUT}.${className}`)[
                inputElementIndex
            ];
        }
    });

    describe("startInputProps and endInputProps", () => {
        it("startInput is disabled when startInputProps={ disabled: true }", () => {
            const { root } = wrap(<DateRangeInput3 {...DATE_FORMAT} startInputProps={{ disabled: true }} />);
            const startInput = getStartInput(root);

            startInput.simulate("click");
            expect(root.find(Popover).prop("isOpen")).to.be.false;
            expect(startInput.prop("disabled")).to.be.true;
        });

        it("endInput is not disabled when startInputProps={ disabled: true }", () => {
            const { root } = wrap(<DateRangeInput3 {...DATE_FORMAT} startInputProps={{ disabled: true }} />);
            const endInput = getEndInput(root);
            expect(endInput.prop("disabled")).to.be.false;
        });

        it("endInput is disabled when endInputProps={ disabled: true }", () => {
            const { root } = wrap(<DateRangeInput3 {...DATE_FORMAT} endInputProps={{ disabled: true }} />);
            const endInput = getEndInput(root);

            endInput.simulate("click");
            expect(root.find(Popover).prop("isOpen")).to.be.false;
            expect(endInput.prop("disabled")).to.be.true;
        });

        it("startInput is not disabled when endInputProps={ disabled: true }", () => {
            const { root } = wrap(<DateRangeInput3 {...DATE_FORMAT} endInputProps={{ disabled: true }} />);
            const startInput = getStartInput(root);
            expect(startInput.prop("disabled")).to.be.false;
        });

        describe("startInputProps", () => {
            runTestSuite(getStartInput, inputGroupProps => {
                return mount(<DateRangeInput3 {...DATE_FORMAT} startInputProps={inputGroupProps} />);
            });
        });

        describe("endInputProps", () => {
            runTestSuite(getEndInput, inputGroupProps => {
                return mount(<DateRangeInput3 {...DATE_FORMAT} endInputProps={inputGroupProps} />);
            });
        });

        function runTestSuite(
            inputGetterFn: (root: WrappedComponentRoot) => WrappedComponentInput,
            mountFn: (inputGroupProps: InputGroupProps) => any,
        ) {
            it("allows custom placeholder text", () => {
                const root = mountFn({ placeholder: "Hello" });
                expect(getInputPlaceholderText(inputGetterFn(root))).to.equal("Hello");
            });

            it("supports custom style", () => {
                const root = mountFn({ style: { background: "yellow" } });
                const inputElement = inputGetterFn(root).getDOMNode() as HTMLElement;
                expect(inputElement.style.background).to.equal("yellow");
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
            const MIN_DATE = new Date(2022, Months.JANUARY, 1);
            const MAX_DATE = new Date(2022, Months.JANUARY, 31);
            const { root } = wrap(<DateRangeInput3 {...DATE_FORMAT} minDate={MIN_DATE} maxDate={MAX_DATE} />);

            const startInput = getStartInput(root);
            const endInput = getEndInput(root);

            expect(getInputPlaceholderText(startInput)).to.equal("Start date");
            expect(getInputPlaceholderText(endInput)).to.equal("End date");

            startInput.simulate("focus");
            expect(getInputPlaceholderText(startInput)).to.equal(DATE_FORMAT.formatDate(MIN_DATE));
            startInput.simulate("blur");
            endInput.simulate("focus");
            expect(getInputPlaceholderText(endInput)).to.equal(DATE_FORMAT.formatDate(MAX_DATE));
        });

        // need to check this case, because formatted min/max date strings are cached internally
        // until props change again
        it("updates placeholder text properly when min/max dates change", () => {
            const MIN_DATE_1 = new Date(2022, Months.JANUARY, 1);
            const MAX_DATE_1 = new Date(2022, Months.JANUARY, 31);
            const MIN_DATE_2 = new Date(2022, Months.JANUARY, 2);
            const MAX_DATE_2 = new Date(2022, Months.FEBRUARY, 1);
            const { root } = wrap(<DateRangeInput3 {...DATE_FORMAT} minDate={MIN_DATE_1} maxDate={MAX_DATE_1} />);

            const startInput = getStartInput(root);
            const endInput = getEndInput(root);

            // change while end input is still focused to make sure things change properly in spite of that
            endInput.simulate("focus");
            root.setProps({ minDate: MIN_DATE_2, maxDate: MAX_DATE_2 });

            endInput.simulate("blur");
            startInput.simulate("focus");
            expect(getInputPlaceholderText(startInput)).to.equal(DATE_FORMAT.formatDate(MIN_DATE_2));
            startInput.simulate("blur");
            endInput.simulate("focus");
            expect(getInputPlaceholderText(endInput)).to.equal(DATE_FORMAT.formatDate(MAX_DATE_2));
        });

        it("updates placeholder text properly when format changes", () => {
            const MIN_DATE = new Date(2022, Months.JANUARY, 1);
            const MAX_DATE = new Date(2022, Months.JANUARY, 31);
            const { root } = wrap(<DateRangeInput3 {...DATE_FORMAT} minDate={MIN_DATE} maxDate={MAX_DATE} />);

            const startInput = getStartInput(root);
            const endInput = getEndInput(root);

            root.setProps({ format: "MM/DD/YYYY" });

            startInput.simulate("focus");
            expect(getInputPlaceholderText(startInput)).to.equal("01/01/2022");
            startInput.simulate("blur");
            endInput.simulate("focus");
            expect(getInputPlaceholderText(endInput)).to.equal("01/31/2022");
        });
    });

    it("inputs disable and popover doesn't open if disabled=true", () => {
        const { root } = wrap(<DateRangeInput3 {...DATE_FORMAT} disabled={true} />);
        const startInput = getStartInput(root);
        startInput.simulate("click");
        expect(root.find(Popover).prop("isOpen")).to.be.false;
        expect(startInput.prop("disabled")).to.be.true;
        expect(getEndInput(root).prop("disabled")).to.be.true;
    });

    describe("closeOnSelection", () => {
        it("if closeOnSelection=false, popover stays open when full date range is selected", () => {
            const { root, getDayElement } = wrap(<DateRangeInput3 {...DATE_FORMAT} closeOnSelection={false} />, true);
            root.setState({ isOpen: true }).update();
            getDayElement(1).simulate("click");
            getDayElement(10).simulate("click");
            expect(root.state("isOpen")).to.be.true;
            root.unmount();
        });

        it("if closeOnSelection=true, popover closes when full date range is selected", () => {
            const { root, getDayElement } = wrap(<DateRangeInput3 {...DATE_FORMAT} />, true);
            root.setState({ isOpen: true }).update();
            getDayElement(1).simulate("click");
            getDayElement(10).simulate("click");
            expect(root.state("isOpen")).to.be.false;
            root.unmount();
        });

        it("if closeOnSelection=true && timePrecision != null, popover closes when full date range is selected", () => {
            const { root, getDayElement } = wrap(
                <DateRangeInput3 {...DATE_FORMAT} timePrecision={TimePrecision.MINUTE} />,
                true,
            );
            root.setState({ isOpen: true }).update();
            getDayElement(1).simulate("click");
            getDayElement(10).simulate("click");
            root.update();
            expect(root.state("isOpen")).to.be.false;
            root.unmount();
        });
    });

    it("accepts contiguousCalendarMonths prop and passes it to the date range picker", () => {
        const { root } = wrap(<DateRangeInput3 {...DATE_FORMAT} contiguousCalendarMonths={false} />);
        root.setState({ isOpen: true }).update();
        expect(root.find(DateRangePicker3).prop("contiguousCalendarMonths")).to.be.false;
    });

    it("accepts singleMonthOnly prop and passes it to the date range picker", () => {
        const { root } = wrap(<DateRangeInput3 {...DATE_FORMAT} singleMonthOnly={false} />);
        root.setState({ isOpen: true }).update();
        expect(root.find(DateRangePicker3).prop("singleMonthOnly")).to.be.false;
    });

    it("accepts shortcuts prop and passes it to the date range picker", () => {
        const { root } = wrap(<DateRangeInput3 {...DATE_FORMAT} shortcuts={false} />);
        root.setState({ isOpen: true }).update();
        expect(root.find(DateRangePicker3).prop("shortcuts")).to.be.false;
    });

    it("should update the selectedShortcutIndex state when clicking on a shortcut", () => {
        const selectedShortcut = 1;
        const { root } = wrap(<DateRangeInput3 {...DATE_FORMAT} />);

        root.setState({ isOpen: true }).update();
        root.find(DateRangePicker3)
            .find(`.${DatetimeClasses.DATERANGEPICKER_SHORTCUTS}`)
            .find("a")
            .at(selectedShortcut)
            .simulate("click");
        expect(root.state("selectedShortcutIndex")).equals(selectedShortcut);
    });

    it("pressing Shift+Tab in the start field blurs the start field and closes the popover", () => {
        const startInputProps = { onKeyDown: sinon.spy() };
        const { root } = wrap(<DateRangeInput3 {...DATE_FORMAT} {...{ startInputProps }} />);
        const startInput = getStartInput(root);
        startInput.simulate("keydown", { key: "Tab", shiftKey: true });
        expect(root.state("isStartInputFocused"), "start input blurred").to.be.false;
        expect(startInputProps.onKeyDown.calledOnce, "onKeyDown called once").to.be.true;
        expect(root.state("isOpen"), "popover closed").to.be.false;
    });

    it("pressing Tab in the end field blurs the end field and closes the popover", () => {
        const endInputProps = { onKeyDown: sinon.spy() };
        const { root } = wrap(<DateRangeInput3 {...DATE_FORMAT} {...{ endInputProps }} />);
        const endInput = getEndInput(root);
        endInput.simulate("keydown", { key: "Tab" });
        expect(root.state("isEndInputFocused"), "end input blurred").to.be.false;
        expect(endInputProps.onKeyDown.calledOnce, "onKeyDown called once").to.be.true;
        expect(root.state("isOpen"), "popover closed").to.be.false;
    });

    describe("selectAllOnFocus", () => {
        it("if false (the default), does not select any text on focus", () => {
            const { root } = wrap(<DateRangeInput3 {...DATE_FORMAT} defaultValue={[START_DATE, null]} />, true);

            const startInput = getStartInput(root);
            startInput.simulate("focus");

            const startInputNode = containerElement!.querySelectorAll("input")[0];
            expect(startInputNode.selectionStart).to.equal(startInputNode.selectionEnd);
        });

        it("if true, selects all text on focus", () => {
            const { root } = wrap(
                <DateRangeInput3 {...DATE_FORMAT} defaultValue={[START_DATE, null]} selectAllOnFocus={true} />,
                true,
            );

            const startInput = getStartInput(root);
            startInput.simulate("focus");

            const startInputNode = containerElement!.querySelectorAll("input")[0];
            expect(startInputNode.selectionStart).to.equal(0);
            expect(startInputNode.selectionEnd).to.equal(START_STR.length);
        });

        it.skip("if true, selects all text on day mouseenter in calendar", () => {
            const { root, getDayElement } = wrap(
                <DateRangeInput3 {...DATE_FORMAT} defaultValue={[START_DATE, null]} selectAllOnFocus={true} />,
                true,
            );

            root.setState({ isOpen: true });
            // getDay is 0-indexed, but getDayElement is 1-indexed
            getDayElement(START_DATE_2.getDay() + 1).simulate("mouseenter");

            const startInputNode = containerElement!.querySelectorAll("input")[0];
            expect(startInputNode.selectionStart).to.equal(0);
            expect(startInputNode.selectionEnd).to.equal(START_STR.length);
        });
    });

    describe("allowSingleDayRange", () => {
        it("allows start and end to be the same day when clicking", () => {
            const { root, getDayElement } = wrap(
                <DateRangeInput3 {...DATE_FORMAT} allowSingleDayRange={true} defaultValue={[START_DATE, END_DATE]} />,
            );
            getEndInput(root).simulate("focus");
            getDayElement(END_DAY).simulate("click");
            getDayElement(START_DAY).simulate("click");
            assertInputValuesEqual(root, START_STR, START_STR);
        });

        it("allows start and end to be the same day when typing", () => {
            const { root } = wrap(
                <DateRangeInput3 {...DATE_FORMAT} allowSingleDayRange={true} defaultValue={[START_DATE, END_DATE]} />,
            );
            changeEndInputText(root, "");
            changeEndInputText(root, START_STR);
            assertInputValuesEqual(root, START_STR, START_STR);
        });
    });

    describe("popoverProps", () => {
        it("accepts custom popoverProps", () => {
            const popoverProps: Partial<PopoverProps> = {
                backdropProps: {},
                placement: "top-start",
                usePortal: false,
            };
            const popover = wrap(<DateRangeInput3 {...DATE_FORMAT} popoverProps={popoverProps} />).root.find(Popover);
            expect(popover.prop("backdropProps")).to.equal(popoverProps.backdropProps);
            expect(popover.prop("placement")).to.equal(popoverProps.placement);
        });

        it("ignores autoFocus, enforceFocus, and content in custom popoverProps", () => {
            const CUSTOM_CONTENT = "Here is some custom content";
            const popoverProps = {
                autoFocus: true,
                content: CUSTOM_CONTENT,
                enforceFocus: true,
                usePortal: false,
            };
            const popover = wrap(<DateRangeInput3 {...DATE_FORMAT} popoverProps={popoverProps} />).root.find(Popover);
            // this test assumes the following values will be the defaults internally
            expect(popover.prop("autoFocus")).to.be.false;
            expect(popover.prop("enforceFocus")).to.be.false;
            expect(popover.prop("content")).to.not.equal(CUSTOM_CONTENT);
        });
    });

    describe("when uncontrolled", () => {
        it("Shows empty fields when defaultValue is [null, null]", () => {
            const { root } = wrap(<DateRangeInput3 {...DATE_FORMAT} defaultValue={[null, null]} />);
            assertInputValuesEqual(root, "", "");
        });

        it("Shows empty start field and formatted date in end field when defaultValue is [null, <date>]", () => {
            const { root } = wrap(<DateRangeInput3 {...DATE_FORMAT} defaultValue={[null, END_DATE]} />);
            assertInputValuesEqual(root, "", END_STR);
        });

        it("Shows empty end field and formatted date in start field when defaultValue is [<date>, null]", () => {
            const { root } = wrap(<DateRangeInput3 {...DATE_FORMAT} defaultValue={[START_DATE, null]} />);
            assertInputValuesEqual(root, START_STR, "");
        });

        it("Shows formatted dates in both fields when defaultValue is [<date1>, <date2>]", () => {
            const { root } = wrap(<DateRangeInput3 {...DATE_FORMAT} defaultValue={[START_DATE, END_DATE]} />);
            assertInputValuesEqual(root, START_STR, END_STR);
        });

        // HACKHACK: https://github.com/palantir/blueprint/issues/6109
        // N.B. this test passes locally
        it.skip("Pressing Enter saves the inputted date and closes the popover", () => {
            const startInputProps = { onKeyDown: sinon.spy() };
            const endInputProps = { onKeyDown: sinon.spy() };
            const { root } = wrap(<DateRangeInput3 {...DATE_FORMAT} {...{ startInputProps, endInputProps }} />);
            root.setState({ isOpen: true });

            // Don't save the input elements into variables; they can become
            // stale across React updates.

            getStartInput(root).simulate("focus");
            getStartInput(root).simulate("change", { target: { value: START_STR } });
            getStartInput(root).simulate("keydown", { key: "Enter" });
            expect(startInputProps.onKeyDown.calledOnce, "startInputProps.onKeyDown called once");
            expect(isStartInputFocused(root), "start input still focused").to.be.false;

            expect(root.state("isOpen"), "popover still open").to.be.true;

            getEndInput(root).simulate("focus");
            getEndInput(root).simulate("change", { target: { value: END_STR } });
            getEndInput(root).simulate("keydown", { key: "Enter" });
            expect(endInputProps.onKeyDown.calledOnce, "endInputProps.onKeyDown called once");
            expect(isEndInputFocused(root), "end input still focused").to.be.true;

            expect(getStartInput(root).prop("value"), "startInput value is correct").to.equal(START_STR);
            expect(getEndInput(root).prop("value"), "endInput value is correct").to.equal(END_STR);

            expect(root.state("isOpen"), "popover closed at end").to.be.false;
        });

        it("Clicking a date invokes onChange with the new date range and updates the input fields", () => {
            const defaultValue = [START_DATE, null] as DateRange;

            const onChange = sinon.spy();
            const { root, getDayElement } = wrap(
                <DateRangeInput3
                    {...DATE_FORMAT}
                    closeOnSelection={false}
                    defaultValue={defaultValue}
                    onChange={onChange}
                />,
            );
            root.setState({ isOpen: true }).update();

            getDayElement(END_DAY).simulate("click");
            assertDateRangesEqual(onChange.getCall(0).args[0], [START_STR, END_STR]);
            assertInputValuesEqual(root, START_STR, END_STR);

            getDayElement(START_DAY).simulate("click");
            assertDateRangesEqual(onChange.getCall(1).args[0], [null, END_STR]);
            assertInputValuesEqual(root, "", END_STR);

            getDayElement(END_DAY).simulate("click");
            assertDateRangesEqual(onChange.getCall(2).args[0], [null, null]);
            assertInputValuesEqual(root, "", "");

            getDayElement(START_DAY).simulate("click");
            assertDateRangesEqual(onChange.getCall(3).args[0], [START_STR, null]);
            assertInputValuesEqual(root, START_STR, "");

            expect(onChange.callCount).to.equal(4);
        });

        it(`Typing a valid start or end date invokes onChange with the new date range and updates the
            input fields`, () => {
            const onChange = sinon.spy();
            const { root } = wrap(<DateRangeInput3 {...DATE_FORMAT} onChange={onChange} defaultValue={DATE_RANGE} />);

            changeStartInputText(root, START_STR_2);
            expect(onChange.callCount).to.equal(1);
            assertDateRangesEqual(onChange.getCall(0).args[0], [START_STR_2, END_STR]);
            assertInputValuesEqual(root, START_STR_2, END_STR);

            changeEndInputText(root, END_STR_2);
            expect(onChange.callCount).to.equal(2);
            assertDateRangesEqual(onChange.getCall(1).args[0], [START_STR_2, END_STR_2]);
            assertInputValuesEqual(root, START_STR_2, END_STR_2);
        });

        it(`Typing in a field while hovering over a date shows the typed date, not the hovered date`, () => {
            const onChange = sinon.spy();
            const { root, getDayElement } = wrap(
                <DateRangeInput3 {...DATE_FORMAT} onChange={onChange} defaultValue={DATE_RANGE} />,
            );

            getStartInput(root).simulate("focus");
            getDayElement(1).simulate("mouseenter");
            changeStartInputText(root, START_STR_2);
            assertInputValuesEqual(root, START_STR_2, END_STR);
        });

        describe("Typing an out-of-range date", () => {
            // we run the same four tests for each of several cases. putting
            // setup logic in beforeEach lets us express our it(...) tests as
            // nice one-liners further down this block, and it also gives
            // certain tests easy access to onError/onChange if they need it.

            let onChange: sinon.SinonSpy;
            let onError: sinon.SinonSpy;
            let root: WrappedComponentRoot;

            beforeEach(() => {
                onChange = sinon.spy();
                onError = sinon.spy();

                // use defaultValue to specify the calendar months in view
                const result = wrap(
                    <DateRangeInput3
                        {...DATE_FORMAT}
                        defaultValue={DATE_RANGE}
                        minDate={OUT_OF_RANGE_TEST_MIN}
                        maxDate={OUT_OF_RANGE_TEST_MAX}
                        onError={onError}
                        outOfRangeMessage={OUT_OF_RANGE_MESSAGE}
                    />,
                );
                root = result.root;

                // clear the fields *before* setting up an onChange callback to
                // keep onChange.callCount at 0 before tests run
                changeStartInputText(root, "");
                changeEndInputText(root, "");
                root.setProps({ onChange });
            });

            describe("shows the error message on blur", () => {
                runTestForEachScenario((inputGetterFn, inputString) => {
                    changeInputText(inputGetterFn(root), inputString);
                    inputGetterFn(root).simulate("blur");
                    assertInputValueEquals(inputGetterFn(root), OUT_OF_RANGE_MESSAGE);
                });
            });

            describe("shows the offending date in the field on focus", () => {
                runTestForEachScenario((inputGetterFn, inputString) => {
                    changeInputText(inputGetterFn(root), inputString);
                    inputGetterFn(root).simulate("blur");
                    inputGetterFn(root).simulate("focus");
                    assertInputValueEquals(inputGetterFn(root), inputString);
                });
            });

            describe("calls onError with invalid date on blur", () => {
                runTestForEachScenario((inputGetterFn, inputString, boundary) => {
                    const expectedRange: DateStringRange =
                        boundary === Boundary.START ? [inputString, null] : [null, inputString];
                    inputGetterFn(root).simulate("focus");
                    changeInputText(inputGetterFn(root), inputString);
                    expect(onError.called).to.be.false;
                    inputGetterFn(root).simulate("blur");
                    expect(onError.calledOnce).to.be.true;
                    assertDateRangesEqual(onError.getCall(0).args[0], expectedRange);
                });
            });

            describe("does NOT call onChange before OR after blur", () => {
                runTestForEachScenario((inputGetterFn, inputString) => {
                    inputGetterFn(root).simulate("focus");
                    changeInputText(inputGetterFn(root), inputString);
                    expect(onChange.called).to.be.false;
                    inputGetterFn(root).simulate("blur");
                    expect(onChange.called).to.be.false;
                });
            });

            describe("removes error message if input is changed to an in-range date again", () => {
                runTestForEachScenario((inputGetterFn, inputString) => {
                    changeInputText(inputGetterFn(root), inputString);
                    inputGetterFn(root).simulate("blur");

                    const IN_RANGE_DATE_STR = START_STR;
                    inputGetterFn(root).simulate("focus");
                    changeInputText(inputGetterFn(root), IN_RANGE_DATE_STR);
                    inputGetterFn(root).simulate("blur");
                    assertInputValueEquals(inputGetterFn(root), IN_RANGE_DATE_STR);
                });
            });

            function runTestForEachScenario(runTestFn: OutOfRangeTestFunction) {
                const { START, END } = Boundary; // deconstruct to keep line lengths under threshold
                it("if start < minDate", () => runTestFn(getStartInput, OUT_OF_RANGE_START_STR, START));
                it("if start > maxDate", () => runTestFn(getStartInput, OUT_OF_RANGE_END_STR, START));
                it("if end < minDate", () => runTestFn(getEndInput, OUT_OF_RANGE_START_STR, END));
                it("if end > maxDate", () => runTestFn(getEndInput, OUT_OF_RANGE_END_STR, END));
            }
        });

        describe("Typing an invalid date", () => {
            let onChange: sinon.SinonSpy;
            let onError: sinon.SinonSpy;
            let root: WrappedComponentRoot;

            beforeEach(() => {
                onChange = sinon.spy();
                onError = sinon.spy();

                const result = wrap(
                    <DateRangeInput3
                        {...DATE_FORMAT}
                        defaultValue={DATE_RANGE}
                        invalidDateMessage={INVALID_MESSAGE}
                        onError={onError}
                    />,
                );
                root = result.root;

                // clear the fields *before* setting up an onChange callback to
                // keep onChange.callCount at 0 before tests run
                changeStartInputText(root, "");
                changeEndInputText(root, "");
                root.setProps({ onChange });
            });

            describe("shows the error message on blur", () => {
                runTestForEachScenario(inputGetterFn => {
                    inputGetterFn(root).simulate("focus");
                    changeInputText(inputGetterFn(root), INVALID_STR);
                    inputGetterFn(root).simulate("blur");
                    assertInputValueEquals(inputGetterFn(root), INVALID_MESSAGE);
                });
            });

            describe("keeps showing the error message on next focus", () => {
                runTestForEachScenario(inputGetterFn => {
                    inputGetterFn(root).simulate("focus");
                    changeInputText(inputGetterFn(root), INVALID_STR);
                    inputGetterFn(root).simulate("blur");
                    inputGetterFn(root).simulate("focus");
                    assertInputValueEquals(inputGetterFn(root), INVALID_MESSAGE);
                });
            });

            describe("calls onError on blur with Date(undefined) in place of the invalid date", () => {
                runTestForEachScenario((inputGetterFn, boundary) => {
                    inputGetterFn(root).simulate("focus");
                    changeInputText(inputGetterFn(root), INVALID_STR);
                    expect(onError.called).to.be.false;
                    inputGetterFn(root).simulate("blur");
                    expect(onError.calledOnce).to.be.true;

                    const dateRange = onError.getCall(0).args[0];
                    const dateIndex = boundary === Boundary.START ? 0 : 1;
                    expect((dateRange[dateIndex] as Date).valueOf()).to.be.NaN;
                });
            });

            describe("does NOT call onChange before OR after blur", () => {
                runTestForEachScenario(inputGetterFn => {
                    inputGetterFn(root).simulate("focus");
                    changeInputText(inputGetterFn(root), INVALID_STR);
                    expect(onChange.called).to.be.false;
                    inputGetterFn(root).simulate("blur");
                    expect(onChange.called).to.be.false;
                });
            });

            describe("removes error message if input is changed to an in-range date again", () => {
                runTestForEachScenario(inputGetterFn => {
                    inputGetterFn(root).simulate("focus");
                    changeInputText(inputGetterFn(root), INVALID_STR);
                    inputGetterFn(root).simulate("blur");

                    // just use START_STR for this test, because it will be
                    // valid in either field.
                    const VALID_STR = START_STR;
                    inputGetterFn(root).simulate("focus");
                    changeInputText(inputGetterFn(root), VALID_STR);
                    inputGetterFn(root).simulate("blur");
                    assertInputValueEquals(inputGetterFn(root), VALID_STR);
                });
            });

            describe("calls onChange if last-edited boundary is in range and the other boundary is out of range", () => {
                runTestForEachScenario((inputGetterFn, boundary, otherInputGetterFn) => {
                    otherInputGetterFn(root).simulate("focus");
                    changeInputText(otherInputGetterFn(root), INVALID_STR);
                    otherInputGetterFn(root).simulate("blur");
                    expect(onChange.called).to.be.false;

                    const VALID_STR = START_STR;
                    inputGetterFn(root).simulate("focus");
                    changeInputText(inputGetterFn(root), VALID_STR);
                    expect(onChange.calledOnce).to.be.true; // because latest date is valid

                    const actualRange = onChange.getCall(0).args[0];
                    const expectedRange: DateStringRange =
                        boundary === Boundary.START ? [VALID_STR, UNDEFINED_DATE_STR] : [UNDEFINED_DATE_STR, VALID_STR];

                    assertDateRangesEqual(actualRange, expectedRange);
                });
            });

            function runTestForEachScenario(runTestFn: InvalidDateTestFunction) {
                it("in start field", () => runTestFn(getStartInput, Boundary.START, getEndInput));
                it("in end field", () => runTestFn(getEndInput, Boundary.END, getStartInput));
            }
        });

        describe("Typing an overlapping date time", () => {
            let onChange: sinon.SinonSpy;
            let onError: sinon.SinonSpy;
            let root: WrappedComponentRoot;

            beforeEach(() => {
                onChange = sinon.spy();
                onError = sinon.spy();

                const result = wrap(
                    <DateRangeInput3
                        {...DATETIME_FORMAT}
                        allowSingleDayRange={true}
                        defaultValue={DATE_RANGE_3}
                        overlappingDatesMessage={OVERLAPPING_DATES_MESSAGE}
                        onChange={onChange}
                        onError={onError}
                        timePrecision={TimePrecision.MINUTE}
                    />,
                );
                root = result.root;
            });

            describe("in the end field", () => {
                it("shows an error message when the start time is later than the end time", () => {
                    getStartInput(root).simulate("focus");
                    changeInputText(getStartInput(root), OVERLAPPING_START_DT_STR);
                    getStartInput(root).simulate("blur");
                    assertInputValueEquals(getStartInput(root), OVERLAPPING_START_DT_STR);
                    getEndInput(root).simulate("focus");
                    changeInputText(getEndInput(root), OVERLAPPING_END_DT_STR);
                    getEndInput(root).simulate("blur");
                    assertInputValueEquals(getEndInput(root), OVERLAPPING_DATES_MESSAGE);
                });
            });
        });

        // this test sub-suite is structured a little differently because of the
        // different semantics of this error case in each field
        describe("Typing an overlapping date", () => {
            let onChange: sinon.SinonSpy;
            let onError: sinon.SinonSpy;
            let root: WrappedComponentRoot;

            beforeEach(() => {
                onChange = sinon.spy();
                onError = sinon.spy();

                const result = wrap(
                    <DateRangeInput3
                        {...DATE_FORMAT}
                        defaultValue={DATE_RANGE}
                        overlappingDatesMessage={OVERLAPPING_DATES_MESSAGE}
                        onChange={onChange}
                        onError={onError}
                    />,
                );
                root = result.root;
            });

            describe("in the start field", () => {
                it("shows an error message in the end field right away", () => {
                    getStartInput(root).simulate("focus");
                    changeInputText(getStartInput(root), OVERLAPPING_START_STR);
                    assertInputValueEquals(getEndInput(root), OVERLAPPING_DATES_MESSAGE);
                });

                it("shows the offending date in the end field on focus in the end field", () => {
                    getStartInput(root).simulate("focus");
                    changeInputText(getStartInput(root), OVERLAPPING_START_STR);
                    getStartInput(root).simulate("blur");
                    getEndInput(root).simulate("focus");
                    assertInputValueEquals(getEndInput(root), END_STR);
                });

                it("calls onError with [<overlappingDate>, <endDate] on blur", () => {
                    getStartInput(root).simulate("focus");
                    changeInputText(getStartInput(root), OVERLAPPING_START_STR);
                    expect(onError.called).to.be.false;
                    getStartInput(root).simulate("blur");
                    expect(onError.calledOnce).to.be.true;
                    assertDateRangesEqual(onError.getCall(0).args[0], [OVERLAPPING_START_STR, END_STR]);
                });

                it("does NOT call onChange before OR after blur", () => {
                    getStartInput(root).simulate("focus");
                    changeInputText(getStartInput(root), OVERLAPPING_START_STR);
                    expect(onChange.called).to.be.false;
                    getStartInput(root).simulate("blur");
                    expect(onChange.called).to.be.false;
                });

                it("removes error message if input is changed to an in-range date again", () => {
                    getStartInput(root).simulate("focus");
                    changeInputText(getStartInput(root), OVERLAPPING_START_STR);
                    changeInputText(getStartInput(root), START_STR);
                    assertInputValueEquals(getEndInput(root), END_STR);
                });
            });

            describe("in the end field", () => {
                it("shows an error message in the end field on blur", () => {
                    getEndInput(root).simulate("focus");
                    changeInputText(getEndInput(root), OVERLAPPING_END_STR);
                    assertInputValueEquals(getEndInput(root), OVERLAPPING_END_STR);
                    getEndInput(root).simulate("blur");
                    assertInputValueEquals(getEndInput(root), OVERLAPPING_DATES_MESSAGE);
                });

                it("shows the offending date in the end field on re-focus", () => {
                    getEndInput(root).simulate("focus");
                    changeInputText(getEndInput(root), OVERLAPPING_END_STR);
                    getEndInput(root).simulate("blur");
                    getEndInput(root).simulate("focus");
                    assertInputValueEquals(getEndInput(root), OVERLAPPING_END_STR);
                });

                it("calls onError with [<startDate>, <overlappingDate>] on blur", () => {
                    getEndInput(root).simulate("focus");
                    changeInputText(getEndInput(root), OVERLAPPING_END_STR);
                    expect(onError.called).to.be.false;
                    getEndInput(root).simulate("blur");
                    expect(onError.calledOnce).to.be.true;
                    assertDateRangesEqual(onError.getCall(0).args[0], [START_STR, OVERLAPPING_END_STR]);
                });

                it("does NOT call onChange before OR after blur", () => {
                    getEndInput(root).simulate("focus");
                    changeInputText(getEndInput(root), OVERLAPPING_END_STR);
                    expect(onChange.called).to.be.false;
                    getEndInput(root).simulate("blur");
                    expect(onChange.called).to.be.false;
                });

                it("removes error message if input is changed to an in-range date again", () => {
                    getEndInput(root).simulate("focus");
                    changeInputText(getEndInput(root), OVERLAPPING_END_STR);
                    getEndInput(root).simulate("blur");
                    getEndInput(root).simulate("focus");
                    changeInputText(getEndInput(root), END_STR);
                    getEndInput(root).simulate("blur");
                    assertInputValueEquals(getEndInput(root), END_STR);
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

            const HOVER_TEST_DATE_1 = new Date(2022, Months.JANUARY, HOVER_TEST_DAY_1);
            const HOVER_TEST_DATE_2 = new Date(2022, Months.JANUARY, HOVER_TEST_DAY_2);
            const HOVER_TEST_DATE_3 = new Date(2022, Months.JANUARY, HOVER_TEST_DAY_3);
            const HOVER_TEST_DATE_4 = new Date(2022, Months.JANUARY, HOVER_TEST_DAY_4);
            const HOVER_TEST_DATE_5 = new Date(2022, Months.JANUARY, HOVER_TEST_DAY_5);

            const HOVER_TEST_STR_1 = DATE_FORMAT.formatDate(HOVER_TEST_DATE_1);
            const HOVER_TEST_STR_2 = DATE_FORMAT.formatDate(HOVER_TEST_DATE_2);
            const HOVER_TEST_STR_3 = DATE_FORMAT.formatDate(HOVER_TEST_DATE_3);
            const HOVER_TEST_STR_4 = DATE_FORMAT.formatDate(HOVER_TEST_DATE_4);
            const HOVER_TEST_STR_5 = DATE_FORMAT.formatDate(HOVER_TEST_DATE_5);

            const HOVER_TEST_DATE_CONFIG_1 = {
                date: HOVER_TEST_DATE_1,
                day: HOVER_TEST_DAY_1,
                str: HOVER_TEST_STR_1,
            };
            const HOVER_TEST_DATE_CONFIG_2 = {
                date: HOVER_TEST_DATE_2,
                day: HOVER_TEST_DAY_2,
                str: HOVER_TEST_STR_2,
            };
            const HOVER_TEST_DATE_CONFIG_3 = {
                date: HOVER_TEST_DATE_3,
                day: HOVER_TEST_DAY_3,
                str: HOVER_TEST_STR_3,
            };
            const HOVER_TEST_DATE_CONFIG_4 = {
                date: HOVER_TEST_DATE_4,
                day: HOVER_TEST_DAY_4,
                str: HOVER_TEST_STR_4,
            };
            const HOVER_TEST_DATE_CONFIG_5 = {
                date: HOVER_TEST_DATE_5,
                day: HOVER_TEST_DAY_5,
                str: HOVER_TEST_STR_5,
            };

            interface HoverTextDateConfig {
                day: number;
                date: Date;
                str: string;
            }

            let root: WrappedComponentRoot;
            let getDayElement: (dayNumber?: number, fromLeftMonth?: boolean) => WrappedComponentDayElement;

            before(() => {
                // reuse the same mounted component for every test to speed
                // things up (mounting is costly).
                const result = wrap(
                    <DateRangeInput3
                        {...DATE_FORMAT}
                        closeOnSelection={false}
                        defaultValue={[HOVER_TEST_DATE_2, HOVER_TEST_DATE_4]}
                    />,
                );

                root = result.root;
                getDayElement = result.getDayElement;
            });

            beforeEach(() => {
                // need to set wasLastFocusChangeDueToHover=false to fully reset state between tests.
                root.setState({ isOpen: true, wasLastFocusChangeDueToHover: false });
                // clear the inputs to start from a fresh state, but do so
                // *after* opening the popover so that the calendar doesn't
                // move away from the view we expect for these tests.
                changeInputText(getStartInput(root), "");
                changeInputText(getEndInput(root), "");
            });

            function setSelectedRangeForHoverTest(selectedDateConfigs: NullableRange<HoverTextDateConfig>) {
                const [startConfig, endConfig] = selectedDateConfigs;
                changeInputText(getStartInput(root), startConfig == null ? "" : startConfig.str);
                changeInputText(getEndInput(root), endConfig == null ? "" : endConfig.str);
            }

            describe("when selected date range is [null, null]", () => {
                const SELECTED_RANGE: NullableRange<HoverTextDateConfig> = [null, null];
                const HOVER_TEST_DATE_CONFIG = HOVER_TEST_DATE_CONFIG_1;

                beforeEach(() => {
                    setSelectedRangeForHoverTest(SELECTED_RANGE);
                });

                describe("if start field is focused", () => {
                    beforeEach(() => {
                        getStartInput(root).simulate("focus");
                        getDayElement(HOVER_TEST_DATE_CONFIG.day).simulate("mouseenter");
                    });

                    it("shows [<hoveredDate>, null] in input fields", () => {
                        assertInputValuesEqual(root, HOVER_TEST_DATE_CONFIG.str, "");
                    });

                    it("keeps focus on start field", () => {
                        assertStartInputFocused(root);
                    });

                    describe("on click", () => {
                        beforeEach(() => {
                            getDayElement(HOVER_TEST_DATE_CONFIG.day).simulate("click");
                        });

                        it("sets selection to [<hoveredDate>, null]", () => {
                            assertInputValuesEqual(root, HOVER_TEST_DATE_CONFIG.str, "");
                        });

                        it("moves focus to end field", () => {
                            assertEndInputFocused(root);
                        });
                    });

                    describe("if mouse moves to no longer be over a calendar day", () => {
                        beforeEach(() => {
                            getDayElement(HOVER_TEST_DATE_CONFIG.day).simulate("mouseleave");
                        });

                        it("shows [null, null] in input fields", () => {
                            assertInputValuesEqual(root, "", "");
                        });

                        it("keeps focus on start field", () => {
                            assertStartInputFocused(root);
                        });
                    });
                });

                describe("if end field is focused", () => {
                    beforeEach(() => {
                        getEndInput(root).simulate("focus");
                        getDayElement(HOVER_TEST_DATE_CONFIG.day).simulate("mouseenter");
                    });

                    it("shows [null, <hoveredDate>] in input fields", () => {
                        assertInputValuesEqual(root, "", HOVER_TEST_DATE_CONFIG.str);
                    });

                    it("keeps focus on end field", () => {
                        assertEndInputFocused(root);
                    });

                    describe("on click", () => {
                        beforeEach(() => {
                            getDayElement(HOVER_TEST_DATE_CONFIG.day).simulate("click");
                        });

                        it("sets selection to [null, <hoveredDate>]", () => {
                            assertInputValuesEqual(root, "", HOVER_TEST_DATE_CONFIG.str);
                        });

                        it("moves focus to start field", () => {
                            assertStartInputFocused(root);
                        });
                    });

                    describe("if mouse moves to no longer be over a calendar day", () => {
                        beforeEach(() => {
                            getDayElement(HOVER_TEST_DATE_CONFIG.day).simulate("mouseleave");
                        });

                        it("shows [null, null] in input fields", () => {
                            assertInputValuesEqual(root, "", "");
                        });

                        it("keeps focus on end field", () => {
                            assertEndInputFocused(root);
                        });
                    });
                });
            });

            describe("when selected date range is [<startDate>, null]", () => {
                const SELECTED_RANGE: NullableRange<HoverTextDateConfig> = [HOVER_TEST_DATE_CONFIG_2, null];

                beforeEach(() => {
                    setSelectedRangeForHoverTest(SELECTED_RANGE);
                });

                describe("if start field is focused", () => {
                    beforeEach(() => {
                        getStartInput(root).simulate("focus");
                    });

                    describe("if <startDate> < <hoveredDate>", () => {
                        const DATE_CONFIG = HOVER_TEST_DATE_CONFIG_3;

                        beforeEach(() => {
                            getDayElement(DATE_CONFIG.day).simulate("mouseenter");
                        });

                        it("shows [<hoveredDate>, null] in input fields", () => {
                            assertInputValuesEqual(root, DATE_CONFIG.str, "");
                        });

                        it("keeps focus on start field", () => {
                            assertStartInputFocused(root);
                        });

                        describe("on click", () => {
                            beforeEach(() => {
                                getDayElement(DATE_CONFIG.day).simulate("click");
                            });

                            it("sets selection to [<hoveredDate>, null]", () => {
                                assertInputValuesEqual(root, DATE_CONFIG.str, "");
                            });

                            it("moves focus to end field", () => {
                                assertEndInputFocused(root);
                            });
                        });

                        describe("if mouse moves to no longer be over a calendar day", () => {
                            beforeEach(() => {
                                getDayElement(DATE_CONFIG.day).simulate("mouseleave");
                            });

                            it("shows [<startDate>, null] in input fields", () => {
                                assertInputValuesEqual(root, SELECTED_RANGE[0]?.str, "");
                            });

                            it("keeps focus on start field", () => {
                                assertStartInputFocused(root);
                            });
                        });
                    });

                    describe("if <hoveredDate> < <startDate>", () => {
                        const DATE_CONFIG = HOVER_TEST_DATE_CONFIG_1;

                        beforeEach(() => {
                            getDayElement(DATE_CONFIG.day).simulate("mouseenter");
                        });

                        it("shows [<hoveredDate>, null] in input fields", () => {
                            assertInputValuesEqual(root, DATE_CONFIG.str, "");
                        });

                        it("keeps focus on start field", () => {
                            assertStartInputFocused(root);
                        });

                        describe("on click", () => {
                            beforeEach(() => {
                                getDayElement(DATE_CONFIG.day).simulate("click");
                            });

                            it("sets selection to [<hoveredDate>, null]", () => {
                                assertInputValuesEqual(root, DATE_CONFIG.str, "");
                            });

                            it("moves focus to end field", () => {
                                assertEndInputFocused(root);
                            });
                        });

                        describe("if mouse moves to no longer be over a calendar day", () => {
                            beforeEach(() => {
                                getDayElement(DATE_CONFIG.day).simulate("mouseleave");
                            });

                            it("shows [<startDate>, null] in input fields", () => {
                                assertInputValuesEqual(root, SELECTED_RANGE[0]?.str, "");
                            });

                            it("keeps focus on start field", () => {
                                assertStartInputFocused(root);
                            });
                        });
                    });

                    describe("if <hoveredDate> == <startDate>", () => {
                        const DATE_CONFIG = HOVER_TEST_DATE_CONFIG_2;

                        beforeEach(() => {
                            getDayElement(DATE_CONFIG.day).simulate("mouseenter");
                        });

                        it("shows [null, null] in input fields", () => {
                            assertInputValuesEqual(root, "", "");
                        });

                        it("keeps focus on start field", () => {
                            assertStartInputFocused(root);
                        });

                        describe("on click", () => {
                            beforeEach(() => {
                                getDayElement(DATE_CONFIG.day).simulate("click");
                            });

                            it("sets selection to [null, null]", () => {
                                assertInputValuesEqual(root, "", "");
                            });

                            it("keeps focus on start field", () => {
                                assertStartInputFocused(root);
                            });
                        });

                        describe("if mouse moves to no longer be over a calendar day", () => {
                            beforeEach(() => {
                                getDayElement(DATE_CONFIG.day).simulate("mouseleave");
                            });

                            it("shows [<startDate>, null] in input fields", () => {
                                assertInputValuesEqual(root, SELECTED_RANGE[0]?.str, "");
                            });

                            it("keeps focus on start field", () => {
                                assertStartInputFocused(root);
                            });
                        });
                    });
                });

                describe("if end field is focused", () => {
                    beforeEach(() => {
                        getEndInput(root).simulate("focus");
                    });

                    describe("if <startDate> < <hoveredDate>", () => {
                        const DATE_CONFIG = HOVER_TEST_DATE_CONFIG_3;

                        beforeEach(() => {
                            getDayElement(DATE_CONFIG.day).simulate("mouseenter");
                        });

                        it("shows [<startDate>, <hoveredDate>] in input fields", () => {
                            assertInputValuesEqual(root, SELECTED_RANGE[0]?.str, DATE_CONFIG.str);
                        });

                        it("keeps focus on end field", () => {
                            assertEndInputFocused(root);
                        });

                        describe("on click", () => {
                            beforeEach(() => {
                                getDayElement(DATE_CONFIG.day).simulate("click");
                            });

                            it("sets selection to [<startDate>, <hoveredDate>]", () => {
                                assertInputValuesEqual(root, SELECTED_RANGE[0]?.str, DATE_CONFIG.str);
                            });

                            it("keeps focus on end field", () => {
                                assertEndInputFocused(root);
                            });
                        });

                        describe("if mouse moves to no longer be over a calendar day", () => {
                            beforeEach(() => {
                                getDayElement(DATE_CONFIG.day).simulate("mouseleave");
                            });

                            it("shows [<startDate>, null] in input fields", () => {
                                assertInputValuesEqual(root, SELECTED_RANGE[0]?.str, "");
                            });

                            it("keeps focus on end field", () => {
                                assertEndInputFocused(root);
                            });
                        });
                    });

                    describe("if <hoveredDate> < <startDate>", () => {
                        const DATE_CONFIG = HOVER_TEST_DATE_CONFIG_1;

                        beforeEach(() => {
                            getDayElement(DATE_CONFIG.day).simulate("mouseenter");
                        });

                        it("shows [<hoveredDate>, <startDate>] in input fields", () => {
                            assertInputValuesEqual(root, DATE_CONFIG.str, SELECTED_RANGE[0]?.str);
                        });

                        it("moves focus to start field", () => {
                            assertStartInputFocused(root);
                        });

                        describe("on click", () => {
                            beforeEach(() => {
                                getDayElement(DATE_CONFIG.day).simulate("click");
                            });

                            it("sets selection to [<hoveredDate>, <startDate>]", () => {
                                assertInputValuesEqual(root, DATE_CONFIG.str, SELECTED_RANGE[0]?.str);
                            });

                            it("leaves focus on start field", () => {
                                assertStartInputFocused(root);
                            });
                        });

                        describe("if mouse moves to no longer be over a calendar day", () => {
                            beforeEach(() => {
                                getDayElement(DATE_CONFIG.day).simulate("mouseleave");
                            });

                            it("shows [<startDate>, null] in input fields", () => {
                                assertInputValuesEqual(root, SELECTED_RANGE[0]?.str, "");
                            });

                            it("keeps focus on end field", () => {
                                assertEndInputFocused(root);
                            });
                        });
                    });

                    describe("if <hoveredDate> == <startDate>", () => {
                        const DATE_CONFIG = HOVER_TEST_DATE_CONFIG_2;

                        beforeEach(() => {
                            getDayElement(DATE_CONFIG.day).simulate("mouseenter");
                        });

                        it("shows [null, null] in input fields", () => {
                            assertInputValuesEqual(root, "", "");
                        });

                        it("moves focus to start field", () => {
                            assertStartInputFocused(root);
                        });

                        describe("on click", () => {
                            beforeEach(() => {
                                getDayElement(DATE_CONFIG.day).simulate("click");
                            });

                            it("sets selection to [null, null] on click", () => {
                                assertInputValuesEqual(root, "", "");
                            });

                            it("leaves focus on start field", () => {
                                assertStartInputFocused(root);
                            });
                        });

                        describe("if mouse moves to no longer be over a calendar day", () => {
                            beforeEach(() => {
                                getDayElement(DATE_CONFIG.day).simulate("mouseleave");
                            });

                            it("shows [<startDate>, null] in input fields", () => {
                                assertInputValuesEqual(root, SELECTED_RANGE[0]?.str, "");
                            });

                            it("keeps focus on end field", () => {
                                assertEndInputFocused(root);
                            });
                        });
                    });
                });
            });

            describe("when selected date range is [null, <endDate>]", () => {
                const SELECTED_RANGE: NullableRange<HoverTextDateConfig> = [null, HOVER_TEST_DATE_CONFIG_4];

                beforeEach(() => {
                    setSelectedRangeForHoverTest(SELECTED_RANGE);
                });

                describe("if start field is focused", () => {
                    beforeEach(() => {
                        getStartInput(root).simulate("focus");
                    });

                    describe("if <hoveredDate> < <endDate>", () => {
                        const DATE_CONFIG = HOVER_TEST_DATE_CONFIG_3;

                        beforeEach(() => {
                            getDayElement(DATE_CONFIG.day).simulate("mouseenter");
                        });

                        it("shows [<hoveredDate>, <endDate>] in input fields", () => {
                            assertInputValuesEqual(root, DATE_CONFIG.str, SELECTED_RANGE[1]?.str);
                        });

                        it("keeps focus on start field", () => {
                            assertStartInputFocused(root);
                        });

                        describe("on click", () => {
                            beforeEach(() => {
                                getDayElement(DATE_CONFIG.day).simulate("click");
                            });

                            it("sets selection to [<hoveredDate>, <endDate>]", () => {
                                assertInputValuesEqual(root, DATE_CONFIG.str, SELECTED_RANGE[1]?.str);
                            });

                            it("keeps focus on start field", () => {
                                assertStartInputFocused(root);
                            });
                        });

                        describe("if mouse moves to no longer be over a calendar day", () => {
                            beforeEach(() => {
                                getDayElement(DATE_CONFIG.day).simulate("mouseleave");
                            });

                            it("shows [null, <endDate>] in input fields", () => {
                                assertInputValuesEqual(root, "", SELECTED_RANGE[1]?.str);
                            });

                            it("keeps focus on start field", () => {
                                assertStartInputFocused(root);
                            });
                        });
                    });

                    describe("if <endDate> < <hoveredDate>", () => {
                        const DATE_CONFIG = HOVER_TEST_DATE_CONFIG_5;

                        beforeEach(() => {
                            getDayElement(DATE_CONFIG.day).simulate("mouseenter");
                        });

                        it("shows [<endDate>, <hoveredDate>] in input fields", () => {
                            assertInputValuesEqual(root, SELECTED_RANGE[1]?.str, DATE_CONFIG.str);
                        });

                        it("moves focus to end field", () => {
                            assertEndInputFocused(root);
                        });

                        describe("on click", () => {
                            beforeEach(() => {
                                getDayElement(DATE_CONFIG.day).simulate("click");
                            });

                            it("sets selection to [<endDate>, <hoveredDate>] on click", () => {
                                assertInputValuesEqual(root, SELECTED_RANGE[1]?.str, DATE_CONFIG.str);
                            });

                            it("keeps focus on end field", () => {
                                assertEndInputFocused(root);
                            });
                        });

                        describe("if mouse moves to no longer be over a calendar day", () => {
                            beforeEach(() => {
                                getDayElement(DATE_CONFIG.day).simulate("mouseleave");
                            });

                            it("shows [null, <endDate>] in input fields", () => {
                                assertInputValuesEqual(root, "", SELECTED_RANGE[1]?.str);
                            });

                            it("moves focus back to start field", () => {
                                assertStartInputFocused(root);
                            });
                        });
                    });

                    describe("if <hoveredDate> == <endDate>", () => {
                        const DATE_CONFIG = HOVER_TEST_DATE_CONFIG_4;

                        beforeEach(() => {
                            getDayElement(DATE_CONFIG.day).simulate("mouseenter");
                        });

                        it("shows [null, null] in input fields", () => {
                            assertInputValuesEqual(root, "", "");
                        });

                        it("moves focus to end field", () => {
                            assertEndInputFocused(root);
                        });

                        describe("on click", () => {
                            beforeEach(() => {
                                getDayElement(DATE_CONFIG.day).simulate("click");
                            });

                            it("sets selection to [null, null] on click", () => {
                                assertInputValuesEqual(root, "", "");
                            });

                            it("moves focus to start field", () => {
                                assertStartInputFocused(root);
                            });
                        });

                        describe("if mouse moves to no longer be over a calendar day", () => {
                            beforeEach(() => {
                                getDayElement(DATE_CONFIG.day).simulate("mouseleave");
                            });

                            it("shows [null, <endDate>] in input fields", () => {
                                assertInputValuesEqual(root, "", SELECTED_RANGE[1]?.str);
                            });

                            it("keeps focus on start field", () => {
                                assertStartInputFocused(root);
                            });
                        });
                    });
                });

                describe("if end field is focused", () => {
                    beforeEach(() => {
                        getEndInput(root).simulate("focus");
                    });

                    describe("if <hoveredDate> < <endDate>", () => {
                        const DATE_CONFIG = HOVER_TEST_DATE_CONFIG_3;

                        beforeEach(() => {
                            getDayElement(DATE_CONFIG.day).simulate("mouseenter");
                        });

                        it("shows [null, <hoveredDate>] in input fields", () => {
                            assertInputValuesEqual(root, "", DATE_CONFIG.str);
                        });

                        it("keeps focus on end field", () => {
                            assertEndInputFocused(root);
                        });

                        describe("on click", () => {
                            beforeEach(() => {
                                getDayElement(DATE_CONFIG.day).simulate("click");
                            });

                            it("sets selection to [null, <hoveredDate>]", () => {
                                assertInputValuesEqual(root, "", DATE_CONFIG.str);
                            });

                            it("moves focus to start field", () => {
                                assertStartInputFocused(root);
                            });
                        });

                        describe("if mouse moves to no longer be over a calendar day", () => {
                            beforeEach(() => {
                                getDayElement(DATE_CONFIG.day).simulate("mouseleave");
                            });

                            it("shows [null, <endDate>] in input fields", () => {
                                assertInputValuesEqual(root, "", SELECTED_RANGE[1]?.str);
                            });

                            it("keeps focus on end field", () => {
                                assertEndInputFocused(root);
                            });
                        });
                    });

                    describe("if <endDate> < <hoveredDate>", () => {
                        const DATE_CONFIG = HOVER_TEST_DATE_CONFIG_5;

                        beforeEach(() => {
                            getDayElement(DATE_CONFIG.day).simulate("mouseenter");
                        });

                        it("shows [null, <hoveredDate>] in input fields", () => {
                            assertInputValuesEqual(root, "", DATE_CONFIG.str);
                        });

                        it("keeps focus on start field", () => {
                            assertEndInputFocused(root);
                        });

                        describe("on click", () => {
                            beforeEach(() => {
                                getDayElement(DATE_CONFIG.day).simulate("click");
                            });

                            it("sets selection to [null, <hoveredDate>] on click", () => {
                                assertInputValuesEqual(root, "", DATE_CONFIG.str);
                            });

                            it("moves focus to start field", () => {
                                assertStartInputFocused(root);
                            });
                        });

                        describe("if mouse moves to no longer be over a calendar day", () => {
                            beforeEach(() => {
                                getDayElement(DATE_CONFIG.day).simulate("mouseleave");
                            });

                            it("shows [null, <endDate>] in input fields", () => {
                                assertInputValuesEqual(root, "", SELECTED_RANGE[1]?.str);
                            });

                            it("keeps focus on end field", () => {
                                assertEndInputFocused(root);
                            });
                        });
                    });

                    describe("if <hoveredDate> == <endDate>", () => {
                        const DATE_CONFIG = HOVER_TEST_DATE_CONFIG_4;

                        beforeEach(() => {
                            getDayElement(DATE_CONFIG.day).simulate("mouseenter");
                        });

                        it("shows [null, null] in input fields", () => {
                            assertInputValuesEqual(root, "", "");
                        });

                        it("keeps focus on end field", () => {
                            assertEndInputFocused(root);
                        });

                        describe("on click", () => {
                            beforeEach(() => {
                                getDayElement(DATE_CONFIG.day).simulate("click");
                            });

                            it("sets selection to [null, null] on click", () => {
                                assertInputValuesEqual(root, "", "");
                            });

                            it("moves focus to start field", () => {
                                assertStartInputFocused(root);
                            });
                        });

                        describe("if mouse moves to no longer be over a calendar day", () => {
                            beforeEach(() => {
                                getDayElement(DATE_CONFIG.day).simulate("mouseleave");
                            });

                            it("shows [null, <endDate>] in input fields", () => {
                                assertInputValuesEqual(root, "", SELECTED_RANGE[1]?.str);
                            });

                            it("keeps focus on end field", () => {
                                assertEndInputFocused(root);
                            });
                        });
                    });
                });
            });

            describe("when selected date range is [<startDate>, <endDate>]", () => {
                const SELECTED_RANGE: NullableRange<HoverTextDateConfig> = [
                    HOVER_TEST_DATE_CONFIG_2,
                    HOVER_TEST_DATE_CONFIG_4,
                ];

                beforeEach(() => {
                    setSelectedRangeForHoverTest(SELECTED_RANGE);
                });

                describe("if start field is focused", () => {
                    beforeEach(() => {
                        getStartInput(root).simulate("focus");
                    });

                    describe("if <hoveredDate> < <startDate>", () => {
                        const DATE_CONFIG = HOVER_TEST_DATE_CONFIG_1;

                        beforeEach(() => {
                            getDayElement(DATE_CONFIG.day).simulate("mouseenter");
                        });

                        it("shows [<hoveredDate>, <endDate>] in input fields", () => {
                            assertInputValuesEqual(root, DATE_CONFIG.str, SELECTED_RANGE[1]?.str);
                        });

                        it("keeps focus on start field", () => {
                            assertStartInputFocused(root);
                        });

                        describe("on click", () => {
                            beforeEach(() => {
                                getDayElement(DATE_CONFIG.day).simulate("click");
                            });

                            it("sets selection to [<hoveredDate>, <endDate>]", () => {
                                assertInputValuesEqual(root, DATE_CONFIG.str, SELECTED_RANGE[1]?.str);
                            });

                            it("keeps focus on start field", () => {
                                assertStartInputFocused(root);
                            });
                        });

                        describe("if mouse moves to no longer be over a calendar day", () => {
                            beforeEach(() => {
                                getDayElement(DATE_CONFIG.day).simulate("mouseleave");
                            });

                            it("shows [<startDate>, <endDate>] in input fields", () => {
                                assertInputValuesEqual(root, SELECTED_RANGE[0]?.str, SELECTED_RANGE[1]?.str);
                            });

                            it("keeps focus on start field", () => {
                                assertStartInputFocused(root);
                            });
                        });
                    });

                    describe("if <startDate> < <hoveredDate> < <endDate>", () => {
                        const DATE_CONFIG = HOVER_TEST_DATE_CONFIG_3;

                        beforeEach(() => {
                            getDayElement(DATE_CONFIG.day).simulate("mouseenter");
                        });

                        it("shows [<hoveredDate>, <endDate>] in input fields", () => {
                            assertInputValuesEqual(root, DATE_CONFIG.str, SELECTED_RANGE[1]?.str);
                        });

                        it("keeps focus on start field", () => {
                            assertStartInputFocused(root);
                        });

                        describe("on click", () => {
                            beforeEach(() => {
                                getDayElement(DATE_CONFIG.day).simulate("click");
                            });

                            it("sets selection to [<hoveredDate>, <endDate>]", () => {
                                assertInputValuesEqual(root, DATE_CONFIG.str, SELECTED_RANGE[1]?.str);
                            });

                            it("keeps focus on start field", () => {
                                assertStartInputFocused(root);
                            });
                        });

                        describe("if mouse moves to no longer be over a calendar day", () => {
                            beforeEach(() => {
                                getDayElement(DATE_CONFIG.day).simulate("mouseleave");
                            });

                            it("shows [<startDate>, <endDate>] in input fields", () => {
                                assertInputValuesEqual(root, SELECTED_RANGE[0]?.str, SELECTED_RANGE[1]?.str);
                            });

                            it("keeps focus on start field", () => {
                                assertStartInputFocused(root);
                            });
                        });
                    });

                    describe("if <endDate> < <hoveredDate>", () => {
                        const DATE_CONFIG = HOVER_TEST_DATE_CONFIG_5;

                        beforeEach(() => {
                            getDayElement(DATE_CONFIG.day).simulate("mouseenter");
                        });

                        it("shows [<hoveredDate>, null] in input fields", () => {
                            assertInputValuesEqual(root, DATE_CONFIG.str, "");
                        });

                        it("keeps focus on start field", () => {
                            assertStartInputFocused(root);
                        });

                        describe("on click", () => {
                            beforeEach(() => {
                                getDayElement(DATE_CONFIG.day).simulate("click");
                            });

                            it("sets selection to [<hoveredDate>, null]", () => {
                                assertInputValuesEqual(root, DATE_CONFIG.str, "");
                            });

                            it("moves focus to end field", () => {
                                assertEndInputFocused(root);
                            });
                        });

                        describe("if mouse moves to no longer be over a calendar day", () => {
                            beforeEach(() => {
                                getDayElement(DATE_CONFIG.day).simulate("mouseleave");
                            });

                            it("shows [<startDate>, <endDate>] in input fields", () => {
                                assertInputValuesEqual(root, SELECTED_RANGE[0]?.str, SELECTED_RANGE[1]?.str);
                            });

                            it("keeps focus on start field", () => {
                                assertStartInputFocused(root);
                            });
                        });
                    });

                    describe("if <hoveredDate> == <startDate>", () => {
                        const DATE_CONFIG = HOVER_TEST_DATE_CONFIG_2;

                        beforeEach(() => {
                            getDayElement(DATE_CONFIG.day).simulate("mouseenter");
                        });

                        it("shows [null, <endDate>] in input fields", () => {
                            assertInputValuesEqual(root, "", SELECTED_RANGE[1]?.str);
                        });

                        it("keeps focus on start field", () => {
                            assertStartInputFocused(root);
                        });

                        describe("on click", () => {
                            beforeEach(() => {
                                getDayElement(DATE_CONFIG.day).simulate("click");
                            });

                            it("sets selection to [null, <endDate>]", () => {
                                assertInputValuesEqual(root, "", SELECTED_RANGE[1]?.str);
                            });

                            it("keep focus on start field", () => {
                                assertStartInputFocused(root);
                            });
                        });

                        describe("if mouse moves to no longer be over a calendar day", () => {
                            beforeEach(() => {
                                getDayElement(DATE_CONFIG.day).simulate("mouseleave");
                            });

                            it("shows [<startDate>, <endDate>] in input fields", () => {
                                assertInputValuesEqual(root, SELECTED_RANGE[0]?.str, SELECTED_RANGE[1]?.str);
                            });

                            it("keeps focus on start field", () => {
                                assertStartInputFocused(root);
                            });
                        });
                    });

                    describe("if <hoveredDate> == <endDate>", () => {
                        const DATE_CONFIG = HOVER_TEST_DATE_CONFIG_4;

                        beforeEach(() => {
                            getDayElement(DATE_CONFIG.day).simulate("mouseenter");
                        });

                        it("shows [<startDate>, null] in input fields", () => {
                            assertInputValuesEqual(root, SELECTED_RANGE[0]?.str, "");
                        });

                        it("moves focus to end field", () => {
                            assertEndInputFocused(root);
                        });

                        describe("on click", () => {
                            beforeEach(() => {
                                getDayElement(DATE_CONFIG.day).simulate("click");
                            });

                            it("sets selection to [<startDate>, null]", () => {
                                assertInputValuesEqual(root, SELECTED_RANGE[0]?.str, "");
                            });

                            it("keeps focus on end field", () => {
                                assertEndInputFocused(root);
                            });
                        });

                        describe("if mouse moves to no longer be over a calendar day", () => {
                            beforeEach(() => {
                                getDayElement(DATE_CONFIG.day).simulate("mouseleave");
                            });

                            it("shows [<startDate>, <endDate>] in input fields", () => {
                                assertInputValuesEqual(root, SELECTED_RANGE[0]?.str, SELECTED_RANGE[1]?.str);
                            });

                            it("moves focus back to start field", () => {
                                assertStartInputFocused(root);
                            });
                        });
                    });
                });

                describe("if end field is focused", () => {
                    beforeEach(() => {
                        getEndInput(root).simulate("focus");
                    });

                    describe("if <hoveredDate> < <startDate>", () => {
                        const DATE_CONFIG = HOVER_TEST_DATE_CONFIG_1;

                        beforeEach(() => {
                            getDayElement(DATE_CONFIG.day).simulate("mouseenter");
                        });

                        it("shows [null, <hoveredDate>] in input fields", () => {
                            assertInputValuesEqual(root, "", DATE_CONFIG.str);
                        });

                        it("keeps focus on end field", () => {
                            assertEndInputFocused(root);
                        });

                        describe("on click", () => {
                            beforeEach(() => {
                                getDayElement(DATE_CONFIG.day).simulate("click");
                            });

                            it("sets selection to [null, <hoveredDate>]", () => {
                                assertInputValuesEqual(root, "", DATE_CONFIG.str);
                            });

                            it("moves focus to start field", () => {
                                assertStartInputFocused(root);
                            });
                        });

                        describe("if mouse moves to no longer be over a calendar day", () => {
                            beforeEach(() => {
                                getDayElement(DATE_CONFIG.day).simulate("mouseleave");
                            });

                            it("shows [<startDate>, <endDate>] in input fields", () => {
                                assertInputValuesEqual(root, SELECTED_RANGE[0]?.str, SELECTED_RANGE[1]?.str);
                            });

                            it("keeps focus on end field", () => {
                                assertEndInputFocused(root);
                            });
                        });
                    });

                    describe("if <startDate> < <hoveredDate> < <endDate>", () => {
                        const DATE_CONFIG = HOVER_TEST_DATE_CONFIG_3;

                        beforeEach(() => {
                            getDayElement(DATE_CONFIG.day).simulate("mouseenter");
                        });

                        it("shows [<startDate>, <hoveredDate>] in input fields", () => {
                            assertInputValuesEqual(root, SELECTED_RANGE[0]?.str, DATE_CONFIG.str);
                        });

                        it("keeps focus on end field", () => {
                            assertEndInputFocused(root);
                        });

                        describe("on click", () => {
                            beforeEach(() => {
                                getDayElement(DATE_CONFIG.day).simulate("click");
                            });

                            it("sets selection to [<startDate>, <hoveredDate>]", () => {
                                assertInputValuesEqual(root, SELECTED_RANGE[0]?.str, DATE_CONFIG.str);
                            });

                            it("keeps focus on end field", () => {
                                assertEndInputFocused(root);
                            });
                        });

                        describe("if mouse moves to no longer be over a calendar day", () => {
                            beforeEach(() => {
                                getDayElement(DATE_CONFIG.day).simulate("mouseleave");
                            });

                            it("shows [<startDate>, <endDate>] in input fields", () => {
                                assertInputValuesEqual(root, SELECTED_RANGE[0]?.str, SELECTED_RANGE[1]?.str);
                            });

                            it("keeps focus on end field", () => {
                                assertEndInputFocused(root);
                            });
                        });
                    });

                    describe("if <endDate> < <hoveredDate>", () => {
                        const DATE_CONFIG = HOVER_TEST_DATE_CONFIG_5;

                        beforeEach(() => {
                            getDayElement(DATE_CONFIG.day).simulate("mouseenter");
                        });

                        it("shows [<startDate>, <hoveredDate>] in input fields", () => {
                            assertInputValuesEqual(root, SELECTED_RANGE[0]?.str, DATE_CONFIG.str);
                        });

                        it("keeps focus on end field", () => {
                            assertEndInputFocused(root);
                        });

                        describe("on click", () => {
                            beforeEach(() => {
                                getDayElement(DATE_CONFIG.day).simulate("click");
                            });

                            it("sets selection to [<startDate>, <hoveredDate>]", () => {
                                assertInputValuesEqual(root, SELECTED_RANGE[0]?.str, DATE_CONFIG.str);
                            });

                            it("keeps focus on end field", () => {
                                assertEndInputFocused(root);
                            });
                        });

                        describe("if mouse moves to no longer be over a calendar day", () => {
                            beforeEach(() => {
                                getDayElement(DATE_CONFIG.day).simulate("mouseleave");
                            });

                            it("shows [<startDate>, <endDate>] in input fields", () => {
                                assertInputValuesEqual(root, SELECTED_RANGE[0]?.str, SELECTED_RANGE[1]?.str);
                            });

                            it("keeps focus on end field", () => {
                                assertEndInputFocused(root);
                            });
                        });
                    });

                    describe("if <hoveredDate> == <startDate>", () => {
                        const DATE_CONFIG = HOVER_TEST_DATE_CONFIG_2;

                        beforeEach(() => {
                            getDayElement(DATE_CONFIG.day).simulate("mouseenter");
                        });

                        it("shows [null, <endDate>] in input fields", () => {
                            assertInputValuesEqual(root, "", SELECTED_RANGE[1]?.str);
                        });

                        it("moves focus to start field", () => {
                            assertStartInputFocused(root);
                        });

                        describe("on click", () => {
                            beforeEach(() => {
                                getDayElement(DATE_CONFIG.day).simulate("click");
                            });

                            it("sets selection to [null, <endDate>]", () => {
                                assertInputValuesEqual(root, "", SELECTED_RANGE[1]?.str);
                            });

                            it("keeps focus on start field", () => {
                                assertStartInputFocused(root);
                            });
                        });

                        describe("if mouse moves to no longer be over a calendar day", () => {
                            beforeEach(() => {
                                getDayElement(DATE_CONFIG.day).simulate("mouseleave");
                            });

                            it("shows [<startDate>, <endDate>] in input fields", () => {
                                assertInputValuesEqual(root, SELECTED_RANGE[0]?.str, SELECTED_RANGE[1]?.str);
                            });

                            it("moves focus back to end field", () => {
                                assertEndInputFocused(root);
                            });
                        });
                    });

                    describe("if <hoveredDate> == <endDate>", () => {
                        const DATE_CONFIG = HOVER_TEST_DATE_CONFIG_4;

                        beforeEach(() => {
                            getDayElement(DATE_CONFIG.day).simulate("mouseenter");
                        });

                        it("shows [<startDate>, null] in input fields", () => {
                            assertInputValuesEqual(root, SELECTED_RANGE[0]?.str, "");
                        });

                        it("keeps focus on end field", () => {
                            assertEndInputFocused(root);
                        });

                        describe("on click", () => {
                            beforeEach(() => {
                                getDayElement(DATE_CONFIG.day).simulate("click");
                            });

                            it("sets selection to [<startDate>, null]", () => {
                                assertInputValuesEqual(root, SELECTED_RANGE[0]?.str, "");
                            });

                            it("keeps focus on end field", () => {
                                assertEndInputFocused(root);
                            });
                        });

                        describe("if mouse moves to no longer be over a calendar day", () => {
                            beforeEach(() => {
                                getDayElement(DATE_CONFIG.day).simulate("mouseleave");
                            });

                            it("shows [<startDate>, <endDate>] in input fields", () => {
                                assertInputValuesEqual(root, SELECTED_RANGE[0]?.str, SELECTED_RANGE[1]?.str);
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

            const { root, getDayElement } = wrap(
                <DateRangeInput3 {...DATE_FORMAT} defaultValue={defaultValue} onChange={onChange} />,
            );

            getStartInput(root).simulate("focus");
            getDayElement(START_DAY).simulate("click");
            assertInputValuesEqual(root, "", "");
            expect(onChange.called).to.be.true;
            expect(onChange.calledWith([null, null])).to.be.true;
        });

        it("Clearing only the start input (e.g.) invokes onChange with [null, <endDate>]", () => {
            const onChange = sinon.spy();
            const { root } = wrap(<DateRangeInput3 {...DATE_FORMAT} onChange={onChange} defaultValue={DATE_RANGE} />);

            const startInput = getStartInput(root);
            startInput.simulate("focus");
            changeInputText(startInput, "");
            expect(onChange.called).to.be.true;
            assertDateRangesEqual(onChange.getCall(0).args[0], [null, END_STR]);
            assertInputValuesEqual(root, "", END_STR);
        });

        it("Clearing the dates in both inputs invokes onChange with [null, null] and leaves the inputs empty", () => {
            const onChange = sinon.spy();
            const { root } = wrap(
                <DateRangeInput3 {...DATE_FORMAT} onChange={onChange} defaultValue={[START_DATE, null]} />,
            );
            getStartInput(root).simulate("focus");
            changeStartInputText(root, "");
            expect(onChange.called).to.be.true;
            assertDateRangesEqual(onChange.getCall(0).args[0], [null, null]);
            assertInputValuesEqual(root, "", "");
        });
    });

    describe("when controlled", () => {
        it("Setting value causes defaultValue to be ignored", () => {
            const { root } = wrap(<DateRangeInput3 {...DATE_FORMAT} defaultValue={DATE_RANGE_2} value={DATE_RANGE} />);
            assertInputValuesEqual(root, START_STR, END_STR);
        });

        it("Setting value to [undefined, undefined] shows empty fields", () => {
            const { root } = wrap(<DateRangeInput3 {...DATE_FORMAT} value={[null, null]} />);
            assertInputValuesEqual(root, "", "");
        });

        it("Setting value to [null, null] shows empty fields", () => {
            const { root } = wrap(<DateRangeInput3 {...DATE_FORMAT} value={[null, null]} />);
            assertInputValuesEqual(root, "", "");
        });

        it("Shows empty start field and formatted date in end field when value is [null, <date>]", () => {
            const { root } = wrap(<DateRangeInput3 {...DATE_FORMAT} value={[null, END_DATE]} />);
            assertInputValuesEqual(root, "", END_STR);
        });

        it("Shows empty end field and formatted date in start field when value is [<date>, null]", () => {
            const { root } = wrap(<DateRangeInput3 {...DATE_FORMAT} value={[START_DATE, null]} />);
            assertInputValuesEqual(root, START_STR, "");
        });

        it("Shows formatted dates in both fields when value is [<date1>, <date2>]", () => {
            const { root } = wrap(<DateRangeInput3 {...DATE_FORMAT} value={[START_DATE, END_DATE]} />);
            assertInputValuesEqual(root, START_STR, END_STR);
        });

        it("Updating value changes the text accordingly in both fields", () => {
            const { root } = wrap(<DateRangeInput3 {...DATE_FORMAT} value={DATE_RANGE} />);
            root.setState({ isOpen: true }).update();
            root.setProps({ value: DATE_RANGE_2 }).update();
            assertInputValuesEqual(root, START_STR_2, END_STR_2);
        });

        // HACKHACK: https://github.com/palantir/blueprint/issues/6109
        // N.B. this test passes locally
        it.skip("Pressing Enter saves the inputted date and closes the popover", () => {
            const onChange = sinon.spy();
            const { root } = wrap(<DateRangeInput3 {...DATE_FORMAT} onChange={onChange} value={[null, null]} />);
            root.setState({ isOpen: true });

            const startInput = getStartInput(root);
            startInput.simulate("focus");
            startInput.simulate("change", { target: { value: START_STR } });
            startInput.simulate("keydown", { key: "Enter" });
            expect(isStartInputFocused(root), "start input blurred next").to.be.false;

            expect(root.state("isOpen"), "popover still open").to.be.true;

            const endInput = getEndInput(root);
            expect(isEndInputFocused(root), "end input focused next").to.be.true;
            endInput.simulate("change", { target: { value: END_STR } });
            endInput.simulate("keydown", { key: "Enter" });

            expect(isStartInputFocused(root), "start input blurred at end").to.be.false;
            expect(isEndInputFocused(root), "end input still focused at end").to.be.true;

            // onChange is called once on change, once on Enter
            expect(onChange.callCount, "onChange called four times").to.equal(4);
            // check one of the invocations
            assertDateRangesEqual(onChange.args[1][0], [START_STR, null]);
        });

        it("Clicking a date invokes onChange with the new date range and updates the input field text", () => {
            const onChange = sinon.spy();
            const { root, getDayElement } = wrap(
                <DateRangeInput3 {...DATE_FORMAT} value={DATE_RANGE} onChange={onChange} />,
            );
            getStartInput(root).simulate("focus"); // to open popover
            getDayElement(START_DAY).simulate("click");
            assertDateRangesEqual(onChange.getCall(0).args[0], [null, END_STR]);
            assertInputValuesEqual(root, "", END_STR);
            expect(onChange.callCount).to.equal(1);
        });

        it("Typing a valid start or end date invokes onChange with the new date range but doesn't change UI", () => {
            const onChange = sinon.spy();
            const { root } = wrap(<DateRangeInput3 {...DATE_FORMAT} onChange={onChange} value={DATE_RANGE} />);

            changeStartInputText(root, START_STR_2);
            expect(onChange.callCount).to.equal(1);
            assertDateRangesEqual(onChange.getCall(0).args[0], [START_STR_2, END_STR]);
            assertInputValuesEqual(root, START_STR, END_STR);

            // since the component is controlled, value changes don't persist across onChanges
            changeEndInputText(root, END_STR_2);
            expect(onChange.callCount).to.equal(2);
            assertDateRangesEqual(onChange.getCall(1).args[0], [START_STR, END_STR_2]);
            assertInputValuesEqual(root, START_STR, END_STR);
        });

        it("Clicking a start date causes focus to move to end field", () => {
            // eslint-disable-next-line prefer-const
            let controlledRoot: WrappedComponentRoot;

            const onChange = (nextValue: DateRange) => controlledRoot.setProps({ value: nextValue });
            const { root, getDayElement } = wrap(
                <DateRangeInput3 {...DATE_FORMAT} onChange={onChange} value={[null, null]} />,
            );
            controlledRoot = root;

            getStartInput(controlledRoot).simulate("focus");
            getDayElement(1).simulate("click"); // triggers a controlled value change
            assertEndInputFocused(controlledRoot);
        });

        it("Typing in a field while hovering over a date shows the typed date, not the hovered date", () => {
            // eslint-disable-next-line prefer-const
            let controlledRoot: WrappedComponentRoot;

            const onChange = (nextValue: DateRange) => controlledRoot.setProps({ value: nextValue });
            const { root, getDayElement } = wrap(
                <DateRangeInput3 {...DATE_FORMAT} onChange={onChange} value={[null, null]} />,
            );
            controlledRoot = root;

            getStartInput(root).simulate("focus");
            getDayElement(1).simulate("mouseenter");
            changeStartInputText(root, START_STR_2);
            assertInputValuesEqual(root, START_STR_2, "");
        });

        describe("Typing an out-of-range date", () => {
            let onChange: sinon.SinonSpy;
            let onError: sinon.SinonSpy;
            let root: WrappedComponentRoot;

            beforeEach(() => {
                onChange = sinon.spy();
                onError = sinon.spy();

                const result = wrap(
                    <DateRangeInput3
                        {...DATE_FORMAT}
                        minDate={OUT_OF_RANGE_TEST_MIN}
                        maxDate={OUT_OF_RANGE_TEST_MAX}
                        onChange={onChange}
                        onError={onError}
                        outOfRangeMessage={OUT_OF_RANGE_MESSAGE}
                        value={[null, null]}
                    />,
                );
                root = result.root;
            });

            describe("calls onError with invalid date on blur", () => {
                runTestForEachScenario((inputGetterFn, inputString, boundary) => {
                    const expectedRange: DateStringRange =
                        boundary === Boundary.START ? [inputString, null] : [null, inputString];
                    inputGetterFn(root).simulate("focus");
                    changeInputText(inputGetterFn(root), inputString);
                    expect(onError.called).to.be.false;
                    inputGetterFn(root).simulate("blur");
                    expect(onError.calledOnce).to.be.true;
                    assertDateRangesEqual(onError.getCall(0).args[0], expectedRange);
                });
            });

            describe("does NOT call onChange before OR after blur", () => {
                runTestForEachScenario((inputGetterFn, inputString) => {
                    inputGetterFn(root).simulate("focus");
                    changeInputText(inputGetterFn(root), inputString);
                    expect(onChange.called).to.be.false;
                    inputGetterFn(root).simulate("blur");
                    expect(onChange.called).to.be.false;
                });
            });

            function runTestForEachScenario(runTestFn: OutOfRangeTestFunction) {
                const { START, END } = Boundary;
                it("if start < minDate", () => runTestFn(getStartInput, OUT_OF_RANGE_START_STR, START));
                it("if start > maxDate", () => runTestFn(getStartInput, OUT_OF_RANGE_END_STR, START));
                it("if end < minDate", () => runTestFn(getEndInput, OUT_OF_RANGE_START_STR, END));
                it("if end > maxDate", () => runTestFn(getEndInput, OUT_OF_RANGE_END_STR, END));
            }
        });

        describe("Typing an invalid date", () => {
            let onChange: sinon.SinonSpy;
            let onError: sinon.SinonSpy;
            let root: WrappedComponentRoot;

            beforeEach(() => {
                onChange = sinon.spy();
                onError = sinon.spy();

                const result = wrap(
                    <DateRangeInput3
                        {...DATE_FORMAT}
                        invalidDateMessage={INVALID_MESSAGE}
                        onError={onError}
                        value={DATE_RANGE}
                    />,
                );
                root = result.root;

                changeStartInputText(root, "");
                changeEndInputText(root, "");
                root.setProps({ onChange });
            });

            describe("calls onError on blur with Date(undefined) in place of the invalid date", () => {
                runTestForEachScenario((inputGetterFn, boundary) => {
                    inputGetterFn(root).simulate("focus");
                    changeInputText(inputGetterFn(root), INVALID_STR);
                    expect(onError.called).to.be.false;
                    inputGetterFn(root).simulate("blur");
                    expect(onError.calledOnce).to.be.true;

                    const dateRange = onError.getCall(0).args[0];
                    const dateIndex = boundary === Boundary.START ? 0 : 1;
                    expect((dateRange[dateIndex] as Date).valueOf()).to.be.NaN;
                });
            });

            describe("does NOT call onChange before OR after blur", () => {
                runTestForEachScenario(inputGetterFn => {
                    inputGetterFn(root).simulate("focus");
                    changeInputText(inputGetterFn(root), INVALID_STR);
                    expect(onChange.called).to.be.false;
                    inputGetterFn(root).simulate("blur");
                    expect(onChange.called).to.be.false;
                });
            });

            function runTestForEachScenario(runTestFn: InvalidDateTestFunction) {
                it("in start field", () => runTestFn(getStartInput, Boundary.START, getEndInput));
                it("in end field", () => runTestFn(getEndInput, Boundary.END, getStartInput));
            }
        });

        describe("Typing an overlapping date", () => {
            let onChange: sinon.SinonSpy;
            let onError: sinon.SinonSpy;
            let root: WrappedComponentRoot;
            let startInput: WrappedComponentInput;
            let endInput: WrappedComponentInput;

            beforeEach(() => {
                onChange = sinon.spy();
                onError = sinon.spy();

                const result = wrap(
                    <DateRangeInput3
                        {...DATE_FORMAT}
                        overlappingDatesMessage={OVERLAPPING_DATES_MESSAGE}
                        onChange={onChange}
                        onError={onError}
                        value={DATE_RANGE}
                    />,
                );
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

        it("Clearing the dates in the picker invokes onChange with [null, null] and updates input fields", () => {
            const onChange = sinon.spy();
            const value = [START_DATE, null] as DateRange;

            const { root, getDayElement } = wrap(
                <DateRangeInput3 {...DATE_FORMAT} value={value} onChange={onChange} />,
            );

            // popover opens on focus
            getStartInput(root).simulate("focus");
            getDayElement(START_DAY).simulate("click");

            assertDateRangesEqual(onChange.getCall(0).args[0], [null, null]);
            assertInputValuesEqual(root, "", "");
        });

        it(`Clearing only the start input (e.g.) invokes onChange with [null, <endDate>], doesn't clear the\
            selected dates, and repopulates the controlled values in the inputs on blur`, () => {
            const onChange = sinon.spy();
            const { root, getDayElement } = wrap(
                <DateRangeInput3 {...DATE_FORMAT} onChange={onChange} value={DATE_RANGE} />,
            );

            const startInput = getStartInput(root);

            startInput.simulate("focus");
            changeInputText(startInput, "");
            expect(onChange.calledOnce).to.be.true;
            assertDateRangesEqual(onChange.getCall(0).args[0], [null, END_STR]);
            assertInputValuesEqual(root, "", END_STR);

            // start day should still be selected in the calendar, ignoring user's typing
            expect(getDayElement(START_DAY).hasClass(Datetime2Classes.DATEPICKER3_DAY_SELECTED)).to.be.true;

            // blurring should put the controlled start date back in the start input, overriding user's typing
            startInput.simulate("blur");
            assertInputValuesEqual(root, START_STR, END_STR);
        });

        it(`Clearing the inputs invokes onChange with [null, null], doesn't clear the selected dates, and\
            repopulates the controlled values in the inputs on blur`, () => {
            const onChange = sinon.spy();
            const { root, getDayElement } = wrap(
                <DateRangeInput3 {...DATE_FORMAT} onChange={onChange} value={[START_DATE, null]} />,
            );

            const startInput = getStartInput(root);

            startInput.simulate("focus");
            changeInputText(startInput, "");
            expect(onChange.calledOnce).to.be.true;
            assertDateRangesEqual(onChange.getCall(0).args[0], [null, null]);
            assertInputValuesEqual(root, "", "");

            expect(getDayElement(START_DAY).hasClass(Datetime2Classes.DATEPICKER3_DAY_SELECTED)).to.be.true;

            startInput.simulate("blur");
            assertInputValuesEqual(root, START_STR, "");
        });

        // Regression test for https://github.com/palantir/blueprint/issues/5791
        it("Hovering and clicking on end date shows the new date in input, not a previously selected date", () => {
            const DEC_1_DATE = new Date(2022, 11, 1);
            const DEC_1_STR = DATE_FORMAT.formatDate(DEC_1_DATE);
            const DEC_2_DATE = new Date(2022, 11, 2);
            const DEC_2_STR = DATE_FORMAT.formatDate(DEC_2_DATE);
            const DEC_6_DATE = new Date(2022, 11, 6);
            const DEC_6_STR = DATE_FORMAT.formatDate(DEC_6_DATE);
            const DEC_8_DATE = new Date(2022, 11, 8);
            const DEC_8_STR = DATE_FORMAT.formatDate(DEC_8_DATE);

            // eslint-disable-next-line prefer-const
            let controlledRoot: WrappedComponentRoot;

            const onChange = (nextValue: DateRange) => controlledRoot.setProps({ value: nextValue });
            const { root, getDayElement } = wrap(
                <DateRangeInput3
                    {...DATE_FORMAT}
                    closeOnSelection={false}
                    popoverProps={{ isOpen: true }}
                    onChange={onChange}
                    value={[DEC_6_DATE, DEC_8_DATE]}
                />,
                true,
            );
            controlledRoot = root;

            // initial state
            getStartInput(root).simulate("focus");
            assertInputValuesEqual(root, DEC_6_STR, DEC_8_STR);

            // hover over Dec 1
            getDayElement(1).simulate("mouseenter");
            assertInputValuesEqual(root, DEC_1_STR, DEC_8_STR);

            // click to select Dec 1
            getDayElement(1).simulate("click");
            getDayElement(1).simulate("mouseleave");
            assertInputValuesEqual(root, DEC_1_STR, DEC_8_STR);

            // re-focus on start input to ensure the component doesn't think we're changing the end boundary
            // (this mimics real UX, where the component-refocuses the start input after selecting a start date)
            getStartInput(root).simulate("focus");

            // hover over Dec 2
            getDayElement(2).simulate("mouseenter");
            assertInputValuesEqual(root, DEC_2_STR, DEC_8_STR);

            // click to select Dec 2
            getDayElement(2).simulate("click");
            getDayElement(2).simulate("mouseleave");
            assertInputValuesEqual(root, DEC_2_STR, DEC_8_STR);
        });

        describe("localization", () => {
            describe("with formatDate & parseDate undefined", () => {
                it("formats date strings with provided Locale object", () => {
                    const { root } = wrap(
                        <DateRangeInput3 dateFnsFormat="PPP" locale={esLocale} value={DATE_RANGE_2} />,
                        true,
                    );
                    assertInputValuesEqual(root, START_STR_2_ES_LOCALE, END_STR_2_ES_LOCALE);
                });

                it("formats date strings with async-loaded locale corresponding to provided locale code", done => {
                    const { root } = wrap(
                        <DateRangeInput3 dateFnsFormat="PPP" locale="es" value={DATE_RANGE_2} />,
                        true,
                    );
                    // give the component one animation frame to load the locale upon mount
                    setTimeout(() => {
                        root.update();
                        assertInputValuesEqual(root, START_STR_2_ES_LOCALE, END_STR_2_ES_LOCALE);
                        done();
                    });
                });
            });
        });
    });

    function getStartInput(root: WrappedComponentRoot): WrappedComponentInput {
        return root.find(InputGroup).first().find("input") as WrappedComponentInput;
    }

    function getEndInput(root: WrappedComponentRoot): WrappedComponentInput {
        return root.find(InputGroup).last().find("input") as WrappedComponentInput;
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
        input.simulate("change", { target: { value } });
    }

    function assertStartInputFocused(root: WrappedComponentRoot) {
        expect(isStartInputFocused(root)).to.be.true;
    }

    function assertEndInputFocused(root: WrappedComponentRoot) {
        expect(isEndInputFocused(root)).to.be.true;
    }

    function assertInputValuesEqual(
        root: WrappedComponentRoot,
        startInputValue: string | undefined,
        endInputValue: string | undefined,
    ) {
        assertInputValueEquals(getStartInput(root), startInputValue);
        assertInputValueEquals(getEndInput(root), endInputValue);
    }

    function assertInputValueEquals(input: WrappedComponentInput, inputValue: string | undefined) {
        expect(input.closest(InputGroup).prop("value")).to.equal(inputValue);
    }

    function assertDateRangesEqual(actual: DateRange, expected: DateStringRange) {
        const [expectedStart, expectedEnd] = expected;
        const [actualStart, actualEnd] = actual.map((date: Date | null) => {
            if (date == null) {
                return null;
            } else if (isNaN(date.valueOf())) {
                return UNDEFINED_DATE_STR;
            } else {
                return DATE_FORMAT.formatDate(date);
            }
        });
        expect(actualStart).to.equal(expectedStart);
        expect(actualEnd).to.equal(expectedEnd);
    }

    function wrap(dateRangeInput: JSX.Element, attachToDOM = false) {
        const mountOptions = attachToDOM ? { attachTo: containerElement } : undefined;
        const wrapper = mount(dateRangeInput, mountOptions);
        return {
            getDayElement: (dayNumber = 1, fromLeftMonth = true) => {
                const monthElement = wrapper.find(`.${ReactDayPickerClasses.RDP_MONTH}`).at(fromLeftMonth ? 0 : 1);
                const dayElements = monthElement.find(`.${Datetime2Classes.DATEPICKER3_DAY}`);
                return dayElements
                    .filterWhere(
                        d => d.text() === dayNumber.toString() && !d.hasClass(Datetime2Classes.DATEPICKER3_DAY_OUTSIDE),
                    )
                    .hostNodes();
            },
            root: wrapper,
        };
    }
});

function getDateFnsFormatter(formatStr: string): DateFormatProps {
    return {
        formatDate: (date, localeCode) => format(date, formatStr, maybeGetDateFnsLocaleOptions(localeCode)),
        parseDate: (str, localeCode) => parse(str, formatStr, new Date(), maybeGetDateFnsLocaleOptions(localeCode)),
        placeholder: `${formatStr}`,
    };
}

const AllLocales: Record<string, Locale> = Locales;

function maybeGetDateFnsLocaleOptions(localeCode: string | undefined): { locale: Locale } | undefined {
    if (localeCode !== undefined && AllLocales[localeCode] !== undefined) {
        return { locale: AllLocales[localeCode] };
    }
    return undefined;
}
