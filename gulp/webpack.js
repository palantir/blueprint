/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 */
"use strict";

module.exports = (gulp, plugins, blueprint) => {
    // const path = require("path");
    const webpack = require("webpack");
    const webpackConfig = require("./util/webpack-config");

    const docsProject = blueprint.findProject("docs");

    const configuration = webpackConfig.generateWebpackTypescriptConfig(docsProject);

    gulp.task("webpack-compile-docs", (callback) => {
        webpack(configuration, webpackConfig.webpackDone(callback));
    });

    gulp.task("webpack-compile-w-docs", (callback) => { // eslint-disable-line no-unused-vars
        // never invoke callback so it runs forever!
        webpack(configuration).watch({}, webpackConfig.webpackDone());
    });
};
