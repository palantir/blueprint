/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { assert } from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import { Classes, NonIdealState } from "../../src/index";

describe("<NonIdealState>", () => {
    it("renders its contents", () => {
        const wrapper = shallow(
            <NonIdealState
                action={<p>More text!</p>}
                description="An error occured."
                title="ERROR"
                icon="folder-close"
            />,
        );
        [Classes.HEADING, Classes.NON_IDEAL_STATE_VISUAL, Classes.NON_IDEAL_STATE].forEach(className => {
            assert.lengthOf(wrapper.find(`.${className}`), 1, `missing ${className}`);
        });
    });

    it("ensures description is wrapped in an element", () => {
        const wrapper = shallow(<NonIdealState action={<strong />} description="foo" />);
        const div = wrapper.children().find("div");
        assert.lengthOf(div, 1);
        assert.strictEqual(div.text(), "foo");
    });
});
