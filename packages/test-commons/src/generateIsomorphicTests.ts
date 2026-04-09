/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

import { type ComponentClass, type FC, type ReactNode } from "react";

export function isReactClass(Component: any): Component is ComponentClass<any> {
    return (
        typeof Component !== "undefined" &&
        typeof Component.prototype !== "undefined" &&
        typeof Component.prototype.constructor !== "undefined" &&
        typeof Component.prototype.render !== "undefined"
    );
}

/** Janky heuristic for detecting function components (including forwardRef). */
export function isReactFunctionComponent(Component: any, name: string): Component is FC<any> {
    if (name.charAt(0) !== name.charAt(0).toUpperCase()) {
        return false;
    }
    if (typeof Component === "function" && !isReactClass(Component)) {
        return true;
    }
    // React.forwardRef() returns an object with $$typeof, not a function
    if (typeof Component === "object" && Component !== null && Component.$$typeof === Symbol.for("react.forward_ref")) {
        return true;
    }
    return false;
}

export interface IsomorphicTestConfig {
    /** Required `children` for successful render. */
    children?: ReactNode;
    /** Whether to test `className`. */
    className?: boolean;
    /** Required `props` for successful render. */
    props?: Record<string, unknown>;
    /** Whether to skip this component entirely. */
    skip?: boolean;
}

export interface GenerateIsomorphicTestsOptions {
    /**
     * Exclude these exports from being tested.
     *
     * @default []
     */
    excludedSymbols?: string[];

    /**
     * Whether to try and detect and test function components.
     *
     * @default true
     */
    testFunctionComponents?: boolean;
}

/**
 * Filters a namespace of exports down to just the React component names.
 */
export function getComponentNames<T extends { [name: string]: any }>(
    Components: T,
    options: GenerateIsomorphicTestsOptions = {},
): string[] {
    const { excludedSymbols = [], testFunctionComponents = true } = options;
    return Object.keys(Components)
        .sort()
        .filter(
            name =>
                excludedSymbols.indexOf(name) === -1 &&
                (isReactClass(Components[name]) ||
                    (testFunctionComponents && isReactFunctionComponent(Components[name], name))),
        );
}
