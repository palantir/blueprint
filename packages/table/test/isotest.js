/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

const React = require("react");

const generateIsomorphicTests = require("../../../test/isotest");
const Table = require("../dist");

const draggableElement = React.createElement("button");
const customChildren = {
    DragSelectable: draggableElement,
    Draggable: draggableElement,
};

const customProps = {
    ResizeHandle: {
        // needs at least one handler or it returns undefined
        onDoubleClick: () => undefined,
    },
};

describe("Table isomorphic rendering", () => {
    generateIsomorphicTests(
        Table,
        customProps,
        customChildren
    );
});
