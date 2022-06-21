/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

module.exports = {
    extends: ["tslint:latest", "tslint-react"],

    defaultSeverity: "error",

    rules: {
        "array-type": {
            options: ["array-simple"],
        },
        ban: {
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
        "member-access": true,
        "no-console": {
            options: ["log", "time", "timeEnd", "trace"],
        },
        "no-default-export": true,
        "no-implicit-dependencies": {
            options: ["dev"],
        },
        "no-invalid-this": {
            options: ["check-function-in-method"],
        },
        "no-submodule-imports": {
            options: [
                "core-js",
                "date-fns",
                "lodash",
                "react-dom",
                "@blueprintjs/table/src",
                "@blueprintjs/test-commons/bootstrap",
                "tsutils",
            ],
        },
        "no-unnecessary-callback-wrapper": true,
        "no-unnecessary-initializer": true,
        "object-literal-sort-keys": true,
        "ordered-imports": {
            options: {
                "import-sources-order": "case-insensitive",
                "module-source-path": "full",
                "named-imports-order": "case-insensitive",
            },
        },
        "prefer-conditional-expression": false,
        "variable-name": {
            options: ["allow-leading-underscore", "allow-pascal-case", "ban-keywords", "check-format"],
        },
    },
};
