/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 */
"use strict";

module.exports = (gulp, plugins, blueprint) => {
    const path = require("path");
    const rs = require("run-sequence").use(gulp);

    blueprint.task("isotest", "mocha", ["typescript-compile-*"], (project) => {
        return gulp.src(path.join(project.cwd, "test.iso", "index.js"))
            .pipe(plugins.mocha());
    });
};
