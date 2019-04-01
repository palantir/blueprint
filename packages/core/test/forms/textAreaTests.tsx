/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
