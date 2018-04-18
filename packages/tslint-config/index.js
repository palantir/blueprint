/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

module.exports = {
    extends: [
        "tslint:latest",
        "tslint-react",
        "tslint-config-prettier",
        "tslint-plugin-prettier",
        "./blueprint-rules",
    ],

    defaultSeverity: "error",

    rules: {
        "ban": {
            options: [
                ["Object", "assign", "use TS2.1 object spread { ...a, ...b }"],
                ["Object", "getOwnPropertyNames", "use Object.keys()"],
                ["describe", "only", "should not be committed to repo"],
                ["it", "only", "should not be committed to repo"],
                ["test", "only", "should not be committed to repo"],
                // TODO: enable
                // ["assert", "equal", "use assert.strictEqual instead"]
            ],
        },
        "jsx-key": false,
        "linebreak-style": {
            options: ["LF"],
        },
        "no-console": {
            options: ["log", "time", "timeEnd", "trace"],
        },
        "no-default-export": true,

        // TODO: enable this
        "no-implicit-dependencies": false,
        "no-invalid-this": {
            options: ["check-function-in-method"]
        },
        "no-submodule-imports": {
            options: [
                "core-js",
                "documentalist",
                "lodash",
                "react-dom",
                "@blueprintjs/table/src",
                "@blueprintjs/test-commons/bootstrap",
                "react-day-picker/types"
            ]
        },
        "no-unnecessary-callback-wrapper": true,
        "no-unnecessary-initializer": true,
        // TODO: enable no-unused-expression. Currently, a lot of chai assertions are not written as proper statements.
        "no-unused-expression": false,
        "prefer-conditional-expression": false,
        "prettier": {
            options: {
                "printWidth": 120,
                "tabWidth": 4,
                "trailingComma": "all"
            }
        },
        "variable-name": {
            options: [
                "ban-keywords",
                "check-format",
                "allow-leading-underscore",
                "allow-pascal-case"
            ]
        }
    },
    jsRules: {
        "object-literal-sort-keys": false,
        "trailing-comma": false,
    }
};
