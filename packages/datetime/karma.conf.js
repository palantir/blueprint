/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

const LOW_COVERAGE_THRESHOLD = {
    lines: 50,
    statements: 50,
};

module.exports = async function (config) {
    const { createKarmaConfig } = await import("@blueprintjs/karma-build-scripts");
    config.set(
        createKarmaConfig({
            coverageExcludes: [
                // don't check barrel files
                "src/**/index.ts",
                // not worth coverage, fairly simple implementation
                "src/common/timezoneDisplayFormat.ts",
                "src/common/classes.ts",
                // these functions are mocked out in tests to avoid using dynamic imports
                "src/common/dateFnsLocaleUtils.ts",
            ],
            coverageOverrides: {
                // HACKHACK: need to add more tests here
                "src/common/dayPickerModifiers.ts": LOW_COVERAGE_THRESHOLD,
                "src/components/timezone-select/timezoneSelect.tsx": {
                    statements: 75,
                },
            },
            dirname: __dirname,
        }),
    );
    process.env.TZ = "Etc/UTC";
};
