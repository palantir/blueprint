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

import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";

import { EditableText } from "./editableText";

describe("<EditableText>", () => {
    it("renders value", () => {
        render(<EditableText value="alphabet" />);
        expect(screen.queryByText("alphabet")).toBeInTheDocument();
    });

    it("renders defaultValue", () => {
        render(<EditableText defaultValue="default" />);
        expect(screen.queryByText("default")).toBeInTheDocument();
    });

    it("value takes precedence over defaultValue", () => {
        render(<EditableText value="controlled" defaultValue="uncontrolled" />);
        expect(screen.queryByText("controlled")).toBeInTheDocument();
        expect(screen.queryByText("uncontrolled")).not.toBeInTheDocument();
    });

    it("renders placeholder", () => {
        render(<EditableText placeholder="Edit..." />);
        expect(screen.queryByText("Edit...")).toBeInTheDocument();
    });

    it("cannot be edited when disabled", () => {
        const { container } = render(<EditableText disabled={true} isEditing={true} />);
        // When disabled + isEditing, the component should NOT be in editing state
        const input = container.querySelector("input");
        expect(input).not.toBeInTheDocument();
    });

    it("allows resetting controlled value to undefined", () => {
        const { rerender } = render(<EditableText isEditing={false} placeholder="placeholder" value="alphabet" />);
        expect(screen.queryByText("alphabet")).toBeInTheDocument();
        rerender(<EditableText isEditing={false} placeholder="placeholder" value={undefined} />);
        expect(screen.queryByText("placeholder")).toBeInTheDocument();
    });

    it("passes an ID to the underlying span", () => {
        const { container } = render(<EditableText disabled={true} isEditing={true} contentId="my-id" />);
        const span = container.querySelector(`#my-id`);
        expect(span).toBeInTheDocument();
    });

    describe("when editing", () => {
        it('renders <input type="text"> when editing', () => {
            render(<EditableText isEditing={true} />);
            const textbox = screen.getByRole<HTMLInputElement>("textbox");
            expect(textbox).toHaveAttribute("type", "text");
        });

        it("unrenders input when done editing", () => {
            const { rerender } = render(<EditableText isEditing={true} placeholder="Edit..." value="alphabet" />);
            expect(screen.queryByRole("textbox")).toBeInTheDocument();
            rerender(<EditableText isEditing={false} placeholder="Edit..." value="alphabet" />);
            expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
        });

        it("calls onChange when input is changed", async () => {
            const changeSpy = vi.fn();
            // Note: using controlled component (value prop), so fireEvent.change is needed
            // to directly set values since user.clear() won't work on controlled inputs
            render(<EditableText isEditing={true} onChange={changeSpy} placeholder="Edit..." value="alphabet" />);
            const textbox = screen.getByRole<HTMLInputElement>("textbox");

            fireEvent.change(textbox, { target: { value: "hello" } });
            fireEvent.change(textbox, { target: { value: " " } });
            fireEvent.change(textbox, { target: { value: "world" } });
            expect(changeSpy).toHaveBeenCalledTimes(3);
            expect(changeSpy.mock.calls).toEqual([["hello"], [" "], ["world"]]);
        });

        it("calls onChange when escape key pressed and value is unconfirmed", async () => {
            const user = userEvent.setup();
            const changeSpy = vi.fn();
            render(
                <EditableText isEditing={true} onChange={changeSpy} placeholder="Edit..." defaultValue="alphabet" />,
            );
            const textbox = screen.getByRole<HTMLInputElement>("textbox");

            await user.clear(textbox);
            await user.type(textbox, "hello");
            await user.keyboard("{Escape}");

            // Last call should be the revert to original value
            expect(changeSpy).toHaveBeenLastCalledWith("alphabet");
        });

        it("calls onCancel, does not call onConfirm, and reverts value when escape key pressed", async () => {
            const user = userEvent.setup();
            const cancelSpy = vi.fn();
            const confirmSpy = vi.fn();

            const OLD_VALUE = "alphabet";
            const NEW_VALUE = "hello";

            const { container } = render(
                <EditableText isEditing={true} onCancel={cancelSpy} onConfirm={confirmSpy} defaultValue={OLD_VALUE} />,
            );
            const textbox = screen.getByRole<HTMLInputElement>("textbox");

            await user.clear(textbox);
            await user.type(textbox, NEW_VALUE);
            await user.keyboard("{Escape}");

            expect(confirmSpy).not.toHaveBeenCalled();
            expect(cancelSpy).toHaveBeenCalledOnce();
            expect(cancelSpy).toHaveBeenCalledWith(OLD_VALUE);
            // After escape, the component exits edit mode and displays the reverted value in the span
            const content = container.querySelector(`.${Classes.EDITABLE_TEXT_CONTENT}`);
            expect(content).toBeInTheDocument();
            expect(content).toHaveTextContent(OLD_VALUE);
        });

        it("calls onConfirm, does not call onCancel, and saves value when enter key pressed", async () => {
            const user = userEvent.setup();
            const cancelSpy = vi.fn();
            const confirmSpy = vi.fn();

            const OLD_VALUE = "alphabet";
            const NEW_VALUE = "hello";

            render(
                <EditableText isEditing={true} onCancel={cancelSpy} onConfirm={confirmSpy} defaultValue={OLD_VALUE} />,
            );
            const textbox = screen.getByRole<HTMLInputElement>("textbox");

            await user.clear(textbox);
            await user.type(textbox, NEW_VALUE);
            await user.keyboard("{Enter}");

            expect(cancelSpy).not.toHaveBeenCalled();
            expect(confirmSpy).toHaveBeenCalledOnce();
            expect(confirmSpy).toHaveBeenCalledWith(NEW_VALUE);
        });

        it("calls onConfirm when enter key pressed even if value didn't change", async () => {
            const user = userEvent.setup();
            const cancelSpy = vi.fn();
            const confirmSpy = vi.fn();

            const OLD_VALUE = "alphabet";
            const NEW_VALUE = "hello";

            render(
                <EditableText isEditing={true} onCancel={cancelSpy} onConfirm={confirmSpy} defaultValue={OLD_VALUE} />,
            );
            const textbox = screen.getByRole<HTMLInputElement>("textbox");

            await user.clear(textbox);
            await user.type(textbox, NEW_VALUE); // change
            await user.clear(textbox);
            await user.type(textbox, OLD_VALUE); // revert
            await user.keyboard("{Enter}");

            expect(cancelSpy).not.toHaveBeenCalled();
            expect(confirmSpy).toHaveBeenCalledOnce();
            expect(confirmSpy).toHaveBeenCalledWith(OLD_VALUE);
        });

        it("calls onEdit when entering edit mode and passes the initial value to the callback", async () => {
            const user = userEvent.setup();
            const editSpy = vi.fn();
            const INIT_VALUE = "hello";
            const { container } = render(<EditableText onEdit={editSpy} defaultValue={INIT_VALUE} />);
            const div = container.querySelector<HTMLElement>(`.${Classes.EDITABLE_TEXT}`);
            expect(div).toBeInTheDocument();

            await user.click(div!);

            expect(editSpy).toHaveBeenCalledOnce();
            expect(editSpy).toHaveBeenCalledWith(INIT_VALUE);
        });

        it("stops editing when disabled", () => {
            const { container } = render(<EditableText isEditing={true} disabled={true} />);
            const input = container.querySelector("input");
            expect(input).not.toBeInTheDocument();
        });

        it("caret is placed at the end of the input box", () => {
            render(<EditableText isEditing={true} value="alphabet" />);
            const textbox = screen.getByRole<HTMLInputElement>("textbox");
            expect(textbox.selectionStart).toBe(8);
            expect(textbox.selectionEnd).toBe(8);
        });

        it("controlled mode can only change value via props", async () => {
            const user = userEvent.setup();
            let expected = "alphabet";
            const { rerender } = render(<EditableText isEditing={true} value={expected} />);
            const textbox = screen.getByRole<HTMLInputElement>("textbox");

            await user.type(textbox, "hello");
            expect(textbox).toHaveValue(expected);

            expected = "hello world";
            rerender(<EditableText isEditing={true} value={expected} />);
            expect(textbox).toHaveValue(expected);
        });

        it("applies defaultValue only on initial render", async () => {
            const user = userEvent.setup();
            const { rerender } = render(
                <EditableText isEditing={true} defaultValue="default" placeholder="placeholder" />,
            );
            const textbox = screen.getByDisplayValue("default");

            // type new value, then change a prop to cause re-render
            await user.clear(textbox);
            await user.type(textbox, "hello");
            rerender(<EditableText isEditing={true} defaultValue="default" placeholder="new placeholder" />);
            expect(screen.queryByDisplayValue("hello")).toBeInTheDocument();
        });

        it("the full input box is highlighted when selectAllOnFocus is true", () => {
            render(<EditableText isEditing={true} selectAllOnFocus={true} value="alphabet" />);
            const textbox = screen.getByRole<HTMLInputElement>("textbox");
            expect(textbox.selectionStart).toBe(0);
            expect(textbox.selectionEnd).toBe(8);
        });
    });

    describe("multiline", () => {
        it("renders a <textarea> when editing", () => {
            const { container } = render(<EditableText isEditing={true} multiline={true} />);
            const textarea = container.querySelector("textarea");
            expect(textarea).toBeInTheDocument();
        });

        it("does not call onConfirm when enter key is pressed", async () => {
            const user = userEvent.setup();
            const confirmSpy = vi.fn();
            const { container } = render(<EditableText isEditing={true} onConfirm={confirmSpy} multiline={true} />);
            const textarea = container.querySelector("textarea")!;

            await user.type(textarea, "hello");
            await user.keyboard("{Enter}");

            expect(confirmSpy).not.toHaveBeenCalled();
        });

        it("calls onConfirm when cmd+, ctrl+, shift+, or alt+ enter is pressed", async () => {
            const user = userEvent.setup();
            const confirmSpy = vi.fn();

            // Test ctrl+Enter
            const { container: container1, unmount: unmount1 } = render(
                <EditableText isEditing={true} onConfirm={confirmSpy} multiline={true} />,
            );
            const textarea1 = container1.querySelector("textarea")!;
            await user.type(textarea1, "control");
            await user.keyboard("{Control>}{Enter}{/Control}");
            expect(confirmSpy).toHaveBeenCalledTimes(1);
            unmount1();

            // Test meta+Enter
            const { container: container2, unmount: unmount2 } = render(
                <EditableText isEditing={true} onConfirm={confirmSpy} multiline={true} />,
            );
            const textarea2 = container2.querySelector("textarea")!;
            await user.type(textarea2, "meta");
            await user.keyboard("{Meta>}{Enter}{/Meta}");
            expect(confirmSpy).toHaveBeenCalledTimes(2);
            unmount2();

            // Test shift+Enter
            const { container: container3, unmount: unmount3 } = render(
                <EditableText isEditing={true} onConfirm={confirmSpy} multiline={true} />,
            );
            const textarea3 = container3.querySelector("textarea")!;
            await user.type(textarea3, "shift");
            await user.keyboard("{Shift>}{Enter}{/Shift}");
            expect(confirmSpy).toHaveBeenCalledTimes(3);
            unmount3();

            // Test alt+Enter
            const { container: container4 } = render(
                <EditableText isEditing={true} onConfirm={confirmSpy} multiline={true} />,
            );
            const textarea4 = container4.querySelector("textarea")!;
            await user.type(textarea4, "alt");
            await user.keyboard("{Alt>}{Enter}{/Alt}");
            expect(confirmSpy).toHaveBeenCalledTimes(4);

            expect(confirmSpy).toHaveBeenNthCalledWith(1, "control");
            expect(confirmSpy).toHaveBeenNthCalledWith(2, "meta");
            expect(confirmSpy).toHaveBeenNthCalledWith(3, "shift");
            expect(confirmSpy).toHaveBeenNthCalledWith(4, "alt");
        });

        it("confirmOnEnterKey={true} calls onConfirm when enter is pressed", async () => {
            const user = userEvent.setup();
            const confirmSpy = vi.fn();
            const { container } = render(
                <EditableText isEditing={true} onConfirm={confirmSpy} multiline={true} confirmOnEnterKey={true} />,
            );
            const textarea = container.querySelector("textarea")!;

            await user.type(textarea, "control");
            await user.keyboard("{Enter}");

            expect(confirmSpy).toHaveBeenCalledOnce();
            expect(confirmSpy).toHaveBeenCalledWith("control");
        });

        it("confirmOnEnterKey={true} adds newline when cmd+, ctrl+, shift+, or alt+ enter is pressed", () => {
            const confirmSpy = vi.fn();
            const { container } = render(
                <EditableText isEditing={true} onConfirm={confirmSpy} multiline={true} confirmOnEnterKey={true} />,
            );
            const textarea = container.querySelector("textarea")!;

            // Note: using fireEvent for precise control over modifier key combinations

            // Ctrl+Enter should add a newline, not confirm
            fireEvent.change(textarea, { target: { value: "" } });
            fireEvent.keyDown(textarea, { ctrlKey: true, key: "Enter" });
            expect(textarea).toHaveValue("\n");

            // Reset textarea value
            fireEvent.change(textarea, { target: { value: "" } });
            fireEvent.keyDown(textarea, { key: "Enter", metaKey: true });
            expect(textarea).toHaveValue("\n");

            // Reset textarea value
            fireEvent.change(textarea, { target: { value: "" } });
            fireEvent.keyDown(textarea, { key: "Enter", shiftKey: true });
            expect(textarea).toHaveValue("\n");

            // Reset textarea value
            fireEvent.change(textarea, { target: { value: "" } });
            fireEvent.keyDown(textarea, { altKey: true, key: "Enter" });
            expect(textarea).toHaveValue("\n");

            // Should still be in editing mode (textarea should exist)
            expect(container.querySelector("textarea")).toBeInTheDocument();
            expect(confirmSpy).not.toHaveBeenCalled();
        });
    });

    describe("custom attributes", () => {
        const customProps = {
            "aria-label": "Edit description",
            "data-gramm": "false",
            spellCheck: false,
        };

        it("passes custom attributes to textarea when multiline is true", () => {
            const { container } = render(
                <EditableText isEditing={true} multiline={true} customInputAttributes={customProps} />,
            );
            const textarea = container.querySelector("textarea")!;
            expect(textarea).toHaveAttribute("data-gramm", "false");
            expect(textarea).toHaveAttribute("spellcheck", "false");
            expect(textarea).toHaveAttribute("aria-label", "Edit description");
        });

        it("passes custom attributes to input when multiline is false", () => {
            const { container } = render(
                <EditableText isEditing={true} multiline={false} customInputAttributes={customProps} />,
            );
            const input = container.querySelector("input")!;
            expect(input).toHaveAttribute("data-gramm", "false");
            expect(input).toHaveAttribute("spellcheck", "false");
            expect(input).toHaveAttribute("aria-label", "Edit description");
        });
    });
});
