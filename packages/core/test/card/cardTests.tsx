/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { assert } from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";

import { Card, Classes } from "../../src/index";

describe("<Card>", () => {
    it("supports elevation, interactive, and className props", () => {
        const wrapper = shallow(<Card elevation={3} interactive={true} className={Classes.TEXT_MUTED} />);

        assert.isTrue(wrapper.hasClass(Classes.CARD), Classes.CARD);
        assert.isTrue(wrapper.hasClass(Classes.ELEVATION_3), Classes.ELEVATION_3);
        assert.isTrue(wrapper.hasClass(Classes.INTERACTIVE), Classes.INTERACTIVE);
        assert.isTrue(wrapper.hasClass(Classes.TEXT_MUTED), Classes.TEXT_MUTED);
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

    it("calls onClick when card is clicked", () => {
        const onClick = sinon.spy();
        shallow(<Card onClick={onClick} />).simulate("click");
        assert.isTrue(onClick.calledOnce);
    });
});
