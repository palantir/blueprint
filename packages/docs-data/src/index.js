/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * @fileoverview Exports JSON data for packages/docs-app
 */

// TODO: migrate this file to ESM in a future major version so we can import
// PACKAGES and SECTIONS directly from navTypes.mts instead of requiring
// a generated CJS bridge file.
module.exports = {
    docsData: require("./generated/docs.json"),
    npmData: require("./generated/npm-data.json"),
    ...require("./generated/nav-constants.js"),
};
