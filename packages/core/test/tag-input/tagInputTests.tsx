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

import { assert, expect } from "chai";
import {
    mount as untypedMount,
    MountRendererProps,
    shallow as untypedShallow,
    ShallowRendererProps,
    ShallowWrapper,
} from "enzyme";
import * as React from "react";
import * as sinon from "sinon";

import { Button, Classes, Intent, ITagInputProps, Keys, Tag, TagInput } from "../../src/index";

/**
 * @see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/26979#issuecomment-465304376
 */
// tslint:disable no-unnecessary-callback-wrapper
const mount = (el: React.ReactElement<ITagInputProps>, options?: MountRendererProps) =>
    untypedMount<TagInput>(el, options);
const shallow = (el: React.ReactElement<ITagInputProps>, options?: ShallowRendererProps) =>
    untypedShallow<TagInput>(el, options);
// tslint:enable no-unnecessary-callback-wrapper

const VALUES = ["one", "two", "three"];

describe("<TagInput>", () => {
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
        const values = [
            <strong key="al">Albert</strong>,
            undefined,
            ["Bar", <em key="thol">thol</em>, "omew"],
            "Casper",
        ];
        const wrapper = mount(<TagInput values={values} />);
        // undefined does not produce a tag
        assert.lengthOf(wrapper.find(Tag), values.length - 1);
        assert.lengthOf(wrapper.find("strong"), 1);
        assert.lengthOf(wrapper.find("em"), 1);
    });

    it("leftIcon renders an icon as first child", () => {
        const wrapper = mount(<TagInput leftIcon="add" values={VALUES} />);

        // use a helper since Enzyme 3 (1) includes React wrappers in .childAt()
        // calls, making them convoluted, and (2) does not preserve referential
        // identity, meaning we have to re-query elements to detect changes.
        const assertLeftIconHasClass = (className: string, errorMessage: string) => {
            const hasClass = wrapper
                .childAt(0) // TagInput's root <div> element
                .childAt(0) // left-icon React wrapper
                .childAt(0) // left-icon <div> element
                .hasClass(className);
            assert.isTrue(hasClass, errorMessage);
        };

        assertLeftIconHasClass(Classes.ICON, "icon");
    });

    it("rightElement appears as last child", () => {
        const wrapper = mount(<TagInput rightElement={<Button />} values={VALUES} />);
        assert.isTrue(
            wrapper
                .childAt(0) // TagInput's root <div> element
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
            assert.deepEqual(onAdd.args[0][1], "default");
        });

        it("is invoked on blur when addOnBlur=true", done => {
            const onAdd = sinon.stub();
            const wrapper = mount(<TagInput values={VALUES} addOnBlur={true} onAdd={onAdd} />);
            // simulate typing input text
            wrapper.setProps({ inputProps: { value: NEW_VALUE } });
            wrapper.find("input").simulate("change", { currentTarget: { value: NEW_VALUE } });
            wrapper.simulate("blur");
            // Need setTimeout here to wait for focus to change after blur event
            setTimeout(() => {
                assert.isTrue(onAdd.calledOnce);
                assert.deepEqual(onAdd.args[0][0], [NEW_VALUE]);
                assert.equal(onAdd.args[0][1], "blur");
                done();
            });
        });

        it("is not invoked on blur when addOnBlur=true but inputValue is empty", done => {
            const onAdd = sinon.stub();
            const wrapper = mount(<TagInput values={VALUES} addOnBlur={true} onAdd={onAdd} />);
            wrapper.simulate("blur");
            // Need setTimeout here to wait for focus to change after blur event
            setTimeout(() => {
                assert.isTrue(onAdd.notCalled);
                done();
            });
        });

        it("is not invoked on blur when addOnBlur=false", done => {
            const onAdd = sinon.stub();
            const wrapper = mount(<TagInput values={VALUES} inputProps={{ value: NEW_VALUE }} onAdd={onAdd} />);
            wrapper.simulate("blur");
            // Need setTimeout here to wait for focus to change after blur event
            setTimeout(() => {
                assert.isTrue(onAdd.notCalled);
                done();
            });
        });

        describe("when addOnPaste=true", () => {
            it("is invoked on paste if the text contains a delimiter between values", () => {
                const text = "pasted\ntext";
                const onAdd = sinon.stub();
                const wrapper = mount(<TagInput values={VALUES} addOnPaste={true} onAdd={onAdd} />);
                wrapper.find("input").simulate("paste", { clipboardData: { getData: () => text } });
                assert.isTrue(onAdd.calledOnce);
                assert.deepEqual(onAdd.args[0][0], ["pasted", "text"]);
            });

            it("is invoked on paste if the text contains a trailing delimiter", () => {
                const text = "pasted\n";
                const onAdd = sinon.stub();
                const wrapper = mount(<TagInput values={VALUES} addOnPaste={true} onAdd={onAdd} />);
                wrapper.find("input").simulate("paste", { clipboardData: { getData: () => text } });
                assert.isTrue(onAdd.calledOnce);
                assert.deepEqual(onAdd.args[0][0], ["pasted"]);
                assert.equal(onAdd.args[0][1], "paste");
            });

            it("is not invoked on paste if the text does not include a delimiter", () => {
                const text = "pasted";
                const onAdd = sinon.stub();
                const wrapper = mount(<TagInput values={VALUES} addOnPaste={true} onAdd={onAdd} />);
                wrapper.find("input").simulate("paste", { clipboardData: { getData: () => text } });
                assert.isTrue(onAdd.notCalled);
            });
        });

        it("is not invoked on paste when addOnPaste=false", () => {
            const text = "pasted\ntext";
            const onAdd = sinon.stub();
            const wrapper = mount(<TagInput values={VALUES} addOnPaste={false} onAdd={onAdd} />);
            wrapper.find("input").simulate("paste", { clipboardData: { getData: () => text } });
            assert.isTrue(onAdd.notCalled);
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

        it("does not clear the input if the input is controlled", () => {
            const wrapper = mountTagInput(undefined, { inputValue: NEW_VALUE });
            pressEnterInInput(wrapper, NEW_VALUE);
            assert.strictEqual(wrapper.state().inputValue, NEW_VALUE);
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

        function mountTagInput(onAdd: sinon.SinonStub, props?: Partial<ITagInputProps>) {
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

        it("does not clear the input if the input is controlled", () => {
            const onChange = sinon.stub();
            const wrapper = shallow(<TagInput onChange={onChange} values={VALUES} inputValue={NEW_VALUE} />);
            pressEnterInInput(wrapper, NEW_VALUE);
            assert.strictEqual(wrapper.state().inputValue, NEW_VALUE);
        });
    });

    describe("onKeyDown", () => {
        it("emits the active tag index on key down", () => {
            runKeyPressTest("onKeyDown", 1, 1);
        });

        it("emits undefined on key down if active index == NONE (-1)", () => {
            runKeyPressTest("onKeyDown", -1, undefined);
        });
    });

    describe("onKeyUp", () => {
        it("emits the active tag index on key down", () => {
            runKeyPressTest("onKeyUp", 1, 1);
        });

        it("emits undefined on key down if active index == NONE (-1)", () => {
            runKeyPressTest("onKeyUp", -1, undefined);
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
            wrapper.find("input").simulate("keydown", createInputKeydownEventMetadata("text", Keys.BACKSPACE));
            assert.isTrue(onRemove.notCalled);
        });
    });

    it("arrow key interactions ignore falsy values", () => {
        const MIXED_VALUES = [
            undefined,
            <strong key="al">Albert</strong>,
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

    it("is non-interactive when disabled", () => {
        const wrapper = mount(<TagInput values={VALUES} disabled={true} />);

        assert.isTrue(
            // the wrapper is a React element; the first child is rendered <div>.
            wrapper.childAt(0).hasClass(Classes.DISABLED),
            `.${Classes.DISABLED} should be applied to tag-input`,
        );
        assert.isTrue(
            wrapper
                .find(`.${Classes.INPUT_GHOST}`)
                .first()
                .prop("disabled"),
            "input should be disabled",
        );
        wrapper.find(Tag).forEach(tag => {
            assert.lengthOf(tag.find("." + Classes.TAG_REMOVE), 0, "tag should not have tag-remove button");
        });
    });

    describe("onInputChange", () => {
        it("is not invoked on enter when input is empty", () => {
            const onInputChange = sinon.stub();
            const wrapper = shallow(<TagInput onInputChange={onInputChange} values={VALUES} />);
            pressEnterInInput(wrapper, "");
            assert.isTrue(onInputChange.notCalled);
        });

        it("is invoked when input text changes", () => {
            const changeSpy: any = sinon.spy();
            const wrapper = shallow(<TagInput onInputChange={changeSpy} values={VALUES} />);
            wrapper.find("input").simulate("change", { currentTarget: { value: "hello" } });
            assert.isTrue(changeSpy.calledOnce, "onChange called");
            assert.equal("hello", changeSpy.args[0][0].currentTarget.value);
        });
    });

    describe("inputValue", () => {
        const NEW_VALUE = "new item";
        it("passes initial inputValue to input element", () => {
            const input = shallow(<TagInput values={VALUES} inputValue={NEW_VALUE} />).find("input");
            expect(input.prop("value")).to.equal(NEW_VALUE);
            expect(input.prop("value")).to.equal(NEW_VALUE);
        });

        it("prop changes are reflected in state", () => {
            const wrapper = mount(<TagInput inputValue="" values={VALUES} />);
            wrapper.setProps({ inputValue: "a" });
            expect(wrapper.state().inputValue).to.equal("a");
            wrapper.setProps({ inputValue: "b" });
            expect(wrapper.state().inputValue).to.equal("b");
            wrapper.setProps({ inputValue: "c" });
            expect(wrapper.state().inputValue).to.equal("c");
        });

        it("Updating inputValue updates input element", () => {
            const wrapper = mount(<TagInput inputValue="" values={VALUES} />);
            wrapper.setProps({ inputValue: NEW_VALUE });
            expect(wrapper.find("input").prop("value")).to.equal(NEW_VALUE);
        });

        it("has a default empty string value", () => {
            const input = shallow(<TagInput values={VALUES} />).find("input");
            expect(input.prop("value")).to.equal("");
        });
    });

    function pressEnterInInput(wrapper: ShallowWrapper<any, any>, value: string) {
        wrapper.find("input").simulate("keydown", createInputKeydownEventMetadata(value, Keys.ENTER));
    }

    function createInputKeydownEventMetadata(value: string, which: number) {
        return {
            currentTarget: { value },
            // Enzyme throws errors if we don't mock the stopPropagation method.
            stopPropagation: () => {
                return;
            },
            which,
        };
    }
});

function runKeyPressTest(callbackName: "onKeyDown" | "onKeyUp", startIndex: number, expectedIndex: number | undefined) {
    const callbackSpy = sinon.spy();
    const inputProps = { [callbackName]: sinon.spy() };
    const wrapper = mount(<TagInput values={VALUES} inputProps={inputProps} {...{ [callbackName]: callbackSpy }} />);

    wrapper.setState({ activeIndex: startIndex });

    const eventName = callbackName === "onKeyDown" ? "keydown" : "keyup";
    wrapper
        .find("input")
        .simulate("focus")
        .simulate(eventName, { which: Keys.ENTER });

    assert.strictEqual(callbackSpy.callCount, 1, "container callback call count");
    assert.strictEqual(callbackSpy.firstCall.args[0].which, Keys.ENTER, "first arg (event)");
    assert.strictEqual(callbackSpy.firstCall.args[1], expectedIndex, "second arg (active index)");
    // invokes inputProps.callbackSpy as well
    assert.strictEqual(inputProps[callbackName].callCount, 1, "inputProps.onKeyDown call count");
}
