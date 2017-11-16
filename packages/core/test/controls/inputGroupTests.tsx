/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { assert } from "chai";
import { mount } from "enzyme";
import * as React from "react";
import { spy } from "sinon";

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
        const changeSpy = spy();
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
