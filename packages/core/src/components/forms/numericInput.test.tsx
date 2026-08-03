/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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
import { type PropsWithChildren, useState } from "react";

import { afterAll, afterEach, describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Classes, Position } from "../../common";
import * as Errors from "../../common/errors";

import { NumericInput, type NumericInputProps } from "./numericInput";

describe("<NumericInput>", () => {
    describe("Defaults", () => {
        it("renders the buttons on the right by default", () => {
            render(<NumericInput />);
            const controlGroup = screen.getByRole("group");
            const children = controlGroup.children;
            const inputGroup = children[0];
            const buttonGroup = children[1];
            expect(children.length).toBe(2);
            expect(inputGroup).toHaveClass(Classes.INPUT_GROUP);
            expect(buttonGroup).toHaveClass(Classes.BUTTON_GROUP);
        });

        it("has a stepSize of 1 by default", async () => {
            const user = userEvent.setup();
            const onValueChangeSpy = vi.fn();
            render(<NumericInput onValueChange={onValueChangeSpy} />);
            // Click increment from 0 should yield 1 (stepSize=1)
            await user.click(screen.getByRole("button", { name: "increment" }));
            expect(onValueChangeSpy).toHaveBeenCalledWith(1, "1", expect.anything());
        });

        it("has a minorStepSize of 0.1 by default", async () => {
            const user = userEvent.setup();
            const onValueChangeSpy = vi.fn();
            render(<NumericInput onValueChange={onValueChangeSpy} />);
            // Alt+click increment from 0 should yield 0.1 (minorStepSize=0.1)
            await user.keyboard("{Alt>}");
            await user.click(screen.getByRole("button", { name: "increment" }));
            await user.keyboard("{/Alt}");
            expect(onValueChangeSpy).toHaveBeenCalledWith(0.1, "0.1", expect.anything());
        });

        it("has a majorStepSize of 10 by default", async () => {
            const user = userEvent.setup();
            const onValueChangeSpy = vi.fn();
            render(<NumericInput onValueChange={onValueChangeSpy} />);
            // Shift+click increment from 0 should yield 10 (majorStepSize=10)
            await user.keyboard("{Shift>}");
            await user.click(screen.getByRole("button", { name: "increment" }));
            await user.keyboard("{/Shift}");
            expect(onValueChangeSpy).toHaveBeenCalledWith(10, "10", expect.anything());
        });

        it("has a value of '' by default", () => {
            render(<NumericInput />);
            expect(screen.getByRole("spinbutton")).toHaveValue("");
        });

        it("increments the value from 0 if the field is empty", async () => {
            const user = userEvent.setup();
            render(<NumericInput />);
            await user.click(screen.getByRole("button", { name: "increment" }));
            expect(screen.getByRole("spinbutton")).toHaveValue("1");
        });

        it("accepts defaultValue prop", () => {
            render(<NumericInput defaultValue={2} />);
            expect(screen.getByRole("spinbutton")).toHaveValue("2");
        });
    });

    describe("Button position", () => {
        it("renders the buttons on the right when buttonPosition == Position.RIGHT", () => {
            render(<NumericInput buttonPosition={Position.RIGHT} />);
            const controlGroup = screen.getByRole("group");
            const children = controlGroup.children;
            const inputGroup = children[0];
            const buttonGroup = children[1];
            expect(children.length).toBe(2);
            expect(inputGroup).toHaveClass(Classes.INPUT_GROUP);
            expect(buttonGroup).toHaveClass(Classes.BUTTON_GROUP);
        });

        it("renders the buttons on the left when buttonPosition == Position.LEFT", () => {
            render(<NumericInput buttonPosition={Position.LEFT} />);
            const controlGroup = screen.getByRole("group");
            const children = controlGroup.children;
            const buttonGroup = children[0];
            const inputGroup = children[1];
            expect(children.length).toBe(2);
            expect(buttonGroup).toHaveClass(Classes.BUTTON_GROUP);
            expect(inputGroup).toHaveClass(Classes.INPUT_GROUP);
        });

        it('does not render the buttons when buttonPosition == "none"', () => {
            render(<NumericInput buttonPosition="none" />);
            const controlGroup = screen.getByRole("group");
            const children = controlGroup.children;
            const inputGroup = children[0];
            expect(children.length).toBe(1);
            expect(inputGroup).toHaveClass(Classes.INPUT_GROUP);
        });
    });

    describe("Basic functionality", () => {
        it("works like a text input", async () => {
            const user = userEvent.setup();
            render(<NumericInput />);
            const input = screen.getByRole("spinbutton");
            await user.type(input, "11");
            expect(input).toHaveValue("11");
        });

        it("allows entry of non-numeric characters", async () => {
            const user = userEvent.setup();
            render(<NumericInput allowNumericCharactersOnly={false} />);
            const input = screen.getByRole("textbox");
            await user.type(input, "3 + a");
            expect(input).toHaveValue("3 + a");
        });

        it("provides numeric value to onValueChange as a number and a string", async () => {
            const user = userEvent.setup();
            const onValueChangeSpy = vi.fn();
            render(<NumericInput onValueChange={onValueChangeSpy} />);
            const input = screen.getByRole("spinbutton");
            await user.type(input, "1");
            expect(onValueChangeSpy).toHaveBeenCalledExactlyOnceWith(1, "1", expect.anything());
        });

        it("provides non-numeric value to onValueChange as NaN and a string", () => {
            const onValueChangeSpy = vi.fn();
            render(<NumericInput onValueChange={onValueChangeSpy} />);
            const input = screen.getByRole("spinbutton");
            // fireEvent.change is used intentionally here to bypass keyboard filtering
            fireEvent.change(input, { target: { value: "non-numeric-value" } });
            expect(onValueChangeSpy).toHaveBeenCalledExactlyOnceWith(NaN, "non-numeric-value", expect.anything());
        });

        it("accepts a numeric value", () => {
            render(<NumericInput value={10} />);
            expect(screen.getByRole("spinbutton")).toHaveValue("10");
        });

        it("accepts a string value", () => {
            render(<NumericInput value="10" />);
            expect(screen.getByRole("spinbutton")).toHaveValue("10");
        });

        it("fires onValueChange with the number value, string value, and input element when the value changes", async () => {
            const user = userEvent.setup();
            const onValueChangeSpy = vi.fn();
            render(<NumericInput onValueChange={onValueChangeSpy} />);

            await user.click(screen.getByRole("button", { name: "increment" }));

            const inputElement = screen.getByRole("spinbutton");
            expect(onValueChangeSpy).toHaveBeenCalledExactlyOnceWith(1, "1", inputElement);
        });

        it("fires onButtonClick with the number value and the string value when either button is pressed", async () => {
            const user = userEvent.setup();
            const onButtonClickSpy = vi.fn();
            render(<ControlledNumericInput onButtonClick={onButtonClickSpy} />);

            // incrementing from 0
            await user.click(screen.getByRole("button", { name: "increment" }));
            expect(onButtonClickSpy).toHaveBeenCalledExactlyOnceWith(1, "1");

            onButtonClickSpy.mockClear();

            // decrementing from 1 now
            await user.click(screen.getByRole("button", { name: "decrement" }));
            expect(onButtonClickSpy).toHaveBeenCalledExactlyOnceWith(0, "0");
        });
    });

    describe("Selection", () => {
        describe("selectAllOnFocus", () => {
            it("if false (the default), does not select any text on input field click", async () => {
                const user = userEvent.setup();
                render(<NumericInput defaultValue="12345678" />);
                const input = screen.getByRole<HTMLInputElement>("spinbutton");
                await user.click(input);
                expect(input.selectionStart).toBe(input.selectionEnd);
            });

            it("if true, selects all text on input field click", async () => {
                const user = userEvent.setup();
                render(<NumericInput defaultValue="12345678" selectAllOnFocus={true} />);
                const input = screen.getByRole<HTMLInputElement>("spinbutton");
                await user.click(input);
                expect(input.selectionStart).toBe(0);
                expect(input.selectionEnd).toBe(8);
            });
        });

        describe("selectAllOnIncrement", () => {
            it("if false (the default), does not select any text on increment", async () => {
                const user = userEvent.setup();
                render(<NumericInput defaultValue="12345678" />);
                const input = screen.getByRole<HTMLInputElement>("spinbutton");
                await user.type(input, "{ArrowUp}");
                expect(input.selectionStart).toBe(input.selectionEnd);
            });

            it("if true, selects all text on increment", async () => {
                const user = userEvent.setup();
                render(<NumericInput defaultValue="12345678" selectAllOnIncrement={true} />);
                const input = screen.getByRole<HTMLInputElement>("spinbutton");
                await user.type(input, "{ArrowUp}");
                expect(input.selectionStart).toBe(0);
                expect(input.selectionEnd).toBe(8);
            });
        });
    });

    describe("Keyboard text entry in input field", () => {
        const LESS_COMMON_SYMBOLS = stringToCharArray("åß∂ƒ©©˙∆˚≈ç√∫˜µ≤∑´®†¥¨ˆ≤≥");

        const NON_CHARACTER_KEYS = [
            "Alt",
            "ArrowDown",
            "ArrowLeft",
            "ArrowRight",
            "ArrowUp",
            "Backspace",
            "CapsLock",
            "Control",
            "Enter",
            "Escape",
            "F1",
            "F2",
            "F3",
            "F4",
            "F5",
            "F6",
            "F7",
            "F8",
            "F9",
            "F10",
            "F11",
            "F12",
            "Meta",
            "Shift",
            "Tab",
        ];

        const NON_NUMERIC_LOWERCASE_LETTERS = stringToCharArray("abcdfghijklmnopqrstuvwxyz");
        const NON_NUMERIC_UPPERCASE_LETTERS = stringToCharArray("ABCDFGHIJKLMNOPQRSTUVWXYZ");
        const NON_NUMERIC_SYMBOLS_WITHOUT_SHIFT = stringToCharArray("`=[]\\;',/");
        const NON_NUMERIC_SYMBOLS_WITH_SHIFT = stringToCharArray('~!@#$%^&*()_{}|:"<>?');

        const NUMERIC_DIGITS = stringToCharArray("0123456789");
        const NUMERIC_LOWERCASE_LETTERS = stringToCharArray("e");
        const NUMERIC_UPPERCASE_LETTERS = stringToCharArray("E");
        const NUMERIC_SYMBOLS_WITHOUT_SHIFT = stringToCharArray(".-");
        const NUMERIC_SYMBOLS_WITH_SHIFT = stringToCharArray("+");

        const SAMPLE_CHARS_TO_ALLOW_WITH_ALT_CTRL_META_WITHOUT_SHIFT = stringToCharArray("a[;,/=");
        const SAMPLE_CHARS_TO_ALLOW_WITH_ALT_CTRL_META_WITH_SHIFT = stringToCharArray("A{:<?_!");

        const SPACE_CHAR = " ";

        describe("if allowNumericCharactersOnly = true", () => {
            it("disables keystroke for all letters except 'e' and 'E'", () => {
                runTextInputSuite(NON_NUMERIC_LOWERCASE_LETTERS, true);
                runTextInputSuite(NON_NUMERIC_UPPERCASE_LETTERS, true, { shiftKey: true });
                runTextInputSuite(NUMERIC_LOWERCASE_LETTERS, false);
                runTextInputSuite(NUMERIC_UPPERCASE_LETTERS, false, { shiftKey: true });
            });

            it("disables keystroke for all common English symbols except '.', '-', and '+'", () => {
                runTextInputSuite(NON_NUMERIC_SYMBOLS_WITHOUT_SHIFT, true);
                runTextInputSuite(NUMERIC_SYMBOLS_WITHOUT_SHIFT, false);

                runTextInputSuite(NON_NUMERIC_SYMBOLS_WITH_SHIFT, true, { shiftKey: true });
                runTextInputSuite(NUMERIC_SYMBOLS_WITH_SHIFT, false, { shiftKey: true });
            });

            it("disables keystroke for less common symbols typed with OPTION-key modifier on Mac", () => {
                runTextInputSuite(LESS_COMMON_SYMBOLS, true);
            });

            it("disables keystroke for the spacebar", () => {
                runTextInputSuite([SPACE_CHAR], true);
            });

            it("allows keystroke for keys that don't print a character (Arrow keys, Backspace, Enter, etc.)", () => {
                runTextInputSuite(NON_CHARACTER_KEYS, false);
            });

            it("allows keystroke for numeric digits (0-9)", () => {
                runTextInputSuite(NUMERIC_DIGITS, false);
            });

            it("allows keystroke for any key combination involving the CTRL, ALT, or META keys", () => {
                const charsWithoutShift = SAMPLE_CHARS_TO_ALLOW_WITH_ALT_CTRL_META_WITHOUT_SHIFT;
                runTextInputSuite(charsWithoutShift, false, { altKey: true });
                runTextInputSuite(charsWithoutShift, false, { ctrlKey: true });
                runTextInputSuite(charsWithoutShift, false, { metaKey: true });

                const charsWithShift = SAMPLE_CHARS_TO_ALLOW_WITH_ALT_CTRL_META_WITH_SHIFT;
                runTextInputSuite(charsWithShift, false, { altKey: true, shiftKey: true });
                runTextInputSuite(charsWithShift, false, { ctrlKey: true, shiftKey: true });
                runTextInputSuite(charsWithShift, false, { metaKey: true, shiftKey: true });
            });

            it("allows malformed number inputs as long as all the characters are legal", async () => {
                const user = userEvent.setup();
                const VALUE = "+++---eeeEEE123...456---+++";

                render(<NumericInput />);
                const input = screen.getByRole("spinbutton");

                await user.type(input, VALUE);
                expect(input).toHaveValue(VALUE);
            });

            it("omits non-floating-point numeric characters from pasted text", async () => {
                const user = userEvent.setup();
                const VALUE = "a1a.a2aeaEa+a-a";
                const SANITIZED_VALUE = "1.2eE+-";

                render(<NumericInput />);
                const input = screen.getByRole("spinbutton");

                await user.click(input);
                await user.paste(VALUE);
                expect(input).toHaveValue(SANITIZED_VALUE);
            });
        });

        describe("if allowNumericCharactersOnly = false", () => {
            const PROP_FLAG: boolean = false;
            const EXPECT_DEFAULT_PREVENTED: boolean = false;

            it("allows keystroke for all English letters", () => {
                const lowercaseLetters = NON_NUMERIC_LOWERCASE_LETTERS.concat(NUMERIC_LOWERCASE_LETTERS);
                const uppercaseLetters = NON_NUMERIC_UPPERCASE_LETTERS.concat(NUMERIC_UPPERCASE_LETTERS);
                runTextInputSuite(lowercaseLetters, EXPECT_DEFAULT_PREVENTED, {}, PROP_FLAG);
                runTextInputSuite(uppercaseLetters, EXPECT_DEFAULT_PREVENTED, { shiftKey: true }, PROP_FLAG);
            });

            it("allows keystroke for all common English symbols", () => {
                const symbolsWithoutShift = NON_NUMERIC_SYMBOLS_WITHOUT_SHIFT.concat(NUMERIC_SYMBOLS_WITHOUT_SHIFT);
                const symbolsWithShift = NON_NUMERIC_SYMBOLS_WITH_SHIFT.concat(NUMERIC_SYMBOLS_WITH_SHIFT);
                runTextInputSuite(symbolsWithoutShift, EXPECT_DEFAULT_PREVENTED, {}, PROP_FLAG);
                runTextInputSuite(symbolsWithShift, EXPECT_DEFAULT_PREVENTED, { shiftKey: true }, PROP_FLAG);
            });

            it("allows keystroke for less common symbols typed with OPTION-key modifier on Mac", () => {
                runTextInputSuite(LESS_COMMON_SYMBOLS, EXPECT_DEFAULT_PREVENTED, {}, PROP_FLAG);
            });

            it("allows keystroke for the space character", () => {
                runTextInputSuite([SPACE_CHAR], EXPECT_DEFAULT_PREVENTED, {}, PROP_FLAG);
            });

            it("allows keystroke for keys that don't print a character (Arrow keys, Backspace, Enter, etc.)", () => {
                runTextInputSuite(NON_CHARACTER_KEYS, EXPECT_DEFAULT_PREVENTED, {}, PROP_FLAG);
            });

            it("allows keystroke for numeric digits (0-9)", () => {
                runTextInputSuite(NUMERIC_DIGITS, EXPECT_DEFAULT_PREVENTED);
            });

            it("allows keystroke for any key combination involving the CTRL, ALT, or META keys", () => {
                const charsWithoutShift = SAMPLE_CHARS_TO_ALLOW_WITH_ALT_CTRL_META_WITHOUT_SHIFT;
                runTextInputSuite(charsWithoutShift, EXPECT_DEFAULT_PREVENTED, { altKey: true });
                runTextInputSuite(charsWithoutShift, EXPECT_DEFAULT_PREVENTED, { ctrlKey: true });
                runTextInputSuite(charsWithoutShift, EXPECT_DEFAULT_PREVENTED, { metaKey: true });

                const charsWithShift = SAMPLE_CHARS_TO_ALLOW_WITH_ALT_CTRL_META_WITH_SHIFT;
                runTextInputSuite(charsWithShift, EXPECT_DEFAULT_PREVENTED, {
                    altKey: true,
                    shiftKey: true,
                });
                runTextInputSuite(charsWithShift, EXPECT_DEFAULT_PREVENTED, {
                    ctrlKey: true,
                    shiftKey: true,
                });
                runTextInputSuite(charsWithShift, EXPECT_DEFAULT_PREVENTED, {
                    metaKey: true,
                    shiftKey: true,
                });
            });
        });
    });

    describe("Keyboard interactions in input field", () => {
        const simulateIncrement = async (user: UserEventInstance, mockEvent?: Record<string, unknown>) => {
            await holdModifiers(user, mockEvent);
            await user.type(screen.getByRole("spinbutton"), "{ArrowUp}");
            await releaseModifiers(user, mockEvent);
        };

        const simulateDecrement = async (user: UserEventInstance, mockEvent?: Record<string, unknown>) => {
            await holdModifiers(user, mockEvent);
            await user.type(screen.getByRole("spinbutton"), "{ArrowDown}");
            await releaseModifiers(user, mockEvent);
        };

        runInteractionSuite("Press '↑'", "Press '↓'", simulateIncrement, simulateDecrement);
    });

    describe("Keyboard interactions on buttons (with Space key)", () => {
        // fireEvent.keyDown is used intentionally here because user.type on a button with Space
        // triggers the native button click behavior in addition to keyDown, causing a double increment
        const simulateIncrement = (_user: UserEventInstance, mockEvent?: Record<string, unknown>) => {
            fireEvent.keyDown(screen.getByRole("button", { name: "increment" }), { ...mockEvent, key: " " });
        };

        const simulateDecrement = (_user: UserEventInstance, mockEvent?: Record<string, unknown>) => {
            fireEvent.keyDown(screen.getByRole("button", { name: "decrement" }), { ...mockEvent, key: " " });
        };

        runInteractionSuite("Press 'SPACE'", "Press 'SPACE'", simulateIncrement, simulateDecrement);
    });

    describe("Keyboard interactions on buttons (with Enter key)", () => {
        // fireEvent is used intentionally here because user.type on a button with Enter
        // triggers the native button click behavior in addition to keyDown, causing a double increment
        const simulateIncrement = (_user: UserEventInstance, mockEvent?: Record<string, unknown>) => {
            const button = screen.getByRole("button", { name: "increment" });
            const event = { ...mockEvent, key: "Enter" };
            fireEvent.keyDown(button, event);
            fireEvent.keyUp(button, event);
        };

        const simulateDecrement = (_user: UserEventInstance, mockEvent?: Record<string, unknown>) => {
            const button = screen.getByRole("button", { name: "decrement" });
            const event = { ...mockEvent, key: "Enter" };
            fireEvent.keyDown(button, event);
            fireEvent.keyUp(button, event);
        };

        runInteractionSuite("Press 'ENTER'", "Press 'ENTER'", simulateIncrement, simulateDecrement);
    });

    describe("Mouse interactions", () => {
        const simulateIncrement = async (user: UserEventInstance, mockEvent?: Record<string, unknown>) => {
            await holdModifiers(user, mockEvent);
            await user.click(screen.getByRole("button", { name: "increment" }));
            await releaseModifiers(user, mockEvent);
        };

        const simulateDecrement = async (user: UserEventInstance, mockEvent?: Record<string, unknown>) => {
            await holdModifiers(user, mockEvent);
            await user.click(screen.getByRole("button", { name: "decrement" }));
            await releaseModifiers(user, mockEvent);
        };

        runInteractionSuite("Click '+'", "Click '-'", simulateIncrement, simulateDecrement);
    });

    describe("Value bounds", () => {
        const warnSpy = vi.spyOn(console, "warn").mockImplementation(vi.fn());
        afterEach(() => warnSpy.mockClear());
        afterAll(() => warnSpy.mockRestore());

        // A free-text input can legitimately hold an out-of-range or off-step value while the user
        // is typing, so these are not developer misconfigurations worth warning about.
        // Regression test for https://github.com/palantir/blueprint/issues/7370.
        it("does not warn when a controlled value is outside the min/max bounds", () => {
            render(<NumericInput value={150} min={0} max={100} />);
            expect(warnSpy).not.toHaveBeenCalled();
        });

        it("does not warn when a controlled value is not a multiple of stepSize", () => {
            render(<NumericInput value={7} stepSize={10} />);
            expect(warnSpy).not.toHaveBeenCalled();
        });

        it("does not warn when a controlled value moves out of bounds on re-render", () => {
            const { rerender } = render(<NumericInput value={50} min={0} max={100} />);
            rerender(<NumericInput value={150} min={0} max={100} />);
            expect(warnSpy).not.toHaveBeenCalled();
        });

        describe("if no bounds are defined", () => {
            it("enforces no minimum bound", async () => {
                const user = userEvent.setup();
                render(<ControlledNumericInput />);
                const decrementButton = screen.getByRole("button", { name: "decrement" });
                await user.keyboard("{Shift>}");
                await user.click(decrementButton);
                await user.click(decrementButton);
                await user.keyboard("{/Shift}");
                expect(screen.getByRole("spinbutton")).toHaveValue("-20");
            });

            it("enforces no maximum bound", async () => {
                const user = userEvent.setup();
                render(<ControlledNumericInput />);
                const incrementButton = screen.getByRole("button", { name: "increment" });
                await user.keyboard("{Shift>}");
                await user.click(incrementButton);
                await user.click(incrementButton);
                await user.keyboard("{/Shift}");
                expect(screen.getByRole("spinbutton")).toHaveValue("20");
            });

            it("clamps an out-of-bounds value to the new `min` if the component props change", () => {
                const { rerender } = render(<NumericInput value={0} />);
                expect(screen.getByRole("spinbutton")).toHaveValue("0");
                rerender(<NumericInput value={0} min={10} />);
                expect(screen.getByRole("spinbutton")).toHaveValue("10");
            });

            it("clamps an out-of-bounds value to the new `max` if the component props change", () => {
                const { rerender } = render(<NumericInput value={0} />);
                expect(screen.getByRole("spinbutton")).toHaveValue("0");
                rerender(<NumericInput value={0} max={-10} />);
                expect(screen.getByRole("spinbutton")).toHaveValue("-10");
            });
        });

        describe("if `min` is defined", () => {
            it("decrements the value as usual if it is above the minimum", async () => {
                const user = userEvent.setup();
                render(<ControlledNumericInput min={0} />);
                await user.click(screen.getByRole("button", { name: "decrement" }));
                expect(screen.getByRole("spinbutton")).toHaveValue("0");
            });

            it("clamps the value to the minimum bound when decrementing by 'stepSize'", async () => {
                const user = userEvent.setup();
                const MIN_VALUE = -0.5;
                render(<ControlledNumericInput min={MIN_VALUE} />);
                await user.click(screen.getByRole("button", { name: "decrement" }));
                expect(screen.getByRole("spinbutton")).toHaveValue(MIN_VALUE.toString());
            });

            it("clamps the value to the minimum bound when decrementing by 'minorStepSize'", async () => {
                const user = userEvent.setup();
                const MIN_VALUE = -0.05;
                render(<ControlledNumericInput min={MIN_VALUE} />);
                await user.keyboard("{Alt>}");
                await user.click(screen.getByRole("button", { name: "decrement" }));
                await user.keyboard("{/Alt}");
                expect(screen.getByRole("spinbutton")).toHaveValue(MIN_VALUE.toString());
            });

            it("clamps the value to the minimum bound when decrementing by 'majorStepSize'", async () => {
                const user = userEvent.setup();
                const MIN_VALUE = -5;
                render(<ControlledNumericInput min={MIN_VALUE} />);
                await user.keyboard("{Shift>}");
                await user.click(screen.getByRole("button", { name: "decrement" }));
                await user.keyboard("{/Shift}");
                expect(screen.getByRole("spinbutton")).toHaveValue(MIN_VALUE.toString());
            });

            it("fires onValueChange with clamped value if nextProps.min > value", () => {
                const onValueChangeSpy = vi.fn();
                const { rerender } = render(<NumericInput value={-10} onValueChange={onValueChangeSpy} />);
                rerender(<NumericInput value={-10} min={0} onValueChange={onValueChangeSpy} />);
                const inputElement = screen.getByRole("spinbutton");
                expect(inputElement).toHaveValue("0");
                expect(onValueChangeSpy).toHaveBeenCalledExactlyOnceWith(0, "0", inputElement);
            });

            it("does not fire onValueChange if nextProps.min < value", () => {
                const onValueChangeSpy = vi.fn();
                const { rerender } = render(<NumericInput value={-10} onValueChange={onValueChangeSpy} />);
                rerender(<NumericInput value={-10} min={-20} onValueChange={onValueChangeSpy} />);
                const inputElement = screen.getByRole("spinbutton");
                expect(inputElement).toHaveValue("-10");
                expect(onValueChangeSpy).not.toHaveBeenCalled();
            });
        });

        describe("if `max` is defined", () => {
            it("increments the value as usual if it is above the minimum", async () => {
                const user = userEvent.setup();
                render(<ControlledNumericInput max={0} />);
                await user.click(screen.getByRole("button", { name: "increment" }));
                const inputElement = screen.getByRole("spinbutton");
                expect(inputElement).toHaveValue("0");
            });

            it("clamps the value to the maximum bound when incrementing by 'stepSize'", async () => {
                const user = userEvent.setup();
                const MAX_VALUE = 0.5;
                render(<ControlledNumericInput max={MAX_VALUE} />);
                await user.click(screen.getByRole("button", { name: "increment" }));
                const inputElement = screen.getByRole("spinbutton");
                expect(inputElement).toHaveValue(MAX_VALUE.toString());
            });

            it("clamps the value to the maximum bound when incrementing by 'minorStepSize'", async () => {
                const user = userEvent.setup();
                const MAX_VALUE = 0.05;
                render(<ControlledNumericInput max={MAX_VALUE} />);
                await user.keyboard("{Alt>}");
                await user.click(screen.getByRole("button", { name: "increment" }));
                await user.keyboard("{/Alt}");
                const inputElement = screen.getByRole("spinbutton");
                expect(inputElement).toHaveValue(MAX_VALUE.toString());
            });

            it("clamps the value to the maximum bound when incrementing by 'majorStepSize'", async () => {
                const user = userEvent.setup();
                const MAX_VALUE = 5;
                render(<ControlledNumericInput max={MAX_VALUE} />);
                await user.keyboard("{Shift>}");
                await user.click(screen.getByRole("button", { name: "increment" }));
                await user.keyboard("{/Shift}");
                const inputElement = screen.getByRole("spinbutton");
                expect(inputElement).toHaveValue(MAX_VALUE.toString());
            });

            it("fires onValueChange with clamped value if nextProps.max < value", () => {
                const onValueChangeSpy = vi.fn();
                const { rerender } = render(<NumericInput value={10} onValueChange={onValueChangeSpy} />);
                rerender(<NumericInput value={10} max={0} onValueChange={onValueChangeSpy} />);
                const inputElement = screen.getByRole("spinbutton");
                expect(inputElement).toHaveValue("0");
                expect(onValueChangeSpy).toHaveBeenCalledExactlyOnceWith(0, "0", inputElement);
            });

            it("does not fire onValueChange if nextProps.max > value", () => {
                const onValueChangeSpy = vi.fn();
                const { rerender } = render(<NumericInput value={10} onValueChange={onValueChangeSpy} />);
                rerender(<NumericInput value={10} max={20} onValueChange={onValueChangeSpy} />);
                const inputElement = screen.getByRole("spinbutton");
                expect(inputElement).toHaveValue("10");
                expect(onValueChangeSpy).not.toHaveBeenCalled();
            });
        });

        describe("if min === max", () => {
            it("never changes value", async () => {
                const user = userEvent.setup();
                const onValueChangeSpy = vi.fn();
                render(<ControlledNumericInput min={2} max={2} onValueChange={onValueChangeSpy} />);
                const incrementButton = screen.getByRole("button", { name: "increment" });
                await user.click(incrementButton);
                await user.click(incrementButton);
                await user.click(incrementButton);
                await user.click(incrementButton);
                await user.click(incrementButton);
                const inputElement = screen.getByRole("spinbutton");
                expect(inputElement).toHaveValue("2");
                expect(onValueChangeSpy).toHaveBeenCalledExactlyOnceWith(2, "2", inputElement);
            });
        });

        describe("clampValueOnBlur", () => {
            it("does not clamp or invoke onValueChange on blur if clampValueOnBlur=false", async () => {
                const user = userEvent.setup();
                const VALUE = "-5";
                const onValueChange = vi.fn();
                render(<NumericInput clampValueOnBlur={false} onValueChange={onValueChange} />);
                const inputField = screen.getByRole("spinbutton");

                await user.type(inputField, VALUE);
                await user.tab();

                expect(inputField).toHaveValue(VALUE);
                expect(onValueChange).toHaveBeenCalledTimes(2);
                expect(onValueChange).toHaveBeenNthCalledWith(1, NaN, "-", expect.anything());
                expect(onValueChange).toHaveBeenNthCalledWith(2, -5, "-5", expect.anything());
            });

            it("clamps an out-of-bounds value to min", async () => {
                const user = userEvent.setup();
                const MIN = 0;
                render(<NumericInput clampValueOnBlur={true} min={MIN} />);
                const inputField = screen.getByRole("spinbutton");

                await user.type(inputField, "-5");
                await user.tab();
                expect(inputField).toHaveValue(MIN.toString());
            });

            it("clamps an out-of-bounds value to max", async () => {
                const user = userEvent.setup();
                const MAX = 0;
                render(<NumericInput clampValueOnBlur={true} max={MAX} />);
                const inputField = screen.getByRole("spinbutton");

                await user.type(inputField, "5");
                await user.tab();

                expect(inputField).toHaveValue(MAX.toString());
            });

            it("invokes onValueChange when out-of-bounds value clamped on blur", async () => {
                const user = userEvent.setup();
                const onValueChange = vi.fn();
                const MIN = 0;
                render(<NumericInput clampValueOnBlur={true} min={MIN} onValueChange={onValueChange} />);
                const inputField = screen.getByRole("spinbutton");

                await user.type(inputField, "-5");
                await user.tab();

                expect(onValueChange).toHaveBeenCalledTimes(3);
                expect(onValueChange).toHaveBeenNthCalledWith(1, NaN, "-", expect.anything());
                expect(onValueChange).toHaveBeenNthCalledWith(2, -5, "-5", expect.anything());
                expect(onValueChange).toHaveBeenNthCalledWith(3, MIN, MIN.toString(), expect.anything());
            });
        });
    });

    describe("Validation", () => {
        const consoleError = vi.spyOn(console, "error").mockImplementation(vi.fn());
        const consoleWarn = vi.spyOn(console, "warn").mockImplementation(vi.fn());
        afterEach(() => {
            consoleError.mockClear();
            consoleWarn.mockClear();
        });
        afterAll(() => {
            consoleError.mockRestore();
            consoleWarn.mockRestore();
        });

        it("logs an error if min >= max", () => {
            render(<NumericInput min={2} max={1} />);
            expect(consoleError).toHaveBeenCalledWith(Errors.NUMERIC_INPUT_MIN_MAX);
        });

        it("logs an error if stepSize <= 0", () => {
            render(<NumericInput stepSize={-1} />);
            expect(consoleError).toHaveBeenCalledWith(Errors.NUMERIC_INPUT_STEP_SIZE_NON_POSITIVE);
        });

        it("logs an error if minorStepSize <= 0", () => {
            render(<NumericInput minorStepSize={-0.1} />);
            expect(consoleError).toHaveBeenCalledWith(Errors.NUMERIC_INPUT_MINOR_STEP_SIZE_NON_POSITIVE);
        });

        it("logs an error if majorStepSize <= 0", () => {
            render(<NumericInput majorStepSize={-0.1} />);
            expect(consoleError).toHaveBeenCalledWith(Errors.NUMERIC_INPUT_MAJOR_STEP_SIZE_NON_POSITIVE);
        });

        it("logs an error if majorStepSize <= stepSize", () => {
            render(<NumericInput majorStepSize={0.5} />);
            expect(consoleError).toHaveBeenCalledWith(Errors.NUMERIC_INPUT_MAJOR_STEP_SIZE_BOUND);
        });

        it("logs an error if stepSize <= minorStepSize", () => {
            render(<NumericInput minorStepSize={2} />);
            expect(consoleError).toHaveBeenCalledWith(Errors.NUMERIC_INPUT_MINOR_STEP_SIZE_BOUND);
        });

        it("clears the field if the value is invalid when incrementing", async () => {
            const user = userEvent.setup();
            render(<ControlledNumericInput value={"<invalid>"} />);
            expect(screen.getByRole("spinbutton")).toHaveValue("<invalid>");
            await user.click(screen.getByRole("button", { name: "increment" }));
            expect(screen.getByRole("spinbutton")).toHaveValue("");
        });

        it("clears the field if the value is invalid when decrementing", async () => {
            const user = userEvent.setup();
            render(<ControlledNumericInput value={"<invalid>"} />);
            expect(screen.getByRole("spinbutton")).toHaveValue("<invalid>");
            await user.click(screen.getByRole("button", { name: "decrement" }));
            expect(screen.getByRole("spinbutton")).toHaveValue("");
        });
    });

    describe("Controlled mode", () => {
        it("value prop updates do not trigger onValueChange", () => {
            const onValueChangeSpy = vi.fn();
            const { rerender } = render(<NumericInput min={0} value={0} max={1} onValueChange={onValueChangeSpy} />);
            rerender(<NumericInput min={0} value={1} max={1} onValueChange={onValueChangeSpy} />);
            expect(onValueChangeSpy).not.toHaveBeenCalled();
        });

        it("state.value only changes with prop change", async () => {
            const user = userEvent.setup();
            const onValueChangeSpy = vi.fn();
            const { rerender } = render(<NumericInput value={10} onValueChange={onValueChangeSpy} />);

            await user.click(screen.getByRole("button", { name: "increment" }));

            const inputElement = screen.getByRole("spinbutton");
            expect(inputElement).toHaveValue("10");
            expect(onValueChangeSpy).toHaveBeenCalledExactlyOnceWith(11, "11", inputElement);

            rerender(<NumericInput value={11} onValueChange={onValueChangeSpy} />);
            expect(screen.getByRole("spinbutton")).toHaveValue("11");
        });

        it("accepts successive value changes containing non-numeric characters", () => {
            const { rerender } = render(<NumericInput />);
            rerender(<NumericInput value="1" />);
            expect(screen.getByRole("spinbutton")).toHaveValue("1");
            rerender(<NumericInput value="1 +" />);
            expect(screen.getByRole("spinbutton")).toHaveValue("1 +");
            rerender(<NumericInput value="1 + 1" />);
            expect(screen.getByRole("spinbutton")).toHaveValue("1 + 1");
        });
    });

    describe("Localization", () => {
        it("accepts the number in a different locale", async () => {
            const user = userEvent.setup();
            const onValueChangeSpy = vi.fn();
            render(<NumericInput onValueChange={onValueChangeSpy} locale="de-DE" />);
            const nextValue = "99,99";
            const nextValueNumber = 99.99;

            await user.type(screen.getByRole("spinbutton"), nextValue);

            expect(onValueChangeSpy).toHaveBeenCalledTimes(nextValue.length);
            expect(onValueChangeSpy).toHaveBeenLastCalledWith(nextValueNumber, nextValue, expect.anything());
        });

        it("accepts the number in a different locale [Arabic - Bahrain (ar-BH)]", async () => {
            const user = userEvent.setup();
            const onValueChangeSpy = vi.fn();
            render(<NumericInput onValueChange={onValueChangeSpy} locale="ar-BH" />);
            const nextValue = "٩٫٩٩";
            const nextValueNumber = 9.99;

            await user.type(screen.getByRole("spinbutton"), nextValue);

            expect(onValueChangeSpy).toHaveBeenCalledTimes(nextValue.length);
            expect(onValueChangeSpy).toHaveBeenLastCalledWith(nextValueNumber, nextValue, expect.anything());
        });

        it("changing the locale it changes the value (en-US to it-IT)", async () => {
            const user = userEvent.setup();
            const onValueChangeSpy = vi.fn();
            const { rerender } = render(<NumericInput onValueChange={onValueChangeSpy} />);
            const nextValue = "99.99";
            const formattedValue = "99,99";

            await user.type(screen.getByRole("spinbutton"), nextValue);
            expect(onValueChangeSpy).toHaveBeenLastCalledWith(+nextValue, nextValue, expect.anything());

            rerender(<NumericInput onValueChange={onValueChangeSpy} locale="it-IT" />);
            expect(onValueChangeSpy).toHaveBeenLastCalledWith(+nextValue, formattedValue, expect.anything());
        });

        it("changing the locale it changes the value (it-IT to undefined)", async () => {
            const user = userEvent.setup();
            const onValueChangeSpy = vi.fn();
            const { rerender } = render(<NumericInput onValueChange={onValueChangeSpy} locale="it-IT" />);
            const nextValue = "99,99";
            const usValue = "99.99";

            await user.type(screen.getByRole("spinbutton"), nextValue);
            expect(onValueChangeSpy).toHaveBeenLastCalledWith(+usValue, nextValue, expect.anything());

            rerender(<NumericInput onValueChange={onValueChangeSpy} locale={undefined} />);
            expect(onValueChangeSpy).toHaveBeenLastCalledWith(+usValue, usValue, expect.anything());
        });

        it("doesn't accept the number in a different format", () => {
            const onValueChangeSpy = vi.fn();
            render(<NumericInput onValueChange={onValueChangeSpy} />);
            const invalidValue = "77,99";

            // fireEvent.change is used intentionally here to bypass keyboard filtering,
            // since the comma is not a valid numeric character in the default (en-US) locale
            fireEvent.change(screen.getByRole("spinbutton"), { target: { value: invalidValue } });

            expect(onValueChangeSpy).toHaveBeenCalledExactlyOnceWith(NaN, invalidValue, expect.anything());
        });

        it("increments the number with the specified locale", async () => {
            const user = userEvent.setup();
            const onValueChangeSpy = vi.fn();
            render(<ControlledNumericInput onValueChange={onValueChangeSpy} locale="de-DE" />);
            const nextValue = "7,9";
            const nextValueNumber = 7.9;
            const valueAfterIncrement = "8,9";
            const valueNumberAfterIncrement = 8.9;

            await user.type(screen.getByRole("spinbutton"), nextValue);
            expect(onValueChangeSpy).toHaveBeenLastCalledWith(nextValueNumber, nextValue, expect.anything());

            await user.click(screen.getByRole("button", { name: "increment" }));
            expect(onValueChangeSpy).toHaveBeenLastCalledWith(
                valueNumberAfterIncrement,
                valueAfterIncrement,
                expect.anything(),
            );
        });

        it("decrements the number with the specified locale", async () => {
            const user = userEvent.setup();
            const onValueChangeSpy = vi.fn();
            render(<ControlledNumericInput onValueChange={onValueChangeSpy} locale="de-DE" />);
            const nextValue = "7,9";
            const nextValueNumber = 7.9;
            const valueAfterDecrement = "6,9";
            const valueNumberAfterDecrement = 6.9;

            await user.type(screen.getByRole("spinbutton"), nextValue);
            expect(onValueChangeSpy).toHaveBeenLastCalledWith(nextValueNumber, nextValue, expect.anything());

            await user.click(screen.getByRole("button", { name: "decrement" }));
            expect(onValueChangeSpy).toHaveBeenLastCalledWith(
                valueNumberAfterDecrement,
                valueAfterDecrement,
                expect.anything(),
            );
        });
    });

    describe("Other", () => {
        it("disables the increment button when the value is greater than or equal to max", () => {
            render(<NumericInput value={100} max={100} />);
            expect(screen.getByRole("button", { name: "decrement" })).not.toBeDisabled();
            expect(screen.getByRole("button", { name: "increment" })).toBeDisabled();
        });

        it("disables the decrement button when the value is less than or equal to min", () => {
            render(<NumericInput value={-10} min={-10} />);
            expect(screen.getByRole("button", { name: "decrement" })).toBeDisabled();
            expect(screen.getByRole("button", { name: "increment" })).not.toBeDisabled();
        });

        it("disables the input field and buttons when disabled is true", () => {
            render(<NumericInput disabled={true} />);
            expect(screen.getByRole("spinbutton")).toBeDisabled();
            expect(screen.getByRole("button", { name: "decrement" })).toBeDisabled();
            expect(screen.getByRole("button", { name: "increment" })).toBeDisabled();
        });

        it("disables the buttons and sets the input field to read-only when readOnly is true", () => {
            render(<NumericInput readOnly={true} />);
            expect(screen.getByRole("spinbutton")).toHaveAttribute("readonly");
            expect(screen.getByRole("button", { name: "decrement" })).toBeDisabled();
            expect(screen.getByRole("button", { name: "increment" })).toBeDisabled();
        });

        it("shows a left icon if provided", () => {
            render(<NumericInput leftIcon="variable" />);
            const controlGroup = screen.getByRole("group");
            const icon = controlGroup.querySelector(`.${Classes.ICON}`);
            expect(icon).toBeInTheDocument();
        });

        it("shows a left element if provided", () => {
            render(<NumericInput leftElement={<button data-testid="left-btn">X</button>} />);
            expect(screen.getByTestId("left-btn")).toBeInTheDocument();
        });

        it("shows only a left element if both a left element and a left icon are provided", () => {
            const consoleWarn = vi.spyOn(console, "warn").mockImplementation(vi.fn());
            render(<NumericInput leftIcon="variable" leftElement={<button data-testid="left-btn">X</button>} />);
            expect(screen.getByTestId("left-btn")).toBeInTheDocument();
            // The icon should not be rendered when leftElement is also provided
            const controlGroup = screen.getByRole("group");
            const icon = controlGroup.querySelector(`.${Classes.INPUT_GROUP} > .${Classes.ICON}`);
            expect(icon).not.toBeInTheDocument();
            consoleWarn.mockRestore();
        });

        it("shows placeholder text if provided", () => {
            render(<NumericInput placeholder={"Enter a number..."} />);
            expect(screen.getByPlaceholderText("Enter a number...")).toBeInTheDocument();
        });

        it("shows right element if provided", () => {
            render(<NumericInput rightElement={<button data-testid="right-btn">Y</button>} />);
            expect(screen.getByTestId("right-btn")).toBeInTheDocument();
        });

        it("passed decimal value should be rounded by stepSize", () => {
            const consoleWarn = vi.spyOn(console, "warn").mockImplementation(vi.fn());
            render(<NumericInput value={9.001} min={0} />);
            expect(screen.getByRole("spinbutton")).toHaveValue("9");
            consoleWarn.mockRestore();
        });

        it("passed decimal value should be rounded by minorStepSize", () => {
            render(<NumericInput value={"9.01"} min={0} minorStepSize={0.01} />);
            expect(screen.getByRole("spinbutton")).toHaveValue("9.01");
        });

        it("changes max precision of displayed value to that of the smallest step size defined", async () => {
            const user = userEvent.setup();
            const consoleWarn = vi.spyOn(console, "warn").mockImplementation(vi.fn());
            render(<ControlledNumericInput majorStepSize={1} stepSize={0.1} minorStepSize={0.001} />);
            const incrementButton = screen.getByRole("button", { name: "increment" });

            await user.click(incrementButton);
            expect(screen.getByRole("spinbutton")).toHaveValue("0.1");

            await user.keyboard("{Alt>}");
            await user.click(incrementButton);
            await user.keyboard("{/Alt}");
            expect(screen.getByRole("spinbutton")).toHaveValue("0.101");

            await user.keyboard("{Shift>}");
            await user.click(incrementButton);
            await user.keyboard("{/Shift}");
            expect(screen.getByRole("spinbutton")).toHaveValue("1.101");

            // one significant digit too many
            await user.clear(screen.getByRole("spinbutton"));
            await user.type(screen.getByRole("spinbutton"), "1.0001");

            await user.keyboard("{Alt>}");
            await user.click(incrementButton);
            await user.keyboard("{/Alt}");
            expect(screen.getByRole("spinbutton")).toHaveValue("1.001");
            consoleWarn.mockRestore();
        });

        it("handle big decimal numbers", async () => {
            const user = userEvent.setup();
            const onValueChangeSpy = vi.fn();
            render(
                <NumericInput
                    onValueChange={onValueChangeSpy}
                    value={0}
                    stepSize={0.000000000000000001}
                    minorStepSize={0.000000000000000001}
                />,
            );
            const input = screen.getByRole("spinbutton");
            await user.type(input, "{ArrowUp}");
            expect(onValueChangeSpy).toHaveBeenCalledWith(0.000000000000000001, expect.anything(), expect.anything());
        });

        it("changes max precision appropriately when the min/max stepSize props change", async () => {
            const user = userEvent.setup();
            const onValueChangeSpy = vi.fn();
            const consoleWarn = vi.spyOn(console, "warn").mockImplementation(vi.fn());
            const { rerender } = render(
                <NumericInput
                    majorStepSize={1}
                    stepSize={0.1}
                    minorStepSize={0.001}
                    value="0.0001"
                    onValueChange={onValueChangeSpy}
                />,
            );

            // excess digits should truncate to max precision
            await user.keyboard("{Alt>}");
            await user.click(screen.getByRole("button", { name: "increment" }));
            await user.keyboard("{/Alt}");
            expect(onValueChangeSpy).toHaveBeenCalledExactlyOnceWith(0.001, "0.001", expect.anything());
            onValueChangeSpy.mockClear();

            // now try a smaller step size, and expect no truncation
            rerender(
                <NumericInput
                    majorStepSize={1}
                    stepSize={0.1}
                    minorStepSize={0.0001}
                    value="0.0001"
                    onValueChange={onValueChangeSpy}
                />,
            );
            await user.keyboard("{Alt>}");
            await user.click(screen.getByRole("button", { name: "increment" }));
            await user.keyboard("{/Alt}");
            expect(onValueChangeSpy).toHaveBeenCalledExactlyOnceWith(0.0002, "0.0002", expect.anything());
            onValueChangeSpy.mockClear();

            // now try a larger step size, and expect more truncation than before
            rerender(
                <NumericInput
                    majorStepSize={1}
                    stepSize={0.1}
                    minorStepSize={0.1}
                    value="0.0001"
                    onValueChange={onValueChangeSpy}
                />,
            );
            await user.keyboard("{Alt>}");
            await user.click(screen.getByRole("button", { name: "increment" }));
            await user.keyboard("{/Alt}");
            expect(onValueChangeSpy).toHaveBeenCalledExactlyOnceWith(0.1, "0.1", expect.anything());
            onValueChangeSpy.mockClear();
            consoleWarn.mockRestore();
        });

        it("must not call handleButtonClick if component is disabled", async () => {
            const user = userEvent.setup();
            const onValueChangeSpy = vi.fn();
            const onButtonClickSpy = vi.fn();
            render(<NumericInput disabled={true} onValueChange={onValueChangeSpy} onButtonClick={onButtonClickSpy} />);

            const incrementButton = screen.getByRole("button", { name: "increment" });
            const decrementButton = screen.getByRole("button", { name: "decrement" });

            await user.click(incrementButton);
            await user.keyboard("{Alt>}");
            await user.click(incrementButton);
            await user.keyboard("{/Alt}");
            await user.type(incrementButton, " ");
            await user.type(incrementButton, "{Alt>} {/Alt}");

            await user.click(decrementButton);
            await user.keyboard("{Alt>}");
            await user.click(decrementButton);
            await user.keyboard("{/Alt}");
            await user.type(decrementButton, " ");
            await user.type(decrementButton, "{Alt>} {/Alt}");

            expect(onValueChangeSpy).not.toHaveBeenCalled();
            expect(onButtonClickSpy).not.toHaveBeenCalled();
        });
    });

    function runInteractionSuite(
        incrementDescription: string,
        decrementDescription: string,
        simulateIncrement: InteractionCallback,
        simulateDecrement: InteractionCallback,
    ) {
        it(`increments by stepSize on ${incrementDescription}`, async () => {
            const user = userEvent.setup();
            render(<ControlledNumericInput majorStepSize={20} minorStepSize={0.2} stepSize={2} value={10} />);
            await simulateIncrement(user);
            expect(screen.getByRole("spinbutton")).toHaveValue("12");
        });

        it(`decrements by stepSize on ${decrementDescription}`, async () => {
            const user = userEvent.setup();
            render(<ControlledNumericInput majorStepSize={20} minorStepSize={0.2} stepSize={2} value={10} />);
            await simulateDecrement(user);
            expect(screen.getByRole("spinbutton")).toHaveValue("8");
        });

        it(`increments by stepSize on Shift + ${incrementDescription} when majorStepSize is null`, async () => {
            const user = userEvent.setup();
            render(<ControlledNumericInput majorStepSize={null} minorStepSize={0.2} stepSize={2} value={10} />);
            await simulateIncrement(user, { shiftKey: true });
            expect(screen.getByRole("spinbutton")).toHaveValue("12");
        });

        it(`decrements by stepSize on Shift + ${incrementDescription} when majorStepSize is null`, async () => {
            const user = userEvent.setup();
            render(<ControlledNumericInput majorStepSize={null} minorStepSize={0.2} stepSize={2} value={10} />);
            await simulateDecrement(user, { shiftKey: true });
            expect(screen.getByRole("spinbutton")).toHaveValue("8");
        });

        it(`increments by stepSize on Alt + ${incrementDescription} when minorStepSize is null`, async () => {
            const user = userEvent.setup();
            render(<ControlledNumericInput majorStepSize={20} minorStepSize={null} stepSize={2} value={10} />);
            await simulateIncrement(user, { altKey: true });
            expect(screen.getByRole("spinbutton")).toHaveValue("12");
        });

        it(`decrements by stepSize on Alt + ${decrementDescription} when minorStepSize is null`, async () => {
            const user = userEvent.setup();
            render(<ControlledNumericInput majorStepSize={20} minorStepSize={null} stepSize={2} value={10} />);
            await simulateDecrement(user, { altKey: true });
            expect(screen.getByRole("spinbutton")).toHaveValue("8");
        });

        it(`increments by majorStepSize on Shift + ${incrementDescription}`, async () => {
            const user = userEvent.setup();
            render(<ControlledNumericInput majorStepSize={20} minorStepSize={0.2} stepSize={2} value={10} />);
            await simulateIncrement(user, { shiftKey: true });
            expect(screen.getByRole("spinbutton")).toHaveValue("30");
        });

        it(`decrements by majorStepSize on Shift + ${decrementDescription}`, async () => {
            const user = userEvent.setup();
            render(<ControlledNumericInput majorStepSize={20} minorStepSize={0.2} stepSize={2} value={10} />);
            await simulateDecrement(user, { shiftKey: true });
            expect(screen.getByRole("spinbutton")).toHaveValue("-10");
        });

        it(`increments by minorStepSize on Alt + ${incrementDescription}`, async () => {
            const user = userEvent.setup();
            render(<ControlledNumericInput majorStepSize={20} minorStepSize={0.2} stepSize={2} value={10} />);
            await simulateIncrement(user, { altKey: true });
            expect(screen.getByRole("spinbutton")).toHaveValue("10.2");
        });

        it(`decrements by minorStepSize on Alt + ${incrementDescription}`, async () => {
            const user = userEvent.setup();
            render(<ControlledNumericInput majorStepSize={20} minorStepSize={0.2} stepSize={2} value={10} />);
            await simulateDecrement(user, { altKey: true });
            expect(screen.getByRole("spinbutton")).toHaveValue("9.8");
        });

        it(`increments by majorStepSize on Shift + Alt + ${incrementDescription}`, async () => {
            const user = userEvent.setup();
            render(<ControlledNumericInput majorStepSize={20} minorStepSize={0.2} stepSize={2} value={10} />);
            await simulateIncrement(user, { altKey: true, shiftKey: true });
            expect(screen.getByRole("spinbutton")).toHaveValue("30");
        });

        it(`decrements by majorStepSize on Shift + Alt + ${decrementDescription}`, async () => {
            const user = userEvent.setup();
            render(<ControlledNumericInput majorStepSize={20} minorStepSize={0.2} stepSize={2} value={10} />);
            await simulateDecrement(user, { altKey: true, shiftKey: true });
            expect(screen.getByRole("spinbutton")).toHaveValue("-10");
        });

        it(`increments by minorStepSize on Shift + Alt + ${incrementDescription} when majorStepSize is null`, async () => {
            const user = userEvent.setup();
            render(<ControlledNumericInput majorStepSize={null} minorStepSize={0.2} stepSize={2} value={10} />);
            await simulateIncrement(user, { altKey: true, shiftKey: true });
            expect(screen.getByRole("spinbutton")).toHaveValue("10.2");
        });

        it(`decrements by minorStepSize on Shift + Alt + ${incrementDescription} when majorStepSize is null`, async () => {
            const user = userEvent.setup();
            render(<ControlledNumericInput majorStepSize={null} minorStepSize={0.2} stepSize={2} value={10} />);
            await simulateDecrement(user, { altKey: true, shiftKey: true });
            expect(screen.getByRole("spinbutton")).toHaveValue("9.8");
        });

        it(`increments by stepSize on Shift + Alt + ${incrementDescription} when majorStepSize and minorStepSize are null`, async () => {
            const user = userEvent.setup();
            render(<ControlledNumericInput majorStepSize={null} minorStepSize={null} stepSize={2} value={10} />);
            await simulateIncrement(user, { altKey: true, shiftKey: true });
            expect(screen.getByRole("spinbutton")).toHaveValue("12");
        });

        it(`decrements by stepSize on Shift + Alt + ${incrementDescription} when majorStepSize and minorStepSize are null`, async () => {
            const user = userEvent.setup();
            render(<ControlledNumericInput majorStepSize={null} minorStepSize={null} stepSize={2} value={10} />);
            await simulateDecrement(user, { altKey: true, shiftKey: true });
            expect(screen.getByRole("spinbutton")).toHaveValue("8");
        });

        it("resolves scientific notation to a number before incrementing when allowNumericCharactersOnly=true", async () => {
            const user = userEvent.setup();
            render(
                <ControlledNumericInput
                    allowNumericCharactersOnly={true}
                    majorStepSize={null}
                    minorStepSize={null}
                    stepSize={2}
                    value={10}
                />,
            );

            // Set value to "3e2" (i.e. 302)
            await user.clear(screen.getByRole("spinbutton"));
            await user.type(screen.getByRole("spinbutton"), "3e2");

            await simulateIncrement(user);
            expect(screen.getByRole("spinbutton")).toHaveValue("302");
        });
    }

    function stringToCharArray(str: string) {
        return str == null ? [] : str.split("");
    }

    function runTextInputSuite(
        keyNames: string[],
        expectDefaultPrevented: boolean,
        eventOptions?: Partial<KeyboardEvent>,
        allowNumericCharactersOnly?: boolean,
    ) {
        const onKeyPressSpy = vi.fn();
        const { unmount } = render(
            // eslint-disable-next-line @typescript-eslint/no-deprecated
            <NumericInput allowNumericCharactersOnly={allowNumericCharactersOnly} onKeyPress={onKeyPressSpy} />,
        );
        const inputField = screen.getByRole(allowNumericCharactersOnly === false ? "textbox" : "spinbutton");

        keyNames.forEach(keyName => {
            onKeyPressSpy.mockClear();

            // React only forwards a synthetic `keypress` to `onKeyPress` for keys that produce a
            // character (i.e. a non-zero `charCode`), so single-character keys must supply one.
            // Multi-character keys (e.g. "ArrowUp", "Shift") never emit a `keypress` in a real
            // browser, so they are dispatched without a `charCode` and pass through unfiltered. The
            // component decides whether to block a key based on `key`, not `charCode`.
            const isSingleCharKey = keyName.length === 1;
            const charCode = isSingleCharKey ? keyName.charCodeAt(0) : 0;

            // `fireEvent` returns `false` when a handler called `preventDefault()`. This is observable
            // for every key, unlike the spy below, which only fires for character keys.
            // eslint-disable-next-line @typescript-eslint/no-deprecated
            const notPrevented = fireEvent.keyPress(inputField, { charCode, key: keyName, ...eventOptions });
            expect(notPrevented, `keypress "${keyName}"`).toBe(!expectDefaultPrevented);

            // An allowed keystroke is never prevented whether or not the handler runs, so assert the
            // handler actually fired for character keys; otherwise the check above could pass
            // vacuously if the keypress never reached the component.
            if (isSingleCharKey) {
                expect(onKeyPressSpy, `onKeyPress should fire for "${keyName}"`).toHaveBeenCalled();
            }
        });
        unmount();
    }
});

