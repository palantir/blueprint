/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

module.exports = async function (config) {
    const { createKarmaConfig } = await import("@blueprintjs/karma-build-scripts");
    config.set(
        createKarmaConfig({
            dirname: __dirname,
            coverageExcludes: [
                // don't check barrel files
                "src/**/index.ts",
                // not worth coverage, fairly simple implementation
                "src/common/timezoneDisplayFormat.ts",
            ],
            coverageOverrides: {
                "src/components/timezone-select/timezoneSelect.tsx": {
                    statements: 75,
                },
            },
        }),
    );
};
