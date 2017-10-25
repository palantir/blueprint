/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 */
"use strict";

const path = require("path");

const COVERAGE_PERCENT = 80;
const COVERAGE_PERCENT_HIGH = 90;

module.exports = function createConfig(project) {
    const webpackConfigGenerator = require("./webpack-config");
    const webpackConfig = webpackConfigGenerator.generateWebpackKarmaConfig(project);

    const filesToInclude = [
        {
            included: true,
            pattern: path.resolve("node_modules/normalize.css/normalize.css"),
            watched: false,
        },
        // (core files are inserted here below)
        {
            included: false,
            pattern: "resources/**/*",
            watched: false,
        },
        "dist/**/*.css",
        "test/index.ts",
    ];

    // in all other projects, include core CSS and expose resources
    if (project.id !== "core") {
        filesToInclude.splice(1, 0, {
            included: true,
            pattern: path.resolve("packages/core/dist/*.css"),
            watched: false,
        }, {
            included: false,
            pattern: path.resolve("packages/core/resources/**/*"),
            watched: false,
        });
    }

    // disable code coverage for labs package (but still run tests)
    const coverageCheck = (project.id === "labs" ? {} : {
        each: {
            lines: COVERAGE_PERCENT,
            statements: COVERAGE_PERCENT,
        },
    });

    return {
        basePath: project.cwd,
        browserNoActivityTimeout: 100000,
        browsers: ["PhantomJS"],
        client: {
            useIframe: false,
        },
        coverageReporter: {
            check: coverageCheck,
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
        files: filesToInclude,
        frameworks: ["mocha", "chai", "phantomjs-shim", "sinon"],
        mime: {
            "text/x-typescript": ["ts", "tsx"],
        },
        port: 9876,
        // coverage is instrumented in gulp/webpack.js
        preprocessors: {
            "test/**/*.ts": "sourcemap",
            "test/index.ts": "webpack",
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
