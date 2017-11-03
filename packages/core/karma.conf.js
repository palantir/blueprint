/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

const { createKarmaConfig } = require("@blueprintjs/karma-build-scripts");
const path = require("path");

module.exports = function (config) {
    const baseConfig = createKarmaConfig(__dirname);
    config.set(baseConfig);
    config.set({
        webpack: Object.assign({}, baseConfig.webpack, {
            entry: {
                core: path.resolve(__dirname, "test/index.ts"),
            },
        }),
    })
};
