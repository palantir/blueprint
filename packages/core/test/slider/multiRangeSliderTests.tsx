/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 * 
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { assert } from "chai";
import { mount } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";

import { expectPropValidationError } from "@blueprintjs/test-commons";
import { Classes, IMultiRangeSliderProps, MultiRangeSlider, SliderHandle } from "../../src";
import * as Keys from "../../src/common/keys";
import { Handle } from "../../src/components/slider/handle";
import * as Utils from "./sliderTestUtils";

describe("<MultiRangeSlider>", () => {
    let testsContainerElement: HTMLElement;

    let onChange: sinon.SinonSpy;
    let onRelease: sinon.SinonSpy;

    beforeEach(() => {
        // need an element in the document for tickSize to be a real number
        testsContainerElement = document.createElement("div");
        document.body.appendChild(testsContainerElement);

        onChange = sinon.spy();
        onRelease = sinon.spy();
    });

    afterEach(() => testsContainerElement.remove());

    it("throws an error if a child is not a slider handle", () => {
        expectPropValidationError(MultiRangeSlider, { children: <span>Bad</span> as any });
    });

    it("progress bars are rendered between all handles", () => {
        const slider = renderSlider({ values: [3, 5, 7] });
        assert.lengthOf(slider.find(`.${Classes.SLIDER_PROGRESS}`), 4);
    });

    it("progress bars are not rendered between handles with equal values", () => {
        const slider = renderSlider({ values: [3, 5, 5] });
        assert.lengthOf(slider.find(`.${Classes.SLIDER_PROGRESS}`), 3);
    });

    it("handle values are automatically sorted", () => {
        const slider = renderSlider({ values: [5, 10, 0], onRelease });
        slider
            .find(Handle)
            .first()
            .simulate("mousedown", { clientX: 0 });
        Utils.mouseUpHorizontal();
        assert.equal(onRelease.callCount, 1);
        assert.deepEqual(onRelease.firstCall.args[0], [0, 5, 10]);
    });

    it("moving mouse on the first handle updates the first value", () => {
        const slider = renderSlider({ onChange });
        slider
            .find(Handle)
            .first()
            .simulate("mousedown", { clientX: 0 });
        Utils.mouseMoveHorizontal(slider.state("tickSize"), 5);
        // called 3 times for the move to 1, 2, 3, and 4
        assert.equal(onChange.callCount, 4);
        assert.deepEqual(onChange.args.map(arg => arg[0]), [[1, 5, 10], [2, 5, 10], [3, 5, 10], [4, 5, 10]]);
    });

    it("moving touch on the first handle updates the first value", () => {
        const slider = renderSlider({ onChange });
        slider
            .find(Handle)
            .first()
            .simulate("touchstart", { changedTouches: [{ clientX: 0 }] });
        Utils.touchMoveHorizontal(slider.state("tickSize"), 5);
        // called 3 times for the move to 1, 2, 3, and 4
        assert.equal(onChange.callCount, 4);
        assert.deepEqual(onChange.args.map(arg => arg[0]), [[1, 5, 10], [2, 5, 10], [3, 5, 10], [4, 5, 10]]);
    });

    it("moving mouse on the middle handle updates the middle value", () => {
        const slider = renderSlider({ onChange });
        const tickSize = slider.state("tickSize");
        slider
            .find(Handle)
            .at(1)
            .simulate("mousedown", { clientX: tickSize * 5 });
        Utils.mouseMoveHorizontal(tickSize, 5, tickSize * 5);
        // called 3 times for the move to 6, 7, 8, and 9
        assert.equal(onChange.callCount, 4);
        assert.deepEqual(onChange.args.map(arg => arg[0]), [[0, 6, 10], [0, 7, 10], [0, 8, 10], [0, 9, 10]]);
    });

    it("moving touch on the middle handle updates the middle value", () => {
        const slider = renderSlider({ onChange });
        const tickSize = slider.state("tickSize");
        slider
            .find(Handle)
            .at(1)
            .simulate("touchstart", { changedTouches: [{ clientX: tickSize * 5 }] });
        Utils.touchMoveHorizontal(tickSize, 5, tickSize * 5);
        // called 3 times for the move to 6, 7, 8, and 9
        assert.equal(onChange.callCount, 4);
        assert.deepEqual(onChange.args.map(arg => arg[0]), [[0, 6, 10], [0, 7, 10], [0, 8, 10], [0, 9, 10]]);
    });

    it("moving mouse on the last handle updates the last value", () => {
        const slider = renderSlider({ onChange });
        const tickSize = slider.state("tickSize");
        slider
            .find(Handle)
            .last()
            .simulate("mousedown", { clientX: tickSize * 10 });
        Utils.mouseMoveHorizontal(-tickSize, 5, tickSize * 10);
        // called 3 times for the move to 9, 8, 7, and 6
        assert.equal(onChange.callCount, 4);
        assert.deepEqual(onChange.args.map(arg => arg[0]), [[0, 5, 9], [0, 5, 8], [0, 5, 7], [0, 5, 6]]);
    });

    it("moving touch on the last handle updates the last value", () => {
        const slider = renderSlider({ onChange });
        const tickSize = slider.state("tickSize");
        slider
            .find(Handle)
            .last()
            .simulate("touchstart", { changedTouches: [{ clientX: tickSize * 10 }] });
        Utils.touchMoveHorizontal(-tickSize, 5, tickSize * 10);
        // called 3 times for the move to 9, 8, 7, and 6
        assert.equal(onChange.callCount, 4);
        assert.deepEqual(onChange.args.map(arg => arg[0]), [[0, 5, 9], [0, 5, 8], [0, 5, 7], [0, 5, 6]]);
    });

    it("releasing mouse on a track value closer to the first handle moves the first handle", () => {
        const slider = renderSlider({ onChange });
        const tickSize = slider.state("tickSize");
        slider.find(`.${Classes.SLIDER}`).simulate("mousedown", { clientX: tickSize });
        assert.equal(onChange.callCount, 1);
        assert.deepEqual(onChange.firstCall.args[0], [1, 5, 10]);
    });

    it("releasing mouse on a track value slightly below the middle handle moves the middle handle", () => {
        const slider = renderSlider({ onChange });
        const tickSize = slider.state("tickSize");
        slider.find(`.${Classes.SLIDER}`).simulate("mousedown", { clientX: tickSize * 4 });
        assert.equal(onChange.callCount, 1);
        assert.deepEqual(onChange.firstCall.args[0], [0, 4, 10]);
    });

    it("releasing mouse on a track value slightly above the middle handle moves the middle handle", () => {
        const slider = renderSlider({ onChange });
        const tickSize = slider.state("tickSize");
        slider.find(`.${Classes.SLIDER}`).simulate("mousedown", { clientX: tickSize * 6 });
        assert.equal(onChange.callCount, 1);
        assert.deepEqual(onChange.firstCall.args[0], [0, 6, 10]);
    });

    it("releasing mouse on a track value closer to the last handle moves the last handle", () => {
        const slider = renderSlider({ onChange });
        const tickSize = slider.state("tickSize");
        slider.find(`.${Classes.SLIDER}`).simulate("mousedown", { clientX: tickSize * 9 });
        assert.equal(onChange.callCount, 1);
        assert.deepEqual(onChange.firstCall.args[0], [0, 5, 9]);
    });

    it("releasing mouse calls onRelease with nearest value", () => {
        const slider = renderSlider({ onRelease });
        slider
            .find(Handle)
            .last()
            .simulate("mousedown", { clientX: 0 });
        Utils.mouseUpHorizontal(slider.state("tickSize") * 9);
        assert.isTrue(onRelease.calledOnce, "onRelease not called exactly once");
        assert.deepEqual(onRelease.firstCall.args[0], [0, 5, 9]);
    });

    it("releasing touch calls onRelease with nearest value", () => {
        const slider = renderSlider({ onRelease });
        slider
            .find(Handle)
            .last()
            .simulate("touchstart", { changedTouches: [{ clientX: 0 }] });
        Utils.touchEndHorizontal(slider.state("tickSize") * 9);
        assert.isTrue(onRelease.calledOnce, "onRelease not called exactly once");
        assert.deepEqual(onRelease.firstCall.args[0], [0, 5, 9]);
    });

    it("releasing mouse on same value calls onRelease but not onChange", () => {
        renderSlider({ onChange, onRelease })
            .find(Handle)
            .first()
            .simulate("mousedown", { clientX: 0 });
        Utils.mouseUpHorizontal();
        assert.isTrue(onRelease.calledOnce, "onRelease not called exactly once");
        assert.deepEqual(onRelease.firstCall.args[0], [0, 5, 10]);
        assert.isTrue(onChange.notCalled, "onChange was called when value hasn't changed");
    });

    it("releasing touch on same value calls onRelease but not onChange", () => {
        renderSlider({ onChange, onRelease })
            .find(Handle)
            .first()
            .simulate("touchstart", { changedTouches: [{ clientX: 0 }] });
        Utils.touchEndHorizontal();
        assert.isTrue(onRelease.calledOnce, "onRelease not called exactly once");
        assert.deepEqual(onRelease.firstCall.args[0], [0, 5, 10]);
        assert.isTrue(onChange.notCalled, "onChange was called when value hasn't changed");
    });

    it("disabled slider does not respond to mouse movement", () => {
        const slider = renderSlider({ disabled: true, onChange });
        slider
            .find(Handle)
            .first()
            .simulate("mousedown", { clientX: 0 });
        Utils.mouseMoveHorizontal(slider.state("tickSize"), 5);
        assert.isTrue(onChange.notCalled, "onChange was called when disabled");
    });

    it("disabled slider does not respond to touch movement", () => {
        const slider = renderSlider({ disabled: true, onChange });
        slider
            .find(Handle)
            .first()
            .simulate("touchstart", { changedTouches: [{ clientX: 0 }] });
        Utils.touchMoveHorizontal(slider.state("tickSize"), 5);
        assert.isTrue(onChange.notCalled, "onChange was called when disabled");
    });

    it("disabled slider does not respond to key presses", () => {
        const handles = renderSlider({ disabled: true, onChange }).find(Handle);
        handles.first().simulate("keydown", { which: Keys.ARROW_DOWN });
        handles.last().simulate("keydown", { which: Keys.ARROW_DOWN });
        assert.isTrue(onChange.notCalled, "onChange was called when disabled");
    });

    it("when values are equal, releasing mouse on a track still moves the nearest handle", () => {
        const slider = renderSlider({ values: [5, 5, 7], onChange });
        const tickSize = slider.state("tickSize");

        slider.find(`.${Classes.SLIDER}`).simulate("mousedown", { clientX: tickSize * 1 });
        assert.equal(onChange.callCount, 1, "one lower handle invokes onChange");
        assert.deepEqual(onChange.firstCall.args[0], [1, 5, 7], "one lower handle moves");
        onChange.resetHistory();

        slider.find(`.${Classes.SLIDER}`).simulate("mousedown", { clientX: tickSize * 9 });
        assert.equal(onChange.callCount, 1, "higher handle invokes onChange");
        assert.deepEqual(onChange.firstCall.args[0], [5, 5, 9], "higher handle moves");
    });

    describe("vertical orientation", () => {
        it("moving mouse on bottom handle updates first value", () => {
            const slider = renderSlider({ vertical: true, onChange });
            const sliderBottom = Utils.getSliderBottomPixel(slider);
            slider
                .find(Handle)
                .first()
                .simulate("mousedown", { clientY: sliderBottom });
            Utils.mouseMoveVertical(slider.state("tickSize"), 5, 0, sliderBottom);
            // called 4 times, for the move to 1, 2, 3, and 4
            assert.equal(onChange.callCount, 4);
            assert.deepEqual(onChange.args.map(arg => arg[0]), [[1, 5, 10], [2, 5, 10], [3, 5, 10], [4, 5, 10]]);
        });

        it("moving touch on bottom handle updates first value", () => {
            const slider = renderSlider({ vertical: true, onChange });
            const sliderBottom = Utils.getSliderBottomPixel(slider);
            slider
                .find(Handle)
                .first()
                .simulate("touchstart", { changedTouches: [{ clientY: sliderBottom }] });
            Utils.touchMoveVertical(slider.state("tickSize"), 5, 0, sliderBottom);
            // called 4 times, for the move to 1, 2, 3, and 4
            assert.equal(onChange.callCount, 4);
            assert.deepEqual(onChange.args.map(arg => arg[0]), [[1, 5, 10], [2, 5, 10], [3, 5, 10], [4, 5, 10]]);
        });

        it("moving mouse on middle handle updates middle value", () => {
            const slider = renderSlider({ vertical: true, onChange });
            const tickSize = slider.state("tickSize");
            const sliderBottom = Utils.getSliderBottomPixel(slider);
            slider
                .find(Handle)
                .at(1)
                .simulate("mousedown", { clientY: sliderBottom - 5 * tickSize });
            Utils.mouseMoveVertical(tickSize, 5, 5 * tickSize, sliderBottom);
            // called 4 times, for the move to 6, 7, 8, and 9
            assert.equal(onChange.callCount, 4);
            assert.deepEqual(onChange.args.map(arg => arg[0]), [[0, 6, 10], [0, 7, 10], [0, 8, 10], [0, 9, 10]]);
        });

        it("moving touch on middle handle updates middle value", () => {
            const slider = renderSlider({ vertical: true, onChange });
            const tickSize = slider.state("tickSize");
            const sliderBottom = Utils.getSliderBottomPixel(slider);
            slider
                .find(Handle)
                .at(1)
                .simulate("touchstart", { changedTouches: [{ clientY: sliderBottom - 5 * tickSize }] });
            Utils.touchMoveVertical(tickSize, 5, 5 * tickSize, sliderBottom);
            // called 4 times, for the move to 6, 7, 8, and 9
            assert.equal(onChange.callCount, 4);
            assert.deepEqual(onChange.args.map(arg => arg[0]), [[0, 6, 10], [0, 7, 10], [0, 8, 10], [0, 9, 10]]);
        });

        it("moving mouse on top handle updates last value", () => {
            const slider = renderSlider({ vertical: true, onChange });
            const tickSize = slider.state("tickSize");
            const sliderTop = Utils.getSliderTopPixel(slider);
            const sliderBottom = Utils.getSliderBottomPixel(slider);
            slider
                .find(Handle)
                .last()
                .simulate("mousedown", { clientY: sliderTop });
            Utils.mouseMoveVertical(-tickSize, 5, 10 * tickSize, sliderBottom);
            // called 4 times, for the move to 9, 8, 7, and 6
            assert.equal(onChange.callCount, 4);
            assert.deepEqual(onChange.args.map(arg => arg[0]), [[0, 5, 9], [0, 5, 8], [0, 5, 7], [0, 5, 6]]);
        });

        it("moving touch on top handle updates last value", () => {
            const slider = renderSlider({ vertical: true, onChange });
            const tickSize = slider.state("tickSize");
            const sliderTop = Utils.getSliderTopPixel(slider);
            const sliderBottom = Utils.getSliderBottomPixel(slider);
            slider
                .find(Handle)
                .last()
                .simulate("touchstart", { changedTouches: [{ clientY: sliderTop }] });
            Utils.touchMoveVertical(-tickSize, 5, 10 * tickSize, sliderBottom);
            // called 4 times, for the move to 9, 8, 7, and 6
            assert.equal(onChange.callCount, 4);
            assert.deepEqual(onChange.args.map(arg => arg[0]), [[0, 5, 9], [0, 5, 8], [0, 5, 7], [0, 5, 6]]);
        });

        it("releasing mouse calls onRelease with nearest value", () => {
            const slider = renderSlider({ vertical: true, onRelease });
            const sliderBottom = Utils.getSliderBottomPixel(slider);
            slider
                .find(Handle)
                .last()
                .simulate("mousedown", { clientY: sliderBottom });
            Utils.mouseUpVertical(sliderBottom - slider.state("tickSize") * 4);
            assert.isTrue(onRelease.calledOnce, "onRelease not called exactly once");
            assert.deepEqual(onRelease.firstCall.args[0], [0, 4, 5]);
        });

        it("releasing touch calls onRelease with nearest value", () => {
            const slider = renderSlider({ vertical: true, onRelease });
            const sliderBottom = Utils.getSliderBottomPixel(slider);
            slider
                .find(Handle)
                .last()
                .simulate("touchstart", { changedTouches: [{ clientY: sliderBottom }] });
            Utils.touchEndVertical(sliderBottom - slider.state("tickSize") * 4);
            assert.isTrue(onRelease.calledOnce, "onRelease not called exactly once");
            assert.deepEqual(onRelease.firstCall.args[0], [0, 4, 5]);
        });
    });

    function renderSlider(joinedProps?: IMultiRangeSliderProps & { values?: [number, number, number] }) {
        const { values, ...props } = joinedProps;
        const actualValues = values || [0, 5, 10];
        return mount(
            <MultiRangeSlider {...props}>
                <SliderHandle value={actualValues[0]} />
                <SliderHandle value={actualValues[1]} />
                <SliderHandle value={actualValues[2]} />
            </MultiRangeSlider>,
            { attachTo: testsContainerElement },
        );
    }
});
