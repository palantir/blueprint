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

const importPlugin = require("eslint-plugin-import");
const headerPlugin = require("eslint-plugin-header");
const jsDocPlugin = require("eslint-plugin-jsdoc");
const jsxA11yPlugin = require("eslint-plugin-jsx-a11y");
const reactPlugin = require("eslint-plugin-react");
const reactHooksPlugin = require("eslint-plugin-react-hooks");
const globals = require("globals");
const tseslint = require("typescript-eslint");
const blueprintPlugin = require("@blueprintjs/eslint-plugin");
const eslintBuiltinRules = require("./eslint-builtin-rules.js");
const eslintPluginRules = require("./eslint-plugin-rules.js");
const tsEslintRules = require("./typescript-eslint-rules.js");

// ESLint 9 requires all rules with options to have a schema, but
// eslint-plugin-header doesn't do this yet...
headerPlugin.rules.header.meta.schema = false;

module.exports = tseslint.config(
    blueprintPlugin.flatConfigs.recommended,
    importPlugin.flatConfigs.typescript,
    {
        plugins: {
            "@blueprintjs": blueprintPlugin,
            "react-hooks": reactHooksPlugin,
            header: headerPlugin,
            import: importPlugin,
            jsdoc: jsDocPlugin,
            react: reactPlugin,
            "jsx-a11y": jsxA11yPlugin,
        },
        languageOptions: {
            ecmaVersion: 2022,
        },
        settings: {
            "import/internal-regex": "^@blueprintjs",
        },
        rules: {
            // HACKHACK: this rule impl has too many false positives
            "@blueprintjs/classes-constants": "off",
            ...eslintBuiltinRules,
            ...eslintPluginRules,
        },
    },
    {
        files: ["**/*.{js,mjs}"],
        languageOptions: {
            globals: { ...globals.node },
            parserOptions: {
                ecmaVersion: 2022,
                sourceType: "module",
            },
        },
        rules: {
            "import/no-default-export": "off",
        },
    },
    {
        files: ["**/*.{ts,tsx}"],
        ignores: ["**/test/**/*.{ts,tsx}", "**/test/*.{ts,tsx}"],
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
        },
    },
    {
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            globals: { ...globals.browser },
            parser: tseslint.parser,
            parserOptions: {
                projectService: true,
            },
        },
        plugins: {
            "@typescript-eslint": tseslint.plugin,
        },
        rules: {
            ...tsEslintRules,
        },
    },
    {
        files: ["**/test/**/*.{ts,tsx}", "**/test/*.{ts,tsx}"],
        languageOptions: {
            globals: {
                ...globals.env,
                ...globals.mocha,
            },
        },
        rules: {
            "react/display-name": "off",
            "react/jsx-no-bind": "off",
            "react/no-find-dom-node": "off",
        },
    },
);
