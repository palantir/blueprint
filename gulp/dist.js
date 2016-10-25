/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 */
"use strict";

module.exports = (gulp, plugins, blueprint) => {
    const path = require("path");
    const mergeStream = require("merge-stream");

    [
        "major",
        "minor",
        "patch",
    ].forEach((versionBumpType) => {
        gulp.task(`bump-${versionBumpType}-version`, () => {
            const streams = blueprint.projects.map((project) => (
                gulp.src(path.join(project.cwd, "package.json"))
                    .pipe(plugins.bump({ type: versionBumpType }))
                    .pipe(gulp.dest(project.cwd))
            ));
            streams.push(
                gulp.src("package.json")
                    .pipe(plugins.bump({ type: versionBumpType }))
                    .pipe(gulp.dest("."))
            );
            return mergeStream(streams);
        });
    });
};
