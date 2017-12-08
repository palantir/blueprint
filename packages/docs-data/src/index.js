/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * @fileoverview Exports JSON data for packages/docs-app
 */

const docsData = require("./generated/docs.json");
const releasesData = require("./generated/releases.json");
const versionsData = require("./generated/versions.json");

module.exports = {
    docsData,
    releasesData,
    versionsData,
};
