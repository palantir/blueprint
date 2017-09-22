/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { CLAMP_MIN_MAX } from "./errors";

export interface IKeyWhitelist<T> {
    include: Array<keyof T>;
}

export interface IKeyBlacklist<T> {
    exclude: Array<keyof T>;
}

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

/**
 * Safely invoke the function with the given arguments, if it is indeed a
 * function, and return its value.
 */
export function safeInvoke<R>(func: (() => R) | undefined): R;
export function safeInvoke<A, R>(func: ((arg1: A) => R) | undefined, arg1: A): R;
export function safeInvoke<A, B, R>(func: ((arg1: A, arg2: B) => R) | undefined, arg1: A, arg2: B): R;
export function safeInvoke<A, B, C, R>(
    func: ((arg1: A, arg2: B, arg3: C) => R) | undefined,
    arg1: A,
    arg2: B,
    arg3: C,
): R;
export function safeInvoke<A, B, C, D, R>(
    func: ((arg1: A, arg2: B, arg3: C, arg4: D) => R) | undefined,
    arg1: A,
    arg2: B,
    arg3: C,
    arg4: D,
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
 * Returns true if the arrays are equal. Elements will be shallowly compared by
 * default, or they will be compared using the custom `compare` function if one
 * is provided.
 */
export function arraysEqual(arrA: any[], arrB: any[], compare = (a: any, b: any) => a === b) {
    // treat `null` and `undefined` as the same
    if (arrA == null && arrB == null) {
        return true;
    } else if (arrA == null || arrB == null || arrA.length !== arrB.length) {
        return false;
    } else {
        return arrA.every((a, i) => compare(a, arrB[i]));
    }
}

/**
 * Returns the difference in length between two arrays. A `null` argument is
 * considered an empty list. The return value will be positive if `a` is longer
 * than `b`, negative if the opposite is true, and zero if their lengths are
 * equal.
 */
export function arrayLengthCompare(a: any[] = [], b: any[] = []) {
    return a.length - b.length;
}

/**
 * Returns true if the two numbers are within the given tolerance of each other.
 * This is useful to correct for floating point precision issues, less useful
 * for integers.
 */
export function approxEqual(a: number, b: number, tolerance = 0.00001) {
    return Math.abs(a - b) <= tolerance;
}

/**
 * Clamps the given number between min and max values. Returns value if within
 * range, or closest bound.
 */
export function clamp(val: number, min: number, max: number) {
    if (val == null) {
        return val;
    }
    if (max < min) {
        throw new Error(CLAMP_MIN_MAX);
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
 * Throttle an event on an EventTarget by wrapping it in a
 * `requestAnimationFrame` call. Returns the event handler that was bound to
 * given eventName so you can clean up after yourself.
 * @see https://developer.mozilla.org/en-US/docs/Web/Events/scroll
 */
export function throttleEvent(target: EventTarget, eventName: string, newEventName: string) {
    const throttledFunc = _throttleHelper(undefined, undefined, (event: Event) => {
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
 * @see https://www.html5rocks.com/en/tutorials/speed/animations/
 */
export function throttleReactEventCallback(
    callback: (event: React.SyntheticEvent<any>, ...otherArgs: any[]) => any,
    options: IThrottledReactEventOptions = {},
) {
    const throttledFunc = _throttleHelper(
        (event2: React.SyntheticEvent<any>) => {
            if (options.preventDefault) {
                event2.preventDefault();
            }
        },
        (event2: React.SyntheticEvent<any>) => {
            // prevent React from reclaiming the event object before we
            // reference it
            event2.persist();
        },
        (event2: React.SyntheticEvent<any>, ...otherArgs2: any[]) => {
            callback(event2, ...otherArgs2);
        },
    );
    return throttledFunc;
}

/**
 * Shallow comparison between objects. If `keys` is provided, just that subset
 * of keys will be compared; otherwise, all keys will be compared.
 */
export function shallowCompareKeys<T extends object>(objA: T, objB: T, keys?: IKeyBlacklist<T> | IKeyWhitelist<T>) {
    // treat `null` and `undefined` as the same
    if (objA == null && objB == null) {
        return true;
    } else if (objA == null || objB == null) {
        return false;
    } else if (Array.isArray(objA) || Array.isArray(objB)) {
        return false;
    } else if (keys != null) {
        return _shallowCompareKeys(objA, objB, keys);
    } else {
        // shallowly compare all keys from both objects
        const keysA = Object.keys(objA) as Array<keyof T>;
        const keysB = Object.keys(objB) as Array<keyof T>;
        return (
            _shallowCompareKeys(objA, objB, { include: keysA }) && _shallowCompareKeys(objA, objB, { include: keysB })
        );
    }
}

/**
 * Deep comparison between objects. If `keys` is provided, just that subset of
 * keys will be compared; otherwise, all keys will be compared.
 */
export function deepCompareKeys(objA: any, objB: any, keys?: string[]): boolean {
    if (objA === objB) {
        return true;
    } else if (objA == null && objB == null) {
        // treat `null` and `undefined` as the same
        return true;
    } else if (objA == null || objB == null) {
        return false;
    } else if (Array.isArray(objA) || Array.isArray(objB)) {
        return arraysEqual(objA, objB, deepCompareKeys);
    } else if (_isSimplePrimitiveType(objA) || _isSimplePrimitiveType(objB)) {
        return objA === objB;
    } else if (keys != null) {
        return _deepCompareKeys(objA, objB, keys);
    } else if (objA.constructor !== objB.constructor) {
        return false;
    } else {
        const keysA = Object.keys(objA);
        const keysB = Object.keys(objB);
        if (keysA == null || keysB == null) {
            return false;
        }
        if (keysA.length === 0 && keysB.length === 0) {
            return true;
        }
        return arraysEqual(keysA, keysB) && _deepCompareKeys(objA, objB, keysA);
    }
}

/**
 * Returns a descriptive object for each key whose values are shallowly unequal
 * between two provided objects. Useful for debugging shouldComponentUpdate.
 */
export function getShallowUnequalKeyValues<T extends object>(
    objA: T,
    objB: T,
    keys?: IKeyBlacklist<T> | IKeyWhitelist<T>,
) {
    // default param values let null values pass through, so we have to take
    // this more thorough approach
    const definedObjA = objA == null ? {} : objA;
    const definedObjB = objB == null ? {} : objB;

    const filteredKeys = _filterKeys(definedObjA, definedObjB, keys == null ? { exclude: [] } : keys);
    return _getUnequalKeyValues(definedObjA, definedObjB, filteredKeys, (a, b, key) => {
        return shallowCompareKeys(a, b, { include: [key] });
    });
}

/**
 * Returns a descriptive object for each key whose values are deeply unequal
 * between two provided objects. Useful for debugging shouldComponentUpdate.
 */
export function getDeepUnequalKeyValues<T extends object>(objA: T, objB: T, keys?: Array<keyof T>) {
    const definedObjA = objA == null ? {} as T : objA;
    const definedObjB = objB == null ? {} as T : objB;

    const filteredKeys = keys == null ? _unionKeys(definedObjA, definedObjB) : keys;
    return _getUnequalKeyValues(definedObjA, definedObjB, filteredKeys, (a, b, key) => {
        return deepCompareKeys(a, b, [key]);
    });
}

// Private helpers
// ===============

function _throttleHelper(
    onBeforeIsRunningCheck: (...args: any[]) => void,
    onAfterIsRunningCheck: (...args: any[]) => void,
    onAnimationFrameRequested: (...args: any[]) => void,
) {
    let isRunning = false;
    const func = (...args: any[]) => {
        // don't use safeInvoke, because we might have more than its max number
        // of typed params
        if (isFunction(onBeforeIsRunningCheck)) {
            onBeforeIsRunningCheck(...args);
        }

        if (isRunning) {
            return;
        }
        isRunning = true;

        if (isFunction(onAfterIsRunningCheck)) {
            onAfterIsRunningCheck(...args);
        }

        requestAnimationFrame(() => {
            if (isFunction(onAnimationFrameRequested)) {
                onAnimationFrameRequested(...args);
            }
            isRunning = false;
        });
    };
    return func;
}

/**
 * Partial shallow comparison between objects using the given list of keys.
 */
function _shallowCompareKeys<T>(objA: T, objB: T, keys: IKeyBlacklist<T> | IKeyWhitelist<T>) {
    return _filterKeys(objA, objB, keys).every(key => {
        return objA.hasOwnProperty(key) === objB.hasOwnProperty(key) && objA[key] === objB[key];
    });
}

/**
 * Partial deep comparison between objects using the given list of keys.
 */
function _deepCompareKeys(objA: any, objB: any, keys: string[]): boolean {
    return keys.every(key => {
        return objA.hasOwnProperty(key) === objB.hasOwnProperty(key) && deepCompareKeys(objA[key], objB[key]);
    });
}

function _isSimplePrimitiveType(value: any) {
    return typeof value === "number" || typeof value === "string" || typeof value === "boolean";
}

function _filterKeys<T>(objA: T, objB: T, keys: IKeyBlacklist<T> | IKeyWhitelist<T>) {
    if (_isWhitelist(keys)) {
        return keys.include;
    } else {
        const keysA = Object.keys(objA);
        const keysB = Object.keys(objB);

        // merge keys from both objects into a big set for quick access
        const keySet = _arrayToObject(keysA.concat(keysB));

        // delete blacklisted keys from the key set
        keys.exclude.forEach(key => delete keySet[key]);

        // return the remaining keys as an array
        return Object.keys(keySet) as Array<keyof T>;
    }
}

function _isWhitelist<T>(keys: any): keys is IKeyWhitelist<T> {
    return keys != null && (keys as IKeyWhitelist<T>).include != null;
}

function _arrayToObject(arr: any[]) {
    return arr.reduce((obj: any, element: any) => {
        obj[element] = true;
        return obj;
    }, {});
}

function _getUnequalKeyValues<T extends object>(
    objA: T,
    objB: T,
    keys: Array<keyof T>,
    compareFn: (objA: any, objB: any, key: keyof T) => boolean,
) {
    const unequalKeys = keys.filter(key => !compareFn(objA, objB, key));
    const unequalKeyValues = unequalKeys.map(key => ({
        key,
        valueA: objA[key],
        valueB: objB[key],
    }));
    return unequalKeyValues;
}

function _unionKeys<T extends object>(objA: T, objB: T) {
    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);

    const concatKeys = keysA.concat(keysB);
    const keySet = _arrayToObject(concatKeys);

    return Object.keys(keySet) as Array<keyof T>;
}
