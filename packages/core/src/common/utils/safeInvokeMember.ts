/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
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

import { isFunction } from "./functionUtils";

/*
Understanding the types here:

`<Object, Key, ...Args, Return>`

`{ [k in K]?: (a: A) => R }`: This is a MAPPED TYPE that enforces that keys `K`
are all optional member functions with the given signature. The type `k` is only
used in the mapping definition.

`K extends keyof T`: A subset of the keys of the object `T`. The mapped type
above then imposes a restriction on the _values_ of these keys in `T`. Note that
`safeInvokeMember` only supports a single key, so the subset here has exactly
one item.
*/

/**
 * Safely invoke the member function with no arguments, if the object
 * exists and the given key is indeed a function, and return its value.
 * Otherwise, return `undefined`.
 *
 * @deprecated use TypeScript 3.7+ optional chaining and optional call operator obj?[key]?.()
 */
export function safeInvokeMember<T extends { [k in K]?: () => R }, K extends keyof T, R = void>(
    obj: T | undefined,
    key: K,
): R | undefined;
/**
 * Safely invoke the member function with one argument, if the object
 * exists and the given key is indeed a function, and return its value.
 * Otherwise, return `undefined`.
 *
 * ```js
 * // example usage
 * safeInvokeMember(this.props.inputProps, "onChange", evt);
 * ```
 *
 * @deprecated use TypeScript 3.7+ optional chaining and optional call operator obj?[key]?.()
 */
export function safeInvokeMember<T extends { [k in K]?: (a: A) => R }, K extends keyof T, A, R = void>(
    obj: T | undefined,
    key: K,
    arg1: A,
): R | undefined;
/**
 * Safely invoke the member function with two arguments, if the object
 * exists and the given key is indeed a function, and return its value.
 * Otherwise, return `undefined`.
 *
 * @deprecated use TypeScript 3.7+ optional chaining and optional call operator obj?[key]?.()
 */
export function safeInvokeMember<T extends { [k in K]?: (a: A, b: B) => R }, K extends keyof T, A, B, R = void>(
    obj: T | undefined,
    key: K,
    arg1: A,
    arg2: B,
): R | undefined;
/**
 * Safely invoke the member function with three arguments, if the object
 * exists and the given key is indeed a function, and return its value.
 * Otherwise, return undefined.
 *
 * @deprecated use TypeScript 3.7+ optional chaining and optional call operator obj?[key]?.()
 */
export function safeInvokeMember<
    T extends { [k in K]?: (a: A, b: B, c: C) => R },
    K extends keyof T,
    A,
    B,
    C,
    R = void
>(obj: T | undefined, key: K, arg1: A, arg2: B, arg3: C): R | undefined;
// eslint-disable-next-line @typescript-eslint/ban-types
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
