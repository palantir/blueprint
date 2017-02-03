/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 */
"use strict";

module.exports = (gulp, plugins, blueprint) => {
    const fs = require("fs");
    const path = require("path");
    const mergeStream = require("merge-stream");
    const webpack = require("webpack");
    const webpackConfig = require("./util/webpack-config");

    const bundleTaskNames = blueprint.projectsWithBlock("typescript").map((project) => {
        const taskName = `bundle-${project.id}`;
        gulp.task(taskName, (done) => {
            webpack(
                webpackConfig.generateWebpackBundleConfig(project),
                webpackConfig.webpackDone(done)
            );
        });
        return taskName;
    });

    gulp.task("bundle", bundleTaskNames);

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

    // asserts that all main fields in package.json reference existing files
    function testDist(project) {
        const pkgJson = require(path.resolve(project.cwd, "package.json"));
        const promises = ["main", "style", "typings"]
            .filter((field) => pkgJson[field] !== undefined)
            .map((field) => {
                const filePath = path.resolve(project.cwd, pkgJson[field]);
                return new Promise((resolve, reject) => {
                    // non-existent file will callback with err; we don't care about actual contents
                    fs.readFile(filePath, (err) => {
                        if (err) {
                            reject(`${pkgJson.name}: "${field}" not found (${pkgJson[field]})`);
                        } else {
                            resolve();
                        }
                    });
                });
            });
        return Promise.all(promises);
    }

    const testDistTasks = blueprint.projects.map((project) => {
        const taskName = `test-dist-${project.id}`;
        gulp.task(taskName, () => testDist(project));
        return taskName;
    });

    gulp.task("test-dist", testDistTasks);
};
