/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
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
                visual="folder-close"
            />,
        );
        [
            Classes.NON_IDEAL_STATE,
            Classes.NON_IDEAL_STATE_VISUAL,
            Classes.NON_IDEAL_STATE_ICON,
            Classes.NON_IDEAL_STATE_TITLE,
            Classes.NON_IDEAL_STATE_DESCRIPTION,
            Classes.NON_IDEAL_STATE_ACTION,
        ].forEach(className => {
            assert.lengthOf(wrapper.find(`.${className}`), 1, `missing ${className}`);
        });
    });

    it("can render a JSX visual", () => {
        const wrapper = shallow(<NonIdealState description="foo" title="bar" visual={<Spinner />} />);
        assert.lengthOf(wrapper.find(Spinner), 1);
        assert.lengthOf(wrapper.find(`.${Classes.NON_IDEAL_STATE_ICON}`), 0);
    });
});
