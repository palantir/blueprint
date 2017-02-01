/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

const React = require("react");
const { createRenderer } = require("react-addons-test-utils");

/**
 * Determines if the passed Component is a React Class or not
 * `TestUtils.isElement()`
 * @returns {boolean}
 */
const isReactClass = (Component) => {
    return typeof Component !== "undefined"
        && typeof Component.prototype !== "undefined"
        && typeof Component.prototype.constructor !== "undefined"
        && typeof Component.prototype.render !== "undefined"
    ;
};

const shallowRenderer = createRenderer();

/**
 * Tests that each ComponentClass in Components can be isomorphically rendered on the server.
 * @param Components        {{ [componentName: string]: any }}              main export from package
 * @param customProps       {{ [componentName: string]: any}}               custom props per component
 * @param customChildren    {{ [componentName: string]: React.ReactNode }}  custom children per component
 */
module.exports = function isotest(Components, customProps, customChildren) {
    Object.keys(Components).forEach((ComponentKey) => {
        const Component = Components[ComponentKey];
        if (isReactClass(Component)) {
            it(`<${ComponentKey}> can be server-rendered`, () => {
                const element = React.createElement(
                    Component,
                    customProps[ComponentKey],
                    customChildren[ComponentKey]
                );
                shallowRenderer.render(element);
            });
        }
    });
};
