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
                ["_", "extend", "use object spread: { ...a, ...b }"],
                ["_", "isNull", "use plain JS: == null"],
                ["_", "isDefined", "use plain JS: != null"],
                ["Object", "assign", "use object spread: { ...a, ...b }"],
                ["Object", "getOwnPropertyNames", "use Object.keys()"],
                ["describe", "only", "should not be committed to repo"],
                ["it", "only", "should not be committed to repo"],
                ["test", "only", "should not be committed to repo"],
            ],
        },
        "linebreak-style": {
            options: ["LF"],
        },
        "no-console": {
            options: ["log", "time", "timeEnd", "trace"],
        },
        "no-default-export": true,
        "no-implicit-dependencies": {
            options: ["dev"]
        },
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
                "allow-leading-underscore",
                "allow-pascal-case",
                "ban-keywords",
                "check-format",
            ]
        }
    },
    jsRules: {
        "no-console": false,
        "object-literal-sort-keys": false,
        "trailing-comma": false,
    }
};
