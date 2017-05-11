/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

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