type UserEventInstance = ReturnType<typeof userEvent.setup>;
type InteractionCallback = (user: UserEventInstance, mockEvent?: Record<string, unknown>) => void | Promise<void>;

async function holdModifiers(user: UserEventInstance, mockEvent?: Record<string, unknown>) {
    if (mockEvent?.shiftKey) {
        await user.keyboard("{Shift>}");
    }
    if (mockEvent?.altKey) {
        await user.keyboard("{Alt>}");
    }
}

async function releaseModifiers(user: UserEventInstance, mockEvent?: Record<string, unknown>) {
    if (mockEvent?.altKey) {
        await user.keyboard("{/Alt}");
    }
    if (mockEvent?.shiftKey) {
        await user.keyboard("{/Shift}");
    }
}

/**
 * Wraps NumericInput to make it behave like a controlled component, treating props.value as a default value
 */
function ControlledNumericInput(props: PropsWithChildren<NumericInputProps>) {
    const [value, setValue] = useState(props.value?.toString() ?? "");

    const handleValueChange = (valueAsNumber: number, valueAsString: string, inputElement: HTMLInputElement | null) => {
        setValue(valueAsString);
        props.onValueChange?.(valueAsNumber, valueAsString, inputElement);
    };

    return <NumericInput {...props} value={value} onValueChange={handleValueChange} />;
}
