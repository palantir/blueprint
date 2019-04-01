/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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

// check for window since we might be in a headless server environment
if (typeof window !== "undefined") {
    if (window.addEventListener != null) {
        window.addEventListener("message", handleIdle, false);
    }
}

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
            postMessage(MESSAGE_EVENT_DATA, "*");
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
