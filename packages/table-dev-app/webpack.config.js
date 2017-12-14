/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

const { baseConfig } = require("@blueprintjs/webpack-build-scripts");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const webpack = require("webpack");

module.exports = Object.assign({}, baseConfig, {
    entry: {
         features: [
             "./src/index.scss",
             "./src/features.tsx",
         ],
         index: [
             "./src/index.scss",
             "./src/index.tsx",
         ],
    },

    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "./dist"),
    },

    plugins: baseConfig.plugins.concat([
        new CopyWebpackPlugin([
            // to: is relative to dist/
            { from: "src/index.html", to: "." },
            { from: "src/features.html", to: "." },
        ])
    ]),
});
