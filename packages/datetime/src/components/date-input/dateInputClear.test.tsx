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

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import enUS from "date-fns/locale/en-US";
import { useState } from "react";

import { afterEach, describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";
import { TimePrecision } from "../../common/timePrecision";

import { DateInput } from "./dateInput";

const BASE_PROPS = {
    locale: enUS,
    maxDate: new Date(2030, 11, 31),
    minDate: new Date(2020, 0, 1),
    popoverProps: { usePortal: false },
    showActionsBar: true,
    timezone: "Etc/UTC",
};
const CLEAR_ACTIONS = ["Clear button", "selected day"] as const;

afterEach(cleanup);

describe("DateInput calendar clearing", () => {
    for (const action of CLEAR_ACTIONS) {
        it.each([undefined, TimePrecision.MINUTE])(
            `clears the uncontrolled value with the ${action} (precision %s)`,
            async timePrecision => {
                const onChange = vi.fn();
                render(
                    <>
                        <DateInput
                            {...BASE_PROPS}
                            defaultValue="2025-06-15T09:15:00Z"
                            onChange={onChange}
                            timePrecision={timePrecision}
                        />
                        <button>Outside</button>
                    </>,
                );
                const input = screen.getByRole("combobox");
                await userEvent.click(input);
                await clearCalendar(action);
                expect(onChange).toHaveBeenCalledExactlyOnceWith(null, true);
                expect(input).toHaveValue("");
                expect(selectedDays()).toHaveLength(0);

                await userEvent.click(screen.getByRole("button", { name: "Outside" }));
                await userEvent.click(input);
                expect(input).toHaveValue("");
                expect(selectedDays()).toHaveLength(0);

                await userEvent.click(calendarDay("16"));
                expect(onChange).toHaveBeenLastCalledWith(
                    timePrecision === undefined ? "2025-06-16" : "2025-06-16T00:00+00:00",
                    true,
                );
                await userEvent.click(screen.getByRole("button", { name: "Outside" }));
                expect(input).toHaveValue(timePrecision === undefined ? "2025-06-16" : "2025-06-16 00:00");
            },
        );

        it.each([true, false])(
            `respects the controlled parent's response to the ${action} (accept %s)`,
            async accept => {
                const onChange = vi.fn();
                function Controlled() {
                    const [value, setValue] = useState<string | null>("2025-06-15");
                    return (
                        <>
                            <DateInput
                                {...BASE_PROPS}
                                onChange={(next, user) => {
                                    onChange(next, user);
                                    if (accept) {
                                        setValue(next);
                                    }
                                }}
                                value={value}
                            />
                            <button>Outside</button>
                        </>
                    );
                }
                render(<Controlled />);
                const input = screen.getByRole("combobox");
                await userEvent.click(input);
                await clearCalendar(action);
                expect(onChange).toHaveBeenCalledExactlyOnceWith(null, true);
                await userEvent.click(screen.getByRole("button", { name: "Outside" }));
                await userEvent.click(input);
                expect(input).toHaveValue(accept ? "" : "2025-06-15");
                expect(selectedDays()).toHaveLength(accept ? 0 : 1);
            },
        );
    }

    it("continues to clear the uncontrolled date by editing its text", async () => {
        const onChange = vi.fn();
        render(<DateInput {...BASE_PROPS} defaultValue="2025-06-15" onChange={onChange} />);
        const input = screen.getByRole("combobox");
        await userEvent.click(input);
        await userEvent.clear(input);
        fireEvent.blur(input);
        expect(onChange).toHaveBeenCalledExactlyOnceWith(null, true);
        expect(input).toHaveValue("");
        expect(selectedDays()).toHaveLength(0);
    });

    it("preserves valid text submission with Enter", async () => {
        const onChange = vi.fn();
        render(<DateInput {...BASE_PROPS} defaultValue="2025-06-15" onChange={onChange} />);
        const input = screen.getByRole("combobox");
        await userEvent.click(input);
        fireEvent.change(input, { target: { value: "2025-06-16" } });
        await userEvent.keyboard("{Enter}");
        expect(input).toHaveValue("2025-06-16");
        expect(onChange).toHaveBeenLastCalledWith("2025-06-16", true);
    });

    it.each(["invalid", "2031-01-01"])("preserves blur validation for %s input", async text => {
        const onChange = vi.fn();
        const onError = vi.fn();
        render(<DateInput {...BASE_PROPS} defaultValue="2025-06-15" onChange={onChange} onError={onError} />);
        const input = screen.getByRole("combobox");
        await userEvent.click(input);
        fireEvent.change(input, { target: { value: text } });
        fireEvent.blur(input);
        expect(onChange).not.toHaveBeenCalled();
        expect(onError).toHaveBeenCalledOnce();
        expect(input).toHaveValue(text === "invalid" ? "Invalid date" : "Out of range");
    });
});

function selectedDays() {
    return document.querySelectorAll(`.${Classes.DATEPICKER3_DAY_SELECTED}`);
}

function calendarDay(text: string) {
    return [...document.querySelectorAll<HTMLElement>(`.${Classes.DATEPICKER3_DAY}`)].find(
        day => day.textContent === text && !day.classList.contains(Classes.DATEPICKER3_DAY_OUTSIDE),
    )!;
}

async function clearCalendar(action: (typeof CLEAR_ACTIONS)[number]) {
    await userEvent.click(
        action === "Clear button" ? screen.getByRole("button", { name: "Clear" }) : calendarDay("15"),
    );
}
