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
import React from "react";

import { DateInputProps, TimePrecision } from "@blueprintjs/datetime";

import { DateInput2, DateInput2MigrationUtils } from "../../src";

const dateFormattingProps = {
    formatDate: (date: Date | null | undefined) =>
        date == null ? "" : [date.getMonth() + 1, date.getDate(), date.getFullYear()].join("/"),
    parseDate: (str: string) => new Date(str),
};

const controlledDateInputProps: Required<Pick<DateInputProps, "value" | "onChange">> = {
    onChange: (_newDate: Date | null, _isUserChange: boolean) => {
        // nothing
    },
    value: new Date(),
};

describe("DateInput2MigrationUtils", () => {
    it("Applying onChange + value adapters renders DateInput2 without error", () => {
        mount(
            <DateInput2
                {...dateFormattingProps}
                onChange={DateInput2MigrationUtils.onChangeAdapter(controlledDateInputProps.onChange)}
                value={DateInput2MigrationUtils.valueAdapter(controlledDateInputProps.value)}
            />,
        );
    });

    it("Value adapter accepts time precision", () => {
        const precision = TimePrecision.MINUTE;
        mount(
            <DateInput2
                {...dateFormattingProps}
                timePrecision={precision}
                onChange={DateInput2MigrationUtils.onChangeAdapter(controlledDateInputProps.onChange)}
                value={DateInput2MigrationUtils.valueAdapter(controlledDateInputProps.value, precision)}
            />,
        );
    });

    it("Value adapter infers time precision from Date object", () => {
        const date = new Date();

        // TimePrecision.SECOND forces the string to exclude the date's milliseconds value
        date.setHours(0, 0, 10, 100);
        const valueWithExplicitPrecision = DateInput2MigrationUtils.valueAdapter(date, TimePrecision.SECOND);

        date.setHours(0, 0, 10, 0);
        assert.strictEqual(DateInput2MigrationUtils.valueAdapter(date), valueWithExplicitPrecision);

        date.setHours(0, 0, 10, 100);
        assert.notStrictEqual(DateInput2MigrationUtils.valueAdapter(date), valueWithExplicitPrecision);
    });
});
