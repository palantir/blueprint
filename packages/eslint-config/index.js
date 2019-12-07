/*
 * Copyright 2019 Palantir Technologies, Inc. All rights reserved.
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
    env: {
        browser: true,
        mocha: true,
        node: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:react/recommended",
        "plugin:prettier/recommended"
    ],
    plugins: [
        "@typescript-eslint",
        "@typescript-eslint/tslint",
        "mocha",
        "react",
        "prettier",
        "import"
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2019,
        sourceType: "module",
        ecmaFeatures: {
            jsx: true,

        },
        project: [
            "src/tsconfig.json",
            "test/tsconfig.json",
        ]
    },
    rules: {
        "@typescript-eslint/tslint/config": ["warn", {
          "lintFile": "../../tslint.json",
        }],

        // no-unused-vars conflicts with typescript, tuin off
        // the default and turn on the typescript specific one
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": ["error", {
          "vars": "all",
          "args": "after-used",
          "ignoreRestSiblings": false,
          "argsIgnorePattern": "^_"
        }],

        // default rules: unset rules causing errors
        "no-irregular-whitespace": "off",
        "no-prototype-builtins": "off",

        // react plugin: unset rules causing errors
        "react/display-name": "off",
        "react/no-children-prop": "off",
        "react/no-find-dom-node": "off",
        "react/prop-types": "off",

        // prettier
        "prettier/prettier": ["error", {
            "printWidth": 120,
            "tabWidth": 4,
            "trailingComma": "all"
        }],

        // moved rules from tslint
        "no-restricted-properties": ["error", {
            "object": "_",
            "property": "extend",
            "message": "use object spread: { ...a, ...b }",
        }, {
            "object": "_",
            "property": "isNull",
            "message": "use plain JS: == null",
        }, {
            "object": "_",
            "property": "isDefined",
            "message": "use plain JS: != null",
        }, {
            "object": "Object",
            "property": "assign",
            "message": "use object spread: { ...a, ...b }",
        }, {
            "object": "Object",
            "property": "getOwnPropertyNames",
            "message": "use Object.keys()",
        }, {
            "object": "describe",
            "property": "only",
            "message": "should not be committed to repo",
        }, {
            "object": "it",
            "property": "only",
            "message": "should not be committed to repo",
        }, {
            "object": "test",
            "property": "only",
            "message": "should not be committed to repo",
        }],
        "linebreak-style": ["error"],
        "no-console": ["error", {
            allow: ["info", "warn", "error"]
        }],
        "import/no-default-export": ["error"],
        // to use this theres a bit of fixing up required
        // "import/no-extraneous-dependencies": ["error", {
        //     devDependencies: ["test/**/*.*"]
        // }],
        // this is broken because of fat arrow class functions typescript-eslint#491
        // "no-invalid-this": ["error"],
        "import/no-internal-modules": ["error", {
            allow: [
                "core-js",
                "lodash",
                "react-dom",
                "@blueprintjs/table/src",
                "@blueprintjs/test-commons/bootstrap",
                "tsutils"
            ]
        }],
        "no-undef-init": ["error"],
        "id-blacklist": ["error"],
        "camelcase": ["error", {
            properties: "always"
        }]
    }
}