/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

module.exports = {
    plugins: [
        require("autoprefixer"),
    ],
    autoprefixer: {
        browsers: [
            "> 1%",
            "last 2 versions",
            "Firefox ESR",
            "Opera 12.1",
        ],
    },
};
