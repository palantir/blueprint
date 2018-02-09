/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { assert } from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import { Callout, Classes, Icon, Intent } from "../../src/index";

describe("<Callout>", () => {
    it("supports className", () => {
        const wrapper = shallow(<Callout className="foo" />);
        assert.isFalse(wrapper.find("h5").exists(), "expected no h5");
        assert.isTrue(wrapper.hasClass(Classes.CALLOUT));
        assert.isTrue(wrapper.hasClass("foo"));
    });

    it("supports icon", () => {
        const wrapper = shallow(<Callout icon="graph" />);
        assert.isTrue(wrapper.find(Icon).exists());
    });

    it("supports intent", () => {
        const wrapper = shallow(<Callout intent={Intent.DANGER} />);
        assert.isTrue(wrapper.hasClass(Classes.INTENT_DANGER));
    });

    it("intent renders default icon", () => {
        const wrapper = shallow(<Callout intent={Intent.PRIMARY} />);
        assert.isTrue(wrapper.find(Icon).exists());
    });

    it("icon=null removes intent icon", () => {
        const wrapper = shallow(<Callout icon={null} intent={Intent.PRIMARY} />);
        assert.isFalse(wrapper.find(Icon).exists());
    });

    it("renders optional title element", () => {
        const title = "I am the title";
        const wrapper = shallow(<Callout title={title} />);
        assert.strictEqual(wrapper.find("h5").text(), title);
        // NOTE: JSX cannot be passed through `title` prop due to conflict with HTML props
        // shallow(<Callout title={<em>typings fail</em>} />);
    });
});
