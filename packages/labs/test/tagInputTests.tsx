/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { assert } from "chai";
import { mount, shallow } from "enzyme";
import * as React from "react";

import { Intent, Keys, Tag } from "@blueprintjs/core";
import { TagInput } from "../src/index";

describe("<TagInput>", () => {
    const VALUES = ["one", "two", "three"];

    it("passes inputProps to input element", () => {
        const onBlur = sinon.spy();
        const input = shallow(<TagInput values={VALUES} inputProps={{ autoFocus: true, onBlur }} />)
            .find("input");
        assert.isTrue(input.prop("autoFocus"));
        // check that event handler is proxied
        const fakeEvent = { flag: "yes" };
        input.simulate("blur", fakeEvent);
        assert.strictEqual(onBlur.args[0][0], fakeEvent);
    });

    it("renders a Tag for each value", () => {
        const wrapper = mount(<TagInput values={VALUES} />);
        assert.lengthOf(wrapper.find(Tag), VALUES.length);
    });

    it("tagProps object is applied to each Tag", () => {
        const wrapper = mount(<TagInput tagProps={{ intent: Intent.PRIMARY }} values={VALUES} />);
        const intents = wrapper.find(Tag).map((tag) => tag.prop("intent"));
        assert.deepEqual(intents, [Intent.PRIMARY, Intent.PRIMARY, Intent.PRIMARY]);
    });

    it("tagProps function is invoked for each Tag", () => {
        const tagProps = sinon.spy();
        mount(<TagInput tagProps={tagProps} values={VALUES} />);
        assert.isTrue(tagProps.calledThrice);
    });

    it("clicking Tag remove button invokes onRemove with that value", () => {
        const onRemove = sinon.spy();
        // requires full mount to support data attributes and parentElement
        const wrapper = mount(<TagInput onRemove={onRemove} values={VALUES} />);
        wrapper.find("button").at(1).simulate("click");
        assert.isTrue(onRemove.calledOnce);
        assert.sameMembers(onRemove.args[0], [VALUES[1], 1]);
    });

    describe("when input is empty", () => {
        it("pressing backspace invokes onRemove with last item", () => {
            const onRemove = sinon.spy();
            const wrapper = shallow(<TagInput onRemove={onRemove} values={VALUES} />);
            wrapper.find("input").simulate("keydown", {
                currentTarget: { value: "" },
                which: Keys.BACKSPACE,
            });
            assert.isTrue(onRemove.calledOnce);
            const lastIndex = VALUES.length - 1;
            assert.sameMembers(onRemove.args[0], [VALUES[lastIndex], lastIndex]);
        });

        it("pressing enter does not invoke onAdd", () => {
            const onAdd = sinon.spy();
            const wrapper = shallow(<TagInput onAdd={onAdd} values={VALUES} />);
            wrapper.find("input").simulate("keydown", {
                currentTarget: { value: "" },
                which: Keys.ENTER,
            });
            assert.isTrue(onAdd.notCalled);
        });
    });

    describe("when input is not empty", () => {
        it("pressing backspace does not remove item", () => {
            const onRemove = sinon.spy();
            const wrapper = shallow(<TagInput onRemove={onRemove} values={VALUES} />);
            wrapper.find("input").simulate("keydown", {
                currentTarget: { value: "text" },
                which: Keys.BACKSPACE,
            });
            assert.isTrue(onRemove.notCalled);
        });

        it("pressing enter adds new item", () => {
            const value = "new item";
            const onAdd = sinon.spy();
            const wrapper = shallow(<TagInput onAdd={onAdd} values={VALUES} />);
            wrapper.find("input").simulate("keydown", {
                currentTarget: { value },
                which: Keys.ENTER,
            });
            assert.isTrue(onAdd.calledOnce);
            assert.strictEqual(onAdd.args[0][0], value);
        });
    });
});
