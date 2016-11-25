/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { assert } from "chai";
import { mount } from "enzyme";
import * as React from "react";

import * as Keys from "../../src/common/keys";
import { Handle } from "../../src/components/slider/handle";
import { RangeSlider } from "../../src/index";
import { dispatchMouseEvent } from "../common/utils";

describe("<RangeSlider>", () => {
    let testsContainerElement: HTMLElement;

    beforeEach(() => {
        // need an element in the document for tickSize to be a real number
        testsContainerElement = document.createElement("div");
        document.body.appendChild(testsContainerElement);
    });

    afterEach(() => testsContainerElement.remove());

    it("throws error if range value contains null", () => {
        assert.throws(() => renderSlider(<RangeSlider value={[null, 5]} />));
        assert.throws(() => renderSlider(<RangeSlider value={[100, null]} />));
    });

    it("moving mouse on left handle updates first value in range", () => {
        const changeSpy = sinon.spy();
        const slider = renderSlider(<RangeSlider onChange={changeSpy} />);
        slider.find(Handle).first().simulate("mousedown", { clientX: 0 });
        mouseMove(slider.state("tickSize"), 5);
        // called 4 times, for the move to 1, 2, 3, and 4
        assert.equal(changeSpy.callCount, 4);
        assert.deepEqual(changeSpy.args.map((arg) => arg[0]), [[1, 10], [2, 10], [3, 10], [4, 10]]);
    });

    it("moving mouse on right handle updates second value in range", () => {
        const changeSpy = sinon.spy();
        const slider = renderSlider(<RangeSlider onChange={changeSpy} />);
        const tickSize = slider.state("tickSize");
        slider.find(Handle).last().simulate("mousedown", { clientX: tickSize * 10 });
        // move leftwards because it defaults to the max value
        mouseMove(-tickSize, 5, tickSize * 10);
        // called 4 times, for the move to 9, 8, 7, and 6
        assert.equal(changeSpy.callCount, 4);
        assert.deepEqual(changeSpy.args.map((arg) => arg[0]), [[0, 9], [0, 8], [0, 7], [0, 6]]);
    });

    it("releasing mouse calls onRelease with nearest value", () => {
        const releaseSpy = sinon.spy();
        const slider = renderSlider(<RangeSlider onRelease={releaseSpy} />);
        slider.find(Handle).last().simulate("mousedown", { clientX: 0 });
        mouseUp(slider.state("tickSize") * 4);
        assert.isTrue(releaseSpy.calledOnce, "onRelease not called exactly once");
        assert.deepEqual(releaseSpy.args[0][0], [0, 4]);
    });

    it("releasing mouse on same value calls onRelease but not onChange", () => {
        const releaseSpy = sinon.spy();
        const changeSpy = sinon.spy();
        renderSlider(<RangeSlider onChange={changeSpy} onRelease={releaseSpy} />)
            .find(Handle).first()
            .simulate("mousedown", { clientX: 0 });
        mouseUp();
        assert.isTrue(releaseSpy.calledOnce, "onRelease not called exactly once");
        assert.deepEqual(releaseSpy.args[0][0], [0, 10]);
        assert.isTrue(changeSpy.notCalled, "onChange was called when value hasn't changed");
    });

    it("disabled slider does not respond to mouse movement", () => {
        const changeSpy = sinon.spy();
        const slider = renderSlider(<RangeSlider disabled={true} onChange={changeSpy} />);
        slider.find(Handle).first().simulate("mousedown", { clientX: 0 });
        mouseMove(slider.state("tickSize"), 5);
        assert.isTrue(changeSpy.notCalled, "onChange was called when disabled");
    });

    it("disabled slider does not respond to key presses", () => {
        const changeSpy = sinon.spy();
        const handles = renderSlider(<RangeSlider disabled={true} onChange={changeSpy} />).find(Handle);
        handles.first().simulate("keydown", { which: Keys.ARROW_DOWN });
        handles.last().simulate("keydown", { which: Keys.ARROW_DOWN });
        assert.isTrue(changeSpy.notCalled, "onChange was called when disabled");
    });

    function renderSlider(slider: JSX.Element) {
        return mount(slider, { attachTo: testsContainerElement });
    }

    function mouseMove(movement: number, times = 1, initialValue = 0) {
        for (let x = 0; x < times; x += 1) {
            dispatchMouseEvent(document, "mousemove", initialValue + x * movement);
        }
    }

    function mouseUp(clientX = 0) {
        dispatchMouseEvent(document, "mouseup", clientX);
    }
});
