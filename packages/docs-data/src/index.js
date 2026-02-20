/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * @fileoverview Exports JSON data for packages/docs-app
 */

module.exports = {
    docsData: require("./generated/docs.json"),
    npmData: require("./generated/npm-data.json"),
    // Note: propsRegistry is loaded at runtime by webpack's TS compilation,
    // not through this CJS entry. The export here is a placeholder for type alignment.
    get propsRegistry() {
        // Lazy getter; in practice docs-app loads the TS source directly via webpack
        return require("./generated/propsRegistry").propsRegistry;
    },
};
