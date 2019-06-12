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
import { shallow } from "enzyme";
import * as React from "react";

import { Classes, FormGroup, Intent } from "../../src/index";

describe("<FormGroup>", () => {
    it("supports className & intent", () => {
        const wrapper = shallow(<FormGroup className="foo" intent={Intent.SUCCESS} />);
        assert.isTrue(wrapper.hasClass(Classes.FORM_GROUP));
        assert.isTrue(wrapper.hasClass(Classes.INTENT_SUCCESS));
        assert.isTrue(wrapper.hasClass("foo"));
    });

    it("renders children in form content", () => {
        const wrapper = shallow(
            <FormGroup>
                <input id="yes" />
            </FormGroup>,
        );
        const content = wrapper.find(`.${Classes.FORM_CONTENT}`);
        assert.strictEqual(content.find("input").prop("id"), "yes");
    });

    it("renders label & labelFor", () => {
        const labelText = "This is the label.";
        const label = shallow(<FormGroup label={labelText} labelFor="foo" />).find("label");
        // remove space to separate from labelInfo (does not appear in DOM)
        assert.strictEqual(label.text().trim(), labelText);
        assert.strictEqual(label.prop("htmlFor"), "foo");
    });

    it("hides label when falsy", () => {
        const label = shallow(<FormGroup />).find("label");
        assert.strictEqual(label.length, 0);
    });

    it("labelInfo=JSX renders JSX content in label", () => {
        const info = <em>fill me out</em>;
        const label = shallow(<FormGroup label="label" labelInfo={info} />).find("label");
        assert.isTrue(label.containsMatchingElement(info));
    });

    it("renders helperText", () => {
        const helperText = "Help me out";
        const wrapper = shallow(<FormGroup helperText={helperText} />);
        const helper = wrapper.find(`.${Classes.FORM_HELPER_TEXT}`);
        assert.strictEqual(helper.text(), helperText);
    });
});
