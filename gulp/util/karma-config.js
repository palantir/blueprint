/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 */
"use strict";

const COVERAGE_PERCENT = 80;
const COVERAGE_PERCENT_HIGH = 90;

module.exports = function createConfig(project) {
    const webpackConfigGenerator = require("./webpack-config");
    const webpackConfig = webpackConfigGenerator.generateWebpackKarmaConfig(project);
    // must delete this key in order to resolve root @types packages correctly.
    delete webpackConfig.ts.compilerOptions.typeRoots;

    const resourcesGlob = (project.id === "core" ? "." : "node_modules/@blueprintjs/*");
    const filesToInclude = [
        {
            included: false,
            pattern: "node_modules/**/*.css",
            served: true,
        },
        {
            included: false,
            pattern: resourcesGlob + "/resources/**/*",
            served: true,
        },
        "dist/**/*.css",
        "test/index.ts",
    ];

    // include core's CSS in all projects
    if (project.id !== "core") {
        filesToInclude.push("node_modules/@blueprintjs/core/**/*.css");
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
