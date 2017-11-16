/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { assert } from "chai";
import { mount, ReactWrapper } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";

import * as Keys from "../../src/common/keys";
import { Handle } from "../../src/components/slider/handle";
import { Classes, ISliderProps, RangeSlider } from "../../src/index";
import { dispatchMouseEvent, dispatchTouchEvent } from "../common/utils";

describe("<RangeSlider>", () => {
    let testsContainerElement: HTMLElement;

    beforeEach(() => {
        // need an element in the document for tickSize to be a real number
        testsContainerElement = document.createElement("div");
        document.body.appendChild(testsContainerElement);
    });

    afterEach(() => testsContainerElement.remove());

    it("does not render progress bar if handles are equal", () => {
        const slider = renderSlider(<RangeSlider value={[4, 4]} />);
        assert.isFalse(slider.find(`.${Classes.SLIDER}-progress`).exists());
    });

    it("throws error if range value contains null", () => {
        assert.throws(() => renderSlider(<RangeSlider value={[null, 5]} />));
        assert.throws(() => renderSlider(<RangeSlider value={[100, null]} />));
    });

    it("moving mouse on left handle updates first value in range", () => {
        const changeSpy = sinon.spy();
        const slider = renderSlider(<RangeSlider onChange={changeSpy} />);
        slider
            .find(Handle)
            .first()
            .simulate("mousedown", { clientX: 0 });
        mouseMoveHorizontal(slider.state("tickSize"), 5);
        // called 4 times, for the move to 1, 2, 3, and 4
        assert.equal(changeSpy.callCount, 4);
        assert.deepEqual(changeSpy.args.map(arg => arg[0]), [[1, 10], [2, 10], [3, 10], [4, 10]]);
    });

    it("moving touch on left handle updates first value in range", () => {
        const changeSpy = sinon.spy();
        const slider = renderSlider(<RangeSlider onChange={changeSpy} />);
        slider
            .find(Handle)
            .first()
            .simulate("touchstart", { changedTouches: [{ clientX: 0 }] });
        touchMoveHorizontal(slider.state("tickSize"), 5);
        // called 4 times, for the move to 1, 2, 3, and 4
        assert.equal(changeSpy.callCount, 4);
        assert.deepEqual(changeSpy.args.map(arg => arg[0]), [[1, 10], [2, 10], [3, 10], [4, 10]]);
    });

    it("moving mouse on right handle updates second value in range", () => {
        const changeSpy = sinon.spy();
        const slider = renderSlider(<RangeSlider onChange={changeSpy} />);
        const tickSize = slider.state("tickSize");
        slider
            .find(Handle)
            .last()
            .simulate("mousedown", { clientX: tickSize * 10 });
        // move leftwards because it defaults to the max value
        mouseMoveHorizontal(-tickSize, 5, tickSize * 10);
        // called 4 times, for the move to 9, 8, 7, and 6
        assert.equal(changeSpy.callCount, 4);
        assert.deepEqual(changeSpy.args.map(arg => arg[0]), [[0, 9], [0, 8], [0, 7], [0, 6]]);
    });

    it("moving touch on right handle updates second value in range", () => {
        const changeSpy = sinon.spy();
        const slider = renderSlider(<RangeSlider onChange={changeSpy} />);
        const tickSize = slider.state("tickSize");
        slider
            .find(Handle)
            .last()
            .simulate("touchstart", { changedTouches: [{ clientX: tickSize * 10 }] });
        // move leftwards because it defaults to the max value
        touchMoveHorizontal(-tickSize, 5, tickSize * 10);
        // called 4 times, for the move to 9, 8, 7, and 6
        assert.equal(changeSpy.callCount, 4);
        assert.deepEqual(changeSpy.args.map(arg => arg[0]), [[0, 9], [0, 8], [0, 7], [0, 6]]);
    });

    it("releasing mouse on a track value closer to the lower handle, moves the lower handle", () => {
        const changeSpy = sinon.spy();
        const slider = renderSlider(<RangeSlider onChange={changeSpy} />);
        const tickSize = slider.state("tickSize");
        const NEXT_LOW_VALUE = 1;
        slider.find(`.${Classes.SLIDER}`).simulate("mousedown", { clientX: tickSize * NEXT_LOW_VALUE });
        assert.equal(changeSpy.callCount, 1);
        assert.deepEqual(changeSpy.firstCall.args[0], [NEXT_LOW_VALUE, 10]);
    });

    it("releasing mouse on a track value closer to the upper handle, moves the upper handle", () => {
        const changeSpy = sinon.spy();
        const slider = renderSlider(<RangeSlider onChange={changeSpy} />);
        const tickSize = slider.state("tickSize");
        const NEXT_HIGH_VALUE = 9;
        slider.find(`.${Classes.SLIDER}`).simulate("mousedown", { clientX: tickSize * NEXT_HIGH_VALUE });
        assert.equal(changeSpy.callCount, 1);
        assert.deepEqual(changeSpy.firstCall.args[0], [0, NEXT_HIGH_VALUE]);
    });

    it("releasing mouse calls onRelease with nearest value", () => {
        const releaseSpy = sinon.spy();
        const slider = renderSlider(<RangeSlider onRelease={releaseSpy} />);
        slider
            .find(Handle)
            .last()
            .simulate("mousedown", { clientX: 0 });
        mouseUpHorizontal(slider.state("tickSize") * 4);
        assert.isTrue(releaseSpy.calledOnce, "onRelease not called exactly once");
        assert.deepEqual(releaseSpy.args[0][0], [0, 4]);
    });

    it("releasing touch calls onRelease with nearest value", () => {
        const releaseSpy = sinon.spy();
        const slider = renderSlider(<RangeSlider onRelease={releaseSpy} />);
        slider
            .find(Handle)
            .last()
            .simulate("touchstart", { changedTouches: [{ clientX: 0 }] });
        touchEndHorizontal(slider.state("tickSize") * 4);
        assert.isTrue(releaseSpy.calledOnce, "onRelease not called exactly once");
        assert.deepEqual(releaseSpy.args[0][0], [0, 4]);
    });

    it("releasing mouse on same value calls onRelease but not onChange", () => {
        const releaseSpy = sinon.spy();
        const changeSpy = sinon.spy();
        renderSlider(<RangeSlider onChange={changeSpy} onRelease={releaseSpy} />)
            .find(Handle)
            .first()
            .simulate("mousedown", { clientX: 0 });
        mouseUpHorizontal();
        assert.isTrue(releaseSpy.calledOnce, "onRelease not called exactly once");
        assert.deepEqual(releaseSpy.args[0][0], [0, 10]);
        assert.isTrue(changeSpy.notCalled, "onChange was called when value hasn't changed");
    });

    it("releasing touch on same value calls onRelease but not onChange", () => {
        const releaseSpy = sinon.spy();
        const changeSpy = sinon.spy();
        renderSlider(<RangeSlider onChange={changeSpy} onRelease={releaseSpy} />)
            .find(Handle)
            .first()
            .simulate("touchstart", { changedTouches: [{ clientX: 0 }] });
        touchEndHorizontal();
        assert.isTrue(releaseSpy.calledOnce, "onRelease not called exactly once");
        assert.deepEqual(releaseSpy.args[0][0], [0, 10]);
        assert.isTrue(changeSpy.notCalled, "onChange was called when value hasn't changed");
    });

    it("disabled slider does not respond to mouse movement", () => {
        const changeSpy = sinon.spy();
        const slider = renderSlider(<RangeSlider disabled={true} onChange={changeSpy} />);
        slider
            .find(Handle)
            .first()
            .simulate("mousedown", { clientX: 0 });
        mouseMoveHorizontal(slider.state("tickSize"), 5);
        assert.isTrue(changeSpy.notCalled, "onChange was called when disabled");
    });

    it("disabled slider does not respond to touch movement", () => {
        const changeSpy = sinon.spy();
        const slider = renderSlider(<RangeSlider disabled={true} onChange={changeSpy} />);
        slider
            .find(Handle)
            .first()
            .simulate("touchstart", { changedTouches: [{ clientX: 0 }] });
        touchMoveHorizontal(slider.state("tickSize"), 5);
        assert.isTrue(changeSpy.notCalled, "onChange was called when disabled");
    });

    it("disabled slider does not respond to key presses", () => {
        const changeSpy = sinon.spy();
        const handles = renderSlider(<RangeSlider disabled={true} onChange={changeSpy} />).find(Handle);
        handles.first().simulate("keydown", { which: Keys.ARROW_DOWN });
        handles.last().simulate("keydown", { which: Keys.ARROW_DOWN });
        assert.isTrue(changeSpy.notCalled, "onChange was called when disabled");
    });

    it("when values are equal, releasing mouse on a track still moves the nearest handle", () => {
        const NEXT_LOW_VALUE = 1;
        const NEXT_HIGH_VALUE = 9;
        const VALUE = 5;

        const changeSpy = sinon.spy();
        const slider = renderSlider(<RangeSlider onChange={changeSpy} value={[VALUE, VALUE]} />);
        const tickSize = slider.state("tickSize");

        slider.find(`.${Classes.SLIDER}`).simulate("mousedown", { clientX: tickSize * NEXT_LOW_VALUE });
        assert.equal(changeSpy.callCount, 1, "lower handle invokes onChange");
        assert.deepEqual(changeSpy.firstCall.args[0], [NEXT_LOW_VALUE, VALUE], "lower handle moves");
        changeSpy.reset();

        slider.find(`.${Classes.SLIDER}`).simulate("mousedown", { clientX: tickSize * NEXT_HIGH_VALUE });
        assert.equal(changeSpy.callCount, 1, "higher handle invokes onChange");
        assert.deepEqual(changeSpy.firstCall.args[0], [VALUE, NEXT_HIGH_VALUE], "higher handle moves");
    });

    describe("vertical orientation", () => {
        let changeSpy: sinon.SinonSpy;
        let releaseSpy: sinon.SinonSpy;

        before(() => {
            changeSpy = sinon.spy();
            releaseSpy = sinon.spy();
        });

        afterEach(() => {
            changeSpy.reset();
            releaseSpy.reset();
        });

        it("moving mouse on bottom handle updates first value in range", () => {
            const slider = renderSlider(<RangeSlider vertical={true} onChange={changeSpy} />);
            const sliderBottom = getSliderBottomPixel(slider);

            slider
                .find(Handle)
                .first()
                .simulate("mousedown", { clientY: sliderBottom });
            mouseMoveVertical(slider.state("tickSize"), 5, 0, sliderBottom);

            // called 4 times, for the move to 1, 2, 3, and 4
            assert.equal(changeSpy.callCount, 4);
            assert.deepEqual(changeSpy.args.map(arg => arg[0]), [[1, 10], [2, 10], [3, 10], [4, 10]]);
        });

        it("moving touch on bottom handle updates first value in range", () => {
            const slider = renderSlider(<RangeSlider vertical={true} onChange={changeSpy} />);
            const sliderBottom = getSliderBottomPixel(slider);

            slider
                .find(Handle)
                .first()
                .simulate("touchstart", { changedTouches: [{ clientY: sliderBottom }] });
            touchMoveVertical(slider.state("tickSize"), 5, 0, sliderBottom);

            // called 4 times, for the move to 1, 2, 3, and 4
            assert.equal(changeSpy.callCount, 4);
            assert.deepEqual(changeSpy.args.map(arg => arg[0]), [[1, 10], [2, 10], [3, 10], [4, 10]]);
        });

        it("moving mouse on top handle updates second value in range", () => {
            const slider = renderSlider(<RangeSlider vertical={true} onChange={changeSpy} />);
            const tickSize = slider.state("tickSize");
            const sliderTop = getSliderTopPixel(slider);
            const sliderBottom = getSliderBottomPixel(slider);

            // const FUDGE_FACTOR = 10;
            slider
                .find(Handle)
                .last()
                .simulate("mousedown", { clientY: sliderTop });
            // move downwards because it defaults to the max value
            mouseMoveVertical(-tickSize, 5, tickSize * 10, sliderBottom);

            // called 4 times, for the move to 9, 8, 7, and 6
            assert.equal(changeSpy.callCount, 4);
            assert.deepEqual(changeSpy.args.map(arg => arg[0]), [[0, 9], [0, 8], [0, 7], [0, 6]]);
        });

        it("moving touch on top handle updates second value in range", () => {
            const slider = renderSlider(<RangeSlider vertical={true} onChange={changeSpy} />);
            const tickSize = slider.state("tickSize");
            const sliderTop = getSliderTopPixel(slider);
            const sliderBottom = getSliderBottomPixel(slider);

            slider
                .find(Handle)
                .last()
                .simulate("touchstart", { changedTouches: [{ clientY: sliderTop }] });
            // move downwards because it defaults to the max value
            touchMoveVertical(-tickSize, 5, tickSize * 10, sliderBottom);

            // called 4 times, for the move to 9, 8, 7, and 6
            assert.equal(changeSpy.callCount, 4);
            assert.deepEqual(changeSpy.args.map(arg => arg[0]), [[0, 9], [0, 8], [0, 7], [0, 6]]);
        });

        it("releasing mouse calls onRelease with nearest value", () => {
            const slider = renderSlider(<RangeSlider vertical={true} onRelease={releaseSpy} />);
            const sliderBottom = getSliderBottomPixel(slider);

            slider
                .find(Handle)
                .last()
                .simulate("mousedown", { clientY: sliderBottom });
            mouseUpVertical(sliderBottom - slider.state("tickSize") * 4);

            assert.isTrue(releaseSpy.calledOnce, "onRelease not called exactly once");
            assert.deepEqual(releaseSpy.args[0][0], [0, 4]);
        });

        it("releasing touch calls onRelease with nearest value", () => {
            const slider = renderSlider(<RangeSlider vertical={true} onRelease={releaseSpy} />);
            const sliderBottom = getSliderBottomPixel(slider);

            slider
                .find(Handle)
                .last()
                .simulate("touchstart", { changedTouches: [{ clientY: sliderBottom }] });
            touchEndVertical(sliderBottom - slider.state("tickSize") * 4);

            assert.isTrue(releaseSpy.calledOnce, "onRelease not called exactly once");
            assert.deepEqual(releaseSpy.args[0][0], [0, 4]);
        });
    });

    function renderSlider(slider: JSX.Element) {
        return mount(slider, { attachTo: testsContainerElement });
    }

    function mouseMoveHorizontal(movement: number, times = 1, initialValue = 0) {
        genericMoveHorizontal(movement, times, initialValue, "mousemove");
    }

    function mouseMoveVertical(movement: number, times: number, initialValue: number, sliderBottom: number) {
        genericMoveVertical(movement, times, initialValue, sliderBottom, "mousemove");
    }

    function mouseUpHorizontal(clientX = 0) {
        dispatchMouseEvent(document, "mouseup", clientX, undefined);
    }

    function mouseUpVertical(clientY = 0) {
        dispatchMouseEvent(document, "mouseup", undefined, clientY);
    }

    function touchMoveHorizontal(movement: number, times = 1, initialValue = 0) {
        genericMoveHorizontal(movement, times, initialValue, "touchmove");
    }

    function touchMoveVertical(movement: number, times = 1, initialValue = 0, sliderBottom: number) {
        genericMoveVertical(movement, times, initialValue, sliderBottom, "touchmove");
    }

    function genericMoveHorizontal(
        movement: number,
        times: number,
        initialValue: number,
        eventType: "mousemove" | "touchmove",
    ) {
        const dispatchEventFn = getDispatchEventFn(eventType);
        for (let x = 0; x < times; x += 1) {
            dispatchEventFn(document, eventType, initialValue + x * movement, undefined);
        }
    }

    function genericMoveVertical(
        movement: number,
        times: number,
        initialValue: number,
        sliderBottom: number,
        eventType: "mousemove" | "touchmove",
    ) {
        const dispatchEventFn = getDispatchEventFn(eventType);
        for (let i = 0; i < times; i += 1) {
            const clientPixel = sliderBottom - (initialValue + i * movement);
            dispatchEventFn(document, eventType, undefined, clientPixel);
        }
    }

    function touchEndHorizontal(clientX = 0) {
        dispatchTouchEvent(document, "touchend", clientX, undefined);
    }

    function touchEndVertical(clientY = 0) {
        dispatchTouchEvent(document, "touchend", undefined, clientY);
    }

    function getDispatchEventFn(eventType: "mousemove" | "touchmove") {
        return eventType === "touchmove" ? dispatchTouchEvent : dispatchMouseEvent;
    }

    function getSliderTopPixel(slider: ReactWrapper<ISliderProps, any>) {
        return slider.getDOMNode().getBoundingClientRect().top;
    }

    function getSliderBottomPixel(slider: ReactWrapper<ISliderProps, any>) {
        const { height, top } = slider.getDOMNode().getBoundingClientRect();
        return height + top;
    }
});
