/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const resolve = (p) => path.join(__dirname, "..", p);

module.exports = {

    entry: {
         index: resolve("preview/index.tsx"),
         perf: resolve("preview/perf.tsx")
    },

    module: {
        loaders: [
            {
                loader: "ts-loader",
                test: /\.tsx?$/,
            }, {
                loader: ExtractTextPlugin.extract("style", "css"),
                test: /\.css$/,
            }, {
                // We need to resolve to an absolute path so that this loader
                // can be applied to CSS in other projects (i.e. packages/core)
                loader: require.resolve("file-loader") + "?name=fonts/[name].[ext]",
                test: /\.(eot|ttf|woff|woff2)$/,
            },
        ],
    },

    output: {
        filename: "[name].bundle.js",
        path: resolve("preview/dist/")
    },

    plugins: [
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": process.env.NODE_ENV,
        }),
        new ExtractTextPlugin("[name].css"),
    ],

    resolve: {
        alias: {
            react: resolve("/node_modules/react"),
        },
        extensions: ["", ".js", ".ts", ".tsx"],
    },

    ts: {
        compilerOptions: { declaration: false },
    },
};
