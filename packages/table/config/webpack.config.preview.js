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
            { loader: "ts-loader", test: /\.tsx?$/ },
        ],
    },

    output: {
        publicPath: "/preview/dist",
        filename: "[name].bundle.js",
        path: resolve("preview/dist")
    }
};
