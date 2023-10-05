/*
 * Copyright 2022 Palantir Technologies, Inc. All rights reserved.
 */

module.exports = async function (config) {
    const { createKarmaConfig } = await import("@blueprintjs/karma-build-scripts");
    config.set(
        createKarmaConfig({
            dirname: __dirname,
            coverageExcludes: [
                // we stub this out in tests because it relies on dynamic imports
                "src/common/dateFnsLocaleUtils.ts",
            ],
            coverageOverrides: {
                "src/*": {
                    lines: 75,
                    statements: 75,
                },
            },
        }),
    );
};
