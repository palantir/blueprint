/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { dispatchMouseEvent, dispatchTouchEvent } from "@blueprintjs/test-commons";
import { ReactWrapper } from "enzyme";
import { Handle } from "../../src/components/slider/handle";

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

export const DRAG_SIZE = 20;

/**
 * Simulates a full move of a slider handle: engage, move, release.
 * Supports touch and vertical events. Use options to configure exact movement.
 */
export function simulateMovement(wrapper: ReactWrapper, options: IMoveOptions) {
    const { from, handleIndex = 0, touch } = options;
    const handle = wrapper.find(Handle).at(handleIndex);
    const eventData = options.vertical ? { clientY: options.verticalHeight - from } : { clientX: from };
    if (touch) {
        handle.simulate("touchstart", { changedTouches: [eventData] });
    } else {
        handle.simulate("mousedown", eventData);
    }
    genericMove(options);
    genericRelease(options);
    return wrapper;
}

/** Release the mouse at the given clientX pixel. Useful for ending a drag interaction. */
export const mouseUpHorizontal = (clientX: number) => genericRelease({ dragTimes: 0, from: clientX });

// Private helpers
// ===============

function genericMove(options: IMoveOptions) {
    const { dragSize = DRAG_SIZE, from = 0, dragTimes = 1, touch } = options;
    const eventName = touch ? "touchmove" : "mousemove";
    for (let i = 0; i < dragTimes; i += 1) {
        const clientPixel = from + i * dragSize;
        dispatchEvent(options, eventName, clientPixel);
    }
}

function genericRelease(options: IMoveOptions) {
    const { dragSize = DRAG_SIZE, from = 0, dragTimes = 1, touch } = options;
    const eventName = touch ? "touchend" : "mouseup";
    const clientPixel = from + dragTimes * dragSize;
    dispatchEvent(options, eventName, clientPixel);
}

function dispatchEvent(options: IMoveOptions, eventName: string, clientPixel: number) {
    const { touch, vertical, verticalHeight = 0 } = options;
    const dispatchFn = touch ? dispatchTouchEvent : dispatchMouseEvent;
    if (vertical) {
        // vertical sliders go from bottom-up, so everything is backward
        dispatchFn(document, eventName, undefined, verticalHeight - clientPixel);
    } else {
        dispatchFn(document, eventName, clientPixel, undefined);
    }
}
