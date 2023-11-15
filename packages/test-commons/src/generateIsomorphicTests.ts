/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

import { strictEqual } from "assert";
import Enzyme from "enzyme";
import * as React from "react";

function isReactClass(Component: any): Component is React.ComponentClass<any> {
    return (
        typeof Component !== "undefined" &&
        typeof Component.prototype !== "undefined" &&
        typeof Component.prototype.constructor !== "undefined" &&
        typeof Component.prototype.render !== "undefined"
    );
}

/** Janky heuristic for detecting function components. */
function isReactFunctionComponent(Component: any, name: string): Component is React.FC<any> {
    return typeof Component === "function" && name.charAt(0) === name.charAt(0).toUpperCase();
}

export interface IsomorphicTestConfig {
    /** Required `children` for successful render. */
    children?: React.ReactNode;
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
 * Tests that each ComponentClass in Components can be isomorphically rendered on the server.
 *
 * @param Components Namespace import of all components to test.
 * @param config Configuration per component. This is a mapped type supporting all keys in Components.
 * @param options Test generator options.
 */
export function generateIsomorphicTests<T extends { [name: string]: any }>(
    Components: T,
    config: { [P in keyof T]?: IsomorphicTestConfig } = {},
    options: GenerateIsomorphicTestsOptions = {},
) {
    function render(name: string, extraProps?: Record<string, unknown>) {
        const { children, props }: IsomorphicTestConfig = config[name] || {};
        const finalProps = extraProps ? { ...props, ...extraProps } : props;
        // Render to static HTML, just as a server would.
        // We care merely that `render()` succeeds: it can be server-rendered.
        // Errors will fail the test and log full stack traces to the console. Nifty!
        const element = React.createElement(Components[name], finalProps, children);
        return Enzyme.render(element);
    }

    const { excludedSymbols = [], testFunctionComponents = true } = options;

    Object.keys(Components)
        .sort()
        .filter(
            name =>
                excludedSymbols.indexOf(name) === -1 &&
                (isReactClass(Components[name]) ||
                    (testFunctionComponents && isReactFunctionComponent(Components[name], name))),
        )
        .forEach(componentName => {
            const { className, skip }: IsomorphicTestConfig = config[componentName] || {};
            if (skip) {
                it.skip(`<${componentName}>`);
                return;
            }

            it(`<${componentName}>`, () => render(componentName));
            if (className === false) {
                it.skip(`<${componentName} className>`);
            } else {
                it(`<${componentName} className>`, () => {
                    const testClass = "test-test-test";
                    const doc = render(componentName, { className: testClass });
                    strictEqual(doc.find(`.${testClass}`).length + doc.filter(`.${testClass}`).length, 1);
                });
            }
        });
}
