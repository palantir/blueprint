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

// in CI, we don't wan to run eslint-plugin-prettier because it has a ~50% performance penalty.
// instead, we run yarn format-check at the root to ensure prettier formatting
const isCI = process.env.NODE_ENV === "test";
const prettierConfig = require("../../.prettierrc.json");

const plugins = ["@typescript-eslint", "@typescript-eslint/tslint", "@blueprintjs"];
const xtends = ["plugin:@blueprintjs/recommended"];

if (!isCI) {
    plugins.push("prettier");
    xtends.push("plugin:prettier/recommended");
}

module.exports = {
    env: {
        browser: true,
    },
    plugins,
    extends: xtends,
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
        ...(isCI
            ? {}
            : {
                  "prettier/prettier": ["error", prettierConfig],
              }),
    },
    overrides: [
        {
            files: ["test/**/*"],
            env: {
                browser: true,
                mocha: true,
            },
            rules: {
                // HACKHACK: this rule is buggy when it sees scoped module names
                "@blueprintjs/classes-constants": "off",
            },
        },
    ],
};
