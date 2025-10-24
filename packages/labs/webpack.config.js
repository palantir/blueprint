/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

const path = require("path");

const { baseConfig, COMMON_EXTERNALS } = require("@blueprintjs/webpack-build-scripts");

module.exports = Object.assign({}, baseConfig, {
    entry: { labs: ["./src/index.ts"] },

    externals: COMMON_EXTERNALS,

    output: {
        filename: "[name].bundle.js",
        library: ["Blueprint", "Labs"],
        libraryTarget: "umd",
        path: path.resolve(__dirname, "./dist"),
    },
});
