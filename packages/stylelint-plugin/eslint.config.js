const config = require("../../eslint.config.js");
const tseslint = require("typescript-eslint");

module.exports = tseslint.config([
    config,
    {
        rules: {
            "no-duplicate-imports": "off",
            "import/no-default-export": "off",
            "import/no-duplicates": "error",
        },
    },
    {
        ignores: ["node_modules", "dist", "lib", "fixtures", "coverage", "__snapshots__", "generated"],
    },
]);
