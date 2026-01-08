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
            // TODO: Change jsx-a11y rules from "warn" to "error" once existing accessibility issues are resolved
            "jsx-a11y/alt-text": "warn",
            "jsx-a11y/anchor-has-content": "warn",
            "jsx-a11y/anchor-is-valid": "warn",
            "jsx-a11y/aria-activedescendant-has-tabindex": "warn",
            "jsx-a11y/aria-props": "warn",
            "jsx-a11y/aria-proptypes": "warn",
            "jsx-a11y/aria-role": "warn",
            "jsx-a11y/aria-unsupported-elements": "warn",
            "jsx-a11y/click-events-have-key-events": "warn",
            "jsx-a11y/heading-has-content": "warn",
            "jsx-a11y/html-has-lang": "warn",
            "jsx-a11y/iframe-has-title": "warn",
            "jsx-a11y/img-redundant-alt": "warn",
            "jsx-a11y/interactive-supports-focus": "warn",
            "jsx-a11y/label-has-associated-control": "warn",
            "jsx-a11y/media-has-caption": "warn",
            "jsx-a11y/mouse-events-have-key-events": "warn",
            "jsx-a11y/no-access-key": "warn",
            "jsx-a11y/no-autofocus": "warn",
            "jsx-a11y/no-distracting-elements": "warn",
            "jsx-a11y/no-interactive-element-to-noninteractive-role": "warn",
            "jsx-a11y/no-noninteractive-element-interactions": "warn",
            "jsx-a11y/no-noninteractive-element-to-interactive-role": "warn",
            "jsx-a11y/no-noninteractive-tabindex": "warn",
            "jsx-a11y/no-redundant-roles": "warn",
            "jsx-a11y/no-static-element-interactions": "warn",
            "jsx-a11y/role-has-required-aria-props": "warn",
            "jsx-a11y/role-supports-aria-props": "warn",
            "jsx-a11y/scope": "warn",
            "jsx-a11y/tabindex-no-positive": "warn",

            // we have these across the codebase, it's not useful for this repo
            "@blueprintjs/no-deprecated-type-references": "off",
            // Run import/no-cycle only in CI because it is slow.
            "import/no-cycle": process.env.CI ? "error" : "off",
            "no-console": "error",
            // TODO(adahiya): remove this import restriction in Blueprint v6 after dropping CommonJS support
            "no-restricted-imports": [
                "error",
                {
                    message: "lodash-es cannot be imported in CommonJS, use lodash submodules instead",
                    name: "lodash-es",
                },
            ],
        },
        settings: {
            react: {
                version: "detect",
            },
        },
    },
    {
        files: ["**/test/**/*.{ts,tsx,js,mjs}", "**/test/isotest.mjs", "**/vitest.setup.{ts,js,mts,mjs}"],
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
        files: ["**/webpack.config.{js,mjs}", "**/vitest.config.{ts,js,mts,mjs}", "**/scripts/*.{js,mjs}"],
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
