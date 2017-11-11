/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { assert } from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import { Button, ButtonGroup, Classes } from "../../src/index";

describe("<ButtonGroup>", () => {
    it("renders its contents properly", () => {
        const wrapper = shallow(
            <ButtonGroup>
                <Button text="Foo" />
            </ButtonGroup>,
        );
        assert.isTrue(wrapper.hasClass(Classes.BUTTON_GROUP), Classes.BUTTON_GROUP);
        assert.equal(wrapper.children().length, 1);
    });

    it("renders with custom style", () => {
        const wrapper = shallow(<ButtonGroup style={{ background: "yellow" }} />);
        const element = wrapper.getDOMNode() as HTMLElement;
        assert.deepEqual(element.style.background, "yellow");
    });

    it("renders with custom className", () => {
        const wrapper = shallow(<ButtonGroup className={"yellow"} />);
        assert.isTrue(wrapper.hasClass("yellow"));
    });

    it("maps JS props to CSS API", () => {
        const wrapper = shallow(<ButtonGroup fill={true} large={true} minimal={true} vertical={true} />);
        assert.isTrue(wrapper.hasClass(Classes.FILL), Classes.FILL);
        assert.isTrue(wrapper.hasClass(Classes.LARGE), Classes.LARGE);
        assert.isTrue(wrapper.hasClass(Classes.MINIMAL), Classes.MINIMAL);
        assert.isTrue(wrapper.hasClass(Classes.VERTICAL), Classes.VERTICAL);
    });
});
