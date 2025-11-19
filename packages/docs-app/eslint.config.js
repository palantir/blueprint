/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

const tseslint = require("typescript-eslint");

const config = require("../../eslint.config.js");

module.exports = tseslint.config([
    config,
    {
        rules: {
            "react/display-name": "off",
            "react/jsx-no-bind": "off",
        },
    },
    {
        files: ["**/examples/**/*.{ts,tsx}"],
        rules: {
            "@typescript-eslint/no-deprecated": "off",
            "header/header": "off",
            "import/no-default-export": "off",
            "no-console": "off",
        },
    },
]);
