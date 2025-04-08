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
