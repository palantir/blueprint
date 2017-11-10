/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

const { CheckerPlugin } = require("awesome-typescript-loader");
const CircularDependencyPlugin = require("circular-dependency-plugin");
const path = require("path");
const webpack = require("webpack");

/**
 * This differs significantly from the base webpack config, so we don't even end up extending from it.
 */
module.exports = {
    bail: true,

    devtool: "inline-source-map",

    resolve: {
        extensions: [".js", ".ts", ".tsx"],
    },

    // these externals are necessary for Enzyme harness
    externals: {
        "cheerio": "window",
        "react/addons": true,
        "react/lib/ExecutionEnvironment": true,
        "react/lib/ReactContext": true,
        "react-addons-test-utils": true,
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
                test: /\.scss$/,
                use: [
                    require.resolve("style-loader"),
                    require.resolve("css-loader"),
                    require.resolve("sass-loader"),
                ],
            },
            {
                enforce: "post",
                test: /src\/.*\.tsx?$/,
                use: "istanbul-instrumenter-loader",
            },
            {
                test: /\.(eot|ttf|woff|woff2|svg|png)$/,
                loader: require.resolve("file-loader"),
            },
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("test"),
            },
        }),

        // TODO: enable this
        // new CircularDependencyPlugin({
        //     exclude: /.js|node_modules/,
        //     failOnError: true,
        // }),
    ],
};
