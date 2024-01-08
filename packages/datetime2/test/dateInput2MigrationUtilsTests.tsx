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

/* eslint-disable deprecation/deprecation */

import { assert } from "chai";
import { mount } from "enzyme";
import * as React from "react";

import { TimePrecision } from "@blueprintjs/datetime";

import { DateInput2, DateInput2MigrationUtils } from "../src";

const dateFormattingProps = {
    formatDate: (date: Date | null | undefined) =>
        date == null ? "" : [date.getMonth() + 1, date.getDate(), date.getFullYear()].join("/"),
    parseDate: (str: string) => new Date(str),
};

const controlledDateInputProps = {
    onChange: (_newDate: Date | null, _isUserChange: boolean) => {
        // nothing
    },
    value: new Date(),
};

const uncontrolledDateInputProps = {
    defaultValue: new Date(),
    onChange: (_newDate: Date | null, _isUserChange: boolean) => {
        // nothing
    },
};

describe("DateInput2MigrationUtils", () => {
    it("Applying onChange + value adapters renders DateInput without error", () => {
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

    it("Default value adapter works as expected", () => {
        const precision = TimePrecision.MINUTE;
        mount(
            <DateInput2
                {...dateFormattingProps}
                timePrecision={precision}
                onChange={DateInput2MigrationUtils.onChangeAdapter(uncontrolledDateInputProps.onChange)}
                defaultValue={DateInput2MigrationUtils.defaultValueAdapter(
                    uncontrolledDateInputProps.defaultValue,
                    precision,
                )}
            />,
        );
    });

    it("Adapters work in common usage pattern with React.useCallback + React.useMemo", () => {
        function TestComponent() {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            const handleChange = React.useCallback(
                DateInput2MigrationUtils.onChangeAdapter(controlledDateInputProps.onChange),
                [],
            );
            // eslint-disable-next-line react-hooks/exhaustive-deps
            const value = React.useMemo(
                () => DateInput2MigrationUtils.valueAdapter(controlledDateInputProps.value),
                [],
            );

            return <DateInput2 {...dateFormattingProps} onChange={handleChange} value={value} />;
        }

        mount(<TestComponent />);
    });
});
