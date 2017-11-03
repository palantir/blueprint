/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

const baseConfig = require("@blueprintjs/webpack-build-scripts/config.base");
const path = require("path");

module.exports = Object.assign({}, baseConfig, {
    entry: {
        "app": [
            "./src/index.tsx",
            "./src/index.scss"
        ],
    },

    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "./dist"),
    },

    devServer: {
        contentBase: "./dist",
        disableHostCheck: true,
        historyApiFallback: true,
        https: true,
        inline: true,
        stats: "errors-only",
    }
});
