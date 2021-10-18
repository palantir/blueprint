/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
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

import { assert } from "chai";
import { mount } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";

import { Classes as CoreClasses, InputGroup, Intent, Keys, Popover, Position } from "@blueprintjs/core";

import { Classes, DateInput, DatePicker, IDateInputProps, TimePicker, TimePrecision } from "../src";
import { Months } from "../src/common/months";
import { DATE_FORMAT } from "./common/dateFormat";
import * as DateTestUtils from "./common/dateTestUtils";

// Change the default for testability
DateInput.defaultProps.popoverProps = { usePortal: false };

describe("<DateInput>", () => {
    it("handles null inputs without crashing", () => {
        assert.doesNotThrow(() => mount(<DateInput {...DATE_FORMAT} value={null} />));
    });

    it.skip("handles string inputs without crashing", () => {
        // strings are not permitted in the interface, but are handled correctly by moment.
        assert.doesNotThrow(() => mount(<DateInput {...DATE_FORMAT} value={"7/8/1988 11:01:12" as any} />));
    });

    it("passes custom classNames to popover wrapper", () => {
        const CLASS_1 = "foo";
        const CLASS_2 = "bar";

        const wrapper = mount(
            <DateInput {...DATE_FORMAT} className={CLASS_1} popoverProps={{ className: CLASS_2, usePortal: false }} />,
        );
        wrapper.setState({ isOpen: true });

        const popoverTarget = wrapper.find(`.${CoreClasses.POPOVER_WRAPPER}`).hostNodes();
        assert.isTrue(popoverTarget.hasClass(CLASS_1));
        assert.isTrue(popoverTarget.hasClass(CLASS_2));
    });

    it("supports custom input props", () => {
        const wrapper = mount(
            <DateInput {...DATE_FORMAT} inputProps={{ style: { background: "yellow" }, tabIndex: 4 }} />,
        );
        const inputElement = wrapper.find("input").getDOMNode() as HTMLInputElement;
        assert.equal(inputElement.style.background, "yellow");
        assert.equal(inputElement.tabIndex, 4);
    });

    it("supports inputProps.inputRef", () => {
        let input: HTMLInputElement | null = null;
        mount(<DateInput {...DATE_FORMAT} inputProps={{ inputRef: ref => (input = ref) }} />);
        assert.instanceOf(input, HTMLInputElement);
    });

    it("Popover opens on input focus", () => {
        const wrapper = mount(<DateInput {...DATE_FORMAT} />);
        wrapper.find("input").simulate("focus");
        /* eslint-disable-next-line deprecation/deprecation */
        assert.isTrue(wrapper.find(Popover).prop("isOpen"));
    });

    it("Popover doesn't open if disabled=true", () => {
        const wrapper = mount(<DateInput {...DATE_FORMAT} disabled={true} />);
        wrapper.find("input").simulate("focus");
        /* eslint-disable-next-line deprecation/deprecation */
        assert.isFalse(wrapper.find(Popover).prop("isOpen"));
    });

    it("Popover closes when ESC key pressed", () => {
        const wrapper = mount(<DateInput {...DATE_FORMAT} />);
        wrapper.setState({ isOpen: true });
        /* eslint-disable-next-line deprecation/deprecation */
        assert.isTrue(wrapper.find(Popover).prop("isOpen"));
        wrapper.find("input").simulate("keydown", { which: Keys.ESCAPE });
        /* eslint-disable-next-line deprecation/deprecation */
        assert.isFalse(wrapper.find(Popover).prop("isOpen"));
    });

    // Skipping because simulate just invokes the function passed to React's "on<EventName>" prop
    // and doesn't actually simulate anything. Properly testing would require running with an actual
    // browser and focusing specific elements via the DOM API. This would require changing the Karma
    // config to run with Chrome instead of ChromeHeadless.
    it.skip("Popover closes when tabbing on first day of the month", () => {
        const defaultValue = new Date(2018, Months.FEBRUARY, 6, 15, 0, 0, 0);
        const wrapper = mount(<DateInput {...DATE_FORMAT} defaultValue={defaultValue} />);
        wrapper.find("input").simulate("focus").simulate("blur");
        // First day of month is the only .DayPicker-Day with tabIndex == 0
        /* eslint-disable-next-line deprecation/deprecation */
        const tabbables = wrapper.find(Popover).find(".DayPicker-Day").filter({ tabIndex: 0 });
        tabbables.simulate("keydown", { key: "Tab" });
        // manually updating wrapper is required with enzyme 3
        // ref: https://github.com/airbnb/enzyme/blob/master/docs/guides/migration-from-2-to-3.md#for-mount-updates-are-sometimes-required-when-they-werent-before
        wrapper.update();
        /* eslint-disable-next-line deprecation/deprecation */
        assert.isFalse(wrapper.find(Popover).prop("isOpen"));
    });

    it("Popover should not close if focus moves to previous day", () => {
        const defaultValue = new Date(2018, Months.FEBRUARY, 6, 15, 0, 0, 0);
        const wrapper = mount(<DateInput {...DATE_FORMAT} defaultValue={defaultValue} />);
        wrapper.find("input").simulate("focus").simulate("blur");
        /* eslint-disable-next-line deprecation/deprecation */
        const tabbables = wrapper.find(Popover).find(".DayPicker-Day").filter({ tabIndex: 0 });
        const firstDay = tabbables.getDOMNode() as HTMLElement;
        const lastDayOfPrevMonth = wrapper
            /* eslint-disable-next-line deprecation/deprecation */
            .find(Popover)
            .find(".DayPicker-Body > .DayPicker-Week .DayPicker-Day--outside")
            .last();
        const relatedTarget = lastDayOfPrevMonth.getDOMNode();
        const event = createFocusEvent("blur", relatedTarget);
        firstDay.dispatchEvent(event);
        wrapper.update();
        /* eslint-disable-next-line deprecation/deprecation */
        assert.isTrue(wrapper.find(Popover).prop("isOpen"));
    });

    it("Popover should not close if focus moves to month select", () => {
        const defaultValue = new Date(2018, Months.FEBRUARY, 6, 15, 0, 0, 0);
        const { root, changeSelect } = wrap(<DateInput {...DATE_FORMAT} defaultValue={defaultValue} />);
        root.setState({ isOpen: true });
        root.find("input").simulate("focus").simulate("blur");
        changeSelect(Classes.DATEPICKER_MONTH_SELECT, Months.FEBRUARY);
        /* eslint-disable-next-line deprecation/deprecation */
        assert.isTrue(root.find(Popover).prop("isOpen"));
    });

    it("Popover should not close if focus moves to year select", () => {
        const defaultValue = new Date(2018, Months.FEBRUARY, 6, 15, 0, 0, 0);
        const { root, changeSelect } = wrap(<DateInput {...DATE_FORMAT} defaultValue={defaultValue} />);
        root.setState({ isOpen: true });
        root.find("input").simulate("focus").simulate("blur");
        changeSelect(Classes.DATEPICKER_YEAR_SELECT, 2016);
        /* eslint-disable-next-line deprecation/deprecation */
        assert.isTrue(root.find(Popover).prop("isOpen"));
    });

    it("Popover should not close when time picker arrows are clicked after selecting a month", () => {
        const defaultValue = new Date(2018, Months.FEBRUARY, 6, 15, 0, 0, 0);
        const { root, changeSelect } = wrap(
            <DateInput
                {...DATE_FORMAT}
                defaultValue={defaultValue}
                timePrecision={TimePrecision.MINUTE}
                timePickerProps={{ showArrowButtons: true }}
            />,
        );
        root.setState({ isOpen: true }).update();
        changeSelect(Classes.DATEPICKER_MONTH_SELECT, Months.MARCH);
        root.find(`.${Classes.TIMEPICKER_ARROW_BUTTON}.${Classes.TIMEPICKER_HOUR}`).first().simulate("click");
        /* eslint-disable-next-line deprecation/deprecation */
        assert.isTrue(root.find(Popover).prop("isOpen"));
    });

    it("Popover should not close when time picker arrows are clicked after selecting a year", () => {
        const defaultValue = new Date(2018, Months.FEBRUARY, 6, 15, 0, 0, 0);
        const { root, changeSelect } = wrap(
            <DateInput
                {...DATE_FORMAT}
                defaultValue={defaultValue}
                timePrecision={TimePrecision.MINUTE}
                timePickerProps={{ showArrowButtons: true }}
            />,
        );
        root.setState({ isOpen: true }).update();
        changeSelect(Classes.DATEPICKER_YEAR_SELECT, 2019);
        root.find(`.${Classes.TIMEPICKER_ARROW_BUTTON}.${Classes.TIMEPICKER_HOUR}`).first().simulate("click");
        /* eslint-disable-next-line deprecation/deprecation */
        assert.isTrue(root.find(Popover).prop("isOpen"));
    });

    it("setting timePrecision renders a TimePicker", () => {
        const wrapper = mount(<DateInput {...DATE_FORMAT} timePrecision={TimePrecision.SECOND} />)
            .setState({
                isOpen: true,
            })
            .update();
        // assert TimePicker appears
        const timePicker = wrapper.find(TimePicker);
        assert.isTrue(timePicker.exists());
        assert.strictEqual(timePicker.prop("precision"), TimePrecision.SECOND);
        // assert TimePicker disappears in absence of prop
        wrapper.setProps({ timePrecision: undefined });
        assert.isFalse(wrapper.find(TimePicker).exists());
    });

    it("with TimePicker passes props correctly to DateTimePicker", () => {
        // verifies fixed https://github.com/palantir/blueprint/issues/980
        assert.doesNotThrow(() => {
            // max date and value are both well after default max date (end of this year).
            // if props are not passed correctly then validation will fail as value > default max date.
            mount(
                <DateInput
                    {...DATE_FORMAT}
                    maxDate={new Date(2050, 5, 4)}
                    timePrecision={TimePrecision.SECOND}
                    value={new Date(2030, 4, 5)}
                />,
            ).setState({ isOpen: true });
            // must open the popover so DateTimePicker is rendered
        });
    });

    it("with TimePicker passes timePickerProps correctly to DateTimePicker", () => {
        const onChange = sinon.spy();
        const value = new Date(2017, Months.MAY, 5);

        const timePickerProps = {
            disabled: true,
            // these will each be overridden by top-level props:
            onChange,
            precision: TimePrecision.MILLISECOND,
            value: new Date(2017, Months.MAY, 6),
        };

        const wrapper = mount(
            <DateInput
                {...DATE_FORMAT}
                timePrecision={TimePrecision.SECOND}
                onChange={sinon.spy()}
                value={value}
                timePickerProps={timePickerProps}
            />,
        )
            .setState({ isOpen: true })
            .update();

        const timePicker = wrapper.find(TimePicker);

        // value > timePickerProps > timePrecision
        assert.equal(timePicker.prop("precision"), TimePrecision.MILLISECOND);
        assert.notEqual(timePicker.prop("onChange"), onChange);
        DateTestUtils.assertDatesEqual(timePicker.prop("value"), value);

        // ensure this additional prop was passed through undeterred.
        assert.equal(timePicker.prop("disabled"), true);
    });

    it("clearButtonText and todayButtonText props are passed to DatePicker", () => {
        const datePickerProps = {
            clearButtonText: "clear",
            todayButtonText: "today",
        };

        const wrapper = mount(<DateInput {...DATE_FORMAT} {...datePickerProps} />)
            .setState({
                isOpen: true,
            })
            .update();
        const datePicker = wrapper.find(DatePicker);

        assert.equal(datePicker.prop("clearButtonText"), "clear");
        assert.equal(datePicker.prop("todayButtonText"), "today");
    });

    it("inputProps are passed to InputGroup", () => {
        const inputRef = sinon.spy();
        const onFocus = sinon.spy();
        const wrapper = mount(
            <DateInput
                {...DATE_FORMAT}
                disabled={false}
                inputProps={{
                    disabled: true,
                    inputRef,
                    leftIcon: "star",
                    onFocus,
                    required: true,
                    value: "fail",
                }}
            />,
        );
        wrapper.find("input").simulate("focus");

        const input = wrapper.find(InputGroup);
        assert.isFalse(input.prop("disabled"), "disabled comes from DateInput props");
        assert.notStrictEqual(input.prop("value"), "fail", "value cannot be changed");
        assert.strictEqual(input.prop("leftIcon"), "star");
        assert.isTrue(input.prop("required"));
        assert.isTrue(inputRef.called, "inputRef not invoked");
        assert.isTrue(onFocus.called, "onFocus not invoked");
    });

    it("popoverProps are passed to Popover", () => {
        const onOpening = sinon.spy();
        const wrapper = mount(
            <DateInput
                {...DATE_FORMAT}
                popoverProps={{
                    autoFocus: true,
                    content: "fail",
                    fill: true,
                    onOpening,
                    position: Position.TOP,
                    usePortal: false,
                }}
            />,
        );
        wrapper.find("input").simulate("focus");

        /* eslint-disable-next-line deprecation/deprecation */
        const popover = wrapper.find(Popover);
        assert.strictEqual(popover.prop("autoFocus"), false, "autoFocus cannot be changed");
        assert.notStrictEqual(popover.prop("content"), "fail", "content cannot be changed");
        assert.strictEqual(popover.prop("fill"), true);
        assert.strictEqual(popover.prop("position"), Position.TOP);
        assert.strictEqual(popover.prop("usePortal"), false);
        assert.isTrue(onOpening.calledOnce);
    });

    describe("when uncontrolled", () => {
        it("Pressing Enter saves the inputted date and closes the popover", () => {
            const IMPROPERLY_FORMATTED_DATE_STRING = "002/0015/2015";
            const PROPERLY_FORMATTED_DATE_STRING = "2/15/2015";
            const onKeyDown = sinon.spy();
            const wrapper = mount(<DateInput {...DATE_FORMAT} inputProps={{ onKeyDown }} />).setState({
                isOpen: true,
            });
            const input = wrapper.find("input").first();
            input.simulate("change", { target: { value: IMPROPERLY_FORMATTED_DATE_STRING } });
            input.simulate("keydown", { which: Keys.ENTER });
            assert.isFalse(wrapper.state("isOpen"), "popover closed");
            assert.isTrue(wrapper.state("isInputFocused"), "input still focused");
            assert.strictEqual(wrapper.find(InputGroup).prop("value"), PROPERLY_FORMATTED_DATE_STRING);
            assert.isTrue(onKeyDown.calledOnce, "onKeyDown called once");
        });

        it("Clicking a date puts it in the input box and closes the popover", () => {
            const { root: wrapper, getDay } = wrap(<DateInput {...DATE_FORMAT} />);
            wrapper.setState({ isOpen: true });
            wrapper.update();
            assert.equal(wrapper.find(InputGroup).prop("value"), "");
            getDay(12).simulate("click");
            assert.notEqual(wrapper.find(InputGroup).prop("value"), "");
            assert.isFalse(wrapper.state("isOpen"));
        });

        it("Clicking a date in the same month closes the popover when there is already a default value", () => {
            const DAY = 15;
            const PREV_DAY = DAY - 1;
            const defaultValue = new Date(2017, Months.JANUARY, DAY, 15, 0, 0, 0); // include an arbitrary non-zero hour
            const wrapper = mount(<DateInput {...DATE_FORMAT} defaultValue={defaultValue} />)
                .setState({
                    isOpen: true,
                })
                .update();
            wrapper
                .find(`.${Classes.DATEPICKER_DAY}`)
                .at(PREV_DAY - 1)
                .simulate("click")
                .update();
            assert.isFalse(wrapper.state("isOpen"));
        });

        it("Clearing the date in the DatePicker clears the input, and invokes onChange with null", () => {
            const onChange = sinon.spy();
            const { root, getDay } = wrap(
                <DateInput {...DATE_FORMAT} defaultValue={new Date(2016, Months.JULY, 22)} onChange={onChange} />,
            );
            root.setState({ isOpen: true });
            root.update();

            getDay(22).simulate("click");
            assert.equal(root.find(InputGroup).prop("value"), "");
            assert.isTrue(onChange.calledWith(null));
        });

        it("Clearing the date in the input clears the selection and invokes onChange with null", () => {
            const onChange = sinon.spy();
            const { root, getSelectedDays } = wrap(
                <DateInput {...DATE_FORMAT} defaultValue={new Date(2016, Months.JULY, 22)} onChange={onChange} />,
            );
            root.find("input").simulate("change", { target: { value: "" } });

            assert.lengthOf(getSelectedDays(), 0);
            assert.isTrue(onChange.calledWith(null));
        });

        it("Popover stays open on date click if closeOnSelection=false", () => {
            const wrapper = mount(<DateInput {...DATE_FORMAT} closeOnSelection={false} />)
                .setState({
                    isOpen: true,
                })
                .update();
            wrapper.find(`.${Classes.DATEPICKER_DAY}`).first().simulate("click").update();
            assert.isTrue(wrapper.state("isOpen"));
        });

        it("Popover doesn't close when month changes", () => {
            const defaultValue = new Date(2017, Months.JANUARY, 1);
            const { root, changeSelect } = wrap(
                <DateInput
                    {...DATE_FORMAT}
                    defaultValue={defaultValue}
                    popoverProps={{ isOpen: true, usePortal: false }}
                />,
            );
            changeSelect(Classes.DATEPICKER_MONTH_SELECT, Months.FEBRUARY);
            /* eslint-disable-next-line deprecation/deprecation */
            assert.isTrue(root.find(Popover).prop("isOpen"));
        });

        it("Popover doesn't close when time changes", () => {
            const defaultValue = new Date(2017, Months.JANUARY, 1, 0, 0, 0, 0);
            const wrapper = mount(
                <DateInput {...DATE_FORMAT} defaultValue={defaultValue} timePrecision={TimePrecision.MILLISECOND} />,
            );
            wrapper.setState({ isOpen: true });
            wrapper.update();

            // try typing a new time
            wrapper.find(`.${Classes.TIMEPICKER_MILLISECOND}`).simulate("change", { target: { value: "1" } });
            /* eslint-disable-next-line deprecation/deprecation */
            assert.isTrue(wrapper.find(Popover).prop("isOpen"));

            // try keyboard-incrementing to a new time
            wrapper.find(`.${Classes.TIMEPICKER_MILLISECOND}`).simulate("keydown", { which: Keys.ARROW_UP });
            /* eslint-disable-next-line deprecation/deprecation */
            assert.isTrue(wrapper.find(Popover).prop("isOpen"));
        });

        it("Clicking a date in a different month sets input value but keeps popover open", () => {
            const date = new Date(2016, Months.APRIL, 3);
            const wrapper = mount(<DateInput {...DATE_FORMAT} defaultValue={date} />)
                .setState({ isOpen: true })
                .update();
            assert.equal(wrapper.find(InputGroup).prop("value"), "4/3/2016");

            wrapper
                .find(`.${Classes.DATEPICKER_DAY}`)
                .filterWhere(day => day.text() === "27")
                .first()
                .simulate("click");

            assert.isTrue(wrapper.state("isOpen"));
            assert.equal(wrapper.find(InputGroup).prop("value"), "3/27/2016");
        });

        it("Typing in a valid date invokes onChange and inputProps.onChange", () => {
            const date = "2/10/2015";
            const onChange = sinon.spy();
            const onInputChange = sinon.spy();
            const wrapper = mount(
                <DateInput {...DATE_FORMAT} inputProps={{ onChange: onInputChange }} onChange={onChange} />,
            );
            wrapper.find("input").simulate("change", { target: { value: date } });

            assert.isTrue(onChange.calledOnce);
            assertDateEquals(onChange.args[0][0], new Date(date));
            assert.isTrue(onInputChange.calledOnce);
            assert.strictEqual(onInputChange.args[0][0].type, "change", "inputProps.onChange expects change event");
        });

        it("Typing in a date out of range displays the error message and calls onError with invalid date", () => {
            const rangeMessage = "RANGE ERROR";
            const onError = sinon.spy();
            const wrapper = mount(
                <DateInput
                    {...DATE_FORMAT}
                    defaultValue={new Date(2015, Months.MAY, 1)}
                    minDate={new Date(2015, Months.MARCH, 1)}
                    onError={onError}
                    outOfRangeMessage={rangeMessage}
                />,
            );
            const value = "2/1/2030";
            wrapper.find("input").simulate("change", { target: { value } }).simulate("blur");

            assert.strictEqual(wrapper.find(InputGroup).prop("intent"), Intent.DANGER);
            assert.strictEqual(wrapper.find(InputGroup).prop("value"), rangeMessage);

            assert.isTrue(onError.calledOnce);
            assertDateEquals(onError.args[0][0], new Date(value));
        });

        it("Typing in an invalid date displays the error message and calls onError with Date(undefined)", () => {
            const invalidDateMessage = "INVALID DATE";
            const onError = sinon.spy();
            const wrapper = mount(
                <DateInput
                    {...DATE_FORMAT}
                    defaultValue={new Date(2015, Months.MAY, 1)}
                    onError={onError}
                    invalidDateMessage={invalidDateMessage}
                />,
            );
            wrapper
                .find("input")
                .simulate("change", { target: { value: "not a date" } })
                .simulate("blur");

            assert.strictEqual(wrapper.find(InputGroup).prop("intent"), Intent.DANGER);
            assert.strictEqual(wrapper.find(InputGroup).prop("value"), invalidDateMessage);

            assert.isTrue(onError.calledOnce);
            assert.isNaN((onError.args[0][0] as Date).valueOf());
        });

        it("Clearing a date should not be possible with canClearSelection=false and timePrecision enabled", () => {
            const DATE = new Date(2016, Months.APRIL, 4);
            const onChange = sinon.spy();
            const { getDay, root } = wrap(
                <DateInput
                    {...DATE_FORMAT}
                    canClearSelection={false}
                    defaultValue={DATE}
                    onChange={onChange}
                    timePrecision={TimePrecision.SECOND}
                />,
            );
            root.setState({ isOpen: true });
            root.update();

            getDay(DATE.getDate()).simulate("click");

            assert.isTrue(onChange.calledOnce);
            assert.deepEqual(onChange.firstCall.args, [DATE, true]);
        });
    });

    describe("when controlled", () => {
        const DATE = new Date(2016, Months.APRIL, 4);
        const DATE_STR = "4/4/2016";
        const DATE2 = new Date(2015, Months.FEBRUARY, 1);
        const DATE2_STR = "2/1/2015";
        const DATE2_DE_STR = "01.02.2015";

        it("Pressing Enter saves the inputted date and closes the popover", () => {
            const onKeyDown = sinon.spy();
            const onChange = sinon.spy();
            const { root } = wrap(
                <DateInput {...DATE_FORMAT} inputProps={{ onKeyDown }} onChange={onChange} value={DATE} />,
            );
            root.setState({ isOpen: true });

            const input = root.find("input").first();
            input.simulate("change", { target: { value: DATE2_STR } });
            input.simulate("keydown", { which: Keys.ENTER });

            // onChange is called once on change, once on Enter
            assert.isTrue(onChange.calledTwice, "onChange called twice");
            assertDateEquals(onChange.args[1][0], DATE2);
            assert.isTrue(onKeyDown.calledOnce, "onKeyDown called once");
            assert.isTrue(root.state("isInputFocused"), "input still focused");
        });

        it("Clicking a date invokes onChange callback with that date", () => {
            const onChange = sinon.spy();
            const { getDay, root } = wrap(<DateInput {...DATE_FORMAT} onChange={onChange} value={DATE} />);
            root.setState({ isOpen: true });
            root.update();
            getDay(27).simulate("click");

            assert.isTrue(onChange.calledOnce);
            assertDateEquals(onChange.args[0][0], new Date("4/27/2016"));
            assert.isTrue(onChange.args[0][1], "expected isUserChange to be true");
        });

        it("Clearing the date in the DatePicker invokes onChange with null but doesn't change UI", () => {
            const onChange = sinon.spy();
            const { root, getDay } = wrap(<DateInput {...DATE_FORMAT} value={DATE} onChange={onChange} />);
            root.setState({ isOpen: true });
            root.update();
            getDay(4).simulate("click");
            assert.equal(root.find(InputGroup).prop("value"), "4/4/2016");
            assert.isTrue(onChange.calledWith(null, true));
        });

        it("Updating value updates the text box", () => {
            const wrapper = mount(<DateInput {...DATE_FORMAT} value={DATE} />);
            assert.strictEqual(wrapper.find(InputGroup).prop("value"), DATE_STR);
            wrapper.setProps({ value: DATE2 });
            wrapper.update();
            assert.strictEqual(wrapper.find(InputGroup).prop("value"), DATE2_STR);
        });

        it("Typing in a date invokes onChange and inputProps.onChange", () => {
            const onChange = sinon.spy();
            const onInputChange = sinon.spy();
            const wrapper = mount(
                <DateInput
                    {...DATE_FORMAT}
                    inputProps={{ onChange: onInputChange }}
                    onChange={onChange}
                    value={DATE}
                />,
            );
            wrapper.find("input").simulate("change", { target: { value: DATE2_STR } });
            assert.isTrue(onChange.calledOnce);
            assertDateEquals(onChange.args[0][0], DATE2);
            assert.isTrue(onInputChange.calledOnce);
            assert.strictEqual(onInputChange.args[0][0].type, "change", "inputProps.onChange expects change event");
        });

        it("Clearing the date in the input invokes onChange with null", () => {
            const onChange = sinon.spy();
            const { root } = wrap(
                <DateInput {...DATE_FORMAT} value={new Date(2016, Months.JULY, 22)} onChange={onChange} />,
            );
            root.find("input").simulate("change", { target: { value: "" } });
            assert.isTrue(onChange.calledWith(null, true));
        });

        it.skip("Formats locale-specific format strings properly", () => {
            const wrapper = mount(<DateInput {...DATE_FORMAT} locale="de" value={DATE2} />);
            assert.strictEqual(wrapper.find(InputGroup).prop("value"), DATE2_DE_STR);
        });

        it("Clearing a date should not be possible with canClearSelection=false and timePrecision enabled", () => {
            const onChange = sinon.spy();
            const { getSelectedDays, root } = wrap(
                <DateInput
                    {...DATE_FORMAT}
                    canClearSelection={false}
                    onChange={onChange}
                    timePrecision={TimePrecision.SECOND}
                    value={DATE}
                />,
            );
            root.setState({ isOpen: true });
            root.update();

            getSelectedDays().at(0).simulate("click");

            assert.isTrue(onChange.calledOnce);
            assert.deepEqual(onChange.firstCall.args, [DATE, true]);
        });

        it("isUserChange is false when month changes", () => {
            const onChange = sinon.spy();
            wrap(
                <DateInput
                    {...DATE_FORMAT}
                    onChange={onChange}
                    popoverProps={{ isOpen: true, usePortal: false }}
                    value={DATE}
                />,
            ).changeSelect(Classes.DATEPICKER_MONTH_SELECT, Months.FEBRUARY);
            assert.isTrue(onChange.calledOnce);
            assert.isFalse(onChange.args[0][1], "expected isUserChange to be false");
        });
    });

    describe("date formatting", () => {
        const formatDate = sinon.stub().returns("custom date");
        const parseDate = sinon.stub().returns(new Date());
        const locale = "LOCALE";
        const props: IDateInputProps = { formatDate, locale, parseDate };

        beforeEach(() => {
            formatDate.resetHistory();
            parseDate.resetHistory();
        });

        it("formatDate called on render with locale prop", () => {
            const value = new Date();
            mount(<DateInput {...props} value={value} />);
            assert.isTrue(formatDate.calledWith(value, locale));
        });

        it("formatDate result becomes input value", () => {
            const wrapper = mount(<DateInput {...props} value={new Date()} />);
            assert.strictEqual(wrapper.find("input").prop("value"), "custom date");
        });

        it("parseDate called on change with locale prop", () => {
            const value = "new date";
            const wrapper = mount(<DateInput {...props} />);
            wrapper.find("input").simulate("change", { target: { value } });
            assert.isTrue(parseDate.calledWith(value, locale));
        });

        it("parseDate result is stored in state", () => {
            const value = "new date";
            const wrapper = mount(<DateInput {...props} />);
            wrapper.find("input").simulate("change", { target: { value } });
            assert.strictEqual(wrapper.state("value"), parseDate());
        });

        it("parseDate returns false renders invalid date", () => {
            const invalidParse = sinon.stub().returns(false);
            const wrapper = mount(<DateInput {...props} parseDate={invalidParse} />);
            const input = wrapper.find("input");
            input.simulate("change", { target: { value: "invalid" } });
            input.simulate("blur");
            assert.strictEqual(wrapper.find("input").prop("value"), DateInput.defaultProps.invalidDateMessage);
        });
    });

    /* Assert Date equals YYYY-MM-DD string. */
    function assertDateEquals(actual: Date, expected: Date) {
        return DATE_FORMAT.formatDate(actual) === DATE_FORMAT.formatDate(expected);
    }

    function wrap(dateInput: JSX.Element) {
        const wrapper = mount<IDateInputProps>(dateInput);
        return {
            changeSelect: (className: string, value: React.ReactText) => {
                return wrapper
                    .find(`.${className}`)
                    .find("select")
                    .simulate("change", { target: { value: value.toString() } });
            },
            getDay: (dayNumber = 1) => {
                return wrapper
                    .find(`.${Classes.DATEPICKER_DAY}`)
                    .filterWhere(day => day.text() === "" + dayNumber && !day.hasClass(Classes.DATEPICKER_DAY_OUTSIDE));
            },
            getSelectedDays: () => wrapper.find(`.${Classes.DATEPICKER_DAY_SELECTED}`),
            root: wrapper,
        };
    }

    // PhantomJS fails when creating FocusEvent, so creating an Event, and attaching releatedTarget works
    function createFocusEvent(eventType: string, relatedTarget: EventTarget = null) {
        const event = new Event(eventType) as any;
        event.relatedTarget = relatedTarget;
        return event;
    }
});
