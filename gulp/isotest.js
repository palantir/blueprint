/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 */
"use strict";

module.exports = (blueprint, gulp, plugins) => {
    blueprint.defineTaskGroup({
        block: "isotest",
        parallel: false,
    }, (project, taskName) => {
        gulp.task(taskName, [`typescript-compile-${project.id}`], () => {
            return gulp.src(project.cwd + "test.iso/**/*")
                .pipe(plugins.mocha());
        });
    });
};
