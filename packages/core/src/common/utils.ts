/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

// only accessible within this file, so use `Utils.isNodeEnv` from the outside.
declare var process: { env: any };

/** Returns whether `process.env.NODE_ENV` exists and equals `env`. */
export function isNodeEnv(env: string) {
    return typeof process !== "undefined" && process.env && process.env.NODE_ENV === env;
}

/** Returns whether the value is a function. Acts as a type guard. */
// tslint:disable-next-line:ban-types
export function isFunction(value: any): value is Function {
    return typeof value === "function";
}

/** Safely invoke the function with the given arguments, if it is indeed a function, and return its value. */
export function safeInvoke<R>(func: (() => R) | undefined): R;
export function safeInvoke<A, R>(func: ((arg1: A) => R) | undefined, arg1: A): R;
export function safeInvoke<A, B, R>(func: ((arg1: A, arg2: B) => R) | undefined, arg1: A, arg2: B): R;
export function safeInvoke<A, B, C, R>(
    func: ((arg1: A, arg2: B, arg3: C) => R) | undefined,
    arg1: A,
    arg2: B,
    arg3: C,
): R;
// tslint:disable-next-line:ban-types
export function safeInvoke(func: Function | undefined, ...args: any[]) {
    if (isFunction(func)) {
        return func(...args);
    }
}

export function elementIsOrContains(element: HTMLElement, testElement: HTMLElement) {
    return element === testElement || element.contains(testElement);
}

/**
 * Returns the difference in length between two arrays. A `null` argument is considered an empty list.
 * The return value will be positive if `a` is longer than `b`, negative if the opposite is true,
 * and zero if their lengths are equal.
 */
export function arrayLengthCompare(a: any[] = [], b: any[] = []) {
    return a.length - b.length;
}

/**
 * Returns true if the two numbers are within the given tolerance of each other.
 * This is useful to correct for floating point precision issues, less useful for integers.
 */
export function approxEqual(a: number, b: number, tolerance = 0.00001) {
    return Math.abs(a - b) <= tolerance;
}

/** Clamps the given number between min and max values. Returns value if within range, or closest bound. */
export function clamp(val: number, min: number, max: number) {
    if (max < min) {
        throw new Error("clamp: max cannot be less than min");
    }
    return Math.min(Math.max(val, min), max);
}

/** Returns the number of decimal places in the given number. */
export function countDecimalPlaces(num: number) {
    if (typeof num !== "number" || Math.floor(num) === num) {
        return 0;
    }
    return num.toString().split(".")[1].length;
}

/**
 * Throttle an event on an EventTarget by wrapping it in `requestAnimationFrame` call.
 * Returns the event handler that was bound to given eventName so you can clean up after yourself.
 * @see https://developer.mozilla.org/en-US/docs/Web/Events/scroll
 */
export function throttleEvent(target: EventTarget, eventName: string, newEventName: string) {
    let running = false;
    /* istanbul ignore next: borrowed directly from MDN */
    const func = (event: Event) => {
        if (running) { return; }
        running = true;
        requestAnimationFrame(() => {
            target.dispatchEvent(new CustomEvent(newEventName, event));
            running = false;
        });
    };
    target.addEventListener(eventName, func);
    return func;
};
