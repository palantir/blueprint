/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
