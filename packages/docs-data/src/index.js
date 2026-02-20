/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * @fileoverview Exports JSON data for packages/docs-app
 */

module.exports = {
    docsData: require("./generated/docs.json"),
    npmData: require("./generated/npm-data.json"),
    // Note: propsRegistry and pageRegistry are loaded at runtime by webpack's TS compilation.
    // The lazy getters here ensure they work when resolved through the CJS entry.
    get propsRegistry() {
        return require("./generated/propsRegistry").propsRegistry;
    },
    get pageRegistry() {
        return require("./generated/pageRegistry").pageRegistry;
    },
};
