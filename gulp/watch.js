/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 */
"use strict";

module.exports = (gulp, plugins, blueprint) => {
    var path = require("path");

    gulp.task("connect", () => {
        plugins.connect.server({
            root: [
                path.resolve("./"),
            ],
            port: 9000,
            livereload: true,
        });
    });

    gulp.task("watch-files", ["connect"], () => {
        blueprint.projectsWithBlock("sass").forEach((project) => {
            const tasks = [`sass-compile-w-${project.id}`];
            if (project.id !== "docs") {
                tasks.push("sass-variables", "docs-kss");
            }
            gulp.watch(
                [`${project.cwd}/src/**/*.scss`, `!${project.cwd}/src/**/generated/*.scss`],
                tasks
            );
        });

        blueprint.projectsWithBlock("typescript").forEach((project) => {
            gulp.watch(
                blueprint.getTypescriptSources(project, true)
                    .concat(`!${project.cwd}/{bower_components,typings}{,/**}`),
                [`typescript-compile-w-${project.id}`]
            );
        });

        const docsSrcPath = blueprint.findProject("docs").cwd;
        gulp.watch(path.join(docsSrcPath, "src/styleguide.md"), ["docs-kss"]);
    });

    gulp.task("watch", ["watch-files", "webpack-compile-w-docs"]);
};
