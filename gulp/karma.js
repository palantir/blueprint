/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 */
"use strict";

module.exports = (gulp, plugins, blueprint) => {
    const rs = require("run-sequence").use(gulp);
    const karma = require("karma");
    const webpackConfigGenerator = require("./util/webpack-config");

    function createConfig (project) {
        const webpackConfig = webpackConfigGenerator.generateWebpackKarmaConfig(project);
        // must delete this key in order to resolve root @types packages correctly.
        delete webpackConfig.ts.compilerOptions.typeRoots;

        const resourcesGlob = (project.id === "core" ? "." : "node_modules/@blueprintjs/*");
        const filesToInclude = [
            {
                pattern: "node_modules/**/*.css",
                included: false,
                served: true,
            },
            {
                pattern: resourcesGlob + "/resources/**/*",
                included: false,
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
            browsers: [ "PhantomJS" ],
            browserNoActivityTimeout: 100000,
            client: {
                useIframe: false,
            },
            coverageReporter: {
                check: {
                    each: {
                        statements: 80,
                        lines: 80,
                    },
                },
                reporters: [
                    { type: "html", dir: "coverage" },
                    { type: "lcov" },
                    { type: "text" },
                ],
                includeAllSources: true,
                phantomjsLauncher: {
                    exitOnResourceError: true,
                },
                watermarks: {
                    statements: [80, 90],
                    lines: [80, 90],
                },
            },
            files: filesToInclude,
            frameworks: [ "mocha", "chai", "phantomjs-shim", "sinon" ],
            reporters: [ "mocha", "coverage" ],
            port: 9876,
            // coverage is instrumented in gulp/webpack.js
            preprocessors: {
                "test/**/*.ts": "sourcemap",
                "test/index.ts": "webpack",
            },
            webpack: webpackConfig,
            webpackMiddleware: {
                noInfo: true,
                stats: {
                    children: false,
                    chunks: false,
                },
            },
            singleRun: true,
        };
    }

    blueprint.projectsWithBlock("karma").forEach((project) => {
        gulp.task(`karma-${project.id}`, (done) => {
            const server = new karma.Server(createConfig(project), done);
            return server.start();
        });

        gulp.task(`karma-unit-${project.id}`, (done) => {
            const config = Object.assign(createConfig(project), {
                reporters: [ "mocha" ],
                singleRun: false,
                client: {
                    useIframe: true,
                    mocha: {
                        reporter: "html",
                        ui: "bdd",
                    },
                },
                browsers: ["Chrome"],
            });

            const server = new karma.Server(config, done);
            return server.start();
        });
    });

    gulp.task("karma", (done) => rs(...blueprint.taskMapper("karma", "karma-"), done));
};
