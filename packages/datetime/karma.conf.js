/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

const { createKarmaConfig } = require("@blueprintjs/karma-build-scripts");
const path = require("path");

module.exports = function (config) {
    const baseConfig = createKarmaConfig({
        dirname: __dirname,
    });
    config.set(baseConfig);
    config.set({
        webpack: Object.assign({}, baseConfig.webpack, {
            entry: {
                datetime: [
                    path.resolve(__dirname, "test/index.ts"),
                    path.resolve(__dirname, "../core/lib/css/blueprint.css"),
                    path.resolve(__dirname, "lib/css/blueprint-datetime.css"),
                ],
            },
        }),
    })
};
