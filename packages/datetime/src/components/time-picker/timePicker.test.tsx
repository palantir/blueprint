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

import { Classes as CoreClasses, Intent } from "@blueprintjs/core";
import { createTimeObject } from "@blueprintjs/test-commons";
import { describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../..";
import { TimePrecision } from "../../common/timePrecision";

import { TimePicker } from "./timePicker";

describe("<TimePicker>", () => {
    it("should render its contents", () => {
        render(<TimePicker />);

        expect(screen.getByLabelText("hours (24hr clock)")).toBeInTheDocument();
        expect(screen.getByLabelText("minutes")).toBeInTheDocument();
    });

    it("should propagate class names correctly", () => {
        const { container } = render(<TimePicker className="foo" />);
        const timePicker = container.querySelector(`.${Classes.TIMEPICKER}`);

        expect(timePicker).toBeInTheDocument();
        expect(timePicker).toHaveClass("foo");
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

    it("should respond to keyboard arrow presses", () => {
        render(<TimePicker precision={TimePrecision.MILLISECOND} />);

        const hourInput = screen.getByLabelText<HTMLInputElement>("hours (24hr clock)");
        const minuteInput = screen.getByLabelText<HTMLInputElement>("minutes");
        const secondInput = screen.getByLabelText<HTMLInputElement>("seconds");
        const millisecondInput = screen.getByLabelText<HTMLInputElement>("milliseconds");

        // All inputs should start at 0
        assertTimeIs("0", "00", "00", "000");

        // Test arrow up
        fireEvent.keyDown(hourInput, { key: "ArrowUp" });
        assertTimeIs("1", "00", "00", "000");

        fireEvent.keyDown(minuteInput, { key: "ArrowUp" });
        assertTimeIs("1", "01", "00", "000");

        fireEvent.keyDown(secondInput, { key: "ArrowUp" });
        assertTimeIs("1", "01", "01", "000");

        fireEvent.keyDown(millisecondInput, { key: "ArrowUp" });
        assertTimeIs("1", "01", "01", "001");

        // Test arrow down
        fireEvent.keyDown(hourInput, { key: "ArrowDown" });
        assertTimeIs("0", "01", "01", "001");

        fireEvent.keyDown(minuteInput, { key: "ArrowDown" });
        assertTimeIs("0", "00", "01", "001");

        fireEvent.keyDown(secondInput, { key: "ArrowDown" });
        assertTimeIs("0", "00", "00", "001");

        fireEvent.keyDown(millisecondInput, { key: "ArrowDown" });
        assertTimeIs("0", "00", "00", "000");
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

    it("should allow valid text entry", () => {
        render(<TimePicker />);

        const hourInput = screen.getByLabelText("hours (24hr clock)") as HTMLInputElement;
        expect(hourInput.value).toBe("0");

        fireEvent.change(hourInput, { target: { value: "2" } });

        expect(hourInput.value).toBe("2");
        expect(hourInput).not.toHaveClass(CoreClasses.intentClass(Intent.DANGER));
    });

    it("should disallow non-number text entry", () => {
        render(<TimePicker />);

        const hourInput = screen.getByLabelText("hours (24hr clock)") as HTMLInputElement;
        expect(hourInput.value).toBe("0");

        fireEvent.change(hourInput, { target: { value: "ab" } });

        expect(hourInput.value).toBe("");
    });

    it("should allow invalid number entry but show visual indicator", () => {
        render(<TimePicker />);

        const hourInput = screen.getByLabelText<HTMLInputElement>("hours (24hr clock)");
        expect(hourInput.value).toBe("0");

        fireEvent.change(hourInput, { target: { value: "300" } });

        expect(hourInput.value).toBe("300");
        expect(hourInput).toHaveClass(CoreClasses.intentClass(Intent.DANGER));
    });

    it("should revert to saved value after invalid text entry is blurred", () => {
        render(<TimePicker />);

        const hourInput = screen.getByLabelText<HTMLInputElement>("hours (24hr clock)");
        expect(hourInput.value).toBe("0");

        fireEvent.change(hourInput, { target: { value: "ab" } });
        fireEvent.blur(hourInput);

        expect(hourInput.value).toBe("0");
    });

    it("should not render arrow buttons by default", () => {
        render(<TimePicker />);

        expect(screen.queryByLabelText("Increase hours (24hr clock)")).not.toBeInTheDocument();
        expect(screen.queryByLabelText("Decrease hours (24hr clock)")).not.toBeInTheDocument();
    });

    it("should render arrow buttons when showArrowButtons is true", () => {
        render(<TimePicker showArrowButtons={true} />);

        expect(screen.getByLabelText("Increase hours (24hr clock)")).toBeInTheDocument();
        expect(screen.getByLabelText("Decrease hours (24hr clock)")).toBeInTheDocument();
        expect(screen.getByLabelText("Increase minutes")).toBeInTheDocument();
        expect(screen.getByLabelText("Decrease minutes")).toBeInTheDocument();
    });

    it("should select text on focus when selectAllOnFocus is true", () => {
        render(<TimePicker selectAllOnFocus={true} />);

        const hourInput = screen.getByLabelText<HTMLInputElement>("hours (24hr clock)");
        const minuteInput = screen.getByLabelText<HTMLInputElement>("minutes");

        const hourSelect = vi.spyOn(hourInput, "select");
        const minuteSelect = vi.spyOn(minuteInput, "select");

        fireEvent.focus(hourInput);
        expect(hourSelect).toHaveBeenCalledOnce();

        fireEvent.focus(minuteInput);
        expect(minuteSelect).toHaveBeenCalledOnce();
    });

    it("should not change value when disabled", async () => {
        render(<TimePicker disabled={true} precision={TimePrecision.MILLISECOND} showArrowButtons={true} />);

        const hourInput = screen.getByLabelText<HTMLInputElement>("hours (24hr clock)");
        const minuteInput = screen.getByLabelText<HTMLInputElement>("minutes");

        expect(hourInput.disabled).toBe(true);
        expect(minuteInput.disabled).toBe(true);

        // All inputs should start at 0 and remain unchanged
        expect(hourInput.value).toBe("0");
        expect(minuteInput.value).toBe("00");

        // Try arrow buttons
        await userEvent.click(screen.getByLabelText<HTMLButtonElement>("Increase hours (24hr clock)"));
        expect(hourInput.value).toBe("0");

        // Try keyboard events
        fireEvent.keyDown(hourInput, { key: "ArrowUp" });
        expect(hourInput.value).toBe("0");
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

            expect(screen.getByDisplayValue("15")).toBeInTheDocument(); // hour
            expect(screen.getByDisplayValue("30")).toBeInTheDocument(); // minute
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

            expect(screen.getByDisplayValue("18")).toBeInTheDocument(); // hour
            expect(screen.getByDisplayValue("30")).toBeInTheDocument(); // minute
        });

        it("should allow any time to be selected by default", () => {
            render(<TimePicker precision={TimePrecision.MILLISECOND} />);

            const hourInput = screen.getByLabelText<HTMLInputElement>("hours (24hr clock)");
            const minuteInput = screen.getByLabelText<HTMLInputElement>("minutes");
            const secondInput = screen.getByLabelText<HTMLInputElement>("seconds");
            const millisecondInput = screen.getByLabelText<HTMLInputElement>("milliseconds");

            // Test default minTime (0:00:00.000)
            fireEvent.change(hourInput, { target: { value: "0" } });
            fireEvent.blur(hourInput);
            expect(hourInput.value).toBe("0");

            // Test time between default minTime and maxTime
            fireEvent.change(hourInput, { target: { value: "12" } });
            fireEvent.blur(hourInput);
            fireEvent.change(minuteInput, { target: { value: "30" } });
            fireEvent.blur(minuteInput);
            expect(hourInput.value).toBe("12");
            expect(minuteInput.value).toBe("30");

            // Test default maxTime (23:59:59.999)
            fireEvent.change(hourInput, { target: { value: "23" } });
            fireEvent.blur(hourInput);
            fireEvent.change(minuteInput, { target: { value: "59" } });
            fireEvent.blur(minuteInput);
            fireEvent.change(secondInput, { target: { value: "59" } });
            fireEvent.blur(secondInput);
            fireEvent.change(millisecondInput, { target: { value: "999" } });
            fireEvent.blur(millisecondInput);
            expect(hourInput.value).toBe("23");
            expect(minuteInput.value).toBe("59");
            expect(secondInput.value).toBe("59");
            expect(millisecondInput.value).toBe("999");
        });

        it("should allow overlapping time ranges", () => {
            render(
                <TimePicker
                    maxTime={createTimeObject(3)}
                    minTime={createTimeObject(22)}
                    precision={TimePrecision.MILLISECOND}
                />,
            );

            const hourInput = screen.getByLabelText<HTMLInputElement>("hours (24hr clock)");
            fireEvent.change(hourInput, { target: { value: "2" } });
            fireEvent.blur(hourInput);

            expect(hourInput.value).toBe("2");
        });

        it("should not allow typing time greater than maxTime", () => {
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
            fireEvent.change(hourInput, { target: { value: "22" } });
            fireEvent.blur(hourInput);

            expect(hourInput.value).toBe("18");
        });

        it("should not allow typing time smaller than minTime", () => {
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
            fireEvent.change(hourInput, { target: { value: "16" } });
            fireEvent.blur(hourInput);

            expect(hourInput.value).toBe("18");
        });

        it("should not allow time smaller than minTime while decrementing", () => {
            render(<TimePicker minTime={createTimeObject(15, 32, 20, 600)} precision={TimePrecision.MILLISECOND} />);

            const hourInput = screen.getByLabelText<HTMLInputElement>("hours (24hr clock)");
            fireEvent.keyDown(hourInput, { key: "ArrowDown" });

            expect(hourInput.value).toBe("15");
        });

        it("should not allow time greater than maxTime while incrementing", () => {
            render(
                <TimePicker
                    defaultValue={createTimeObject(14, 55, 30, 200)}
                    maxTime={createTimeObject(14, 55, 30, 200)}
                    precision={TimePrecision.MILLISECOND}
                />,
            );

            const hourInput = screen.getByLabelText("hours (24hr clock)") as HTMLInputElement;
            fireEvent.keyDown(hourInput, { key: "ArrowUp" });

            expect(hourInput.value).toBe("14");
        });

        it("should reset to last good state when time smaller than minTime is blurred", () => {
            render(
                <TimePicker
                    defaultValue={createTimeObject(15, 32, 20, 600)}
                    minTime={createTimeObject(15, 32, 20, 600)}
                    precision={TimePrecision.MILLISECOND}
                />,
            );

            const hourInput = screen.getByLabelText<HTMLInputElement>("hours (24hr clock)");
            fireEvent.change(hourInput, { target: { value: "14" } });
            fireEvent.blur(hourInput);

            expect(hourInput.value).toBe("15");
        });

        it("should reset to last good state when time greater than maxTime is blurred", () => {
            render(
                <TimePicker
                    defaultValue={createTimeObject(15, 32, 20, 600)}
                    maxTime={createTimeObject(15, 32, 20, 600)}
                    precision={TimePrecision.MILLISECOND}
                />,
            );

            const hourInput = screen.getByLabelText<HTMLInputElement>("hours (24hr clock)");
            fireEvent.change(hourInput, { target: { value: "16" } });
            fireEvent.blur(hourInput);

            expect(hourInput.value).toBe("15");
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

            expect(screen.getByDisplayValue("15")).toBeInTheDocument(); // hour
            expect(screen.getByDisplayValue("32")).toBeInTheDocument(); // minute
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

            expect(screen.getByDisplayValue("10")).toBeInTheDocument(); // hour
            expect(screen.getByDisplayValue("30")).toBeInTheDocument(); // minute
        });

        it("should keep time at boundary value when minTime equals maxTime", () => {
            render(<TimePicker maxTime={createTimeObject(14, 15)} minTime={createTimeObject(14, 15)} />);

            const hourInput = screen.getByLabelText<HTMLInputElement>("hours (24hr clock)");
            fireEvent.keyDown(hourInput, { key: "ArrowUp" });

            expect(hourInput.value).toBe("14");

            fireEvent.keyDown(hourInput, { key: "ArrowDown" });
            expect(hourInput.value).toBe("14");
        });

        it("should not loop when minTime > maxTime and selected time exceeds minTime", () => {
            const minTime = createTimeObject(17, 20);
            render(<TimePicker defaultValue={minTime} maxTime={createTimeObject(15, 20)} minTime={minTime} />);

            const hourInput = screen.getByLabelText<HTMLInputElement>("hours (24hr clock)");
            fireEvent.keyDown(hourInput, { key: "ArrowDown" });

            expect(hourInput.value).toBe("17");
        });

        it("should not loop when minTime > maxTime and selected time exceeds maxTime", () => {
            const maxTime = createTimeObject(12, 20);
            render(<TimePicker defaultValue={maxTime} maxTime={maxTime} minTime={createTimeObject(17, 20)} />);

            const hourInput = screen.getByLabelText("hours (24hr clock)") as HTMLInputElement;
            fireEvent.keyDown(hourInput, { key: "ArrowUp" });

            expect(hourInput.value).toBe("12");
        });

        it("should not loop when minTime < maxTime and selected time exceeds maxTime", () => {
            const maxTime = createTimeObject(17, 20);
            render(<TimePicker defaultValue={maxTime} maxTime={maxTime} minTime={createTimeObject(12, 20)} />);

            const hourInput = screen.getByLabelText<HTMLInputElement>("hours (24hr clock)");
            fireEvent.keyDown(hourInput, { key: "ArrowUp" });

            expect(hourInput.value).toBe("17");
        });

        it("should not loop when minTime < maxTime and selected time exceeds minTime", () => {
            const minTime = createTimeObject(12, 20);
            render(<TimePicker defaultValue={minTime} maxTime={createTimeObject(17, 20)} minTime={minTime} />);

            const hourInput = screen.getByLabelText<HTMLInputElement>("hours (24hr clock)");
            fireEvent.keyDown(hourInput, { key: "ArrowDown" });

            expect(hourInput.value).toBe("12");
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

            expect(screen.getByDisplayValue("10")).toBeInTheDocument(); // hour
            expect(screen.getByDisplayValue("11")).toBeInTheDocument(); // minute
            expect(screen.getByDisplayValue("12")).toBeInTheDocument(); // second
            expect(screen.getByDisplayValue("013")).toBeInTheDocument(); // millisecond
        });

        it("should fire onChange events on arrow key press", () => {
            const onChange = vi.fn();
            render(<TimePicker onChange={onChange} />);

            expect(onChange).not.toHaveBeenCalled();

            const hourInput = screen.getByLabelText<HTMLInputElement>("hours (24hr clock)");
            fireEvent.keyDown(hourInput, { key: "ArrowUp" });

            expect(onChange).toHaveBeenCalledOnce();
            expect((onChange.mock.calls[0][0] as Date).getHours()).toBe(1);
        });

        it("should change input text and internal state on arrow key press", () => {
            render(<TimePicker />);

            const hourInput = screen.getByLabelText<HTMLInputElement>("hours (24hr clock)");
            expect(hourInput.value).toBe("0");

            fireEvent.keyDown(hourInput, { key: "ArrowUp" });

            expect(hourInput.value).toBe("1");
        });

        it("should fire onChange events when new value is typed", () => {
            const onChange = vi.fn();
            render(<TimePicker onChange={onChange} />);

            expect(onChange).not.toHaveBeenCalled();

            const hourInput = screen.getByLabelText<HTMLInputElement>("hours (24hr clock)");
            fireEvent.change(hourInput, { target: { value: "8" } });
            fireEvent.blur(hourInput);

            expect(onChange).toHaveBeenCalledOnce();
            expect((onChange.mock.calls[0][0] as Date).getHours()).toBe(8);
        });

        it("should format input and change state when new value is typed", () => {
            render(<TimePicker />);

            const minuteInput = screen.getByLabelText<HTMLInputElement>("minutes");
            expect(minuteInput.value).toBe("00");

            fireEvent.change(minuteInput, { target: { value: "8" } });
            fireEvent.blur(minuteInput);

            expect(minuteInput.value).toBe("08");
        });

        it("should fire onChange events when arrow button is pressed", async () => {
            const onChange = vi.fn();
            render(<TimePicker onChange={onChange} showArrowButtons={true} />);

            expect(onChange).not.toHaveBeenCalled();

            await userEvent.click(screen.getByLabelText<HTMLButtonElement>("Increase hours (24hr clock)"));

            expect(onChange).toHaveBeenCalledOnce();
            expect((onChange.mock.calls[0][0] as Date).getHours()).toBe(1);
        });

        it("should change input and state when arrow button is pressed", async () => {
            render(<TimePicker showArrowButtons={true} />);

            const hourInput = screen.getByLabelText<HTMLInputElement>("hours (24hr clock)");
            expect(hourInput.value).toBe("0");

            await userEvent.click(screen.getByLabelText<HTMLButtonElement>("Increase hours (24hr clock)"));

            expect(hourInput.value).toBe("1");
        });
    });

    describe("when controlled", () => {
        it("should change state when value prop changes", () => {
            const zeroDate = new Date(0, 0, 0, 0, 0, 0, 0);
            const { rerender } = render(<TimePicker value={zeroDate} />);

            expect(screen.getByDisplayValue("0")).toBeInTheDocument(); // hour
            expect(screen.getByDisplayValue("00")).toBeInTheDocument(); // minute

            rerender(<TimePicker value={new Date(2015, 1, 1, 1, 2, 3, 4)} />);

            expect(screen.getByDisplayValue("1")).toBeInTheDocument(); // hour
            expect(screen.getByDisplayValue("02")).toBeInTheDocument(); // minute
        });

        it("should reset state when value changes to null", () => {
            const { rerender } = render(<TimePicker defaultValue={new Date(2015, 1, 1, 1, 2, 3, 4)} />);

            expect(screen.getByDisplayValue("1")).toBeInTheDocument(); // hour
            expect(screen.getByDisplayValue("02")).toBeInTheDocument(); // minute

            rerender(
                <TimePicker defaultValue={new Date(2015, 1, 1, 1, 2, 3, 4)} value={new Date(2015, 1, 1, 5, 6, 7, 8)} />,
            );

            expect(screen.getByDisplayValue("5")).toBeInTheDocument(); // hour
            expect(screen.getByDisplayValue("06")).toBeInTheDocument(); // minute

            rerender(<TimePicker defaultValue={new Date(2015, 1, 1, 1, 2, 3, 4)} value={null} />);

            expect(screen.getByDisplayValue("1")).toBeInTheDocument(); // hour
            expect(screen.getByDisplayValue("02")).toBeInTheDocument(); // minute
        });

        it("should fire onChange events on arrow key press", () => {
            const onChange = vi.fn();
            const zeroDate = new Date(0, 0, 0, 0, 0, 0, 0);
            render(<TimePicker value={zeroDate} onChange={onChange} />);

            expect(onChange).not.toHaveBeenCalled();

            const hourInput = screen.getByLabelText<HTMLInputElement>("hours (24hr clock)");
            fireEvent.keyDown(hourInput, { key: "ArrowUp" });

            expect(onChange).toHaveBeenCalledOnce();
            expect((onChange.mock.calls[0][0] as Date).getHours()).toBe(1);
        });

        it("should not change input text or state on arrow key press", () => {
            const zeroDate = new Date(0, 0, 0, 0, 0, 0, 0);
            render(<TimePicker value={zeroDate} />);

            const hourInput = screen.getByLabelText<HTMLInputElement>("hours (24hr clock)");
            expect(hourInput.value).toBe("0");

            fireEvent.keyDown(hourInput, { key: "ArrowUp" });

            expect(hourInput.value).toBe("0");
        });

        it("should fire onChange events when new value is typed", () => {
            const onChange = vi.fn();
            const zeroDate = new Date(0, 0, 0, 0, 0, 0, 0);
            render(<TimePicker value={zeroDate} onChange={onChange} />);

            expect(onChange).not.toHaveBeenCalled();

            const hourInput = screen.getByLabelText<HTMLInputElement>("hours (24hr clock)");
            fireEvent.change(hourInput, { target: { value: "8" } });
            fireEvent.blur(hourInput);

            expect(onChange).toHaveBeenCalledOnce();
            expect((onChange.mock.calls[0][0] as Date).getHours()).toBe(8);
        });

        it("should not format input and change state when new value is typed", () => {
            const zeroDate = new Date(0, 0, 0, 0, 0, 0, 0);
            render(<TimePicker value={zeroDate} />);

            const minuteInput = screen.getByLabelText<HTMLInputElement>("minutes");
            expect(minuteInput.value).toBe("00");

            fireEvent.change(minuteInput, { target: { value: "8" } });
            fireEvent.blur(minuteInput);

            expect(minuteInput.value).toBe("00");
        });

        it("should fire onChange events when arrow button is pressed", async () => {
            const onChange = vi.fn();
            const zeroDate = new Date(0, 0, 0, 0, 0, 0, 0);
            render(<TimePicker showArrowButtons={true} value={zeroDate} onChange={onChange} />);

            expect(onChange).not.toHaveBeenCalled();

            await userEvent.click(screen.getByLabelText<HTMLButtonElement>("Increase hours (24hr clock)"));

            expect(onChange).toHaveBeenCalledOnce();
            expect((onChange.mock.calls[0][0] as Date).getHours()).toBe(1);
        });

        it("should not change input and state when arrow button is pressed", async () => {
            const zeroDate = new Date(0, 0, 0, 0, 0, 0, 0);
            render(<TimePicker showArrowButtons={true} value={zeroDate} />);

            const hourInput = screen.getByLabelText<HTMLInputElement>("hours (24hr clock)");
            expect(hourInput.value).toBe("0");

            await userEvent.click(screen.getByLabelText<HTMLButtonElement>("Increase hours (24hr clock)"));

            expect(hourInput.value).toBe("0");
        });
    });
});

function assertTimeIs(hours: string, minutes: string, seconds: string, milliseconds: string) {
    const hourInput = screen.getByLabelText<HTMLInputElement>("hours (24hr clock)");
    const minuteInput = screen.getByLabelText<HTMLInputElement>("minutes");
    const secondInput = screen.getByLabelText<HTMLInputElement>("seconds");
    const millisecondInput = screen.getByLabelText<HTMLInputElement>("milliseconds");

    expect(hourInput.value).toBe(hours);
    expect(minuteInput.value).toBe(minutes);
    expect(secondInput.value).toBe(seconds);
    expect(millisecondInput.value).toBe(milliseconds);
}
