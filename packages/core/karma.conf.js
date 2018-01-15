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
            // deprecated components
            "src/components/popover/*",
            "src/components/tabs/*",
            // TODO (clewis): write tests for these component as part of the 2.0 effort:
            "src/components/popover2/*",
            "src/components/tag-input/*",
            "src/components/tooltip2/*",
        ],
    });
    config.set(baseConfig);
    config.set({
        // overrides here
    });
};
