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

// One per component folder in packages/core/src/components, plus notable second exports.
const CORE_COMPONENTS = [
    "Alert",
    "Breadcrumbs",
    "Button",
    "Callout",
    "Card",
    "CardList",
    "CheckboxCard",
    "Checkbox",
    "Collapse",
    "ContextMenu",
    "Dialog",
    "Divider",
    "Drawer",
    "EditableText",
    "EntityTitle",
    "FileInput",
    "FormGroup",
    "H1",
    "HotkeysProvider",
    "HTMLSelect",
    "HTMLTable",
    "Icon",
    "IconNext",
    "InputGroup",
    "Link",
    "Menu",
    "MenuItem",
    "MultistepDialog",
    "Navbar",
    "NonIdealState",
    "NumericInput",
    "OverflowList",
    "Overlay2",
    "OverlayToaster",
    "PanelStack2",
    "Popover",
    "PopoverNext",
    "Portal",
    "ProgressBar",
    "RadioGroup",
    "RangeSlider",
    "ResizeSensor",
    "Section",
    "SegmentedControl",
    "Slider",
    "Spinner",
    "Tabs",
    "Tag",
    "TagInput",
    "TextArea",
    "Tooltip",
    "Tree",
];

const css = (pkg, file) => ({ name: `@blueprintjs/${pkg} CSS`, path: `packages/${pkg}/lib/css/${file}` });

module.exports = [
    js("core"),
    {
        // esbuild inlines Icons' lazily loaded path chunks and keeps the static `allPaths` re-export that
        // Rollup drops, so this is the worst case for esbuild apps, not what Vite or webpack load up front.
        ...js("core", undefined, "{ Button }"),
        ignore: ignore.filter(dep => dep !== "@blueprintjs/icons"),
        name: "@blueprintjs/core { Button } (esbuild, incl. lazy icon paths)",
    },
    js("core", undefined, "{ Classes }"),
    ...CORE_COMPONENTS.map(component => js("core", undefined, `{ ${component} }`)),
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
