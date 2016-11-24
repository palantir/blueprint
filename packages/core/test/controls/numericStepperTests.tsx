/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { expect } from "chai";
import { mount, ReactWrapper } from "enzyme";
import * as React from "react";

import * as Errors from "../../src/common/errors";
import { Classes, Keys, NumericStepper, NumericStepperButtonPosition } from "../../src/index";

describe("<NumericStepper>", () => {

    describe("Defaults", () => {

        it("renders the buttons on the right by default", () => {
            const component = mount(<NumericStepper />);

            const inputGroup      = component.childAt(0);
            const decrementButton = component.childAt(1);
            const incrementButton = component.childAt(2);

            expect(inputGroup.name()).to.equal("Blueprint.InputGroup");
            expect(decrementButton.name()).to.equal("Blueprint.Button");
            expect(incrementButton.name()).to.equal("Blueprint.Button");
        });

        it("has a stepSize of 1 by default", () => {
            const component = mount(<NumericStepper />);
            const stepSize = component.props().stepSize;
            expect(stepSize).to.equal(1);
        });

        it("has a minorStepSize of 0.1 by default", () => {
            const component = mount(<NumericStepper />);
            const minorStepSize = component.props().minorStepSize;
            expect(minorStepSize).to.equal(0.1);
        });

        it("has a majorStepSize of 10 by default", () => {
            const component = mount(<NumericStepper />);
            const majorStepSize = component.props().majorStepSize;
            expect(majorStepSize).to.equal(10);
        });

        it("has a value of '' by default", () => {
            const component = mount(<NumericStepper />);
            const value = component.state().value;
            expect(value).to.equal("");
        });

        it("increments the value from 0 if the field is empty", () => {
            const component = mount(<NumericStepper />);

            const incrementButton = component.childAt(2);
            incrementButton.simulate("click");

            const value = component.state().value;
            expect(value).to.equal("1");
        });
    });

    describe("Button position", () => {

        it("renders the buttons on the right when buttonPosition == NumericStepperButtonPosition.RIGHT", () => {
            const component = mount(<NumericStepper buttonPosition={NumericStepperButtonPosition.RIGHT} />);

            const inputGroup      = component.childAt(0);
            const decrementButton = component.childAt(1);
            const incrementButton = component.childAt(2);

            expect(inputGroup.name()).to.equal("Blueprint.InputGroup");
            expect(decrementButton.name()).to.equal("Blueprint.Button");
            expect(incrementButton.name()).to.equal("Blueprint.Button");
        });

        it("renders the buttons on the left when buttonPosition == NumericStepperButtonPosition.LEFT", () => {
            const component = mount(<NumericStepper buttonPosition={NumericStepperButtonPosition.LEFT} />);

            const decrementButton = component.childAt(0);
            const incrementButton = component.childAt(1);
            const inputGroup      = component.childAt(2);

            expect(decrementButton.name()).to.equal("Blueprint.Button");
            expect(incrementButton.name()).to.equal("Blueprint.Button");
            expect(inputGroup.name()).to.equal("Blueprint.InputGroup");
        });

        it("renders the buttons on either side when buttonPosition == NumericStepperButtonPosition.SPLIT", () => {
            const component = mount(<NumericStepper buttonPosition={NumericStepperButtonPosition.SPLIT} />);

            const decrementButton = component.childAt(0);
            const inputGroup      = component.childAt(1);
            const incrementButton = component.childAt(2);

            expect(decrementButton.name()).to.equal("Blueprint.Button");
            expect(inputGroup.name()).to.equal("Blueprint.InputGroup");
            expect(incrementButton.name()).to.equal("Blueprint.Button");
        });

        it("does not render the buttons when buttonPosition == NumericStepperButtonPosition.NONE", () => {
            const component = mount(<NumericStepper buttonPosition={NumericStepperButtonPosition.NONE} />);

            const inputGroup = component.childAt(0);
            const numChildren = component.children().length;

            expect(inputGroup.name()).to.equal("Blueprint.InputGroup");
            expect(numChildren).to.equal(1);
        });

        it("does not render the buttons when buttonPosition is null", () => {
            const component = mount(<NumericStepper buttonPosition={null} />);

            const inputGroup = component.childAt(0);
            const numChildren = component.children().length;

            expect(inputGroup.name()).to.equal("Blueprint.InputGroup");
            expect(numChildren).to.equal(1);
        });

        it(`renders the children in a ${Classes.CONTROL_GROUP} when buttons are visible`, () => {
            // if the input is put into a .pt-control-group by itself, it'll have squared border radii
            // on the left, which we don't want.
            const component = mount(<NumericStepper />);

            const index = component.html().indexOf(Classes.CONTROL_GROUP);
            const isClassPresent = index >= 0;

            expect(isClassPresent).to.be.true;
        });

        it(`does not render the children in a ${Classes.CONTROL_GROUP} when buttons are hidden`, () => {
            // if the input is put into a .pt-control-group by itself, it'll have squared border radii
            // on the left, which we don't want.
            const component = mount(<NumericStepper buttonPosition={null} />);

            const index = component.html().indexOf(Classes.CONTROL_GROUP);
            const isClassPresent = index >= 0;

            expect(isClassPresent).to.be.false;
        });
    });

    describe("Basic functionality", () => {

        it("works like a text input", () => {
            const component = mount(<NumericStepper />);

            const inputField = component.find("input");
            inputField.simulate("change", { target: { value: "11" } });

            const value = component.state().value;
            const expectedValue = "11";
            expect(value).to.equal(expectedValue);
        });

        it("allows entry of non-numeric characters", () => {
            const component = mount(<NumericStepper />);

            const inputField = component.find("input");
            inputField.simulate("change", { target: { value: "3 + a" } });

            const value = component.state().value;
            const expectedValue = "3 + a";
            expect(value).to.equal(expectedValue);
        });

        it("provides value changes to onUpdate if provided", () => {
            const onUpdateSpy = sinon.spy();
            const component = mount(<NumericStepper onUpdate={onUpdateSpy} />);

            const incrementButton = component.childAt(2);
            incrementButton.simulate("click");

            expect(onUpdateSpy.calledOnce).to.be.true;
            expect(onUpdateSpy.calledWith("1")).to.be.true;
        });

        it("provides value changes to onDone (if provided) when Enter pressed in the input field", () => {
            const onDoneSpy = sinon.spy();
            const component = mount(<NumericStepper onDone={onDoneSpy} />);

            const inputField = component.find("input");
            inputField.simulate("change", { target: { value: "3 + a" } });
            inputField.simulate("keydown", { keyCode: Keys.ENTER });

            expect(onDoneSpy.calledOnce).to.be.true;
            expect(onDoneSpy.calledWith("3 + a")).to.be.true;
        });

        it("provides value changes to onDone (if provided) when field loses focus", () => {
            const onDoneSpy = sinon.spy();
            const component = mount(<NumericStepper onDone={onDoneSpy} />);

            const inputField = component.find("input");
            inputField.simulate("change", { target: { value: "3 + a" } });
            inputField.simulate("blur");

            expect(onDoneSpy.calledOnce).to.be.true;
            expect(onDoneSpy.calledWith("3 + a")).to.be.true;
        });

        it("accepts a numeric value", () => {
            const component = mount(<NumericStepper value={10} />);
            const value = component.state().value;
            expect(value).to.equal("10");
        });

        it("accepts a string value", () => {
            const component = mount(<NumericStepper value={"10"} />);
            const value = component.state().value;
            expect(value).to.equal("10");
        });
    });

    describe("Keyboard interactions", () => {

        const simulateIncrement = (component: ReactWrapper<any, {}>, mockEvent?: IMockEvent) => {
            let mergedMockEvent = mockEvent || {};
            mergedMockEvent.keyCode = Keys.ARROW_UP;
            mergedMockEvent.which = Keys.ARROW_UP;

            const inputField = component.childAt(0).find("input");
            inputField.simulate("keyDown", mergedMockEvent);
        };

        const simulateDecrement = (component: ReactWrapper<any, {}>, mockEvent?: IMockEvent) => {
            let mergedMockEvent = mockEvent || {};
            mergedMockEvent.keyCode = Keys.ARROW_DOWN;
            mergedMockEvent.which = Keys.ARROW_DOWN;

            const inputField = component.childAt(0).find("input");
            inputField.simulate("keyDown", mergedMockEvent);
        };

        runInteractionSuite("Press '↑'", "Press '↓'", simulateIncrement, simulateDecrement);
    });

    describe("Mouse interactions", () => {

        const simulateIncrement = (component: ReactWrapper<any, {}>, mockEvent?: IMockEvent) => {
            const incrementButton = component.childAt(2);
            incrementButton.simulate("click", mockEvent);
        };

        const simulateDecrement = (component: ReactWrapper<any, {}>, mockEvent?: IMockEvent) => {
            const decrementButton = component.childAt(1);
            decrementButton.simulate("click", mockEvent);
        };

        runInteractionSuite("Click '+'", "Click '-'", simulateIncrement, simulateDecrement);
    });

    describe("Value bounds", () => {

        describe("if no bounds are defined", () => {

            it("enforces no minimum bound", () => {
                const component = mount(<NumericStepper />);

                const decrementButton = component.childAt(1);
                decrementButton.simulate("click", { shiftKey: true });
                decrementButton.simulate("click", { shiftKey: true });

                const newValue = component.state().value;
                expect(newValue).to.equal("-20");
            });

            it("enforces no maximum bound", () => {
                const component = mount(<NumericStepper />);

                const incrementButton = component.childAt(2);
                incrementButton.simulate("click", { shiftKey: true });
                incrementButton.simulate("click", { shiftKey: true });

                const newValue = component.state().value;
                expect(newValue).to.equal("20");
            });

            it("clamps an out-of-bounds value to the new `min` if the component props change", () => {
                const component = mount(<NumericStepper value={0} />);

                const value = component.state().value;
                expect(value).to.equal("0");

                component.setProps({ min: 10 });

                // the old value was below the min, so the component should have raised the value
                // to meet the new minimum bound.
                const newValue = component.state().value;
                expect(newValue).to.equal("10");
            });

            it("clamps an out-of-bounds value to the new `max` if the component props change", () => {
                const component = mount(<NumericStepper value={0} />);

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
                const MIN_VALUE = -2;
                const component = mount(<NumericStepper min={MIN_VALUE} />);

                // try to decrement by 1
                const decrementButton = component.childAt(1);
                decrementButton.simulate("click");

                const newValue = component.state().value;
                expect(newValue).to.equal("-1");
            });

            it("clamps the value to the minimum bound when decrementing by 'stepSize'", () => {
                const MIN_VALUE = -0.5;
                const component = mount(<NumericStepper min={MIN_VALUE} />);

                // try to decrement by 1
                const decrementButton = component.childAt(1);
                decrementButton.simulate("click");

                const newValue = component.state().value;
                expect(newValue).to.equal(MIN_VALUE.toString());
            });

            it("clamps the value to the minimum bound when decrementing by 'minorStepSize'", () => {
                const MIN_VALUE = -0.05;
                const component = mount(<NumericStepper min={MIN_VALUE} />);

                // try to decrement by 0.1
                const decrementButton = component.childAt(1);
                decrementButton.simulate("click", { altKey: true });

                const newValue = component.state().value;
                expect(newValue).to.equal(MIN_VALUE.toString());
            });

            it("clamps the value to the minimum bound when decrementing by 'majorStepSize'", () => {
                const MIN_VALUE = -5;
                const component = mount(<NumericStepper min={MIN_VALUE} />);

                // try to decrement by 10
                const decrementButton = component.childAt(1);
                decrementButton.simulate("click", { shiftKey: true });

                const newValue = component.state().value;
                expect(newValue).to.equal(MIN_VALUE.toString());
            });
        });

        describe("if `max` is defined", () => {

            it("increments the value as usual if it is above the minimum", () => {
                const MAX_VALUE = 2;
                const component = mount(<NumericStepper max={MAX_VALUE} />);

                // try to increment by 1
                const incrementButton = component.childAt(2);
                incrementButton.simulate("click");

                const newValue = component.state().value;
                expect(newValue).to.equal("1");
            });

            it("clamps the value to the maximum bound when incrementing by 'stepSize'", () => {
                const MAX_VALUE = 0.5;
                const component = mount(<NumericStepper max={MAX_VALUE} />);

                // try to increment in by 1
                const incrementButton = component.childAt(2);
                incrementButton.simulate("click");

                const newValue = component.state().value;
                expect(newValue).to.equal(MAX_VALUE.toString());
            });

            it("clamps the value to the maximum bound when incrementing by 'minorStepSize'", () => {
                const MAX_VALUE = 0.05;
                const component = mount(<NumericStepper max={MAX_VALUE} />);

                // try to increment by 0.1
                const incrementButton = component.childAt(2);
                incrementButton.simulate("click", { altKey: true });

                const newValue = component.state().value;
                expect(newValue).to.equal(MAX_VALUE.toString());
            });

            it("clamps the value to the maximum bound when incrementing by 'majorStepSize'", () => {
                const MAX_VALUE = 5;
                const component = mount(<NumericStepper max={MAX_VALUE} />);

                // try to increment by 10
                const incrementButton = component.childAt(2);
                incrementButton.simulate("click", { shiftKey: true });

                const newValue = component.state().value;
                expect(newValue).to.equal(MAX_VALUE.toString());
            });
        });
    });

    describe("Validation", () => {

        it("throws an error if min >= max", () => {
            const fn = () => { mount(<NumericStepper min={2} max={1} />); };
            expect(fn).to.throw(Errors.NUMERIC_STEPPER_MIN_MAX);
        });

        it("throws an error if stepSize is null", () => {
            const fn = () => { mount(<NumericStepper stepSize={null} />); };
            expect(fn).to.throw(Errors.NUMERIC_STEPPER_STEP_SIZE_NULL);
        });

        it("throws an error if stepSize <= 0", () => {
            const fn = () => { mount(<NumericStepper stepSize={-1} />); };
            expect(fn).to.throw(Errors.NUMERIC_STEPPER_STEP_SIZE_NON_POSITIVE);
        });

        it("throws an error if minorStepSize <= 0", () => {
            const fn = () => { mount(<NumericStepper minorStepSize={-0.1} />); };
            expect(fn).to.throw(Errors.NUMERIC_STEPPER_MINOR_STEP_SIZE_NON_POSITIVE);
        });

        it("throws an error if majorStepSize <= 0", () => {
            const fn = () => { mount(<NumericStepper majorStepSize={-0.1} />); };
            expect(fn).to.throw(Errors.NUMERIC_STEPPER_MAJOR_STEP_SIZE_NON_POSITIVE);
        });

        it("throws an error if majorStepSize <= stepSize", () => {
            const fn = () => { mount(<NumericStepper majorStepSize={0.5} />); };
            expect(fn).to.throw(Errors.NUMERIC_STEPPER_MAJOR_STEP_SIZE_BOUND);
        });

        it("throws an error if stepSize <= minorStepSize", () => {
            const fn = () => { mount(<NumericStepper minorStepSize={2} />); };
            expect(fn).to.throw(Errors.NUMERIC_STEPPER_MINOR_STEP_SIZE_BOUND);
        });

        it("clears the field if the value is invalid when Enter is pressed", () => {
            const component = mount(<NumericStepper value={"<invalid>"} />);

            const value = component.state().value;
            expect(value).to.equal("<invalid>");

            const inputField = component.find("input");
            inputField.simulate("keydown", { keyCode: Keys.ENTER });

            const newValue = component.state().value;
            expect(newValue).to.equal("");
        });

        it("clears the field if the value is invalid when the component loses focus", () => {
            const component = mount(<NumericStepper value={"<invalid>"} />);

            const value = component.state().value;
            expect(value).to.equal("<invalid>");

            const inputField = component.find("input");
            inputField.simulate("blur");

            const newValue = component.state().value;
            expect(newValue).to.equal("");
        });

        it("clears the field if the value is invalid when incrementing", () => {
            const component = mount(<NumericStepper value={"<invalid>"} />);

            const value = component.state().value;
            expect(value).to.equal("<invalid>");

            const incrementButton = component.childAt(2);
            incrementButton.simulate("click");

            const newValue = component.state().value;
            expect(newValue).to.equal("");
        });

        it("clears the field if the value is invalid when decrementing", () => {
            const component = mount(<NumericStepper value={"<invalid>"} />);

            const value = component.state().value;
            expect(value).to.equal("<invalid>");

            const decrementButton = component.childAt(2);
            decrementButton.simulate("click");

            const newValue = component.state().value;
            expect(newValue).to.equal("");
        });


        describe("if `onDone` callback is provided", () => {

            it("does not change the value if it is invalid when Enter is pressed", () => {
                const onDoneSpy = sinon.spy();
                const component = mount(<NumericStepper onDone={onDoneSpy} value={"<invalid>"} />);

                const value = component.state().value;
                expect(value).to.equal("<invalid>");

                const inputField = component.find("input");
                inputField.simulate("keydown", { keyCode: Keys.ENTER });

                const newValue = component.state().value;
                expect(newValue).to.equal("<invalid>");

                expect(onDoneSpy.calledOnce).to.be.true;
                expect(onDoneSpy.calledWith("<invalid>")).to.be.true;
            });

            it("does not change the value if it is invalid when the component loses focus", () => {
                const onDoneSpy = sinon.spy();
                const component = mount(<NumericStepper onDone={onDoneSpy} value={"<invalid>"} />);

                const value = component.state().value;
                expect(value).to.equal("<invalid>");

                const inputField = component.find("input");
                inputField.simulate("blur");

                const newValue = component.state().value;
                expect(newValue).to.equal("<invalid>");

                expect(onDoneSpy.calledOnce).to.be.true;
                expect(onDoneSpy.calledWith("<invalid>")).to.be.true;
            });
        });
    });

    describe("Other", () => {

        it("disables the input field and buttons when disabled is true", () => {
            const component = mount(<NumericStepper disabled={true} />);

            const inputGroup      = component.childAt(0);
            const decrementButton = component.childAt(1);
            const incrementButton = component.childAt(2);

            expect(inputGroup.props().disabled).to.be.true;
            expect(decrementButton.props().disabled).to.be.true;
            expect(incrementButton.props().disabled).to.be.true;
        });

        it("disables the buttons and sets the input field to read-only when readOnly is true", () => {
            const component = mount(<NumericStepper readOnly={true} />);

            const inputGroup      = component.childAt(0);
            const decrementButton = component.childAt(1);
            const incrementButton = component.childAt(2);

            expect(inputGroup.props().readOnly).to.be.true;
            expect(decrementButton.props().disabled).to.be.true;
            expect(incrementButton.props().disabled).to.be.true;
        });

        it("shows a left icon if provided", () => {
            const component = mount(<NumericStepper leftIconName={"variable"} />);

            const inputGroup = component.childAt(0);
            const icon = inputGroup.childAt(0);

            expect(icon.hasClass("pt-icon-variable")).to.be.true;
        });

        it("shows placeholder text if provided", () => {
            const component = mount(<NumericStepper placeholder={"Enter a number..."} />);

            const inputGroup = component.childAt(0);
            const inputField = component.find("input");
            const placeholderText = inputField.props().placeholder;

            expect(placeholderText).to.equal("Enter a number...");
        });
    });

    interface IStepperOverrides {
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

    function createStepperForInteractionSuite(overrides?: IStepperOverrides) {
        const _getOverride = (name: string, defaultValue: number) => {
            return (overrides != null && overrides[name] !== undefined) ? overrides[name] : defaultValue;
        };

        return mount(<NumericStepper
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
            const component = createStepperForInteractionSuite();

            simulateIncrement(component);

            const newValue = component.state().value;
            expect(newValue).to.equal("12");
        });

        it(`decrements by stepSize on ${decrementDescription}`, () => {
            const component = createStepperForInteractionSuite();

            simulateDecrement(component);

            const newValue = component.state().value;
            expect(newValue).to.equal("8");
        });

        it(`increments by stepSize on Shift + ${incrementDescription} when majorStepSize is null`, () => {
            const component = createStepperForInteractionSuite({ majorStepSize: null });

            simulateIncrement(component, { shiftKey: true });

            const newValue = component.state().value;
            expect(newValue).to.equal("12");
        });

        it(`decrements by stepSize on Shift + ${incrementDescription} when majorStepSize is null`, () => {
            const component = createStepperForInteractionSuite({ majorStepSize: null });

            simulateDecrement(component, { shiftKey: true });

            const newValue = component.state().value;
            expect(newValue).to.equal("8");
        });

        it(`increments by stepSize on Alt + ${incrementDescription} when minorStepSize is null`, () => {
            const component = createStepperForInteractionSuite({ minorStepSize: null });

            simulateIncrement(component, { altKey: true });

            const newValue = component.state().value;
            expect(newValue).to.equal("12");
        });

        it(`decrements by stepSize on Alt + ${decrementDescription} when minorStepSize is null`, () => {
            const component = createStepperForInteractionSuite({ minorStepSize: null });

            simulateDecrement(component, { altKey: true });

            const newValue = component.state().value;
            expect(newValue).to.equal("8");
        });

        it(`increments by majorStepSize on Shift + ${incrementDescription}`, () => {
            const component = createStepperForInteractionSuite();

            simulateIncrement(component, { shiftKey: true });

            const newValue = component.state().value;
            expect(newValue).to.equal("30");
        });

        it(`decrements by majorStepSize on Shift + ${decrementDescription}`, () => {
            const component = createStepperForInteractionSuite();

            simulateDecrement(component, { shiftKey: true });

            const newValue = component.state().value;
            expect(newValue).to.equal("-10");
        });

        it(`increments by minorStepSize on Alt + ${incrementDescription}`, () => {
            const component = createStepperForInteractionSuite();

            simulateIncrement(component, { altKey: true });

            const newValue = component.state().value;
            expect(newValue).to.equal("10.2");
        });

        it(`decrements by minorStepSize on Alt + ${incrementDescription}`, () => {
            const component = createStepperForInteractionSuite();

            simulateDecrement(component, { altKey: true });

            const newValue = component.state().value;
            expect(newValue).to.equal("9.8");
        });

        it(`increments by majorStepSize on Shift + Alt + ${incrementDescription}`, () => {
            const component = createStepperForInteractionSuite();

            simulateIncrement(component, { shiftKey: true, altKey: true });

            const newValue = component.state().value;
            expect(newValue).to.equal("30");
        });

        it(`decrements by majorStepSize on Shift + Alt + ${decrementDescription}`, () => {
            const component = createStepperForInteractionSuite();

            simulateDecrement(component, { shiftKey: true, altKey: true });

            const newValue = component.state().value;
            expect(newValue).to.equal("-10");
        });

        it(`increments by minorStepSize on Shift + Alt + ${incrementDescription} when majorStepSize is null`, () => {
            const component = createStepperForInteractionSuite({ majorStepSize: null });

            simulateIncrement(component, { shiftKey: true, altKey: true });

            const newValue = component.state().value;
            expect(newValue).to.equal("10.2");
        });

        it(`decrements by minorStepSize on Shift + Alt + ${incrementDescription} when majorStepSize is null`, () => {
            const component = createStepperForInteractionSuite({ majorStepSize: null });

            simulateDecrement(component, { shiftKey: true, altKey: true });

            const newValue = component.state().value;
            expect(newValue).to.equal("9.8");
        });

        it(`increments by stepSize on Shift + Alt + ${incrementDescription} when \
            majorStepSize and minorStepSize are null`, () => {
            const component = createStepperForInteractionSuite({ majorStepSize: null, minorStepSize: null });

            simulateIncrement(component, { shiftKey: true, altKey: true });

            const newValue = component.state().value;
            expect(newValue).to.equal("12");
        });

        it(`decrements by stepSize on Shift + Alt + ${incrementDescription} when \
            majorStepSize and minorStepSize are null`, () => {
            const component = createStepperForInteractionSuite({ majorStepSize: null, minorStepSize: null });

            simulateDecrement(component, { shiftKey: true, altKey: true });

            const newValue = component.state().value;
            expect(newValue).to.equal("8");
        });
    }
});

