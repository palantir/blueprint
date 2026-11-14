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

import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { DateRangeInput } from "./dateRangeInput";

describe("DateRangeInput disabled state", () => {
    it("does not change the range when the open picker becomes disabled", async () => {
        const onChange = vi.fn();
        const value: [Date, Date] = [new Date(2026, 10, 12), new Date(2026, 10, 15)];
        const picker = (disabled: boolean) => (
            <DateRangeInput
                disabled={disabled}
                onChange={onChange}
                shortcuts={false}
                singleMonthOnly={true}
                value={value}
            />
        );
        const { rerender } = render(picker(false));
        const [startInput, endInput] = screen.getAllByRole("textbox");

        fireEvent.focus(startInput);
        const day = await screen.findByRole("gridcell", { name: "16" });

        rerender(picker(true));
        fireEvent.click(day);

        expect(startInput).toBeDisabled();
        expect(endInput).toBeDisabled();
        expect(onChange).not.toHaveBeenCalled();
        await waitFor(() => expect(screen.queryByRole("grid")).not.toBeInTheDocument());

        rerender(picker(false));
        expect(screen.queryByRole("grid")).not.toBeInTheDocument();
        fireEvent.focus(startInput);
        fireEvent.click(await screen.findByRole("gridcell", { name: "16" }));
        expect(onChange).toHaveBeenCalledWith([new Date(2026, 10, 16), null]);
    });
});
