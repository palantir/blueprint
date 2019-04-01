/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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
import { EnzymePropSelector, mount, ReactWrapper } from "enzyme";
import * as React from "react";
import { spy, stub } from "sinon";

import { RADIOGROUP_WARN_CHILDREN_OPTIONS_MUTEX } from "../../src/common/errors";
import { IOptionProps, Radio, RadioGroup } from "../../src/index";

describe("<RadioGroup>", () => {
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
        assert.isTrue(findInput(group, { checked: true }).is({ value: "two" }));
    });

    it("invokes onChange handler when a radio is clicked", () => {
        const changeSpy = spy();
        const group = mount(
            <RadioGroup onChange={changeSpy}>
                <Radio value="one" label="One" />
                <Radio value="two" label="Two" />
            </RadioGroup>,
        );
        findInput(group, { value: "one" }).simulate("change");
        findInput(group, { value: "two" }).simulate("change");
        assert.equal(changeSpy.callCount, 2);
    });

    it("renders options as radio buttons", () => {
        const OPTIONS: IOptionProps[] = [
            { className: "foo", label: "A", value: "a" },
            { label: "B", value: "b" },
            { disabled: true, label: "C", value: "c" },
        ];
        const group = mount(<RadioGroup onChange={emptyHandler} options={OPTIONS} selectedValue="b" />);
        const radios = group.find(Radio);
        assert.isTrue(radios.at(0).hasClass("foo"), "className");
        assert.isTrue(radios.at(1).is({ checked: true }), "selectedValue");
        assert.isTrue(radios.at(2).prop("disabled"), "disabled");
    });

    it("options label defaults to value", () => {
        const OPTIONS = [{ value: "text" }, { value: 23 }];
        const group = mount(<RadioGroup onChange={emptyHandler} options={OPTIONS} selectedValue="b" />);
        OPTIONS.forEach(props => {
            assert.strictEqual(
                findInput(group, props)
                    .parents()
                    .first()
                    .text(),
                props.value.toString(),
            );
        });
    });

    it("uses options if given both options and children (with conosle warning)", () => {
        const warnSpy = stub(console, "warn");
        const group = mount(
            <RadioGroup onChange={emptyHandler} options={[]}>
                <Radio value="one" />
            </RadioGroup>,
        );
        assert.lengthOf(group.find(Radio), 0);
        assert.isTrue(warnSpy.alwaysCalledWith(RADIOGROUP_WARN_CHILDREN_OPTIONS_MUTEX));
        warnSpy.restore();
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

    function findInput(wrapper: ReactWrapper<any, any>, props: EnzymePropSelector) {
        return wrapper.find("input").filter(props);
    }
});
