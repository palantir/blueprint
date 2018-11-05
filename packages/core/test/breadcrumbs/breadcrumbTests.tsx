/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { assert } from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import { spy } from "sinon";

import { Breadcrumb, Classes } from "../../src/index";

describe("Breadcrumb", () => {
    it("renders its contents", () => {
        const wrapper = shallow(<Breadcrumb className="foo" text="Hello" />);
        assert.isTrue(wrapper.hasClass(Classes.BREADCRUMB));
        assert.isTrue(wrapper.hasClass("foo"));
        assert.strictEqual(wrapper.text(), "Hello");
    });

    it("clicking triggers onClick", () => {
        const onClick = spy();
        shallow(<Breadcrumb onClick={onClick} text="Hello" />).simulate("click");
        assert.isTrue(onClick.calledOnce, "onClick not called once");
    });

    it("clicking disabled does not trigger onClick", () => {
        const onClick = spy();
        shallow(<Breadcrumb disabled={true} onClick={onClick} text="Hello" />).simulate("click");
        assert.isTrue(onClick.notCalled, "onClick called");
    });

    it("renders an a tag if it's clickable", () => {
        assert.lengthOf(shallow(<Breadcrumb href="test" />).find("a"), 1);
        assert.lengthOf(shallow(<Breadcrumb href="test" />).find("span"), 0);
    });

    it("renders a span tag if it's not clickable", () => {
        assert.lengthOf(shallow(<Breadcrumb />).find("a"), 0);
        assert.lengthOf(shallow(<Breadcrumb />).find("span"), 1);
    });
});
