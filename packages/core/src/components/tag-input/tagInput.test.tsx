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

import { fireEvent, render, waitFor } from "@testing-library/react";
import { createRef } from "react";

import { describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Classes, Intent } from "../../common";
import { Button } from "../button/buttons";

import { TagInput, type TagInputProps } from "./tagInput";

const VALUES = ["one", "two", "three"];

function getInput(container: HTMLElement): HTMLInputElement {
    return container.querySelector<HTMLInputElement>(`.${Classes.INPUT_GHOST}`)!;
}

function getTags(container: HTMLElement): HTMLElement[] {
    return Array.from(container.querySelectorAll<HTMLElement>(`.${Classes.TAG}`));
}

function fireKeyDown(input: HTMLInputElement, key: string) {
    input.focus();
    if (input.type === "text" || input.type === "search" || input.type === "") {
        input.setSelectionRange(0, 0);
    }
    fireEvent.keyDown(input, { key });
}

function renderTagInput(props: Partial<TagInputProps> = {}) {
    const ref = createRef<TagInput>();
    const result = render(<TagInput ref={ref} values={VALUES} {...props} />);
    return {
        container: result.container,
        instance: ref.current!,
        rerender: result.rerender,
    };
}

describe("<TagInput>", () => {
    it("passes inputProps to input element", () => {
        const onBlur = vi.fn();
        const { container } = renderTagInput({ inputProps: { autoFocus: true, onBlur } });
        const input = getInput(container);
        // React's autoFocus calls .focus() on mount; verify by activeElement.
        expect(document.activeElement).toBe(input);
        fireEvent.blur(input);
        expect(onBlur).toHaveBeenCalledOnce();
    });

    it("renders a Tag for each value", () => {
        const { container } = renderTagInput();
        expect(getTags(container)).toHaveLength(VALUES.length);
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
        expect(getTags(container)).toHaveLength(values.length - 1);
        expect(container.querySelectorAll("strong")).toHaveLength(1);
        expect(container.querySelectorAll("em")).toHaveLength(1);
    });

    it("leftIcon renders an icon as first child", () => {
        const leftIcon = "add";
        const { container } = renderTagInput({ leftIcon });
        const root = container.firstElementChild!;
        const icon = root.querySelector(`.${Classes.ICON}`);
        expect(icon).not.toBeNull();
        expect(icon!.classList.contains(Classes.iconClass(leftIcon))).toBe(true);
    });

    it("rightElement appears as last child", () => {
        const { container } = renderTagInput({ rightElement: <Button data-testid="right-btn" /> });
        const root = container.firstElementChild!;
        expect(root.lastElementChild?.matches("[data-testid='right-btn']")).toBe(true);
    });

    it("tagProps object is applied to each Tag", () => {
        const { container } = renderTagInput({ tagProps: { intent: Intent.PRIMARY } });
        getTags(container).forEach(tag => {
            expect(tag.className).toMatch(new RegExp(`-intent-${Intent.PRIMARY}`));
        });
    });

    it("tagProps function is invoked for each Tag", () => {
        const tagProps = vi.fn();
        renderTagInput({ tagProps });
        expect(tagProps).toHaveBeenCalledTimes(3);
    });

    it("clicking Tag remove button invokes onRemove with that value", () => {
        const onRemove = vi.fn();
        const { container } = renderTagInput({ onRemove });
        fireEvent.click(container.querySelectorAll("button")[1]);
        expect(onRemove).toHaveBeenCalledOnce();
        expect(onRemove.mock.calls[0]).toEqual([VALUES[1], 1]);
    });

    describe("onAdd", () => {
        const NEW_VALUE = "new item";

        it("is not invoked on enter when input is empty", () => {
            const onAdd = vi.fn();
            const { container } = renderTagInput({ onAdd });
            pressEnterInInput(container, "");
            expect(onAdd).not.toHaveBeenCalled();
        });

        it("is not invoked on enter when input is composing", () => {
            const onAdd = vi.fn();
            const { container } = renderTagInput({ onAdd });
            pressEnterInInputWhenComposing(container, "构成");
            expect(onAdd).not.toHaveBeenCalled();
        });

        it("is invoked on enter", () => {
            const onAdd = vi.fn();
            const { container } = renderTagInput({ onAdd });
            pressEnterInInput(container, NEW_VALUE);
            expect(onAdd).toHaveBeenCalledOnce();
            expect(onAdd.mock.calls[0][0]).toEqual([NEW_VALUE]);
            expect(onAdd.mock.calls[0][1]).toEqual("default");
        });

        it("is invoked on blur when addOnBlur=true", async () => {
            const onAdd = vi.fn();
            const { container } = renderTagInput({ addOnBlur: true, onAdd });
            const input = getInput(container);
            fireEvent.change(input, { target: { value: NEW_VALUE } });
            fireEvent.blur(container.firstElementChild!);

            await waitFor(() => {
                expect(onAdd).toHaveBeenCalledOnce();
                expect(onAdd.mock.calls[0][0]).toEqual([NEW_VALUE]);
                expect(onAdd.mock.calls[0][1]).toBe("blur");
            });
        });

        it("is not invoked on blur when addOnBlur=true but inputValue is empty", async () => {
            const onAdd = vi.fn();
            const { container } = renderTagInput({ addOnBlur: true, onAdd });
            fireEvent.blur(container.firstElementChild!);
            await waitFor(() => {
                expect(onAdd).not.toHaveBeenCalled();
            });
        });

        it("is not invoked on blur when addOnBlur=false", async () => {
            const onAdd = vi.fn();
            const { container } = renderTagInput({ inputProps: { value: NEW_VALUE }, onAdd });
            fireEvent.blur(container.firstElementChild!);
            await waitFor(() => {
                expect(onAdd).not.toHaveBeenCalled();
            });
        });

        describe("when addOnPaste=true", () => {
            it("is invoked on paste if the text contains a delimiter between values", () => {
                const text = "pasted\ntext";
                const onAdd = vi.fn();
                const { container } = renderTagInput({ addOnPaste: true, onAdd });
                fireEvent.paste(getInput(container), { clipboardData: { getData: () => text } });
                expect(onAdd).toHaveBeenCalledOnce();
                expect(onAdd.mock.calls[0][0]).toEqual(["pasted", "text"]);
            });

            it("is invoked on paste if the text contains a trailing delimiter", () => {
                const text = "pasted\n";
                const onAdd = vi.fn();
                const { container } = renderTagInput({ addOnPaste: true, onAdd });
                fireEvent.paste(getInput(container), { clipboardData: { getData: () => text } });
                expect(onAdd).toHaveBeenCalledOnce();
                expect(onAdd.mock.calls[0][0]).toEqual(["pasted"]);
                expect(onAdd.mock.calls[0][1]).toBe("paste");
            });

            it("is not invoked on paste if the text does not include a delimiter", () => {
                const text = "pasted";
                const onAdd = vi.fn();
                const { container } = renderTagInput({ addOnPaste: true, onAdd });
                fireEvent.paste(getInput(container), { clipboardData: { getData: () => text } });
                expect(onAdd).not.toHaveBeenCalled();
            });
        });

        it("is not invoked on paste when addOnPaste=false", () => {
            const text = "pasted\ntext";
            const onAdd = vi.fn();
            const { container } = renderTagInput({ addOnPaste: false, onAdd });
            fireEvent.paste(getInput(container), { clipboardData: { getData: () => text } });
            expect(onAdd).not.toHaveBeenCalled();
        });

        it("does not clear the input if onAdd returns false", () => {
            const onAdd = vi.fn().mockReturnValue(false);
            const { container, instance } = renderTagInput({ onAdd });
            fireEvent.change(getInput(container), { target: { value: NEW_VALUE } });
            pressEnterInInput(container, NEW_VALUE);
            expect(instance.state.inputValue).toBe(NEW_VALUE);
        });

        it("clears the input if onAdd returns true", () => {
            const onAdd = vi.fn().mockReturnValue(true);
            const { container, instance } = renderTagInput({ onAdd });
            fireEvent.change(getInput(container), { target: { value: NEW_VALUE } });
            pressEnterInInput(container, NEW_VALUE);
            expect(instance.state.inputValue).toBe("");
        });

        it("clears the input if onAdd returns nothing", () => {
            const onAdd = vi.fn();
            const { container, instance } = renderTagInput({ onAdd });
            fireEvent.change(getInput(container), { target: { value: NEW_VALUE } });
            pressEnterInInput(container, NEW_VALUE);
            expect(instance.state.inputValue).toBe("");
        });

        it("does not clear the input if the input is controlled", () => {
            const { container, instance } = renderTagInput({ inputValue: NEW_VALUE, onAdd: vi.fn() });
            pressEnterInInput(container, NEW_VALUE);
            expect(instance.state.inputValue).toBe(NEW_VALUE);
        });

        it("splits input value on separator RegExp", () => {
            const onAdd = vi.fn();
            const { container } = renderTagInput({ onAdd, separator: /,\s*/g });
            // various forms of whitespace properly ignored
            pressEnterInInput(container, [NEW_VALUE, NEW_VALUE, "    ", NEW_VALUE].join(",   "));
            expect(onAdd.mock.calls[0][0]).toEqual([NEW_VALUE, NEW_VALUE, NEW_VALUE]);
        });

        it("splits input value on separator string", () => {
            const onAdd = vi.fn();
            const { container } = renderTagInput({ onAdd, separator: "  |  " });
            pressEnterInInput(container, "1 |  2  |   3   |    4    |  \t  |   ");
            expect(onAdd.mock.calls[0][0]).toEqual(["1 |  2", "3", "4"]);
        });

        it("separator=false emits one-element values array", () => {
            const value = "one, two, three";
            const onAdd = vi.fn();
            const { container } = renderTagInput({ onAdd, separator: false });
            pressEnterInInput(container, value);
            expect(onAdd.mock.calls[0][0]).toEqual([value]);
        });
    });

    describe("onRemove", () => {
        it("pressing backspace focuses last item", () => {
            const onRemove = vi.fn();
            const { container, instance } = renderTagInput({ onRemove });
            fireKeyDown(getInput(container), "Backspace");
            expect(instance.state.activeIndex).toBe(VALUES.length - 1);
            expect(onRemove).not.toHaveBeenCalled();
        });

        it("pressing backspace again removes last item", () => {
            const onRemove = vi.fn();
            const { container, instance } = renderTagInput({ onRemove });
            const input = getInput(container);
            fireKeyDown(input, "Backspace");
            fireKeyDown(input, "Backspace");
            expect(instance.state.activeIndex).toBe(VALUES.length - 2);
            expect(onRemove).toHaveBeenCalledOnce();
            const lastIndex = VALUES.length - 1;
            expect(onRemove.mock.calls[0]).toEqual([VALUES[lastIndex], lastIndex]);
        });

        it("pressing left arrow key navigates active item and backspace removes it", () => {
            const onRemove = vi.fn();
            const { container, instance } = renderTagInput({ onRemove });
            const input = getInput(container);
            // select and remove middle item
            fireKeyDown(input, "ArrowLeft");
            fireKeyDown(input, "ArrowLeft");
            fireKeyDown(input, "Backspace");
            expect(instance.state.activeIndex).toBe(0);
            expect(onRemove).toHaveBeenCalledOnce();
            expect(onRemove.mock.calls[0]).toEqual([VALUES[1], 1]);
        });

        it("pressing left arrow key navigates active item and delete removes it", () => {
            const onRemove = vi.fn();
            const { container, instance } = renderTagInput({ onRemove });
            const input = getInput(container);
            // select and remove middle item
            fireKeyDown(input, "ArrowLeft");
            fireKeyDown(input, "ArrowLeft");
            fireKeyDown(input, "Delete");
            // in this case we're not moving into the previous item but
            // we rather "take the place" of the item we just removed
            expect(instance.state.activeIndex).toBe(1);
            expect(onRemove).toHaveBeenCalledOnce();
            expect(onRemove.mock.calls[0]).toEqual([VALUES[1], 1]);
        });

        it("pressing delete with no selection does nothing", () => {
            const onRemove = vi.fn();
            const { container, instance } = renderTagInput({ onRemove });
            fireKeyDown(getInput(container), "Delete");
            expect(instance.state.activeIndex).toBe(-1);
            expect(onRemove).not.toHaveBeenCalled();
        });

        it("pressing right arrow key in initial state does nothing", () => {
            const { container, instance } = renderTagInput();
            fireKeyDown(getInput(container), "ArrowRight");
            expect(instance.state.activeIndex).toBe(-1);
        });
    });

    describe("onChange", () => {
        const NEW_VALUE = "new item";

        it("is not invoked on enter when input is empty", () => {
            const onChange = vi.fn();
            const { container } = renderTagInput({ onChange });
            pressEnterInInput(container, "");
            expect(onChange).not.toHaveBeenCalled();
        });

        it("is invoked on enter with non-empty input", () => {
            const onChange = vi.fn();
            const { container } = renderTagInput({ onChange });
            pressEnterInInput(container, NEW_VALUE);
            expect(onChange).toHaveBeenCalledOnce();
            expect(onChange.mock.calls[0][0]).toEqual([...VALUES, NEW_VALUE]);
        });

        it("can add multiple tags at once with separator", () => {
            const onChange = vi.fn();
            const { container } = renderTagInput({ onChange });
            pressEnterInInput(container, [NEW_VALUE, NEW_VALUE, NEW_VALUE].join(", "));
            expect(onChange).toHaveBeenCalledOnce();
            expect(onChange.mock.calls[0][0]).toEqual([...VALUES, NEW_VALUE, NEW_VALUE, NEW_VALUE]);
        });

        it("is invoked when a tag is removed by clicking", () => {
            const onChange = vi.fn();
            const { container } = renderTagInput({ onChange });
            fireEvent.click(container.querySelectorAll("button")[1]);
            expect(onChange).toHaveBeenCalledOnce();
            expect(onChange.mock.calls[0][0]).toEqual([VALUES[0], VALUES[2]]);
        });

        it("is invoked when a tag is removed by backspace", () => {
            const onChange = vi.fn();
            const { container } = renderTagInput({ onChange });
            const input = getInput(container);
            fireKeyDown(input, "Backspace");
            fireKeyDown(input, "Backspace");
            expect(onChange).toHaveBeenCalledOnce();
            expect(onChange.mock.calls[0][0]).toEqual([VALUES[0], VALUES[1]]);
        });

        it("does not clear the input if onChange returns false", () => {
            const onChange = vi.fn().mockReturnValue(false);
            const { container, instance } = renderTagInput({ onChange });
            fireEvent.change(getInput(container), { target: { value: NEW_VALUE } });
            pressEnterInInput(container, NEW_VALUE);
            expect(instance.state.inputValue).toBe(NEW_VALUE);
        });

        it("clears the input if onChange returns true", () => {
            const onChange = vi.fn().mockReturnValue(true);
            const { container, instance } = renderTagInput({ onChange });
            fireEvent.change(getInput(container), { target: { value: NEW_VALUE } });
            pressEnterInInput(container, NEW_VALUE);
            expect(instance.state.inputValue).toBe("");
        });

        it("clears the input if onChange returns nothing", () => {
            const onChange = vi.fn();
            const { container, instance } = renderTagInput({ onChange });
            fireEvent.change(getInput(container), { target: { value: NEW_VALUE } });
            pressEnterInInput(container, NEW_VALUE);
            expect(instance.state.inputValue).toBe("");
        });

        it("does not clear the input if the input is controlled", () => {
            const onChange = vi.fn();
            const { container, instance } = renderTagInput({ inputValue: NEW_VALUE, onChange });
            pressEnterInInput(container, NEW_VALUE);
            expect(instance.state.inputValue).toBe(NEW_VALUE);
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
            const ref = createRef<TagInput>();
            const { container, rerender } = render(<TagInput ref={ref} placeholder="hold the door" values={[]} />);
            expect(getInput(container).placeholder).toBe("hold the door");
            rerender(<TagInput ref={ref} placeholder="hold the door" values={[undefined]} />);
            expect(getInput(container).placeholder).toBe("hold the door");
            rerender(<TagInput ref={ref} placeholder="hold the door" values={VALUES} />);
            expect(getInput(container).placeholder).toBe("");
        });

        it("inputProps.placeholder appears all the time", () => {
            const ref = createRef<TagInput>();
            const { container, rerender } = render(
                <TagInput ref={ref} inputProps={{ placeholder: "hold the door" }} values={[]} />,
            );
            expect(getInput(container).placeholder).toBe("hold the door");
            rerender(<TagInput ref={ref} inputProps={{ placeholder: "hold the door" }} values={VALUES} />);
            expect(getInput(container).placeholder).toBe("hold the door");
        });

        it("setting both shows placeholder when empty and inputProps.placeholder otherwise", () => {
            const ref = createRef<TagInput>();
            const { container, rerender } = render(
                <TagInput ref={ref} inputProps={{ placeholder: "inputProps" }} placeholder="props" values={[]} />,
            );
            expect(getInput(container).placeholder).toBe("props");
            rerender(
                <TagInput ref={ref} inputProps={{ placeholder: "inputProps" }} placeholder="props" values={VALUES} />,
            );
            expect(getInput(container).placeholder).toBe("inputProps");
        });
    });

    describe("when input is not empty", () => {
        it("pressing backspace does not remove item", () => {
            const onRemove = vi.fn();
            const { container } = renderTagInput({ onRemove });
            const input = getInput(container);
            fireEvent.change(input, { target: { value: "text" } });
            // setSelectionRange not called: cursor is at end of "text", not at 0, so backspace doesn't engage tag interaction
            fireEvent.keyDown(input, { key: "Backspace" });
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
        const ref = createRef<TagInput>();
        const { container } = render(<TagInput ref={ref} onChange={onChange} values={MIXED_VALUES} />);
        // there are 7 values but only 3 render real Tag content; falsy ones still occupy index slots
        const input = getInput(container);

        function keydownAndAssertIndex(key: string, activeIndex: number) {
            fireKeyDown(input, key);
            expect(ref.current!.state.activeIndex).toBe(activeIndex);
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
        const { container } = renderTagInput({ disabled: true });
        const root = container.firstElementChild!;
        expect(root.classList.contains(Classes.DISABLED)).toBe(true);
        expect(getInput(container).disabled).toBe(true);
        getTags(container).forEach(tag => {
            expect(tag.querySelectorAll(`.${Classes.TAG_REMOVE}`)).toHaveLength(0);
        });
    });

    describe("onInputChange", () => {
        it("is not invoked on enter when input is empty", () => {
            const onInputChange = vi.fn();
            const { container } = renderTagInput({ onInputChange });
            pressEnterInInput(container, "");
            expect(onInputChange).not.toHaveBeenCalled();
        });

        it("is invoked when input text changes", () => {
            const changeSpy = vi.fn();
            const { container } = renderTagInput({ onInputChange: changeSpy });
            const input = getInput(container);
            fireEvent.change(input, { target: { value: "hello" } });
            expect(changeSpy).toHaveBeenCalledOnce();
            // After fireEvent.change, the SyntheticEvent's currentTarget reflects the input's new value.
            expect((changeSpy.mock.calls[0][0].target as HTMLInputElement).value).toBe("hello");
        });
    });

    describe("inputValue", () => {
        const NEW_VALUE = "new item";
        it("passes initial inputValue to input element", () => {
            const { container } = renderTagInput({ inputValue: NEW_VALUE });
            expect(getInput(container).value).toBe(NEW_VALUE);
        });

        it("prop changes are reflected in state", () => {
            const ref = createRef<TagInput>();
            const { rerender } = render(<TagInput ref={ref} inputValue="" values={VALUES} />);
            rerender(<TagInput ref={ref} inputValue="a" values={VALUES} />);
            expect(ref.current!.state.inputValue).toBe("a");
            rerender(<TagInput ref={ref} inputValue="b" values={VALUES} />);
            expect(ref.current!.state.inputValue).toBe("b");
            rerender(<TagInput ref={ref} inputValue="c" values={VALUES} />);
            expect(ref.current!.state.inputValue).toBe("c");
        });

        it("Updating inputValue updates input element", () => {
            const ref = createRef<TagInput>();
            const { container, rerender } = render(<TagInput ref={ref} inputValue="" values={VALUES} />);
            rerender(<TagInput ref={ref} inputValue={NEW_VALUE} values={VALUES} />);
            expect(getInput(container).value).toBe(NEW_VALUE);
        });

        it("has a default empty string value", () => {
            const { container } = renderTagInput();
            expect(getInput(container).value).toBe("");
        });
    });

    describe("when autoResize={true}", () => {
        it("passes inputProps to input element", () => {
            const onBlur = vi.fn();
            const { container } = renderTagInput({
                autoResize: true,
                inputProps: { autoFocus: true, onBlur },
            });
            const input = getInput(container);
            expect(document.activeElement).toBe(input);
            fireEvent.blur(input);
            expect(onBlur).toHaveBeenCalledOnce();
        });

        it("renders a Tag for each value", () => {
            const { container } = renderTagInput({ autoResize: true });
            expect(getTags(container)).toHaveLength(VALUES.length);
        });
    });
});

function pressEnterInInput(container: HTMLElement, value: string) {
    const input = getInput(container);
    input.focus();
    // Set DOM value before keydown so handleInputKeyDown reads currentTarget.value correctly.
    fireEvent.change(input, { target: { value } });
    // Move cursor to end so the "selectionEnd === 0" branch (tag interaction) doesn't trigger.
    try {
        input.setSelectionRange(value.length, value.length);
    } catch {
        // ignore
    }
    fireEvent.keyDown(input, { key: "Enter" });
}

function pressEnterInInputWhenComposing(container: HTMLElement, value: string) {
    const input = getInput(container);
    input.focus();
    fireEvent.change(input, { target: { value } });
    try {
        input.setSelectionRange(value.length, value.length);
    } catch {
        // ignore
    }
    // Dispatch a native KeyboardEvent with isComposing=true (fireEvent's init doesn't expose it).
    const event = new KeyboardEvent("keydown", { bubbles: true, cancelable: true, key: "Enter" });
    Object.defineProperty(event, "isComposing", { value: true });
    input.dispatchEvent(event);
}

function runKeyPressTest(callbackName: "onKeyDown" | "onKeyUp", startIndex: number, expectedIndex: number | undefined) {
    const callbackSpy = vi.fn();
    const inputProps = { [callbackName]: vi.fn() };
    const ref = createRef<TagInput>();
    const { container } = render(
        <TagInput ref={ref} values={VALUES} inputProps={inputProps} {...{ [callbackName]: callbackSpy }} />,
    );
    // Seed activeIndex via a known interaction flow: ArrowLeft moves from -1 to 2, again to 1, etc.
    // For startIndex = -1 we keep activeIndex = NONE.
    const input = getInput(container);
    if (startIndex >= 0) {
        const stepsFromLast = VALUES.length - 1 - startIndex;
        for (let i = 0; i < stepsFromLast + 1; i += 1) {
            fireKeyDown(input, "ArrowLeft");
        }
    }

    // Reset spies after seeding so the final assertion only sees the Enter event.
    callbackSpy.mockClear();
    (inputProps[callbackName] as ReturnType<typeof vi.fn>).mockClear();

    input.focus();
    if (callbackName === "onKeyDown") {
        fireEvent.keyDown(input, { key: "Enter" });
    } else {
        fireEvent.keyUp(input, { key: "Enter" });
    }

    expect(callbackSpy).toHaveBeenCalledOnce();
    expect(callbackSpy.mock.calls[0][0].key).toBe("Enter");
    expect(callbackSpy.mock.calls[0][1]).toBe(expectedIndex);
    expect(inputProps[callbackName]).toHaveBeenCalledOnce();
}
