/**
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
 */

const { createKarmaConfig } = require("@blueprintjs/karma-build-scripts");

module.exports = function (config) {
    const baseConfig = createKarmaConfig({
        dirname: __dirname,
        coverageExcludes: ["src/popover2Arrow.tsx"],
        coverageOverrides: {
            "src/customModifiers.ts": {
                lines: 66,
                statements: 66,
            },
        },
    });
    config.set(baseConfig);
    config.set({
        // overrides here
    });
};
