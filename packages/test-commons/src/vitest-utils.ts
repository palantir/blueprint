/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
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
 * Test utilities for Vitest + jsdom/happy-dom environments.
 *
 * These utilities are compatible with jsdom's stricter event validation
 * (no `view: window` property needed).
 */

import type { ReactWrapper } from "enzyme";
import { act } from "react";

/**
 * Unmount a batch of Enzyme wrappers inside `act()` and yield once so any
 * microtasks/RAF callbacks (e.g. PopoverNext's floating-ui `autoUpdate`
 * ResizeObserver/RAF cleanup) flush before jsdom is torn down.
 *
 * Use this in an `afterEach` for any test file that mounts PopoverNext-backed
 * components — without it, teardown can race against autoUpdate and produce
 * "window is not defined" / "Should not already be working" noise.
 *
 * Each `unmount()` is wrapped in try/catch so one wrapper failing doesn't
 * abandon the remaining wrappers.
 */
export function unmountWrappers(wrappers: Array<ReactWrapper<any, any>>): Promise<void> {
    return act(() => {
        for (const wrapper of wrappers) {
            try {
                wrapper.unmount();
            } catch {
                // best-effort: continue unmounting remaining wrappers
            }
        }
        // Yield once so any queued microtasks/RAF callbacks fire while jsdom is still alive.
        return new Promise<void>(resolve => setTimeout(resolve, 0));
    });
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

    return new MouseEvent(eventType, {
        bubbles: true,
        button: 0,
        cancelable: true,
        clientX,
        clientY,
        detail: detailArg,
    });
}

export function dispatchMouseEvent(target: EventTarget, eventType = "click", clientX = 0, clientY = 0) {
    target.dispatchEvent(createMouseEvent(eventType, clientX, clientY));
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
