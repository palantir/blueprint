/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
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

import { expect } from "chai";

/**
 * Dispatch a native KeyBoardEvent on the target element with the given type
 * and event arguments. `type` can be one of "keydown|keyup|keypress".
 *
 * This method is for unit testing with Karma and Chrome ONLY! The hacks we
 * use aren't compatible with other browsers. Do not use this method for
 * anything other than simulating keyboard events for PhantomJS and karma
 * chrome tests.
 */
export function dispatchTestKeyboardEvent(target: EventTarget, eventType: string, key: string, shift = false) {
    const event = new KeyboardEvent(eventType, {
        altKey: false,
        bubbles: true,
        cancelable: true,
        ctrlKey: false,
        key,
        location: 0,
        shiftKey: shift,
        view: window,
    });
    target.dispatchEvent(event);
}

// see http://stackoverflow.com/questions/16802795/click-not-working-in-mocha-phantomjs-on-certain-elements
// tl;dr PhantomJS sucks so we have to manually create click events
export function createMouseEvent(eventType = "click", clientX = 0, clientY = 0) {
    // see https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail
    let detailArg = 0;

    switch (eventType) {
        case "click":
        case "dblclick":
            detailArg = 1;
            break;
        case "mouseup":
        case "mousedown":
            detailArg = 2;
            break;
    }

    const event = new MouseEvent(eventType, {
        bubbles: true,
        button: 0,
        cancelable: true,
        clientX,
        clientY,
        detail: detailArg,
        view: window,
    });

    return event;
}

export function dispatchMouseEvent(target: EventTarget, eventType = "click", clientX = 0, clientY = 0) {
    target.dispatchEvent(createMouseEvent(eventType, clientX, clientY));
}

/**
 * Vitest-compatible version of createMouseEvent that works with jsdom.
 */
export function createVitestMouseEvent(eventType = "click", clientX = 0, clientY = 0) {
    // see https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail
    let detailArg = 0;

    switch (eventType) {
        case "click":
        case "dblclick":
            detailArg = 1;
            break;
        case "mouseup":
        case "mousedown":
            detailArg = 2;
            break;
    }

    const event = new MouseEvent(eventType, {
        bubbles: true,
        button: 0,
        cancelable: true,
        clientX,
        clientY,
        detail: detailArg,
        // Don't set view: window as it causes issues in vitest/jsdom environment
    });

    return event;
}

/**
 * Vitest-compatible version of `dispatchMouseEvent` that works with jsdom.
 * Use this instead of `dispatchMouseEvent` when running tests with vitest.
 */
export function dispatchVitestMouseEvent(target: EventTarget, eventType = "click", clientX = 0, clientY = 0) {
    target.dispatchEvent(createVitestMouseEvent(eventType, clientX, clientY));
}

/**
 * Vitest-compatible version of KeyboardEvent creation that works with jsdom.
 */
export function createVitestKeyboardEvent(eventType: string, key: string, shift = false) {
    return new KeyboardEvent(eventType, {
        altKey: false,
        bubbles: true,
        cancelable: true,
        ctrlKey: false,
        key,
        location: 0,
        shiftKey: shift,
        // Don't set view: window as it causes issues in vitest/jsdom environment
    });
}

/**
 * Vitest-compatible version of `dispatchTestKeyboardEvent` that works with jsdom.
 * Use this instead of `dispatchTestKeyboardEvent` when running tests with vitest.
 */
export function dispatchVitestKeyboardEvent(target: EventTarget, eventType: string, key: string, shift = false) {
    target.dispatchEvent(createVitestKeyboardEvent(eventType, key, shift));
}

/**
 * Vitest-compatible version of TouchEvent creation that works with jsdom.
 * Since jsdom doesn't support Touch API, we simulate touch events using mouse events.
 */
export function createVitestTouchEvent(eventType: string, clientX = 0, clientY = 0) {
    // Simulate touch events using mouse events since jsdom doesn't support Touch API
    const event = createVitestMouseEvent(eventType, clientX, clientY);

    // Add touch-specific properties
    const touches = [{ clientX, clientY }];
    ["touches", "targetTouches", "changedTouches"].forEach(prop => {
        Object.defineProperty(event, prop, { enumerable: true, value: touches });
    });

    return event;
}

/**
 * Vitest-compatible version of dispatchTouchEvent that works with jsdom.
 */
export function dispatchVitestTouchEvent(target: EventTarget, eventType = "touchstart", clientX = 0, clientY = 0) {
    target.dispatchEvent(createVitestTouchEvent(eventType, clientX, clientY));
}

// PhantomJS doesn't support touch events yet https://github.com/ariya/phantomjs/issues/11571
// so we simulate it with mouse events
export function createTouchEvent(eventType = "touchstart", clientX = 0, clientY = 0) {
    const event = createMouseEvent(eventType, clientX, clientY);
    const touches = [{ clientX, clientY }];
    ["touches", "targetTouches", "changedTouches"].forEach(prop => {
        Object.defineProperty(event, prop, { value: touches });
    });
    return event;
}

export function dispatchTouchEvent(target: EventTarget, eventType = "touchstart", clientX = 0, clientY = 0) {
    target.dispatchEvent(createTouchEvent(eventType, clientX, clientY));
}

/**
 * Helper utility to test validateProps behavior.
 * We can't simply call mount() here since React 16 throws before we can even validate the errors thrown
 * in component constructors.
 */
export function expectPropValidationError<P extends object>(
    Component: React.ComponentClass<P>,
    props: P & { children?: React.ReactNode },
    errorMessage?: string,
    assertionMessage?: string,
) {
    const { defaultProps = {} } = Component;
    // HACKHACK: weird casts ahead
    expect(() => new Component({ ...(defaultProps as object), ...(props as object) } as P)).to.throw(
        errorMessage,
        assertionMessage,
    );
}
