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
import { mount } from "enzyme";
import * as React from "react";

import { InputGroup } from "../../src/index";

describe("<InputGroup>", () => {
    it("renders left icon before input", () => {
        const input = mount(<InputGroup leftIconName="star" />);
        assert.isTrue(input.childAt(0).hasClass("pt-icon-star"));
        assert.isTrue(input.childAt(1).hasClass("pt-input"));
    });

    it("renders right element inside .pt-input-action after input", () => {
        const action = mount(<InputGroup rightElement={<address />} />).childAt(2);
        assert.isTrue(action.hasClass("pt-input-action"));
        assert.lengthOf(action.find("address"), 1);
    });

    it("works like a text input", () => {
        const changeSpy = sinon.spy();
        const input = mount(<InputGroup value="value" onChange={changeSpy} />).find("input");
        assert.strictEqual(input.prop("type"), "text");
        assert.strictEqual(input.prop("value"), "value");

        input.simulate("change");
        assert.isTrue(changeSpy.calledOnce, "onChange not called");
    });

    it("supports custom type attribute", () => {
        const group = mount(<InputGroup type="email" />);
        assert.strictEqual(group.find("input").prop("type"), "email");

        group.setProps({ type: "password" });
        assert.strictEqual(group.find("input").prop("type"), "password");
    });
});
