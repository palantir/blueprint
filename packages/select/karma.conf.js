/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

module.exports = async function (config) {
    const { createKarmaConfig } = await import("@blueprintjs/karma-build-scripts");
    config.set(
        createKarmaConfig({
            dirname: __dirname,
            coverageExcludes: [
                // don't check barrel files or example fixtures
                "src/**/index.ts",
                "src/__examples__/*",
                "src/components/deprecatedAliases.ts",
            ],
        }),
    );
};
