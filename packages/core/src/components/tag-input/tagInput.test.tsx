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

import { waitFor } from "@testing-library/dom";
import { type MountRendererProps, type ReactWrapper, mount as untypedMount } from "enzyme";
import { act } from "react";

import { assert, describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Classes, Intent } from "../../common";
import { Button } from "../button/buttons";
import { Tag } from "../tag/tag";

import { TagInput, type TagInputProps } from "./tagInput";

/**
 * @see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/26979#issuecomment-465304376
 */
const mount = (el: React.ReactElement<TagInputProps>, options?: MountRendererProps) =>
    untypedMount<TagInput>(el, options);

const VALUES = ["one", "two", "three"];

describe("<TagInput>", () => {
    it("passes inputProps to input element", () => {
        const onBlur = vi.fn();
        const input = mount(<TagInput values={VALUES} inputProps={{ autoFocus: true, onBlur }} />).find("input");
        assert.isTrue(input.prop("autoFocus"));
        // check that event handler is proxied
        const fakeEvent = { flag: "yes" };
        input.prop("onBlur")?.(fakeEvent as any);
        expect(onBlur.mock.calls[0][0]).toBe(fakeEvent);
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
        const leftIcon = "add";
        const wrapper = mount(<TagInput leftIcon={leftIcon} values={VALUES} />);

        assert.isTrue(
            wrapper
                .childAt(0) // TagInput's root <div> element
                .childAt(0) // left-icon React wrapper
                .childAt(0) // left-icon <div> element
                .find(`.${Classes.ICON}`)
                .hasClass(Classes.iconClass(leftIcon)),
            `Expected .${Classes.ICON} element to have .${Classes.iconClass(leftIcon)} class`,
        );
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
        const tagProps = vi.fn();
        mount(<TagInput tagProps={tagProps} values={VALUES} />);
        expect(tagProps).toHaveBeenCalledTimes(3);
    });

    it("clicking Tag remove button invokes onRemove with that value", () => {
        const onRemove = vi.fn();
        // requires full mount to support data attributes and parentElement
        const wrapper = mount(<TagInput onRemove={onRemove} values={VALUES} />);
        wrapper.find("button").at(1).simulate("click");
        expect(onRemove).toHaveBeenCalledOnce();
        expect(onRemove.mock.calls[0]).toEqual([VALUES[1], 1]);
    });

    describe("onAdd", () => {
        const NEW_VALUE = "new item";

        it("is not invoked on enter when input is empty", () => {
            const onAdd = vi.fn();
            const wrapper = mountTagInput(onAdd);
            pressEnterInInput(wrapper, "");
            expect(onAdd).not.toHaveBeenCalled();
        });

        it("is not invoked on enter when input is composing", () => {
            const onAdd = vi.fn();
            const wrapper = mountTagInput(onAdd);
            pressEnterInInputWhenComposing(wrapper, "构成");
            expect(onAdd).not.toHaveBeenCalled();
        });

        it("is invoked on enter", () => {
            const onAdd = vi.fn();
            const wrapper = mountTagInput(onAdd);
            pressEnterInInput(wrapper, NEW_VALUE);
            expect(onAdd).toHaveBeenCalledOnce();
            expect(onAdd.mock.calls[0][0]).toEqual([NEW_VALUE]);
            expect(onAdd.mock.calls[0][1]).toEqual("default");
        });

        it("is invoked on blur when addOnBlur=true", async () => {
            const onAdd = vi.fn();
            const wrapper = mount(<TagInput values={VALUES} addOnBlur={true} onAdd={onAdd} />);
            // simulate typing input text
            wrapper.setProps({ inputProps: { value: NEW_VALUE } });
            wrapper.find("input").simulate("change", { currentTarget: { value: NEW_VALUE } });
            wrapper.simulate("blur");

            // Wait for focus to change after blur event
            await waitFor(() => {
                expect(onAdd).toHaveBeenCalledOnce();
                expect(onAdd.mock.calls[0][0]).toEqual([NEW_VALUE]);
                expect(onAdd.mock.calls[0][1]).toBe("blur");
            });
        });

        it("is not invoked on blur when addOnBlur=true but inputValue is empty", async () => {
            const onAdd = vi.fn();
            const wrapper = mount(<TagInput values={VALUES} addOnBlur={true} onAdd={onAdd} />);
            wrapper.simulate("blur");
            // Wait for focus to change after blur event
            await waitFor(() => {
                expect(onAdd).not.toHaveBeenCalled();
            });
        });

        it("is not invoked on blur when addOnBlur=false", async () => {
            const onAdd = vi.fn();
            const wrapper = mount(<TagInput values={VALUES} inputProps={{ value: NEW_VALUE }} onAdd={onAdd} />);
            wrapper.simulate("blur");
            // Wait for focus to change after blur event
            await waitFor(() => {
                expect(onAdd).not.toHaveBeenCalled();
            });
        });

        describe("when addOnPaste=true", () => {
            it("is invoked on paste if the text contains a delimiter between values", () => {
                const text = "pasted\ntext";
                const onAdd = vi.fn();
                const wrapper = mount(<TagInput values={VALUES} addOnPaste={true} onAdd={onAdd} />);
                wrapper.find("input").simulate("paste", { clipboardData: { getData: () => text } });
                expect(onAdd).toHaveBeenCalledOnce();
                expect(onAdd.mock.calls[0][0]).toEqual(["pasted", "text"]);
            });

            it("is invoked on paste if the text contains a trailing delimiter", () => {
                const text = "pasted\n";
                const onAdd = vi.fn();
                const wrapper = mount(<TagInput values={VALUES} addOnPaste={true} onAdd={onAdd} />);
                wrapper.find("input").simulate("paste", { clipboardData: { getData: () => text } });
                expect(onAdd).toHaveBeenCalledOnce();
                expect(onAdd.mock.calls[0][0]).toEqual(["pasted"]);
                expect(onAdd.mock.calls[0][1]).toBe("paste");
            });

            it("is not invoked on paste if the text does not include a delimiter", () => {
                const text = "pasted";
                const onAdd = vi.fn();
                const wrapper = mount(<TagInput values={VALUES} addOnPaste={true} onAdd={onAdd} />);
                wrapper.find("input").simulate("paste", { clipboardData: { getData: () => text } });
                expect(onAdd).not.toHaveBeenCalled();
            });
        });

        it("is not invoked on paste when addOnPaste=false", () => {
            const text = "pasted\ntext";
            const onAdd = vi.fn();
            const wrapper = mount(<TagInput values={VALUES} addOnPaste={false} onAdd={onAdd} />);
            wrapper.find("input").simulate("paste", { clipboardData: { getData: () => text } });
            expect(onAdd).not.toHaveBeenCalled();
        });

        it("does not clear the input if onAdd returns false", () => {
            const onAdd = vi.fn().mockReturnValue(false);
            const wrapper = mountTagInput(onAdd);
            act(() => {
                wrapper.setState({ inputValue: NEW_VALUE });
                pressEnterInInput(wrapper, NEW_VALUE);
            });
            assert.strictEqual(wrapper.state().inputValue, NEW_VALUE);
        });

        it("clears the input if onAdd returns true", () => {
            const onAdd = vi.fn().mockReturnValue(true);
            const wrapper = mountTagInput(onAdd);
            act(() => {
                wrapper.setState({ inputValue: NEW_VALUE });
                pressEnterInInput(wrapper, NEW_VALUE);
            });
            assert.strictEqual(wrapper.state().inputValue, "");
        });

        it("clears the input if onAdd returns nothing", () => {
            const onAdd = vi.fn();
            const wrapper = mountTagInput(onAdd);
            act(() => {
                wrapper.setState({ inputValue: NEW_VALUE });
                pressEnterInInput(wrapper, NEW_VALUE);
            });
            assert.strictEqual(wrapper.state().inputValue, "");
        });

        it("does not clear the input if the input is controlled", () => {
            const wrapper = mountTagInput(vi.fn(), { inputValue: NEW_VALUE });
            pressEnterInInput(wrapper, NEW_VALUE);
            assert.strictEqual(wrapper.state().inputValue, NEW_VALUE);
        });

        it("splits input value on separator RegExp", () => {
            const onAdd = vi.fn();
            // this is actually the defaultProps value, but reproducing here for explicitness
            const wrapper = mountTagInput(onAdd, { separator: /,\s*/g });
            // various forms of whitespace properly ignored
            pressEnterInInput(wrapper, [NEW_VALUE, NEW_VALUE, "    ", NEW_VALUE].join(",   "));
            expect(onAdd.mock.calls[0][0]).toEqual([NEW_VALUE, NEW_VALUE, NEW_VALUE]);
        });

        it("splits input value on separator string", () => {
            const onAdd = vi.fn();
            const wrapper = mountTagInput(onAdd, { separator: "  |  " });
            pressEnterInInput(wrapper, "1 |  2  |   3   |    4    |  \t  |   ");
            expect(onAdd.mock.calls[0][0]).toEqual(["1 |  2", "3", "4"]);
        });

        it("separator=false emits one-element values array", () => {
            const value = "one, two, three";
            const onAdd = vi.fn();
            const wrapper = mountTagInput(onAdd, { separator: false });
            pressEnterInInput(wrapper, value);
            expect(onAdd.mock.calls[0][0]).toEqual([value]);
        });

        function mountTagInput(onAdd: ReturnType<typeof vi.fn>, props?: Partial<TagInputProps>) {
            return mount(<TagInput onAdd={onAdd} values={VALUES} {...props} />);
        }
    });

    describe("onRemove", () => {
        it("pressing backspace focuses last item", () => {
            const onRemove = vi.fn();
            const wrapper = mount(<TagInput onRemove={onRemove} values={VALUES} />);
            wrapper.find("input").simulate("keydown", { key: "Backspace" });

            assert.equal(wrapper.state("activeIndex"), VALUES.length - 1);
            expect(onRemove).not.toHaveBeenCalled();
        });

        it("pressing backspace again removes last item", () => {
            const onRemove = vi.fn();
            const wrapper = mount(<TagInput onRemove={onRemove} values={VALUES} />);
            wrapper.find("input").simulate("keydown", { key: "Backspace" }).simulate("keydown", { key: "Backspace" });

            assert.equal(wrapper.state("activeIndex"), VALUES.length - 2);
            expect(onRemove).toHaveBeenCalledOnce();
            const lastIndex = VALUES.length - 1;
            expect(onRemove.mock.calls[0]).toEqual([VALUES[lastIndex], lastIndex]);
        });

        it("pressing left arrow key navigates active item and backspace removes it", () => {
            const onRemove = vi.fn();
            const wrapper = mount(<TagInput onRemove={onRemove} values={VALUES} />);
            // select and remove middle item
            wrapper
                .find("input")
                .simulate("keydown", { key: "ArrowLeft" })
                .simulate("keydown", { key: "ArrowLeft" })
                .simulate("keydown", { key: "Backspace" });

            assert.equal(wrapper.state("activeIndex"), 0);
            expect(onRemove).toHaveBeenCalledOnce();
            expect(onRemove.mock.calls[0]).toEqual([VALUES[1], 1]);
        });

        it("pressing left arrow key navigates active item and delete removes it", () => {
            const onRemove = vi.fn();
            const wrapper = mount(<TagInput onRemove={onRemove} values={VALUES} />);
            // select and remove middle item
            wrapper
                .find("input")
                .simulate("keydown", { key: "ArrowLeft" })
                .simulate("keydown", { key: "ArrowLeft" })
                .simulate("keydown", { key: "Delete" });

            // in this case we're not moving into the previous item but
            // we rather "take the place" of the item we just removed
            assert.equal(wrapper.state("activeIndex"), 1);
            expect(onRemove).toHaveBeenCalledOnce();
            expect(onRemove.mock.calls[0]).toEqual([VALUES[1], 1]);
        });

        it("pressing delete with no selection does nothing", () => {
            const onRemove = vi.fn();
            const wrapper = mount(<TagInput onRemove={onRemove} values={VALUES} />);

            wrapper.find("input").simulate("keydown", { key: "Delete" });

            assert.equal(wrapper.state("activeIndex"), -1);
            expect(onRemove).not.toHaveBeenCalled();
        });

        it("pressing right arrow key in initial state does nothing", () => {
            const wrapper = mount(<TagInput values={VALUES} />);
            wrapper.find("input").simulate("keydown", { key: "ArrowRight" });
            assert.equal(wrapper.state("activeIndex"), -1);
        });
    });

    describe("onChange", () => {
        const NEW_VALUE = "new item";

        it("is not invoked on enter when input is empty", () => {
            const onChange = vi.fn();
            const wrapper = mount(<TagInput onChange={onChange} values={VALUES} />);
            pressEnterInInput(wrapper, "");
            expect(onChange).not.toHaveBeenCalled();
        });

        it("is invoked on enter with non-empty input", () => {
            const onChange = vi.fn();
            const wrapper = mount(<TagInput onChange={onChange} values={VALUES} />);
            pressEnterInInput(wrapper, NEW_VALUE);
            expect(onChange).toHaveBeenCalledOnce();
            expect(onChange.mock.calls[0][0]).toEqual([...VALUES, NEW_VALUE]);
        });

        it("can add multiple tags at once with separator", () => {
            const onChange = vi.fn();
            const wrapper = mount(<TagInput onChange={onChange} values={VALUES} />);
            pressEnterInInput(wrapper, [NEW_VALUE, NEW_VALUE, NEW_VALUE].join(", "));
            expect(onChange).toHaveBeenCalledOnce();
            expect(onChange.mock.calls[0][0]).toEqual([...VALUES, NEW_VALUE, NEW_VALUE, NEW_VALUE]);
        });

        it("is invoked when a tag is removed by clicking", () => {
            const onChange = vi.fn();
            const wrapper = mount(<TagInput onChange={onChange} values={VALUES} />);
            wrapper.find("button").at(1).simulate("click");
            expect(onChange).toHaveBeenCalledOnce();
            expect(onChange.mock.calls[0][0]).toEqual([VALUES[0], VALUES[2]]);
        });

        it("is invoked when a tag is removed by backspace", () => {
            const onChange = vi.fn();
            const wrapper = mount(<TagInput onChange={onChange} values={VALUES} />);
            wrapper.find("input").simulate("keydown", { key: "Backspace" }).simulate("keydown", { key: "Backspace" });
            expect(onChange).toHaveBeenCalledOnce();
            expect(onChange.mock.calls[0][0]).toEqual([VALUES[0], VALUES[1]]);
        });

        it("does not clear the input if onChange returns false", () => {
            const onChange = vi.fn().mockReturnValue(false);
            const wrapper = mount(<TagInput onChange={onChange} values={VALUES} />);
            act(() => {
                wrapper.setState({ inputValue: NEW_VALUE });
                pressEnterInInput(wrapper, NEW_VALUE);
            });
            assert.strictEqual(wrapper.state().inputValue, NEW_VALUE);
        });

        it("clears the input if onChange returns true", () => {
            const onChange = vi.fn().mockReturnValue(true);
            const wrapper = mount(<TagInput onChange={onChange} values={VALUES} />);
            act(() => {
                wrapper.setState({ inputValue: NEW_VALUE });
                pressEnterInInput(wrapper, NEW_VALUE);
            });
            assert.strictEqual(wrapper.state().inputValue, "");
        });

        it("clears the input if onChange returns nothing", () => {
            const onChange = vi.fn();
            const wrapper = mount(<TagInput onChange={onChange} values={VALUES} />);
            act(() => {
                wrapper.setState({ inputValue: NEW_VALUE });
                pressEnterInInput(wrapper, NEW_VALUE);
            });
            assert.strictEqual(wrapper.state().inputValue, "");
        });

        it("does not clear the input if the input is controlled", () => {
            const onChange = vi.fn();
            const wrapper = mount(<TagInput onChange={onChange} values={VALUES} inputValue={NEW_VALUE} />);
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
            const wrapper = mount(<TagInput placeholder="hold the door" values={[]} />);
            assert.strictEqual(wrapper.find("input").prop("placeholder"), "hold the door", "empty array");
            wrapper.setProps({ values: [undefined] });
            assert.strictEqual(wrapper.find("input").prop("placeholder"), "hold the door", "[undefined]");
            wrapper.setProps({ values: VALUES });
            assert.isUndefined(wrapper.find("input").prop("placeholder"), "normal values");
        });

        it("inputProps.placeholder appears all the time", () => {
            const wrapper = mount(<TagInput inputProps={{ placeholder: "hold the door" }} values={[]} />);
            assert.strictEqual(wrapper.find("input").prop("placeholder"), "hold the door");
            wrapper.setProps({ values: VALUES });
            assert.strictEqual(wrapper.find("input").prop("placeholder"), "hold the door");
        });

        it("setting both shows placeholder when empty and inputProps.placeholder otherwise", () => {
            const wrapper = mount(
                <TagInput inputProps={{ placeholder: "inputProps" }} placeholder="props" values={[]} />,
            );
            assert.strictEqual(wrapper.find("input").prop("placeholder"), "props");
            wrapper.setProps({ values: VALUES });
            assert.strictEqual(wrapper.find("input").prop("placeholder"), "inputProps");
        });
    });

    describe("when input is not empty", () => {
        it("pressing backspace does not remove item", () => {
            const onRemove = vi.fn();
            const wrapper = mount(<TagInput onRemove={onRemove} values={VALUES} />);
            wrapper.find("input").simulate("keydown", createInputKeydownEventMetadata("text", "Backspace", false));
            expect(onRemove).not.toHaveBeenCalled();
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

        const onChange = vi.fn();
        const wrapper = mount(<TagInput onChange={onChange} values={MIXED_VALUES} />);
        assert.lengthOf(wrapper.find(Tag), 3, "should render only real values");
        const input = wrapper.find("input");

        function keydownAndAssertIndex(key: string, activeIndex: number) {
            input.simulate("keydown", { key });
            assert.equal(wrapper.state("activeIndex"), activeIndex);
        }
        keydownAndAssertIndex("ArrowLeft", 5);
        keydownAndAssertIndex("ArrowRight", 7);
        keydownAndAssertIndex("ArrowLeft", 5);
        keydownAndAssertIndex("ArrowLeft", 3);
        keydownAndAssertIndex("Backspace", 1);

        expect(onChange).toHaveBeenCalledOnce();
        expect(onChange.mock.calls[0][0]).toHaveLength(MIXED_VALUES.length - 1);
    });

    it("is non-interactive when disabled", () => {
        const wrapper = mount(<TagInput values={VALUES} disabled={true} />);

        assert.isTrue(
            // the wrapper is a React element; the first child is rendered <div>.
            wrapper.childAt(0).hasClass(Classes.DISABLED),
            `.${Classes.DISABLED} should be applied to tag-input`,
        );
        assert.isTrue(wrapper.find(`.${Classes.INPUT_GHOST}`).first().prop("disabled"), "input should be disabled");
        wrapper.find(Tag).forEach(tag => {
            assert.lengthOf(tag.find("." + Classes.TAG_REMOVE), 0, "tag should not have tag-remove button");
        });
    });

    describe("onInputChange", () => {
        it("is not invoked on enter when input is empty", () => {
            const onInputChange = vi.fn();
            const wrapper = mount(<TagInput onInputChange={onInputChange} values={VALUES} />);
            pressEnterInInput(wrapper, "");
            expect(onInputChange).not.toHaveBeenCalled();
        });

        it("is invoked when input text changes", () => {
            const changeSpy = vi.fn();
            const wrapper = mount(<TagInput onInputChange={changeSpy} values={VALUES} />);
            wrapper.find("input").prop("onChange")?.({ currentTarget: { value: "hello" } } as any);
            expect(changeSpy).toHaveBeenCalledOnce();
            expect(changeSpy.mock.calls[0][0].currentTarget.value).toBe("hello");
        });
    });

    describe("inputValue", () => {
        const NEW_VALUE = "new item";
        it("passes initial inputValue to input element", () => {
            const input = mount(<TagInput values={VALUES} inputValue={NEW_VALUE} />).find("input");
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
            wrapper.update();
            expect(wrapper.find("input").prop("value")).to.equal(NEW_VALUE);
        });

        it("has a default empty string value", () => {
            const input = mount(<TagInput values={VALUES} />).find("input");
            expect(input.prop("value")).to.equal("");
        });
    });

    describe("when autoResize={true}", () => {
        it("passes inputProps to input element", () => {
            const onBlur = vi.fn();
            const input = mount(
                <TagInput autoResize={true} values={VALUES} inputProps={{ autoFocus: true, onBlur }} />,
            ).find("input");
            assert.isTrue(input.prop("autoFocus"));
            // check that event handler is proxied
            const fakeEvent = { flag: "yes" };
            input.prop("onBlur")?.(fakeEvent as any);
            expect(onBlur.mock.calls[0][0]).toBe(fakeEvent);
        });

        it("renders a Tag for each value", () => {
            const wrapper = mount(<TagInput autoResize={true} values={VALUES} />);
            assert.lengthOf(wrapper.find(Tag), VALUES.length);
        });
    });

    function pressEnterInInput(wrapper: ReactWrapper<any, any>, value: string) {
        wrapper.find("input").prop("onKeyDown")?.(createInputKeydownEventMetadata(value, "Enter", false) as any);
    }

    function pressEnterInInputWhenComposing(wrapper: ReactWrapper<any, any>, value: string) {
        wrapper.find("input").prop("onKeyDown")?.(createInputKeydownEventMetadata(value, "Enter", true) as any);
    }

    function createInputKeydownEventMetadata(value: string, key: string, isComposing: boolean) {
        return {
            currentTarget: { value },
            key,
            nativeEvent: {
                isComposing,
            },
            // Enzyme throws errors if we don't mock the stopPropagation method.
            stopPropagation: () => {
                return;
            },
        };
    }
});

function runKeyPressTest(callbackName: "onKeyDown" | "onKeyUp", startIndex: number, expectedIndex: number | undefined) {
    const callbackSpy = vi.fn();
    const inputProps = { [callbackName]: vi.fn() };
    const wrapper = mount(<TagInput values={VALUES} inputProps={inputProps} {...{ [callbackName]: callbackSpy }} />);

    act(() => {
        wrapper.setState({ activeIndex: startIndex });
    });

    const eventName = callbackName === "onKeyDown" ? "keydown" : "keyup";
    wrapper.find("input").simulate("focus").simulate(eventName, { key: "Enter" });

    expect(callbackSpy).toHaveBeenCalledOnce();
    expect(callbackSpy.mock.calls[0][0].key).toBe("Enter");
    expect(callbackSpy.mock.calls[0][1]).toBe(expectedIndex);
    // invokes inputProps.callbackSpy as well
    expect(inputProps[callbackName]).toHaveBeenCalledOnce();
}
