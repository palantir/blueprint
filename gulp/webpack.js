/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 */
"use strict";

module.exports = (blueprint, gulp, plugins) => {
    const webpack = require("webpack");
    const webpackConfig = require("./util/webpack-config");

    const docsProject = blueprint.findProject("docs");

    const configuration = webpackConfig.generateWebpackTypescriptConfig(docsProject);

    gulp.task("webpack-compile-docs", ["docs"], (callback) => {
        webpack(configuration, webpackConfig.webpackDone(callback));
    });

    gulp.task("webpack-compile-w-docs", (callback) => { // eslint-disable-line no-unused-vars
        // rely on editor for compiler errors during development--this results in _massive_ speed increase
        configuration.ts.transpileOnly = true;
        // never invoke callback so it runs forever!
        webpack(configuration).watch({}, webpackConfig.webpackDone());
    });
};
