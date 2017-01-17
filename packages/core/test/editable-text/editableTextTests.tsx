/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { assert } from "chai";
import { mount, ReactWrapper, shallow } from "enzyme";
import * as React from "react";
import * as ReactDOM from "react-dom";

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
            const changeSpy = sinon.spy();
            const wrapper = shallow(
                <EditableText isEditing={true} onChange={changeSpy} placeholder="Edit..." value="alphabet" />,
            );
            wrapper.find("input")
                .simulate("change", { target: { value: "hello" } })
                .simulate("change", { target: { value: " " } })
                .simulate("change", { target: { value: "world" } });
            assert.isTrue(changeSpy.calledThrice, "onChange not called thrice");
            assert.deepEqual(changeSpy.args, [["hello"], [" "], ["world"]]);
        });

        it("calls onCancel when escape key pressed", () => {
            const cancelSpy = sinon.spy();
            shallow(
                <EditableText isEditing={true} onCancel={cancelSpy} placeholder="Edit..." defaultValue="alphabet" />,
            ).find("input")
                .simulate("change", { target: { value: "hello" } })
                .simulate("keydown", { which: Keys.ESCAPE });
            assert.isTrue(cancelSpy.calledOnce, "onCancel not called once");
            assert.isTrue(cancelSpy.calledWith("alphabet"), `unexpected argument "${cancelSpy.args[0][0]}"`);
        });

        it("calls onConfirm when enter key pressed", () => {
            const confirmSpy = sinon.spy();
            shallow(<EditableText isEditing={true} onConfirm={confirmSpy} defaultValue="alphabet" />)
                .find("input")
                .simulate("change", { target: { value: "hello" } })
                .simulate("keydown", { which: Keys.ENTER });
            assert.isTrue(confirmSpy.calledOnce, "onConfirm not called once");
            assert.isTrue(confirmSpy.calledWith("hello"), `unexpected argument "${confirmSpy.args[0][0]}"`);
        });

        it("does not call onCancel when value not changed and escape key pressed", () => {
            const confirmSpy = sinon.spy();
            shallow(<EditableText isEditing={true} onConfirm={confirmSpy} defaultValue="alphabet" />)
                .find("input")
                .simulate("keydown", { which: Keys.ESCAPE });
            assert.isTrue(confirmSpy.notCalled);
        });

        it("does not call onConfirm when value not changed and enter key pressed", () => {
            const confirmSpy = sinon.spy();
            shallow(<EditableText isEditing={true} onConfirm={confirmSpy} defaultValue="alphabet" />)
                .find("input")
                .simulate("keydown", { which: Keys.ENTER });
            assert.isTrue(confirmSpy.notCalled);
        });

        it("calls onEdit when entering edit mode", () => {
            const editSpy = sinon.spy();
            shallow(<EditableText onEdit={editSpy} />)
                .find("div")
                .simulate("focus");
            assert.isTrue(editSpy.calledOnce, "onEdit called once");
        });

        it("stops editing when disabled", () => {
            const wrapper = shallow(<EditableText isEditing={true} disabled={true} />);
            assert.isFalse(wrapper.state("isEditing"));
        });

        it("caret is placed at the end of the input box", () => {
            // mount into a DOM element so we can get the input to inspect its HTML props
            const attachTo = document.createElement("div");
            mount(<EditableText isEditing={true} value="alphabet" />, { attachTo });
            const input = attachTo.query("input") as HTMLInputElement;
            assert.strictEqual(input.selectionStart, 8);
            assert.strictEqual(input.selectionEnd, 8);
        });

        it("controlled mode can only change value via props", () => {
            let expected = "alphabet";
            const wrapper = mount(<EditableText isEditing={true} value={expected} />);
            const inputElement = ReactDOM.findDOMNode(wrapper.instance()).query("input") as HTMLInputElement;

            const input = wrapper.find("input");
            input.simulate("change", { target: { value: "hello" } });
            assert.strictEqual(inputElement.value, expected, "controlled mode can only change via props");

            expected = "hello world";
            wrapper.setProps({ value: expected });
            assert.strictEqual(inputElement.value, expected, "controlled mode should be changeable via props");
        });

        // TODO: does not work in Phantom, only in Chrome (input.selectionStart is also equal to 8)
        xit("the full input box is highlighted when selectAllOnFocus is true", () => {
            const attachTo = document.createElement("div");
            mount(<EditableText isEditing={true} selectAllOnFocus={true} value="alphabet" />, { attachTo });
            const input = attachTo.query("input") as HTMLInputElement;
            assert.strictEqual(input.selectionStart, 0);
            assert.strictEqual(input.selectionEnd, 8);
        });
    });

    describe("multiline", () => {
        it("renders a <textarea> when editing", () => {
            assert.lengthOf(shallow(<EditableText isEditing multiline />).find("textarea"), 1);
        });

        it("does not call onConfirm when enter key is pressed", () => {
            const confirmSpy = sinon.spy();
            shallow(<EditableText isEditing={true} onConfirm={confirmSpy} multiline />)
                .find("textarea")
                .simulate("change", { target: { value: "hello" } })
                .simulate("keydown", { which: Keys.ENTER });
            assert.isTrue(confirmSpy.notCalled, "onConfirm called");
        });

        it("calls onConfirm when cmd+, ctrl+, shift+, or alt+ enter is pressed", () => {
            const confirmSpy = sinon.spy();
            const wrapper = mount(<EditableText isEditing={true} onConfirm={confirmSpy} multiline />);
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
            const confirmSpy = sinon.spy();
            const wrapper = mount(
                <EditableText isEditing={true} onConfirm={confirmSpy} multiline confirmOnEnterKey />,
            );
            simulateHelper(wrapper, "control", { which: Keys.ENTER });
            assert.isFalse(wrapper.state("isEditing"));
            assert.isTrue(confirmSpy.calledOnce, "onConfirm not called");
            assert.strictEqual(confirmSpy.firstCall.args[0], "control");
        });

        it("confirmOnEnterKey={true} adds newline when cmd+, ctrl+, shift+, or alt+ enter is pressed", () => {
            const confirmSpy = sinon.spy();
            const wrapper = mount(
                <EditableText isEditing={true} onConfirm={confirmSpy} multiline confirmOnEnterKey />,
            );
            const textarea = ReactDOM.findDOMNode(wrapper.instance()).query("textarea") as HTMLTextAreaElement;
            // pass "" as second argument since Phantom does not update cursor properly after a simulated value change
            // Chrome: "control" => "control\n"
            // Phantom: "control" => "\ncontrol"
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
            wrapper.find("textarea").simulate("change", { target: { value } }).simulate("keydown", e);
        }
    });
});
