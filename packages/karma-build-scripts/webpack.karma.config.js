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

    // these externals necessary for Enzyme harness
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
                enforce: "post",
                test: /src\/.*\.tsx?$/,
                use: "istanbul-instrumenter-loader",
            },
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("test"),
            },
        }),

        new CheckerPlugin(),

        // TODO: enable this
        // new CircularDependencyPlugin({
        //     exclude: /.js|node_modules/,
        //     failOnError: true,
        // }),

        function() {
            this.plugin("done", function(stats) {
                if (stats.compilation.errors.length > 0) {
                    // tslint:disable-next-line:no-console
                    console.error("ERRORS in compilation. See above.");

                    // Pretend no assets were generated. This prevents the tests
                    // from running making it clear that there were errors.
                    stats.stats = [{
                        assets: [],
                        toJson: function () { return this; }
                    }];
                }
                return stats;
            });
        }
    ],
};
