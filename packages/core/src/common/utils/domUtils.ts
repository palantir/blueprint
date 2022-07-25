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

export function elementIsOrContains(element: HTMLElement, testElement: HTMLElement) {
    return element === testElement || element.contains(testElement);
}

/**
 * Gets the active element in the document or shadow root (if an element is provided, and it's in the shadow DOM).
 */
export function getActiveElement(element?: HTMLElement | null, options?: GetRootNodeOptions) {
    if (element == null) {
        return document.activeElement;
    }

    const rootNode = (element.getRootNode(options) ?? document) as DocumentOrShadowRoot & Node;
    return rootNode.activeElement;
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

export interface IThrottledReactEventOptions {
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
    options: IThrottledReactEventOptions = {},
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
// eslint-disable-next-line @typescript-eslint/ban-types
export function throttle<T extends Function>(method: T): T {
    return throttleImpl(method);
}

// eslint-disable-next-line @typescript-eslint/ban-types
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
