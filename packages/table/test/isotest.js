/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

// @ts-check
const { generateIsomorphicTests } = require("@blueprintjs/test-commons/isomorphic");
const React = require("react");
const Table = require("../lib/cjs");

const customProps = {
    ResizeHandle: {
        // needs at least one handler or it returns undefined
        onDoubleClick: () => undefined,
    },
};

const skipList = [
    // Pass-through renders
    "DragSelectable",
    "Draggable",
]


describe("Table isomorphic rendering", () => {
    generateIsomorphicTests(
        Table,
        customProps,
        {},
        skipList
    );
});
