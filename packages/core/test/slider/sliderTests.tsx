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
import { Classes, Slider } from "../../src/index";
import { dispatchMouseEvent, dispatchTouchEvent } from "../common/utils";

describe("<Slider>", () => {
    let testsContainerElement: HTMLElement;

    beforeEach(() => {
        // need an element in the document for tickSize to be a real number
        testsContainerElement = document.createElement("div");
        document.body.appendChild(testsContainerElement);
    });

    afterEach(() => testsContainerElement.remove());

    it(`renders a .${Classes.SLIDER}`, () => {
        assert.lengthOf(
            renderSlider(<Slider className="foo" />).find(`.${Classes.SLIDER}.foo`),
            1);
    });

    it("renders label for value and for each labelStepSize", () => {
        // [0  10  20  30  40  50]  +  value
        const wrapper = renderSlider(<Slider min={0} max={50} labelStepSize={10} />);
        assert.lengthOf(wrapper.find(`.${Classes.SLIDER_LABEL}`), 7);
    });

    it("renders all labels even when floating point approx would cause the last one to be skipped", () => {
        // [0  0.14  0.28  0.42  0.56  0.70]  +  value
        const wrapper = renderSlider(<Slider min={0} max={0.7} labelStepSize={0.14}/>);
        assert.lengthOf(wrapper.find(`.${Classes.SLIDER_LABEL}`), 7);
    });

    it("labelStepSize=0 renders only min and max axis labels", () => {
        const wrapper = renderSlider(<Slider min={10} max={20} labelStepSize={0}/>);
        const labels = wrapper.find(`.${Classes.SLIDER}-axis .${Classes.SLIDER_LABEL}`);
        assert.lengthOf(labels, 2);
        assert.equal(labels.first().text(), "10"); // min label
        assert.equal(labels.last().text(), "20"); // max label
    });

    it("renders result of renderLabel() in each label", () => {
        const renderLabel = (val: number) => val + "#";
        const wrapper = renderSlider(<Slider min={0} max={50} labelStepSize={10} renderLabel={renderLabel} />);
        assert.strictEqual(wrapper.find(`.${Classes.SLIDER}-axis`).text(), "0#10#20#30#40#50#");
    });

    it("renderLabel={false} removes all labels", () => {
        const wrapper = renderSlider(<Slider renderLabel={false} />);
        assert.lengthOf(wrapper.find(`.${Classes.SLIDER_LABEL}`), 0);
    });

    it("moving mouse calls onChange with nearest value", () => {
        const changeSpy = sinon.spy();
        const slider = renderSlider(<Slider onChange={changeSpy} />)
            .simulate("mousedown", { clientX: 0 });
        mouseMove(slider.state("tickSize"), 5);
        // called 4 times, for the move to 1, 2, 3, and 4
        assert.equal(changeSpy.callCount, 4);
        assert.deepEqual(changeSpy.args.map((arg) => arg[0]), [1, 2, 3, 4]);
    });

    it("releasing mouse calls onRelease with nearest value", () => {
        const releaseSpy = sinon.spy();
        const slider = renderSlider(<Slider onRelease={releaseSpy} />)
            .simulate("mousedown", { clientX: 0 });
        mouseMove(slider.state("tickSize"), 1);
        mouseUp(slider.state("tickSize"));
        assert.isTrue(releaseSpy.calledOnce, "onRelease not called exactly once");
        assert.equal(releaseSpy.args[0][0], 1);
    });

    it("moving touch calls onChange with nearest value", () => {
        const changeSpy = sinon.spy();
        const slider = renderSlider(<Slider onChange={changeSpy} />)
            .simulate("touchstart", { changedTouches: [{ clientX: 0 }] });
        touchMove(slider.state("tickSize"), 5);
        // called 4 times, for the move to 1, 2, 3, and 4
        assert.equal(changeSpy.callCount, 4);
        assert.deepEqual(changeSpy.args.map((arg) => arg[0]), [1, 2, 3, 4]);
    });

    it("releasing touch calls onRelease with nearest value", () => {
        const releaseSpy = sinon.spy();
        const slider = renderSlider(<Slider onRelease={releaseSpy} />)
            .simulate("touchstart", { changedTouches: [{ clientX: 0 }] });
        touchMove(slider.state("tickSize"), 1);
        touchEnd(slider.state("tickSize"));
        assert.isTrue(releaseSpy.calledOnce, "onRelease not called exactly once");
        assert.equal(releaseSpy.args[0][0], 1);
    });

    it("pressing arrow key down reduces value by stepSize", () => {
        const changeSpy = sinon.spy();
        renderSlider(<Slider value={3} onChange={changeSpy} />)
            .find(Handle)
            .simulate("keydown", { which: Keys.ARROW_DOWN });
        assert.isTrue(changeSpy.calledWith(2));
    });

    it("pressing arrow key up increases value by stepSize", () => {
        const changeSpy = sinon.spy();
        renderSlider(<Slider stepSize={4} value={3} onChange={changeSpy} />)
            .find(Handle)
            .simulate("keydown", { which: Keys.ARROW_UP });
        assert.isTrue(changeSpy.calledWith(7));
    });

    it("releasing arrow key calls onRelease with value", () => {
        const releaseSpy = sinon.spy();
        renderSlider(<Slider stepSize={4} value={3} onRelease={releaseSpy} />)
            .find(Handle)
            .simulate("keydown", { which: Keys.ARROW_UP })
            .simulate("keyup", { which: Keys.ARROW_UP });
        assert.isTrue(releaseSpy.calledWith(3));
    });

    it("disabled slider does not respond to mouse movement", () => {
        const changeSpy = sinon.spy();
        const slider = renderSlider(<Slider disabled={true} onChange={changeSpy} />)
            .simulate("mousedown", { clientX: 0 });
        mouseMove(slider.state("tickSize"), 5);
        assert.isTrue(changeSpy.notCalled, "onChange was called when disabled");
    });

    it("disabled slider does not respond to touch movement", () => {
        const changeSpy = sinon.spy();
        const slider = renderSlider(<Slider disabled={true} onChange={changeSpy} />)
            .simulate("touchstart", { changedTouches: [{ clientX: 0 }] });
        touchMove(slider.state("tickSize"), 5);
        assert.isTrue(changeSpy.notCalled, "onChange was called when disabled");
    });

    it("disabled slider does not respond to key presses", () => {
        const changeSpy = sinon.spy();
        renderSlider(<Slider disabled={true} onChange={changeSpy} />)
            .find(Handle)
            .simulate("keydown", { which: Keys.ARROW_DOWN });
        assert.isTrue(changeSpy.notCalled, "onChange was called when disabled");
    });

    it("disabled slider does not respond to track clicks", () => {
        const trackSelector = `.${Classes.SLIDER}-track`;
        const slider = renderSlider(<Slider disabled={true} />);
        // spy on instance method instead of onChange because we can't supply nativeEvent
        const trackClickSpy = sinon.spy(slider.instance(), "handleTrackClick");
        slider.find(trackSelector)
            .simulate("mousedown", { target: testsContainerElement.query(trackSelector) });
        assert.isTrue(trackClickSpy.notCalled, "handleTrackClick was called when disabled");
    });

    it("disabled slider does not respond to track taps", () => {
        const trackSelector = `.${Classes.SLIDER}-track`;
        const slider = renderSlider(<Slider disabled={true} />);
        // spy on instance method instead of onChange because we can't supply nativeEvent
        const trackClickSpy = sinon.spy(slider.instance(), "handleTrackTouch");
        slider.find(trackSelector)
            .simulate("touchstart", { target: testsContainerElement.query(trackSelector) });
        assert.isTrue(trackClickSpy.notCalled, "handleTrackTouch was called when disabled");
    });

    it("throws error if given non-number values for number props", () => {
        [{ max: "foo" }, { min: "foo" }, { stepSize: "foo" }].forEach((props: any) => {
            assert.throws(() => renderSlider(<Slider {...props} />), "number");
        });
    });

    it("fill does not exceed bounds if initialValue outside bounds of min/max", () => {
        const style = renderSlider(<Slider initialValue={-10} min={0} value={5} />)
            .find(".pt-slider-progress").prop("style") as React.CSSProperties;
        assert.strictEqual(style.left, 0);
    });

    function renderSlider(slider: JSX.Element) {
        return mount(slider, { attachTo: testsContainerElement });
    }

    function mouseMove(movement: number, times = 1) {
        for (let x = 0; x < times; x += 1) {
            dispatchMouseEvent(document, "mousemove", x * movement);
        }
    }

    function mouseUp(clientX = 0) {
        dispatchMouseEvent(document, "mouseup", clientX);
    }

    function touchMove(movement: number, times = 1) {
        for (let x = 0; x < times; x += 1) {
            dispatchTouchEvent(document, "touchmove", x * movement);
        }
    }

    function touchEnd(clientX = 0) {
        dispatchTouchEvent(document, "touchend", clientX);
    }
});
