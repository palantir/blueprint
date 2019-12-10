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
        "plugin:@typescript-eslint/recommended",
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
        // run the tslint rules which are not yet converted (run inside eslint)
        "@typescript-eslint/tslint/config": ["error", {
          "rules": {
                "no-implicit-dependencies": {
                    options: ["dev", ["chai", "sinon", "prop-types"]]
                },
                "no-invalid-this": {
                    options: ["check-function-in-method"]
                },
                "no-unnecessary-callback-wrapper": true,
                "prefer-conditional-expression": false,
            }
        }],

        // no-unused-vars conflicts with typescript, tuin off
        // the default and turn on the typescript specific one
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": ["error", {
          "vars": "all",
          "args": "after-used",
          "ignoreRestSiblings": true,
          "argsIgnorePattern": "^_"
        }],

        // default rules: unset rules causing errors
        "no-irregular-whitespace": "off",
        "no-prototype-builtins": "off",
        "no-case-declarations": "off",

        // @typescript-eslint rules: unset rules causing errors
        "@typescript-eslint/no-use-before-define": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-empty-interface": "off",
        "@typescript-eslint/no-non-null-assertion": "off",

        // it would be nice to turn these ones back on at some point
        "@typescript-eslint/no-inferrable-types": "off",
        "prefer-spread": "off", // partially covered by no-restricted-properties

        // react plugin: unset rules causing errors
        "react/display-name": "off",
        "react/no-children-prop": "off",
        "react/no-find-dom-node": "off",
        "react/prop-types": "off",
        "react/no-deprecated": "off",
        "no-useless-escape": "off",
        "no-constant-condition": "off",
        "react/no-unescaped-entities": "off",

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
        }],

        "@typescript-eslint/interface-name-prefix": ["error", {
            "prefixWithI": "always"
        }],
    }
}