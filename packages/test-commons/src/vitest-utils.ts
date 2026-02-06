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
 * These utilities are similar to those in utils.ts but are compatible with
 * jsdom's stricter event validation (no `view: window` property needed).
 *
 * For Karma/Chrome tests, use the utilities from utils.ts instead.
 */

/**
 * Dispatch a native KeyboardEvent on the target element.
 * Works with Vitest + jsdom/happy-dom environments.
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
    });
    target.dispatchEvent(event);
}

/**
 * Create a MouseEvent. Works with Vitest + jsdom environments.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail
 */
export function createMouseEvent(eventType = "click", clientX = 0, clientY = 0) {
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

/**
 * Create a TouchEvent simulation using MouseEvent with touch properties.
 * jsdom doesn't fully support TouchEvent, so we simulate it with MouseEvent.
 */
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
