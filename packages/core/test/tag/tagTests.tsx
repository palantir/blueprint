/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
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
