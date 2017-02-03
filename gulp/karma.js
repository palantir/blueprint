/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 */
"use strict";

module.exports = (blueprint, gulp, plugins) => {
    const karma = require("karma");
    const createConfig = require("./util/karma-config");

    blueprint.defineTaskGroup({
        block: "karma",
        parallel: false,
    }, (project, taskName) => {
        gulp.task(taskName, (done) => {
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
};
