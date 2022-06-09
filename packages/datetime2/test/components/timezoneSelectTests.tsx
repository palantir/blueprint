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
import { mount, ReactWrapper } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";

import { Button, ButtonProps, InputGroup, InputGroupProps2, MenuItem } from "@blueprintjs/core";
import { Popover2, Popover2Props } from "@blueprintjs/popover2";
import { QueryList, Select2 } from "@blueprintjs/select";

import { TimezoneSelect, TimezoneSelectProps } from "../../src";
import { TIMEZONE_ITEMS } from "../../src/common/timezoneItems";
import { getInitialTimezoneItems, mapTimezonesWithNames, TimezoneWithNames } from "../../src/common/timezoneNameUtils";

const VALUE = "America/Los_Angeles";

describe("<TimezoneSelect>", () => {
    const onChange = sinon.spy();
    const DEFAULT_PROPS: TimezoneSelectProps = {
        onChange,
        popoverProps: {
            isOpen: true,
            usePortal: false,
        },
        value: VALUE,
    };

    afterEach(() => onChange.resetHistory());

    it("clicking on button target opens popover", () => {
        // remove isOpen from popoverProps
        const timezoneSelect = mountTS({ popoverProps: { usePortal: false } });
        timezoneSelect.find(Button).simulate("click");

        assert.isTrue(timezoneSelect.find(Popover2).prop("isOpen"));
    });

    it("if disabled=true, clicking on button target does not open popover", () => {
        const timezoneSelect = mountTS({ disabled: true, popoverProps: { usePortal: false } });
        timezoneSelect.find(Button).simulate("click");
        assert.isFalse(timezoneSelect.find(Popover2).prop("isOpen"));
    });

    it("if query is empty, shows initial items", () => {
        const timezoneSelect = mountTS();
        const items = findSelect(timezoneSelect).prop("items");
        assert.deepEqual(items, getInitialTimezoneItems(new Date(), true));
    });

    it("if query is not empty, shows all items", () => {
        const timezoneSelect = mountTS();
        timezoneSelect.setState({ query: "not empty" });
        timezoneSelect.update();
        const items = timezoneSelect.find(Select2).prop("items");
        assert.lengthOf(items, TIMEZONE_ITEMS.length);
    });

    it("if inputProps.value is non-empty, all items are shown", () => {
        const date = new Date();
        const query = "test query";
        const timezoneSelect = mountTS({ date, inputProps: { value: query } });
        assert.strictEqual(timezoneSelect.state("query"), query);
        const items = findSelect(timezoneSelect).prop("items");
        assert.deepEqual(items, mapTimezonesWithNames(date, TIMEZONE_ITEMS));
    });

    it("if showLocalTimezone=true, the local timezone is rendered at the top of the item list", () => {
        const timezoneSelect = mountTS({ showLocalTimezone: true });
        const items = findSelect(timezoneSelect).prop("items");
        assert.isTrue(items.length > 0);
        const firstItem = items[0];
        assert.strictEqual(firstItem.ianaCode, "Etc/UTC");
    });

    it("if showLocalTimezone=false, the local timezone is not rendered at the top of the item list", () => {
        const date = new Date();
        const timezoneSelect = mountTS({ date, showLocalTimezone: false });
        const items = findSelect(timezoneSelect).prop("items");
        assert.isTrue(items.length > 0);
        const expectedFirstItem = getInitialTimezoneItems(date, false)[0];
        assert.deepEqual(items[0], expectedFirstItem);
    });

    it("if date is non-empty, the timezone offsets will correspond to that date", () => {
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
        assert.notDeepEqual(timezoneItemJun, timezoneItemDec);
    });

    // HACKHACK: see https://github.com/palantir/blueprint/issues/5364
    it.skip("invokes onChange callback when a timezone is selected", () => {
        const timezoneSelect = mountTS();
        clickFirstMenuItem(timezoneSelect);
        assert.isTrue(onChange.calledOnce);
    });

    it("if value is non-empty, the selected timezone will stay in sync with that value", () => {
        const value = "Europe/Oslo";
        const valueLabel = TIMEZONE_ITEMS.find(tz => tz.ianaCode === value)?.label;
        const timezoneSelect = mountTS({ value, onChange });
        clickFirstMenuItem(timezoneSelect);
        const buttonText = timezoneSelect.find(Button).prop("text")?.toString();
        assert.isTrue(buttonText?.includes(valueLabel!), `Expected '${buttonText}' to contain '${valueLabel}'`);
    });

    it("popover can be controlled with popover props", () => {
        const popoverProps: Popover2Props = {
            isOpen: true,
            usePortal: false,
        };
        const timezoneSelect = mountTS({ popoverProps });
        const popover = findPopover(timezoneSelect);
        for (const key of Object.keys(popoverProps)) {
            assert.deepEqual(popover.prop(key), popoverProps[key as keyof Popover2Props]);
        }
    });

    it("input can be controlled with input props", () => {
        const inputProps: InputGroupProps2 = {
            disabled: true,
            leftIcon: "airplane",
            placeholder: "test placeholder",
        };
        const timezoneSelect = mountTS({ inputProps });
        const inputGroup = findInputGroup(timezoneSelect);
        for (const key of Object.keys(inputProps)) {
            assert.deepEqual(inputGroup.prop(key), inputProps[key as keyof InputGroupProps2]);
        }
    });

    it("button can be controlled with button props", () => {
        const buttonProps: ButtonProps = {
            disabled: true,
            rightIcon: "airplane",
        };
        const timezoneSelect = mountTS({ buttonProps });
        const button = timezoneSelect.find(Button);
        for (const key of Object.keys(buttonProps)) {
            assert.deepEqual(button.prop(key), buttonProps[key as keyof ButtonProps]);
        }
    });

    function mountTS(props: Partial<TimezoneSelectProps> = {}): ReactWrapper<TimezoneSelect> {
        return mount(<TimezoneSelect {...DEFAULT_PROPS} {...props} />);
    }

    function findSelect(timezoneSelect: ReactWrapper<TimezoneSelect>) {
        return timezoneSelect.find(Select2.ofType<TimezoneWithNames>());
    }

    function findQueryList(timezoneSelect: ReactWrapper<TimezoneSelect>) {
        return findSelect(timezoneSelect).find(QueryList.ofType<TimezoneWithNames>());
    }

    function findPopover(timezoneSelect: ReactWrapper<TimezoneSelect>) {
        return findQueryList(timezoneSelect).find(Popover2);
    }

    function findInputGroup(timezoneSelect: ReactWrapper<TimezoneSelect>) {
        return findQueryList(timezoneSelect).find(InputGroup);
    }

    function clickFirstMenuItem(timezoneSelect: ReactWrapper<TimezoneSelect>): void {
        findSelect(timezoneSelect).find(MenuItem).first().simulate("click");
    }
});
