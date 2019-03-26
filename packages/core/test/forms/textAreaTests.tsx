/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { assert } from "chai";
import { mount } from "enzyme";
import * as React from "react";

import { TextArea } from "../../src/index";

describe("<TextArea>", () => {
    it("can resize automatically", () => {
        const wrapper = mount(<TextArea growVertically={true} />);
        const textarea = wrapper.find("textarea");

        textarea.simulate("change", { target: { scrollHeight: 500 } });

        assert.equal((textarea.getDOMNode() as HTMLElement).style.height, "500px");
    });

    it("doesn't resize by default", () => {
        const wrapper = mount(<TextArea />);
        const textarea = wrapper.find("textarea");

        textarea.simulate("change", {
            target: {
                scrollHeight: textarea.getDOMNode().scrollHeight,
            },
        });

        assert.equal((textarea.getDOMNode() as HTMLElement).style.height, "");
    });

    it("doesn't clobber user-supplied styles", () => {
        const wrapper = mount(<TextArea growVertically={true} style={{ marginTop: 10 }} />);
        const textarea = wrapper.find("textarea");

        textarea.simulate("change", { target: { scrollHeight: 500 } });

        assert.equal((textarea.getDOMNode() as HTMLElement).style.marginTop, "10px");
    });
});
