/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { expect } from "chai";
import { mount, ReactWrapper } from "enzyme";
import * as React from "react";

import * as Errors from "../../src/common/errors";
import { Button, Classes, InputGroup, Keys, NumericInput, Position } from "../../src/index";

describe("<NumericInput>", () => {

    describe("Defaults", () => {

        it("renders the buttons on the right by default", () => {
            const component = mount(<NumericInput />);
            const leftGroup = component.childAt(0);
            const rightGroup = component.childAt(1);
            expect(leftGroup.type()).to.equal(InputGroup);
            expect(rightGroup.key()).to.equal("button-group");
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
            incrementButton.simulate("click");

            const value = component.state().value;
            expect(value).to.equal("1");
        });
    });

    describe("Button position", () => {

        it("renders the buttons on the right when buttonPosition == Position.RIGHT", () => {
            const component = mount(<NumericInput buttonPosition={Position.RIGHT} />);
            const inputGroup = component.find(InputGroup);
            expect(inputGroup.name()).to.equal("Blueprint.InputGroup");
        });

        it("renders the buttons on the left when buttonPosition == Position.LEFT", () => {
            const component = mount(<NumericInput buttonPosition={Position.LEFT} />);
            const inputGroup = component.find(InputGroup);
            expect(inputGroup.name()).to.equal("Blueprint.InputGroup");
        });

        it("does not render the buttons when buttonPosition == \"none\"", () => {
            const component = mount(<NumericInput buttonPosition={"none"} />);

            const inputGroup = component.find(InputGroup);
            const numChildren = component.children().length;

            expect(inputGroup.name()).to.equal("Blueprint.InputGroup");
            expect(numChildren).to.equal(1);
        });

        it("does not render the buttons when buttonPosition is null", () => {
            const component = mount(<NumericInput buttonPosition={null} />);

            const inputGroup = component.find(InputGroup);
            const numChildren = component.children().length;

            expect(inputGroup.name()).to.equal("Blueprint.InputGroup");
            expect(numChildren).to.equal(1);
        });

        it(`renders the children in a ${Classes.CONTROL_GROUP} when buttons are visible`, () => {
            // if the input is put into a .pt-control-group by itself, it'll have squared border radii
            // on the left, which we don't want.
            const component = mount(<NumericInput />);

            const index = component.html().indexOf(Classes.CONTROL_GROUP);
            const isClassPresent = index >= 0;

            expect(isClassPresent).to.be.true;
        });

        it(`does not render the children in a ${Classes.CONTROL_GROUP} when buttons are hidden`, () => {
            // if the input is put into a .pt-control-group by itself, it'll have squared border radii
            // on the left, which we don't want.
            const component = mount(<NumericInput buttonPosition={null} />);

            const index = component.html().indexOf(Classes.CONTROL_GROUP);
            const isClassPresent = index >= 0;

            expect(isClassPresent).to.be.false;
        });
    });

    describe("Basic functionality", () => {

        it("works like a text input", () => {
            const component = mount(<NumericInput />);

            const inputField = component.find("input");
            inputField.simulate("change", { target: { value: "11" } });

            const value = component.state().value;
            const expectedValue = "11";
            expect(value).to.equal(expectedValue);
        });

        it("allows entry of non-numeric characters", () => {
            const component = mount(<NumericInput />);

            const inputField = component.find("input");
            inputField.simulate("change", { target: { value: "3 + a" } });

            const value = component.state().value;
            const expectedValue = "3 + a";
            expect(value).to.equal(expectedValue);
        });

        it("provides numeric value to onValueChange as a number and a string", () => {
            const onValueChangeSpy = sinon.spy();
            const component = mount(<NumericInput onValueChange={onValueChangeSpy} value={1} />);

            component.find("input").simulate("change");

            expect(onValueChangeSpy.calledOnce).to.be.true;
            expect(onValueChangeSpy.calledWith(1, "1")).to.be.true;
        });

        it("provides non-numeric value to onValueChange as NaN and a string", () => {
            const onValueChangeSpy = sinon.spy();
            const component = mount(<NumericInput onValueChange={onValueChangeSpy} value={"non-numeric-value"} />);

            component.find("input").simulate("change");

            expect(onValueChangeSpy.calledOnce).to.be.true;
            expect(onValueChangeSpy.calledWith(NaN, "non-numeric-value")).to.be.true;
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

        it("places the cursor at the end of the input field on focus", () => {
            const attachTo = document.createElement("div");
            mount(<NumericInput value="12345678" />, { attachTo });
            const input = attachTo.query("input") as HTMLInputElement;
            expect(input.selectionStart).to.equal(8);
            expect(input.selectionEnd).to.equal(8);
        });

        it("in controlled mode, keeps the cursor at the end of the input after additional characters are typed", () => {
            const attachTo = document.createElement("div");
            const component = mount(<NumericInput value="12345678" />, { attachTo });
            component.setProps({ value: "1234567890" });

            const input = attachTo.query("input") as HTMLInputElement;
            expect(input.selectionStart).to.equal(10);
            expect(input.selectionEnd).to.equal(10);
        });

        it("fires onValueChange with the number value and the string value when the value changes", () => {
            const onValueChangeSpy = sinon.spy();
            const component = mount(<NumericInput onValueChange={onValueChangeSpy} />);

            const incrementButton = component.find(Button).first();
            incrementButton.simulate("click");

            expect(onValueChangeSpy.calledOnce).to.be.true;
            expect(onValueChangeSpy.firstCall.args).to.deep.equal([1, "1"]);
        });
    });

    describe("Keyboard interactions in input field", () => {

        const simulateIncrement = (component: ReactWrapper<any, {}>, mockEvent?: IMockEvent) => {
            let mergedMockEvent = mockEvent || {};
            mergedMockEvent.keyCode = Keys.ARROW_UP;
            mergedMockEvent.which = Keys.ARROW_UP;

            const inputField = component.find(InputGroup).find("input");
            inputField.simulate("keyDown", mergedMockEvent);
        };

        const simulateDecrement = (component: ReactWrapper<any, {}>, mockEvent?: IMockEvent) => {
            let mergedMockEvent = mockEvent || {};
            mergedMockEvent.keyCode = Keys.ARROW_DOWN;
            mergedMockEvent.which = Keys.ARROW_DOWN;

            const inputField = component.find(InputGroup).find("input");
            inputField.simulate("keyDown", mergedMockEvent);
        };

        runInteractionSuite("Press '↑'", "Press '↓'", simulateIncrement, simulateDecrement);
    });

    // Enable these tests once we have a solution for testing Button onKeyUp callbacks (see PR #561)
    describe("Keyboard interactions on buttons (with Space key)", () => {

        const simulateIncrement = (component: ReactWrapper<any, {}>, mockEvent?: IMockEvent) => {
            let mergedMockEvent = mockEvent || {};
            mergedMockEvent.keyCode = Keys.SPACE;
            mergedMockEvent.which = Keys.SPACE;

            const incrementButton = component.find(Button).first();
            incrementButton.simulate("keyUp", mergedMockEvent);
        };

        const simulateDecrement = (component: ReactWrapper<any, {}>, mockEvent?: IMockEvent) => {
            let mergedMockEvent = mockEvent || {};
            mergedMockEvent.keyCode = Keys.SPACE;
            mergedMockEvent.which = Keys.SPACE;

            const decrementButton = component.find(Button).last();
            decrementButton.simulate("keyUp", mergedMockEvent);
        };

        runInteractionSuite("Press 'SPACE'", "Press 'SPACE'", simulateIncrement, simulateDecrement);
    });

    // Enable these tests once we have a solution for testing Button onKeyUp callbacks (see PR #561)
    describe("Keyboard interactions on buttons (with Enter key)", () => {

        const simulateIncrement = (component: ReactWrapper<any, {}>, mockEvent?: IMockEvent) => {
            let mergedMockEvent = mockEvent || {};
            mergedMockEvent.keyCode = Keys.ENTER;
            mergedMockEvent.which = Keys.ENTER;

            const incrementButton = component.find(Button).first();
            incrementButton.simulate("keyUp", mergedMockEvent);
        };

        const simulateDecrement = (component: ReactWrapper<any, {}>, mockEvent?: IMockEvent) => {
            let mergedMockEvent = mockEvent || {};
            mergedMockEvent.keyCode = Keys.ENTER;
            mergedMockEvent.which = Keys.ENTER;

            const decrementButton = component.find(Button).last();
            decrementButton.simulate("keyUp", mergedMockEvent);
        };

        runInteractionSuite("Press 'ENTER'", "Press 'ENTER'", simulateIncrement, simulateDecrement);
    });

    describe("Mouse interactions", () => {

        const simulateIncrement = (component: ReactWrapper<any, {}>, mockEvent?: IMockEvent) => {
            const incrementButton = component.find(Button).first();
            incrementButton.simulate("click", mockEvent);
        };

        const simulateDecrement = (component: ReactWrapper<any, {}>, mockEvent?: IMockEvent) => {
            const decrementButton = component.find(Button).last();
            decrementButton.simulate("click", mockEvent);
        };

        runInteractionSuite("Click '+'", "Click '-'", simulateIncrement, simulateDecrement);
    });

    describe("Value bounds", () => {

        describe("if no bounds are defined", () => {

            it("enforces no minimum bound", () => {
                const component = mount(<NumericInput />);

                const decrementButton = component.find(Button).last();
                decrementButton.simulate("click", { shiftKey: true });
                decrementButton.simulate("click", { shiftKey: true });

                const newValue = component.state().value;
                expect(newValue).to.equal("-20");
            });

            it("enforces no maximum bound", () => {
                const component = mount(<NumericInput />);

                const incrementButton = component.find(Button).first();
                incrementButton.simulate("click", { shiftKey: true });
                incrementButton.simulate("click", { shiftKey: true });

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
                decrementButton.simulate("click");

                const newValue = component.state().value;
                expect(newValue).to.equal("0");
            });

            it("clamps the value to the minimum bound when decrementing by 'stepSize'", () => {
                const MIN_VALUE = -0.5;
                const component = mount(<NumericInput min={MIN_VALUE} />);

                // try to decrement by 1
                const decrementButton = component.find(Button).last();
                decrementButton.simulate("click");

                const newValue = component.state().value;
                expect(newValue).to.equal(MIN_VALUE.toString());
            });

            it("clamps the value to the minimum bound when decrementing by 'minorStepSize'", () => {
                const MIN_VALUE = -0.05;
                const component = mount(<NumericInput min={MIN_VALUE} />);

                // try to decrement by 0.1
                const decrementButton = component.find(Button).last();
                decrementButton.simulate("click", { altKey: true });

                const newValue = component.state().value;
                expect(newValue).to.equal(MIN_VALUE.toString());
            });

            it("clamps the value to the minimum bound when decrementing by 'majorStepSize'", () => {
                const MIN_VALUE = -5;
                const component = mount(<NumericInput min={MIN_VALUE} />);

                // try to decrement by 10
                const decrementButton = component.find(Button).last();
                decrementButton.simulate("click", { shiftKey: true });

                const newValue = component.state().value;
                expect(newValue).to.equal(MIN_VALUE.toString());
            });

            it("fires onValueChange with clamped value if props.min was updated to exceed current value ", () => {
                const onValueChangeSpy = sinon.spy();
                const component = mount(<NumericInput value={-10} onValueChange={onValueChangeSpy} />);

                component.setProps({ min: 0 });

                const newValue = component.state().value;
                expect(newValue).to.equal("0");
                expect(onValueChangeSpy.calledOnce).to.be.true;
                expect(onValueChangeSpy.firstCall.args).to.deep.equal([0, "0"]);
            });
        });

        describe("if `max` is defined", () => {

            it("increments the value as usual if it is above the minimum", () => {
                const MAX_VALUE = 0;
                const component = mount(<NumericInput max={MAX_VALUE} />);

                // try to increment by 1
                const incrementButton = component.find(Button).first();
                incrementButton.simulate("click");

                const newValue = component.state().value;
                expect(newValue).to.equal("0");
            });

            it("clamps the value to the maximum bound when incrementing by 'stepSize'", () => {
                const MAX_VALUE = 0.5;
                const component = mount(<NumericInput max={MAX_VALUE} />);

                // try to increment in by 1
                const incrementButton = component.find(Button).first();
                incrementButton.simulate("click");

                const newValue = component.state().value;
                expect(newValue).to.equal(MAX_VALUE.toString());
            });

            it("clamps the value to the maximum bound when incrementing by 'minorStepSize'", () => {
                const MAX_VALUE = 0.05;
                const component = mount(<NumericInput max={MAX_VALUE} />);

                // try to increment by 0.1
                const incrementButton = component.find(Button).first();
                incrementButton.simulate("click", { altKey: true });

                const newValue = component.state().value;
                expect(newValue).to.equal(MAX_VALUE.toString());
            });

            it("clamps the value to the maximum bound when incrementing by 'majorStepSize'", () => {
                const MAX_VALUE = 5;
                const component = mount(<NumericInput max={MAX_VALUE} />);

                // try to increment by 10
                const incrementButton = component.find(Button).first();
                incrementButton.simulate("click", { shiftKey: true });

                const newValue = component.state().value;
                expect(newValue).to.equal(MAX_VALUE.toString());
            });

            it("fires onValueChange with clamped value if props.max was updated to be less than current value ", () => {
                const onValueChangeSpy = sinon.spy();
                const component = mount(<NumericInput value={10} onValueChange={onValueChangeSpy} />);

                component.setProps({ max: 0 });

                const newValue = component.state().value;
                expect(newValue).to.equal("0");
                expect(onValueChangeSpy.calledOnce).to.be.true;
                expect(onValueChangeSpy.firstCall.args).to.deep.equal([0, "0"]);
            });
        });
    });

    describe("Validation", () => {

        it("throws an error if min >= max", () => {
            const fn = () => { mount(<NumericInput min={2} max={1} />); };
            expect(fn).to.throw(Errors.NUMERIC_INPUT_MIN_MAX);
        });

        it("throws an error if stepSize is null", () => {
            const fn = () => { mount(<NumericInput stepSize={null} />); };
            expect(fn).to.throw(Errors.NUMERIC_INPUT_STEP_SIZE_NULL);
        });

        it("throws an error if stepSize <= 0", () => {
            const fn = () => { mount(<NumericInput stepSize={-1} />); };
            expect(fn).to.throw(Errors.NUMERIC_INPUT_STEP_SIZE_NON_POSITIVE);
        });

        it("throws an error if minorStepSize <= 0", () => {
            const fn = () => { mount(<NumericInput minorStepSize={-0.1} />); };
            expect(fn).to.throw(Errors.NUMERIC_INPUT_MINOR_STEP_SIZE_NON_POSITIVE);
        });

        it("throws an error if majorStepSize <= 0", () => {
            const fn = () => { mount(<NumericInput majorStepSize={-0.1} />); };
            expect(fn).to.throw(Errors.NUMERIC_INPUT_MAJOR_STEP_SIZE_NON_POSITIVE);
        });

        it("throws an error if majorStepSize <= stepSize", () => {
            const fn = () => { mount(<NumericInput majorStepSize={0.5} />); };
            expect(fn).to.throw(Errors.NUMERIC_INPUT_MAJOR_STEP_SIZE_BOUND);
        });

        it("throws an error if stepSize <= minorStepSize", () => {
            const fn = () => { mount(<NumericInput minorStepSize={2} />); };
            expect(fn).to.throw(Errors.NUMERIC_INPUT_MINOR_STEP_SIZE_BOUND);
        });

        it("clears the field if the value is invalid when incrementing", () => {
            const component = mount(<NumericInput value={"<invalid>"} />);

            const value = component.state().value;
            expect(value).to.equal("<invalid>");

            const incrementButton = component.find(Button).first();
            incrementButton.simulate("click");

            const newValue = component.state().value;
            expect(newValue).to.equal("");
        });

        it("clears the field if the value is invalid when decrementing", () => {
            const component = mount(<NumericInput value={"<invalid>"} />);

            const value = component.state().value;
            expect(value).to.equal("<invalid>");

            const decrementButton = component.find(Button).last();
            decrementButton.simulate("click");

            const newValue = component.state().value;
            expect(newValue).to.equal("");
        });
    });

    describe("Other", () => {

        it("disables the input field and buttons when disabled is true", () => {
            const component = mount(<NumericInput disabled={true} />);

            const inputGroup      = component.find(InputGroup);
            const decrementButton = component.find(Button).last();
            const incrementButton = component.find(Button).first();

            expect(inputGroup.props().disabled).to.be.true;
            expect(decrementButton.props().disabled).to.be.true;
            expect(incrementButton.props().disabled).to.be.true;
        });

        it("disables the buttons and sets the input field to read-only when readOnly is true", () => {
            const component = mount(<NumericInput readOnly={true} />);

            const inputGroup      = component.find(InputGroup);
            const decrementButton = component.find(Button).last();
            const incrementButton = component.find(Button).first();

            expect(inputGroup.props().readOnly).to.be.true;
            expect(decrementButton.props().disabled).to.be.true;
            expect(incrementButton.props().disabled).to.be.true;
        });

        it("shows a left icon if provided", () => {
            const component = mount(<NumericInput leftIconName={"variable"} />);

            const inputGroup = component.find(InputGroup);
            const icon = inputGroup.childAt(0);

            expect(icon.hasClass("pt-icon-variable")).to.be.true;
        });

        it("shows placeholder text if provided", () => {
            const component = mount(<NumericInput placeholder={"Enter a number..."} />);

            const inputField = component.find("input");
            const placeholderText = inputField.props().placeholder;

            expect(placeholderText).to.equal("Enter a number...");
        });
    });

    interface INumericInputOverrides {
        majorStepSize?: number;
        minorStepSize?: number;
        [key: string]: number;
    }

    interface IMockEvent {
        shiftKey?: boolean;
        altKey?: boolean;
        keyCode?: number;
        which?: number;
    }

    function createNumericInputForInteractionSuite(overrides?: INumericInputOverrides) {
        const _getOverride = (name: string, defaultValue: number) => {
            return (overrides != null && overrides[name] !== undefined) ? overrides[name] : defaultValue;
        };

        return mount(<NumericInput
            majorStepSize={_getOverride("majorStepSize", 20)}
            minorStepSize={_getOverride("minorStepSize", 0.2)}
            stepSize={2}
            value={10}
        />);
    }

    function runInteractionSuite(
        incrementDescription: string,
        decrementDescription: string,
        simulateIncrement: (component: ReactWrapper<any, {}>, mockEvent?: Object) => void,
        simulateDecrement: (component: ReactWrapper<any, {}>, mockEvent?: Object) => void) {

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
            const component = createNumericInputForInteractionSuite({ majorStepSize: null, minorStepSize: null });

            simulateIncrement(component, { shiftKey: true, altKey: true });

            const newValue = component.state().value;
            expect(newValue).to.equal("12");
        });

        it(`decrements by stepSize on Shift + Alt + ${incrementDescription} when \
            majorStepSize and minorStepSize are null`, () => {
            const component = createNumericInputForInteractionSuite({ majorStepSize: null, minorStepSize: null });

            simulateDecrement(component, { shiftKey: true, altKey: true });

            const newValue = component.state().value;
            expect(newValue).to.equal("8");
        });
    }
});
