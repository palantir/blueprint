/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { expect } from "chai";
import { mount, shallow } from "enzyme";
import * as React from "react";

import { Classes, NumericStepper, NumericStepperButtonPosition } from "../../src/index";

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

        xit("works like a text input", () => {
            /* TODO */
        });

        xit("allows entry of non-numeric characters", () => {
            /* TODO */
        });

        xit("provides value changes to `onUpdate` if provided", () => {
            /* TODO */
        });

        xit("provides value changes to `onDone` (if provided) when `Enter` pressed", () => {
            /* TODO */
        });

        xit("provides value changes to `onDone` (if provided) when field loses focus", () => {
            /* TODO */
        });

        xit("provides `inputRef` a reference to the HTMLInputElement", () => {
            /* TODO */
        });
    });

    describe("Keyboard interactions", () => {

        xit("increments by `stepSize` when `↑` is pressed", () => {
            /* TODO */
        });

        xit("decrements by `stepSize` when `↓` is pressed", () => {
            /* TODO */
        });

        xit("increments by `stepSize` when `Shift + ↑` is pressed, but `majorStepSize` is null", () => {
            /* TODO */
        });

        xit("decrements by `stepSize` when `Shift + ↓` is pressed, but `majorStepSize` is null", () => {
            /* TODO */
        });

        xit("increments by `stepSize` when `Alt + ↑` is pressed, but `minorStepSize` is null", () => {
            /* TODO */
        });

        xit("decrements by `stepSize` when `Alt + ↓` is pressed, but `minorStepSize` is null", () => {
            /* TODO */
        });

        xit("increments by `majorStepSize` when `Shift + ↑` is pressed", () => {
            /* TODO */
        });

        xit("decrements by `majorStepSize` when `Shift + ↓` is pressed", () => {
            /* TODO */
        });

        xit("increments by `minorStepSize` when `Alt + ↑` is pressed", () => {
            /* TODO */
        });

        xit("decrements by `minorStepSize` when `Alt + ↓` is pressed", () => {
            /* TODO */
        });

        xit("increments by `majorStepSize` when `Shift + Alt + ↑` is pressed", () => {
            /* TODO */
        });

        xit("decrements by `majorStepSize` when `Shift + Alt + ↓` is pressed", () => {
            /* TODO */
        });

        xit("increments by `minorStepSize` when `Shift + Alt + ↑` is pressed, but `majorStepSize` is null", () => {
            /* TODO */
        });

        xit("decrements by `minorStepSize` when `Shift + Alt + ↓` is pressed, but `majorStepSize` is null", () => {
            /* TODO */
        });
    });

    describe("Mouse interactions", () => {

        xit("increments by `stepSize` on `Click '+'`", () => {
            /* TODO */
        });

        xit("decrements by `stepSize` on `Click '-'`", () => {
            /* TODO */
        });

        xit("increments by `stepSize` on `Shift + Click '+'` when `majorStepSize` is null", () => {
            /* TODO */
        });

        xit("decrements by `stepSize` on `Shift + Click '-'` when `majorStepSize` is null", () => {
            /* TODO */
        });

        xit("increments by `stepSize` on `Alt + Click '+'` when `minorStepSize` is null", () => {
            /* TODO */
        });

        xit("decrements by `stepSize` on `Alt + Click '-'` when `minorStepSize` is null", () => {
            /* TODO */
        });

        xit("increments by `majorStepSize` on `Shift + Click '+'`", () => {
            /* TODO */
        });

        xit("decrements by `majorStepSize` on `Shift + Click '-'`", () => {
            /* TODO */
        });

        xit("increments by `minorStepSize` on `Alt + Click '+'`", () => {
            /* TODO */
        });

        xit("decrements by `minorStepSize` on `Alt + Click '-'`", () => {
            /* TODO */
        });

        xit("increments by `majorStepSize` on `Shift + Alt + Click '+'`", () => {
            /* TODO */
        });

        xit("decrements by `majorStepSize` on `Shift + Alt + Click '-'`", () => {
            /* TODO */
        });

        xit("increments by `minorStepSize` on `Shift + Alt + Click '+'` when `majorStepSize` is null", () => {
            /* TODO */
        });

        xit("decrements by `minorStepSize` on `Shift + Alt + Click '-'` when `majorStepSize` is null", () => {
            /* TODO */
        });
    });

    describe("Value bounds", () => {

        describe("if no bounds are defined", () => {

            xit("enforces no minimum bound", () => {
                /* TODO */
            });

            xit("enforces no maximum bound", () => {
                /* TODO */
            });

            xit("clamps an out-of-bounds value to the new `min` if the component props change", () => {
                /* TODO */
            });

            xit("clamps an out-of-bounds value to the new `max` if the component props change", () => {
                /* TODO */
            });
        });

        describe("if `min` is defined", () => {

            xit("clamps the value to the minimum bound when decrementing by `stepSize`", () => {
                /* TODO */
            });

            xit("clamps the value to the minimum bound when decrementing by `minorStepSize`", () => {
                /* TODO */
            });

            xit("clamps the value to the minimum bound when decrementing by `majorStepSize`", () => {
                /* TODO */
            });
        });

        describe("if `max` is defined", () => {

            xit("clamps the value to the maximum bound when incrementing by `stepSize`", () => {
                /* TODO */
            });

            xit("clamps the value to the maximum bound when incrementing by `minorStepSize`", () => {
                /* TODO */
            });

            xit("clamps the value to the maximum bound when incrementing by `majorStepSize`", () => {
                /* TODO */
            });
        });
    });

    describe("Validation", () => {

        xit("throws an error if min >= max", () => {
            /* TODO */
        });

        xit("throws an error if stepSize is null", () => {
            /* TODO */
        });

        xit("throws an error if stepSize <= 0", () => {
            /* TODO */
        });

        xit("throws an error if minorStepSize <= 0", () => {
            /* TODO */
        });

        xit("throws an error if majorStepSize <= 0", () => {
            /* TODO */
        });

        xit("throws an error if majorStepSize <= minorStepSize", () => {
            /* TODO */
        });

        xit("throws an error if majorStepSize <= stepSize", () => {
            /* TODO */
        });

        xit("throws an error if stepSize <= minorStepSize", () => {
            /* TODO */
        });

        xit("clears the field if the value is invalid when Enter is pressed", () => {
            /* TODO */
        });

        xit("clears the field if the value is invalid when the component loses focus", () => {
            /* TODO */
        });

        xit("clears the field if the value is invalid when incrementing", () => {
            /* TODO */
        });

        xit("clears the field if the value is invalid when decrementing", () => {
            /* TODO */
        });


        describe("if `onDone` callback is provided", () => {
            xit("does not change the value if it is invalid when Enter is pressed", () => {
                /* TODO */
            });

            xit("does not change the value if it is invalid when the component loses focus", () => {
                /* TODO */
            });
        });
    });

    describe("Other", () => {

        xit("disables the buttons when `disabled` is true", () => {
            /* TODO */
        });

        xit("disables the input field when `disabled` is true", () => {
            /* TODO */
        });

        xit("disables the buttons when `readonly` is true", () => {
            /* TODO */
        });

        xit("disables the input field when `readonly` is true", () => {
            /* TODO */
        });

        xit("disables the input field when `readonly` is true", () => {
            /* TODO */
        });

        xit("shows a left icon if provided", () => {
            /* TODO */
        });

        xit("shows placeholder text if provided", () => {
            /* TODO */
        });
    });
});

