/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Generates isomorphic tests for React components
 */

// TODO: make this an executable script that takes configuration from CLI arguments so we don't need
// to use the `mocha` CLI and write an isotest.js file in every project

import * as Enzyme from "enzyme";
import React16Adapter from "enzyme-adapter-react-16";
import * as React from "react";

Enzyme.configure({ adapter: new React16Adapter() });

/**
 * Determines if the passed Component is a React Class or not
 * `TestUtils.isElement()`
 * @returns {boolean}
 */
function isReactClass(Component: any): boolean {
    return (
        typeof Component !== "undefined" &&
        typeof Component.prototype !== "undefined" &&
        typeof Component.prototype.constructor !== "undefined" &&
        typeof Component.prototype.render !== "undefined"
    );
}

/**
 * Tests that each ComponentClass in Components can be isomorphically rendered on the server.
 * @param Components  main export from package
 * @param props custom props per component
 * @param children custom children per component
 * @param skipList array of component names to skip
 */
export function generateIsomorphicTests(
    Components: { [name: string]: any },
    props: { [name: string]: any },
    children: { [name: string]: React.ReactNode },
    skipList: string[] = [],
) {
    Object.keys(Components)
        .sort()
        .forEach(componentName => {
            const Component = Components[componentName];
            if (isReactClass(Component)) {
                if (skipList.includes(componentName)) {
                    it.skip(`<${componentName}>`);
                } else {
                    it(`<${componentName}>`, () => {
                        const element = React.createElement(Component, props[componentName], children[componentName]);
                        // render to static HTML, just as a server would.
                        // we care merely that `render()` succeeds: it can be server-rendered.
                        // errors will fail the test and log full stack traces to the console. nifty!
                        Enzyme.render(element);
                    });
                }
            }
        });
}
