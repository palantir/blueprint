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
import { useCallback, useMemo } from "react";

import { DateInput as DateInput2, DateInputMigrationUtils, TimePrecision } from "../src";

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
                onChange={DateInputMigrationUtils.onChangeAdapter(controlledDateInputProps.onChange)}
                value={DateInputMigrationUtils.valueAdapter(controlledDateInputProps.value)}
            />,
        );
    });

    it("Value adapter accepts time precision", () => {
        const precision = TimePrecision.MINUTE;
        mount(
            <DateInput2
                {...dateFormattingProps}
                timePrecision={precision}
                onChange={DateInputMigrationUtils.onChangeAdapter(controlledDateInputProps.onChange)}
                value={DateInputMigrationUtils.valueAdapter(controlledDateInputProps.value, precision)}
            />,
        );
    });

    it("Value adapter infers time precision from Date object", () => {
        const date = new Date();

        // TimePrecision.SECOND forces the string to exclude the date's milliseconds value
        date.setHours(0, 0, 10, 100);
        const valueWithExplicitPrecision = DateInputMigrationUtils.valueAdapter(date, TimePrecision.SECOND);

        date.setHours(0, 0, 10, 0);
        assert.strictEqual(DateInputMigrationUtils.valueAdapter(date), valueWithExplicitPrecision);

        date.setHours(0, 0, 10, 100);
        assert.notStrictEqual(DateInputMigrationUtils.valueAdapter(date), valueWithExplicitPrecision);
    });

    it("Default value adapter works as expected", () => {
        const precision = TimePrecision.MINUTE;
        mount(
            <DateInput2
                {...dateFormattingProps}
                timePrecision={precision}
                onChange={DateInputMigrationUtils.onChangeAdapter(uncontrolledDateInputProps.onChange)}
                defaultValue={DateInputMigrationUtils.defaultValueAdapter(
                    uncontrolledDateInputProps.defaultValue,
                    precision,
                )}
            />,
        );
    });

    it("Adapters work in common usage pattern with React.useCallback + React.useMemo", () => {
        function TestComponent() {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            const handleChange = useCallback(
                DateInputMigrationUtils.onChangeAdapter(controlledDateInputProps.onChange),
                [],
            );
            const value = useMemo(() => DateInputMigrationUtils.valueAdapter(controlledDateInputProps.value), []);

            return <DateInput2 {...dateFormattingProps} onChange={handleChange} value={value} />;
        }

        mount(<TestComponent />);
    });
});
