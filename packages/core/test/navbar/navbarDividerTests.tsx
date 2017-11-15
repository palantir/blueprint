/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { assert } from "chai";
import { mount, shallow } from "enzyme";
import * as React from "react";

import { Classes, Navbar } from "../../src/index";

describe("<Navbar.Divider>", () => {
    it("renders its contents correctly", () => {
        const CLASS_FOO = "foo";
        const wrapper = shallow(<Navbar.Divider className={CLASS_FOO} />);
        assert.isTrue(wrapper.hasClass(Classes.NAVBAR_DIVIDER), Classes.NAVBAR_DIVIDER);
        assert.isTrue(wrapper.hasClass(CLASS_FOO), CLASS_FOO);
    });

    it("supports html props", () => {
        const wrapper = mount(<Navbar.Divider style={{ width: 100 }} tabIndex={2} />);
        const element = wrapper.getDOMNode() as HTMLElement;
        assert.strictEqual(element.style.width, "100px");
        assert.strictEqual(element.tabIndex, 2);
    });
});
