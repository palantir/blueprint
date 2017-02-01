/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 */
"use strict";

module.exports = (gulp, plugins, blueprint) => {
    const rs = require("run-sequence").use(gulp);
    const mocha = require("gulp-mocha");

    blueprint.projectsWithBlock("isotest").forEach((project) => {
        gulp.task(`isotest-${project.id}`, [`typescript-compile-${project.id}`], (done) => {
            return gulp.src(project.cwd + "test.iso/**/*")
                .pipe(mocha());
        });
    });

    gulp.task("isotest", (done) => rs(...blueprint.taskMapper("isotest", "isotest-"), done));
};
