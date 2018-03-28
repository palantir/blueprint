/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { assert } from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import { Classes, Label } from "../../src/index";

describe("<Label>", () => {
    it("renders a space between text and helperText", () => {
        const wrapper = shallow(
            <Label text="Username" helperText="(blah blah)">
                <input autoFocus={true} className={Classes.INPUT} type="text" />
            </Label>,
        );
        assert.strictEqual(wrapper.text(), "Username (blah blah)");
    });

    it("does not put an extra space after text when helperText is not defined", () => {
        const wrapper = shallow(
            <Label text="Username">
                <input autoFocus={true} className={Classes.INPUT} type="text" />
            </Label>,
        );
        assert.strictEqual(wrapper.text(), "Username");
    });
});
