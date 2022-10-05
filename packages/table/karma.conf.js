/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

const REACT = process.env.REACT || "16";

module.exports = async function (config) {
    const { createKarmaConfig } = await import("@blueprintjs/karma-build-scripts");
    config.set(
        createKarmaConfig({
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
            coverageExcludes:
                REACT === "15" ? ["src/table2.tsx", "src/table2Utils.ts", "src/cell/editableCell2.tsx"] : [],
        }),
    );
};
