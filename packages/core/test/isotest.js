/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

const { generateIsomorphicTests } = require("@blueprintjs/node-build-scripts");
const React = require("react");
const Core = require("../dist");

const tooltipContent = { content: React.createElement("h1", {}, "content") };
const customProps = {
    Hotkey: { combo: "mod+s", global: true, label: "save" },
    KeyCombo: { combo: "?" },
    SVGTooltip: tooltipContent,
    Tooltip: tooltipContent,
};

const popoverTarget = React.createElement("button");
const customChildren = {
    Hotkeys: React.createElement(Core.Hotkey, customProps.Hotkey),
    Popover: popoverTarget,
    SVGPopover: popoverTarget,
    SVGTooltip: popoverTarget,
    Tabs2: [Core.Tab2Factory({ key: 1, id: 1, title: "Tab one" })],
    Tooltip: popoverTarget,
};

describe("Core isomorphic rendering", () => {
    generateIsomorphicTests(Core, customProps, customChildren);
});
