const config = require("../../eslint.config.js");
const tseslint = require("typescript-eslint");

module.exports = tseslint.config([
    config,
    {
        ignores: ["src/type-utils/*"],
    },
]);
