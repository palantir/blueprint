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

import { fireEvent, render, screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect } from "chai";
import { format, parse } from "date-fns";
import * as Locales from "date-fns/locale";
import esLocale from "date-fns/locale/es";
import { mount, type ReactWrapper } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";

import {
    Boundary,
    Classes as CoreClasses,
    type HTMLDivProps,
    type HTMLInputProps,
    InputGroup,
    Popover,
    type PopoverProps,
} from "@blueprintjs/core";
import { type DateFormatProps, type DateRange, Months, TimePrecision } from "@blueprintjs/datetime";
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

const YEAR = 2022;
const START_DAY = 22;
const START_DATE = new Date(YEAR, Months.JANUARY, START_DAY);
const START_STR = DATE_FORMAT.formatDate(START_DATE);
const END_DAY = 24;
const END_DATE = new Date(YEAR, Months.JANUARY, END_DAY);
const END_STR = DATE_FORMAT.formatDate(END_DATE);
const DATE_RANGE = [START_DATE, END_DATE] as DateRange;

const START_DATE_2 = new Date(YEAR, Months.JANUARY, 1);
const START_STR_2 = DATE_FORMAT.formatDate(START_DATE_2);
const START_STR_2_ES_LOCALE = "1 de enero de 2022";
const END_DATE_2 = new Date(YEAR, Months.JANUARY, 31);
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

