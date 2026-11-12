/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

// Bundle sizes reported on PRs by .github/workflows/bundle-size.yml. Run
// `pnpm nx run-many -t compile` first; this measures the compiled lib/ output.
// JS only, bundled with Rolldown (Vite 8's bundler), counting only the chunks loaded up front.

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
    // Without `entry`, lazily imported chunks (e.g. icon paths) would be counted too.
    entry: ["index"],
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

module.exports = [
    js("core"),
    js("core", undefined, "{ Classes }"),
    ...CORE_COMPONENTS.map(component => js("core", undefined, `{ ${component} }`)),
    js("icons", "lib/esm/generated/index.js"),
    js("icons", "lib/esm/generated/index.js", "{ IconNames }"),
    {
        // What core's Icon pulls in from icons, paid once by any app that renders an icon.
        ...js("icons", "lib/esm/generated/index.js", "{ Icons, SVGIconContainer }"),
        name: "@blueprintjs/icons { Icons, SVGIconContainer } (used by core's Icon)",
    },
    js("datetime"),
    js("select"),
    js("table"),
    js("labs"),
    js("colors"),
];
