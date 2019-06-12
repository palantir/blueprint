/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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

// @ts-check
const { generateIsomorphicTests } = require("@blueprintjs/test-commons");
const React = require("react");
const Core = require("../lib/cjs");

const requiredChild = React.createElement("button");
const hotkeyProps = { combo: "mod+s", global: true, label: "save" };

describe("Core isomorphic rendering", () => {
    generateIsomorphicTests(Core, {
        Alert: {
            props: { isOpen: true, usePortal: false },
        },
        Breadcrumbs: {
            props: { items: [] },
        },
        Dialog: {
            props: { isOpen: true, usePortal: false },
        },
        Drawer: {
            props: { isOpen: true, usePortal: false },
        },
        Hotkey: {
            props: hotkeyProps,
        },
        Hotkeys: {
            children: React.createElement(Core.Hotkey, hotkeyProps),
        },
        Icon: {
            props: { icon: "build" },
        },
        KeyCombo: {
            props: { combo: "?" },
        },
        OverflowList: {
            props: { items: [], overflowRenderer: () => null, visibleItemRenderer: () => null },
        },
        Overlay: {
            props: { lazy: false, usePortal: false },
        },
        PanelStack: {
            props: {
                initialPanel: { component: () => null, props: {}, title: "" }
            },
            children: ""
        },
        Portal: {
            className: false, // only renders in browser (`document`)
        },
        Popover: {
            children: requiredChild,
        },
        ResizeSensor: {
            children: requiredChild,
            className: false,
        },
        Tabs: {
            children: React.createElement(Core.Tab, { key: 1, id: 1, title: "Tab one" }),
        },
        TagInput: {
            props: { values: ["foo", "bar", "baz"] },
        },
        Tooltip: {
            props: { content: React.createElement("h1", {}, "content") },
            children: requiredChild
        },
        Toaster: {
            props: { usePortal: false },
            children: React.createElement(Core.Toast, { message: "Toast" })
        },
    });
});
