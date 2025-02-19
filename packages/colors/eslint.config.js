const config = require("../../eslint.config.js");
const tseslint = require("typescript-eslint");

module.exports = tseslint.config([
    config,
    {
        ignores: ["node_modules", "dist", "lib", "fixtures", "coverage", "__snapshots__", "generated"],
    },
]);
