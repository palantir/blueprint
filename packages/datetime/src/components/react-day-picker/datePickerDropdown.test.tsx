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

import { render } from "@testing-library/react";

import { Classes as CoreClasses } from "@blueprintjs/core";
import { afterEach, beforeEach, describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { DatePickerDropdown } from "./datePickerDropdown";

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June"];

function renderMonthOptions(months: number[]) {
    return months.map(month => (
        <option key={month} value={month}>
            {MONTH_NAMES[month]}
        </option>
    ));
}

describe("DatePickerDropdown", () => {
    beforeEach(() => {
        // jsdom has no layout: make the select as wide as its widest option and give text a fixed width
        vi.spyOn(HTMLSelectElement.prototype, "clientWidth", "get").mockImplementation(function (
            this: HTMLSelectElement,
        ) {
            const longestLabel = Math.max(...Array.from(this.options, option => option.text.length));
            return longestLabel * 10 + 30;
        });
        vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(40);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("positions the month icon again when the month options change", () => {
        const props = { caption: "June", name: "months" as const, onChange: vi.fn(), value: 5 };
        const { container, rerender } = render(
            <DatePickerDropdown {...props}>{renderMonthOptions([0, 1, 2, 3, 4, 5])}</DatePickerDropdown>,
        );
        const icon = () => container.querySelector<HTMLElement>(`.${CoreClasses.ICON}`)!;
        // widest option "February": 8 * 10 + 30 - 40 (text) - 16 (icon) - 2
        expect(icon().style.right).toBe("52px");

        // minDate and maxDate now fall in the same month, so only "June" is left and the select gets narrower
        rerender(<DatePickerDropdown {...props}>{renderMonthOptions([5])}</DatePickerDropdown>);
        // 4 * 10 + 30 - 40 - 16 - 2
        expect(icon().style.right).toBe("12px");
    });
});
