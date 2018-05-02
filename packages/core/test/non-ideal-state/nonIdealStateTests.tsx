/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { assert } from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import { Classes, NonIdealState, Spinner } from "../../src/index";

describe("<NonIdealState>", () => {
    it("renders its contents", () => {
        assert.lengthOf(document.getElementsByClassName(Classes.NON_IDEAL_STATE), 0);

        const wrapper = shallow(
            <NonIdealState
                action={<p>More text!</p>}
                description="An error occured."
                title="ERROR"
                icon="folder-close"
            />,
        );
        [Classes.HEADING, Classes.ICON, Classes.NON_IDEAL_STATE_VISUAL, Classes.NON_IDEAL_STATE].forEach(className => {
            assert.lengthOf(wrapper.find(`.${className}`), 1, `missing ${className}`);
        });
    });

    it("ensures description is wrapped in an element", () => {
        const wrapper = shallow(<NonIdealState description="foo" />);
        assert.lengthOf(wrapper.find("div"), 1);
        assert.strictEqual(wrapper.find("div").text(), "foo");
    });

    it("can render a JSX visual", () => {
        const wrapper = shallow(<NonIdealState description="foo" title="bar" icon={<Spinner />} />);
        assert.lengthOf(wrapper.find(Spinner), 1);
        assert.lengthOf(wrapper.find(`.${Classes.ICON}`), 0);
    });
});
