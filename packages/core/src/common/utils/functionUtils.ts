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

/** Returns whether the value is a function. Acts as a type guard. */
// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunction(value: any): value is Function {
    return typeof value === "function";
}

/**
 * Safely invoke the function with the given arguments, if it is indeed a
 * function, and return its value. Otherwise, return undefined.
 *
 * @deprecated use TypeScript 3.7+ optional call operator func?.()
 */
export function safeInvoke<R>(func: (() => R) | undefined): R | undefined;
export function safeInvoke<A, R>(func: ((arg1: A) => R) | undefined, arg1: A): R | undefined;
export function safeInvoke<A, B, R>(func: ((arg1: A, arg2: B) => R) | undefined, arg1: A, arg2: B): R | undefined;
export function safeInvoke<A, B, C, R>(
    func: ((arg1: A, arg2: B, arg3: C) => R) | undefined,
    arg1: A,
    arg2: B,
    arg3: C,
): R | undefined;
export function safeInvoke<A, B, C, D, R>(
    func: ((arg1: A, arg2: B, arg3: C, arg4: D) => R) | undefined,
    arg1: A,
    arg2: B,
    arg3: C,
    arg4: D,
): R | undefined;
// eslint-disable-next-line @typescript-eslint/ban-types
export function safeInvoke(func: Function | undefined, ...args: any[]) {
    if (isFunction(func)) {
        return func(...args);
    }
    return undefined;
}

/**
 * Safely invoke the provided entity if it is a function; otherwise, return the
 * entity itself.
 *
 * @deprecated use TypeScript 3.7+ optional call operator func?.()
 */
export function safeInvokeOrValue<R>(funcOrValue: (() => R) | R | undefined): R;
export function safeInvokeOrValue<A, R>(funcOrValue: ((arg1: A) => R) | R | undefined, arg1: A): R;
export function safeInvokeOrValue<A, B, R>(funcOrValue: ((arg1: A, arg2: B) => R) | R | undefined, arg1: A, arg2: B): R;
export function safeInvokeOrValue<A, B, C, R>(
    funcOrValue: ((arg1: A, arg2: B, arg3: C) => R) | R | undefined,
    arg1: A,
    arg2: B,
    arg3: C,
): R;
export function safeInvokeOrValue<A, B, C, D, R>(
    funcOrValue: ((arg1: A, arg2: B, arg3: C, arg4: D) => R) | R | undefined,
    arg1: A,
    arg2: B,
    arg3: C,
    arg4: D,
): R;
// eslint-disable-next-line @typescript-eslint/ban-types
export function safeInvokeOrValue(funcOrValue: Function | any | undefined, ...args: any[]) {
    return isFunction(funcOrValue) ? funcOrValue(...args) : funcOrValue;
}
