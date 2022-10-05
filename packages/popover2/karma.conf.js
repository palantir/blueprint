/**
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
 */

module.exports = async function (config) {
    const { createKarmaConfig } = await import("@blueprintjs/karma-build-scripts");
    config.set(
        createKarmaConfig({
            dirname: __dirname,
            coverageExcludes: ["src/popover2Arrow.tsx"],
            coverageOverrides: {
                "src/customModifiers.ts": {
                    lines: 66,
                    statements: 66,
                },
            },
        }),
    );
};
