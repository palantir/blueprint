/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

/**
 * Enable Blueprint-specific TSLint rules defined in this package.
 */
module.exports = {
    rulesDirectory: "./lib/rules",

    rules: {
        "blueprint-classes-constants": true,
        "blueprint-html-components": true,
        "blueprint-icon-components": false,
    },

    jsRules: {
        "blueprint-classes-constants": true,
    }
};
