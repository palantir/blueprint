/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 */
"use strict";

module.exports = (gulp, plugins, blueprint) => {
    const rs = require("run-sequence").use(gulp);
    const mocha = require("gulp-mocha");

    const isotestTaskNames = blueprint.projectsWithBlock("isotest").map((project) => {
        const taskName = `isotest-${project.id}`;
        gulp.task(taskName, [`typescript-compile-${project.id}`], (done) => {
            return gulp.src(project.cwd + "test.iso/**/*")
                .pipe(mocha());
        });
        return taskName;
    });

    gulp.task("isotest", (done) => rs(...isotestTaskNames, done));
};
