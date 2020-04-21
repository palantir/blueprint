const config = require("./packages/eslint-config");

const xtends = ["./packages/eslint-config"];

// in CI, we don't wan to run eslint-plugin-prettier because it has a ~50% performance penalty.
// instead, we run yarn format-check at the root to ensure prettier formatting
if (!process.env.CI) {
    xtends.push("plugin:prettier/recommended");
}

module.exports = {
    ...config,
    root: true,
    extends: xtends,
    ignorePatterns: [
        "node_modules",
        "dist",
        "lib",
        "fixtures",
        "coverage",
        "__snapshots__",
        "generated"
    ]
};
