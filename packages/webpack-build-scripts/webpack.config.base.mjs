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

// @ts-check

import ReactRefreshPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import autoprefixer from "autoprefixer";
import cssnanoPlugin from "cssnano";
import ForkTsCheckerNotifierPlugin from "fork-ts-checker-notifier-webpack-plugin";
import ForkTsCheckerPlugin from "fork-ts-checker-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { cwd, env } from "node:process";
import ReactRefreshTypeScript from "react-refresh-typescript";
import webpack from "webpack";
import WebpackNotifierPlugin from "webpack-notifier";

import { sassNodeModulesLoadPaths } from "@blueprintjs/node-build-scripts";

import { getPackageName } from "./utils.mjs";

// globals
const IS_PRODUCTION = env.NODE_ENV === "production";
const DEV_PORT = env.PORT || 9001;
const PACKAGE_NAME = getPackageName();

/**
 * Configure plugins loaded based on environment.
 *
 * @type {webpack.WebpackPluginInstance[]}
 */
const plugins = [
    new ForkTsCheckerPlugin(
        IS_PRODUCTION
            ? {
                  async: false,
                  typescript: {
                      configFile: "src/tsconfig.json",
                      memoryLimit: 4096,
                  },
              }
            : {
                  typescript: {
                      configFile: "src/tsconfig.json",
                      memoryLimit: 4096,
                  },
              },
    ),

    // CSS extraction is only enabled in production (see scssLoaders below).
    new MiniCssExtractPlugin({ filename: "[name].css" }),

    // pipe env variables to FE build, with these default values (null means optional)
    new webpack.EnvironmentPlugin({
        NODE_ENV: "development",
        BLUEPRINT_NAMESPACE: null,
        REACT_APP_BLUEPRINT_NAMESPACE: null,
    }),
];

if (!IS_PRODUCTION) {
    plugins.push(
        new ReactRefreshPlugin(),
        new ForkTsCheckerNotifierPlugin({ title: `${PACKAGE_NAME}: typescript`, excludeWarnings: false }),
        new WebpackNotifierPlugin({ title: `${PACKAGE_NAME}: webpack` }),
    );
}

// import.meta.resolve is still experimental under a CLI flag, so we create a require fn instead
// see https://nodejs.org/docs/latest-v16.x/api/esm.html#importmetaresolvespecifier-parent
const require = createRequire(import.meta.url);

// Module loaders for CSS files, used in reverse order: apply PostCSS, then interpret CSS as ES modules
const cssLoaders = [
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
                plugins: [autoprefixer, cssnanoPlugin({ preset: "default" })],
            },
        },
    },
];

// Module loaders for Sass/SCSS files, used in reverse order: compile Sass, then apply CSS loaders
const scssLoaders = [
    ...cssLoaders,
    {
        loader: require.resolve("sass-loader"),
        options: {
            sassOptions: {
                includePaths: sassNodeModulesLoadPaths,
            },
        },
    },
];

export default {
    // to automatically find tsconfig.json
    context: cwd(),

    devtool: IS_PRODUCTION ? false : "inline-source-map",

    devServer: {
        allowedHosts: "all",
        client: {
            overlay: {
                warnings: true,
                errors: true,
            },
            progress: true,
        },
        devMiddleware: {
            index: resolve(cwd(), "src/index.html"),
            stats: "errors-only",
        },
        historyApiFallback: true,
        https: false,
        host: "0.0.0.0",
        hot: true,
        open: false,
        port: DEV_PORT,
        static: {
            directory: resolve(cwd(), "src"),
        },
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
                    getCustomTransformers: () => ({
                        before: IS_PRODUCTION ? [] : [ReactRefreshTypeScript()],
                    }),
                    transpileOnly: !IS_PRODUCTION,
                },
            },
            {
                test: /\.css$/,
                use: cssLoaders,
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
};
