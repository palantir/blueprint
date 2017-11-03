/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

const baseWebpackConfig = require("@blueprintjs/webpack-build-scripts/webpack.config.base");
const { CheckerPlugin } = require("awesome-typescript-loader");
const CircularDependencyPlugin = require("circular-dependency-plugin");
const path = require("path");
const webpack = require("webpack");

module.exports = Object.assign({}, baseWebpackConfig, {
    devtool: "inline-source-map",
    entry: {
        core: path.resolve(process.cwd(), "test/index.ts"),
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
        rules: baseWebpackConfig.module.rules.concat({
            enforce: "post",
            test: /src\/.*\.tsx?$/,
            use: "istanbul-instrumenter-loader",
        }),
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("test"),
            },
        }),

        new CheckerPlugin(),

        new CircularDependencyPlugin({
            exclude: /.js|node_modules/,
            failOnError: true,
        }),

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
    bail: true,
});
