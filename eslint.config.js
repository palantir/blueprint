/*
 * Copyright 2025 Palantir Technologies, Inc. All rights reserved.
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

const globals = require("globals");
const tseslint = require("typescript-eslint");
const config = require("./packages/eslint-config/index.js");

module.exports = tseslint.config([
    config,
    {
        settings: {
            react: {
                version: "detect",
            },
        },
        rules: {
            "no-console": "error",
            // we have these across the codebase, it's not useful for this repo
            "@blueprintjs/no-deprecated-type-references": "off",
            // TODO(adahiya): remove this import restriction in Blueprint v6 after dropping CommonJS support
            "no-restricted-imports": [
                "error",
                {
                    name: "lodash-es",
                    message: "lodash-es cannot be imported in CommonJS, use lodash submodules instead",
                },
            ],
            // Run import/no-cycle only in CI because it is slow.
            "import/no-cycle": process.env.CI ? "error" : "off",
        },
    },
    {
        files: ["**/test/**/*.{ts,tsx,js,mjs}", "**/test/isotest.mjs"],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.mocha,
            },
        },
        rules: {
            // HACKHACK: many test assertions are written with this syntax
            "@typescript-eslint/no-unused-expressions": "off",
            // HACKHACK: test dependencies are only declared at root but used in all packages.
            "import/no-extraneous-dependencies": "off",
        },
    },
    {
        files: ["**/webpack.config.{js,mjs}", "**/scripts/*.{js,mjs}"],
        languageOptions: {
            globals: { ...globals.node },
        },
        rules: {
            "prefer-object-spread": "off",
            "import/no-default-export": "off",
            "import/no-extraneous-dependencies": [
                "error",
                {
                    devDependencies: true,
                },
            ],
        },
    },
    {
        ignores: [
            "**/node_modules",
            "**/dist",
            "**/lib",
            "**/fixtures",
            "**/coverage",
            "**/__snapshots__",
            "**/generated",
        ],
    },
]);
