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

import { act, fireEvent, render, type RenderResult } from "@testing-library/react";
import { cloneElement, createRef } from "react";

import { describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { EditableText } from "./editableText";

interface RenderedEditable {
    container: HTMLElement;
    instance: EditableText;
    rerender: RenderResult["rerender"];
}

function renderEditable(ui: React.ReactElement, options: { container?: HTMLElement } = {}): RenderedEditable {
    const ref = createRef<EditableText>();
    const cloned = cloneElement(ui, { ref } as any);
    const result = render(cloned, options);
    return { container: result.container, instance: ref.current!, rerender: result.rerender };
}

describe("<EditableText>", () => {
    it("renders value", () => {
        const { container } = renderEditable(<EditableText value="alphabet" />);
        expect(container.textContent).toBe("alphabet");
    });

    it("renders defaultValue", () => {
        const { container } = renderEditable(<EditableText defaultValue="default" />);
        expect(container.textContent).toBe("default");
    });

    it("renders placeholder", () => {
        const { container } = renderEditable(<EditableText placeholder="Edit..." />);
        expect(container.textContent).toBe("Edit...");
    });

    it("cannot be edited when disabled", () => {
        const { instance } = renderEditable(<EditableText disabled={true} isEditing={true} />);
        expect(instance.state.isEditing).toBe(false);
    });

    it("allows resetting controlled value to undefined or null", () => {
        const { container, rerender } = renderEditable(
            <EditableText isEditing={false} placeholder="placeholder" value="alphabet" />,
        );
        expect(container.textContent).toBe("alphabet");
        rerender(<EditableText isEditing={false} placeholder="placeholder" value={null as unknown as string} />);
        expect(container.textContent).toBe("placeholder");
    });

    it("passes an ID to the underlying span", () => {
        const { container } = renderEditable(<EditableText disabled={true} isEditing={true} contentId="my-id" />);
        expect(container.querySelector("[id='my-id']")).not.toBeNull();
    });

    describe("when editing", () => {
        it('renders <input type="text"> when editing', () => {
            const { container } = renderEditable(<EditableText isEditing={true} />);
            const inputs = container.querySelectorAll<HTMLInputElement>("input");
            expect(inputs).toHaveLength(1);
            expect(inputs[0].type).toBe("text");
        });

        it("unrenders input when done editing", () => {
            const { container, rerender } = renderEditable(
                <EditableText isEditing={true} placeholder="Edit..." value="alphabet" />,
            );
            expect(container.querySelectorAll("input")).toHaveLength(1);
            rerender(<EditableText isEditing={false} placeholder="Edit..." value="alphabet" />);
            expect(container.querySelectorAll("input")).toHaveLength(0);
        });

        it("calls onChange when input is changed", () => {
            const changeSpy = vi.fn();
            const { container } = renderEditable(
                <EditableText isEditing={true} onChange={changeSpy} placeholder="Edit..." value="alphabet" />,
            );
            const input = container.querySelector("input")!;
            fireEvent.change(input, { target: { value: "hello" } });
            fireEvent.change(input, { target: { value: " " } });
            fireEvent.change(input, { target: { value: "world" } });
            expect(changeSpy).toHaveBeenCalledTimes(3);
            expect(changeSpy.mock.calls).toEqual([["hello"], [" "], ["world"]]);
        });

        it("calls onChange when escape key pressed and value is unconfirmed", () => {
            const changeSpy = vi.fn();
            const { container } = renderEditable(
                <EditableText isEditing={true} onChange={changeSpy} placeholder="Edit..." defaultValue="alphabet" />,
            );
            const input = container.querySelector("input")!;
            fireEvent.change(input, { target: { value: "hello" } });
            fireEvent.keyDown(input, { key: "Escape" });
            expect(changeSpy).toHaveBeenCalledTimes(2); // change & escape
            expect(changeSpy.mock.calls[1]).toEqual(["alphabet"]);
        });

        it("calls onCancel, does not call onConfirm, and reverts value when escape key pressed", () => {
            const cancelSpy = vi.fn();
            const confirmSpy = vi.fn();

            const OLD_VALUE = "alphabet";
            const NEW_VALUE = "hello";

            const { container, instance } = renderEditable(
                <EditableText isEditing={true} onCancel={cancelSpy} onConfirm={confirmSpy} defaultValue={OLD_VALUE} />,
            );
            const input = container.querySelector("input")!;
            fireEvent.change(input, { target: { value: NEW_VALUE } });
            fireEvent.keyDown(input, { key: "Escape" });

            expect(confirmSpy).not.toHaveBeenCalled();
            expect(cancelSpy).toHaveBeenCalledOnce();
            expect(cancelSpy.mock.calls[0][0]).toBe(OLD_VALUE);
            expect(instance.state.value, "did not revert to original value").toBe(OLD_VALUE);
        });

        it("calls onConfirm, does not call onCancel, and saves value when enter key pressed", () => {
            const cancelSpy = vi.fn();
            const confirmSpy = vi.fn();

            const OLD_VALUE = "alphabet";
            const NEW_VALUE = "hello";

            const { container, instance } = renderEditable(
                <EditableText isEditing={true} onCancel={cancelSpy} onConfirm={confirmSpy} defaultValue={OLD_VALUE} />,
            );
            const input = container.querySelector("input")!;
            fireEvent.change(input, { target: { value: NEW_VALUE } });
            fireEvent.keyDown(input, { key: "Enter" });

            expect(cancelSpy).not.toHaveBeenCalled();
            expect(confirmSpy).toHaveBeenCalledOnce();
            expect(confirmSpy.mock.calls[0][0]).toBe(NEW_VALUE);
            expect(instance.state.value, "did not save new value").toBe(NEW_VALUE);
        });

        it("calls onConfirm when enter key pressed even if value didn't change", () => {
            const cancelSpy = vi.fn();
            const confirmSpy = vi.fn();

            const OLD_VALUE = "alphabet";
            const NEW_VALUE = "hello";

            const { container } = renderEditable(
                <EditableText isEditing={true} onCancel={cancelSpy} onConfirm={confirmSpy} defaultValue={OLD_VALUE} />,
            );
            const input = container.querySelector("input")!;
            fireEvent.change(input, { target: { value: NEW_VALUE } }); // change
            fireEvent.change(input, { target: { value: OLD_VALUE } }); // revert
            fireEvent.keyDown(input, { key: "Enter" });

            expect(cancelSpy).not.toHaveBeenCalled();
            expect(confirmSpy).toHaveBeenCalledOnce();
            expect(confirmSpy.mock.calls[0][0]).toBe(OLD_VALUE);
        });

        it("calls onEdit when entering edit mode and passes the initial value to the callback", () => {
            const editSpy = vi.fn();
            const INIT_VALUE = "hello";
            const { container } = renderEditable(<EditableText onEdit={editSpy} defaultValue={INIT_VALUE} />);
            // The root div in non-editing mode is the focusable element.
            fireEvent.focus(container.firstElementChild!);
            expect(editSpy).toHaveBeenCalledOnce();
            expect(editSpy.mock.calls[0][0]).toBe(INIT_VALUE);
        });

        it("stops editing when disabled", () => {
            const { instance } = renderEditable(<EditableText isEditing={true} disabled={true} />);
            expect(instance.state.isEditing).toBe(false);
        });

        it("caret is placed at the end of the input box", () => {
            const containerElement = document.createElement("div");
            document.body.appendChild(containerElement);
            renderEditable(<EditableText isEditing={true} value="alphabet" />, { container: containerElement });
            const input = containerElement.querySelector<HTMLInputElement>("input")!;
            expect(input.selectionStart).toBe(8);
            expect(input.selectionEnd).toBe(8);
            containerElement.remove();
        });

        it("controlled mode can only change value via props", () => {
            let expected = "alphabet";
            const { container, rerender } = renderEditable(<EditableText isEditing={true} value={expected} />);
            const input = container.querySelector<HTMLInputElement>("input")!;
            fireEvent.change(input, { target: { value: "hello" } });
            expect(input.value, "controlled mode can only change via props").toBe(expected);

            expected = "hello world";
            rerender(<EditableText isEditing={true} value={expected} />);
            expect(input.value, "controlled mode should be changeable via props").toBe(expected);
        });

        it("applies defaultValue only on initial render", () => {
            const { container, instance, rerender } = renderEditable(
                <EditableText isEditing={true} defaultValue="default" placeholder="placeholder" />,
            );
            expect(instance.state.value).toBe("default");
            const input = container.querySelector("input")!;
            fireEvent.change(input, { target: { value: "hello" } });
            rerender(<EditableText isEditing={true} defaultValue="default" placeholder="new placeholder" />);
            expect(instance.state.value).toBe("hello");
        });

        it("the full input box is highlighted when selectAllOnFocus is true", () => {
            const containerElement = document.createElement("div");
            document.body.appendChild(containerElement);
            renderEditable(<EditableText isEditing={true} selectAllOnFocus={true} value="alphabet" />, {
                container: containerElement,
            });
            const input = containerElement.querySelector<HTMLInputElement>("input")!;
            expect(input.selectionStart).toBe(0);
            expect(input.selectionEnd).toBe(8);
            containerElement.remove();
        });
    });

    describe("multiline", () => {
        it("renders a <textarea> when editing", () => {
            const { container } = renderEditable(<EditableText isEditing={true} multiline={true} />);
            expect(container.querySelectorAll("textarea")).toHaveLength(1);
        });

        it("does not call onConfirm when enter key is pressed", () => {
            const confirmSpy = vi.fn();
            const { container } = renderEditable(
                <EditableText isEditing={true} onConfirm={confirmSpy} multiline={true} />,
            );
            const ta = container.querySelector("textarea")!;
            fireEvent.change(ta, { target: { value: "hello" } });
            fireEvent.keyDown(ta, { key: "Enter" });
            expect(confirmSpy).not.toHaveBeenCalled();
        });

        it("calls onConfirm when cmd+, ctrl+, shift+, or alt+ enter is pressed", () => {
            const confirmSpy = vi.fn();
            const { container, instance } = renderEditable(
                <EditableText isEditing={true} onConfirm={confirmSpy} multiline={true} />,
            );
            const findTa = () => container.querySelector<HTMLTextAreaElement>("textarea")!;
            simulateHelper(findTa(), "control", { ctrlKey: true, key: "Enter" });
            // Re-enter editing mode to repeat (each Enter combo confirms and exits edit mode).
            act(() => instance.setState({ isEditing: true }));
            simulateHelper(findTa(), "meta", { key: "Enter", metaKey: true });
            act(() => instance.setState({ isEditing: true }));
            simulateHelper(findTa(), "shift", { key: "Enter", shiftKey: true });
            act(() => instance.setState({ isEditing: true }));
            simulateHelper(findTa(), "alt", { altKey: true, key: "Enter" });

            expect(instance.state.isEditing).toBe(false);
            expect(confirmSpy).toHaveBeenCalledTimes(4);
            expect(confirmSpy.mock.calls[0][0]).toBe("control");
            expect(confirmSpy.mock.calls[1][0]).toBe("meta");
            expect(confirmSpy.mock.calls[2][0]).toBe("shift");
            expect(confirmSpy.mock.calls[3][0]).toBe("alt");
        });

        it("confirmOnEnterKey={true} calls onConfirm when enter is pressed", () => {
            const confirmSpy = vi.fn();
            const { container, instance } = renderEditable(
                <EditableText isEditing={true} onConfirm={confirmSpy} multiline={true} confirmOnEnterKey={true} />,
            );
            const ta = container.querySelector("textarea")!;
            simulateHelper(ta, "control", { key: "Enter" });
            expect(instance.state.isEditing).toBe(false);
            expect(confirmSpy).toHaveBeenCalledOnce();
            expect(confirmSpy.mock.calls[0][0]).toBe("control");
        });

        it("confirmOnEnterKey={true} adds newline when cmd+, ctrl+, shift+, or alt+ enter is pressed", () => {
            const confirmSpy = vi.fn();
            const { container, instance } = renderEditable(
                <EditableText isEditing={true} onConfirm={confirmSpy} multiline={true} confirmOnEnterKey={true} />,
            );
            const textarea = container.querySelector<HTMLTextAreaElement>("textarea")!;
            simulateHelper(textarea, "", { ctrlKey: true, key: "Enter" });
            expect(textarea.value).toBe("\n");
            simulateHelper(textarea, "", { key: "Enter", metaKey: true });
            expect(textarea.value).toBe("\n");
            simulateHelper(textarea, "", { key: "Enter", shiftKey: true });
            expect(textarea.value).toBe("\n");
            simulateHelper(textarea, "", { altKey: true, key: "Enter" });
            expect(textarea.value).toBe("\n");
            expect(instance.state.isEditing).toBe(true);
            expect(confirmSpy).not.toHaveBeenCalled();
        });

        interface FakeKeyboardEvent {
            altKey?: boolean;
            ctrlKey?: boolean;
            key?: string;
            metaKey?: boolean;
            shiftKey?: boolean;
        }

        function simulateHelper(textarea: HTMLTextAreaElement, value: string, e: FakeKeyboardEvent) {
            fireEvent.change(textarea, { target: { value } });
            fireEvent.keyDown(textarea, e);
        }
    });

    describe("custom attributes", () => {
        const customProps = {
            "aria-label": "Edit description",
            "data-gramm": "false",
            spellCheck: false,
        };

        it("passes custom attributes to textarea when multiline is true", () => {
            const { container } = renderEditable(
                <EditableText isEditing={true} multiline={true} customInputAttributes={customProps} />,
            );
            const textarea = container.querySelector("textarea")!;
            expect(textarea.getAttribute("data-gramm")).toBe("false");
            expect(textarea.getAttribute("spellcheck")).toBe("false");
            // ^ note: React `spellCheck={false}` serializes to attribute `spellcheck="false"`
            expect(textarea.getAttribute("aria-label")).toBe("Edit description");
        });

        it("passes custom attributes to input when multiline is false", () => {
            const { container } = renderEditable(
                <EditableText isEditing={true} multiline={false} customInputAttributes={customProps} />,
            );
            const input = container.querySelector("input")!;
            expect(input.getAttribute("data-gramm")).toBe("false");
            expect(input.getAttribute("spellcheck")).toBe("false");
            expect(input.getAttribute("aria-label")).toBe("Edit description");
        });
    });
});
