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

import { assert } from "chai";
import { mount, ReactWrapper } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";

import { ARROW_DOWN, ARROW_UP } from "../../src/common/keys";
import { Handle, IHandleState, IInternalHandleProps } from "../../src/components/slider/handle";
import { DRAG_SIZE, simulateMovement } from "./sliderTestUtils";

const HANDLE_PROPS: IInternalHandleProps = {
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
    let testsContainerElement: HTMLElement;

    beforeEach(() => {
        // need an element in the document for tickSize to be a real number
        testsContainerElement = document.createElement("div");
        document.body.appendChild(testsContainerElement);
    });

    afterEach(() => testsContainerElement.remove());

    it("disabled handle never invokes event handlers", () => {
        const eventSpy = sinon.spy();
        const handle = mountHandle(0, { disabled: true, onChange: eventSpy, onRelease: eventSpy });
        simulateMovement(handle, { dragTimes: 3 });
        handle.simulate("keydown", { which: ARROW_UP });
        assert.isTrue(eventSpy.notCalled);
    });

    describe("keyboard events", () => {
        it("pressing arrow key down reduces value by stepSize", () => {
            const onChange = sinon.spy();
            mountHandle(3, { onChange, stepSize: 2 }).simulate("keydown", { which: ARROW_DOWN });
            assert.isTrue(onChange.calledWithExactly(1));
        });

        it("pressing arrow key up increases value by stepSize", () => {
            const onChange = sinon.spy();
            mountHandle(3, { onChange, stepSize: 4 }).simulate("keydown", { which: ARROW_UP });
            assert.isTrue(onChange.calledWithExactly(7));
        });

        it("releasing arrow key calls onRelease with value", () => {
            const onRelease = sinon.spy();
            mountHandle(3, { onRelease, stepSize: 4 })
                .simulate("keydown", { which: ARROW_UP })
                .simulate("keyup", { which: ARROW_UP });
            assert.isTrue(onRelease.calledWithExactly(3));
        });
    });

    [false, true].forEach(vertical => {
        [false, true].forEach(touch => {
            describe(`${vertical ? "vertical " : ""}${touch ? "touch" : "mouse"} events`, () => {
                const options = { touch, vertical, verticalHeight: 0 };
                it("onChange is invoked each time movement changes value", () => {
                    const onChange = sinon.spy();
                    simulateMovement(mountHandle(0, { onChange, vertical }), { dragTimes: 3, ...options });
                    assert.strictEqual(onChange.callCount, 3);
                    assert.deepEqual(onChange.args, [[1], [2], [3]]);
                });

                it("onChange is not invoked if new value === props.value", () => {
                    const onChange = sinon.spy();
                    // move around same value
                    simulateMovement(mountHandle(0, { onChange, vertical }), {
                        dragSize: 0.1,
                        dragTimes: 4,
                        ...options,
                    });
                    assert.strictEqual(onChange.callCount, 0);
                });

                it("onRelease is invoked once on mouseup", () => {
                    const onRelease = sinon.spy();
                    simulateMovement(mountHandle(0, { onRelease, vertical }), { dragTimes: 3, ...options });
                    assert.strictEqual(onRelease.callCount, 1);
                    assert.strictEqual(onRelease.args[0][0], 3);
                });

                it("onRelease is invoked if new value === props.value", () => {
                    const onRelease = sinon.spy();
                    simulateMovement(mountHandle(0, { onRelease, vertical }), { dragTimes: 0, ...options });
                    assert.strictEqual(onRelease.callCount, 1);
                    assert.isTrue(onRelease.calledWithExactly(0));
                });
            });
        });
    });

    function mountHandle(
        value: number,
        props: Partial<IInternalHandleProps> = {},
    ): ReactWrapper<IInternalHandleProps, IHandleState> {
        return mount(<Handle {...HANDLE_PROPS} label={value} value={value} {...props} />, {
            attachTo: testsContainerElement,
        });
    }
});
