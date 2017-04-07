/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 */
"use strict";

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

    return {
        basePath: project.cwd,
        browserNoActivityTimeout: 100000,
        browsers: ["PhantomJS"],
        client: {
            useIframe: false,
        },
        coverageReporter: {
            check: {
                each: {
                    lines: 75, // TODO (clewis): Push this back to 79 before merging :)
                    statements: 75, // TODO (clewis): Push this back to 79 before merging :)
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
                lines: [75, 90],  // TODO (clewis): Push this back to 79 before merging :)
                statements: [75, 90], // TODO (clewis): Push this back to 79 before merging :)
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
