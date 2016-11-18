/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { assert } from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import { Classes, Tag } from "../../src/index";

describe("<Tag>", () => {
    it("renders its text", () => {
        assert.deepEqual(shallow(<Tag>Hello</Tag>).text(), "Hello");
    });

    it("renders close button when onRemove is a function", () => {
        const wrapper = shallow(<Tag onRemove={sinon.spy()}>Hello</Tag>);
        assert.lengthOf(wrapper.find(`.${Classes.TAG_REMOVE}`), 1);
    });

    it("clicking close button triggers onRemove", () => {
        const handleRemove = sinon.spy();
        shallow(<Tag onRemove={handleRemove}>Hello</Tag>)
            .find(`.${Classes.TAG_REMOVE}`).simulate("click");
        assert.isTrue(handleRemove.calledOnce);
    });

    it("passes other props onto .pt-tag element", () => {
        const element = shallow(<Tag alt="foo bar" title="baz qux">Hello</Tag>).find(".pt-tag");
        assert.deepEqual(element.prop("alt"), "foo bar");
        assert.deepEqual(element.prop("title"), "baz qux");
    });
});
