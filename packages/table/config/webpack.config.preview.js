/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

const path = require("path");
const resolve = (p) => path.join(__dirname, "..", p);
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {

    entry: {
         index: resolve("preview/index.tsx"),
         perf: resolve("preview/perf.tsx")
    },

    resolve: {
        extensions: ["", ".js", ".ts", ".tsx"],
        alias: {
            react: resolve("/node_modules/react"),
        },
    },

    ts: {
        compilerOptions: { declaration: false },
    },

    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            }, {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style", "css"),
            }, {
                test: /\.(eot|ttf|woff|woff2)$/,
                // We need to resolve to an absolute path so that this loader
                // can be applied to CSS in other projects (i.e. packages/core)
                loader: require.resolve("file-loader") + "?name=fonts/[name].[ext]"
            },
        ],
    },

    plugins: [
        new ExtractTextPlugin("[name].css"),
    ],

    output: {
        filename: "[name].bundle.js",
        path: resolve("preview/dist/")
    }
};
