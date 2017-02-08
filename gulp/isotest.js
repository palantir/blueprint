/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 */
"use strict";

module.exports = (blueprint, gulp, plugins) => {
    blueprint.defineTaskGroup({
        block: "isotest",
        parallel: false,
    }, (project, taskName) => {
        // be sure to run `gulp tsc` beforehand
        gulp.task(taskName, () => {
            return gulp.src(project.cwd + "test/isotest.js")
                .pipe(plugins.mocha());
        });
    });
};
