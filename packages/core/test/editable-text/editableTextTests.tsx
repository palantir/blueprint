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

import { assert } from "chai";
import { mount, ReactWrapper, shallow } from "enzyme";
import * as React from "react";
import { spy } from "sinon";

import * as Keys from "../../src/common/keys";
import { EditableText } from "../../src/index";

describe("<EditableText>", () => {
    it("renders value", () => {
        assert.equal(shallow(<EditableText value="alphabet" />).text(), "alphabet");
    });

    it("renders defaultValue", () => {
        assert.equal(shallow(<EditableText defaultValue="default" />).text(), "default");
    });

    it("renders placeholder", () => {
        assert.equal(shallow(<EditableText placeholder="Edit..." />).text(), "Edit...");
    });

    it("cannot be edited when disabled", () => {
        const editable = shallow(<EditableText disabled={true} isEditing={true} />);
        assert.isFalse(editable.state("isEditing"));
    });

    describe("when editing", () => {
        it('renders <input type="text"> when editing', () => {
            const input = shallow(<EditableText isEditing={true} />).find("input");
            assert.lengthOf(input, 1);
            assert.strictEqual(input.prop("type"), "text");
        });

        it("unrenders input when done editing", () => {
            const wrapper = shallow(<EditableText isEditing={true} placeholder="Edit..." value="alphabet" />);
            assert.lengthOf(wrapper.find("input"), 1);
            wrapper.setProps({ isEditing: false });
            assert.lengthOf(wrapper.find("input"), 0);
        });

        it("calls onChange when input is changed", () => {
            const changeSpy = spy();
            const wrapper = mount(
                <EditableText isEditing={true} onChange={changeSpy} placeholder="Edit..." value="alphabet" />,
            );
            wrapper
                .find("input")
                .simulate("change", { target: { value: "hello" } })
                .simulate("change", { target: { value: " " } })
                .simulate("change", { target: { value: "world" } });
            assert.isTrue(changeSpy.calledThrice, "onChange not called thrice");
            assert.deepEqual(changeSpy.args, [["hello"], [" "], ["world"]]);
        });

        it("calls onChange when escape key pressed and value is unconfirmed", () => {
            const changeSpy = spy();
            mount(<EditableText isEditing={true} onChange={changeSpy} placeholder="Edit..." defaultValue="alphabet" />)
                .find("input")
                .simulate("change", { target: { value: "hello" } })
                .simulate("keydown", { which: Keys.ESCAPE });
            assert.equal(changeSpy.callCount, 2, "onChange not called twice"); // change & escape
            assert.deepEqual(changeSpy.args[1], ["alphabet"], `unexpected argument "${changeSpy.args[1][0]}"`);
        });

        it("calls onCancel, does not call onConfirm, and reverts value when escape key pressed", () => {
            const cancelSpy = spy();
            const confirmSpy = spy();

            const OLD_VALUE = "alphabet";
            const NEW_VALUE = "hello";

            const component = mount<EditableText>(
                <EditableText isEditing={true} onCancel={cancelSpy} onConfirm={confirmSpy} defaultValue={OLD_VALUE} />,
            );
            component
                .find("input")
                .simulate("change", { target: { value: NEW_VALUE } })
                .simulate("keydown", { which: Keys.ESCAPE });

            assert.isTrue(confirmSpy.notCalled, "onConfirm called");
            assert.isTrue(cancelSpy.calledOnce, "onCancel not called once");
            assert.isTrue(cancelSpy.calledWith(OLD_VALUE), `unexpected argument "${cancelSpy.args[0][0]}"`);
            assert.strictEqual(component.state().value, OLD_VALUE, "did not revert to original value");
        });

        it("calls onConfirm, does not call onCancel, and saves value when enter key pressed", () => {
            const cancelSpy = spy();
            const confirmSpy = spy();

            const OLD_VALUE = "alphabet";
            const NEW_VALUE = "hello";

            const component = mount<EditableText>(
                <EditableText isEditing={true} onCancel={cancelSpy} onConfirm={confirmSpy} defaultValue={OLD_VALUE} />,
            );
            component
                .find("input")
                .simulate("change", { target: { value: NEW_VALUE } })
                .simulate("keydown", { which: Keys.ENTER });

            assert.isTrue(cancelSpy.notCalled, "onCancel called");
            assert.isTrue(confirmSpy.calledOnce, "onConfirm not called once");
            assert.isTrue(confirmSpy.calledWith(NEW_VALUE), `unexpected argument "${confirmSpy.args[0][0]}"`);
            assert.strictEqual(component.state().value, NEW_VALUE, "did not save new value");
        });

        it("calls onConfirm when enter key pressed even if value didn't change", () => {
            const cancelSpy = spy();
            const confirmSpy = spy();

            const OLD_VALUE = "alphabet";
            const NEW_VALUE = "hello";

            const component = mount(
                <EditableText isEditing={true} onCancel={cancelSpy} onConfirm={confirmSpy} defaultValue={OLD_VALUE} />,
            );
            component
                .find("input")
                .simulate("change", { target: { value: NEW_VALUE } }) // change
                .simulate("change", { target: { value: OLD_VALUE } }) // revert
                .simulate("keydown", { which: Keys.ENTER });

            assert.isTrue(cancelSpy.notCalled, "onCancel called");
            assert.isTrue(confirmSpy.calledOnce, "onConfirm not called once");
            assert.isTrue(confirmSpy.calledWith(OLD_VALUE), `unexpected argument "${confirmSpy.args[0][0]}"`);
        });

        it("calls onEdit when entering edit mode and passes the initial value to the callback", () => {
            const editSpy = spy();
            const INIT_VALUE = "hello";
            mount(<EditableText onEdit={editSpy} defaultValue={INIT_VALUE} />)
                .find("div")
                .simulate("focus");
            assert.isTrue(editSpy.calledOnce, "onEdit called once");
            assert.isTrue(editSpy.calledWith(INIT_VALUE), `unexpected argument "${editSpy.args[0][0]}"`);
        });

        it("stops editing when disabled", () => {
            const wrapper = mount(<EditableText isEditing={true} disabled={true} />);
            assert.isFalse(wrapper.state("isEditing"));
        });

        it("caret is placed at the end of the input box", () => {
            // mount into a DOM element so we can get the input to inspect its HTML props
            const attachTo = document.createElement("div");
            mount(<EditableText isEditing={true} value="alphabet" />, { attachTo });
            const input = attachTo.querySelector("input") as HTMLInputElement;
            assert.strictEqual(input.selectionStart, 8);
            assert.strictEqual(input.selectionEnd, 8);
        });

        it("controlled mode can only change value via props", () => {
            let expected = "alphabet";
            const wrapper = mount(<EditableText isEditing={true} value={expected} />);
            const inputElement = wrapper.getDOMNode().querySelector("input") as HTMLInputElement;

            const input = wrapper.find("input");
            input.simulate("change", { target: { value: "hello" } });
            assert.strictEqual(inputElement.value, expected, "controlled mode can only change via props");

            expected = "hello world";
            wrapper.setProps({ value: expected });
            assert.strictEqual(inputElement.value, expected, "controlled mode should be changeable via props");
        });

        it("applies defaultValue only on initial render", () => {
            const wrapper = mount(<EditableText isEditing={true} defaultValue="default" placeholder="placeholder" />);
            assert.strictEqual(wrapper.state("value"), "default");
            // type new value, then change a prop to cause re-render
            wrapper.find("input").simulate("change", { target: { value: "hello" } });
            wrapper.setProps({ placeholder: "new placeholder" });
            assert.strictEqual(wrapper.state("value"), "hello");
        });

        it("the full input box is highlighted when selectAllOnFocus is true", () => {
            const attachTo = document.createElement("div");
            mount(<EditableText isEditing={true} selectAllOnFocus={true} value="alphabet" />, { attachTo });
            const input = attachTo.querySelector("input") as HTMLInputElement;
            assert.strictEqual(input.selectionStart, 0);
            assert.strictEqual(input.selectionEnd, 8);
        });
    });

    describe("multiline", () => {
        it("renders a <textarea> when editing", () => {
            assert.lengthOf(mount(<EditableText isEditing={true} multiline={true} />).find("textarea"), 1);
        });

        it("does not call onConfirm when enter key is pressed", () => {
            const confirmSpy = spy();
            mount(<EditableText isEditing={true} onConfirm={confirmSpy} multiline={true} />)
                .find("textarea")
                .simulate("change", { target: { value: "hello" } })
                .simulate("keydown", { which: Keys.ENTER });
            assert.isTrue(confirmSpy.notCalled, "onConfirm called");
        });

        it("calls onConfirm when cmd+, ctrl+, shift+, or alt+ enter is pressed", () => {
            const confirmSpy = spy();
            const wrapper = mount(<EditableText isEditing={true} onConfirm={confirmSpy} multiline={true} />);
            simulateHelper(wrapper, "control", { ctrlKey: true, which: Keys.ENTER });
            wrapper.setState({ isEditing: true });
            simulateHelper(wrapper, "meta", { metaKey: true, which: Keys.ENTER });
            wrapper.setState({ isEditing: true });
            simulateHelper(wrapper, "shift", {
                preventDefault: (): void => undefined,
                shiftKey: true,
                which: Keys.ENTER,
            });
            wrapper.setState({ isEditing: true });
            simulateHelper(wrapper, "alt", {
                altKey: true,
                preventDefault: (): void => undefined,
                which: Keys.ENTER,
            });
            assert.isFalse(wrapper.state("isEditing"));
            assert.strictEqual(confirmSpy.callCount, 4, "onConfirm not called four times");
            assert.strictEqual(confirmSpy.firstCall.args[0], "control");
            assert.strictEqual(confirmSpy.secondCall.args[0], "meta");
            assert.strictEqual(confirmSpy.thirdCall.args[0], "shift");
            assert.strictEqual(confirmSpy.lastCall.args[0], "alt");
        });

        it("confirmOnEnterKey={true} calls onConfirm when enter is pressed", () => {
            const confirmSpy = spy();
            const wrapper = mount(
                <EditableText isEditing={true} onConfirm={confirmSpy} multiline={true} confirmOnEnterKey={true} />,
            );
            simulateHelper(wrapper, "control", { which: Keys.ENTER });
            assert.isFalse(wrapper.state("isEditing"));
            assert.isTrue(confirmSpy.calledOnce, "onConfirm not called");
            assert.strictEqual(confirmSpy.firstCall.args[0], "control");
        });

        it("confirmOnEnterKey={true} adds newline when cmd+, ctrl+, shift+, or alt+ enter is pressed", () => {
            const confirmSpy = spy();
            const wrapper = mount(
                <EditableText isEditing={true} onConfirm={confirmSpy} multiline={true} confirmOnEnterKey={true} />,
            );
            const textarea = wrapper.getDOMNode().querySelector("textarea") as HTMLTextAreaElement;
            simulateHelper(wrapper, "", { ctrlKey: true, target: textarea, which: Keys.ENTER });
            assert.strictEqual(textarea.value, "\n");
            simulateHelper(wrapper, "", { metaKey: true, target: textarea, which: Keys.ENTER });
            assert.strictEqual(textarea.value, "\n");
            simulateHelper(wrapper, "", {
                preventDefault: (): void => undefined,
                shiftKey: true,
                target: textarea,
                which: Keys.ENTER,
            });
            assert.strictEqual(textarea.value, "\n");
            simulateHelper(wrapper, "", {
                altKey: true,
                preventDefault: (): void => undefined,
                target: textarea,
                which: Keys.ENTER,
            });
            assert.strictEqual(textarea.value, "\n");
            assert.isTrue(wrapper.state("isEditing"));
            assert.isTrue(confirmSpy.notCalled, "onConfirm called");
        });

        // fake interface because React's KeyboardEvent properties are not optional
        interface IFakeKeyboardEvent {
            altKey?: boolean;
            ctrlKey?: boolean;
            metaKey?: boolean;
            shiftKey?: boolean;
            target?: HTMLTextAreaElement;
            which?: number;
            preventDefault?(): void;
        }

        function simulateHelper(wrapper: ReactWrapper<any, {}>, value: string, e: IFakeKeyboardEvent) {
            wrapper
                .find("textarea")
                .simulate("change", { target: { value } })
                .simulate("keydown", e);
        }
    });
});
