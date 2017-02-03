/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 */
"use strict";

module.exports = (blueprint, gulp, plugins) => {
    blueprint.taskGroup({
        block: "isotest",
        parallel: false,
    }, (taskName, project) => {
        gulp.task(taskName, [`typescript-compile-${project.id}`], () => {
            return gulp.src(project.cwd + "test.iso/**/*")
                .pipe(plugins.mocha());
        });
    });
};
