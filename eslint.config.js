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
        rules: {
            // we have these across the codebase, it's not useful for this repo
            "@blueprintjs/no-deprecated-type-references": "off",
            // TODO: Update to other option such as oxlint or upcoming capabilities, as this is too slow
            "import/no-cycle": "off",
            "no-console": "error",
        },
        settings: {
            react: {
                version: "detect",
            },
        },
    },
    {
        files: [
            "**/test/**/*.{ts,tsx,js,mjs}",
            "**/test/isotest.mjs",
            "**/vitest.setup.{ts,js,mts,mjs}",
            "**/*.test.{ts,tsx}",
            "**/*TestUtils*.{ts,tsx}",
        ],
        languageOptions: {
            globals: {
                ...globals.browser,
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
        files: [
            "**/webpack.config.{js,mjs}",
            "**/vitest.config.{ts,js,mts,mjs}",
            "**/scripts/*.{js,mjs}",
            "**/src/design-tokens/*.ts",
        ],
        languageOptions: {
            globals: { ...globals.node },
        },
        rules: {
            "import/no-default-export": "off",
            "import/no-extraneous-dependencies": [
                "error",
                {
                    devDependencies: true,
                },
            ],
            "prefer-object-spread": "off",
        },
    },
    {
        files: ["**/*.stories.{ts,tsx}"],
        languageOptions: {
            parserOptions: {
                projectService: false,
                project: `${__dirname}/.storybook/tsconfig.json`,
            },
        },
        rules: {
            "import/no-default-export": "off",
            "sort-keys": "off",
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
