/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const path = require("path");
const webpack = require("webpack");

const REACT = process.env.REACT || "16";

/**
 * This differs significantly from the base webpack config, so we don't even end up extending from it.
 */
module.exports = {
    bail: true,
    context: process.cwd(),
    devtool: "inline-source-map",
    mode: "development",

    resolve: {
        // swap versions of React packages when this env variable is set
        alias:
            REACT === "15"
                ? {
                      // swap enzyme adapter
                      "enzyme-adapter-react-16": "enzyme-adapter-react-15",
                      // use path.resolve for directory (require.resolve returns main file)
                      react: path.resolve(__dirname, "../test-react15/node_modules/react"),
                      "react-dom": path.resolve(__dirname, "../test-react15/node_modules/react-dom"),
                      "react-test-renderer": path.resolve(
                          __dirname,
                          "../test-react15/node_modules/react-test-renderer",
                      ),
                  }
                : {},
        extensions: [".css", ".js", ".ts", ".tsx"],
        fallback: {
            assert: require.resolve("assert/"),
            buffer: false,
            stream: false,
        },
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                use: "source-map-loader",
            },
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                options: {
                    configFile: "test/tsconfig.json",
                    transpileOnly: true,
                },
            },
            {
                test: /\.css$/,
                use: [require.resolve("style-loader"), require.resolve("css-loader")],
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
        ],
    },

    plugins: [
        new webpack.ProvidePlugin({
            process: "process/browser",
        }),

        new ForkTsCheckerWebpackPlugin({
            typescript: {
                configFile: "test/tsconfig.json",
            },
        }),
    ],
};
