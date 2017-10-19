/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { assert } from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import { Card, Classes } from "../../src/index";

describe("<Card>", () => {
    it("supports elevation, interactive, and className props", () => {
        const wrapper = shallow(<Card elevation={3} interactive={true} className={Classes.TEXT_MUTED} />);

        assert.isTrue(wrapper.hasClass(Classes.CARD));
        assert.isTrue(wrapper.hasClass(Classes.ELEVATION_3));
        assert.isTrue(wrapper.hasClass(Classes.INTERACTIVE));
        assert.isTrue(wrapper.hasClass(Classes.TEXT_MUTED));
    });

    it("renders children", () => {
        const wrapper = shallow(
            <Card>
                <h4>Card content</h4>
            </Card>,
        );

        assert.lengthOf(wrapper.children(), 1);
        assert.equal(wrapper.children().html(), "<h4>Card content</h4>");
    });

    it("call onClick when card is clicked", () => {
        const onClick = sinon.spy();
        const wrapper = shallow(<Card onClick={onClick} />);

        wrapper.simulate("click");

        assert.isTrue(onClick.calledOnce);
    });
});
