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

import { mount, type ReactWrapper } from "enzyme";
import { act } from "react";

import {
    Button,
    type ButtonProps,
    InputGroup,
    type InputGroupProps,
    MenuItem,
    PopoverNext,
    type PopoverProps,
} from "@blueprintjs/core";
import { QueryList, Select } from "@blueprintjs/select";
import { afterEach, describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { TimezoneSelect, type TimezoneSelectProps } from "../..";
import { getCurrentTimezone } from "../../common/getTimezone";
import { TIMEZONE_ITEMS } from "../../common/timezoneItems";
import { getInitialTimezoneItems, mapTimezonesWithNames } from "../../common/timezoneNameUtils";
import type { TimezoneWithNames } from "../../common/timezoneTypes";

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

    it("should open popover when clicking on button target", () => {
        // remove isOpen from popoverProps
        const timezoneSelect = mountTS({ popoverProps: { usePortal: false } });
        timezoneSelect.find(Button).simulate("click");

        expect(timezoneSelect.find(PopoverNext).prop("isOpen")).toBe(true);
    });

    it("should not open popover when clicking on button target if disabled=true", () => {
        const timezoneSelect = mountTS({ disabled: true, popoverProps: { usePortal: false } });
        timezoneSelect.find(Button).simulate("click");
        expect(timezoneSelect.find(PopoverNext).prop("isOpen")).toBe(false);
    });

    it("should show initial items if query is empty", () => {
        const timezoneSelect = mountTS();
        const items = findSelect(timezoneSelect).prop("items");
        expect(items).toEqual(getInitialTimezoneItems(new Date(), false));
    });

    it("should show all items if query is not empty", () => {
        const timezoneSelect = mountTS();
        act(() => {
            timezoneSelect.setState({ query: "not empty" });
        });
        timezoneSelect.update();
        const items = timezoneSelect.find(Select).prop("items");
        expect(items).toHaveLength(TIMEZONE_ITEMS.length);
    });

    it("should show all items if inputProps.value is non-empty", () => {
        const date = new Date();
        const query = "test query";
        const timezoneSelect = mountTS({ date, inputProps: { value: query } });
        expect(timezoneSelect.state("query")).toBe(query);
        const items = findSelect(timezoneSelect).prop("items");
        expect(items).toEqual(mapTimezonesWithNames(date, TIMEZONE_ITEMS));
    });

    it("should render the local timezone at the top of the item list if showLocalTimezone=true", () => {
        const timezoneSelect = mountTS({ showLocalTimezone: true });
        const items = findSelect(timezoneSelect).prop("items");
        expect(items.length).toBeGreaterThan(0);
        const firstItem = items[0];
        expect(firstItem.ianaCode).toBe(CURRENT_TZ);
    });

    it("should not render the local timezone at the top of the item list if showLocalTimezone=false", () => {
        const date = new Date();
        const timezoneSelect = mountTS({ date, showLocalTimezone: false });
        const items = findSelect(timezoneSelect).prop("items");
        expect(items.length).toBeGreaterThan(0);
        const expectedFirstItem = getInitialTimezoneItems(date, false)[0];
        expect(items[0]).toEqual(expectedFirstItem);
    });

    it("should show timezone offsets corresponding to the date when date is non-empty", () => {
        const dateJun = new Date("2014-06-01T12:00:00Z");
        const dateDec = new Date("2014-12-01T12:00:00Z");
        const timezone = "America/Los_Angeles";
        const timezoneSelectJun = mountTS({ date: dateJun, showLocalTimezone: false });
        const timezoneSelectDec = mountTS({ date: dateDec, showLocalTimezone: false });
        const selectJun = findSelect(timezoneSelectJun);
        const selectDec = findSelect(timezoneSelectDec);
        const itemsJun = selectJun.prop("items");
        const itemsDec = selectDec.prop("items");
        const timezoneItemJun = itemsJun.filter(item => item.ianaCode === timezone)[0];
        const timezoneItemDec = itemsDec.filter(item => item.ianaCode === timezone)[0];
        expect(timezoneItemJun).not.toEqual(timezoneItemDec);
    });

    // HACKHACK: see https://github.com/palantir/blueprint/issues/5364
    it.skip("invokes onChange callback when a timezone is selected", () => {
        const timezoneSelect = mountTS();
        clickFirstMenuItem(timezoneSelect);
        expect(onChange).toHaveBeenCalledOnce();
    });

    it("should keep the selected timezone in sync with value when value is non-empty", () => {
        const value = "Europe/Oslo";
        const valueLabel = TIMEZONE_ITEMS.find(tz => tz.ianaCode === value)?.label;
        const timezoneSelect = mountTS({ onChange, value });
        clickFirstMenuItem(timezoneSelect);
        const buttonText = timezoneSelect.find(Button).prop("text")?.toString();
        expect(buttonText).toContain(valueLabel!);
    });

    it("should control popover with popover props", () => {
        const popoverProps: PopoverProps = {
            isOpen: true,
            usePortal: false,
        };
        const timezoneSelect = mountTS({ popoverProps });
        const popover = findPopover(timezoneSelect);
        for (const key of Object.keys(popoverProps)) {
            expect(popover.prop(key)).toEqual(popoverProps[key as keyof PopoverProps]);
        }
    });

    it("should control input with input props", () => {
        const inputProps: InputGroupProps = {
            disabled: true,
            leftIcon: "airplane",
            placeholder: "test placeholder",
        };
        const timezoneSelect = mountTS({ inputProps });
        const inputGroup = findInputGroup(timezoneSelect);
        for (const key of Object.keys(inputProps)) {
            expect(inputGroup.prop(key)).toEqual(inputProps[key as keyof InputGroupProps]);
        }
    });

    it("should control button with button props", () => {
        const buttonProps: ButtonProps = {
            disabled: true,
            endIcon: "airplane",
        };
        const timezoneSelect = mountTS({ buttonProps });
        const button = timezoneSelect.find(Button);
        for (const key of Object.keys(buttonProps)) {
            expect(button.prop(key)).toEqual(buttonProps[key as keyof ButtonProps]);
        }
    });

    function mountTS(props: Partial<TimezoneSelectProps> = {}): ReactWrapper<TimezoneSelect> {
        return mount(<TimezoneSelect {...DEFAULT_PROPS} {...props} />);
    }

    function findSelect(timezoneSelect: ReactWrapper<TimezoneSelect>) {
        return timezoneSelect.find<Select<TimezoneWithNames>>(Select);
    }

    function findQueryList(timezoneSelect: ReactWrapper<TimezoneSelect>) {
        return findSelect(timezoneSelect).find<QueryList<TimezoneWithNames>>(QueryList);
    }

    function findPopover(timezoneSelect: ReactWrapper<TimezoneSelect>) {
        return findQueryList(timezoneSelect).find(PopoverNext);
    }

    function findInputGroup(timezoneSelect: ReactWrapper<TimezoneSelect>) {
        return findQueryList(timezoneSelect).find(InputGroup);
    }

    function clickFirstMenuItem(timezoneSelect: ReactWrapper<TimezoneSelect>): void {
        findSelect(timezoneSelect).find(MenuItem).first().simulate("click");
    }
});
