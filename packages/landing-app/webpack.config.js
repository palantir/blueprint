/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

const baseConfig = require("@blueprintjs/webpack-build-scripts/webpack.config.base");
const path = require("path");

module.exports = Object.assign({}, baseConfig, {
    entry: {
        "blueprint-landing": [
            "./src/index.tsx",
        ],
    },

    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "./dist"),
        publicPath: "/",
    },
});
