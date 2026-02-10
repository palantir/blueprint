/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
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

import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assert, expect } from "chai";
import { spy } from "sinon";

import { Classes as CoreClasses, Intent } from "@blueprintjs/core";
import { createTimeObject } from "@blueprintjs/test-commons";

import { Classes, TimePicker, TimePrecision } from "../../src";

describe("<TimePicker>", () => {
    it("should render its contents", () => {
        render(<TimePicker />);

        expect(screen.getByLabelText("hours (24hr clock)")).to.exist;
        expect(screen.getByLabelText("minutes")).to.exist;
    });

    it("should propagate class names correctly", () => {
        const { container } = render(<TimePicker className="foo" />);
        const timePicker = container.querySelector(`.${Classes.TIMEPICKER}`);

        expect(timePicker).to.exist;
        expect(timePicker?.classList.contains("foo")).to.be.true;
    });

    it("should allow arrow buttons to loop time values", async () => {
        render(
            <TimePicker
                defaultValue={new Date(2015, 1, 1, 0, 0, 59, 999)}
                precision={TimePrecision.MILLISECOND}
                showArrowButtons={true}
            />,
        );

        const decrementHourBtn = screen.getByLabelText<HTMLButtonElement>("Decrease hours (24hr clock)");
        const decrementMinuteBtn = screen.getByLabelText<HTMLButtonElement>("Decrease minutes");
        const incrementSecondBtn = screen.getByLabelText<HTMLButtonElement>("Increase seconds");
        const incrementMillisecondBtn = screen.getByLabelText<HTMLButtonElement>("Increase milliseconds");

        // Initial time should be 0:00:59.999
        assertTimeIs("0", "00", "59", "999");

        await userEvent.click(decrementHourBtn);

        assertTimeIs("23", "00", "59", "999");

        await userEvent.click(decrementMinuteBtn);

        assertTimeIs("23", "59", "59", "999");

        await userEvent.click(incrementSecondBtn);

        assertTimeIs("23", "59", "00", "999");

        await userEvent.click(incrementMillisecondBtn);

        assertTimeIs("23", "59", "00", "000");
    });

    it("should respond to keyboard arrow presses", async () => {
        render(<TimePicker precision={TimePrecision.MILLISECOND} />);

        const hourInput = screen.getByLabelText<HTMLInputElement>("hours (24hr clock)");
        const minuteInput = screen.getByLabelText<HTMLInputElement>("minutes");
        const secondInput = screen.getByLabelText<HTMLInputElement>("seconds");
        const millisecondInput = screen.getByLabelText<HTMLInputElement>("milliseconds");

        // All inputs should start at 0
        assertTimeIs("0", "00", "00", "000");

        // Test arrow up
        await userEvent.click(hourInput);
        await userEvent.keyboard("{ArrowUp}");
        assertTimeIs("1", "00", "00", "000");

        await userEvent.click(minuteInput);
        await userEvent.keyboard("{ArrowUp}");
        assertTimeIs("1", "1", "00", "000");

        await userEvent.click(secondInput);
        await userEvent.keyboard("{ArrowUp}");
        assertTimeIs("1", "1", "1", "000");

        await userEvent.click(millisecondInput);
        await userEvent.keyboard("{ArrowUp}");
        assertTimeIs("1", "1", "1", "1");

        // Test arrow down
        await userEvent.click(hourInput);
        await userEvent.keyboard("{ArrowDown}");
        assertTimeIs("0", "1", "1", "1");

        await userEvent.click(minuteInput);
        await userEvent.keyboard("{ArrowDown}");
        assertTimeIs("0", "0", "1", "1");

        await userEvent.click(secondInput);
        await userEvent.keyboard("{ArrowDown}");
        assertTimeIs("0", "0", "0", "1");

        await userEvent.click(millisecondInput);
        await userEvent.keyboard("{ArrowDown}");
        assertTimeIs("0", "0", "0", "0");
    });

    it("should respond to arrow button clicks", async () => {
        render(<TimePicker precision={TimePrecision.MILLISECOND} showArrowButtons={true} />);

        const incrementHourBtn = screen.getByLabelText<HTMLButtonElement>("Increase hours (24hr clock)");
        const incrementMinuteBtn = screen.getByLabelText<HTMLButtonElement>("Increase minutes");
        const incrementSecondBtn = screen.getByLabelText<HTMLButtonElement>("Increase seconds");
        const incrementMillisecondBtn = screen.getByLabelText<HTMLButtonElement>("Increase milliseconds");

        const decrementHourBtn = screen.getByLabelText<HTMLButtonElement>("Decrease hours (24hr clock)");
        const decrementMinuteBtn = screen.getByLabelText<HTMLButtonElement>("Decrease minutes");
        const decrementSecondBtn = screen.getByLabelText<HTMLButtonElement>("Decrease seconds");
        const decrementMillisecondBtn = screen.getByLabelText<HTMLButtonElement>("Decrease milliseconds");

        // All inputs should start at 0
        assertTimeIs("0", "00", "00", "000");

        // Test increment buttons
        await userEvent.click(incrementHourBtn);
        assertTimeIs("1", "00", "00", "000");

        await userEvent.click(incrementMinuteBtn);
        assertTimeIs("1", "01", "00", "000");

        await userEvent.click(incrementSecondBtn);
        assertTimeIs("1", "01", "01", "000");

        await userEvent.click(incrementMillisecondBtn);
        assertTimeIs("1", "01", "01", "001");

        // Test decrement buttons
        await userEvent.click(decrementHourBtn);
        assertTimeIs("0", "01", "01", "001");

        await userEvent.click(decrementMinuteBtn);
        assertTimeIs("0", "00", "01", "001");

        await userEvent.click(decrementSecondBtn);
        assertTimeIs("0", "00", "00", "001");

        await userEvent.click(decrementMillisecondBtn);
        assertTimeIs("0", "00", "00", "000");
    });

    it("should allow valid text entry", async () => {
        render(<TimePicker />);

        const hourInput = screen.getByLabelText("hours (24hr clock)") as HTMLInputElement;
        expect(hourInput.value).to.equal("0");

        await userEvent.clear(hourInput);
        await userEvent.type(hourInput, "2");

        expect(hourInput.value).to.equal("2");
        expect(hourInput.classList.contains(CoreClasses.intentClass(Intent.DANGER))).to.be.false;
    });

    it("should disallow non-number text entry", async () => {
        render(<TimePicker />);

        const hourInput = screen.getByLabelText("hours (24hr clock)") as HTMLInputElement;
        expect(hourInput.value).to.equal("0");

        await userEvent.clear(hourInput);
        await userEvent.type(hourInput, "ab");

        expect(hourInput.value).to.equal("");
    });

    it("should allow invalid number entry but show visual indicator", async () => {
        render(<TimePicker />);

        const hourInput = screen.getByLabelText<HTMLInputElement>("hours (24hr clock)");
        expect(hourInput.value).to.equal("0");

        await userEvent.clear(hourInput);
        await userEvent.type(hourInput, "300");

        expect(hourInput.value).to.equal("300");
        expect(hourInput.classList.contains(CoreClasses.intentClass(Intent.DANGER))).to.be.true;
    });

    it("should revert to saved value after invalid text entry is blurred", async () => {
        render(<TimePicker />);

        const hourInput = screen.getByLabelText<HTMLInputElement>("hours (24hr clock)");
        expect(hourInput.value).to.equal("0");

        await userEvent.clear(hourInput);
        await userEvent.type(hourInput, "ab");
        await userEvent.tab();

        expect(hourInput.value).to.equal("0");
    });

    it("should not render arrow buttons by default", () => {
        render(<TimePicker />);

        expect(screen.queryByLabelText("Increase hours (24hr clock)")).to.not.exist;
        expect(screen.queryByLabelText("Decrease hours (24hr clock)")).to.not.exist;
    });

    it("should render arrow buttons when showArrowButtons is true", () => {
        render(<TimePicker showArrowButtons={true} />);

        expect(screen.getByLabelText("Increase hours (24hr clock)")).to.exist;
        expect(screen.getByLabelText("Decrease hours (24hr clock)")).to.exist;
        expect(screen.getByLabelText("Increase minutes")).to.exist;
        expect(screen.getByLabelText("Decrease minutes")).to.exist;
    });

    it("should select text on focus when selectAllOnFocus is true", () => {
        render(<TimePicker selectAllOnFocus={true} />);

        const hourInput = screen.getByLabelText<HTMLInputElement>("hours (24hr clock)");
        const minuteInput = screen.getByLabelText<HTMLInputElement>("minutes");

        fireEvent.focus(hourInput);

        expect(window.getSelection()?.toString()).to.equal("0");

        fireEvent.focus(minuteInput);

        expect(window.getSelection()?.toString()).to.equal("00");
    });

    it("should not change value when disabled", async () => {
        render(<TimePicker disabled={true} precision={TimePrecision.MILLISECOND} showArrowButtons={true} />);

        const hourInput = screen.getByLabelText<HTMLInputElement>("hours (24hr clock)");
        const minuteInput = screen.getByLabelText<HTMLInputElement>("minutes");

        expect(hourInput.disabled).to.be.true;
        expect(minuteInput.disabled).to.be.true;

        // All inputs should start at 0 and remain unchanged
        expect(hourInput.value).to.equal("0");
        expect(minuteInput.value).to.equal("00");

        // Try arrow buttons
        await userEvent.click(screen.getByLabelText<HTMLButtonElement>("Increase hours (24hr clock)"));
        expect(hourInput.value).to.equal("0");

        // Try keyboard events
        await userEvent.click(hourInput);
        await userEvent.keyboard("{ArrowUp}");
        expect(hourInput.value).to.equal("0");
    });

    describe("Time range - minTime and maxTime props", () => {
        it("should use minTime as initial time if defaultValue is smaller than minTime", () => {
            render(
                <TimePicker
                    defaultValue={createTimeObject(12, 30)}
                    minTime={createTimeObject(15, 30)}
                    precision={TimePrecision.MILLISECOND}
                />,
            );

            expect(screen.getByDisplayValue("15")).to.exist; // hour
            expect(screen.getByDisplayValue("30")).to.exist; // minute
        });

        it("should use maxTime as initial time if defaultValue is greater than maxTime", () => {
            render(
                <TimePicker
                    defaultValue={createTimeObject(20, 30)}
                    maxTime={createTimeObject(18, 30)}
                    minTime={createTimeObject(15, 30)}
                    precision={TimePrecision.MILLISECOND}
                />,
            );

            expect(screen.getByDisplayValue("18")).to.exist; // hour
            expect(screen.getByDisplayValue("30")).to.exist; // minute
        });

        it("should allow any time to be selected by default", async () => {
            render(<TimePicker precision={TimePrecision.MILLISECOND} />);

            const hourInput = screen.getByLabelText<HTMLInputElement>("hours (24hr clock)");
            const minuteInput = screen.getByLabelText<HTMLInputElement>("minutes");
            const secondInput = screen.getByLabelText<HTMLInputElement>("seconds");
            const millisecondInput = screen.getByLabelText<HTMLInputElement>("milliseconds");

            // Test default minTime (0:00:00.000)
            await userEvent.clear(hourInput);
            await userEvent.type(hourInput, "0");
            await userEvent.tab();
            expect(hourInput.value).to.equal("0");

            // Test time between default minTime and maxTime
            await userEvent.clear(hourInput);
            await userEvent.type(hourInput, "12");
            await userEvent.tab();
            await userEvent.clear(minuteInput);
            await userEvent.type(minuteInput, "30");
            await userEvent.tab();
            expect(hourInput.value).to.equal("12");
            expect(minuteInput.value).to.equal("30");

            // Test default maxTime (23:59:59.999)
            await userEvent.clear(hourInput);
            await userEvent.type(hourInput, "23");
            await userEvent.tab();
            await userEvent.clear(minuteInput);
            await userEvent.type(minuteInput, "59");
            await userEvent.tab();
            await userEvent.clear(secondInput);
            await userEvent.type(secondInput, "59");
            await userEvent.tab();
            await userEvent.clear(millisecondInput);
            await userEvent.type(millisecondInput, "999");
            await userEvent.tab();
            expect(hourInput.value).to.equal("23");
            expect(minuteInput.value).to.equal("59");
            expect(secondInput.value).to.equal("59");
            expect(millisecondInput.value).to.equal("999");
        });

        it("should allow overlapping time ranges", async () => {
            render(
                <TimePicker
                    maxTime={createTimeObject(3)}
                    minTime={createTimeObject(22)}
                    precision={TimePrecision.MILLISECOND}
                />,
            );

            const hourInput = screen.getByLabelText<HTMLInputElement>("hours (24hr clock)");
            await userEvent.clear(hourInput);
            await userEvent.type(hourInput, "2");
            await userEvent.tab();

            expect(hourInput.value).to.equal("2");
        });

        it("should not allow typing time greater than maxTime", async () => {
            const { rerender } = render(
                <TimePicker defaultValue={createTimeObject(10, 20)} precision={TimePrecision.MILLISECOND} />,
            );

            rerender(
                <TimePicker
                    defaultValue={createTimeObject(10, 20)}
                    maxTime={createTimeObject(21)}
                    minTime={createTimeObject(18)}
                    precision={TimePrecision.MILLISECOND}
                />,
            );

            const hourInput = screen.getByLabelText<HTMLInputElement>("hours (24hr clock)");
            await userEvent.clear(hourInput);
            await userEvent.type(hourInput, "22");
            await userEvent.tab();

            expect(hourInput.value).to.equal("18");
        });

        it("should not allow typing time smaller than minTime", async () => {
            const { rerender } = render(
                <TimePicker defaultValue={createTimeObject(10, 20)} precision={TimePrecision.MILLISECOND} />,
            );

            rerender(
                <TimePicker
                    defaultValue={createTimeObject(10, 20)}
                    maxTime={createTimeObject(21)}
                    minTime={createTimeObject(18)}
                    precision={TimePrecision.MILLISECOND}
                />,
            );

            const hourInput = screen.getByLabelText("hours (24hr clock)") as HTMLInputElement;
            await userEvent.clear(hourInput);
            await userEvent.type(hourInput, "16");
            await userEvent.tab();

            expect(hourInput.value).to.equal("18");
        });

        it("should not allow time smaller than minTime while decrementing", async () => {
            render(<TimePicker minTime={createTimeObject(15, 32, 20, 600)} precision={TimePrecision.MILLISECOND} />);

            const hourInput = screen.getByLabelText<HTMLInputElement>("hours (24hr clock)");
            await userEvent.click(hourInput);
            await userEvent.keyboard("{ArrowDown}");

            expect(hourInput.value).to.equal("15");
        });

        it("should not allow time greater than maxTime while incrementing", async () => {
            render(
                <TimePicker
                    defaultValue={createTimeObject(14, 55, 30, 200)}
                    maxTime={createTimeObject(14, 55, 30, 200)}
                    precision={TimePrecision.MILLISECOND}
                />,
            );

            const hourInput = screen.getByLabelText("hours (24hr clock)") as HTMLInputElement;
            await userEvent.click(hourInput);
            await userEvent.keyboard("{ArrowUp}");

            expect(hourInput.value).to.equal("14");
        });

        it("should reset to last good state when time smaller than minTime is blurred", async () => {
            render(
                <TimePicker
                    defaultValue={createTimeObject(15, 32, 20, 600)}
                    minTime={createTimeObject(15, 32, 20, 600)}
                    precision={TimePrecision.MILLISECOND}
                />,
            );

            const hourInput = screen.getByLabelText<HTMLInputElement>("hours (24hr clock)");
            await userEvent.clear(hourInput);
            await userEvent.type(hourInput, "14");
            await userEvent.tab();

            expect(hourInput.value).to.equal("15");
        });

        it("should reset to last good state when time greater than maxTime is blurred", async () => {
            render(
                <TimePicker
                    defaultValue={createTimeObject(15, 32, 20, 600)}
                    maxTime={createTimeObject(15, 32, 20, 600)}
                    precision={TimePrecision.MILLISECOND}
                />,
            );

            const hourInput = screen.getByLabelText<HTMLInputElement>("hours (24hr clock)");
            await userEvent.clear(hourInput);
            await userEvent.type(hourInput, "16");
            await userEvent.tab();

            expect(hourInput.value).to.equal("15");
        });

        it("should immediately adjust selected time when minTime prop changes", () => {
            const { rerender } = render(
                <TimePicker defaultValue={createTimeObject(10, 20)} precision={TimePrecision.MILLISECOND} />,
            );

            rerender(
                <TimePicker
                    defaultValue={createTimeObject(10, 20)}
                    minTime={createTimeObject(15, 32, 20, 600)}
                    precision={TimePrecision.MILLISECOND}
                />,
            );

            expect(screen.getByDisplayValue("15")).to.exist; // hour
            expect(screen.getByDisplayValue("32")).to.exist; // minute
        });

        it("should immediately adjust selected time when maxTime prop changes", () => {
            const { rerender } = render(
                <TimePicker defaultValue={createTimeObject(12, 20)} precision={TimePrecision.MILLISECOND} />,
            );

            rerender(
                <TimePicker
                    defaultValue={createTimeObject(12, 20)}
                    maxTime={createTimeObject(10, 30, 15, 200)}
                    precision={TimePrecision.MILLISECOND}
                />,
            );

            expect(screen.getByDisplayValue("10")).to.exist; // hour
            expect(screen.getByDisplayValue("30")).to.exist; // minute
        });

        it("should keep time at boundary value when minTime equals maxTime", async () => {
            render(<TimePicker maxTime={createTimeObject(14, 15)} minTime={createTimeObject(14, 15)} />);

            const hourInput = screen.getByLabelText<HTMLInputElement>("hours (24hr clock)");
            await userEvent.click(hourInput);
            await userEvent.keyboard("{ArrowUp}");

            expect(hourInput.value).to.equal("14");

            await userEvent.keyboard("{ArrowDown}");
            expect(hourInput.value).to.equal("14");
        });

        it("should not loop when minTime > maxTime and selected time exceeds minTime", async () => {
            const minTime = createTimeObject(17, 20);
            render(<TimePicker defaultValue={minTime} maxTime={createTimeObject(15, 20)} minTime={minTime} />);

            const hourInput = screen.getByLabelText<HTMLInputElement>("hours (24hr clock)");
            await userEvent.click(hourInput);
            await userEvent.keyboard("{ArrowDown}");

            expect(hourInput.value).to.equal("17");
        });

        it("should not loop when minTime > maxTime and selected time exceeds maxTime", async () => {
            const maxTime = createTimeObject(12, 20);
            render(<TimePicker defaultValue={maxTime} maxTime={maxTime} minTime={createTimeObject(17, 20)} />);

            const hourInput = screen.getByLabelText("hours (24hr clock)") as HTMLInputElement;
            await userEvent.click(hourInput);
            await userEvent.keyboard("{ArrowUp}");

            expect(hourInput.value).to.equal("12");
        });

        it("should not loop when minTime < maxTime and selected time exceeds maxTime", async () => {
            const maxTime = createTimeObject(17, 20);
            render(<TimePicker defaultValue={maxTime} maxTime={maxTime} minTime={createTimeObject(12, 20)} />);

            const hourInput = screen.getByLabelText<HTMLInputElement>("hours (24hr clock)");
            await userEvent.click(hourInput);
            await userEvent.keyboard("{ArrowUp}");

            expect(hourInput.value).to.equal("17");
        });

        it("should not loop when minTime < maxTime and selected time exceeds minTime", async () => {
            const minTime = createTimeObject(12, 20);
            render(<TimePicker defaultValue={minTime} maxTime={createTimeObject(17, 20)} minTime={minTime} />);

            const hourInput = screen.getByLabelText<HTMLInputElement>("hours (24hr clock)");
            await userEvent.click(hourInput);
            await userEvent.keyboard("{ArrowDown}");

            expect(hourInput.value).to.equal("12");
        });
    });

    describe("when uncontrolled", () => {
        it("should set initial time from defaultValue", () => {
            render(
                <TimePicker
                    defaultValue={new Date(2015, 1, 1, 10, 11, 12, 13)}
                    precision={TimePrecision.MILLISECOND}
                />,
            );

            expect(screen.getByDisplayValue("10")).to.exist; // hour
            expect(screen.getByDisplayValue("11")).to.exist; // minute
            expect(screen.getByDisplayValue("12")).to.exist; // second
            expect(screen.getByDisplayValue("013")).to.exist; // millisecond
        });

        it("should fire onChange events on arrow key press", async () => {
            const onChange = spy();
            render(<TimePicker onChange={onChange} />);

            expect(onChange.notCalled).to.be.true;

            const hourInput = screen.getByLabelText<HTMLInputElement>("hours (24hr clock)");
            await userEvent.click(hourInput);
            await userEvent.keyboard("{ArrowUp}");

            expect(onChange.calledOnce).to.be.true;
            expect((onChange.firstCall.args[0] as Date).getHours()).to.equal(1);
        });

        it("should change input text and internal state on arrow key press", async () => {
            render(<TimePicker />);

            const hourInput = screen.getByLabelText<HTMLInputElement>("hours (24hr clock)");
            expect(hourInput.value).to.equal("0");

            await userEvent.click(hourInput);
            await userEvent.keyboard("{ArrowUp}");

            expect(hourInput.value).to.equal("1");
        });

        it("should fire onChange events when new value is typed", async () => {
            const onChange = spy();
            render(<TimePicker onChange={onChange} />);

            expect(onChange.notCalled).to.be.true;

            const hourInput = screen.getByLabelText<HTMLInputElement>("hours (24hr clock)");
            await userEvent.clear(hourInput);
            await userEvent.type(hourInput, "8");
            await userEvent.tab();

            expect(onChange.calledOnce).to.be.true;
            expect((onChange.firstCall.args[0] as Date).getHours()).to.equal(8);
        });

        it("should format input and change state when new value is typed", async () => {
            render(<TimePicker />);

            const minuteInput = screen.getByLabelText<HTMLInputElement>("minutes");
            expect(minuteInput.value).to.equal("00");

            await userEvent.clear(minuteInput);
            await userEvent.type(minuteInput, "8");
            await userEvent.tab();

            expect(minuteInput.value).to.equal("8");
        });

        it("should fire onChange events when arrow button is pressed", async () => {
            const onChange = spy();
            render(<TimePicker onChange={onChange} showArrowButtons={true} />);

            expect(onChange.notCalled).to.be.true;

            await userEvent.click(screen.getByLabelText<HTMLButtonElement>("Increase hours (24hr clock)"));

            expect(onChange.calledOnce).to.be.true;
            expect((onChange.firstCall.args[0] as Date).getHours()).to.equal(1);
        });

        it("should change input and state when arrow button is pressed", async () => {
            render(<TimePicker showArrowButtons={true} />);

            const hourInput = screen.getByLabelText<HTMLInputElement>("hours (24hr clock)");
            expect(hourInput.value).to.equal("0");

            await userEvent.click(screen.getByLabelText<HTMLButtonElement>("Increase hours (24hr clock)"));

            expect(hourInput.value).to.equal("1");
        });
    });

    describe("when controlled", () => {
        it("should change state when value prop changes", () => {
            const zeroDate = new Date(0, 0, 0, 0, 0, 0, 0);
            const { rerender } = render(<TimePicker value={zeroDate} />);

            expect(screen.getByDisplayValue("0")).to.exist; // hour
            expect(screen.getByDisplayValue("00")).to.exist; // minute

            rerender(<TimePicker value={new Date(2015, 1, 1, 1, 2, 3, 4)} />);

            expect(screen.getByDisplayValue("1")).to.exist; // hour
            expect(screen.getByDisplayValue("02")).to.exist; // minute
        });

        it("should reset state when value changes to null", () => {
            const { rerender } = render(<TimePicker defaultValue={new Date(2015, 1, 1, 1, 2, 3, 4)} />);

            expect(screen.getByDisplayValue("1")).to.exist; // hour
            expect(screen.getByDisplayValue("02")).to.exist; // minute

            rerender(
                <TimePicker defaultValue={new Date(2015, 1, 1, 1, 2, 3, 4)} value={new Date(2015, 1, 1, 5, 6, 7, 8)} />,
            );

            expect(screen.getByDisplayValue("5")).to.exist; // hour
            expect(screen.getByDisplayValue("06")).to.exist; // minute

            rerender(<TimePicker defaultValue={new Date(2015, 1, 1, 1, 2, 3, 4)} value={null} />);

            expect(screen.getByDisplayValue("1")).to.exist; // hour
            expect(screen.getByDisplayValue("02")).to.exist; // minute
        });

        it("should fire onChange events on arrow key press", async () => {
            const onChange = spy();
            const zeroDate = new Date(0, 0, 0, 0, 0, 0, 0);
            render(<TimePicker value={zeroDate} onChange={onChange} />);

            expect(onChange.notCalled).to.be.true;

            const hourInput = screen.getByLabelText<HTMLInputElement>("hours (24hr clock)");
            await userEvent.click(hourInput);
            await userEvent.keyboard("{ArrowUp}");

            expect(onChange.calledOnce).to.be.true;
            expect((onChange.firstCall.args[0] as Date).getHours()).to.equal(1);
        });

        it("should not change input text or state on arrow key press", async () => {
            const zeroDate = new Date(0, 0, 0, 0, 0, 0, 0);
            render(<TimePicker value={zeroDate} />);

            const hourInput = screen.getByLabelText<HTMLInputElement>("hours (24hr clock)");
            expect(hourInput.value).to.equal("0");

            await userEvent.click(hourInput);
            await userEvent.keyboard("{ArrowUp}");

            expect(hourInput.value).to.equal("0");
        });

        it("should fire onChange events when new value is typed", async () => {
            const onChange = spy();
            const zeroDate = new Date(0, 0, 0, 0, 0, 0, 0);
            render(<TimePicker value={zeroDate} onChange={onChange} />);

            expect(onChange.notCalled).to.be.true;

            const hourInput = screen.getByLabelText<HTMLInputElement>("hours (24hr clock)");
            await userEvent.clear(hourInput);
            await userEvent.type(hourInput, "8");
            await userEvent.tab();

            expect(onChange.calledOnce).to.be.true;
            expect((onChange.firstCall.args[0] as Date).getHours()).to.equal(8);
        });

        it("should not format input and change state when new value is typed", async () => {
            const zeroDate = new Date(0, 0, 0, 0, 0, 0, 0);
            render(<TimePicker value={zeroDate} />);

            const minuteInput = screen.getByLabelText<HTMLInputElement>("minutes");
            expect(minuteInput.value).to.equal("00");

            await userEvent.clear(minuteInput);
            await userEvent.type(minuteInput, "8");
            await userEvent.tab();

            expect(minuteInput.value).to.equal("0");
        });

        it("should fire onChange events when arrow button is pressed", async () => {
            const onChange = spy();
            const zeroDate = new Date(0, 0, 0, 0, 0, 0, 0);
            render(<TimePicker showArrowButtons={true} value={zeroDate} onChange={onChange} />);

            expect(onChange.notCalled).to.be.true;

            await userEvent.click(screen.getByLabelText<HTMLButtonElement>("Increase hours (24hr clock)"));

            expect(onChange.calledOnce).to.be.true;
            expect((onChange.firstCall.args[0] as Date).getHours()).to.equal(1);
        });

        it("should not change input and state when arrow button is pressed", async () => {
            const zeroDate = new Date(0, 0, 0, 0, 0, 0, 0);
            render(<TimePicker showArrowButtons={true} value={zeroDate} />);

            const hourInput = screen.getByLabelText<HTMLInputElement>("hours (24hr clock)");
            expect(hourInput.value).to.equal("0");

            await userEvent.click(screen.getByLabelText<HTMLButtonElement>("Increase hours (24hr clock)"));

            expect(hourInput.value).to.equal("0");
        });
    });
});

function assertTimeIs(hours: string, minutes: string, seconds: string, milliseconds: string) {
    const hourInput = screen.getByLabelText<HTMLInputElement>("hours (24hr clock)");
    const minuteInput = screen.getByLabelText<HTMLInputElement>("minutes");
    const secondInput = screen.getByLabelText<HTMLInputElement>("seconds");
    const millisecondInput = screen.getByLabelText<HTMLInputElement>("milliseconds");

    assert.strictEqual(hourInput.value, hours, "hours input value");
    assert.strictEqual(minuteInput.value, minutes, "minutes input value");
    assert.strictEqual(secondInput.value, seconds, "seconds input value");
    assert.strictEqual(millisecondInput.value, milliseconds, "milliseconds input value");
}
