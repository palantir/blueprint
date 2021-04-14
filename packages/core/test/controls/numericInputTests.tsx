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

import { assert, expect } from "chai";
import {
    mount as untypedMount,
    MountRendererProps,
    ReactWrapper,
    shallow as untypedShallow,
    ShallowRendererProps,
} from "enzyme";
import React from "react";
import { spy, stub, SinonStub } from "sinon";

import { dispatchMouseEvent } from "@blueprintjs/test-commons";

import {
    Button,
    ButtonGroup,
    ControlGroup,
    HTMLInputProps,
    Icon,
    InputGroup,
    NumericInputProps,
    Keys,
    NumericInput,
    Position,
} from "../../src";
import * as Errors from "../../src/common/errors";

/**
 * @see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/26979#issuecomment-465304376
 */
// tslint:disable no-unnecessary-callback-wrapper
const mount = (el: React.ReactElement<NumericInputProps>, options?: MountRendererProps) =>
    untypedMount<NumericInput>(el, options);
const shallow = (el: React.ReactElement<NumericInputProps>, options?: ShallowRendererProps) =>
    untypedShallow<NumericInput>(el, options);
// tslint:enable no-unnecessary-callback-wrapper

describe("<NumericInput>", () => {
    describe("Defaults", () => {
        it("renders the buttons on the right by default", () => {
            // this ordering is trivial to test with shallow renderer
            // (no DOM elements getting in the way)
            const component = untypedShallow(<NumericInput />);
            const rightGroup = component.children().last();
            expect(rightGroup.is(ButtonGroup)).to.be.true;
        });

        it("has a stepSize of 1 by default", () => {
            const component = mount(<NumericInput />);
            const stepSize = component.props().stepSize;
            expect(stepSize).to.equal(1);
        });

        it("has a minorStepSize of 0.1 by default", () => {
            const component = mount(<NumericInput />);
            const minorStepSize = component.props().minorStepSize;
            expect(minorStepSize).to.equal(0.1);
        });

        it("has a majorStepSize of 10 by default", () => {
            const component = mount(<NumericInput />);
            const majorStepSize = component.props().majorStepSize;
            expect(majorStepSize).to.equal(10);
        });

        it("has a value of '' by default", () => {
            const component = mount(<NumericInput />);
            const value = component.state().value;
            expect(value).to.equal("");
        });

        it("increments the value from 0 if the field is empty", () => {
            const component = mount(<NumericInput />);

            const incrementButton = component.find(Button).first();
            incrementButton.simulate("mousedown");

            const value = component.state().value;
            expect(value).to.equal("1");
        });

        it("accepts defaultValue prop", () => {
            const component = mount(<NumericInput defaultValue={2} />);
            const value = component.state().value;
            expect(value).to.equal("2");
        });
    });

    describe("Button position", () => {
        it("renders the buttons on the right when buttonPosition == Position.RIGHT", () => {
            const buttons = shallow(<NumericInput buttonPosition={Position.RIGHT} />)
                .children()
                .last();
            expect(buttons.is(ButtonGroup)).to.be.true;
        });

        it("renders the buttons on the left when buttonPosition == Position.LEFT", () => {
            const buttons = shallow(<NumericInput buttonPosition={Position.LEFT} />)
                .children()
                .first();
            expect(buttons.is(ButtonGroup)).to.be.true;
        });

        it('does not render the buttons when buttonPosition == "none"', () => {
            const component = shallow(<NumericInput buttonPosition="none" />);
            expect(component.find(ButtonGroup).exists()).to.be.false;
        });

        it(`always renders the children in a ControlGroup`, () => {
            // if the input is put into a control group by itself, it'll have squared border radii
            // on the left, which we don't want.
            const component = shallow(<NumericInput />);
            expect(component.find(ControlGroup).exists()).to.be.true;
            component.setProps({ buttonPosition: "none" });
            expect(component.find(ControlGroup).exists()).to.be.true;
        });
    });

    describe("Basic functionality", () => {
        it("works like a text input", () => {
            const component = mount(<NumericInput />);

            component.find("input").simulate("change", { target: { value: "11" } });
            expect(component.state().value).to.equal("11");
        });

        it("allows entry of non-numeric characters", () => {
            const component = mount(<NumericInput />);

            component.find("input").simulate("change", { target: { value: "3 + a" } });

            const value = component.state().value;
            const expectedValue = "3 + a";
            expect(value).to.equal(expectedValue);
        });

        it("provides numeric value to onValueChange as a number and a string", () => {
            const onValueChangeSpy = spy();
            const component = mount(<NumericInput onValueChange={onValueChangeSpy} />);
            const nextValue = "1";

            component.find("input").simulate("change", { target: { value: nextValue } });

            expect(onValueChangeSpy.calledOnce).to.be.true;
            expect(onValueChangeSpy.calledWith(+nextValue, nextValue)).to.be.true;
        });

        it("provides non-numeric value to onValueChange as NaN and a string", () => {
            const onValueChangeSpy = spy();
            const component = mount(<NumericInput onValueChange={onValueChangeSpy} />);
            const invalidValue = "non-numeric-value";

            component.find("input").simulate("change", { target: { value: invalidValue } });

            expect(onValueChangeSpy.calledOnce).to.be.true;
            expect(onValueChangeSpy.calledWith(NaN, invalidValue)).to.be.true;
        });

        it("accepts a numeric value", () => {
            const component = mount(<NumericInput value={10} />);
            const value = component.state().value;
            expect(value).to.equal("10");
        });

        it("accepts a string value", () => {
            const component = mount(<NumericInput value={"10"} />);
            const value = component.state().value;
            expect(value).to.equal("10");
        });

        it("fires onValueChange with the number value, string value, and input element when the value changes", () => {
            const onValueChangeSpy = spy();
            const component = mount(<NumericInput onValueChange={onValueChangeSpy} />);

            const incrementButton = component.find(Button).first();
            incrementButton.simulate("mousedown");
            dispatchMouseEvent(document, "mouseup");

            const inputElement = component.find("input").first().getDOMNode();
            expect(onValueChangeSpy.calledOnceWithExactly(1, "1", inputElement)).to.be.true;
        });

        it("fires onButtonClick with the number value and the string value when either button is pressed", () => {
            const onButtonClickSpy = spy();
            const component = mount(<NumericInput onButtonClick={onButtonClickSpy} />);

            const incrementButton = component.find(Button).first();
            const decrementButton = component.find(Button).last();

            // incrementing from 0
            incrementButton.simulate("mousedown");
            dispatchMouseEvent(document, "mouseup");

            expect(onButtonClickSpy.calledOnce).to.be.true;
            expect(onButtonClickSpy.firstCall.args).to.deep.equal([1, "1"]);
            onButtonClickSpy.resetHistory();

            // decrementing from 1 now
            decrementButton.simulate("mousedown");
            expect(onButtonClickSpy.calledOnce).to.be.true;
            expect(onButtonClickSpy.firstCall.args).to.deep.equal([0, "0"]);
        });
    });

    describe("Selection", () => {
        const VALUE = "12345678";

        describe("selectAllOnFocus", () => {
            it("if false (the default), does not select any text on focus", () => {
                const attachTo = document.createElement("div");
                mount(<NumericInput value="12345678" />, { attachTo });

                const input = attachTo.querySelector("input") as HTMLInputElement;
                input.focus();

                expect(input.selectionStart).to.equal(input.selectionEnd);
            });

            it("if true, selects all text on focus", () => {
                const attachTo = document.createElement("div");
                const input = mount(<NumericInput value={VALUE} selectAllOnFocus={true} />, {
                    attachTo,
                }).find("input");
                input.simulate("focus");
                const { selectionStart, selectionEnd } = input.getDOMNode() as HTMLInputElement;
                expect(selectionStart).to.equal(0);
                expect(selectionEnd).to.equal(VALUE.length);
            });
        });

        describe("selectAllOnIncrement", () => {
            const INCREMENT_KEYSTROKE = { keyCode: Keys.ARROW_UP, which: Keys.ARROW_UP };

            it("if false (the default), does not select any text on increment", () => {
                const attachTo = document.createElement("div");
                const component = mount(<NumericInput value="12345678" />, { attachTo });

                const wrappedInput = component.find(InputGroup).find("input");
                wrappedInput.simulate("keyDown", INCREMENT_KEYSTROKE);

                const input = attachTo.querySelector("input") as HTMLInputElement;
                expect(input.selectionStart).to.equal(input.selectionEnd);
            });

            it("if true, selects all text on increment", () => {
                const attachTo = document.createElement("div");
                const component = mount(<NumericInput value={VALUE} selectAllOnIncrement={true} />, { attachTo });

                const wrappedInput = component.find(InputGroup).find("input");
                wrappedInput.simulate("keyDown", INCREMENT_KEYSTROKE);

                const input = attachTo.querySelector("input") as HTMLInputElement;
                expect(input.selectionStart).to.equal(0);
                expect(input.selectionEnd).to.equal(VALUE.length);
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

        const NUMERIC_DIGITS = stringToCharArray("0123456789"); // could be typed from the keyboard or numpad
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
                // these are typed without the shift key
                runTextInputSuite(NON_NUMERIC_SYMBOLS_WITHOUT_SHIFT, true);
                runTextInputSuite(NUMERIC_SYMBOLS_WITHOUT_SHIFT, false);

                // these are typed with the shift key
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
                runTextInputSuite(charsWithShift, false, { shiftKey: true, altKey: true });
                runTextInputSuite(charsWithShift, false, { shiftKey: true, ctrlKey: true });
                runTextInputSuite(charsWithShift, false, { shiftKey: true, metaKey: true });
            });

            it("allows malformed number inputs as long as all the characters are legal", () => {
                const VALUE = "+++---eeeEEE123...456---+++";

                const component = mount(<NumericInput />);
                const inputField = component.find("input");

                inputField.simulate("change", { target: { value: VALUE } });
                expect(component.state().value).to.equal(VALUE);
            });

            it("omits non-floating-point numeric characters from pasted text", () => {
                const VALUE = "a1a.a2aeaEa+a-a";
                const SANITIZED_VALUE = "1.2eE+-";

                const component = mount(<NumericInput />);
                const inputField = component.find("input");

                inputField.simulate("paste");
                inputField.simulate("change", { target: { value: VALUE } });

                expect(component.state().value).to.equal(SANITIZED_VALUE);
            });
        });

        describe("if allowNumericCharactersOnly = false", () => {
            // Scope-wide flag for setting allowNumericCharactersOnly = false
            const PROP_FLAG: boolean = false;

            // Scope-wide flag for the expected test result.
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
        const simulateIncrement = (component: ReactWrapper<any>, mockEvent?: MockEvent) => {
            const inputField = component.find(InputGroup).find("input");
            inputField.simulate("keydown", addKeyCode(mockEvent, Keys.ARROW_UP));
        };

        const simulateDecrement = (component: ReactWrapper<any>, mockEvent?: MockEvent) => {
            const inputField = component.find(InputGroup).find("input");
            inputField.simulate("keydown", addKeyCode(mockEvent, Keys.ARROW_DOWN));
        };

        runInteractionSuite("Press '↑'", "Press '↓'", simulateIncrement, simulateDecrement);
    });

    // Enable these tests once we have a solution for testing Button onKeyUp callbacks (see PR #561)
    describe("Keyboard interactions on buttons (with Space key)", () => {
        const simulateIncrement = (component: ReactWrapper<any>, mockEvent: MockEvent = {}) => {
            const incrementButton = component.find(Button).first();
            incrementButton.simulate("keydown", addKeyCode(mockEvent, Keys.SPACE));
        };

        const simulateDecrement = (component: ReactWrapper<any>, mockEvent: MockEvent = {}) => {
            const decrementButton = component.find(Button).last();
            decrementButton.simulate("keydown", addKeyCode(mockEvent, Keys.SPACE));
        };

        runInteractionSuite("Press 'SPACE'", "Press 'SPACE'", simulateIncrement, simulateDecrement);
    });

    describe("Keyboard interactions on buttons (with Enter key)", () => {
        const simulateIncrement = (component: ReactWrapper<any>, mockEvent?: MockEvent) => {
            const incrementButton = component.find(Button).first();
            incrementButton.simulate("keydown", addKeyCode(mockEvent, Keys.ENTER));
        };

        const simulateDecrement = (component: ReactWrapper<any>, mockEvent?: MockEvent) => {
            const decrementButton = component.find(Button).last();
            decrementButton.simulate("keydown", addKeyCode(mockEvent, Keys.ENTER));
        };

        runInteractionSuite("Press 'ENTER'", "Press 'ENTER'", simulateIncrement, simulateDecrement);
    });

    describe("Mouse interactions", () => {
        const simulateIncrement = (component: ReactWrapper<any>, mockEvent?: MockEvent) => {
            const incrementButton = component.find(Button).first();
            incrementButton.simulate("mousedown", mockEvent);
        };

        const simulateDecrement = (component: ReactWrapper<any>, mockEvent?: MockEvent) => {
            const decrementButton = component.find(Button).last();
            decrementButton.simulate("mousedown", mockEvent);
        };

        runInteractionSuite("Click '+'", "Click '-'", simulateIncrement, simulateDecrement);
    });

    describe("Value bounds", () => {
        describe("if no bounds are defined", () => {
            it("enforces no minimum bound", () => {
                const component = mount(<NumericInput />);

                const decrementButton = component.find(Button).last();
                decrementButton.simulate("mousedown", { shiftKey: true });
                decrementButton.simulate("mousedown", { shiftKey: true });

                const newValue = component.state().value;
                expect(newValue).to.equal("-20");
            });

            it("enforces no maximum bound", () => {
                const component = mount(<NumericInput />);

                const incrementButton = component.find(Button).first();
                incrementButton.simulate("mousedown", { shiftKey: true });
                incrementButton.simulate("mousedown", { shiftKey: true });

                const newValue = component.state().value;
                expect(newValue).to.equal("20");
            });

            it("clamps an out-of-bounds value to the new `min` if the component props change", () => {
                const component = mount(<NumericInput value={0} />);

                const value = component.state().value;
                expect(value).to.equal("0");

                component.setProps({ min: 10 });

                // the old value was below the min, so the component should have raised the value
                // to meet the new minimum bound.
                const newValue = component.state().value;
                expect(newValue).to.equal("10");
            });

            it("clamps an out-of-bounds value to the new `max` if the component props change", () => {
                const component = mount(<NumericInput value={0} />);

                const value = component.state().value;
                expect(value).to.equal("0");

                component.setProps({ max: -10 });

                // the old value was above the max, so the component should have raised the value
                // to meet the new maximum bound.
                const newValue = component.state().value;
                expect(newValue).to.equal("-10");
            });
        });

        describe("if `min` is defined", () => {
            it("decrements the value as usual if it is above the minimum", () => {
                const MIN_VALUE = 0;
                const component = mount(<NumericInput min={MIN_VALUE} />);

                // try to decrement by 1
                const decrementButton = component.find(Button).last();
                decrementButton.simulate("mousedown");

                const newValue = component.state().value;
                expect(newValue).to.equal("0");
            });

            it("clamps the value to the minimum bound when decrementing by 'stepSize'", () => {
                const MIN_VALUE = -0.5;
                const component = mount(<NumericInput min={MIN_VALUE} />);

                // try to decrement by 1
                const decrementButton = component.find(Button).last();
                decrementButton.simulate("mousedown");

                const newValue = component.state().value;
                expect(newValue).to.equal(MIN_VALUE.toString());
            });

            it("clamps the value to the minimum bound when decrementing by 'minorStepSize'", () => {
                const MIN_VALUE = -0.05;
                const component = mount(<NumericInput min={MIN_VALUE} />);

                // try to decrement by 0.1
                const decrementButton = component.find(Button).last();
                decrementButton.simulate("mousedown", { altKey: true });

                const newValue = component.state().value;
                expect(newValue).to.equal(MIN_VALUE.toString());
            });

            it("clamps the value to the minimum bound when decrementing by 'majorStepSize'", () => {
                const MIN_VALUE = -5;
                const component = mount(<NumericInput min={MIN_VALUE} />);

                // try to decrement by 10
                const decrementButton = component.find(Button).last();
                decrementButton.simulate("mousedown", { shiftKey: true });

                const newValue = component.state().value;
                expect(newValue).to.equal(MIN_VALUE.toString());
            });

            it("fires onValueChange with clamped value if nextProps.min > value ", () => {
                const onValueChangeSpy = spy();
                const component = mount(<NumericInput value={-10} onValueChange={onValueChangeSpy} />);

                component.setProps({ min: 0 });

                const newValue = component.state().value;
                expect(newValue).to.equal("0");

                const inputElement = component.find("input").first().getDOMNode();
                expect(onValueChangeSpy.calledOnceWithExactly(0, "0", inputElement)).to.be.true;
            });

            it("does not fire onValueChange if nextProps.min < value", () => {
                const onValueChangeSpy = spy();
                const component = mount(<NumericInput value={-10} onValueChange={onValueChangeSpy} />);

                component.setProps({ min: -20 });

                const newValue = component.state().value;
                expect(newValue).to.equal("-10");
                expect(onValueChangeSpy.called).to.be.false;
            });
        });

        describe("if `max` is defined", () => {
            it("increments the value as usual if it is above the minimum", () => {
                const MAX_VALUE = 0;
                const component = mount(<NumericInput max={MAX_VALUE} />);

                // try to increment by 1
                const incrementButton = component.find(Button).first();
                incrementButton.simulate("mousedown");

                const newValue = component.state().value;
                expect(newValue).to.equal("0");
            });

            it("clamps the value to the maximum bound when incrementing by 'stepSize'", () => {
                const MAX_VALUE = 0.5;
                const component = mount(<NumericInput max={MAX_VALUE} />);

                // try to increment in by 1
                const incrementButton = component.find(Button).first();
                incrementButton.simulate("mousedown");

                const newValue = component.state().value;
                expect(newValue).to.equal(MAX_VALUE.toString());
            });

            it("clamps the value to the maximum bound when incrementing by 'minorStepSize'", () => {
                const MAX_VALUE = 0.05;
                const component = mount(<NumericInput max={MAX_VALUE} />);

                // try to increment by 0.1
                const incrementButton = component.find(Button).first();
                incrementButton.simulate("mousedown", { altKey: true });

                const newValue = component.state().value;
                expect(newValue).to.equal(MAX_VALUE.toString());
            });

            it("clamps the value to the maximum bound when incrementing by 'majorStepSize'", () => {
                const MAX_VALUE = 5;
                const component = mount(<NumericInput max={MAX_VALUE} />);

                // try to increment by 10
                const incrementButton = component.find(Button).first();
                incrementButton.simulate("mousedown", { shiftKey: true });

                const newValue = component.state().value;
                expect(newValue).to.equal(MAX_VALUE.toString());
            });

            it("fires onValueChange with clamped value if nextProps.max < value ", () => {
                const onValueChangeSpy = spy();
                const component = mount(<NumericInput value={10} onValueChange={onValueChangeSpy} />);

                component.setProps({ max: 0 });

                const newValue = component.state().value;
                expect(newValue).to.equal("0");

                const inputElement = component.find("input").first().getDOMNode();
                expect(onValueChangeSpy.calledOnceWithExactly(0, "0", inputElement)).to.be.true;
            });

            it("does not fire onValueChange if nextProps.max > value", () => {
                const onValueChangeSpy = spy();
                const component = mount(<NumericInput value={10} onValueChange={onValueChangeSpy} />);

                component.setProps({ max: 20 });

                const newValue = component.state().value;
                expect(newValue).to.equal("10");
                expect(onValueChangeSpy.called).to.be.false;
            });
        });

        describe("if min === max", () => {
            it("never changes value", () => {
                const onValueChangeSpy = spy();
                const component = mount(<NumericInput min={2} max={2} onValueChange={onValueChangeSpy} />);
                // repeated interactions, no change in state
                component
                    .find(Button)
                    .first()
                    .simulate("mousedown")
                    .simulate("mousedown")
                    .simulate("mousedown")
                    .simulate("mousedown")
                    .simulate("mousedown");
                expect(component.state().value).to.equal("2");

                const inputElement = component.find("input").first().getDOMNode();
                expect(onValueChangeSpy.calledOnceWithExactly(2, "2", inputElement)).to.be.true;
            });
        });

        describe("clampValueOnBlur", () => {
            it("does not clamp or invoke onValueChange on blur if clampValueOnBlur=false", () => {
                // should be false by default
                const VALUE = "-5";
                const onValueChange = spy();
                const component = mount(<NumericInput clampValueOnBlur={false} onValueChange={onValueChange} />);
                const inputField = component.find("input");

                inputField.simulate("change", { target: { value: VALUE } });
                inputField.simulate("blur");

                expect(component.state().value).to.equal(VALUE);
                expect(onValueChange.calledOnce).to.be.true;
            });

            it("clamps an out-of-bounds value to min", () => {
                const MIN = 0;
                const component = mount(<NumericInput clampValueOnBlur={true} min={MIN} />);
                const inputField = component.find("input");

                inputField.simulate("change", { target: { value: "-5" } });
                inputField.simulate("blur", { target: { value: "-5" } });
                expect(component.state().value).to.equal(MIN.toString());
            });

            it("clamps an out-of-bounds value to max", () => {
                const MAX = 0;
                const component = mount(<NumericInput clampValueOnBlur={true} max={MAX} />);
                const inputField = component.find("input");

                inputField.simulate("change", { target: { value: "5" } });
                inputField.simulate("blur", { target: { value: "5" } });
                expect(component.state().value).to.equal(MAX.toString());
            });

            it("invokes onValueChange when out-of-bounds value clamped on blur", () => {
                const onValueChange = spy();
                const MIN = 0;
                const component = mount(
                    <NumericInput clampValueOnBlur={true} min={MIN} onValueChange={onValueChange} />,
                );
                const inputField = component.find("input");

                inputField.simulate("change", { target: { value: "-5" } });
                inputField.simulate("blur", { target: { value: "-5" } });

                const args = onValueChange.getCall(1).args;
                expect(onValueChange.calledTwice).to.be.true;
                expect(args[0]).to.equal(MIN);
                expect(args[1]).to.equal(MIN.toString());
            });
        });
    });

    // Note: we don't call mount() here since React 16 throws before we can even validate the errors thrown
    // in component constructors
    describe("Validation", () => {
        let consoleError: SinonStub;

        before(() => (consoleError = stub(console, "error")));
        afterEach(() => consoleError.resetHistory());
        after(() => consoleError.restore());

        it("logs an error if min >= max", () => {
            mount(<NumericInput min={2} max={1} />);
            expect(consoleError.calledWith(Errors.NUMERIC_INPUT_MIN_MAX)).to.be.true;
        });

        it("logs an error if stepSize <= 0", () => {
            mount(<NumericInput stepSize={-1} />);
            expect(consoleError.calledWith(Errors.NUMERIC_INPUT_STEP_SIZE_NON_POSITIVE)).to.be.true;
        });

        it("logs an error if minorStepSize <= 0", () => {
            mount(<NumericInput minorStepSize={-0.1} />);
            expect(consoleError.calledWith(Errors.NUMERIC_INPUT_MINOR_STEP_SIZE_NON_POSITIVE)).to.be.true;
        });

        it("logs an error if majorStepSize <= 0", () => {
            mount(<NumericInput majorStepSize={-0.1} />);
            expect(consoleError.calledWith(Errors.NUMERIC_INPUT_MAJOR_STEP_SIZE_NON_POSITIVE)).to.be.true;
        });

        it("logs an error if majorStepSize <= stepSize", () => {
            mount(<NumericInput majorStepSize={0.5} />);
            expect(consoleError.calledWith(Errors.NUMERIC_INPUT_MAJOR_STEP_SIZE_BOUND)).to.be.true;
        });

        it("logs an error if stepSize <= minorStepSize", () => {
            mount(<NumericInput minorStepSize={2} />);
            expect(consoleError.calledWith(Errors.NUMERIC_INPUT_MINOR_STEP_SIZE_BOUND)).to.be.true;
        });

        it("clears the field if the value is invalid when incrementing", () => {
            const component = mount(<ControlledNumericInput value={"<invalid>"} />);

            const value = component.find(NumericInput).state().value;
            expect(value).to.equal("<invalid>");

            const incrementButton = component.find(Button).first();
            incrementButton.simulate("mousedown");

            const newValue = component.state().value;
            expect(newValue).to.equal("");
        });

        it("clears the field if the value is invalid when decrementing", () => {
            const component = mount(<ControlledNumericInput value={"<invalid>"} />);

            const value = component.find(NumericInput).state().value;
            expect(value).to.equal("<invalid>");

            const decrementButton = component.find(Button).last();
            decrementButton.simulate("mousedown");

            const newValue = component.state().value;
            expect(newValue).to.equal("");
        });
    });

    describe("Controlled mode", () => {
        it("value prop updates do not trigger onValueChange", () => {
            const onValueChangeSpy = spy();
            const component = mount(<NumericInput min={0} value={0} max={1} onValueChange={onValueChangeSpy} />);
            component.setProps({ value: 1 });
            expect(onValueChangeSpy.notCalled).to.be.true;
        });

        it("state.value only changes with prop change", () => {
            const initialValue = 10;
            const onValueChangeSpy = spy();
            const component = mount(<NumericInput value={initialValue} onValueChange={onValueChangeSpy} />);

            const incrementButton = component.find(Button).first();
            incrementButton.simulate("mousedown");
            dispatchMouseEvent(document, "mouseup");

            let inputElement = component.find("input");
            expect(inputElement.props().value).to.equal("10");
            expect(onValueChangeSpy.calledOnceWithExactly(11, "11", inputElement.getDOMNode()));

            component.setProps({ value: 11 }).update();
            inputElement = component.find("input");
            expect(inputElement.props().value).to.equal("11");
        });

        it("accepts successive value changes containing non-numeric characters", () => {
            const onValueChangeSpy = spy();
            const component = mount(<NumericInput onValueChange={onValueChangeSpy} />);
            component.setProps({ value: "1" });
            expect(component.state().value).to.equal("1");
            component.setProps({ value: "1 +" });
            expect(component.state().value).to.equal("1 +");
            component.setProps({ value: "1 + 1" });
            expect(component.state().value).to.equal("1 + 1");
        });
    });

    describe("Localization", () => {
        it("accepts the number in a different locale", () => {
            const onValueChangeSpy = spy();
            const component = mount(<NumericInput onValueChange={onValueChangeSpy} locale={"de-DE"} />);
            const nextValue = "99,99";
            const nextValueNumber = 99.99;

            component.find("input").simulate("change", { target: { value: nextValue } });

            expect(onValueChangeSpy.calledOnce).to.be.true;
            expect(onValueChangeSpy.calledWith(nextValueNumber, nextValue)).to.be.true;
        });

        it("accepts the number in a different locale [Arabic - Bahrain (ar-BH)]", () => {
            const onValueChangeSpy = spy();
            const component = mount(<NumericInput onValueChange={onValueChangeSpy} locale={"ar-BH"} />);
            const nextValue = "٩٫٩٩";
            const nextValueNumber = 9.99;

            component.find("input").simulate("change", { target: { value: nextValue } });

            expect(onValueChangeSpy.calledOnce).to.be.true;
            expect(onValueChangeSpy.calledWith(nextValueNumber, nextValue)).to.be.true;
        });

        it("changing the locale it changes the value (en-US to it-IT)", () => {
            const onValueChangeSpy = spy();
            const component = mount(<NumericInput onValueChange={onValueChangeSpy} />);
            const nextValue = "99.99";
            const formattedValue = "99,99";

            component.find("input").simulate("change", { target: { value: nextValue } });
            expect(onValueChangeSpy.lastCall.calledWith(+nextValue, nextValue)).to.be.true;

            component.setProps({ locale: "it-IT" });

            expect(onValueChangeSpy.lastCall.calledWith(+nextValue, formattedValue)).to.be.true;
        });

        it("changing the locale it changes the value (it-IT to undefined)", () => {
            const onValueChangeSpy = spy();
            const component = mount(<NumericInput onValueChange={onValueChangeSpy} locale={"it-IT"} />);
            const nextValue = "99,99";
            const usValue = "99.99";

            component.find("input").simulate("change", { target: { value: nextValue } });
            expect(onValueChangeSpy.lastCall.calledWith(+usValue, nextValue)).to.be.true;

            component.setProps({ locale: undefined });

            expect(onValueChangeSpy.lastCall.calledWith(+usValue, usValue)).to.be.true;
        });

        it("doesn't accept the number in a different format", () => {
            const onValueChangeSpy = spy();
            const component = mount(<NumericInput onValueChange={onValueChangeSpy} />);
            const invalidValue = "77,99";

            component.find("input").simulate("change", { target: { value: invalidValue } });

            expect(onValueChangeSpy.calledOnce).to.be.true;
            expect(onValueChangeSpy.calledWith(NaN, invalidValue)).to.be.true;
        });

        it("increments the number with the specified locale", () => {
            const onValueChangeSpy = spy();
            const component = mount(<NumericInput onValueChange={onValueChangeSpy} locale={"de-DE"} />);
            const nextValue = "7,9";
            const nextValueNumber = 7.9;
            const valueAfterDecrement = "8,9";
            const valueNumberAfterDecrement = 8.9;

            component.find("input").simulate("change", { target: { value: nextValue } });

            expect(onValueChangeSpy.calledWith(nextValueNumber, nextValue)).to.be.true;

            const incrementButton = component.find(Button).first();
            incrementButton.simulate("mousedown");
            dispatchMouseEvent(document, "mouseup");

            expect(onValueChangeSpy.calledWith(valueNumberAfterDecrement, valueAfterDecrement)).to.be.true;
        });

        it("decrements the number with the specified locale", () => {
            const onValueChangeSpy = spy();
            const component = mount(<NumericInput onValueChange={onValueChangeSpy} locale={"de-DE"} />);
            const nextValue = "7,9";
            const nextValueNumber = 7.9;
            const valueAfterDecrement = "6,9";
            const valueNumberAfterDecrement = 6.9;

            component
                .find("input")
                .first()
                .simulate("change", { target: { value: nextValue } });

            expect(onValueChangeSpy.calledWith(nextValueNumber, nextValue)).to.be.true;

            const decrementButton = component.find(Button).last();
            decrementButton.simulate("mousedown");
            dispatchMouseEvent(document, "mouseup");

            expect(onValueChangeSpy.calledWith(valueNumberAfterDecrement, valueAfterDecrement)).to.be.true;
        });
    });

    describe("Other", () => {
        it("disables the increment button when the value is greater than or equal to max", () => {
            const component = mount(<NumericInput value={100} max={100} />);

            const decrementButton = component.find(Button).last();
            const incrementButton = component.find(Button).first();

            expect(decrementButton.props().disabled).to.be.false;
            expect(incrementButton.props().disabled).to.be.true;
        });

        it("disables the decrement button when the value is less than or equal to min", () => {
            const component = mount(<NumericInput value={-10} min={-10} />);

            const decrementButton = component.find(Button).last();
            const incrementButton = component.find(Button).first();

            expect(decrementButton.props().disabled).to.be.true;
            expect(incrementButton.props().disabled).to.be.false;
        });

        it("disables the input field and buttons when disabled is true", () => {
            const component = mount(<NumericInput disabled={true} />);

            const inputGroup = component.find(InputGroup);
            const decrementButton = component.find(Button).last();
            const incrementButton = component.find(Button).first();

            expect(inputGroup.props().disabled).to.be.true;
            expect(decrementButton.props().disabled).to.be.true;
            expect(incrementButton.props().disabled).to.be.true;
        });

        it("disables the buttons and sets the input field to read-only when readOnly is true", () => {
            const component = mount(<NumericInput readOnly={true} />);

            const inputGroup = component.find(InputGroup);
            const decrementButton = component.find(Button).last();
            const incrementButton = component.find(Button).first();

            expect(inputGroup.props().readOnly).to.be.true;
            expect(decrementButton.props().disabled).to.be.true;
            expect(incrementButton.props().disabled).to.be.true;
        });

        it("shows a left icon if provided", () => {
            const component = mount(<NumericInput leftIcon="variable" />);
            const icon = component.find(InputGroup).find(Icon);
            expect(icon.prop("icon")).to.equal("variable");
        });

        it("shows placeholder text if provided", () => {
            const component = mount(<NumericInput placeholder={"Enter a number..."} />);

            const inputField = component.find("input");
            const placeholderText = inputField.props().placeholder;

            expect(placeholderText).to.equal("Enter a number...");
        });

        it("shows right element if provided", () => {
            const component = mount(<NumericInput rightElement={<Button />} />);
            expect(component.find(InputGroup).find(Button)).to.exist;
        });

        it("passed decimal value should be rounded by stepSize", () => {
            const component = mount(<NumericInput value={9.001} min={0} />);
            expect(component.find("input").prop("value")).to.equal("9");
        });

        it("passed decimal value should be rounded by minorStepSize", () => {
            const component = mount(<NumericInput value={"9.01"} min={0} minorStepSize={0.01} />);
            expect(component.find("input").prop("value")).to.equal("9.01");
        });

        it("changes max precision of displayed value to that of the smallest step size defined", () => {
            const component = mount(<NumericInput majorStepSize={1} stepSize={0.1} minorStepSize={0.001} />);
            const incrementButton = component.find(Button).first();

            incrementButton.simulate("mousedown");
            expect(component.find("input").prop("value")).to.equal("0.1");

            incrementButton.simulate("mousedown", { altKey: true });
            expect(component.find("input").prop("value")).to.equal("0.101");

            incrementButton.simulate("mousedown", { shiftKey: true });
            expect(component.find("input").prop("value")).to.equal("1.101");

            // one significant digit too many
            setNextValue(component, "1.0001");
            incrementButton.simulate("mousedown", { altKey: true });
            expect(component.find("input").prop("value")).to.equal("1.001");
        });

        it("changes max precision appropriately when the min/max stepSize props change", () => {
            const onValueChangeSpy = spy();
            const component = mount(
                <NumericInput
                    majorStepSize={1}
                    stepSize={0.1}
                    minorStepSize={0.001}
                    value="0.0001"
                    onValueChange={onValueChangeSpy}
                />,
            );

            // excess digits should truncate to max precision
            let incrementButton = component.find(Button).first();
            incrementButton.simulate("mousedown", { altKey: true });
            expect(onValueChangeSpy.calledOnceWith(0.001, "0.001"));
            onValueChangeSpy.resetHistory();

            // now try a smaller step size, and expect no truncation
            component.setProps({ minorStepSize: 0.0001 });
            incrementButton = component.find(Button).first();
            incrementButton.simulate("mousedown", { altKey: true });
            expect(onValueChangeSpy.calledOnceWith(0.0002, "0.0002"));
            onValueChangeSpy.resetHistory();

            // now try a larger step size, and expect more truncation than before
            component.setProps({ minorStepSize: 0.1 });
            incrementButton = component.find(Button).first();
            incrementButton.simulate("mousedown", { altKey: true });
            expect(onValueChangeSpy.calledOnceWith(0.01, "0.01"));
            onValueChangeSpy.resetHistory();
        });

        it("must not call handleButtonClick if component is disabled", () => {
            const SPACE_KEYSTROKE = { keyCode: Keys.SPACE, which: Keys.SPACE };

            const component = mount(<NumericInput disabled={true} />);

            const incrementButton = component.find(Button).first();
            const handleButtonClickSpy = spy(component.instance(), "handleButtonClick" as any);

            incrementButton.simulate("mousedown");
            incrementButton.simulate("mousedown", { altKey: true });
            incrementButton.simulate("keyDown", SPACE_KEYSTROKE);
            incrementButton.simulate("keyDown", { ...SPACE_KEYSTROKE, altKey: true });

            const decrementButton = component.find(Button).last();
            decrementButton.simulate("mousedown");
            decrementButton.simulate("mousedown", { altKey: true });
            decrementButton.simulate("keyDown", SPACE_KEYSTROKE);
            decrementButton.simulate("keyDown", { ...SPACE_KEYSTROKE, altKey: true });

            expect(handleButtonClickSpy.notCalled).to.be.true;
        });
    });

    interface MockEvent {
        shiftKey?: boolean;
        altKey?: boolean;
        keyCode?: number;
        which?: number;
    }

    function createNumericInputForInteractionSuite(overrides: Partial<HTMLInputProps & NumericInputProps> = {}) {
        // allow `null` to override the default values here
        const majorStepSize = overrides.majorStepSize !== undefined ? overrides.majorStepSize : 20;
        const minorStepSize = overrides.minorStepSize !== undefined ? overrides.minorStepSize : 0.2;

        const controledWrapper = mount(
            <ControlledNumericInput
                majorStepSize={majorStepSize}
                minorStepSize={minorStepSize}
                stepSize={2}
                value={10}
            />,
        );
        return controledWrapper.find(NumericInput);
    }

    function runInteractionSuite(
        incrementDescription: string,
        decrementDescription: string,
        simulateIncrement: (component: ReactWrapper<any>, mockEvent?: Record<string, unknown>) => void,
        simulateDecrement: (component: ReactWrapper<any>, mockEvent?: Record<string, unknown>) => void,
    ) {
        it(`increments by stepSize on ${incrementDescription}`, () => {
            const component = createNumericInputForInteractionSuite();

            simulateIncrement(component);

            const newValue = component.state().value;
            expect(newValue).to.equal("12");
        });

        it(`decrements by stepSize on ${decrementDescription}`, () => {
            const component = createNumericInputForInteractionSuite();

            simulateDecrement(component);

            const newValue = component.state().value;
            expect(newValue).to.equal("8");
        });

        it(`increments by stepSize on Shift + ${incrementDescription} when majorStepSize is null`, () => {
            const component = createNumericInputForInteractionSuite({ majorStepSize: null });

            simulateIncrement(component, { shiftKey: true });

            const newValue = component.state().value;
            expect(newValue).to.equal("12");
        });

        it(`decrements by stepSize on Shift + ${incrementDescription} when majorStepSize is null`, () => {
            const component = createNumericInputForInteractionSuite({ majorStepSize: null });

            simulateDecrement(component, { shiftKey: true });

            const newValue = component.state().value;
            expect(newValue).to.equal("8");
        });

        it(`increments by stepSize on Alt + ${incrementDescription} when minorStepSize is null`, () => {
            const component = createNumericInputForInteractionSuite({ minorStepSize: null });

            simulateIncrement(component, { altKey: true });

            const newValue = component.state().value;
            expect(newValue).to.equal("12");
        });

        it(`decrements by stepSize on Alt + ${decrementDescription} when minorStepSize is null`, () => {
            const component = createNumericInputForInteractionSuite({ minorStepSize: null });

            simulateDecrement(component, { altKey: true });

            const newValue = component.state().value;
            expect(newValue).to.equal("8");
        });

        it(`increments by majorStepSize on Shift + ${incrementDescription}`, () => {
            const component = createNumericInputForInteractionSuite();

            simulateIncrement(component, { shiftKey: true });

            const newValue = component.state().value;
            expect(newValue).to.equal("30");
        });

        it(`decrements by majorStepSize on Shift + ${decrementDescription}`, () => {
            const component = createNumericInputForInteractionSuite();

            simulateDecrement(component, { shiftKey: true });

            const newValue = component.state().value;
            expect(newValue).to.equal("-10");
        });

        it(`increments by minorStepSize on Alt + ${incrementDescription}`, () => {
            const component = createNumericInputForInteractionSuite();

            simulateIncrement(component, { altKey: true });

            const newValue = component.state().value;
            expect(newValue).to.equal("10.2");
        });

        it(`decrements by minorStepSize on Alt + ${incrementDescription}`, () => {
            const component = createNumericInputForInteractionSuite();

            simulateDecrement(component, { altKey: true });

            const newValue = component.state().value;
            expect(newValue).to.equal("9.8");
        });

        it(`increments by majorStepSize on Shift + Alt + ${incrementDescription}`, () => {
            const component = createNumericInputForInteractionSuite();

            simulateIncrement(component, { shiftKey: true, altKey: true });

            const newValue = component.state().value;
            expect(newValue).to.equal("30");
        });

        it(`decrements by majorStepSize on Shift + Alt + ${decrementDescription}`, () => {
            const component = createNumericInputForInteractionSuite();

            simulateDecrement(component, { shiftKey: true, altKey: true });

            const newValue = component.state().value;
            expect(newValue).to.equal("-10");
        });

        it(`increments by minorStepSize on Shift + Alt + ${incrementDescription} when majorStepSize is null`, () => {
            const component = createNumericInputForInteractionSuite({ majorStepSize: null });

            simulateIncrement(component, { shiftKey: true, altKey: true });

            const newValue = component.state().value;
            expect(newValue).to.equal("10.2");
        });

        it(`decrements by minorStepSize on Shift + Alt + ${incrementDescription} when majorStepSize is null`, () => {
            const component = createNumericInputForInteractionSuite({ majorStepSize: null });

            simulateDecrement(component, { shiftKey: true, altKey: true });

            const newValue = component.state().value;
            expect(newValue).to.equal("9.8");
        });

        it(`increments by stepSize on Shift + Alt + ${incrementDescription} when \
            majorStepSize and minorStepSize are null`, () => {
            const component = createNumericInputForInteractionSuite({
                majorStepSize: null,
                minorStepSize: null,
            });

            simulateIncrement(component, { shiftKey: true, altKey: true });

            const newValue = component.state().value;
            expect(newValue).to.equal("12");
        });

        it(`decrements by stepSize on Shift + Alt + ${incrementDescription} when \
            majorStepSize and minorStepSize are null`, () => {
            const component = createNumericInputForInteractionSuite({
                majorStepSize: null,
                minorStepSize: null,
            });

            simulateDecrement(component, { shiftKey: true, altKey: true });

            const newValue = component.state().value;
            expect(newValue).to.equal("8");
        });

        it(`resolves scientific notation to a number before incrementing when allowNumericCharactersOnly=true`, () => {
            const component = createNumericInputForInteractionSuite({
                allowNumericCharactersOnly: true,
                majorStepSize: null,
                minorStepSize: null,
            });

            setNextValue(component, "3e2"); // i.e. 300

            simulateIncrement(component);

            const newValue = component.state().value;
            expect(newValue).to.equal("302");
        });
    }

    function addKeyCode(mockEvent: MockEvent = {}, keyCode: number) {
        return { ...mockEvent, keyCode };
    }

    function stringToCharArray(str: string) {
        return str == null ? [] : str.split("");
    }

    function runTextInputSuite(
        invalidKeyNames: string[],
        expectDefaultPrevented: boolean,
        eventOptions?: Partial<KeyboardEvent>,
        allowNumericCharactersOnly?: boolean,
    ) {
        const onKeyPressSpy = spy();
        const component = mount(
            <NumericInput allowNumericCharactersOnly={allowNumericCharactersOnly} onKeyPress={onKeyPressSpy} />,
        );
        const inputField = component.find("input");

        invalidKeyNames.forEach((keyName, i) => {
            inputField.simulate("keypress", { key: keyName, ...eventOptions });
            const event = onKeyPressSpy.getCall(i).args[0] as KeyboardEvent;
            const valueToCheck = expectDefaultPrevented === true ? event.defaultPrevented : !event.defaultPrevented; // can be undefined, so just check that it's falsey.
            expect(valueToCheck).to.be.true;
        });
    }

    // instance.setState() doesn't work like it used to, so we use this helper function to
    // limit the places where we reach into NumericInput internals
    function setNextValue(wrapper: ReactWrapper, value: string) {
        const numericInput = wrapper.find(NumericInput);

        try {
            if (numericInput.exists()) {
                (numericInput.instance() as any).handleNextValue(value);
            } else {
                (wrapper.instance() as any).handleNextValue(value);
            }
        } catch (e) {
            if (e instanceof ReferenceError) {
                assert.fail("Unable to set next value on mounted NumericInput");
            }
            throw e;
        }
    }
});

/**
 * Wraps NumericInput to make it behave like a controlled component, treating props.value as a default value
 */
class ControlledNumericInput extends React.PureComponent<NumericInputProps, { value?: string }> {
    public state = {
        // treat value as "defaultValue"
        value: this.props.value?.toString(),
    };

    public render() {
        return <NumericInput {...this.props} value={this.state.value} onValueChange={this.handleValueChange} />;
    }

    private handleValueChange = (_valueAsNumber: number, value: string) => {
        this.setState({ value });
    };
}
