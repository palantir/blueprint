/* !
 * (c) Copyright 2023 Palantir Technologies Inc. All rights reserved.
 */

const esmTransform = [
    "ts-jest",
    {
        tsconfig: {
            allowJs: true,
            module: "es2020",
        },
    },
];

module.exports = {
    preset: "ts-jest/presets/js-with-ts",
    testEnvironment: "node",
    transform: {
        "^.+\\.mjs$": esmTransform,
        "^.+\\.tsx?$": [
            "ts-jest",
            {
                tsconfig: {
                    allowJs: true,
                },
            },
        ],
    },
    transformIgnorePatterns: ["node_modules/(?!(strip-css-comments|is-regexp)/)"],
};
