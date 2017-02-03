/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 */
"use strict";

module.exports = (blueprint, gulp, plugins) => {
    var mergeStream = require("merge-stream");
    var path = require("path");

    blueprint.task("copy", "files", [], (project) => {
        // allow for no-op on project dependencies
        if (project.copy === false) {
            return;
        }

        // copy options is a map of file globs to array of dest directories.
        // given: "copy": { "path/to/file.txt": {to: ["foo/bar"], base: "path"} }
        // the file at currProject/path/to/file.txt is copied to currProject/build/foo/bar/to/file.txt
        return mergeStream(Object.keys(project.copy).map((key) => {
            var dests = project.copy[key].to;
            var base = project.copy[key].base || "";
            var stream = gulp.src(path.join(project.cwd, key), { base: path.join(project.cwd, base) });
            dests.forEach((dest) => {
                stream = stream.pipe(gulp.dest(blueprint.destPath(project, dest)));
            });
            return stream;
        })).pipe(plugins.count(`${project.id}: <%= files %> copied`));
    });
};
