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

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Classes, Intent } from "../../common";

import { TagInput } from "./tagInput";

const VALUES = ["one", "two", "three"];

describe("<TagInput>", () => {
    it("passes inputProps to input element", async () => {
        const user = userEvent.setup();
        const onBlur = vi.fn();
        render(<TagInput values={VALUES} inputProps={{ autoFocus: true, onBlur }} />);
        const input = screen.getByRole("textbox");
        expect(input).toHaveFocus();
        // check that event handler is proxied
        await user.tab();
        expect(onBlur).toHaveBeenCalledOnce();
    });

    it("renders a Tag for each value", () => {
        const { container } = render(<TagInput values={VALUES} />);
        expect(container.querySelectorAll(`.${Classes.TAG}`)).toHaveLength(VALUES.length);
    });

    it("values can be valid JSX nodes", () => {
        const values = [
            <strong key="al">Albert</strong>,
            undefined,
            ["Bar", <em key="thol">thol</em>, "omew"],
            "Casper",
        ];
        const { container } = render(<TagInput values={values} />);
        // undefined does not produce a tag
        expect(container.querySelectorAll(`.${Classes.TAG}`)).toHaveLength(values.length - 1);
        expect(container.querySelectorAll("strong")).toHaveLength(1);
        expect(container.querySelectorAll("em")).toHaveLength(1);
    });

    it("leftIcon renders an icon as first child", () => {
        const leftIcon = "add";
        const { container } = render(<TagInput leftIcon={leftIcon} values={VALUES} />);
        const icon = container.querySelector(`.${Classes.ICON}`);
        expect(icon).not.toBeNull();
        expect(icon).toHaveClass(Classes.iconClass(leftIcon)!);
    });

    it("rightElement appears as last child", () => {
        render(<TagInput rightElement={<button data-testid="right-btn" />} values={VALUES} />);
        const tagInput = screen.getByRole("textbox").closest(`.${Classes.TAG_INPUT}`);
        expect(tagInput).not.toBeNull();
        expect(tagInput!.lastElementChild).toBe(screen.getByTestId("right-btn"));
    });

    it("tagProps object is applied to each Tag", () => {
        const { container } = render(<TagInput tagProps={{ intent: Intent.PRIMARY }} values={VALUES} />);
        const tags = container.querySelectorAll(`.${Classes.TAG}`);
        tags.forEach(tag => {
            expect(tag).toHaveClass(Classes.intentClass(Intent.PRIMARY)!);
        });
    });

    it("tagProps function is invoked for each Tag", () => {
        const tagProps = vi.fn();
        render(<TagInput tagProps={tagProps} values={VALUES} />);
        expect(tagProps).toHaveBeenCalledTimes(3);
    });

    it("clicking Tag remove button invokes onRemove with that value", async () => {
        const user = userEvent.setup();
        const onRemove = vi.fn();
        render(<TagInput onRemove={onRemove} values={VALUES} />);
        const removeButtons = screen.getAllByRole("button", { name: "Remove tag" });
        await user.click(removeButtons[1]);
        expect(onRemove).toHaveBeenCalledOnce();
        expect(onRemove.mock.calls[0]).toEqual([VALUES[1], 1]);
    });

    describe("onAdd", () => {
        const NEW_VALUE = "new item";

        it("is not invoked on enter when input is empty", async () => {
            const user = userEvent.setup();
            const onAdd = vi.fn();
            render(<TagInput onAdd={onAdd} values={VALUES} />);
            await user.click(screen.getByRole("textbox"));
            await user.keyboard("{Enter}");
            expect(onAdd).not.toHaveBeenCalled();
        });

        it("is not invoked on enter when input is composing", () => {
            const onAdd = vi.fn();
            render(<TagInput onAdd={onAdd} values={VALUES} />);
            const input = screen.getByRole("textbox");
            // Set a value on the input first
            fireEvent.change(input, { target: { value: "构成" } });
            // Fire keydown with nativeEvent.isComposing = true
            const event = new KeyboardEvent("keydown", {
                bubbles: true,
                key: "Enter",
            });
            // Mark the event as composing
            Object.defineProperty(event, "isComposing", { value: true });
            input.dispatchEvent(event);
            expect(onAdd).not.toHaveBeenCalled();
        });

        it("is invoked on enter", async () => {
            const user = userEvent.setup();
            const onAdd = vi.fn();
            render(<TagInput onAdd={onAdd} values={VALUES} />);
            await user.type(screen.getByRole("textbox"), NEW_VALUE);
            await user.keyboard("{Enter}");
            expect(onAdd).toHaveBeenCalledOnce();
            expect(onAdd.mock.calls[0][0]).toEqual([NEW_VALUE]);
            expect(onAdd.mock.calls[0][1]).toEqual("default");
        });

        it("is invoked on blur when addOnBlur=true", async () => {
            const onAdd = vi.fn();
            render(<TagInput values={VALUES} addOnBlur={true} onAdd={onAdd} />);
            const input = screen.getByRole("textbox");
            fireEvent.change(input, { target: { value: NEW_VALUE } });
            // Blur the container div to trigger handleContainerBlur (which uses rAF)
            fireEvent.blur(input.closest(`.${Classes.TAG_INPUT}`)!);

            await waitFor(() => {
                expect(onAdd).toHaveBeenCalledOnce();
                expect(onAdd.mock.calls[0][0]).toEqual([NEW_VALUE]);
                expect(onAdd.mock.calls[0][1]).toBe("blur");
            });
        });

        it("is not invoked on blur when addOnBlur=true but inputValue is empty", async () => {
            const onAdd = vi.fn();
            render(<TagInput values={VALUES} addOnBlur={true} onAdd={onAdd} />);
            // Blur the container div to trigger handleContainerBlur
            fireEvent.blur(screen.getByRole("textbox").closest(`.${Classes.TAG_INPUT}`)!);
            await waitFor(() => {
                expect(onAdd).not.toHaveBeenCalled();
            });
        });

        it("is not invoked on blur when addOnBlur=false", async () => {
            const onAdd = vi.fn();
            render(<TagInput values={VALUES} onAdd={onAdd} />);
            const input = screen.getByRole("textbox");
            fireEvent.change(input, { target: { value: NEW_VALUE } });
            // Blur the container div to trigger handleContainerBlur
            fireEvent.blur(input.closest(`.${Classes.TAG_INPUT}`)!);
            await waitFor(() => {
                expect(onAdd).not.toHaveBeenCalled();
            });
        });

        describe("when addOnPaste=true", () => {
            it("is invoked on paste if the text contains a delimiter between values", () => {
                const text = "pasted\ntext";
                const onAdd = vi.fn();
                render(<TagInput values={VALUES} addOnPaste={true} onAdd={onAdd} />);
                const input = screen.getByRole("textbox");
                fireEvent.paste(input, { clipboardData: { getData: () => text } });
                expect(onAdd).toHaveBeenCalledOnce();
                expect(onAdd.mock.calls[0][0]).toEqual(["pasted", "text"]);
            });

            it("is invoked on paste if the text contains a trailing delimiter", () => {
                const text = "pasted\n";
                const onAdd = vi.fn();
                render(<TagInput values={VALUES} addOnPaste={true} onAdd={onAdd} />);
                const input = screen.getByRole("textbox");
                fireEvent.paste(input, { clipboardData: { getData: () => text } });
                expect(onAdd).toHaveBeenCalledOnce();
                expect(onAdd.mock.calls[0][0]).toEqual(["pasted"]);
                expect(onAdd.mock.calls[0][1]).toBe("paste");
            });

            it("is not invoked on paste if the text does not include a delimiter", () => {
                const text = "pasted";
                const onAdd = vi.fn();
                render(<TagInput values={VALUES} addOnPaste={true} onAdd={onAdd} />);
                const input = screen.getByRole("textbox");
                fireEvent.paste(input, { clipboardData: { getData: () => text } });
                expect(onAdd).not.toHaveBeenCalled();
            });
        });

        it("is not invoked on paste when addOnPaste=false", () => {
            const text = "pasted\ntext";
            const onAdd = vi.fn();
            render(<TagInput values={VALUES} addOnPaste={false} onAdd={onAdd} />);
            const input = screen.getByRole("textbox");
            fireEvent.paste(input, { clipboardData: { getData: () => text } });
            expect(onAdd).not.toHaveBeenCalled();
        });

        it("does not clear the input if onAdd returns false", async () => {
            const user = userEvent.setup();
            const onAdd = vi.fn().mockReturnValue(false);
            render(<TagInput onAdd={onAdd} values={VALUES} />);
            await user.type(screen.getByRole("textbox"), NEW_VALUE);
            await user.keyboard("{Enter}");
            expect(screen.getByRole("textbox")).toHaveValue(NEW_VALUE);
        });

        it("clears the input if onAdd returns true", async () => {
            const user = userEvent.setup();
            const onAdd = vi.fn().mockReturnValue(true);
            render(<TagInput onAdd={onAdd} values={VALUES} />);
            await user.type(screen.getByRole("textbox"), NEW_VALUE);
            await user.keyboard("{Enter}");
            expect(screen.getByRole("textbox")).toHaveValue("");
        });

        it("clears the input if onAdd returns nothing", async () => {
            const user = userEvent.setup();
            const onAdd = vi.fn();
            render(<TagInput onAdd={onAdd} values={VALUES} />);
            await user.type(screen.getByRole("textbox"), NEW_VALUE);
            await user.keyboard("{Enter}");
            expect(screen.getByRole("textbox")).toHaveValue("");
        });

        it("does not clear the input if the input is controlled", async () => {
            const user = userEvent.setup();
            render(<TagInput onAdd={vi.fn()} values={VALUES} inputValue={NEW_VALUE} />);
            await user.click(screen.getByRole("textbox"));
            await user.keyboard("{Enter}");
            expect(screen.getByRole("textbox")).toHaveValue(NEW_VALUE);
        });

        it("splits input value on separator RegExp", () => {
            const onAdd = vi.fn();
            render(<TagInput onAdd={onAdd} values={VALUES} separator={/,\s*/g} />);
            const input = screen.getByRole("textbox");
            const text = [NEW_VALUE, NEW_VALUE, "    ", NEW_VALUE].join(",   ");
            fireEvent.change(input, { target: { value: text } });
            fireEvent.keyDown(input, { key: "Enter" });
            expect(onAdd.mock.calls[0][0]).toEqual([NEW_VALUE, NEW_VALUE, NEW_VALUE]);
        });

        it("splits input value on separator string", () => {
            const onAdd = vi.fn();
            render(<TagInput onAdd={onAdd} values={VALUES} separator={"  |  "} />);
            const input = screen.getByRole("textbox");
            fireEvent.change(input, { target: { value: "1 |  2  |   3   |    4    |  \t  |   " } });
            fireEvent.keyDown(input, { key: "Enter" });
            expect(onAdd.mock.calls[0][0]).toEqual(["1 |  2", "3", "4"]);
        });

        it("separator=false emits one-element values array", () => {
            const value = "one, two, three";
            const onAdd = vi.fn();
            render(<TagInput onAdd={onAdd} values={VALUES} separator={false} />);
            const input = screen.getByRole("textbox");
            fireEvent.change(input, { target: { value } });
            fireEvent.keyDown(input, { key: "Enter" });
            expect(onAdd.mock.calls[0][0]).toEqual([value]);
        });
    });

    describe("onRemove", () => {
        it("pressing backspace focuses last item", async () => {
            const user = userEvent.setup();
            const onRemove = vi.fn();
            const onKeyDown = vi.fn();
            render(<TagInput onRemove={onRemove} onKeyDown={onKeyDown} values={VALUES} />);
            await user.click(screen.getByRole("textbox"));
            await user.keyboard("{Backspace}");

            // The last tag should be active (activeIndex = 2)
            // Tag component doesn't render active class unless interactive, so verify via onKeyDown callback
            onKeyDown.mockClear();
            await user.keyboard("{Enter}");
            expect(onKeyDown).toHaveBeenCalledOnce();
            expect(onKeyDown.mock.calls[0][1]).toBe(VALUES.length - 1);
            expect(onRemove).not.toHaveBeenCalled();
        });

        it("pressing backspace again removes last item", async () => {
            const user = userEvent.setup();
            const onRemove = vi.fn();
            render(<TagInput onRemove={onRemove} values={VALUES} />);
            await user.click(screen.getByRole("textbox"));
            await user.keyboard("{Backspace}{Backspace}");

            expect(onRemove).toHaveBeenCalledOnce();
            const lastIndex = VALUES.length - 1;
            expect(onRemove.mock.calls[0]).toEqual([VALUES[lastIndex], lastIndex]);
        });

        it("pressing left arrow key navigates active item and backspace removes it", async () => {
            const user = userEvent.setup();
            const onRemove = vi.fn();
            const onKeyDown = vi.fn();
            render(<TagInput onRemove={onRemove} onKeyDown={onKeyDown} values={VALUES} />);
            await user.click(screen.getByRole("textbox"));
            // select and remove middle item
            await user.keyboard("{ArrowLeft}{ArrowLeft}{Backspace}");

            // After removing index 1, active index moves to 0
            onKeyDown.mockClear();
            await user.keyboard("{Enter}");
            expect(onKeyDown.mock.calls[0][1]).toBe(0);
            expect(onRemove).toHaveBeenCalledOnce();
            expect(onRemove.mock.calls[0]).toEqual([VALUES[1], 1]);
        });

        it("pressing left arrow key navigates active item and delete removes it", async () => {
            const user = userEvent.setup();
            const onRemove = vi.fn();
            render(<TagInput onRemove={onRemove} values={VALUES} />);
            await user.click(screen.getByRole("textbox"));
            // select and remove middle item
            await user.keyboard("{ArrowLeft}{ArrowLeft}{Delete}");

            expect(onRemove).toHaveBeenCalledOnce();
            expect(onRemove.mock.calls[0]).toEqual([VALUES[1], 1]);
        });

        it("pressing delete with no selection does nothing", async () => {
            const user = userEvent.setup();
            const onRemove = vi.fn();
            const { container } = render(<TagInput onRemove={onRemove} values={VALUES} />);
            await user.click(screen.getByRole("textbox"));
            await user.keyboard("{Delete}");

            // No tag should be active
            const activeTags = container.querySelectorAll(`.${Classes.TAG}.${Classes.ACTIVE}`);
            expect(activeTags).toHaveLength(0);
            expect(onRemove).not.toHaveBeenCalled();
        });

        it("pressing right arrow key in initial state does nothing", async () => {
            const user = userEvent.setup();
            const { container } = render(<TagInput values={VALUES} />);
            await user.click(screen.getByRole("textbox"));
            await user.keyboard("{ArrowRight}");
            const activeTags = container.querySelectorAll(`.${Classes.TAG}.${Classes.ACTIVE}`);
            expect(activeTags).toHaveLength(0);
        });
    });

    describe("onChange", () => {
        const NEW_VALUE = "new item";

        it("is not invoked on enter when input is empty", async () => {
            const user = userEvent.setup();
            const onChange = vi.fn();
            render(<TagInput onChange={onChange} values={VALUES} />);
            await user.click(screen.getByRole("textbox"));
            await user.keyboard("{Enter}");
            expect(onChange).not.toHaveBeenCalled();
        });

        it("is invoked on enter with non-empty input", async () => {
            const user = userEvent.setup();
            const onChange = vi.fn();
            render(<TagInput onChange={onChange} values={VALUES} />);
            await user.type(screen.getByRole("textbox"), NEW_VALUE);
            await user.keyboard("{Enter}");
            expect(onChange).toHaveBeenCalledOnce();
            expect(onChange.mock.calls[0][0]).toEqual([...VALUES, NEW_VALUE]);
        });

        it("can add multiple tags at once with separator", () => {
            const onChange = vi.fn();
            render(<TagInput onChange={onChange} values={VALUES} />);
            const input = screen.getByRole("textbox");
            fireEvent.change(input, { target: { value: [NEW_VALUE, NEW_VALUE, NEW_VALUE].join(", ") } });
            fireEvent.keyDown(input, { key: "Enter" });
            expect(onChange).toHaveBeenCalledOnce();
            expect(onChange.mock.calls[0][0]).toEqual([...VALUES, NEW_VALUE, NEW_VALUE, NEW_VALUE]);
        });

        it("is invoked when a tag is removed by clicking", async () => {
            const user = userEvent.setup();
            const onChange = vi.fn();
            render(<TagInput onChange={onChange} values={VALUES} />);
            const removeButtons = screen.getAllByRole("button", { name: "Remove tag" });
            await user.click(removeButtons[1]);
            expect(onChange).toHaveBeenCalledOnce();
            expect(onChange.mock.calls[0][0]).toEqual([VALUES[0], VALUES[2]]);
        });

        it("is invoked when a tag is removed by backspace", async () => {
            const user = userEvent.setup();
            const onChange = vi.fn();
            render(<TagInput onChange={onChange} values={VALUES} />);
            await user.click(screen.getByRole("textbox"));
            await user.keyboard("{Backspace}{Backspace}");
            expect(onChange).toHaveBeenCalledOnce();
            expect(onChange.mock.calls[0][0]).toEqual([VALUES[0], VALUES[1]]);
        });

        it("does not clear the input if onChange returns false", async () => {
            const user = userEvent.setup();
            const onChange = vi.fn().mockReturnValue(false);
            render(<TagInput onChange={onChange} values={VALUES} />);
            await user.type(screen.getByRole("textbox"), NEW_VALUE);
            await user.keyboard("{Enter}");
            expect(screen.getByRole("textbox")).toHaveValue(NEW_VALUE);
        });

        it("clears the input if onChange returns true", async () => {
            const user = userEvent.setup();
            const onChange = vi.fn().mockReturnValue(true);
            render(<TagInput onChange={onChange} values={VALUES} />);
            await user.type(screen.getByRole("textbox"), NEW_VALUE);
            await user.keyboard("{Enter}");
            expect(screen.getByRole("textbox")).toHaveValue("");
        });

        it("clears the input if onChange returns nothing", async () => {
            const user = userEvent.setup();
            const onChange = vi.fn();
            render(<TagInput onChange={onChange} values={VALUES} />);
            await user.type(screen.getByRole("textbox"), NEW_VALUE);
            await user.keyboard("{Enter}");
            expect(screen.getByRole("textbox")).toHaveValue("");
        });

        it("does not clear the input if the input is controlled", async () => {
            const user = userEvent.setup();
            const onChange = vi.fn();
            render(<TagInput onChange={onChange} values={VALUES} inputValue={NEW_VALUE} />);
            await user.click(screen.getByRole("textbox"));
            await user.keyboard("{Enter}");
            expect(screen.getByRole("textbox")).toHaveValue(NEW_VALUE);
        });
    });

    describe("onKeyDown", () => {
        it("emits the active tag index on key down", async () => {
            const user = userEvent.setup();
            const callbackSpy = vi.fn();
            const inputOnKeyDown = vi.fn();
            render(<TagInput values={VALUES} onKeyDown={callbackSpy} inputProps={{ onKeyDown: inputOnKeyDown }} />);
            await user.click(screen.getByRole("textbox"));
            // Navigate left twice to get to index 1
            await user.keyboard("{ArrowLeft}{ArrowLeft}");
            callbackSpy.mockClear();
            inputOnKeyDown.mockClear();
            // Now press Enter with active index = 1
            await user.keyboard("{Enter}");
            // userEvent.keyboard fires both keyDown and keyUp, so check the keyDown call
            const keyDownCalls = callbackSpy.mock.calls.filter((call: any[]) => call[0].type === "keydown");
            expect(keyDownCalls).toHaveLength(1);
            expect(keyDownCalls[0][0].key).toBe("Enter");
            expect(keyDownCalls[0][1]).toBe(1);
            const inputKeyDownCalls = inputOnKeyDown.mock.calls.filter((call: any[]) => call[0].type === "keydown");
            expect(inputKeyDownCalls).toHaveLength(1);
        });

        it("emits undefined on key down if no active index", async () => {
            const user = userEvent.setup();
            const callbackSpy = vi.fn();
            const inputOnKeyDown = vi.fn();
            render(<TagInput values={VALUES} onKeyDown={callbackSpy} inputProps={{ onKeyDown: inputOnKeyDown }} />);
            await user.click(screen.getByRole("textbox"));
            await user.keyboard("{Enter}");
            // userEvent.keyboard fires both keyDown and keyUp, so check the keyDown call
            const keyDownCalls = callbackSpy.mock.calls.filter((call: any[]) => call[0].type === "keydown");
            expect(keyDownCalls).toHaveLength(1);
            expect(keyDownCalls[0][0].key).toBe("Enter");
            expect(keyDownCalls[0][1]).toBeUndefined();
            const inputKeyDownCalls = inputOnKeyDown.mock.calls.filter((call: any[]) => call[0].type === "keydown");
            expect(inputKeyDownCalls).toHaveLength(1);
        });
    });

    describe("onKeyUp", () => {
        it("emits the active tag index on key up", async () => {
            const user = userEvent.setup();
            const callbackSpy = vi.fn();
            const inputOnKeyUp = vi.fn();
            render(<TagInput values={VALUES} onKeyUp={callbackSpy} inputProps={{ onKeyUp: inputOnKeyUp }} />);
            await user.click(screen.getByRole("textbox"));
            // Navigate left twice to get to index 1
            await user.keyboard("{ArrowLeft}{ArrowLeft}");
            callbackSpy.mockClear();
            inputOnKeyUp.mockClear();
            // Now keyup with active index = 1 — use fireEvent.keyUp for isolated keyUp event
            fireEvent.keyUp(screen.getByRole("textbox"), { key: "Enter" });
            expect(callbackSpy).toHaveBeenCalledOnce();
            expect(callbackSpy.mock.calls[0][0].key).toBe("Enter");
            expect(callbackSpy.mock.calls[0][1]).toBe(1);
            expect(inputOnKeyUp).toHaveBeenCalledOnce();
        });

        it("emits undefined on key up if no active index", () => {
            const callbackSpy = vi.fn();
            const inputOnKeyUp = vi.fn();
            render(<TagInput values={VALUES} onKeyUp={callbackSpy} inputProps={{ onKeyUp: inputOnKeyUp }} />);
            // Use fireEvent.keyUp for isolated keyUp event
            fireEvent.keyUp(screen.getByRole("textbox"), { key: "Enter" });
            expect(callbackSpy).toHaveBeenCalledOnce();
            expect(callbackSpy.mock.calls[0][0].key).toBe("Enter");
            expect(callbackSpy.mock.calls[0][1]).toBeUndefined();
            expect(inputOnKeyUp).toHaveBeenCalledOnce();
        });
    });

    describe("placeholder", () => {
        it("appears only when values is empty", () => {
            const { rerender } = render(<TagInput placeholder="hold the door" values={[]} />);
            const input = screen.getByRole("textbox");
            expect(input).toHaveAttribute("placeholder", "hold the door");
            rerender(<TagInput placeholder="hold the door" values={[undefined]} />);
            expect(input).toHaveAttribute("placeholder", "hold the door");
            rerender(<TagInput placeholder="hold the door" values={VALUES} />);
            expect(input).not.toHaveAttribute("placeholder");
        });

        it("inputProps.placeholder appears all the time", () => {
            const { rerender } = render(<TagInput inputProps={{ placeholder: "hold the door" }} values={[]} />);
            const input = screen.getByRole("textbox");
            expect(input).toHaveAttribute("placeholder", "hold the door");
            rerender(<TagInput inputProps={{ placeholder: "hold the door" }} values={VALUES} />);
            expect(input).toHaveAttribute("placeholder", "hold the door");
        });

        it("setting both shows placeholder when empty and inputProps.placeholder otherwise", () => {
            const { rerender } = render(
                <TagInput inputProps={{ placeholder: "inputProps" }} placeholder="props" values={[]} />,
            );
            const input = screen.getByRole("textbox");
            expect(input).toHaveAttribute("placeholder", "props");
            rerender(<TagInput inputProps={{ placeholder: "inputProps" }} placeholder="props" values={VALUES} />);
            expect(input).toHaveAttribute("placeholder", "inputProps");
        });
    });

    describe("when input is not empty", () => {
        it("pressing backspace does not remove item", async () => {
            const user = userEvent.setup();
            const onRemove = vi.fn();
            render(<TagInput onRemove={onRemove} values={VALUES} />);
            await user.type(screen.getByRole("textbox"), "text");
            await user.keyboard("{Backspace}");
            expect(onRemove).not.toHaveBeenCalled();
        });
    });

    it("arrow key interactions ignore falsy values", async () => {
        const user = userEvent.setup();
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
        const onKeyDown = vi.fn();
        const { container } = render(<TagInput onChange={onChange} onKeyDown={onKeyDown} values={MIXED_VALUES} />);
        expect(container.querySelectorAll(`.${Classes.TAG}`)).toHaveLength(3);
        await user.click(screen.getByRole("textbox"));

        // Navigate left from the end: should jump to index 5 ("Casper")
        await user.keyboard("{ArrowLeft}");
        expectActiveIndex(onKeyDown, 5);

        // Navigate right: should jump past undefined at 6 to end (no active tag)
        await user.keyboard("{ArrowRight}");
        // activeIndex moves to values.length (past all items), meaning no tag is selected
        expectActiveIndex(onKeyDown, MIXED_VALUES.length);

        // Navigate left again: back to "Casper" at index 5
        await user.keyboard("{ArrowLeft}");
        expectActiveIndex(onKeyDown, 5);

        // Navigate left: should skip null at 4 and go to index 3 (Bartholomew)
        await user.keyboard("{ArrowLeft}");
        expectActiveIndex(onKeyDown, 3);

        // Backspace: should remove index 3 and move to index 1 (Albert)
        await user.keyboard("{Backspace}");

        expect(onChange).toHaveBeenCalledOnce();
        expect(onChange.mock.calls[0][0]).toHaveLength(MIXED_VALUES.length - 1);
    });

    it("is non-interactive when disabled", () => {
        const { container } = render(<TagInput values={VALUES} disabled={true} />);
        const tagInputRoot = container.querySelector(`.${Classes.TAG_INPUT}`);
        expect(tagInputRoot).not.toBeNull();
        expect(tagInputRoot).toHaveClass(Classes.DISABLED);

        const input = screen.getByRole("textbox");
        expect(input).toBeDisabled();

        const removeButtons = container.querySelectorAll(`.${Classes.TAG_REMOVE}`);
        expect(removeButtons).toHaveLength(0);
    });

    describe("onInputChange", () => {
        it("is not invoked on enter when input is empty", async () => {
            const user = userEvent.setup();
            const onInputChange = vi.fn();
            render(<TagInput onInputChange={onInputChange} values={VALUES} />);
            await user.click(screen.getByRole("textbox"));
            await user.keyboard("{Enter}");
            expect(onInputChange).not.toHaveBeenCalled();
        });

        it("is invoked when input text changes", async () => {
            const user = userEvent.setup();
            const changeSpy = vi.fn();
            render(<TagInput onInputChange={changeSpy} values={VALUES} />);
            await user.type(screen.getByRole("textbox"), "hello");
            expect(changeSpy).toHaveBeenCalledTimes(5);
        });
    });

    describe("inputValue", () => {
        const NEW_VALUE = "new item";

        it("passes initial inputValue to input element", () => {
            render(<TagInput values={VALUES} inputValue={NEW_VALUE} />);
            expect(screen.getByRole("textbox")).toHaveValue(NEW_VALUE);
        });

        it("prop changes are reflected in the input element", () => {
            const { rerender } = render(<TagInput inputValue="" values={VALUES} />);
            const input = screen.getByRole("textbox");
            rerender(<TagInput inputValue="a" values={VALUES} />);
            expect(input).toHaveValue("a");
            rerender(<TagInput inputValue="b" values={VALUES} />);
            expect(input).toHaveValue("b");
            rerender(<TagInput inputValue="c" values={VALUES} />);
            expect(input).toHaveValue("c");
        });

        it("Updating inputValue updates input element", () => {
            const { rerender } = render(<TagInput inputValue="" values={VALUES} />);
            rerender(<TagInput inputValue={NEW_VALUE} values={VALUES} />);
            expect(screen.getByRole("textbox")).toHaveValue(NEW_VALUE);
        });

        it("has a default empty string value", () => {
            render(<TagInput values={VALUES} />);
            expect(screen.getByRole("textbox")).toHaveValue("");
        });
    });

    describe("when autoResize={true}", () => {
        it("passes inputProps to input element", async () => {
            const user = userEvent.setup();
            const onBlur = vi.fn();
            render(<TagInput autoResize={true} values={VALUES} inputProps={{ autoFocus: true, onBlur }} />);
            const input = screen.getByRole("textbox");
            expect(input).toHaveFocus();
            await user.tab();
            expect(onBlur).toHaveBeenCalledOnce();
        });

        it("renders a Tag for each value", () => {
            const { container } = render(<TagInput autoResize={true} values={VALUES} />);
            expect(container.querySelectorAll(`.${Classes.TAG}`)).toHaveLength(VALUES.length);
        });
    });
});

/** Asserts the active index emitted by the most recent onKeyDown call. */
function expectActiveIndex(onKeyDown: ReturnType<typeof vi.fn>, expectedIndex: number | undefined) {
    // Filter for keydown events since userEvent.keyboard fires both keydown and keyup
    const keyDownCalls = onKeyDown.mock.calls.filter((call: any[]) => call[0].type === "keydown");
    const lastCall = keyDownCalls[keyDownCalls.length - 1];
    expect(lastCall[1]).toBe(expectedIndex);
}
