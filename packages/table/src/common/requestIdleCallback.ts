/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

/**
 * Event name for `postMessage`
 */
const MESSAGE_EVENT_DATA = "blueprint-table-post-message";

type Callback = () => void;

/**
 * Object that holds state for managing idle callbacks
 */
const IDLE_STATE = {
    callbacks: [] as Callback[],
    triggered: false,
};

const handleIdle = (event: MessageEvent) => {
    if (event.source !== window || event.data !== MESSAGE_EVENT_DATA) {
       return;
    }

    IDLE_STATE.triggered = false;

    let callback = null;
    if (IDLE_STATE.callbacks.length > 0) {
        callback = IDLE_STATE.callbacks.shift();
    }

    if (IDLE_STATE.callbacks.length > 0) {
        triggerIdleFrame();
    }

    // finally, invoke the callback. exceptions will be propagated
    if (callback) {
        callback();
    }
};
window.addEventListener("message", handleIdle, false);

const triggerIdleFrame = () => {
    if (IDLE_STATE.triggered) {
        return;
    }
    IDLE_STATE.triggered = true;

    /**
     * This is the magic that will wait for the browser to be "idle" before
     * invoking the callback.
     *
     * First, we use nested calls to `requestAnimationFrame` which will cause
     * the inner callback to be invoked on the NEXT FRAME.
     *
     * Then, we call to `postMessage` to invoke the `handleIdle` method only
     * once the current stack frame is empty.
     *
     * With this approach, the idle callback will be invoked at most once per
     * frame and only after the stack frame is empty.
     */
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            window.postMessage(MESSAGE_EVENT_DATA, "*");
        });
    });
};

/**
 * Invokes the provided callback on the next available frame after the stack
 * frame is empty.
 *
 * At most one callback per frame is invoked, and the callback may be delayed
 * multiple frames until the page is idle.
 *
 * TODO: return a token from this method that allows you to cancel the callback
 * (otherwise the callback list may increase without bound).
 */
export const requestIdleCallback = (callback: Callback) => {
    IDLE_STATE.callbacks.push(callback);
    triggerIdleFrame();
};
