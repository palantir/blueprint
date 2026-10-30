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

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { type DateRange } from "../..";
import { loadDateFnsLocaleFake } from "../../common/loadDateFnsLocaleFake";
import { DateRangePicker, type DateRangePickerProps } from "../date-range-picker/dateRangePicker";

// Change the default for testability
(DateRangePicker.defaultProps as DateRangePickerProps).dateFnsLocaleLoader = loadDateFnsLocaleFake;

describe("<DateRangePicker> time pickers", () => {
    async function renderPicker(props: DateRangePickerProps) {
        const onChange = vi.fn<(range: DateRange) => void>();
        render(
            <DateRangePicker
                allowSingleDayRange={true}
                onChange={onChange}
                timePrecision="minute"
                {...props}
                timePickerProps={{ showArrowButtons: true, ...props.timePickerProps }}
            />,
        );
        await screen.findAllByLabelText("hours (24hr clock)");

        const getHours = (side: "start" | "end") =>
            screen.getAllByLabelText<HTMLInputElement>("hours (24hr clock)")[side === "start" ? 0 : 1].value;
        const clickHours = async (side: "start" | "end", direction: "Increase" | "Decrease") =>
            userEvent.click(screen.getAllByLabelText(`${direction} hours (24hr clock)`)[side === "start" ? 0 : 1]);

        return { clickHours, getHours, onChange };
    }

    describe("on a range within a single day", () => {
        const singleDayRange: DateRange = [new Date(2012, 2, 5, 10, 0), new Date(2012, 2, 5, 11, 0)];

        it("does not let the end time go earlier than the start time", async () => {
            const { clickHours, getHours, onChange } = await renderPicker({ defaultValue: singleDayRange });

            await clickHours("end", "Decrease");
            expect(onChange).toHaveBeenCalledOnce();
            expect(onChange.mock.lastCall![0][1]!.getHours()).toBe(10);

            await clickHours("end", "Decrease");
            expect(onChange).toHaveBeenCalledOnce();
            expect(getHours("end")).toBe("10");
        });

        it("does not let the start time go later than the end time", async () => {
            const { clickHours, getHours, onChange } = await renderPicker({ defaultValue: singleDayRange });

            await clickHours("start", "Increase");
            expect(onChange).toHaveBeenCalledOnce();
            expect(onChange.mock.lastCall![0][0]!.getHours()).toBe(11);

            await clickHours("start", "Increase");
            expect(onChange).toHaveBeenCalledOnce();
            expect(getHours("start")).toBe("11");
        });

        it("keeps the bounds from timePickerProps", async () => {
            const { clickHours, getHours, onChange } = await renderPicker({
                defaultValue: [new Date(2012, 2, 5, 8, 0), new Date(2012, 2, 5, 11, 0)],
                timePickerProps: { minTime: new Date(2012, 2, 5, 9, 0) },
            });

            // 11 -> 10 -> 9, and then 8 is before both the start time and `minTime`
            await clickHours("end", "Decrease");
            await clickHours("end", "Decrease");
            await clickHours("end", "Decrease");
            expect(onChange).toHaveBeenCalledTimes(2);
            expect(getHours("end")).toBe("9");
        });
    });

    describe("when selecting days", () => {
        it("keeps the earlier time first when the range becomes a single day", async () => {
            // the range ends earlier in the day than it starts, which is fine as long as it spans two days
            const { getHours, onChange } = await renderPicker({
                defaultValue: [new Date(2012, 2, 5, 15, 0), new Date(2012, 2, 6, 9, 0)],
            });

            // select the same day twice: the picker keeps the times of the previous range, so the new
            // single-day range would start at 15:00 and end at 09:00
            await userEvent.click(screen.getAllByRole("gridcell", { name: "20" })[0]);
            await userEvent.click(screen.getAllByRole("gridcell", { name: "20" })[0]);

            expect(onChange).toHaveBeenCalledTimes(2);
            const [start, end] = onChange.mock.lastCall![0];
            expect(start!.getDate()).toBe(20);
            expect(end!.getDate()).toBe(20);
            expect([start!.getHours(), end!.getHours()]).toEqual([9, 15]);
            expect([getHours("start"), getHours("end")]).toEqual(["9", "15"]);
        });
    });

    describe("on a range across several days", () => {
        it("lets the end time go earlier than the start time", async () => {
            const { clickHours, getHours, onChange } = await renderPicker({
                defaultValue: [new Date(2012, 2, 5, 10, 0), new Date(2012, 2, 6, 11, 0)],
            });

            await clickHours("end", "Decrease");
            await clickHours("end", "Decrease");
            await clickHours("end", "Decrease");
            expect(onChange).toHaveBeenCalledTimes(3);
            expect(getHours("end")).toBe("8");
        });
    });
});
