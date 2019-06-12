/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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
