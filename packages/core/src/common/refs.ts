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

export type IRef<T extends HTMLElement = HTMLElement> = IRefObject<T> | IRefCallback<T>;

// compatible with React.Ref type in @types/react@^16
export interface IRefObject<T extends HTMLElement = HTMLElement> {
    current: T | null;
}

export function isRefObject<T extends HTMLElement>(value: IRef<T> | undefined | null): value is IRefObject<T> {
    return value != null && typeof (value as IRefObject<T>).current !== "undefined";
}

export type IRefCallback<T = HTMLElement> = (ref: T | null) => any;

export function isRefCallback<T extends HTMLElement>(value: IRef<T> | undefined | null): value is IRefCallback<T> {
    return typeof value === "function";
}

export function combineRefs<T extends HTMLElement>(ref1: IRefCallback<T>, ref2: IRefCallback<T>) {
    return mergeRefs(ref1, ref2);
}

export function mergeRefs<T extends HTMLElement>(...refs: Array<IRef<T> | null>): IRefCallback<T> {
    return value => {
        refs.forEach(ref => {
            if (isRefCallback(ref)) {
                ref(value);
            } else if (isRefObject(ref)) {
                ref.current = value;
            }
        });
    };
}

export function getRef<T extends HTMLElement>(ref: T | IRefObject<T> | null) {
    if (ref === null) {
        return null;
    }

    return (ref as IRefObject<T>).current ?? (ref as T);
}

/**
 * Assign the given ref to a target, either a React ref object or a callback which takes the ref as its first argument.
 */
export function setRef<T extends HTMLElement>(refTarget: IRef<T> | undefined, ref: T | null) {
    if (refTarget === undefined) {
        return;
    }
    if (isRefObject<T>(refTarget)) {
        refTarget.current = ref;
    } else if (isRefCallback(refTarget)) {
        refTarget(ref);
    }
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
): IRefCallback<T>;
export function refHandler<T extends HTMLElement, K extends string>(
    refTargetParent: { [k in K]: T | IRefObject<T> | null },
    refTargetKey: K,
    refProp: IRef<T> | undefined | null,
): IRef<T>;
export function refHandler<T extends HTMLElement, K extends string>(
    refTargetParent: { [k in K]: T | IRefObject<T> | null },
    refTargetKey: K,
    refProp?: IRef<T> | undefined | null,
) {
    if (isRefObject<T>(refProp)) {
        refTargetParent[refTargetKey] = refProp;
        return refProp;
    }
    return (ref: T | null) => {
        refTargetParent[refTargetKey] = ref;
        if (isRefCallback(refProp)) {
            refProp(ref);
        }
    };
}
