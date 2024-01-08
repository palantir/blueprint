/*
 * Copyright 2023 Palantir Technologies Inc. All rights reserved.
 */

/**
 * Jest configuration to load ESM modules and transpile TypeScript via SWC.
 *
 * @see https://github.com/swc-project/jest
 */
module.exports = {
    extensionsToTreatAsEsm: [".ts", ".tsx"],
    testEnvironment: "node",
    rootDir: process.cwd(),
    moduleFileExtensions: ["js", "mjs", "ts", "tsx"],
    transform: {
        ".*\\.(tsx?|mjs)$": "@swc/jest",
    },
    transformIgnorePatterns: ["node_modules/(?!(strip-css-comments|is-regexp)/)"],
};
