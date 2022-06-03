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
import { mount, ShallowRendererProps, ShallowWrapper, shallow as untypedShallow } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";

import { Button, ButtonProps, InputGroup, InputGroupProps2, MenuItem } from "@blueprintjs/core";
import { Popover2, Popover2Props } from "@blueprintjs/popover2";
import { QueryList, Select2 } from "@blueprintjs/select";

import { TIMEZONE_ITEMS } from "../../src/common/timezoneItems";
import { getInitialTimezoneItems, mapTimezonesWithNames, TimezoneWithNames } from "../../src/common/timezoneNameUtils";
import {
    ITimezonePicker2State,
    TimezonePicker2,
    TimezonePicker2Props,
} from "../../src/components/timezone-picker/timezonePicker2";

type TimezonePickerShallowWrapper = ShallowWrapper<TimezonePicker2Props, ITimezonePicker2State>;

/**
 * @see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/26979#issuecomment-465304376
 */
const shallow = (
    el: React.ReactElement<TimezonePicker2Props>,
    options?: ShallowRendererProps,
): TimezonePickerShallowWrapper => untypedShallow<TimezonePicker2>(el, options);

const VALUE = "America/Los_Angeles";

describe("<TimezonePicker2>", () => {
    const onChange = sinon.spy();
    const DEFAULT_PROPS: TimezonePicker2Props = {
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
        const timezonePicker = mount(<TimezonePicker2 {...DEFAULT_PROPS} popoverProps={{ usePortal: false }} />);
        timezonePicker.find(Button).simulate("click");

        /* eslint-disable-next-line deprecation/deprecation */
        assert.isTrue(timezonePicker.find(Popover2).prop("isOpen"));
    });

    it("if disabled=true, clicking on button target does not open popover", () => {
        const timezonePicker = mount(
            <TimezonePicker2 {...DEFAULT_PROPS} disabled={true} popoverProps={{ usePortal: false }} />,
        );
        timezonePicker.find(Button).simulate("click");
        /* eslint-disable-next-line deprecation/deprecation */
        assert.isFalse(timezonePicker.find(Popover2).prop("isOpen"));
    });

    it("if query is empty, shows initial items", () => {
        const timezonePicker = shallow(<TimezonePicker2 {...DEFAULT_PROPS} />);
        const items = findSelect(timezonePicker).prop("items");
        assert.deepEqual(items, getInitialTimezoneItems(new Date(), true));
    });

    it("if query is not empty, shows all items", () => {
        const timezonePicker = shallow(<TimezonePicker2 {...DEFAULT_PROPS} />);
        timezonePicker.setState({ query: "not empty" });
        timezonePicker.update();
        const items = timezonePicker.find(Select2).prop("items");
        assert.lengthOf(items, TIMEZONE_ITEMS.length);
    });

    it("if inputProps.value is non-empty, all items are shown", () => {
        const date = new Date();
        const query = "test query";
        const timezonePicker = shallow(
            <TimezonePicker2 {...DEFAULT_PROPS} date={date} inputProps={{ value: query }} />,
        );
        assert.strictEqual(timezonePicker.state("query"), query);
        const items = findSelect(timezonePicker).prop("items");
        assert.deepEqual(items, mapTimezonesWithNames(date, TIMEZONE_ITEMS));
    });

    it("if showLocalTimezone=true, the local timezone is rendered at the top of the item list", () => {
        const timezonePicker = shallow(<TimezonePicker2 {...DEFAULT_PROPS} showLocalTimezone={true} />);
        const items = findSelect(timezonePicker).prop("items");
        assert.isTrue(items.length > 0);
        const firstItem = items[0];
        assert.strictEqual(firstItem.ianaCode, "Etc/UTC");
    });

    it("if showLocalTimezone=false, the local timezone is not rendered at the top of the item list", () => {
        const date = new Date();
        const timezonePicker = shallow(<TimezonePicker2 {...DEFAULT_PROPS} date={date} showLocalTimezone={false} />);
        const items = findSelect(timezonePicker).prop("items");
        assert.isTrue(items.length > 0);
        const expectedFirstItem = getInitialTimezoneItems(date, false)[0];
        assert.deepEqual(items[0], expectedFirstItem);
    });

    it("if date is non-empty, the timezone offsets will correspond to that date", () => {
        const dateJun = new Date("2014-06-01T12:00:00Z");
        const dateDec = new Date("2014-12-01T12:00:00Z");
        const timezone = "America/Los_Angeles";
        const timezonePickerJun = shallow(
            <TimezonePicker2 {...DEFAULT_PROPS} date={dateJun} showLocalTimezone={false} />,
        );
        const timezonePickerDec = shallow(
            <TimezonePicker2 {...DEFAULT_PROPS} date={dateDec} showLocalTimezone={false} />,
        );
        const selectJun = findSelect(timezonePickerJun);
        const selectDec = findSelect(timezonePickerDec);
        const itemsJun = selectJun.prop("items");
        const itemsDec = selectDec.prop("items");
        const timezoneItemJun = itemsJun.filter(item => item.ianaCode === timezone)[0];
        const timezoneItemDec = itemsDec.filter(item => item.ianaCode === timezone)[0];
        assert.notDeepEqual(timezoneItemJun, timezoneItemDec);
    });

    it("invokes the on change prop when a timezone is selected", () => {
        const timezonePicker = shallow(<TimezonePicker2 {...DEFAULT_PROPS} />);
        clickFirstMenuItem(timezonePicker);
        assert.isTrue(onChange.calledOnce);
    });

    it("if value is non-empty, the selected timezone will stay in sync with that value", () => {
        const value = "Europe/Oslo";
        const valueLabel = TIMEZONE_ITEMS.find(tz => tz.ianaCode === value)?.label;
        const timezonePicker = shallow(<TimezonePicker2 value={value} onChange={onChange} />);
        clickFirstMenuItem(timezonePicker);
        assert.isTrue(onChange.calledOnce);
        assert.strictEqual(timezonePicker.find(Button).prop("text"), valueLabel);
    });

    it("popover can be controlled with popover props", () => {
        const popoverProps: Popover2Props = {
            isOpen: true,
            usePortal: false,
        };
        const timezonePicker = shallow(<TimezonePicker2 {...DEFAULT_PROPS} popoverProps={popoverProps} />);
        const popover = findPopover2(timezonePicker);
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
        const timezonePicker = shallow(<TimezonePicker2 {...DEFAULT_PROPS} inputProps={inputProps} />);
        const inputGroup = findInputGroup(timezonePicker);
        for (const key of Object.keys(inputProps)) {
            assert.deepEqual(inputGroup.prop(key), inputProps[key as keyof InputGroupProps2]);
        }
    });

    it("button can be controlled with button props", () => {
        const buttonProps: ButtonProps = {
            disabled: true,
            rightIcon: "airplane",
        };
        const timezonePicker = shallow(<TimezonePicker2 {...DEFAULT_PROPS} buttonProps={buttonProps} />);
        const button = timezonePicker.find(Button);
        for (const key of Object.keys(buttonProps)) {
            assert.deepEqual(button.prop(key), buttonProps[key as keyof ButtonProps]);
        }
    });

    function findSelect(timezonePicker: TimezonePickerShallowWrapper) {
        return timezonePicker.find(Select2.ofType<TimezoneWithNames>());
    }

    function findQueryList(timezonePicker: TimezonePickerShallowWrapper) {
        return findSelect(timezonePicker).shallow().find(QueryList.ofType<TimezoneWithNames>());
    }

    function findPopover2(timezonePicker: TimezonePickerShallowWrapper) {
        /* eslint-disable-next-line deprecation/deprecation */
        return findQueryList(timezonePicker).shallow().find(Popover2);
    }

    function findInputGroup(timezonePicker: TimezonePickerShallowWrapper) {
        return findQueryList(timezonePicker).shallow().find(InputGroup);
    }

    function clickFirstMenuItem(timezonePicker: TimezonePickerShallowWrapper): void {
        findQueryList(timezonePicker).shallow().find(MenuItem).first().simulate("click");
    }
});
