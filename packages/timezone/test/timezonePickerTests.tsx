/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { assert } from "chai";
import { mount, shallow, ShallowWrapper } from "enzyme";
import * as moment from "moment-timezone";
import * as React from "react";
import * as sinon from "sinon";

import {
    Button,
    IButtonProps,
    IInputGroupProps,
    InputGroup,
    IPopoverProps,
    MenuItem,
    Popover,
    Position,
} from "@blueprintjs/core";
import { IQueryListProps, ISelectProps, QueryList, Select } from "@blueprintjs/select";
import {
    getInitialTimezoneItems,
    getLocalTimezoneItem,
    getTimezoneItems,
    ITimezoneItem,
} from "../src/components/timezone-picker/timezoneItems";
import { ITimezonePickerProps, ITimezonePickerState, TimezoneDisplayFormat, TimezonePicker } from "../src/index";

type TimezonePickerShallowWrapper = ShallowWrapper<ITimezonePickerProps, ITimezonePickerState>;

const VALUE = "America/Los_Angeles";

describe("<TimezonePicker>", () => {
    const onChange = sinon.spy();
    const DEFAULT_PROPS: ITimezonePickerProps = {
        onChange,
        popoverProps: {
            isOpen: true,
            usePortal: false,
        },
        value: VALUE,
    };

    afterEach(() => onChange.resetHistory());

    it("clicking on button target opens popover", () => {
        // remove isOpen from popoverProps so it's
        const timezonePicker = mount(<TimezonePicker {...DEFAULT_PROPS} popoverProps={{ usePortal: false }} />);
        timezonePicker.find(Button).simulate("click");
        assert.isTrue(timezonePicker.find(Popover).prop("isOpen"));
    });

    it("if disabled=true, clicking on button target does not open popover", () => {
        const timezonePicker = mount(
            <TimezonePicker {...DEFAULT_PROPS} disabled={true} popoverProps={{ usePortal: false }} />,
        );
        timezonePicker.find(Button).simulate("click");
        assert.isFalse(timezonePicker.find(Popover).prop("isOpen"));
    });

    it("if query is empty, shows initial items", () => {
        const timezonePicker = shallow(<TimezonePicker {...DEFAULT_PROPS} />);
        const items = findSelect(timezonePicker).prop("items");
        assert.deepEqual(items, getInitialTimezoneItems(new Date(), true));
    });

    it("if query is not empty, shows all items", () => {
        const timezonePicker = shallow(<TimezonePicker {...DEFAULT_PROPS} />);
        timezonePicker.setState({ query: "not empty" });
        const items = timezonePicker.find(Select).prop("items");
        assert.lengthOf(items, getTimezoneItems(new Date()).length);
    });

    it("if inputProps.value is non-empty, all items are shown", () => {
        const date = new Date();
        const query = "test query";
        const timezonePicker = shallow(<TimezonePicker {...DEFAULT_PROPS} date={date} inputProps={{ value: query }} />);
        assert.strictEqual(timezonePicker.state("query"), query);
        const items = findSelect(timezonePicker).prop("items");
        assert.deepEqual(items, getTimezoneItems(date));
    });

    it("if inputProps.value is non-empty and it changes to a different non-empty value, the same items are shown", () => {
        const timezonePicker = shallow(<TimezonePicker {...DEFAULT_PROPS} />);

        const query1 = "test query 1";
        findInputGroup(timezonePicker).simulate("change", { target: { value: query1 } });
        assert.strictEqual(timezonePicker.state("query"), query1);
        const items1 = findSelect(timezonePicker).prop("items");

        const query2 = "test query 2";
        findInputGroup(timezonePicker).simulate("change", { target: { value: query2 } });
        assert.strictEqual(timezonePicker.state("query"), query2);
        const items2 = findSelect(timezonePicker).prop("items");

        assert.strictEqual(items1, items2);
    });

    it("if showLocalTimezone=true, the local timezone is rendered at the top of the item list", () => {
        const timezonePicker = shallow(<TimezonePicker {...DEFAULT_PROPS} showLocalTimezone={true} />);
        const items = findSelect(timezonePicker).prop("items");
        assert.isTrue(items.length > 0);
        const firstItem = items[0];
        assert.strictEqual(firstItem.timezone, moment.tz.guess());
    });

    it("if showLocalTimezone=false, the local timezone is not rendered at the top of the item list", () => {
        const date = new Date();
        const timezonePicker = shallow(<TimezonePicker {...DEFAULT_PROPS} date={date} showLocalTimezone={false} />);
        const items = findSelect(timezonePicker).prop("items");
        assert.isTrue(items.length > 0);
        const expectedFirstItem = getInitialTimezoneItems(date, false)[0];
        assert.deepEqual(items[0], expectedFirstItem);
    });

    it("if inputProps.value is non-empty, the local timezone is not shown in the item list", () => {
        const date = new Date();
        const query = "test query";
        const timezonePicker = shallow(<TimezonePicker {...DEFAULT_PROPS} date={date} inputProps={{ value: query }} />);
        const items = findSelect(timezonePicker).prop("items");
        const localTimezoneItem = getLocalTimezoneItem(date);
        const itemsWithLocalTimezone = items.filter(item => item.timezone === localTimezoneItem.timezone);
        for (const item of itemsWithLocalTimezone) {
            assert.notDeepEqual(item, localTimezoneItem);
        }
    });

    it("if date is non-empty, the timezone offsets will correspond to that date", () => {
        const dateJun = new Date("2014-06-01T12:00:00Z");
        const dateDec = new Date("2014-12-01T12:00:00Z");
        const timezone = "America/Los_Angeles";
        const timezonePickerJun = shallow(
            <TimezonePicker {...DEFAULT_PROPS} date={dateJun} showLocalTimezone={false} />,
        );
        const timezonePickerDec = shallow(
            <TimezonePicker {...DEFAULT_PROPS} date={dateDec} showLocalTimezone={false} />,
        );
        const selectJun = findSelect(timezonePickerJun);
        const selectDec = findSelect(timezonePickerDec);
        const itemsJun = selectJun.prop("items");
        const itemsDec = selectDec.prop("items");
        const timezoneItemJun = itemsJun.filter(item => item.timezone === timezone)[0];
        const timezoneItemDec = itemsDec.filter(item => item.timezone === timezone)[0];
        assert.notDeepEqual(timezoneItemJun, timezoneItemDec);
    });

    it("invokes the on change prop when a timezone is selected", () => {
        const timezonePicker = shallow(<TimezonePicker {...DEFAULT_PROPS} />);
        clickFirstMenuItem(timezonePicker);
        assert.isTrue(onChange.calledOnce);
    });

    it("if value is non-empty, the selected timezone will stay in sync with that value", () => {
        const value = "Europe/Bratislava";
        const timezonePicker = shallow(
            <TimezonePicker value={value} onChange={onChange} valueDisplayFormat={TimezoneDisplayFormat.NAME} />,
        );
        clickFirstMenuItem(timezonePicker);
        assert.isTrue(onChange.calledOnce);
        assert.strictEqual(timezonePicker.find(Button).prop("text"), value);
    });

    it("popover can be controlled with popover props", () => {
        const popoverProps: IPopoverProps = {
            isOpen: true,
            position: Position.RIGHT,
            usePortal: false,
        };
        const timezonePicker = shallow(<TimezonePicker {...DEFAULT_PROPS} popoverProps={popoverProps} />);
        const popover = findPopover(timezonePicker);
        for (const key of Object.keys(popoverProps)) {
            assert.deepEqual(popover.prop(key), popoverProps[key as keyof IPopoverProps]);
        }
    });

    it("input can be controlled with input props", () => {
        const inputProps: IInputGroupProps = {
            disabled: true,
            leftIcon: "airplane",
            placeholder: "test placeholder",
        };
        const timezonePicker = shallow(<TimezonePicker {...DEFAULT_PROPS} inputProps={inputProps} />);
        const inputGroup = findInputGroup(timezonePicker);
        for (const key of Object.keys(inputProps)) {
            assert.deepEqual(inputGroup.prop(key), inputProps[key as keyof IInputGroupProps]);
        }
    });

    it("button can be controlled with button props", () => {
        const buttonProps: IButtonProps = {
            disabled: true,
            rightIcon: "airplane",
        };
        const timezonePicker = shallow(<TimezonePicker {...DEFAULT_PROPS} buttonProps={buttonProps} />);
        const button = timezonePicker.find(Button);
        for (const key of Object.keys(buttonProps)) {
            assert.deepEqual(button.prop(key), buttonProps[key as keyof IButtonProps]);
        }
    });

    function findSelect(timezonePicker: TimezonePickerShallowWrapper) {
        return timezonePicker.find<ISelectProps<ITimezoneItem>>(Select);
    }

    function findQueryList(timezonePicker: TimezonePickerShallowWrapper) {
        return findSelect(timezonePicker)
            .shallow()
            .find<IQueryListProps<ITimezoneItem>>(QueryList);
    }

    function findPopover(timezonePicker: TimezonePickerShallowWrapper) {
        return findQueryList(timezonePicker)
            .shallow()
            .find(Popover);
    }

    function findInputGroup(timezonePicker: TimezonePickerShallowWrapper) {
        return findQueryList(timezonePicker)
            .shallow()
            .find(InputGroup);
    }

    function clickFirstMenuItem(timezonePicker: TimezonePickerShallowWrapper): void {
        findQueryList(timezonePicker)
            .shallow()
            .find(MenuItem)
            .first()
            .simulate("click");
    }
});
