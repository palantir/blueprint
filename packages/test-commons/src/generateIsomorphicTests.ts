/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Generates isomorphic tests for React components.
 */

import "../../bootstrap";

import { equal } from "assert";
import * as Enzyme from "enzyme";
import * as React from "react";

function isReactClass(Component: any): Component is React.ComponentClass<any> {
    return (
        typeof Component !== "undefined" &&
        typeof Component.prototype !== "undefined" &&
        typeof Component.prototype.constructor !== "undefined" &&
        typeof Component.prototype.render !== "undefined"
    );
}

export interface IIsomorphicTestConfig {
    /** Required `children` for successful render. */
    children?: React.ReactNode;
    /** Whether to test `className`. */
    className?: boolean;
    /** Required `props` for successful render. */
    props?: object;
    /** Whether to skip this component entirely. */
    skip?: boolean;
}

/**
 * Tests that each ComponentClass in Components can be isomorphically rendered on the server.
 */
export function generateIsomorphicTests<T extends { [name: string]: any }>(
    /** Namespace import of all components to test. */
    Components: T,
    /** Configuration per component. This is a mapped type supporting all keys in `Components`. */
    config: { [P in keyof T]?: IIsomorphicTestConfig } = {},
) {
    function render(name: string, extraProps?: object) {
        const { children, props }: IIsomorphicTestConfig = config[name] || {};
        const finalProps = extraProps ? { ...props, ...extraProps } : props;
        // Render to static HTML, just as a server would.
        // We care merely that `render()` succeeds: it can be server-rendered.
        // Errors will fail the test and log full stack traces to the console. Nifty!
        const element = React.createElement(Components[name], finalProps, children);
        return Enzyme.render(element);
    }

    Object.keys(Components)
        .sort()
        .filter(name => isReactClass(Components[name]))
        .forEach(componentName => {
            const { className, skip }: IIsomorphicTestConfig = config[componentName] || {};
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
                    equal(doc.find(`.${testClass}`).length + doc.filter(`.${testClass}`).length, 1);
                });
            }
        });
}