describe("<DateRangeInput3>", () => {
    it("renders with two InputGroup children", () => {
        render(<DateRangeInput3 {...DATE_FORMAT} />);
        expect(screen.getAllByRole("textbox")).to.have.lengthOf(2);
    });

    it("passes custom classNames to popover wrapper", () => {
        const CLASS_1 = "foo";
        const CLASS_2 = "bar";

        const { container } = render(
            <DateRangeInput3
                {...DATE_FORMAT}
                className={CLASS_1}
                popoverProps={{ className: CLASS_2, usePortal: false }}
            />,
        );

        const popoverTarget = container.querySelector(`.${CoreClasses.POPOVER_TARGET}`);

        expect(popoverTarget?.classList.contains(CLASS_1)).to.be.true;
        expect(popoverTarget?.classList.contains(CLASS_2)).to.be.true;
    });

    it("inner DateRangePicker3 receives all supported props", () => {
        const component = mount(<DateRangeInput3 {...DATE_FORMAT} locale="uk" contiguousCalendarMonths={false} />);
        React.act(() => {
            component.setState({ isOpen: true });
        });
        component.update();
        const picker = component.find(DateRangePicker3);
        expect(picker.prop("locale")).to.equal("uk");
        expect(picker.prop("contiguousCalendarMonths")).to.be.false;
    });

    it("shows empty fields when no date range is selected", async () => {
        render(<DateRangeInput3 {...DATE_FORMAT} />);

        expect(getStartInputElement().value).to.equal("");
        expect(getEndInputElement().value).to.equal("");
    });

    it("throws error if value === null", () => {
        expectPropValidationError(DateRangeInput3, { ...DATE_FORMAT, value: null! });
    });

    describe("timePrecision prop", () => {
        it("<TimePicker /> should not lose focus on increment/decrement with up/down arrows", async () => {
            const { container } = render(
                <DateRangeInput3
                    {...DATE_FORMAT}
                    timePrecision={TimePrecision.MINUTE}
                    popoverProps={{ usePortal: false }}
                />,
            );

            await userEvent.click(getStartInputElement());

            const hourInputs = screen.getAllByRole<HTMLInputElement>("spinbutton", {
                name: "hours (24hr clock)",
            });

            // DateRangeInput3 renders two TimePicker components, we only care about testing one of them
            const firstHourInput = hourInputs[0];

            await userEvent.type(firstHourInput, "{arrowup}");

            expect(document.activeElement).to.equal(firstHourInput);
            expect(firstHourInput.value).to.equal("1");

            // assert that popover still open
            expect(getPopover(container)).not.to.be.null;
        });

        it("when timePrecision != null && closeOnSelection=true && end <TimePicker /> values is changed directly (without setting the selectedEnd date) - popover should not close", async () => {
            const { container } = render(
                <DateRangeInput3
                    {...DATE_FORMAT}
                    timePrecision={TimePrecision.MINUTE}
                    popoverProps={{ usePortal: false }}
                />,
            );

            await userEvent.click(getStartInputElement());

            const hourInputs = screen.getAllByRole<HTMLInputElement>("spinbutton", {
                name: "hours (24hr clock)",
            });

            // DateRangeInput3 renders two TimePicker components, we only care about testing one of them
            const firstHourInput = hourInputs[0];

            await userEvent.type(firstHourInput, "{arrowup}");
            await userEvent.type(firstHourInput, "{arrowup}");

            expect(document.activeElement).to.equal(firstHourInput);

            // assert that popover still open
            expect(getPopover(container)).not.to.be.null;
        });
    });

    describe("startInputProps and endInputProps", () => {
        it("startInput is disabled when startInputProps={ disabled: true }", async () => {
            const { container } = render(
                <DateRangeInput3
                    {...DATE_FORMAT}
                    startInputProps={{ disabled: true }}
                    popoverProps={{ usePortal: false }}
                />,
            );
            const startInput = getStartInputElement();
            const endInput = getEndInputElement();

            await userEvent.click(startInput);

            expect(getPopover(container)).to.be.null;
            expect(startInput.getAttribute("aria-disabled")).to.equal("true");
            expect(endInput.getAttribute("aria-disabled")).to.equal("false");
        });

        it("endInput is disabled when endInputProps={ disabled: true }", async () => {
            const { container } = render(
                <DateRangeInput3
                    {...DATE_FORMAT}
                    endInputProps={{ disabled: true }}
                    popoverProps={{ usePortal: false }}
                />,
            );
            const startInput = getStartInputElement();
            const endInput = getEndInputElement();

            await userEvent.click(endInput);

            expect(getPopover(container)).to.be.null;
            expect(startInput.getAttribute("aria-disabled")).to.equal("false");
            expect(endInput.getAttribute("aria-disabled")).to.equal("true");
        });

        describe("startInputProps", () => {
            it("allows custom placeholder text", () => {
                const placeholder = "Hello";
                render(<DateRangeInput3 {...DATE_FORMAT} startInputProps={{ placeholder }} />);

                expect(screen.getByPlaceholderText(placeholder)).to.exist;
            });

            it("supports custom style", () => {
                const style = { background: "yellow" };
                render(<DateRangeInput3 {...DATE_FORMAT} startInputProps={{ style }} />);

                expect(getStartInputElement().style.background).to.equal("yellow");
            });

            it("calls onChange when the value is changed", async () => {
                const onChange = sinon.spy();
                render(<DateRangeInput3 {...DATE_FORMAT} startInputProps={{ onChange }} />);

                await userEvent.type(getStartInputElement(), "x");

                expect(onChange.called).to.be.true;
            });

            it("calls onFocus when the input is focused", async () => {
                const onFocus = sinon.spy();
                render(
                    <DateRangeInput3
                        {...DATE_FORMAT}
                        startInputProps={{ onFocus }}
                        popoverProps={{ usePortal: false }}
                    />,
                );

                await userEvent.click(getStartInputElement());

                expect(onFocus.calledOnce).to.be.true;
            });

            it("calls onBlur when the input is blurred", async () => {
                const onBlur = sinon.spy();
                render(
                    <DateRangeInput3
                        {...DATE_FORMAT}
                        startInputProps={{ onBlur }}
                        popoverProps={{ usePortal: false }}
                    />,
                );

                await userEvent.click(getStartInputElement());
                await userEvent.tab();

                expect(onBlur.calledOnce).to.be.true;
            });

            it("calls onKeyDown when a key is pressed", async () => {
                const onKeyDown = sinon.spy();
                render(
                    <DateRangeInput3
                        {...DATE_FORMAT}
                        startInputProps={{ onKeyDown }}
                        popoverProps={{ usePortal: false }}
                    />,
                );

                await userEvent.type(getStartInputElement(), "{enter}");

                expect(onKeyDown.calledOnce).to.be.true;
            });

            it("calls onMouseDown when the input is clicked", async () => {
                const onMouseDown = sinon.spy();
                render(
                    <DateRangeInput3
                        {...DATE_FORMAT}
                        startInputProps={{ onMouseDown }}
                        popoverProps={{ usePortal: false }}
                    />,
                );

                await userEvent.click(getStartInputElement());

                expect(onMouseDown.calledOnce).to.be.true;
            });
        });

        describe("endInputProps", () => {
            it("allows custom placeholder text", () => {
                const placeholder = "Goodbye";
                render(<DateRangeInput3 {...DATE_FORMAT} endInputProps={{ placeholder }} />);

                expect(screen.getByPlaceholderText(placeholder)).to.exist;
            });

            it("supports custom style", () => {
                const style = { background: "yellow" };
                render(<DateRangeInput3 {...DATE_FORMAT} endInputProps={{ style }} />);

                expect(getEndInputElement().style.background).to.equal("yellow");
            });

            it("calls onChange when the value is changed", async () => {
                const onChange = sinon.spy();
                render(<DateRangeInput3 {...DATE_FORMAT} onChange={onChange} popoverProps={{ usePortal: false }} />);

                await userEvent.type(getEndInputElement(), "1/1/2025");

                expect(onChange.calledOnce).to.be.true;
                expect(onChange.calledWith([null, new Date(2025, 0, 1)])).to.be.true;
            });

            it("calls onFocus when the input is focused", async () => {
                const onFocus = sinon.spy();
                render(
                    <DateRangeInput3
                        {...DATE_FORMAT}
                        endInputProps={{ onFocus }}
                        popoverProps={{ usePortal: false }}
                    />,
                );

                await userEvent.click(getEndInputElement());

                expect(onFocus.calledOnce).to.be.true;
            });

            it("calls onBlur when the input is blurred", async () => {
                const onBlur = sinon.spy();
                render(
                    <DateRangeInput3 {...DATE_FORMAT} endInputProps={{ onBlur }} popoverProps={{ usePortal: false }} />,
                );

                await userEvent.click(getEndInputElement());
                await userEvent.tab();

                expect(onBlur.calledOnce).to.be.true;
            });

            it("calls onKeyDown when a key is pressed", async () => {
                const onKeyDown = sinon.spy();
                render(
                    <DateRangeInput3
                        {...DATE_FORMAT}
                        endInputProps={{ onKeyDown }}
                        popoverProps={{ usePortal: false }}
                    />,
                );

                await userEvent.type(getEndInputElement(), "{enter}");

                expect(onKeyDown.calledOnce).to.be.true;
            });

            it("calls onMouseDown when the input is clicked", async () => {
                const onMouseDown = sinon.spy();
                render(
                    <DateRangeInput3
                        {...DATE_FORMAT}
                        endInputProps={{ onMouseDown }}
                        popoverProps={{ usePortal: false }}
                    />,
                );

                await userEvent.click(getEndInputElement());

                expect(onMouseDown.calledOnce).to.be.true;
            });
        });
    });

    describe("placeholder text", () => {
        it("shows proper placeholder text when empty inputs are focused and unfocused", async () => {
            const MIN_DATE = new Date(2022, Months.JANUARY, 1);
            const MAX_DATE = new Date(2022, Months.JANUARY, 31);
            render(<DateRangeInput3 {...DATE_FORMAT} minDate={MIN_DATE} maxDate={MAX_DATE} />);
            const startInput = getStartInputElement();
            const endInput = getEndInputElement();

            await userEvent.click(startInput);

            expect(startInput.placeholder).to.equal(DATE_FORMAT.formatDate(MIN_DATE));

            await userEvent.tab();

            expect(endInput.placeholder).to.equal(DATE_FORMAT.formatDate(MAX_DATE));
        });

        it("updates placeholder text properly when format changes", async () => {
            const FORMAT = getDateFnsFormatter("MM/dd/yyyy");
            const MIN_DATE = new Date(2022, Months.JANUARY, 1);
            const MAX_DATE = new Date(2022, Months.JANUARY, 31);
            render(<DateRangeInput3 {...FORMAT} minDate={MIN_DATE} maxDate={MAX_DATE} />);
            const startInput = getStartInputElement();
            const endInput = getEndInputElement();

            await userEvent.click(startInput);

            expect(startInput.placeholder).to.equal(FORMAT.formatDate(MIN_DATE));

            await userEvent.tab();

            expect(endInput.placeholder).to.equal(FORMAT.formatDate(MAX_DATE));
        });
    });

    it("inputs disable and popover doesn't open if disabled=true", async () => {
        const { container } = render(
            <DateRangeInput3 {...DATE_FORMAT} disabled={true} popoverProps={{ usePortal: false }} />,
        );
        const startInput = getStartInputElement();
        const endInput = getEndInputElement();

        await userEvent.click(startInput);
        await userEvent.click(endInput);

        expect(getPopover(container)).to.be.null;
        expect(startInput.getAttribute("aria-disabled")).to.equal("true");
        expect(endInput.getAttribute("aria-disabled")).to.equal("true");
    });

    describe("closeOnSelection", () => {
        it("if closeOnSelection=false, popover stays open when full date range is selected", async () => {
            const { container } = render(
                <DateRangeInput3 {...DATE_FORMAT} closeOnSelection={false} popoverProps={{ usePortal: false }} />,
            );

            await userEvent.click(getStartInputElement());
            await userEvent.click(getPastWeekMenuItem());

            expect(getPopover(container)).not.to.be.null;
        });

        it("if closeOnSelection=true, popover closes when full date range is selected", async () => {
            const { container } = render(
                <DateRangeInput3 {...DATE_FORMAT} closeOnSelection={true} popoverProps={{ usePortal: false }} />,
            );

            await userEvent.click(getStartInputElement());
            await userEvent.click(getPastWeekMenuItem());

            await waitForElementToBeRemoved(() => getPopover(container));
        });

        it("if closeOnSelection=true && timePrecision != null, popover closes when full date range is selected", async () => {
            const { container } = render(
                <DateRangeInput3
                    {...DATE_FORMAT}
                    timePrecision={TimePrecision.MINUTE}
                    popoverProps={{ usePortal: false }}
                    singleMonthOnly={true}
                />,
            );

            await userEvent.click(getStartInputElement());
            await userEvent.click(getPastWeekMenuItem());

            await waitForElementToBeRemoved(() => getPopover(container));
        });
    });

    it("accepts contiguousCalendarMonths prop and passes it to the date range picker", async () => {
        render(<DateRangeInput3 contiguousCalendarMonths={false} />);

        await userEvent.click(getStartInputElement());

        // with contiguousCalendarMonths={false}, we should see two buttons for going forward/backward a month
        expect(await screen.findAllByRole("button", { name: /go to next month/i })).to.have.lengthOf(2);
        expect(await screen.findAllByRole("button", { name: /go to previous month/i })).to.have.lengthOf(2);
    });

    it("accepts singleMonthOnly prop and passes it to the date range picker", async () => {
        render(<DateRangeInput3 singleMonthOnly={true} />);

        await userEvent.click(getStartInputElement());

        // with singleMonthOnly={true}, we should only see one month grid
        expect(screen.getAllByRole("grid")).to.have.lengthOf(1);
    });

    it("accepts shortcuts prop and passes it to the date range picker", async () => {
        render(<DateRangeInput3 shortcuts={false} />);

        await userEvent.click(getStartInputElement());

        // with shortcuts={false}, we should not see any shortcut buttons
        expect(screen.queryByRole("menu", { name: /date picker shortcuts/i })).to.be.null;
    });

    it("should update the selectedShortcutIndex state when clicking on a shortcut", async () => {
        render(<DateRangeInput3 closeOnSelection={false} />);

        await userEvent.click(getStartInputElement());

        const pastWeek = getPastWeekMenuItem();
        await userEvent.click(pastWeek);

        // This is a bit of a hack, the shortcuts menu doesn't currently expose a selected role on menu items
        expect(pastWeek.classList.contains(CoreClasses.ACTIVE)).to.be.true;
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
        it("if false (the default), does not select any text on focus", async () => {
            render(<DateRangeInput3 {...DATE_FORMAT} defaultValue={[START_DATE, null]} />);
            const startInput = getStartInputElement();

            await userEvent.click(startInput);

            expect(startInput.selectionStart).to.equal(startInput.selectionEnd);
        });

        it("if true, selects all text on focus", async () => {
            render(<DateRangeInput3 {...DATE_FORMAT} defaultValue={[START_DATE, null]} selectAllOnFocus={true} />);
            const startInput = getStartInputElement();

            fireEvent.focus(startInput);

            expect(startInput.selectionStart).to.equal(0);
            expect(startInput.selectionEnd).to.equal(START_STR.length);
        });

        it("if true, selects all text on day hover in calendar", async () => {
            render(<DateRangeInput3 {...DATE_FORMAT} selectAllOnFocus={true} />);
            const startInput = getStartInputElement();

            await userEvent.click(startInput);

            const day = screen.getAllByRole("gridcell", { name: "1" });
            const firstDay = day[0];

            await userEvent.hover(firstDay);

            expect(startInput.selectionStart).to.equal(0);
            expect(startInput.selectionEnd).to.be.greaterThan(0);
        });
    });

    describe("allowSingleDayRange", () => {
        it("allows start and end to be the same day when clicking", async () => {
            render(
                <DateRangeInput3 {...DATE_FORMAT} allowSingleDayRange={true} defaultValue={[START_DATE, END_DATE]} />,
            );
            const startInput = getStartInputElement();
            const endInput = getEndInputElement();

            await userEvent.click(endInput);

            // range of selected days
            const selected = screen.getAllByRole("gridcell", { selected: true });

            expect(selected).to.have.lengthOf(3);

            // click on the last day of the range
            await userEvent.click(selected[selected.length - 1]);

            // click on the first day of the range
            await userEvent.click(selected[0]);

            expect(startInput.value).to.equal(START_STR);
            expect(endInput.value).to.equal(START_STR);
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

        it("ignores autoFocus, enforceFocus, and content in custom popoverProps", async () => {
            const CUSTOM_CONTENT = "Here is some custom content";
            const popoverProps = {
                autoFocus: true,
                content: CUSTOM_CONTENT,
                enforceFocus: true,
                usePortal: false,
            };
            render(<DateRangeInput3 {...DATE_FORMAT} popoverProps={popoverProps} />);
            const startInput = getStartInputElement();

            await userEvent.click(startInput);

            expect(document.activeElement).to.equal(startInput);
            expect(screen.queryByText(CUSTOM_CONTENT)).to.be.null;
        });
    });

    describe("when uncontrolled", () => {
        it("Shows empty fields when defaultValue is [null, null]", () => {
            render(<DateRangeInput3 {...DATE_FORMAT} defaultValue={[null, null]} />);

            expect(getStartInputElement().value).to.equal("");
            expect(getEndInputElement().value).to.equal("");
        });

        it("Shows empty start field and formatted date in end field when defaultValue is [null, <date>]", () => {
            render(<DateRangeInput3 {...DATE_FORMAT} defaultValue={[null, END_DATE]} />);

            expect(getStartInputElement().value).to.equal("");
            expect(getEndInputElement().value).to.equal(END_STR);
        });

        it("Shows empty end field and formatted date in start field when defaultValue is [<date>, null]", () => {
            render(<DateRangeInput3 {...DATE_FORMAT} defaultValue={[START_DATE, null]} />);

            expect(getStartInputElement().value).to.equal(START_STR);
            expect(getEndInputElement().value).to.equal("");
        });

        it("Shows formatted dates in both fields when defaultValue is [<date1>, <date2>]", () => {
            render(<DateRangeInput3 {...DATE_FORMAT} defaultValue={[START_DATE, END_DATE]} />);

            expect(getStartInputElement().value).to.equal(START_STR);
            expect(getEndInputElement().value).to.equal(END_STR);
        });

        it("Pressing Enter saves the inputted date and closes the popover", async () => {
            const { container } = render(<DateRangeInput3 {...DATE_FORMAT} popoverProps={{ usePortal: false }} />);
            const startInput = getStartInputElement();
            const endInput = getEndInputElement();

            await userEvent.type(startInput, START_STR);
            await userEvent.type(startInput, "{enter}");

            expect(document.activeElement).not.to.equal(startInput);
            expect(document.activeElement).to.equal(endInput);

            await userEvent.type(endInput, END_STR);
            await userEvent.type(endInput, "{enter}");

            await waitForElementToBeRemoved(() => getPopover(container));

            expect(startInput.value).to.equal(START_STR);
            expect(endInput.value).to.equal(END_STR);
        });

        it("Clicking a date invokes onChange with the new date range and updates the input fields", async () => {
            const defaultValue = [START_DATE, null] as DateRange;
            const onChange = sinon.spy();
            render(
                <DateRangeInput3
                    {...DATE_FORMAT}
                    closeOnSelection={false}
                    defaultValue={defaultValue}
                    onChange={onChange}
                    singleMonthOnly={true}
                />,
            );
            const startInput = getStartInputElement();
            const endInput = getEndInputElement();

            await userEvent.click(endInput);

            const startDay = screen.getByRole("gridcell", { name: `${START_DAY}` });
            const endDay = screen.getByRole("gridcell", { name: `${END_DAY}` });

            await userEvent.click(endDay);

            expect(onChange.getCall(0).args[0]).to.deep.equal([new Date(START_STR), new Date(END_STR)]);
            expect(startInput.value).to.equal(START_STR);
            expect(endInput.value).to.equal(END_STR);

            await userEvent.click(startDay);

            expect(onChange.getCall(1).args[0]).to.deep.equal([null, new Date(END_STR)]);
            expect(startInput.value).to.equal("");
            expect(endInput.value).to.equal(END_STR);

            await userEvent.click(endDay);

            expect(onChange.getCall(2).args[0]).to.deep.equal([null, null]);
            expect(startInput.value).to.equal("");
            expect(endInput.value).to.equal("");

            await userEvent.click(startDay);

            expect(onChange.getCall(3).args[0]).to.deep.equal([new Date(START_STR), null]);
            expect(startInput.value).to.equal(START_STR);
            expect(endInput.value).to.equal("");

            expect(onChange.callCount).to.equal(4);
        });

        it("Typing a valid start or end date invokes onChange with the new date range and updates the input fields", async () => {
            const onChange = sinon.spy();
            render(<DateRangeInput3 {...DATE_FORMAT} onChange={onChange} />);
            const startInput = getStartInputElement();
            const endInput = getEndInputElement();

            await userEvent.type(startInput, START_STR_2);

            expect(onChange.callCount).to.equal(1);
            expect(onChange.getCall(0).args[0]).to.deep.equal([new Date(START_STR_2), null]);
            expect(startInput.value).to.equal(START_STR_2);

            await userEvent.type(endInput, END_STR_2);

            expect(onChange.callCount).to.equal(2);
            expect(onChange.getCall(1).args[0]).to.deep.equal([new Date(START_STR_2), new Date(END_STR_2)]);
            expect(startInput.value).to.equal(START_STR_2);
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
            it("shows the error message on blur", async () => {
                render(
                    <DateRangeInput3
                        {...DATE_FORMAT}
                        minDate={OUT_OF_RANGE_TEST_MIN}
                        maxDate={OUT_OF_RANGE_TEST_MAX}
                        outOfRangeMessage={OUT_OF_RANGE_MESSAGE}
                    />,
                );
                const startInput = getStartInputElement();
                const endInput = getEndInputElement();

                await userEvent.type(startInput, OUT_OF_RANGE_START_STR);
                await userEvent.tab();

                expect(startInput.value).to.equal(OUT_OF_RANGE_MESSAGE);

                await userEvent.type(endInput, OUT_OF_RANGE_END_STR);
                await userEvent.tab();

                expect(endInput.value).to.equal(OUT_OF_RANGE_MESSAGE);
            });

            it("shows the offending date in the field on focus", async () => {
                render(
                    <DateRangeInput3
                        {...DATE_FORMAT}
                        minDate={OUT_OF_RANGE_TEST_MIN}
                        maxDate={OUT_OF_RANGE_TEST_MAX}
                        outOfRangeMessage={OUT_OF_RANGE_MESSAGE}
                    />,
                );
                const startInput = getStartInputElement();
                const endInput = getEndInputElement();

                await userEvent.type(startInput, OUT_OF_RANGE_START_STR);
                await userEvent.tab();
                await userEvent.click(startInput);

                expect(startInput.value).to.equal(OUT_OF_RANGE_START_STR);

                await userEvent.type(endInput, OUT_OF_RANGE_END_STR);
                await userEvent.tab();
                await userEvent.click(endInput);

                expect(endInput.value).to.equal(OUT_OF_RANGE_END_STR);
            });

            it("calls onError with invalid date on startInput blur", async () => {
                const onError = sinon.spy();
                render(
                    <DateRangeInput3
                        {...DATE_FORMAT}
                        minDate={OUT_OF_RANGE_TEST_MIN}
                        maxDate={OUT_OF_RANGE_TEST_MAX}
                        onError={onError}
                    />,
                );

                await userEvent.type(getStartInputElement(), OUT_OF_RANGE_START_STR);

                expect(onError.called).to.be.false;

                await userEvent.tab();

                expect(onError.calledOnce).to.be.true;

                expect(onError.getCall(0).args[0]).to.deep.equal([new Date(OUT_OF_RANGE_START_STR), null]);
            });

            it("calls onError with invalid date on endInput blur", async () => {
                const onError = sinon.spy();
                render(
                    <DateRangeInput3
                        {...DATE_FORMAT}
                        minDate={OUT_OF_RANGE_TEST_MIN}
                        maxDate={OUT_OF_RANGE_TEST_MAX}
                        onError={onError}
                    />,
                );

                await userEvent.type(getEndInputElement(), OUT_OF_RANGE_END_STR);

                expect(onError.called).to.be.false;

                await userEvent.tab();

                expect(onError.calledOnce).to.be.true;

                expect(onError.getCall(0).args[0]).to.deep.equal([null, new Date(OUT_OF_RANGE_END_STR)]);
            });

            it("does NOT call onChange before OR after blur", async () => {
                const onChange = sinon.spy();
                render(
                    <DateRangeInput3
                        {...DATE_FORMAT}
                        minDate={OUT_OF_RANGE_TEST_MIN}
                        maxDate={OUT_OF_RANGE_TEST_MAX}
                        onChange={onChange}
                    />,
                );
                const startInput = getStartInputElement();
                const endInput = getEndInputElement();

                await userEvent.type(startInput, OUT_OF_RANGE_START_STR);
                await userEvent.tab();

                expect(onChange.called).to.be.false;

                await userEvent.type(endInput, OUT_OF_RANGE_END_STR);
                await userEvent.tab();

                expect(onChange.called).to.be.false;
            });

            it("removes error message if input is changed to an in-range date again", async () => {
                render(
                    <DateRangeInput3
                        {...DATE_FORMAT}
                        minDate={OUT_OF_RANGE_TEST_MIN}
                        maxDate={OUT_OF_RANGE_TEST_MAX}
                        outOfRangeMessage={OUT_OF_RANGE_MESSAGE}
                    />,
                );
                const startInput = getStartInputElement();
                const endInput = getEndInputElement();

                await userEvent.type(startInput, OUT_OF_RANGE_START_STR);
                await userEvent.tab();

                expect(startInput.value).to.equal(OUT_OF_RANGE_MESSAGE);

                await userEvent.clear(startInput);
                await userEvent.type(startInput, START_STR);
                await userEvent.tab();

                expect(startInput.value).to.equal(START_STR);

                await userEvent.type(endInput, OUT_OF_RANGE_END_STR);
                await userEvent.tab();

                expect(endInput.value).to.equal(OUT_OF_RANGE_MESSAGE);

                await userEvent.clear(endInput);
                await userEvent.type(endInput, END_STR);
                await userEvent.tab();

                expect(endInput.value).to.equal(END_STR);
            });
        });

        describe("Typing an invalid date", () => {
            it("shows the error message on blur", async () => {
                render(<DateRangeInput3 {...DATE_FORMAT} invalidDateMessage={INVALID_MESSAGE} />);
                const startInput = getStartInputElement();
                const endInput = getEndInputElement();

                await userEvent.type(startInput, INVALID_STR);
                await userEvent.tab();

                expect(startInput.value).to.equal(INVALID_MESSAGE);

                await userEvent.type(endInput, INVALID_STR);
                await userEvent.tab();

                expect(endInput.value).to.equal(INVALID_MESSAGE);
            });

            it("keeps showing the error message on next focus", async () => {
                render(<DateRangeInput3 {...DATE_FORMAT} invalidDateMessage={INVALID_MESSAGE} />);
                const startInput = getStartInputElement();
                const endInput = getEndInputElement();

                await userEvent.type(startInput, INVALID_STR);
                await userEvent.tab();
                await userEvent.click(startInput);

                expect(startInput.value).to.equal(INVALID_MESSAGE);

                await userEvent.type(endInput, INVALID_STR);
                await userEvent.tab();
                await userEvent.click(endInput);

                expect(endInput.value).to.equal(INVALID_MESSAGE);
            });

            it("calls onError on blur with Date(undefined) in place of the invalid date", async () => {
                const onError = sinon.spy();
                render(<DateRangeInput3 {...DATE_FORMAT} invalidDateMessage={INVALID_MESSAGE} onError={onError} />);
                const startInput = getStartInputElement();
                const endInput = getEndInputElement();

                await userEvent.type(startInput, INVALID_STR);
                await userEvent.tab();

                expect(onError.calledOnce).to.be.true;

                expect((onError.getCall(0).args[0][0] as Date).valueOf()).to.be.NaN;

                await userEvent.type(endInput, INVALID_STR);
                await userEvent.tab();

                expect(onError.calledTwice).to.be.true;

                expect((onError.getCall(1).args[0][1] as Date).valueOf()).to.be.NaN;
            });

            it("does NOT call onChange before OR after blur", async () => {
                const onChange = sinon.spy();
                render(<DateRangeInput3 {...DATE_FORMAT} invalidDateMessage={INVALID_MESSAGE} onChange={onChange} />);
                const startInput = getStartInputElement();
                const endInput = getEndInputElement();

                await userEvent.type(startInput, INVALID_STR);
                await userEvent.tab();

                expect(onChange.called).to.be.false;

                await userEvent.type(endInput, INVALID_STR);
                await userEvent.tab();

                expect(onChange.called).to.be.false;
            });

            it("removes error message if input is changed to an in-range date again", async () => {
                render(<DateRangeInput3 {...DATE_FORMAT} invalidDateMessage={INVALID_MESSAGE} />);
                const startInput = getStartInputElement();
                const endInput = getEndInputElement();

                await userEvent.type(startInput, INVALID_STR);
                await userEvent.tab();

                expect(startInput.value).to.equal(INVALID_MESSAGE);

                await userEvent.clear(startInput);
                await userEvent.type(startInput, START_STR);
                await userEvent.tab();

                expect(startInput.value).to.equal(START_STR);

                await userEvent.type(endInput, INVALID_STR);
                await userEvent.tab();

                expect(endInput.value).to.equal(INVALID_MESSAGE);

                await userEvent.clear(endInput);
                await userEvent.type(endInput, END_STR);
                await userEvent.tab();

                expect(endInput.value).to.equal(END_STR);
            });

            it("calls onChange if startInput is in range and endInput is out of range", async () => {
                const onChange = sinon.spy();
                render(<DateRangeInput3 {...DATE_FORMAT} invalidDateMessage={INVALID_MESSAGE} onChange={onChange} />);
                const startInput = getStartInputElement();
                const endInput = getEndInputElement();

                await userEvent.type(startInput, OUT_OF_RANGE_START_STR);
                await userEvent.tab();

                expect(onChange.called).to.be.false;

                await userEvent.type(endInput, END_STR);
                await userEvent.tab();

                expect(onChange.calledOnce).to.be.true;

                expect(onChange.getCall(0).args[0]).to.deep.equal([
                    new Date(OUT_OF_RANGE_START_STR),
                    new Date(END_STR),
                ]);
            });

            it("calls onChange if startInput is out of range and endInput is in range", async () => {
                const onChange = sinon.spy();
                render(<DateRangeInput3 {...DATE_FORMAT} invalidDateMessage={INVALID_MESSAGE} onChange={onChange} />);
                const startInput = getStartInputElement();
                const endInput = getEndInputElement();

                await userEvent.type(endInput, OUT_OF_RANGE_END_STR);
                await userEvent.tab();

                expect(onChange.called).to.be.false;

                await userEvent.type(startInput, START_STR);
                await userEvent.tab();

                expect(onChange.called).to.be.true;
            });
        });

        describe("Typing an overlapping date time", () => {
            describe("in the end field", () => {
                it("shows an error message when the start time is later than the end time", async () => {
                    const onChange = sinon.spy();
                    render(
                        <DateRangeInput3
                            {...DATETIME_FORMAT}
                            allowSingleDayRange={true}
                            defaultValue={DATE_RANGE_3}
                            overlappingDatesMessage={OVERLAPPING_DATES_MESSAGE}
                            onChange={onChange}
                            timePrecision={TimePrecision.MINUTE}
                        />,
                    );
                    const startInput = getStartInputElement();
                    const endInput = getEndInputElement();

                    await userEvent.clear(startInput);
                    await userEvent.type(startInput, OVERLAPPING_START_DT_STR);
                    await userEvent.tab();

                    expect(startInput.value).to.equal(OVERLAPPING_START_DT_STR);

                    await userEvent.clear(endInput);
                    await userEvent.type(endInput, OVERLAPPING_END_DT_STR);
                    await userEvent.tab();

                    expect(endInput.value).to.equal(OVERLAPPING_DATES_MESSAGE);
                });
            });
        });

        // this test sub-suite is structured a little differently because of the
        // different semantics of this error case in each field
        describe("Typing an overlapping date", () => {
            describe("in the start field", () => {
                it("shows an error message in the end field right away", async () => {
                    render(
                        <DateRangeInput3
                            {...DATE_FORMAT}
                            defaultValue={DATE_RANGE}
                            overlappingDatesMessage={OVERLAPPING_DATES_MESSAGE}
                        />,
                    );
                    const startInput = getStartInputElement();
                    const endInput = getEndInputElement();

                    await userEvent.clear(startInput);
                    await userEvent.type(startInput, OVERLAPPING_START_STR);

                    expect(endInput.value).to.equal(OVERLAPPING_DATES_MESSAGE);
                });

                it("shows the offending date in the end field on focus in the end field", async () => {
                    render(
                        <DateRangeInput3
                            {...DATE_FORMAT}
                            defaultValue={DATE_RANGE}
                            overlappingDatesMessage={OVERLAPPING_DATES_MESSAGE}
                        />,
                    );
                    const startInput = getStartInputElement();
                    const endInput = getEndInputElement();

                    await userEvent.clear(startInput);
                    await userEvent.type(startInput, OVERLAPPING_START_STR);

                    expect(endInput.value).to.equal(OVERLAPPING_DATES_MESSAGE);

                    await userEvent.tab();

                    expect(endInput.value).to.equal(END_STR);
                });

                it("calls onError with [<overlappingDate>, <endDate>] on blur", async () => {
                    const onError = sinon.spy();
                    render(
                        <DateRangeInput3
                            {...DATE_FORMAT}
                            defaultValue={DATE_RANGE}
                            overlappingDatesMessage={OVERLAPPING_DATES_MESSAGE}
                            onError={onError}
                        />,
                    );
                    const startInput = getStartInputElement();

                    await userEvent.clear(startInput);
                    await userEvent.type(startInput, OVERLAPPING_START_STR);
                    await userEvent.tab();

                    expect(onError.calledOnce).to.be.true;

                    expect(onError.getCall(0).args[0]).to.deep.equal([
                        new Date(OVERLAPPING_START_STR),
                        new Date(END_STR),
                    ]);
                });

                it("does NOT call onChange before OR after blur", async () => {
                    const onChange = sinon.spy();
                    render(
                        <DateRangeInput3
                            {...DATE_FORMAT}
                            defaultValue={DATE_RANGE}
                            overlappingDatesMessage={OVERLAPPING_DATES_MESSAGE}
                            onChange={onChange}
                        />,
                    );
                    const startInput = getStartInputElement();

                    // avoid calling userEvent.clear() because it triggers onChange
                    // triple click to select all text and then type to replace it
                    await userEvent.dblClick(startInput);
                    await userEvent.keyboard(OVERLAPPING_START_STR);
                    await userEvent.tab();

                    expect(onChange.called).to.be.false;
                });

                it("removes error message if input is changed to an in-range date again", async () => {
                    render(
                        <DateRangeInput3
                            {...DATE_FORMAT}
                            defaultValue={DATE_RANGE}
                            overlappingDatesMessage={OVERLAPPING_DATES_MESSAGE}
                        />,
                    );
                    const startInput = getStartInputElement();
                    const endInput = getEndInputElement();

                    await userEvent.clear(startInput);
                    await userEvent.type(startInput, OVERLAPPING_START_STR);
                    await userEvent.clear(startInput);
                    await userEvent.type(startInput, START_STR);

                    expect(endInput.value).to.equal(END_STR);
                });
            });

            describe("in the end field", () => {
                it("shows an error message in the end field on blur", async () => {
                    render(
                        <DateRangeInput3
                            {...DATE_FORMAT}
                            defaultValue={DATE_RANGE}
                            overlappingDatesMessage={OVERLAPPING_DATES_MESSAGE}
                        />,
                    );
                    const endInput = getEndInputElement();

                    await userEvent.clear(endInput);
                    await userEvent.type(endInput, OVERLAPPING_END_STR);

                    expect(endInput.value).to.equal(OVERLAPPING_END_STR);

                    await userEvent.tab();

                    expect(endInput.value).to.equal(OVERLAPPING_DATES_MESSAGE);
                });

                it("shows the offending date in the end field on re-focus", async () => {
                    render(
                        <DateRangeInput3
                            {...DATE_FORMAT}
                            defaultValue={DATE_RANGE}
                            overlappingDatesMessage={OVERLAPPING_DATES_MESSAGE}
                        />,
                    );
                    const endInput = getEndInputElement();

                    await userEvent.clear(endInput);
                    await userEvent.type(endInput, OVERLAPPING_END_STR);
                    await userEvent.tab();
                    await userEvent.click(endInput);

                    expect(endInput.value).to.equal(OVERLAPPING_END_STR);
                });

                it("calls onError with [<startDate>, <overlappingDate>] on blur", async () => {
                    const onError = sinon.spy();
                    render(
                        <DateRangeInput3
                            {...DATE_FORMAT}
                            defaultValue={DATE_RANGE}
                            overlappingDatesMessage={OVERLAPPING_DATES_MESSAGE}
                            onError={onError}
                        />,
                    );
                    const endInput = getEndInputElement();

                    await userEvent.clear(endInput);
                    await userEvent.type(endInput, OVERLAPPING_END_STR);

                    expect(onError.called).to.be.false;

                    await userEvent.tab();

                    expect(onError.calledOnce).to.be.true;
                    expect(onError.getCall(0).args[0]).to.deep.equal([
                        new Date(START_STR),
                        new Date(OVERLAPPING_END_STR),
                    ]);
                });

                it("does NOT call onChange before OR after blur", async () => {
                    const onChange = sinon.spy();
                    render(
                        <DateRangeInput3
                            {...DATE_FORMAT}
                            defaultValue={DATE_RANGE}
                            overlappingDatesMessage={OVERLAPPING_DATES_MESSAGE}
                            onChange={onChange}
                        />,
                    );
                    const endInput = getEndInputElement();

                    // avoid calling userEvent.clear() because it triggers onChange
                    // triple click to select all text and then type to replace it
                    await userEvent.dblClick(endInput);
                    await userEvent.keyboard(OVERLAPPING_START_STR);
                    await userEvent.tab();

                    expect(onChange.called).to.be.false;
                });

                it("removes error message if input is changed to an in-range date again", async () => {
                    render(
                        <DateRangeInput3
                            {...DATE_FORMAT}
                            defaultValue={DATE_RANGE}
                            overlappingDatesMessage={OVERLAPPING_DATES_MESSAGE}
                        />,
                    );
                    const endInput = getEndInputElement();

                    await userEvent.clear(endInput);
                    await userEvent.type(endInput, OVERLAPPING_END_STR);
                    await userEvent.clear(endInput);
                    await userEvent.type(endInput, END_STR);

                    expect(endInput.value).to.equal(END_STR);
                });
            });
        });

        describe("Arrow key navigation", () => {
            it("Pressing an arrow key has no effect when the input is not fully selected", async () => {
                const onChange = sinon.spy();
                render(<DateRangeInput3 {...DATE_FORMAT} onChange={onChange} defaultValue={DATE_RANGE} />);

                await userEvent.click(getStartInputElement());
                await userEvent.keyboard("{arrowdown}");

                expect(onChange.called).to.be.false;

                await userEvent.click(getEndInputElement());
                await userEvent.keyboard("{arrowdown}");

                expect(onChange.called).to.be.false;
            });

            it("Pressing the left arrow key moves the date back by a day", async () => {
                const onChange = sinon.spy();
                render(
                    <DateRangeInput3
                        {...DATE_FORMAT}
                        onChange={onChange}
                        defaultValue={DATE_RANGE}
                        selectAllOnFocus={true}
                    />,
                );
                const startInput = getStartInputElement();

                const expectedStartDate1 = DATE_FORMAT.formatDate(new Date(YEAR, Months.JANUARY, START_DAY - 1));
                const expectedStartDate2 = DATE_FORMAT.formatDate(new Date(YEAR, Months.JANUARY, START_DAY - 2));

                await userEvent.click(startInput);
                await userEvent.keyboard("{arrowleft}");

                expect(startInput.value).to.equal(expectedStartDate1);
                expect(onChange.getCall(0).args[0]).to.deep.equal([new Date(expectedStartDate1), new Date(END_STR)]);

                await userEvent.keyboard("{arrowleft}");

                expect(startInput.value).to.equal(expectedStartDate2);
                expect(onChange.getCall(1).args[0]).to.deep.equal([new Date(expectedStartDate2), new Date(END_STR)]);
            });

            it("Pressing the right arrow key moves the date forward by a day", async () => {
                const onChange = sinon.spy();
                render(
                    <DateRangeInput3
                        {...DATE_FORMAT}
                        onChange={onChange}
                        defaultValue={DATE_RANGE}
                        selectAllOnFocus={true}
                    />,
                );
                const endInput = getEndInputElement();

                const expectedEndDate1 = DATE_FORMAT.formatDate(new Date(YEAR, Months.JANUARY, END_DAY + 1));
                const expectedEndDate2 = DATE_FORMAT.formatDate(new Date(YEAR, Months.JANUARY, END_DAY + 2));

                await userEvent.click(endInput);
                await userEvent.keyboard("{arrowright}");

                expect(endInput.value).to.equal(expectedEndDate1);
                expect(onChange.getCall(0).args[0]).to.deep.equal([new Date(START_STR), new Date(expectedEndDate1)]);

                await userEvent.keyboard("{arrowright}");

                expect(endInput.value).to.equal(expectedEndDate2);
                expect(onChange.getCall(1).args[0]).to.deep.equal([new Date(START_STR), new Date(expectedEndDate2)]);
            });

            it("Pressing the up arrow key moves the date back by a week", async () => {
                const onChange = sinon.spy();
                render(
                    <DateRangeInput3
                        {...DATE_FORMAT}
                        onChange={onChange}
                        defaultValue={DATE_RANGE}
                        selectAllOnFocus={true}
                    />,
                );
                const startInput = getStartInputElement();

                const expectedStartDate1 = DATE_FORMAT.formatDate(new Date(YEAR, Months.JANUARY, START_DAY - 7));
                const expectedStartDate2 = DATE_FORMAT.formatDate(new Date(YEAR, Months.JANUARY, START_DAY - 14));

                await userEvent.click(startInput);
                await userEvent.keyboard("{arrowup}");

                expect(startInput.value).to.equal(expectedStartDate1);
                expect(onChange.getCall(0).args[0]).to.deep.equal([new Date(expectedStartDate1), new Date(END_STR)]);

                await userEvent.keyboard("{arrowup}");

                expect(startInput.value).to.equal(expectedStartDate2);
                expect(onChange.getCall(1).args[0]).to.deep.equal([new Date(expectedStartDate2), new Date(END_STR)]);
            });

            it("Pressing the down arrow key moves the date forward by a week", async () => {
                const onChange = sinon.spy();
                render(
                    <DateRangeInput3
                        {...DATE_FORMAT}
                        onChange={onChange}
                        defaultValue={DATE_RANGE}
                        selectAllOnFocus={true}
                    />,
                );
                const endInput = getEndInputElement();

                const expectedEndDate1 = DATE_FORMAT.formatDate(new Date(YEAR, Months.JANUARY, END_DAY + 7));
                const expectedEndDate2 = DATE_FORMAT.formatDate(new Date(YEAR, Months.FEBRUARY, 7));

                await userEvent.click(endInput);
                await userEvent.keyboard("{arrowdown}");

                expect(endInput.value).to.equal(expectedEndDate1);
                expect(onChange.getCall(0).args[0]).to.deep.equal([new Date(START_STR), new Date(expectedEndDate1)]);

                await userEvent.keyboard("{arrowdown}");

                expect(endInput.value).to.equal(expectedEndDate2);
                expect(onChange.getCall(1).args[0]).to.deep.equal([new Date(START_STR), new Date(expectedEndDate2)]);
            });

            it("Will not move past the end boundary", async () => {
                const onChange = sinon.spy();
                render(
                    <DateRangeInput3
                        {...DATE_FORMAT}
                        onChange={onChange}
                        defaultValue={DATE_RANGE}
                        selectAllOnFocus={true}
                    />,
                );
                const startInput = getStartInputElement();

                const expectedStartDate = DATE_FORMAT.formatDate(new Date(YEAR, Months.JANUARY, END_DAY - 1));

                await userEvent.click(startInput);
                await userEvent.keyboard("{arrowdown}");

                expect(startInput.value).to.equal(expectedStartDate);
                expect(onChange.getCall(0).args[0]).to.deep.equal([new Date(expectedStartDate), new Date(END_STR)]);
            });

            it("Will not move past the end boundary when allowSingleDayRange={true}", async () => {
                const onChange = sinon.spy();
                render(
                    <DateRangeInput3
                        {...DATE_FORMAT}
                        allowSingleDayRange={true}
                        onChange={onChange}
                        defaultValue={DATE_RANGE}
                        selectAllOnFocus={true}
                    />,
                );
                const startInput = getStartInputElement();

                await userEvent.click(startInput);
                await userEvent.keyboard("{arrowdown}");

                expect(startInput.value).to.equal(END_STR);
                expect(onChange.getCall(0).args[0]).to.deep.equal([new Date(END_STR), new Date(END_STR)]);
            });

            it("Will not move past the start boundary", async () => {
                const onChange = sinon.spy();
                render(
                    <DateRangeInput3
                        {...DATE_FORMAT}
                        onChange={onChange}
                        defaultValue={DATE_RANGE}
                        selectAllOnFocus={true}
                    />,
                );
                const endInput = getEndInputElement();

                const expectedEndDate = DATE_FORMAT.formatDate(new Date(YEAR, Months.JANUARY, START_DAY + 1));

                await userEvent.click(endInput);
                await userEvent.keyboard("{arrowup}");

                expect(endInput.value).to.equal(expectedEndDate);
                expect(onChange.getCall(0).args[0]).to.deep.equal([new Date(START_STR), new Date(expectedEndDate)]);
            });

            it("Will not move past the start boundary when allowSingleDayRange={true}", async () => {
                const onChange = sinon.spy();
                render(
                    <DateRangeInput3
                        {...DATE_FORMAT}
                        allowSingleDayRange={true}
                        onChange={onChange}
                        defaultValue={DATE_RANGE}
                        selectAllOnFocus={true}
                    />,
                );
                const endInput = getEndInputElement();

                await userEvent.click(endInput);
                await userEvent.keyboard("{arrowup}");

                expect(endInput.value).to.equal(START_STR);
                expect(onChange.getCall(0).args[0]).to.deep.equal([new Date(START_STR), new Date(START_STR)]);
            });

            it("Will not move past the min date", async () => {
                const minDate = new Date(YEAR, Months.JANUARY, START_DAY - 3);
                const minDateStr = DATE_FORMAT.formatDate(minDate);

                const onChange = sinon.spy();
                render(
                    <DateRangeInput3
                        {...DATE_FORMAT}
                        onChange={onChange}
                        defaultValue={DATE_RANGE}
                        minDate={minDate}
                        selectAllOnFocus={true}
                    />,
                );
                const startInput = getStartInputElement();

                await userEvent.click(startInput);
                await userEvent.keyboard("{arrowup}");

                expect(startInput.value).to.equal(minDateStr);
                expect(onChange.getCall(0).args[0]).to.deep.equal([minDate, new Date(END_STR)]);
            });

            it("Will not move past the max date", async () => {
                const maxDate = new Date(YEAR, Months.JANUARY, END_DAY + 3);
                const maxDateStr = DATE_FORMAT.formatDate(maxDate);

                const onChange = sinon.spy();
                render(
                    <DateRangeInput3
                        {...DATE_FORMAT}
                        onChange={onChange}
                        defaultValue={DATE_RANGE}
                        maxDate={maxDate}
                        selectAllOnFocus={true}
                    />,
                );
                const endInput = getEndInputElement();

                await userEvent.click(endInput);
                await userEvent.keyboard("{arrowdown}");

                expect(endInput.value).to.equal(maxDateStr);
                expect(onChange.getCall(0).args[0]).to.deep.equal([START_DATE, maxDate]);
            });

            it("Will select today's date by default", async () => {
                const onChange = sinon.spy();
                render(<DateRangeInput3 {...DATE_FORMAT} onChange={onChange} />);
                const startInput = getStartInputElement();

                const today = DATE_FORMAT.formatDate(new Date());

                await userEvent.click(startInput);
                await userEvent.keyboard("{arrowdown}");

                expect(startInput.value).to.equal(today);
            });

            it("Will choose a reasonable end date when only the start is selected", async () => {
                const onChange = sinon.spy();
                render(<DateRangeInput3 {...DATE_FORMAT} onChange={onChange} defaultValue={[START_DATE, null]} />);
                const endInput = getEndInputElement();

                const expectedEndDate = DATE_FORMAT.formatDate(new Date(YEAR, Months.JANUARY, START_DAY + 1));

                await userEvent.click(endInput);
                await userEvent.keyboard("{arrowright}");

                expect(endInput.value).to.equal(expectedEndDate);
            });

            it("Will choose a reasonable start date when only the end is selected", async () => {
                const onChange = sinon.spy();
                render(<DateRangeInput3 {...DATE_FORMAT} onChange={onChange} defaultValue={[null, END_DATE]} />);
                const startInput = getStartInputElement();

                const expectedEndDate = DATE_FORMAT.formatDate(new Date(YEAR, Months.JANUARY, END_DAY - 7));

                await userEvent.click(startInput);
                await userEvent.keyboard("{arrowup}");

                expect(startInput.value).to.equal(expectedEndDate);
            });

            it("Will not make a selection when trying to move backward and only the start is selected", async () => {
                const onChange = sinon.spy();
                render(<DateRangeInput3 {...DATE_FORMAT} onChange={onChange} defaultValue={[START_DATE, null]} />);
                const endInput = getEndInputElement();

                await userEvent.click(endInput);
                await userEvent.keyboard("{arrowleft}");
                await userEvent.keyboard("{arrowup}");

                expect(endInput.value).to.equal("");
                expect(onChange.called).to.be.false;
            });

            it("Will not make a selection when trying to move forward and only the end is selected", async () => {
                const onChange = sinon.spy();
                render(<DateRangeInput3 {...DATE_FORMAT} onChange={onChange} defaultValue={[null, END_DATE]} />);
                const startInput = getStartInputElement();

                await userEvent.click(startInput);
                await userEvent.keyboard("{arrowright}");
                await userEvent.keyboard("{arrowdown}");

                expect(startInput.value).to.equal("");
                expect(onChange.called).to.be.false;
            });
        });

        // HACKHACK: skipped test resulting from React 18 upgrade. See: https://github.com/palantir/blueprint/issues/7168
        describe.skip("Hovering over dates", () => {
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
                React.act(() => {
                    root.setState({ isOpen: true, wasLastFocusChangeDueToHover: false });
                });
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
            React.act(() => {
                root.setState({ isOpen: true });
            });
            root.update();
            root.setProps({ value: DATE_RANGE_2 }).update();
            assertInputValuesEqual(root, START_STR_2, END_STR_2);
        });

        // HACKHACK: https://github.com/palantir/blueprint/issues/6109
        // N.B. this test passes locally
        it.skip("Pressing Enter saves the inputted date and closes the popover", () => {
            const onChange = sinon.spy();
            const { root } = wrap(<DateRangeInput3 {...DATE_FORMAT} onChange={onChange} value={[null, null]} />);
            React.act(() => {
                root.setState({ isOpen: true });
            });

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

        it("pressing Escape closes the popover", () => {
            const { root } = wrap(<DateRangeInput3 {...DATE_FORMAT} value={[null, null]} />);
            React.act(() => {
                root.setState({ isOpen: true });
            });

            const startInput = getStartInput(root);
            startInput.simulate("focus");

            expect(root.state("isOpen")).to.be.true;

            startInput.simulate("keydown", { key: "Escape" });

            expect(root.state("isOpen")).to.be.false;
            expect(isStartInputFocused(root)).to.be.false;
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

        describe("Arrow key navigation", () => {
            it("Pressing the left arrow key moves the date back by a day", () => {
                const onChange = sinon.spy();
                const { root } = wrap(
                    <DateRangeInput3 {...DATE_FORMAT} onChange={onChange} value={DATE_RANGE} selectAllOnFocus={true} />,
                );

                const expectedStartDate1 = DATE_FORMAT.formatDate(new Date(YEAR, Months.JANUARY, START_DAY - 1));

                getStartInput(root).simulate("focus");
                getStartInput(root).simulate("keydown", { key: "ArrowLeft" });
                assertInputValueEquals(getStartInput(root), expectedStartDate1);
                assertDateRangesEqual(onChange.getCall(0).args[0], [expectedStartDate1, END_STR]);
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
        it("Hovering and clicking on end date shows the new date in input, not a previously selected date", async () => {
            const DEC_1_DATE = new Date(2022, 11, 1);
            const DEC_1_STR = DATE_FORMAT.formatDate(DEC_1_DATE);
            const DEC_2_DATE = new Date(2022, 11, 2);
            const DEC_2_STR = DATE_FORMAT.formatDate(DEC_2_DATE);
            const DEC_6_DATE = new Date(2022, 11, 6);
            const DEC_6_STR = DATE_FORMAT.formatDate(DEC_6_DATE);
            const DEC_8_DATE = new Date(2022, 11, 8);
            const DEC_8_STR = DATE_FORMAT.formatDate(DEC_8_DATE);

            const Wrapper = () => {
                const [value, setValue] = React.useState<DateRange>([DEC_6_DATE, DEC_8_DATE]);
                return (
                    <DateRangeInput3
                        {...DATE_FORMAT}
                        closeOnSelection={false}
                        onChange={setValue}
                        popoverProps={{ usePortal: false }}
                        value={value}
                    />
                );
            };

            const { container } = render(<Wrapper />);
            const startInput = getStartInputElement();
            const endInput = getEndInputElement();

            await userEvent.click(startInput);

            await waitFor(() => {
                expect(getPopover(container)).to.exist;
            });

            // initial state
            expect(startInput.value).to.equal(DEC_6_STR);
            expect(endInput.value).to.equal(DEC_8_STR);

            // hover over Dec 1
            fireEvent.mouseEnter(getDayElementRTL(1));
            expect(startInput.value).to.equal(DEC_1_STR);
            expect(endInput.value).to.equal(DEC_8_STR);

            // click to select Dec 1
            await userEvent.click(getDayElementRTL(1));
            expect(startInput.value).to.equal(DEC_1_STR);
            expect(endInput.value).to.equal(DEC_8_STR);

            // re-focus on start input to ensure the component doesn't think we're changing the end boundary
            // (this mimics real UX, where the component-refocuses the start input after selecting a start date)
            await userEvent.click(startInput);

            // hover over Dec 2
            fireEvent.mouseEnter(getDayElementRTL(2));
            expect(startInput.value).to.equal(DEC_2_STR);

            // click to select Dec 2
            await userEvent.click(getDayElementRTL(2));
            expect(startInput.value).to.equal(DEC_2_STR);
            expect(endInput.value).to.equal(DEC_8_STR);
        });

        describe("localization", () => {
            describe("with formatDate & parseDate undefined", () => {
                it("formats date strings with provided Locale object", () => {
                    render(<DateRangeInput3 dateFnsFormat="PPP" locale={esLocale} value={DATE_RANGE_2} />);
                    expect(getStartInputElement().value).to.equal(START_STR_2_ES_LOCALE);
                    expect(getEndInputElement().value).to.equal(END_STR_2_ES_LOCALE);
                });

                it("formats date strings with async-loaded locale corresponding to provided locale code", async () => {
                    render(<DateRangeInput3 dateFnsFormat="PPP" locale="es" value={DATE_RANGE_2} />);
                    await waitFor(() => {
                        expect(getStartInputElement().value).to.equal(START_STR_2_ES_LOCALE);
                        expect(getEndInputElement().value).to.equal(END_STR_2_ES_LOCALE);
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

    function wrap(dateRangeInput: React.JSX.Element) {
        const wrapper = mount(dateRangeInput);
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

function getStartInputElement(): HTMLInputElement {
    return screen.getByPlaceholderText<HTMLInputElement>(/start date/i);
}

function getEndInputElement(): HTMLInputElement {
    return screen.getByPlaceholderText<HTMLInputElement>(/end date/i);
}

function getPopover(container: HTMLElement): HTMLElement | null {
    // HACK - this is brittle, but Popover does not currently expose an accessible way for us to query it in the DOM
    return container.querySelector(`.${CoreClasses.POPOVER}`);
}

function getPastWeekMenuItem(): HTMLElement {
    return screen.getByRole("menuitem", { name: /past week/i });
}

function getDayElementRTL(dayNumber: number): HTMLButtonElement {
    return screen.getAllByRole<HTMLButtonElement>("gridcell", { name: `${dayNumber}` })[0];
}
