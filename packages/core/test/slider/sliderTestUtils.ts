/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 * 
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { dispatchMouseEvent, dispatchTouchEvent } from "@blueprintjs/test-commons";
import { ReactWrapper } from "enzyme";
import { ICoreSliderProps } from "../../src/components/slider/multiSlider";

export function mouseMoveHorizontal(movement: number, times = 1, initialValue = 0) {
    genericMoveHorizontal(movement, times, initialValue, "mousemove");
}

export function mouseMoveVertical(movement: number, times = 1, initialValue = 0, offsetTop: number) {
    genericMoveVertical(movement, times, initialValue, "mousemove", offsetTop);
}

export function mouseUpHorizontal(clientPixel = 0) {
    dispatchMouseEvent(document, "mouseup", clientPixel, undefined);
}

export function mouseUpVertical(clientPixel = 0) {
    dispatchMouseEvent(document, "mouseup", undefined, clientPixel);
}

export function touchMoveHorizontal(movement: number, times = 1, initialValue = 0) {
    genericMoveHorizontal(movement, times, initialValue, "touchmove");
}

export function touchMoveVertical(movement: number, times = 1, initialValue = 0, offsetTop: number) {
    genericMoveVertical(movement, times, initialValue, "touchmove", offsetTop);
}

export function touchEndHorizontal(clientX = 0) {
    dispatchTouchEvent(document, "touchend", clientX, undefined);
}

export function touchEndVertical(clientY = 0) {
    dispatchTouchEvent(document, "touchend", undefined, clientY);
}

export function getSliderTopPixel(slider: ReactWrapper<ICoreSliderProps, any>) {
    return slider.getDOMNode().getBoundingClientRect().top;
}

export function getSliderBottomPixel(slider: ReactWrapper<ICoreSliderProps, any>) {
    const { height, top } = slider.getDOMNode().getBoundingClientRect();
    return height + top;
}

export function getDispatchEventFn(eventType: "mousemove" | "touchmove") {
    return eventType === "touchmove" ? dispatchTouchEvent : dispatchMouseEvent;
}

// Private helpers
// ===============

function genericMoveHorizontal(movement: number, times = 1, initialValue = 0, eventType: "mousemove" | "touchmove") {
    // vertical sliders go from bottom-up, so everything is backward
    const dispatchEventFn = getDispatchEventFn(eventType);
    for (let i = 0; i < times; i += 1) {
        const clientPixel = initialValue + i * movement;
        dispatchEventFn(document, eventType, clientPixel, undefined);
    }
}

function genericMoveVertical(
    movement: number,
    times = 1,
    initialValue = 0,
    eventType: "mousemove" | "touchmove",
    sliderBottom: number,
) {
    const dispatchEventFn = getDispatchEventFn(eventType);
    // vertical sliders go from the bottom gulp up, so 0 is actually at the
    // bottom of the element
    for (let i = 0; i < times; i += 1) {
        const clientPixel = sliderBottom - (initialValue + i * movement);
        dispatchEventFn(document, eventType, undefined, clientPixel);
    }
}
