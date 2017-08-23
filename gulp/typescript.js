/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 */
"use strict";

module.exports = (blueprint, gulp, plugins) => {
    const mergeStream = require("merge-stream");
    const path = require("path");

    blueprint.defineTaskGroup({
        block: "all",
        name: "tslint",
        withTasks: ["tslint-gulp"],
    }, (project, taskName) => {
        gulp.task(taskName, () => (
            gulp.src([
                path.join(project.cwd, "!(coverage|dist|node_modules|typings)", "**", "*.{js,jsx,ts,tsx}"),
                // exclude nested dist directories (ex: table/preview/dist)
                "!" + path.join(project.cwd, "*", "dist", "**", "*.{js,jsx,ts,tsx}"),
            ])
                .pipe(plugins.tslint({ formatter: "codeFrame" }))
                .pipe(plugins.tslint.report({ emitError: true }))
                .pipe(plugins.count(`${project.id}: ## files tslinted`))
        ));
    });

    blueprint.defineTaskGroup({
        block: "typescript",
        name: "tsc",
    }, (project, taskName, depTaskNames) => {
        // create a TypeScript project for each project to improve re-compile speed.
        // this must be done outside of a task function so it can be reused across runs.
        const tsconfigPath = path.join(project.cwd, "tsconfig.json");
        project.typescriptProject = plugins.typescript.createProject(tsconfigPath, {
            // ensure that only @types from this project are used (instead of from local symlinked blueprint)
            typeRoots: ["node_modules/@types"],
        });

        gulp.task(taskName, ["icons", ...depTaskNames], () => typescriptCompile(project, false));
        gulp.task(`${taskName}:only`, () => typescriptCompile(project, true));
    });

    // Compile a TypeScript project using gulp-typescript to individual .js files
    function typescriptCompile(project, isDevMode) {
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
    }
};
