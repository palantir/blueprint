/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
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

import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import enUSLocale from "date-fns/locale/en-US";
import { useState } from "react";

import { describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { TimePrecision } from "../../common/timePrecision";

import { DateInput, type DateInputProps } from "./dateInput";

const CASES: Array<{
    name: string;
    props: Pick<DateInputProps, "timePickerProps" | "timePrecision">;
    text: string;
    expected: string;
}> = [
    {
        expected: "2025-06-15T18:45+00:00",
        name: "nested minute precision",
        props: { timePickerProps: { precision: TimePrecision.MINUTE } },
        text: "2025-06-15 18:45",
    },
    {
        expected: "2025-06-15T18:45:27+00:00",
        name: "nested second precision",
        props: { timePickerProps: { precision: TimePrecision.SECOND } },
        text: "2025-06-15 18:45:27",
    },
    {
        expected: "2025-06-15T18:45:27.123+00:00",
        name: "nested millisecond precision",
        props: { timePickerProps: { precision: TimePrecision.MILLISECOND } },
        text: "2025-06-15 18:45:27.123",
    },
    {
        expected: "2025-06-15T18:45+00:00",
        name: "default minute precision with other time picker props",
        props: { timePickerProps: { useAmPm: true } },
        text: "2025-06-15 18:45",
    },
    {
        expected: "2025-06-15T18:45+00:00",
        name: "top-level minute precision",
        props: { timePrecision: TimePrecision.MINUTE },
        text: "2025-06-15 18:45",
    },
    {
        expected: "2025-06-15T18:45:27+00:00",
        name: "top-level precision taking precedence in date formatting",
        props: { timePickerProps: { precision: TimePrecision.MINUTE }, timePrecision: TimePrecision.SECOND },
        text: "2025-06-15 18:45:27",
    },
    {
        expected: "2025-06-16",
        name: "date-only input without time picker props",
        props: {},
        text: "2025-06-16",
    },
    {
        expected: "2025-06-16",
        name: "date-only input with empty time picker props",
        props: { timePickerProps: {} },
        text: "2025-06-16",
    },
];

describe("<DateInput> time precision", () => {
    for (const { name, props, text, expected } of CASES) {
        it(`preserves a controlled edit with ${name}`, async () => {
            const onChange = vi.fn();
            const user = userEvent.setup();

            function ControlledDateInput() {
                const [value, setValue] = useState<string | null>("2025-06-15T09:15:00Z");
                return (
                    <>
                        <DateInput
                            {...props}
                            locale={enUSLocale}
                            onChange={(nextValue, isUserChange) => {
                                onChange(nextValue, isUserChange);
                                setValue(nextValue);
                            }}
                            popoverProps={{ usePortal: false }}
                            showTimezoneSelect={false}
                            timezone="Etc/UTC"
                            value={value}
                        />
                        <button>Outside input</button>
                    </>
                );
            }

            render(<ControlledDateInput />);
            const input = screen.getByRole("combobox");
            await user.click(input);
            fireEvent.change(input, { target: { value: text } });
            expect(onChange).toHaveBeenCalledExactlyOnceWith(expected, true);
            await user.click(screen.getByRole("button", { name: "Outside input" }));
            expect(input).toHaveValue(text);
        });
    }

    for (const { name, props } of [CASES[0], CASES[3], CASES[4]]) {
        it(`shows the timezone selector and preserves time on timezone change with ${name}`, async () => {
            const onChange = vi.fn();
            const onTimezoneChange = vi.fn();
            const user = userEvent.setup();

            render(
                <DateInput
                    {...props}
                    defaultTimezone="Etc/UTC"
                    defaultValue="2025-06-15T09:15:00Z"
                    locale={enUSLocale}
                    onChange={onChange}
                    onTimezoneChange={onTimezoneChange}
                    popoverProps={{ usePortal: false }}
                />,
            );

            const input = screen.getByRole("combobox");
            const timezoneSelector = screen.getByLabelText("timezone");
            expect(timezoneSelector).toHaveTextContent("UTC");
            await user.click(timezoneSelector);
            await user.type(screen.getByPlaceholderText("Search for timezones..."), "Europe/Paris");
            await user.click(screen.getByRole("menuitem", { name: /Paris/ }));

            expect(onTimezoneChange).toHaveBeenCalledExactlyOnceWith("Europe/Paris");
            expect(onChange).toHaveBeenCalledExactlyOnceWith("2025-06-15T09:15+02:00", true);
            expect(timezoneSelector).toHaveTextContent("GMT+2");
            expect(input).toHaveValue("2025-06-15 09:15");
        });

        it(`keeps the popover open after changing the time with ${name}`, async () => {
            const onChange = vi.fn();
            const user = userEvent.setup();

            render(
                <DateInput
                    {...props}
                    defaultValue="2025-06-15T09:15:00Z"
                    locale={enUSLocale}
                    onChange={onChange}
                    popoverProps={{ usePortal: false }}
                    timezone="Etc/UTC"
                />,
            );

            const input = screen.getByRole("combobox");
            await user.click(input);
            const dialog = screen.getByRole("dialog", { name: "date picker" });
            const minuteInput = within(dialog).getByRole("spinbutton", { name: "minutes" });
            await user.click(minuteInput);
            await user.keyboard("{ArrowUp}");

            expect(input).toHaveAttribute("aria-expanded", "true");
            expect(screen.getByRole("dialog", { name: "date picker" })).toBeVisible();
            expect(onChange).toHaveBeenCalledExactlyOnceWith("2025-06-15T09:16+00:00", true);
            expect(input).toHaveValue("2025-06-15 09:16");
        });
    }

    for (const { name, props } of [CASES[6], CASES[7]]) {
        it(`hides the timezone selector for ${name}`, () => {
            render(<DateInput {...props} locale={enUSLocale} showTimezoneSelect={true} />);
            expect(screen.queryByLabelText("timezone")).not.toBeInTheDocument();
        });
    }

    it("allows explicitly hiding the timezone selector with nested precision", () => {
        render(
            <DateInput
                locale={enUSLocale}
                showTimezoneSelect={false}
                timePickerProps={{ precision: TimePrecision.MINUTE }}
            />,
        );
        expect(screen.queryByLabelText("timezone")).not.toBeInTheDocument();
    });
});
