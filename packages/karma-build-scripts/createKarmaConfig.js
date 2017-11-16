/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

const path = require("path");
const webpack = require("webpack");
const webpackConfig = require("./webpack.karma.config");

const COVERAGE_PERCENT = 80;
const COVERAGE_PERCENT_HIGH = 90;
const KARMA_SERVER_PORT = 9876;

module.exports = function createKarmaConfig(dirname) {
    return {
        basePath: dirname,
        browserNoActivityTimeout: 100000,
        browsers: ["PhantomJS"],
        client: {
            useIframe: false,
        },
        coverageReporter: {
            check: {
                each: {
                    lines: COVERAGE_PERCENT,
                    statements: COVERAGE_PERCENT,
                },
            },
            includeAllSources: true,
            phantomjsLauncher: {
                exitOnResourceError: true,
            },
            reporters: [
                { type: "html", dir: "coverage" },
                { type: "lcov" },
                { type: "text" },
            ],
            watermarks: {
                lines: [COVERAGE_PERCENT, COVERAGE_PERCENT_HIGH],
                statements: [COVERAGE_PERCENT, COVERAGE_PERCENT_HIGH],
            },
        },
        files: [
            {
                included: true,
                pattern: require.resolve("normalize.css/normalize.css"),
                watched: false,
            },
            {
                included: false,
                pattern: path.join(dirname, "resources/**/*"),
                watched: false,
            },
            path.join(dirname, "dist/**/*.css"),
            path.join(dirname, "test/index.ts"),
        ],
        frameworks: ["mocha", "chai", "phantomjs-shim", "sinon"],
        mime: {
            "text/x-typescript": ["ts", "tsx"],
        },
        port: KARMA_SERVER_PORT,
        preprocessors: {
            [path.join(dirname, "test/**/*.ts")]: "sourcemap",
            [path.join(dirname, "test/index.ts")]: "webpack",
        },
        reporters: ["mocha", "coverage"],
        singleRun: true,
        webpack: webpackConfig,
        webpackMiddleware: {
            noInfo: true,
            stats: {
                children: false,
                chunks: false,
            },
        },
    };
};

