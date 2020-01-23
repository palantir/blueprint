/*
 * Copyright 2020 Palantir Technologies, Inc. All rights reserved.
 */

const path = require("path");

const config = {
    testEnvironment: 'node',
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    testRegex: '__tests__\/.+\\.test\\.ts$',
    collectCoverage: false,
    collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    coverageReporters: ['text-summary', 'lcov'],
};

if (process.env.JUNIT_REPORT_PATH) {
    const outputDirectory = path.join(
        __dirname,
        '../..',
        process.env.JUNIT_REPORT_PATH,
        path.basename(__dirname)
    );
    console.info(`Jest report will appear in ${outputDirectory}`);
    config.reporters = [
        'default',,
        ['jest-junit', {
            outputDirectory,
        }]
    ];
}

module.exports = config;
