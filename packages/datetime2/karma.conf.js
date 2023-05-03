/*
 * Copyright 2022 Palantir Technologies, Inc. All rights reserved.
 */

module.exports = async function (config) {
    const { createKarmaConfig } = await import("@blueprintjs/karma-build-scripts");
    config.set(
        createKarmaConfig({
            dirname: __dirname,
            coverageOverrides: {
                "src/*": {
                    lines: 75,
                    statements: 75,
                },
            },
        }),
    );
};
