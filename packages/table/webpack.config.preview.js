/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const resolve = (p) => path.join(__dirname, "..", p);

module.exports = {

    entry: {
         features: resolve("preview/features.tsx"),
         index: resolve("preview/index.tsx")
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                use: [{
                    loader: "ts-loader",
                    options: {
                        compilerOptions: { declaration: false },
                    },
                }],
            }, {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader",
                }),
            }, {
                test: /\.(eot|ttf|woff|woff2)$/,
                // We need to resolve to an absolute path so that this loader
                // can be applied to CSS in other projects (i.e. packages/core)
                use: [{
                    loader: "file-loader",
                    options: {
                        name: "fonts/[name].[ext]",
                    },
                }],
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
        extensions: [".js", ".ts", ".tsx"],
    },
};
