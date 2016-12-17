/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

const Components = require("../dist");
const ReactTestUtils = require("react-addons-test-utils");
const React = require("react");

/*
 * Determines if the passed Component is a React Class or not
 * `ReactTestUtils.isElement()`
 */
const isReactClass = (Component) => {
    return typeof Component !== "undefined"
        && typeof Component.prototype !== "undefined"
        && typeof Component.prototype.constructor !== "undefined"
        && typeof Component.prototype.render !== "undefined"
    ;
};

const customProps = {
    Hotkey: { global: true },
    KeyCombo: { combo: "?" },
};

const customChildren = {
    Popover: [ React.createElement("div", null, null) ],
};

const shallowRenderer = ReactTestUtils.createRenderer();

Object.keys(Components).forEach((ComponentKey) => {
    describe(ComponentKey, () => {
        const Component = Components[ComponentKey];

        if (isReactClass(Component)) {
            it("can be server-rendered", () => {
                const element = React.createElement(
                    Component,
                    customProps[ComponentKey],
                    customChildren[ComponentKey]
                );
                shallowRenderer.render(element);
            });
        }
    });
});
