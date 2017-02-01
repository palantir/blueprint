/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

const React = require("react");

const isotest = require("../../../test/isotest");
const Core = require("../dist");

describe("Core isomorphic rendering", () => {
    isotest(
        Core,
        {
            Hotkey: { global: true },
            KeyCombo: { combo: "?" },
        },
        {
            Popover: React.createElement("div"),
        }
    );
});
