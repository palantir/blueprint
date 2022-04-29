/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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

const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

const { baseConfig } = require("@blueprintjs/webpack-build-scripts");

module.exports = Object.assign({}, baseConfig, {
    entry: {
        "blueprint-landing": ["./src/index.tsx", "./src/index.scss"],
    },

    // we override module rules since we don't want the asset modules loader to be triggered for inline SVGs
    module: {
        rules: baseConfig.module.rules.slice(0, 3).concat([
            {
                test: /^((?!svgs).)*\.(eot|ttf|woff|woff2|svg|png)$/,
                type: "asset/resource",
                generator: {
                    filename: "assets/[hash][ext][query]",
                },
            },
        ]),
    },

    output: {
        filename: "[name].js",
        publicPath: "",
        path: path.resolve(__dirname, "./dist"),
    },

    plugins: baseConfig.plugins.concat([
        new CopyWebpackPlugin({
            patterns: [
                // to: is relative to dist/
                { from: "src/assets", to: "assets" },
                { from: "src/index.html", to: "." },
            ],
        }),
    ]),
});
