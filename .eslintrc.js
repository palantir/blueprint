const config = require("./packages/eslint-config");

const xtends = ["./packages/eslint-config"];
const rules = {};

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
                // HACKHACK: added to reduce diff in https://github.com/palantir/blueprint/pull/4644,
                // can be removed in v4.0
                "deprecation/deprecation": "off",
            },
        },
        {
            files: ["**/webpack.config.js"],
            env: {
                browser: false,
                node: true,
            },
            rules: {
                "prefer-object-spread": "off",
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
