const config = require("./packages/eslint-config");

const xtends = ["./packages/eslint-config"];
const plugins = [];
const settings = {};
const rules = {};

if (process.env.CI) {
    // in CI, we don't wan to run eslint-plugin-prettier because it has a ~50% performance penalty.
    // instead, run yarn format-check at the root to ensure prettier formatting.
    // also, run import/no-cycle only in CI because it is slow.
    xtends.push("plugin:import/typescript");
    plugins.push(
        "import"
    );
    rules["import/no-cycle"] = "error";
    settings["import/internal-regex"] = "^@blueprintjs";
} else {
    xtends.push("plugin:prettier/recommended");
}

module.exports = {
    ...config,
    root: true,
    extends: xtends,
    plugins,
    rules,
    settings,
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
