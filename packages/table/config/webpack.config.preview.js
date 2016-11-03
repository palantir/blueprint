/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

const path = require("path");
const resolve = (p) => path.join(__dirname, "..", p);

module.exports = {

    entry: {
         index: resolve("preview/index.tsx"),
         perf: resolve("preview/perf.tsx")
    },

    resolve: {
        extensions: ["", ".js", ".ts", ".tsx"],
        alias: {
            react: resolve("/node_modules/react"),
        },
    },

    ts: {
        compilerOptions: { declaration: false },
    },

    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            {
                test: /\.(eot|ttf|woff|woff2)$/,
                // We need to resolve to an absolute path so that this loader
                // can be applied to CSS in other projects (i.e. packages/core)
                loader: require.resolve("base64-font-loader")
            },
        ],
    },

    output: {
        publicPath: "preview/dist/",
        filename: "[name].bundle.js",
        path: resolve("preview/dist/")
    }
};
