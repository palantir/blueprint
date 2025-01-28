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

const eslintBuiltinRules = require("./eslint-builtin-rules.json");
const eslintPluginRules = require("./eslint-plugin-rules.json");
const tsEslintRules = require("./typescript-eslint-rules.json");

/**
 * Enables @blueprintjs/eslint-plugin.
 *
 * For TS files, configure typescript-eslint, including type-aware lint rules which use the TS program.
 */
module.exports = {
    plugins: ["@blueprintjs", "header", "import", "jsdoc", "react", "react-hooks"],
    extends: ["plugin:@blueprintjs/recommended", "plugin:import/typescript"],
    parserOptions: { ecmaVersion: 2022 },
    settings: {
        "import/internal-regex": "^@blueprintjs",
    },
    rules: {
        // HACKHACK: this rule impl has too many false positives
        "@blueprintjs/classes-constants": "off",
        ...eslintBuiltinRules,
        ...eslintPluginRules,
    },
    overrides: [
        {
            files: ["**/*.{js,mjs}"],
            env: {
                node: true,
            },
            parserOptions: {
                ecmaVersion: 2022,
                sourceType: "module",
            },
            rules: {
                "import/no-default-export": "off",
            },
        },
        {
            files: ["**/*.{ts,tsx}"],
            env: {
                browser: true,
            },
            plugins: ["@typescript-eslint", "deprecation"],
            parser: "@typescript-eslint/parser",
            parserOptions: {
                sourceType: "module",
                project: ["{src,test}/tsconfig.json"],
            },
            rules: {
                ...tsEslintRules,
                "deprecation/deprecation": "error",
            },
        },
        {
            files: ["**/test/**/*.{ts,tsx}", "**/test/*.{ts,tsx}"],
            env: {
                browser: true,
                mocha: true,
            },
            rules: {
                "react/display-name": "off",
                "react/jsx-no-bind": "off",
                "react/no-find-dom-node": "off",
            },
        },
    ],
};
