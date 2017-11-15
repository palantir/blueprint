/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { assert } from "chai";
import { mount, shallow } from "enzyme";
import * as React from "react";

import { Classes, Navbar } from "../../src/index";

describe("<Navbar.Group>", () => {
    it("renders its contents correctly", () => {
        const CLASS_FOO = "foo";
        const CLASS_BAR = "bar";
        const TEXT = "baz";

        const wrapper = shallow(
            <Navbar.Group className={CLASS_FOO}>
                <div className={CLASS_BAR}>{TEXT}</div>
            </Navbar.Group>,
        );

        assert.isTrue(wrapper.hasClass(Classes.NAVBAR_GROUP), Classes.NAVBAR_GROUP);
        assert.isTrue(wrapper.hasClass(CLASS_FOO), CLASS_FOO);
        assert.isTrue(wrapper.childAt(0).hasClass(CLASS_BAR), CLASS_BAR);
        assert.equal(wrapper.childAt(0).text(), TEXT);
    });

    it("supports html props", () => {
        const wrapper = mount(<Navbar.Group style={{ width: 100 }} tabIndex={2} />);
        const element = wrapper.getDOMNode() as HTMLElement;
        assert.strictEqual(element.style.width, "100px");
        assert.strictEqual(element.tabIndex, 2);
    });

    it("can align to the left", () => {
        const wrapper1 = shallow(<Navbar.Group />);

        // aligns to the left by default
        assert.isTrue(wrapper1.hasClass(Classes.ALIGN_LEFT));

        // can also be explicitly controlled
        const wrapper2 = shallow(<Navbar.Group align="left" />);
        assert.isTrue(wrapper2.hasClass(Classes.ALIGN_LEFT));
    });

    it("can align to the right", () => {
        const wrapper = shallow(<Navbar.Group align="right" />);
        assert.isTrue(wrapper.hasClass(Classes.ALIGN_RIGHT));
    });
});
