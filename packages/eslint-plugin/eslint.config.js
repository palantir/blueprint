const config = require("../../eslint.config.js");
const tseslint = require("typescript-eslint");

module.exports = tseslint.config([
    config,
    {
        rules: {
            "@blueprintjs/classes-constants": "off",
            "@blueprintjs/html-components": "off",
            "@blueprintjs/icon-components": "off",
        },
    },
    {
        ignores: ["node_modules", "dist", "lib", "fixtures", "coverage", "__snapshots__", "generated"],
    },
]);
