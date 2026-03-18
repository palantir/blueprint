/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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

import { mount, type ReactWrapper, shallow } from "enzyme";
import { act } from "react";

import { describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { EditableText } from "./editableText";

describe("<EditableText>", () => {
    it("renders value", () => {
        expect(shallow(<EditableText value="alphabet" />).text()).toBe("alphabet");
    });

    it("renders defaultValue", () => {
        expect(shallow(<EditableText defaultValue="default" />).text()).toBe("default");
    });

    it("renders placeholder", () => {
        expect(shallow(<EditableText placeholder="Edit..." />).text()).toBe("Edit...");
    });

    it("cannot be edited when disabled", () => {
        const editable = shallow(<EditableText disabled={true} isEditing={true} />);
        expect(editable.state("isEditing")).toBe(false);
    });

    it("allows resetting controlled value to undefined or null", () => {
        const editable = shallow(<EditableText isEditing={false} placeholder="placeholder" value="alphabet" />);
        expect(editable.text()).toBe("alphabet");
        editable.setProps({ value: null });
        expect(editable.text()).toBe("placeholder");
    });

    it("passes an ID to the underlying span", () => {
        const editable = shallow(<EditableText disabled={true} isEditing={true} contentId="my-id" />).find("span");
        expect(editable.prop("id")).toBe("my-id");
    });

    describe("when editing", () => {
        it('renders <input type="text"> when editing', () => {
            const input = shallow(<EditableText isEditing={true} />).find("input");
            expect(input).toHaveLength(1);
            expect(input.prop("type")).toBe("text");
        });

        it("unrenders input when done editing", () => {
            const wrapper = shallow(<EditableText isEditing={true} placeholder="Edit..." value="alphabet" />);
            expect(wrapper.find("input")).toHaveLength(1);
            wrapper.setProps({ isEditing: false });
            expect(wrapper.find("input")).toHaveLength(0);
        });

        it("calls onChange when input is changed", () => {
            const changeSpy = vi.fn();
            const wrapper = mount(
                <EditableText isEditing={true} onChange={changeSpy} placeholder="Edit..." value="alphabet" />,
            );
            wrapper
                .find("input")
                .simulate("change", { target: { value: "hello" } })
                .simulate("change", { target: { value: " " } })
                .simulate("change", { target: { value: "world" } });
            expect(changeSpy).toHaveBeenCalledTimes(3);
            expect(changeSpy.mock.calls).toEqual([["hello"], [" "], ["world"]]);
        });

        it("calls onChange when escape key pressed and value is unconfirmed", () => {
            const changeSpy = vi.fn();
            mount(<EditableText isEditing={true} onChange={changeSpy} placeholder="Edit..." defaultValue="alphabet" />)
                .find("input")
                .simulate("change", { target: { value: "hello" } })
                .simulate("keydown", { key: "Escape" });
            expect(changeSpy).toHaveBeenCalledTimes(2); // change & escape
            expect(changeSpy.mock.calls[1]).toEqual(["alphabet"]);
        });

        it("calls onCancel, does not call onConfirm, and reverts value when escape key pressed", () => {
            const cancelSpy = vi.fn();
            const confirmSpy = vi.fn();

            const OLD_VALUE = "alphabet";
            const NEW_VALUE = "hello";

            const component = mount<EditableText>(
                <EditableText isEditing={true} onCancel={cancelSpy} onConfirm={confirmSpy} defaultValue={OLD_VALUE} />,
            );
            component
                .find("input")
                .simulate("change", { target: { value: NEW_VALUE } })
                .simulate("keydown", { key: "Escape" });

            expect(confirmSpy).not.toHaveBeenCalled();
            expect(cancelSpy).toHaveBeenCalledOnce();
            expect(cancelSpy.mock.calls[0][0]).toBe(OLD_VALUE);
            expect(component.state().value, "did not revert to original value").toBe(OLD_VALUE);
        });

        it("calls onConfirm, does not call onCancel, and saves value when enter key pressed", () => {
            const cancelSpy = vi.fn();
            const confirmSpy = vi.fn();

            const OLD_VALUE = "alphabet";
            const NEW_VALUE = "hello";

            const component = mount<EditableText>(
                <EditableText isEditing={true} onCancel={cancelSpy} onConfirm={confirmSpy} defaultValue={OLD_VALUE} />,
            );
            component
                .find("input")
                .simulate("change", { target: { value: NEW_VALUE } })
                .simulate("keydown", { key: "Enter" });

            expect(cancelSpy).not.toHaveBeenCalled();
            expect(confirmSpy).toHaveBeenCalledOnce();
            expect(confirmSpy.mock.calls[0][0]).toBe(NEW_VALUE);
            expect(component.state().value, "did not save new value").toBe(NEW_VALUE);
        });

        it("calls onConfirm when enter key pressed even if value didn't change", () => {
            const cancelSpy = vi.fn();
            const confirmSpy = vi.fn();

            const OLD_VALUE = "alphabet";
            const NEW_VALUE = "hello";

            const component = mount(
                <EditableText isEditing={true} onCancel={cancelSpy} onConfirm={confirmSpy} defaultValue={OLD_VALUE} />,
            );
            component
                .find("input")
                .simulate("change", { target: { value: NEW_VALUE } }) // change
                .simulate("change", { target: { value: OLD_VALUE } }) // revert
                .simulate("keydown", { key: "Enter" });

            expect(cancelSpy).not.toHaveBeenCalled();
            expect(confirmSpy).toHaveBeenCalledOnce();
            expect(confirmSpy.mock.calls[0][0]).toBe(OLD_VALUE);
        });

        it("calls onEdit when entering edit mode and passes the initial value to the callback", () => {
            const editSpy = vi.fn();
            const INIT_VALUE = "hello";
            mount(<EditableText onEdit={editSpy} defaultValue={INIT_VALUE} />)
                .find("div")
                .simulate("focus");
            expect(editSpy).toHaveBeenCalledOnce();
            expect(editSpy.mock.calls[0][0]).toBe(INIT_VALUE);
        });

        it("stops editing when disabled", () => {
            const wrapper = mount(<EditableText isEditing={true} disabled={true} />);
            expect(wrapper.state("isEditing")).toBe(false);
        });

        it("caret is placed at the end of the input box", () => {
            // mount into a DOM element so we can get the input to inspect its HTML props
            const containerElement = document.createElement("div");
            mount(<EditableText isEditing={true} value="alphabet" />, { attachTo: containerElement });
            const input = containerElement.querySelector<HTMLInputElement>("input")!;
            expect(input.selectionStart).toBe(8);
            expect(input.selectionEnd).toBe(8);
        });

        it("controlled mode can only change value via props", () => {
            let expected = "alphabet";
            const wrapper = mount(<EditableText isEditing={true} value={expected} />);
            const inputElement = wrapper.getDOMNode().querySelector<HTMLInputElement>("input")!;

            const input = wrapper.find("input");
            input.simulate("change", { target: { value: "hello" } });
            expect(inputElement.value, "controlled mode can only change via props").toBe(expected);

            expected = "hello world";
            wrapper.setProps({ value: expected });
            expect(inputElement.value, "controlled mode should be changeable via props").toBe(expected);
        });

        it("applies defaultValue only on initial render", () => {
            const wrapper = mount(<EditableText isEditing={true} defaultValue="default" placeholder="placeholder" />);
            expect(wrapper.state("value")).toBe("default");
            // type new value, then change a prop to cause re-render
            wrapper.find("input").simulate("change", { target: { value: "hello" } });
            wrapper.setProps({ placeholder: "new placeholder" });
            expect(wrapper.state("value")).toBe("hello");
        });

        it("the full input box is highlighted when selectAllOnFocus is true", () => {
            const containerElement = document.createElement("div");
            mount(<EditableText isEditing={true} selectAllOnFocus={true} value="alphabet" />, {
                attachTo: containerElement,
            });
            const input = containerElement.querySelector<HTMLInputElement>("input")!;
            expect(input.selectionStart).toBe(0);
            expect(input.selectionEnd).toBe(8);
        });
    });

    describe("multiline", () => {
        it("renders a <textarea> when editing", () => {
            expect(mount(<EditableText isEditing={true} multiline={true} />).find("textarea")).toHaveLength(1);
        });

        it("does not call onConfirm when enter key is pressed", () => {
            const confirmSpy = vi.fn();
            mount(<EditableText isEditing={true} onConfirm={confirmSpy} multiline={true} />)
                .find("textarea")
                .simulate("change", { target: { value: "hello" } })
                .simulate("keydown", { key: "Enter" });
            expect(confirmSpy).not.toHaveBeenCalled();
        });

        it("calls onConfirm when cmd+, ctrl+, shift+, or alt+ enter is pressed", () => {
            const confirmSpy = vi.fn();
            const wrapper = mount(<EditableText isEditing={true} onConfirm={confirmSpy} multiline={true} />);
            simulateHelper(wrapper, "control", { ctrlKey: true, key: "Enter" });
            act(() => {
                wrapper.setState({ isEditing: true });
            });
            simulateHelper(wrapper, "meta", { key: "Enter", metaKey: true });
            act(() => {
                wrapper.setState({ isEditing: true });
            });
            simulateHelper(wrapper, "shift", {
                key: "Enter",
                preventDefault: (): void => undefined,
                shiftKey: true,
            });
            act(() => {
                wrapper.setState({ isEditing: true });
            });
            simulateHelper(wrapper, "alt", {
                altKey: true,
                key: "Enter",
                preventDefault: (): void => undefined,
            });
            expect(wrapper.state("isEditing")).toBe(false);
            expect(confirmSpy).toHaveBeenCalledTimes(4);
            expect(confirmSpy.mock.calls[0][0]).toBe("control");
            expect(confirmSpy.mock.calls[1][0]).toBe("meta");
            expect(confirmSpy.mock.calls[2][0]).toBe("shift");
            expect(confirmSpy.mock.calls[3][0]).toBe("alt");
        });

        it("confirmOnEnterKey={true} calls onConfirm when enter is pressed", () => {
            const confirmSpy = vi.fn();
            const wrapper = mount(
                <EditableText isEditing={true} onConfirm={confirmSpy} multiline={true} confirmOnEnterKey={true} />,
            );
            simulateHelper(wrapper, "control", { key: "Enter" });
            expect(wrapper.state("isEditing")).toBe(false);
            expect(confirmSpy).toHaveBeenCalledOnce();
            expect(confirmSpy.mock.calls[0][0]).toBe("control");
        });

        it("confirmOnEnterKey={true} adds newline when cmd+, ctrl+, shift+, or alt+ enter is pressed", () => {
            const confirmSpy = vi.fn();
            const wrapper = mount(
                <EditableText isEditing={true} onConfirm={confirmSpy} multiline={true} confirmOnEnterKey={true} />,
            );
            const textarea = wrapper.getDOMNode().querySelector<HTMLTextAreaElement>("textarea")!;
            simulateHelper(wrapper, "", { ctrlKey: true, key: "Enter", target: textarea });
            expect(textarea.value).toBe("\n");
            simulateHelper(wrapper, "", { key: "Enter", metaKey: true, target: textarea });
            expect(textarea.value).toBe("\n");
            simulateHelper(wrapper, "", {
                key: "Enter",
                preventDefault: (): void => undefined,
                shiftKey: true,
                target: textarea,
            });
            expect(textarea.value).toBe("\n");
            simulateHelper(wrapper, "", {
                altKey: true,
                key: "Enter",
                preventDefault: (): void => undefined,
                target: textarea,
            });
            expect(textarea.value).toBe("\n");
            expect(wrapper.state("isEditing")).toBe(true);
            expect(confirmSpy).not.toHaveBeenCalled();
        });

        // fake interface because React's KeyboardEvent properties are not optional
        interface FakeKeyboardEvent {
            altKey?: boolean;
            ctrlKey?: boolean;
            key?: string;
            metaKey?: boolean;
            shiftKey?: boolean;
            target?: HTMLTextAreaElement;
            preventDefault?(): void;
        }

        function simulateHelper(wrapper: ReactWrapper<any>, value: string, e: FakeKeyboardEvent) {
            wrapper.find("textarea").simulate("change", { target: { value } }).simulate("keydown", e);
        }
    });

    describe("custom attributes", () => {
        const customProps = {
            "aria-label": "Edit description",
            "data-gramm": "false",
            spellcheck: "false",
        };

        it("passes custom attributes to textarea when multiline is true", () => {
            const wrapper = mount(
                <EditableText isEditing={true} multiline={true} customInputAttributes={customProps} />,
            ).find("textarea");
            expect(wrapper.prop("data-gramm")).toBe("false");
            expect(wrapper.prop("spellcheck")).toBe("false");
            expect(wrapper.prop("aria-label")).toBe("Edit description");
        });

        it("passes custom attributes to input when multiline is false", () => {
            const wrapper = mount(
                <EditableText isEditing={true} multiline={false} customInputAttributes={customProps} />,
            ).find("input");
            expect(wrapper.prop("data-gramm")).toBe("false");
            expect(wrapper.prop("spellcheck")).toBe("false");
            expect(wrapper.prop("aria-label")).toBe("Edit description");
        });
    });
});
