/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { assert, expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import { Card, Classes } from "../../src/index";

describe("<Card>", () => {
    const noClass = (className: string) => `Card does not have "${className}" class`;

    it("supports elevation, interactive, and className props", () => {
        const wrapper = shallow(<Card elevation={3} interactive={true} className={Classes.TEXT_MUTED} />);

        assert.isTrue(wrapper.hasClass(Classes.CARD), noClass(Classes.CARD));
        assert.isTrue(wrapper.hasClass(Classes.ELEVATION_3), noClass(Classes.ELEVATION_3));
        assert.isTrue(wrapper.hasClass(Classes.INTERACTIVE), noClass(Classes.INTERACTIVE));
        assert.isTrue(wrapper.hasClass(Classes.TEXT_MUTED), noClass(Classes.TEXT_MUTED));
    });

    it("renders children", () => {
        const expectedNumberOfChildren = 1;
        const wrapper = shallow(
            <Card>
                <h4>Card content</h4>
            </Card>,
        );

        const cardChildrens = wrapper.children().length;

        assert.equal(
            cardChildrens,
            expectedNumberOfChildren,
            `Expected Card to have ${expectedNumberOfChildren} children, found ${cardChildrens} instead`,
        );
        assert.equal(wrapper.children().html(), "<h4>Card content</h4>", "Card content does not match");
    });

    it("call onClick when card is clicked", () => {
        const onClick = sinon.spy();
        const wrapper = shallow(<Card onClick={onClick} />);

        wrapper.simulate("click");

        const errorMessage = "Exected onClick to be called, but it doesn't happend";
        expect(onClick.calledOnce, errorMessage).to.be.true;
    });
});
