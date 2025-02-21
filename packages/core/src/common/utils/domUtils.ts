/*
 * Copyright 2020 Palantir Technologies, Inc. All rights reserved.
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

/** @returns true if React is running in a client environment, and false if it's in a server */
export function hasDOMEnvironment(): boolean {
    return typeof window !== "undefined" && window.document != null;
}

export function elementIsOrContains(element: HTMLElement, testElement: HTMLElement) {
    return element === testElement || element.contains(testElement);
}

/**
 * Checks whether the given element is inside something that looks like a text input.
 * This is particularly useful to determine if a keyboard event inside this element should take priority over hotkey
 * bindings / keyboard shortcut handlers.
 *
 * @returns true if the element is inside a text input
 */
export function elementIsTextInput(elem: HTMLElement) {
    // we check these cases for unit testing, but this should not happen
    // during normal operation
    if (elem == null || elem.closest == null) {
        return false;
    }

    const editable = elem.closest<HTMLInputElement>("input, textarea, [contenteditable=true]");

    if (editable == null) {
        return false;
    }

    // don't let checkboxes, switches, and radio buttons prevent hotkey behavior
    if (editable.tagName.toLowerCase() === "input") {
        const inputType = editable.type;
        if (inputType === "checkbox" || inputType === "radio") {
            return false;
        }
    }

    // don't let read-only fields prevent hotkey behavior
    if (editable.readOnly) {
        return false;
    }

    return true;
}

/**
 * Gets the active element in the document or shadow root (if an element is provided, and it's in the shadow DOM).
 */
export function getActiveElement(element?: HTMLElement | null, options?: GetRootNodeOptions) {
    const rootNode = (element?.getRootNode(options) ?? document) as unknown as DocumentOrShadowRoot;
    const activeElement = rootNode.activeElement;
    return activeElement instanceof HTMLElement ? activeElement : null;
}

/**
 * Throttle an event on an EventTarget by wrapping it in a
 * `requestAnimationFrame` call. Returns the event handler that was bound to
 * given eventName so you can clean up after yourself.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/Events/scroll
 */
/* istanbul ignore next */
export function throttleEvent(target: EventTarget, eventName: string, newEventName: string) {
    const throttledFunc = throttleImpl((event: Event) => {
        target.dispatchEvent(new CustomEvent(newEventName, event));
    });
    target.addEventListener(eventName, throttledFunc);
    return throttledFunc;
}

export interface ThrottledReactEventOptions {
    preventDefault?: boolean;
}

/**
 * Throttle a callback by wrapping it in a `requestAnimationFrame` call. Returns
 * the throttled function.
 *
 * @see https://www.html5rocks.com/en/tutorials/speed/animations/
 */
export function throttleReactEventCallback<E extends React.SyntheticEvent = React.SyntheticEvent>(
    callback: (event: E, ...otherArgs: any[]) => any,
    options: ThrottledReactEventOptions = {},
) {
    const throttledFunc = throttleImpl(
        callback,
        (event2: E) => {
            if (options.preventDefault) {
                event2.preventDefault();
            }
        },
        // prevent React from reclaiming the event object before we reference it
        (event2: E) => event2.persist(),
    );
    return throttledFunc;
}

/**
 * Throttle a method by wrapping it in a `requestAnimationFrame` call. Returns
 * the throttled function.
 */
/* istanbul ignore next */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function throttle<T extends Function>(method: T): T {
    return throttleImpl(method);
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
function throttleImpl<T extends Function>(
    onAnimationFrameRequested: T,
    onBeforeIsRunningCheck?: T,
    onAfterIsRunningCheck?: T,
) {
    let isRunning = false;
    const func = (...args: any[]) => {
        onBeforeIsRunningCheck?.(...args);

        if (isRunning) {
            return;
        }
        isRunning = true;

        onAfterIsRunningCheck?.(...args);

        requestAnimationFrame(() => {
            onAnimationFrameRequested(...args);
            isRunning = false;
        });
    };
    return func as any as T;
}

export function clickElementOnKeyPress(keys: string[]) {
    return (e: React.KeyboardEvent) => {
        if (keys.some(key => e.key === key)) {
            // Prevent spacebar from scrolling the page unless we're in a text field
            if (!elementIsTextInput(e.target as HTMLElement)) {
                e.preventDefault();
            }

            e.target.dispatchEvent(new MouseEvent("click", { ...e, view: undefined }));
        }
    };
}

/**
 * Selector for all possible focusable items.
 *
 * Derived from this SO question: {@link https://stackoverflow.com/questions/1599660/which-html-elements-can-receive-focus}
 *
 * Note: Order may not be correct if children elements use tabindex values > 0.
 */
const SELECTOR_FOCUSABLE = [
    'a[href]:not([tabindex="-1"])',
    'button:not([disabled]):not([tabindex="-1"])',
    'details:not([tabindex="-1"])',
    'input:not([disabled]):not([tabindex="-1"])',
    'select:not([disabled]):not([tabindex="-1"])',
    'textarea:not([disabled]):not([tabindex="-1"])',
    '[tabindex]:not([tabindex="-1"])',
].join(",");

/**
 * Gets all focusable elements within the given element.
 *
 * Selector derived from this SO question: {@link https://stackoverflow.com/questions/1599660/which-html-elements-can-receive-focus}
 *
 * Note: Order may not be correct if children elements use tabindex values > 0.
 *
 * @param {HTMLElement} element - The element to search within.
 * @returns {HTMLElement[]} An array of focusable elements.
 */
export function getFocusableElements(element: HTMLElement): HTMLElement[] {
    return Array.from(element.querySelectorAll(SELECTOR_FOCUSABLE));
}
