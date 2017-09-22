/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { assert } from "chai";
import { mount, shallow, ShallowWrapper } from "enzyme";
import * as moment from "moment-timezone";
import * as React from "react";

import {
    Button,
    IButtonProps,
    IInputGroupProps,
    IInputGroupState,
    InputGroup,
    IPopoverProps,
    IPopoverState,
    MenuItem,
    Popover,
} from "@blueprintjs/core";
import {
    getInitialTimezoneItems,
    getLocalTimezoneItem,
    getTimezoneItems,
    ITimezoneItem,
} from "../src/components/timezone-picker/timezoneItems";
import {
    IQueryListProps,
    IQueryListState,
    ISelectProps,
    ISelectState,
    ITimezonePickerProps,
    ITimezonePickerState,
    QueryList,
    Select,
    TimezoneDisplayFormat,
    TimezonePicker,
} from "../src/index";

type TimezonePickerShallowWrapper = ShallowWrapper<ITimezonePickerProps, ITimezonePickerState>;
type SelectShallowWrapper = ShallowWrapper<ISelectProps<ITimezoneItem>, ISelectState<ITimezoneItem>>;
type QueryListShallowWrapper = ShallowWrapper<IQueryListProps<ITimezoneItem>, IQueryListState<ITimezoneItem>>;
type PopoverShallowWrapper = ShallowWrapper<IPopoverProps, IPopoverState>;
type InputGroupShallowWrapper = ShallowWrapper<IInputGroupProps, IInputGroupState>;

