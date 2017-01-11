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
                        lines: 80,
                        statements: 80,
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
                    lines: [80, 90],
                    statements: [80, 90],
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
    }

    blueprint.projectsWithBlock("karma").forEach((project) => {
        gulp.task(`karma-${project.id}`, (done) => {
            const server = new karma.Server(createConfig(project), done);
            return server.start();
        });

        gulp.task(`karma-unit-${project.id}`, (done) => {
            const config = Object.assign(createConfig(project), {
                browsers: ["Chrome"],
                client: {
                    mocha: {
                        reporter: "html",
                        ui: "bdd",
                    },
                    useIframe: true,
                },
                reporters: ["mocha"],
                singleRun: false,
            });

            const server = new karma.Server(config, done);
            return server.start();
        });
    });

    gulp.task("karma", (done) => rs(...blueprint.taskMapper("karma", "karma-"), done));
};
