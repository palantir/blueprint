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
    it("supports className & intent", () => {
        const wrapper = shallow(<Label text="Hello" className="foo" />);
        assert.isTrue(wrapper.hasClass(Classes.LABEL));
        assert.isTrue(wrapper.hasClass("foo"));
    });

    it("renders a string as the text as its first children", () => {
        const text = "Hello";

        const wrapper = shallow(
            <Label text={text}>
                <input id="yes" />
            </Label>,
        );
        assert.equal(wrapper.childAt(0).text(), text);
    });

    it("renders a component as the text as its first children", () => {
        const text = <div>Hello!</div>;

        const wrapper = shallow(
            <Label text={text}>
                <input id="yes" />
            </Label>,
        );
        assert.isTrue(wrapper.childAt(0).equals(text));
    });

    it("renders a string as the helperText as its first children", () => {
        const helperText = "Hello";

        const wrapper = shallow(
            <Label text="Label" helperText={helperText}>
                <input id="yes" />
            </Label>,
        );
        assert.equal(wrapper.childAt(1).text(), helperText);
    });

    it("renders a component as the helperText as its first children", () => {
        const helperText = <div>Hello!</div>;

        const wrapper = shallow(
            <Label text="Label" helperText={helperText}>
                <input id="yes" />
            </Label>,
        );
        assert.isTrue(wrapper.childAt(1).equals(helperText));
    });

    it("renders the input inside the label", () => {
        const input = <input id="yes" />;

        const wrapper = shallow(<Label text="Label">{input}</Label>);

        assert.strictEqual(wrapper.find("input").prop("id"), "yes");
    });
});
