/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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
import { shallow } from "enzyme";
import * as React from "react";

import { Classes, H4, NonIdealState } from "../../src/index";

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
        assert.exists(wrapper.find(H4), "missing H4");
        [Classes.NON_IDEAL_STATE_VISUAL, Classes.NON_IDEAL_STATE].forEach(className => {
            assert.isTrue(wrapper.find(`.${className}`).exists(), `missing ${className}`);
        });
    });

    it("ensures description is wrapped in an element", () => {
        const wrapper = shallow(<NonIdealState action={<strong />} description="foo" />);
        const div = wrapper.children().find("div");
        assert.lengthOf(div, 1);
        assert.strictEqual(div.text(), "foo");
    });
});
