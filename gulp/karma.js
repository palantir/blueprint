/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 */
"use strict";

module.exports = (gulp, plugins, blueprint) => {
    const rs = require("run-sequence").use(gulp);
    const karma = require("karma");
    const createConfig = require("./util/create-config");

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
