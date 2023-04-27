/*
 * Copyright 2022 Palantir Technologies, Inc. All rights reserved.
 */

module.exports = async function (config) {
    const { createKarmaConfig } = await import("@blueprintjs/karma-build-scripts");
    config.set(
        createKarmaConfig({
            dirname: __dirname,
            coverageExcludes: [
                // HACKHACK: needs coverage
                "src/components/date-range-input2/*",
                // not worth coverage, fairly simple implementation
                "src/common/timezoneDisplayFormat.ts",
            ],
        }),
    );
};
