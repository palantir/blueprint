/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { assert } from "chai";
import { mount, ReactWrapper } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";

import { ARROW_DOWN, ARROW_UP } from "../../src/common/keys";
import { Handle, IHandleProps, IHandleState } from "../../src/components/slider/handle";
import { DRAG_SIZE, simulateMovement } from "./sliderTestUtils";

type HandleWrapper = ReactWrapper<IHandleProps, IHandleState>;

const HANDLE_PROPS: IHandleProps = {
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

    [false, true].map(touch => {
        describe(`${touch ? "touch" : "mouse"} events`, () => {
            it("onChange is invoked each time movement changes value", () => {
                const onChange = sinon.spy();
                simulateMovement(mountHandle(0, { onChange }), { dragTimes: 3, touch });
                assert.strictEqual(onChange.callCount, 3);
                assert.deepEqual(onChange.args, [[1], [2], [3]]);
            });

            it("onChange is not invoked if new value === props.value", () => {
                const onChange = sinon.spy();
                // move around same value
                simulateMovement(mountHandle(0, { onChange }), { dragSize: 1, dragTimes: 4, touch });
                assert.strictEqual(onChange.callCount, 0);
            });

            it("onRelease is invoked once on mouseup", () => {
                const onRelease = sinon.spy();
                simulateMovement(mountHandle(0, { onRelease }), { dragTimes: 3, touch });
                assert.strictEqual(onRelease.callCount, 1);
                assert.isTrue(onRelease.calledWithExactly(3));
            });

            it("onRelease is invoked if new value === props.value", () => {
                const onRelease = sinon.spy();
                simulateMovement(mountHandle(0, { onRelease }), { dragTimes: 0, touch });
                assert.strictEqual(onRelease.callCount, 1);
                assert.isTrue(onRelease.calledWithExactly(0));
            });
        });
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

    it("disabled handle never invokes event handlers", () => {
        const eventSpy = sinon.spy();
        const handle = mountHandle(0, { disabled: true, onChange: eventSpy, onRelease: eventSpy });
        simulateMovement(handle, { dragTimes: 3 });
        handle.simulate("keydown", { which: ARROW_UP });
        assert.isTrue(eventSpy.notCalled);
    });

    function mountHandle(value: number, props: Partial<IHandleProps> = {}): HandleWrapper {
        return mount(<Handle {...HANDLE_PROPS} label={value} value={value} {...props} />, {
            attachTo: testsContainerElement,
        });
    }
});
