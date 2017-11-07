/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

const baseConfig = require("@blueprintjs/webpack-build-scripts/webpack.config.base");
const path = require("path");

module.exports = Object.assign({}, baseConfig, {
    entry: {
        "site-docs": [
            "./src/index.tsx",
            "./src/index.scss"
        ],
    },

    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "./dist"),
        publicPath: "/",
    },

    devServer: {
        contentBase: "./",
        disableHostCheck: true,
        historyApiFallback: true,
        https: false,
        // hot: true,
        index: path.resolve(__dirname, "index.html"),
        inline: true,
        stats: "errors-only",
        open: true,
        overlay: {
            warnings: true,
            errors: true,
        },
        port: 9000,
    }
});