describe("<TimezonePicker>", () => {
    it("clicking on button target opens popover", () => {
        const timezonePicker = mount(<TimezonePicker popoverProps={getPopoverProps({}, ["isOpen"])} />);
        timezonePicker.find(Button).simulate("click");
        assert.isTrue(timezonePicker.find(Popover).prop("isOpen"));
    });

    it("if disabled=true, clicking on button target does not open popover", () => {
        const timezonePicker = mount(
            <TimezonePicker disabled={true} popoverProps={getPopoverProps({ isOpen: false })} />,
        );
        timezonePicker.find(Button).simulate("click");
        assert.isFalse(timezonePicker.find(Popover).prop("isOpen"));
    });

    it("if placeholder is non-empty, the filter placeholder text is changed", () => {
        const placeholder = "test placeholder";
        const timezonePicker = shallow(
            <TimezonePicker inputProps={{ placeholder }} popoverProps={getPopoverProps()} />,
        );
        const inputGroup = findInputGroup(timezonePicker);
        assert.strictEqual(inputGroup.prop("placeholder"), placeholder);
    });

    it("shows initial items when the query is empty", () => {
        const date = new Date();
        const timezonePicker = shallow(<TimezonePicker date={date} popoverProps={getPopoverProps()} />);
        const items = findSelect(timezonePicker).prop("items");
        assert.deepEqual(items, getInitialTimezoneItems(date, true));
    });

    it("if inputProps.value is non-empty, all items are shown", () => {
        const date = new Date();
        const query = "test query";
        const timezonePicker = shallow(
            <TimezonePicker date={date} inputProps={{ value: query }} popoverProps={getPopoverProps()} />,
        );
        assert.strictEqual(timezonePicker.state("query"), query);
        const items = findSelect(timezonePicker).prop("items");
        assert.deepEqual(items, getTimezoneItems(date));
    });

    it("if inputProps.value is non-empty and it changes to a different non-empty value, the same items are shown", () => {
        let select: SelectShallowWrapper;
        let inputGroup: InputGroupShallowWrapper;

        const timezonePicker = shallow(<TimezonePicker popoverProps={getPopoverProps()} />);

        inputGroup = findInputGroup(timezonePicker);
        const query1 = "test query 1";
        inputGroup.simulate("change", { currentTarget: { value: query1 } });
        assert.strictEqual(timezonePicker.state("query"), query1);

        select = findSelect(timezonePicker);
        const items1 = select.prop("items");

        inputGroup = findInputGroup(timezonePicker);
        const query2 = "test query 2";
        inputGroup.simulate("change", { currentTarget: { value: query2 } });
        assert.strictEqual(timezonePicker.state("query"), query2);

        select = findSelect(timezonePicker);
        const items2 = select.prop("items");

        assert.strictEqual(items1, items2);
    });

    it("if showLocalTimezone=true, the local timezone is rendered at the top of the item list", () => {
        const timezonePicker = shallow(<TimezonePicker showLocalTimezone={true} popoverProps={getPopoverProps()} />);
        const items = findSelect(timezonePicker).prop("items");
        assert.isTrue(items.length > 0);
        const firstItem = items[0];
        assert.strictEqual(firstItem.timezone, moment.tz.guess());
    });

    it("if showLocalTimezone=false, the local timezone is not rendered at the top of the item list", () => {
        const date = new Date();
        const timezonePicker = shallow(
            <TimezonePicker date={date} showLocalTimezone={false} popoverProps={getPopoverProps()} />,
        );
        const items = findSelect(timezonePicker).prop("items");
        assert.isTrue(items.length > 0);
        const firstItem = items[0];
        const expectedFirstItem = getInitialTimezoneItems(date, false)[0];
        assert.deepEqual(firstItem, expectedFirstItem);
    });

    it("if inputProps.value is non-empty, the local timezone is not shown in the item list", () => {
        const date = new Date();
        const query = "test query";
        const timezonePicker = shallow(
            <TimezonePicker date={date} inputProps={{ value: query }} popoverProps={getPopoverProps()} />,
        );
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
            <TimezonePicker date={dateJun} showLocalTimezone={false} popoverProps={getPopoverProps()} />,
        );
        const timezonePickerDec = shallow(
            <TimezonePicker date={dateDec} showLocalTimezone={false} popoverProps={getPopoverProps()} />,
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
        const onChange = sinon.spy();
        const timezonePicker = shallow(<TimezonePicker onChange={onChange} popoverProps={getPopoverProps()} />);
        clickFirstMenuItem(timezonePicker);
        assert.isTrue(onChange.calledOnce);
    });

    describe("when uncontrolled", () => {
        it("if defaultValue is non-empty, a timezone will be initially selected", () => {
            const defaultValue = "Africa/Accra";
            const timezonePicker = shallow(
                <TimezonePicker defaultValue={defaultValue} valueDisplayFormat={TimezoneDisplayFormat.NAME} />,
            );
            assert.strictEqual(timezonePicker.find(Button).prop("text"), defaultValue);
        });
    });

    describe("when controlled", () => {
        it("if value is non-empty, the selected timezone will stay in sync with that value", () => {
            const onChange = sinon.spy();
            const value = "Europe/Bratislava";
            const timezonePicker = shallow(
                <TimezonePicker value={value} onChange={onChange} valueDisplayFormat={TimezoneDisplayFormat.NAME} />,
            );
            clickFirstMenuItem(timezonePicker);
            assert.isTrue(onChange.calledOnce);
            assert.strictEqual(timezonePicker.find(Button).prop("text"), value);
        });

        it("if both value and defaultValue are non-empty, value will take precedence over defaultValue", () => {
            const value = "Europe/Bratislava";
            const defaultValue = "America/Los_Angeles";
            const timezonePicker = shallow(
                <TimezonePicker
                    value={value}
                    defaultValue={defaultValue}
                    valueDisplayFormat={TimezoneDisplayFormat.NAME}
                />,
            );
            assert.strictEqual(timezonePicker.find(Button).prop("text"), value);
        });
    });

    it("invokes the onChange input prop", () => {
        const query = "test query";
        const onInputChange = sinon.spy();
        const timezonePicker = shallow(
            <TimezonePicker inputProps={{ onChange: onInputChange }} popoverProps={getPopoverProps()} />,
        );
        const inputGroup = findInputGroup(timezonePicker);
        inputGroup.simulate("change", { currentTarget: { value: query } });
        assert.isTrue(onInputChange.calledOnce);
    });

    it("popover can be controlled with popover props", () => {
        const popoverProps: IPopoverProps = {
            inline: true,
            isOpen: true,
            tetherOptions: { constraints: [{ attachment: "together", pin: true, to: "window" }] },
            useSmartArrowPositioning: true,
        };
        const timezonePicker = shallow(<TimezonePicker popoverProps={popoverProps} />);
        const popover = findPopover(timezonePicker);
        for (const key of Object.keys(popoverProps)) {
            assert.deepEqual(popover.prop(key), popoverProps[key as keyof IPopoverProps]);
        }
    });

    it("input can be controlled with input props", () => {
        const inputProps: IInputGroupProps = {
            disabled: true,
            leftIconName: "airplane",
            placeholder: "test placeholder",
        };
        const timezonePicker = shallow(<TimezonePicker inputProps={inputProps} />);
        const inputGroup = findInputGroup(timezonePicker);
        for (const key of Object.keys(inputProps)) {
            assert.deepEqual(inputGroup.prop(key), inputProps[key as keyof IInputGroupProps]);
        }
    });

    it("button can be controlled with button props", () => {
        const buttonProps: IButtonProps = {
            disabled: true,
            rightIconName: "airplane",
        };
        const timezonePicker = shallow(<TimezonePicker buttonProps={buttonProps} />);
        const button = timezonePicker.find(Button);
        for (const key of Object.keys(buttonProps)) {
            assert.deepEqual(button.prop(key), buttonProps[key as keyof IButtonProps]);
        }
    });

    function getPopoverProps(
        overrides: Partial<IPopoverProps> = {},
        keysToUnset: Array<keyof IPopoverProps> = [],
    ): Partial<IPopoverProps> {
        const popoverProps: Partial<IPopoverProps> = {
            inline: true,
            isOpen: true,
            ...overrides,
        };

        for (const key of keysToUnset) {
            delete popoverProps[key];
        }

        return popoverProps;
    }

    function findSelect(timezonePicker: TimezonePickerShallowWrapper): SelectShallowWrapper {
        return timezonePicker.find(Select);
    }

    function findQueryList(timezonePicker: TimezonePickerShallowWrapper): QueryListShallowWrapper {
        return findSelect(timezonePicker)
            .shallow()
            .find(QueryList);
    }

    function findPopover(timezonePicker: TimezonePickerShallowWrapper): PopoverShallowWrapper {
        return findQueryList(timezonePicker)
            .shallow()
            .find(Popover);
    }

    function findInputGroup(timezonePicker: TimezonePickerShallowWrapper): InputGroupShallowWrapper {
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
