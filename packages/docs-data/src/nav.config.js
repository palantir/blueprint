/*
 * Copyright 2025 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Navigation configuration for Blueprint documentation site.
 * This replaces _nav.md and all @page annotations previously parsed by Documentalist.
 *
 * @type {import("@blueprintjs/docs-theme").NavItemConfig[]}
 */
const navigationConfig = [
    {
        route: "blueprint",
        title: "Blueprint",
        children: [
            { route: "blueprint/getting-started", title: "Getting Started" },
            { route: "blueprint/reading-the-docs", title: "Reading the Docs" },
            { route: "blueprint/principles", title: "Principles" },
        ],
    },
    {
        route: "core",
        title: "Core",
        packageName: "@blueprintjs/core",
        children: [
            { route: "core/accessibility", title: "Accessibility" },
            { route: "core/classes", title: "Classes" },
            { route: "core/colors", title: "Colors" },
            { route: "core/typography", title: "Typography" },
            { route: "core/variables", title: "Variables" },
            {
                route: "core/components",
                title: "Components",
                children: [
                    { route: "core/breadcrumbs", title: "Breadcrumbs" },
                    { route: "core/buttons", title: "Button" },
                    { route: "core/button-group", title: "Button group" },
                    { route: "core/callout", title: "Callout" },
                    { route: "core/card", title: "Card" },
                    { route: "core/card-list", title: "Card list" },
                    { route: "core/control-card", title: "Control card" },
                    { route: "core/collapse", title: "Collapse" },
                    { route: "core/divider", title: "Divider" },
                    { route: "core/editable-text", title: "Editable text" },
                    { route: "core/entity-title", title: "Entity title" },
                    { route: "core/html", title: "HTML elements" },
                    { route: "core/html-table", title: "HTML table" },
                    { route: "core/hotkeys-target", title: "Hotkeys target" },
                    { route: "core/icon", title: "Icon" },
                    { route: "core/link", title: "Link" },
                    { route: "core/menu", title: "Menu" },
                    { route: "core/navbar", title: "Navbar" },
                    { route: "core/non-ideal-state", title: "Non-ideal state" },
                    { route: "core/overflow-list", title: "Overflow list" },
                    { route: "core/panel-stack", title: "Panel stack" },
                    { route: "core/progress-bar", title: "Progress bar" },
                    { route: "core/resize-sensor", title: "Resize sensor" },
                    { route: "core/section", title: "Section" },
                    { route: "core/skeleton", title: "Skeleton" },
                    { route: "core/spinner", title: "Spinner" },
                    { route: "core/tabs", title: "Tabs" },
                    { route: "core/tag", title: "Tag" },
                    { route: "core/compound-tag", title: "Compound tag" },
                    { route: "core/text", title: "Text" },
                    { route: "core/tree", title: "Tree" },
                    // Form controls
                    { route: "core/form-group", title: "Form group" },
                    { route: "core/control-group", title: "Control group" },
                    { route: "core/label", title: "Label" },
                    { route: "core/checkbox", title: "Checkbox" },
                    { route: "core/radio", title: "Radio" },
                    { route: "core/html-select", title: "HTML select" },
                    { route: "core/segmented-control", title: "Segmented control" },
                    { route: "core/sliders", title: "Sliders" },
                    { route: "core/switch", title: "Switch" },
                    // Form inputs
                    { route: "core/input-group", title: "Input group" },
                    { route: "core/text-area", title: "Text area" },
                    { route: "core/file-input", title: "File input" },
                    { route: "core/numeric-input", title: "Numeric input" },
                    { route: "core/tag-input", title: "Tag input" },
                    // Overlays
                    { route: "core/overlay", title: "Overlay" },
                    { route: "core/overlay2", title: "Overlay2" },
                    { route: "core/portal", title: "Portal" },
                    { route: "core/alert", title: "Alert" },
                    { route: "core/context-menu", title: "Context menu" },
                    { route: "core/context-menu-popover", title: "Context menu popover" },
                    { route: "core/dialog", title: "Dialog" },
                    { route: "core/drawer", title: "Drawer" },
                    { route: "core/popover", title: "Popover" },
                    { route: "core/toast", title: "Toast" },
                    { route: "core/tooltip", title: "Tooltip" },
                ],
            },
            {
                route: "core/context",
                title: "Context",
                children: [
                    { route: "core/blueprint-provider", title: "Blueprint provider" },
                    { route: "core/hotkeys-provider", title: "Hotkeys provider" },
                    { route: "core/overlays-provider", title: "Overlays provider" },
                    { route: "core/portal-provider", title: "Portal provider" },
                ],
            },
            {
                route: "core/hooks",
                title: "Hooks",
                children: [
                    { route: "core/use-hotkeys", title: "useHotkeys" },
                    { route: "core/use-overlay-stack", title: "useOverlayStack" },
                ],
            },
        ],
    },
    {
        route: "datetime",
        title: "Datetime",
        packageName: "@blueprintjs/datetime",
        children: [
            { route: "datetime/date-picker", title: "Date picker" },
            { route: "datetime/date-input", title: "Date input" },
            { route: "datetime/date-range-picker", title: "Date range picker" },
            { route: "datetime/date-range-input", title: "Date range input" },
            { route: "datetime/timepicker", title: "Time picker" },
            { route: "datetime/timezone-select", title: "Timezone select" },
        ],
    },
    {
        route: "icons",
        title: "Icons",
        packageName: "@blueprintjs/icons",
        children: [
            { route: "icons/loading-icons", title: "Loading icons" },
            { route: "icons/icons-list", title: "Icons list" },
        ],
    },
    {
        route: "select",
        title: "Select",
        packageName: "@blueprintjs/select",
        children: [
            { route: "select/select-component", title: "Select" },
            { route: "select/suggest", title: "Suggest" },
            { route: "select/multi-select", title: "Multi-select" },
            { route: "select/omnibar", title: "Omnibar" },
            { route: "select/query-list", title: "Query list" },
        ],
    },
    {
        route: "table",
        title: "Table",
        packageName: "@blueprintjs/table",
        children: [
            { route: "table/features", title: "Features" },
            { route: "table/api", title: "API" },
        ],
    },
    {
        route: "labs",
        title: "Labs",
        packageName: "@blueprintjs/labs",
        children: [
            { route: "labs/box", title: "Box" },
            { route: "labs/flex", title: "Flex" },
        ],
    },
];

module.exports = { navigationConfig };
