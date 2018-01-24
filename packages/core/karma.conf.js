/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

const { createKarmaConfig } = require("@blueprintjs/karma-build-scripts");
const fs = require("fs");
const path = require("path");

module.exports = function (config) {
    const baseConfig = createKarmaConfig({
        dirname: __dirname,
        coverageExcludes: [
            // not worth full coverage
            "src/accessibility/*",
            "src/common/abstractComponent*",
        ],
    });
    config.set(baseConfig);
    config.set({
        // overrides here
    });
};
