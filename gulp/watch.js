/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 */
"use strict";

module.exports = (blueprint, gulp, plugins) => {
    const path = require("path");

    function createSrcGlob(project, filename) {
        // `src/` directory and non-`generated/` subdirs
        return `${project.cwd}/src/{,!(generated)/**/}${filename}`;
    }

    gulp.task("connect", () => {
        plugins.connect.server({
            livereload: true,
            port: 9000,
            root: [
                path.resolve("./"),
            ],
        });
    });

    gulp.task("watch-files", ["connect"], () => {
        blueprint.projectsWithBlock("sass").forEach((project) => {
            const tasks = [`sass-${project.id}:only`];
            if (project.id === "core") {
                tasks.push("sass-variables");
            }
            gulp.watch(createSrcGlob(project, "*.scss"), tasks);
        });

        blueprint.projectsWithBlock("typescript").forEach((project) => {
            gulp.watch(createSrcGlob(project, "*.ts{,x}"), [`tsc-${project.id}:only`]);
        });

        gulp.watch("packages/*/!(node_modules)/**/*.md", ["docs-json"]);

        // recompile docs CSS when non-docs-site dist/*.css files change
        gulp.watch("packages/!(docs-site)/dist/*.css", ["sass-docs-site:only"]);
    });

    gulp.task("watch", ["watch-files", "webpack-docs-watch"]);
};
