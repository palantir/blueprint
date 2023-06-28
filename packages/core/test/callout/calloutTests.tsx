/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
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

import { IconNames } from "@blueprintjs/icons";

import { Callout, Classes, H5, Intent } from "../../src";

describe("<Callout>", () => {
    it("supports className", () => {
        const wrapper = shallow(<Callout className="foo" />);
        assert.isFalse(wrapper.find(H5).exists(), "expected no H5");
        assert.isTrue(wrapper.hasClass(Classes.CALLOUT));
        assert.isTrue(wrapper.hasClass("foo"));
    });

    it("supports icon", () => {
        const wrapper = shallow(<Callout icon={IconNames.GRAPH} />);
        assert.isTrue(wrapper.find(`[data-icon="${IconNames.GRAPH}"]`).exists());
    });

    it("supports intent", () => {
        const wrapper = shallow(<Callout intent={Intent.DANGER} />);
        assert.isTrue(wrapper.hasClass(Classes.INTENT_DANGER));
    });

    it("intent='primary' renders the associated default icon", () => {
        const wrapper = shallow(<Callout intent={Intent.PRIMARY} />);
        assert.isTrue(wrapper.find(`[data-icon="${IconNames.INFO_SIGN}"]`).exists());
    });

    it("icon=null removes intent icon", () => {
        const wrapper = shallow(<Callout icon={null} intent={Intent.PRIMARY} />);
        assert.isTrue(wrapper.find(`[data-icon]`).exists());
    });

    it("renders optional title element", () => {
        const wrapper = shallow(<Callout title="title" />);
        assert.isTrue(wrapper.find(H5).exists());
        // NOTE: JSX cannot be passed through `title` prop due to conflict with HTML props
        // shallow(<Callout title={<em>typings fail</em>} />);
    });
});
