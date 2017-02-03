/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 */
"use strict";

module.exports = (blueprint, gulp, plugins) => {
    const path = require("path");

    blueprint.task("isotest", "mocha", ["typescript-compile-*"], (project) => {
        return gulp.src(path.join(project.cwd, "test", "isotest.js"))
            .pipe(plugins.mocha());
    });
};
