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

const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const ForkTsCheckerNotifierWebpackPlugin = require("fork-ts-checker-notifier-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const webpack = require("webpack");
const WebpackNotifierPlugin = require("webpack-notifier");

const { getPackageName } = require("./utils");

// globals
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const DEV_PORT = process.env.PORT || 9000;
const PACKAGE_NAME = getPackageName();

/**
 * Configure plugins loaded based on environment.
 */
const plugins = [
    new ForkTsCheckerWebpackPlugin(
        IS_PRODUCTION
            ? {
                  async: false,
                  typescript: {
                      configFile: "src/tsconfig.json",
                      useTypescriptIncrementalApi: true,
                      memoryLimit: 4096,
                  },
              }
            : {
                  typescript: {
                      configFile: "src/tsconfig.json",
                  },
              },
    ),

    // CSS extraction is only enabled in production (see scssLoaders below).
    new MiniCssExtractPlugin({ filename: "[name].css" }),

    // pipe env variables to FE build, setting defaults where appropriate (null means optional)
    new webpack.EnvironmentPlugin({
        NODE_ENV: "development",
        BLUEPRINT_NAMESPACE: null,
        REACT_APP_BLUEPRINT_NAMESPACE: null,
    }),
];

if (!IS_PRODUCTION) {
    plugins.push(
        new ReactRefreshWebpackPlugin(),
        new ForkTsCheckerNotifierWebpackPlugin({ title: `${PACKAGE_NAME}: typescript`, excludeWarnings: false }),
        new WebpackNotifierPlugin({ title: `${PACKAGE_NAME}: webpack` }),
        new webpack.HotModuleReplacementPlugin(),
    );
}

// Module loaders for .scss files, used in reverse order:
// compile Sass, apply PostCSS, interpret CSS as modules.
const scssLoaders = [
    // Only extract CSS to separate file in production mode.
    IS_PRODUCTION
        ? {
              loader: MiniCssExtractPlugin.loader,
          }
        : require.resolve("style-loader"),
    {
        loader: require.resolve("css-loader"),
        options: {
            // necessary to minify @import-ed files using cssnano
            importLoaders: 1,
        },
    },
    {
        loader: require.resolve("postcss-loader"),
        options: {
            postcssOptions: {
                plugins: [require("autoprefixer"), require("cssnano")({ preset: "default" })],
            },
        },
    },
    require.resolve("sass-loader"),
];

module.exports = {
    // to automatically find tsconfig.json
    context: process.cwd(),

    devtool: IS_PRODUCTION ? false : "inline-source-map",

    devServer: {
        contentBase: "./src",
        disableHostCheck: true,
        historyApiFallback: true,
        https: false,
        hot: true,
        index: path.resolve(__dirname, "src/index.html"),
        inline: true,
        stats: "errors-only",
        open: false,
        overlay: {
            warnings: true,
            errors: true,
        },
        port: DEV_PORT,
    },

    mode: IS_PRODUCTION ? "production" : "development",

    module: {
        rules: [
            {
                test: /\.js$/,
                use: require.resolve("source-map-loader"),
            },
            {
                test: /\.tsx?$/,
                loader: require.resolve("ts-loader"),
                options: {
                    configFile: "src/tsconfig.json",
                    transpileOnly: true,
                },
            },
            {
                test: /\.scss$/,
                use: scssLoaders,
            },
            {
                test: /\.(eot|ttf|woff|woff2|svg|png|gif|jpe?g)$/,
                type: "asset/resource",
                generator: {
                    filename: "assets/[name][ext][query][hash]",
                },
            },
        ],
    },

    plugins,

    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".scss"],
    },

    // add support for IE11 (otherwise, webpack 5 uses some ES2015 syntax by default)
    target: ["web", "es5"],
};
