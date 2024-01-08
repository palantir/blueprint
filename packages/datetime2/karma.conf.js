/*
 * Copyright 2022 Palantir Technologies, Inc. All rights reserved.
 */

const MODERATE_COVERAGE_THRESHOLD = {
    lines: 75,
    statements: 75,
};
const LOW_COVERAGE_THRESHOLD = {
    lines: 50,
    statements: 50,
};

module.exports = async function (config) {
    const { createKarmaConfig } = await import("@blueprintjs/karma-build-scripts");
    config.set(
        createKarmaConfig({
            dirname: __dirname,
            coverageExcludes: [
                // don't check barrel files
                "src/**/index.ts",
            ],
            coverageOverrides: {
                // these tests are "good enough"
                "src/components/react-day-picker/datePicker3Caption.tsx": MODERATE_COVERAGE_THRESHOLD,
                "src/dateInput2MigrationUtils.ts": MODERATE_COVERAGE_THRESHOLD,

                // HACKHACK(@adidahiya): need to add more tests here
                "src/components/date-range-picker3/nonContiguousDayRangePicker.tsx": LOW_COVERAGE_THRESHOLD,
                "src/common/dayPickerModifiers.ts": LOW_COVERAGE_THRESHOLD,
            },
        }),
    );
};
