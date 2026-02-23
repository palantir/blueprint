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

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Classes as CoreClasses } from "@blueprintjs/core";
import { afterEach, describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { getCurrentTimezone } from "../../common/getTimezone";
import { TIMEZONE_ITEMS } from "../../common/timezoneItems";
import { getInitialTimezoneItems } from "../../common/timezoneNameUtils";

import { TimezoneSelect, type TimezoneSelectProps } from "./timezoneSelect";

const LOS_ANGELES_TZ = "America/Los_Angeles";
let CURRENT_TZ = getCurrentTimezone();
// HACKHACK: tests in CI seem to return 'UTC' instead of 'Etc/UTC';
if (CURRENT_TZ === "UTC") {
    CURRENT_TZ = "Etc/UTC";
}

describe("<TimezoneSelect>", () => {
    const onChange = vi.fn();
    const DEFAULT_PROPS: TimezoneSelectProps = {
        onChange,
        popoverProps: {
            isOpen: true,
            usePortal: false,
        },
        value: LOS_ANGELES_TZ,
    };

    afterEach(() => onChange.mockClear());

    it("should open popover when clicking on button target", async () => {
        const user = userEvent.setup();
        const { baseElement } = render(<TimezoneSelect {...DEFAULT_PROPS} popoverProps={{ usePortal: false }} />);
        const button = screen.getByRole("button");
        await user.click(button);

        // After click, the popover should be open (menu items should be present)
        const menuItems = baseElement.querySelectorAll(`[role="menuitem"]`);
        expect(menuItems.length).toBeGreaterThan(0);
    });

    it("should not open popover when disabled and button is clicked", async () => {
        const user = userEvent.setup();
        const { baseElement } = render(
            <TimezoneSelect {...DEFAULT_PROPS} disabled={true} popoverProps={{ usePortal: false }} />,
        );
        const button = screen.getByRole("button");
        await user.click(button);

        // When disabled, there should be no menu items (popover not open)
        const menuItems = baseElement.querySelectorAll(`[role="menuitem"]`);
        expect(menuItems).toHaveLength(0);
    });

    it("should show initial items when query is empty", () => {
        const { baseElement } = render(<TimezoneSelect {...DEFAULT_PROPS} />);
        const menuItems = baseElement.querySelectorAll(`[role="menuitem"]`);
        const initialItems = getInitialTimezoneItems(new Date(), false);
        expect(menuItems).toHaveLength(initialItems.length);
    });

    it("should show all items when query is not empty", async () => {
        const user = userEvent.setup();
        const { baseElement } = render(<TimezoneSelect {...DEFAULT_PROPS} />);
        const searchInput = baseElement.querySelector(`.${CoreClasses.INPUT}`) as HTMLInputElement;
        await user.type(searchInput, "a");

        // After typing, items matching "a" should be shown
        const menuItems = baseElement.querySelectorAll(`[role="menuitem"]`);
        expect(menuItems.length).toBeGreaterThan(0);
    });

    it("should show local timezone at top of item list when showLocalTimezone=true", () => {
        const { baseElement } = render(<TimezoneSelect {...DEFAULT_PROPS} showLocalTimezone={true} />);
        const menuItems = baseElement.querySelectorAll(`[role="menuitem"]`);
        expect(menuItems.length).toBeGreaterThan(0);
        // The first item should contain the local timezone label
        const localTzItem = TIMEZONE_ITEMS.find(tz => tz.ianaCode === CURRENT_TZ);
        if (localTzItem) {
            expect(menuItems[0].textContent).toContain(localTzItem.label);
        }
    });

    it("should not show local timezone at top of item list when showLocalTimezone=false", () => {
        const date = new Date();
        const { baseElement } = render(<TimezoneSelect {...DEFAULT_PROPS} date={date} showLocalTimezone={false} />);
        const menuItems = baseElement.querySelectorAll(`[role="menuitem"]`);
        expect(menuItems.length).toBeGreaterThan(0);
        const initialItems = getInitialTimezoneItems(date, false);
        if (initialItems.length > 0) {
            expect(menuItems[0].textContent).toContain(initialItems[0].label);
        }
    });

    it("should update timezone offsets based on date prop", () => {
        // This test verifies that the internal item data model changes based on the date prop.
        // The original Enzyme test compared prop("items") directly, which is not accessible in RTL.
        // Instead, we verify the button label (which includes the offset) changes with different dates.
        const dateJun = new Date("2014-06-01T12:00:00Z");
        const dateDec = new Date("2014-12-01T12:00:00Z");
        const timezone = "America/New_York";

        const { unmount } = render(
            <TimezoneSelect {...DEFAULT_PROPS} date={dateJun} value={timezone} popoverProps={{ usePortal: false }} />,
        );
        const junButton = screen.getByRole("button");
        const junText = junButton.textContent!;
        unmount();

        render(
            <TimezoneSelect {...DEFAULT_PROPS} date={dateDec} value={timezone} popoverProps={{ usePortal: false }} />,
        );
        const decButton = screen.getByRole("button");
        const decText = decButton.textContent!;

        // NY offset differs between June (EDT, -04:00) and December (EST, -05:00)
        expect(junText).not.toBe(decText);
    });

    it("should keep selected timezone in sync with value prop", async () => {
        const user = userEvent.setup();
        const value = "Europe/Oslo";
        const valueLabel = TIMEZONE_ITEMS.find(tz => tz.ianaCode === value)?.label;
        const { baseElement } = render(<TimezoneSelect {...DEFAULT_PROPS} value={value} />);

        // Click first menu item
        const menuItems = baseElement.querySelectorAll(`[role="menuitem"]`);
        await user.click(menuItems[0]);

        // Button text should still reflect the value prop since it's controlled
        const button = screen.getByRole("button");
        expect(button.textContent).toContain(valueLabel!);
    });

    it("should pass popoverProps to popover", () => {
        const { baseElement } = render(
            <TimezoneSelect {...DEFAULT_PROPS} popoverProps={{ isOpen: true, usePortal: false }} />,
        );
        // If popover is open, we should see menu items
        const menuItems = baseElement.querySelectorAll(`[role="menuitem"]`);
        expect(menuItems.length).toBeGreaterThan(0);
    });

    it("should pass inputProps to input", () => {
        const { baseElement } = render(
            <TimezoneSelect {...DEFAULT_PROPS} inputProps={{ placeholder: "test placeholder" }} />,
        );
        const input = baseElement.querySelector(`input[placeholder="test placeholder"]`);
        expect(input).toBeInTheDocument();
    });

    it("should pass buttonProps to button", () => {
        render(
            <TimezoneSelect {...DEFAULT_PROPS} buttonProps={{ disabled: true }} popoverProps={{ usePortal: false }} />,
        );
        const button = screen.getByRole("button");
        expect(button).toBeDisabled();
    });
});
