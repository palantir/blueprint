/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { assert } from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import { Classes, NavbarDivider } from "../../src/index";

describe("<NavbarDivider>", () => {
    it("renders its contents correctly", () => {
        const CLASS_FOO = "foo";
        const wrapper = shallow(<NavbarDivider className={CLASS_FOO} />);
        assert.isTrue(wrapper.hasClass(Classes.NAVBAR_DIVIDER), Classes.NAVBAR_DIVIDER);
        assert.isTrue(wrapper.hasClass(CLASS_FOO), CLASS_FOO);
    });
});
