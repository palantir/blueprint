/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

const { generateIsomorphicTests } = require("@blueprintjs/test-commons");
const React = require("react");
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

const classNameChildList = [
    "CopyCellsMenuItem"
]

const skipList = [
    "DragSelectable",
    "Draggable",
    "ResizeHandle",
]


describe("Table isomorphic rendering", () => {
    generateIsomorphicTests(
        Table,
        customProps,
        customChildren,
        skipList,
        classNameChildList
    );
});
