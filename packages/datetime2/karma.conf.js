/*
 * Copyright 2022 Palantir Technologies, Inc. All rights reserved.
 */

const { createKarmaConfig } = require("@blueprintjs/karma-build-scripts");

module.exports = function (config) {
    const baseConfig = createKarmaConfig({
        dirname: __dirname,
        coverageExcludes: [
            // HACKHACK: needs coverage
            "src/components/date-range-input2/*",
        ],
    });
    config.set(baseConfig);
    config.set({
        // overrides here
    });
};
