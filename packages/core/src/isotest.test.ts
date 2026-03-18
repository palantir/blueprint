/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
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

import { createElement } from "react";
import { describe } from "vitest";

import { generateIsomorphicTestsVitest, type IsomorphicTestConfig } from "@blueprintjs/test-commons";

import * as Core from "./index";

const requiredChild = createElement("button");
const EXAMPLE_HOTKEY_CONFIG = { combo: "mod+s", global: true, label: "save" };

const config: Record<string, IsomorphicTestConfig> = {
    Alert: {
        props: { isOpen: true, lazy: false, usePortal: false },
    },
    BlueprintProvider: {
        className: false,
    },
    Breadcrumbs: {
        props: { items: [] },
    },
    ContextMenu: {
        props: { children: createElement("div"), content: createElement("div") },
    },
    Dialog: {
        props: { isOpen: true, lazy: false, usePortal: false },
    },
    Drawer: {
        props: { isOpen: true, lazy: false, usePortal: false },
    },
    Hotkey: {
        props: EXAMPLE_HOTKEY_CONFIG,
    },
    Hotkeys: {
        children: createElement(Core.Hotkey, EXAMPLE_HOTKEY_CONFIG),
    },
    HotkeysDialog: {
        props: {
            hotkeys: [EXAMPLE_HOTKEY_CONFIG],
            isOpen: true,
            lazy: false,
            usePortal: false,
        },
    },
    HotkeysProvider: {
        className: false,
    },
    HotkeysTarget: {
        children: requiredChild,
        className: false,
        props: {
            hotkeys: [EXAMPLE_HOTKEY_CONFIG],
        },
    },
    HotkeysTarget2: {
        skip: true,
    },
    Icon: {
        props: { icon: "build" },
    },
    KeyComboTag: {
        props: { combo: "?" },
    },
    MultiSliderHandle: {
        skip: true,
    },
    MultistepDialog: {
        children: createElement(Core.DialogStep, {
            id: 1,
            key: 1,
            panel: createElement("div"),
            title: "Step one",
        }),
        props: { isOpen: true, lazy: false, usePortal: false },
    },
    OverflowList: {
        props: { items: [], overflowRenderer: () => null, visibleItemRenderer: () => null },
    },
    Overlay: {
        props: { lazy: false, usePortal: false },
    },
    Overlay2: {
        props: { lazy: false, usePortal: false },
    },
    OverlayToaster: {
        children: createElement(Core.Toast, { message: "Toast" }),
        props: { usePortal: false },
    },
    OverlaysProvider: {
        className: false,
    },
    PanelStack: {
        children: "",
        props: {
            initialPanel: { props: {}, renderPanel: () => null, title: "" },
        },
    },
    PanelStack2: {
        skip: true,
    },
    Popover: {
        children: requiredChild,
    },
    Portal: {
        className: false,
    },
    PortalProvider: {
        className: false,
    },
    ResizeSensor: {
        children: requiredChild,
        className: false,
    },
    TabPanel: {
        skip: true,
    },
    Tabs: {
        children: createElement(Core.Tab, { id: 1, key: 1, title: "Tab one" }),
    },
    TabsExpander: {
        className: false,
    },
    TagInput: {
        props: { values: ["foo", "bar", "baz"] },
    },
    Tooltip: {
        children: requiredChild,
        props: { content: createElement("h1", {}, "content") },
    },
};

describe("@blueprintjs/core isomorphic rendering", () => {
    generateIsomorphicTestsVitest(Core, config, {
        excludedSymbols: ["AbstractComponent", "AbstractPureComponent"],
    });
});
