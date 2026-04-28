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

import { intlFormat, parseISO } from "date-fns";
import enUSLocale from "date-fns/locale/en-US";
import { formatInTimeZone, zonedTimeToUtc } from "date-fns-tz";
import { mount, type ReactWrapper } from "enzyme";
import { createRef } from "react";

import { Classes as CoreClasses, InputGroup, PopoverNext, Tag } from "@blueprintjs/core";
import { afterEach, beforeEach, describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";
import { DefaultDateFnsFormats, getDateFnsFormatter } from "../../common/dateFnsFormatUtils";
import type { DateFormatProps } from "../../common/dateFormatProps";
import { loadDateFnsLocaleFake } from "../../common/loadDateFnsLocaleFake";
import { Months } from "../../common/months";
import { TimePrecision } from "../../common/timePrecision";
import { TimeUnit } from "../../common/timeUnit";
import { TIMEZONE_ITEMS } from "../../common/timezoneItems";
import * as TimezoneNameUtils from "../../common/timezoneNameUtils";
import * as TimezoneUtils from "../../common/timezoneUtils";
import { DatePicker } from "../date-picker/datePicker";
import { INVALID_DATE_MESSAGE, LOCALE } from "../dateConstants";
import { TimezoneSelect } from "../timezone-select/timezoneSelect";

import { DateInput, type DateInputProps } from "./dateInput";

const NEW_YORK_TIMEZONE = TIMEZONE_ITEMS.find(item => item.label === "New York")!;
const PARIS_TIMEZONE = TIMEZONE_ITEMS.find(item => item.label === "Paris")!;
const TOKYO_TIMEZONE = TIMEZONE_ITEMS.find(item => item.label === "Tokyo")!;

const VALUE = "2021-11-29T10:30:00z";

const LOCALE_LOADER = {
    dateFnsLocaleLoader: loadDateFnsLocaleFake,
};

const DEFAULT_PROPS: DateInputProps & DateFormatProps = {
    ...LOCALE_LOADER,
    defaultTimezone: TimezoneUtils.UTC_TIME.ianaCode,
    formatDate: (date: Date | null | undefined, localeCode?: string) => {
        if (date == null) {
            return "";
        } else if (localeCode === "de") {
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
    showTimezoneSelect: true,
    timePrecision: TimePrecision.SECOND,
};

describe("<DateInput>", () => {
    const onChange = vi.fn();
    let containerElement: HTMLElement;

    beforeEach(() => {
        containerElement = document.createElement("div");
        document.body.appendChild(containerElement);
    });

    afterEach(() => {
        containerElement.remove();
        onChange.mockClear();
    });

    describe("basic rendering", () => {
        it("should pass custom classNames to popover target", () => {
            const CLASS_1 = "foo";
            const CLASS_2 = "bar";

            const wrapper = mount(
                <DateInput
                    {...DEFAULT_PROPS}
                    className={CLASS_1}
                    popoverProps={{ ...DEFAULT_PROPS.popoverProps, className: CLASS_2 }}
                />,
            );

            const popoverTarget = wrapper.find(`.${Classes.DATE_INPUT}.${CoreClasses.POPOVER_TARGET}`).hostNodes();
            expect(popoverTarget.hasClass(CLASS_1)).toBe(true);
            expect(popoverTarget.hasClass(CLASS_2)).toBe(true);
        });

        it("should support custom input props", () => {
            const wrapper = mount(
                <DateInput {...DEFAULT_PROPS} inputProps={{ style: { background: "yellow" }, tabIndex: 4 }} />,
            );
            const inputElement = wrapper.find("input").getDOMNode<HTMLInputElement>();
            expect(inputElement.style.background).toBe("yellow");
            expect(inputElement.tabIndex).toBe(4);
        });

        it("should support inputProps.inputRef", () => {
            const inputRef = createRef<HTMLInputElement>();
            mount(<DateInput {...DEFAULT_PROPS} inputProps={{ inputRef }} />);
            expect(inputRef.current).toBeInstanceOf(HTMLInputElement);
        });

        it("should not render a TimezoneSelect if timePrecision is undefined", () => {
            const wrapper = mount(<DateInput {...DEFAULT_PROPS} timePrecision={undefined} />);
            expect(wrapper.find(TimezoneSelect).exists()).toBe(false);
        });

        it("should correctly pass defaultTimezone to TimezoneSelect", () => {
            const defaultTimezone = "Europe/Paris";
            const wrapper = mount(<DateInput {...DEFAULT_PROPS} defaultTimezone={defaultTimezone} />);
            const timezoneSelect = wrapper.find(TimezoneSelect);
            expect(timezoneSelect.prop("value")).toBe(defaultTimezone);
        });

        it("should pass datePickerProps to DatePicker correctly", () => {
            const datePickerProps = {
                clearButtonText: "clear",
                todayButtonText: "today",
            };
            const wrapper = mount(<DateInput {...DEFAULT_PROPS} {...datePickerProps} />);
            focusInput(wrapper);
            const datePicker = wrapper.find(DatePicker);
            expect(datePicker.prop("clearButtonText")).toBe("clear");
            expect(datePicker.prop("todayButtonText")).toBe("today");
        });

        it("should pass fill and inputProps to InputGroup", () => {
            const inputRef = vi.fn();
            const onFocus = vi.fn();
            const wrapper = mount(
                <DateInput
                    {...DEFAULT_PROPS}
                    fill={true}
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
            expect(input.prop("fill")).toBe(true);
            expect(input.prop("leftIcon")).toBe("star");
            expect(input.prop("required")).toBe(true);
            expect(inputRef).toHaveBeenCalled();
            expect(onFocus).toHaveBeenCalled();
        });

        it("should pass popoverProps to Popover", () => {
            const onOpening = vi.fn();
            const wrapper = mount(
                <DateInput
                    {...DEFAULT_PROPS}
                    popoverProps={{
                        onOpening,
                        placement: "top",
                        usePortal: false,
                    }}
                />,
            );
            focusInput(wrapper);

            const popover = wrapper.find(PopoverNext).first();
            expect(popover.prop("placement")).toBe("top");
            expect(popover.prop("usePortal")).toBe(false);
            expect(onOpening).toHaveBeenCalledOnce();
        });

        it("should gracefully handle invalid defaultTimezone prop value", () => {
            mount(<DateInput {...DEFAULT_PROPS} defaultTimezone="Foo/Bar" />);
        });
    });

    describe("popover interaction", () => {
        it("should open the popover when focusing input", () => {
            const wrapper = mount(<DateInput {...DEFAULT_PROPS} />, { attachTo: containerElement });
            focusInput(wrapper);
            assertPopoverIsOpen(wrapper);
        });

        it("should not open the popover when disabled", () => {
            const wrapper = mount(<DateInput {...DEFAULT_PROPS} disabled={true} />, {
                attachTo: containerElement,
            });
            focusInput(wrapper);
            assertPopoverIsOpen(wrapper, false);
        });

        it("should close the popover when ESC key is pressed", () => {
            const wrapper = mount(<DateInput {...DEFAULT_PROPS} />, { attachTo: containerElement });
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

        it("should call onChange on date changes", () => {
            const wrapper = mount(<DateInput {...DEFAULT_PROPS_UNCONTROLLED} />, { attachTo: containerElement });
            focusInput(wrapper);
            wrapper
                .find(`.${Classes.DATEPICKER3_DAY}:not(.${Classes.DATEPICKER3_DAY_OUTSIDE})`)
                .first()
                .simulate("click")
                .update();
            // first non-outside day should be the November 1st
            expect(onChange).toHaveBeenCalledExactlyOnceWith("2021-11-01T10:30:00+00:00", expect.anything());
        });

        it("should call onChange on timezone changes", () => {
            const wrapper = mount(<DateInput {...DEFAULT_PROPS_UNCONTROLLED} />, { attachTo: containerElement });
            clickTimezoneItem(wrapper, NEW_YORK_TIMEZONE.label);
            // New York is UTC-5
            expect(onChange).toHaveBeenCalledExactlyOnceWith("2021-11-29T10:30:00-05:00", expect.anything());
        });

        // HACKHACK: this test ported from Blueprint v4.x doesn't seem to match any real UX, since pressing Shift+Tab
        // on the first focussable day in a calendar month doesn't move you to the previous month; instead it moves focus
        // to the year dropdown. It might be worth testing behavior when pressing the left arrow key, since that _does_
        // move focus to the last day of the previous month.
        it.skip("popover should not close if focus moves to previous day (last day of prev month)", () => {
            const wrapper = mount(<DateInput {...DEFAULT_PROPS_UNCONTROLLED} />, { attachTo: containerElement });
            focusInput(wrapper);
            blurInput(wrapper);
            const firstTabbable = wrapper.find(PopoverNext).find(".DayPicker-Day").filter({ tabIndex: 0 }).first();
            const lastDayOfPrevMonth = wrapper
                .find(PopoverNext)
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
            const wrapper = mount(<DateInput {...DEFAULT_PROPS_UNCONTROLLED} />, { attachTo: containerElement });
            focusInput(wrapper);
            blurInput(wrapper);
            changeSelectDropdown(wrapper, Classes.DATEPICKER_MONTH_SELECT, Months.NOVEMBER);
            assertPopoverIsOpen(wrapper);
        });

        it("popover should not close if focus moves to year select", () => {
            const wrapper = mount(<DateInput {...DEFAULT_PROPS_UNCONTROLLED} />, { attachTo: containerElement });
            focusInput(wrapper);
            blurInput(wrapper);
            changeSelectDropdown(wrapper, Classes.DATEPICKER_YEAR_SELECT, 2020);
            assertPopoverIsOpen(wrapper);
        });

        it("popover should not close when time picker arrows are clicked after selecting a month", () => {
            const wrapper = mount(
                <DateInput {...DEFAULT_PROPS_UNCONTROLLED} timePickerProps={{ showArrowButtons: true }} />,
                { attachTo: containerElement },
            );
            focusInput(wrapper);
            changeSelectDropdown(wrapper, Classes.DATEPICKER_MONTH_SELECT, Months.OCTOBER);
            wrapper.find(`.${Classes.TIMEPICKER_ARROW_BUTTON}.${Classes.TIMEPICKER_HOUR}`).first().simulate("click");
            assertPopoverIsOpen(wrapper);
        });

        it("should save the inputted date and close the popover when pressing Enter", () => {
            const IMPROPERLY_FORMATTED_DATE_STRING = "002/0015/2015";
            const PROPERLY_FORMATTED_DATE_STRING = "2/15/2015";
            const onKeyDown = vi.fn();
            const wrapper = mount(<DateInput {...DEFAULT_PROPS_UNCONTROLLED} inputProps={{ onKeyDown }} />, {
                attachTo: containerElement,
            });
            focusInput(wrapper);
            const input = wrapper.find(InputGroup).find("input");
            input.simulate("change", { target: { value: IMPROPERLY_FORMATTED_DATE_STRING } });
            input.simulate("keydown", { key: "Enter" });
            assertPopoverIsOpen(wrapper, false);
            expect(document.activeElement).not.toBe(input.getDOMNode());
            expect(wrapper.find(InputGroup).prop("value")).toBe(PROPERLY_FORMATTED_DATE_STRING);
            expect(onKeyDown).toHaveBeenCalledOnce();
        });

        it("should put the clicked date in the input box and close the popover", () => {
            const wrapper = mount(<DateInput {...DEFAULT_PROPS} />, { attachTo: containerElement });
            focusInput(wrapper);
            expect(wrapper.find(InputGroup).prop("value")).toBe("");
            const dayToClick = 12;
            clickCalendarDay(wrapper, dayToClick);
            const today = new Date();
            expect(wrapper.find(InputGroup).prop("value")).toBe(
                `${today.getMonth() + 1}/${dayToClick}/${today.getFullYear()}`,
            );
            assertPopoverIsOpen(wrapper, false);
        });

        it("should close the popover when clicking a date in the same month with a default value", () => {
            const DAY = 15;
            const PREV_DAY = DAY - 1;
            const defaultValue = `2022-07-${DAY}T15:00:00z`; // include an arbitrary non-zero hour
            const wrapper = mount(<DateInput {...DEFAULT_PROPS_UNCONTROLLED} defaultValue={defaultValue} />, {
                attachTo: containerElement,
            });
            focusInput(wrapper);
            clickCalendarDay(wrapper, PREV_DAY);
            assertPopoverIsOpen(wrapper, false);
        });

        it("should clear the input and call onChange with null when clearing the date in the DatePicker", () => {
            const wrapper = mount(<DateInput {...DEFAULT_PROPS_UNCONTROLLED} />, {
                attachTo: containerElement,
            });
            focusInput(wrapper);
            expect(wrapper.find(InputGroup).prop("value")).toBe("11/29/2021");
            // default value is 29th day of November
            clickCalendarDay(wrapper, 29);
            wrapper.update();
            expect(wrapper.find(InputGroup).prop("value")).toBe("");
            expect(onChange).toHaveBeenCalledWith(null, expect.anything());
        });

        it("should clear the selection and invoke onChange with null when clearing the date in the input", () => {
            const wrapper = mount(<DateInput {...DEFAULT_PROPS_UNCONTROLLED} />, { attachTo: containerElement });
            wrapper
                .find(InputGroup)
                .find("input")
                .simulate("change", { target: { value: "" } });

            expect(wrapper.find(`.${Classes.DATEPICKER3_DAY_SELECTED}`)).toHaveLength(0);
            expect(onChange).toHaveBeenCalledWith(null, expect.anything());
        });

        it("should keep the popover open on date click if closeOnSelection=false", () => {
            const wrapper = mount(<DateInput {...DEFAULT_PROPS_UNCONTROLLED} closeOnSelection={false} />, {
                attachTo: containerElement,
            });
            focusInput(wrapper);
            wrapper.find(`.${Classes.DATEPICKER3_DAY}`).first().simulate("click").update();
            assertPopoverIsOpen(wrapper);
        });

        it("should keep the popover open when month changes", () => {
            const wrapper = mount(<DateInput {...DEFAULT_PROPS_UNCONTROLLED} />, { attachTo: containerElement });
            focusInput(wrapper);
            changeSelectDropdown(wrapper, Classes.DATEPICKER_MONTH_SELECT, Months.DECEMBER);
            assertPopoverIsOpen(wrapper);
        });

        it("should keep the popover open when time changes", () => {
            const wrapper = mount(<DateInput {...DEFAULT_PROPS_UNCONTROLLED} />, { attachTo: containerElement });
            focusInput(wrapper);

            // try typing a new time
            setTimeUnit(wrapper, TimeUnit.SECOND, 1);
            assertPopoverIsOpen(wrapper);

            // try keyboard-incrementing to a new time
            wrapper.find(`.${Classes.TIMEPICKER_SECOND}`).first().simulate("keydown", { key: "ArrowUp" });
            assertPopoverIsOpen(wrapper);
        });

        it("should set input value but keep popover open when clicking a day in a different month", () => {
            const wrapper = mount(<DateInput {...DEFAULT_PROPS_UNCONTROLLED} defaultValue="2016-04-03T00:00:00z" />, {
                attachTo: containerElement,
            });
            focusInput(wrapper);
            expect(wrapper.find(InputGroup).prop("value")).toBe("4/3/2016");

            wrapper
                .find(`.${Classes.DATEPICKER3_DAY}`)
                .filterWhere(day => day.text() === "27")
                .first()
                .simulate("click");

            assertPopoverIsOpen(wrapper);
            expect(wrapper.find(InputGroup).prop("value")).toBe("3/27/2016");
        });

        it("should invoke onChange and inputProps.onChange when typing a valid date", () => {
            const DATE_VALUE = "2015-02-10T00:00:00+00:00";
            const DATE_STR = "2/10/2015";
            const onInputChange = vi.fn();
            const wrapper = mount(
                <DateInput {...DEFAULT_PROPS_UNCONTROLLED} inputProps={{ onChange: onInputChange }} />,
                { attachTo: containerElement },
            );
            changeInput(wrapper, DATE_STR);

            expect(onChange).toHaveBeenCalledExactlyOnceWith(DATE_VALUE, expect.anything());
            expect(onInputChange).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ type: "change" }));
        });

        it("should display the error message and call onError when typing a date out of range", () => {
            const rangeMessage = "RANGE ERROR";
            const onError = vi.fn();
            const wrapper = mount(
                <DateInput
                    {...DEFAULT_PROPS_UNCONTROLLED}
                    defaultValue={new Date(2015, Months.MAY, 1).toISOString()}
                    minDate={new Date(2015, Months.MARCH, 1)}
                    onError={onError}
                    outOfRangeMessage={rangeMessage}
                />,
            );
            const value = "2/1/2030";
            wrapper.find("input").simulate("change", { target: { value } }).simulate("blur");

            expect(wrapper.find(InputGroup).prop("intent")).toBe("danger");
            expect(wrapper.find(InputGroup).prop("value")).toBe(rangeMessage);

            expect(onError).toHaveBeenCalledExactlyOnceWith(new Date(value));
        });

        it("should display the error message and call onError with Date(undefined) when typing an invalid date", () => {
            const invalidDateMessage = INVALID_DATE_MESSAGE;
            const onError = vi.fn();
            const wrapper = mount(
                <DateInput
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

            expect(wrapper.find(InputGroup).prop("intent")).toBe("danger");
            expect(wrapper.find(InputGroup).prop("value")).toBe(invalidDateMessage);

            expect(onError.mock.calls[0][0].valueOf()).toBeNaN();
        });

        it("clearing a date should not be possible with canClearSelection=false and timePrecision enabled", () => {
            const DATE = new Date(2016, Months.APRIL, 4);
            const wrapper = mount(
                <DateInput
                    {...DEFAULT_PROPS_UNCONTROLLED}
                    canClearSelection={false}
                    defaultValue={dateToIsoString(DATE)}
                    timePrecision={TimePrecision.SECOND}
                />,
                { attachTo: containerElement },
            );
            focusInput(wrapper);
            clickCalendarDay(wrapper, DATE.getDate());
            expect(parseISO(onChange.mock.calls[0][0])).toEqual(DATE);
        });

        describe("allows changing timezone via user interaction (uncontrolled timezone value)", () => {
            it("before selecting a date", () => {
                const wrapper = mount(<DateInput {...DEFAULT_PROPS} />, { attachTo: containerElement });
                focusInput(wrapper);
                // Japan is one of the few countries that does not have any kind of daylight savings, so this unit test
                // keeps working all year round
                clickTimezoneItem(wrapper, TOKYO_TIMEZONE.label);
                assertTimezoneIsSelected(wrapper, "GMT+9");
            });

            it("after selecting a date", () => {
                const wrapper = mount(<DateInput {...DEFAULT_PROPS} />, { attachTo: containerElement });
                focusInput(wrapper);
                clickCalendarDay(wrapper, 1);
                clickTimezoneItem(wrapper, TOKYO_TIMEZONE.label);
                assertTimezoneIsSelected(wrapper, "GMT+9");
            });
        });

        describe("allows changing timezone programmatically (controlled timezone value)", () => {
            it("before selecting a date", () => {
                const wrapper = mount(<DateInput {...DEFAULT_PROPS} timezone={TimezoneUtils.UTC_TIME.ianaCode} />, {
                    attachTo: containerElement,
                });
                wrapper.setProps({ timezone: TOKYO_TIMEZONE.ianaCode }).update();
                assertTimezoneIsSelected(wrapper, "GMT+9");
            });

            it("after selecting a date", () => {
                const wrapper = mount(<DateInput {...DEFAULT_PROPS} timezone={TimezoneUtils.UTC_TIME.ianaCode} />, {
                    attachTo: containerElement,
                });
                focusInput(wrapper);
                clickCalendarDay(wrapper, 1);
                wrapper.setProps({ timezone: TOKYO_TIMEZONE.ianaCode }).update();
                assertTimezoneIsSelected(wrapper, "GMT+9");
            });
        });

        it("should allow changing defaultTimezone", () => {
            const wrapper = mount(<DateInput {...DEFAULT_PROPS_UNCONTROLLED} />, { attachTo: containerElement });
            expect(wrapper.find(TimezoneSelect).text()).toBe(
                TimezoneNameUtils.getTimezoneShortName(TimezoneUtils.UTC_TIME.ianaCode, undefined),
            );
            wrapper.setProps({ defaultTimezone: TOKYO_TIMEZONE.ianaCode }).update();
            expect(wrapper.find(TimezoneSelect).text()).toBe(
                TimezoneNameUtils.getTimezoneShortName(TOKYO_TIMEZONE.ianaCode, undefined),
            );
        });
    });

    describe("controlled usage", () => {
        const DEFAULT_PROPS_CONTROLLED = {
            ...DEFAULT_PROPS,
            onChange,
            value: VALUE,
        };

        it("should handle null inputs without crashing", () => {
            expect(() => mount(<DateInput {...DEFAULT_PROPS_CONTROLLED} value={null} />)).not.toThrow();
        });

        it("should call onChange with the updated ISO string when changing the time", () => {
            const wrapper = mount(<DateInput {...DEFAULT_PROPS_CONTROLLED} />, { attachTo: containerElement });
            focusInput(wrapper);
            setTimeUnit(wrapper, TimeUnit.HOUR_24, 11);
            expect(onChange).toHaveBeenCalledExactlyOnceWith("2021-11-29T11:30:00+00:00", true);
        });

        it("should invoke onChange with null when clearing the input", () => {
            const wrapper = mount(<DateInput {...DEFAULT_PROPS_CONTROLLED} />);
            wrapper
                .find(InputGroup)
                .find("input")
                .simulate("change", { target: { value: "" } });
            expect(onChange).toHaveBeenCalledExactlyOnceWith(null, true);
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
            const onKeyDown = vi.fn();
            const wrapper = mount(
                <DateInput {...DEFAULT_PROPS_CONTROLLED} value={DATE1_VALUE} inputProps={{ onKeyDown }} />,
                { attachTo: containerElement },
            );
            focusInput(wrapper);
            changeInput(wrapper, DATE2_UI_STR);
            submitInput(wrapper);

            // onChange is called once on change, once on Enter
            expect(onChange).toHaveBeenCalledTimes(2);
            expect(onChange.mock.calls[1][0]).toBe(
                formatInTimeZone(parseISO(DATE2_VALUE), TimezoneUtils.UTC_TIME.ianaCode, "yyyy-MM-dd'T'HH:mm:ssxxx"),
            );
            expect(onKeyDown).toHaveBeenCalledOnce();
            expect(document.activeElement).toBe(wrapper.find(InputGroup).find("input").getDOMNode());
            assertPopoverIsOpen(wrapper, false);
        });

        it("should invoke onChange callback with the clicked date", () => {
            const wrapper = mount(<DateInput {...DEFAULT_PROPS_CONTROLLED} onChange={onChange} value={DATE1_VALUE} />, {
                attachTo: containerElement,
            });
            focusInput(wrapper);
            clickCalendarDay(wrapper, 27);

            expect(onChange).toHaveBeenCalledExactlyOnceWith("2016-04-27T00:00:00+00:00", true);
        });

        it("should invoke onChange with null but not change UI when clearing the date in the DatePicker", () => {
            const wrapper = mount(<DateInput {...DEFAULT_PROPS_CONTROLLED} onChange={onChange} value={DATE1_VALUE} />, {
                attachTo: containerElement,
            });
            focusInput(wrapper);
            clickCalendarDay(wrapper, 4);
            expect(wrapper.find(InputGroup).prop("value")).toBe("4/4/2016");
            expect(onChange).toHaveBeenCalledWith(null, true);
        });

        it("should update the text input when controlled value changes", () => {
            const wrapper = mount(<DateInput {...DEFAULT_PROPS_CONTROLLED} value={DATE1_VALUE} />, {
                attachTo: containerElement,
            });
            expect(wrapper.find(InputGroup).prop("value")).toBe(DATE1_UI_STR);
            wrapper.setProps({ value: DATE2_VALUE });
            wrapper.update();
            expect(wrapper.find(InputGroup).prop("value")).toBe(DATE2_UI_STR);
        });

        it("should invoke onChange and inputProps.onChange when typing a date", () => {
            const onInputChange = vi.fn();
            const wrapper = mount(
                <DateInput
                    {...DEFAULT_PROPS_CONTROLLED}
                    inputProps={{ onChange: onInputChange }}
                    onChange={onChange}
                    value={DATE1_VALUE}
                />,
                { attachTo: containerElement },
            );
            changeInput(wrapper, DATE2_UI_STR);
            expect(onChange).toHaveBeenCalledExactlyOnceWith(DATE2_VALUE, true);
            expect(onInputChange).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ type: "change" }));
        });

        it("should update the text input with the 'invalid date' message when typing an invalid date", () => {
            const wrapper = mount(<DateInput {...DEFAULT_PROPS_CONTROLLED} value={DATE1_VALUE} />, {
                attachTo: containerElement,
            });
            focusInput(wrapper);
            changeInput(wrapper, "4/77/2016");
            blurInput(wrapper);
            expect(wrapper.find(InputGroup).prop("value")).toBe(INVALID_DATE_MESSAGE);
        });

        it("should not show error styling until user blurs the input", () => {
            const wrapper = mount(<DateInput {...DEFAULT_PROPS_CONTROLLED} value={DATE1_VALUE} />, {
                attachTo: containerElement,
            });
            focusInput(wrapper);
            changeInput(wrapper, "4/77/201");
            expect(wrapper.find(InputGroup).prop("intent")).not.toBe("danger");
            blurInput(wrapper);
            expect(wrapper.find(InputGroup).prop("intent")).toBe("danger");
        });

        it("should invoke onChange with null when clearing the date in the input", () => {
            const wrapper = mount(<DateInput {...DEFAULT_PROPS_CONTROLLED} value={DATE1_VALUE} />, {
                attachTo: containerElement,
            });
            changeInput(wrapper, "");
            expect(onChange).toHaveBeenCalledWith(null, true);
        });

        it("clearing a date should not be possible with canClearSelection=false and timePrecision enabled", () => {
            const wrapper = mount(
                <DateInput
                    {...DEFAULT_PROPS_CONTROLLED}
                    canClearSelection={false}
                    timePrecision="second"
                    value={DATE1_VALUE}
                />,
                { attachTo: containerElement },
            );
            focusInput(wrapper);
            clickCalendarDay(wrapper, 4);
            expect(onChange).toHaveBeenCalledExactlyOnceWith(DATE1_VALUE, true);
        });

        it("should set isUserChange to false when month changes", () => {
            const wrapper = mount(<DateInput {...DEFAULT_PROPS_CONTROLLED} value={DATE1_VALUE} />, {
                attachTo: containerElement,
            });
            focusInput(wrapper);
            changeSelectDropdown(wrapper, Classes.DATEPICKER_MONTH_SELECT, Months.FEBRUARY);
            expect(onChange).toHaveBeenCalledExactlyOnceWith(expect.any(String), false);
        });

        it("should format locale-specific format strings properly", () => {
            const wrapper = mount(<DateInput {...DEFAULT_PROPS_CONTROLLED} locale="de" value={DATE2_VALUE} />);
            expect(wrapper.find(InputGroup).prop("value")).toBe(DATE2_UI_STR_DE);
        });

        describe("when changing timezone", () => {
            it("should call onChange with the updated ISO string", () => {
                const wrapper = mount(<DateInput {...DEFAULT_PROPS_CONTROLLED} />, {
                    attachTo: containerElement,
                });
                clickTimezoneItem(wrapper, PARIS_TIMEZONE.label);
                expect(onChange).toHaveBeenCalledExactlyOnceWith("2021-11-29T10:30:00+01:00", true);
            });

            it("should format the returned ISO string according to timePrecision", () => {
                const wrapper = mount(
                    <DateInput {...DEFAULT_PROPS_CONTROLLED} timePrecision={TimePrecision.MINUTE} />,
                    { attachTo: containerElement },
                );
                clickTimezoneItem(wrapper, PARIS_TIMEZONE.label);
                expect(onChange).toHaveBeenCalledExactlyOnceWith("2021-11-29T10:30+01:00", true);
            });

            it("should update the displayed timezone", () => {
                const wrapper = mount(<DateInput {...DEFAULT_PROPS_CONTROLLED} />, {
                    attachTo: containerElement,
                });
                clickTimezoneItem(wrapper, TOKYO_TIMEZONE.label);
                assertTimezoneIsSelected(wrapper, "GMT+9");
            });

            it("before selecting a date (initial value={null})", () => {
                const wrapper = mount(<DateInput {...DEFAULT_PROPS} value={null} />, {
                    attachTo: containerElement,
                });
                clickTimezoneItem(wrapper, TOKYO_TIMEZONE.label);
                assertTimezoneIsSelected(wrapper, "GMT+9");
            });
        });

        it("allows changing defaultTimezone", () => {
            const wrapper = mount(<DateInput {...DEFAULT_PROPS_CONTROLLED} />, { attachTo: containerElement });
            expect(wrapper.find(TimezoneSelect).text()).toBe(
                TimezoneNameUtils.getTimezoneShortName(TimezoneUtils.UTC_TIME.ianaCode, undefined),
            );
            wrapper.setProps({ defaultTimezone: TOKYO_TIMEZONE.ianaCode });
            expect(wrapper.find(TimezoneSelect).text()).toBe(
                TimezoneNameUtils.getTimezoneShortName(TOKYO_TIMEZONE.ianaCode, undefined),
            );
        });
    });

    describe("date formatting", () => {
        const today = new Date();
        const todayIsoString = dateToIsoString(today);

        describe("with formatDate & parseDate defined", () => {
            const formatDate = vi.fn().mockReturnValue("custom date");
            const parseDate = vi.fn().mockReturnValue(today);
            const localeCode = LOCALE;
            const FORMATTING_PROPS: DateInputProps = {
                dateFnsLocaleLoader: DEFAULT_PROPS.dateFnsLocaleLoader,
                formatDate,
                locale: localeCode,
                parseDate,
            };

            beforeEach(() => {
                formatDate.mockClear();
                parseDate.mockClear();
            });

            it("should call formatDate on render with locale prop", () => {
                mount(<DateInput {...FORMATTING_PROPS} value={todayIsoString} />, { attachTo: containerElement });
                expect(formatDate).toHaveBeenCalledWith(today, localeCode);
            });

            it("should use formatDate result as input value", () => {
                const wrapper = mount(<DateInput {...FORMATTING_PROPS} value={todayIsoString} />, {
                    attachTo: containerElement,
                });
                expect(wrapper.find("input").prop("value")).toBe("custom date");
            });

            it("should call parseDate on change with locale prop", () => {
                const value = "new date";
                const wrapper = mount(<DateInput {...FORMATTING_PROPS} />, { attachTo: containerElement });
                changeInput(wrapper, value);
                expect(parseDate).toHaveBeenCalledWith(value, localeCode);
            });

            it("should render invalid date when parseDate returns false", () => {
                const invalidParse = vi.fn().mockReturnValue(false);
                const wrapper = mount(<DateInput {...FORMATTING_PROPS} parseDate={invalidParse} />, {
                    attachTo: containerElement,
                });
                changeInput(wrapper, "invalid");
                blurInput(wrapper);
                expect(wrapper.find("input").prop("value")).toBe(INVALID_DATE_MESSAGE);
            });
        });

        describe("with formatDate & parseDate undefined", () => {
            describe("with dateFnsFormat defined", () => {
                it("should use the specified format", () => {
                    const format = "Pp";
                    const wrapper = mount(
                        <DateInput {...LOCALE_LOADER} dateFnsFormat={format} value={todayIsoString} />,
                        {
                            attachTo: containerElement,
                        },
                    );
                    const formatter = getDateFnsFormatter(format, enUSLocale);
                    expect(wrapper.find("input").prop("value")).toBe(formatter(today));
                });
            });

            describe("with dateFnsFormat undefined", () => {
                it(`should use default date-only format "${DefaultDateFnsFormats.DATE_ONLY}" when timepicker disabled`, () => {
                    const wrapper = mount(<DateInput {...LOCALE_LOADER} value={todayIsoString} />, {
                        attachTo: containerElement,
                    });
                    const defaultFormatter = getDateFnsFormatter(DefaultDateFnsFormats.DATE_ONLY, enUSLocale);
                    expect(wrapper.find("input").prop("value")).toBe(defaultFormatter(today));
                });

                it(`should use default date + time minute format "${DefaultDateFnsFormats.DATE_TIME_MINUTES}" when timepicker enabled`, () => {
                    const wrapper = mount(
                        <DateInput {...LOCALE_LOADER} value={todayIsoString} timePrecision="minute" />,
                        {
                            attachTo: containerElement,
                        },
                    );
                    const defaultFormatter = getDateFnsFormatter(DefaultDateFnsFormats.DATE_TIME_MINUTES, enUSLocale);
                    expect(wrapper.find("input").prop("value")).toBe(defaultFormatter(today));
                });

                it(`should use default date + time seconds format "${DefaultDateFnsFormats.DATE_TIME_SECONDS}" when timePrecision="second"`, () => {
                    const wrapper = mount(
                        <DateInput {...LOCALE_LOADER} value={todayIsoString} timePrecision="second" />,
                        {
                            attachTo: containerElement,
                        },
                    );
                    const defaultFormatter = getDateFnsFormatter(DefaultDateFnsFormats.DATE_TIME_SECONDS, enUSLocale);
                    expect(wrapper.find("input").prop("value")).toBe(defaultFormatter(today));
                });
            });
        });
    });

    function focusInput(wrapper: ReactWrapper<DateInputProps>) {
        wrapper.find(InputGroup).find("input").simulate("focus");
    }

    function changeInput(wrapper: ReactWrapper<DateInputProps>, value: string) {
        wrapper.find(InputGroup).find("input").simulate("change", { target: { value } });
    }

    function blurInput(wrapper: ReactWrapper<DateInputProps>) {
        wrapper.find(InputGroup).find("input").simulate("blur");
    }

    function submitInput(wrapper: ReactWrapper<DateInputProps>) {
        wrapper.find(InputGroup).find("input").simulate("keydown", { key: "Enter" });
    }

    function clickTimezoneItem(wrapper: ReactWrapper<DateInputProps>, searchQuery: string) {
        wrapper.find(`.${Classes.TIMEZONE_SELECT}`).hostNodes().simulate("click");
        const tzItem = wrapper
            .find(`.${Classes.TIMEZONE_SELECT_POPOVER}`)
            .find(`.${CoreClasses.MENU_ITEM}`)
            .hostNodes()
            .findWhere(item => item.text().includes(searchQuery))
            .first();

        if (tzItem.exists()) {
            tzItem.simulate("click");
        } else {
            expect.unreachable(`Could not find timezone option with query '${searchQuery}'`);
        }
    }

    function clickCalendarDay(wrapper: ReactWrapper<DateInputProps>, dayNumber: number) {
        wrapper
            .find(`.${Classes.DATEPICKER3_DAY}`)
            .filterWhere(day => day.text() === `${dayNumber}` && !day.hasClass(Classes.DATEPICKER3_DAY_OUTSIDE))
            .hostNodes()
            .simulate("click");
    }

    function setTimeUnit(wrapper: ReactWrapper<DateInputProps>, unit: TimeUnit, value: number) {
        focusInput(wrapper);
        let inputClass: string;
        switch (unit) {
            case TimeUnit.HOUR_12:
            case TimeUnit.HOUR_24:
                inputClass = Classes.TIMEPICKER_HOUR;
                break;
            case TimeUnit.MINUTE:
                inputClass = Classes.TIMEPICKER_MINUTE;
                break;
            case TimeUnit.SECOND:
                inputClass = Classes.TIMEPICKER_SECOND;
                break;
            case TimeUnit.MS:
                inputClass = Classes.TIMEPICKER_MILLISECOND;
                break;
        }
        const input = wrapper.find(`.${inputClass}`).first();
        input.simulate("focus");
        input.simulate("change", { target: { value } });
        input.simulate("blur");
    }

    function changeSelectDropdown(wrapper: ReactWrapper<DateInputProps>, className: string, value: string | number) {
        wrapper
            .find(`.${className}`)
            .find("select")
            .simulate("change", { target: { value: value.toString() } });
    }

    function assertPopoverIsOpen(wrapper: ReactWrapper<DateInputProps>, expectedIsOpen: boolean = true) {
        const openPopoverTarget = wrapper.find(`.${CoreClasses.POPOVER_OPEN}`);
        if (expectedIsOpen) {
            expect(openPopoverTarget.exists()).toBe(true);
        } else {
            expect(openPopoverTarget.exists()).toBe(false);
        }
    }

    function assertTimezoneIsSelected(wrapper: ReactWrapper<DateInputProps>, tzCode: string) {
        const tzTag = wrapper.find(Tag);
        expect(tzTag.text()).toBe(tzCode);
    }
});

/**
 * When we construct a Date() object in this test file, it sets it to the local timezone.
 * Use this helper function to reset the date's timezone to UTC instead.
 */
function localDateToUtcDate(date: Date) {
    return zonedTimeToUtc(date, TimezoneUtils.getCurrentTimezone());
}

function dateToIsoString(date: Date) {
    return localDateToUtcDate(date).toISOString();
}
