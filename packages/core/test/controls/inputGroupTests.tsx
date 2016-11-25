/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
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
        const action = mount(<InputGroup rightElement={<address />} />).childAt(1);
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

    it("inputRef receives reference to HTMLInputElement", () => {
        const inputRef = sinon.spy();
        mount(<InputGroup inputRef={inputRef} />);
        assert.isTrue(inputRef.calledOnce);
        assert.instanceOf(inputRef.args[0][0], HTMLInputElement);
    });
});
