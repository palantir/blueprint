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

import { CLAMP_MIN_MAX } from "../errors";

// only accessible within this file, so use `Utils.isNodeEnv(env)` from the outside.
declare let process: { env: any };

/** Returns whether `process.env.NODE_ENV` exists and equals `env`. */
export function isNodeEnv(env: string) {
    return typeof process !== "undefined" && process.env && process.env.NODE_ENV === env;
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
    if (!isFinite(num)) {
        return 0;
    }
    let e = 1;
    let p = 0;
    while (Math.round(num * e) / e !== num) {
        e *= 10;
        p++;
    }
    return p;
}

const uniqueCountForNamespace = new Map<string, number>();
/** Generate a unique ID within a given namespace, using a simple counter-based implementation to avoid collisions. */
export function uniqueId(namespace: string) {
    const curCount = uniqueCountForNamespace.get(namespace) ?? 0;
    uniqueCountForNamespace.set(namespace, curCount + 1);
    return `${namespace}-${curCount}`;
}
