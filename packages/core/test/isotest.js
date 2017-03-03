/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

const React = require("react");

const generateIsomorphicTests = require("../../../test/isotest");
const Core = require("../dist");

const customProps = {
    Hotkey: { combo: "mod+s", global: true, label: "save" },
    KeyCombo: { combo: "?" },
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
