/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

const { createKarmaConfig } = require("@blueprintjs/karma-build-scripts");

const REACT = process.env.REACT || "16";

module.exports = function (config) {
    const baseConfig = createKarmaConfig({
        dirname: __dirname,
        coverageOverrides: {
            "src/cell/cell*": {
                lines: 70,
            },
            "src/common/clipboard*": {
                lines: 0,
                statements: 0,
            },
            "src/headers/headerCell*": {
                lines: 70,
                statements: 70,
            },
            "src/tableHotkeys*": {
                lines: 70,
                statements: 70,
            },
        },
        coverageExcludes: REACT === "15" ? ["src/table2.tsx", "src/table2Utils.ts", "src/cell/editableCell2.tsx"] : [],
    });
    config.set(baseConfig);
    config.set({
        // overrides here
    });
};
