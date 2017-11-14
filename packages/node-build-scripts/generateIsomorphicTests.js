#!/usr/bin/env node
/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * @fileoverview Generates isomorphic tests for React components
 */

// TODO: make this an executable script that takes configuration from CLI arguments so we don't need
// to use the `mocha` CLI and write an isotest.js file in every project

const { render } = require("enzyme");
const React = require("react");

/**
 * Determines if the passed Component is a React Class or not
 * `TestUtils.isElement()`
 * @returns {boolean}
 */
function isReactClass(Component) {
    return typeof Component !== "undefined"
        && typeof Component.prototype !== "undefined"
        && typeof Component.prototype.constructor !== "undefined"
        && typeof Component.prototype.render !== "undefined"
    ;
};

/**
 * Tests that each ComponentClass in Components can be isomorphically rendered on the server.
 * @param Components  {{ [name: string]: any }}              main export from package
 * @param props       {{ [name: string]: any }}              custom props per component
 * @param children    {{ [name: string]: React.ReactNode }}  custom children per component
 * @param skipList    {string[]}                             array of component names to skip
 */
module.exports = function generateIsomorphicTests(Components, props, children, skipList = []) {
    Object.keys(Components).sort().forEach((componentName) => {
        const Component = Components[componentName];
        if (isReactClass(Component)) {
            if (skipList.includes(componentName)) {
                it.skip(`<${componentName}>`);
            } else {
                it(`<${componentName}>`, () => {
                    const element = React.createElement(
                        Component,
                        props[componentName],
                        children[componentName]
                    );
                    // render to static HTML, just as a server would.
                    // we care merely that `render()` succeeds: it can be server-rendered.
                    // errors will fail the test and log full stack traces to the console. nifty!
                    render(element);
                });
            }
        }
    });
};
