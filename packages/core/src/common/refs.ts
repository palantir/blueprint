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

import type * as React from "react";

export function isRefObject<T>(value: React.Ref<T> | undefined): value is React.RefObject<T> {
    return value != null && typeof value !== "function";
}

export function isRefCallback<T>(value: React.Ref<T> | undefined): value is React.RefCallback<T> {
    return typeof value === "function";
}

/**
 * Assign the given ref to a target, either a React ref object or a callback which takes the ref as its first argument.
 */
export function setRef<T>(refTarget: React.Ref<T> | undefined, ref: T | null): void {
    if (isRefObject<T>(refTarget)) {
        // HACKHACK: .current property is readonly
        (refTarget.current as T | null) = ref;
    } else if (isRefCallback(refTarget)) {
        refTarget(ref);
    }
}

/**
 * Utility for merging refs into one singular callback ref.
 * If using in a functional component, would recomend using `useMemo` to preserve function identity.
 */
export function mergeRefs<T>(...refs: Array<React.Ref<T>>): React.RefCallback<T> {
    return value => {
        refs.forEach(ref => {
            setRef(ref, value);
        });
    };
}

export function getRef<T>(ref: T | React.RefObject<T> | null): T | null {
    if (ref === null) {
        return null;
    }

    return (ref as React.RefObject<T>).current ?? (ref as T);
}

/**
 * Creates a ref handler which assigns the ref returned by React for a mounted component to a field on the target object.
 * The target object is usually a component class.
 *
 * If provided, it will also update the given `refProp` with the value of the ref.
 */
export function refHandler<T extends HTMLElement, K extends string>(
    refTargetParent: { [k in K]: T | null },
    refTargetKey: K,
    refProp?: React.Ref<T> | undefined,
): React.RefCallback<T> {
    return (ref: T | null) => {
        refTargetParent[refTargetKey] = ref;
        setRef(refProp, ref);
    };
}
