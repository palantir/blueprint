/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { assert } from "chai";
import { mount, shallow, ShallowWrapper } from "enzyme";
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

    describe("onAdd", () => {
        const NEW_VALUE = "new item";

        it("is not invoked on enter when input is empty", () => {
            const onAdd = sinon.stub().returns(true);
            const wrapper = mountTagInput(onAdd);
            pressEnterInInput(wrapper, "");
            assert.isTrue(onAdd.notCalled);
        });

        it("is invoked on enter", () => {
            const onAdd = sinon.stub().returns(true);
            const wrapper = mountTagInput(onAdd);
            pressEnterInInput(wrapper, NEW_VALUE);
            assert.isTrue(onAdd.calledOnce);
            assert.strictEqual(onAdd.args[0][0], NEW_VALUE);
        });

        it("does not clear the input if onAdd returns false", () => {
            const onAdd = sinon.stub().returns(false);
            const wrapper = mountTagInput(onAdd);
            wrapper.setState({ inputValue: NEW_VALUE });
            pressEnterInInput(wrapper, NEW_VALUE);
            assert.strictEqual(wrapper.state().inputValue, NEW_VALUE);
        });

        it("clears the input if onAdd returns true", () => {
            const onAdd = sinon.stub().returns(true);
            const wrapper = mountTagInput(onAdd);
            wrapper.setState({ inputValue: NEW_VALUE });
            pressEnterInInput(wrapper, NEW_VALUE);
            assert.strictEqual(wrapper.state().inputValue, "");
        });

        function mountTagInput(onAdd: Sinon.SinonStub) {
            return shallow(<TagInput onAdd={onAdd} values={VALUES} />);
        }

        function pressEnterInInput(wrapper: ShallowWrapper<any, any>, value: string) {
            wrapper.find("input").simulate("keydown", {
                currentTarget: { value },
                which: Keys.ENTER,
            });
        }
    });

    describe("onRemove", () => {
        it("pressing backspace focuses last item", () => {
            const onRemove = sinon.spy();
            const wrapper = mount(<TagInput onRemove={onRemove} values={VALUES} />);
            wrapper.find("input")
                .simulate("keydown", { which: Keys.BACKSPACE });

            assert.equal(wrapper.state("activeIndex"), VALUES.length - 1);
            assert.isTrue(onRemove.notCalled);
        });

        it("pressing backspace again removes last item", () => {
            const onRemove = sinon.spy();
            const wrapper = mount(<TagInput onRemove={onRemove} values={VALUES} />);
            wrapper.find("input")
                .simulate("keydown", { which: Keys.BACKSPACE })
                .simulate("keydown", { which: Keys.BACKSPACE });

            assert.equal(wrapper.state("activeIndex"), VALUES.length - 2);
            assert.isTrue(onRemove.calledOnce);
            const lastIndex = VALUES.length - 1;
            assert.sameMembers(onRemove.args[0], [VALUES[lastIndex], lastIndex]);
        });

        it("pressing left arrow key navigates active item and backspace removes it", () => {
            const onRemove = sinon.spy();
            const wrapper = mount(<TagInput onRemove={onRemove} values={VALUES} />);
            // select and remove middle item
            wrapper.find("input")
                .simulate("keydown", { which: Keys.ARROW_LEFT })
                .simulate("keydown", { which: Keys.ARROW_LEFT })
                .simulate("keydown", { which: Keys.BACKSPACE });

            assert.equal(wrapper.state("activeIndex"), 0);
            assert.isTrue(onRemove.calledOnce);
            assert.sameMembers(onRemove.args[0], [VALUES[1], 1]);
        });

        it("pressing right arrow key in initial state does nothing", () => {
            const wrapper = mount(<TagInput values={VALUES} />);
            wrapper.find("input")
                .simulate("keydown", { which: Keys.ARROW_RIGHT });
            assert.equal(wrapper.state("activeIndex"), -1);
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
    });
});
