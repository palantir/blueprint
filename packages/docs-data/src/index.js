/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * @fileoverview Exports JSON data for packages/docs-app
 */

const { navigationConfig } = require("./nav.config.js");

module.exports = {
    docsData: require("./generated/docs.json"),
    navigationConfig,
};
