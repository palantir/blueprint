/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 */
"use strict";

module.exports = (gulp, plugins, blueprint) => {
    const mergeStream = require("merge-stream");
    const path = require("path");
    const runSequence = require("run-sequence").use(gulp);
    const webpack = require("webpack");

    const webpackConfig = require("./util/webpack-config");

    function createTypescriptProject(tsConfigPath) {
        return plugins.typescript.createProject(tsConfigPath, {
            typescript: require("typescript"),
        });
    }

    // create a TypeScript project for each project to improve re-compile speed.
    // this must be done outside of a task function so it can be reused across runs.
    blueprint.projectsWithBlock("typescript").forEach((project) => {
        project.typescriptProject = createTypescriptProject(path.join(project.cwd, "tsconfig.json"));
    });

    const lintTask = (project, isDevMode) => (
        gulp.src(blueprint.getTypescriptSources(project, true))
            .pipe(plugins.tslint({
                formatter: "verbose",
                tslint: require("tslint"),
            }))
            .pipe(plugins.tslint.report({ emitError: !isDevMode }))
            .pipe(plugins.count(`${project.id}: ## typescript files linted`))
    );
    // Lint all source files using TSLint
    blueprint.task("typescript", "lint", [], lintTask);
    gulp.task("typescript-lint-docs", () => lintTask(blueprint.findProject("docs"), false));
    gulp.task("typescript-lint-w-docs", () => lintTask(blueprint.findProject("docs"), true));

    const tsDeps = (project) => project.dependencies.map((dep) => `typescript-typings-${dep}`);

    // Compile a TypeScript project using gulp-typescript to individual .js files
    blueprint.task("typescript", "compile", tsDeps, (project, isDevMode) => {
        const srcBuildDir = path.join(project.cwd, "build", "src");
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
            tsResult.js.pipe(plugins.sourcemaps.write()),
            tsResult.dts,
        ]).pipe(gulp.dest(srcBuildDir));
    });

    // Bundle pre-compiled .js files into a global library using webpack
    blueprint.task("typescript", "bundle", ["typescript-compile-*"], (project) => {
        // return a promise to make this generated task asynchronous without access to a stream
        return new Promise((resolve) => {
            webpack(webpackConfig.generateWebpackBundleConfig(project), webpackConfig.webpackDone(resolve));
        });
    });

    // Generate typings for bower by renaming index.d.ts -> project-name.d.ts
    // And also adding TS UMD export: "export as namespace ProjectName"
    blueprint.task("typescript", "typings", ["typescript-bundle-*"], (project) => {
        const srcBuildDir = path.join(project.cwd, "build", "src");
        const globalBuildDir = path.join(project.cwd, "build", "global");
        const indexFilter = plugins.filter([path.join(srcBuildDir, "index.d.ts")], { restore: true });

        return gulp.src(path.join(srcBuildDir, "**", "*.d.ts"))
            .pipe(indexFilter)
            .pipe(plugins.insert.append(`\nexport as namespace ${webpackConfig.globalName(project.id)};\n`))
            .pipe(plugins.rename((f) => (f.basename = `${project.id}.d`)))
            .pipe(indexFilter.restore)
            .pipe(gulp.dest(globalBuildDir));
    });

    blueprint.projectsWithBlock("typescript").forEach((project) => {
        gulp.task(`typescript-watch-${project.id}`, (done) => {
            runSequence(
                // explicitly run these tasks in order because -w tasks have no dependencies
                `typescript-compile-w-${project.id}`,
                `typescript-typings-w-${project.id}`,
                done
            );
        });
    });

    gulp.task("test-typescript-2.0", () => (
        // use typescript@2.0 from root directory + --strictNullChecks
        gulp.src("test/imports.ts")
            .pipe(plugins.typescript({
                noEmitOnError: true,
                strictNullChecks: true,
                typescript: require("typescript"),
            }))
    ));
};
