/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

const baseConfig = require("./webpack.config.base");
const karmaConfig = require("./webpack.config.karma");
const COMMON_EXTERNALS = require("./externals");

module.exports = {
    baseConfig,
    karmaConfig,
    COMMON_EXTERNALS,
};
