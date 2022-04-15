/**
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
 */

const { createKarmaConfig } = require("@blueprintjs/karma-build-scripts");

module.exports = function (config) {
    const baseConfig = createKarmaConfig({
        dirname: __dirname,
        coverageExcludes: ["src/popover2Arrow.tsx"],
    });
    config.set(baseConfig);
    config.set({
        // overrides here
    });
};
