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

import { Position } from "@blueprintjs/core";
import { DateInput, TimePrecision } from "@blueprintjs/datetime";

import { DateInput2, IDateInput2Props } from "../../src/components/date-input2/dateInput2";
import { TimezonePicker2 } from "../../src/components/timezone-picker/timezonePicker2";

const VALUE = "2021-11-29T10:30:00.000z";

const formatDate = (date: Date) => [date.getMonth() + 1, date.getDate(), date.getFullYear()].join("/");
const parseDate = (str: string) => new Date(str);

describe("<Time zone aware date input>", () => {
    const onChange = sinon.spy();
    const DEFAULT_PROPS: IDateInput2Props = {
        formatDate,
        onChange,
        parseDate,
        popoverProps: {
            isOpen: true,
            usePortal: false,
        },
        timePrecision: TimePrecision.MILLISECOND,
        value: VALUE,
    };

    afterEach(() => onChange.resetHistory());

    it("handles null inputs without crashing", () => {
        assert.doesNotThrow(() => mount(<DateInput2 {...DEFAULT_PROPS} value={null} />));
    });

    it("Correctly passes on the default selected timezone", () => {
        const defaultTimezone = "Europe/Paris";
        const wrapper = mount(<DateInput2 {...DEFAULT_PROPS} defaultTimezone={defaultTimezone} />);
        const timezonePicker = wrapper.find(TimezonePicker2);

        assert.strictEqual(timezonePicker.prop("value"), defaultTimezone);
    });

    it("It updates the passed back string when timezone is changed", () => {
        const wrapper = mount(<DateInput2 {...DEFAULT_PROPS} />);
        const timezonePicker = wrapper.find(TimezonePicker2);
        const newTimezone = "Europe/Paris";
        timezonePicker.prop("onChange")(newTimezone);

        assert.isTrue(onChange.calledOnce);
        assert.deepEqual(onChange.firstCall.args, ["2021-11-29T10:30:00.000+01:00"]);
    });

    it("It formats the string based on the time precision when timezone is changed", () => {
        const wrapper = mount(<DateInput2 {...DEFAULT_PROPS} timePrecision={TimePrecision.MINUTE} />);
        const timezonePicker = wrapper.find(TimezonePicker2);
        const newTimezone = "Europe/Paris";
        timezonePicker.prop("onChange")(newTimezone);

        assert.isTrue(onChange.calledOnce);
        assert.deepEqual(onChange.firstCall.args, ["2021-11-29T10:30+01:00"]);
    });

    it("It updates the passed back string when time is changed", () => {
        const wrapper = mount(<DateInput2 {...DEFAULT_PROPS} />);
        const timezonePicker = wrapper.find(DateInput);
        timezonePicker.prop("onChange")(new Date("2021-11-29T11:30:00.000"), true);

        assert.isTrue(onChange.calledOnce);
        assert.deepEqual(onChange.firstCall.args, ["2021-11-29T11:30:00.000+00:00", true]);
    });

    it("Does not render a timezone picker not passed a precision", () => {
        const wrapper = mount(<DateInput2 {...DEFAULT_PROPS} timePrecision={undefined} />);
        assert.isFalse(wrapper.find(TimezonePicker2).exists());
    });

    it("Passes the correct date in to DateInput", () => {
        const wrapper = mount(<DateInput2 {...DEFAULT_PROPS} value="2021-11-29" />);
        const dateInput = wrapper.find(DateInput);
        const date = new Date("2021-11-29");
        assert.strictEqual(formatDate(dateInput.prop("value")), formatDate(date));
    });

    it("Passes the correct timestamp in to DateInput", () => {
        const wrapper = mount(<DateInput2 {...DEFAULT_PROPS} />);
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
            <DateInput2 {...DEFAULT_PROPS} disabled={false} inputProps={inputProps} popoverProps={popoverProps} />,
        );
        const dateinput = wrapper.find(DateInput);

        assert.isFalse(dateinput.prop("disabled"), "disabled comes from DateInput props");
        assert.strictEqual(dateinput.prop("inputProps"), inputProps);
        assert.strictEqual(dateinput.prop("popoverProps"), popoverProps);
    });
});
