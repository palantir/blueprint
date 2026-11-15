/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
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

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

import { describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";

import { EditableText, type EditableTextProps } from "./editableText";

function renderEditable(props: EditableTextProps = {}, controlledValue = false) {
    const onCancel = vi.fn();
    const onChange = vi.fn();
    const onConfirm = vi.fn();
    const onEdit = vi.fn();
    function Fixture() {
        const [value, setValue] = useState("name");
        return (
            <>
                <EditableText
                    alwaysRenderInput={true}
                    defaultValue="name"
                    customInputAttributes={{ "aria-label": "Name" }}
                    {...props}
                    value={controlledValue ? value : undefined}
                    onCancel={onCancel}
                    onChange={nextValue => {
                        onChange(nextValue);
                        if (controlledValue) {
                            setValue(nextValue);
                        }
                    }}
                    onConfirm={onConfirm}
                    onEdit={onEdit}
                />
                <button>After</button>
            </>
        );
    }
    const view = render(<Fixture />);
    const input = screen.getByRole("textbox", { name: "Name" });
    const editable = input.parentElement!;
    return { ...view, editable, input, onCancel, onChange, onConfirm, onEdit };
}

describe("<EditableText> persistent input blur", () => {
    it.each([
        { controlled: false, multiline: false },
        { controlled: true, multiline: false },
        { controlled: false, multiline: true },
    ])(
        "stays confirmed after keyboard confirmation then blur ($controlled, $multiline)",
        async ({ controlled, multiline }) => {
            const user = userEvent.setup();
            const { editable, input, onCancel, onConfirm, onEdit } = renderEditable({ multiline }, controlled);
            await user.click(input);
            await user.type(input, " updated");
            await user.keyboard(multiline ? "{Shift>}{Enter}{/Shift}" : "{Enter}");

            expect(input).toHaveFocus();
            expect(input).toHaveValue("name updated");
            expect(editable).not.toHaveClass(Classes.EDITABLE_TEXT_EDITING);
            expect(onConfirm).toHaveBeenCalledExactlyOnceWith("name updated");

            await user.tab();

            expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
            expect(editable).not.toHaveClass(Classes.EDITABLE_TEXT_EDITING);
            expect(onEdit).toHaveBeenCalledExactlyOnceWith("name");
            expect(onConfirm).toHaveBeenCalledOnce();
            expect(onCancel).not.toHaveBeenCalled();

            await user.tab({ shift: true });
            expect(input).toHaveFocus();
            expect(editable).toHaveClass(Classes.EDITABLE_TEXT_EDITING);
            expect(onEdit.mock.calls).toEqual([["name"], ["name updated"]]);
            await user.tab();
            expect(editable).not.toHaveClass(Classes.EDITABLE_TEXT_EDITING);
            expect(onConfirm.mock.calls).toEqual([["name updated"], ["name updated"]]);
        },
    );

    it.each([false, true])("stays cancelled after Escape then blur (multiline=%s)", async multiline => {
        const user = userEvent.setup();
        const { editable, input, onCancel, onChange, onConfirm, onEdit } = renderEditable({ multiline });
        await user.click(input);
        await user.type(input, " draft");
        await user.keyboard("{Escape}");

        expect(input).toHaveValue("name");
        expect(editable).not.toHaveClass(Classes.EDITABLE_TEXT_EDITING);
        expect(onCancel).toHaveBeenCalledExactlyOnceWith("name");
        expect(onChange).toHaveBeenLastCalledWith("name");

        await user.tab();

        expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
        expect(editable).not.toHaveClass(Classes.EDITABLE_TEXT_EDITING);
        expect(onEdit).toHaveBeenCalledExactlyOnceWith("name");
        expect(onCancel).toHaveBeenCalledOnce();
        expect(onConfirm).not.toHaveBeenCalled();
    });

    it.each([false, true])("confirms ordinary blur once (multiline=%s)", async multiline => {
        const user = userEvent.setup();
        const { editable, input, onCancel, onConfirm, onEdit } = renderEditable({ multiline });
        await user.click(input);
        await user.type(input, " updated");
        await user.tab();

        expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
        expect(editable).not.toHaveClass(Classes.EDITABLE_TEXT_EDITING);
        expect(onEdit).toHaveBeenCalledExactlyOnceWith("name");
        expect(onConfirm).toHaveBeenCalledExactlyOnceWith("name updated");
        expect(onCancel).not.toHaveBeenCalled();
    });

    it("keeps disabled persistent inputs out of editing mode", async () => {
        const user = userEvent.setup();
        const { editable, input, onConfirm, onEdit } = renderEditable({ disabled: true });
        expect(input).toBeDisabled();
        await user.tab();
        expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
        expect(editable).not.toHaveClass(Classes.EDITABLE_TEXT_EDITING);
        expect(onEdit).not.toHaveBeenCalled();
        expect(onConfirm).not.toHaveBeenCalled();
    });
});
