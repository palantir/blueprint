/*
 * Copyright 2022 Palantir Technologies, Inc. All rights reserved.
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
import { intlFormat, isEqual, parseISO } from "date-fns";
import { formatInTimeZone, zonedTimeToUtc } from "date-fns-tz";
import { mount, ReactWrapper } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";

import { Classes as CoreClasses, InputGroup, Keys } from "@blueprintjs/core";
import { DatePicker, Classes as DatetimeClasses, Months, TimePrecision, TimeUnit } from "@blueprintjs/datetime";
import { Popover2, Classes as Popover2Classes } from "@blueprintjs/popover2";

import { Classes, DateInput2, DateInput2Props, TimezoneSelect } from "../../src";
import { getCurrentTimezone } from "../../src/common/getTimezone";

const VALUE = "2021-11-29T10:30:00z";

const DEFAULT_PROPS = {
    defaultTimezone: "Etc/UTC",
    formatDate: (date: Date | null | undefined, locale?: string) => {
        if (date == null) {
            return "";
        } else if (locale === "de") {
            return intlFormat(
                date,
                {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                },
                { locale: "de-DE" },
            );
        } else {
            return [date.getMonth() + 1, date.getDate(), date.getFullYear()].join("/");
        }
    },
    parseDate: (str: string) => new Date(str),
    popoverProps: {
        usePortal: false,
    },
    timePrecision: TimePrecision.SECOND,
};

describe("<DateInput2>", () => {
    const onChange = sinon.spy();
    let containerElement: HTMLElement | undefined;

    beforeEach(() => {
        containerElement = document.createElement("div");
        document.body.appendChild(containerElement);
    });
    afterEach(() => {
        containerElement?.remove();
        onChange.resetHistory();
    });

    describe("basic rendering", () => {
        it("passes custom classNames to popover target", () => {
            const CLASS_1 = "foo";
            const CLASS_2 = "bar";

            const wrapper = mount(
                <DateInput2
                    {...DEFAULT_PROPS}
                    className={CLASS_1}
                    popoverProps={{ ...DEFAULT_PROPS.popoverProps, className: CLASS_2 }}
                />,
            );

            const popoverTarget = wrapper.find(`.${Classes.DATE_INPUT}.${Popover2Classes.POPOVER2_TARGET}`).hostNodes();
            assert.isTrue(popoverTarget.hasClass(CLASS_1));
            assert.isTrue(popoverTarget.hasClass(CLASS_2));
        });

        it("supports custom input props", () => {
            const wrapper = mount(
                <DateInput2 {...DEFAULT_PROPS} inputProps={{ style: { background: "yellow" }, tabIndex: 4 }} />,
            );
            const inputElement = wrapper.find("input").getDOMNode() as HTMLInputElement;
            assert.equal(inputElement.style.background, "yellow");
            assert.equal(inputElement.tabIndex, 4);
        });

        it("supports inputProps.inputRef", () => {
            let input: HTMLInputElement | null = null;
            mount(<DateInput2 {...DEFAULT_PROPS} inputProps={{ inputRef: ref => (input = ref) }} />);
            assert.instanceOf(input, HTMLInputElement);
        });

        it("does not render a TimezoneSelect if timePrecision is undefined", () => {
            const wrapper = mount(<DateInput2 {...DEFAULT_PROPS} timePrecision={undefined} />);
            assert.isFalse(wrapper.find(TimezoneSelect).exists());
        });

        it("correctly passes on defaultTimezone to TimezoneSelect", () => {
            const defaultTimezone = "Europe/Paris";
            const wrapper = mount(<DateInput2 {...DEFAULT_PROPS} defaultTimezone={defaultTimezone} />);
            const timezoneSelect = wrapper.find(TimezoneSelect);
            assert.strictEqual(timezoneSelect.prop("value"), defaultTimezone);
        });

        it("passes datePickerProps to DatePicker correctly", () => {
            const datePickerProps = {
                clearButtonText: "clear",
                todayButtonText: "today",
            };
            const wrapper = mount(<DateInput2 {...DEFAULT_PROPS} {...datePickerProps} />);
            focusInput(wrapper);
            const datePicker = wrapper.find(DatePicker);
            assert.equal(datePicker.prop("clearButtonText"), "clear");
            assert.equal(datePicker.prop("todayButtonText"), "today");
        });

        it("passes inputProps to InputGroup", () => {
            const inputRef = sinon.spy();
            const onFocus = sinon.spy();
            const wrapper = mount(
                <DateInput2
                    {...DEFAULT_PROPS}
                    inputProps={{
                        inputRef,
                        leftIcon: "star",
                        onFocus,
                        required: true,
                    }}
                />,
            );
            focusInput(wrapper);

            const input = wrapper.find(InputGroup);
            assert.strictEqual(input.prop("leftIcon"), "star");
            assert.isTrue(input.prop("required"));
            assert.isTrue(inputRef.called, "inputRef not invoked");
            assert.isTrue(onFocus.called, "onFocus not invoked");
        });

        it("passes fill and popoverProps to Popover2", () => {
            const onOpening = sinon.spy();
            const wrapper = mount(
                <DateInput2
                    {...DEFAULT_PROPS}
                    fill={true}
                    popoverProps={{
                        onOpening,
                        placement: "top",
                        usePortal: false,
                    }}
                />,
            );
            focusInput(wrapper);

            const popover = wrapper.find(Popover2).first();
            assert.strictEqual(popover.prop("fill"), true);
            assert.strictEqual(popover.prop("placement"), "top");
            assert.strictEqual(popover.prop("usePortal"), false);
            assert.isTrue(onOpening.calledOnce);
        });
    });

    describe("popover interaction", () => {
        it("opens the popover when focusing input", () => {
            const wrapper = mount(<DateInput2 {...DEFAULT_PROPS} />, { attachTo: containerElement });
            focusInput(wrapper);
            assertPopoverIsOpen(wrapper);
        });

        it("doesn't open the popover when disabled", () => {
            const wrapper = mount(<DateInput2 {...DEFAULT_PROPS} disabled={true} />, { attachTo: containerElement });
            focusInput(wrapper);
            assertPopoverIsOpen(wrapper, false);
        });

        it("popover closes when ESC key pressed", () => {
            const wrapper = mount(<DateInput2 {...DEFAULT_PROPS} />, { attachTo: containerElement });
            focusInput(wrapper);
            wrapper.find(InputGroup).find("input").simulate("keydown", { key: "Escape" });
            assertPopoverIsOpen(wrapper, false);
        });
    });

    describe("uncontrolled usage", () => {
        const DEFAULT_PROPS_UNCONTROLLED = {
            ...DEFAULT_PROPS,
            defaultValue: VALUE,
            onChange,
        };

        it("calls onChange on date changes", () => {
            const wrapper = mount(<DateInput2 {...DEFAULT_PROPS_UNCONTROLLED} />, { attachTo: containerElement });
            focusInput(wrapper);
            wrapper
                .find(`.${DatetimeClasses.DATEPICKER_DAY}:not(.${DatetimeClasses.DATEPICKER_DAY_OUTSIDE})`)
                .first()
                .simulate("click")
                .update();
            assert.isTrue(onChange.calledOnce);
            // first non-outside day should be the November 1st
            assert.strictEqual(onChange.firstCall.args[0], "2021-11-01T10:30:00+00:00");
        });

        it("calls onChange on timezone changes", () => {
            const wrapper = mount(<DateInput2 {...DEFAULT_PROPS_UNCONTROLLED} />, { attachTo: containerElement });
            clickTimezoneItem(wrapper, "New York");
            assert.isTrue(onChange.calledOnce);
            console.info(onChange.firstCall.args);
            // New York is UTC-5
            assert.strictEqual(onChange.firstCall.args[0], "2021-11-29T10:30:00-05:00");
        });

        // HACKHACK: this test ported from DateInput doesn't seem to match any real UX, since pressing Shift+Tab
        // on the first focussable day in a calendar month doesn't move you to the previous month; instead it moves focus
        // to the year dropdown. It might be worth testing behavior when pressing the left arrow key, since that _does_
        // move focus to the last day of the previous month.
        it.skip("popover should not close if focus moves to previous day (last day of prev month)", () => {
            const wrapper = mount(<DateInput2 {...DEFAULT_PROPS_UNCONTROLLED} />, { attachTo: containerElement });
            focusInput(wrapper);
            blurInput(wrapper);
            const firstTabbable = wrapper.find(Popover2).find(".DayPicker-Day").filter({ tabIndex: 0 }).first();
            const lastDayOfPrevMonth = wrapper
                .find(Popover2)
                .find(".DayPicker-Body > .DayPicker-Week .DayPicker-Day--outside")
                .last();

            firstTabbable.simulate("focus");
            firstTabbable.simulate("blur", {
                relatedTarget: lastDayOfPrevMonth.getDOMNode(),
                target: firstTabbable.getDOMNode(),
            });
            wrapper.update();
            assertPopoverIsOpen(wrapper);
        });

        it("popover should not close if focus moves to month select", () => {
            const wrapper = mount(<DateInput2 {...DEFAULT_PROPS_UNCONTROLLED} />, { attachTo: containerElement });
            focusInput(wrapper);
            blurInput(wrapper);
            changeSelectDropdown(wrapper, DatetimeClasses.DATEPICKER_MONTH_SELECT, Months.NOVEMBER);
            assertPopoverIsOpen(wrapper);
        });

        it("popover should not close if focus moves to year select", () => {
            const wrapper = mount(<DateInput2 {...DEFAULT_PROPS_UNCONTROLLED} />, { attachTo: containerElement });
            focusInput(wrapper);
            blurInput(wrapper);
            changeSelectDropdown(wrapper, DatetimeClasses.DATEPICKER_YEAR_SELECT, 2020);
            assertPopoverIsOpen(wrapper);
        });

        it("popover should not close when time picker arrows are clicked after selecting a month", () => {
            const wrapper = mount(
                <DateInput2 {...DEFAULT_PROPS_UNCONTROLLED} timePickerProps={{ showArrowButtons: true }} />,
                { attachTo: containerElement },
            );
            focusInput(wrapper);
            changeSelectDropdown(wrapper, DatetimeClasses.DATEPICKER_MONTH_SELECT, Months.OCTOBER);
            wrapper
                .find(`.${DatetimeClasses.TIMEPICKER_ARROW_BUTTON}.${DatetimeClasses.TIMEPICKER_HOUR}`)
                .first()
                .simulate("click");
            assertPopoverIsOpen(wrapper);
        });

        it("pressing Enter saves the inputted date and closes the popover", () => {
            const IMPROPERLY_FORMATTED_DATE_STRING = "002/0015/2015";
            const PROPERLY_FORMATTED_DATE_STRING = "2/15/2015";
            const onKeyDown = sinon.spy();
            const wrapper = mount(<DateInput2 {...DEFAULT_PROPS_UNCONTROLLED} inputProps={{ onKeyDown }} />, {
                attachTo: containerElement,
            });
            focusInput(wrapper);
            const input = wrapper.find(InputGroup).find("input");
            input.simulate("change", { target: { value: IMPROPERLY_FORMATTED_DATE_STRING } });
            input.simulate("keydown", { key: "Enter" });
            assertPopoverIsOpen(wrapper, false);
            assert.notStrictEqual(document.activeElement, input.getDOMNode(), "input should not be focused");
            assert.strictEqual(wrapper.find(InputGroup).prop("value"), PROPERLY_FORMATTED_DATE_STRING);
            assert.isTrue(onKeyDown.calledOnce, "onKeyDown called once");
        });

        it("clicking a date puts it in the input box and closes the popover", () => {
            const wrapper = mount(<DateInput2 {...DEFAULT_PROPS} />, { attachTo: containerElement });
            focusInput(wrapper);
            assert.equal(wrapper.find(InputGroup).prop("value"), "");
            const dayToClick = 12;
            clickCalendarDay(wrapper, dayToClick);
            const today = new Date();
            assert.equal(
                wrapper.find(InputGroup).prop("value"),
                `${today.getMonth() + 1}/${dayToClick}/${today.getFullYear()}`,
            );
            assertPopoverIsOpen(wrapper, false);
        });

        it("clicking a date in the same month closes the popover when there is already a default value", () => {
            const DAY = 15;
            const PREV_DAY = DAY - 1;
            const defaultValue = `2022-07-${DAY}T15:00:00z`; // include an arbitrary non-zero hour
            const wrapper = mount(<DateInput2 {...DEFAULT_PROPS_UNCONTROLLED} defaultValue={defaultValue} />, {
                attachTo: containerElement,
            });
            focusInput(wrapper);
            clickCalendarDay(wrapper, PREV_DAY);
            assertPopoverIsOpen(wrapper, false);
        });

        it("clearing the date in the DatePicker clears the input, and calls onChange with null", () => {
            const wrapper = mount(<DateInput2 {...DEFAULT_PROPS_UNCONTROLLED} />, {
                attachTo: containerElement,
            });
            focusInput(wrapper);
            assert.equal(wrapper.find(InputGroup).prop("value"), "11/29/2021");
            // default value is 29th day of November
            clickCalendarDay(wrapper, 29);
            wrapper.update();
            assert.equal(wrapper.find(InputGroup).prop("value"), "");
            assert.isTrue(onChange.calledWith(null));
        });

        it("clearing the date in the input clears the selection and invokes onChange with null", () => {
            const wrapper = mount(<DateInput2 {...DEFAULT_PROPS_UNCONTROLLED} />, { attachTo: containerElement });
            wrapper
                .find(InputGroup)
                .find("input")
                .simulate("change", { target: { value: "" } });

            assert.lengthOf(wrapper.find(`.${DatetimeClasses.DATEPICKER_DAY_SELECTED}`), 0);
            assert.isTrue(onChange.calledWith(null));
        });

        it("popover stays open on date click if closeOnSelection=false", () => {
            const wrapper = mount(<DateInput2 {...DEFAULT_PROPS_UNCONTROLLED} closeOnSelection={false} />, {
                attachTo: containerElement,
            });
            focusInput(wrapper);
            wrapper.find(`.${DatetimeClasses.DATEPICKER_DAY}`).first().simulate("click").update();
            assertPopoverIsOpen(wrapper);
        });

        it("popover stays open when month changes", () => {
            const wrapper = mount(<DateInput2 {...DEFAULT_PROPS_UNCONTROLLED} />, { attachTo: containerElement });
            focusInput(wrapper);
            changeSelectDropdown(wrapper, DatetimeClasses.DATEPICKER_MONTH_SELECT, Months.DECEMBER);
            assertPopoverIsOpen(wrapper);
        });

        it("popover stays open when time changes", () => {
            const wrapper = mount(<DateInput2 {...DEFAULT_PROPS_UNCONTROLLED} />, { attachTo: containerElement });
            focusInput(wrapper);

            // try typing a new time
            setTimeUnit(wrapper, TimeUnit.SECOND, 1);
            assertPopoverIsOpen(wrapper);

            // try keyboard-incrementing to a new time
            wrapper.find(`.${DatetimeClasses.TIMEPICKER_SECOND}`).first().simulate("keydown", { which: Keys.ARROW_UP });
            assertPopoverIsOpen(wrapper);
        });

        it("clicking a day in a different month sets input value but keeps popover open", () => {
            const wrapper = mount(<DateInput2 {...DEFAULT_PROPS_UNCONTROLLED} defaultValue="2016-04-03T00:00:00z" />, {
                attachTo: containerElement,
            });
            focusInput(wrapper);
            assert.equal(wrapper.find(InputGroup).prop("value"), "4/3/2016");

            wrapper
                .find(`.${DatetimeClasses.DATEPICKER_DAY}`)
                .filterWhere(day => day.text() === "27")
                .first()
                .simulate("click");

            assertPopoverIsOpen(wrapper);
            assert.equal(wrapper.find(InputGroup).prop("value"), "3/27/2016");
        });

        it("typing in a valid date invokes onChange and inputProps.onChange", () => {
            const DATE_VALUE = "2015-02-10T00:00:00+00:00";
            const DATE_STR = "2/10/2015";
            const onInputChange = sinon.spy();
            const wrapper = mount(
                <DateInput2 {...DEFAULT_PROPS_UNCONTROLLED} inputProps={{ onChange: onInputChange }} />,
                { attachTo: containerElement },
            );
            changeInput(wrapper, DATE_STR);

            assert.isTrue(onChange.calledOnce);
            assert.strictEqual(onChange.args[0][0], DATE_VALUE);
            assert.isTrue(onInputChange.calledOnce);
            assert.strictEqual(onInputChange.args[0][0].type, "change", "inputProps.onChange expects change event");
        });

        it("typing in a date out of range displays the error message and calls onError with invalid date", () => {
            const rangeMessage = "RANGE ERROR";
            const onError = sinon.spy();
            const wrapper = mount(
                <DateInput2
                    {...DEFAULT_PROPS_UNCONTROLLED}
                    defaultValue={new Date(2015, Months.MAY, 1).toISOString()}
                    minDate={new Date(2015, Months.MARCH, 1)}
                    onError={onError}
                    outOfRangeMessage={rangeMessage}
                />,
            );
            const value = "2/1/2030";
            wrapper.find("input").simulate("change", { target: { value } }).simulate("blur");

            assert.strictEqual(wrapper.find(InputGroup).prop("intent"), "danger");
            assert.strictEqual(wrapper.find(InputGroup).prop("value"), rangeMessage);

            assert.isTrue(onError.calledOnce);
            assert.strictEqual(DEFAULT_PROPS.formatDate(onError.args[0][0]), DEFAULT_PROPS.formatDate(new Date(value)));
        });

        it("typing in an invalid date displays the error message and calls onError with Date(undefined)", () => {
            const invalidDateMessage = "INVALID DATE";
            const onError = sinon.spy();
            const wrapper = mount(
                <DateInput2
                    {...DEFAULT_PROPS_UNCONTROLLED}
                    defaultValue={new Date(2015, Months.MAY, 1).toISOString()}
                    onError={onError}
                    invalidDateMessage={invalidDateMessage}
                />,
            );
            wrapper
                .find("input")
                .simulate("change", { target: { value: "not a date" } })
                .simulate("blur");

            assert.strictEqual(wrapper.find(InputGroup).prop("intent"), "danger");
            assert.strictEqual(wrapper.find(InputGroup).prop("value"), invalidDateMessage);

            assert.isTrue(onError.calledOnce);
            assert.isNaN((onError.args[0][0] as Date).valueOf());
        });

        it("clearing a date should not be possible with canClearSelection=false and timePrecision enabled", () => {
            const DATE = new Date(2016, Months.APRIL, 4);
            const wrapper = mount(
                <DateInput2
                    {...DEFAULT_PROPS_UNCONTROLLED}
                    canClearSelection={false}
                    defaultValue={dateToIsoString(DATE)}
                    timePrecision={TimePrecision.SECOND}
                />,
                { attachTo: containerElement },
            );
            focusInput(wrapper);
            clickCalendarDay(wrapper, DATE.getDate());
            assert.isTrue(onChange.calledOnce);
            assert.isTrue(isEqual(parseISO(onChange.firstCall.args[0]), DATE));
        });
    });

    describe("controlled usage", () => {
        const DEFAULT_PROPS_CONTROLLED = {
            ...DEFAULT_PROPS,
            defaultTimezone: "Etc/UTC",
            onChange,
            value: VALUE,
        };

        it("handles null inputs without crashing", () => {
            assert.doesNotThrow(() => mount(<DateInput2 {...DEFAULT_PROPS_CONTROLLED} value={null} />));
        });

        describe("when changing timezone", () => {
            it("calls onChange with the updated ISO string", () => {
                const wrapper = mount(<DateInput2 {...DEFAULT_PROPS_CONTROLLED} />);
                clickTimezoneItem(wrapper, "Paris");
                assert.isTrue(onChange.calledOnce);
                assert.deepEqual(onChange.firstCall.args, ["2021-11-29T10:30:00+01:00"]);
            });

            it("formats the returned ISO string according to timePrecision", () => {
                const wrapper = mount(
                    <DateInput2 {...DEFAULT_PROPS_CONTROLLED} timePrecision={TimePrecision.MINUTE} />,
                );
                clickTimezoneItem(wrapper, "Paris");
                assert.isTrue(onChange.calledOnce);
                assert.deepEqual(onChange.firstCall.args, ["2021-11-29T10:30+01:00"]);
            });
        });

        it("changing the time calls onChange with the updated ISO string", () => {
            const wrapper = mount(<DateInput2 {...DEFAULT_PROPS_CONTROLLED} />, { attachTo: containerElement });
            focusInput(wrapper);
            setTimeUnit(wrapper, TimeUnit.HOUR_24, 11);
            assert.isTrue(onChange.calledOnce);
            assert.deepEqual(onChange.firstCall.args, ["2021-11-29T11:30:00+00:00", true]);
        });

        it("clearing the input invokes onChange with null", () => {
            const wrapper = mount(<DateInput2 {...DEFAULT_PROPS_CONTROLLED} />);
            wrapper
                .find(InputGroup)
                .find("input")
                .simulate("change", { target: { value: "" } });
            assert.isTrue(onChange.calledOnceWithExactly(null, true));
        });

        // tests ported from DateInput
        const DATE1_VALUE = "2016-04-04T00:00:00+00:00";
        const DATE1_UI_STR = "4/4/2016";
        const DATE2_VALUE = "2015-02-01T00:00:00+00:00";
        const DATE2_UI_STR = "2/1/2015";
        const DATE2_UI_STR_DE = "01.02.2015";

        // HACKHACK: DATE2 gets interpreted in the local timezone when typed into the input, even though
        // we've set defaultTimezone to UTC and specified the initial controlled value with a UTC offset.
        // This results in the onChange callback getting the previous day (Jan 31), since the local timezone
        // for most Blueprint development is before UTC time (negative offset). This is buggy and needs to be
        // fixed.
        it.skip("pressing Enter saves the inputted date and closes the popover", () => {
            const onKeyDown = sinon.spy();
            const wrapper = mount(
                <DateInput2 {...DEFAULT_PROPS_CONTROLLED} value={DATE1_VALUE} inputProps={{ onKeyDown }} />,
                { attachTo: containerElement },
            );
            focusInput(wrapper);
            changeInput(wrapper, DATE2_UI_STR);
            submitInput(wrapper);

            // onChange is called once on change, once on Enter
            assert.isTrue(onChange.calledTwice, "onChange called twice");
            assert.strictEqual(
                onChange.args[1][0],
                formatInTimeZone(parseISO(DATE2_VALUE), "Etc/UTC", "yyyy-MM-dd'T'HH:mm:ssxxx"),
            );
            assert.isTrue(onKeyDown.calledOnce, "onKeyDown called once");
            assert.strictEqual(
                document.activeElement,
                wrapper.find(InputGroup).find("input").getDOMNode(),
                "input should remain focused",
            );
            assertPopoverIsOpen(wrapper, false);
        });

        it("clicking a date invokes onChange callback with that date", () => {
            const wrapper = mount(
                <DateInput2 {...DEFAULT_PROPS_CONTROLLED} onChange={onChange} value={DATE1_VALUE} />,
                { attachTo: containerElement },
            );
            focusInput(wrapper);
            clickCalendarDay(wrapper, 27);

            assert.isTrue(onChange.calledOnce);
            assert.strictEqual(onChange.args[0][0], "2016-04-27T00:00:00+00:00");
            assert.isTrue(onChange.args[0][1], "expected isUserChange to be true");
        });

        it("clearing the date in the DatePicker invokes onChange with null but doesn't change UI", () => {
            const wrapper = mount(
                <DateInput2 {...DEFAULT_PROPS_CONTROLLED} onChange={onChange} value={DATE1_VALUE} />,
                { attachTo: containerElement },
            );
            focusInput(wrapper);
            clickCalendarDay(wrapper, 4);
            assert.equal(wrapper.find(InputGroup).prop("value"), "4/4/2016");
            assert.isTrue(onChange.calledWith(null, true));
        });

        it("updating controlled value updates the text input", () => {
            const wrapper = mount(<DateInput2 {...DEFAULT_PROPS_CONTROLLED} value={DATE1_VALUE} />, {
                attachTo: containerElement,
            });
            assert.strictEqual(wrapper.find(InputGroup).prop("value"), DATE1_UI_STR);
            wrapper.setProps({ value: DATE2_VALUE });
            wrapper.update();
            assert.strictEqual(wrapper.find(InputGroup).prop("value"), DATE2_UI_STR);
        });

        it("typing in a date invokes onChange and inputProps.onChange", () => {
            const onInputChange = sinon.spy();
            const wrapper = mount(
                <DateInput2
                    {...DEFAULT_PROPS_CONTROLLED}
                    inputProps={{ onChange: onInputChange }}
                    onChange={onChange}
                    value={DATE1_VALUE}
                />,
                { attachTo: containerElement },
            );
            changeInput(wrapper, DATE2_UI_STR);
            assert.isTrue(onChange.calledOnce);
            assert.strictEqual(onChange.args[0][0], DATE2_VALUE);
            assert.isTrue(onInputChange.calledOnce);
            assert.strictEqual(onInputChange.args[0][0].type, "change", "inputProps.onChange expects change event");
        });

        it("typing an invalid date updates the text input with the 'invalid date' message", () => {
            const wrapper = mount(<DateInput2 {...DEFAULT_PROPS_CONTROLLED} value={DATE1_VALUE} />, {
                attachTo: containerElement,
            });
            focusInput(wrapper);
            changeInput(wrapper, "4/77/2016");
            blurInput(wrapper);
            assert.strictEqual(wrapper.find(InputGroup).prop("value"), DateInput2.defaultProps?.invalidDateMessage);
        });

        it("text input does not show error styling until user is done typing and blurs the input", () => {
            const wrapper = mount(<DateInput2 {...DEFAULT_PROPS_CONTROLLED} value={DATE1_VALUE} />, {
                attachTo: containerElement,
            });
            focusInput(wrapper);
            changeInput(wrapper, "4/77/201");
            assert.notEqual(wrapper.find(InputGroup).prop("intent"), "danger");
            blurInput(wrapper);
            assert.strictEqual(wrapper.find(InputGroup).prop("intent"), "danger");
        });

        it("clearing the date in the input invokes onChange with null", () => {
            const wrapper = mount(<DateInput2 {...DEFAULT_PROPS_CONTROLLED} value={DATE1_VALUE} />, {
                attachTo: containerElement,
            });
            changeInput(wrapper, "");
            assert.isTrue(onChange.calledWith(null, true));
        });

        it("clearing a date should not be possible with canClearSelection=false and timePrecision enabled", () => {
            const wrapper = mount(
                <DateInput2
                    {...DEFAULT_PROPS_CONTROLLED}
                    canClearSelection={false}
                    timePrecision="second"
                    value={DATE1_VALUE}
                />,
                { attachTo: containerElement },
            );
            focusInput(wrapper);
            clickCalendarDay(wrapper, 4);
            assert.isTrue(onChange.calledOnce);
            assert.deepEqual(onChange.firstCall.args, [DATE1_VALUE, true]);
        });

        it("isUserChange is false when month changes", () => {
            const wrapper = mount(<DateInput2 {...DEFAULT_PROPS_CONTROLLED} value={DATE1_VALUE} />, {
                attachTo: containerElement,
            });
            focusInput(wrapper);
            changeSelectDropdown(wrapper, DatetimeClasses.DATEPICKER_MONTH_SELECT, Months.FEBRUARY);
            assert.isTrue(onChange.calledOnce);
            assert.isFalse(onChange.args[0][1], "expected isUserChange to be false");
        });

        it("formats locale-specific format strings properly", () => {
            const wrapper = mount(<DateInput2 {...DEFAULT_PROPS_CONTROLLED} locale="de" value={DATE2_VALUE} />);
            assert.strictEqual(wrapper.find(InputGroup).prop("value"), DATE2_UI_STR_DE);
        });
    });

    describe("date formatting", () => {
        const today = new Date();
        const todayIsoString = dateToIsoString(today);
        const formatDate = sinon.stub().returns("custom date");
        const parseDate = sinon.stub().returns(today);
        const locale = "LOCALE";
        const FORMATTING_PROPS: DateInput2Props = { formatDate, locale, parseDate };

        beforeEach(() => {
            formatDate.resetHistory();
            parseDate.resetHistory();
        });

        it("formatDate called on render with locale prop", () => {
            mount(<DateInput2 {...FORMATTING_PROPS} value={todayIsoString} />, { attachTo: containerElement });
            assert.isTrue(formatDate.calledWith(today, locale));
        });

        it("formatDate result becomes input value", () => {
            const wrapper = mount(<DateInput2 {...FORMATTING_PROPS} value={todayIsoString} />, {
                attachTo: containerElement,
            });
            assert.strictEqual(wrapper.find("input").prop("value"), "custom date");
        });

        it("parseDate called on change with locale prop", () => {
            const value = "new date";
            const wrapper = mount(<DateInput2 {...FORMATTING_PROPS} />, { attachTo: containerElement });
            changeInput(wrapper, value);
            assert.isTrue(parseDate.calledWith(value, locale));
        });

        it("parseDate returns false renders invalid date", () => {
            const invalidParse = sinon.stub().returns(false);
            const wrapper = mount(<DateInput2 {...FORMATTING_PROPS} parseDate={invalidParse} />, {
                attachTo: containerElement,
            });
            changeInput(wrapper, "invalid");
            blurInput(wrapper);
            assert.strictEqual(wrapper.find("input").prop("value"), DateInput2.defaultProps?.invalidDateMessage);
        });
    });

    function focusInput(wrapper: ReactWrapper<DateInput2Props>) {
        wrapper.find(InputGroup).find("input").simulate("focus");
    }

    function changeInput(wrapper: ReactWrapper<DateInput2Props>, value: string) {
        wrapper.find(InputGroup).find("input").simulate("change", { target: { value } });
    }

    function blurInput(wrapper: ReactWrapper<DateInput2Props>) {
        wrapper.find(InputGroup).find("input").simulate("blur");
    }

    function submitInput(wrapper: ReactWrapper<DateInput2Props>) {
        wrapper.find(InputGroup).find("input").simulate("keydown", { key: "Enter" });
    }

    function clickTimezoneItem(wrapper: ReactWrapper<DateInput2Props>, searchQuery: string) {
        wrapper.find(`.${Classes.TIMEZONE_SELECT}`).hostNodes().simulate("click");
        wrapper
            .find(`.${Classes.TIMEZONE_SELECT_POPOVER}`)
            .find(`.${CoreClasses.MENU_ITEM}`)
            .hostNodes()
            .findWhere(item => item.text().includes(searchQuery))
            .first()
            .simulate("click");
    }

    function clickCalendarDay(wrapper: ReactWrapper<DateInput2Props>, dayNumber: number) {
        wrapper
            .find(`.${DatetimeClasses.DATEPICKER_DAY}`)
            .filterWhere(day => day.text() === `${dayNumber}` && !day.hasClass(DatetimeClasses.DATEPICKER_DAY_OUTSIDE))
            .simulate("click");
    }

    function setTimeUnit(wrapper: ReactWrapper<DateInput2Props>, unit: TimeUnit, value: number) {
        focusInput(wrapper);
        let inputClass: string;
        switch (unit) {
            case TimeUnit.HOUR_12:
            case TimeUnit.HOUR_24:
                inputClass = DatetimeClasses.TIMEPICKER_HOUR;
                break;
            case TimeUnit.MINUTE:
                inputClass = DatetimeClasses.TIMEPICKER_MINUTE;
                break;
            case TimeUnit.SECOND:
                inputClass = DatetimeClasses.TIMEPICKER_SECOND;
                break;
            case TimeUnit.MS:
                inputClass = DatetimeClasses.TIMEPICKER_MILLISECOND;
                break;
        }
        const input = wrapper.find(`.${inputClass}`).first();
        input.simulate("focus");
        input.simulate("change", { target: { value } });
        input.simulate("blur");
    }

    function changeSelectDropdown(wrapper: ReactWrapper<DateInput2Props>, className: string, value: React.ReactText) {
        wrapper
            .find(`.${className}`)
            .find("select")
            .simulate("change", { target: { value: value.toString() } });
    }

    function assertPopoverIsOpen(wrapper: ReactWrapper<DateInput2Props>, expectedIsOpen: boolean = true) {
        const openPopoverTarget = wrapper.find(`.${Popover2Classes.POPOVER2_OPEN}`);
        if (expectedIsOpen) {
            assert.isTrue(
                openPopoverTarget.exists(),
                `Expected .${Popover2Classes.POPOVER2_OPEN} to exist, indicating the popover is open`,
            );
        } else {
            assert.isFalse(
                openPopoverTarget.exists(),
                `Expected .${Popover2Classes.POPOVER2_OPEN} NOT to exist, indicating the popover is closed`,
            );
        }
    }
});

/**
 * When we construct a Date() object in this test file, it sets it to the local timezone.
 * Use this helper function to reset the date's timezone to UTC instead.
 */
function localDateToUtcDate(date: Date) {
    return zonedTimeToUtc(date, getCurrentTimezone());
}

function dateToIsoString(date: Date) {
    return localDateToUtcDate(date).toISOString();
}
