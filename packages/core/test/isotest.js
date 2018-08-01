/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

// @ts-check
const { generateIsomorphicTests } = require("@blueprintjs/test-commons");
const React = require("react");
const Core = require("../lib/cjs");

const tooltipContent = { content: React.createElement("h1", {}, "content") };
const customProps = {
    Hotkey: { combo: "mod+s", global: true, label: "save" },
    Icon: { iconName: "build" },
    KeyCombo: { combo: "?" },
    OverflowList: { items: [], overflowRenderer: () => null, visibleItemRenderer: () => null },
    Overlay: { lazy: false, usePortal: false },
    PanelStack: { initialPanel: { component: () => null, props: {}, title: "" } },
    TagInput: { values: ["foo", "bar", "baz"] },
    Tooltip: tooltipContent,
    Toaster: { usePortal: false },
};

const requiredChild = React.createElement("button");
const customChildren = {
    Hotkeys: React.createElement(Core.Hotkey, customProps.Hotkey),
    Popover: requiredChild,
    ResizeSensor: requiredChild,
    Tabs: React.createElement(Core.Tab, { key: 1, id: 1, title: "Tab one" }),
    Tooltip: requiredChild,
    Toaster: React.createElement(Core.Toast, { message: "Toast" }),
};

describe("Core isomorphic rendering", () => {
    generateIsomorphicTests(Core, customProps, customChildren);
});
