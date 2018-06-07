/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { dispatchMouseEvent, dispatchTouchEvent } from "@blueprintjs/test-commons";
import { ReactWrapper } from "enzyme";
import { Handle } from "../../src/components/slider/handle";
import { ISliderBaseProps } from "../../src/components/slider/multiSlider";

interface IMoveOptions {
    /** Size in pixels of one drag event. Direction of drag is determined by `vertical` option. */
    dragSize?: number;
    /** Number of drag events of length `dragSize` to perform. */
    dragTimes: number;
    /** Initial pixel of drag operation: where the mouse is initially pressed. */
    from?: number;
    /** Index of `Handle` to move. */
    handleIndex?: number;
    /** Whether to use touch events. */
    touch?: boolean;
    /** Whether to use vertical events. */
    vertical?: boolean;
    /** Height of slider when vertical. */
    verticalHeight?: number;
}

export const DRAG_SIZE = 10;

/**
 * Simulates a full move of a slider handle: engage, move, release.
 * Supports touch and vertical events. Use options to configure exact movement.
 */
export function simulateMovement(wrapper: ReactWrapper, options: IMoveOptions) {
    const { from, handleIndex = 0, touch } = options;
    const handle = wrapper.find(Handle).at(handleIndex);
    if (touch) {
        handle.simulate("touchstart", { changedTouches: [{ clientX: from }] });
    } else {
        handle.simulate("mousedown", { clientX: from });
    }
    genericMove(options);
    genericRelease(options);
    return wrapper;
}

/** Release the mouse at the given clientX pixel. Useful for ending a drag interaction. */
export const mouseUpHorizontal = (clientX: number) => genericRelease({ dragTimes: 0, from: clientX });

export function getSliderTopPixel(slider: ReactWrapper<ISliderBaseProps, any>) {
    return slider.getDOMNode().getBoundingClientRect().top;
}

export function getSliderBottomPixel(slider: ReactWrapper<ISliderBaseProps, any>) {
    const { height, top } = slider.getDOMNode().getBoundingClientRect();
    return height + top;
}

// Private helpers
// ===============

function getDispatchEventFn(touch: boolean) {
    return touch ? dispatchTouchEvent : dispatchMouseEvent;
}

function genericMove(options: IMoveOptions) {
    const { dragSize = DRAG_SIZE, from = 0, dragTimes = 1, touch } = options;
    const eventName = touch ? "touchmove" : "mousemove";
    // vertical sliders go from bottom-up, so everything is backward
    const dispatchEventFn = getDispatchEventFn(touch);
    for (let i = 0; i < dragTimes; i += 1) {
        const clientPixel = from + i * dragSize;
        if (options.vertical) {
            dispatchEventFn(document, eventName, undefined, options.verticalHeight - clientPixel);
        } else {
            dispatchEventFn(document, eventName, clientPixel, undefined);
        }
    }
}

function genericRelease(options: IMoveOptions) {
    const { dragSize = DRAG_SIZE, from = 0, dragTimes = 1, touch } = options;
    const eventName = touch ? "touchend" : "mouseup";
    const handler = touch ? dispatchTouchEvent : dispatchMouseEvent;
    const clientPixel = from + dragTimes * dragSize;
    if (options.vertical) {
        handler(document, eventName, undefined, clientPixel);
    } else {
        handler(document, eventName, clientPixel, undefined);
    }
}
