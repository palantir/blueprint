/*
 * Copyright 2022 Palantir Technologies, Inc. All rights reserved.
 */

const MODERATE_COVERAGE_THRESHOLD = {
    lines: 75,
    statements: 75,
};

module.exports = async function (config) {
    const { createKarmaConfig } = await import("@blueprintjs/karma-build-scripts");
    config.set(
        createKarmaConfig({
            coverageExcludes: [
                // don't check barrel files
                "src/**/index.ts",
                "src/classes.ts",
            ],
            coverageOverrides: {
                "src/dateInput2MigrationUtils.ts": MODERATE_COVERAGE_THRESHOLD,
            },
            dirname: __dirname,
        }),
    );
    process.env.TZ = "Etc/UTC";
};
