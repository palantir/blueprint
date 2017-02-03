/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 */
"use strict";

module.exports = (blueprint, gulp, plugins) => {
    const mergeStream = require("merge-stream");
    const path = require("path");

    function createTypescriptProject(tsConfigPath) {
        return plugins.typescript.createProject(tsConfigPath, {
            // ensure that only @types from this project are used (instead of from local symlinked blueprint)
            typeRoots: ["node_modules/@types"],
        });
    }

    // create a TypeScript project for each project to improve re-compile speed.
    // this must be done outside of a task function so it can be reused across runs.
    blueprint.projectsWithBlock("typescript").forEach((project) => {
        const tsconfig = path.join(project.cwd, "tsconfig.json");
        project.typescriptProject = createTypescriptProject(tsconfig);
    });

    const lintTask = (project, isDevMode) => (
        gulp.src(path.join(project.cwd, "!(dist|node_modules|typings)", "**", "*.ts{,x}"))
            .pipe(plugins.tslint({ formatter: "verbose" }))
            .pipe(plugins.tslint.report({ emitError: !isDevMode }))
            .pipe(plugins.count(`${project.id}: ## typescript files linted`))
    );
    // Lint all source files using TSLint
    blueprint.task("typescript", "lint", [], lintTask);
    gulp.task("typescript-lint-docs", () => lintTask(blueprint.findProject("docs"), false));
    gulp.task("typescript-lint-w-docs", () => lintTask(blueprint.findProject("docs"), true));

    // Compile a TypeScript project using gulp-typescript to individual .js files
    blueprint.task("typescript", "compile", ["icons"], (project, isDevMode) => {
        const tsProject = project.typescriptProject;

        const tsResult = tsProject.src()
            .pipe(plugins.sourcemaps.init())
            .pipe(plugins.count(`${project.id}: compiling ## typescript files`))
            .pipe(tsProject());

        if (!isDevMode) {
            // fail the build, don't emit output
            tsResult.on("error", () => process.exit(1));
        }

        // write sourcemaps to .js files; output .js and .d.ts files
        return mergeStream([
            // sourceRoot: https://github.com/floridoo/vinyl-sourcemaps-apply/issues/11#issuecomment-231220574
            tsResult.js.pipe(plugins.sourcemaps.write(".", { sourceRoot: null })),
            tsResult.dts,
        ]).pipe(gulp.dest(blueprint.destPath(project)));
    });
};
