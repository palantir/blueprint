/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 */
"use strict";

module.exports = (blueprint, gulp) => {
    const fs = require("fs");
    const path = require("path");
    const mergeStream = require("merge-stream");
    const webpack = require("webpack");
    const webpackConfig = require("./util/webpack-config");

    blueprint.defineTaskGroup({
        block: "typescript",
        name: "bundle",
    }, (project, taskName) => {
        gulp.task(taskName, (done) => {
            webpack(
                webpackConfig.generateWebpackBundleConfig(project),
                webpackConfig.webpackDone(done)
            );
        });
    });

    // asserts that all main fields in package.json reference existing files
    const PACKAGE_MAIN_FIELDS = ["main", "style", "typings", "unpkg"];
    blueprint.defineTaskGroup({
        block: "all",
        name: "test-dist",
    }, (project, taskName) => {
        gulp.task(taskName, () => {
            const pkgJson = require(path.resolve(project.cwd, "package.json"));
            const promises = PACKAGE_MAIN_FIELDS
                .filter((field) => pkgJson[field] !== undefined)
                .map((field) => assertFileExists(
                    path.resolve(project.cwd, pkgJson[field]),
                    `${pkgJson.name}: "${field}" not found (${pkgJson[field]})`
                ));
            // using promises here so errors will be produced for each failing package, not just the first
            return Promise.all(promises);
        });
    });

    function assertFileExists(filePath, errorMessage) {
        return new Promise((resolve, reject) => {
            // non-existent file will callback with err; we don't care about actual contents
            fs.readFile(filePath, (err) => {
                if (err) {
                    reject(errorMessage);
                } else {
                    resolve();
                }
            });
        });
    }
};
