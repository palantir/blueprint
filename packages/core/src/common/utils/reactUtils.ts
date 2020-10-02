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

import * as React from "react";

/**
 * Returns true if `node` is null/undefined, false, empty string, or an array
 * composed of those. If `node` is an array, only one level of the array is
 * checked, for performance reasons.
 */
export function isReactNodeEmpty(node?: React.ReactNode, skipArray = false): boolean {
    return (
        node == null ||
        node === "" ||
        node === false ||
        (!skipArray &&
            Array.isArray(node) &&
            // only recurse one level through arrays, for performance
            (node.length === 0 || node.every(n => isReactNodeEmpty(n, true))))
    );
}

/**
 * Returns true if children are a mappable children array
 * @internal
 */
export function isReactChildrenElementOrElements(children: React.ReactNode): children is JSX.Element[] | JSX.Element {
    return !isReactNodeEmpty(children, true) && children !== true;
}

/**
 * Converts a React node to an element: non-empty string or number or
 * `React.Fragment` (React 16.3+) is wrapped in given tag name; empty strings
 * and booleans are discarded.
 */
export function ensureElement(child: React.ReactNode | undefined, tagName: keyof JSX.IntrinsicElements = "span") {
    if (child == null || typeof child === "boolean") {
        return undefined;
    } else if (typeof child === "string") {
        // cull whitespace strings
        return child.trim().length > 0 ? React.createElement(tagName, {}, child) : undefined;
    } else if (typeof child === "number" || typeof (child as any).type === "symbol" || Array.isArray(child)) {
        // React.Fragment has a symbol type, ReactNodeArray extends from Array
        return React.createElement(tagName, {}, child);
    } else if (isReactElement(child)) {
        return child;
    } else {
        // child is inferred as {}
        return undefined;
    }
}

export function isReactElement<T = any>(child: React.ReactNode): child is React.ReactElement<T> {
    return (
        typeof child === "object" &&
        typeof (child as any).type !== "undefined" &&
        typeof (child as any).props !== "undefined"
    );
}

/**
 * Represents anything that has a `name` property such as Functions.
 */
export interface INamed {
    name?: string;
}

export function getDisplayName(ComponentClass: React.ComponentType | INamed) {
    return (ComponentClass as React.ComponentType).displayName || (ComponentClass as INamed).name || "Unknown";
}

/**
 * Returns true if the given JSX element matches the given component type.
 *
 * NOTE: This function only checks equality of `displayName` for performance and
 * to tolerate multiple minor versions of a component being included in one
 * application bundle.
 * @param element JSX element in question
 * @param ComponentType desired component type of element
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function isElementOfType<P = {}>(
    element: any,
    ComponentType: React.ComponentType<P>,
): element is React.ReactElement<P> {
    return (
        element != null &&
        element.type != null &&
        element.type.displayName != null &&
        element.type.displayName === ComponentType.displayName
    );
}

/**
 * Returns React.createRef if it's available, or a ref-like object if not.
 */
export function createReactRef<T>() {
    return typeof React.createRef !== "undefined" ? React.createRef<T>() : { current: null };
}

/**
 * Replacement type for { polyfill } from "react-lifecycles-compat" useful in some places where
 * the correct type is not inferred automatically. This should be removed once Blueprint depends on React >= 16.
 * HACKHACK part of https://github.com/palantir/blueprint/issues/4342
 */
export type LifecycleCompatPolyfill<P, T extends React.ComponentClass<P>> = (Comp: T) => T & { [K in keyof T]: T[K] };
