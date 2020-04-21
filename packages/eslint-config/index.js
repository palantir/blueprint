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

const path = require("path");

/**
 * Enable @blueprintjs/eslint-plugin.
 * For TS files, configure typescript-eslint, including type-aware lint rules which use the TS program.
 */
module.exports = {
    plugins: ["@blueprintjs"],
    extends: ["plugin:@blueprintjs/recommended"],
    parserOptions: { ecmaVersion: 2017 },
    rules: {
        // HACKHACK: this rule impl has too many false positives
        "@blueprintjs/classes-constants": "off",
    },
    overrides: [
        {
            files: ["*.js"],
            env: {
                node: true,
                es6: true,
            },
        },
        {
            files: ["**/*.{ts,tsx}"],
            env: {
                browser: true,
            },
            plugins: ["@typescript-eslint", "@typescript-eslint/tslint"],
            parser: "@typescript-eslint/parser",
            parserOptions: {
                sourceType: "module",
                project: ["{src,test}/tsconfig.json"],
            },
            rules: {
                // run the tslint rules which are not yet converted (run inside eslint)
                "@typescript-eslint/tslint/config": [
                    "error",
                    {
                        lintFile: path.resolve(__dirname, "./tslint.json"),
                    },
                ],
            },
        },
        {
            files: ["test/**/*"],
            env: {
                browser: true,
                mocha: true,
            },
        },
    ],
};
