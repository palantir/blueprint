/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

const React = require("react");

const generateIsomorphicTests = require("../../../test/isotest");
const Table = require("../dist");

const draggableElement = React.createElement("button");
const customChildren = {
    DragSelectable: draggableElement,
    Draggable: draggableElement,
};

describe("Table isomorphic rendering", () => {
    generateIsomorphicTests(
        Table,
        {},
        customChildren,
        ["ResizeHandle"]
    );
});
