/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { assert } from "chai";
import { mount, shallow, ShallowWrapper } from "enzyme";
import * as React from "react";

import { Button, Classes, Intent, Keys, Tag } from "@blueprintjs/core";
import { ITagInputProps, TagInput } from "../src/index";

describe("<TagInput>", () => {
    const VALUES = ["one", "two", "three"];

    it("passes inputProps to input element", () => {
        const onBlur = sinon.spy();
        const input = shallow(<TagInput values={VALUES} inputProps={{ autoFocus: true, onBlur }} />).find("input");
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

    it("values can be valid JSX nodes", () => {
        const values = [<strong>Albert</strong>, undefined, ["Bar", <em key="thol">thol</em>, "omew"], "Casper"];
        const wrapper = mount(<TagInput values={values} />);
        // undefined does not produce a tag
        assert.lengthOf(wrapper.find(Tag), values.length - 1);
        assert.lengthOf(wrapper.find("strong"), 1);
        assert.lengthOf(wrapper.find("em"), 1);
    });

    it("leftIconName renders an icon as first child", () => {
        const wrapper = mount(<TagInput leftIconName="add" values={VALUES} />);
        assert.isTrue(wrapper.childAt(0).hasClass(Classes.ICON_STANDARD), "standard icon");
        wrapper.setProps({ className: Classes.LARGE });
        assert.isTrue(wrapper.childAt(0).hasClass(Classes.ICON_LARGE), "large icon");
    });

    it("rightElement appears as last child", () => {
        const wrapper = mount(<TagInput rightElement={<Button />} values={VALUES} />);
        assert.isTrue(
            wrapper
                .children()
                .last()
                .is(Button),
        );
    });

    it("tagProps object is applied to each Tag", () => {
        const wrapper = mount(<TagInput tagProps={{ intent: Intent.PRIMARY }} values={VALUES} />);
        const intents = wrapper.find(Tag).map(tag => tag.prop("intent"));
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
        wrapper
            .find("button")
            .at(1)
            .simulate("click");
        assert.isTrue(onRemove.calledOnce);
        assert.sameMembers(onRemove.args[0], [VALUES[1], 1]);
    });

    describe("onAdd", () => {
        const NEW_VALUE = "new item";

        it("is not invoked on enter when input is empty", () => {
            const onAdd = sinon.stub();
            const wrapper = mountTagInput(onAdd);
            pressEnterInInput(wrapper, "");
            assert.isTrue(onAdd.notCalled);
        });

        it("is invoked on enter", () => {
            const onAdd = sinon.stub();
            const wrapper = mountTagInput(onAdd);
            pressEnterInInput(wrapper, NEW_VALUE);
            assert.isTrue(onAdd.calledOnce);
            assert.deepEqual(onAdd.args[0][0], [NEW_VALUE]);
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

        it("clears the input if onAdd returns nothing", () => {
            const onAdd = sinon.stub();
            const wrapper = mountTagInput(onAdd);
            wrapper.setState({ inputValue: NEW_VALUE });
            pressEnterInInput(wrapper, NEW_VALUE);
            assert.strictEqual(wrapper.state().inputValue, "");
        });

        it("splits input value on separator RegExp", () => {
            const onAdd = sinon.stub();
            // this is actually the defaultProps value, but reproducing here for explicitness
            const wrapper = mountTagInput(onAdd, { separator: /,\s*/g });
            // various forms of whitespace properly ignored
            pressEnterInInput(wrapper, [NEW_VALUE, NEW_VALUE, "    ", NEW_VALUE].join(",   "));
            assert.deepEqual(onAdd.args[0][0], [NEW_VALUE, NEW_VALUE, NEW_VALUE]);
        });

        it("splits input value on separator string", () => {
            const onAdd = sinon.stub();
            const wrapper = mountTagInput(onAdd, { separator: "  |  " });
            pressEnterInInput(wrapper, "1 |  2  |   3   |    4    |  \t  |   ");
            assert.deepEqual(onAdd.args[0][0], ["1 |  2", "3", "4"]);
        });

        it("separator=false emits one-element values array", () => {
            const value = "one, two, three";
            const onAdd = sinon.stub();
            const wrapper = mountTagInput(onAdd, { separator: false });
            pressEnterInInput(wrapper, value);
            assert.deepEqual(onAdd.args[0][0], [value]);
        });

        function mountTagInput(onAdd: Sinon.SinonStub, props?: Partial<ITagInputProps>) {
            return shallow(<TagInput onAdd={onAdd} values={VALUES} {...props} />);
        }
    });

    describe("onRemove", () => {
        it("pressing backspace focuses last item", () => {
            const onRemove = sinon.spy();
            const wrapper = mount(<TagInput onRemove={onRemove} values={VALUES} />);
            wrapper.find("input").simulate("keydown", { which: Keys.BACKSPACE });

            assert.equal(wrapper.state("activeIndex"), VALUES.length - 1);
            assert.isTrue(onRemove.notCalled);
        });

        it("pressing backspace again removes last item", () => {
            const onRemove = sinon.spy();
            const wrapper = mount(<TagInput onRemove={onRemove} values={VALUES} />);
            wrapper
                .find("input")
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
            wrapper
                .find("input")
                .simulate("keydown", { which: Keys.ARROW_LEFT })
                .simulate("keydown", { which: Keys.ARROW_LEFT })
                .simulate("keydown", { which: Keys.BACKSPACE });

            assert.equal(wrapper.state("activeIndex"), 0);
            assert.isTrue(onRemove.calledOnce);
            assert.sameMembers(onRemove.args[0], [VALUES[1], 1]);
        });

        it("pressing right arrow key in initial state does nothing", () => {
            const wrapper = mount(<TagInput values={VALUES} />);
            wrapper.find("input").simulate("keydown", { which: Keys.ARROW_RIGHT });
            assert.equal(wrapper.state("activeIndex"), -1);
        });
    });

    describe("onChange", () => {
        const NEW_VALUE = "new item";

        it("is not invoked on enter when input is empty", () => {
            const onChange = sinon.stub();
            const wrapper = shallow(<TagInput onChange={onChange} values={VALUES} />);
            pressEnterInInput(wrapper, "");
            assert.isTrue(onChange.notCalled);
        });

        it("is invoked on enter with non-empty input", () => {
            const onChange = sinon.stub();
            const wrapper = shallow(<TagInput onChange={onChange} values={VALUES} />);
            pressEnterInInput(wrapper, NEW_VALUE);
            assert.isTrue(onChange.calledOnce);
            assert.deepEqual(onChange.args[0][0], [...VALUES, NEW_VALUE]);
        });

        it("can add multiple tags at once with separator", () => {
            const onChange = sinon.stub();
            const wrapper = shallow(<TagInput onChange={onChange} values={VALUES} />);
            pressEnterInInput(wrapper, [NEW_VALUE, NEW_VALUE, NEW_VALUE].join(", "));
            assert.isTrue(onChange.calledOnce);
            assert.deepEqual(onChange.args[0][0], [...VALUES, NEW_VALUE, NEW_VALUE, NEW_VALUE]);
        });

        it("is invoked when a tag is removed by clicking", () => {
            const onChange = sinon.stub();
            const wrapper = mount(<TagInput onChange={onChange} values={VALUES} />);
            wrapper
                .find("button")
                .at(1)
                .simulate("click");
            assert.isTrue(onChange.calledOnce);
            assert.deepEqual(onChange.args[0][0], [VALUES[0], VALUES[2]]);
        });

        it("is invoked when a tag is removed by backspace", () => {
            const onChange = sinon.stub();
            const wrapper = mount(<TagInput onChange={onChange} values={VALUES} />);
            wrapper
                .find("input")
                .simulate("keydown", { which: Keys.BACKSPACE })
                .simulate("keydown", { which: Keys.BACKSPACE });
            assert.isTrue(onChange.calledOnce);
            assert.deepEqual(onChange.args[0][0], [VALUES[0], VALUES[1]]);
        });

        it("does not clear the input if onChange returns false", () => {
            const onChange = sinon.stub().returns(false);
            const wrapper = shallow(<TagInput onChange={onChange} values={VALUES} />);
            wrapper.setState({ inputValue: NEW_VALUE });
            pressEnterInInput(wrapper, NEW_VALUE);
            assert.strictEqual(wrapper.state().inputValue, NEW_VALUE);
        });

        it("clears the input if onChange returns true", () => {
            const onChange = sinon.stub().returns(true);
            const wrapper = shallow(<TagInput onChange={onChange} values={VALUES} />);
            wrapper.setState({ inputValue: NEW_VALUE });
            pressEnterInInput(wrapper, NEW_VALUE);
            assert.strictEqual(wrapper.state().inputValue, "");
        });

        it("clears the input if onChange returns nothing", () => {
            const onChange = sinon.spy();
            const wrapper = shallow(<TagInput onChange={onChange} values={VALUES} />);
            wrapper.setState({ inputValue: NEW_VALUE });
            pressEnterInInput(wrapper, NEW_VALUE);
            assert.strictEqual(wrapper.state().inputValue, "");
        });
    });

    describe("placeholder", () => {
        it("appears only when values is empty", () => {
            const wrapper = shallow(<TagInput placeholder="hold the door" values={[]} />);
            assert.strictEqual(wrapper.find("input").prop("placeholder"), "hold the door", "empty array");
            wrapper.setProps({ values: [undefined] });
            assert.strictEqual(wrapper.find("input").prop("placeholder"), "hold the door", "[undefined]");
            wrapper.setProps({ values: VALUES });
            assert.isUndefined(wrapper.find("input").prop("placeholder"), "normal values");
        });

        it("inputProps.placeholder appears all the time", () => {
            const wrapper = shallow(<TagInput inputProps={{ placeholder: "hold the door" }} values={[]} />);
            assert.strictEqual(wrapper.find("input").prop("placeholder"), "hold the door");
            wrapper.setProps({ values: VALUES });
            assert.strictEqual(wrapper.find("input").prop("placeholder"), "hold the door");
        });

        it("setting both shows placeholder when empty and inputProps.placeholder otherwise", () => {
            const wrapper = shallow(
                <TagInput inputProps={{ placeholder: "inputProps" }} placeholder="props" values={[]} />,
            );
            assert.strictEqual(wrapper.find("input").prop("placeholder"), "props");
            wrapper.setProps({ values: VALUES });
            assert.strictEqual(wrapper.find("input").prop("placeholder"), "inputProps");
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

    it("arrow key interactions ignore falsy values", () => {
        const MIXED_VALUES = [
            undefined,
            <strong>Albert</strong>,
            false,
            ["Bar", <em key="thol">thol</em>, "omew"],
            null,
            "Casper",
            undefined,
        ];

        const onChange = sinon.spy();
        const wrapper = mount(<TagInput onChange={onChange} values={MIXED_VALUES} />);
        assert.lengthOf(wrapper.find(Tag), 3, "should render only real values");
        const input = wrapper.find("input");

        function keydownAndAssertIndex(which: number, activeIndex: number) {
            input.simulate("keydown", { which });
            assert.equal(wrapper.state("activeIndex"), activeIndex);
        }
        keydownAndAssertIndex(Keys.ARROW_LEFT, 5);
        keydownAndAssertIndex(Keys.ARROW_RIGHT, 7);
        keydownAndAssertIndex(Keys.ARROW_LEFT, 5);
        keydownAndAssertIndex(Keys.ARROW_LEFT, 3);
        keydownAndAssertIndex(Keys.BACKSPACE, 1);

        assert.isTrue(onChange.calledOnce);
        assert.lengthOf(
            onChange.args[0][0],
            MIXED_VALUES.length - 1,
            "should remove one item and preserve other falsy values",
        );
    });

    function pressEnterInInput(wrapper: ShallowWrapper<any, any>, value: string) {
        wrapper.find("input").simulate("keydown", {
            currentTarget: { value },
            which: Keys.ENTER,
        });
    }
});
