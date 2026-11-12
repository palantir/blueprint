/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

// Bundle sizes reported on PRs by .github/workflows/bundle-size.yml. Run
// `pnpm nx run-many -t compile` first; this measures the compiled lib/ output.

// Sibling packages are ignored so each row is only that package's own cost.
const ignore = [
    "react",
    "react-dom",
    "@types/react",
    "@blueprintjs/colors",
    "@blueprintjs/core",
    "@blueprintjs/datetime",
    "@blueprintjs/icons",
    "@blueprintjs/select",
];

const js = (pkg, path = "lib/esm/index.js", importName = "*") => ({
    ignore,
    import: importName,
    name: `@blueprintjs/${pkg}${importName === "*" ? "" : ` ${importName}`}`,
    path: `packages/${pkg}/${path}`,
});

const css = (pkg, file) => ({ name: `@blueprintjs/${pkg} CSS`, path: `packages/${pkg}/lib/css/${file}` });

module.exports = [
    js("core"),
    {
        // Tracks a known problem: importing Button pulls in every icon's paths.
        ...js("core", undefined, "{ Button }"),
        ignore: ignore.filter(dep => dep !== "@blueprintjs/icons"),
        name: "@blueprintjs/core { Button } (with icons)",
    },
    js("core", undefined, "{ Classes }"),
    js("icons", "lib/esm/generated/index.js"),
    js("icons", "lib/esm/generated/index.js", "{ IconNames }"),
    js("datetime"),
    js("select"),
    js("table"),
    js("labs"),
    js("colors"),
    css("core", "blueprint.css"),
    css("datetime", "blueprint-datetime.css"),
    css("select", "blueprint-select.css"),
    css("table", "table.css"),
];
