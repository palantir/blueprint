/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { assert } from "chai";
import { mount, shallow } from "enzyme";
import * as React from "react";

import { Classes, Navbar } from "../../src/index";

describe("<Navbar>", () => {
    it("renders its contents correctly", () => {
        const CLASS_FOO = "foo";
        const CLASS_BAR = "bar";
        const TEXT = "baz";

        const wrapper = shallow(
            <Navbar className={CLASS_FOO}>
                <div className={CLASS_BAR}>{TEXT}</div>
            </Navbar>,
        );

        assert.isTrue(wrapper.hasClass(Classes.NAVBAR), Classes.NAVBAR);
        assert.isTrue(wrapper.hasClass(CLASS_FOO), CLASS_FOO);
        assert.isTrue(wrapper.childAt(0).hasClass(CLASS_BAR), CLASS_BAR);
        assert.equal(wrapper.childAt(0).text(), TEXT);
    });

    it("supports html props", () => {
        const wrapper = mount(<Navbar style={{ width: 100 }} tabIndex={2} />);
        const element = wrapper.getDOMNode() as HTMLElement;
        assert.strictEqual(element.style.width, "100px");
        assert.strictEqual(element.tabIndex, 2);
    });
});
