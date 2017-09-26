/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { assert } from "chai";
import { mount } from "enzyme";
import * as React from "react";

import { IOptionProps, Radio, RadioGroup } from "../../src/index";

describe("RadioGroup", () => {
    const emptyHandler = () => {
        return;
    };

    it("nothing is selected by default", () => {
        const group = mount(
            <RadioGroup onChange={emptyHandler}>
                <Radio value="one" label="One" />
                <Radio value="two" label="Two" />
            </RadioGroup>,
        );
        assert.lengthOf(group.find({ checked: true }), 0);
    });

    it("selectedValue checks that value", () => {
        const group = mount(
            <RadioGroup onChange={emptyHandler} selectedValue="two">
                <Radio value="one" label="One" />
                <Radio value="two" label="Two" />
            </RadioGroup>,
        );
        assert.isTrue(group.find({ checked: true }).is({ value: "two" }));
    });

    it("invokes onChange handler when a radio is clicked", () => {
        const changeSpy = sinon.spy();
        const group = mount(
            <RadioGroup onChange={changeSpy}>
                <Radio value="one" label="One" />
                <Radio value="two" label="Two" />
            </RadioGroup>,
        );
        group.find({ value: "one" }).simulate("change");
        group.find({ value: "two" }).simulate("change");
        assert.isTrue(changeSpy.calledTwice);
    });

    it("renders options as radio buttons", () => {
        const OPTIONS: IOptionProps[] = [
            { label: "A", value: "a" },
            { label: "B", value: "b" },
            { disabled: true, label: "C", value: "c" },
        ];
        const group = mount(<RadioGroup onChange={emptyHandler} options={OPTIONS} selectedValue="b" />);
        assert.lengthOf(group.find(Radio), 3);
        assert.isTrue(group.find({ checked: true }).is({ value: "b" }), "radio b not checked");
        assert.isTrue(group.find({ value: "c" }).prop("disabled"), "radio c not disabled");
    });

    it("uses options if given both options and children", () => {
        const group = mount(
            <RadioGroup onChange={emptyHandler} options={[]}>
                <Radio value="one" />
            </RadioGroup>,
        );
        assert.lengthOf(group.find(Radio), 0);
    });

    it("renders non-Radio children too", () => {
        const group = mount(
            <RadioGroup onChange={emptyHandler}>
                <Radio />
                <address />
                <Radio />
            </RadioGroup>,
        );
        assert.lengthOf(group.find("address"), 1);
        assert.lengthOf(group.find(Radio), 2);
    });
});
