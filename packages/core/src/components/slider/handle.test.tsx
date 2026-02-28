/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
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

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Handle, type InternalHandleProps } from "./handle";
import { DRAG_SIZE, simulateMovement } from "./sliderTestUtils";

const DEFAULT_PROPS: InternalHandleProps = {
    disabled: false,
    label: "",
    max: 10,
    min: 0,
    stepSize: 1,
    tickSize: DRAG_SIZE,
    tickSizeRatio: 0.1,
    value: 0,
    vertical: false,
};

describe("<Handle>", () => {
    it("disabled handle never invokes event handlers", async () => {
        const user = userEvent.setup();
        const eventSpy = vi.fn();
        render(<Handle {...DEFAULT_PROPS} disabled={true} onChange={eventSpy} onRelease={eventSpy} />);
        const handle = screen.getByRole("slider");
        simulateMovement(handle, { dragTimes: 3 });
        await user.type(handle, "{ArrowUp}");
        expect(eventSpy).not.toHaveBeenCalled();
    });

    describe("keyboard events", () => {
        it("pressing arrow key down reduces value by stepSize", async () => {
            const user = userEvent.setup();
            const onChange = vi.fn();
            render(<Handle {...DEFAULT_PROPS} label="3" value={3} stepSize={2} onChange={onChange} />);
            const handle = screen.getByRole("slider");
            await user.type(handle, "{ArrowDown}");
            expect(onChange).toHaveBeenCalledWith(1);
        });

        it("pressing arrow key up increases value by stepSize", async () => {
            const user = userEvent.setup();
            const onChange = vi.fn();
            render(<Handle {...DEFAULT_PROPS} label="3" value={3} stepSize={4} onChange={onChange} />);
            const handle = screen.getByRole("slider");
            await user.type(handle, "{ArrowUp}");
            expect(onChange).toHaveBeenCalledWith(7);
        });

        it("releasing arrow key calls onRelease with value", async () => {
            const user = userEvent.setup();
            const onRelease = vi.fn();
            render(<Handle {...DEFAULT_PROPS} label="3" value={3} stepSize={4} onRelease={onRelease} />);
            const handle = screen.getByRole("slider");
            await user.type(handle, "{ArrowUp}");
            expect(onRelease).toHaveBeenCalledWith(3);
        });
    });

    [false, true].forEach(vertical => {
        [false, true].forEach(touch => {
            describe(`${vertical ? "vertical " : ""}${touch ? "touch" : "mouse"} events`, () => {
                const options = { touch, vertical, verticalHeight: 0 };
                it("onChange is invoked each time movement changes value", () => {
                    const onChange = vi.fn();
                    render(<Handle {...DEFAULT_PROPS} label="0" value={0} vertical={vertical} onChange={onChange} />);
                    const handle = screen.getByRole("slider");
                    simulateMovement(handle, { dragTimes: 3, ...options });
                    expect(onChange).toHaveBeenCalledTimes(3);
                    expect(onChange.mock.calls).toEqual([[1], [2], [3]]);
                });

                it("onChange is not invoked if new value === props.value", () => {
                    const onChange = vi.fn();
                    render(<Handle {...DEFAULT_PROPS} label="0" value={0} vertical={vertical} onChange={onChange} />);
                    const handle = screen.getByRole("slider");
                    // move around same value
                    simulateMovement(handle, { dragSize: 0.1, dragTimes: 4, ...options });
                    expect(onChange).not.toHaveBeenCalled();
                });

                it("onRelease is invoked once on mouseup", () => {
                    const onRelease = vi.fn();
                    render(<Handle {...DEFAULT_PROPS} label="0" value={0} vertical={vertical} onRelease={onRelease} />);
                    simulateMovement(screen.getByRole("slider"), { dragTimes: 3, ...options });
                    expect(onRelease).toHaveBeenCalledExactlyOnceWith(3);
                });

                it("onRelease is invoked if new value === props.value", () => {
                    const onRelease = vi.fn();
                    render(<Handle {...DEFAULT_PROPS} label="0" value={0} vertical={vertical} onRelease={onRelease} />);
                    simulateMovement(screen.getByRole("slider"), { dragTimes: 0, ...options });
                    expect(onRelease).toHaveBeenCalledExactlyOnceWith(0);
                });
            });
        });
    });
});
