/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { assert } from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import { Breadcrumb, Classes } from "../../src/index";

describe("Breadcrumb", () => {
    it("renders its contents", () => {
        const wrapper = shallow(<Breadcrumb className="foo" text="Hello" />);
        assert.isTrue(wrapper.hasClass(Classes.BREADCRUMB));
        assert.isTrue(wrapper.hasClass("foo"));
        assert.strictEqual(wrapper.text(), "Hello");
    });

    it("clicking triggers onClick", () => {
        const onClick = sinon.spy();
        shallow(<Breadcrumb onClick={onClick} text="Hello" />).simulate("click");
        assert.isTrue(onClick.calledOnce, "onClick not called once");
    });

    it("clicking disabled does not trigger onClick", () => {
        const onClick = sinon.spy();
        shallow(<Breadcrumb disabled={true} onClick={onClick} text="Hello" />).simulate("click");
        assert.isTrue(onClick.notCalled, "onClick called");
    });
});
