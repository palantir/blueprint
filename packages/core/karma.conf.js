/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

module.exports = function (config) {
    config.set({
        preprocessors: {
            "**/*.ts": ["typescript"],
        },
        typescriptPreprocessor: {
            options: Object.assign({}, require("../../config/tsconfig.base.json"), {
                declaration: false,
                sourceMap: true,
            }),
            transformPath: function (filePath) {
                return filePath.replace(/\.tsx?$/, ".js");
            },
        },
    })
};
