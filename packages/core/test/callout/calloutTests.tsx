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

import { Callout, Classes, Intent } from "../../src/index";

describe("<Callout>", () => {
    it("supports className", () => {
        const wrapper = shallow(<Callout className="foo" />);
        assert.isTrue(wrapper.find("h5").isEmpty(), "expected no h5");
        assert.isTrue(wrapper.hasClass(Classes.CALLOUT));
        assert.isTrue(wrapper.hasClass("foo"));
    });

    it("supports icon", () => {
        const wrapper = shallow(<Callout iconName="graph" />);
        assert.isTrue(wrapper.hasClass(Classes.iconClass("graph")));
    });

    it("supports intent", () => {
        const wrapper = shallow(<Callout intent={Intent.DANGER} />);
        assert.isTrue(wrapper.hasClass(Classes.INTENT_DANGER));
    });

    it("spreads HTML props", () => {
        const onClick = sinon.spy();
        const wrapper = shallow(<Callout label="label" onClick={onClick} />);
        assert.strictEqual(wrapper.prop("label"), "label");
        assert.strictEqual(wrapper.prop("onClick"), onClick);
    });

    it("renders optional title element", () => {
        const title = "I am the title";
        const wrapper = shallow(<Callout title={title} />);
        assert.strictEqual(wrapper.find("h5").text(), title);
        // NOTE: JSX cannot be passed through `title` prop due to conflict with HTML props
        // shallow(<Callout title={<em>typings fail</em>} />);
    });
});
