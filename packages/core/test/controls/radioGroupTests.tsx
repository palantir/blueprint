/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import { assert } from "chai";
import { mount } from "enzyme";
import * as React from "react";

import { IOptionProps, Radio, RadioGroup } from "../../src/index";

describe("RadioGroup", () => {
    const emptyHandler = () => { return; };

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

    it("throws error if given both options and children", () => {
        assert.throws(() => {
            mount(<RadioGroup onChange={emptyHandler} options={[]}><Radio value="one" /></RadioGroup>);
        });
    });

    it("throws error if given non-Radio children", () => {
        assert.throws(() => {
            mount(<RadioGroup onChange={emptyHandler}><address /><Radio /></RadioGroup>);
        });
    });
});
