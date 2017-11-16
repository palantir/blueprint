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
             "./preview/index.scss",
             "./preview/features.tsx",
         ],
         index: [
             "./preview/index.scss",
             "./preview/index.tsx",
         ],
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: require.resolve("awesome-typescript-loader"),
                options: {
                    configFileName: "./preview/tsconfig.json",
                },
            },
        ].concat(baseConfig.module.rules.slice(1))
    },

    devServer: Object.assign(baseConfig.devServer, {
        contentBase: "./preview",
        index: path.resolve(__dirname, "./preview/index.html"),
    }),

    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "./dist/preview"),
        publicPath: "./",
    },

    plugins: baseConfig.plugins.concat([
        new CopyWebpackPlugin([
            // to: is relative to dist/preview/
            { from: "preview/index.html", to: "." },
        ])
    ]),
});
