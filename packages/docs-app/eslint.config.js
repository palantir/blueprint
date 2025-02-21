const config = require("../../eslint.config.js");
const tseslint = require("typescript-eslint");

module.exports = tseslint.config([
    config,
    {
        rules: {
            "react/display-name": "off",
            "react/jsx-no-bind": "off",
        },
    },
]);
