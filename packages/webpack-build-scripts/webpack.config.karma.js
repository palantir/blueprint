/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

const { CheckerPlugin } = require("awesome-typescript-loader");
// const CircularDependencyPlugin = require("circular-dependency-plugin");
const path = require("path");
const webpack = require("webpack");

/**
 * This differs significantly from the base webpack config, so we don't even end up extending from it.
 */
module.exports = {
    bail: true,

    devtool: "inline-source-map",

    mode: "development",

    resolve: {
        extensions: [".css", ".js", ".ts", ".tsx"],
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                use: "source-map-loader"
            },
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader",
                options: {
                    configFileName: "./test/tsconfig.json",
                },
            },
            {
                test: /\.css$/,
                use: [
                    require.resolve("style-loader"),
                    require.resolve("css-loader"),
                ],
            },
            {
                enforce: "post",
                test: /src\/.*\.tsx?$/,
                loader: "istanbul-instrumenter-loader",
                options: {
                    esModules: true,
                },
            },
            {
                test: /\.(eot|ttf|woff|woff2|svg|png)$/,
                loader: require.resolve("file-loader"),
            },
        ]
    },

    plugins: [
        new CheckerPlugin(),

        // TODO: enable this
        // new CircularDependencyPlugin({
        //     exclude: /.js|node_modules/,
        //     failOnError: true,
        // }),
    ],
};
