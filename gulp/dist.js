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

    blueprint.taskGroup({
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
    blueprint.taskGroup({
        block: "all",
        name: "test-dist",
    }, (project, taskName) => {
        gulp.task(taskName, () => {
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
        });
    });
};
