/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 */
"use strict";

module.exports = (gulp, plugins, blueprint) => {
    const rs = require("run-sequence").use(gulp);
    const karma = require("karma");
    const karmaConfig = require("./util/karma-config");

    blueprint.projectsWithBlock("karma").forEach((project) => {
        gulp.task(`karma-unit-${project.id}`, (done) => {
            const config = Object.assign(karmaConfig(project), {
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

    const karmaTaskNames = blueprint.projectsWithBlock("karma").map((project) => {
        const taskName = `karma-${project.id}`;
        gulp.task(taskName, (done) => {
            const server = new karma.Server(karmaConfig(project), done);
            return server.start();
        });
        return taskName;
    });

    // running in sequence so output is human-friendly
    // (in parallel, all suites get interspersed and it's a mess)
    gulp.task("karma", (done) => rs(...karmaTaskNames, done));
};
