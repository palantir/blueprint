/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import { expect } from "chai";
// import { mount } from "enzyme";
// import * as React from "react";

// import { NumericStepper } from "../../src/index";

xdescribe("<NumericStepper>", () => {
    describe("Defaults", () => {
        it("renders the buttons on the right by default (or when buttonPosition is undefined)");
        it("has a stepSize of 1 by default");
        it("has a minorStepSize of 0.1 by default");
        it("has a majorStepSize of 10 by default");
        it("increments the value from 0 if the field is empty");
    });
    describe("Button position", () => {
        it("renders the buttons on the right when buttonPosition == NumericStepperButtonPosition.RIGHT");
        it("renders the buttons on the left when buttonPosition == NumericStepperButtonPosition.LEFT");
        it("renders the buttons on either side when buttonPosition == NumericStepperButtonPosition.SPLIT");
        it("does not render the buttons when buttonPosition == NumericStepperButtonPosition.NONE");
        it("does not render the buttons when buttonPosition is null");
    });
    describe("Basic functionality", () => {
        it("works like a text input");
        it("allows entry of non-numeric characters");
        it("provides value changes to `onUpdate` if provided");
        it("provides value changes to `onDone` (if provided) when `Enter` pressed");
        it("provides value changes to `onDone` (if provided) when field loses focus");
        it("provides `inputRef` a reference to the HTMLInputElement");
    });
    describe("Keyboard interactions", () => {
        it("increments by `stepSize` when `↑` is pressed");
        it("decrements by `stepSize` when `↓` is pressed");
        it("increments by `stepSize` when `Shift + ↑` is pressed, but `majorStepSize` is null");
        it("decrements by `stepSize` when `Shift + ↓` is pressed, but `majorStepSize` is null");
        it("increments by `stepSize` when `Alt + ↑` is pressed, but `minorStepSize` is null");
        it("decrements by `stepSize` when `Alt + ↓` is pressed, but `minorStepSize` is null");
        it("increments by `majorStepSize` when `Shift + ↑` is pressed");
        it("decrements by `majorStepSize` when `Shift + ↓` is pressed");
        it("increments by `minorStepSize` when `Alt + ↑` is pressed");
        it("decrements by `minorStepSize` when `Alt + ↓` is pressed");
        it("increments by `majorStepSize` when `Shift + Alt + ↑` is pressed");
        it("decrements by `majorStepSize` when `Shift + Alt + ↓` is pressed");
        it("increments by `minorStepSize` when `Shift + Alt + ↑` is pressed, but `majorStepSize` is null");
        it("decrements by `minorStepSize` when `Shift + Alt + ↓` is pressed, but `majorStepSize` is null");
    });
    describe("Mouse interactions", () => {
        it("increments by `stepSize` on `Click '+'`");
        it("decrements by `stepSize` on `Click '-'`");
        it("increments by `stepSize` on `Shift + Click '+'` when `majorStepSize` is null");
        it("decrements by `stepSize` on `Shift + Click '-'` when `majorStepSize` is null");
        it("increments by `stepSize` on `Alt + Click '+'` when `minorStepSize` is null");
        it("decrements by `stepSize` on `Alt + Click '-'` when `minorStepSize` is null");
        it("increments by `majorStepSize` on `Shift + Click '+'`");
        it("decrements by `majorStepSize` on `Shift + Click '-'`");
        it("increments by `minorStepSize` on `Alt + Click '+'`");
        it("decrements by `minorStepSize` on `Alt + Click '-'`");
        it("increments by `majorStepSize` on `Shift + Alt + Click '+'`");
        it("decrements by `majorStepSize` on `Shift + Alt + Click '-'`");
        it("increments by `minorStepSize` on `Shift + Alt + Click '+'` when `majorStepSize` is null");
        it("decrements by `minorStepSize` on `Shift + Alt + Click '-'` when `majorStepSize` is null");
    });
    describe("Value bounds", () => {
        describe("if no bounds are defined", () => {
            it("enforces no minimum bound");
            it("enforces no maximum bound");
            it("clamps an out-of-bounds value to the new `min` if the component props change");
            it("clamps an out-of-bounds value to the new `max` if the component props change");
        });
        describe("if `min` is defined", () => {
            it("clamps the value to the minimum bound when decrementing by `stepSize`");
            it("clamps the value to the minimum bound when decrementing by `minorStepSize`");
            it("clamps the value to the minimum bound when decrementing by `majorStepSize`");
        });
        describe("if `max` is defined", () => {
            it("clamps the value to the maximum bound when incrementing by `stepSize`");
            it("clamps the value to the maximum bound when incrementing by `minorStepSize`");
            it("clamps the value to the maximum bound when incrementing by `majorStepSize`");
        });
    });
    describe("Validation", () => {
        it("throws an error if min >= max");
        it("throws an error if stepSize is null");
        it("throws an error if stepSize <= 0");
        it("throws an error if minorStepSize <= 0");
        it("throws an error if majorStepSize <= 0");
        it("throws an error if majorStepSize <= minorStepSize");
        it("throws an error if majorStepSize <= stepSize");
        it("throws an error if stepSize <= minorStepSize");
        it("clears the field if the value is invalid when Enter is pressed");
        it("clears the field if the value is invalid when the component loses focus");
        it("clears the field if the value is invalid when incrementing");
        it("clears the field if the value is invalid when decrementing");

        describe("if `onDone` callback is provided", () => {
            it("does not change the value if it is invalid when Enter is pressed");
            it("does not change the value if it is invalid when the component loses focus");
        });
    });
    describe("Other", () => {
        it("disables the buttons when `disabled` is true");
        it("disables the input field when `disabled` is true");
        it("disables the buttons when `readonly` is true");
        it("disables the input field when `readonly` is true");
        it("disables the input field when `readonly` is true");
        it("shows a left icon if provided");
        it("shows placeholder text if provided");
    });
});
