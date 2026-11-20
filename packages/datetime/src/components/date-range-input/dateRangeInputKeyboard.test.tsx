/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { format, parse } from "date-fns";
import { useState } from "react";

import { describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import type { DateRange } from "../../common/dateRange";

import { DateRangeInput, type DateRangeInputProps } from "./dateRangeInput";

const DATE_FORMAT = "yyyy-MM-dd";
const navigationCases = [
    { from: new Date(2025, 10, 2), key: "ArrowRight", name: "fall next day", to: new Date(2025, 10, 3) },
    { from: new Date(2025, 10, 3), key: "ArrowLeft", name: "fall previous day", to: new Date(2025, 10, 2) },
    { from: new Date(2025, 9, 27), key: "ArrowDown", name: "fall next week", to: new Date(2025, 10, 3) },
    { from: new Date(2025, 10, 3), key: "ArrowUp", name: "fall previous week", to: new Date(2025, 9, 27) },
    { from: new Date(2025, 2, 9), key: "ArrowRight", name: "spring next day", to: new Date(2025, 2, 10) },
    { from: new Date(2025, 2, 10), key: "ArrowLeft", name: "spring previous day", to: new Date(2025, 2, 9) },
    { from: new Date(2025, 2, 3), key: "ArrowDown", name: "spring next week", to: new Date(2025, 2, 10) },
    { from: new Date(2025, 2, 10), key: "ArrowUp", name: "spring previous week", to: new Date(2025, 2, 3) },
    { from: new Date(2025, 10, 1), key: "ArrowRight", name: "ordinary next day", to: new Date(2025, 10, 2) },
];

describe("DateRangeInput calendar keyboard navigation", () => {
    for (const boundary of [0, 1] as const) {
        it.each(navigationCases)(
            `$name updates boundary ${boundary} and its callback at midnight`,
            async ({ from, to, key }) => {
                const range: DateRange = boundary === 0 ? [from, new Date(2025, 11, 31)] : [new Date(2025, 0, 1), from];
                const original = range.map(date => date?.valueOf());
                const { input, onChange, user } = await renderInput(range, boundary);

                await user.keyboard(`{${key}}`);

                expect(input.value).toBe(format(to, DATE_FORMAT));
                expect(onChange).toHaveBeenCalledOnce();
                expect(onChange.mock.calls[0][0][boundary]).toEqual(to);
                expect(onChange.mock.calls[0][0][1 - boundary]).toEqual(range[1 - boundary]);
                expect(range.map(date => date?.valueOf())).toEqual(original);
            },
        );
    }

    it.each([
        { boundary: 0, key: "ArrowLeft", maxDate: new Date(2025, 10, 3), minDate: new Date(2025, 10, 2) },
        { boundary: 1, key: "ArrowRight", maxDate: new Date(2025, 10, 3), minDate: new Date(2025, 10, 2) },
    ] as const)("respects min/max bounds at boundary $boundary", async ({ boundary, key, minDate, maxDate }) => {
        const range: DateRange = [minDate, maxDate];
        const { input, onChange, user } = await renderInput(range, boundary, { maxDate, minDate });

        await user.keyboard(`{${key}}`);

        expect(input.value).toBe(format(range[boundary]!, DATE_FORMAT));
        expect(onChange).toHaveBeenLastCalledWith(range);
    });

    it.each([
        { boundary: 0, key: "ArrowRight" },
        { boundary: 1, key: "ArrowLeft" },
    ] as const)("keeps disallowed single-day ranges apart at boundary $boundary", async ({ boundary, key }) => {
        const range: DateRange = [new Date(2025, 10, 2), new Date(2025, 10, 3)];
        const { input, onChange, user } = await renderInput(range, boundary, { allowSingleDayRange: false });

        await user.keyboard(`{${key}}`);

        expect(input.value).toBe(format(range[boundary]!, DATE_FORMAT));
        expect(onChange).toHaveBeenLastCalledWith(range);
    });
});

async function renderInput(range: DateRange, boundary: 0 | 1, props: Partial<DateRangeInputProps> = {}) {
    const user = userEvent.setup();
    const onChange = vi.fn<(value: DateRange) => void>();
    function ControlledInput() {
        const [value, setValue] = useState(range);
        return (
            <DateRangeInput
                endInputProps={{ "aria-label": "End date" }}
                formatDate={date => format(date, DATE_FORMAT)}
                parseDate={text => parse(text, DATE_FORMAT, new Date())}
                popoverProps={{ usePortal: false }}
                selectAllOnFocus={true}
                shortcuts={false}
                startInputProps={{ "aria-label": "Start date" }}
                value={value}
                onChange={nextValue => {
                    onChange(nextValue);
                    setValue(nextValue);
                }}
                {...props}
            />
        );
    }
    render(<ControlledInput />);
    const input = screen.getByRole<HTMLInputElement>("textbox", { name: boundary === 0 ? "Start date" : "End date" });
    await user.click(input);
    expect(document.activeElement).toBe(input);
    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe(input.value.length);
    return { input, onChange, user };
}
