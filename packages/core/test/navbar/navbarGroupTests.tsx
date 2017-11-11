/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { assert } from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import { Classes, NavbarGroup } from "../../src/index";

describe("<NavbarGroup>", () => {
    it("renders its contents correctly", () => {
        const CLASS_FOO = "foo";
        const CLASS_BAR = "bar";
        const TEXT = "baz";

        const wrapper = shallow(
            <NavbarGroup className={CLASS_FOO}>
                <div className={CLASS_BAR}>{TEXT}</div>
            </NavbarGroup>,
        );

        assert.isTrue(wrapper.hasClass(Classes.NAVBAR_GROUP), Classes.NAVBAR_GROUP);
        assert.isTrue(wrapper.hasClass(CLASS_FOO), CLASS_FOO);
        assert.isTrue(wrapper.childAt(0).hasClass(CLASS_BAR), CLASS_BAR);
        assert.equal(wrapper.childAt(0).text(), TEXT);
    });

    it("can align to the left", () => {
        const wrapper1 = shallow(<NavbarGroup />);

        // aligns to the left by default
        assert.isTrue(wrapper1.hasClass(Classes.ALIGN_LEFT));

        // can also be explicitly controlled
        const wrapper2 = shallow(<NavbarGroup align="left" />);
        assert.isTrue(wrapper2.hasClass(Classes.ALIGN_LEFT));
    });

    it("can align to the right", () => {
        const wrapper = shallow(<NavbarGroup align="right" />);
        assert.isTrue(wrapper.hasClass(Classes.ALIGN_RIGHT));
    });
});
