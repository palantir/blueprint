/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
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
