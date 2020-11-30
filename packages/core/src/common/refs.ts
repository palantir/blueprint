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

export type IRef<T = HTMLElement> = IRefObject<T> | IRefCallback<T>;

// compatible with React.Ref type in @types/react@^16
export interface IRefObject<T = HTMLElement> {
    current: T | null;
}

export function isRefObject<T extends HTMLElement>(value: IRef<T> | undefined | null): value is IRefObject<T> {
    return value != null && typeof (value as IRefObject<T>).current !== "undefined";
}

export type IRefCallback<T = HTMLElement> = (ref: T | null) => any;

export function isRefCallback<T extends HTMLElement>(value: IRef<T> | undefined | null): value is IRefCallback<T> {
    return typeof value === "function";
}

export function getRef<T = HTMLElement>(ref: T | IRefObject<T> | null) {
    if (ref === null) {
        return null;
    }

    return (ref as IRefObject<T>).current ?? (ref as T);
}

export function setRef<T extends HTMLElement>(refTarget: IRef<T>, ref: T | null) {
    if (isRefObject<T>(refTarget)) {
        refTarget.current = ref;
    }
    if (isRefCallback(refTarget)) {
        refTarget(ref);
    }
}

export function refHandler<T extends HTMLElement>(
    refProp: IRef<T> | undefined | null,
    refTargetParent: Record<string, any>,
    refTargetKey: string,
) {
    if (!(refTargetKey in refTargetParent)) {
        throw new Error(`${refTargetKey} does not exists in ${Object.keys(refTargetParent)}`);
    }
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
