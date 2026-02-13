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

import { mount, type ReactWrapper } from "enzyme";

import { afterEach, beforeEach, describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Handle, type HandleState, type InternalHandleProps } from "./handle";
import { DRAG_SIZE, simulateMovement } from "./sliderTestUtils";

const HANDLE_PROPS: InternalHandleProps = {
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
    let containerElement: HTMLElement;

    beforeEach(() => {
        // need an element in the document for tickSize to be a real number
        containerElement = document.createElement("div");
        document.body.appendChild(containerElement);
    });

    afterEach(() => containerElement.remove());

    it("disabled handle never invokes event handlers", () => {
        const eventSpy = vi.fn();
        const handle = mountHandle(0, { disabled: true, onChange: eventSpy, onRelease: eventSpy });
        simulateMovement(handle, { dragTimes: 3 });
        handle.simulate("keydown", { key: "ArrowUp" });
        expect(eventSpy).not.toHaveBeenCalled();
    });

    describe("keyboard events", () => {
        it("pressing arrow key down reduces value by stepSize", () => {
            const onChange = vi.fn();
            mountHandle(3, { onChange, stepSize: 2 }).simulate("keydown", { key: "ArrowDown" });
            expect(onChange).toHaveBeenCalledWith(1);
        });

        it("pressing arrow key up increases value by stepSize", () => {
            const onChange = vi.fn();
            mountHandle(3, { onChange, stepSize: 4 }).simulate("keydown", { key: "ArrowUp" });
            expect(onChange).toHaveBeenCalledWith(7);
        });

        it("releasing arrow key calls onRelease with value", () => {
            const onRelease = vi.fn();
            mountHandle(3, { onRelease, stepSize: 4 })
                .simulate("keydown", { key: "ArrowUp" })
                .simulate("keyup", { key: "ArrowUp" });
            expect(onRelease).toHaveBeenCalledWith(3);
        });
    });

    [false, true].forEach(vertical => {
        [false, true].forEach(touch => {
            describe(`${vertical ? "vertical " : ""}${touch ? "touch" : "mouse"} events`, () => {
                const options = { touch, vertical, verticalHeight: 0 };
                it("onChange is invoked each time movement changes value", () => {
                    const onChange = vi.fn();
                    simulateMovement(mountHandle(0, { onChange, vertical }), {
                        dragTimes: 3,
                        ...options,
                    });
                    expect(onChange).toHaveBeenCalledTimes(3);
                    expect(onChange.mock.calls).toEqual([[1], [2], [3]]);
                });

                it("onChange is not invoked if new value === props.value", () => {
                    const onChange = vi.fn();
                    // move around same value
                    simulateMovement(mountHandle(0, { onChange, vertical }), {
                        dragSize: 0.1,
                        dragTimes: 4,
                        ...options,
                    });
                    expect(onChange).not.toHaveBeenCalled();
                });

                it("onRelease is invoked once on mouseup", () => {
                    const onRelease = vi.fn();
                    simulateMovement(mountHandle(0, { onRelease, vertical }), {
                        dragTimes: 3,
                        ...options,
                    });
                    expect(onRelease).toHaveBeenCalledExactlyOnceWith(3);
                });

                it("onRelease is invoked if new value === props.value", () => {
                    const onRelease = vi.fn();
                    simulateMovement(mountHandle(0, { onRelease, vertical }), {
                        dragTimes: 0,
                        ...options,
                    });
                    expect(onRelease).toHaveBeenCalledExactlyOnceWith(0);
                });
            });
        });
    });

    function mountHandle(
        value: number,
        props: Partial<InternalHandleProps> = {},
    ): ReactWrapper<InternalHandleProps, HandleState> {
        return mount(<Handle {...HANDLE_PROPS} label={value.toString()} value={value} {...props} />, {
            attachTo: containerElement,
        });
    }
});
