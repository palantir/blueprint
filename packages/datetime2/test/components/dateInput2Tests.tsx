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
import { mount } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";

import { Classes as CoreClasses, InputGroup, Position } from "@blueprintjs/core";
import { DateInput, Classes as DatetimeClasses, TimePrecision } from "@blueprintjs/datetime";

import { Classes, DateInput2, TimezoneSelect } from "../../src";

const VALUE = "2021-11-29T10:30:00.000z";

const formatDate = (date: Date | null | undefined) =>
    date == null ? "" : [date.getMonth() + 1, date.getDate(), date.getFullYear()].join("/");
const parseDate = (str: string) => new Date(str);
const DEFAULT_PROPS = {
    defaultTimezone: "Etc/UTC",
    formatDate,
    parseDate,
    popoverProps: {
        isOpen: true,
        usePortal: false,
    },
    timePrecision: TimePrecision.MILLISECOND,
};

describe("<DateInput2>", () => {
    const onChange = sinon.spy();

    afterEach(() => onChange.resetHistory());

    describe("controlled usage", () => {
        const DEFAULT_PROPS_CONTROLLED = {
            ...DEFAULT_PROPS,
            onChange,
            value: VALUE,
        };

        it("handles null inputs without crashing", () => {
            assert.doesNotThrow(() => mount(<DateInput2 {...DEFAULT_PROPS_CONTROLLED} value={null} />));
        });

        it("Correctly passes on the default selected timezone", () => {
            const defaultTimezone = "Europe/Paris";
            const wrapper = mount(<DateInput2 {...DEFAULT_PROPS_CONTROLLED} defaultTimezone={defaultTimezone} />);
            const timezoneSelect = wrapper.find(TimezoneSelect);

            assert.strictEqual(timezoneSelect.prop("value"), defaultTimezone);
        });

        it("It updates the passed back string when timezone is changed", () => {
            const wrapper = mount(<DateInput2 {...DEFAULT_PROPS_CONTROLLED} />);
            const timezoneSelect = wrapper.find(TimezoneSelect);
            const newTimezone = "Europe/Paris";
            timezoneSelect.prop("onChange")(newTimezone);

            assert.isTrue(onChange.calledOnce);
            assert.deepEqual(onChange.firstCall.args, ["2021-11-29T10:30:00.000+01:00"]);
        });

        it("It formats the string based on the time precision when timezone is changed", () => {
            const wrapper = mount(<DateInput2 {...DEFAULT_PROPS_CONTROLLED} timePrecision={TimePrecision.MINUTE} />);
            const timezoneSelect = wrapper.find(TimezoneSelect);
            const newTimezone = "Europe/Paris";
            timezoneSelect.prop("onChange")(newTimezone);

            assert.isTrue(onChange.calledOnce);
            assert.deepEqual(onChange.firstCall.args, ["2021-11-29T10:30+01:00"]);
        });

        it("It updates the passed back string when time is changed", () => {
            const wrapper = mount(<DateInput2 {...DEFAULT_PROPS_CONTROLLED} />);
            const timezoneSelect = wrapper.find(DateInput);
            timezoneSelect.prop("onChange")!(new Date("2021-11-29T11:30:00.000"), true);

            assert.isTrue(onChange.calledOnce);
            assert.deepEqual(onChange.firstCall.args, ["2021-11-29T11:30:00.000+00:00", true]);
        });

        it("Does not render a timezone select if timePrecision is undefined", () => {
            const wrapper = mount(<DateInput2 {...DEFAULT_PROPS_CONTROLLED} timePrecision={undefined} />);
            assert.isFalse(wrapper.find(TimezoneSelect).exists());
        });

        it("Passes the correct date in to DateInput", () => {
            const wrapper = mount(<DateInput2 {...DEFAULT_PROPS_CONTROLLED} value="2021-11-29" />);
            const dateInput = wrapper.find(DateInput);
            const date = new Date("2021-11-29");
            assert.strictEqual(formatDate(dateInput.prop("value")), formatDate(date));
        });

        it("Passes the correct timestamp in to DateInput", () => {
            const wrapper = mount(<DateInput2 {...DEFAULT_PROPS_CONTROLLED} />);
            const dateInput = wrapper.find(DateInput);
            const date = new Date("2021-11-29");
            assert.strictEqual(formatDate(dateInput.prop("value")), formatDate(date));
        });

        it("passes props on to date input", () => {
            const inputRef = sinon.spy();
            const onFocus = sinon.spy();
            const inputProps = {
                disabled: true,
                inputRef,
                onFocus,
                required: true,
            };
            const popoverProps = {
                autoFocus: true,
                content: "fail",
                fill: true,
                isOpen: true,
                position: Position.TOP,
                usePortal: false,
            };
            const wrapper = mount(
                <DateInput2
                    {...DEFAULT_PROPS_CONTROLLED}
                    disabled={false}
                    inputProps={inputProps}
                    popoverProps={popoverProps}
                />,
            );
            const dateinput = wrapper.find(DateInput);

            assert.isFalse(dateinput.prop("disabled"), "disabled comes from DateInput props");
            assert.strictEqual(dateinput.prop("inputProps"), inputProps);
            assert.strictEqual(dateinput.prop("popoverProps"), popoverProps);
        });

        it("Clearing the input invokes onChange with null", () => {
            const wrapper = mount(<DateInput2 {...DEFAULT_PROPS_CONTROLLED} />);
            wrapper
                .find(InputGroup)
                .find("input")
                .simulate("change", { target: { value: "" } });
            assert.isTrue(onChange.calledOnceWithExactly(null, true));
        });
    });

    describe("uncontrolled usage", () => {
        const DEFAULT_PROPS_UNCONTROLLED = {
            ...DEFAULT_PROPS,
            defaultValue: VALUE,
            onChange,
        };

        let containerElement: HTMLElement | undefined;

        beforeEach(() => {
            containerElement = document.createElement("div");
            document.body.appendChild(containerElement);
        });
        afterEach(() => containerElement?.remove());

        it("calls onChange on date changes", () => {
            const wrapper = mount(<DateInput2 {...DEFAULT_PROPS_UNCONTROLLED} />, { attachTo: containerElement });
            wrapper
                .find(`.${DatetimeClasses.DATEPICKER_DAY}:not(.${DatetimeClasses.DATEPICKER_DAY_OUTSIDE})`)
                .first()
                .simulate("click")
                .update();
            assert.isTrue(onChange.calledOnce);
            // first non-outside day should be the November 1st
            assert.strictEqual(onChange.firstCall.args[0], "2021-11-01T10:30:00.000+00:00");
            wrapper.unmount();
        });

        it("calls onChange on timezone changes", () => {
            const wrapper = mount(<DateInput2 {...DEFAULT_PROPS_UNCONTROLLED} />, { attachTo: containerElement });
            wrapper.find(`.${Classes.TIMEZONE_SELECT}`).hostNodes().simulate("click");
            wrapper
                .find(`.${Classes.TIMEZONE_SELECT_POPOVER}`)
                .find(`.${CoreClasses.MENU_ITEM}`)
                .hostNodes()
                .findWhere(item => item.text().includes("New York"))
                .first()
                .simulate("click");
            assert.isTrue(onChange.calledOnce);
            console.info(onChange.firstCall.args);
            // New York is UTC-5
            assert.strictEqual(onChange.firstCall.args[0], "2021-11-29T10:30:00.000-05:00");
            wrapper.unmount();
        });
    });
});
