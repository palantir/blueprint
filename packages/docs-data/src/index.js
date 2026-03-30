/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * @fileoverview Exports JSON data for packages/docs-app
 */

// TODO: migrate this file to ESM in a future major version so we can import
// PACKAGES and SECTIONS directly from navTypes.mts instead of requiring
// a generated CJS bridge file.
module.exports = {
    npmData: require("./generated/npm-data.json"),
    // Note: docsData, propsRegistry, and pageRegistry are loaded at runtime by webpack's TS compilation.
    // The lazy getters here ensure they work when resolved through the CJS entry.
    get docsData() {
        return require("./generated/docsData").docsData;
    },
    get propsRegistry() {
        return require("./generated/propsRegistry").propsRegistry;
    },
    get pageRegistry() {
        return require("./generated/pageRegistry").pageRegistry;
    },
};
