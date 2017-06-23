/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { Keys } from "@blueprintjs/core";
import { assert } from "chai";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-dom/test-utils";

import { Classes, ITimePickerProps, TimePicker, TimePickerPrecision } from "../src/index";

describe("<TimePicker>", () => {
    let testsContainerElement: Element;
    let timePicker: TimePicker;
    let onTimePickerChange: Sinon.SinonSpy;
    const zeroDate = new Date(0, 0, 0, 0, 0, 0, 0);

    before(() => {
        // this is essentially what TestUtils.renderIntoDocument does
        testsContainerElement = document.createElement("div");
        document.documentElement.appendChild(testsContainerElement);
    });

    beforeEach(() => {
        onTimePickerChange = sinon.spy();
    });

    afterEach(() => {
        ReactDOM.unmountComponentAtNode(testsContainerElement);
    });

    it("renders its contents", () => {
        assert.lengthOf(document.getElementsByClassName(Classes.TIMEPICKER), 0);

        renderTimePicker();
        assert.lengthOf(document.getElementsByClassName(Classes.TIMEPICKER), 1);
    });

    it("propagates class names correctly", () => {
        const selector = `.${Classes.TIMEPICKER}.foo`;
        assert.lengthOf(document.querySelectorAll(selector), 0);

        renderTimePicker({ className: "foo" });
        assert.lengthOf(document.querySelectorAll(selector), 1);
    });

    it("arrow buttons allow looping", () => {
        renderTimePicker({
            defaultValue: new Date(2015, 1, 1, 0, 0, 59, 999),
            precision: TimePickerPrecision.MILLISECOND,
            showArrowButtons: true,
        });

        assertTimeIs(timePicker.state.value, 0, 0, 59, 999);
        clickDecrementBtn(Classes.TIMEPICKER_HOUR);
        assertTimeIs(timePicker.state.value, 23, 0, 59, 999);
        clickDecrementBtn(Classes.TIMEPICKER_MINUTE);
        assertTimeIs(timePicker.state.value, 23, 59, 59, 999);
        clickIncrementBtn(Classes.TIMEPICKER_SECOND);
        assertTimeIs(timePicker.state.value, 23, 59, 0, 999);
        clickIncrementBtn(Classes.TIMEPICKER_MILLISECOND);
        assertTimeIs(timePicker.state.value, 23, 59, 0, 0);
    });

    it("allows valid text entry", () => {
        renderTimePicker();
        const hourInput = findInputElement(Classes.TIMEPICKER_HOUR);
        assert.strictEqual(hourInput.value, "0");
    });

    it("shows the proper number of input fields", () => {
        renderTimePicker({ precision: TimePickerPrecision.MILLISECOND });
        assert.lengthOf(document.getElementsByClassName(Classes.TIMEPICKER_INPUT), 4);
    });

    it("all keyboard arrow presses work", () => {
        renderTimePicker({ precision: TimePickerPrecision.MILLISECOND });

        assertTimeIs(timePicker.state.value, 0, 0, 0, 0);
        keyDownOnInput(Classes.TIMEPICKER_HOUR, Keys.ARROW_UP);
        assertTimeIs(timePicker.state.value, 1, 0, 0, 0);
        keyDownOnInput(Classes.TIMEPICKER_MINUTE, Keys.ARROW_UP);
        assertTimeIs(timePicker.state.value, 1, 1, 0, 0);
        keyDownOnInput(Classes.TIMEPICKER_SECOND, Keys.ARROW_UP);
        assertTimeIs(timePicker.state.value, 1, 1, 1, 0);
        keyDownOnInput(Classes.TIMEPICKER_MILLISECOND, Keys.ARROW_UP);
        assertTimeIs(timePicker.state.value, 1, 1, 1, 1);

        keyDownOnInput(Classes.TIMEPICKER_HOUR, Keys.ARROW_DOWN);
        assertTimeIs(timePicker.state.value, 0, 1, 1, 1);
        keyDownOnInput(Classes.TIMEPICKER_MINUTE, Keys.ARROW_DOWN);
        assertTimeIs(timePicker.state.value, 0, 0, 1, 1);
        keyDownOnInput(Classes.TIMEPICKER_SECOND, Keys.ARROW_DOWN);
        assertTimeIs(timePicker.state.value, 0, 0, 0, 1);
        keyDownOnInput(Classes.TIMEPICKER_MILLISECOND, Keys.ARROW_DOWN);
        assertTimeIs(timePicker.state.value, 0, 0, 0, 0);
    });

    it("all arrow buttons work", () => {
        renderTimePicker({ precision: TimePickerPrecision.MILLISECOND, showArrowButtons: true });

        assertTimeIs(timePicker.state.value, 0, 0, 0, 0);
        clickIncrementBtn(Classes.TIMEPICKER_HOUR);
        assertTimeIs(timePicker.state.value, 1, 0, 0, 0);
        clickIncrementBtn(Classes.TIMEPICKER_MINUTE);
        assertTimeIs(timePicker.state.value, 1, 1, 0, 0);
        clickIncrementBtn(Classes.TIMEPICKER_SECOND);
        assertTimeIs(timePicker.state.value, 1, 1, 1, 0);
        clickIncrementBtn(Classes.TIMEPICKER_MILLISECOND);
        assertTimeIs(timePicker.state.value, 1, 1, 1, 1);

        clickDecrementBtn(Classes.TIMEPICKER_HOUR);
        assertTimeIs(timePicker.state.value, 0, 1, 1, 1);
        clickDecrementBtn(Classes.TIMEPICKER_MINUTE);
        assertTimeIs(timePicker.state.value, 0, 0, 1, 1);
        clickDecrementBtn(Classes.TIMEPICKER_SECOND);
        assertTimeIs(timePicker.state.value, 0, 0, 0, 1);
        clickDecrementBtn(Classes.TIMEPICKER_MILLISECOND);
        assertTimeIs(timePicker.state.value, 0, 0, 0, 0);
    });

    it("allows valid text entry", () => {
        renderTimePicker();
        const hourInput = findInputElement(Classes.TIMEPICKER_HOUR);
        assert.strictEqual(hourInput.value, "0");

        hourInput.value = "2";
        TestUtils.Simulate.change(hourInput);
        assert.strictEqual(hourInput.value, "2");
    });

    it("does not allow invalid text entry", () => {
        renderTimePicker();
        const hourInput = findInputElement(Classes.TIMEPICKER_HOUR);
        assert.strictEqual(hourInput.value, "0");

        hourInput.value = "ab";
        TestUtils.Simulate.change(hourInput);
        assert.strictEqual(hourInput.value, "0");
    });

    it("arrows are not rendered by default", () => {
        renderTimePicker();
        assert.lengthOf(document.getElementsByClassName(Classes.TIMEPICKER_ARROW_BUTTON), 0);
    });

    it("arrows are rendered when showArrowButtons is true", () => {
        renderTimePicker({ showArrowButtons: true });
        assert.lengthOf(document.getElementsByClassName(Classes.TIMEPICKER_ARROW_BUTTON), 4);
    });

    it("text is selected on focus when selectOnFocus is true", () => {
        renderTimePicker({ selectAllOnFocus: true });

        focusOnInput(Classes.TIMEPICKER_HOUR);
        assert.equal(window.getSelection().toString(), "0");

        focusOnInput(Classes.TIMEPICKER_MINUTE);
        assert.equal(window.getSelection().toString(), "00");
    });

    it("value doesn't change when disabled", () => {
        renderTimePicker({ disabled: true, precision: TimePickerPrecision.MILLISECOND, showArrowButtons: true });

        const hourInput = findInputElement(Classes.TIMEPICKER_HOUR);
        assert.isTrue(hourInput.disabled);
        const minuteInput = findInputElement(Classes.TIMEPICKER_MINUTE);
        assert.isTrue(minuteInput.disabled);

        assertTimeIs(timePicker.state.value, 0, 0, 0, 0);
        clickIncrementBtn(Classes.TIMEPICKER_HOUR);
        assertTimeIs(timePicker.state.value, 0, 0, 0, 0);
        clickIncrementBtn(Classes.TIMEPICKER_MINUTE);
        assertTimeIs(timePicker.state.value, 0, 0, 0, 0);
        clickIncrementBtn(Classes.TIMEPICKER_SECOND);
        assertTimeIs(timePicker.state.value, 0, 0, 0, 0);
        clickIncrementBtn(Classes.TIMEPICKER_MILLISECOND);
        assertTimeIs(timePicker.state.value, 0, 0, 0, 0);

        clickDecrementBtn(Classes.TIMEPICKER_HOUR);
        assertTimeIs(timePicker.state.value, 0, 0, 0, 0);
        clickDecrementBtn(Classes.TIMEPICKER_MINUTE);
        assertTimeIs(timePicker.state.value, 0, 0, 0, 0);
        clickDecrementBtn(Classes.TIMEPICKER_SECOND);
        assertTimeIs(timePicker.state.value, 0, 0, 0, 0);
        clickDecrementBtn(Classes.TIMEPICKER_MILLISECOND);
        assertTimeIs(timePicker.state.value, 0, 0, 0, 0);

        keyDownOnInput(Classes.TIMEPICKER_HOUR, Keys.ARROW_UP);
        assertTimeIs(timePicker.state.value, 0, 0, 0, 0);
        keyDownOnInput(Classes.TIMEPICKER_MINUTE, Keys.ARROW_UP);
        assertTimeIs(timePicker.state.value, 0, 0, 0, 0);
        keyDownOnInput(Classes.TIMEPICKER_SECOND, Keys.ARROW_UP);
        assertTimeIs(timePicker.state.value, 0, 0, 0, 0);
        keyDownOnInput(Classes.TIMEPICKER_MILLISECOND, Keys.ARROW_UP);
        assertTimeIs(timePicker.state.value, 0, 0, 0, 0);

        keyDownOnInput(Classes.TIMEPICKER_HOUR, Keys.ARROW_DOWN);
        assertTimeIs(timePicker.state.value, 0, 0, 0, 0);
        keyDownOnInput(Classes.TIMEPICKER_MINUTE, Keys.ARROW_DOWN);
        assertTimeIs(timePicker.state.value, 0, 0, 0, 0);
        keyDownOnInput(Classes.TIMEPICKER_SECOND, Keys.ARROW_DOWN);
        assertTimeIs(timePicker.state.value, 0, 0, 0, 0);
        keyDownOnInput(Classes.TIMEPICKER_MILLISECOND, Keys.ARROW_DOWN);
        assertTimeIs(timePicker.state.value, 0, 0, 0, 0);
    });

    describe("Time range - minTime and maxTime props", () => {
        it("if defaultValue is smaller minTime, minTime becomes initial time", () => {
            renderTimePicker({
                defaultValue: new Date(1995, 6, 30, 12, 30),
                minTime: new Date(1995, 6, 30, 15, 30),
                precision: TimePickerPrecision.MILLISECOND,
            });

            const hourInput = findInputElement(Classes.TIMEPICKER_HOUR);

            assert.strictEqual(hourInput.value, "15");
            assert.strictEqual(timePicker.state.value.getHours(), 15);
        });

        it("if defaultValue is is greater than maxTime, minTime becomes initial time", () => {
            renderTimePicker({
                defaultValue: new Date(1995, 6, 30, 20, 30),
                maxTime: new Date(1995, 6, 30, 18, 30),
                minTime: new Date(1995, 6, 30, 15, 30),
                precision: TimePickerPrecision.MILLISECOND,
            });

            const hourInput = findInputElement(Classes.TIMEPICKER_HOUR);

            assert.strictEqual(hourInput.value, "15");
            assert.strictEqual(timePicker.state.value.getHours(), 15);
        });

        it("by default, I can select any time", () => {
            renderTimePicker({
                precision: TimePickerPrecision.MILLISECOND,
            });

            const hourInput = findInputElement(Classes.TIMEPICKER_HOUR);
            const minuteInput = findInputElement(Classes.TIMEPICKER_MINUTE);
            const secondInput = findInputElement(Classes.TIMEPICKER_SECOND);
            const millisecondInput = findInputElement(Classes.TIMEPICKER_MILLISECOND);

            /* I can select default minTime */
            changeInputThenBlur(hourInput, "0");
            assert.strictEqual(hourInput.value, "0");

            changeInputThenBlur(minuteInput, "0");
            assert.strictEqual(minuteInput.value, "0");

            changeInputThenBlur(secondInput, "0");
            assert.strictEqual(secondInput.value, "0");

            changeInputThenBlur(millisecondInput, "0");
            assert.strictEqual(millisecondInput.value, "0");

            /* I can select time between default minTime and default maxTime */
            changeInputThenBlur(hourInput, "12");
            assert.strictEqual(hourInput.value, "12");

            changeInputThenBlur(minuteInput, "30");
            assert.strictEqual(minuteInput.value, "30");

            changeInputThenBlur(secondInput, "30");
            assert.strictEqual(secondInput.value, "30");

            changeInputThenBlur(millisecondInput, "500");
            assert.strictEqual(millisecondInput.value, "500");

            /* I can select default maxTime */
            changeInputThenBlur(hourInput, "23");
            assert.strictEqual(hourInput.value, "23");

            changeInputThenBlur(minuteInput, "59");
            assert.strictEqual(minuteInput.value, "59");

            changeInputThenBlur(secondInput, "59");
            assert.strictEqual(secondInput.value, "59");

            changeInputThenBlur(millisecondInput, "999");
            assert.strictEqual(millisecondInput.value, "999");
        });

        it("I can select time even time range past midnight", () => {
            renderTimePicker({
                maxTime: new Date(1995, 6, 30, 3, 0, 0, 0),
                minTime: new Date(1995, 6, 30, 22, 0, 0, 0),
                precision: TimePickerPrecision.MILLISECOND,
            });

            const hourInput = findInputElement(Classes.TIMEPICKER_HOUR);

            changeInputThenBlur(hourInput, "2");
            assert.strictEqual(hourInput.value, "2");
            assert.strictEqual(timePicker.state.value.getHours(), 2);
        });

        it("while I'am decrementing unit, time can't be smaller minTime", () => {
            renderTimePicker({
                minTime: new Date(1995, 6, 30, 15, 32, 20, 600),
                precision: TimePickerPrecision.MILLISECOND,
            });

            const hourInput = findInputElement(Classes.TIMEPICKER_HOUR);
            const minuteInput = findInputElement(Classes.TIMEPICKER_MINUTE);
            const secondInput = findInputElement(Classes.TIMEPICKER_SECOND);
            const millisecondInput = findInputElement(Classes.TIMEPICKER_MILLISECOND);

            TestUtils.Simulate.keyDown(hourInput, { which: Keys.ARROW_DOWN });
            assert.strictEqual(hourInput.value, "15");
            assert.strictEqual(timePicker.state.value.getHours(), 15);

            TestUtils.Simulate.keyDown(minuteInput, { which: Keys.ARROW_DOWN });
            assert.strictEqual(minuteInput.value, "32");
            assert.strictEqual(timePicker.state.value.getMinutes(), 32);

            TestUtils.Simulate.keyDown(secondInput, { which: Keys.ARROW_DOWN });
            assert.strictEqual(secondInput.value, "20");
            assert.strictEqual(timePicker.state.value.getSeconds(), 20);

            TestUtils.Simulate.keyDown(millisecondInput, { which: Keys.ARROW_DOWN });
            assert.strictEqual(millisecondInput.value, "600");
            assert.strictEqual(timePicker.state.value.getMilliseconds(), 600);
        });

        it("while I'am incrementing unit, time can't be greater maxTime", () => {
            renderTimePicker({
                defaultValue: new Date(1995, 6, 30, 14, 55, 30, 200),
                maxTime: new Date(1995, 6, 30, 14, 55, 30, 200),
                precision: TimePickerPrecision.MILLISECOND,
            });

            const hourInput = findInputElement(Classes.TIMEPICKER_HOUR);
            const minuteInput = findInputElement(Classes.TIMEPICKER_MINUTE);
            const secondInput = findInputElement(Classes.TIMEPICKER_SECOND);
            const millisecondInput = findInputElement(Classes.TIMEPICKER_MILLISECOND);

            TestUtils.Simulate.keyDown(hourInput, { which: Keys.ARROW_UP });
            assert.strictEqual(hourInput.value, "14");
            assert.strictEqual(timePicker.state.value.getHours(), 14);

            TestUtils.Simulate.keyDown(minuteInput, { which: Keys.ARROW_UP });
            assert.strictEqual(minuteInput.value, "55");
            assert.strictEqual(timePicker.state.value.getMinutes(), 55);

            TestUtils.Simulate.keyDown(secondInput, { which: Keys.ARROW_UP });
            assert.strictEqual(secondInput.value, "30");
            assert.strictEqual(timePicker.state.value.getSeconds(), 30);

            TestUtils.Simulate.keyDown(millisecondInput, { which: Keys.ARROW_UP });
            assert.strictEqual(millisecondInput.value, "200");
            assert.strictEqual(timePicker.state.value.getMilliseconds(), 200);
        });

        it("when I typed time smaller than minTime, after blur, time should be reset to last good state", () => {
            renderTimePicker({
                defaultValue: new Date(1995, 6, 30, 15, 32, 20, 600),
                minTime: new Date(1995, 6, 30, 15, 32, 20, 600),
                precision: TimePickerPrecision.MILLISECOND,
            });

            const hourInput = findInputElement(Classes.TIMEPICKER_HOUR);
            const minuteInput = findInputElement(Classes.TIMEPICKER_MINUTE);
            const secondInput = findInputElement(Classes.TIMEPICKER_SECOND);
            const millisecondsInput = findInputElement(Classes.TIMEPICKER_MILLISECOND);

            changeInputThenBlur(hourInput, "14");
            assert.strictEqual(hourInput.value, "15");
            assert.strictEqual(timePicker.state.value.getHours(), 15);

            changeInputThenBlur(minuteInput, "31");
            assert.strictEqual(minuteInput.value, "32");
            assert.strictEqual(timePicker.state.value.getMinutes(), 32);

            changeInputThenBlur(secondInput, "19");
            assert.strictEqual(secondInput.value, "20");
            assert.strictEqual(timePicker.state.value.getSeconds(), 20);

            changeInputThenBlur(millisecondsInput, "500");
            assert.strictEqual(millisecondsInput.value, "600");
            assert.strictEqual(timePicker.state.value.getMilliseconds(), 600);
        });

        it("when I typed time greater than maxTime, after blur, time should be reset to last good state", () => {
            renderTimePicker({
                defaultValue: new Date(1995, 6, 30, 15, 32, 20, 600),
                maxTime: new Date(1995, 6, 30, 15, 32, 20, 600),
                precision: TimePickerPrecision.MILLISECOND,
            });

            const hourInput = findInputElement(Classes.TIMEPICKER_HOUR);
            const minuteInput = findInputElement(Classes.TIMEPICKER_MINUTE);
            const secondInput = findInputElement(Classes.TIMEPICKER_SECOND);
            const millisecondsInput = findInputElement(Classes.TIMEPICKER_MILLISECOND);

            changeInputThenBlur(hourInput, "16");
            assert.strictEqual(hourInput.value, "15");
            assert.strictEqual(timePicker.state.value.getHours(), 15);

            changeInputThenBlur(minuteInput, "33");
            assert.strictEqual(minuteInput.value, "32");
            assert.strictEqual(timePicker.state.value.getMinutes(), 32);

            changeInputThenBlur(secondInput, "21");
            assert.strictEqual(secondInput.value, "20");
            assert.strictEqual(timePicker.state.value.getSeconds(), 20);

            changeInputThenBlur(millisecondsInput, "700");
            assert.strictEqual(millisecondsInput.value, "600");
            assert.strictEqual(timePicker.state.value.getMilliseconds(), 600);
        });
    });

    describe("when uncontrolled", () => {
        it("defaultValue sets the initialTime", () => {
            renderTimePicker({
                defaultValue: new Date(2015, 1, 1, 10, 11, 12, 13),
                precision: TimePickerPrecision.MILLISECOND,
            });
            const { value } = timePicker.state;
            assert.strictEqual(value.getHours(), 10);
            assert.strictEqual(value.getMinutes(), 11);
            assert.strictEqual(value.getSeconds(), 12);
            assert.strictEqual(value.getMilliseconds(), 13);
        });

        it("should fire onChange events on up-arrow key down", () => {
            renderTimePicker();
            assert.isTrue(onTimePickerChange.notCalled);

            const hourInput = findInputElement(Classes.TIMEPICKER_HOUR);
            TestUtils.Simulate.keyDown(hourInput, {which: Keys.ARROW_UP});
            assert.isTrue(onTimePickerChange.calledOnce);
            assert.isTrue((onTimePickerChange.firstCall.args[0] as Date).getHours() === 1);
        });

        it("should change input text and state value on up-arrow key down", () => {
            renderTimePicker();
            const hourInput = findInputElement(Classes.TIMEPICKER_HOUR);
            assert.strictEqual(hourInput.value, "0");
            assert.strictEqual(timePicker.state.value.getHours(), 0);

            TestUtils.Simulate.keyDown(hourInput, { which: Keys.ARROW_UP });
            assert.strictEqual(hourInput.value, "1");
            assert.strictEqual(timePicker.state.value.getHours(), 1);
        });

        it("should fire onChange events when new value is typed in", () => {
            renderTimePicker();
            assert.isTrue(onTimePickerChange.notCalled);

            const hourInput = findInputElement(Classes.TIMEPICKER_HOUR);
            hourInput.value = "8";
            TestUtils.Simulate.change(hourInput);
            TestUtils.Simulate.blur(hourInput);
            assert.isTrue(onTimePickerChange.calledOnce);
            assert.strictEqual((onTimePickerChange.firstCall.args[0] as Date).getHours(), 8);
        });

        it("should format input and change state value when new value is typed in", () => {
            renderTimePicker();
            const minuteInput = findInputElement(Classes.TIMEPICKER_MINUTE);
            assert.strictEqual(minuteInput.value, "00");
            assert.strictEqual(timePicker.state.value.getMinutes(), 0);

            minuteInput.value = "8";
            TestUtils.Simulate.change(minuteInput);
            TestUtils.Simulate.blur(minuteInput);
            assert.strictEqual(minuteInput.value, "08");
            assert.strictEqual(timePicker.state.value.getMinutes(), 8);
        });

        it("should fire onChange events when arrow button is pressed", () => {
            renderTimePicker({ showArrowButtons: true });
            assert.isTrue(onTimePickerChange.notCalled);

            clickIncrementBtn(Classes.TIMEPICKER_HOUR);
            assert.isTrue(onTimePickerChange.calledOnce);
            assert.strictEqual((onTimePickerChange.firstCall.args[0] as Date).getHours(), 1);
        });

        it("should change input and state value when arrow button is pressed", () => {
            renderTimePicker({ showArrowButtons: true });
            const hourInput = findInputElement(Classes.TIMEPICKER_HOUR);
            assert.strictEqual(hourInput.value, "0");
            assert.strictEqual(timePicker.state.value.getHours(), 0);

            clickIncrementBtn(Classes.TIMEPICKER_HOUR);
            assert.strictEqual(hourInput.value, "1");
            assert.strictEqual(timePicker.state.value.getHours(), 1);
        });
    });

    describe("when controlled", () => {
        it("changing value changes state", () => {
            renderTimePicker({ value: zeroDate });
            let { value } = timePicker.state;
            assert.strictEqual(value.getHours(), 0);
            assert.strictEqual(value.getMinutes(), 0);
            assert.strictEqual(value.getSeconds(), 0);
            assert.strictEqual(value.getMilliseconds(), 0);

            renderTimePicker({ value: new Date(2015, 1, 1, 1, 2, 3, 4) });
            value = timePicker.state.value;
            assert.strictEqual(value.getHours(), 1);
            assert.strictEqual(value.getMinutes(), 2);
            assert.strictEqual(value.getSeconds(), 3);
            assert.strictEqual(value.getMilliseconds(), 4);
        });

        it("should fire onChange events on up-arrow key down", () => {
            renderTimePicker({ value: zeroDate });
            assert.isTrue(onTimePickerChange.notCalled);

            const hourInput = findInputElement(Classes.TIMEPICKER_HOUR);
            TestUtils.Simulate.keyDown(hourInput, { which: Keys.ARROW_UP });
            assert.isTrue(onTimePickerChange.calledOnce);
            assert.strictEqual((onTimePickerChange.firstCall.args[0] as Date).getHours(), 1);
        });

        it("should not change input text or state value on up-arrow key down", () => {
            renderTimePicker({ value: zeroDate });
            const hourInput = findInputElement(Classes.TIMEPICKER_HOUR);
            assert.strictEqual(hourInput.value, "0");
            assert.strictEqual(timePicker.state.value.getHours(), 0);

            TestUtils.Simulate.keyDown(hourInput, { which: Keys.ARROW_UP });
            assert.strictEqual(hourInput.value, "0");
            assert.strictEqual(timePicker.state.value.getHours(), 0);
        });

        it("should fire onChange events when new value is typed in", () => {
            renderTimePicker({ value: zeroDate });
            assert.isTrue(onTimePickerChange.notCalled);

            const hourInput = findInputElement(Classes.TIMEPICKER_HOUR);
            hourInput.value = "8";
            TestUtils.Simulate.change(hourInput);
            TestUtils.Simulate.blur(hourInput);
            assert.isTrue(onTimePickerChange.calledOnce);
            assert.strictEqual((onTimePickerChange.firstCall.args[0] as Date).getHours(), 8);
        });

        it("should not format input and change state value when new value is typed in", () => {
            renderTimePicker({ value: zeroDate });
            const minuteInput = findInputElement(Classes.TIMEPICKER_MINUTE);
            assert.strictEqual(minuteInput.value, "00");
            assert.strictEqual(timePicker.state.value.getMinutes(), 0);

            minuteInput.value = "8";
            TestUtils.Simulate.change(minuteInput);
            TestUtils.Simulate.blur(minuteInput);
            assert.strictEqual(minuteInput.value, "00");
            assert.strictEqual(timePicker.state.value.getMinutes(), 0);
        });

        it("should fire onChange events when arrow button is pressed", () => {
            renderTimePicker({ showArrowButtons: true, value: zeroDate });
            assert.isTrue(onTimePickerChange.notCalled);

            clickIncrementBtn(Classes.TIMEPICKER_HOUR);
            assert.isTrue(onTimePickerChange.calledOnce);
            assert.strictEqual((onTimePickerChange.firstCall.args[0] as Date).getHours(), 1);
        });

        it("should not change input and state value when arrow button is pressed", () => {
            renderTimePicker({ showArrowButtons: true, value: zeroDate });
            const hourInput = findInputElement(Classes.TIMEPICKER_HOUR);
            assert.strictEqual(hourInput.value, "0");
            assert.strictEqual(timePicker.state.value.getHours(), 0);

            clickIncrementBtn(Classes.TIMEPICKER_HOUR);
            assert.strictEqual(hourInput.value, "0");
            assert.strictEqual(timePicker.state.value.getHours(), 0);
        });
    });

    function assertTimeIs(time: Date, hours: number, minutes: number, seconds?: number, milliseconds?: number) {
        assert.strictEqual(time.getHours(), hours);
        assert.strictEqual(time.getMinutes(), minutes);
        if (seconds != null) {
            assert.strictEqual(time.getSeconds(), seconds);
        }
        if (milliseconds != null) {
            assert.strictEqual(time.getMilliseconds(), milliseconds);
        }
    }

    function clickIncrementBtn(className: string) {
        const arrowBtns = document.querySelectorAll(`.${Classes.TIMEPICKER_ARROW_BUTTON}.${className}`);
        TestUtils.Simulate.click(arrowBtns[0]);
    }

    function clickDecrementBtn(className: string) {
        const arrowBtns = document.querySelectorAll(`.${Classes.TIMEPICKER_ARROW_BUTTON}.${className}`);
        TestUtils.Simulate.click(arrowBtns[1]);
    }

    function focusOnInput(className: string) {
        TestUtils.Simulate.focus(findInputElement(className));
    }

    function keyDownOnInput(className: string, key: number) {
        TestUtils.Simulate.keyDown(findInputElement(className), { which: key });
    }

    function findInputElement(className: string) {
        return document.querySelector(`.${Classes.TIMEPICKER_INPUT}.${className}`) as HTMLInputElement;
    }

    function changeInputThenBlur(input: HTMLInputElement, value: string) {
        input.value = value;
        TestUtils.Simulate.change(input);
        TestUtils.Simulate.blur(input);
    }

    function renderTimePicker(props?: Partial<ITimePickerProps>) {
        timePicker = ReactDOM.render(
            <TimePicker onChange={onTimePickerChange} {...props}/>,
            testsContainerElement,
        ) as TimePicker;
    }
});
