/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

const { createKarmaConfig } = require("@blueprintjs/karma-build-scripts");
const path = require("path");
const coreManifest = require("../core/package.json");
const packageManifest = require("./package.json");

module.exports = function (config) {
    const baseConfig = createKarmaConfig({
        coverage: false,
        dirname: __dirname,
    });
    config.set(baseConfig);
    config.set({
        // test task should pass; we intentionally have no tests
        failOnEmptyTestSuite: false,
    });
};
