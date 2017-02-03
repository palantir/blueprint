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
            const tasks = [`sass-compile-w-${project.id}`];
            if (project.id !== "docs") {
                tasks.push("sass-variables", "docs-kss");
            }
            gulp.watch(createSrcGlob(project, "*.scss"), tasks);
        });

        blueprint.projectsWithBlock("typescript").forEach((project) => {
            gulp.watch(createSrcGlob(project, "*.ts{,x}"), [`typescript-compile-w-${project.id}`]);
        });

        const docsCwd = blueprint.findProject("docs").cwd;
        gulp.watch(`${docsCwd}/src/styleguide.md`, ["docs-kss"]);

        // recompile docs CSS when non-docs dist/*.css files change
        gulp.watch("packages/!(docs)/dist/*.css", ["sass-compile-w-docs"]);
    });

    gulp.task("watch", ["watch-files", "webpack-compile-w-docs"]);
};
