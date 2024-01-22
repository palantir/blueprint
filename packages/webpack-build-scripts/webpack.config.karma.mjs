/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

// @ts-check

import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import { cwd } from "node:process";
import { fileURLToPath } from "node:url";
import webpack from "webpack";

import { sassNodeModulesLoadPaths } from "@blueprintjs/node-build-scripts";

/**
 * This differs significantly from the base webpack config, so we don't even end up extending from it.
 *
 * @type {webpack.Configuration}
 */
export default {
    bail: true,
    context: cwd(),
    devtool: "inline-source-map",
    mode: "development",

    resolve: {
        extensions: [".css", ".js", ".ts", ".tsx"],
        fallback: {
            assert: fileURLToPath(import.meta.resolve("assert/")),
            buffer: false,
            stream: fileURLToPath(import.meta.resolve("stream-browserify")),
        },
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                use: fileURLToPath(import.meta.resolve("source-map-loader")),
            },
            {
                test: /\.tsx?$/,
                loader: fileURLToPath(import.meta.resolve("swc-loader")),
                options: {
                    jsc: {
                        parser: {
                            decorators: true,
                            dynamicImport: true,
                            syntax: "typescript",
                            tsx: true,
                        },
                        // this is important for istanbul comment flags to work correctly
                        preserveAllComments: true,
                        transform: {
                            legacyDecorator: true,
                            react: {
                                refresh: false,
                            },
                        },
                    },
                    module: {
                        type: "commonjs",
                    },
                },
            },
            {
                test: /\.css$/,
                use: [
                    fileURLToPath(import.meta.resolve("style-loader")),
                    fileURLToPath(import.meta.resolve("css-loader")),
                ],
            },
            {
                enforce: "post",
                test: /src\/.*\.tsx?$/,
                loader: fileURLToPath(import.meta.resolve("istanbul-instrumenter-loader")),
                options: {
                    esModules: true,
                },
            },
            {
                // allow some custom styles to be written for tests (sometimes just for debugging purposes)
                test: /\.scss$/,
                use: [
                    fileURLToPath(import.meta.resolve("style-loader")),
                    fileURLToPath(import.meta.resolve("css-loader")),
                    {
                        loader: fileURLToPath(import.meta.resolve("sass-loader")),
                        options: {
                            sassOptions: {
                                includePaths: sassNodeModulesLoadPaths,
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(eot|ttf|woff|woff2|svg|png)$/,
                type: "asset/resource",
                generator: {
                    filename: "assets/[hash][ext][query]",
                },
            },
        ],
    },

    plugins: [
        // Karma requires process.env to be defined
        new webpack.ProvidePlugin({
            process: "process/browser.js",
        }),

        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify("test"),
        }),

        new ForkTsCheckerWebpackPlugin({
            typescript: {
                configFile: "test/tsconfig.json",
            },
        }),
    ],
};
