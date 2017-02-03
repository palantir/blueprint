/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 */
"use strict";

module.exports = (blueprint, gulp, plugins) => {
    const del = require("del");
    const path = require("path");

    const CLEAN_DIRS = ["build", "coverage", "dist", "src/generated"];

    gulp.task("clean", () => {
        const cleanDirs = blueprint.projects.reduce((prev, current) => (
            prev.concat(CLEAN_DIRS.map(dir => path.join(current.cwd, dir)))
        ), ["dist/*"]);
        // force to permit cleaning directories outside cwd
        return del(cleanDirs, { force: true });
    });

    gulp.task("tslint", () => (
        gulp.src(["*.js", "gulp/**/*.js", "packages/*/*.js"])
            .pipe(plugins.tslint({ formatter: "verbose" }))
            .pipe(plugins.tslint.report())
            .pipe(plugins.count("## javascript files linted"))
    ));
};
