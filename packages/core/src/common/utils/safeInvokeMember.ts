/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { isFunction } from "../utils";

/**
 * Safely invoke the member function with no arguments, if the object
 * exists and the given key is indeed a function, and return its value.
 * Otherwise, return undefined.
 */
export function safeInvokeMember<T extends { [P in K]?: () => R }, K extends keyof T, R = void>(
    obj: T | undefined,
    key: K,
): R | undefined;
/**
 * Safely invoke the member function with one argument, if the object
 * exists and the given key is indeed a function, and return its value.
 * Otherwise, return undefined.
 *
 * ```js
 * // example usage
 * safeInvokeMember(this.props.inputProps, "onChange", evt);
 * ```
 */
export function safeInvokeMember<T extends { [P in K]?: (a: A) => R }, K extends keyof T, A, R = void>(
    obj: T | undefined,
    key: K,
    arg1: A,
): R | undefined;
/**
 * Safely invoke the member function with two arguments, if the object
 * exists and the given key is indeed a function, and return its value.
 * Otherwise, return undefined.
 */
export function safeInvokeMember<T extends { [P in K]?: (a: A, b: B) => R }, K extends keyof T, A, B, R = void>(
    obj: T | undefined,
    key: K,
    arg1: A,
    arg2: B,
): R | undefined;
/**
 * Safely invoke the member function with three arguments, if the object
 * exists and the given key is indeed a function, and return its value.
 * Otherwise, return undefined.
 */
export function safeInvokeMember<
    T extends { [P in K]?: (a: A, b: B, c: C) => R },
    K extends keyof T,
    A,
    B,
    C,
    R = void
>(obj: T | undefined, key: K, arg1: A, arg2: B, arg3: C): R | undefined;
// tslint:disable-next-line:ban-types
export function safeInvokeMember<T extends { [P in K]?: Function }, K extends keyof T>(
    obj: T | null | undefined,
    key: K,
    ...args: any[]
) {
    if (obj != null) {
        const member = obj[key];
        if (isFunction(member)) {
            return member(...args);
        }
    }
    return undefined;
}
