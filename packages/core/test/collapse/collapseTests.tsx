/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import { assert } from "chai";
import { mount, shallow } from "enzyme";
import * as React from "react";

import { AnimationStates, Classes, Collapse, MenuItem } from "../../src/index";

describe("<Collapse>", () => {
    it("has the correct className", () => {
        const collapse = shallow(<Collapse />);
        assert.isTrue(collapse.hasClass(Classes.COLLAPSE));
    });

    it("is closed", () => {
        const collapse = mount(<Collapse isOpen={false}>Body</Collapse>);
        assert.strictEqual(collapse.state("height"), "0px");
    });

    it("is open", () => {
        const collapse = mount(<Collapse isOpen={true}>Body</Collapse>);
        assert.strictEqual(collapse.state("height"), "auto");
    });

    it("is opening", () => {
        const collapse = mount(<Collapse isOpen={false}>Body</Collapse>);
        collapse.setProps({ isOpen: true });
        assert.strictEqual(collapse.state("animationState"), AnimationStates.OPENING);
    });

    it("supports custom intrinsic element", () => {
        assert.isTrue(shallow(<Collapse component="article" />).is("article"));
    });

    it("supports custom Component", () => {
        assert.isTrue(shallow(<Collapse component={MenuItem} />).is(MenuItem));
    });
});
