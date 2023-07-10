/*
 * Copyright 2020 Palantir Technologies, Inc. All rights reserved.
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

const config = require("./packages/eslint-config");

const xtends = ["./packages/eslint-config"];
const rules = {
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
};

if (process.env.LINT_SCRIPT) {
    // in CI, we don't wan to run eslint-plugin-prettier because it has a ~50% performance penalty.
    // instead, run yarn format-check at the root to ensure prettier formatting.
    // also, run import/no-cycle only in CI because it is slow.
    rules["import/no-cycle"] = "error";
} else {
    xtends.push("plugin:prettier/recommended");
}

module.exports = {
    ...config,
    root: true,
    extends: xtends,
    rules,
    overrides: [
        {
            files: ["**/test/**/*.{ts,tsx}", "**/test/isotest.js"],
            env: {
                browser: true,
                mocha: true,
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
            env: {
                browser: false,
                node: true,
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
    ],
    ignorePatterns: ["node_modules", "dist", "lib", "fixtures", "coverage", "__snapshots__", "generated"],
};
